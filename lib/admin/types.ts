/**
 * Admin dashboard types. Shaped to match CLAUDE.md Section 8's real model
 * (two department paths x three access tiers), not a generic "admin/user"
 * split, so later modules can slot into the same AdminUser/Department shape
 * without rework.
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
  /**
   * Per Admin_Dashboard_Requirements.md Section 3.11's language-aware
   * assignment requirement: a distinct field from the public-facing Team
   * Members content (CLAUDE.md Section 3.5) — this is internal staff
   * account data, used only to flag (not block) a language mismatch when
   * a French-preferring lead is claimed by someone who doesn't list French.
   */
  languages: ("English" | "French")[];
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
  /** Who currently owns getting this resolved, if it's been escalated — distinct from reviewedBy, which is historical attribution for the last completed review, not a live ownership assignment. */
  assignedToId?: string;
};

export type ActivityEntry = {
  id: string;
  icon: string;
  description: string;
  timestamp: string;
  relatedHref?: string;
};

/*
 * A lead is created FROM a contact-form submission (once Phase B wires that
 * form to a real backend — see Admin_Dashboard_Requirements.md Section
 * 3.11) or logged by hand by staff (Phase A, the only real intake path
 * today, since the public form is currently `mailto:`-only). Its `service`
 * field must match what that form actually produces —
 * lib/serviceOptions.ts's exported values — not components/Header.tsx's
 * ServiceKey union, which uses different values (e.g. "tax-compliance"
 * there vs. the form's actual "tax-compliance-businesses") and has no
 * "other" option.
 */
export type LeadStatus =
  | "needs-triage"
  | "new"
  | "contacted"
  | "qualified"
  | "consultation-booked"
  | "won"
  | "lost";

/** "manual-*" values cover Phase A's hand-logged intake; the rest are real form/channel origins for Phase B. */
export type LeadSource = "contact-form" | "referral" | "whatsapp" | "website" | "manual-phone" | "manual-email" | "manual-other";

/** Distinguishes the two audiences this dashboard's two departments actually serve, plus the genuinely-unsure case. */
export type LeadType = "job-seeker" | "business" | "general";

export type LeadServiceValue = (typeof serviceOptions)[number]["value"];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: LeadServiceValue;
  type: LeadType;
  /**
   * Undefined means genuinely ambiguous — a "General inquiry" or "Something
   * else" selection with no department to safely guess. Per
   * Admin_Dashboard_Requirements.md Section 3.11, this must NOT be silently
   * defaulted; an undefined department always pairs with status
   * "needs-triage" so it surfaces instead of quietly sitting in one queue.
   */
  department?: Department;
  status: LeadStatus;
  source: LeadSource;
  /** The visitor's (or, for a manually-logged lead, the caller's) stated preference — must reach staff, not be dropped. */
  language: "English" | "French";
  message: string;
  createdAt: string;
  assignedToId?: string;
  /**
   * When the Privacy Policy consent checkbox was ticked — proof of consent
   * at submission. Only real form submissions (Phase B) have this; a
   * manually-logged lead (Phase A) never had a checkbox to tick, so it's
   * left undefined rather than faked.
   */
  consentAt?: string;
  /**
   * The two-clock staleness model: response-lag (creation → first contact,
   * measured against the confirmed 1-business-day commitment) and
   * stage-aging (time sitting in the current status with no movement) are
   * independent problems, not one. firstContactedAt is set once, the first
   * time status leaves "needs-triage"/"new"; statusChangedAt updates on
   * every status transition. Matches supabase/001_leads_table.sql exactly.
   */
  firstContactedAt?: string;
  statusChangedAt: string;
  /** True only when a human resolved this out of needs-triage via resolveTriage — everything else got its department from deriveDepartment automatically at creation. Distinct from `department` itself, which doesn't say how it got set. */
  wasManuallyTriaged?: boolean;
};

export type JobPostingStatus = "draft" | "published" | "closed";

/*
 * Not synced to the live public Careers page — this site is fully
 * static-exported, so there's no runtime path from this admin's localStorage
 * to app/careers/page.tsx's hardcoded array. "Published" here means "content
 * is finalized and export-ready," not "visible on the live site." Getting a
 * posting actually live still needs the Export action's JSON output hand-
 * carried into that page and redeployed — same Phase A limitation as every
 * other admin content type in this build (Leads, Service Pages).
 *
 * `department` is a free-text value from HIRING_DEPARTMENT_NAMES (the six
 * real internal departments) — a different axis entirely from this file's
 * own `Department` type (the two-value client-facing operational split used
 * for lead routing). No RLS-style ownership split by department here: unless
 * proven otherwise, one staff group manages all postings regardless of which
 * of the six departments is hiring.
 */
export type JobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  status: JobPostingStatus;
  postedAt: string;
  /** Attribution only (who created/last touched this record) — not a permission scope. */
  postedById: string;
  /** Falls back to a hardcoded default (see jobPostings.ts) when unset — there's no Settings module yet to source a configurable default from. */
  contactEmail?: string;
  /** Manually incremented by whoever checks the recruiting inbox — a deliberately cheap stand-in for a real ATS, not a start of one. */
  applicationsReceived: number;
  notes?: string;
};
