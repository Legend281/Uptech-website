import type { LeadStatus } from "./types";
import type { ReviewStatus } from "./staleness";

/*
 * Solid chart-fill colors — a distinct scale from severityMeta's pastel
 * badge/stripe tones (register.ts), which are tuned for small text badges,
 * not adjacent color-block identification. Hue families still match
 * severityMeta 1:1 (violet/needs-triage, sky/new, teal/booked, emerald/won,
 * etc.) so this chart never contradicts a badge shown elsewhere.
 *
 * Validated with the dataviz skill's CVD checker in this exact adjacency
 * order (needs-triage → new → contacted → qualified → booked → won → lost).
 * "contacted" and "lost" are deliberately desaturated slate, not a
 * categorical hue — they're de-emphasis states (quiet/inactive), not
 * identities competing for attention, so the chroma-floor check doesn't
 * apply to them. The one accepted gap: booked (teal-600) and won
 * (emerald-500) sit closer than the normal-vision floor wants, because both
 * already own those exact hues as badges everywhere else in the app —
 * re-hueing either here would fix this chart but break that consistency.
 * Mitigated with the 2px surface gap between segments (SegmentedBar) and
 * always-visible legend text, so no reading depends on the color alone.
 */
export const leadStatusChartColor: Record<LeadStatus, string> = {
  "needs-triage": "bg-violet-500",
  new: "bg-sky-500",
  contacted: "bg-slate-400",
  qualified: "bg-blue-accent",
  "consultation-booked": "bg-teal-600",
  won: "bg-emerald-500",
  lost: "bg-slate-300",
};

/** Validated clean — passes all six CVD/contrast checks in this order (on-track → due-soon → overdue). */
export const reviewStatusChartColor: Record<ReviewStatus, string> = {
  "on-track": "bg-emerald-500",
  "due-soon": "bg-amber-500",
  overdue: "bg-rose-500",
};
