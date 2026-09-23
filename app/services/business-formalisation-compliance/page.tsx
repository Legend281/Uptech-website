import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/Button";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { ComplianceRouter } from "@/components/ComplianceRouter";
import { TimelineNote } from "@/components/TimelineNote";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { TiltCard } from "@/components/TiltCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Business Formalisation & Compliance",
  description:
    "Cross-border entity formation and statutory compliance across Cameroon (OHADA) and US jurisdictions — guided to the exact pathway for your situation.",
};

const trustStripItems = [
  {
    icon: "gavel",
    title: "Dual Jurisdiction",
    badgeText: "OHADA & US States",
    badgeAccent: "teal" as const,
    description: "Cameroon RCCM commercial registration and US LLC entity formation.",
  },
  {
    icon: "verified",
    title: "Certified Regulatory Filings",
    badgeText: "Court & Notarial Direct",
    badgeAccent: "sky" as const,
    description: "Articles of association, taxpayer ID (NIU), and EIN certification.",
  },
  {
    icon: "fact_check",
    title: "Proactive Compliance Cadence",
    badgeText: "Active Standing",
    badgeAccent: "emerald" as const,
    description: "Proactive DGI tax calendar, CNPS social filings, and annual US reports.",
  },
];

/*
 * Four real pathways, not five: Tax Compliance for Businesses and for
 * Individuals were unified into one page (Phase 3 of the leadership
 * adjustment round), so there's no longer a standalone individual-only
 * pathway to group separately. Tax Compliance carries an `audience` badge
 * instead of living in its own "For Individuals" section — it serves both,
 * shown as one card, not miscategorised under either column.
 */
const pathways: Array<{
  number: string;
  flag: string;
  accent: "teal" | "blue" | "emerald";
  title: string;
  description: string;
  tags: string[];
  timeline: string;
  href: string;
  audience?: string;
}> = [
  {
    number: "01",
    flag: "🇨🇲 Cameroon • OHADA / RCCM",
    accent: "teal",
    title: "Business Formalisation — Cameroon",
    description:
      "Full incorporation under OHADA standards: Articles of Association, notarial deposit, RCCM registration, and Taxpayer ID (NIU).",
    tags: ["SARL / SA / SAS", "Notarial Deed", "Taxpayer Card (NIU)"],
    // Web research (2026-09): CFCE's own published target for RCCM
    // registration, plus the practical range multiple independent sources
    // report. Distinct from Uptech's own total engagement timeline.
    timeline: "CFCE targets 72 hours; practically 3–15 days",
    href: "/services/business-formalisation-compliance/cameroon",
  },
  {
    number: "02",
    flag: "🇺🇸 United States • 50 States",
    accent: "blue",
    title: "Business Formalisation — United States",
    description:
      "Formation of Delaware, Wyoming, Texas, or state-specific LLCs and C-Corps, including Registered Agent service and IRS EIN acquisition.",
    tags: ["US LLC / C-Corp", "IRS EIN Issuance", "Registered Agent"],
    // Web research (2026-09): state filing + non-US-resident EIN processing
    // ranges, corroborated across multiple sources. See the US page's own
    // Turnaround Timeline widget for the full sourcing note.
    timeline: "State filing 2–10 days, plus ~1 week for EIN",
    href: "/services/business-formalisation-compliance/united-states",
  },
  {
    number: "03",
    flag: "🇨🇲 Cameroon • DGI & IRPP Tax",
    accent: "emerald",
    audience: "Businesses & Individuals",
    title: "Tax Compliance — Cameroon",
    description:
      "Monthly corporate DGI filings, Corporate Income Tax (IS) and DSF for businesses — personal income tax (IRPP) declarations for individuals. One tax desk, either way.",
    tags: ["Monthly DGI Filings", "Annual DSF Filing", "Personal IRPP Filing"],
    timeline: "Ongoing monthly cadence",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  {
    number: "04",
    flag: "🇨🇲 Cameroon • CNPS & Labour",
    accent: "teal",
    title: "CNPS Compliance — Cameroon",
    // Was "monthly employee declarations (DPAE)" / "Monthly DPAE" tag — web
    // research (2026-09) confirmed DPAE is a one-time declaration per
    // employee at hiring, not monthly (see the CNPS page's own sourced
    // comment on this). Corrected here to match.
    description:
      "Employer social insurance registration, employee declarations (DPAE), monthly payroll withholding, and CNPS Clearance Certificates.",
    tags: ["Employer Matricule", "DPAE at Hiring", "CNPS Clearance"],
    timeline: "Routine regulatory cycle",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
];

const accentClasses: Record<"teal" | "blue" | "emerald", { iconBg: string; iconText: string }> = {
  teal: { iconBg: "bg-teal-50", iconText: "text-teal-600" },
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-accent" },
  emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
};

// IT Consulting & Outsourcing removed: paused by leadership decision,
// soft-hidden sitewide (see components/Header.tsx).
const relatedServices: Array<{
  icon: string;
  /** Omit once a service has no meaningful relationship to state. */
  relationship?: string;
  title: string;
  description: string;
  href: string;
}> = [
  {
    // No relationship tag: Career Marketing & Placement was previously
    // positioned as nested under IT Consulting, but that scoping was removed
    // per leadership decision (broadened to general career placement).
    icon: "trending_up",
    title: "Career Marketing & Placement Support",
    description: "A dedicated worker on your account: profile positioning, daily applications, and recruiter follow-up until you are placed.",
    href: "/services/career-marketing-placement",
  },
];

export default function BusinessFormalisationCompliancePage() {
  return (
    <>
      {/* No activeService: this page is no longer one of the 5 individual
          nav destinations (see components/Header.tsx) — it's an optional
          guided finder pointed to from the dropdown, not a primary one. */}
      <Header />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Business Formalisation & Compliance" },
        ]}
        tag="BILATERAL LEGAL & REGULATORY COMPLIANCE"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            {/* Full-bleed rotating background + centered text (management
                request: hero backgrounds cycle automatically). Was a
                partial-width right-hand image with left-aligned text. */}
            <HeroImageCarousel
              keys={["cross-border-boardroom", "compliance-advisory"]}
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
                  BUSINESS FORMALISATION &amp; COMPLIANCE
                </span>
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Get compliant, stay compliant — <br className="hidden sm:inline" />
                <span className="gradient-teal-blue-text">in Cameroon and the US.</span>
              </h1>
              <p className="mx-auto text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Cross-border entity formation and statutory compliance shouldn&apos;t be a maze of
                conflicting rules. We provide rigorous procedural roadmaps and filing execution for
                businesses and individuals across OHADA and US jurisdictions.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <Button
                  href="#guided-router"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                >
                  Find My Path
                </Button>
                <WhatsAppButton phone="237678597593" label="Chat with the Legal Desk" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Guided router */}
        <section id="guided-router" className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  INTERACTIVE PATHWAY FINDER
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                <TextReveal text="Find the exact compliance pathway for your situation." />
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Select your profile and need to see your exact regulatory scope and mandatory
                deliverables in seconds.
              </p>
            </Reveal>
            <Reveal effect="rise" delay={150}>
              <ComplianceRouter />
            </Reveal>
          </div>
        </section>

        {/* Full directory */}
        <section id="complete-directory" className="py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="mb-14 max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">COMPLETE DIRECTORY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                <TextReveal text="Explore all four formalisation & compliance pathways." />
              </h2>
            </Reveal>

            <Reveal effect="stagger" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathways.map((pathway) => {
                const accent = accentClasses[pathway.accent];
                return (
                  <TiltCard
                    key={pathway.number}
                    max={4}
                    className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${accent.iconBg} ${accent.iconText}`}>
                          {pathway.number}
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                          {pathway.flag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-navy-950 group-hover:text-blue-accent transition-colors">
                          {pathway.title}
                        </h4>
                        {/* Serves both audiences — a badge, not a column, so
                            it doesn't get miscategorised under either one. */}
                        {pathway.audience && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded shrink-0">
                            {pathway.audience}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{pathway.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pathway.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <TimelineNote value={pathway.timeline} />
                      <Link
                        href={pathway.href}
                        className="text-xs font-bold text-blue-accent group-hover:text-teal-600 inline-flex items-center gap-1"
                      >
                        Explore Pathway
                        <MaterialIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </TiltCard>
                );
              })}
            </Reveal>
          </div>
        </section>

        {/* Procedural trust */}
        <section className="py-24 bg-navy-950 text-white relative overflow-hidden border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-60 lg:opacity-75 pointer-events-none">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">PROCEDURAL RIGOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Certainty at every statutory filing milestone.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Regulatory administration requires rigorous procedural accuracy. We safeguard your
                corporate and personal standing by executing filings directly with primary
                registries, courts, and tax inspectorates.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              <div className="frosted-glass p-7 rounded-2xl hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 flex items-center justify-center mb-5">
                  <MaterialIcon name="assignment_turned_in" className="text-[24px]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Documented Step-by-Step Cadence</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No guesswork or opaque bureaucratic steps. We maintain an auditable filing trail
                  with official court deposit receipts, tax clearance stampings, and registration tracking.
                </p>
              </div>
              <div className="frosted-glass p-7 rounded-2xl hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 flex items-center justify-center mb-5">
                  <MaterialIcon name="public" className="text-[24px]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Dual-Jurisdiction Standing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Grounded expertise in Cameroon (OHADA Uniform Acts, General Tax Code, CNPS Social
                  Security Code) paired with US federal/state corporate formation.
                </p>
              </div>
              <div className="frosted-glass p-7 rounded-2xl hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 flex items-center justify-center mb-5">
                  <MaterialIcon name="shield_lock" className="text-[24px]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Active Exposure Mitigation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reduces the risk of compounding penalties, back-tax assessments, unauthorised
                  operations liabilities, and administrative bank freezes.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <MaterialIcon name="info" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">Regulatory Notice:</span> This information
                  is general guidance. Requirements may change — confirm current details with your
                  Uptech Consulting consultant. Uptech Consulting &amp; Outsourcing provides corporate
                  administrative, management consulting, and statutory registration filing services;
                  informational content on this portal does not constitute formalized legal counsel.
                </div>
              </div>
            </div>
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
            {/* Sized to the actual card count, not a fixed 2-column skeleton —
                one card stretched across a wide grid looks orphaned. */}
            <div className={`grid grid-cols-1 gap-6 ${relatedServices.length > 1 ? "sm:grid-cols-2" : "max-w-sm"}`}>
              {relatedServices.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-navy-950 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <MaterialIcon name={service.icon} className="text-[18px]" />
                      </div>
                      {service.relationship && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {service.relationship}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-navy-950 group-hover:text-blue-accent transition-colors mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-accent group-hover:text-teal-600">
                    <span>View details</span>
                    <MaterialIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-60 lg:opacity-75 pointer-events-none">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">REGULATORY SCOPING</span>
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight mb-4">
              Ready to establish or regularise <br />
              <span className="gradient-teal-blue-text">your legal standing?</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Book a strategic consultation with a corporate compliance specialist to review your
              entity structure, statutory filings, and tax standing.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                href="#guided-router"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Schedule Regulatory Scoping
              </Button>
              <WhatsAppButton phone="237678597593" label="WhatsApp Legal Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
