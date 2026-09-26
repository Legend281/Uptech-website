import type { Lead, LeadStatus } from "./types";

/*
 * Two independent clocks, not one — see the "two-clock" discussion this is
 * built from. A lead can pass the response-time test on day one and still
 * die quietly in "Contacted" for weeks with nobody noticing; those are
 * different failure modes and need different signals.
 */

/** Confirmed, locked commitment — see app/contact/page.tsx's FAQ and lib/admin/register.ts. */
const RESPONSE_SLA_HOURS = 24;

/**
 * No public commitment exists for these — genuinely a team call, not a
 * design decision. Defaults chosen as a reasonable starting point; treat
 * as easy to retune, not settled.
 */
const STAGE_AGING_THRESHOLD_DAYS: Partial<Record<LeadStatus, number>> = {
  contacted: 5,
  qualified: 5,
  "consultation-booked": 10,
};

/**
 * Same ratio staleness.ts's getReviewStatus already uses for a compliance
 * page's "due soon" window (the last 30 of a 180-day cadence = 1/6) —
 * reused here so a lead gets a heads-up before it breaches its SLA, not
 * only a badge once it's already too late to hit the commitment.
 */
const WARNING_RATIO = 1 / 6;

export type ResponseClock = {
  /** Has this lead ever been contacted? */
  contacted: boolean;
  hoursSinceCreated: number;
  overdue: boolean;
  /** Not yet contacted, not yet overdue, but inside the final 1/6 of the response window. */
  dueSoon: boolean;
};

export function getResponseClock(lead: Lead, now: Date = new Date()): ResponseClock {
  const hoursSinceCreated = (now.getTime() - new Date(lead.createdAt).getTime()) / 3_600_000;
  const contacted = Boolean(lead.firstContactedAt);
  const overdue = !contacted && hoursSinceCreated > RESPONSE_SLA_HOURS;
  const dueSoon = !contacted && !overdue && hoursSinceCreated >= RESPONSE_SLA_HOURS * (1 - WARNING_RATIO);
  return { contacted, hoursSinceCreated, overdue, dueSoon };
}

export type StageClock = {
  daysInStatus: number;
  thresholdDays: number | null;
  stale: boolean;
  /** Inside the final 1/6 of the stage-aging threshold, but not stale yet. */
  dueSoon: boolean;
};

export function getStageClock(lead: Lead, now: Date = new Date()): StageClock {
  const daysInStatus = (now.getTime() - new Date(lead.statusChangedAt).getTime()) / 86_400_000;
  const thresholdDays = STAGE_AGING_THRESHOLD_DAYS[lead.status] ?? null;
  const stale = thresholdDays !== null && daysInStatus > thresholdDays;
  const dueSoon = thresholdDays !== null && !stale && daysInStatus >= thresholdDays * (1 - WARNING_RATIO);
  return { daysInStatus, thresholdDays, stale, dueSoon };
}

export function isLeadStale(lead: Lead, now: Date = new Date()): boolean {
  return getResponseClock(lead, now).overdue || getStageClock(lead, now).stale;
}

/**
 * Predictive counterpart to isLeadStale — true only while a lead is still
 * technically on-track but closing in on breaching one of its two clocks,
 * so staff get a heads-up instead of finding out only once it's already
 * too late to hit the commitment. Never true at the same time as
 * isLeadStale: each clock's own dueSoon is defined as "not yet overdue/stale."
 */
export function isLeadDueSoon(lead: Lead, now: Date = new Date()): boolean {
  return getResponseClock(lead, now).dueSoon || getStageClock(lead, now).dueSoon;
}

export type LeadUrgency = "on-track" | "due-soon" | "overdue";

export function getLeadUrgency(lead: Lead, now: Date = new Date()): LeadUrgency {
  if (isLeadStale(lead, now)) return "overdue";
  if (isLeadDueSoon(lead, now)) return "due-soon";
  return "on-track";
}

/*
 * The one human-readable line covering every state this file tracks — the
 * single source the Leads table, its mobile cards, and the dashboard
 * register all read, so a wording change never has to happen in more than
 * one place. Takes the status's display label as a parameter rather than
 * looking it up itself: that lookup (severityMeta, in register.ts) already
 * imports isLeadStale from this file, so reaching back for it here would be
 * a circular import.
 */
export function leadUrgencyReason(lead: Lead, statusLabel: string, now: Date = new Date()): string | null {
  const response = getResponseClock(lead, now);
  if (response.overdue) return "Overdue — not yet contacted";
  if (response.dueSoon) {
    const hoursLeft = Math.max(1, Math.ceil(RESPONSE_SLA_HOURS - response.hoursSinceCreated));
    return `${hoursLeft}h left to make first contact`;
  }

  const stage = getStageClock(lead, now);
  if (stage.stale) return `Stuck ${Math.round(stage.daysInStatus)}d in "${statusLabel}"`;
  if (stage.dueSoon && stage.thresholdDays !== null) {
    const daysLeft = Math.max(1, Math.ceil(stage.thresholdDays - stage.daysInStatus));
    return `Due soon — ${daysLeft}d left in "${statusLabel}"`;
  }

  return null;
}
