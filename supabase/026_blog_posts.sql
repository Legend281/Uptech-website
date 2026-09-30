-- Uptech Consulting admin dashboard — Blog. Run this once in the Supabase
-- SQL editor, after 003_staff_auth.sql.
--
-- Same shape as 006_job_postings.sql: draft/published status, a real public
-- SELECT policy for `anon` scoped to published rows only (so /blog and
-- /blog/[slug] read live, no manual export/redeploy step), flat
-- Administrator/Editor management with no department split — a blog post
-- isn't Career Services' or Business Formalisation's, it's the company's.
--
-- Ships with zero rows and no public nav link relying on any existing post
-- — this migration only builds the infrastructure; real posts are added by
-- staff afterward (CLAUDE.md's "don't invent content" rule applies here
-- exactly as it does to Testimonials and Case Studies).

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  -- URL segment (/blog/<slug>) — kept separate from title so editing a
  -- published post's title later doesn't silently break an already-shared
  -- or already-indexed link.
  slug text not null unique,
  excerpt text not null default '',
  -- Sanitized HTML from the admin rich text editor (Tiptap's getHTML()) —
  -- rendered with the same escaping discipline as any other user-authored
  -- HTML on this site (see components/JsonLd.tsx's own reasoning for why
  -- that discipline matters, even for staff-authored content).
  content text not null default '',
  -- Storage object path within the blog-photos bucket, not a public URL —
  -- same pattern as team_members.photo_path / testimonials' photo path.
  cover_image_path text,
  author_name text not null default 'Uptech Consulting',
  category text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Set once, the first time a post is published — preserved across later
  -- edits so re-saving a published post never makes it look freshly
  -- posted. Application logic sets this (BlogPostsProvider), the same
  -- "set once, from the client" posture leads.first_contacted_at already
  -- uses, not a database trigger.
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
  using (true);

drop policy if exists "Editors and admins can insert posts" on public.blog_posts;
create policy "Editors and admins can insert posts"
  on public.blog_posts
  for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

drop policy if exists "Editors and admins can update posts" on public.blog_posts;
create policy "Editors and admins can update posts"
  on public.blog_posts
  for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

drop policy if exists "Editors and admins can delete posts" on public.blog_posts;
create policy "Editors and admins can delete posts"
  on public.blog_posts
  for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;

-- Storage: cover images. Same public-read-bucket shape as team-photos /
-- service-photos (see 003_staff_auth.sql and 013_additional_services.sql)
-- — public SELECT (a blog cover image is meant to be seen by anyone, same
-- as those), staff-only write.
insert into storage.buckets (id, name, public)
values ('blog-photos', 'blog-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog photos" on storage.objects;
create policy "Public can view blog photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-photos');

drop policy if exists "Staff can upload blog photos" on storage.objects;
create policy "Staff can upload blog photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor'))
  );

drop policy if exists "Staff can delete blog photos" on storage.objects;
create policy "Staff can delete blog photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor'))
  );
