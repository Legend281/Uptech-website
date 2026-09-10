import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  Lightbulb,
  Lock,
  PenLine,
  Plus,
  Zap,
} from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { TrustStrip, type TrustStripItem } from "@/components/TrustStrip";
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
  {
    icon: "apartment",
    title: "Cameroon S.A.",
    badgeText: "Buea, Cameroon",
    badgeAccent: "teal",
  },
  {
    icon: "public",
    title: "USA S-Corp",
    badgeText: "Texas, United States",
    badgeAccent: "sky",
  },
  {
    icon: "verified_user",
    title: "Compliance-first",
    badgeText: "Documented delivery",
    badgeAccent: "emerald",
  },
  {
    icon: "translate",
    title: "Bilingual",
    badgeText: "English & Français",
    badgeAccent: "sky",
  },
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
    image: images["compliance-advisory"],
    heading: "Strengthen operations without carrying every function.",
    points: [
      "IT, cloud, database and security support",
      "Licensing, accreditation and regulatory compliance",
      "Tax, payroll and managed business processes",
    ],
  },
];

/*
 * The mockup shows five pillars, two of which CLAUDE.md Section 9 says must
 * not appear anywhere in the real nav or content yet: Recruitment & BPO is
 * paused pending a leadership session, and General Contracts & Supplies has no
 * page or content in the spec at all. The mockup also labels pillar 04
 * "Career & Profile Marketing", which Section 6.1 marks as a mockup error —
 * the canonical name is "Career Marketing & Placement".
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
      "Positioning, market-facing documents and structured placement support for individual professionals seeking their next role.",
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

const values = [
  {
    icon: Zap,
    label: "01 / How we behave",
    title: "Integrity",
    body: "Honest, ethical and transparent dealings. No shortcuts or opaque reporting.",
  },
  {
    icon: PenLine,
    label: "02 / The standard we maintain",
    title: "Professionalism",
    body: "Competence and accountability in every client deliverable.",
  },
  {
    icon: Heart,
    label: "03 / How we serve",
    title: "Commitment",
    body: "Dedicated to real value and the best outcome for every stakeholder.",
  },
  {
    icon: Lightbulb,
    label: "04 / How we improve",
    title: "Innovation",
    body: "Technology, creativity and continuous improvement in how we work.",
  },
];

/*
 * The mockup fills this section with invented case metrics — "98.4% on-time
 * handover", "140+ cross-border files", "+68% base increase" and so on.
 * CLAUDE.md Section 6.2 rules those out explicitly, so the card *structure*
 * is ported and the numbers are left as visibly-pending slots.
 */
const caseSlots = [
  {
    kind: "Placement",
    audience: "Executive Individual",
    title: "Career placement engagement",
    body: "Positioning, market-facing documents and structured employer follow-up run against agreed milestones.",
    artifacts: ["CV & profile dossier", "Recruiter follow-up log", "Offer review"],
  },
  {
    kind: "Compliance",
    audience: "Business / Institution",
    title: "Cross-border corporate structuring",
    body: "Corporate legalisation, tax and social insurance compliance and ministerial approvals assembled into one auditable record.",
    artifacts: ["RCCM Cameroon", "IRS EIN", "Ministry licensing"],
  },
  {
    kind: "Managed service",
    audience: "Business / Institution",
    title: "Managed support & payroll operations",
    body: "A support function staffed and governed to documented standards, with transparent reporting to the client's own team.",
    artifacts: ["Tier-1 support desk", "Payroll operations", "Incident audit log"],
  },
];

const careerAreas = [
  "IT & data roles",
  "Compliance & formalisation",
  "Recruitment & payroll",
  "Client support & BPO",
];

function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-3 inline-flex items-center gap-2">
      <span
        className={`inline-block h-[2px] w-7 ${
          tone === "dark" ? "bg-teal-400" : "bg-teal-500"
        }`}
      />
      <span
        className={`text-xs font-bold uppercase tracking-wider ${
          tone === "dark" ? "text-teal-400" : "text-sky-600"
        }`}
      >
        {children}
      </span>
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
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover object-right opacity-70 lg:opacity-80"
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
                  className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-navy-950/80 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500"
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
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="relative lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={images["it-advisory"].src}
                    alt={images["it-advisory"].alt}
                    width={images["it-advisory"].width}
                    height={images["it-advisory"].height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["it-advisory"].blurDataURL}
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
                <Eyebrow>Who we are</Eyebrow>
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

                <dl className="mb-8 divide-y divide-slate-200/80 rounded-xl border border-slate-200/90 bg-slate-50/80 p-5 shadow-xs">
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
                      To simplify operations, strengthen capacity and enable
                      sustainable growth.
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
            </div>
          </div>
        </section>

        {/* ---------------- Where Do You Start? ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow>Where do you start?</Eyebrow>
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  Different needs. One standard
                  <br className="hidden sm:inline" /> of delivery.
                </h2>
              </div>
              <p className="max-w-sm text-xs text-slate-500 sm:text-sm">
                Choose the path that fits your situation. We will define the
                right scope during consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-navy-950/85 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
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
                          <li
                            key={point}
                            className="flex items-start gap-3.5 text-sm text-slate-700"
                          >
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50">
                              <Check
                                className="h-3.5 w-3.5 text-teal-600"
                                strokeWidth={2.5}
                              />
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
            </div>
          </div>
        </section>

        {/* ---------------- What We Do ---------------- */}
        <section id="services" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <Eyebrow>What we do</Eyebrow>
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

              <div className="divide-y divide-slate-200/80 lg:col-span-7">
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
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- How We Work ---------------- */}
        <section className="relative overflow-hidden bg-navy-900 py-24 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] opacity-15 [background-size:24px_24px]" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Eyebrow tone="dark">How we work</Eyebrow>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Documented systems, not individual heroics.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-slate-300 sm:text-base">
                  A clear operating rhythm keeps every engagement accountable.
                </p>
                <Link
                  href="/contact"
                  className="gradient-teal-blue inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Plan your engagement</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>

              <ol className="space-y-4 lg:col-span-7">
                {process.map((step) => (
                  <li
                    key={step.number}
                    className="flex items-start gap-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.08] sm:p-7"
                  >
                    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-xs font-bold text-teal-400">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="mb-1.5 text-base font-bold text-white sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------- What We Stand On ---------------- */}
        <section className="border-b border-slate-200/80 bg-slate-100/70 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14">
              <Eyebrow>What we stand on</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                The standard holds—even when it is inconvenient.
              </h2>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="card-hover-shadow rounded-2xl border border-slate-200/90 bg-white p-7"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900 text-teal-400 shadow-md shadow-slate-950/10">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {value.label}
                    </span>
                    <h3 className="mb-2 mt-2 text-lg font-bold text-navy-950">
                      {value.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {value.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-navy-950 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
            >
              <span>Work with our team</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* ---------------- Real Results ---------------- */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <Eyebrow>Real results</Eyebrow>
              <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                What a completed engagement looks like.
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Approved references and verified engagement files from across
                Cameroon and the United States.
              </p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {caseSlots.map((slot) => (
                <div
                  key={slot.title}
                  className="card-hover-shadow flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-amber-400/80 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 p-7">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200/70 bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase text-teal-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        {slot.kind}
                      </span>
                      <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Pending
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-snug text-navy-950">
                      {slot.title}
                    </h3>
                    <p className="mb-6 text-xs leading-relaxed text-slate-500">
                      {slot.body}
                    </p>

                    <div className="mb-6 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Outcome metrics
                      </div>
                      <p className="text-xs leading-relaxed text-amber-800">
                        [PENDING: real figures and an approved client reference
                        from UCO. Nothing has been estimated to fill this
                        space.]
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Delivered artifacts
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {slot.artifacts.map((artifact) => (
                          <span
                            key={artifact}
                            className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
                          >
                            {artifact}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 p-5">
                    <span className="text-xs font-medium text-slate-400">
                      {slot.audience}
                    </span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-accent transition-colors hover:text-blue-700"
                    >
                      <span>Request a briefing</span>
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-navy-950 p-4 text-white sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-teal-400">
                  <Lock className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <span className="block text-xs font-bold leading-snug text-white">
                    Confidentiality &amp; Client NDA Protocol
                  </span>
                  <span className="text-[11px] leading-tight text-slate-400">
                    Case identifiers are anonymised. Full engagement binders and
                    client references are reviewed under mutual NDA during
                    consultation.
                  </span>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex flex-shrink-0 items-center gap-2 text-xs font-semibold text-teal-400 transition-colors hover:text-teal-300"
              >
                <span>Book confidential briefing</span>
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- Where We Operate ---------------- */}
        <section className="relative overflow-hidden border-t border-slate-800 bg-navy-900 py-24 text-white">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Eyebrow tone="dark">Where we operate</Eyebrow>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Two jurisdictions. One accountable structure.
                </h2>
              </div>
              <p className="max-w-md text-xs text-slate-300 sm:text-sm">
                Formalised entities on both sides of the Atlantic support
                cross-border work inside a clear corporate structure.
              </p>
            </div>

            <div className="mb-10 grid grid-cols-1 divide-y divide-slate-800 border-y border-slate-800 py-12 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="pb-8 md:pb-0 md:pr-12">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400" />
                  <span className="text-xs text-teal-400">Buea office</span>
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white">
                  Cameroon
                </h3>
                <p className="text-sm text-slate-400">
                  Uptech Consulting &amp; Outsourcing Cameroon S.A.
                </p>
              </div>
              <div className="pt-8 md:pl-12 md:pt-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400" />
                  <span className="text-xs text-teal-400">Texas office</span>
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white">
                  United States
                </h3>
                <p className="text-sm text-slate-400">
                  Uptech Consulting &amp; Outsourcing USA S-Corp
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-navy-950/80 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:border-slate-500 hover:shadow"
            >
              <span>Discuss a cross-border need</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* ---------------- Careers at Uptech ---------------- */}
        <section id="careers" className="scroll-mt-24 bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
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
                <Eyebrow>Careers at Uptech</Eyebrow>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  Work where the standard is written down.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                  We look for people who bring integrity, professionalism,
                  commitment and innovation to client-facing work.
                </p>

                <ul className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {careerAreas.map((area) => (
                    <li
                      key={area}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 text-sm font-medium text-slate-700 shadow-xs"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50">
                        <Check className="h-3 w-3 text-teal-600" strokeWidth={2.5} />
                      </span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/careers"
                    className="flex items-center gap-2 rounded-lg bg-blue-accent px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                  >
                    <span>Send your application</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                  <a
                    href="tel:+237670000000"
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-slate-400"
                  >
                    Talk to our team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section
          id="consultation"
          className="relative scroll-mt-24 overflow-hidden bg-navy-900 py-24 text-white"
        >
          <div className="absolute inset-0 opacity-20 saturate-0">
            <Image
              src={images["ops-center"].src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <Eyebrow tone="dark">Next step</Eyebrow>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  One focused conversation tells us what you actually need.
                </h2>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
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
                  className="flex items-center justify-center gap-2.5 rounded-lg border border-slate-700 bg-navy-950/80 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500"
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
