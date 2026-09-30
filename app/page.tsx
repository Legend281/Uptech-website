import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
} from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, faqPageJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { HeroIntro } from "@/components/home/HeroIntro";
import { ScrollCue } from "@/components/home/ScrollCue";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { TiltCard } from "@/components/TiltCard";
import { TextReveal } from "@/components/TextReveal";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { TrustStrip, type TrustStripItem } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getFaqs } from "@/lib/faqs";
import { BridgeSection } from "@/components/home/BridgeSection";
import { Reveal } from "@/components/Reveal";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { images } from "@/lib/images";
import { getPublishedTestimonials } from "@/lib/testimonials";
import { getPublishedAdditionalServices } from "@/lib/additionalServices";

export const metadata: Metadata = {
  title: {
    absolute:
      "Uptech Consulting & Outsourcing | We close the distance between strategy and execution",
  },
  description:
    "Technology-driven consulting, outsourcing and business support for individuals and organisations operating across Cameroon and the United States.",
  alternates: { canonical: SITE_URL },
};

const WHATSAPP = "https://wa.me/237678597593";

const trustItems: TrustStripItem[] = [
  { icon: "apartment", title: "Cameroon S.A.", badgeText: "Buea, Cameroon", badgeAccent: "teal" },
  { icon: "public", title: "USA S-Corp", badgeText: "Stafford, Texas", badgeAccent: "sky" },
  { icon: "verified_user", title: "Compliance-first", badgeText: "Documented delivery", badgeAccent: "emerald" },
  // Same "within 1 business day" SLA already stated on /contact — reused
  // rather than a new claim invented for this strip.
  { icon: "schedule", title: "Fast Response", badgeText: "Within 1 business day", badgeAccent: "sky" },
];

const startingPoints = [
  {
    audience: "For Individuals",
    dot: "bg-teal-400",
    image: images["dedicated-advisor"],
    heading: "Build the career—and the structure behind it.",
    points: [
      "Career marketing and placement support",
      "Personal tax and social insurance compliance",
      "Business formalisation and structuring",
    ],
  },
  {
    audience: "For Businesses & Institutions",
    dot: "bg-blue-400",
    image: images["it-advisory"],
    heading: "Strengthen operations without carrying every function.",
    points: [
      "IT, cloud, database and security support",
      "Licensing, accreditation and regulatory compliance",
      "Tax, payroll and managed business processes",
    ],
  },
];

/*
 * Leadership decision: each real, live service listed individually at equal
 * weight, not bundled as 2 broad pillars (the previous structure here, which
 * also collapsed 4 Business Formalisation & Compliance pages into one link).
 * Same flattening applied to the primary nav and the /services directory —
 * see the comment on the `services` array in components/Header.tsx. 5 items,
 * matching CLAUDE.md's own inventory of real, live, unpaused services
 * (Section 5). Recruitment & BPO and General Contracts & Supplies are
 * paused/not scoped; IT Consulting & Outsourcing is paused by a later
 * leadership decision — soft-hidden sitewide (see components/Header.tsx).
 * None of the three are listed here without that changing.
 */
const pillars = [
  {
    number: "01",
    title: "Career Marketing & Placement Support",
    href: "/services/career-marketing-placement",
    description:
      "Expert profile positioning, Email management and overall placement support.",
  },
  {
    number: "02",
    title: "Business Formalisation — Cameroon",
    href: "/services/business-formalisation-compliance/cameroon",
    description:
      "Full incorporation under OHADA standards — Articles of Association, RCCM registration, and Taxpayer ID (NIU).",
  },
  {
    number: "03",
    title: "Business Formalisation — United States",
    href: "/services/business-formalisation-compliance/united-states",
    description:
      "LLC and C-Corp formation for anyone looking to register a business in the United States — state filing, registered agent, and IRS EIN.",
  },
  {
    number: "04",
    title: "Tax Compliance — Cameroon",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
    description:
      "Monthly DGI filings and Corporate Income Tax for businesses, personal IRPP declarations for individuals — one tax desk, either way.",
  },
  {
    number: "05",
    title: "CNPS Compliance — Cameroon",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
    description:
      "Employer and employee registration, monthly compliance filings, clearance follow-ups, and social benefits follow-ups — pensions, allowances and more.",
  },
];

/** Used sparingly — only where the label carries real navigational meaning. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="inline-block h-[2px] w-6 bg-teal-500" />
      <span className="text-sm font-semibold text-sky-700">{children}</span>
    </div>
  );
}

export default async function HomePage() {
  // Dashboard-published FAQs when there are any, else the built-in list (lib/faqs.ts).
  const faqItems = await getFaqs("general");
  const testimonials = await getPublishedTestimonials("homepage");
  // Anything Uptech has added beyond the 5 core services below — see
  // lib/additionalServices.ts. Empty today is the normal, expected case.
  const additionalServices = await getPublishedAdditionalServices();
  const totalServiceCount = pillars.length + additionalServices.length;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqPageJsonLd(faqItems)} />
      <Header />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden bg-navy-900 pb-24 pt-12 lg:pb-36 lg:pt-20">
          <div className="absolute inset-0 z-0">
            <HeroImageCarousel
              keys={["compliance-advisory", "cross-border-boardroom", "team-presenting"]}
              imageClassName="hero-ken-burns object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-navy-950/45" />
          </div>

          {/* Ambient depth only — low-opacity, slow-drifting glows behind the
              copy. Purely decorative, so hidden from assistive tech. */}
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
            <div className="float-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="float-b absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <HeroIntro whatsapp={WHATSAPP} />
          </div>

          <ScrollCue />
        </section>

        <TrustStrip items={trustItems} variant="light" />

        <PartnersStrip />

        {/* ---------------- Who We Are ---------------- */}
        <section className="relative bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal effect="stagger" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="relative lg:col-span-6">
                <div
                  className="pointer-events-none absolute -left-8 -top-8 -z-10 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl"
                  aria-hidden="true"
                />
                <TiltCard max={5} className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={images["ops-center"].src}
                    alt={images["ops-center"].alt}
                    width={images["ops-center"].width}
                    height={images["ops-center"].height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["ops-center"].blurDataURL}
                    className="h-[480px] w-full object-cover object-center sm:h-[560px]"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-xl border-l-4 border-teal-400 bg-navy-950/90 p-6 text-white shadow-xl backdrop-blur-md sm:right-auto sm:max-w-sm sm:p-7">
                    <p className="text-sm font-bold leading-snug sm:text-base">
                      Strategy that never reaches execution is just paperwork.
                    </p>
                    <p className="mt-2.5 flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      We stay until the process runs.
                    </p>
                  </div>
                </TiltCard>
              </div>

              <div className="lg:col-span-6">
                <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  <TextReveal text={"Built for the part everyone else calls “implementation”."} />
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Uptech Consulting combines technology-driven advisory with
                  practical operational support. Clients engage us for
                  specialised guidance, outsource critical functions to our
                  professionals, or use both together.
                </p>
                <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Our philosophy is simple: sustainable growth happens when
                  people, systems and technology work together.
                </p>

                <dl className="mb-8 divide-y divide-slate-200/80 rounded-xl border border-slate-200/90 bg-slate-50/80 p-5">
                  <Reveal effect="rise" className="flex flex-col gap-2 py-3.5 first:pt-1 sm:flex-row sm:items-baseline sm:gap-5">
                    <dt className="inline-flex w-fit flex-shrink-0 items-center rounded-md bg-navy-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                      Our Vision
                    </dt>
                    <dd className="text-sm leading-relaxed text-slate-700">
                      To be a trusted global partner in consulting, outsourcing
                      and business support solutions.
                    </dd>
                  </Reveal>
                  <Reveal effect="rise" delay={100} className="flex flex-col gap-2 py-3.5 last:pb-1 sm:flex-row sm:items-baseline sm:gap-5">
                    <dt className="inline-flex w-fit flex-shrink-0 items-center rounded-md bg-navy-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                      Our Mission
                    </dt>
                    <dd className="text-sm leading-relaxed text-slate-700">
                      To empower businesses, institutions and individuals by
                      delivering technology, workforce, compliance, career
                      development and business support solutions that simplify
                      operations, strengthen capacity and drive sustainable
                      growth.
                    </dd>
                  </Reveal>
                </dl>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                >
                  <span>Start with a consultation</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Where Do You Start? ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionLabel>Where do you start?</SectionLabel>
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  Different needs. One standard
                  <br className="hidden sm:inline" /> of delivery.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-slate-500">
                Choose the path that fits your situation. We will define the
                right scope during consultation.
              </p>
            </div>

            <Reveal effect="stagger" className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {startingPoints.map((card, index) => (
                <TiltCard
                  key={card.audience}
                  max={4}
                  className={`card-hover-shadow group/card flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white ${
                    index === 1 ? "md:mt-10" : ""
                  }`}
                >
                  <div className="group relative h-64 overflow-hidden">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={card.image.blurDataURL}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-navy-950/85 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
                      <span className={`h-2 w-2 rounded-full ${card.dot}`} />
                      {card.audience}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-8">
                    <div>
                      <h3 className="mb-6 text-xl font-bold leading-tight text-navy-950">
                        {card.heading}
                      </h3>
                      <ul className="mb-8 space-y-4">
                        {card.points.map((point) => (
                          <li key={point} className="flex items-start gap-3.5 text-sm text-slate-700">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50 transition-transform duration-200 group-hover/card:scale-110">
                              <Check className="h-3.5 w-3.5 text-teal-600" strokeWidth={2.5} />
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-accent px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                    >
                      <span>Book a Consultation</span>
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------- What We Do ---------------- */}
        <section id="services" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                    <TextReveal text={`${totalServiceCount} services. Pick exactly what you need.`} />
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-slate-600">
                    No bundling, no guesswork — we map what you actually need
                    before anything is quoted, so the work begins with
                    clarity, not a package.
                  </p>

                  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-lg">
                    <Image
                      src={images["infrastructure-corridor"].src}
                      alt={images["infrastructure-corridor"].alt}
                      width={images["infrastructure-corridor"].width}
                      height={images["infrastructure-corridor"].height}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      placeholder="blur"
                      blurDataURL={images["infrastructure-corridor"].blurDataURL}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-xs font-medium text-slate-300">
                      <span>Infrastructure &amp; Compliance Hub</span>
                      <span className="text-teal-400">BUEA · TX</span>
                    </div>
                  </div>
                </div>
              </div>

              <Reveal effect="stagger" className="divide-y divide-slate-200/80 lg:col-span-7">
                {[
                  ...pillars,
                  ...additionalServices.map((service, index) => ({
                    number: String(pillars.length + index + 1).padStart(2, "0"),
                    title: service.title,
                    href: service.href ?? "/contact",
                    description: service.description,
                  })),
                ].map((pillar) => (
                  <Link
                    key={pillar.number}
                    href={pillar.href}
                    className="group -mx-4 block rounded-xl p-4 py-7 transition-colors first:pt-0 hover:bg-slate-50/60"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-teal-400">
                        {pillar.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-blue-accent">
                            {pillar.title}
                          </h3>
                          <Plus
                            className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 group-hover:rotate-45 group-hover:text-blue-accent"
                            strokeWidth={2}
                          />
                        </div>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                          {pillar.description}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-accent">
                          Discuss this service
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <BridgeSection />

        {/* ---------------- Testimonials ---------------- */}
        {/* Same dark treatment as the Career Marketing & Placement Support
            page's testimonial section. Only rendered once a real, fully named,
            consented testimonial is published to the Homepage from the admin
            dashboard (lib/testimonials.ts). No placeholder here: the Homepage
            never shows an illustrative quote. */}
        {testimonials.length > 0 && (
          <section className="relative overflow-hidden border-b border-slate-800/80 bg-navy-950 py-24 text-white">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-60 lg:w-3/4 lg:opacity-75">
              <Image
                src={images["career-review"].src}
                alt=""
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={images["career-review"].blurDataURL}
                className="object-cover object-center"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-transparent" />
            <Reveal effect="rise" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2">
                  <span className="inline-block h-[2px] w-7 bg-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">IN OUR CLIENTS&apos; WORDS</span>
                </div>
                <h2 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                  <TextReveal text="What working with us is like." />
                </h2>
              </div>
              {/* Side by side and paged, with the same controls as RotatingPromise above. */}
              <TestimonialCarousel items={testimonials} />
            </Reveal>
          </section>
        )}

        {/* ---------------- FAQ ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              <TextReveal text="Before you book anything." />
            </h2>
            <Reveal effect="fade">
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section
          id="consultation"
          className="relative scroll-mt-24 overflow-hidden bg-navy-900 py-28 text-white"
        >
          <div className="absolute inset-0 opacity-70">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              /* People sit on the right, matching the hero at the top of this
                 page, so the headline on the left never fights a face. */
              className="object-cover object-[72%_center] lg:object-right"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/25" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <TextReveal text="One focused conversation tells us what you actually need." />
                </h2>
                <p className="text-base leading-relaxed text-slate-300">
                  We will map your situation, tell you plainly whether we are
                  the right partner, and scope the work from there.
                </p>
              </div>

              <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row lg:flex-col">
                <Link
                  href="/contact"
                  className="gradient-teal-blue flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-lg border border-slate-700 bg-navy-950/80 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-teal-400" />
                  <span>WhatsApp us</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
