-- Uptech Consulting admin dashboard — Supabase Security Advisor cleanup.
-- Run once, after 022. Fixes everything from Database -> Advisors that can
-- be fixed by SQL. Two findings can't be (see the bottom of this file and
-- the chat reply that came with this migration for what to do about those
-- by hand).

-- 1. IMPORTANT — run 006_testimonial_publishing.sql again, in full, BEFORE
-- this file. Two separate attempts at running this file have now each
-- turned up a different live policy still pointing at the old, dead
-- testimonial_staff_role()/testimonial_staff_department() functions instead
-- of the current ones (first the testimonial-photos upload/delete storage
-- policies, then testimonials' own "Staff read testimonials" policy) —
-- meaning the live database has drifted from what 006 currently declares in
-- more than just those two spots, and department-scoped testimonial reads
-- have likely been silently broken for every Editor/Viewer (only
-- Administrators, matched via is_staff_admin(), would see anything). Rather
-- than keep discovering and patching one dependency at a time, 006's own
-- header says it's "safe to re-run" — every statement in it is `drop policy
-- if exists` / `create or replace` — so re-running it in full resyncs every
-- testimonials/testimonial_placements/storage policy and function to the
-- current correct definitions in one shot. Do that first, then run this
-- file; the drops below should then succeed cleanly.
--
-- 2. Drop orphaned helper functions -------------------------------------------
-- These four are flagged as SECURITY DEFINER functions callable by anon/
-- authenticated via RPC, but none of them exist in any migration file in
-- this repo — grepping supabase/*.sql for their names returns nothing.
-- testimonial_staff_role()/testimonial_staff_department() look like an early
-- draft of what became current_staff_role()/current_staff_department()
-- (016); is_staff() and rls_auto_enable() aren't called by any policy or
-- trigger anywhere in this codebase. All were almost certainly created
-- directly in the SQL editor at some earlier point and never cleaned up.
-- Safe to drop on that basis — but if rls_auto_enable is actually wired to
-- a Database Webhook or Cron Job (configured in the Supabase dashboard,
-- outside this repo, so invisible to a grep), check Database -> Cron Jobs
-- and Database -> Webhooks before running this file. If any of these four
-- drops still fails after re-running 006, stop and paste the error back
-- rather than switching to CASCADE — that error is telling you about
-- another real, currently-live policy that needs the same careful look,
-- not something to force through blind.
drop function if exists public.testimonial_staff_role();
drop function if exists public.testimonial_staff_department();

-- is_staff() had four more orphaned, differently-named dependents that only
-- turned up once Postgres actually tried the drop — same story as the two
-- testimonial-photos policies above, just on three other tables. None of
-- these four names exist in any migration file either; each is superseded
-- by a correctly-named policy the repo already has and that already ran
-- ("Staff can read all activity"/"Staff can log activity" in
-- 008_activity_log.sql, "Staff read all team members" in
-- 017_team_members_staff_policies.sql, "Staff read faq items in scope" in
-- 018_faq_items_staff_policies.sql) — these are the dead leftover twins,
-- not the real ones, so dropping them removes nothing actually in use.
drop policy if exists "Staff read activity" on public.activity_log;
drop policy if exists "Staff add activity as themselves" on public.activity_log;
drop policy if exists "Staff read team" on public.team_members;
drop policy if exists "Staff read FAQs" on public.faq_items;

drop function if exists public.is_staff();

-- rls_auto_enable() turned out NOT to be orphaned — dropping it failed with
-- "event trigger ensure_rls depends on function rls_auto_enable()". An
-- event trigger fires automatically on DDL (e.g. CREATE TABLE) database-
-- wide, which strongly suggests this one auto-enables RLS on any new table
-- the moment it's created — a genuinely useful safety net for exactly the
-- "table shipped with RLS enabled but zero policies, or not enabled at all"
-- class of bug this project has hit more than once (003_team_members.sql,
-- 004_faq_items.sql). Keeping it, and NOT dropping the event trigger either
-- (Supabase's own SQL Editor assistant suggested `drop event trigger
-- ensure_rls; drop function rls_auto_enable();` when asked to debug this
-- exact error — don't do that, it throws away real protection for no
-- benefit). The Advisor only flagged it as directly RPC-callable by anon/
-- authenticated, which it never actually needs to be — an event trigger
-- fires as part of DDL processing regardless of grants on the function, so
-- revoking direct-call access from both roles closes that door without
-- touching how it actually works.
revoke execute on function public.rls_auto_enable() from anon, authenticated;

-- 3. Lock down search_path on every function missing it ----------------------
-- Without a fixed search_path, a function that references an unqualified
-- name can be hijacked by a caller who controls their own search_path.
-- ALTER FUNCTION only sets this one property — none of these change
-- behavior.
alter function public.set_job_postings_updated_at() set search_path = public;
alter function public.faq_category_department(category text) set search_path = public;
alter function public.stamp_testimonial_audit() set search_path = public;
alter function public.stamp_team_member_audit() set search_path = public;
alter function public.stamp_faq_audit() set search_path = public;
alter function public.set_additional_services_updated_at() set search_path = public;
alter function public.set_onboarding_submissions_updated_at() set search_path = public;
alter function public.set_leads_updated_at() set search_path = public;
alter function public.set_testimonials_updated_at() set search_path = public;
alter function public.set_team_members_bookkeeping() set search_path = public;
alter function public.prevent_public_team_member_delete() set search_path = public;
alter function public.faq_category_needs_review(category text) set search_path = public;
alter function public.enforce_faq_review_gate() set search_path = public;
alter function public.assert_testimonial_placement_rules() set search_path = public;

-- 4. Stop anon from calling internal staff-check helpers directly ------------
-- These exist only to be called *inside* RLS policies (evaluated as
-- whichever role is running the actual query) — they were never meant to be
-- a public API endpoint in their own right. `authenticated` still needs
-- EXECUTE, since real RLS policies on tables like testimonials/team_members
-- call them on every real staff request — that half of the Advisor warning
-- can't go away without moving these into a schema PostgREST doesn't expose,
-- which is a bigger change than this cleanup pass. anon never needs them at
-- all, so this closes that half with zero behavior change.
revoke execute on function public.current_staff_role() from anon;
revoke execute on function public.current_staff_department() from anon;
revoke execute on function public.is_staff_admin() from anon;
revoke execute on function public.is_staff_editor_of(text) from anon;

-- 5. Tighten the Activity Log insert policy -----------------------------------
-- "WITH CHECK (true)" let even a deactivated staff account's leftover
-- session keep writing log entries. Matches 019's "check `active`
-- everywhere" fix, extended to the one table it missed.
drop policy if exists "Staff can log activity" on public.activity_log;
create policy "Staff can log activity"
  on public.activity_log
  for insert
  to authenticated
  with check (public.current_staff_role() is not null);

-- 6. Stop the service-photos bucket from allowing full listing ---------------
-- The bucket is already public — direct-URL access to a known photo path
-- works regardless of this policy, exactly like team-photos and
-- testimonial-photos, neither of which has an equivalent policy. This one
-- was the odd one out: it let anyone enumerate every file in the bucket via
-- the storage list API, not just fetch photos already linked from a
-- published service.
drop policy if exists "Public can view service photos" on storage.objects;

-- Not fixed here, on purpose:
--
-- * auth_leaked_password_protection — a project-level Auth setting, not a
--   table/function. Turn it on in the dashboard: Authentication -> Policies
--   (or Sign In / Providers, depending on your Supabase version) ->
--   "Leaked password protection." Free, no downside, five seconds.
--
-- * security_definer_view on published_testimonials / visible_team_members /
--   published_faq_items / published_additional_services — intentional,
--   already documented at the view definitions themselves (see 002/003/004/
--   013's own comments). Each view's WHERE clause is a simple, reviewed
--   filter (status = 'published'/'visible', plus consent checks for
--   testimonials) and is the entire access rule for anon reads — left as-is.
--
-- * rls_policy_always_true on public.leads ("Public can submit leads") —
--   intentional: the public Contact form has to let anonymous visitors
--   insert a lead with no prior session. Required for the site to work.
