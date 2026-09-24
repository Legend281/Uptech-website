import type { JobPosting } from "./types";
import { isJobPostingStale } from "./jobPostings";

/**
 * Surfaces what actually needs attention, not a restatement of counts
 * already visible in the stat header — same intent as insight.ts's
 * dashboard version. Returns null when there's nothing worth flagging, so
 * the caller can hide the line entirely.
 */
export function buildJobPostingsInsight(postings: JobPosting[], now: Date = new Date()): string | null {
  const staleCount = postings.filter((posting) => isJobPostingStale(posting, now)).length;
  const draftCount = postings.filter((posting) => posting.status === "draft").length;

  const clauses: string[] = [];
  if (staleCount > 0) {
    clauses.push(`${staleCount} published role${staleCount === 1 ? " has" : "s have"} been open 45+ days — worth a follow-up or closing it out`);
  }
  if (draftCount > 0) {
    clauses.push(`${draftCount} draft${draftCount === 1 ? "" : "s"} still waiting to be published`);
  }

  if (clauses.length === 0) return null;
  return `${clauses.join(" — ")}.`;
}
