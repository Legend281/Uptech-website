import type { Lead } from "./types";
import { getLeadServiceLabel } from "./register";

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
  }

  if (clauses.length === 0) return null;
  return `${clauses.join(" — ")}.`;
}
