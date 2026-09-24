import type { ServicePageMeta } from "./types";

export type ReviewStatus = "on-track" | "due-soon" | "overdue";

/**
 * "Due soon" starts 30 days before a page actually goes overdue, so the
 * register gives real lead time rather than only flagging a page the day
 * it lapses.
 */
export function getReviewStatus(page: ServicePageMeta, now: Date = new Date()): ReviewStatus {
  const daysSince = Math.floor((now.getTime() - new Date(page.lastReviewedAt).getTime()) / 86_400_000);
  if (daysSince >= page.reviewCadenceDays) return "overdue";
  if (daysSince >= page.reviewCadenceDays - 30) return "due-soon";
  return "on-track";
}

export function daysSinceReview(page: ServicePageMeta, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(page.lastReviewedAt).getTime()) / 86_400_000);
}

/** Forward-looking counterpart to daysSinceReview — negative once a page is overdue, so callers should only use this for on-track/due-soon items. */
export function daysUntilReviewDue(page: ServicePageMeta, now: Date = new Date()): number {
  return page.reviewCadenceDays - daysSinceReview(page, now);
}
