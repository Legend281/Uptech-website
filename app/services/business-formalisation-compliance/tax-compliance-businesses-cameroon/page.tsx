import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer";
import { TimelineNote } from "@/components/TimelineNote";
import { WhatComesNext } from "@/components/WhatComesNext";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

/*
 * Unified page: this used to be "Tax Compliance for Businesses — Cameroon"
 * only, with a separate "Tax Compliance for Individuals — Cameroon" page.
 * Leadership merged the two into one Tax Compliance page serving both
 * audiences — the individuals page now redirects here (see its page.tsx).
 * URL/folder name kept as "tax-compliance-businesses-cameroon" to avoid
 * breaking existing links into this page; only the display copy dropped
 * "for Businesses".
 */
export const metadata: Metadata = {
  title: "Tax Compliance — Cameroon",
  description:
    "Predictable DGI tax compliance for Cameroon — monthly corporate filings and certified fiscal schedules for businesses, and personal income tax (IRPP) declarations for individuals.",
};

const trustStripItems = [
  {
    icon: "event_repeat",
    title: "Ongoing Filing Support",
    badgeText: "Monthly / Quarterly / Annual",
    badgeAccent: "teal" as const,
    description: "Recurring DGI filings prepared and logged against a documented deadline calendar.",
  },
  {
    icon: "policy",
    title: "Cameroon Tax Code Expertise",
    badgeText: "CGI & CEMAC",
    badgeAccent: "sky" as const,
    description: "Adherence to the General Tax Code, CEMAC directives, and bilateral tax treaty provisions.",
  },
  {
    icon: "receipt_long",
    title: "Documented Compliance Calendar",
    badgeText: "Verifiable Receipts",
    badgeAccent: "emerald" as const,
    description: "Quittance de Paiement and Attestation de Non-Redevance (ANR) archives.",
  },
];

const cadenceColumns = [
  {
    tag: "Monthly Cycle",
    deadline: "Pre-15th Deadline",
    title: "Monthly DGI Declarations",
    description:
      "Routine statutory filings generated, verified, and uploaded to the DGI online portal with matching payment tele-declarations.",
    items: [
      { strong: "Withholding Tax (TSR):", text: "Retained service fees and cross-border remittances." },
      { strong: "Monthly Dipe / IRPP at Source:", text: "Personal tax withheld from team payroll." },
      { strong: "VAT / TVA Filings:", text: "Monthly turnover reconciliation (where applicable)." },
    ],
    artifact: "Official Monthly Quittance de Paiement DGI",
  },
  {
    tag: "Quarterly Review",
    deadline: "Quarter End + 15d",
    title: "Advance Instalments & Audit",
    description:
      "Periodic health assessments to prevent accumulated tax exposure, unexpected liabilities, or ledger discrepancies.",
    items: [
      { strong: "Advance Corporate Tax:", text: "Calculating minimum tax / Acompte IS instalments." },
      { strong: "Ledger vs Portal Audit:", text: "Cross-checking fiscal portal balances against bank accounts." },
      { strong: "Quarterly Payroll Reconciliation:", text: "Ensuring social declarations match DGI data." },
    ],
    artifact: "Quarterly Standing Extract & Pre-clearance",
  },
  {
    tag: "Annual Fiscal Dossier",
    deadline: "March 15th Statutory",
    title: "DSF & Full Annual Clôture",
    description:
      "Comprehensive year-end statutory assembly, statistical statements, and corporate credential renewals.",
    items: [
      { strong: "DSF (Déclaration Statistique et Fiscale):", text: "SYSCOHADA compliant year-end submission." },
      { strong: "Patente / Business License:", text: "Statutory municipal license assessment & payment." },
      { strong: "Attestation de Non-Redevance (ANR):", text: "Essential cert for tenders, contracts & banking." },
    ],
    artifact: "Official DGI Stamped DSF & Active ANR Certificate",
  },
  {
    // Individual/personal-tax cadence, added alongside the three business
    // columns above — personal IRPP filing is a single annual cycle, not a
    // monthly one, so it doesn't share a card with the business columns.
    // This page's own FAQ states "before March 15 annually" but immediately
    // hedges it with its own [PENDING] on specifics — presenting a clean,
    // unhedged "March 15th Annually" deadline tag here would contradict
    // that hedge, so this card stays at general "Annual Cycle" framing
    // (family-wide confidence-vs-pending audit fix) rather than repeating
    // the specific date without the same qualification.
    tag: "Individual • Annual Cycle",
    deadline: "[PENDING: exact date]",
    title: "Personal IRPP Filing",
    description:
      "A single yearly personal income tax declaration — not a monthly cycle like the business columns shown here.",
    items: [
      { strong: "Personal IRPP Declaration:", text: "Worldwide income for tax residents, including remote/foreign-client earnings." },
      { strong: "Supporting Income Documentation:", text: "Contracts, pay slips, or invoices for the tax year being declared." },
      { strong: "Prior-Year Reference:", text: "Previous IRPP declaration or personal tax identifier, if one exists." },
    ],
    artifact: "Personal IRPP Filing Receipt",
    audience: "individual" as const,
  },
];

const handover = [
  { icon: "description", title: "Bank Statements & Cash Vouchers", text: "Raw transaction histories from your commercial bank or corporate mobile money channels." },
  { icon: "receipt", title: "Invoices & Supplier Bills", text: "Client billings issued during the cycle, alongside allowable business expenditure receipts." },
  { icon: "group", title: "Monthly Staff Payroll Sheet", text: "Gross and net salary breakdowns used to calculate statutory withholding at source (Dipe)." },
  { icon: "history_edu", title: "Historical Filings & Tax Identifiers", text: "Initial NIU certificate, previous year's Patente, and earlier tax receipts (if existing)." },
];

const deliverables = [
  { icon: "verified", title: "Stamped DGI Declarations", text: "Formally lodged through the MINFI electronic portal with electronic confirmation stamps." },
  { icon: "receipt_long", title: "Quittance de Paiement Receipts", text: "State treasury payment certificates archived directly in your client drive." },
  { icon: "account_balance_wallet", title: "Tax Portal Ledger Reconciliation", text: "Continuous balance-sheet confirmation to catch discrepancies before they compound." },
  { icon: "workspace_premium", title: "Attestation de Non-Redevance (ANR)", text: "Fresh corporate ANRs issued and renewed to keep you eligible for institutional contracts." },
];

// Individual/freelancer equivalent of the two lists above — kept as its own
// smaller block beneath the business one rather than merged into the same
// list, since the documents involved are genuinely different.
const individualHandover = [
  { icon: "badge", title: "Valid ID or Passport", text: "National ID card or passport for identity verification." },
  { icon: "receipt", title: "Proof of Income", text: "Contracts, pay slips, or invoices for the tax year being declared." },
  { icon: "history_edu", title: "Prior-Year Filing (if any)", text: "Previous IRPP declaration or personal tax identifier, if one exists." },
];

const individualDeliverables = [
  { icon: "verified", title: "Filed Personal IRPP Declaration", text: "Formally lodged through the DGI portal on your behalf." },
  { icon: "receipt_long", title: "Personal Filing Receipt", text: "Confirmation of your declaration for that tax year." },
  { icon: "workspace_premium", title: "Personal Tax Clearance (on request)", text: "Available when you need it for travel, visa, or cross-border matters." },
];

const faqItems = [
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
    question: "Do I need to declare income I earn remotely from foreign clients?",
    answer:
      "Cameroon tax residents generally have personal income tax obligations on worldwide income, including remote/foreign-client earnings, though the exact treatment depends on your specific residency and income situation. [PENDING: confirm current IRPP treatment of foreign-sourced income with Uptech Consulting].",
  },
  {
    question: "I don't have a registered company — do personal tax rules still apply to me?",
    answer:
      "Yes. Personal income tax (IRPP) applies to individuals regardless of whether they operate through a registered company. Freelancers, consultants, and independent earners are assessed as individual taxpayers.",
  },
  {
    question: "When is the personal tax filing deadline?",
    answer: "Filing deadline: before March 15 annually. [PENDING: confirm exact requirements for your specific income situation with Uptech Consulting].",
  },
  {
    question: "What documents do I need for my personal tax filing?",
    answer:
      "A valid national ID or passport, proof of income (contracts, pay slips, or invoices for the tax year being declared), and any previous year's IRPP declaration or tax identifier, if you have one.",
  },
];

export default function TaxComplianceBusinessesCameroonPage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
          { label: "Tax Compliance (Cameroon)" },
        ]}
        tag="SUB-SERVICE 03/04 • CAMEROON DGI & IRPP TAX"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            {/* Full-bleed rotating background + centered text (management
                request: hero backgrounds cycle automatically). Was a
                two-column split — left-aligned text plus a separate framed
                "Corporate Fiscal Dossier" image card on the right —
                consolidated to match the single centered-hero pattern used
                sitewide. */}
            <HeroImageCarousel
              keys={["compliance-advisory", "cross-border-boardroom"]}
              imageClassName="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/65 to-navy-950/50" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  STATUTORY TAX DESK • DGI GENERAL TAX CODE
                </span>
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Stay ahead of your tax obligations,{" "}
                <span className="gradient-teal-blue-text">without the stress.</span>
              </h1>
              <p className="mx-auto text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Predictable monthly DGI declarations, certified fiscal schedules, and
                penalty-proof recordkeeping — whether you are staying compliant proactively or
                catching up on past seasons.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Button href="#compliance-check">Get a Compliance Check</Button>
                <WhatsAppButton phone="237678597593" label="Chat on WhatsApp Tax Desk" />
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 border-t border-white/10">
                <div className="p-3 bg-white/5 rounded-lg">
                  {/* Was a specific "15th" cut-off date stated as fixed
                      fact here, directly contradicting the cadence
                      section's own disclaimer below that deadlines vary
                      by regime classification — downgraded to general
                      framing per the family-wide confidence-vs-pending
                      audit fix. */}
                  <p className="text-xl font-bold text-teal-300">Monthly</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filing Cadence</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-teal-300">Bilingual</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MINFI Support</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-teal-300">Proactive</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lockout Prevention</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Compliance calendar */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  STATUTORY CADENCE &amp; DELIVERABLES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                  The Recurring Compliance Rhythm
                </h2>
                <p className="text-slate-600 mt-2">
                  Businesses run a systematic monthly and quarterly rhythm; individual filers have
                  one annual cycle. Either way, it&apos;s not a once-a-year scramble — it&apos;s a
                  documented cadence that protects your standing.
                </p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg max-w-xs shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                  Note for engagement teams:
                </span>
                <span className="text-xs text-slate-600 italic">[PENDING: confirm real cadence &amp; deadlines with Uptech Consulting]</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cadenceColumns.map((column) => {
                const isIndividual = "audience" in column && column.audience === "individual";
                return (
                <div
                  key={column.title}
                  className={`rounded-xl p-7 shadow-sm border flex flex-col justify-between ${
                    isIndividual ? "bg-sky-50/50 border-sky-200" : "bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isIndividual ? "bg-sky-100 text-sky-700" : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {column.tag}
                      </span>
                      <TimelineNote value={column.deadline} className="font-semibold" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-950 mb-2">{column.title}</h3>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed">{column.description}</p>
                    <ul className="flex flex-col gap-3 text-sm text-slate-700">
                      {column.items.map((item) => (
                        <li key={item.strong} className="flex items-start gap-2">
                          <MaterialIcon
                            name="check_box"
                            className={`text-[18px] shrink-0 mt-0.5 ${isIndividual ? "text-sky-600" : "text-teal-600"}`}
                          />
                          <span>
                            <strong>{item.strong}</strong> {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 pt-3 bg-white p-3 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Verification artifact:
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{column.artifact}</span>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MaterialIcon name="info" className="text-teal-600 text-[24px]" />
                <p className="text-sm text-slate-600">
                  <strong>Cadence Confirmation:</strong> Exact deadlines fluctuate based on regime
                  classification (Réel, Simplifié, or IGC) for businesses, or personal filing
                  profile for individuals. We verify your exact status during initial onboarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="py-24 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">TAILORED TAX ENGAGEMENTS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Three Paths to Total Fiscal Peace of Mind
              </h2>
              <p className="text-slate-300 mt-3">
                Whether you&apos;re newly established and looking to maintain clean corporate ledgers
                from day one, navigating business back-filings, or managing your own personal
                income tax, our tax desk provides clear, structured execution.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="frosted-glass rounded-2xl p-7 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
                      <MaterialIcon name="verified_user" className="text-[20px]" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded bg-teal-500/20 text-teal-300 uppercase">Track A</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Newly Formalised &amp; Staying Ahead</h3>
                    <p className="text-sm text-teal-300 mt-1">Proactive operational stability</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">The reality</span>
                    <p className="text-sm text-slate-200">
                      &ldquo;You just got your RCCM and NIU. Operating without a dedicated
                      accounting department makes statutory filing deadlines easy to miss.&rdquo;
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-2">
                      Our reassurance &amp; method
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      We establish your monthly filing rhythm from day one, keeping tax records
                      clean so corporate bank accounts stay unlocked and vendor contracts stay
                      eligible.
                    </p>
                  </div>
                </div>
                <Button href="#compliance-check" className="mt-6 justify-center">
                  Initiate Proactive Schedule
                </Button>
              </div>

              <div className="frosted-glass rounded-2xl p-7 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                      <MaterialIcon name="healing" className="text-[20px]" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded bg-amber-500/20 text-amber-300 uppercase">Track B</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Catching Up on Filings</h3>
                    <p className="text-sm text-amber-300 mt-1">Non-judgmental regularisation &amp; remediation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">The reality</span>
                    <p className="text-sm text-slate-200">
                      &ldquo;Behind on filings? You&apos;re not alone. Missed deadlines or unfiled
                      declarations can happen to any growing business.&rdquo;
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-2">
                      Our reassurance &amp; method
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Zero judgment, structured remediation. We conduct a quiet fiscal audit,
                      reconstruct historical ledgers, and work to bring you current without
                      operational shutdowns.
                    </p>
                  </div>
                </div>
                <Button href="#compliance-check" variant="secondary" className="mt-6 justify-center">
                  Request Confidential Regularisation
                </Button>
              </div>

              {/* Personal tax, added when the standalone Tax Compliance for
                  Individuals page was merged into this one. Same card
                  treatment as the two business tracks — equal weight, not a
                  secondary afterthought. */}
              <div className="frosted-glass rounded-2xl p-7 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300">
                      <MaterialIcon name="person" className="text-[20px]" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded bg-sky-500/20 text-sky-300 uppercase">Track C</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Individuals With Personal Tax Obligations</h3>
                    <p className="text-sm text-sky-300 mt-1">Personal income tax (IRPP), not corporate</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">The reality</span>
                    <p className="text-sm text-slate-200">
                      &ldquo;I freelance, earn remotely from abroad, or have income in Cameroon while
                      living elsewhere — I&apos;m not sure what I owe or how to file from a
                      distance.&rdquo;
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block mb-2">
                      Our reassurance &amp; method
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      We assess your residency and income-source status, then file the personal
                      declarations (IRPP) that apply — handled remotely, so you don&apos;t need to
                      travel for a personal tax matter.
                    </p>
                  </div>
                </div>
                <Button href="#compliance-check" variant="secondary" className="mt-6 justify-center">
                  Get My Personal Tax Checklist
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Handover vs deliverables — this is this page's version of the
            family-wide "documents needed" section, eyebrow standardized to
            match. The H2 stays page-specific ("What You Hand Over vs. What
            You Receive"): unlike the single-direction checklists on the
            other 3 pages, this section is a genuinely bidirectional
            exchange (what you submit AND what you get back), so forcing it
            to read as a plain "checklist" would misdescribe its actual
            content. Naming consistency fix applies to the eyebrow (the
            site's real cross-page taxonomy label); H2s are page-specific
            by convention everywhere else on this site too. */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">DOCUMENTS &amp; REQUIREMENTS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                What You Hand Over vs. What You Receive
              </h2>
              <p className="text-slate-600 mt-2">
                We turn an intimidating legal paperwork maze into a simple, documented exchange —
                monthly for businesses, annually for individual filers. You provide the raw
                records; we handle verification, filing, and delivery of certified receipts.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <MaterialIcon name="upload_file" className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-950">What You Hand Over</h3>
                    <p className="text-xs text-slate-500">Provided before the 5th of each calendar month</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {handover.map((item) => (
                    <div key={item.title} className="p-3 bg-slate-50 rounded-lg flex items-start gap-3">
                      <MaterialIcon name={item.icon} className="text-slate-500 text-[20px] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-navy-950">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <MaterialIcon name="task_alt" className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-950">What You Receive Back</h3>
                    <p className="text-xs text-slate-500">Delivered cleanly before statutory 15th deadlines</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {deliverables.map((item) => (
                    <div key={item.title} className="p-3 bg-slate-50 rounded-lg flex items-start gap-3">
                      <MaterialIcon name={item.icon} className="text-emerald-600 text-[20px] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-navy-950">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual/freelancer equivalent — a smaller block beneath
                the business one rather than merged into the same list,
                since the documents involved are genuinely different. */}
            <div className="mt-10 pt-10 border-t border-slate-200/80">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-[2px] bg-sky-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">For Individual Filers</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                      <MaterialIcon name="upload_file" className="text-[18px]" />
                    </div>
                    <h3 className="text-base font-bold text-navy-950">What You Hand Over</h3>
                  </div>
                  <div className="space-y-2.5">
                    {individualHandover.map((item) => (
                      <div key={item.title} className="p-2.5 bg-slate-50 rounded-lg flex items-start gap-3">
                        <MaterialIcon name={item.icon} className="text-slate-500 text-[18px] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-navy-950">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                      <MaterialIcon name="task_alt" className="text-[18px]" />
                    </div>
                    <h3 className="text-base font-bold text-navy-950">What You Receive Back</h3>
                  </div>
                  <div className="space-y-2.5">
                    {individualDeliverables.map((item) => (
                      <div key={item.title} className="p-2.5 bg-slate-50 rounded-lg flex items-start gap-3">
                        <MaterialIcon name={item.icon} className="text-sky-600 text-[18px] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-navy-950">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <MaterialIcon name="diversity_3" className="text-[24px]" />
                </div>
                <div>
                  <p className="font-bold text-navy-950">Looking for employee social security and labour compliance?</p>
                  <p className="text-sm text-slate-600">CNPS and labour office registrations are managed on their own specialized desk.</p>
                </div>
              </div>
              <Link
                href="/services/business-formalisation-compliance/cnps-compliance-cameroon"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-950 text-white rounded-lg text-sm font-semibold hover:bg-navy-900 transition-colors shrink-0"
              >
                Explore CNPS Compliance
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Penalty risk comparator */}
        <section className="py-24 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">THE COST OF INACTION</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Unmanaged Exposure vs. the Uptech Consulting Managed Cadence
              </h2>
              <p className="text-slate-300 mt-3">
                In Cameroon, fiscal sanctions compound rapidly. Comparing what happens when
                filings lapse against a predictable, managed cadence.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="frosted-glass rounded-2xl p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="warning" className="text-rose-400 text-[24px]" />
                    <h3 className="text-lg font-bold text-white">Unmanaged / Lapsed Filings</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-[11px] font-bold">HIGH RISK</span>
                </div>
                <div className="space-y-3">
                  {/* Rewritten to avoid stating an unconfirmed fact — safe
                      to publish as-is; replace with real figure once
                      provided by the team. */}
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Late-Filing Surcharges &amp; Compounding Interest</p>
                    <p className="text-sm text-slate-300">
                      Late filing carries real penalties in both Cameroon and the US. Your
                      consultant will confirm the exact penalty exposure based on your specific
                      filing history.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Automatic Freezing of Bank Accounts (ATD)</p>
                    <p className="text-sm text-slate-300">
                      Tax collectors can issue an Avis à Tiers Détenteur (ATD) directly to
                      commercial banks, freezing operational payroll and vendor accounts overnight.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Tender Disqualification (Loss of ANR)</p>
                    <p className="text-sm text-slate-300">
                      Without an active Attestation de Non-Redevance, your enterprise cannot
                      legally submit proposals for public tenders or corporate bids.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Sudden Retroactive Audits</p>
                    <p className="text-sm text-slate-300">
                      Unchecked irregularities can trigger multi-year field audits (Contrôle
                      Fiscal), consuming executive bandwidth and risking large reassessments.
                    </p>
                  </div>
                  {/* Individual-specific risk, for the diaspora/remote-filer
                      persona (Track C) this page already targets. */}
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Personal Tax Clearance Gaps</p>
                    <p className="text-sm text-slate-300">
                      A missing or lapsed personal ANR can complicate visa applications,
                      cross-border banking, or other matters that require proof of tax standing —
                      a real friction point for diaspora and remote filers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="frosted-glass rounded-2xl p-7 border-2 border-teal-400/30">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="verified" className="text-teal-400 text-[24px]" />
                    <h3 className="text-lg font-bold text-white">The Uptech Consulting Managed Cadence</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-[11px] font-bold">CONTINUOUS STATUS</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-teal-300 mb-1">Predictable Advisory Retainer</p>
                    <p className="text-sm text-slate-300">Fixed monthly fee, filings prepared ahead of statutory deadlines.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-teal-300 mb-1">Protected Commercial Banking Standing</p>
                    <p className="text-sm text-slate-300">Reduced risk of administrative freezes or tax agency inquiries disrupting operations.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-teal-300 mb-1">Actively Maintained ANR</p>
                    <p className="text-sm text-slate-300">Non-redevance attestations kept current in your compliance repository, ready for tenders.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-teal-300 mb-1">Bilingual Institutional Representation</p>
                    <p className="text-sm text-slate-300">If the tax center requests clarification, our tax desk responds on your behalf.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-teal-300 mb-1">Personal Tax Clearance Maintained</p>
                    <p className="text-sm text-slate-300">Ready when you need it for travel, visa documentation, or cross-border matters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">DIRECT ANSWERS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Practical Tax Compliance Answers
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer
          lastReviewed="[PENDING: confirm review date with Uptech Consulting]"
          extraNote="Statutory dues, penalties, and filing schedules are subject to Ministry of Finance (MINFI) and Direction Générale des Impôts (DGI) regulations."
        />

        <WhatComesNext
          title="Next: CNPS Compliance — Cameroon"
          description="Corporate tax and social security are enforced by distinct state authorities. If you have staff on payroll, CNPS employer registration and monthly declarations run in parallel."
          href="/services/business-formalisation-compliance/cnps-compliance-cameroon"
          linkLabel="View CNPS Compliance"
        />

        {/* Final CTA */}
        <section id="compliance-check" className="relative py-28 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["compliance-advisory"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["compliance-advisory"].blurDataURL}
              className="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/50" />
            <div className="absolute inset-0 bg-navy-950/30" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-teal-400/30 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">TAX DESK ACTIVE IN BUEA &amp; DOUALA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight mb-4">
              Ready to take tax anxiety off your operating table?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Request a compliance check or speak directly with our bilingual corporate tax desk
              to stabilize your standing this month.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?service=tax-compliance-businesses">Get a Compliance Check</Button>
              <WhatsAppButton phone="237678597593" label="Discuss via WhatsApp Tax Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
