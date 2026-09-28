-- Uptech Consulting admin dashboard — a deactivated account should lose
-- every permission immediately, not just the ones behind requireStaff()
-- (the API-route helper in lib/supabase/admin.ts). Before this migration,
-- none of the RLS policies below checked profiles.active at all — they
-- only checked role, via an ad hoc `exists (select 1 from public.profiles
-- p where p.id = auth.uid() and p.role in (...))` repeated slightly
-- differently in five different files. A deactivated Administrator or
-- Editor's Supabase session kept full read/write access at the database
-- level regardless, because nothing there ever looked at the flag.
--
-- The fix replaces every one of those ad hoc subqueries with
-- current_staff_role() / current_staff_department() — the two functions
-- 016_fix_staff_role_functions.sql already made active-aware for
-- Testimonials. This migration doesn't change what each role can do
-- anywhere; it just makes "signed in" also mean "currently active," and
-- collapses five slightly-different copies of the same check onto the one
-- canonical pair of functions everything else (016, 017, 018) already uses
-- — the exact kind of drift that caused the original Testimonials bug.
--
-- Run once, after 016_fix_staff_role_functions.sql.

-- --- profiles -----------------------------------------------------------------

drop policy if exists "Staff can read all profiles" on public.profiles;
create policy "Staff can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Administrators can update profiles" on public.profiles;
create policy "Administrators can update profiles"
  on public.profiles
  for update
  to authenticated
  using (public.current_staff_role() = 'administrator')
  with check (public.current_staff_role() = 'administrator');

-- --- leads ----------------------------------------------------------------------

drop policy if exists "Staff can read leads in scope" on public.leads;
create policy "Staff can read leads in scope"
  on public.leads
  for select
  to authenticated
  using (
    leads.department is null
    or public.current_staff_role() = 'administrator'
    or public.current_staff_department() = leads.department
  );

drop policy if exists "Staff can update leads in scope" on public.leads;
create policy "Staff can update leads in scope"
  on public.leads
  for update
  to authenticated
  using (
    public.current_staff_role() in ('administrator', 'editor')
    and (
      leads.department is null
      or public.current_staff_role() = 'administrator'
      or public.current_staff_department() = leads.department
    )
  )
  with check (
    public.current_staff_role() in ('administrator', 'editor')
    and (
      leads.department is null
      or public.current_staff_role() = 'administrator'
      or public.current_staff_department() = leads.department
    )
  );

drop policy if exists "Administrators can delete leads" on public.leads;
create policy "Administrators can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.current_staff_role() = 'administrator');

-- Manual "Log a New Lead" previously allowed ANY authenticated session
-- (`with check (true)`) — a Viewer could insert a lead directly even though
-- the dashboard never showed them a way to. Tightened to match the same
-- role split as read/update, now also active-aware.
drop policy if exists "Staff can log leads manually" on public.leads;
create policy "Staff can log leads manually"
  on public.leads
  for insert
  to authenticated
  with check (public.current_staff_role() in ('administrator', 'editor'));

-- --- job_postings -----------------------------------------------------------------

drop policy if exists "Editors and admins can insert postings" on public.job_postings;
create policy "Editors and admins can insert postings"
  on public.job_postings
  for insert
  to authenticated
  with check (public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Editors and admins can update postings" on public.job_postings;
create policy "Editors and admins can update postings"
  on public.job_postings
  for update
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'))
  with check (public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Editors and admins can delete postings" on public.job_postings;
create policy "Editors and admins can delete postings"
  on public.job_postings
  for delete
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'));

-- --- service_pages -----------------------------------------------------------------

drop policy if exists "Staff can read all service pages" on public.service_pages;
create policy "Staff can read all service pages"
  on public.service_pages
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Staff can update service pages in scope" on public.service_pages;
create policy "Staff can update service pages in scope"
  on public.service_pages
  for update
  to authenticated
  using (
    public.current_staff_role() in ('administrator', 'editor')
    and (public.current_staff_role() = 'administrator' or public.current_staff_department() = service_pages.department)
  )
  with check (
    public.current_staff_role() in ('administrator', 'editor')
    and (public.current_staff_role() = 'administrator' or public.current_staff_department() = service_pages.department)
  );

drop policy if exists "Administrators can add service pages" on public.service_pages;
create policy "Administrators can add service pages"
  on public.service_pages
  for insert
  to authenticated
  with check (public.current_staff_role() = 'administrator');

-- --- additional_services -----------------------------------------------------------------

drop policy if exists "Staff can read all additional services" on public.additional_services;
create policy "Staff can read all additional services"
  on public.additional_services
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Staff can write additional services" on public.additional_services;
create policy "Staff can write additional services"
  on public.additional_services
  for all
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'))
  with check (public.current_staff_role() in ('administrator', 'editor'));

-- Storage policies for service-photos previously had NO role check at all —
-- any authenticated session (any role) could upload or delete a file in the
-- bucket directly, even though the dashboard only ever offered that to an
-- Administrator or Editor.
drop policy if exists "Staff can upload service photos" on storage.objects;
create policy "Staff can upload service photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'service-photos' and public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Staff can delete service photos" on storage.objects;
create policy "Staff can delete service photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'service-photos' and public.current_staff_role() in ('administrator', 'editor'));
