/**
 * Admin dashboard types. Shaped to match CLAUDE.md Section 8's real model
 * (two department paths x three access tiers), not a generic "admin/user"
 * split, so later modules can slot into the same AdminUser/Department shape
 * without rework.
 */
import type { serviceOptions } from "@/lib/serviceOptions";
import type { FaqCategory } from "@/lib/faqContent";

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
  /** Where a sign-in invitation goes once Supabase Auth is wired. Optional for the seeded preview personas. */
  email?: string;
  /**
   * Deactivated accounts keep their record (leads and the activity trail
   * still point at them) but can't be switched to or assigned work.
   * Undefined means active.
   */
  active?: boolean;
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
  /** How many days before a review falls due the page starts showing "due soon". Defaults to 30 (lib/admin/staleness.ts). */
  dueSoonDays?: number;
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
};

/*
 * Testimonials — Admin_Content_Pages_Spec.md Section 1. Mirrors
 * supabase/002_testimonials.sql. Split into what can ever reach the public
 * site and what stays internal; the public view in that migration exposes
 * only the former.
 */
export type TestimonialStatus = "draft" | "published" | "archived";
export type AttributionMode = "full_name" | "first_name_initial" | "anonymised";
export type TestimonialAudience = "cameroon" | "us" | "diaspora";
export type ConsentChannel = "whatsapp" | "email" | "signed-form";
/** Pages that actually render a testimonial slot today. Keep in sync with the migration's CHECK list. */
export type TestimonialPage = "homepage" | "career-marketing-placement";

export type TestimonialPlacement = { page: TestimonialPage; displayOrder: number };

export type Testimonial = {
  id: string;

  // Public
  quoteEn: string;
  quoteFr?: string;
  /** True when the French is our translation, not the client's own French words. */
  quoteFrIsTranslation: boolean;
  outcomeLine?: string;
  attributionMode: AttributionMode;
  fullName?: string;
  firstName?: string;
  lastInitial?: string;
  anonymisedDescriptor?: string;
  roleTitle?: string;
  company?: string;
  audience?: TestimonialAudience;
  /**
   * What to display: the public Storage URL of a saved photo, or — while
   * editing — the freshly resized JPEG data URL, which is uploaded on save.
   */
  photo?: string;
  /** Where the saved photo lives in the testimonial-photos bucket. */
  photoPath?: string;

  // Internal
  service: LeadServiceValue;
  department: Department;
  originalWording: string;
  consentGiven: boolean;
  consentDate?: string;
  consentChannel?: ConsentChannel;
  consentRecordedById?: string;
  consentWithdrawnAt?: string;
  leadId?: string;

  status: TestimonialStatus;
  placements: TestimonialPlacement[];
  publishedAt?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

/*
 * Team Members — Admin_Content_Pages_Spec.md Section 2. The public Who We
 * Are roster: real people's names, faces and bios. Distinct from AdminUser
 * (who can sign in to this dashboard), which Settings manages.
 * Mirrors supabase/003_team_members.sql.
 */
export type TeamDepartment = "career-services" | "compliance" | "leadership" | "operations";
export type TeamEntity = "cameroon" | "us";
export type TeamMemberStatus = "visible" | "hidden";

export type TeamMemberRecord = {
  id: string;
  name: string;
  title: string;
  department: TeamDepartment;
  entity: TeamEntity;
  /** Display URL (public Storage URL, or a fresh data URL while editing — uploaded on save). */
  photo?: string;
  /** Where the saved portrait lives in the team-photos bucket. */
  photoPath?: string;
  bio?: string;
  linkedinUrl?: string;
  displayOrder: number;
  status: TeamMemberStatus;
  /**
   * Once someone has been on the public site, their record is only ever
   * hidden, never deleted (spec 2.3) — other pages may reference them.
   */
  everVisible: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

/** What a content module's write actions return: a refusal always says why, in words a staff member can act on. */
export type ActionResult = { ok: true } | { ok: false; reasons: string[] };

/*
 * FAQ Items — Admin_Content_Pages_Spec.md Section 3. Mirrors
 * supabase/004_faq_items.sql. Categories are defined alongside the site's
 * built-in FAQ copy in lib/faqContent.ts.
 */
export type FaqStatus = "draft" | "published";

export type FaqItemRecord = {
  id: string;
  question: string;
  /** Light formatting — see components/FaqAnswer.tsx. */
  answer: string;
  category: FaqCategory;
  displayOrder: number;
  status: FaqStatus;
  /**
   * The legal-review gate (spec 3.2), for Tax and CNPS compliance only.
   * Set by a second person; cleared automatically whenever the question or
   * answer changes.
   */
  reviewedById?: string;
  reviewedAt?: string;
  /**
   * Compliance FAQs that were already live on the site before this gate
   * existed. Left published (they're on the site today) but flagged until
   * someone gives them a first review — never silently treated as reviewed.
   */
  awaitingFirstReview?: boolean;
  /** The last person to change the question or answer — the one who can't review it. */
  lastEditedById: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};
