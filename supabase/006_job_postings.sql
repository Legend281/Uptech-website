-- Uptech Consulting admin dashboard — Job Postings, now real.
-- Run this once in the Supabase SQL editor, after 003_staff_auth.sql.
--
-- Mirrors lib/admin/types.ts's JobPosting type. Unlike leads, this table
-- gets a real public SELECT policy for `anon` — this is what lets the
-- public Careers page (app/careers/page.tsx) read published postings
-- directly, live, instead of a hardcoded array that needed a manual
-- export-and-redeploy every time something changed.
--
-- Grants included in THIS SAME migration, not an afterthought — 004 and
-- 005 both had to be added after the fact because RLS policies alone
-- don't grant table-level access; the role still needs GRANT separately.

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  -- One of HIRING_DEPARTMENT_NAMES (lib/hiringDepartments.ts) — free text,
  -- not a foreign key, and a different axis entirely from profiles.department
  -- (the 2-value operational split used for lead routing). No RLS-style
  -- ownership split by this column: one staff group manages all postings
  -- regardless of which of the six departments is hiring.
  department text not null,
  location text not null,
  employment_type text not null,
  description text not null default '',
  requirements text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  posted_at timestamptz not null default now(),
  -- Attribution only (who created/last touched this record), not a
  -- permission scope — mirrors leads.assigned_to_id's own loose typing
  -- (no FK) rather than a hard reference.
  posted_by_id text,
  contact_email text,
  -- Manually incremented by whoever checks the recruiting inbox — a
  -- deliberately cheap stand-in for a real ATS, not the start of one.
  applications_received integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_job_postings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists job_postings_set_updated_at on public.job_postings;
create trigger job_postings_set_updated_at
  before update on public.job_postings
  for each row
  execute function public.set_job_postings_updated_at();

alter table public.job_postings enable row level security;

-- The whole point of this migration: the live public Careers page reads
-- this directly. Only ever published rows — drafts and closed postings
-- must never be visible to a visitor who isn't signed in.
drop policy if exists "Public can read published postings" on public.job_postings;
create policy "Public can read published postings"
  on public.job_postings
  for select
  to anon
  using (status = 'published');

-- Every authenticated staff member can see every posting regardless of
-- status (a draft needs to be visible to whoever is refining it before
-- publish) — no department scoping, per this table's own comment above.
drop policy if exists "Staff can read all postings" on public.job_postings;
create policy "Staff can read all postings"
  on public.job_postings
  for select
  to authenticated
  using (true);

-- Viewers are read-only per Admin_Dashboard_Requirements.md Section 2 —
-- only Administrators and Editors can create, edit, publish, or delete
-- a posting.
drop policy if exists "Editors and admins can insert postings" on public.job_postings;
create policy "Editors and admins can insert postings"
  on public.job_postings
  for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

drop policy if exists "Editors and admins can update postings" on public.job_postings;
create policy "Editors and admins can update postings"
  on public.job_postings
  for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

drop policy if exists "Editors and admins can delete postings" on public.job_postings;
create policy "Editors and admins can delete postings"
  on public.job_postings
  for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

grant select on public.job_postings to anon;
grant select, insert, update, delete on public.job_postings to authenticated;
