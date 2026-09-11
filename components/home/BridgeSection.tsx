import Link from "next/link";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { LocalTime } from "@/components/home/LocalTime";
import { Reveal } from "@/components/Reveal";

const offices = [
  {
    city: "Buea",
    country: "Cameroon",
    entity: "Uptech Consulting & Outsourcing Cameroon S.A.",
    timeZone: "Africa/Douala",
    zoneLabel: "West Africa Time",
  },
  {
    city: "Stafford",
    country: "United States",
    entity: "Uptech Consulting & Outsourcing USA S-Corp",
    timeZone: "America/Chicago",
    zoneLabel: "Central Time",
  },
];

// What the two-entity structure makes possible — the reason it matters, rather
// than a restatement that two offices exist.
const crossings = [
  {
    title: "US entities for Cameroon-based founders",
    body: "Form an LLC or C-Corp without a US visa, SSN or American address, with a registered agent already in place.",
  },
  {
    title: "Cameroon compliance for owners living abroad",
    body: "RCCM standing, DGI filings and CNPS declarations kept current without flying home to sign paperwork.",
  },
  {
    title: "Professionals placed across both markets",
    body: "Profiles positioned for the market that is actually hiring, with follow-up inside the recruiter's own working hours.",
  },
];

export function BridgeSection() {
  return (
    <section
      id="two-jurisdictions"
      className="relative scroll-mt-24 overflow-hidden border-y border-slate-800 bg-navy-950 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* No eyebrow here — this headline is the loudest on the page and does
            not need a label above it to be understood. */}
        <div className="mb-16 max-w-4xl">
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Two jurisdictions.
            <br />
            One accountable structure.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
            Most firms sit on one side of this relationship and hand you off at
            the border. Uptech Consulting is formalised on both, so cross-border
            work stays inside one company that answers for it.
          </p>
        </div>

        <Reveal>
          <div className="mb-14 flex flex-col items-stretch lg:flex-row lg:items-center">
            {offices.map((office, index) => (
              <div key={office.city} className="contents">
                {index === 1 && (
                  <div className="relative flex shrink-0 items-center justify-center py-8 lg:flex-1 lg:py-0">
                    {/* Mobile: a plain vertical connector. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-teal-400/60 to-sky-400/60 lg:hidden"
                    />
                    {/* Desktop: draws itself once on entry. */}
                    <span
                      aria-hidden="true"
                      className="rail-draw absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-teal-400/70 via-sky-400/50 to-sky-400/70 lg:block"
                    />
                    <span className="rail-node relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-navy-900 text-teal-300 shadow-[0_0_0_6px_rgba(7,14,27,1)]">
                      <ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </div>
                )}

                <div className="flex-1 rounded-2xl border border-slate-800 bg-gradient-to-b from-navy-900/80 to-navy-900/30 p-7 backdrop-blur-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    <span className="text-xs font-medium text-teal-400">
                      {office.city} office
                    </span>
                  </div>
                  <h3 className="mb-2 text-3xl font-extrabold tracking-tight text-white">
                    {office.country}
                  </h3>
                  <p className="mb-6 text-sm text-slate-400">{office.entity}</p>
                  <div className="flex items-baseline gap-2.5 border-t border-slate-800 pt-5">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      <LocalTime timeZone={office.timeZone} />
                    </span>
                    <span className="text-xs text-slate-500">
                      local · {office.zoneLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-slate-800 pt-10 md:grid-cols-3">
          {crossings.map((crossing) => (
            <div key={crossing.title}>
              <h4 className="mb-2 text-sm font-bold leading-snug text-white">
                {crossing.title}
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {crossing.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/contact"
            className="group/cta inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-navy-900/80 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:border-slate-500 active:scale-[0.98]"
          >
            Discuss a cross-border need
            <ArrowRight
              className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover/cta:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
