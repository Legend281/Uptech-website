import type { Lead } from "./types";
import { getLeadServiceLabel, type Severity } from "./register";

const DAY_MS = 86_400_000;

/** Only worth naming a "mostly X" category when it's a real plurality (>50%), not an arbitrary pick from a tied or evenly-spread week. */
function dominantServiceLabel(weeklyLeads: Lead[]): string | null {
  if (weeklyLeads.length === 0) return null;
  const counts = new Map<string, number>();
  for (const lead of weeklyLeads) {
    const label = getLeadServiceLabel(lead.service);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  let topLabel: string | null = null;
  let topCount = 0;
  for (const [label, count] of counts) {
    if (count > topCount) {
      topLabel = label;
      topCount = count;
    }
  }
  return topCount > weeklyLeads.length / 2 ? topLabel : null;
}

/**
 * One computed sentence stitching together numbers the page already tracks
 * (weekly volume change, stale count) — this is the whole point: it must
 * read as observed, not authored, so it can never say something the data
 * doesn't support. Returns null when there's nothing meaningful to say
 * (e.g. a brand-new scope with zero activity), so the caller can hide the
 * line entirely rather than show an empty or vacuous sentence.
 */
export function buildDashboardInsight(
  scopedLeads: Lead[],
  newLeadsThisWeek: number,
  newLeadsLastWeek: number,
  staleCount: number,
  dueSoonCount: number,
  now: Date = new Date(),
): string | null {
  const clauses: string[] = [];

  if (newLeadsThisWeek > 0) {
    let volumeClause: string;
    if (newLeadsLastWeek === 0) {
      volumeClause = `New leads are picking up — ${newLeadsThisWeek} this week`;
    } else {
      const pct = Math.round(((newLeadsThisWeek - newLeadsLastWeek) / newLeadsLastWeek) * 100);
      if (pct > 0) volumeClause = `New leads are up ${pct}% this week`;
      else if (pct < 0) volumeClause = `New leads are down ${Math.abs(pct)}% this week`;
      else volumeClause = "New lead volume is flat this week";
    }

    const weeklyLeads = scopedLeads.filter((lead) => now.getTime() - new Date(lead.createdAt).getTime() < 7 * DAY_MS);
    const dominant = dominantServiceLabel(weeklyLeads);
    clauses.push(dominant ? `${volumeClause}, mostly ${dominant}` : volumeClause);
  }

  if (staleCount > 0) {
    clauses.push(`${staleCount} ${staleCount === 1 ? "lead has" : "leads have"} gone stale and need follow-up`);
  } else if (dueSoonCount > 0) {
    // Only surfaced when nothing has actually breached yet — a stale lead is
    // the more urgent fact and shouldn't share the sentence with a
    // still-on-track prediction.
    const subject = dueSoonCount === 1 ? "lead is approaching its" : "leads are approaching their";
    clauses.push(`${dueSoonCount} ${subject} SLA window and should be prioritized next`);
  }

  if (clauses.length === 0) return null;
  return `${clauses.join(" — ")}.`;
}

export type DashboardInsight = {
  id: string;
  icon: string;
  tone: "urgent" | "warning" | "positive" | "neutral";
  text: string;
  /** Clicking the insight sets this as the register's severity filter, when the concept maps cleanly to one (compliance overdue/due-soon share Severity's namespace with lead statuses — see register.ts). Omitted where it doesn't (e.g. "stale" and "SLA due-soon" are per-row flags, not severities), and the insight just scrolls to the register instead. */
  severityFilter?: Severity;
};

/**
 * The ranked, multi-fact successor to buildDashboardInsight (kept above,
 * unused now but harmless — the single-sentence version this replaced).
 * Same rule: every clause must be something the data actually supports, in
 * priority order (most urgent first), capped so the header never turns
 * into a wall of chips. Returns [] rather than one vacuous "all quiet"
 * card — the caller hides the whole feed when this is empty.
 */
export function buildDashboardInsights(input: {
  scopedLeads: Lead[];
  newLeadsThisWeek: number;
  newLeadsLastWeek: number;
  staleCount: number;
  dueSoonLeadCount: number;
  overdueComplianceCount: number;
  dueSoonComplianceCount: number;
  bookedOrWonThisMonth: number;
  bookedOrWonLastMonth: number;
  now?: Date;
}): DashboardInsight[] {
  const {
    scopedLeads,
    newLeadsThisWeek,
    newLeadsLastWeek,
    staleCount,
    dueSoonLeadCount,
    overdueComplianceCount,
    dueSoonComplianceCount,
    bookedOrWonThisMonth,
    bookedOrWonLastMonth,
    now = new Date(),
  } = input;

  const insights: DashboardInsight[] = [];

  if (staleCount > 0) {
    insights.push({
      id: "stale-leads",
      icon: "warning",
      tone: "urgent",
      text: `${staleCount} ${staleCount === 1 ? "lead has" : "leads have"} gone stale and need follow-up.`,
    });
  }

  if (overdueComplianceCount > 0) {
    insights.push({
      id: "compliance-overdue",
      icon: "gavel",
      tone: "urgent",
      text: `${overdueComplianceCount} compliance ${overdueComplianceCount === 1 ? "review is" : "reviews are"} overdue.`,
      severityFilter: "overdue",
    });
  }

  if (dueSoonComplianceCount > 0) {
    insights.push({
      id: "compliance-due-soon",
      icon: "schedule",
      tone: "warning",
      text: `${dueSoonComplianceCount} compliance ${dueSoonComplianceCount === 1 ? "review" : "reviews"} due soon — plan ahead of the deadline.`,
      severityFilter: "due-soon",
    });
  }

  if (dueSoonLeadCount > 0) {
    insights.push({
      id: "lead-sla-due-soon",
      icon: "hourglass_top",
      tone: "warning",
      text: `${dueSoonLeadCount} ${dueSoonLeadCount === 1 ? "lead is" : "leads are"} approaching its SLA window — prioritize next.`,
    });
  }

  if (newLeadsThisWeek > 0) {
    let volumeClause: string;
    if (newLeadsLastWeek === 0) {
      volumeClause = `New leads are picking up — ${newLeadsThisWeek} this week`;
    } else {
      const pct = Math.round(((newLeadsThisWeek - newLeadsLastWeek) / newLeadsLastWeek) * 100);
      if (pct > 0) volumeClause = `New leads are up ${pct}% this week`;
      else if (pct < 0) volumeClause = `New leads are down ${Math.abs(pct)}% this week`;
      else volumeClause = "New lead volume is flat this week";
    }
    const weeklyLeads = scopedLeads.filter((lead) => now.getTime() - new Date(lead.createdAt).getTime() < 7 * DAY_MS);
    const dominant = dominantServiceLabel(weeklyLeads);
    insights.push({
      id: "lead-volume",
      icon: "trending_up",
      tone: "neutral",
      text: `${dominant ? `${volumeClause}, mostly ${dominant}` : volumeClause}.`,
    });
  }

  if (bookedOrWonThisMonth > 0 && bookedOrWonThisMonth > bookedOrWonLastMonth) {
    insights.push({
      id: "booked-won",
      icon: "task_alt",
      tone: "positive",
      text: `${bookedOrWonThisMonth} booked or won this month — ahead of last month's ${bookedOrWonLastMonth}.`,
    });
  }

  // Most urgent first (push order above already does this), capped so the
  // header stays scannable instead of becoming a second register.
  return insights.slice(0, 4);
}
