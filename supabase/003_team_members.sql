-- Uptech Consulting admin dashboard — Team Members (the public Who We Are roster).
-- Run once in the Supabase SQL editor. Independent of 001/002.
--
-- Mirrors lib/admin/types.ts's TeamMemberRecord and the rules in
-- lib/admin/team.ts. Spec: Admin_Content_Pages_Spec.md Section 2.
-- NOT the same thing as admin sign-in accounts — those are staff auth,
-- managed from Settings.

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  title text not null check (char_length(trim(title)) > 0),
  department text not null check (department in ('career-services', 'compliance', 'leadership', 'operations')),
  entity text not null check (entity in ('cameroon', 'us')),
  -- Path inside the team-photos storage bucket, never a full URL.
  photo_path text,
  bio text,
  profile_url text check (profile_url is null or profile_url like 'https://%'),
  display_order integer not null default 1,
  status text not null default 'hidden' check (status in ('visible', 'hidden')),
  -- Set once someone has appeared on the public site; see the delete guard below.
  ever_visible boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_order_idx on public.team_members (display_order, name);

-- updated_at, plus ever_visible latching on the first time a row is visible.
create or replace function public.set_team_members_bookkeeping()
returns trigger as $$
begin
  new.updated_at = now();
  if new.status = 'visible' then
    new.ever_visible = true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists team_members_bookkeeping on public.team_members;
create trigger team_members_bookkeeping
  before insert or update on public.team_members
  for each row
  execute function public.set_team_members_bookkeeping();

-- Spec 2.3: anyone who has been on the public site is hidden, never
-- deleted — case studies or other pages may reference them.
create or replace function public.prevent_public_team_member_delete()
returns trigger as $$
begin
  if old.ever_visible then
    raise exception 'Team member % has been on the public site; set status to hidden instead of deleting.', old.id;
  end if;
  return old;
end;
$$ language plpgsql;

drop trigger if exists team_members_no_delete_after_public on public.team_members;
create trigger team_members_no_delete_after_public
  before delete on public.team_members
  for each row
  execute function public.prevent_public_team_member_delete();

-- Row Level Security ----------------------------------------------------------
-- RLS on, no policies yet: denies anon and authenticated entirely until
-- staff auth exists (same reasoning as 001/002). When it lands: only
-- Administrators (or a future People/HR role) may insert/update/delete —
-- spec 2.3 treats this as personal data, not department content.
alter table public.team_members enable row level security;
revoke all on public.team_members from anon, authenticated;

-- Public read path: visible people, public columns only. Runs with its
-- owner's rights on purpose (see the note in 002_testimonials.sql).
create or replace view public.visible_team_members as
select id, name, title, bio, profile_url, photo_path, display_order
from public.team_members
where status = 'visible';

grant select on public.visible_team_members to anon, authenticated;

-- Portraits, resized client-side to 480x600 JPEG before upload. Upload
-- policies arrive with staff auth.
insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;
