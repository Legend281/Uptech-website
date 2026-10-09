-- ==============================================================================
-- UPTECH CONSULTING & OUTSOURCING
-- Combined Pending Migrations (025 through 031)
--
-- How to apply:
-- 1. Open Supabase Dashboard -> Your Project -> SQL Editor
-- 2. Click "New query"
-- 3. Paste this entire file into the editor and click "Run" (or Ctrl + Enter)
--
-- This script covers:
-- - 025: Service Pages grant for service_role (Daily Digest)
-- - 026: Blog Posts table, triggers, RLS policies, and blog-photos storage bucket
-- - 027: Onboarding Submissions grant for service_role (Webhook intake)
-- - 028: Blog author_bio column
-- - 029: Blog is_featured column
-- - 030: Close authenticated security gaps on leads, activity_log, and blog_posts
-- - 031: Remove legacy viewer role constraint from profiles
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 025: service_pages service_role grant
-- ------------------------------------------------------------------------------
grant select on public.service_pages to service_role;


-- ------------------------------------------------------------------------------
-- 026: blog_posts table, storage bucket and initial setup
-- ------------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_path text,
  author_name text not null default 'Uptech Consulting',
  category text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_blog_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;

-- Storage: cover images
insert into storage.buckets (id, name, public)
values ('blog-photos', 'blog-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog photos" on storage.objects;
create policy "Public can view blog photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-photos');


-- ------------------------------------------------------------------------------
-- 027: onboarding_submissions service_role grant
-- ------------------------------------------------------------------------------
grant insert on public.onboarding_submissions to service_role;


-- ------------------------------------------------------------------------------
-- 028: blog_posts author_bio column
-- ------------------------------------------------------------------------------
alter table public.blog_posts add column if not exists author_bio text;


-- ------------------------------------------------------------------------------
-- 029: blog_posts is_featured column
-- ------------------------------------------------------------------------------
alter table public.blog_posts add column if not exists is_featured boolean not null default false;


-- ------------------------------------------------------------------------------
-- 030: Close authenticated security gaps
-- ------------------------------------------------------------------------------
-- 1. leads
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

-- 2. activity_log
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

-- 3. blog_posts + blog-photos
drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts
  for select
  to anon
  using (status = 'published');

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


-- ------------------------------------------------------------------------------
-- 031: Remove legacy viewer role
-- ------------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from public.profiles where role = 'viewer') then
    raise notice 'Updating remaining viewer profiles to editor...';
    update public.profiles set role = 'editor' where role = 'viewer';
  end if;
end $$;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('administrator', 'editor'));
