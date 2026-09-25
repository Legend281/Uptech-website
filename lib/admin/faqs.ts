import { serviceOptions } from "@/lib/serviceOptions";
import type { FaqCategory } from "@/lib/faqContent";
import type { AdminUser, Department, FaqItemRecord } from "./types";

/*
 * FAQ Items rules — Admin_Content_Pages_Spec.md Section 3.2. The review gate
 * is enforced a second time in supabase/004_faq_items.sql.
 */

export type FaqInput = Pick<FaqItemRecord, "question" | "answer" | "category">;

/** Who wrote seeded FAQs: they came with the site, not from a dashboard user. */
export const EXISTING_SITE_AUTHOR = "existing-site";

type CategoryMeta = {
  value: FaqCategory;
  label: string;
  /** Where the FAQ shows up. */
  pageLabel: string;
  url: string;
  /** Who manages it. Undefined = Administrators only (the Homepage FAQ is sitewide, not a department's). */
  department?: Department;
  /** Spec 3.2: a direct legal-liability risk if wrong, so a second person must review it. */
  legalReview: boolean;
};

const allCategories: CategoryMeta[] = [
  { value: "general", label: "General", pageLabel: "Homepage", url: "/", legalReview: false },
  {
    value: "career-marketing",
    label: "Career Marketing & Placement Support",
    pageLabel: "Career Marketing page",
    url: "/services/career-marketing-placement",
    department: "career-services-operations",
    legalReview: false,
  },
  {
    value: "business-formalisation-cameroon",
    label: "Business Formalisation — Cameroon",
    pageLabel: "Business Formalisation — Cameroon page",
    url: "/services/business-formalisation-compliance/cameroon",
    department: "business-formalisation-compliance",
    legalReview: false,
  },
  {
    value: "business-formalisation-us",
    label: "Business Formalisation — United States",
    pageLabel: "Business Formalisation — United States page",
    url: "/services/business-formalisation-compliance/united-states",
    department: "business-formalisation-compliance",
    legalReview: false,
  },
  {
    value: "tax-compliance-businesses",
    label: "Tax Compliance — Cameroon",
    pageLabel: "Tax Compliance page",
    url: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
    department: "business-formalisation-compliance",
    legalReview: true,
  },
  {
    value: "cnps-compliance",
    label: "CNPS Compliance — Cameroon",
    pageLabel: "CNPS Compliance page",
    url: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
    department: "business-formalisation-compliance",
    legalReview: true,
  },
];

/*
 * Active services only (spec 0.4): a service category is offered only while
 * its value is in lib/serviceOptions.ts, the site's list of active services.
 * Paused services (IT Consulting, General Contracts & Supplies) aren't in
 * it, so they never appear here and need no code change when paused.
 */
const activeServiceValues = new Set<string>(serviceOptions.map((option) => option.value));
export const faqCategories: CategoryMeta[] = allCategories.filter(
  (category) => category.value === "general" || activeServiceValues.has(category.value),
);

export function getFaqCategory(value: FaqCategory): CategoryMeta {
  return allCategories.find((c) => c.value === value) ?? allCategories[0];
}

export function needsLegalReview(category: FaqCategory): boolean {
  return getFaqCategory(category).legalReview;
}

export function canManageFaqCategory(user: AdminUser, category: FaqCategory): boolean {
  if (user.role === "administrator") return true;
  const department = getFaqCategory(category).department;
  return user.role === "editor" && department !== undefined && department === user.department;
}

export function manageableCategories(user: AdminUser): CategoryMeta[] {
  return faqCategories.filter((c) => canManageFaqCategory(user, c.value));
}

export function isReviewed(item: Pick<FaqItemRecord, "reviewedById" | "reviewedAt">): boolean {
  return Boolean(item.reviewedById && item.reviewedAt);
}

/**
 * Spec 3.2: any Administrator, or an Editor for that content — but never
 * the person who last wrote it. Authors can't approve their own words.
 */
export function canReviewFaq(user: AdminUser, item: Pick<FaqItemRecord, "category" | "lastEditedById">): boolean {
  if (!needsLegalReview(item.category)) return false;
  if (user.id === item.lastEditedById) return false;
  return canManageFaqCategory(user, item.category);
}

/** Staff-written copy, so the site's naming rule applies in full (CLAUDE.md 6.1). */
function copyProblems(input: FaqInput): string[] {
  const problems: string[] = [];
  if (/\bUCO\b/.test(`${input.question} ${input.answer}`)) {
    problems.push("Use \u201cUptech Consulting\u201d, not \u201cUCO\u201d. UCO is only the logo monogram.");
  }
  return problems;
}

export function getFaqSaveErrors(input: FaqInput): string[] {
  const errors: string[] = [];
  if (!input.question.trim()) errors.push("Write the question.");
  if (!input.answer.trim()) errors.push("Write the answer.");
  return errors;
}

export function getFaqPublishBlockers(item: FaqInput & Pick<FaqItemRecord, "reviewedById" | "reviewedAt">): string[] {
  const blockers = [...getFaqSaveErrors(item), ...copyProblems(item)];
  if (needsLegalReview(item.category) && !isReviewed(item)) {
    blockers.push("A second person has to review this answer before it can be published. You can't review your own writing.");
  }
  return blockers;
}

/** Publish-safety warnings (Admin_Dashboard_Requirements.md 6.4): warn, don't block. */
export function getFaqWarnings(input: FaqInput): string[] {
  const warnings: string[] = [];
  if (/\[PENDING/i.test(`${input.question} ${input.answer}`)) {
    warnings.push("This still has a [PENDING] marker. Publish only if that's deliberate.");
  }
  if (/\]\((?!https:\/\/|mailto:|tel:|\/)[^)]*\)/i.test(input.answer)) {
    warnings.push("A link doesn't start with https://, mailto:, tel: or /, so it will show as plain text.");
  }
  return warnings;
}

export function sortFaqs<T extends Pick<FaqItemRecord, "displayOrder" | "createdAt">>(items: T[]): T[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt));
}
