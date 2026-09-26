-- Uptech Consulting admin dashboard — real, shared Activity Log.
-- Run this once in the Supabase SQL editor, after 003_staff_auth.sql.
--
-- Before this, ActivityProvider was localStorage-only, seeded with
-- fictional historical entries from staff who no longer have real accounts
-- (Divine Tabe, Aline Ngu, etc.) — every real action got mixed in with that
-- fake history, and none of it was shared across staff or devices.
-- Admin_Dashboard_Requirements.md Section 9 calls this audit trail "a
-- genuine requirement, not a nice-to-have."
--
-- Grants included in this same migration (see 004/005's own history for
-- why that matters — RLS policies alone don't grant table-level access).

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  description text not null,
  related_href text,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

-- The whole point of an audit trail is that every staff member sees the
-- same shared history, not just their own actions.
drop policy if exists "Staff can read all activity" on public.activity_log;
create policy "Staff can read all activity"
  on public.activity_log
  for select
  to authenticated
  using (true);

drop policy if exists "Staff can log activity" on public.activity_log;
create policy "Staff can log activity"
  on public.activity_log
  for insert
  to authenticated
  with check (true);

-- Delete (individual entries or a full clear) is Administrator-only — an
-- audit trail anyone can erase isn't a reliable accountability record.
drop policy if exists "Administrators can delete activity" on public.activity_log;
create policy "Administrators can delete activity"
  on public.activity_log
  for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'administrator'));

grant select, insert, delete on public.activity_log to authenticated;
