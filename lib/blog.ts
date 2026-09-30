import { getSupabaseServerClient } from "@/lib/supabase/server";

/*
 * Public read side of the Blog module. Server-only (SUPABASE_URL /
 * SUPABASE_ANON_KEY are never exposed to the client). Reads blog_posts
 * directly with the anon key — RLS (supabase/026_blog_posts.sql) already
 * restricts that key to status = 'published' rows, same pattern
 * app/careers/page.tsx already uses for job_postings, not the
 * published_view pattern lib/testimonials.ts/lib/faqs.ts use.
 *
 * An empty list/null is the normal answer before any post exists — every
 * caller renders an explicit empty state rather than treating it as an
 * error (CLAUDE.md: never fabricate content to make a page "look done").
 */

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName: string;
  category?: string;
  publishedAt: string;
};

type Row = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  author_name: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
};

function coverImageUrl(path: string | null): string | undefined {
  if (!path || !process.env.SUPABASE_URL) return undefined;
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/blog-photos/${encodeURI(path)}`;
}

function rowToPost(row: Row): PublicBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: coverImageUrl(row.cover_image_path),
    authorName: row.author_name,
    category: row.category ?? undefined,
    // Every row this function ever sees is already published (RLS-filtered
    // below), so published_at is always set by the time it gets here —
    // created_at is only a defensive fallback for a row written before
    // that column existed, not an expected path.
    publishedAt: row.published_at ?? row.created_at,
  };
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return [];

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image_path, author_name, category, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("[blog] read failed:", error.message);
      return [];
    }
    return (data as Row[]).map(rowToPost);
  } catch (error) {
    console.error("[blog] read failed:", error);
    return [];
  }
}

export async function getPublishedBlogPost(slug: string): Promise<PublicBlogPost | null> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image_path, author_name, category, published_at, created_at")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("[blog] read failed:", error.message);
      return null;
    }
    return rowToPost(data as Row);
  } catch (error) {
    console.error("[blog] read failed:", error);
    return null;
  }
}
