import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "CNPS Compliance — Cameroon",
  description:
    "Employer social insurance registration, monthly employee declarations (DPAE), payroll withholding, and CNPS Clearance Certificates.",
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
    icon: "event_repeat",
    title: "Monthly DPAE Filing",
    badgeText: "Employee Declarations",
    badgeAccent: "sky" as const,
    description: "Recurring declarations kept current against your payroll records.",
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
    title: "Employer Matricule Registration",
    description: "Your business is registered with CNPS as an employer, generating your employer matricule number.",
  },
  {
    number: "02",
    title: "Employee Declarations (DPAE)",
    description: "Each employee is declared to CNPS, linking them to the social insurance system.",
  },
  {
    number: "03",
    title: "Monthly Payroll Withholding & Filing",
    description: "Employer and employee CNPS contributions calculated from payroll and filed on the required cadence.",
  },
  {
    number: "04",
    title: "CNPS Clearance Certificate",
    description: "Attestation pour Soumission maintained and renewed so you stay eligible for tenders and institutional contracts.",
  },
];

const documents = [
  { strong: "Business registration:", text: "RCCM certificate and Taxpayer ID (NIU)." },
  { strong: "Employee records:", text: "ID documents and employment contracts for each declared employee." },
  { strong: "Payroll records:", text: "Monthly gross/net salary breakdowns used to calculate contributions." },
];

const faqItems = [
  {
    question: "Do all employees need to be declared to CNPS?",
    answer:
      "Employees are generally required to be declared to CNPS under Cameroon labour and social security law. Specific coverage rules can vary by employment arrangement. [PENDING: confirm current DPAE requirements and any exceptions with UCO].",
  },
  {
    question: "What happens if my business isn't registered with CNPS yet?",
    answer:
      "We conduct a review of your current employee register and help bring your CNPS registration and past declarations up to date, similar to how back-filings are handled for tax compliance.",
  },
  {
    question: "What are the current CNPS contribution rates?",
    answer: "[PENDING: confirm current employer/employee CNPS contribution rates with UCO — these are set by CNPS and can be revised].",
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
        tag="SUB-SERVICE 04/05 • CNPS & LABOUR"
      />

      <main>
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  CAMEROON • CNPS &amp; LABOUR COMPLIANCE
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Keep your team&apos;s social security compliant,{" "}
                <span className="gradient-teal-blue-text">without the paperwork maze.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Employer registration, monthly employee declarations, payroll withholding, and
                CNPS clearance certificates — kept current as your team grows.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#checklist">Get CNPS Checklist</Button>
                <WhatsAppButton phone="237670000000" label="Chat on WhatsApp Tax Desk" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">THE COMPLIANCE CYCLE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                From first hire to ongoing clearance
              </h2>
            </div>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                  <span className="w-10 h-10 rounded-xl bg-navy-950 text-teal-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-950">{step.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="checklist" className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHAT WE&apos;LL NEED</span>
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">CNPS registration checklist</h2>
            </div>
            <ul className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
              {documents.map((doc) => (
                <li key={doc.strong} className="p-5 flex items-start gap-3">
                  <MaterialIcon name="check_circle" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong className="text-slate-900">{doc.strong}</strong> {doc.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENT QUESTIONS</span>
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">CNPS compliance questions, answered</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer lastReviewed="[PENDING: confirm review date with UCO]" />

        <WhatComesNext
          title="Explore the full compliance directory"
          description="You've reached the last stop in the Cameroon business compliance track. Browse the full directory if you also need US formation or a different pathway."
          href="/services/business-formalisation-compliance"
          linkLabel="View all pathways"
        />

        <section className="py-24 bg-navy-950 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Ready to bring your <span className="gradient-teal-blue-text">team into compliance?</span>
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact">Book a Consultation</Button>
              <WhatsAppButton phone="237670000000" label="Chat on WhatsApp Tax Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
