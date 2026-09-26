-- Uptech Consulting admin dashboard — critical fix: the public Contact form
-- and Apply form have likely never worked in production.
--
-- Same root cause as 004_grants.sql, one role earlier: 001_leads_table.sql
-- created an RLS policy allowing `anon` to INSERT into leads, but never
-- granted the underlying table-level INSERT privilege itself. RLS policies
-- only restrict which rows a role can touch — the role still needs the base
-- GRANT to attempt the operation at all. Confirmed live: a real submission
-- through /api/apply just failed with "permission denied for table leads"
-- (42501) using the public anon key, the exact same key every real visitor's
-- browser uses. This means the Contact form (/api/leads) and Apply form
-- (/api/apply) have both been silently failing for every real submission
-- since 001 was first run — not something this session broke, something
-- this session's end-to-end test is the first thing to have ever caught.

grant insert on public.leads to anon;
