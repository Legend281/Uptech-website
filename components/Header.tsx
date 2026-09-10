"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type ServiceKey =
  | "it-consulting"
  | "business-formalisation"
  | "career-marketing";

type HeaderProps = {
  /** Highlights the matching item in the Services dropdown for the current page. */
  activeService?: ServiceKey;
  ctaLabel?: string;
  ctaHref?: string;
};

const services: Array<{
  key: ServiceKey;
  number: string;
  title: string;
  description: string;
  href: string;
}> = [
  {
    key: "it-consulting",
    number: "01",
    title: "IT Consulting & Outsourcing",
    description: "Managed IT, cloud migration, databases & cyber security",
    href: "/services/it-consulting-outsourcing",
  },
  {
    key: "business-formalisation",
    number: "02",
    title: "Business Formalisation & Compliance",
    description: "Licensing, corporate structuring & tax standing",
    href: "/services/business-formalisation-compliance",
  },
  {
    key: "career-marketing",
    number: "03",
    title: "Career Marketing & Placement",
    description: "Executive positioning & international placement",
    href: "/services/career-marketing-placement",
  },
];

export function Header({
  activeService,
  ctaLabel = "Book a Consultation",
  ctaHref = "/contact",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand — the supplied lockup already contains the wordmark and
            "Consulting & Outsourcing" strapline, so no text accompanies it. */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/UPTECH_LOG.png"
            alt="Uptech Consulting & Outsourcing"
            width={572}
            height={233}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300">
          <div className="relative group py-6">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white group-hover:text-teal-400 transition-colors text-sm font-semibold focus:outline-none">
              <span>Who We Are</span>
              <svg
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-[100%] left-0 w-64 bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
              <Link
                href="/who-we-are"
                className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group/item"
              >
                <span className="text-sm font-semibold text-white group-hover/item:text-teal-400 transition-colors">
                  Our Philosophy
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Where strategy meets accountable execution
                </span>
              </Link>
              <Link
                href="/who-we-are#core-values"
                className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group/item"
              >
                <span className="text-sm font-semibold text-white group-hover/item:text-teal-400 transition-colors">
                  Core Values
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Integrity, professionalism, commitment &amp; innovation
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group py-6">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm focus:outline-none ${
                activeService
                  ? "text-teal-400 font-bold bg-white/[0.04]"
                  : "text-slate-300 hover:text-white group-hover:text-teal-400 font-semibold"
              }`}
            >
              <span className="relative">
                Services
                {activeService && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />
                )}
              </span>
              <svg
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[380px] bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
              <div className="space-y-1">
                {services.map((service) => {
                  const isActive = service.key === activeService;
                  return (
                    <Link
                      key={service.key}
                      href={service.href}
                      className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors group/item ${
                        isActive
                          ? "bg-white/[0.06] border border-teal-500/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-bold mt-0.5 px-1.5 py-0.5 rounded ${
                          isActive
                            ? "text-teal-400 bg-teal-500/20"
                            : "text-teal-400 bg-teal-500/10"
                        }`}
                      >
                        {service.number}
                      </span>
                      <div>
                        <span
                          className={`text-sm block transition-colors ${
                            isActive
                              ? "font-bold text-teal-300"
                              : "font-semibold text-white group-hover/item:text-teal-400"
                          }`}
                        >
                          {service.title}
                        </span>
                        <span className="text-xs text-slate-400 leading-snug">
                          {service.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative group py-6">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white group-hover:text-teal-400 transition-colors text-sm font-semibold focus:outline-none">
              <span>Who We Serve</span>
              <svg
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-[100%] left-0 w-72 bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
              <Link
                href="/who-we-serve/individuals"
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group/item"
              >
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-white group-hover/item:text-teal-400 block transition-colors">
                    For Individuals
                  </span>
                  <span className="text-xs text-slate-400 leading-tight">
                    Career growth, taxes &amp; personal ventures
                  </span>
                </div>
              </Link>
              <Link
                href="/who-we-serve/businesses"
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group/item"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-white group-hover/item:text-teal-400 block transition-colors">
                    For Businesses &amp; Institutions
                  </span>
                  <span className="text-xs text-slate-400 leading-tight">
                    Operations, compliance &amp; managed functions
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <Link
            href="/careers"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-teal-400 transition-colors text-sm font-semibold"
          >
            Careers
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <a
            href="tel:+237000000000"
            className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white px-3.5 py-2.5 rounded-lg border border-slate-700/80 hover:border-slate-500 bg-navy-950/60 transition-all"
          >
            <svg
              className="w-4 h-4 text-teal-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Talk to us</span>
          </a>
          <Link
            href={ctaHref}
            className="hidden sm:flex gradient-teal-blue text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-lg hover:brightness-105 active:scale-[0.98] transition-all shadow-sm shadow-teal-950/40 items-center gap-2"
          >
            <span>{ctaLabel}</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel. Kept mounted and collapsed with a grid-rows
          transition so it opens and closes instead of teleporting; `inert`
          keeps the collapsed links out of the tab order. */}
      <div
        inert={!mobileOpen}
        className={`grid overflow-hidden border-slate-800/80 bg-navy-950/98 backdrop-blur-xl transition-[grid-template-rows,opacity] duration-[250ms] ease-out lg:hidden ${
          mobileOpen
            ? "grid-rows-[1fr] border-t opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="max-h-[calc(100vh-5rem)] space-y-5 overflow-y-auto px-4 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Services
            </p>
            <div className="space-y-1">
              {services.map((service) => (
                <Link
                  key={service.key}
                  href={service.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    service.key === activeService
                      ? "text-teal-300 bg-white/[0.06] border border-teal-500/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-800/80 pt-4">
            <Link
              href="/who-we-are"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              Who We Are
            </Link>
            <Link
              href="/who-we-serve/individuals"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              Who We Serve
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              Careers
            </Link>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-slate-800/80 pt-4">
            <a
              href="tel:+237000000000"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-200 px-4 py-2.5 rounded-lg border border-slate-700/80"
            >
              Talk to us
            </a>
            <Link
              href={ctaHref}
              onClick={() => setMobileOpen(false)}
              className="gradient-teal-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {ctaLabel}
            </Link>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}
