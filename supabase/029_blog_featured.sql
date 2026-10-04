-- Uptech Consulting admin dashboard — lets staff manually pin a specific
-- post as "Featured" on the public blog, instead of the hero slot always
-- being whichever post happens to be most recently published. Run this
-- once in the Supabase SQL editor, after 026_blog_posts.sql.

alter table public.blog_posts add column if not exists is_featured boolean not null default false;
