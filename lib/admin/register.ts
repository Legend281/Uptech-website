import { serviceOptions } from "@/lib/serviceOptions";
import type { Lead, LeadStatus, LeadServiceValue, ServicePageMeta } from "./types";
import { getReviewStatus, daysSinceReview, type ReviewStatus } from "./staleness";

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
};

export function buildRegister(leads: Lead[], pages: ServicePageMeta[], now: Date = new Date()): RegisterRow[] {
  const leadRows: RegisterRow[] = leads.map((lead) => ({
    id: lead.id,
    kind: "lead",
    severity: leadStatusToSeverity[lead.status],
    title: lead.name,
    detail: [getLeadServiceLabel(lead.service), lead.company].filter(Boolean).join(" · "),
    timestamp: lead.createdAt,
    timeLabel: lead.createdAt,
  }));

  const pageRows: RegisterRow[] = pages.map((page) => {
    const status = getReviewStatus(page, now);
    const days = daysSinceReview(page, now);
    return {
      id: page.id,
      kind: "compliance",
      severity: reviewStatusToSeverity[status],
      title: page.title,
      detail: `${days} day${days === 1 ? "" : "s"} since review`,
      timestamp: page.lastReviewedAt,
      timeLabel: page.lastReviewedAt,
      href: page.url,
    };
  });

  return [...pageRows, ...leadRows].sort((a, b) => {
    const rankDiff = URGENCY_RANK[a.severity] - URGENCY_RANK[b.severity];
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
