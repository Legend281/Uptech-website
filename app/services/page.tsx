import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images, type ImageKey } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description: "Everything Uptech Consulting offers — for careers and for business.",
};

const trustStripItems = [
  {
    icon: "bolt",
    title: "Strategy Through Execution",
    badgeText: "Advisory + Delivery",
    badgeAccent: "teal" as const,
    description: "We don't stop at a recommendation — we file, apply, and register on your behalf.",
  },
  {
    icon: "public",
    title: "Two Jurisdictions",
    badgeText: "Cameroon & United States",
    badgeAccent: "sky" as const,
    description: "One team, structured to operate across both markets without a hand-off gap.",
  },
  {
    icon: "verified",
    title: "Documented Systems",
    badgeText: "Not Individual Heroics",
    badgeAccent: "emerald" as const,
    description: "Every engagement runs on the same repeatable process — not one person's memory.",
  },
];

/*
 * Two practices only — IT Consulting & Outsourcing is paused by leadership
 * decision and soft-hidden sitewide (unlinked, not deleted; the page and its
 * code still exist at /services/it-consulting-outsourcing for when it's
 * unpaused). Do not add it back to this array without that decision being
 * reversed.
 */
const practices: Array<{
  title: string;
  description: string;
  href: string;
  image: ImageKey;
}> = [
  {
    title: "Business Formalisation & Compliance",
    description:
      "Cross-border entity formation and statutory compliance across Cameroon (OHADA) and US jurisdictions, guided to the exact pathway for your situation.",
    href: "/services/business-formalisation-compliance",
    image: "cross-border-boardroom",
  },
  {
    title: "Career Marketing & Placement",
    description:
      "A dedicated specialist manages your CV, LinkedIn, daily applications, and recruiter follow-up until you're placed.",
    href: "/services/career-marketing-placement",
    image: "career-review",
  },
];

/*
 * The 4 real Business Formalisation & Compliance sub-pages, kept visually
 * subordinate to (and nested under) the practice card above rather than
 * flattened into one undifferentiated grid — a first-time visitor seeing
 * "Business Formalisation & Compliance" and "Business Formalisation —
 * Cameroon" as equal, unrelated cards has no way to tell one is the parent
 * of the other. Tax Compliance for Businesses and for Individuals were
 * unified into one page/card per leadership decision — the individuals-only
 * URL now redirects here.
 */
const formalisationPages: Array<{ flag: string; title: string; href: string }> = [
  {
    flag: "🇨🇲",
    title: "Business Formalisation — Cameroon",
    href: "/services/business-formalisation-compliance/cameroon",
  },
  {
    flag: "🇺🇸",
    title: "Business Formalisation — United States",
    href: "/services/business-formalisation-compliance/united-states",
  },
  {
    flag: "🇨🇲",
    title: "Tax Compliance — Cameroon",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  },
  {
    flag: "🇨🇲",
    title: "CNPS Compliance — Cameroon",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  },
];

export default function ServicesHubPage() {
  return (
    <>
      <Header />
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Services" }]}
        tag="COMPLETE SERVICE DIRECTORY"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-60 lg:opacity-75 pointer-events-none">
            <Image
              src={images["compliance-advisory"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["compliance-advisory"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/40 pointer-events-none" />
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  OUR SERVICES
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Two practices, <span className="gradient-teal-blue-text">one standard.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                At Uptech Consulting, our clients come first. We help individuals build their
                careers and help businesses formalise and stay compliant — bridging the gap
                between strategy and execution across Cameroon and the United States.
              </p>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Practices */}
        <section className="pt-24 pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  OUR TWO PRACTICES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Everything we offer, run by two focused teams.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-14">
              {practices.map((card) => (
                <Link key={card.href} href={card.href} className="group block">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={images[card.image].src}
                      alt={images[card.image].alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 90vw"
                      placeholder="blur"
                      blurDataURL={images[card.image].blurDataURL}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative -mt-10 mx-4 bg-white rounded-xl p-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                    <h3 className="text-lg font-bold text-navy-950 leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:gap-2 transition-all">
                      Explore
                      <MaterialIcon name="arrow_forward" className="text-[16px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Nested under Business Formalisation & Compliance — same
                relationship the hub page itself shows in its own "Four
                Pathways" grid, kept visually subordinate here rather than
                repeated at full weight. */}
            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
                Business Formalisation &amp; Compliance includes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {formalisationPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200/80 hover:border-teal-500/40 hover:shadow-sm transition-all group"
                  >
                    <span className="text-lg leading-none shrink-0" aria-hidden="true">
                      {page.flag}
                    </span>
                    <span className="text-xs font-semibold text-navy-950 group-hover:text-teal-600 transition-colors leading-snug">
                      {page.title}
                    </span>
                    <MaterialIcon
                      name="arrow_forward"
                      className="text-[14px] ml-auto shrink-0 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-navy-950 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Not sure which service <span className="gradient-teal-blue-text">you need?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
              Tell us what you&apos;re trying to get done — a specialist will point you to the
              right pathway.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact">Book a Consultation</Button>
              <WhatsAppButton phone="237600000000" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
