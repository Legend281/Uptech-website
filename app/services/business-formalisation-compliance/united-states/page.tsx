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
  title: "Business Formalisation — United States",
  description:
    "LLC and C-Corp formation in the United States for international founders, including Registered Agent service and IRS EIN acquisition.",
};

const trustStripItems = [
  {
    icon: "public",
    title: "Multi-State Coverage",
    badgeText: "Delaware · Wyoming · Texas",
    badgeAccent: "teal" as const,
    description: "Formation support across the states most commonly chosen by international founders.",
  },
  {
    icon: "badge",
    title: "Registered Agent Included",
    badgeText: "Required by Law",
    badgeAccent: "sky" as const,
    description: "Every US LLC/C-Corp needs a registered agent with a physical in-state address.",
  },
  {
    icon: "account_balance",
    title: "IRS EIN Coordination",
    badgeText: "Federal Tax ID",
    badgeAccent: "emerald" as const,
    description: "We coordinate your Employer Identification Number application with the IRS.",
  },
];

const steps = [
  {
    number: "01",
    title: "Entity Type & State Selection",
    description:
      "We help you weigh LLC vs. C-Corp and compare state-specific tradeoffs (formation cost, privacy, franchise tax) against your goals.",
  },
  {
    number: "02",
    title: "Formation Filing",
    description: "Articles of Organization (LLC) or Articles of Incorporation (C-Corp) filed with the state.",
  },
  {
    number: "03",
    title: "Registered Agent & IRS EIN",
    description: "Registered agent service activated, and your federal Employer Identification Number application coordinated with the IRS.",
  },
  {
    number: "04",
    title: "Operating Agreement / Bylaws",
    description: "Founding governance documents drafted to reflect ownership, decision rights, and profit distribution.",
  },
  {
    number: "05",
    title: "Ongoing State & Federal Compliance",
    description: "[PENDING: confirm current annual report, franchise tax, and federal reporting obligations with UCO — these change periodically at the state and federal level].",
  },
];

const documents = [
  { strong: "Founder identification:", text: "Valid passport copy for each proposed owner/director." },
  { strong: "Proposed company name(s):", text: "In priority order, for availability search with the state." },
  { strong: "Business purpose:", text: "A short description of what the entity will do." },
  { strong: "Registered agent decision:", text: "Confirmation you want UCO to act as or arrange your registered agent." },
];

const faqItems = [
  {
    question: "Do I need to be a US citizen or resident to form an LLC?",
    answer:
      "No. Non-US residents can form and own a US LLC or C-Corp. You do not need a US visa, Social Security Number, or physical US address to be a founder — though a registered agent with a physical in-state address is required for the entity itself.",
  },
  {
    question: "Which state should I choose?",
    answer:
      "It depends on your business goals, where your customers/investors are, and cost tolerance for annual fees. Delaware, Wyoming, and Texas are common choices for international founders. [PENDING: UCO's specific state-recommendation guidance for different founder profiles].",
  },
  {
    question: "Can I open a US bank account remotely?",
    answer:
      "Many banks and fintech platforms now support remote account opening for US entities with an EIN, though requirements vary by provider and can change. [PENDING: confirm UCO's current banking-partner recommendations].",
  },
];

export default function BusinessFormalisationUnitedStatesPage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
          { label: "United States" },
        ]}
        tag="SUB-SERVICE 02/05 • US LLC / C-CORP FORMATION"
      />

      <main>
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  UNITED STATES JURISDICTION • 50 STATES
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Form your US entity, <span className="gradient-teal-blue-text">without the guesswork.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                LLC and C-Corp formation for international founders and Cameroon-based businesses
                expanding into the US market — state filing, registered agent, and IRS EIN
                coordination handled end to end.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#checklist">Get Formation Checklist</Button>
                <WhatsAppButton phone="237600000000" label="Chat on WhatsApp Legal Desk" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FORMATION SEQUENCE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                From entity selection to a functioning US company
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-dashed border-amber-300 px-3 py-1.5 rounded-lg text-xs text-amber-800">
                <MaterialIcon name="schedule" className="text-[16px]" />
                Turnaround timeline: [PENDING: confirm with UCO]
              </div>
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
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">BEFORE WE FILE</span>
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">What we&apos;ll need from you</h2>
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
            <div className="mt-6 p-5 rounded-2xl bg-white border border-dashed border-amber-400/80 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-900">State Filing Fees &amp; UCO Service Fees</h4>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300">
                  [PENDING: confirm with UCO]
                </span>
              </div>
              <p className="text-xs text-slate-600">State filing fees vary by state and change periodically; confirm current figures with your UCO desk.</p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENT QUESTIONS</span>
              <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">Common questions on US formation</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer lastReviewed="[PENDING: confirm review date with UCO]" />

        <WhatComesNext
          title="Explore the full compliance directory"
          description="US formation runs independently of the Cameroon compliance track. See every formalisation and tax pathway UCO supports on both sides."
          href="/services/business-formalisation-compliance"
          linkLabel="View all pathways"
        />

        <section className="py-24 bg-navy-950 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Ready to <span className="gradient-teal-blue-text">form your US entity?</span>
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?service=business-formalisation-us">Book a Consultation</Button>
              <WhatsAppButton phone="237600000000" label="Chat on WhatsApp Legal Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
