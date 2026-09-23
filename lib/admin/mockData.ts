import type { AdminUser, ServicePageMeta, ActivityEntry, Lead, LeadServiceValue, Department } from "./types";

/*
 * Every date below is generated relative to Date.now(), not a fixed
 * calendar string, so the staleness demo and relative-time feed stay
 * meaningful whenever this is actually reviewed, not just today.
 */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}
function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3_600_000).toISOString();
}

/**
 * One entry per Department x AccessRole combination, matching CLAUDE.md's
 * two department *paths* (not an invented cross-department super-admin).
 * Names reflect the company's real Buea / Stafford, TX geography.
 */
export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "aline-ngu", name: "Aline Ngu", role: "administrator", department: "career-services-operations", avatarInitials: "AN", location: "Buea, Cameroon" },
  { id: "divine-tabe", name: "Divine Tabe", role: "editor", department: "career-services-operations", avatarInitials: "DT", location: "Buea, Cameroon" },
  { id: "marc-antoine-fotso", name: "Marc-Antoine Fotso", role: "viewer", department: "career-services-operations", avatarInitials: "MF", location: "Buea, Cameroon" },
  { id: "jordan-ellis", name: "Jordan Ellis", role: "administrator", department: "business-formalisation-compliance", avatarInitials: "JE", location: "Stafford, TX" },
  { id: "solange-mbei", name: "Solange Mbei", role: "editor", department: "business-formalisation-compliance", avatarInitials: "SM", location: "Buea, Cameroon" },
  { id: "priscilla-anye", name: "Priscilla Anye", role: "viewer", department: "business-formalisation-compliance", avatarInitials: "PA", location: "Buea, Cameroon" },
];

/** career-marketing is the only service that belongs to Career Services Operations — every other value is Business Formalisation & Compliance's. */
function deriveDepartment(service: LeadServiceValue): Department {
  return service === "career-marketing" ? "career-services-operations" : "business-formalisation-compliance";
}

/*
 * The 4 real Template C pages — titles and URLs matched to
 * components/Header.tsx so this reads as the actual site, not placeholder
 * data. reviewCadenceDays: 180 is a sensible default (CLAUDE.md doesn't
 * specify a number) and reviewedBy reuses ComplianceDisclaimer.tsx's exact
 * default attribution rather than inventing a different name.
 *
 * lastReviewedAt is deliberately staggered (not all "2 days ago," which is
 * what the real pages currently share via their hardcoded September 17,
 * 2026 date) purely so the register has genuine on-track / due-soon /
 * overdue examples to show.
 */
const REVIEWED_BY = "Uptech Consulting Legal & Corporate Administration Desk";

export const mockServicePages: ServicePageMeta[] = [
  {
    id: "business-formalisation-cameroon",
    title: "Business Formalisation — Cameroon",
    template: "C",
    url: "/services/business-formalisation-compliance/cameroon",
    department: "business-formalisation-compliance",
    lastReviewedAt: daysAgo(2),
    reviewCadenceDays: 180,
    reviewedBy: REVIEWED_BY,
  },
  {
    id: "business-formalisation-us",
    title: "Business Formalisation — United States",
    template: "C",
    url: "/services/business-formalisation-compliance/united-states",
    department: "business-formalisation-compliance",
    lastReviewedAt: daysAgo(2),
    reviewCadenceDays: 180,
    reviewedBy: REVIEWED_BY,
  },
  {
    id: "tax-compliance-cameroon",
    title: "Tax Compliance — Cameroon",
    template: "C",
    url: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
    department: "business-formalisation-compliance",
    lastReviewedAt: daysAgo(210),
    reviewCadenceDays: 180,
    reviewedBy: REVIEWED_BY,
  },
  {
    id: "cnps-compliance-cameroon",
    title: "CNPS Compliance — Cameroon",
    template: "C",
    url: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
    department: "business-formalisation-compliance",
    lastReviewedAt: daysAgo(165),
    reviewCadenceDays: 180,
    reviewedBy: REVIEWED_BY,
  },
];

/*
 * Dashboard-preview lead data only — powers the quick counts and the
 * register. The full Leads module (filtering, status changes, notes, a
 * detail page) is a separate, later build; there's no /admin/leads route
 * yet, so nothing here links to one.
 */
type LeadSeed = Omit<Lead, "department">;

const leadSeeds: LeadSeed[] = [
  { id: "lead-1", name: "Sarah Njoh", service: "career-marketing", status: "new", source: "contact-form", createdAt: hoursAgo(2) },
  { id: "lead-2", name: "Michael Smith", company: "Smith Logistics", service: "business-formalisation-us", status: "qualified", source: "referral", createdAt: daysAgo(1), assignedToId: "jordan-ellis" },
  { id: "lead-3", name: "Brenda Fokou", service: "cnps-compliance", status: "contacted", source: "whatsapp", createdAt: daysAgo(2) },
  { id: "lead-4", name: "David Ngwa", service: "tax-compliance-businesses", status: "consultation-booked", source: "contact-form", createdAt: daysAgo(3), assignedToId: "solange-mbei" },
  { id: "lead-5", name: "Aisha Bello", service: "business-formalisation-cameroon", status: "won", source: "referral", createdAt: daysAgo(4), assignedToId: "jordan-ellis" },
  { id: "lead-6", name: "James Tabi", service: "career-marketing", status: "lost", source: "website", createdAt: daysAgo(6), assignedToId: "divine-tabe" },
  { id: "lead-7", name: "Grace Achu", service: "career-marketing", status: "consultation-booked", source: "contact-form", createdAt: daysAgo(7), assignedToId: "aline-ngu" },
  { id: "lead-8", name: "Marc Feudjio", service: "business-formalisation-us", status: "new", source: "contact-form", createdAt: hoursAgo(20) },
  { id: "lead-9", name: "Patricia Nkemelu", service: "business-formalisation", status: "contacted", source: "contact-form", createdAt: daysAgo(10) },
  { id: "lead-10", name: "Chantal Mbarga", service: "cnps-compliance", status: "qualified", source: "referral", createdAt: daysAgo(12), assignedToId: "priscilla-anye" },
  { id: "lead-11", name: "Kevin Ateh", service: "career-marketing", status: "contacted", source: "whatsapp", createdAt: daysAgo(18) },
  { id: "lead-12", name: "Robert Simo", service: "other", status: "lost", source: "website", createdAt: daysAgo(15) },
];

export const mockLeads: Lead[] = leadSeeds.map((lead) => ({ ...lead, department: deriveDepartment(lead.service) }));

/*
 * Plain descriptive activity entries — no dependency on Lead/JobPosting
 * records, since those modules aren't built this pass. `relatedHref` only
 * points at routes that actually exist today (the real public service
 * pages), never a placeholder admin route.
 */
export const mockActivity: ActivityEntry[] = [
  {
    id: "act-1",
    icon: "fact_check",
    description: "Divine Tabe reviewed the CNPS Compliance page and confirmed filing requirements are still accurate.",
    timestamp: hoursAgo(3),
    relatedHref: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
  {
    id: "act-2",
    icon: "warning",
    description: "Compliance review flagged: Tax Compliance — Cameroon is overdue for its 180-day review.",
    timestamp: hoursAgo(9),
    relatedHref: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  {
    id: "act-3",
    icon: "edit_note",
    description: "Divine Tabe updated internal notes on the Career Marketing & Placement Support campaign cadence.",
    timestamp: hoursAgo(26),
    relatedHref: "/services/career-marketing-placement",
  },
  {
    id: "act-4",
    icon: "check_circle",
    description: "Jordan Ellis confirmed Business Formalisation — Cameroon's review is current.",
    timestamp: hoursAgo(50),
    relatedHref: "/services/business-formalisation-compliance/cameroon",
  },
  {
    id: "act-5",
    icon: "fact_check",
    description: "Solange Mbei double-checked Business Formalisation — United States' filing references.",
    timestamp: hoursAgo(74),
    relatedHref: "/services/business-formalisation-compliance/united-states",
  },
  {
    id: "act-6",
    icon: "work_history",
    description: "Aline Ngu noted the Job Postings module is next up for the Careers team.",
    timestamp: hoursAgo(120),
  },
  {
    id: "act-7",
    icon: "help",
    description: "Marc-Antoine Fotso flagged a question about CNPS clearance turnaround times for follow-up.",
    timestamp: hoursAgo(168),
  },
  {
    id: "act-8",
    icon: "person_add",
    description: "Priscilla Anye joined as a Viewer on the Business Formalisation & Compliance team.",
    timestamp: hoursAgo(240),
  },
];
