import type { AdminUser, BlogPost } from "./types";

/*
 * Blog rules. Flat Administrator/Editor management (no department split —
 * see supabase/026_blog_posts.sql's own comment on why), same
 * canManageContent gate Job Postings and Additional Services already use.
 */

export type BlogPostInput = Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "coverImage" | "authorName" | "category" | "status">;

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Lowercase, hyphenated, URL-safe. Used both for the auto-fill-from-title default and to validate a manually-edited slug. */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Plain-text length of the rich-text HTML body, for the "empty post" check — a couple of empty Tiptap paragraph tags shouldn't count as real content. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getBlogSaveErrors(input: BlogPostInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push("Add a title.");
  if (!input.slug.trim()) errors.push("Add a URL slug.");
  else if (!SLUG_PATTERN.test(input.slug.trim())) errors.push("The slug can only use lowercase letters, numbers, and hyphens.");
  if (!input.authorName.trim()) errors.push("Add an author name.");
  if (!stripHtml(input.content)) errors.push("Write the post before saving.");
  return errors;
}

/** Soft warnings — the save still goes through. */
export function getBlogWarnings(input: BlogPostInput): string[] {
  const warnings: string[] = [];
  if (input.status === "published" && !input.coverImage) {
    warnings.push("No cover image yet. The blog listing and social shares will show a plain card.");
  }
  if (!input.excerpt.trim()) {
    warnings.push("No excerpt — the listing page and search engines will fall back to the start of the post body.");
  }
  return warnings;
}

export function normalizeBlogInput(input: BlogPostInput): BlogPostInput {
  return {
    ...input,
    title: input.title.trim(),
    slug: slugify(input.slug),
    excerpt: input.excerpt.trim(),
    authorName: input.authorName.trim() || "Uptech Consulting",
    category: input.category?.trim() || undefined,
  };
}

export function canManageBlog(user: AdminUser): boolean {
  return user.role === "administrator" || user.role === "editor";
}

/** Newest first — matches every other content list in this dashboard. */
export function sortBlogPosts<T extends Pick<BlogPost, "createdAt">>(posts: T[]): T[] {
  return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
