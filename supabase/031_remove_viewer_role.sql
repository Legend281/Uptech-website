-- Uptech Consulting admin dashboard — removes the Viewer role. Leadership
-- decision (2026-10-04): every staff account is either an Administrator or
-- an Editor; nobody needs a look-only login. Run once in the Supabase SQL
-- editor, after 030_close_authenticated_gaps.sql.
--
-- Refuses to run if any account is still a Viewer, rather than silently
-- converting it — change that person's role under Staff first, so the
-- decision about their access is made by a person, not by this script.
-- (As of 2026-10-04 there are none: 2 Administrators, 1 Editor.)
--
-- No RLS policy needs rewriting: every write policy already requires
-- 'administrator' or 'editor', and every read policy checks
-- current_staff_role() is not null. The Viewer branches simply become
-- unreachable.

do $$
begin
  if exists (select 1 from public.profiles where role = 'viewer') then
    raise exception 'Some staff accounts still have the Viewer role. Change them to Editor or Administrator under Staff, then run this again.';
  end if;
end $$;

-- 003_staff_auth.sql declared this as an inline column check, which
-- Postgres names <table>_<column>_check.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('administrator', 'editor'));
