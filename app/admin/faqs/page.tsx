"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FaqFormDialog } from "@/components/admin/FaqFormDialog";
import { InfoNotice, CARD_SURFACE, ModuleHeader, PrimaryActionButton, SearchInput, selectClasses } from "@/components/admin/FormParts";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useFaqItems } from "@/components/admin/providers/FaqItemsProvider";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { toastResult } from "@/lib/admin/toastResult";
import {
  canManageFaqCategory,
  canReviewFaq,
  faqCategories,
  getFaqPublishBlockers,
  isReviewed,
  manageableCategories,
  needsLegalReview,
  sortFaqs,
} from "@/lib/admin/faqs";
import type { FaqCategory } from "@/lib/faqContent";
import type { FaqItemRecord, FaqStatus } from "@/lib/admin/types";

type ReviewFilter = "all" | "needs-review" | "reviewed";

function ReviewBadge({ item }: { item: FaqItemRecord }) {
  if (!needsLegalReview(item.category)) return null;
  if (isReviewed(item))
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-emerald-700">
        <MaterialIcon name="fact_check" className="text-[14px]" />
        Reviewed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-amber-700">
      <MaterialIcon name="pending_actions" className="text-[14px]" />
      {item.awaitingFirstReview ? "Needs first review" : "Needs review"}
    </span>
  );
}

export default function FaqItemsPage() {
  const currentUser = useCurrentUser();
  const { items, publishFaq, unpublishFaq, reviewFaq, reorder, deleteFaq } = useFaqItems();

  const [creating, setCreating] = useState<{ category?: FaqCategory } | null>(null);
  const [editing, setEditing] = useState<FaqItemRecord | null>(null);
  const [reviewing, setReviewing] = useState<FaqItemRecord | null>(null);
  const [deleting, setDeleting] = useState<FaqItemRecord | null>(null);
  const [collapsed, setCollapsed] = useState<Set<FaqCategory>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<FaqCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FaqStatus | "all">("all");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState<{ id: string; category: FaqCategory } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const searchId = useId();

  const canAdd = manageableCategories(currentUser).length > 0;
  const needsReviewCount = items.filter((i) => needsLegalReview(i.category) && !isReviewed(i)).length;
  const publishedCount = items.filter((i) => i.status === "published").length;
  // Reordering only makes sense against the full list, not a filtered slice of it.
  const unfiltered = statusFilter === "all" && reviewFilter === "all" && !query.trim();

  function matches(item: FaqItemRecord): boolean {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (reviewFilter === "needs-review" && !(needsLegalReview(item.category) && !isReviewed(item))) return false;
    if (reviewFilter === "reviewed" && !(needsLegalReview(item.category) && isReviewed(item))) return false;
    if (query.trim() && !`${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  }

  const groups = faqCategories
    .filter((c) => categoryFilter === "all" || c.value === categoryFilter)
    .map((category) => {
      const all = sortFaqs(items.filter((i) => i.category === category.value));
      return { category, all, shown: all.filter(matches) };
    });

  function moveWithin(item: FaqItemRecord, direction: -1 | 1) {
    const ids = sortFaqs(items.filter((i) => i.category === item.category)).map((i) => i.id);
    const from = ids.indexOf(item.id);
    const to = from + direction;
    if (to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    void toastResult(reorder(item.category, ids, currentUser), "Order updated", "Not moved");
  }

  function dropOn(target: FaqItemRecord) {
    if (!dragging || dragging.category !== target.category || dragging.id === target.id) return;
    const ids = sortFaqs(items.filter((i) => i.category === target.category)).map((i) => i.id);
    const from = ids.indexOf(dragging.id);
    ids.splice(from, 1);
    ids.splice(ids.indexOf(target.id) + (from <= ids.indexOf(target.id) ? 1 : 0), 0, dragging.id);
    void toastResult(reorder(target.category, ids, currentUser), "Order updated", "Not moved");
  }

  function handlePublish(item: FaqItemRecord) {
    void toastResult(publishFaq(item.id, currentUser), "Published", "Can't publish yet");
  }

  function actionsFor(item: FaqItemRecord, index: number, total: number): RowAction[] {
    if (!canManageFaqCategory(currentUser, item.category)) return [];
    const actions: RowAction[] = [{ label: "Edit", icon: "edit", onSelect: () => setEditing(item) }];
    if (canReviewFaq(currentUser, item) && !isReviewed(item)) {
      actions.push({ label: "Mark as reviewed", icon: "fact_check", onSelect: () => setReviewing(item) });
    }
    if (item.status === "draft") {
      const ready = getFaqPublishBlockers(item).length === 0;
      actions.push({ label: ready ? "Publish" : "Publish… (see what's missing)", icon: "publish", onSelect: () => handlePublish(item) });
    } else {
      actions.push({
        label: "Unpublish",
        icon: "unpublished",
        onSelect: () => {
          void toastResult(unpublishFaq(item.id, currentUser), "Unpublished");
        },
      });
    }
    if (unfiltered && index > 0) actions.push({ label: "Move up", icon: "arrow_upward", onSelect: () => moveWithin(item, -1) });
    if (unfiltered && index < total - 1) actions.push({ label: "Move down", icon: "arrow_downward", onSelect: () => moveWithin(item, 1) });
    if (item.status === "draft") actions.push({ label: "Delete", icon: "delete", tone: "danger", onSelect: () => setDeleting(item) });
    return actions;
  }

  function toggleGroup(category: FaqCategory) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <>
      <ModuleHeader
        title="FAQ Items"
        summary={
          <>
            {publishedCount} published across {faqCategories.length} pages
            {needsReviewCount > 0 && (
              <>
                {" "}
                · <span className="font-semibold text-amber-700">{needsReviewCount} compliance answer{needsReviewCount === 1 ? "" : "s"} need review</span>
              </>
            )}
          </>
        }
        action={canAdd ? <PrimaryActionButton label="Add FAQ" onClick={() => setCreating({})} /> : undefined}
      />

      <InfoNotice>
        These start from the FAQs the site shows today. Edits here are saved in this browser only and don&apos;t change the
        public pages yet.
      </InfoNotice>

      <div className={`mb-4 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5 ${CARD_SURFACE}`}>
        <select aria-label="Filter by page" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as FaqCategory | "all")} className={selectClasses}>
          <option value="all">All pages</option>
          {faqCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FaqStatus | "all")} className={selectClasses}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select aria-label="Filter by review" value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value as ReviewFilter)} className={selectClasses}>
          <option value="all">Any review state</option>
          <option value="needs-review">Needs review</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <SearchInput id={searchId} value={query} onChange={setQuery} label="Search FAQs" />
      </div>

      <div className="space-y-4">
        {groups.map(({ category, all, shown }) => {
          if (!unfiltered && shown.length === 0) return null;
          const open = !collapsed.has(category.value);
          const manageable = canManageFaqCategory(currentUser, category.value);
          const liveCount = all.filter((i) => i.status === "published").length;
          return (
            <section key={category.value} className={CARD_SURFACE}>
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => toggleGroup(category.value)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <MaterialIcon name={open ? "expand_more" : "chevron_right"} className="text-[20px] text-slate-400" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-sans text-sm font-bold text-navy-950">{category.label}</span>
                      {category.legalReview && (
                        <span className="shrink-0 rounded border border-amber-200 bg-amber-50 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Review gate
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {liveCount} live of {all.length} · shows on the {category.pageLabel}
                    </span>
                  </span>
                </button>
                <Link href={category.url} target="_blank" className="text-xs font-semibold text-slate-500 hover:text-navy-950">
                  View page
                </Link>
                {manageable && (
                  <button
                    type="button"
                    onClick={() => setCreating({ category: category.value })}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
                  >
                    <MaterialIcon name="add" className="text-[14px]" />
                    Add
                  </button>
                )}
              </div>

              {open &&
                (shown.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-slate-500">No FAQs on this page yet.</p>
                ) : (
                  <ol>
                    {shown.map((item, index) => {
                      const draggable = unfiltered && manageable;
                      return (
                        <li
                          key={item.id}
                          draggable={draggable}
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            setDragging({ id: item.id, category: item.category });
                          }}
                          onDragOver={(e) => {
                            if (dragging?.category === item.category) {
                              e.preventDefault();
                              setDropTarget(item.id);
                            }
                          }}
                          onDragLeave={() => setDropTarget((t) => (t === item.id ? null : t))}
                          onDrop={(e) => {
                            e.preventDefault();
                            dropOn(item);
                            setDragging(null);
                            setDropTarget(null);
                          }}
                          onDragEnd={() => {
                            setDragging(null);
                            setDropTarget(null);
                          }}
                          className={`flex items-start gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3 last:border-b-0 sm:px-5 ${
                            item.status === "published" ? "border-l-emerald-500" : "border-l-slate-300"
                          } ${dropTarget === item.id && dragging?.id !== item.id ? "bg-teal-50" : ""} ${dragging?.id === item.id ? "opacity-50" : ""}`}
                        >
                          {draggable ? (
                            <span className="mt-0.5 cursor-grab text-slate-300 hover:text-slate-500" title="Drag to reorder" aria-hidden="true">
                              <MaterialIcon name="drag_indicator" className="text-[18px]" />
                            </span>
                          ) : (
                            <span className="mt-0.5 w-[18px] text-center text-xs font-bold tabular-nums text-slate-300">{index + 1}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => (manageable ? setEditing(item) : undefined)}
                            className={`min-w-0 flex-1 text-left ${manageable ? "" : "cursor-default"}`}
                          >
                            <p className="font-sans text-sm font-semibold text-navy-950">{item.question}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">{item.answer}</p>
                            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                                  item.status === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"
                                }`}
                              >
                                {item.status === "published" ? "Published" : "Draft"}
                              </span>
                              <ReviewBadge item={item} />
                              <span className="text-[11px] tabular-nums text-slate-400">Updated {formatRelativeTime(item.updatedAt)}</span>
                            </span>
                          </button>
                          <RowActionsMenu actions={actionsFor(item, index, shown.length)} label="FAQ actions" />
                        </li>
                      );
                    })}
                  </ol>
                ))}
            </section>
          );
        })}
      </div>


      {creating && <FaqFormDialog mode="create" category={creating.category} onClose={() => setCreating(null)} />}
      {editing && <FaqFormDialog mode="edit" item={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(reviewing)}
        tone="warning"
        title="Mark this answer as reviewed?"
        description={
          reviewing
            ? `You're confirming “${reviewing.question}” is accurate against current requirements. Your name goes on the review, and any later change to the wording clears it.`
            : ""
        }
        confirmLabel="Mark reviewed"
        onCancel={() => setReviewing(null)}
        onConfirm={() => {
          if (reviewing) {
            void toastResult(reviewFaq(reviewing.id, currentUser), "Marked as reviewed", "Not reviewed");
          }
          setReviewing(null);
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this draft FAQ?"
        description={deleting ? `“${deleting.question}” will be permanently removed.` : ""}
        confirmLabel="Delete FAQ"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            void toastResult(deleteFaq(deleting.id, currentUser), "FAQ deleted", "Not deleted");
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
