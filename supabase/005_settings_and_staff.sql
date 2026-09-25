-- Uptech Consulting admin dashboard — staff accounts and system settings.
-- Run once in the Supabase SQL editor. Spec: Admin_Content_Pages_Spec.md
-- Section 4 (Settings).
--
-- This is the foundation the other migrations' "add policies when staff
-- auth exists" notes are waiting on: staff_profiles ties a Supabase Auth
-- user to a role and department, and current_staff_role() /
-- current_staff_department() are what those future RLS policies call.
-- Mirrors components/admin/providers/CurrentUserProvider.tsx and
-- lib/admin/settings.ts.

-- Staff accounts (spec 4.2) ------------------------------------------------------

create table if not exists public.staff_profiles (
  -- The Supabase Auth user. An account exists here only after the person
  -- accepts their invitation.
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'viewer' check (role in ('administrator', 'editor', 'viewer')),
  department text not null check (department in ('career-services-operations', 'business-formalisation-compliance')),
  languages text[] not null default array['English'] check (array_length(languages, 1) >= 1),
  location text not null,
  -- Deactivated, never deleted: leads and the audit trail still point here.
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_staff_role()
returns text as $$
  select role from public.staff_profiles where id = auth.uid() and active;
$$ language sql stable security definer set search_path = public;

create or replace function public.current_staff_department()
returns text as $$
  select department from public.staff_profiles where id = auth.uid() and active;
$$ language sql stable security definer set search_path = public;

-- The account rules, enforced in the database as well as the UI:
--   * nobody changes their own role or deactivates themselves;
--   * there is always at least one active Administrator.
create or replace function public.guard_staff_profile_change()
returns trigger as $$
begin
  new.updated_at = now();

  if old.id = auth.uid() and (new.role <> old.role or (old.active and not new.active)) then
    raise exception 'You cannot change your own role or deactivate your own account.';
  end if;

  if old.role = 'administrator' and old.active
     and (new.role <> 'administrator' or not new.active)
     and not exists (
       select 1 from public.staff_profiles
       where id <> old.id and role = 'administrator' and active
     ) then
    raise exception 'This is the last active Administrator.';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists staff_profiles_guard on public.staff_profiles;
create trigger staff_profiles_guard
  before update on public.staff_profiles
  for each row
  execute function public.guard_staff_profile_change();

-- Accounts are deactivated, never deleted.
create or replace function public.prevent_staff_profile_delete()
returns trigger as $$
begin
  raise exception 'Deactivate staff accounts instead of deleting them.';
end;
$$ language plpgsql;

drop trigger if exists staff_profiles_no_delete on public.staff_profiles;
create trigger staff_profiles_no_delete
  before delete on public.staff_profiles
  for each row
  execute function public.prevent_staff_profile_delete();

alter table public.staff_profiles enable row level security;
revoke all on public.staff_profiles from anon;

drop policy if exists "Staff can see the staff list" on public.staff_profiles;
create policy "Staff can see the staff list"
  on public.staff_profiles for select to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Administrators manage accounts" on public.staff_profiles;
create policy "Administrators manage accounts"
  on public.staff_profiles for all to authenticated
  using (public.current_staff_role() = 'administrator')
  with check (public.current_staff_role() = 'administrator');

-- System settings (spec 4.1, 4.4, 4.5) ------------------------------------------------
-- One row per section: 'assignment', 'review_cycles', 'company'. Values are
-- validated by lib/admin/settings.ts before they're written.

create table if not exists public.app_settings (
  key text primary key check (key in ('assignment', 'review_cycles', 'company')),
  value jsonb not null,
  updated_by uuid references public.staff_profiles (id),
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon;

drop policy if exists "Staff read settings" on public.app_settings;
create policy "Staff read settings"
  on public.app_settings for select to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Administrators change settings" on public.app_settings;
create policy "Administrators change settings"
  on public.app_settings for all to authenticated
  using (public.current_staff_role() = 'administrator')
  with check (public.current_staff_role() = 'administrator');

-- Notification preferences (spec 4.3) ------------------------------------------------
-- Each person's own row; nobody else's, Administrators included.

create table if not exists public.notification_prefs (
  staff_id uuid primary key references public.staff_profiles (id) on delete cascade,
  prefs jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.notification_prefs enable row level security;
revoke all on public.notification_prefs from anon;

drop policy if exists "Own notification preferences" on public.notification_prefs;
create policy "Own notification preferences"
  on public.notification_prefs for all to authenticated
  using (staff_id = auth.uid())
  with check (staff_id = auth.uid());
