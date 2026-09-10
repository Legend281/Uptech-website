import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileCheck2,
  Heart,
  Lightbulb,
  Lock,
  PenLine,
  Plus,
  Quote,
  Zap,
} from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { TrustStrip, type TrustStripItem } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BridgeSection } from "@/components/home/BridgeSection";
import { Reveal } from "@/components/Reveal";
import { RotatingPromise, type PromiseStatement } from "@/components/home/RotatingPromise";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: {
    absolute:
      "Uptech Consulting & Outsourcing | We close the distance between strategy and execution",
  },
  description:
    "Technology-driven consulting, outsourcing and business support for individuals and organisations operating across Cameroon and the United States.",
};

const WHATSAPP = "https://wa.me/237670000000";

const trustItems: TrustStripItem[] = [
  { icon: "apartment", title: "Cameroon S.A.", badgeText: "Buea, Cameroon", badgeAccent: "teal" },
  { icon: "public", title: "USA S-Corp", badgeText: "Stafford, Texas", badgeAccent: "sky" },
  { icon: "verified_user", title: "Compliance-first", badgeText: "Documented delivery", badgeAccent: "emerald" },
  { icon: "translate", title: "Bilingual", badgeText: "English & Français", badgeAccent: "sky" },
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
      "Business formalisation and digital capability",
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
 * The statements that rotate through the dark band mid-page. Each is anchored
 * to a real service line, and every sentence is either Uptech Consulting's own
 * wording or copy already approved elsewhere on this page — nothing invented to
 * fill a slot (CLAUDE.md Section 6.4).
 *
 * All four live service lines are represented. IT Consulting joined once its
 * page shipped on the Development branch — it was held back while that CTA
 * would have landed on a 404.
 */
const promises: PromiseStatement[] = [
  {
    lead: "We dedicate a full-time worker to your account whose job is to make sure you never miss a relevant posting, and",
    emphasis: "follow up with recruiters until you are placed.",
    support:
      "Not a shared inbox and not an automated alert. A named person carries your file — the same principle that runs through every compliance engagement we take on.",
    ctaLabel: "Start your career campaign",
    ctaHref: "/services/career-marketing-placement",
  },
  {
    lead: "Business legalisation, tax and social insurance compliance, ministry licensing and accreditation,",
    emphasis: "managed as one accountable process.",
    support:
      "Every engagement ends the same way: you hold the documents, and you know what happens next.",
    ctaLabel: "See how compliance runs",
    ctaHref: "/services/business-formalisation-compliance",
  },
  {
    lead: "Technology advisory and managed support across databases, cloud migration, help desk operations, AI compliance and",
    emphasis: "cyber security.",
    support:
      "Engage us for the specialised guidance, outsource the function to our professionals, or use both together.",
    ctaLabel: "Explore IT consulting",
    ctaHref: "/services/it-consulting-outsourcing",
  },
  {
    lead: "Individual effort only succeeds when it runs through the",
    emphasis: "repeatable, documented systems the organisation has already built.",
    support:
      "A stated internal expectation, not a marketing line. It is the reason your outcome does not depend on which staff member happens to be available that week.",
    ctaLabel: "How we operate",
    ctaHref: "/who-we-are",
  },
];

/*
 * The mockup shows five pillars. CLAUDE.md Section 9 bars two of them from the
 * real nav and content: Recruitment & BPO is paused, and General Contracts &
 * Supplies is not being pushed. The mockup also labels pillar 04 "Career &
 * Profile Marketing", which Section 6.2 marks as a mockup error.
 */
const pillars = [
  {
    number: "01",
    title: "IT Consulting & Outsourcing",
    href: "/services/it-consulting-outsourcing",
    description:
      "Technology advisory and managed support across databases, cloud migration, help desk operations, AI compliance and cyber security.",
  },
  {
    number: "02",
    title: "Business Formalisation & Compliance",
    href: "/services/business-formalisation-compliance",
    description:
      "Business legalisation, tax and social insurance compliance, ministry licensing and accreditation managed as one accountable process.",
  },
  {
    number: "03",
    title: "Career Marketing & Placement",
    href: "/services/career-marketing-placement",
    description:
      "Positioning, market-facing documents and structured placement support for IT professionals seeking their next role.",
  },
];

const process = [
  {
    number: "01",
    title: "Consultation & diagnosis",
    body: "We listen first, then identify the real technical, regulatory or human constraint.",
  },
  {
    number: "02",
    title: "Scoped delivery plan",
    body: "You receive a written scope with owners, deadlines and clear standards.",
  },
  {
    number: "03",
    title: "Execution & handover",
    body: "We run the process, report transparently and hand over systems your team can sustain.",
  },
];

// Roles, not numbers — these four are parallel, not a sequence, so they get no
// index markers and no card chrome.
const values = [
  {
    icon: Zap,
    role: "How we behave",
    title: "Integrity",
    body: "We act honestly, ethically and transparently in all our dealings. Dishonesty, system bypasses or opaque reporting breach this outright.",
  },
  {
    icon: PenLine,
    role: "The standard we maintain",
    title: "Professionalism",
    body: "Competence, accountability and service excellence. Every deliverable passed to a client carries the mark of professional precision.",
  },
  {
    icon: Heart,
    role: "How we serve",
    title: "Commitment",
    body: "Dedicated to delivering value and achieving the best outcomes for our clients and stakeholders.",
  },
  {
    icon: Lightbulb,
    role: "How we solve problems and improve",
    title: "Innovation",
    body: "Technology, creativity and continuous improvement. We do not work blindly — we optimise our tools to build resilient operating systems.",
  },
];

const handover = [
  "A written scope naming owners, deadlines and the standard being worked to",
  "Transparent progress reporting for as long as the engagement runs",
  "Original certificates, filings and clearances collected and handed to you",
  "Systems and documentation your own team can keep running afterwards",
];

// Verifiable, specific, and impossible to mistake for filler — these are the
// registries and authorities the compliance work actually runs through.
const systems = [
  { code: "RCCM", label: "Trade & Personal Property Credit Register" },
  { code: "OHADA", label: "Uniform Acts on commercial companies" },
  { code: "DGI", label: "Directorate General of Taxation" },
  { code: "CNPS", label: "National Social Insurance Fund" },
  { code: "IRS", label: "US federal tax administration" },
];

const faqItems = [
  {
    question: "How do you charge?",
    answer:
      "Engagements are scoped before they are quoted. We map your situation during the consultation, tell you plainly whether we are the right partner, and price the work from there. Contact us for a quote rather than a package rate.",
  },
  {
    question: "Do I have to travel to register a business?",
    answer:
      "For a US LLC or C-Corp, no — non-US residents can form and own one without a US visa, Social Security Number or American address, though the entity itself needs a registered agent with a physical in-state address. For Cameroon formalisation, [PENDING: confirm which steps require the founder in person with Uptech Consulting].",
  },
  {
    question: "Can you handle both the registration and the filings that follow it?",
    answer:
      "Yes. Formalisation, tax standing, social insurance and licensing run as one accountable process rather than separate errands — registration hands straight over to the ongoing filing calendar.",
  },
  {
    question: "Is career placement only for IT roles?",
    answer:
      "Career Marketing & Placement sits inside the IT Consulting practice and is scoped to IT and technology roles specifically — that is where the recruiter relationships and market knowledge are. If your background sits outside IT, ask us before committing to anything.",
  },
  {
    question: "Do you work in French as well as English?",
    answer:
      "Yes. Uptech Consulting operates bilingually in English and Français, which matters for Cameroonian regulatory work where official filings and correspondence are frequently in French.",
  },
  {
    question: "How quickly can you start?",
    answer:
      "[PENDING: confirm current onboarding lead time with Uptech Consulting]. The first step is always a consultation, which is where scope and sequencing get set.",
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

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden bg-navy-900 pb-24 pt-12 lg:pb-36 lg:pt-20">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["compliance-advisory"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["compliance-advisory"].blurDataURL}
              /* People sit right of centre, clear of the headline on the left.
                 Mobile crops tighter onto the adviser, since a narrow slice at
                 the desktop anchor lands on empty table. */
              className="hero-settle object-cover object-[76%_center] opacity-70 lg:object-[70%_center] lg:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="inline-block h-[2px] w-7 bg-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Uptech Consulting &amp; Outsourcing
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                We close the distance between
                <br />
                <span className="text-teal-400">strategy and</span>
                <br />
                <span className="text-sky-400">execution.</span>
              </h1>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Technology-driven consulting, outsourcing and business support
                for individuals and organisations operating across Cameroon and
                the United States.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="gradient-teal-blue flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-navy-950/80 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-teal-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustItems} variant="light" />

        {/* ---------------- Who We Are ---------------- */}
        <section className="relative bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal effect="stagger" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="relative lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl ring-1 ring-black/5">
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
                </div>
              </div>

              <div className="lg:col-span-6">
                <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  Built for the part everyone else calls
                  &ldquo;implementation&rdquo;.
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
                  <div className="flex flex-col gap-2 py-3.5 first:pt-1 sm:flex-row sm:items-baseline sm:gap-5">
                    <dt className="inline-flex w-fit flex-shrink-0 items-center rounded-md bg-navy-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                      Our Vision
                    </dt>
                    <dd className="text-sm leading-relaxed text-slate-700">
                      To be a trusted global partner in consulting, outsourcing
                      and business support solutions.
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2 py-3.5 last:pb-1 sm:flex-row sm:items-baseline sm:gap-5">
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
                  </div>
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
              {startingPoints.map((card) => (
                <div
                  key={card.audience}
                  className="card-hover-shadow flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white"
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
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50">
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
                </div>
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
                    Three pillars. Advisory, execution, or both.
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-slate-600">
                    We map what you actually need before anything is
                    quoted—so the work begins with clarity, not a package.
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
                {pillars.map((pillar) => (
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

        {/* ---------------- Meet your dedicated person ---------------- */}
        <section className="border-y border-slate-200/80 bg-navy-950 py-24 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            {/* The mark stays put while the statements change beneath it. */}
            <Quote className="mx-auto mb-8 h-9 w-9 text-teal-400" strokeWidth={1.5} />
            <RotatingPromise items={promises} />
          </div>
        </section>

        {/* ---------------- How We Work ---------------- */}
        <section className="relative overflow-hidden bg-white py-24">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal effect="stagger" className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SectionLabel>How we work</SectionLabel>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  Documented systems, not individual heroics.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                  A clear operating rhythm keeps every engagement accountable.
                </p>
                <Link
                  href="/contact"
                  className="gradient-teal-blue inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-950/30 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Plan your engagement</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>

              {/* A genuine sequence, so it is drawn as one — a connected spine
                  rather than three detached cards. */}
              <ol className="relative lg:col-span-7">
                <span
                  aria-hidden="true"
                  className="absolute bottom-6 left-[18px] top-6 w-px bg-gradient-to-b from-teal-400/60 via-slate-300 to-slate-200"
                />
                {process.map((step) => (
                  <li key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
                    <span className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-navy-900 shadow-sm">
                      {step.number}
                    </span>
                    <div className="pt-1">
                      <h3 className="mb-1.5 text-lg font-bold text-navy-950">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ---------------- What We Stand On ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-14 max-w-2xl text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              The standard holds—even when it is inconvenient.
            </h2>

            {/* No cards, no icon chips, no index numbers: four parallel values
                separated by hairlines. */}
            <Reveal effect="stagger" className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className={`lg:px-8 ${index === 0 ? "lg:pl-0" : ""} ${
                      index > 0 ? "lg:border-l lg:border-slate-300/70" : ""
                    } ${index === values.length - 1 ? "lg:pr-0" : ""}`}
                  >
                    <Icon className="mb-5 h-6 w-6 text-teal-600" strokeWidth={1.6} />
                    <p className="mb-1.5 text-xs font-medium text-slate-500">
                      {value.role}
                    </p>
                    <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-navy-950">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {value.body}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </section>

        <BridgeSection />

        {/* ---------------- Real Results ---------------- */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                What a completed engagement looks like.
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Every engagement ends the same way: you hold the documents, and
                you know what happens next.
              </p>
            </div>

            <Reveal effect="stagger" className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <h3 className="mb-6 text-lg font-bold text-navy-950">
                  What you are holding at handover
                </h3>
                <ul className="space-y-5">
                  {handover.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50">
                        <FileCheck2 className="h-3 w-3 text-teal-600" strokeWidth={2.4} />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.9} />
                  <p className="text-xs leading-relaxed text-slate-600">
                    <span className="font-bold text-slate-900">
                      Confidentiality.
                    </span>{" "}
                    Client files are not published. Named references and full
                    engagement records are reviewed under mutual NDA during
                    consultation.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <h3 className="mb-6 text-lg font-bold text-navy-950">
                  The systems this work runs through
                </h3>
                <dl className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                  {systems.map((system) => (
                    <div key={system.code} className="flex items-baseline gap-5 py-3.5">
                      <dt className="w-16 shrink-0 text-sm font-extrabold tracking-tight text-navy-950">
                        {system.code}
                      </dt>
                      <dd className="text-xs leading-relaxed text-slate-600">
                        {system.label}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Client stories
                    </span>
                    <span className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Named references and outcome figures go here once Uptech
                    Consulting supplies approved client stories. Nothing has been
                    invented to fill this space.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Before you book anything.
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* ---------------- Careers ---------------- */}
        <section id="careers" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal effect="stagger" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={images["career-review"].src}
                    alt={images["career-review"].alt}
                    width={images["career-review"].width}
                    height={images["career-review"].height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["career-review"].blurDataURL}
                    className="h-[460px] w-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6">
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  Work where the standard is written down.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                  We look for people who bring integrity, professionalism,
                  commitment and innovation to client-facing work.
                </p>

                <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {["IT & data roles", "Compliance & formalisation", "Recruitment & payroll", "Client support & BPO"].map((area) => (
                    <li key={area} className="flex items-center gap-3 border-b border-slate-200/80 pb-3 text-sm font-medium text-slate-700">
                      <Check className="h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.5} />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/careers"
                    className="flex items-center gap-2 rounded-lg bg-blue-accent px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                  >
                    <span>Send your application</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                  <a
                    href="tel:+237670000000"
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-800 transition-all hover:border-slate-400 active:scale-[0.98]"
                  >
                    Talk to our team
                  </a>
                </div>
              </div>
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
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  One focused conversation tells us what you actually need.
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
