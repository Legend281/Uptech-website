-- Uptech Consulting admin dashboard — Staff Auth & Leads read access.
-- Run this once in the Supabase SQL editor, after 001 and 002.
--
-- Per Admin_Dashboard_Requirements.md Section 2 & Section 13: "Authentication,
-- roles, and department scoping ... nothing else is safe to build without
-- this." Before this migration, the leads table had zero SELECT policy for
-- anyone — real leads and applications were being saved, but nothing could
-- ever read them back. This adds real staff accounts (via Supabase Auth +
-- a profiles table) and the RLS policies that let a logged-in staff member
-- read/update leads within their actual permission scope.

-- lib/admin/types.ts's Lead.wasManuallyTriaged was added to the TS type
-- after 001_leads_table.sql shipped and never got a matching column —
-- LeadsProvider now reads/writes it for real, so it needs to actually exist.
alter table public.leads add column if not exists was_manually_triaged boolean not null default false;

-- One row per staff member, keyed to their real Supabase Auth account.
-- Mirrors lib/admin/types.ts's AdminUser type exactly.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('administrator', 'editor', 'viewer')),
  department text not null check (department in ('career-services-operations', 'business-formalisation-compliance')),
  avatar_initials text not null,
  location text not null,
  -- Postgres text[], e.g. '{English,French}' — Admin_Dashboard_Requirements.md
  -- Section 3.11's language-mismatch warning needs to read this for every
  -- staff member, not just the signed-in one.
  languages text[] not null default '{English}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Every staff member can see every other staff member's name/role/department/
-- languages — needed for assignee pickers, "who's covering this lead," and
-- the language-mismatch check. None of this is sensitive (no email/password
-- lives here; that's auth.users, which this table never exposes).
drop policy if exists "Staff can read all profiles" on public.profiles;
create policy "Staff can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- No INSERT/UPDATE/DELETE policy for `authenticated` on purpose: a new
-- staff account is provisioned by an Administrator directly in the
-- Supabase dashboard (Authentication -> Add user, then insert a matching
-- profiles row via the SQL editor) until a real "manage users" screen
-- exists (Section 3.1, Administrator-only, not yet built). The service
-- role can always write here regardless of RLS.

-- --- Leads: give staff an actual way to read back what's already being saved ---

-- Administrators see every lead. Editors/Viewers see leads in their own
-- department, PLUS every needs-triage lead (department is null) regardless
-- of their own department — an ambiguous inquiry must stay visible to
-- whoever notices it first, not hidden from everyone except the one team
-- it might eventually belong to (Section 3.11's whole point of needs-triage).
drop policy if exists "Staff can read leads in scope" on public.leads;
create policy "Staff can read leads in scope"
  on public.leads
  for select
  to authenticated
  using (
    leads.department is null
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and (p.role = 'administrator' or p.department = leads.department)
    )
  );

-- Only Administrators and Editors can change a lead (claim, status, reassign,
-- edit, resolve triage) — Viewers are read-only per Section 2. The same
-- department scoping applies to the row both before AND after the change,
-- so an Editor resolving a needs-triage lead can only route it into their
-- own department, never the other team's.
drop policy if exists "Staff can update leads in scope" on public.leads;
create policy "Staff can update leads in scope"
  on public.leads
  for update
  to authenticated
  using (
    leads.department is null
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('administrator', 'editor')
      and (p.role = 'administrator' or p.department = leads.department)
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('administrator', 'editor')
      and (p.role = 'administrator' or p.department = leads.department)
    )
  );

-- Deleting a lead is Administrator-only — not explicitly scoped by
-- Section 2's table, but "delete" is the one lead action with no undo,
-- so it gets the same trust level as user management and site-wide settings.
drop policy if exists "Administrators can delete leads" on public.leads;
create policy "Administrators can delete leads"
  on public.leads
  for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'administrator'));

-- Manual "Log a New Lead" entry (Admin_Dashboard_Requirements.md Section
-- 3.11: "a first-class, priority-one feature") needs staff to be able to
-- INSERT too, not just the public anon key via /api/leads and /api/apply.
drop policy if exists "Staff can log leads manually" on public.leads;
create policy "Staff can log leads manually"
  on public.leads
  for insert
  to authenticated
  with check (true);

-- --- Resumes: let staff read what they're already allowed to read as a Lead ---

-- Every resume belongs to a career-marketing Lead, which every authenticated
-- staff member can already see per the read policy above (either it's in
-- their own department, or it's still needs-triage) — so a flat
-- authenticated-read policy on the bucket doesn't grant anything beyond what
-- the leads table itself already exposes. This replaces the
-- service-role-signed-URL workaround from 002 for anyone actually logged
-- into the dashboard; that workaround still matters for the Resend
-- notification email, which fires before any staff session exists.
drop policy if exists "Staff can read resumes" on storage.objects;
create policy "Staff can read resumes"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'resumes');
