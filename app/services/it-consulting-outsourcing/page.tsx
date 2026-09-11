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
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "IT Consulting & Outsourcing",
  description:
    "Advisory, managed support and hands-on delivery for the systems your business depends on — scoped to what you actually need, not a fixed package.",
};

const trustStripItems = [
  {
    icon: "dns",
    title: "Dual Infrastructure",
    badgeText: "Buea, Cameroon · Texas, USA",
    badgeAccent: "teal" as const,
  },
  {
    icon: "schedule",
    title: "24/7 Monitoring Availability",
    badgeText: "Transatlantic Coverage",
    badgeAccent: "sky" as const,
  },
  {
    // The company's own stated reason for holding entities in both countries
    // (CLAUDE.md Section 1). The mockup paired this heading with "Continuous
    // Failover & Security Audits", which describes infrastructure, not
    // compliance.
    icon: "verified_user",
    title: "Cross-Border Compliance",
    badgeText: "Cameroon & US Regulatory Alignment",
    badgeAccent: "emerald" as const,
  },
];

/*
 * Uptech Consulting's official service directory lists FIVE IT sub-services:
 *
 *   Database Development & Administration         -> 04 Database Management
 *   Cloud Data Migration & Digital Transformation -> 03 Cloud Migration
 *   Help Desk & Call Center Outsourcing           -> 02 Managed IT Support
 *   AI Compliance & Advisory                      -> 06 AI & Compliance Advisory
 *   System Security                               -> 05 Cybersecurity
 *
 * 01 "Technology Advisory" maps to none of them. It came from the mockup, not
 * the directory. Whether it is a deliberate addition or should be cut/renamed
 * is a team decision — do not remove or rename it without confirmation. If it
 * goes, the "Six ways we show up" heading below must change with it.
 */
const capabilities = [
  {
    number: "01",
    category: "Advisory & Roadmap",
    title: "Technology Advisory",
    description:
      "Independent guidance on architecture, vendor choices and technical roadmap decisions.",
    icon: "explore",
    tags: ["Architecture review", "Vendor-agnostic audit"],
  },
  {
    number: "02",
    category: "Daily Operations",
    title: "Managed IT Support",
    description:
      "Ongoing help desk and systems support so issues get resolved without waiting on a single in-house person.",
    icon: "support_agent",
    tags: ["SLA-backed response", "Multi-tier help desk"],
  },
  {
    number: "03",
    category: "Cloud Infrastructure",
    title: "Cloud Migration",
    description:
      "Structured migration planning and execution, with minimal disruption to daily operations.",
    icon: "cloud_sync",
    tags: ["Zero data loss plan", "Hybrid & multi-cloud"],
  },
  {
    number: "04",
    category: "Data Integrity",
    title: "Database Management",
    description: "Setup, optimisation and ongoing care for the systems that hold your business data.",
    icon: "database",
    tags: ["Continuous failover care", "Performance tuning"],
  },
  {
    number: "05",
    category: "Defense & Hardening",
    title: "Cybersecurity",
    description:
      "Risk assessment and protective measures scoped to your actual exposure, not a generic checklist.",
    icon: "security",
    tags: ["Threat perimeter auditing", "Endpoint protection"],
  },
  {
    number: "06",
    category: "Governance & AI",
    title: "AI & Compliance Advisory",
    description:
      "Practical guidance on where AI tools help, and where regulatory or data obligations mean caution first.",
    icon: "policy",
    tags: ["Audit & risk governance", "Regulatory clearance"],
  },
];

const personas = [
  {
    profile: "Profile 01",
    icon: "trending_up",
    accent: "teal" as const,
    title: "Growing businesses without a full internal IT function",
    description:
      "Organizations moving past informal workarounds that require institutional-grade stability without enterprise headcount overhead.",
    points: [
      "No dedicated IT lead yet",
      "Systems have outgrown ad-hoc fixes",
      "Need a second opinion before a big technical decision",
    ],
    outcome: "Reduced downtime, single point of accountability, lower total operational costs.",
  },
  {
    profile: "Profile 02",
    icon: "apartment",
    accent: "blue" as const,
    title: "Institutions modernising existing systems",
    description:
      "Established enterprises needing rigorous execution to update mission-critical software, databases, or cloud infrastructure safely.",
    points: [
      "Legacy systems due for migration",
      "Compliance requirements changing",
      "Need documented processes, not individual reliance",
    ],
    outcome: "Zero unplanned outages, full architecture governance, audit-ready compliance.",
  },
];

const personaAccent: Record<"teal" | "blue", { iconBg: string; iconText: string; dotBg: string; dotText: string }> = {
  teal: { iconBg: "bg-teal-50 border-teal-200/70", iconText: "text-teal-600", dotBg: "bg-teal-50 border-teal-200", dotText: "text-teal-600" },
  blue: { iconBg: "bg-blue-50 border-blue-200/70", iconText: "text-blue-accent", dotBg: "bg-blue-50 border-blue-200", dotText: "text-blue-accent" },
};

const engagementSteps = [
  {
    number: "01",
    title: "Technical assessment",
    tag: "Unbiased Discovery",
    description:
      "We review your current systems and identify the real constraint — capacity, security, cost, or process.",
  },
  {
    number: "02",
    title: "Scoped roadmap",
    tag: "Transparent Milestones",
    description:
      "A written plan covering what changes, in what order, and what it depends on — reviewed with your team before anything starts.",
  },
  {
    number: "03",
    title: "Delivery or handover",
    tag: "Operational Independence",
    description:
      "We either run the work directly, support your team through it, or hand over a documented system your team can maintain.",
  },
];

const faqItems = [
  {
    question: "Do you replace our internal IT team, or work alongside them?",
    answer:
      "We adapt to your setup. We can serve as your complete external IT department, provide targeted leadership to mentor internal staff, or co-manage specific infrastructure layers alongside your existing administrators.",
  },
  {
    question: "Can you support a migration from legacy on-premise systems?",
    answer:
      "Yes. We plan and execute staged migrations with redundant backups and phased rollouts so operations continue without unscheduled downtime.",
  },
  {
    question: "What does ongoing managed support actually include?",
    answer:
      "Continuous monitoring, scheduled system updates, proactive security patches, user help desk ticket resolution, and documented incident reporting delivered to agreed response standards.",
  },
  {
    question: "How do you handle compliance requirements that differ between Cameroon and the US?",
    answer:
      "Our bilateral legal and operational structure ensures infrastructure implementations adhere to both local regulations (including OHADA and national telecom/data norms in Central Africa) and US regulatory standards, ensuring cross-border data integrity.",
  },
];

/*
 * No pillar numbers. The mockup counted Career Marketing & Placement as
 * "Pillar 03", but officially it is a sub-service of this practice (CLAUDE.md
 * Section 4), and a numbering that skips the two paused pillars would imply a
 * three-pillar company. Each card states its relationship to this page instead.
 */
const relatedServices = [
  {
    icon: "description",
    relationship: "Separate practice",
    title: "Business Formalisation & Compliance",
    href: "/services/business-formalisation-compliance",
  },
  {
    icon: "trending_up",
    relationship: "Part of this practice",
    title: "Career Marketing & Placement",
    href: "/services/career-marketing-placement",
  },
];

export default function ItConsultingOutsourcingPage() {
  return (
    <>
      <Header activeService="it-consulting" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "IT Consulting & Outsourcing" },
        ]}
        tag="MANAGED IT & INFRASTRUCTURE"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-75 lg:opacity-85 pointer-events-none">
            <Image
              src={images["ops-center"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["ops-center"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  IT CONSULTING &amp; OUTSOURCING
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Technology support that{" "}
                <span className="gradient-teal-blue-text">doesn&apos;t wait for a crisis</span> to show up.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Advisory, managed support and hands-on delivery for the systems your business
                depends on — scoped to what you actually need, not a fixed package.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Button
                  href="#consultation"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                >
                  Book a Consultation
                </Button>
                <WhatsAppButton phone="237670000000" label="Chat on WhatsApp" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* What's included */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHAT&apos;S INCLUDED</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight mb-4">
                  Six ways we show up, depending on what&apos;s actually broken or missing.
                </h2>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                  We don&apos;t sell monolithic IT bundles. We scope directly to where operational
                  stability and engineering rigor are required.
                </p>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-navy-950 group">
                  <Image
                    src={images["infrastructure-corridor"].src}
                    alt={images["infrastructure-corridor"].alt}
                    width={images["infrastructure-corridor"].width}
                    height={images["infrastructure-corridor"].height}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    placeholder="blur"
                    blurDataURL={images["infrastructure-corridor"].blurDataURL}
                    className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-navy-900/85 backdrop-blur-md text-teal-400 border border-teal-500/30">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      LIVE MULTI-CLOUD TELEMETRY
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-navy-950/80 backdrop-blur-md text-slate-300 border border-white/10">
                      TX &amp; CMR NODE
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-navy-950/90 backdrop-blur-md border border-slate-700/80 text-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Enterprise Infrastructure Tier</span>
                      <span className="text-[11px] font-mono text-slate-400">Zero Data Loss Protocol</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Engineered for continuous failover, cross-border privacy mandates, and
                      structured operational governance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 divide-y divide-slate-200/80">
                {capabilities.map((item) => (
                  <div
                    key={item.number}
                    className="py-7 first:pt-0 group hover:bg-slate-50/70 p-5 -mx-4 rounded-xl transition-all border border-transparent hover:border-teal-500/20 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-950 border border-slate-800 text-teal-400 text-xs font-mono font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        {item.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 font-bold">
                              {item.category}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-navy-950 group-hover:text-blue-accent transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors shrink-0">
                            <MaterialIcon name={item.icon} className="text-[18px]" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                        <div className="mt-3.5 flex flex-wrap items-center gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section className="py-24 bg-slate-100/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHO THIS IS FOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Built for teams that need technical certainty, not trial and error.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 ring-1 ring-black/5">
                  <Image
                    src={images["it-advisory"].src}
                    alt={images["it-advisory"].alt}
                    width={images["it-advisory"].width}
                    height={images["it-advisory"].height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["it-advisory"].blurDataURL}
                    className="w-full h-[460px] sm:h-[540px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:max-w-md bg-navy-950/90 backdrop-blur-md text-white p-6 sm:p-7 rounded-xl border-l-4 border-teal-400 shadow-xl">
                    <p className="font-bold text-sm sm:text-base leading-snug">
                      Independent technical advisory for leadership teams making mission-critical
                      commitments.
                    </p>
                    <p className="text-xs text-teal-300 font-semibold tracking-wide mt-2.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      Single point of technical accountability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-6">
                {personas.map((persona) => {
                  const accent = personaAccent[persona.accent];
                  return (
                    <div
                      key={persona.profile}
                      className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${accent.iconBg} ${accent.iconText}`}>
                          <MaterialIcon name={persona.icon} className="text-[22px]" />
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${accent.iconText}`}>
                            {persona.profile}
                          </span>
                          <h3 className="text-lg font-bold text-navy-950 leading-snug">{persona.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{persona.description}</p>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 mb-5">
                        {persona.points.map((point) => (
                          <li key={point} className="flex items-start gap-2.5">
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 text-[10px] ${accent.dotBg} ${accent.dotText}`}>
                              ✓
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-navy-950 uppercase text-[10px] tracking-wider block mb-0.5 font-mono">
                          Expected Outcome
                        </span>
                        {persona.outcome}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How an engagement runs */}
        <section className="relative py-24 bg-navy-950 text-white overflow-hidden border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-75 lg:opacity-85 pointer-events-none">
            <Image
              src={images["ops-center"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["ops-center"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">ENGAGEMENT RHYTHM</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  Documented progress at every milestone.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                  A clear operating rhythm keeps every technical phase accountable. No black
                  boxes, no unexpected change requests.
                </p>
                {/* Same destination as every other CTA on the page. There is no
                    separate "technical assessment" intake, so the button says
                    what it does; the assessment is step 01 once an engagement
                    is booked. */}
                <Button
                  href="#consultation"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                >
                  Book a Consultation
                </Button>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {engagementSteps.map((step) => (
                  <div
                    key={step.number}
                    className="frosted-glass p-6 sm:p-7 rounded-xl flex items-start gap-5 hover:bg-white/[0.08] transition-colors group"
                  >
                    {/* Deliberately unlike the capability index above: a filled
                        circle with heavy sans digits reads as a sequence; the
                        navy squares with mono digits read as a menu. */}
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-400 text-sm font-extrabold tracking-tight text-navy-950 flex-shrink-0 shadow-[0_0_0_4px_rgba(45,212,191,0.18)]">
                      <span className="sr-only">Step </span>
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-teal-300 transition-colors">
                          {step.title}
                        </h3>
                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider shrink-0">
                          {step.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENT QUESTIONS</span>
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Clarity on scope before we begin.
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Related services */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">EXPLORE OTHER SERVICES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                  Comprehensive capability across advisory and execution.
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              {relatedServices.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-navy-950 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <MaterialIcon name={service.icon} className="text-[18px]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {service.relationship}
                    </span>
                    <h3 className="text-sm font-bold text-navy-950 group-hover:text-blue-accent transition-colors mt-1">
                      {service.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-accent group-hover:text-teal-600">
                    <span>View details</span>
                    <MaterialIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="consultation" className="relative py-24 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-75 lg:opacity-85 pointer-events-none">
            <Image
              src={images["ops-center"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["ops-center"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-teal-400/40 text-teal-400 text-xs font-bold tracking-widest uppercase mb-4">
              Consultation First
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight mb-4">
              Ready to fix what&apos;s actually <span className="gradient-teal-blue-text">broken or missing?</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Book a consultation with our technical desk to scope the work against your real
              constraints — not a fixed package.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/contact?service=it-consulting"
                icon={<MaterialIcon name="arrow_forward" className="text-[18px]" />}
              >
                Book a Consultation
              </Button>
              <WhatsAppButton phone="237670000000" label="Chat on WhatsApp" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
