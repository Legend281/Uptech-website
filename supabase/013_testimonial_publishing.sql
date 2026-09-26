-- Uptech Consulting admin dashboard — let signed-in staff publish testimonials.
-- Run once in the Supabase SQL editor AFTER 002_testimonials.sql and
-- 012_profiles_active_and_update.sql. Safe to re-run.
--
-- Scope: testimonials only (the admin module that publishes to the live
-- Homepage and Career Marketing page). Staff sign-in is 003_staff_auth.sql;
-- this file only decides what a signed-in person may do with testimonials,
-- using the staff roles in public.profiles (003, "active" from 012).
--
-- It also adds table GRANTs: newer Supabase projects don't grant table
-- access to the API roles automatically, so without them every request is
-- refused with "permission denied", whatever the policies say.

-- 1. Grants -----------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

-- The service role (server only: the page-refresh route and setup scripts).
grant all on public.testimonials, public.testimonial_placements to service_role;

-- Signed-in staff; row-level security below decides which rows.
grant select, insert, update, delete on public.testimonials, public.testimonial_placements to authenticated;

-- The public pages' read path (published, consented testimonials; public columns only).
grant select on public.published_testimonials to anon, authenticated;

-- 2. Helpers -----------------------------------------------------------------------
-- The signed-in person's role and department from public.profiles, active
-- accounts only. Named for testimonials so they can't collide with other
-- modules' helpers.

create or replace function public.testimonial_staff_role()
returns text as $
  select role from public.profiles where id = auth.uid() and active;
$ language sql stable security definer set search_path = public;

create or replace function public.testimonial_staff_department()
returns text as $
  select department from public.profiles where id = auth.uid() and active;
$ language sql stable security definer set search_path = public;

create or replace function public.is_staff_admin()
returns boolean as $
  select coalesce(public.testimonial_staff_role() = 'administrator', false);
$ language sql stable security definer set search_path = public;

create or replace function public.is_staff_editor_of(dept text)
returns boolean as $
  select coalesce(public.testimonial_staff_role() = 'editor' and public.testimonial_staff_department() = dept, false);
$ language sql stable security definer set search_path = public;

grant execute on function public.testimonial_staff_role() to authenticated;
grant execute on function public.testimonial_staff_department() to authenticated;
grant execute on function public.is_staff_admin() to authenticated;
grant execute on function public.is_staff_editor_of(text) to authenticated;

-- 3. Audit fields the browser can't fake --------------------------------------------
-- Who created a testimonial and who recorded consent are stamped from the
-- signed-in session, overriding whatever the browser sent. Service-role
-- scripts (no session) keep the values they pass.

create or replace function public.stamp_testimonial_audit()
returns trigger as $$
begin
  if auth.uid() is null then return new; end if;
  if tg_op = 'INSERT' then
    new.created_by = auth.uid()::text;
  else
    new.created_by = old.created_by;
  end if;
  if tg_op = 'INSERT' or new.consent_given is distinct from old.consent_given
     or new.consent_date is distinct from old.consent_date
     or new.consent_channel is distinct from old.consent_channel then
    new.consent_recorded_by = case when new.consent_given then auth.uid()::text else null end;
  else
    new.consent_recorded_by = old.consent_recorded_by;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists testimonials_stamp_audit on public.testimonials;
create trigger testimonials_stamp_audit before insert or update on public.testimonials
  for each row execute function public.stamp_testimonial_audit();

-- 4. Policies ------------------------------------------------------------------------
-- Administrators: everything. Editors: their own department's testimonials,
-- never one that sits on the Homepage (spec 1.2). Viewers: read their own
-- department. Anyone signed in without an active staff profile: nothing.

alter table public.testimonials enable row level security;

drop policy if exists "Staff read testimonials" on public.testimonials;
create policy "Staff read testimonials" on public.testimonials for select to authenticated
  using (public.is_staff_admin() or department = public.testimonial_staff_department());

drop policy if exists "Staff add testimonials" on public.testimonials;
create policy "Staff add testimonials" on public.testimonials for insert to authenticated
  with check (public.is_staff_admin() or public.is_staff_editor_of(department));

drop policy if exists "Staff change testimonials" on public.testimonials;
create policy "Staff change testimonials" on public.testimonials for update to authenticated
  using (
    public.is_staff_admin()
    or (public.is_staff_editor_of(department)
        and not exists (select 1 from public.testimonial_placements p where p.testimonial_id = testimonials.id and p.page = 'homepage'))
  )
  with check (public.is_staff_admin() or public.is_staff_editor_of(department));

drop policy if exists "Staff delete testimonials" on public.testimonials;
create policy "Staff delete testimonials" on public.testimonials for delete to authenticated
  using (
    status <> 'published'
    and (public.is_staff_admin()
         or (public.is_staff_editor_of(department)
             and not exists (select 1 from public.testimonial_placements p where p.testimonial_id = testimonials.id and p.page = 'homepage')))
  );

alter table public.testimonial_placements enable row level security;

drop policy if exists "Staff read placements" on public.testimonial_placements;
create policy "Staff read placements" on public.testimonial_placements for select to authenticated
  using (exists (select 1 from public.testimonials t where t.id = testimonial_id));

drop policy if exists "Staff manage placements" on public.testimonial_placements;
create policy "Staff manage placements" on public.testimonial_placements for all to authenticated
  using (
    public.is_staff_admin()
    or (page <> 'homepage' and exists (select 1 from public.testimonials t where t.id = testimonial_id and public.is_staff_editor_of(t.department)))
  )
  with check (
    public.is_staff_admin()
    or (page <> 'homepage' and exists (select 1 from public.testimonials t where t.id = testimonial_id and public.is_staff_editor_of(t.department)))
  );

-- 5. Testimonial photos ----------------------------------------------------------------------
-- The bucket is public-read (002). Only Administrators and Editors may add or remove files.

drop policy if exists "Staff upload testimonial photos" on storage.objects;
create policy "Staff upload testimonial photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'testimonial-photos' and (public.is_staff_admin() or public.testimonial_staff_role() = 'editor'));

drop policy if exists "Staff remove testimonial photos" on storage.objects;
create policy "Staff remove testimonial photos" on storage.objects for delete to authenticated
  using (bucket_id = 'testimonial-photos' and (public.is_staff_admin() or public.testimonial_staff_role() = 'editor'));

-- 6. Apply the new grants to the API immediately.
notify pgrst, 'reload schema';
