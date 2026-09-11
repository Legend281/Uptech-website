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
  title: "Tax Compliance for Individuals — Cameroon",
  description:
    "Personal income tax (IRPP) declarations for freelancers, remote earners, and diaspora professionals with Cameroon tax obligations.",
};

const trustStripItems = [
  {
    icon: "person",
    title: "Personal IRPP Filing",
    badgeText: "Annual Declaration",
    badgeAccent: "teal" as const,
    description: "Statutory personal income tax declarations handled on your behalf.",
  },
  {
    icon: "public",
    title: "Foreign Income Regularisation",
    badgeText: "Remote & Diaspora Earners",
    badgeAccent: "sky" as const,
    description: "Cross-border freelance and remote income brought into good standing.",
  },
  {
    icon: "workspace_premium",
    title: "Individual ANR",
    badgeText: "Visa & Banking Use",
    badgeAccent: "emerald" as const,
    description: "Personal Attestation de Non-Redevance for visa applications and banking needs.",
  },
];

const personas = [
  {
    title: "Remote professionals earning from foreign clients",
    reality:
      "\"I get paid in USD/EUR by clients abroad. I wasn't sure whether that income needed to be declared in Cameroon.\"",
    method:
      "We assess your residency and income-source status, then regularise foreign earnings under the correct personal tax treatment.",
  },
  {
    title: "Diaspora members with Cameroon-based income",
    reality:
      "\"I live abroad but earn rental income from property in Cameroon — I don't know what I owe or how to file from a distance.\"",
    method:
      "We handle the filing and clearance process remotely, so you don't need to travel for a personal tax matter.",
  },
  {
    title: "Freelancers & independent consultants",
    reality:
      "\"I work for myself, not under a registered company — I assumed personal tax rules didn't apply to me.\"",
    method:
      "We clarify your obligations as an individual earner and file the declarations that apply to your situation.",
  },
];

const documents = [
  { strong: "Identification:", text: "Valid national ID or passport." },
  { strong: "Proof of income:", text: "Contracts, pay slips, or invoices for the tax year being declared." },
  { strong: "Prior filings:", text: "Any previous year's IRPP declaration or tax identifier, if you have one." },
];

const faqItems = [
  {
    question: "Do I need to declare income I earn remotely from foreign clients?",
    answer:
      "Cameroon tax residents generally have personal income tax obligations on worldwide income, including remote/foreign-client earnings, though the exact treatment depends on your specific residency and income situation. [PENDING: confirm current IRPP treatment of foreign-sourced income with UCO].",
  },
  {
    question: "I don't have a registered company — do personal tax rules still apply to me?",
    answer:
      "Yes. Personal income tax (IRPP) applies to individuals regardless of whether they operate through a registered company. Freelancers, consultants, and independent earners are assessed as individual taxpayers.",
  },
  {
    question: "When is the personal tax filing deadline?",
    answer: "Filing deadline: before March 15 annually. [PENDING: confirm exact requirements for your specific income situation with UCO].",
  },
];

export default function TaxComplianceIndividualsCameroonPage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
          { label: "Tax Compliance — Individuals (Cameroon)" },
        ]}
        tag="SUB-SERVICE 05/05 • CAMEROON PERSONAL TAX (IRPP)"
      />

      <main>
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  CAMEROON • PERSONAL TAX (IRPP)
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Stay compliant on your personal taxes,{" "}
                <span className="gradient-teal-blue-text">wherever you earn from.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                For freelancers, remote professionals, and diaspora members with Cameroon tax
                obligations — personal income tax (IRPP) declarations, foreign-income
                regularisation, and individual tax clearance.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#checklist">Get My Tax Checklist</Button>
                <WhatsAppButton phone="237670000000" label="Chat on WhatsApp Tax Desk" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHO THIS IS FOR</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Personal situations, not corporate ones
              </h2>
              <p className="text-slate-600 mt-2">
                This is about your personal tax standing as an individual — separate from any
                company you may or may not operate.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <div key={persona.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="font-bold text-navy-950 mb-3">{persona.title}</h3>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/60 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                      Common situation
                    </span>
                    <p className="text-xs text-slate-600 italic leading-relaxed">{persona.reality}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <MaterialIcon name="task_alt" className="text-emerald-600 text-[16px] shrink-0 mt-0.5" />
                    <p>{persona.method}</p>
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
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">Personal tax filing checklist</h2>
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
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">Personal tax questions, answered</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer lastReviewed="[PENDING: confirm review date with UCO]" />

        <WhatComesNext
          title="Explore the full compliance directory"
          description="This is the only individual-facing pathway today. If you also operate a registered business, the business-facing pathways may apply to you as well."
          href="/services/business-formalisation-compliance"
          linkLabel="View all pathways"
        />

        <section className="py-24 bg-navy-950 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Ready to get your <span className="gradient-teal-blue-text">personal taxes in order?</span>
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?service=tax-compliance-individuals">Book a Consultation</Button>
              <WhatsAppButton phone="237670000000" label="Chat on WhatsApp Tax Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
