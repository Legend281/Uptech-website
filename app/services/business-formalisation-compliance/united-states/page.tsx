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
    // Real fact, not an advisory claim: Uptech Consulting's own second
    // legal entity is a US S-Corp based in Stafford, Texas (CLAUDE.md
    // Section 1) — the single most relevant trust fact on the entire site
    // for this exact page, previously unused here entirely.
    icon: "location_on",
    title: "Real US Presence",
    badgeText: "Stafford, Texas",
    badgeAccent: "teal" as const,
    description: "Uptech Consulting operates its own US S-Corp entity — physical presence, not just advisory distance.",
  },
  {
    icon: "public",
    title: "Multi-State Coverage",
    badgeText: "Delaware · Wyoming · Texas",
    badgeAccent: "sky" as const,
    description: "Formation support across the states most commonly chosen by international founders.",
  },
  {
    icon: "badge",
    title: "Registered Agent Included",
    badgeText: "Required by Law",
    badgeAccent: "emerald" as const,
    description: "Every US LLC/C-Corp needs a registered agent with a physical in-state address.",
  },
  {
    icon: "account_balance",
    title: "IRS EIN Coordination",
    badgeText: "Federal Tax ID",
    badgeAccent: "teal" as const,
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
  // Ongoing State & Federal Compliance used to be step 05 here — a single
  // fully-[PENDING] line for a genuinely recurring obligation. Promoted to
  // its own section below (ongoingCompliance) with real structure, matching
  // the depth Tax Compliance and CNPS give their own recurring obligations.
];

const ongoingCompliance = [
  {
    icon: "event_repeat",
    title: "Annual Report",
    cadence: "[PENDING: confirm cadence]",
    description: "Most states require a yearly filing confirming your entity's current officers, registered agent, and address.",
  },
  {
    icon: "receipt_long",
    title: "Franchise Tax",
    cadence: "[PENDING: confirm cadence]",
    description: "A state-level fee for the right to operate as a registered entity — separate from federal or state income tax, and due regardless of profitability.",
  },
  {
    icon: "badge",
    title: "Registered Agent Renewal",
    cadence: "[PENDING: confirm cadence]",
    description: "Your registered agent service must stay active — lapsing it risks losing good standing and, eventually, administrative dissolution.",
  },
];

const documents = [
  { strong: "Founder identification:", text: "Valid passport copy for each proposed owner/director." },
  { strong: "Proposed company name(s):", text: "In priority order, for availability search with the state." },
  { strong: "Business purpose:", text: "A short description of what the entity will do." },
  { strong: "Registered agent decision:", text: "Confirmation you want Uptech Consulting to act as or arrange your registered agent." },
];

// Two genuinely different starting points this page serves, previously
// conflated into one hero sentence with no persona section to separate
// them.
const personas = [
  {
    track: "Track A",
    icon: "corporate_fare",
    title: "Cameroon Business Expanding to the US",
    reality: "“We already operate in Cameroon and want a real US entity to invoice US clients, hold a US bank account, or build credibility with American partners.”",
    method:
      "We form your US entity alongside your existing Cameroon structure, coordinate the EIN application, and set up the registered agent — so both sides of your operation stand on solid ground.",
    cta: "Start My US Expansion",
  },
  {
    track: "Track B",
    icon: "flight_takeoff",
    title: "Diaspora Individual Registering Solo",
    reality: "“I live and work abroad, I’ve never had a Cameroon business, and I just need my own US LLC for freelance or remote client work.”",
    method:
      "No existing entity required. We handle entity selection, state filing, registered agent, and EIN coordination as a standalone process built around your situation.",
    cta: "Start My Solo Formation",
  },
];

const faqItems = [
  {
    // Was stated as flat, unhedged legal fact — the one confident claim on
    // this page with no qualification, unlike everything else here.
    // Downgraded per the family-wide confidence-vs-pending audit fix.
    question: "Do I need to be a US citizen or resident to form an LLC?",
    answer:
      "Generally, no — non-US residents can typically form and own a US LLC or C-Corp without a US visa, Social Security Number, or physical US address as a founder, though a registered agent with a physical in-state address is required for the entity itself. Confirm current requirements for your specific situation with your Uptech Consulting consultant.",
  },
  {
    question: "Which state should I choose?",
    answer:
      "It depends on your business goals, where your customers/investors are, and cost tolerance for annual fees. Delaware, Wyoming, and Texas are common choices for international founders. [PENDING: Uptech Consulting's specific state-recommendation guidance for different founder profiles].",
  },
  {
    question: "Can I open a US bank account remotely?",
    answer:
      "Many banks and fintech platforms now support remote account opening for US entities with an EIN, though requirements vary by provider and can change. [PENDING: confirm Uptech Consulting's current banking-partner recommendations].",
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
        tag="SUB-SERVICE 02/04 • US LLC / C-CORP FORMATION"
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
              {/* Explicitly names both starting points this page serves —
                  previously conflated into one vague "international
                  founders" phrase with no persona section to separate them. */}
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                LLC and C-Corp formation for two starting points: Cameroon-based businesses
                expanding into the US market, and diaspora individuals already living or working
                abroad who want to register their own US entity — state filing, registered agent,
                and IRS EIN coordination handled end to end.
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
                Turnaround timeline: [PENDING: confirm with Uptech Consulting]
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
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">DOCUMENTS &amp; REQUIREMENTS</span>
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
                <h4 className="text-sm font-bold text-slate-900">State Filing Fees &amp; Uptech Consulting Service Fees</h4>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300">
                  [PENDING: confirm with Uptech Consulting]
                </span>
              </div>
              <p className="text-xs text-slate-600">State filing fees vary by state and change periodically; confirm current figures with your Uptech Consulting desk.</p>
            </div>
          </div>
        </section>

        {/* Ongoing compliance — was a single fully-[PENDING] step in the
            Formation Sequence list; promoted to its own section with real
            structure (categories of obligation, even with figures still
            pending) matching the depth Tax Compliance and CNPS give their
            own recurring obligations. */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">AFTER FORMATION</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Staying Compliant After Formation
              </h2>
              <p className="text-slate-600 mt-2">
                Forming your entity is a one-time event. Keeping it in good standing is not —
                these obligations recur for as long as the entity exists.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ongoingCompliance.map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <MaterialIcon name={item.icon} className="text-[20px]" />
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300">
                      {item.cadence}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-24 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">WHO THIS IS FOR</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Two Starting Points, One Formation Process
              </h2>
              <p className="text-slate-300 mt-3">
                Whether you&apos;re expanding an existing Cameroon business into the US, or
                registering your own US entity from scratch while living abroad, the process is
                built around where you&apos;re actually starting from.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {personas.map((persona) => (
                <div key={persona.title} className="frosted-glass rounded-2xl p-7 flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
                        <MaterialIcon name={persona.icon} className="text-[20px]" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded uppercase bg-teal-500/20 text-teal-300">
                        {persona.track}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{persona.title}</h3>
                    <div className="p-4 rounded-lg bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">The reality</span>
                      <p className="text-sm text-slate-200">{persona.reality}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-2">
                        Our reassurance &amp; method
                      </span>
                      <p className="text-sm text-slate-300 leading-relaxed">{persona.method}</p>
                    </div>
                  </div>
                  <Button href="#checklist" variant="secondary" className="mt-6 justify-center">
                    {persona.cta}
                  </Button>
                </div>
              ))}
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
                The Cost Of Doing It Alone
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy-950 mb-3">
                DIY Formation vs. <span className="gradient-teal-blue-text">Guided Formation</span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Weighing the compounding risk of unguided self-filing against a managed formation
                and compliance process.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-2xl bg-rose-50/60 border border-rose-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-rose-200/70 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600">Unassisted Route</span>
                      <h3 className="text-xl font-bold text-navy-950 mt-0.5">Self-Filing &amp; Guesswork</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                      <MaterialIcon name="warning" className="text-rose-500 text-[24px]" />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-700 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Wrong State for Your Goals:</strong> Choosing a state by
                        reputation alone, then discovering its fees or tax treatment don&apos;t fit
                        your actual business.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Lapsed Registered Agent:</strong> Missing a renewal risks
                        losing good standing and, eventually, administrative dissolution.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">EIN &amp; Banking Delays:</strong> Filing errors on the EIN
                        application can stall the one document every US bank asks for first.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-500 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Missed Ongoing Filings:</strong> Annual reports and
                        franchise tax are easy to lose track of from abroad, with no local reminder system.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-700 font-medium flex items-center justify-between">
                  <span>Outcome: an entity that quietly falls out of good standing while you assume it&apos;s fine.</span>
                  <MaterialIcon name="error" className="text-rose-500 text-[18px] shrink-0 ml-2" />
                </div>
              </div>
              <div className="rounded-2xl bg-teal-50/60 border border-teal-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-teal-200/70 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-700">Managed Route</span>
                      <h3 className="text-xl font-bold text-navy-950 mt-0.5">Uptech Consulting Managed Formation</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0">
                      <MaterialIcon name="verified" className="text-teal-600 text-[24px]" />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-700 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">State Chosen for Your Goals:</strong> Weighed against your
                        actual business, not just Delaware&apos;s reputation.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Registered Agent Maintained:</strong> Active and renewed,
                        so good standing is never at risk of quietly lapsing.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Clean EIN Filing:</strong> Coordinated correctly the first
                        time, so your bank account isn&apos;t waiting on a fixable mistake.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-600 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Ongoing Filings Tracked:</strong> Annual report and
                        franchise tax deadlines tracked on your behalf, not left to memory from abroad.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-teal-200 text-xs text-teal-700 font-medium flex items-center justify-between">
                  <span>Outcome: a US entity that stays in good standing without you tracking it manually.</span>
                  <MaterialIcon name="check" className="text-teal-600 text-[18px] shrink-0 ml-2" />
                </div>
              </div>
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

        <ComplianceDisclaimer lastReviewed="[PENDING: confirm review date with Uptech Consulting]" />

        <WhatComesNext
          title="Explore the full compliance directory"
          description="US formation runs independently of the Cameroon compliance track. See every formalisation and tax pathway Uptech Consulting supports on both sides."
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
