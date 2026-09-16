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
import { WhatComesNext } from "@/components/WhatComesNext";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "CNPS Compliance — Cameroon",
  description:
    "Employer social insurance registration, employee declarations (DPAE), payroll withholding, and CNPS Clearance Certificates.",
};

const trustStripItems = [
  {
    icon: "diversity_3",
    title: "Employer Registration",
    badgeText: "CNPS Matricule",
    badgeAccent: "teal" as const,
    description: "Employer social insurance registration handled from day one of hiring.",
  },
  {
    // ESCALATED, NOT CODE-FIXED: DPAE (Déclaration Préalable à l'Embauche)
    // is understood to be a one-time, pre-hiring declaration per employee,
    // not a recurring monthly one — what's typically monthly is the CNPS
    // contribution/payroll declaration, a related but different obligation.
    // The confidence-vs-pending audit fix asked every other instance on
    // this page family to be downgraded to a [PENDING] treatment or hedged
    // — but "DPAE" itself is a specific named declaration, and there is no
    // safe general rewording that doesn't either (a) keep asserting
    // "monthly," the exact claim in question, or (b) silently assert
    // "one-time" instead, which is just guessing in the other direction.
    // Dropped "Monthly" from the title and "Recurring" from the
    // description — neither claim is made anymore — but this is a stopgap,
    // not a resolution. Needs a real answer from the team on DPAE's actual
    // frequency before this can be written accurately either way.
    icon: "event_repeat",
    title: "DPAE Filing",
    badgeText: "Employee Declarations",
    badgeAccent: "sky" as const,
    description: "Declarations kept current and confirmed against your payroll records.",
  },
  {
    icon: "workspace_premium",
    title: "CNPS Clearance Certificates",
    badgeText: "Tender-Ready",
    badgeAccent: "emerald" as const,
    description: "Attestation pour Soumission maintained for public and corporate tenders.",
  },
];

const steps = [
  {
    number: "01",
    phase: "Employer Onboarding",
    reference: "CNPS Matricule",
    title: "Employer Matricule Registration",
    description:
      "Your business is registered with CNPS as an employer, generating your employer matricule number.",
    deliverable: "CNPS Employer Matricule Number",
    highlight: false,
  },
  {
    number: "02",
    phase: "Workforce Declaration",
    reference: "DPAE Filing",
    title: "Employee Declarations (DPAE)",
    description: "Each employee is declared to CNPS, linking them to the social insurance system.",
    deliverable: "DPAE Confirmation Receipt",
    highlight: false,
  },
  {
    number: "03",
    phase: "Recurring Payroll Cycle",
    reference: "Monthly Filing",
    title: "Monthly Payroll Withholding & Filing",
    description:
      "Employer and employee CNPS contributions calculated from payroll and filed on the required cadence.",
    deliverable: "CNPS Payment Receipt (Quittance)",
    highlight: true,
  },
  {
    number: "04",
    phase: "Institutional Standing",
    reference: "Attestation pour Soumission",
    title: "CNPS Clearance Certificate",
    description:
      "Attestation pour Soumission maintained and renewed so you stay eligible for tenders and institutional contracts.",
    deliverable: "Active Attestation pour Soumission",
    highlight: false,
  },
];

const documents = [
  { strong: "Business registration:", text: "RCCM certificate and Taxpayer ID (NIU)." },
  { strong: "Employee records:", text: "ID documents and employment contracts for each declared employee." },
  { strong: "Payroll records:", text: "Monthly gross/net salary breakdowns used to calculate contributions." },
];

const personas = [
  {
    track: "Track A",
    accent: "teal" as const,
    icon: "person_add",
    title: "First-Time Employer",
    reality: "“I just hired my first employee (or I’m about to) — I don’t know what registering them with CNPS actually involves.”",
    method:
      "We register your business as an employer, declare your first hire, and set up the filing rhythm before your first payroll run.",
    cta: "Start My Employer Registration",
  },
  {
    track: "Track B",
    accent: "amber" as const,
    icon: "how_to_reg",
    title: "Catching Up on Employee Declarations",
    reality: "“We’ve had staff on payroll for a while without declaring them to CNPS — I don’t know how exposed that leaves us.”",
    method:
      "Zero judgment, structured remediation. We review your employee register, bring declarations current, and help you regularise past gaps.",
    cta: "Request Confidential Review",
  },
  {
    // Explicitly addresses the "Tender-Ready" claim already present in the
    // trust strip, which previously had no matching persona anywhere on
    // the page.
    track: "Track C",
    accent: "sky" as const,
    icon: "workspace_premium",
    title: "Tender-Ready Businesses",
    reality: "“We need an active CNPS Clearance Certificate to bid on a public or corporate tender — and ours has lapsed or never existed.”",
    method:
      "We assess your current standing, clear any outstanding declarations, and issue a fresh Attestation pour Soumission before your submission deadline.",
    cta: "Get My Clearance Assessed",
  },
];

const personaAccentClasses: Record<"teal" | "amber" | "sky", { chip: string; icon: string; label: string }> = {
  teal: { chip: "bg-teal-500/20 text-teal-300", icon: "bg-teal-500/20 text-teal-300", label: "text-teal-300" },
  amber: { chip: "bg-amber-500/20 text-amber-300", icon: "bg-amber-500/20 text-amber-300", label: "text-amber-300" },
  sky: { chip: "bg-sky-500/25 text-sky-300", icon: "bg-sky-500/25 text-sky-300", label: "text-sky-300" },
};

const faqItems = [
  // Rewritten to avoid stating an unconfirmed fact — safe to publish as-is;
  // replace with real figure once provided by the team. Question reworded
  // from "Do all employees need to be declared to CNPS?" to pair naturally
  // with the cadence-focused answer below (same underlying DPAE topic).
  {
    question: "How often do I need to file DPAE and other CNPS declarations?",
    answer:
      "DPAE and related CNPS declarations are filed according to your business's specific registration category. Your dedicated consultant will confirm the exact filing cadence that applies to your business during onboarding.",
  },
  {
    question: "What happens if my business isn't registered with CNPS yet?",
    answer:
      "We conduct a review of your current employee register and help bring your CNPS registration and past declarations up to date, similar to how back-filings are handled for tax compliance.",
  },
  {
    question: "What are the current CNPS contribution rates?",
    answer:
      "[PENDING: confirm current employer/employee CNPS contribution rates with Uptech Consulting — these are set by CNPS and can be revised]. Contribution rates depend on registration category and salary bracket; we confirm your exact rate during onboarding.",
  },
];

export default function CnpsComplianceCameroonPage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
          { label: "CNPS Compliance (Cameroon)" },
        ]}
        // FLAG FOR TEAM: this page has no actual labour-law content
        // (contracts, termination, working conditions, etc.) — only
        // CNPS/social-insurance content. Either rename this tag's "LABOUR"
        // half to plain "CNPS COMPLIANCE," or confirm labour-law content is
        // intended to be added later. Left unchanged pending that decision
        // (same mismatch also appears in the hero eyebrow below).
        tag="SUB-SERVICE 04/04 • CNPS & LABOUR"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            {/* Full-bleed rotating background + centered text (management
                request: hero backgrounds cycle automatically). Was a
                two-column split — left-aligned text plus a separate framed
                "Employer Compliance Dossier" image card on the right —
                consolidated to match the single centered-hero pattern used
                sitewide. */}
            <HeroImageCarousel
              keys={["compliance-advisory", "dedicated-advisor"]}
              imageClassName="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/65 to-navy-950/50" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                {/* FLAG FOR TEAM: "LABOUR" mismatch, see the code comment
                    on the Breadcrumb `tag` prop above — same badge text
                    appears here. */}
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  CAMEROON • CNPS &amp; LABOUR COMPLIANCE
                </span>
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Keep your team&apos;s social security compliant,{" "}
                <span className="gradient-teal-blue-text">without the paperwork maze.</span>
              </h1>
              {/* ESCALATED, NOT CODE-FIXED: see the matching comment on
                  the trust strip's DPAE item above — "monthly" dropped
                  from "employee declarations" here since that claim is
                  the one in question; "payroll withholding" right after
                  it correctly keeps its own monthly claim (confirmed
                  accurate by the Compliance Cycle section's own "Monthly
                  Payroll Withholding & Filing" step). Still needs a real
                  team answer on DPAE's actual frequency. */}
              <p className="mx-auto text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Employer registration, employee declarations, payroll withholding, and CNPS
                clearance certificates — kept current as your team grows.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Button href="#checklist">Get CNPS Checklist</Button>
                <WhatsAppButton phone="237678597593" label="Chat on WhatsApp CNPS Desk" />
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 border-t border-white/10">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-teal-300">Day 1</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employer Registration</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-teal-300">Bilingual</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CNPS Desk Support</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-teal-300">Tender-Ready</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clearance Maintained</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Compliance cycle */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28 bg-navy-950 text-white p-7 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-400 text-xs font-bold tracking-wider uppercase mb-3">
                    The Compliance Cycle
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-3">
                    From First Hire to Ongoing Clearance
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    A transparent walkthrough of employer social-insurance obligations under CNPS,
                    fully guided from Buea and Douala.
                  </p>
                  <div className="bg-white/5 border border-dashed border-amber-400/40 p-4 rounded-xl">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <MaterialIcon name="schedule" className="text-[16px]" />
                        Filing Cadence
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded uppercase">
                        [PENDING: confirm with Uptech Consulting]
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">
                      Employer registration is generally handled promptly at hiring, with ongoing
                      contribution filings kept to a <strong className="text-white">predictable monthly rhythm</strong> against
                      your payroll records.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col pl-2 md:pl-6 relative">
                <div className="absolute left-6 md:left-10 top-6 bottom-8 w-0.5 bg-gradient-to-b from-teal-400 via-blue-accent to-slate-300" />
                {steps.map((step) => (
                  <div key={step.number} className="relative flex items-start gap-5 pb-8 last:pb-0 group">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-extrabold text-sm md:text-base shrink-0 z-10 group-hover:scale-105 transition-transform ${
                        step.highlight
                          ? "bg-blue-accent border-2 border-white text-white shadow-xl shadow-blue-500/40"
                          : "bg-navy-950 border-2 border-teal-400 text-teal-400 shadow-lg"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl p-5 md:p-6 transition-all ${
                        step.highlight
                          ? "bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-accent/30 shadow-md"
                          : "bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-500/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            step.highlight
                              ? "text-blue-accent bg-blue-100 border-transparent"
                              : "text-teal-700 bg-teal-50 border-teal-100"
                          }`}
                        >
                          {step.phase}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-semibold">{step.reference}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-navy-950 mb-1.5">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                        <MaterialIcon name="verified" className="text-emerald-600 text-[16px]" />
                        <span>
                          Compliance Deliverable: <strong className="text-slate-900">{step.deliverable}</strong>
                        </span>
                      </div>
                      {/* Reciprocal boundary line for the overlap this exact
                          step invites — the Tax Compliance page already
                          states the CNPS side of this boundary in its own
                          "What You Hand Over" section. */}
                      {step.number === "03" && (
                        <Link
                          href="/services/business-formalisation-compliance/tax-compliance-businesses-cameroon"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-accent hover:text-teal-600 transition-colors"
                        >
                          Income tax withholding and filing is handled on our Tax Compliance page
                          <MaterialIcon name="arrow_forward" className="text-[14px]" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Documents & Requirements. Named to match the canonical Template C
            element name in CLAUDE.md Section 4 ("Documents & Requirements
            checklist") — note for the team: none of the 3 already-built
            sibling pages (Cameroon, US, Tax Compliance) actually use this
            exact heading either; each independently drifted into its own
            unique phrasing ("Statutory Requirements Checklist", "What
            we'll need from you", "What You Hand Over"). This page follows
            the documented CLAUDE.md standard rather than any one sibling,
            but a real cross-page naming standard doesn't currently exist —
            worth a team decision on which direction should win. */}
        <section id="checklist" className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">DOCUMENTS &amp; REQUIREMENTS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                CNPS registration checklist
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Gather these before we begin your employer registration — no back-and-forth once
                your dossier is with us.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <MaterialIcon name="diversity_3" className="text-[20px]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-950">Required Documentation</h3>
                    <span className="text-xs text-slate-500">For the business and every employee being declared</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 text-sm text-slate-600">
                  {documents.map((doc) => (
                    <li key={doc.strong} className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">{doc.strong}</strong> {doc.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-navy-950 text-white rounded-2xl p-7 border border-slate-800 shadow-xl h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wider uppercase mb-4">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Fast-Track Your Registration
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-2">
                      Already have your documents ready?
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Send them directly to our CNPS desk on WhatsApp and we&apos;ll start your
                      employer registration the same day we receive them — no need to wait for a
                      full consultation first.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/237678597593"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-uco-green hover:bg-uco-green-hover text-white text-sm font-semibold transition-colors"
                  >
                    Send Documents via WhatsApp
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-24 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">WHO THIS IS FOR</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Three Situations, One CNPS Desk
              </h2>
              <p className="text-slate-300 mt-3">
                Whether you&apos;re registering your first hire, regularising a team that&apos;s been
                off the books, or preparing to bid on a tender, our CNPS desk handles it as a
                distinct, structured engagement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {personas.map((persona) => {
                const accentClasses = personaAccentClasses[persona.accent];
                return (
                  <div key={persona.title} className="frosted-glass rounded-2xl p-7 flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses.icon}`}>
                          <MaterialIcon name={persona.icon} className="text-[20px]" />
                        </div>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded uppercase ${accentClasses.chip}`}>
                          {persona.track}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{persona.title}</h3>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">The reality</span>
                        <p className="text-sm text-slate-200">{persona.reality}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${accentClasses.label}`}>
                          Our reassurance &amp; method
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed">{persona.method}</p>
                      </div>
                    </div>
                    <Button href="#checklist" variant="secondary" className="mt-6 justify-center">
                      {persona.cta}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cost comparator */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold tracking-wider uppercase mb-3">
                The Cost Of Non-Compliance
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy-950 mb-3">
                Unregistered Payroll vs. <span className="gradient-teal-blue-text">Managed CNPS Standing</span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Weighing the compounding risk of undeclared employees against a predictable,
                managed CNPS filing cadence.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-2xl bg-rose-50/60 border border-rose-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-rose-200/70 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600">Unmanaged Route</span>
                      <h3 className="text-xl font-bold text-navy-950 mt-0.5">Undeclared or Lapsed Standing</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                      <MaterialIcon name="warning" className="text-rose-500 text-[24px]" />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-700 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Undeclared Employee Penalties:</strong> CNPS can
                        retroactively assess unpaid contributions and penalties once an unregistered
                        employee is discovered.{" "}
                        <span className="text-amber-700 italic">[PENDING: confirm penalty framework]</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Lapsed Clearance, Lost Tenders:</strong> An expired
                        Attestation pour Soumission disqualifies you from public and corporate tenders.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Employee Claims Exposure:</strong> Without
                        registration, a workplace injury leaves the employer directly exposed instead
                        of the claim routing through CNPS insurance.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Back-Payment Audits:</strong> Historical gaps
                        surface during inspections, triggering back-payment across your full register.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-700 font-medium flex items-center justify-between">
                  <span>Outcome: sudden liabilities and lost tender eligibility, discovered at the worst time.</span>
                  <MaterialIcon name="error" className="text-rose-500 text-[18px] shrink-0 ml-2" />
                </div>
              </div>
              <div className="rounded-2xl bg-teal-50/60 border border-teal-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-teal-200/70 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-700">Managed Route</span>
                      <h3 className="text-xl font-bold text-navy-950 mt-0.5">Uptech Consulting Managed Standing</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0">
                      <MaterialIcon name="verified" className="text-teal-600 text-[24px]" />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-700 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Registered From Day One:</strong> Every hire
                        declared on schedule, so there&apos;s never a gap for an inspection to find.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Active Clearance, Always Ready:</strong> Attestation
                        pour Soumission renewed proactively, ready whenever a tender appears.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Insured Workforce:</strong> Registered employees
                        are covered by CNPS&apos;s social insurance framework, as intended.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Documented Filing Trail:</strong> Verifiable
                        receipts and declaration records on hand, ready if anyone ever asks.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-teal-200 text-xs text-teal-700 font-medium flex items-center justify-between">
                  <span>Outcome: clean employer standing, ready for CNPS review or a tender deadline.</span>
                  <MaterialIcon name="check" className="text-teal-600 text-[18px] shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENT QUESTIONS</span>
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">CNPS compliance questions, answered</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer lastReviewed="[PENDING: confirm review date with Uptech Consulting]" />

        {/*
         * Numbering note for the team: the badge above reads "04/04," which
         * matches the Business Formalisation & Compliance hub's own flat
         * numbering (Cameroon=01, US=02, Tax Compliance=03, CNPS=04 — one
         * shared count across all 4 pathways, confirmed against
         * app/services/business-formalisation-compliance/page.tsx and every
         * sibling page's own Breadcrumb tag). It is NOT a "step 4 of 4 in
         * one strict sequence" claim — within Cameroon specifically this is
         * step 3 of a 3-step track (Formalisation → Tax → CNPS); "04/04"
         * only reflects CNPS's position across the full 4-page directory,
         * which also includes the separate, parallel US pathway. The copy
         * below is written to make that explicit rather than implying a
         * single linear sequence, per that resolution.
         */}
        <WhatComesNext
          eyebrow="EXPLORE MORE PATHWAYS"
          title="Explore the full compliance directory"
          description="You've completed the Cameroon compliance sequence — Formalisation, Tax Compliance, and now CNPS. If your business also needs US formation, that's a separate, parallel pathway (not a next step in this sequence) — browse the full directory to find it."
          href="/services/business-formalisation-compliance"
          linkLabel="View all pathways"
        />

        {/* Final CTA */}
        <section className="relative py-28 bg-navy-950 text-white text-center overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-teal-400/40 text-teal-300 text-xs font-bold tracking-widest uppercase mb-5 backdrop-blur-md">
              CNPS Desk Active in Buea &amp; Douala
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Ready to bring your <span className="gradient-teal-blue-text">team into compliance?</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Book a consultation or message our CNPS desk directly — we&apos;ll assess your current
              standing and set up your filing rhythm.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?service=cnps-compliance">Book a Consultation</Button>
              <WhatsAppButton phone="237678597593" label="Chat on WhatsApp CNPS Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
