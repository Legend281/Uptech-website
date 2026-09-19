/**
 * Admin dashboard types — first increment. Shaped to match CLAUDE.md
 * Section 8's real model (two department paths × three access tiers), not a
 * generic "admin/user" split, so later modules (Leads, Job Postings, ...)
 * can slot into the same AdminUser/Department shape without rework.
 */
import type { serviceOptions } from "@/lib/serviceOptions";

export type Department = "career-services-operations" | "business-formalisation-compliance";
export type AccessRole = "administrator" | "editor" | "viewer";

export type AdminUser = {
  id: string;
  name: string;
  role: AccessRole;
  department: Department;
  avatarInitials: string;
  /** Buea, Cameroon or Stafford, TX — the company's two real offices (CLAUDE.md Section 1). */
  location: string;
};

/** Mirrors the three page templates in CLAUDE.md Section 4. */
export type PageTemplate = "A" | "B" | "C";

/**
 * Tracks the review-cadence flag CLAUDE.md Section 8 requires for Template C
 * (Regulatory/Procedure) pages, since their content can go legally stale.
 * `url` and `title` match the real pages in components/Header.tsx so this
 * reads as the actual site, not placeholder data.
 */
export type ServicePageMeta = {
  id: string;
  title: string;
  template: PageTemplate;
  url: string;
  department: Department;
  lastReviewedAt: string;
  reviewCadenceDays: number;
  reviewedBy: string;
};

export type ActivityEntry = {
  id: string;
  icon: string;
  description: string;
  timestamp: string;
  relatedHref?: string;
};

/*
 * A lead is created FROM a contact-form submission, so its `service` field
 * must match what that form actually produces — components/ContactForm.tsx's
 * exported `serviceOptions` values — not components/Header.tsx's ServiceKey
 * union, which uses different values (e.g. "tax-compliance" there vs. the
 * form's actual "tax-compliance-businesses") and has no "other" option.
 *
 * This is dashboard-preview data only (stat cards, pipeline counts, a short
 * "Recent Leads" list) — the full Leads module (filtering, status editing,
 * detail pages) is still a later, separate build, per the approved plan.
 */
export type LeadStatus = "new" | "contacted" | "qualified" | "consultation-booked" | "won" | "lost";
export type LeadSource = "contact-form" | "referral" | "whatsapp" | "website";
export type LeadServiceValue = (typeof serviceOptions)[number]["value"];

export type Lead = {
  id: string;
  name: string;
  company?: string;
  service: LeadServiceValue;
  department: Department;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  assignedToId?: string;
};
