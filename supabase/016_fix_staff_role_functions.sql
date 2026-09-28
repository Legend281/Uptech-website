-- Uptech Consulting admin dashboard — fix a real bug: current_staff_role()
-- and current_staff_department() (006_testimonial_publishing.sql) read from
-- public.staff_profiles (005_settings_and_staff.sql), a table NO application
-- code has ever written to. The real, actually-used staff table is
-- public.profiles (003_staff_auth.sql) — everything else in this project
-- (Leads, Job Postings, Service Pages, Additional Services, Staff
-- management itself) reads roles from there.
--
-- Net effect before this fix: Testimonials' insert/update/delete policies
-- silently reject every real staff account, because current_staff_role()
-- always returns null (staff_profiles is permanently empty). It only
-- appeared to work for whoever's account happened to predate this and got
-- a one-off manual staff_profiles row. Any staff member invited through the
-- real invite flow (app/api/admin/staff/route.ts, writes to profiles only)
-- is silently blocked from creating or publishing a testimonial, regardless
-- of role.
--
-- The fix is the functions, not the five policies built on top of them:
-- every policy in 006_testimonial_publishing.sql calls is_staff_admin() /
-- is_staff_editor_of(), which call these two — so redefining just these two
-- fixes Testimonials (and the storage policies for testimonial-photos)
-- everywhere at once, with no other file touched.
--
-- Also checks `active`, matching lib/supabase/admin.ts's requireStaff() —
-- a deactivated account shouldn't keep publish/editor rights just because
-- nothing else in this table's chain happened to check that yet.

create or replace function public.current_staff_role()
returns text as $$
  select role from public.profiles where id = auth.uid() and active;
$$ language sql stable security definer set search_path = public;

create or replace function public.current_staff_department()
returns text as $$
  select department from public.profiles where id = auth.uid() and active;
$$ language sql stable security definer set search_path = public;

-- staff_profiles, app_settings, and notification_prefs are now fully dead:
-- no application code reads or writes any of the three (grep the repo —
-- there are zero hits for "staff_profiles" outside this migration file).
-- Settings (Assignment/Company) and notification preferences are still
-- localStorage-only on the client; nothing in this project has ever
-- persisted a row to app_settings or notification_prefs. Dropping all
-- three removes the second, unused "who is staff" table that caused this
-- bug, so it can't happen again the same way.
--
-- Safe to run even if you'd rather keep them: comment out this block and
-- the two function redefinitions above still fix Testimonials on their own.
drop table if exists public.notification_prefs;
drop table if exists public.app_settings;
drop trigger if exists staff_profiles_guard on public.staff_profiles;
drop trigger if exists staff_profiles_no_delete on public.staff_profiles;
drop table if exists public.staff_profiles;
drop function if exists public.guard_staff_profile_change();
drop function if exists public.prevent_staff_profile_delete();
