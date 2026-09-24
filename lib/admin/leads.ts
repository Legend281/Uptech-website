import type { Department, LeadServiceValue, LeadType } from "./types";

/**
 * career-marketing is the only service that belongs to Career Services
 * Operations; the two genuinely ambiguous selections ("General inquiry" and
 * "Something else") return undefined rather than a guessed department —
 * per Admin_Dashboard_Requirements.md Section 3.11, an ambiguous inquiry
 * must land in "needs-triage", not get silently defaulted to a department.
 * Every other value belongs to Business Formalisation & Compliance.
 */
export function deriveDepartment(service: LeadServiceValue): Department | undefined {
  if (service === "career-marketing") return "career-services-operations";
  if (service === "business-formalisation" || service === "other") return undefined;
  return "business-formalisation-compliance";
}

/** Same ambiguity rule as deriveDepartment, expressed as the audience type instead of a department. */
export function deriveLeadType(service: LeadServiceValue): LeadType {
  if (service === "career-marketing") return "job-seeker";
  if (service === "business-formalisation" || service === "other") return "general";
  return "business";
}

/** wa.me needs digits only (no "+", spaces, or punctuation) — WhatsApp is core infrastructure here, not decorative, so this needs to actually work. */
export function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
