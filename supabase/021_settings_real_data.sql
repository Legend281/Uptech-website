-- Uptech Consulting admin dashboard — make Settings real. Run once, after
-- 016_fix_staff_role_functions.sql.
--
-- Assignment Settings (round-robin lead routing pools) and Company/Contact
-- details were both still browser-only (components/admin/providers/
-- SettingsProvider.tsx's localStorage), even though Assignment Settings is
-- read by real, live code (LeadsProvider's autoAssigneeFor) — meaning two
-- different staff members' browsers could each hold a different idea of who's
-- in the rotation, with no warning that anything was wrong. This recreates
-- app_settings and notification_prefs (both dropped in 016 as fully dead)
-- properly this time: current_staff_role() from the start, not the
-- staff_profiles table that caused that whole earlier mess.
--
-- One row per section in app_settings ('assignment', 'company') — the same
-- shape the original 005_settings_and_staff.sql used, minus 'review_cycles',
-- which now lives directly on each service_pages row instead.

create table if not exists public.app_settings (
  key text primary key check (key in ('assignment', 'company')),
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;
grant select, insert, update on public.app_settings to authenticated;

-- Every active staff member reads both sections (Assignment Settings shows
-- who's in each department's pool; Company details will feed the public
-- site once something reads them) — only an Administrator changes either.
drop policy if exists "Staff read settings" on public.app_settings;
create policy "Staff read settings"
  on public.app_settings
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Administrators change settings" on public.app_settings;
create policy "Administrators change settings"
  on public.app_settings
  for all
  to authenticated
  using (public.current_staff_role() = 'administrator')
  with check (public.current_staff_role() = 'administrator');

-- Notification preferences: each person's own row, nobody else's — not even
-- an Administrator reads or changes another staff member's choices here.

create table if not exists public.notification_prefs (
  staff_id uuid primary key references public.profiles(id) on delete cascade,
  prefs jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.notification_prefs enable row level security;
revoke all on public.notification_prefs from anon, authenticated;
grant select, insert, update on public.notification_prefs to authenticated;

drop policy if exists "Own notification preferences" on public.notification_prefs;
create policy "Own notification preferences"
  on public.notification_prefs
  for all
  to authenticated
  using (staff_id = auth.uid())
  with check (staff_id = auth.uid());
