import { serviceOptions } from "@/lib/serviceOptions";
import type { Lead, LeadStatus, LeadServiceValue, ServicePageMeta } from "./types";
import { getReviewStatus, daysSinceReview, daysUntilReviewDue, type ReviewStatus } from "./staleness";
import { isLeadStale } from "./leadStaleness";
import { leadTemperature, type LeadTemperature } from "./leadScore";

const DAY_MS = 86_400_000;

export function countCreatedWithinDays(leads: Lead[], days: number, now: Date = new Date()): number {
  const cutoff = now.getTime() - days * DAY_MS;
  return leads.filter((lead) => new Date(lead.createdAt).getTime() >= cutoff).length;
}

export function countByStatusWithinDays(
  leads: Lead[],
  statuses: LeadStatus[],
  days: number,
  now: Date = new Date(),
): number {
  const cutoff = now.getTime() - days * DAY_MS;
  return leads.filter(
    (lead) => statuses.includes(lead.status) && new Date(lead.createdAt).getTime() >= cutoff,
  ).length;
}

/** Half-open window (fromDaysAgo, toDaysAgo] — e.g. (14, 7) is "the week before last week" — for week-over-week / month-over-month trend comparisons. */
export function countCreatedInRange(leads: Lead[], fromDaysAgo: number, toDaysAgo: number, now: Date = new Date()): number {
  const from = now.getTime() - fromDaysAgo * DAY_MS;
  const to = now.getTime() - toDaysAgo * DAY_MS;
  return leads.filter((lead) => {
    const t = new Date(lead.createdAt).getTime();
    return t >= from && t < to;
  }).length;
}

export function countByStatusInRange(
  leads: Lead[],
  statuses: LeadStatus[],
  fromDaysAgo: number,
  toDaysAgo: number,
  now: Date = new Date(),
): number {
  const from = now.getTime() - fromDaysAgo * DAY_MS;
  const to = now.getTime() - toDaysAgo * DAY_MS;
  return leads.filter((lead) => {
    if (!statuses.includes(lead.status)) return false;
    const t = new Date(lead.createdAt).getTime();
    return t >= from && t < to;
  }).length;
}

/** Oldest-first daily bucket counts for a Sparkline — e.g. days=7 returns [6-days-ago, ..., today]. */
export function dailyCreatedCounts(leads: Lead[], days: number, now: Date = new Date()): number[] {
  const buckets = new Array(days).fill(0);
  for (const lead of leads) {
    const diffDays = Math.floor((now.getTime() - new Date(lead.createdAt).getTime()) / DAY_MS);
    if (diffDays >= 0 && diffDays < days) buckets[days - 1 - diffDays] += 1;
  }
  return buckets;
}

/** Same bucketing, but by statusChangedAt — the accurate event time for "became booked/won", unlike createdAt. */
export function dailyStatusChangeCounts(leads: Lead[], statuses: LeadStatus[], days: number, now: Date = new Date()): number[] {
  const buckets = new Array(days).fill(0);
  for (const lead of leads) {
    if (!statuses.includes(lead.status)) continue;
    const diffDays = Math.floor((now.getTime() - new Date(lead.statusChangedAt).getTime()) / DAY_MS);
    if (diffDays >= 0 && diffDays < days) buckets[days - 1 - diffDays] += 1;
  }
  return buckets;
}

export function getLeadServiceLabel(service: LeadServiceValue): string {
  return serviceOptions.find((option) => option.value === service)?.label ?? "Something else";
}

/**
 * One vocabulary spanning both compliance pages and leads, so a single list
 * can interleave them by real urgency instead of segregating them into two
 * separate sections. Deepened, ink-level colors (not pastel badge
 * backgrounds) — this is a register, not a row of stickers.
 */
export type Severity =
  | "needs-triage"
  | "overdue"
  | "due-soon"
  | "new"
  | "contacted"
  | "qualified"
  | "booked"
  | "won"
  | "on-track"
  | "lost";

export const severityMeta: Record<Severity, { label: string; color: string; stripe: string; badge: string }> = {
  "needs-triage": { label: "Needs triage", color: "text-violet-700", stripe: "border-l-violet-500", badge: "border-violet-200 bg-violet-50 text-violet-700" },
  overdue: { label: "Overdue", color: "text-rose-700", stripe: "border-l-rose-500", badge: "border-rose-200 bg-rose-50 text-rose-700" },
  "due-soon": { label: "Due soon", color: "text-amber-700", stripe: "border-l-amber-500", badge: "border-amber-200 bg-amber-50 text-amber-700" },
  new: { label: "New", color: "text-sky-700", stripe: "border-l-sky-500", badge: "border-sky-200 bg-sky-50 text-sky-700" },
  contacted: { label: "Contacted", color: "text-slate-500", stripe: "border-l-slate-400", badge: "border-slate-200 bg-slate-50 text-slate-600" },
  qualified: { label: "Qualified", color: "text-blue-accent", stripe: "border-l-blue-accent", badge: "border-blue-accent/20 bg-blue-accent/10 text-blue-accent" },
  booked: { label: "Booked", color: "text-teal-600", stripe: "border-l-teal-400", badge: "border-teal-200 bg-teal-50 text-teal-700" },
  won: { label: "Won", color: "text-emerald-700", stripe: "border-l-emerald-500", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "on-track": { label: "On track", color: "text-emerald-700", stripe: "border-l-emerald-500", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  lost: { label: "Lost", color: "text-slate-400", stripe: "border-l-slate-200", badge: "border-slate-200 bg-slate-50 text-slate-400" },
};

export const leadStatusToSeverity: Record<LeadStatus, Severity> = {
  "needs-triage": "needs-triage",
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  "consultation-booked": "booked",
  won: "won",
  lost: "lost",
};

const reviewStatusToSeverity: Record<ReviewStatus, Severity> = {
  overdue: "overdue",
  "due-soon": "due-soon",
  "on-track": "on-track",
};

/**
 * Urgency order for the register. An unrouted lead outranks even overdue
 * compliance: an overdue page is at least known and owned by a department
 * — an unrouted lead risks being invisible to everyone until someone
 * happens to look, which is exactly the failure mode Section 3.11's
 * "needs-triage" state exists to prevent. Legal-risk compliance items
 * outrank fresh leads, which outrank leads already in motion, which
 * outrank closed/healthy items.
 */
export const URGENCY_RANK: Record<Severity, number> = {
  "needs-triage": 0,
  overdue: 1,
  "due-soon": 2,
  new: 3,
  contacted: 4,
  qualified: 5,
  booked: 6,
  won: 7,
  "on-track": 8,
  lost: 9,
};

export type RegisterRow = {
  id: string;
  kind: "lead" | "compliance";
  severity: Severity;
  title: string;
  detail?: string;
  timestamp: string;
  timeLabel: string;
  href?: string;
  /** Only ever true for an open (non-won/lost) lead — see isLeadStale's two-clock model. Drives both sort order here and the stale badge/nudge in RegisterList. */
  isStale?: boolean;
  /** Who owns this item today, if anyone — the reminder action's target for a lead row. */
  assignedToId?: string;
  /** Lead-only: got its department from deriveDepartment automatically, never went through a human resolveTriage call. */
  autoRouted?: boolean;
  /** Lead-only, and only while still open — see leadScore.ts. Undefined for a closed (won/lost) lead or any compliance row. */
  temperature?: LeadTemperature;
};

/**
 * The dashboard register's own ranking, separate from URGENCY_RANK (which
 * LeadsPage's table still uses unchanged): folds a lead's staleness in as
 * its own tier, ahead of a merely-fresh "new" lead, without touching the
 * status badge it's shown with. needs-triage / overdue / due-soon keep the
 * same reasoning as URGENCY_RANK — an unrouted lead or a legal-risk
 * compliance page outranks everything else.
 */
function rowUrgencyTier(row: RegisterRow): number {
  if (row.severity === "needs-triage") return 0;
  if (row.severity === "overdue") return 1;
  if (row.severity === "due-soon") return 2;
  if (row.kind === "lead" && row.isStale) return 3;
  const tier: Partial<Record<Severity, number>> = { new: 4, contacted: 5, qualified: 6, booked: 7, won: 8, lost: 10 };
  return tier[row.severity] ?? 9; // "on-track" (compliance) lands here
}

export function buildRegister(leads: Lead[], pages: ServicePageMeta[], now: Date = new Date()): RegisterRow[] {
  const leadRows: RegisterRow[] = leads.map((lead) => ({
    id: lead.id,
    kind: "lead",
    severity: leadStatusToSeverity[lead.status],
    title: lead.name,
    detail: [getLeadServiceLabel(lead.service), lead.company].filter(Boolean).join(" · "),
    timestamp: lead.createdAt,
    timeLabel: lead.createdAt,
    href: `/admin/leads/${lead.id}`,
    isStale: lead.status !== "won" && lead.status !== "lost" && isLeadStale(lead, now),
    assignedToId: lead.assignedToId,
    autoRouted: lead.department !== undefined && !lead.wasManuallyTriaged,
    temperature: lead.status === "won" || lead.status === "lost" ? undefined : leadTemperature(lead, now),
  }));

  const pageRows: RegisterRow[] = pages.map((page) => {
    const status = getReviewStatus(page, now);
    // Overdue stays backward-looking ("X days since review") — a page already past due needs to know how overdue it is, not a negative countdown. Everything else is reframed forward, so "due soon"/"on track" read as an actionable deadline rather than a stale-sounding age.
    const days = status === "overdue" ? daysSinceReview(page, now) : daysUntilReviewDue(page, now);
    const detail = `${days} day${days === 1 ? "" : "s"} ${status === "overdue" ? "since review" : "until due"}`;
    return {
      id: page.id,
      kind: "compliance",
      severity: reviewStatusToSeverity[status],
      title: page.title,
      detail,
      timestamp: page.lastReviewedAt,
      timeLabel: page.lastReviewedAt,
      href: page.url,
      assignedToId: page.assignedToId,
    };
  });

  return [...pageRows, ...leadRows].sort((a, b) => {
    const rankDiff = rowUrgencyTier(a) - rowUrgencyTier(b);
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
