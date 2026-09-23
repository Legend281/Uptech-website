/*
 * Plain (non-"use client") module so this can be imported from Server
 * Components too — a Server Component importing a named export from a
 * "use client" file gets an opaque client-reference stub instead of the
 * real value (confirmed: `serviceOptions.find` threw "is not a function"
 * when lib/admin/leadStats.ts imported it from components/ContactForm.tsx
 * directly). components/ContactForm.tsx re-exports this for anything that
 * already imports it from there.
 *
 * IT Consulting & Outsourcing is paused by leadership decision and is
 * deliberately NOT offered here as a selectable service — a visitor who
 * reaches the still-intact IT Consulting page directly and clicks "Book a
 * Consultation" simply lands with no service pre-selected rather than an
 * invalid pre-fill. Tax Compliance for Businesses and for Individuals were
 * unified into one page/option — there is no separate "individuals" value.
 */
export const serviceOptions = [
  { value: "business-formalisation", label: "Business Formalisation & Compliance — General inquiry" },
  { value: "business-formalisation-cameroon", label: "Business Formalisation — Cameroon" },
  { value: "business-formalisation-us", label: "Business Formalisation — United States" },
  { value: "tax-compliance-businesses", label: "Tax Compliance — Cameroon" },
  { value: "cnps-compliance", label: "CNPS Compliance — Cameroon" },
  { value: "career-marketing", label: "Career Marketing & Placement Support" },
  { value: "other", label: "Something else" },
] as const;

export type ServiceValue = (typeof serviceOptions)[number]["value"];

export function isServiceValue(value: string): value is ServiceValue {
  return serviceOptions.some((option) => option.value === value);
}
