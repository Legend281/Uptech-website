"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import { canManageBlog, getBlogSaveErrors, normalizeBlogInput, type BlogPostInput } from "@/lib/admin/blog";
import { describeDbError, getSupabaseBrowserClient, publicPhotoUrl, uploadDataUrl } from "@/lib/supabase/client";
import type { ActionResult, AdminUser, BlogPost, BlogPostStatus } from "@/lib/admin/types";

/*
 * Blog posts, stored in Supabase (supabase/026_blog_posts.sql) — the admin
 * module behind the public /blog and /blog/[slug] pages (lib/blog.ts reads
 * published rows directly). Same real-persistence, optimistic-refresh
 * posture as TeamMembersProvider: every write goes through the signed-in
 * staff session so RLS has the final say, and lib/admin/blog.ts's checks
 * just give a clear message before the round trip.
 */

type Row = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  author_name: string;
  author_bio: string | null;
  category: string | null;
  is_featured: boolean;
  status: BlogPostStatus;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function rowToPost(row: Row): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImagePath: row.cover_image_path ?? undefined,
    coverImage: publicPhotoUrl("blog-photos", row.cover_image_path),
    authorName: row.author_name,
    authorBio: row.author_bio ?? undefined,
    category: row.category ?? undefined,
    isFeatured: row.is_featured,
    status: row.status,
    publishedAt: row.published_at ?? undefined,
    createdById: row.created_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToColumns(input: BlogPostInput, coverImagePath: string | null) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    cover_image_path: coverImagePath,
    author_name: input.authorName,
    author_bio: input.authorBio ?? null,
    category: input.category ?? null,
    is_featured: input.isFeatured ?? false,
    status: input.status,
  };
}

type BlogPostsContextValue = {
  posts: BlogPost[];
  loading: boolean;
  loadError: string | null;
  addPost: (input: BlogPostInput, user: AdminUser) => Promise<ActionResult>;
  updatePost: (id: string, input: BlogPostInput, user: AdminUser) => Promise<ActionResult>;
  deletePost: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const BlogPostsContext = createContext<BlogPostsContextValue | null>(null);

const denied: ActionResult = { ok: false, reasons: ["Only an Administrator or Editor can manage the blog."] };

export function BlogPostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const logActivity = useLogActivity();

  async function revalidate(paths: string[]) {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    if (data.session) await revalidatePublicPages(paths, data.session.access_token);
  }

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient().from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("[blog] Failed to load posts:", error);
      setLoadError(describeDbError(error));
    } else if (data) {
      setPosts((data as Row[]).map(rowToPost));
      setLoadError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    function apply(hasSession: boolean) {
      if (hasSession) void refresh();
      else {
        setPosts([]);
        setLoadError(null);
        setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "TOKEN_REFRESHED") apply(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/blog" });
  }

  /** At most one featured post at a time — marking this one clears every other, rather than requiring staff to remember to un-feature the old one themselves. */
  async function unfeatureOthers(exceptId: string) {
    const { error } = await getSupabaseBrowserClient().from("blog_posts").update({ is_featured: false }).neq("id", exceptId).eq("is_featured", true);
    if (error) console.error("[blog] Failed to clear previous featured post:", error);
  }

  async function saveCoverImage(input: BlogPostInput, currentPath?: string): Promise<string | null> {
    if (!input.coverImage) return null;
    if (input.coverImage.startsWith("data:")) return uploadDataUrl("blog-photos", input.coverImage, "blog");
    return currentPath ?? null;
  }

  async function addPost(input: BlogPostInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageBlog(user)) return denied;
    const clean = normalizeBlogInput(input);
    const errors = getBlogSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    let coverImagePath: string | null;
    try {
      coverImagePath = await saveCoverImage(clean);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The cover image couldn't be uploaded."] };
    }

    const { data, error } = await getSupabaseBrowserClient()
      .from("blog_posts")
      .insert({
        ...inputToColumns(clean, coverImagePath),
        created_by: user.id,
        published_at: clean.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error || !data) return { ok: false, reasons: [describeDbError(error)] };
    if (clean.isFeatured) await unfeatureOthers(data.id);

    await refresh();
    if (clean.status === "published") void revalidate(["/blog", `/blog/${clean.slug}`]);
    log(
      clean.status === "published" ? "publish" : "edit_note",
      clean.status === "published" ? `${user.name} published "${clean.title}" to the blog.` : `${user.name} drafted "${clean.title}".`,
    );
    return { ok: true };
  }

  async function updatePost(id: string, input: BlogPostInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageBlog(user)) return denied;
    const existing = posts.find((p) => p.id === id);
    if (!existing) return { ok: false, reasons: ["This post no longer exists."] };
    const clean = normalizeBlogInput(input);
    const errors = getBlogSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    let coverImagePath: string | null;
    try {
      coverImagePath = await saveCoverImage(clean, existing.coverImagePath);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The cover image couldn't be uploaded."] };
    }

    // published_at is set once, the first time a post goes live, and never
    // touched again — omitted from the update entirely unless this save is
    // the one crossing draft -> published for the first time.
    const columns: Record<string, unknown> = inputToColumns(clean, coverImagePath);
    if (clean.status === "published" && !existing.publishedAt) columns.published_at = new Date().toISOString();

    const { error } = await getSupabaseBrowserClient().from("blog_posts").update(columns).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };
    if (clean.isFeatured) await unfeatureOthers(id);

    await refresh();
    if (existing.coverImagePath && existing.coverImagePath !== coverImagePath) {
      void getSupabaseBrowserClient().storage.from("blog-photos").remove([existing.coverImagePath]);
    }
    const paths = new Set(["/blog"]);
    if (existing.status === "published") paths.add(`/blog/${existing.slug}`);
    if (clean.status === "published") paths.add(`/blog/${clean.slug}`);
    if (existing.status === "published" || clean.status === "published") void revalidate([...paths]);

    if (clean.status !== existing.status) {
      log(clean.status === "published" ? "publish" : "unpublished", `${user.name} ${clean.status === "published" ? "published" : "unpublished"} "${clean.title}".`);
    } else {
      log("edit_note", `${user.name} edited "${clean.title}".`);
    }
    return { ok: true };
  }

  async function deletePost(id: string, user: AdminUser): Promise<ActionResult> {
    if (!canManageBlog(user)) return denied;
    const existing = posts.find((p) => p.id === id);
    if (!existing) return { ok: true };

    const { error } = await getSupabaseBrowserClient().from("blog_posts").delete().eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    if (existing.coverImagePath) void getSupabaseBrowserClient().storage.from("blog-photos").remove([existing.coverImagePath]);
    await refresh();
    if (existing.status === "published") void revalidate(["/blog", `/blog/${existing.slug}`]);
    log("delete", `${user.name} deleted "${existing.title}".`);
    return { ok: true };
  }

  return <BlogPostsContext.Provider value={{ posts, loading, loadError, addPost, updatePost, deletePost }}>{children}</BlogPostsContext.Provider>;
}

export function useBlogPosts() {
  const ctx = useContext(BlogPostsContext);
  if (!ctx) throw new Error("useBlogPosts must be used within BlogPostsProvider");
  return ctx;
}
