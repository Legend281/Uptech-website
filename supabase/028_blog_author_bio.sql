-- Uptech Consulting admin dashboard — adds a short "about the author" blurb
-- to blog posts, shown at the end of the published article. 026_blog_posts.sql
-- shipped without this; it was added once the public blog page was compared
-- against real editorial blog layouts and found to be missing an author bio
-- entirely, not just a byline. Optional — never backfilled with placeholder
-- text, so older/existing posts simply show no bio block until an editor adds one.

alter table public.blog_posts add column if not exists author_bio text;
