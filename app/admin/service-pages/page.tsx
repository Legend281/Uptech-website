"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ServicePageFormDialog } from "@/components/admin/ServicePageFormDialog";
import { ServicePageRowActions } from "@/components/admin/ServicePageRowActions";
import { EscalateServicePageDialog } from "@/components/admin/EscalateServicePageDialog";
import { CompletionModal } from "@/components/admin/CompletionModal";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { SegmentedBar, BarLegend, type BarSegment } from "@/components/admin/SegmentedBar";
import { useServicePages, useServicePageActions } from "@/components/admin/providers/ServicePagesProvider";
import { useStaff } from "@/components/admin/providers/StaffProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { severityMeta } from "@/lib/admin/register";
import { getReviewStatus, daysSinceReview, daysUntilReviewDue, type ReviewStatus } from "@/lib/admin/staleness";
import { reviewStatusChartColor } from "@/lib/admin/chartColors";
import { departmentLabels } from "@/lib/admin/labels";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { Department, ServicePageMeta } from "@/lib/admin/types";

const PAGE_SIZE = 8;
const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";
const REVIEW_STATUS_ORDER: ReviewStatus[] = ["overdue", "due-soon", "on-track"];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function ReviewCell({ page }: { page: ServicePageMeta }) {
  const status = getReviewStatus(page);
  if (status === "overdue") {
    const days = daysSinceReview(page);
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-rose-700">
        <MaterialIcon name="warning" className="text-[13px]" />
        {days}d since review
      </span>
    );
  }
  const days = daysUntilReviewDue(page);
  return (
    <span className={`whitespace-nowrap text-xs tabular-nums ${status === "due-soon" ? "font-semibold text-amber-700" : "text-slate-500"}`}>
      {days}d until due
    </span>
  );
}

/** Mobile card — desktop/tablet uses the table below instead. */
function ServicePageCard({
  page,
  assigneeName,
  onResolve,
  onEscalate,
}: {
  page: ServicePageMeta;
  assigneeName?: string;
  onResolve: () => void;
  onEscalate: () => void;
}) {
  const status = getReviewStatus(page);
  const meta = severityMeta[status];

  return (
    <div className={`flex items-start gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 last:border-b-0 ${meta.stripe}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <MaterialIcon name="gavel" className="text-[17px]" />
      </span>
      <div className="min-w-0 flex-1">
        <Link href={page.url} target="_blank" className="flex w-fit items-center gap-1 truncate font-sans text-sm font-semibold text-navy-950 hover:text-teal-700 hover:underline">
          {page.title}
          <MaterialIcon name="open_in_new" className="shrink-0 text-[12px] text-slate-400" />
        </Link>
        <p className="truncate text-xs text-slate-500">{departmentLabels[page.department]}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
          {assigneeName && <span className="text-xs text-slate-500">→ {assigneeName}</span>}
        </div>
        <div className="mt-1.5">
          <ReviewCell page={page} />
        </div>
      </div>
      <ServicePageRowActions page={page} onResolve={onResolve} onEscalate={onEscalate} />
    </div>
  );
}

export default function ServicePagesPage() {
  const pages = useServicePages();
  const { resolveReview, escalateReview } = useServicePageActions();
  const staff = useStaff();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();

  const [createOpen, setCreateOpen] = useState(false);
  const [resolvingPageId, setResolvingPageId] = useState<string | null>(null);
  const [escalatingPageId, setEscalatingPageId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const overdueCount = pages.filter((p) => getReviewStatus(p) === "overdue").length;
  const dueSoonCount = pages.filter((p) => getReviewStatus(p) === "due-soon").length;

  const statusSegments: BarSegment[] = REVIEW_STATUS_ORDER.map((status) => ({
    key: status,
    label: severityMeta[status].label,
    count: pages.filter((p) => getReviewStatus(p) === status).length,
    colorClass: reviewStatusChartColor[status],
  }));

  function resetPage() {
    setPage(1);
  }

  function toggleStatusFilter(key: string) {
    setStatusFilter((current) => (current === key ? "all" : (key as ReviewStatus)));
    resetPage();
  }

  const filtered = pages
    .filter((p) => statusFilter === "all" || getReviewStatus(p) === statusFilter)
    .filter((p) => departmentFilter === "all" || p.department === departmentFilter)
    .filter((p) => !query.trim() || p.title.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      const rankDiff = REVIEW_STATUS_ORDER.indexOf(getReviewStatus(a)) - REVIEW_STATUS_ORDER.indexOf(getReviewStatus(b));
      if (rankDiff !== 0) return rankDiff;
      return daysSinceReview(b) - daysSinceReview(a);
    });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const resolvingPage = pages.find((p) => p.id === resolvingPageId) ?? null;
  const escalatingPage = pages.find((p) => p.id === escalatingPageId) ?? null;

  function handleResolveSubmit({ completedAt, notes }: { completedAt: string; notes: string }) {
    if (!resolvingPage) return;
    resolveReview(resolvingPage.id, { completedAt, notes }, currentUser.name);
    logActivity({ icon: "check_circle", description: `${currentUser.name} resolved ${resolvingPage.title}: ${notes}`, relatedHref: resolvingPage.url });
    toast.success("Marked complete", { description: `${resolvingPage.title}'s review is now current.` });
    setResolvingPageId(null);
  }

  function handleEscalateConfirm(toUserId: string) {
    if (!escalatingPage) return;
    const assignee = staff.find((user) => user.id === toUserId);
    escalateReview(escalatingPage.id, toUserId);
    logActivity({ icon: "priority_high", description: `${currentUser.name} escalated ${escalatingPage.title} to ${assignee?.name ?? "a staff member"}`, relatedHref: escalatingPage.url });
    toast.success("Escalated", { description: `${assignee?.name ?? "They"} will own getting this resolved.` });
    setEscalatingPageId(null);
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-sans text-xl font-bold text-navy-950">Service Pages</h1>
            <p className="mt-1 text-sm text-slate-500">
              <AnimatedNumber value={pages.length} /> tracked
              {overdueCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-rose-700">
                    <AnimatedNumber value={overdueCount} /> overdue
                  </span>
                </>
              )}
              {dueSoonCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-amber-700">
                    <AnimatedNumber value={dueSoonCount} /> due soon
                  </span>
                </>
              )}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">Review-cadence tracking for Template C (Regulatory/Procedure) pages only.</p>
          </div>
          {currentUser.role === "administrator" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Track a Page
            </motion.button>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className={`mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${CARD_ELEVATION}`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-sans text-sm font-bold text-navy-950">Review Status</h2>
            {statusFilter !== "all" ? (
              <button type="button" onClick={() => toggleStatusFilter(statusFilter)} className="flex items-center gap-1 text-xs font-semibold text-navy-950 hover:text-slate-600">
                Filtered: {severityMeta[statusFilter].label}
                <MaterialIcon name="close" className="text-[13px]" />
              </button>
            ) : (
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                <AnimatedNumber value={pages.length} /> pages
              </span>
            )}
          </div>
          <div className="mt-4">
            <SegmentedBar segments={statusSegments} activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
            <BarLegend segments={statusSegments} emptyLabel="No pages tracked yet." activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
          </div>
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_ELEVATION}`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value as Department | "all");
                resetPage();
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
            >
              <option value="all">All departments</option>
              <option value="business-formalisation-compliance">{departmentLabels["business-formalisation-compliance"]}</option>
              <option value="career-services-operations">{departmentLabels["career-services-operations"]}</option>
            </select>
            <label htmlFor={searchId} className="relative sm:ml-auto sm:w-56">
              <span className="sr-only">Search pages</span>
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
              <MaterialIcon name={pages.length === 0 ? "description" : "search_off"} className="text-[32px] text-slate-300" />
              <p>{pages.length === 0 ? "No pages tracked yet." : `Nothing matches ${query ? `"${query}"` : "this filter"}.`}</p>
            </div>
          ) : (
            <>
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-2.5 sm:px-5">
                      Page
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Reviewed By
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Assigned
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right">
                      Review
                    </th>
                    <th scope="col" className="w-12 px-3 py-2.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {paged.map((p) => {
                      const status = getReviewStatus(p);
                      const meta = severityMeta[status];
                      const assignee = staff.find((user) => user.id === p.assignedToId);
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`border-b border-l-[3px] border-slate-100 last:border-b-0 ${meta.stripe}`}
                        >
                          <td className="px-4 py-3 sm:px-5">
                            <Link
                              href={p.url}
                              target="_blank"
                              className="flex w-fit max-w-full items-center gap-1 truncate font-sans text-sm font-semibold text-navy-950 hover:text-teal-700 hover:underline"
                            >
                              <span className="truncate">{p.title}</span>
                              <MaterialIcon name="open_in_new" className="shrink-0 text-[12px] text-slate-400" />
                            </Link>
                            <p className="truncate text-xs text-slate-400">{departmentLabels[p.department]}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{p.reviewedBy}</td>
                          <td className="px-3 py-3">
                            {assignee ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[9px] font-bold text-white">
                                  {assignee.avatarInitials}
                                </span>
                                {assignee.name}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <ReviewCell page={p} />
                          </td>
                          <td className="px-3 py-3">
                            <ServicePageRowActions page={p} onResolve={() => setResolvingPageId(p.id)} onEscalate={() => setEscalatingPageId(p.id)} />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              <div className="sm:hidden">
                <AnimatePresence initial={false}>
                  {paged.map((p) => (
                    <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <ServicePageCard
                        page={p}
                        assigneeName={staff.find((user) => user.id === p.assignedToId)?.name}
                        onResolve={() => setResolvingPageId(p.id)}
                        onEscalate={() => setEscalatingPageId(p.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
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
            </>
          )}
        </motion.section>
      </motion.div>

      <ServicePageFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <CompletionModal
        open={resolvingPage !== null}
        title={resolvingPage ? `Resolve ${resolvingPage.title}` : ""}
        description={
          resolvingPage
            ? `This records that the review actually happened — it resets the ${resolvingPage.reviewCadenceDays}-day cycle from the completion date below.`
            : undefined
        }
        notesLabel="What was filed or reviewed?"
        confirmLabel="Mark Complete"
        onCancel={() => setResolvingPageId(null)}
        onConfirm={handleResolveSubmit}
      />

      <EscalateServicePageDialog
        open={escalatingPage !== null}
        page={escalatingPage}
        staff={staff}
        onCancel={() => setEscalatingPageId(null)}
        onConfirm={handleEscalateConfirm}
      />
    </>
  );
}
