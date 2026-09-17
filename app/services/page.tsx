import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { TiltCard } from "@/components/TiltCard";
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
 * Leadership decision: each real, live service is presented individually at
 * equal visual weight — not bundled with 4 others under one "Business
 * Formalisation & Compliance" umbrella card (the previous structure here).
 * This is the same flattening applied to the primary nav — see the comment
 * on the `services` array in components/Header.tsx for the full reasoning.
 *
 * 5 cards total, matching the 5 real, live, unpaused services in CLAUDE.md's
 * own inventory (Section 5). IT Consulting & Outsourcing, Recruitment & BPO,
 * and General Contracts & Supplies are paused/not scoped and stay out of
 * this grid — do not add any of them back without that decision reversing.
 *
 * The umbrella page these 4 formalisation/compliance services used to be
 * grouped under still exists at /services/business-formalisation-compliance
 * — not deleted, just repositioned as an optional guided finder (linked
 * below the grid, not listed here as a 6th, unequal card).
 */
const services: Array<{
  flag?: string;
  title: string;
  description: string;
  href: string;
  image: ImageKey;
}> = [
  {
    flag: "🇨🇲",
    title: "Business Formalisation — Cameroon",
    description:
      "Full incorporation under OHADA standards — Articles of Association, RCCM registration, and Taxpayer ID (NIU).",
    href: "/services/business-formalisation-compliance/cameroon",
    image: "cross-border-boardroom",
  },
  {
    flag: "🇺🇸",
    title: "Business Formalisation — United States",
    description:
      "LLC and C-Corp formation for Cameroon-based businesses and diaspora founders — state filing, registered agent, and IRS EIN.",
    href: "/services/business-formalisation-compliance/united-states",
    image: "it-advisory",
  },
  {
    flag: "🇨🇲",
    title: "Tax Compliance — Cameroon",
    description:
      "Monthly DGI filings and Corporate Income Tax for businesses, personal IRPP declarations for individuals — one tax desk, either way.",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
    image: "compliance-advisory",
  },
  {
    flag: "🇨🇲",
    title: "CNPS Compliance — Cameroon",
    description:
      "Employer registration, employee declarations, payroll withholding, and CNPS Clearance Certificates.",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
    image: "ops-center",
  },
  {
    title: "Career Marketing & Placement",
    description:
      "A dedicated specialist manages your CV, LinkedIn, daily applications, and recruiter follow-up until you're placed.",
    href: "/services/career-marketing-placement",
    image: "career-review",
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
          <div className="absolute inset-0 z-0">
            {/* Full-bleed rotating background + centered text, matching the
                grounded-gradient pattern used sitewide (management request:
                hero backgrounds cycle automatically). Was a partial-width
                right-hand image with left-aligned text. */}
            <HeroImageCarousel
              keys={["compliance-advisory", "cross-border-boardroom"]}
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
                  OUR SERVICES
                </span>
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Five services, <span className="gradient-teal-blue-text">one accountable standard.</span>
              </h1>
              <p className="mx-auto text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                No bundling, no guesswork. Explore exactly the service you need — business
                formalisation, tax, social security, or career placement — across Cameroon and the
                United States.
              </p>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Services — 5 individual, equally-weighted cards. See the comment
            on the `services` array above for why this replaced the old
            "2 practices + 1 subordinate under one" structure. */}
        <section className="pt-24 pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  COMPLETE SERVICE DIRECTORY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                <TextReveal text="Five services. Pick exactly what you need." />
              </h2>
            </Reveal>

            <Reveal
              effect="stagger"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14"
            >
              {services.map((card) => (
                <Link key={card.href} href={card.href} className="group block">
                  <TiltCard max={5} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={images[card.image].src}
                      alt={images[card.image].alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      placeholder="blur"
                      blurDataURL={images[card.image].blurDataURL}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </TiltCard>
                  <div className="relative -mt-10 mx-4 bg-white rounded-xl p-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                    <h3 className="text-lg font-bold text-navy-950 leading-snug mb-2 flex items-start gap-2">
                      {card.flag && (
                        <span className="text-base leading-none shrink-0 mt-0.5" aria-hidden="true">
                          {card.flag}
                        </span>
                      )}
                      <span>{card.title}</span>
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
            </Reveal>

            {/* Secondary, clearly-subordinate pointer to the guided finder
                for the 4 Business Formalisation/Compliance pathways above —
                not a 6th card, so it never reads as an equal-weight service
                of its own. */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-4 text-center">
              <MaterialIcon name="explore" className="text-[18px] text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600">
                Not sure which Business Formalisation or Compliance service fits your situation?{" "}
                <Link
                  href="/services/business-formalisation-compliance"
                  className="font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  Use our guided finder
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA — had no background image at all until this pass. */}
        <section className="relative py-24 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/55 to-navy-950/55" />
          </div>
          <Reveal effect="rise" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Not sure which service <span className="gradient-teal-blue-text">you need?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
              Tell us what you&apos;re trying to get done — a specialist will point you to the
              right pathway.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact">Book a Consultation</Button>
              <WhatsAppButton phone="237678597593" />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
