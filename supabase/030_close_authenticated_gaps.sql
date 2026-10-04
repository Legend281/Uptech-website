-- Uptech Consulting admin dashboard — closes three places where "signed in"
-- was still being treated as "is staff". Run once in the Supabase SQL
-- editor, after 029_blog_featured.sql.
--
-- Why this matters: the Supabase project has public sign-ups enabled
-- (checked live 2026-10-04: disable_signup = false). The anon key is in
-- every visitor's browser, so anyone can create an account with their own
-- email, confirm it, and hold a real `authenticated` session — without ever
-- having a profiles row. Any policy that grants `authenticated` access
-- without calling current_staff_role() hands that stranger the data.
-- current_staff_role() (016_fix_staff_role_functions.sql) returns NULL for
-- both "no profile" and "deactivated", so it closes both holes at once.
--
-- Turning sign-ups off in the dashboard (Authentication -> Sign In /
-- Providers -> "Allow new users to sign up") is the first fix; this is the
-- second layer, so the data stays protected even if that setting is ever
-- switched back on. Staff invites are unaffected either way — they go
-- through auth.admin.inviteUserByEmail with the service role.
--
-- No staff member's access changes: every active Administrator, Editor,
-- and Viewer keeps exactly what they had.

-- 1. leads --------------------------------------------------------------------
-- The "leads.department is null" branch (unrouted leads awaiting triage)
-- never checked who was asking, so any signed-in account could read them —
-- names, emails, phone numbers.
drop policy if exists "Staff can read leads in scope" on public.leads;
create policy "Staff can read leads in scope"
  on public.leads
  for select
  to authenticated
  using (
    public.current_staff_role() is not null
    and (
      leads.department is null
      or public.current_staff_role() = 'administrator'
      or public.current_staff_department() = leads.department
    )
  );

-- 2. activity_log -------------------------------------------------------------
-- 008 granted read and insert to any signed-in account (`using (true)` /
-- `with check (true)`), and 019 never revisited this table. Entries name
-- real clients and staff ("X's inquiry was auto-assigned to Y"), and an
-- open insert let anyone write fake history into the audit trail. Delete
-- also used the old active-unaware check, so a deactivated Administrator
-- could still wipe it.
drop policy if exists "Staff can read all activity" on public.activity_log;
create policy "Staff can read all activity"
  on public.activity_log
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Staff can log activity" on public.activity_log;
create policy "Staff can log activity"
  on public.activity_log
  for insert
  to authenticated
  with check (public.current_staff_role() is not null);

drop policy if exists "Administrators can delete activity" on public.activity_log;
create policy "Administrators can delete activity"
  on public.activity_log
  for delete
  to authenticated
  using (public.current_staff_role() = 'administrator');

-- 3. blog_posts + blog-photos -------------------------------------------------
-- 026 was written after 019 but went back to the old ad hoc
-- `p.role in (...)` check, which ignores profiles.active — a deactivated
-- Editor kept full write access to the blog. Its staff read policy was
-- also `using (true)`, exposing unpublished drafts to any signed-in account.
drop policy if exists "Staff can read all posts" on public.blog_posts;
create policy "Staff can read all posts"
  on public.blog_posts
  for select
  to authenticated
  using (public.current_staff_role() is not null);

drop policy if exists "Editors and admins can insert posts" on public.blog_posts;
create policy "Editors and admins can insert posts"
  on public.blog_posts
  for insert
  to authenticated
  with check (public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Editors and admins can update posts" on public.blog_posts;
create policy "Editors and admins can update posts"
  on public.blog_posts
  for update
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'))
  with check (public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Editors and admins can delete posts" on public.blog_posts;
create policy "Editors and admins can delete posts"
  on public.blog_posts
  for delete
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Staff can upload blog photos" on storage.objects;
create policy "Staff can upload blog photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-photos' and public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Staff can delete blog photos" on storage.objects;
create policy "Staff can delete blog photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-photos' and public.current_staff_role() in ('administrator', 'editor'));
