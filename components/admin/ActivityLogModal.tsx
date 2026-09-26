"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { dotColor } from "@/components/admin/ActivityLog";
import { useActivity, useActivityActions } from "@/components/admin/providers/ActivityProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";

const PAGE_SIZE = 20;

/**
 * The full, searchable, paginated activity view — opened from the dashboard
 * widget's "View all" button instead of navigating to a separate page.
 * Delete (per-row or all) is Administrator-only — enforced here in the UI
 * (buttons simply don't render for anyone else) and for real at the
 * database level by supabase/008_activity_log.sql's own RLS policy, so
 * hiding the button is a convenience, not the actual security boundary.
 */
export function ActivityLogModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const activity = useActivity();
  const { deleteActivityEntry, clearAllActivity } = useActivityActions();
  const currentUser = useCurrentUser();
  const isAdmin = currentUser.role === "administrator";
  const formId = useId();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const searchId = useId();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setPage(1);
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = activity.filter((entry) => !query.trim() || entry.description.toLowerCase().includes(query.trim().toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
              Activity Log
            </h2>
            <p className="text-xs text-slate-500">
              {activity.length} entr{activity.length === 1 ? "y" : "ies"} — shared across every staff member.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                disabled={activity.length === 0}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MaterialIcon name="delete_sweep" className="text-[14px]" />
                Clear All
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
              <MaterialIcon name="close" className="text-[20px]" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 px-5 py-3">
          <label htmlFor={searchId} className="relative block">
            <span className="sr-only">Search activity</span>
            <MaterialIcon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400" />
            <input
              id={searchId}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search activity…"
              autoComplete="off"
              className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-slate-500">
              <MaterialIcon name={activity.length === 0 ? "history" : "search_off"} className="text-[32px] text-slate-300" />
              <p>{activity.length === 0 ? "Nothing logged yet." : `Nothing matches "${query}".`}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {paged.map((entry) => (
                <li key={entry.id} className="group flex items-start gap-3 px-5 py-3.5">
                  <span className={`relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[entry.icon] ?? "bg-slate-300"}`} />
                  <div className="min-w-0 flex-1">
                    {entry.relatedHref ? (
                      <Link href={entry.relatedHref} onClick={onClose} className="text-sm leading-snug text-slate-700 hover:text-teal-700 hover:underline">
                        {entry.description}
                      </Link>
                    ) : (
                      <p className="text-sm leading-snug text-slate-700">{entry.description}</p>
                    )}
                    <p className="mt-0.5 text-xs text-slate-500">{formatRelativeTime(entry.timestamp)}</p>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setDeletingId(entry.id)}
                      aria-label="Delete this entry"
                      className="shrink-0 rounded-md p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <MaterialIcon name="delete" className="text-[16px]" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-semibold text-slate-700">{filtered.length}</span>
            </p>
            {pageCount > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MaterialIcon name="chevron_left" className="text-[18px]" />
                </button>
                <span className="px-2 text-xs font-semibold tabular-nums text-slate-600">
                  {safePage} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={safePage === pageCount}
                  aria-label="Next page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MaterialIcon name="chevron_right" className="text-[18px]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Delete this entry?"
        description="This activity entry will be permanently removed. This can't be undone."
        confirmLabel="Delete Entry"
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteActivityEntry(deletingId);
            toast.success("Entry deleted");
          }
          setDeletingId(null);
        }}
      />

      <ConfirmDialog
        open={confirmClearAll}
        title="Clear the entire activity log?"
        description={`All ${activity.length} entries will be permanently removed for every staff member. This can't be undone.`}
        confirmLabel="Clear Everything"
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={() => {
          clearAllActivity();
          toast.success("Activity log cleared");
          setConfirmClearAll(false);
        }}
      />
    </div>
  );
}
