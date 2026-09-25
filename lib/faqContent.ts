import type { FaqItem } from "@/components/FaqAccordion";

/*
 * The FAQ copy each page shipped with, moved here verbatim (source notes
 * included) from the individual page files so the admin dashboard's FAQ
 * Items module can start from the real, already-approved content instead
 * of an empty list — and so each page still has it as a fallback.
 *
 * Plain module (no "use client"), so both server pages and the admin
 * dashboard can import it. Pages read FAQs through lib/faqs.ts: a category
 * with at least one FAQ published from the dashboard (in Supabase) shows
 * those instead; otherwise it shows the list below.
 *
 * Categories are keyed by lib/serviceOptions.ts values (plus "general" for
 * the Homepage), per Admin_Content_Pages_Spec.md 0.4.
 */
export type FaqCategory =
  | "general"
  | "career-marketing"
  | "business-formalisation-cameroon"
  | "business-formalisation-us"
  | "tax-compliance-businesses"
  | "cnps-compliance";

export const siteFaqs: Record<FaqCategory, FaqItem[]> = {
  // Homepage — from app/page.tsx
  "general": [
    {
      question: "How do you charge?",
      answer:
        "Engagements are scoped before they are quoted. We map your situation during the consultation, tell you plainly whether we are the right partner, and price the work from there. Contact us for a quote rather than a package rate.",
    },
    {
      // Web research (2026-09) added the Cameroon half of this answer,
      // corroborated across multiple independent sources on Cameroon
      // business-formation procedure. Worth a quick confirmation with Uptech
      // Consulting's own legal desk, since practice varies by bank.
      question: "Do I have to travel to register a business?",
      answer:
        "For a US LLC or C-Corp, no — non-US residents can form and own one without a US visa, Social Security Number or American address, though the entity itself needs a registered agent with a physical in-state address. For Cameroon formalisation, the paperwork itself (Articles of Association, RCCM registration) can be handled remotely through a notarized power of attorney for a local representative. The step most likely to need your direct involvement is depositing share capital — some banks allow this remotely with power of attorney, but not all, so we confirm your specific bank's requirements early.",
    },
    {
      question: "Can you handle both the registration and the filings that follow it?",
      answer:
        "Yes. Formalisation, tax standing, social insurance and licensing run as one accountable process rather than separate errands — registration hands straight over to the ongoing filing calendar.",
    },
    {
      question: "Do I need a specific background for career placement?",
      answer:
        "No. Career Marketing & Placement Support is open to anyone looking for their next role, not restricted to a particular field.",
    },
    {
      question: "Do you work in French as well as English?",
      answer:
        "Yes. Uptech Consulting operates bilingually in English and Français, which matters for Cameroonian regulatory work where official filings and correspondence are frequently in French.",
    },
    {
      // Rewritten to avoid stating an unconfirmed fact — safe to publish
      // as-is; replace with real figure once provided by the team.
      question: "How quickly can you start?",
      answer:
        "Once you book a consultation, we move quickly to understand your situation and outline next steps — your dedicated point of contact will confirm a specific timeline for your case.",
    },
  ],
  // Career Marketing & Placement Support — from app/services/career-marketing-placement/page.tsx
  "career-marketing": [
    {
      question: "What happens if I don't get placed right away?",
      answer:
        "Our active advocacy campaigns operate in continuous sprints. If an offer isn't finalized within the initial sprint, your account specialist recalibrates target criteria, adjusts keyword positioning, and continues daily outreach without interruption until you have signed an acceptable employment offer.",
    },
    {
      question: "How is this different from doing it myself or using automated AI apply tools?",
      answer:
        "AI spam tools can trigger employer spam filters, hurting your reputation across LinkedIn and company databases. Doing it alone requires many hours of repetitive manual work each week while you're exhausted from your current routine. Uptech Consulting assigns a dedicated human worker who customizes every submission, completes employer screening questionnaires accurately, and personally follows up with hiring managers.",
    },
    {
      question: "Do you guarantee a job?",
      answer:
        "No ethical firm can guarantee a hiring decision made by an independent third-party company. What we do guarantee is disciplined, auditable pipeline volume: tailored applications submitted regularly, continuous recruiter follow-ups, and transparent progress updates. You show up prepared; we ensure you get the meetings.",
    },
    {
      // Rewritten to avoid stating an unconfirmed fact — safe to publish
      // as-is; replace with real figure once provided by the team.
      question: "How long does the campaign typically take from audit to first interview?",
      answer:
        "Every job search moves at its own pace depending on your field and experience level. Your dedicated career consultant will walk you through what to realistically expect once your profile is reviewed.",
    },
    {
      question: "Is my personal data and employment confidentiality protected?",
      answer:
        "Strictly. If you are currently employed, we utilize stealth application protocols: suppressing your current employer from search vectors, avoiding internal company openings, and utilizing designated intermediary routing for outbound recruiter inquiries.",
    },
  ],
  // Business Formalisation — Cameroon — from app/services/business-formalisation-compliance/cameroon/page.tsx
  "business-formalisation-cameroon": [
    {
      question: "Can this process be executed 100% remotely if I live in North America or Europe?",
      answer:
        "Yes. It can be done remotely. Uptech facilitates the creation of your company from wherever you are, stress-free.",
    },
    {
      question: "What happens if my preferred trade name is already taken at the commercial registry?",
      answer:
        "Our intake protocol requires three (3) distinct name variants in order of priority. During Phase 1, our desk conducts an immediate database search at the Greffe / CFCE. If your primary choice conflicts with an existing entity, we pivot to your secondary approved name without halting the timeline.",
    },
    {
      question: "Do I need a commercial real estate lease in Cameroon, or can I use a domiciliation address?",
      answer:
        "A verified registered address (Siège Social) is legally mandatory for both the RCCM court deposit and DGI tax localization certificate. OHADA rules permit legal corporate domiciliation agreements (Contrat de Domiciliation) through authorized providers during your initial startup phase.",
    },
    {
      question:
        "What is the key legal difference between an Individual Business (Établissement) and a Private Limited Company (SARL)?",
      answer:
        "An Établissement (Sole Proprietorship) does not create a distinct legal person; your personal assets remain exposed to business liabilities. A SARL creates an autonomous corporate entity where liability is restricted to contributed share capital — recommended for cross-border contracts and institutional partnerships.",
    },
  ],
  // Business Formalisation — United States — from app/services/business-formalisation-compliance/united-states/page.tsx
  "business-formalisation-us": [
    {
      // Was stated as flat, unhedged legal fact — the one confident claim on
      // this page with no qualification, unlike everything else here.
      // Downgraded per the family-wide confidence-vs-pending audit fix.
      question: "Do I need to be a US citizen or resident to form an LLC?",
      answer:
        "Generally, no — non-US residents can typically form and own a US LLC or C-Corp without a US visa, Social Security Number, or physical US address as a founder, though a registered agent with a physical in-state address is required for the entity itself. Confirm current requirements for your specific situation with your Uptech Consulting consultant.",
    },
    {
      // Web research (2026-09) adds the well-established, factual trade-offs
      // between the three states, corroborated across multiple sources — but
      // stops short of asserting Uptech Consulting's own recommendation
      // framework for specific founder profiles, since that's a genuine
      // advisory judgment call for your consultant, not a researchable fact.
      question: "Which state should I choose?",
      answer:
        "It depends on your goals. Delaware is the standard choice if you're raising outside investment — its courts and corporate law are what most US investors expect. Wyoming tends to suit founders prioritizing low ongoing cost and privacy (no franchise tax, member names aren't public). Texas has no personal state income tax but more ongoing reporting. Your consultant will help you weigh these against your specific situation.",
    },
    {
      // Rewritten to avoid stating an unconfirmed fact — safe to publish
      // as-is; replace with real figure once provided by the team.
      question: "Can I open a US bank account remotely?",
      answer:
        "We can guide you through opening a US business bank account as part of formation — your consultant will walk you through the current options available to you.",
    },
  ],
  // Tax Compliance — Cameroon — from app/services/business-formalisation-compliance/tax-compliance-businesses-cameroon/page.tsx
  "tax-compliance-businesses": [
    {
      question: "What happens if I've missed previous filings or past tax years?",
      answer:
        "Missed declarations are common, particularly for companies operating during rapid growth or informal transition phases. Uptech Consulting performs a discreet historical reconciliation: we recalculate statutory liabilities, assemble the back-filings, and interact directly with your attached Tax Center (Centre des Impôts) to negotiate manageable settlement structures and penalty remissions where permitted by the General Tax Code.",
    },
    {
      question: "Do I need to worry about back-taxes if I'm just now formalising an informal business?",
      answer:
        "Your statutory tax existence typically commences upon RCCM registration and NIU issuance. If your business transacted through registered corporate accounts prior to formalisation, clear documentation of founding capital is crucial — we help structure your company inception so your opening balance sheet starts on solid, uncontested ground.",
    },
    {
      question: "How often will our team need to provide accounting documents?",
      answer:
        "We recommend uploading bank summaries, payroll sheets, and customer invoices to your secure client folder between the 1st and 5th of each month. This gives our desk time to review ledgers, query any missing documentation, and lodge finalized returns ahead of the monthly cut-off.",
    },
    {
      question: "What is the key difference between DGI tax compliance and CNPS labour compliance?",
      answer:
        "The Direction Générale des Impôts (DGI) falls under the Ministry of Finance and governs corporate income tax, withholding taxes (TSR), VAT/TVA, business licenses (Patente), and personal taxes at source. The Caisse Nationale de Prévoyance Sociale (CNPS) is Cameroon's national social security fund governing workplace insurance, pensions, and family welfare contributions. Both require monthly reporting but are enforced by distinct state authorities.",
    },
    // The four below came from the standalone "Tax Compliance for Individuals"
    // page when it was merged into this one — personal tax (IRPP), not
    // corporate tax.
    {
      // Web research (2026-09) confirmed this directly, citing Article 25 of
      // Cameroon's General Tax Code (the "principe de mondialité" — tax
      // residents are taxed on worldwide income, not just Cameroon-source
      // income). Kept a lighter hedge on situation-specific treatment (double-
      // tax treaty relief, specific income types), since that genuinely
      // varies case by case and wasn't part of this research.
      question: "Do I need to declare income I earn remotely from foreign clients?",
      answer:
        "Yes. Cameroon tax residents are taxed on worldwide income under Article 25 of the General Tax Code, including remote or foreign-client earnings — not just Cameroon-source income. Situation-specific details, like double-tax treaty relief, are confirmed with your consultant.",
    },
    {
      question: "I don't have a registered company — do personal tax rules still apply to me?",
      answer:
        "Yes. Personal income tax (IRPP) applies to individuals regardless of whether they operate through a registered company. Freelancers, consultants, and independent earners are assessed as individual taxpayers.",
    },
    {
      // Web research (2026-09) confirmed March 15 directly from DGI's own
      // published guidance (impots.cm) — resolving the contradiction this
      // answer used to have with the cadence card above (see that card's
      // comment). DGI has administratively extended related deadlines in some
      // years, so kept a note about confirming the current year specifically.
      question: "When is the personal tax filing deadline?",
      answer: "March 15 annually, per DGI's published deadline — though this has been administratively extended in some years, so it's worth confirming the current year's exact date with your consultant.",
    },
    {
      question: "What documents do I need for my personal tax filing?",
      answer:
        "A valid national ID or passport, proof of income (contracts, pay slips, or invoices for the tax year being declared), and any previous year's IRPP declaration or tax identifier, if you have one.",
    },
  ],
  // CNPS Compliance — Cameroon — from app/services/business-formalisation-compliance/cnps-compliance-cameroon/page.tsx
  "cnps-compliance": [
    // RESOLVED via web research (2026-09), replacing the earlier generic
    // hedge — corroborated across multiple independent sources on Cameroon
    // CNPS procedure. Worth a quick confirmation with Uptech Consulting's own
    // CNPS desk, since procedure specifics can be revised.
    {
      question: "How often do I need to file DPAE and other CNPS declarations?",
      answer:
        "DPAE is filed once per employee, within days of hiring — it's not a recurring filing. Separately, your CNPS contribution declaration (covering everyone on payroll) is filed every month, due by the 15th of the following month.",
    },
    {
      question: "What happens if my business isn't registered with CNPS yet?",
      answer:
        "We conduct a review of your current employee register and help bring your CNPS registration and past declarations up to date, similar to how back-filings are handled for tax compliance.",
    },
    {
      // Two independent sources disagreed specifically on the pension branch
      // split (one: 4.2% total; another: 8.4% total, split evenly). Resolved
      // in favor of CLEISS (cleiss.fr) — a French inter-governmental body
      // whose actual mandate is documenting foreign social security systems
      // accurately for cross-border administration, making it more
      // institutionally reliable here than the blog/SEO sources — and it
      // independently agreed with the other search results on both of the
      // other two branches, which increases confidence in its pension figure
      // too. Kept the "periodically revised" framing since CNPS does update
      // these by decree; not the same as the unresolved [PENDING] this
      // replaces.
      question: "What are the current CNPS contribution rates?",
      answer:
        "Family benefits: 7%, employer-paid. Old-age/pension/invalidity/death insurance: 4.2% employer + 4.2% employee. Workplace accident insurance: 1.75%–5% employer-paid, depending on your sector's risk category. Family benefits and pension are calculated against a monthly salary ceiling; workplace accident insurance is not capped. CNPS revises these by decree periodically, so we confirm your business's exact current rates during onboarding.",
    },
  ],
};
