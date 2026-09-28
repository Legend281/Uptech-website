-- Uptech Consulting admin dashboard — real staff RLS for Team Members.
-- Run once, after 003_staff_auth.sql and 003_team_members.sql.
--
-- 003_team_members.sql shipped before public.profiles existed, so it left
-- RLS enabled with zero policies ("policies arrive with staff auth") and
-- never got a follow-up. Currently harmless only because
-- TeamMembersProvider.tsx is still a localStorage mock — the moment it's
-- wired to real Supabase writes, every staff member of every role would be
-- rejected outright. This is that follow-up, written now so the gap can't
-- get shipped-and-broken the way Testimonials' did.
--
-- Mirrors lib/admin/team.ts's canManageTeam() exactly: "this module handles
-- real people's personal data and faces, so it sits at Testimonials-consent
-- sensitivity. No People/HR role exists yet, so the default is
-- Administrators only; everyone else can look but not change." The admin
-- dashboard's own list needs to show hidden/draft people too (that's the
-- point of an admin view), so read access is every authenticated staff
-- member, not just the public visible_team_members view's rows.

revoke all on public.team_members from anon, authenticated;
grant select, insert, update, delete on public.team_members to authenticated;

drop policy if exists "Staff read all team members" on public.team_members;
create policy "Staff read all team members"
  on public.team_members
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Administrators manage team members" on public.team_members;
create policy "Administrators manage team members"
  on public.team_members
  for all
  to authenticated
  using (public.current_staff_role() = 'administrator')
  with check (public.current_staff_role() = 'administrator');

-- Portraits: same Administrator-only write as the table itself. The bucket
-- was created public-read in 003_team_members.sql; only upload/remove were
-- ever missing.
drop policy if exists "Administrators upload team photos" on storage.objects;
create policy "Administrators upload team photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'team-photos' and public.current_staff_role() = 'administrator');

drop policy if exists "Administrators remove team photos" on storage.objects;
create policy "Administrators remove team photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'team-photos' and public.current_staff_role() = 'administrator');
