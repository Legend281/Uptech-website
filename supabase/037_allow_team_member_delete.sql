-- 037_allow_team_member_delete.sql
-- Removes the trigger that prevented staff from deleting team members who had
-- ever been visible on the public site. The restriction was too strict —
-- administrators should be able to fully delete any team member.
-- The admin dashboard now revalidates /who-we-are after deletion if the member
-- was visible, so the public page updates immediately.

drop trigger if exists team_members_no_delete_after_public on public.team_members;
drop function if exists public.prevent_public_team_member_delete();
