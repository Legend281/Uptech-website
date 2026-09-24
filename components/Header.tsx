"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type ServiceKey =
  | "it-consulting"
  | "business-formalisation-cameroon"
  | "business-formalisation-us"
  | "tax-compliance"
  | "cnps-compliance"
  | "career-marketing";

type HeaderProps = {
  /** Highlights the matching item in the Services dropdown for the current page. */
  activeService?: ServiceKey;
  ctaLabel?: string;
  ctaHref?: string;
};

/*
 * Flattened to 5 individual top-level services (leadership decision): each
 * real, live service gets its own nav entry at equal weight rather than 4 of
 * them nesting under one "Business Formalisation & Compliance" nav item as a
 * subItems flyout. The umbrella page that used to be that flyout's parent
 * still exists at /services/business-formalisation-compliance — it's not
 * deleted, just repositioned as an optional guided finder for whichever of
 * the 4 Cameroon/US pathways fits a visitor's situation (linked below, not
 * listed here as a 6th item). IT Consulting & Outsourcing stays out of this
 * array — paused by leadership decision, soft-hidden sitewide (unlinked, not
 * deleted; the page and its code still exist at
 * /services/it-consulting-outsourcing for when it's unpaused).
 */
const services: Array<{
  key: ServiceKey;
  number: string;
  title: string;
  description: string;
  href: string;
}> = [
  {
    key: "career-marketing",
    number: "01",
    title: "Career Marketing & Placement Support",
    description: "Executive positioning & international placement",
    href: "/services/career-marketing-placement",
  },
  {
    key: "business-formalisation-cameroon",
    number: "02",
    title: "Business Formalisation — Cameroon",
    description: "OHADA incorporation, RCCM & taxpayer ID",
    href: "/services/business-formalisation-compliance/cameroon",
  },
  {
    key: "business-formalisation-us",
    number: "03",
    title: "Business Formalisation — United States",
    description: "LLC/C-Corp formation, registered agent & EIN",
    href: "/services/business-formalisation-compliance/united-states",
  },
  {
    key: "tax-compliance",
    number: "04",
    title: "Tax Compliance — Cameroon",
    // Tax Compliance for Businesses and for Individuals were merged into one
    // unified page (leadership decision) — the individuals URL now redirects
    // to it rather than appearing here as a second nav entry.
    description: "DGI filings, corporate tax & personal IRPP",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  {
    key: "cnps-compliance",
    number: "05",
    title: "CNPS Compliance — Cameroon",
    description: "Registration, monthly compliance & benefits follow-up",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
];

const contactServiceParam: Record<ServiceKey, string> = {
  "it-consulting": "it-consulting",
  "business-formalisation-cameroon": "business-formalisation-cameroon",
  "business-formalisation-us": "business-formalisation-us",
  "tax-compliance": "tax-compliance-businesses",
  "cnps-compliance": "cnps-compliance",
  "career-marketing": "career-marketing",
};

/**
 * One row of the mobile menu's accordion: the label itself is a real link to
 * the section's overview page (tapping "Services" goes to /services — it
 * used to be inert label text with no href at all), and a separate chevron
 * button expands the same sub-links the desktop hover-flyout shows, so
 * mobile doesn't lose that content just because there's no hover.
 */
function MobileNavSection({
  href,
  icon,
  label,
  isOpen,
  onToggle,
  onNavigate,
  isActive,
  linkable = true,
  children,
}: {
  href?: string;
  icon: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  isActive?: boolean;
  /** Set false for a section with no overview page of its own — the whole
   *  row just expands/collapses instead of half of it navigating. */
  linkable?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-800/60 last:border-b-0">
      <div className="flex items-center">
        {linkable && href ? (
          <>
            <Link
              href={href}
              onClick={onNavigate}
              className={`flex flex-1 items-center gap-3 py-3.5 pl-1 pr-2 transition-colors ${
                isActive ? "text-teal-400" : "text-white hover:text-teal-400"
              }`}
            >
              <MaterialIcon name={icon} className="text-[20px] text-teal-400" />
              <span className="text-[15px] font-semibold">{label}</span>
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${label} menu`}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-slate-400 hover:text-teal-400"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex flex-1 items-center gap-3 py-3.5 pl-1 pr-2 text-left text-white transition-colors hover:text-teal-400"
          >
            <MaterialIcon name={icon} className="text-[20px] text-teal-400" />
            <span className="flex-1 text-[15px] font-semibold">{label}</span>
            <svg
              className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="space-y-0.5 py-1 pb-3 pl-[2.65rem] pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

type MobileSectionKey = "services" | "who-we-are" | "who-we-serve";

export function Header({
  activeService,
  ctaLabel = "Book a Consultation",
  ctaHref,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<MobileSectionKey | null>(null);
  const resolvedCtaHref =
    ctaHref ?? (activeService ? `/contact?service=${contactServiceParam[activeService]}` : "/contact");

  function toggleSection(key: MobileSectionKey) {
    setOpenSection((current) => (current === key ? null : key));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
    setOpenSection(null);
  }

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
            <Link
              href="/who-we-are"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white group-hover:text-teal-400 transition-colors text-sm font-semibold focus:outline-none"
            >
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
            </Link>
            <div className="absolute top-[100%] left-0 w-64 bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-2.5 opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 focus-within:opacity-100 focus-within:visible focus-within:scale-100 transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 transform -translate-y-2 group-hover:translate-y-0 focus-within:translate-y-0 origin-top">
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
              <Link
                href="/who-we-are#mission-vision"
                className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group/item"
              >
                <span className="text-sm font-semibold text-white group-hover/item:text-teal-400 transition-colors">
                  Mission &amp; Vision
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  What we are working toward, and how
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group py-6">
            <Link
              href="/services"
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
            </Link>
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[380px] bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-3 opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 focus-within:opacity-100 focus-within:visible focus-within:scale-100 transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 transform -translate-y-2 group-hover:translate-y-0 focus-within:translate-y-0 origin-top">
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
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                {/* The 4 Business Formalisation & Compliance pathways above
                    are now individually listed, at equal weight, rather than
                    nested under one umbrella entry — this points to the
                    guided finder for whoever isn't sure which of those 4
                    fits their situation, without re-introducing a 6th,
                    unequal "grouping" item into the list itself. */}
                <Link
                  href="/services/business-formalisation-compliance"
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-colors"
                >
                  <span>Not sure which one? Use the guided finder</span>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-teal-400 hover:bg-white/5 transition-colors"
                >
                  <span>View All Services</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group py-6">
            <Link
              href="/who-we-serve"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white group-hover:text-teal-400 transition-colors text-sm font-semibold focus:outline-none"
            >
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
            </Link>
            <div className="absolute top-[100%] left-0 w-72 bg-navy-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-2.5 opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 focus-within:opacity-100 focus-within:visible focus-within:scale-100 transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 transform -translate-y-2 group-hover:translate-y-0 focus-within:translate-y-0 origin-top">
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
          <Link
            href={resolvedCtaHref}
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
            onClick={() => {
              setMobileOpen((open) => !open);
              setOpenSection(null);
            }}
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
          <div className="max-h-[calc(100vh-5rem)] space-y-4 overflow-y-auto px-4 py-5">
            <div className="rounded-xl border border-slate-800/70 bg-white/[0.02] px-2.5">
              <MobileNavSection
                href="/services"
                icon="apps"
                label="Services"
                isOpen={openSection === "services"}
                onToggle={() => toggleSection("services")}
                onNavigate={closeMobileMenu}
                isActive={Boolean(activeService)}
              >
                {services.map((service) => (
                  <Link
                    key={service.key}
                    href={service.href}
                    onClick={closeMobileMenu}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      service.key === activeService
                        ? "border border-teal-500/30 bg-white/[0.06] text-teal-300"
                        : "text-slate-200 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {service.title}
                  </Link>
                ))}
                {/* Same guided-finder pointer as the desktop dropdown — see
                    the comment there for why this isn't a 6th list item. */}
                <Link
                  href="/services/business-formalisation-compliance"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-400 hover:bg-white/5"
                >
                  Not sure which one? Use the guided finder
                </Link>
                <Link
                  href="/services"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  View All Services
                </Link>
              </MobileNavSection>

              <MobileNavSection
                href="/who-we-are"
                icon="groups"
                label="Who We Are"
                isOpen={openSection === "who-we-are"}
                onToggle={() => toggleSection("who-we-are")}
                onNavigate={closeMobileMenu}
              >
                <Link
                  href="/who-we-are"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Our Philosophy
                </Link>
                <Link
                  href="/who-we-are#core-values"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Core Values
                </Link>
                <Link
                  href="/who-we-are#mission-vision"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Mission &amp; Vision
                </Link>
              </MobileNavSection>

              <MobileNavSection
                href="/who-we-serve"
                icon="diversity_3"
                label="Who We Serve"
                isOpen={openSection === "who-we-serve"}
                onToggle={() => toggleSection("who-we-serve")}
                onNavigate={closeMobileMenu}
              >
                <Link
                  href="/who-we-serve/individuals"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-400" />
                  For Individuals
                </Link>
                <Link
                  href="/who-we-serve/businesses"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                  For Businesses &amp; Institutions
                </Link>
              </MobileNavSection>
            </div>

            <Link
              href="/careers"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl border border-slate-800/70 bg-white/[0.02] px-3.5 py-3.5 text-[15px] font-semibold text-white hover:text-teal-400"
            >
              <MaterialIcon name="work" className="text-[20px] text-teal-400" />
              Careers
            </Link>

            <Link
              href={resolvedCtaHref}
              onClick={closeMobileMenu}
              className="gradient-teal-blue flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-950/40 active:scale-[0.98] transition-transform"
            >
              {ctaLabel}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
