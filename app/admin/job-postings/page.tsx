"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { JobPostingFormDialog } from "@/components/admin/JobPostingFormDialog";
import { JobPostingApplicationsModal } from "@/components/admin/JobPostingApplicationsModal";
import { JobPostingRowActions } from "@/components/admin/JobPostingRowActions";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { SegmentedBar, BarLegend, type BarSegment } from "@/components/admin/SegmentedBar";
import { useJobPostings, useJobPostingActions } from "@/components/admin/providers/JobPostingsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { HIRING_DEPARTMENT_NAMES } from "@/lib/hiringDepartments";
import {
  JOB_POSTING_STATUS_ORDER,
  jobPostingStatusMeta,
  jobPostingStatusChartColor,
  isJobPostingStale,
  daysSincePosted,
  daysUntilClosing,
} from "@/lib/admin/jobPostings";
import { buildJobPostingsInsight } from "@/lib/admin/jobPostingInsight";
import type { JobPosting, JobPostingStatus } from "@/lib/admin/types";

const PAGE_SIZE = 8;
const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function PostedCell({ posting }: { posting: JobPosting }) {
  const stale = isJobPostingStale(posting);

  if (posting.closingDate) {
    // Whether the date has passed is a plain fact, independent of status —
    // a draft or closed posting can still have a past closingDate without
    // that being "stale" (isJobPostingStale only warns on a still-published
    // one), but the wording should reflect reality either way rather than
    // showing a confusing negative day count.
    const days = daysUntilClosing(posting);
    const hasClosed = days < 0;
    return (
      <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold ${stale ? "text-amber-700" : "text-slate-500"}`}>
        {stale && <MaterialIcon name="warning" className="text-[13px]" />}
        {hasClosed ? `Closed ${Math.abs(days)}d ago` : `Closes in ${days}d`}
      </span>
    );
  }

  return stale ? (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-amber-700">
      <MaterialIcon name="warning" className="text-[13px]" />
      Open {daysSincePosted(posting)}d
    </span>
  ) : (
    <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">{formatRelativeTime(posting.postedAt)}</span>
  );
}

/** Mobile card — desktop/tablet uses the table below instead. */
function JobPostingCard({
  posting,
  onOpenEdit,
  onOpenApplications,
  onDelete,
}: {
  posting: JobPosting;
  onOpenEdit: () => void;
  onOpenApplications: () => void;
  onDelete: () => void;
}) {
  const meta = jobPostingStatusMeta[posting.status];
  const stale = isJobPostingStale(posting);

  return (
    <div className={`flex items-start gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 last:border-b-0 ${stale ? "border-l-amber-400" : "border-l-transparent"}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <MaterialIcon name="work" className="text-[17px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-navy-950">{posting.title}</p>
        <p className="truncate text-xs text-slate-500">
          {posting.department} · {posting.location}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
          <span className="text-xs text-slate-500">{posting.employmentType}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <PostedCell posting={posting} />
          <button type="button" onClick={onOpenApplications} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
            {posting.applicationsReceived} application{posting.applicationsReceived === 1 ? "" : "s"}
          </button>
        </div>
      </div>
      <JobPostingRowActions posting={posting} onEdit={onOpenEdit} onApplications={onOpenApplications} onDelete={onDelete} />
    </div>
  );
}

export default function JobPostingsPage() {
  const postings = useJobPostings();
  const { deletePosting } = useJobPostingActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPosting, setEditingPosting] = useState<JobPosting | null>(null);
  const [applicationsPosting, setApplicationsPosting] = useState<JobPosting | null>(null);
  const [deletingPosting, setDeletingPosting] = useState<JobPosting | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobPostingStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const publishedCount = postings.filter((p) => p.status === "published").length;
  const staleCount = postings.filter((p) => isJobPostingStale(p)).length;
  const insight = buildJobPostingsInsight(postings);

  function resetPage() {
    setPage(1);
  }

  function toggleStatusFilter(key: string) {
    setStatusFilter((current) => (current === key ? "all" : (key as JobPostingStatus)));
    resetPage();
  }

  const statusSegments: BarSegment[] = JOB_POSTING_STATUS_ORDER.map((status) => ({
    key: status,
    label: jobPostingStatusMeta[status].label,
    count: postings.filter((p) => p.status === status).length,
    colorClass: jobPostingStatusChartColor[status],
  }));

  const filtered = postings
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => departmentFilter === "all" || p.department === departmentFilter)
    .filter((p) => {
      if (!query.trim()) return true;
      const haystack = `${p.title} ${p.department} ${p.location} ${p.description}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => {
      const aStale = isJobPostingStale(a) ? 0 : 1;
      const bStale = isJobPostingStale(b) ? 0 : 1;
      if (aStale !== bStale) return aStale - bStale;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-sans text-xl font-bold text-navy-950">Job Postings</h1>
            <p className="mt-1 text-sm text-slate-500">
              <AnimatedNumber value={postings.length} /> total
              {publishedCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-emerald-700">
                    <AnimatedNumber value={publishedCount} /> published
                  </span>
                </>
              )}
              {staleCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-amber-700">
                    <AnimatedNumber value={staleCount} /> open 45+ days
                  </span>
                </>
              )}
            </p>
            {insight && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-teal-700">
                <MaterialIcon name="auto_awesome" className="text-[14px]" />
                {insight}
              </p>
            )}
            <p className="mt-1.5 text-xs text-slate-400">
              Publishing a posting puts it live on the public Careers page automatically, within about a minute.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-navy-950 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              New Posting
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={`mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${CARD_ELEVATION}`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-sans text-sm font-bold text-navy-950">Status</h2>
            {statusFilter !== "all" ? (
              <button type="button" onClick={() => toggleStatusFilter(statusFilter)} className="flex items-center gap-1 text-xs font-semibold text-navy-950 hover:text-slate-600">
                Filtered: {jobPostingStatusMeta[statusFilter].label}
                <MaterialIcon name="close" className="text-[13px]" />
              </button>
            ) : (
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                <AnimatedNumber value={postings.length} /> postings
              </span>
            )}
          </div>
          <div className="mt-4">
            <SegmentedBar segments={statusSegments} activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
            <BarLegend segments={statusSegments} emptyLabel="No postings yet." activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
          </div>
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_ELEVATION}`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                resetPage();
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
            >
              <option value="all">All departments</option>
              {HIRING_DEPARTMENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label htmlFor={searchId} className="relative sm:ml-auto sm:w-56">
              <span className="sr-only">Search postings</span>
              <MaterialIcon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400" />
              <input
                id={searchId}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
                placeholder="Search…"
                autoComplete="off"
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-slate-500">
              <MaterialIcon name={postings.length === 0 ? "work_history" : "search_off"} className="text-[32px] text-slate-300" />
              <p>{postings.length === 0 ? "No postings yet — create the first one above." : `Nothing matches ${query ? `"${query}"` : "this filter"}.`}</p>
            </div>
          ) : (
            <>
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-2.5 sm:px-5">
                      Posting
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Applications
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right">
                      Posted
                    </th>
                    <th scope="col" className="w-12 px-3 py-2.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {paged.map((posting) => {
                      const meta = jobPostingStatusMeta[posting.status];
                      const stale = isJobPostingStale(posting);
                      return (
                        <motion.tr
                          key={posting.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`border-b border-l-[3px] ${stale ? "border-l-amber-400" : "border-l-transparent"} border-slate-100 last:border-b-0`}
                        >
                          <td className="px-4 py-3 sm:px-5">
                            <p className="truncate font-sans text-sm font-semibold text-navy-950">{posting.title}</p>
                            <p className="truncate text-xs text-slate-500">
                              {posting.department} · {posting.location}
                            </p>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{posting.employmentType}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => setApplicationsPosting(posting)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
                            >
                              <MaterialIcon name="groups" className="text-[14px]" />
                              {posting.applicationsReceived}
                            </button>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <PostedCell posting={posting} />
                          </td>
                          <td className="px-3 py-3">
                            <JobPostingRowActions
                              posting={posting}
                              onEdit={() => setEditingPosting(posting)}
                              onApplications={() => setApplicationsPosting(posting)}
                              onDelete={() => setDeletingPosting(posting)}
                            />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              <div className="sm:hidden">
                <AnimatePresence initial={false}>
                  {paged.map((posting) => (
                    <motion.div key={posting.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                      <JobPostingCard
                        posting={posting}
                        onOpenEdit={() => setEditingPosting(posting)}
                        onOpenApplications={() => setApplicationsPosting(posting)}
                        onDelete={() => setDeletingPosting(posting)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-700">{filtered.length}</span>
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
            </>
          )}
        </motion.section>
      </motion.div>

      <JobPostingFormDialog open={createOpen} onClose={() => setCreateOpen(false)} mode="create" />
      {editingPosting && <JobPostingFormDialog open={Boolean(editingPosting)} onClose={() => setEditingPosting(null)} mode="edit" posting={editingPosting} />}
      <JobPostingApplicationsModal posting={applicationsPosting} onClose={() => setApplicationsPosting(null)} />
      <ConfirmDialog
        open={Boolean(deletingPosting)}
        title="Delete this posting?"
        description={deletingPosting ? `"${deletingPosting.title}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Posting"
        onCancel={() => setDeletingPosting(null)}
        onConfirm={() => {
          if (deletingPosting) {
            deletePosting(deletingPosting.id);
            logActivity({ icon: "delete", description: `${currentUser.name} deleted the ${deletingPosting.title} posting` });
            toast.success("Posting deleted");
          }
          setDeletingPosting(null);
        }}
      />
    </>
  );
}
