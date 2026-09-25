import type { ServicePageMeta } from "./types";

export type ReviewStatus = "on-track" | "due-soon" | "overdue";

/**
 * "Due soon" starts dueSoonDays (default 30) before a page actually goes
 * overdue, so the register gives real lead time rather than only flagging a
 * page the day it lapses. Both numbers are editable in Settings.
 */
export const DEFAULT_DUE_SOON_DAYS = 30;

export function getReviewStatus(page: ServicePageMeta, now: Date = new Date()): ReviewStatus {
  const daysSince = Math.floor((now.getTime() - new Date(page.lastReviewedAt).getTime()) / 86_400_000);
  if (daysSince >= page.reviewCadenceDays) return "overdue";
  if (daysSince >= page.reviewCadenceDays - (page.dueSoonDays ?? DEFAULT_DUE_SOON_DAYS)) return "due-soon";
  return "on-track";
}

export function daysSinceReview(page: ServicePageMeta, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(page.lastReviewedAt).getTime()) / 86_400_000);
}
