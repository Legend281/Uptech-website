import type { JobPosting, JobPostingStatus } from "./types";

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Traineeship"];

export const JOB_POSTING_STATUS_ORDER: JobPostingStatus[] = ["draft", "published", "closed"];

/** Matches severityMeta's badge pattern (register.ts) so a status pill here looks like it belongs to the same app. */
export const jobPostingStatusMeta: Record<JobPostingStatus, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "border-slate-200 bg-slate-50 text-slate-600" },
  published: { label: "Published", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  closed: { label: "Closed", badge: "border-slate-200 bg-slate-50 text-slate-400" },
};

/*
 * Draft and Closed are both deliberately desaturated slate, same reasoning
 * as chartColors.ts's lead-status palette: they're de-emphasis states (not
 * yet live / no longer live), not identities competing for attention next to
 * the one active state. Two different slate steps (400 vs 200), not
 * adjacent ones, so they stay visually distinct from each other despite both
 * being "quiet."
 */
export const jobPostingStatusChartColor: Record<JobPostingStatus, string> = {
  draft: "bg-slate-400",
  published: "bg-emerald-500",
  closed: "bg-slate-200",
};

/**
 * A fixed threshold, not a per-posting deadline field — mirrors
 * leadStaleness.ts's STAGE_AGING_THRESHOLD_DAYS exactly. A manually-entered
 * "expected close date" would just be one more field someone forgets to
 * fill in when rushing to post a role; this needs no input at all. Not
 * Settings-configurable yet because there's no Settings module built —
 * retune this constant directly until there is one.
 */
export const JOB_POSTING_STALE_DAYS = 45;

export function daysSincePosted(posting: JobPosting, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(posting.postedAt).getTime()) / 86_400_000);
}

/** Only meaningful when a real closingDate is set — negative once it's passed. */
export function daysUntilClosing(posting: JobPosting, now: Date = new Date()): number {
  if (!posting.closingDate) return NaN;
  return Math.ceil((new Date(posting.closingDate).getTime() - now.getTime()) / 86_400_000);
}

/**
 * Only a still-open posting can go stale — a closed or draft one isn't
 * sitting there failing to get attention. A posting with a real closingDate
 * (a fixed-duration program with its own stated intake window) is judged
 * against that exact date instead of the generic 45-day guess, which would
 * otherwise be wrong in both directions: falsely stale while the real
 * program is still well within its window, or falsely fresh once its real
 * deadline has already passed.
 */
export function isJobPostingStale(posting: JobPosting, now: Date = new Date()): boolean {
  if (posting.status !== "published") return false;
  if (posting.closingDate) return now.getTime() > new Date(posting.closingDate).getTime();
  return daysSincePosted(posting, now) > JOB_POSTING_STALE_DAYS;
}
