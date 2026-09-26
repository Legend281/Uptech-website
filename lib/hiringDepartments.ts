/**
 * The six real internal departments Uptech Consulting hires into — shown on
 * the public Careers page and used to tag admin job postings. One shared
 * source of truth is what stops the two from drifting into naming the same
 * department differently (the exact mistake already fixed once this build
 * for the dashboard/leads pipeline order — see lib/admin/chartColors.ts).
 *
 * Not the same thing as lib/admin/types.ts's Department type, which is the
 * two-value client-facing operational split (Career Services Operations /
 * Business Formalisation & Compliance) used for lead routing. A job posting
 * answers "which of our six departments is hiring," which is a different
 * question from "which of our two client-facing teams owns this lead."
 *
 * FLAG FOR TEAM (carried over from app/careers/page.tsx, unresolved):
 * IT Consulting & Outsourcing and Recruitment & BPO are listed below as
 * normal, fully-active departments — same visual weight as Business
 * Formalisation & Compliance and Career Marketing & Placement Support — but
 * both are paused/deprioritized everywhere else on the site per leadership's
 * direction (see CLAUDE.md Section 5/9, components/Header.tsx). This may be
 * intentional (a careers page can reasonably describe the company's full
 * internal structure separately from what's actively marketed to clients),
 * or it may be an inconsistency that should match the paused treatment used
 * elsewhere. Deliberately unresolved — do not change this list's membership
 * until the team responds either way.
 *
 * Also flagged, also unresolved: "Corporate & Administration" isn't named in
 * any official company document referenced elsewhere in this project
 * (CLAUDE.md's own service/organizational inventory doesn't name it). Do not
 * remove or rename it without team confirmation either way.
 */
export type HiringDepartment = {
  icon: string;
  title: string;
  description: string;
};

export const HIRING_DEPARTMENTS: HiringDepartment[] = [
  {
    icon: "trending_up",
    title: "Career Marketing & Placement Support",
    description: "Profile positioning, application management, and recruiter follow-up for job seekers.",
  },
  {
    icon: "gavel",
    title: "Business Formalisation & Compliance",
    description: "Corporate formation, tax compliance, and regulatory filing across Cameroon and the US.",
  },
  {
    icon: "terminal",
    title: "IT Consulting & Outsourcing",
    description: "Managed IT support, cloud migration, database administration, and cybersecurity delivery.",
  },
  {
    icon: "groups",
    title: "Recruitment & BPO",
    description: "Recruitment, selection, and payroll management support for client organizations.",
  },
  {
    icon: "inventory_2",
    title: "General Contracts & Supplies",
    description: "Contracts and supply arrangements supporting client operations — scope still being defined.",
  },
  {
    icon: "account_balance",
    title: "Corporate & Administration",
    description: "The internal operations, finance, and administration that keep both offices running.",
  },
];

export const HIRING_DEPARTMENT_NAMES: string[] = HIRING_DEPARTMENTS.map((d) => d.title);
