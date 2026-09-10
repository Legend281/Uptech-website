import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/Button";
import { ComplianceRouter } from "@/components/ComplianceRouter";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

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

const businessPathways = [
  {
    number: "01",
    flag: "🇨🇲 Cameroon • OHADA / RCCM",
    accent: "teal" as const,
    title: "Business Formalisation — Cameroon",
    description:
      "Full incorporation under OHADA standards: Articles of Association, notarial deposit, RCCM registration, and Taxpayer ID (NIU).",
    tags: ["SARL / SA / SAS", "Notarial Deed", "Taxpayer Card (NIU)"],
    timeline: "[PENDING: confirm with UCO]",
    href: "/services/business-formalisation-compliance/cameroon",
  },
  {
    number: "02",
    flag: "🇺🇸 United States • 50 States",
    accent: "blue" as const,
    title: "Business Formalisation — United States",
    description:
      "Formation of Delaware, Wyoming, Texas, or state-specific LLCs and C-Corps, including Registered Agent service and IRS EIN acquisition.",
    tags: ["US LLC / C-Corp", "IRS EIN Issuance", "Registered Agent"],
    timeline: "[PENDING: confirm with UCO]",
    href: "/services/business-formalisation-compliance/united-states",
  },
  {
    number: "03",
    flag: "🇨🇲 Cameroon • DGI Corporate",
    accent: "emerald" as const,
    title: "Tax Compliance for Businesses — Cameroon",
    description:
      "Monthly returns filing, Corporate Income Tax (IS), Statistical and Tax Declarations (DSF), and Attestation de Non-Redevance (ANR) clearance.",
    tags: ["Monthly DGI Filings", "Annual DSF Filing", "Non-Redevance (ANR)"],
    timeline: "Ongoing monthly cadence",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  {
    number: "04",
    flag: "🇨🇲 Cameroon • CNPS & Labour",
    accent: "teal" as const,
    title: "CNPS Compliance — Cameroon",
    description:
      "Employer social insurance registration, monthly employee declarations (DPAE), payroll withholding, and CNPS Clearance Certificates.",
    tags: ["Employer Matricule", "Monthly DPAE", "CNPS Clearance"],
    timeline: "Routine regulatory cycle",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
];

const individualPathway = {
  flag: "🇨🇲 Cameroon • Individual Tax",
  title: "Personal Tax Compliance & Declarations — Cameroon",
  description:
    "Statutory personal income tax declarations (IRPP), freelance and remote cross-border earnings regularisation, and personal Attestation de Non-Redevance issuance for visa and banking requirements.",
  tags: ["Annual IRPP Filing", "Foreign Income Regularisation", "Individual ANR (Tax Clearance)"],
  timeline: "[PENDING: confirm filing deadline with UCO]",
  href: "/services/business-formalisation-compliance/tax-compliance-individuals-cameroon",
};

const accentClasses: Record<"teal" | "blue" | "emerald", { iconBg: string; iconText: string }> = {
  teal: { iconBg: "bg-teal-50", iconText: "text-teal-600" },
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-accent" },
  emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
};

const otherPillars = [
  { icon: "terminal", number: "Pillar 01", title: "IT Consulting & Outsourcing", href: "/services/it-consulting-outsourcing" },
  { icon: "trending_up", number: "Pillar 03", title: "Career Marketing & Placement", href: "/services/career-marketing-placement" },
];

export default function BusinessFormalisationCompliancePage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance" },
        ]}
        tag="BILATERAL LEGAL & REGULATORY COMPLIANCE"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  BUSINESS FORMALISATION &amp; COMPLIANCE
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Get compliant, stay compliant — <br className="hidden sm:inline" />
                <span className="gradient-teal-blue-text">in Cameroon and the US.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Cross-border entity formation and statutory compliance shouldn&apos;t be a maze of
                conflicting rules. We provide rigorous procedural roadmaps and filing execution for
                businesses and individuals across OHADA and US jurisdictions.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
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
                <WhatsAppButton phone="237670000000" label="Chat with the Legal Desk" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Guided router */}
        <section id="guided-router" className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  INTERACTIVE PATHWAY FINDER
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Find the exact compliance pathway for your situation.
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Select your profile and need to see your exact regulatory scope and mandatory
                deliverables in seconds.
              </p>
            </div>
            <ComplianceRouter />
          </div>
        </section>

        {/* Full directory */}
        <section id="complete-directory" className="py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">COMPLETE DIRECTORY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Explore all five formalisation &amp; compliance pathways.
              </h2>
            </div>

            <div className="space-y-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-accent" />
                  <h3 className="text-xl font-extrabold text-navy-950">
                    For Businesses &amp; Corporations{" "}
                    <span className="text-sm font-normal text-slate-500 font-mono">(4 Dedicated Pathways)</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businessPathways.map((pathway) => {
                    const accent = accentClasses[pathway.accent];
                    return (
                      <div
                        key={pathway.number}
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
                          <h4 className="text-lg font-bold text-navy-950 group-hover:text-blue-accent transition-colors mb-2">
                            {pathway.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">{pathway.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {pathway.tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-500">{pathway.timeline}</span>
                          <Link
                            href={pathway.href}
                            className="text-xs font-bold text-blue-accent group-hover:text-teal-600 inline-flex items-center gap-1"
                          >
                            Explore Pathway
                            <MaterialIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <h3 className="text-xl font-extrabold text-navy-950">
                    For Individuals &amp; Independent Professionals{" "}
                    <span className="text-sm font-normal text-slate-500 font-mono">(1 Dedicated Pathway)</span>
                  </h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-navy-950 text-teal-400 flex items-center justify-center font-bold font-mono text-sm">
                        05
                      </div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/70 px-2.5 py-1 rounded">
                        {individualPathway.flag}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-navy-950 group-hover:text-blue-accent transition-colors mb-2">
                      {individualPathway.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{individualPathway.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {individualPathway.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-3">
                    <span className="text-xs font-mono text-slate-500">{individualPathway.timeline}</span>
                    <Link
                      href={individualPathway.href}
                      className="gradient-teal-blue text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md"
                    >
                      Explore Pathway
                      <MaterialIcon name="arrow_forward" className="text-[16px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Procedural trust */}
        <section className="py-24 bg-navy-950 text-white relative overflow-hidden border-b border-slate-800/80">
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
                  UCO consultant. Uptech Consulting &amp; Outsourcing provides corporate
                  administrative, management consulting, and statutory registration filing services;
                  informational content on this portal does not constitute formalized legal counsel.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore other pillars */}
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
              {otherPillars.map((pillar) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-navy-950 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <MaterialIcon name={pillar.icon} className="text-[18px]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {pillar.number}
                    </span>
                    <h3 className="text-sm font-bold text-navy-950 group-hover:text-blue-accent transition-colors mt-1">
                      {pillar.title}
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
        <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
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
              <WhatsAppButton phone="237670000000" label="WhatsApp Legal Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
