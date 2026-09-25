import type { AdminUser, TeamDepartment, TeamEntity, TeamMemberRecord } from "./types";

/*
 * Team Members rules — Admin_Content_Pages_Spec.md Section 2.3. Enforced a
 * second time in supabase/003_team_members.sql where the database can.
 */

export type TeamMemberInput = Pick<
  TeamMemberRecord,
  "name" | "title" | "department" | "entity" | "photo" | "bio" | "linkedinUrl" | "displayOrder" | "status"
>;

/** Past this, a bio stretches its card well beyond its neighbours in the grid. */
export const BIO_SOFT_LIMIT = 280;

export const teamDepartmentLabels: Record<TeamDepartment, string> = {
  "career-services": "Career Services",
  compliance: "Business Formalisation & Compliance",
  leadership: "Leadership",
  operations: "Operations",
};

export const teamEntityLabels: Record<TeamEntity, string> = {
  cameroon: "Cameroon (Buea)",
  us: "United States (Stafford, TX)",
};

/*
 * Spec 2.3: this module handles real people's personal data and faces, so
 * it sits at Testimonials-consent sensitivity. No People/HR role exists
 * yet, so the default is Administrators only; everyone else can look but
 * not change.
 */
export function canManageTeam(user: AdminUser): boolean {
  return user.role === "administrator";
}

export function isValidProfileUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getTeamSaveErrors(input: TeamMemberInput): string[] {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Add their name.");
  if (!input.title.trim()) errors.push("Add their job title.");
  if (input.linkedinUrl?.trim() && !isValidProfileUrl(input.linkedinUrl.trim()))
    errors.push("The profile link needs to be a full https:// address.");
  return errors;
}

/** Soft warnings — the save still goes through. */
export function getTeamWarnings(input: TeamMemberInput): string[] {
  const warnings: string[] = [];
  if (input.status === "visible" && !input.photo) {
    warnings.push("No photo yet. The card will show an empty grey frame on the Who We Are page.");
  }
  if ((input.bio?.trim().length ?? 0) > BIO_SOFT_LIMIT) {
    warnings.push(`The bio is over ${BIO_SOFT_LIMIT} characters and will make this card taller than the others.`);
  }
  return warnings;
}

export function normalizeTeamInput(input: TeamMemberInput): TeamMemberInput {
  const clean = (value?: string) => value?.trim() || undefined;
  return {
    ...input,
    name: input.name.trim(),
    title: input.title.trim(),
    bio: clean(input.bio),
    linkedinUrl: clean(input.linkedinUrl),
    displayOrder: Math.max(1, Math.round(input.displayOrder) || 1),
  };
}

/** Public-site order: display order, then name, so ties are stable. */
export function sortTeam<T extends Pick<TeamMemberRecord, "displayOrder" | "name">>(members: T[]): T[] {
  return [...members].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}
