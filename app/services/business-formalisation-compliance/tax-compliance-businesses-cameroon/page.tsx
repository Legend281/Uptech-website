import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer";
import { WhatComesNext } from "@/components/WhatComesNext";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Tax Compliance for Businesses — Cameroon",
  description:
    "Predictable monthly DGI declarations, certified fiscal schedules, and penalty-proof recordkeeping for Cameroon-registered businesses.",
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

const faqItems = [
  {
    question: "What happens if I've missed previous filings or past tax years?",
    answer:
      "Missed declarations are common, particularly for companies operating during rapid growth or informal transition phases. UCO performs a discreet historical reconciliation: we recalculate statutory liabilities, assemble the back-filings, and interact directly with your attached Tax Center (Centre des Impôts) to negotiate manageable settlement structures and penalty remissions where permitted by the General Tax Code.",
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
          { label: "Tax Compliance — Businesses (Cameroon)" },
        ]}
        tag="SUB-SERVICE 03/05 • CAMEROON DGI CORPORATE TAX"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    STATUTORY TAX DESK • DGI GENERAL TAX CODE
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                  Stay ahead of your tax obligations,{" "}
                  <span className="gradient-teal-blue-text">without the stress.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                  Predictable monthly DGI declarations, certified fiscal schedules, and
                  penalty-proof recordkeeping — whether you are staying compliant proactively or
                  catching up on past seasons.
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Button href="#compliance-check">Get a Compliance Check</Button>
                  <WhatsAppButton phone="237670000000" label="Chat on WhatsApp Tax Desk" />
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-lg pt-4 border-t border-white/10">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold text-teal-300">15th</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Filing Cut-Off</p>
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

              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-navy-800 border border-white/10">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={images["compliance-advisory"].src}
                      alt={images["compliance-advisory"].alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      placeholder="blur"
                      blurDataURL={images["compliance-advisory"].blurDataURL}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950/85 backdrop-blur-md">
                      <MaterialIcon name="verified" className="text-[16px] text-teal-300" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                        Statutory Tax Desk • DGI General Tax Code
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-1.5 bg-navy-900/95">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white">Corporate Fiscal Dossier</h3>
                        <p className="text-xs text-slate-400">Cameroon General Tax Code (CGI) &amp; CEMAC Mandate</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-teal-400/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Live Desk
                      </span>
                    </div>
                  </div>
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
                  Tax compliance in Cameroon is not an annual scramble; it is a systematic monthly
                  and quarterly operational hygiene that protects your legal capacity.
                </p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg max-w-xs shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                  Note for engagement teams:
                </span>
                <span className="text-xs text-slate-600 italic">[PENDING: confirm real cadence &amp; deadlines with UCO]</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {cadenceColumns.map((column) => (
                <div key={column.title} className="bg-slate-50 rounded-xl p-7 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold uppercase tracking-wider">
                        {column.tag}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">{column.deadline}</span>
                    </div>
                    <h3 className="text-lg font-bold text-navy-950 mb-2">{column.title}</h3>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed">{column.description}</p>
                    <ul className="flex flex-col gap-3 text-sm text-slate-700">
                      {column.items.map((item) => (
                        <li key={item.strong} className="flex items-start gap-2">
                          <MaterialIcon name="check_box" className="text-teal-600 text-[18px] shrink-0 mt-0.5" />
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
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MaterialIcon name="info" className="text-teal-600 text-[24px]" />
                <p className="text-sm text-slate-600">
                  <strong>Cadence Confirmation:</strong> Exact deadlines fluctuate based on regime
                  classification (Réel, Simplifié, or IGC). We verify your exact registration
                  status during initial onboarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="py-24 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">TAILORED CORPORATE ENGAGEMENTS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Two Paths to Total Fiscal Peace of Mind
              </h2>
              <p className="text-slate-300 mt-3">
                Whether you are newly established and looking to maintain clean ledgers from day
                one, or navigating back-filings, our tax desk provides clear, structured execution.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>
          </div>
        </section>

        {/* Handover vs deliverables */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">OPERATIONAL DIVISION OF LABOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                What You Hand Over vs. What You Receive
              </h2>
              <p className="text-slate-600 mt-2">
                We turn an intimidating legal paperwork maze into a simple monthly exchange. You
                provide core raw transactions; we handle verification, filing, and delivery of
                certified receipts.
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
                Unmanaged Exposure vs. UCO Managed Cadence
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
                  <div className="p-3.5 bg-white/5 rounded-lg">
                    <p className="text-sm font-semibold text-rose-300 mb-1">Late-Filing Surcharges &amp; Compounding Interest</p>
                    <p className="text-sm text-slate-300">
                      Monthly penalties applied automatically by DGI systems on unfiled statements.{" "}
                      <span className="text-amber-300 italic">[PENDING: confirm specific DGI penalty % with UCO]</span>
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
                </div>
              </div>
              <div className="frosted-glass rounded-2xl p-7 border-2 border-teal-400/30">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="verified" className="text-teal-400 text-[24px]" />
                    <h3 className="text-lg font-bold text-white">The UCO Managed Cadence</h3>
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-link to individual tax */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-7 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
                  <MaterialIcon name="person_pin" className="text-[24px]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">EXECUTIVE TAX PLANNING</span>
                  <h3 className="text-lg font-bold text-navy-950 mt-1">
                    Also managing your personal taxes as a business owner or director?
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Cross-border founders, expats, and company executives face distinct personal
                    income tax (IRPP) obligations separate from corporate legal entities.
                  </p>
                </div>
              </div>
              <Link
                href="/services/business-formalisation-compliance/tax-compliance-individuals-cameroon"
                className="inline-flex items-center gap-2 px-5 py-3 bg-navy-950 text-white rounded-lg text-sm font-semibold hover:bg-navy-900 transition-colors shrink-0"
              >
                Explore Personal Tax Compliance
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
              </Link>
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
          lastReviewed="[PENDING: confirm review date with UCO]"
          extraNote="Statutory dues, penalties, and filing schedules are subject to Ministry of Finance (MINFI) and Direction Générale des Impôts (DGI) regulations."
        />

        <WhatComesNext
          title="Next: CNPS Compliance — Cameroon"
          description="Corporate tax and social security are enforced by distinct state authorities. If you have staff on payroll, CNPS employer registration and monthly declarations run in parallel."
          href="/services/business-formalisation-compliance/cnps-compliance-cameroon"
          linkLabel="View CNPS Compliance"
        />

        {/* Final CTA */}
        <section id="compliance-check" className="py-24 bg-navy-950 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-4">
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
              <WhatsAppButton phone="237670000000" label="Discuss via WhatsApp Tax Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
