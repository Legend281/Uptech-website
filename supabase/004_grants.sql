-- Uptech Consulting admin dashboard — missing table-level GRANTs.
-- Run this once in the Supabase SQL editor, after 003_staff_auth.sql.
--
-- Real bug in 003, caught via a live login test: RLS policies control WHICH
-- rows a role can see, but Postgres separately requires a baseline GRANT
-- before that role can query the table at all. Supabase's Table Editor UI
-- adds this automatically when you create a table through it; a raw SQL
-- `create table` (which 003 did) does not. Confirmed by the exact error a
-- real sign-in produced: "permission denied for table profiles" (42501),
-- with Postgres's own hint being this exact GRANT statement.

grant select on public.profiles to authenticated;

-- 003 added SELECT/UPDATE/DELETE/INSERT policies on leads for `authenticated`
-- (the whole point of staff being able to read/act on leads) — those hit the
-- identical missing-grant wall, just not yet surfaced by a real test.
grant select, insert, update, delete on public.leads to authenticated;
