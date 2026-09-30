"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { BlogPostFormDialog } from "@/components/admin/BlogPostFormDialog";
import { ModuleHeader, PrimaryActionButton, SearchInput, CARD_SURFACE } from "@/components/admin/FormParts";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { SegmentedBar, BarLegend, type BarSegment } from "@/components/admin/SegmentedBar";
import { useBlogPosts } from "@/components/admin/providers/BlogPostsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { canManageBlog, sortBlogPosts } from "@/lib/admin/blog";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { BlogPost, BlogPostStatus } from "@/lib/admin/types";

const PAGE_SIZE = 8;
const STATUS_ORDER: BlogPostStatus[] = ["draft", "published"];
const statusMeta: Record<BlogPostStatus, { label: string; badge: string; chart: string }> = {
  draft: { label: "Draft", badge: "border-slate-200 bg-slate-50 text-slate-600", chart: "bg-slate-400" },
  published: { label: "Published", badge: "border-emerald-200 bg-emerald-50 text-emerald-700", chart: "bg-emerald-500" },
};

const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

function PostCard({ post, onEdit, onDelete }: { post: BlogPost; onEdit: () => void; onDelete: () => void }) {
  const meta = statusMeta[post.status];
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-500">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <MaterialIcon name="article" className="text-[17px]" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-navy-950">{post.title}</p>
        <p className="truncate text-xs text-slate-500">{post.authorName}{post.category ? ` · ${post.category}` : ""}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
          <span className="text-xs tabular-nums text-slate-500">{formatRelativeTime(post.createdAt)}</span>
        </div>
      </div>
      <RowActionsMenu
        label={`Actions for ${post.title}`}
        actions={[
          { label: "Edit", icon: "edit", onSelect: onEdit },
          { label: "Delete", icon: "delete", tone: "danger", onSelect: onDelete },
        ]}
      />
    </div>
  );
}

export default function BlogPostsPage() {
  const { posts, deletePost } = useBlogPosts();
  const currentUser = useCurrentUser();
  const canManage = canManageBlog(currentUser);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const publishedCount = posts.filter((p) => p.status === "published").length;

  function toggleStatusFilter(key: string) {
    setStatusFilter((current) => (current === key ? "all" : (key as BlogPostStatus)));
    setPage(1);
  }

  const statusSegments: BarSegment[] = STATUS_ORDER.map((status) => ({
    key: status,
    label: statusMeta[status].label,
    count: posts.filter((p) => p.status === status).length,
    colorClass: statusMeta[status].chart,
  }));

  const filtered = sortBlogPosts(
    posts
      .filter((p) => statusFilter === "all" || p.status === statusFilter)
      .filter((p) => {
        if (!query.trim()) return true;
        const haystack = `${p.title} ${p.authorName} ${p.category ?? ""} ${p.excerpt}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      }),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, (safePage - 1) * PAGE_SIZE + PAGE_SIZE);

  function actionsFor(post: BlogPost): RowAction[] {
    if (!canManage) return [];
    return [
      { label: "Edit", icon: "edit", onSelect: () => setEditingPost(post) },
      { label: "Delete", icon: "delete", tone: "danger", onSelect: () => setDeletingPost(post) },
    ];
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants}>
          <ModuleHeader
            title="Blog"
            summary={
              <>
                <AnimatedNumber value={posts.length} /> total
                {publishedCount > 0 && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-semibold text-emerald-700">
                      <AnimatedNumber value={publishedCount} /> published
                    </span>
                  </>
                )}
              </>
            }
            action={canManage && <PrimaryActionButton label="New Post" onClick={() => setCreateOpen(true)} />}
          />
        </motion.div>

        <motion.div variants={itemVariants} className={`mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${CARD_SURFACE}`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-sans text-sm font-bold text-navy-950">Status</h2>
            {statusFilter !== "all" ? (
              <button type="button" onClick={() => toggleStatusFilter(statusFilter)} className="flex items-center gap-1 text-xs font-semibold text-navy-950 hover:text-slate-600">
                Filtered: {statusMeta[statusFilter].label}
                <MaterialIcon name="close" className="text-[13px]" />
              </button>
            ) : (
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                <AnimatedNumber value={posts.length} /> posts
              </span>
            )}
          </div>
          <div className="mt-4">
            <SegmentedBar segments={statusSegments} activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
            <BarLegend segments={statusSegments} emptyLabel="No posts yet." activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
          </div>
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_SURFACE}`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <SearchInput id={searchId} value={query} onChange={(v) => { setQuery(v); setPage(1); }} label="Search posts" />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-slate-500">
              <MaterialIcon name={posts.length === 0 ? "article" : "search_off"} className="text-[32px] text-slate-300" />
              <p>{posts.length === 0 ? "No posts yet — write the first one above." : `Nothing matches ${query ? `"${query}"` : "this filter"}.`}</p>
            </div>
          ) : (
            <>
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-2.5 sm:px-5">Post</th>
                    <th scope="col" className="px-3 py-2.5">Status</th>
                    <th scope="col" className="px-3 py-2.5">Author</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Created</th>
                    <th scope="col" className="w-12 px-3 py-2.5"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {paged.map((post) => {
                      const meta = statusMeta[post.status];
                      return (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                          onClick={() => (canManage ? setEditingPost(post) : undefined)}
                        >
                          <td className="px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-500">
                                {post.coverImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <MaterialIcon name="article" className="text-[17px]" />
                                )}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-sans text-sm font-semibold text-navy-950">{post.title}</p>
                                {post.category && <p className="truncate text-xs text-slate-400">{post.category}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{post.authorName}</td>
                          <td className="px-3 py-3 text-right text-xs tabular-nums text-slate-500">{formatRelativeTime(post.createdAt)}</td>
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            <RowActionsMenu actions={actionsFor(post)} label={`Actions for ${post.title}`} />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              <div className="sm:hidden">
                <AnimatePresence initial={false}>
                  {paged.map((post) => (
                    <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <PostCard post={post} onEdit={() => setEditingPost(post)} onDelete={() => setDeletingPost(post)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of{" "}
                  <span className="font-semibold text-slate-700">{filtered.length}</span>
                </p>
                {pageCount > 1 && (
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                      <MaterialIcon name="chevron_left" className="text-[18px]" />
                    </button>
                    <span className="px-2 text-xs font-semibold tabular-nums text-slate-600">{safePage} / {pageCount}</span>
                    <button type="button" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={safePage === pageCount} aria-label="Next page" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                      <MaterialIcon name="chevron_right" className="text-[18px]" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.section>
      </motion.div>

      {createOpen && <BlogPostFormDialog mode="create" onClose={() => setCreateOpen(false)} />}
      {editingPost && <BlogPostFormDialog mode="edit" post={editingPost} onClose={() => setEditingPost(null)} />}
      <ConfirmDialog
        open={Boolean(deletingPost)}
        title="Delete this post?"
        description={deletingPost ? `"${deletingPost.title}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Post"
        onCancel={() => setDeletingPost(null)}
        onConfirm={async () => {
          if (deletingPost) {
            const result = await deletePost(deletingPost.id, currentUser);
            if (!result.ok) toast.error("Couldn't delete", { description: result.reasons[0] });
            else toast.success("Post deleted");
          }
          setDeletingPost(null);
        }}
      />
    </>
  );
}
