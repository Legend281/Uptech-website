import type { Lead, JobPosting } from "./types";

/*
 * Common words that would overlap between almost any lead message and any
 * job posting without meaning anything — filtered out so a shared word like
 * "the" or "looking" never counts as a real signal.
 */
const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "have",
  "from",
  "your",
  "you",
  "are",
  "was",
  "were",
  "will",
  "would",
  "could",
  "should",
  "been",
  "being",
  "about",
  "into",
  "also",
  "just",
  "more",
  "some",
  "such",
  "than",
  "then",
  "them",
  "they",
  "their",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "how",
  "can",
  "get",
  "got",
  "looking",
  "interested",
  "job",
  "jobs",
  "role",
  "roles",
  "work",
  "hello",
  "hi",
  "hey",
  "dear",
  "team",
  "please",
  "thank",
  "thanks",
  "regards",
  "sincerely",
]);

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9+]+/)
      .filter((word) => word.length >= 3 && !STOPWORDS.has(word)),
  );
}

/**
 * A lightweight keyword-overlap heuristic, not real search — a job-seeker
 * lead's only free-text signal for "what field" is their message (the
 * `service` value is always the single generic "career-marketing," not
 * per-role), so this counts significant words shared with a posting's
 * title/department/description. A starting point, same spirit as
 * leadScore.ts's own heuristic: reasonable, not authoritative, easy to
 * retune once there's real data on which matches actually convert. Never
 * treat a zero score as "nothing here for this person" — it just means the
 * wording didn't overlap, not that no role fits.
 */
export function matchScore(lead: Lead, posting: JobPosting): number {
  const leadWords = extractKeywords(lead.message);
  const postingWords = extractKeywords(`${posting.title} ${posting.department} ${posting.description}`);
  let score = 0;
  for (const word of leadWords) {
    if (postingWords.has(word)) score += 1;
  }
  return score;
}

/** Only ever meaningful for a job-seeker lead against currently published postings — a business/general lead has no "role" to match, and a draft/closed posting isn't something to point anyone toward. */
export function findMatchingPostings(lead: Lead, postings: JobPosting[]): JobPosting[] {
  if (lead.type !== "job-seeker") return [];
  return postings
    .filter((posting) => posting.status === "published")
    .map((posting) => ({ posting, score: matchScore(lead, posting) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ posting }) => posting);
}
