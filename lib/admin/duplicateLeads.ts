import type { Lead } from "./types";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Digits only, so "+237 6XX XXX XXX" and "237-6XX-XXX-XXX" compare equal. */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * A lead "matches" another when they share a normalized email OR a
 * normalized phone number — either alone is enough, since a real person
 * might reuse one but not the other (a shared family phone, a new email
 * address for a follow-up). Never blocks a submission anywhere it's used —
 * this only surfaces an existing record for staff to notice, so nobody
 * works the same person twice under two different leads.
 */
export function findDuplicateLeads(lead: Lead, allLeads: Lead[]): Lead[] {
  const email = normalizeEmail(lead.email);
  const phone = normalizePhone(lead.phone);
  return allLeads.filter((other) => {
    if (other.id === lead.id) return false;
    const sameEmail = email !== "" && normalizeEmail(other.email) === email;
    const samePhone = phone !== "" && normalizePhone(other.phone) === phone;
    return sameEmail || samePhone;
  });
}

/** Same match rule, for checking raw form input against existing leads before one has been created yet (the "Log a New Lead" dialog's live check). */
export function findDuplicatesForInput(email: string, phone: string, allLeads: Lead[]): Lead[] {
  const normEmail = normalizeEmail(email);
  const normPhone = normalizePhone(phone);
  if (normEmail === "" && normPhone === "") return [];
  return allLeads.filter((other) => {
    const sameEmail = normEmail !== "" && normalizeEmail(other.email) === normEmail;
    const samePhone = normPhone !== "" && normalizePhone(other.phone) === normPhone;
    return sameEmail || samePhone;
  });
}
