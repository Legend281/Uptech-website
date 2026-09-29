import type { Department, LeadStatus } from "./types";
import { isLeadStale, isLeadDueSoon } from "./leadStaleness";
import { getReviewStatus } from "./staleness";
import { SITE_URL } from "@/lib/siteUrl";

/*
 * Server-side counterpart to lib/admin/insight.ts's dashboard insights —
 * same underlying rules (isLeadStale/isLeadDueSoon/getReviewStatus), just
 * summed up for an email instead of rendered as chips in the browser. Kept
 * as a separate file rather than reused directly because insight.ts's
 * functions take pre-computed counts (the admin page already knows them
 * from its own state) where this instead computes those counts itself from
 * raw rows, for a route that has no browser session to read them from.
 */

export type DigestLeadRow = {
  department: Department | null;
  status: LeadStatus;
  createdAt: string;
  firstContactedAt: string | null;
  statusChangedAt: string;
};

export type DigestPageRow = {
  department: Department;
  lastReviewedAt: string;
  reviewCadenceDays: number;
  dueSoonDays: number | null;
};

export type DigestCounts = {
  staleLeads: number;
  dueSoonLeads: number;
  overdueCompliance: number;
  dueSoonCompliance: number;
  needsTriage: number;
};

const DEPARTMENT_LABELS: Record<Department, string> = {
  "career-services-operations": "Career Services Operations",
  "business-formalisation-compliance": "Business Formalisation & Compliance",
};

export function computeDigestCounts(leads: DigestLeadRow[], pages: DigestPageRow[], department: Department, now: Date = new Date()): DigestCounts {
  const deptLeads = leads.filter((lead) => lead.department === department);
  const asStalenessInput = (lead: DigestLeadRow) => ({
    status: lead.status,
    createdAt: lead.createdAt,
    firstContactedAt: lead.firstContactedAt ?? undefined,
    statusChangedAt: lead.statusChangedAt,
  });
  const staleLeads = deptLeads.filter((lead) => isLeadStale(asStalenessInput(lead), now)).length;
  const dueSoonLeads = deptLeads.filter((lead) => !isLeadStale(asStalenessInput(lead), now) && isLeadDueSoon(asStalenessInput(lead), now)).length;

  const deptPages = pages.filter((page) => page.department === department);
  const asReviewStatusInput = (page: DigestPageRow) => ({
    lastReviewedAt: page.lastReviewedAt,
    reviewCadenceDays: page.reviewCadenceDays,
    dueSoonDays: page.dueSoonDays ?? undefined,
  });
  const overdueCompliance = deptPages.filter((page) => getReviewStatus(asReviewStatusInput(page), now) === "overdue").length;
  const dueSoonCompliance = deptPages.filter((page) => getReviewStatus(asReviewStatusInput(page), now) === "due-soon").length;

  // Global, not department-scoped — shown to both departments on purpose
  // (see formatDigestText's caller): nobody owns these yet, so it's better
  // surfaced twice than missed by whichever department doesn't happen to
  // check first.
  const needsTriage = leads.filter((lead) => !lead.department).length;

  return { staleLeads, dueSoonLeads, overdueCompliance, dueSoonCompliance, needsTriage };
}

export function digestHasContent(counts: DigestCounts): boolean {
  return counts.staleLeads > 0 || counts.dueSoonLeads > 0 || counts.overdueCompliance > 0 || counts.dueSoonCompliance > 0 || counts.needsTriage > 0;
}

export function formatDigestText(department: Department, counts: DigestCounts): string {
  const lines: string[] = [];
  if (counts.staleLeads > 0) {
    lines.push(`- ${counts.staleLeads} ${counts.staleLeads === 1 ? "lead has" : "leads have"} gone stale and need follow-up.`);
  }
  if (counts.dueSoonLeads > 0) {
    lines.push(`- ${counts.dueSoonLeads} ${counts.dueSoonLeads === 1 ? "lead is" : "leads are"} approaching its SLA window.`);
  }
  if (counts.overdueCompliance > 0) {
    lines.push(`- ${counts.overdueCompliance} compliance ${counts.overdueCompliance === 1 ? "page is" : "pages are"} overdue for review.`);
  }
  if (counts.dueSoonCompliance > 0) {
    lines.push(`- ${counts.dueSoonCompliance} compliance ${counts.dueSoonCompliance === 1 ? "page is" : "pages are"} due for review soon.`);
  }
  if (counts.needsTriage > 0) {
    lines.push(`- ${counts.needsTriage} ${counts.needsTriage === 1 ? "lead needs" : "leads need"} triage (no department assigned yet).`);
  }

  return [`Daily digest — ${DEPARTMENT_LABELS[department]}`, "", ...lines, "", `Open the dashboard: ${SITE_URL}/admin`].join("\n");
}
