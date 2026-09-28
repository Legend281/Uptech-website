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
export type LeadSource = "contact-form" | "careers-apply" | "referral" | "whatsapp" | "website" | "manual-phone" | "manual-email" | "manual-other";

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
  /**
   * A storage object path within the resumes bucket (e.g. "<uuid>-cv.pdf"),
   * not a public URL — the bucket is private (see
   * supabase/002_leads_applications.sql and 003_staff_auth.sql). Any
   * authenticated staff member can turn this into a real download via
   * ResumeDownloadButton, which generates a short-lived signed URL on click.
   */
  resumeUrl?: string;
};

export type JobPostingStatus = "draft" | "published" | "closed";

/*
 * Real Supabase table (supabase/006_job_postings.sql), and "published" here
 * really does mean "visible on the live site" — app/careers/page.tsx reads
 * status = 'published' rows directly (a public anon-read RLS policy scoped
 * to that status only), revalidated at most once a minute. No manual
 * export/redeploy step anymore.
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
  /** Optional — some postings (a general-interest opening, a cross-department role) don't cleanly belong to one of the six HIRING_DEPARTMENT_NAMES. */
  department?: string;
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
  /**
   * When set, "Apply" on the public page links straight to this URL (a new
   * tab) instead of opening the site's own résumé-upload flow — for a
   * posting where applications are meant to go through an external form
   * (e.g. a Google Form for a structured program with its own intake
   * questions), not the standard job-application pipeline.
   */
  applyUrl?: string;
  /** Manually incremented by whoever checks the recruiting inbox — a deliberately cheap stand-in for a real ATS, not a start of one. */
  applicationsReceived: number;
  notes?: string;
  /**
   * A real, explicit deadline for a fixed-duration posting (e.g. a
   * time-boxed trainee program with its own stated intake window) —
   * distinct from JOB_POSTING_STALE_DAYS's generic "been open a while"
   * heuristic, which only applies when this is unset. Optional because most
   * roles are open-ended with no real closing date to record.
   */
  closingDate?: string;
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
export type ConsentChannel = "whatsapp" | "email" | "signed-form" | "confirmed";
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

/**
 * A service Uptech starts offering beyond the current 5 real, hardcoded
 * ones (Career Marketing, Business Formalisation CM/US, Tax Compliance,
 * CNPS Compliance) — see supabase/013_additional_services.sql. Those 5
 * stay exactly as hardcoded on the Homepage and /services; this only ever
 * adds more, appended after them in the identical card/list design.
 */
export type AdditionalServiceStatus = "draft" | "published";

export type AdditionalService = {
  id: string;
  title: string;
  description: string;
  /** A dedicated page for this service, if one exists yet — undefined means the public card falls back to "Get in touch" instead of "Explore." */
  href?: string;
  /** An optional country-flag emoji, matching the existing cards' style. */
  flag?: string;
  /** Path inside the service-photos storage bucket, never a full URL. */
  photoPath: string;
  displayOrder: number;
  status: AdditionalServiceStatus;
  createdById?: string;
  createdAt: string;
};

/** One of the 3 fixed reference slots on the onboarding form. */
export type OnboardingReference = {
  name?: string;
  titleAndCompany?: string;
  relationship?: string;
  email?: string;
  phone?: string;
};

/**
 * A client onboarding submission from the external Google Form (Profile
 * Marketing intake) — supabase/022_onboarding_submissions.sql. Everything
 * except accountManagerId and applicationPassword arrives via the webhook
 * (app/api/onboarding-webhook/route.ts); there's no "add" action in the
 * dashboard itself. Those two fields are the only ones staff set directly,
 * after the fact — the account manager assignment, and the application
 * password Uptech generates for the client (never something the client
 * typed into the form themselves).
 *
 * Deliberately more sensitive than anything else this dashboard holds —
 * see that migration's own comment for why access here is stricter than
 * every other table (no Viewer access at all, regardless of department).
 */
export type OnboardingSubmission = {
  id: string;
  /** Continues Uptech's own existing case numbering — see the migration's own comment. */
  caseNumber: number;
  /** The staff member managing this client's case. Undefined until someone claims it. */
  accountManagerId?: string;
  firstName: string;
  lastName: string;
  gender: string;
  contact: string;
  email: string;
  /** Optional on the form itself — only given if the client wants that email address used for marketing. */
  emailPassword?: string;
  linkedinEmail: string;
  linkedinPassword: string;
  /** Set later by staff once Uptech has created it for the client — never part of the client's own submission. */
  applicationPassword?: string;
  address: string;
  dateOfBirth: string;
  nationality: string;
  ethnicity: string;
  residencyStatus: string;
  securityClearance: string;
  preferredJobTitles: string;
  preferredJobLocation: string;
  expectedSalaryRange: string;
  /** Google Drive share links from the form's file-upload questions. */
  resumeUrl?: string;
  linkedinPhotoUrl?: string;
  references: OnboardingReference[];
  /** The Google account the form response was collected under — may differ from the client's own "Email" answer above. */
  googleResponseEmail?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};
