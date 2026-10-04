-- Uptech Consulting admin dashboard — missing service_role GRANT on
-- onboarding_submissions. Run this once in the Supabase SQL editor.
--
-- Same class of bug 025_service_pages_service_role_grant.sql already fixed
-- for service_pages: an RLS policy controls which ROWS a role can see, but
-- Postgres separately requires a baseline GRANT before that role can touch
-- the table at all. 022_onboarding_submissions.sql granted select/update/
-- delete to `authenticated` only, and nothing to `service_role` — even
-- though the whole point of this table (per that migration's own comment)
-- is that app/api/onboarding-webhook/route.ts writes new rows through the
-- service-role client, since there's deliberately no anon insert policy.
--
-- Confirmed directly against the live database (2026-10-03): a service-role
-- request against onboarding_submissions returns 403 "permission denied for
-- table onboarding_submissions" — meaning every real submission from the
-- Google Form, right now, fails to save.

grant insert on public.onboarding_submissions to service_role;
