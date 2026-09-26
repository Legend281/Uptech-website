"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useLeads, useLeadActions } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { LeadFormDialog } from "@/components/admin/LeadFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LeadRowActions } from "@/components/admin/LeadRowActions";
import { LeadQuickViewModal } from "@/components/admin/LeadQuickViewModal";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { SegmentedBar, BarLegend, type BarSegment } from "@/components/admin/SegmentedBar";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { departmentLabels } from "@/lib/admin/labels";
import { useStaff } from "@/components/admin/providers/StaffProvider";
import { severityMeta, leadStatusToSeverity, URGENCY_RANK, getLeadServiceLabel } from "@/lib/admin/register";
import { isLeadStale, isLeadDueSoon, getLeadUrgency, leadUrgencyReason } from "@/lib/admin/leadStaleness";
import { findDuplicateLeads } from "@/lib/admin/duplicateLeads";
import { downloadLeadsCSV } from "@/lib/admin/exportLeads";
import { leadStatusChartColor, LEAD_PIPELINE_ORDER } from "@/lib/admin/chartColors";
import type { Lead, LeadStatus, Department } from "@/lib/admin/types";

const PAGE_SIZE = 8;
const CLOSED_STATUSES: LeadStatus[] = ["won", "lost"];
const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

const departmentFilters: { value: Department | "unassigned" | "all"; label: string }[] = [
  { value: "all", label: "All departments" },
  { value: "career-services-operations", label: departmentLabels["career-services-operations"] },
  { value: "business-formalisation-compliance", label: departmentLabels["business-formalisation-compliance"] },
  { value: "unassigned", label: "Not yet triaged" },
];

const typeIcon: Record<Lead["type"], string> = { "job-seeker": "work", business: "apartment", general: "help" };

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

/** Thin wrapper around leadStaleness.ts's shared helper — supplies the pretty status label the shared function can't look up itself (see its own comment on why). */
function urgencyReason(lead: Lead): string | null {
  return leadUrgencyReason(lead, severityMeta[leadStatusToSeverity[lead.status]].label);
}

function LeadIdentity({ lead, isDuplicate }: { lead: Lead; isDuplicate?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${avatarTint(lead.name)}`}>
        {initialsOf(lead.name)}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name={typeIcon[lead.type]} className="shrink-0 text-[13px] text-slate-400" />
          <p className="truncate font-sans text-sm font-semibold text-navy-950">{lead.name}</p>
          {lead.language === "French" && (
            <span className="shrink-0 rounded border border-slate-200 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-slate-500">
              FR
            </span>
          )}
          {isDuplicate && (
            <span title="Shares an email or phone number with another lead" className="shrink-0">
              <MaterialIcon name="content_copy" className="text-[13px] text-violet-500" />
            </span>
          )}
        </div>
        {lead.company && <p className="truncate text-xs text-slate-400">{lead.company}</p>}
      </div>
    </div>
  );
}

function ActivityCell({ lead }: { lead: Lead }) {
  const reason = urgencyReason(lead);
  const overdue = isLeadStale(lead);
  return reason ? (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold ${overdue ? "text-amber-700" : "text-sky-700"}`}>
      <MaterialIcon name={overdue ? "warning" : "schedule"} className="text-[13px]" />
      {reason}
    </span>
  ) : (
    <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">{formatRelativeTime(lead.createdAt)}</span>
  );
}

/** Mobile card row — unchanged from the verified mobile pass; the table below is desktop/tablet only. */
function LeadCard({ lead, isDuplicate }: { lead: Lead; isDuplicate?: boolean }) {
  const meta = severityMeta[leadStatusToSeverity[lead.status]];
  const reason = urgencyReason(lead);
  const overdue = isLeadStale(lead);

  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`flex items-center gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500 ${meta.stripe}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarTint(lead.name)}`}>
        {initialsOf(lead.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name={typeIcon[lead.type]} className="shrink-0 text-[14px] text-slate-400" />
          <p className="truncate font-sans text-sm font-semibold text-navy-950">
            {lead.name}
            {lead.company && <span className="font-normal text-slate-500"> · {lead.company}</span>}
          </p>
          {lead.language === "French" && (
            <span className="shrink-0 rounded border border-slate-200 px-1 py-px text-[9.5px] font-bold uppercase tracking-wide text-slate-500">
              FR
            </span>
          )}
          {isDuplicate && (
            <span title="Shares an email or phone number with another lead" className="shrink-0">
              <MaterialIcon name="content_copy" className="text-[13px] text-violet-500" />
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>
            {meta.label}
          </span>
          <p className="truncate text-xs text-slate-500">{getLeadServiceLabel(lead.service)}</p>
        </div>
        <p className="mt-1">
          {reason ? (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${overdue ? "text-amber-700" : "text-sky-700"}`}>
              <MaterialIcon name={overdue ? "warning" : "schedule"} className="text-[13px]" />
              {reason}
            </span>
          ) : (
            <span className="text-xs tabular-nums text-slate-500">{formatRelativeTime(lead.createdAt)}</span>
          )}
        </p>
      </div>
      <MaterialIcon name="chevron_right" className="shrink-0 text-[18px] text-slate-300" />
    </Link>
  );
}

export default function LeadsPage() {
  const leads = useLeads();
  const { claimLead, deleteLead } = useLeadActions();
  const currentUser = useCurrentUser();
  const staff = useStaff();
  const logActivity = useLogActivity();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [quickViewLeadId, setQuickViewLeadId] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "unassigned" | "all">("all");
  const [showClosed, setShowClosed] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const needsTriageCount = leads.filter((lead) => lead.status === "needs-triage").length;
  const closedCount = leads.filter((lead) => CLOSED_STATUSES.includes(lead.status)).length;
  const staleCount = leads.filter((lead) => isLeadStale(lead) && !CLOSED_STATUSES.includes(lead.status)).length;
  const dueSoonCount = leads.filter((lead) => isLeadDueSoon(lead) && !CLOSED_STATUSES.includes(lead.status)).length;

  // A lead can appear here from either direction of a match (A finds B, or B finds A) — a Set of ids makes membership a simple lookup regardless of which one triggered it.
  const duplicateIds = useMemo(() => {
    const ids = new Set<string>();
    for (const lead of leads) {
      if (findDuplicateLeads(lead, leads).length > 0) ids.add(lead.id);
    }
    return ids;
  }, [leads]);

  // Always the full pipeline, regardless of the table's own "show closed" toggle — this is the at-a-glance overview, a different job from the detailed list below.
  const pipelineSegments: BarSegment[] = LEAD_PIPELINE_ORDER.map((status) => ({
    key: status,
    label: severityMeta[leadStatusToSeverity[status]].label,
    count: leads.filter((lead) => lead.status === status).length,
    colorClass: leadStatusChartColor[status],
  }));

  function toggleStatusFilter(key: string) {
    setStatusFilter((current) => (current === key ? "all" : (key as LeadStatus)));
    resetPage();
  }

  const filtered = leads
    .filter((lead) => (showClosed ? true : !CLOSED_STATUSES.includes(lead.status)) || statusFilter !== "all")
    .filter((lead) => statusFilter === "all" || lead.status === statusFilter)
    .filter((lead) => {
      if (departmentFilter === "all") return true;
      if (departmentFilter === "unassigned") return lead.department === undefined;
      return lead.department === departmentFilter;
    })
    .filter((lead) => {
      if (!query.trim()) return true;
      const haystack = `${lead.name} ${lead.email} ${lead.phone} ${lead.company ?? ""} ${getLeadServiceLabel(lead.service)} ${lead.message}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => {
      const rankDiff = URGENCY_RANK[leadStatusToSeverity[a.status]] - URGENCY_RANK[leadStatusToSeverity[b.status]];
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-sans text-xl font-bold text-navy-950">Leads & Inquiries</h1>
            <p className="mt-1 text-sm text-slate-500">
              <AnimatedNumber value={leads.length} /> total
              {needsTriageCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-violet-700">
                    <AnimatedNumber value={needsTriageCount} /> need triage
                  </span>
                </>
              )}
              {staleCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-amber-700">
                    <AnimatedNumber value={staleCount} /> stale
                  </span>
                </>
              )}
              {dueSoonCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-sky-700">
                    <AnimatedNumber value={dueSoonCount} /> due soon
                  </span>
                </>
              )}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Log a New Lead
          </motion.button>
        </motion.div>

        {/* Same chart language as the Dashboard's Pipeline Breakdown — clicking a segment or legend entry filters the table below exactly like the old status pills did, just sharing one visual system across both pages instead of two. */}
        <motion.div variants={itemVariants} className={`mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${CARD_ELEVATION}`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-sans text-sm font-bold text-navy-950">Pipeline</h2>
            {statusFilter !== "all" ? (
              <button
                type="button"
                onClick={() => toggleStatusFilter(statusFilter)}
                className="flex items-center gap-1 text-xs font-semibold text-navy-950 hover:text-slate-600"
              >
                Filtered: {severityMeta[leadStatusToSeverity[statusFilter]].label}
                <MaterialIcon name="close" className="text-[13px]" />
              </button>
            ) : (
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                <AnimatedNumber value={leads.length} /> leads
              </span>
            )}
          </div>
          <div className="mt-4">
            <SegmentedBar segments={pipelineSegments} activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
            <BarLegend segments={pipelineSegments} emptyLabel="No leads yet." activeKey={statusFilter !== "all" ? statusFilter : null} onSegmentClick={toggleStatusFilter} />
          </div>
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_ELEVATION}`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value as Department | "unassigned" | "all");
                resetPage();
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
            >
              {departmentFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => {
                  setShowClosed(e.target.checked);
                  resetPage();
                }}
                className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
              />
              Show closed ({closedCount})
            </label>
            <button
              type="button"
              onClick={() => downloadLeadsCSV(filtered, staff)}
              disabled={filtered.length === 0}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto"
            >
              <MaterialIcon name="download" className="text-[14px]" />
              Export CSV ({filtered.length})
            </button>
            <label htmlFor={searchId} className="relative sm:w-56">
              <span className="sr-only">Search leads</span>
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
              <MaterialIcon name={leads.length === 0 ? "inbox" : "search_off"} className="text-[32px] text-slate-300" />
              <p>
                {leads.length === 0
                  ? "No leads yet — logged leads and real submissions will show up here."
                  : `Nothing matches ${query ? `"${query}"` : "this filter"}.`}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop / tablet: a real table — dense, sortable-ready, scannable. Tables collapse badly on phones, so this is sm:+ only. */}
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-2.5 sm:px-5">
                      Lead
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Service
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Assigned
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right">
                      Activity
                    </th>
                    <th scope="col" className="w-12 px-3 py-2.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {paged.map((lead) => {
                      const meta = severityMeta[leadStatusToSeverity[lead.status]];
                      const assignedUser = staff.find((user) => user.id === lead.assignedToId);
                      return (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setQuickViewLeadId(lead.id)}
                          className={`cursor-pointer border-b border-l-[3px] border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 ${meta.stripe}`}
                        >
                          <td className="px-4 py-3 sm:px-5">
                            <LeadIdentity lead={lead} isDuplicate={duplicateIds.has(lead.id)} />
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{getLeadServiceLabel(lead.service)}</td>
                          <td className="px-3 py-3">
                            {assignedUser ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[9px] font-bold text-white">
                                  {assignedUser.avatarInitials}
                                </span>
                                {assignedUser.name}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  claimLead(lead.id, currentUser.id);
                                  logActivity({ icon: "person_add", description: `${currentUser.name} claimed ${lead.name}'s inquiry`, relatedHref: `/admin/leads/${lead.id}` });
                                  toast.success("Lead claimed", { description: `You're now the owner of ${lead.name}'s inquiry.` });
                                }}
                                className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 transition-colors hover:border-teal-300 hover:bg-teal-100"
                              >
                                <MaterialIcon name="how_to_reg" className="text-[13px]" />
                                Claim
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <ActivityCell lead={lead} />
                          </td>
                          <td className="px-3 py-3">
                            <LeadRowActions
                              onView={() => setQuickViewLeadId(lead.id)}
                              onEdit={() => setEditingLead(lead)}
                              onDelete={() => setDeletingLead(lead)}
                            />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Mobile: the verified card list */}
              <div className="sm:hidden">
                <AnimatePresence initial={false}>
                  {paged.map((lead) => (
                    <motion.div key={lead.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                      <LeadCard lead={lead} isDuplicate={duplicateIds.has(lead.id)} />
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

      <LeadFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode="create" />
      {editingLead && <LeadFormDialog open={Boolean(editingLead)} onClose={() => setEditingLead(null)} mode="edit" lead={editingLead} />}
      <LeadQuickViewModal leadId={quickViewLeadId} onClose={() => setQuickViewLeadId(null)} />
      <ConfirmDialog
        open={Boolean(deletingLead)}
        title="Delete this lead?"
        description={deletingLead ? `${deletingLead.name}'s record will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Lead"
        onCancel={() => setDeletingLead(null)}
        onConfirm={() => {
          if (deletingLead) {
            deleteLead(deletingLead.id);
            logActivity({ icon: "delete", description: `${currentUser.name} deleted ${deletingLead.name}'s lead record` });
            toast.success("Lead deleted");
          }
          setDeletingLead(null);
        }}
      />
    </>
  );
}
