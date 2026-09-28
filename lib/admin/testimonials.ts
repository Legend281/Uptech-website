import { serviceOptions } from "@/lib/serviceOptions";
import { deriveDepartment } from "./leads";
import type {
  AdminUser,
  AttributionMode,
  ConsentChannel,
  Department,
  LeadServiceValue,
  Testimonial,
  TestimonialAudience,
  TestimonialPage,
} from "./types";

/*
 * Every testimonial rule lives here — Admin_Content_Pages_Spec.md Sections
 * 1.2 and 1.3 — so the dialog, the list and the row actions all read the same
 * answer to "can this be published?". The hard blocks are enforced a second
 * time in supabase/002_testimonials.sql; keep the two in step.
 */

/** The fields a staff member fills in. Everything else (status, audit fields, department) is derived. */
export type TestimonialInput = Pick<
  Testimonial,
  | "quoteEn"
  | "quoteFr"
  | "quoteFrIsTranslation"
  | "outcomeLine"
  | "attributionMode"
  | "fullName"
  | "firstName"
  | "lastInitial"
  | "anonymisedDescriptor"
  | "roleTitle"
  | "company"
  | "audience"
  | "photo"
  | "service"
  | "originalWording"
  | "consentGiven"
  | "consentDate"
  | "consentChannel"
  | "leadId"
  | "placements"
>;

type Checkable = TestimonialInput & { consentWithdrawnAt?: string };

/** Past this, the quote starts to crowd the card. Soft — a counter, never a block. */
export const QUOTE_SOFT_LIMIT = 320;

/**
 * Pages that render a testimonial slot today. Adding a page here without
 * also rendering the slot on that page (and adding it to the migration's
 * CHECK list) would let staff "place" a testimonial nobody can see.
 */
export const testimonialPages: {
  value: TestimonialPage;
  label: string;
  url: string;
  adminOnly: boolean;
  /** A service page only shows testimonials about its own service; the Homepage takes any. */
  onlyService?: LeadServiceValue;
}[] = [
  { value: "homepage", label: "Homepage", url: "/", adminOnly: true },
  {
    value: "career-marketing-placement",
    label: "Career Marketing & Placement Support",
    url: "/services/career-marketing-placement",
    adminOnly: false,
    onlyService: "career-marketing",
  },
];

export function getTestimonialPageLabel(page: TestimonialPage): string {
  return testimonialPages.find((p) => p.value === page)?.label ?? page;
}

/*
 * Active services only (spec Section 0.4). serviceOptions is already the
 * site's single list of active services — IT Consulting is left out of it
 * because it's paused — so a paused service drops out of this picker with
 * no change here. The two catch-all inquiry options are excluded: a
 * testimonial is about a specific service someone actually received.
 */
export const testimonialServiceOptions = serviceOptions.filter(
  (option) => option.value !== "other" && option.value !== "business-formalisation",
);

/** Every testimonial service maps to a real department — the catch-alls that don't are excluded above. */
export function departmentForService(service: LeadServiceValue): Department {
  return deriveDepartment(service) ?? "business-formalisation-compliance";
}

export const attributionModeLabels: Record<AttributionMode, { label: string; hint: string }> = {
  full_name: { label: "Full name", hint: "e.g. Grace Achu — required for the Homepage" },
  first_name_initial: { label: "First name + initial", hint: "e.g. Grace A. — service pages only" },
  anonymised: { label: "Anonymised", hint: "e.g. Finance graduate, Buea — service pages only" },
};

export const audienceLabels: Record<TestimonialAudience, string> = {
  cameroon: "Cameroon",
  us: "United States",
  diaspora: "Diaspora",
};

export const consentChannelLabels: Record<ConsentChannel, string> = {
  whatsapp: "WhatsApp message",
  email: "Email",
  "signed-form": "Signed consent form",
  // The admin form's single consent tick: a staff member confirmed the client agreed.
  confirmed: "Confirmed by staff",
};

export function getDisplayName(t: Pick<Testimonial, "attributionMode" | "fullName" | "firstName" | "lastInitial" | "anonymisedDescriptor">): string {
  switch (t.attributionMode) {
    case "full_name":
      return t.fullName?.trim() ?? "";
    case "first_name_initial":
      return [t.firstName?.trim(), t.lastInitial?.trim() ? `${t.lastInitial.trim().toUpperCase()}.` : ""]
        .filter(Boolean)
        .join(" ");
    case "anonymised":
      return t.anonymisedDescriptor?.trim() ?? "";
  }
}

/**
 * Empties every field the chosen attribution mode doesn't use, so switching
 * an entry to "anonymised" can't leave a real name (or a face) behind in the
 * record. Matches the migration's testimonials_attribution_fields CHECK.
 */
export function normalizeAttribution(input: TestimonialInput): TestimonialInput {
  const clean = (value?: string) => value?.trim() || undefined;
  const base = {
    ...input,
    quoteEn: input.quoteEn.trim(),
    quoteFr: clean(input.quoteFr),
    outcomeLine: clean(input.outcomeLine),
    originalWording: input.originalWording.trim(),
    roleTitle: clean(input.roleTitle),
  };
  switch (input.attributionMode) {
    case "full_name":
      return { ...base, fullName: clean(input.fullName), company: clean(input.company), firstName: undefined, lastInitial: undefined, anonymisedDescriptor: undefined };
    case "first_name_initial":
      return { ...base, firstName: clean(input.firstName), lastInitial: clean(input.lastInitial)?.slice(0, 1).toUpperCase(), fullName: undefined, anonymisedDescriptor: undefined, company: undefined, photo: undefined };
    case "anonymised":
      return { ...base, anonymisedDescriptor: clean(input.anonymisedDescriptor), fullName: undefined, firstName: undefined, lastInitial: undefined, company: undefined, photo: undefined, roleTitle: undefined };
  }
}

/** What's needed just to save a draft. Consent is NOT required here — drafts can wait on it. */
export function getSaveErrors(t: TestimonialInput): string[] {
  const errors: string[] = [];
  if (!t.quoteEn.trim()) errors.push("Add the English quote.");
  if (!t.originalWording.trim()) errors.push("Record the client's original wording.");
  if (!t.service) errors.push("Choose the service this testimonial is about.");
  if (t.attributionMode === "full_name" && !t.fullName?.trim()) errors.push("Add the client's full name.");
  if (t.attributionMode === "first_name_initial" && (!t.firstName?.trim() || !t.lastInitial?.trim()))
    errors.push("Add the first name and last-name initial.");
  if (t.attributionMode === "anonymised" && !t.anonymisedDescriptor?.trim())
    errors.push("Add the anonymised description (e.g. “Finance graduate, Buea”).");
  return errors;
}

/**
 * Hard blocks on publishing (spec 1.2/1.3). Each message says what to do,
 * not just what's wrong — this is what a staff member reads when the
 * Publish button is disabled.
 */
export function getPublishBlockers(t: Checkable, user: AdminUser): string[] {
  const blockers = [...getSaveErrors(t)];
  const onHomepage = t.placements.some((p) => p.page === "homepage");

  if (t.consentWithdrawnAt) {
    blockers.push("The client withdrew consent. This testimonial can't be published again.");
  } else if (!t.consentGiven || !t.consentDate || !t.consentChannel) {
    blockers.push("Tick that the client agreed to this being published.");
  }

  if (t.outcomeLine?.trim()) {
    if (!t.leadId) blockers.push("An outcome line needs a linked lead, so the claim can be checked against that lead's record.");
  }

  if (t.placements.length === 0) blockers.push("Choose at least one page to show it on.");

  for (const placement of t.placements) {
    const page = testimonialPages.find((p) => p.value === placement.page);
    if (page?.onlyService && t.service && t.service !== page.onlyService) {
      blockers.push(`The ${page.label} page only shows testimonials about that service. Untick it, or change the service.`);
    }
  }

  if (onHomepage) {
    if (user.role !== "administrator") blockers.push("Only an Administrator can publish to the Homepage.");
    if (t.attributionMode !== "full_name") blockers.push("The Homepage needs a full name, not an initial or an anonymised description.");
  }

  return blockers;
}

/*
 * Competitor names are internal strategy (CLAUDE.md Section 6.7) and this
 * file ships to the browser, so the list is deliberately not written here.
 * It belongs in Settings, checked server-side, once Settings exists.
 */
const COMPETITOR_NAMES: string[] = [];

/** Soft warnings — shown, never blocking. It's the client's own words. */
export function getWarnings(t: TestimonialInput): string[] {
  const warnings: string[] = [];
  const text = `${t.quoteEn} ${t.quoteFr ?? ""}`;
  if (/\bUCO\b/i.test(text)) {
    warnings.push("The quote says “UCO”. The site uses “Uptech Consulting”, but this is the client's wording, so it's your call.");
  }
  const competitor = COMPETITOR_NAMES.find((name) => text.toLowerCase().includes(name.toLowerCase()));
  if (competitor) warnings.push(`The quote names ${competitor}. Competitor names aren't published on the site.`);
  if (t.quoteEn.trim().length > QUOTE_SOFT_LIMIT) {
    warnings.push(`The English quote is over ${QUOTE_SOFT_LIMIT} characters and will crowd the card.`);
  }
  return warnings;
}

export function isFrenchMissing(t: Pick<Testimonial, "quoteFr">): boolean {
  return !t.quoteFr?.trim();
}

// Permissions (UI side) ------------------------------------------------------
// Enforced again by RLS once staff auth exists (see the migration's RLS note).

export function canCreateTestimonials(user: AdminUser): boolean {
  return user.role !== "viewer";
}

export function canManageTestimonial(user: AdminUser, t: Pick<Testimonial, "department">): boolean {
  if (user.role === "administrator") return true;
  return user.role === "editor" && user.department === t.department;
}

/** Services this user may tag a testimonial with — an Editor only sees their own department's. */
export function servicesFor(user: AdminUser) {
  if (user.role === "administrator") return testimonialServiceOptions;
  return testimonialServiceOptions.filter((option) => departmentForService(option.value) === user.department);
}

export function isConsentOnRecord(t: Pick<Testimonial, "consentGiven" | "consentDate" | "consentChannel" | "consentWithdrawnAt">): boolean {
  return t.consentGiven && Boolean(t.consentDate) && Boolean(t.consentChannel) && !t.consentWithdrawnAt;
}
