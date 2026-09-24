import type { AdminUser, ServicePageMeta, ActivityEntry, Lead } from "./types";
import { deriveDepartment, deriveLeadType } from "./leads";

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
/*
 * languages: not every Cameroon-based staffer speaks French — Buea sits in
 * the Anglophone Southwest Region, so an English-only Buea account is
 * realistic, not an oversight. Divine Tabe and the Stafford, TX-based
 * Jordan Ellis are both deliberately English-only, so claiming a
 * French-preferring lead has a real mismatch case to demonstrate against.
 */
export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "aline-ngu", name: "Aline Ngu", role: "administrator", department: "career-services-operations", avatarInitials: "AN", location: "Buea, Cameroon", languages: ["English", "French"] },
  { id: "divine-tabe", name: "Divine Tabe", role: "editor", department: "career-services-operations", avatarInitials: "DT", location: "Buea, Cameroon", languages: ["English"] },
  { id: "marc-antoine-fotso", name: "Marc-Antoine Fotso", role: "viewer", department: "career-services-operations", avatarInitials: "MF", location: "Buea, Cameroon", languages: ["English", "French"] },
  { id: "jordan-ellis", name: "Jordan Ellis", role: "administrator", department: "business-formalisation-compliance", avatarInitials: "JE", location: "Stafford, TX", languages: ["English"] },
  { id: "solange-mbei", name: "Solange Mbei", role: "editor", department: "business-formalisation-compliance", avatarInitials: "SM", location: "Buea, Cameroon", languages: ["English", "French"] },
  { id: "priscilla-anye", name: "Priscilla Anye", role: "viewer", department: "business-formalisation-compliance", avatarInitials: "PA", location: "Buea, Cameroon", languages: ["English", "French"] },
];

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
 * Dashboard-preview lead data. Two of these (lead-9, lead-13) are left with
 * `department: undefined` and `status: "needs-triage"` on purpose — real
 * demonstrations of the ambiguous-inquiry case Section 3.11 requires a
 * distinct state for, not silently defaulted to a department. lead-9 is
 * deliberately old (10 days, well past the confirmed one-business-day
 * response commitment) to show what an unhealthy, ignored triage queue
 * looks like; lead-13 is fresh, to show the healthy case. lead-12 shows the
 * other side: an ambiguous "Something else" inquiry that WAS triaged by
 * hand and explicitly assigned a department, proving triage is meant to
 * resolve, not be a permanent state.
 *
 * statusChangedAt/firstContactedAt implement the two-clock staleness model:
 * lead-10 and lead-11 are deliberately stuck (qualified 9 days, contacted
 * 15 days, respectively, with no movement since) to demonstrate stage-aging
 * as a distinct problem from response-lag — both were contacted promptly,
 * then went cold. Everything else gets plausible, mostly-healthy values.
 */
type LeadSeed = Omit<Lead, "department" | "type"> & { department?: Lead["department"]; type?: Lead["type"] };

const leadSeeds: LeadSeed[] = [
  { id: "lead-1", name: "Sarah Njoh", email: "sarah.njoh82@gmail.com", phone: "+237 677 12 34 56", service: "career-marketing", status: "new", source: "contact-form", language: "English", message: "Hi, I'm a recent graduate in finance looking for placement support — do you help with roles outside IT?", createdAt: hoursAgo(2), statusChangedAt: hoursAgo(2), consentAt: hoursAgo(2) },
  { id: "lead-2", name: "Michael Smith", email: "michael@smithlogistics.com", phone: "+1 713 555 0148", company: "Smith Logistics", service: "business-formalisation-us", status: "qualified", source: "referral", language: "English", message: "We need to register a Delaware LLC and get an EIN for a Cameroon-based founder without a US SSN. What's the realistic timeline?", createdAt: daysAgo(1), statusChangedAt: hoursAgo(10), firstContactedAt: hoursAgo(22), assignedToId: "jordan-ellis" },
  { id: "lead-3", name: "Brenda Fokou", email: "brenda.fokou@yahoo.fr", phone: "+237 691 45 22 10", service: "cnps-compliance", status: "contacted", source: "whatsapp", language: "French", message: "Bonjour, nous avons 6 nouveaux employés à déclarer à la CNPS. Pouvez-vous nous aider avec le processus complet?", createdAt: daysAgo(2), statusChangedAt: daysAgo(1), firstContactedAt: daysAgo(1) },
  { id: "lead-4", name: "David Ngwa", email: "d.ngwa@ngwaenterprises.cm", phone: "+237 655 78 90 12", company: "Ngwa Enterprises", service: "tax-compliance-businesses", status: "consultation-booked", source: "contact-form", language: "English", message: "Our accountant flagged that our DGI filings may be behind schedule. Need a compliance review before it becomes a bigger issue.", createdAt: daysAgo(3), statusChangedAt: hoursAgo(20), firstContactedAt: daysAgo(2.8), assignedToId: "solange-mbei", consentAt: daysAgo(3) },
  { id: "lead-5", name: "Aisha Bello", email: "aisha.bello@outlook.com", phone: "+237 699 33 41 27", service: "business-formalisation-cameroon", status: "won", source: "referral", language: "English", message: "Ready to formalize my SARL in Buea — a colleague recommended you after her own registration went smoothly.", createdAt: daysAgo(4), statusChangedAt: daysAgo(2), firstContactedAt: daysAgo(3.8), assignedToId: "jordan-ellis" },
  { id: "lead-6", name: "James Tabi", email: "jamestabi.dev@gmail.com", phone: "+237 678 20 15 63", service: "career-marketing", status: "lost", source: "website", language: "English", message: "Looking for a dedicated account manager to help with my job search — mostly interested in operations roles.", createdAt: daysAgo(6), statusChangedAt: daysAgo(5), firstContactedAt: daysAgo(5.8), assignedToId: "divine-tabe" },
  { id: "lead-7", name: "Grace Achu", email: "grace.achu1996@gmail.com", phone: "+237 682 56 09 44", service: "career-marketing", status: "consultation-booked", source: "contact-form", language: "English", message: "I've been applying on my own for months with no luck. Would like to talk about your career campaign service.", createdAt: daysAgo(7), statusChangedAt: daysAgo(3), firstContactedAt: daysAgo(6.5), assignedToId: "aline-ngu", consentAt: daysAgo(7) },
  { id: "lead-8", name: "Marc Feudjio", email: "marc.feudjio@proton.me", phone: "+237 674 88 02 19", service: "business-formalisation-us", status: "new", source: "contact-form", language: "French", message: "Je veux enregistrer une entreprise aux États-Unis depuis le Cameroun. Est-ce possible sans déplacement?", createdAt: hoursAgo(20), statusChangedAt: hoursAgo(20), consentAt: hoursAgo(20) },
  { id: "lead-9", name: "Patricia Nkemelu", email: "p.nkemelu@gmail.com", phone: "+237 690 71 84 30", service: "business-formalisation", status: "needs-triage", source: "contact-form", language: "English", message: "Not totally sure what category this falls under — I run a small import business and need help getting properly registered and compliant, not sure where to start.", createdAt: daysAgo(10), statusChangedAt: daysAgo(10), consentAt: daysAgo(10) },
  { id: "lead-10", name: "Chantal Mbarga", email: "chantal.mbarga@gmail.com", phone: "+237 696 14 27 58", service: "cnps-compliance", status: "qualified", source: "referral", language: "French", message: "Notre entreprise a besoin d'une mise à jour complète de notre dossier CNPS avant le prochain audit.", createdAt: daysAgo(12), statusChangedAt: daysAgo(9), firstContactedAt: daysAgo(11.5), assignedToId: "priscilla-anye" },
  { id: "lead-11", name: "Kevin Ateh", email: "kevin.ateh@gmail.com", phone: "+237 670 39 92 71", service: "career-marketing", status: "contacted", source: "whatsapp", language: "English", message: "Diaspora professional based in the UK, relocating back to Cameroon — need placement support before I move.", createdAt: daysAgo(18), statusChangedAt: daysAgo(15), firstContactedAt: daysAgo(17.5) },
  { id: "lead-12", name: "Robert Simo", email: "robert.simo@gmail.com", phone: "+237 653 60 18 05", service: "other", status: "lost", source: "website", language: "English", message: "Not sure this is the right company — was actually looking for equipment suppliers, not consulting services.", createdAt: daysAgo(15), statusChangedAt: daysAgo(13), firstContactedAt: daysAgo(14.5), department: "business-formalisation-compliance" },
  { id: "lead-13", name: "Yves Talla", email: "yves.talla@gmail.com", phone: "+237 683 29 47 11", service: "other", status: "needs-triage", source: "contact-form", language: "French", message: "Je ne sais pas exactement dans quelle catégorie mettre ma demande — j'ai besoin de conseils généraux pour développer mon activité.", createdAt: hoursAgo(3), statusChangedAt: hoursAgo(3), consentAt: hoursAgo(3) },
];

export const mockLeads: Lead[] = leadSeeds.map((lead) => ({
  ...lead,
  department: "department" in lead && lead.department !== undefined ? lead.department : deriveDepartment(lead.service),
  type: lead.type ?? deriveLeadType(lead.service),
}));

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
