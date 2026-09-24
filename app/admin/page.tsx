"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { RegisterList } from "@/components/admin/RegisterList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { CompletionModal } from "@/components/admin/CompletionModal";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { Sparkline } from "@/components/admin/Sparkline";
import { SegmentedBar, BarLegend, type BarSegment } from "@/components/admin/SegmentedBar";
import { useLeads } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useActivity, useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useServicePages, useServicePageActions } from "@/components/admin/providers/ServicePagesProvider";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { getReviewStatus, type ReviewStatus } from "@/lib/admin/staleness";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import {
  buildRegister,
  countCreatedWithinDays,
  countByStatusWithinDays,
  countCreatedInRange,
  countByStatusInRange,
  dailyCreatedCounts,
  dailyStatusChangeCounts,
  severityMeta,
  leadStatusToSeverity,
  type RegisterRow,
} from "@/lib/admin/register";
import { leadStatusChartColor, reviewStatusChartColor } from "@/lib/admin/chartColors";
import { buildDashboardInsight } from "@/lib/admin/insight";
import { departmentLabels } from "@/lib/admin/labels";
import type { Lead, ServicePageMeta, Department, LeadStatus } from "@/lib/admin/types";

/** Soft, layered elevation — a hairline border plus a very low, wide shadow reads as "lifted" without a hard drop-shadow edge. */
const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

const PIPELINE_STATUS_ORDER: LeadStatus[] = ["needs-triage", "new", "contacted", "qualified", "consultation-booked", "won", "lost"];
const REVIEW_STATUS_ORDER: ReviewStatus[] = ["on-track", "due-soon", "overdue"];

const statGridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

type Scope = "mine" | "all";

/** Unrouted leads have no owning department yet, so they stay visible in every scoped view — hiding them would recreate the exact invisible-inquiry problem "needs-triage" exists to prevent. */
function scopeLeads(leads: Lead[], scope: Scope, department: Department): Lead[] {
  if (scope === "all") return leads;
  return leads.filter((lead) => lead.department === department || lead.department === undefined);
}

function scopePages(pages: ServicePageMeta[], scope: Scope, department: Department): ServicePageMeta[] {
  if (scope === "all") return pages;
  return pages.filter((page) => page.department === department);
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function TrendBadge({ current, previous, unit }: { current: number; previous: number; unit: string }) {
  if (previous === 0 && current === 0) return null;

  if (previous === 0) {
    return (
      <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-teal-600">
        <MaterialIcon name="auto_awesome" className="text-[12px]" />
        New
      </span>
    );
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) {
    return <span className="shrink-0 text-[11px] font-semibold text-slate-400">Flat {unit}</span>;
  }

  const positive = pct > 0;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold tabular-nums ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      <MaterialIcon name={positive ? "arrow_upward" : "arrow_downward"} className="text-[12px]" />
      {Math.abs(pct)}% {unit}
    </span>
  );
}

function StatCard({
  icon,
  tint,
  accentClass,
  value,
  label,
  sublabel,
  trend,
  chart,
}: {
  icon: string;
  tint: string;
  accentClass: string;
  value: number;
  label: string;
  sublabel?: string;
  trend?: ReactNode;
  chart?: ReactNode;
}) {
  return (
    <motion.div
      variants={statCardVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`rounded-xl border border-t-[3px] border-slate-200 bg-white p-3 sm:p-4 ${accentClass} ${CARD_ELEVATION}`}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${tint}`}>
          <MaterialIcon name={icon} className="text-[15px] sm:text-[17px]" />
        </span>
        <span className="truncate text-[10.5px] font-bold uppercase leading-tight tracking-wide text-slate-600 sm:text-xs">
          {label}
        </span>
      </div>
      {/* Proportional figures, not tabular-nums — this is a display-size headline number, not a column that needs digit alignment. */}
      <p className="mt-2.5 font-sans text-2xl font-extrabold leading-none text-navy-950 sm:mt-3 sm:text-[28px]">
        <AnimatedNumber value={value} />
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">{sublabel ?? " "}</p>
        {trend}
      </div>
      {chart && <div className="mt-3">{chart}</div>}
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const leads = useLeads();
  const currentUser = useCurrentUser();
  const activity = useActivity();
  const logActivity = useLogActivity();
  const servicePages = useServicePages();
  const { resolveReview, escalateReview } = useServicePageActions();
  const [scope, setScope] = useState<Scope>("mine");

  const scopedLeads = scopeLeads(leads, scope, currentUser.department);
  const scopedPages = scopePages(servicePages, scope, currentUser.department);

  const totalLeads = scopedLeads.length;
  const newLeadsThisWeek = countCreatedWithinDays(scopedLeads, 7);
  const newLeadsLastWeek = countCreatedInRange(scopedLeads, 14, 7);
  const bookedOrWonThisMonth = countByStatusWithinDays(scopedLeads, ["consultation-booked", "won"], 30);
  const bookedOrWonLastMonth = countByStatusInRange(scopedLeads, ["consultation-booked", "won"], 60, 30);
  const overdueCount = scopedPages.filter((page) => getReviewStatus(page) === "overdue").length;
  const dueSoonCount = scopedPages.filter((page) => getReviewStatus(page) === "due-soon").length;
  const needsReviewCount = overdueCount + dueSoonCount;

  const newLeadsSharePct = totalLeads > 0 ? Math.round((newLeadsThisWeek / totalLeads) * 100) : 0;

  const complianceSublabel =
    needsReviewCount === 0
      ? "All reviews current"
      : [overdueCount > 0 ? `${overdueCount} overdue` : null, dueSoonCount > 0 ? `${dueSoonCount} due soon` : null]
          .filter(Boolean)
          .join(", ");

  const rows = buildRegister(scopedLeads, scopedPages);
  const staleCount = rows.filter((row) => row.kind === "lead" && row.isStale).length;
  const insight = buildDashboardInsight(scopedLeads, newLeadsThisWeek, newLeadsLastWeek, staleCount);

  /*
   * No real email/notification channel exists yet for this — no staff email
   * field on AdminUser, no wired Resend call for internal use (only the
   * public contact form uses Resend). What IS real: a persisted, shared
   * Activity entry, which functions as the actual in-app paper trail the
   * spec asked for, plus a toast for the person who clicked it.
   */
  function handleSendReminder(row: RegisterRow) {
    const assignee = MOCK_ADMIN_USERS.find((user) => user.id === row.assignedToId);
    const assigneeName = assignee?.name ?? "the assignee";
    const lead = leads.find((candidate) => candidate.id === row.id);
    const lastTouched = lead ? formatRelativeTime(lead.statusChangedAt) : "a while ago";
    logActivity({
      icon: "notifications_active",
      description: `Reminder sent to ${assigneeName} re: ${row.title} — no activity in 5+ days (last touched ${lastTouched}).`,
      relatedHref: row.href,
    });
    toast.success("Reminder sent", { description: `${assigneeName} has been notified about ${row.title}.` });
  }

  const [resolvingPageId, setResolvingPageId] = useState<string | null>(null);
  const resolvingPage = scopedPages.find((page) => page.id === resolvingPageId) ?? null;

  function handleResolveSubmit({ completedAt, notes }: { completedAt: string; notes: string }) {
    if (!resolvingPage) return;
    resolveReview(resolvingPage.id, { completedAt, notes }, currentUser.name);
    logActivity({
      icon: "check_circle",
      description: `${currentUser.name} resolved ${resolvingPage.title}: ${notes}`,
      relatedHref: resolvingPage.url,
    });
    toast.success("Marked complete", { description: `${resolvingPage.title}'s review is now current.` });
    setResolvingPageId(null);
  }

  /*
   * No modal, per spec — a team lead can't act on this from wherever they
   * are right now, so the only honest response is to hand it to someone who
   * can and say so, not pretend the item itself is resolved.
   */
  function handleEscalate(row: RegisterRow) {
    const page = scopedPages.find((candidate) => candidate.id === row.id);
    if (!page) return;
    const lead = MOCK_ADMIN_USERS.find((user) => user.department === page.department && user.role === "administrator");
    if (!lead) return;
    escalateReview(page.id, lead.id);
    logActivity({
      icon: "priority_high",
      description: `${currentUser.name} escalated ${page.title} to ${lead.name}`,
      relatedHref: page.url,
    });
    toast.success("Escalated", { description: `${lead.name} has been assigned and notified.` });
  }

  const pipelineSegments: BarSegment[] = PIPELINE_STATUS_ORDER.map((status) => ({
    key: status,
    label: severityMeta[leadStatusToSeverity[status]].label,
    count: scopedLeads.filter((lead) => lead.status === status).length,
    colorClass: leadStatusChartColor[status],
  }));

  const reviewSegments: BarSegment[] = REVIEW_STATUS_ORDER.map((status) => ({
    key: status,
    label: severityMeta[status].label,
    count: scopedPages.filter((page) => getReviewStatus(page) === status).length,
    colorClass: reviewStatusChartColor[status],
  }));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-extrabold tracking-tight text-navy-950 sm:text-2xl">
            {getGreeting(new Date().getHours())}, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s moving {scope === "all" ? "across both departments" : `in ${departmentLabels[currentUser.department]}`} today.
          </p>
          {insight && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-teal-700">
              <MaterialIcon name="auto_awesome" className="text-[14px]" />
              {insight}
            </p>
          )}
        </div>
        <div
          className="flex items-center gap-0.5 self-start rounded-lg border border-slate-200 bg-slate-100 p-0.5 sm:self-auto"
          role="tablist"
          aria-label="Dashboard scope"
        >
          <button
            type="button"
            role="tab"
            aria-selected={scope === "mine"}
            onClick={() => setScope("mine")}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              scope === "mine" ? "bg-white text-navy-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {departmentLabels[currentUser.department]}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === "all"}
            onClick={() => setScope("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              scope === "all" ? "bg-white text-navy-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Departments
          </button>
        </div>
      </div>

      <motion.div variants={statGridVariants} initial="hidden" animate="show" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon="inbox"
          tint="bg-blue-accent/10 text-blue-accent"
          accentClass="border-t-blue-accent"
          value={totalLeads}
          label="Leads"
          sublabel={scope === "all" ? "Across both departments" : "Includes unrouted leads"}
          chart={<Sparkline data={dailyCreatedCounts(scopedLeads, 14)} strokeClassName="stroke-blue-accent" fillClassName="fill-blue-accent/10" />}
        />
        <StatCard
          icon="bolt"
          tint="bg-teal-50 text-teal-600"
          accentClass="border-t-teal-500"
          value={newLeadsThisWeek}
          label="New this week"
          sublabel={`${newLeadsSharePct}% of all leads`}
          trend={<TrendBadge current={newLeadsThisWeek} previous={newLeadsLastWeek} unit="vs last wk" />}
          chart={<Sparkline data={dailyCreatedCounts(scopedLeads, 7)} strokeClassName="stroke-teal-500" fillClassName="fill-teal-500/10" />}
        />
        <StatCard
          icon="task_alt"
          tint="bg-emerald-50 text-emerald-600"
          accentClass="border-t-emerald-500"
          value={bookedOrWonThisMonth}
          label="Booked or won"
          sublabel="This month"
          trend={<TrendBadge current={bookedOrWonThisMonth} previous={bookedOrWonLastMonth} unit="vs last mo" />}
          chart={
            <Sparkline
              data={dailyStatusChangeCounts(scopedLeads, ["consultation-booked", "won"], 30)}
              strokeClassName="stroke-emerald-500"
              fillClassName="fill-emerald-500/10"
            />
          }
        />
        <StatCard
          icon="gavel"
          tint={needsReviewCount > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}
          accentClass={needsReviewCount > 0 ? "border-t-amber-500" : "border-t-emerald-500"}
          value={needsReviewCount}
          label="Need review"
          sublabel={complianceSublabel}
          chart={<SegmentedBar segments={reviewSegments} size="sm" />}
        />
      </motion.div>

      <div className={`mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${CARD_ELEVATION}`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-sans text-sm font-bold text-navy-950">Pipeline Breakdown</h2>
          <span className="text-xs font-semibold tabular-nums text-slate-500">{totalLeads} leads</span>
        </div>
        <div className="mt-4">
          <SegmentedBar segments={pipelineSegments} />
          <BarLegend segments={pipelineSegments} emptyLabel="No leads in this scope yet." />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RegisterList
            rows={rows}
            onSendReminder={handleSendReminder}
            onResolve={(row) => setResolvingPageId(row.id)}
            onEscalate={handleEscalate}
          />
        </div>
        <div>
          <ActivityLog entries={activity} />
        </div>
      </div>

      <CompletionModal
        open={resolvingPage !== null}
        title={resolvingPage ? `Resolve ${resolvingPage.title}` : ""}
        description={resolvingPage ? `This records that the review actually happened — it resets the ${resolvingPage.reviewCadenceDays}-day cycle from the completion date below.` : undefined}
        notesLabel="What was filed or reviewed?"
        confirmLabel="Mark Complete"
        onCancel={() => setResolvingPageId(null)}
        onConfirm={handleResolveSubmit}
      />
    </>
  );
}
