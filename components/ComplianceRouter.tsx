"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TimelineNote } from "@/components/TimelineNote";

type Profile = "business" | "individual";
type BusinessNeed = "formalisation-cmr" | "formalisation-us" | "tax-cmr" | "cnps-cmr";
// The individual branch used to resolve straight to personal tax, with no
// path for someone wanting to register their own business — the venture
// option and its jurisdiction choice fix that (Phase 3 of the leadership
// adjustment round).
type IndividualNeed = "personal-tax" | "venture";
type VentureJurisdiction = "cmr" | "us";

type PathwayResult = {
  badge: string;
  title: string;
  description: string;
  deliverables: string[];
  timeline: string;
  href: string;
};

const businessNeeds: Array<{ key: BusinessNeed; label: string }> = [
  { key: "formalisation-cmr", label: "🇨🇲 Business Formalisation (RCCM/OHADA)" },
  { key: "formalisation-us", label: "🇺🇸 Business Formalisation (US LLC/C-Corp)" },
  { key: "tax-cmr", label: "🇨🇲 Tax Compliance (DGI Monthly/Annual)" },
  { key: "cnps-cmr", label: "🇨🇲 CNPS Social Security & Labour" },
];

const results: Record<BusinessNeed | "personal-tax", PathwayResult> = {
  "formalisation-cmr": {
    badge: "OHADA • SARL / SA / SAS",
    title: "Business Formalisation & RCCM Registration — Cameroon",
    description:
      "Full incorporation under OHADA Uniform Commercial Acts: notarial drafting, trade registry (RCCM) certification, and Taxpayer Identification Number (NIU) issuance.",
    deliverables: ["Notarial Articles of Association", "RCCM Certificate of Registration", "Taxpayer ID (NIU)"],
    timeline: "Typical completion: [PENDING: confirm with Uptech Consulting]",
    href: "/services/business-formalisation-compliance/cameroon",
  },
  "formalisation-us": {
    badge: "Delaware • Wyoming • Texas",
    title: "Business Formalisation — United States",
    description:
      "Formation of state-specific LLCs and C-Corps for international founders, including Registered Agent service and IRS EIN acquisition.",
    deliverables: ["US LLC / C-Corp filing", "IRS EIN Issuance", "Registered Agent service"],
    timeline: "Typical completion: [PENDING: confirm with Uptech Consulting]",
    href: "/services/business-formalisation-compliance/united-states",
  },
  "tax-cmr": {
    badge: "DGI • Corporate Tax",
    title: "Tax Compliance for Businesses — Cameroon",
    description:
      "Routine monthly returns filing, Corporate Income Tax (IS), Statistical and Tax Declarations (DSF), and Attestation de Non-Redevance (ANR) clearance.",
    deliverables: ["Monthly DGI Filings", "Annual DSF Filing", "Non-Redevance (ANR)"],
    timeline: "Ongoing monthly cadence",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  "cnps-cmr": {
    badge: "CNPS & Labour",
    title: "CNPS Compliance — Cameroon",
    description:
      "Employer social insurance registration, monthly employee declarations (DPAE), payroll withholding, and CNPS Clearance Certificates.",
    deliverables: ["Employer Matricule", "Monthly DPAE", "CNPS Clearance Certificate"],
    timeline: "Routine regulatory cycle",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
  "personal-tax": {
    badge: "Cameroon • Individual Tax",
    title: "Personal Tax Compliance & Declarations — Cameroon",
    description:
      "Statutory personal income tax declarations (IRPP), freelance and remote cross-border earnings regularisation, and personal Attestation de Non-Redevance issuance.",
    deliverables: ["Annual IRPP Filing", "Foreign Income Regularisation", "Individual ANR (Tax Clearance)"],
    timeline: "Filing deadline: [PENDING: confirm with Uptech Consulting]",
    // Tax Compliance for Individuals was merged into the unified page.
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
};

export function ComplianceRouter() {
  const [profile, setProfile] = useState<Profile>("business");
  const [need, setNeed] = useState<BusinessNeed>("formalisation-cmr");
  const [individualNeed, setIndividualNeed] = useState<IndividualNeed>("personal-tax");
  const [ventureJurisdiction, setVentureJurisdiction] = useState<VentureJurisdiction>("cmr");

  const result = useMemo(() => {
    if (profile === "individual") {
      if (individualNeed === "venture") {
        return ventureJurisdiction === "us" ? results["formalisation-us"] : results["formalisation-cmr"];
      }
      return results["personal-tax"];
    }
    return results[need];
  }, [profile, need, individualNeed, ventureJurisdiction]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 lg:p-10">
      <div className="space-y-8">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
            Step 1 • Business or individual?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setProfile("business")}
              className={`text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                profile === "business" ? "border-teal-500 bg-teal-50/40" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-navy-950 text-teal-400 flex items-center justify-center shrink-0">
                <MaterialIcon name="apartment" className="text-[20px]" />
              </div>
              <div>
                <span className="block text-base font-bold text-navy-950 leading-snug">Business / Enterprise</span>
                <span className="text-xs text-slate-600 leading-relaxed mt-1 block">
                  Companies, partnerships, startups, and expanding corporate subsidiaries.
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setProfile("individual")}
              className={`text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                profile === "individual" ? "border-teal-500 bg-teal-50/40" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <MaterialIcon name="person" className="text-[20px]" />
              </div>
              <div>
                <span className="block text-base font-bold text-navy-950 leading-snug">Individual Professional</span>
                <span className="text-xs text-slate-600 leading-relaxed mt-1 block">
                  Contractors, diaspora earners, remote professionals, and sole proprietors.
                </span>
              </div>
            </button>
          </div>
        </div>

        {profile === "business" && (
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              Step 2 • Which specific need?
            </label>
            <div className="flex flex-wrap gap-2">
              {businessNeeds.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setNeed(option.key)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    need === option.key
                      ? "bg-navy-950 text-teal-300 border border-teal-500/40"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {profile === "individual" && (
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              Step 2 • Personal tax, or starting your own venture?
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "personal-tax", label: "🇨🇲 Personal Tax (IRPP)" },
                  { key: "venture", label: "🚀 Starting a Venture" },
                ] as const
              ).map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setIndividualNeed(option.key)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    individualNeed === option.key
                      ? "bg-navy-950 text-teal-300 border border-teal-500/40"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {individualNeed === "venture" && (
              <div className="mt-4">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Which jurisdiction?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "cmr", label: "🇨🇲 Cameroon" },
                      { key: "us", label: "🇺🇸 United States" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setVentureJurisdiction(option.key)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        ventureJurisdiction === option.key
                          ? "bg-navy-950 text-teal-300 border border-teal-500/40"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-8 border-t border-slate-200/80">
          <div className="bg-navy-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  MATCHED PATHWAY
                </span>
                <span className="text-xs font-mono text-slate-400">{result.badge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{result.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl">{result.description}</p>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold block mb-2">
                  Mandatory Deliverables:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.deliverables.map((deliverable) => (
                    <span
                      key={deliverable}
                      className="text-xs bg-white/10 border border-white/15 px-2.5 py-1 rounded-md text-slate-200 font-medium"
                    >
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80">
                <Link
                  href={result.href}
                  className="gradient-teal-blue text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md"
                >
                  Go to this Pathway →
                </Link>
                <TimelineNote value={result.timeline} variant="dark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
