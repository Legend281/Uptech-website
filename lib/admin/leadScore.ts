import type { Lead, LeadSource } from "./types";
import { getResponseClock } from "./leadStaleness";

export type LeadTemperature = "hot" | "warm" | "cold";

const HIGH_INTENT_SOURCES: LeadSource[] = ["referral", "whatsapp", "manual-phone", "manual-email", "manual-other"];

/*
 * A heuristic score, not a client-specified formula — the weights below are
 * a reasonable starting point, not an authoritative model, and should be
 * easy to retune once there's real conversion data to check them against
 * (same spirit as leadStaleness.ts's stage-aging thresholds).
 *
 * +2 high-intent source — a referral or a direct call/WhatsApp/email means
 *    a human already engaged, versus a passive website form.
 * +1 a specific, real service selected, rather than "other"/ambiguous.
 * +2 contacted within the 24h response commitment.
 * +1 not yet contacted, but still inside that 24h window — still fresh.
 * -2 not yet contacted and past the window — actively cooling.
 */
export function scoreLead(lead: Lead, now: Date = new Date()): number {
  let score = 0;
  if (HIGH_INTENT_SOURCES.includes(lead.source)) score += 2;
  if (lead.service !== "other") score += 1;

  if (lead.firstContactedAt) {
    const hoursToContact = (new Date(lead.firstContactedAt).getTime() - new Date(lead.createdAt).getTime()) / 3_600_000;
    score += hoursToContact <= 24 ? 2 : 0;
  } else {
    score += getResponseClock(lead, now).overdue ? -2 : 1;
  }

  return score;
}

/** Only meaningful for a lead still being pursued — won/lost are already resolved outcomes, so callers should skip this for closed leads rather than score them. */
export function leadTemperature(lead: Lead, now: Date = new Date()): LeadTemperature {
  const score = scoreLead(lead, now);
  if (score >= 4) return "hot";
  if (score >= 1) return "warm";
  return "cold";
}
