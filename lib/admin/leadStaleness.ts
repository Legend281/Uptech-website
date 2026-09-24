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

export type ResponseClock = {
  /** Has this lead ever been contacted? */
  contacted: boolean;
  hoursSinceCreated: number;
  overdue: boolean;
};

export function getResponseClock(lead: Lead, now: Date = new Date()): ResponseClock {
  const hoursSinceCreated = (now.getTime() - new Date(lead.createdAt).getTime()) / 3_600_000;
  return {
    contacted: Boolean(lead.firstContactedAt),
    hoursSinceCreated,
    overdue: !lead.firstContactedAt && hoursSinceCreated > RESPONSE_SLA_HOURS,
  };
}

export type StageClock = {
  daysInStatus: number;
  thresholdDays: number | null;
  stale: boolean;
};

export function getStageClock(lead: Lead, now: Date = new Date()): StageClock {
  const daysInStatus = (now.getTime() - new Date(lead.statusChangedAt).getTime()) / 86_400_000;
  const thresholdDays = STAGE_AGING_THRESHOLD_DAYS[lead.status] ?? null;
  return { daysInStatus, thresholdDays, stale: thresholdDays !== null && daysInStatus > thresholdDays };
}

export function isLeadStale(lead: Lead, now: Date = new Date()): boolean {
  return getResponseClock(lead, now).overdue || getStageClock(lead, now).stale;
}
