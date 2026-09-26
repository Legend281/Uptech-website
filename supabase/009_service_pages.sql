-- Uptech Consulting admin dashboard — real, shared Service Pages / Compliance
-- Review tracking. Run this once in the Supabase SQL editor, after 003_staff_auth.sql.
--
-- Before this, ServicePagesProvider was localStorage-only, seeded from
-- lib/admin/mockData.ts's mockServicePages array — a Resolve/Escalate action
-- only ever wrote to one browser's storage, never to a shared record any
-- other staff member (or the same staff member on another device) could see.
--
-- This also carries the corrected reviewedBy seed value: the old mock data
-- used "Uptech Consulting Legal & Corporate Administration Desk," a
-- placeholder that components/ComplianceDisclaimer.tsx's own long-standing
-- FLAG FOR TEAM comment said was never confirmed as a real department name.
-- Admin_Dashboard_Requirements.md Section 5 gives the confirmed answer:
-- "Uptech Consulting Management." Seeded correctly here.
--
-- Grants included in this same migration (see 004/005's own history for why
-- that matters — RLS policies alone don't grant table-level access).

create table if not exists public.service_pages (
  id text primary key,
  title text not null,
  template text not null check (template in ('A', 'B', 'C')),
  url text not null,
  department text not null check (department in ('career-services-operations', 'business-formalisation-compliance')),
  last_reviewed_at timestamptz not null,
  review_cadence_days integer not null,
  reviewed_by text not null,
  -- Who currently owns getting an escalated review resolved. Null means "not
  -- escalated" — a completed review always clears this back to null, same as
  -- the localStorage version's behavior.
  assigned_to_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.service_pages enable row level security;

-- Flat read for every staff member, not department-scoped — matching
-- activity_log's precedent rather than leads' department split. The
-- dashboard's "My Department" / "All Departments" toggle is a client-side
-- filter (app/admin/page.tsx's scopePages) that needs the full set available
-- to work for anyone who switches to "All," not just administrators.
drop policy if exists "Staff can read all service pages" on public.service_pages;
create policy "Staff can read all service pages"
  on public.service_pages
  for select
  to authenticated
  using (true);

-- Resolve/escalate is Administrator or Editor, matching the Leads update
-- policy's role split — Viewers stay read-only. An Editor can only act on
-- pages in their own department; an Administrator can act on any.
drop policy if exists "Staff can update service pages in scope" on public.service_pages;
create policy "Staff can update service pages in scope"
  on public.service_pages
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('administrator', 'editor')
      and (p.role = 'administrator' or p.department = service_pages.department)
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('administrator', 'editor')
      and (p.role = 'administrator' or p.department = service_pages.department)
    )
  );

-- New pages get added to this register as new Template C pages ship — an
-- Administrator-only action, same trust level as Staff management, since
-- this changes what the register tracks rather than just its state.
drop policy if exists "Administrators can add service pages" on public.service_pages;
create policy "Administrators can add service pages"
  on public.service_pages
  for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'administrator'));

grant select, insert, update on public.service_pages to authenticated;

-- Seed the 4 real Template C pages (matches components/Header.tsx's actual
-- URLs). Dates are relative to now(), not fixed calendar strings, so the
-- staleness demo (on-track / due-soon / overdue) stays meaningful whenever
-- this migration is actually run — same intent as mockData.ts's old
-- daysAgo() helper. on conflict do nothing so re-running this migration
-- never clobbers real Resolve/Escalate activity that happened since.
insert into public.service_pages (id, title, template, url, department, last_reviewed_at, review_cadence_days, reviewed_by)
values
  ('business-formalisation-cameroon', 'Business Formalisation — Cameroon', 'C', '/services/business-formalisation-compliance/cameroon', 'business-formalisation-compliance', now() - interval '2 days', 180, 'Uptech Consulting Management'),
  ('business-formalisation-us', 'Business Formalisation — United States', 'C', '/services/business-formalisation-compliance/united-states', 'business-formalisation-compliance', now() - interval '2 days', 180, 'Uptech Consulting Management'),
  ('tax-compliance-cameroon', 'Tax Compliance — Cameroon', 'C', '/services/business-formalisation-compliance/tax-compliance-businesses-cameroon', 'business-formalisation-compliance', now() - interval '210 days', 180, 'Uptech Consulting Management'),
  ('cnps-compliance-cameroon', 'CNPS Compliance — Cameroon', 'C', '/services/business-formalisation-compliance/cnps-compliance-cameroon', 'business-formalisation-compliance', now() - interval '165 days', 180, 'Uptech Consulting Management')
on conflict (id) do nothing;
