-- Uptech Consulting admin dashboard — real staff account editing
-- (role/department/location/languages/deactivate). Run this once in the
-- Supabase SQL editor, after 003_staff_auth.sql.
--
-- Merging in the Development branch's Settings module (built by a
-- teammate) brought a real "Users" screen (components/admin/settings/
-- UsersSettings.tsx) for editing an existing staff member and deactivating
-- an account — a real gap on this branch, whose own /admin/staff page was
-- read-only-plus-invite. Before this, profiles had no UPDATE policy at all
-- "on purpose" (003_staff_auth.sql's own comment: provisioning went through
-- the Supabase dashboard directly, until a real screen existed). It exists
-- now.
--
-- Accounts are deactivated, never deleted — a deactivated account's past
-- leads/activity/reviews still point at a real name. The finer rules (an
-- Administrator can't change their own role, can't deactivate themselves,
-- and there must always be at least one active Administrator) are enforced
-- in application code (components/admin/providers/StaffProvider.tsx),
-- matching how Leads' own delete/update split works elsewhere in this
-- project — RLS is the coarse boundary (Administrator or not), the specific
-- business rule is app-layer.

alter table public.profiles add column if not exists active boolean not null default true;

drop policy if exists "Administrators can update profiles" on public.profiles;
create policy "Administrators can update profiles"
  on public.profiles
  for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'administrator'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'administrator'));

grant update on public.profiles to authenticated;
