import { redirect } from "next/navigation";

/*
 * This page used to be a standalone "Tax Compliance for Individuals —
 * Cameroon" page. Leadership merged it into the unified Tax Compliance page
 * (which now covers both businesses and individuals), so this route redirects
 * rather than 404ing for anyone who already has this URL bookmarked, indexed,
 * or linked from elsewhere off-site.
 *
 * `redirect()` from next/navigation works under `output: "export"` (the
 * GitHub Pages preview build) as well as a normal Next.js server — a
 * next.config.js `redirects()` entry would NOT, since static export ignores
 * redirects/rewrites/headers entirely (verified during that build).
 */
export default function TaxComplianceIndividualsCameroonRedirect() {
  redirect("/services/business-formalisation-compliance/tax-compliance-businesses-cameroon");
}
