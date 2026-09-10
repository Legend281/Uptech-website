import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TeamGrid, type TeamMember } from "@/components/TeamGrid";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { images } from "@/lib/images";

const WHATSAPP = "https://wa.me/237670000000";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "How Uptech Consulting actually operates: good people, good systems and good technology working together, and the four values that govern behaviour when nobody is watching.",
};

/*
 * A continuous hairline runs down the left of every content section, with a
 * node where each one begins. The page argues that outcomes are carried by one
 * documented, unbroken process rather than by individuals, so the page itself
 * is built on a single line that never breaks between sections.
 *
 * The rule lives on a wrapper *inside* the container but *outside* the vertical
 * padding, so consecutive sections' rules meet exactly and read as one line.
 * Desktop only — at mobile widths the indent costs more than the idea is worth.
 */
const SPINE = "spine-draw relative lg:pl-12";
const SPINE_LIGHT = `${SPINE} [--spine-color:#e2e8f0]`;
const SPINE_DARK = `${SPINE} [--spine-color:rgba(255,255,255,0.10)]`;

function SpineNode({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={`spine-node absolute -left-[5px] top-0 hidden h-2.5 w-2.5 rounded-full lg:block ${
        tone === "dark" ? "bg-teal-400" : "bg-teal-500"
      }`}
    />
  );
}

/*
 * The company's four official pillars, in full. The homepage lists only the
 * three that are live, because it is a marketing surface; this page is the
 * organisational record, so the paused pillars are named here rather than
 * quietly omitted.
 *
 * A row without an `href` is not a link and gets no hover affordance. Only the
 * exceptions carry a status line — a working link is its own proof that a
 * service is active, so labelling all five "Active / Active / Active / Paused /
 * Paused" would be decoration rather than information.
 */
const pillars: Array<{
  name: string;
  href?: string;
  kicker?: string;
  body?: string;
  status?: string;
}> = [
  {
    name: "IT Consulting & Outsourcing",
    href: "/services/it-consulting-outsourcing",
    body: "Managed IT, cloud migration, databases and cyber security — advised, then actually run.",
  },
  {
    name: "Business Formalisation & Compliance",
    href: "/services/business-formalisation-compliance",
    body: "Registration, corporate structuring and tax standing, in Cameroon and in the United States.",
  },
  {
    name: "Career Marketing & Placement",
    href: "/services/career-marketing-placement",
    kicker: "Part of our IT Consulting practice",
    body: "A dedicated worker on your account: profile positioning, daily applications, and recruiter follow-up until you are placed.",
  },
  // No description on the paused pillars. Describing the scope of something we
  // are not currently selling would be inventing it.
  {
    name: "Third-Party Recruitment & BPO",
    status: "In active development",
  },
  {
    name: "General Contracts and Supplies",
    status: "Not currently offered as a standalone service",
  },
];

/*
 * Empty until the client supplies real names, roles and portraits. While it is
 * empty the page carries a single quiet line in the closing statement instead
 * of a whole section that says nothing; add one member and the full section
 * below renders itself.
 */
const team: TeamMember[] = [];

/*
 * The section argues that growth is *structural*, so the three supports are
 * drawn as columns carrying a beam. Each takes its accent from its position
 * along the beam's gradient, so the group reads as one structure rather than
 * three unrelated panels.
 */
const supports = [
  {
    name: "Good people",
    body: "Competent professionals who take responsibility for the outcome, not just the task in front of them.",
    edge: "bg-teal-400",
    wash: "from-teal-50",
  },
  {
    name: "Good systems",
    body: "Documented, repeatable processes, so the work survives holidays, handovers and staff changes.",
    edge: "bg-sky-500",
    wash: "from-sky-50",
  },
  {
    name: "Good technology",
    body: "Tools that remove manual effort and the errors that come with it, rather than adding another dashboard.",
    edge: "bg-blue-accent",
    wash: "from-blue-50",
  },
];

/*
 * The first restaurant's list is deliberately inconsistent: each line steps
 * down in size, drifts further right, and sits on a different gap from the one
 * above it. The second is perfectly regular. The drift is monotonic rather than
 * random so it reads as designed rather than broken — the panel demonstrates
 * the argument instead of describing it.
 */
const driftedLine = [
  "text-[17px] leading-[26px]",
  "ml-3 mt-6 text-[15.5px] leading-[25px]",
  "ml-7 mt-3.5 text-[14px] leading-[23px]",
];

const restaurants = [
  {
    ordinal: "The first restaurant",
    label: "No written recipes",
    lines: [
      "Every cook prepares the food differently.",
      "Customers get a different meal every visit.",
      "Quality depends entirely on who happened to be working.",
    ],
    tone: "muted" as const,
  },
  {
    ordinal: "The second restaurant",
    label: "Clear recipes and procedures",
    lines: [
      "It does not matter who is cooking.",
      "Customers receive the same quality every time.",
      "The standard lives in the process, not in one person.",
    ],
    tone: "accent" as const,
  },
];

const coreValues = [
  {
    name: "Integrity",
    definition: "Doing the right thing even when nobody is watching.",
    proof:
      "If a mistake happens in a client's report, integrity means admitting it quickly and helping correct it — not pretending nothing happened.",
  },
  {
    name: "Professionalism",
    definition: "The standard we maintain in every deliverable.",
    proof:
      "A document sent to a client should be accurate, well-organised, and free of avoidable errors. That is professionalism, not a slogan.",
  },
  {
    name: "Commitment",
    definition: "How we serve, past the point most companies stop.",
    proof:
      "If a client needs the right employee, we do not stop after sending a few CVs — we stay until they get the best possible outcome.",
  },
  {
    name: "Innovation",
    definition: "How we solve problems and improve, not just work harder.",
    proof:
      "Instead of tracking hundreds of job applications in notebooks, we build digital systems that organise information automatically, save time, and reduce errors.",
  },
];

export default function WhoWeArePage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Who We Are" }]} />

      <main>
        {/* ---------------- Hero ---------------- */}
        {/* Given a real minimum height so it owns the first screen instead of
            ending halfway down it. */}
        <section className="relative flex min-h-[560px] items-center overflow-hidden bg-navy-900 py-16 lg:min-h-[76vh] lg:py-24">
          {/* Someone actually doing the work, which is what this page argues
              the company is built around. Anchored right and heavily dimmed so
              it carries weight without competing with the headline. */}
          <div className="absolute inset-0 z-0">
            <Image
              src={images["ops-center"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["ops-center"].blurDataURL}
              /* A narrow viewport cropped to `object-right` lands on empty dark
                 background, so mobile is pulled back onto the subject. */
              className="object-cover object-[72%_center] opacity-70 lg:object-right lg:opacity-80"
            />
            {/* Graded so the photograph reads clearly on the right while the
                left stays dark enough to hold the headline at AA contrast. */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20" />
          </div>

          {/* DESIGN.md: deep slate overlays carry a faint technical grid. Kept
              very low here so it textures the dark left side without veiling
              the photograph. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(45,212,191,0.12),transparent_60%)]" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              {/* Same eyebrow / three-line headline / subhead rhythm as the
                  homepage hero, so the two read as one site. */}
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="inline-block h-[2px] w-7 bg-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Who We Are
                </span>
              </div>

              <h1 className="mb-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[68px] xl:leading-[1.08]">
                Where strategy meets
                <br />
                <span className="text-teal-400">accountable</span>
                <br />
                <span className="text-sky-400">execution.</span>
              </h1>

              <p className="mb-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Many people know what they want to achieve. Very few know how.
                Uptech Consulting is built around the how — the part that turns
                a plan into a filed document, a placed candidate, or a system
                that still runs after we leave.
              </p>
              <p className="text-sm text-slate-400">
                We do not only give advice. This page explains the machinery
                behind putting it into action.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- What We Do ---------------- */}
        <section
          id="what-we-do"
          className="scroll-mt-24 border-b border-slate-200 bg-[#F8FAFC]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_LIGHT} py-16 sm:py-20 lg:py-24`}>
              <SpineNode />

              {/* Heading left, explainer right. */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <h2 className="text-[30px] font-extrabold leading-[38px] tracking-[-0.025em] text-navy-950 sm:text-[38px] sm:leading-[46px] lg:text-[42px] lg:leading-[50px] lg:tracking-[-0.03em]">
                    Everything we do, including what we have paused
                  </h2>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-[16px] leading-[26px] text-slate-600 sm:text-[17px] sm:leading-[28px]">
                    Uptech Consulting &amp; Outsourcing is a technology-driven
                    consulting, outsourcing, and business support company,
                    formalised in Cameroon and the United States. We help
                    individuals build their careers and help businesses run
                    better — in practice, that means we advise on what to do,
                    supply the skilled people and technology to do it, and
                    handle the compliance and operational work that keeps a
                    business legally sound. A job seeker works with us to get
                    placed in a role that fits their specialty. A business works
                    with us to get registered, staffed, compliant, or supported,
                    without building an internal team to do it themselves. We do
                    not just recommend a solution and leave — we stay through
                    execution, because that is the part most consulting firms
                    skip.
                  </p>
                </div>
              </div>

              {/* A register, not a card grid: the useful distinction here is
                  availability, so the left rail carries it. Solid gradient rail
                  on a lifted white row = live; dashed and recessed into the page
                  ground = named but not currently sold. */}
              <Reveal effect="stagger" className="mt-12 space-y-3 lg:mt-14">
                {pillars.map((pillar) =>
                  pillar.href ? (
                    <Link
                      key={pillar.name}
                      href={pillar.href}
                      className="group flex gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_1px_3px_0_rgba(11,25,44,0.04),0_1px_2px_-1px_rgba(11,25,44,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_25px_-5px_rgba(11,25,44,0.10),0_8px_10px_-6px_rgba(11,25,44,0.04)] sm:gap-6 sm:p-7"
                    >
                      <span
                        aria-hidden="true"
                        className="w-[3px] flex-shrink-0 rounded-full bg-gradient-to-b from-teal-400 to-sky-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-[19px] font-bold leading-[26px] tracking-[-0.01em] text-navy-950 transition-colors group-hover:text-blue-accent sm:text-[21px] sm:leading-[28px]">
                            {pillar.name}
                          </h3>
                          <ArrowRight
                            className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-accent"
                            strokeWidth={2}
                          />
                        </div>
                        {pillar.kicker ? (
                          <p className="mt-1.5 text-[13px] leading-[18px] text-teal-700">
                            {pillar.kicker}
                          </p>
                        ) : null}
                        <p className="mt-2.5 max-w-2xl text-[15px] leading-[24px] text-slate-600">
                          {pillar.body}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={pillar.name}
                      className="flex gap-5 rounded-lg border border-dashed border-slate-300 bg-slate-100/50 p-6 sm:gap-6 sm:p-7"
                    >
                      <span
                        aria-hidden="true"
                        className="h-10 w-0 flex-shrink-0 self-center border-l-2 border-dashed border-slate-400"
                      />
                      <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                        <h3 className="text-[19px] font-bold leading-[26px] tracking-[-0.01em] text-slate-500 sm:text-[21px] sm:leading-[28px]">
                          {pillar.name}
                        </h3>
                        <p className="text-[14px] leading-[20px] text-slate-500 sm:flex-shrink-0 sm:text-right">
                          {pillar.status}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </Reveal>

              {/* The jurisdictions story is told properly on the homepage, with
                  live office clocks and the regulatory bodies named. Pointed to
                  rather than rebuilt here. */}
              <p className="mt-7 text-[14px] leading-[20px] text-slate-500">
                Both entities run through one structure —{" "}
                <Link
                  href="/#two-jurisdictions"
                  className="font-semibold text-blue-accent underline-offset-4 transition-colors hover:underline"
                >
                  see how Cameroon and the United States operate together
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Our Philosophy ---------------- */}
        {/* Stacked heading and lead, rather than the split used above — the
            section structure varies so the page has rhythm instead of one
            layout repeated six times. */}
        <section id="our-philosophy" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_LIGHT} py-16 sm:py-20 lg:py-24`}>
              <SpineNode />

              <h2 className="max-w-4xl text-[30px] font-extrabold leading-[38px] tracking-[-0.025em] text-navy-950 sm:text-[38px] sm:leading-[46px] lg:text-[46px] lg:leading-[54px] lg:tracking-[-0.03em]">
                Sustainable growth is structural, not accidental
              </h2>
              <p className="mt-6 max-w-3xl text-[18px] leading-[30px] tracking-[-0.01em] text-slate-600">
                Uptech Consulting holds that success does not happen by chance.
                It happens when three things carry the weight together — and if
                one of them is missing, consistent results become difficult to
                achieve.
              </p>

              {/* One beam resting on three columns. */}
              <div className="mt-12 lg:mt-14">
                <p className="mb-3 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-sky-700">
                  Sustainable growth
                </p>
                <div
                  aria-hidden="true"
                  className="beam-draw h-3 w-full rounded-sm bg-gradient-to-r from-teal-400 via-sky-500 to-blue-accent shadow-[0_12px_24px_-8px_rgba(37,99,235,0.45)]"
                />

                {/* The columns sit flush under the beam and carry a solid edge
                    in their own accent, so the three read as supports bearing a
                    load rather than as a row of cards. */}
                <Reveal effect="stagger" delay={260} className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7 lg:gap-8">
                  {supports.map((support) => (
                    <div
                      key={support.name}
                      className="flex flex-col overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-white shadow-[0_20px_30px_-10px_rgba(11,25,44,0.14),0_10px_15px_-5px_rgba(11,25,44,0.06)]"
                    >
                      <span aria-hidden="true" className={`h-1.5 w-full ${support.edge}`} />
                      <div
                        className={`flex flex-1 flex-col bg-gradient-to-b to-white p-6 sm:p-7 ${support.wash}`}
                      >
                        <h3 className="text-[23px] font-bold leading-[30px] tracking-[-0.02em] text-navy-950 sm:text-[25px] sm:leading-[32px]">
                          {support.name}
                        </h3>
                        <p className="mt-3.5 text-[16px] leading-[26px] text-slate-600">
                          {support.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </Reveal>

                <p className="mt-10 border-t border-slate-200 pt-7 text-[18px] leading-[28px] tracking-[-0.01em] text-navy-950">
                  Remove any one of the three and the other two cannot hold the
                  load on their own.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- The two restaurants ---------------- */}
        <section className="border-y border-slate-200 bg-[#F1F5F9]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_LIGHT} py-16 sm:py-20 lg:py-24`}>
              <SpineNode />

              <div className="max-w-3xl">
                <h2 className="text-[26px] font-extrabold leading-[34px] tracking-[-0.02em] text-navy-950 sm:text-[34px] sm:leading-[42px] sm:tracking-[-0.025em]">
                  Why we insist on written process
                </h2>
                <p className="mt-5 text-[18px] leading-[28px] tracking-[-0.01em] text-slate-600">
                  The clearest way to explain it is the one Uptech Consulting
                  uses internally. Picture two restaurants.
                </p>
              </div>

              {/* The two panels are deliberately unequal, and the first one's
                  list is deliberately inconsistent — see `driftedLine`. */}
              <Reveal effect="stagger" className="mt-11 grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.label}
                    className={
                      restaurant.tone === "accent"
                        ? "rounded-lg border border-teal-500/30 bg-white p-7 shadow-[0_20px_30px_-10px_rgba(11,25,44,0.16),0_10px_15px_-5px_rgba(11,25,44,0.08)] ring-1 ring-teal-500/10 sm:p-9"
                        : "rounded-lg border border-slate-300/70 bg-transparent p-7 sm:p-9"
                    }
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] ${
                        restaurant.tone === "accent"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-slate-200/70 text-slate-500"
                      }`}
                    >
                      {restaurant.ordinal}
                    </span>
                    <h3
                      className={`mt-5 text-[24px] font-bold leading-[32px] tracking-[-0.015em] sm:text-[27px] sm:leading-[35px] ${
                        restaurant.tone === "accent"
                          ? "text-navy-950"
                          : "text-slate-500"
                      }`}
                    >
                      {restaurant.label}
                    </h3>

                    <ul className="mt-6">
                      {restaurant.lines.map((line, index) => (
                        <li
                          key={line}
                          className={
                            restaurant.tone === "accent"
                              ? `text-[17px] leading-[26px] text-slate-800 ${index > 0 ? "mt-5" : ""}`
                              : `text-slate-500 ${driftedLine[index]}`
                          }
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Reveal>

              <p className="mt-9 max-w-3xl text-[22px] font-bold leading-[32px] tracking-[-0.02em] text-navy-950 sm:text-[26px] sm:leading-[36px]">
                Uptech Consulting is built to run like the second restaurant.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- The operating principle ---------------- */}
        {/* The page's centrepiece. This is the single best sentence on the page
            and the whole argument in one line, so it is given display scale and
            a stage of its own rather than sharing a row with a photograph. */}
        <section className="relative overflow-hidden bg-navy-950">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(45,212,191,0.14),transparent_60%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_DARK} py-20 sm:py-24 lg:py-28`}>
              <SpineNode tone="dark" />

              <blockquote>
                <p className="max-w-5xl text-[30px] font-extrabold leading-[40px] tracking-[-0.025em] text-white sm:text-[42px] sm:leading-[54px] lg:text-[56px] lg:leading-[68px] lg:tracking-[-0.03em]">
                  Individual effort only succeeds when it runs through the
                  repeatable, documented systems the organisation has already
                  built.
                </p>
              </blockquote>

              <div className="mt-14 grid grid-cols-1 items-center gap-10 border-t border-white/10 pt-12 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-6">
                  <p className="text-[17px] leading-[28px] text-slate-400">
                    This is a stated internal expectation, not a marketing line.
                    It is also the practical reason a client&apos;s outcome does
                    not depend on which staff member happens to be available
                    that week — the process carries it, and the process is
                    written down.
                  </p>
                </div>

                {/* Several people working the same file from the same
                    documents: the point is the process, not one individual. */}
                <div className="lg:col-span-6">
                  <div className="overflow-hidden rounded-lg border border-slate-800 shadow-[0_20px_30px_-10px_rgba(0,0,0,0.5),0_10px_15px_-5px_rgba(0,0,0,0.3)]">
                    <Image
                      src={images["compliance-advisory"].src}
                      alt={images["compliance-advisory"].alt}
                      width={images["compliance-advisory"].width}
                      height={images["compliance-advisory"].height}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      placeholder="blur"
                      blurDataURL={images["compliance-advisory"].blurDataURL}
                      className="h-[240px] w-full object-cover sm:h-[300px]"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Core Values ---------------- */}
        <section id="core-values" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_LIGHT} py-16 sm:py-20 lg:py-24`}>
              <SpineNode />

              <h2 className="max-w-4xl text-[30px] font-extrabold leading-[38px] tracking-[-0.025em] text-navy-950 sm:text-[38px] sm:leading-[46px] lg:text-[46px] lg:leading-[54px] lg:tracking-[-0.03em]">
                Four values, and what each one costs us
              </h2>
              <p className="mt-6 max-w-2xl text-[18px] leading-[30px] tracking-[-0.01em] text-slate-600">
                Values are only meaningful where they change a decision. Each
                one below is paired with the behaviour it actually requires.
              </p>

              {/* Two columns, not three: name and definition belong together on
                  the left, and the proof — the reason this section is credible
                  at all — takes the right at reading size. Three columns left a
                  hole under the two short ones on every row. */}
              <Reveal effect="stagger" className="mt-12 border-t border-slate-200 lg:mt-14">
                {coreValues.map((value) => (
                  <article
                    key={value.name}
                    className="grid grid-cols-1 gap-5 border-b border-slate-200 py-9 lg:grid-cols-12 lg:gap-14 lg:py-10"
                  >
                    <div className="lg:col-span-5">
                      <h3 className="text-[30px] font-extrabold leading-[38px] tracking-[-0.025em] text-navy-950 lg:text-[34px] lg:leading-[42px]">
                        {value.name}
                      </h3>
                      <p className="mt-2.5 text-[18px] leading-[28px] tracking-[-0.01em] text-slate-600">
                        {value.definition}
                      </p>
                    </div>

                    <div className="border-l-2 border-teal-500 pl-6 lg:col-span-7">
                      <p className="mb-2 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-400">
                        In practice
                      </p>
                      <p className="text-[17px] leading-[28px] text-slate-800">
                        {value.proof}
                      </p>
                    </div>
                  </article>
                ))}
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Meet the Team ---------------- */}
        {/* Renders only once real profiles exist. While the array is empty a
            whole section here would be 300px of page saying nothing, directly
            where the page should be accelerating into its closing statement —
            so the pending note lives as one quiet line in that statement
            instead. */}
        {team.length > 0 ? (
          <section className="border-b border-slate-200 bg-[#F8FAFC]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal className={`${SPINE_LIGHT} py-16 sm:py-20`}>
                <SpineNode />
                <h2 className="mb-10 text-[26px] font-extrabold leading-[34px] tracking-[-0.02em] text-navy-950 sm:text-[32px] sm:leading-[40px] sm:tracking-[-0.025em]">
                  Meet the team
                </h2>
                <TeamGrid members={team} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* ---------------- Mission & Vision ---------------- */}
        {/* The page's conclusion, so it is set as a statement rather than a
            pair of labelled plaques — and the mission is given the display
            scale while the vision sits quiet beneath it, because the argument
            this page has just made is that the method matters more than the
            aspiration. */}
        <section id="mission-vision" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className={`${SPINE_LIGHT} py-20 sm:py-24 lg:py-28`}>
              <SpineNode />

              <span
                aria-hidden="true"
                className="mb-9 inline-block h-[3px] w-14 bg-gradient-to-r from-teal-400 to-sky-500"
              />

              <p className="max-w-5xl text-[28px] font-extrabold leading-[38px] tracking-[-0.025em] text-navy-950 sm:text-[38px] sm:leading-[50px] lg:text-[46px] lg:leading-[60px] lg:tracking-[-0.03em]">
                <span className="text-slate-300">Our mission: </span>
                To empower businesses, institutions, and individuals by
                delivering technology, workforce, compliance, career
                development, and business support solutions that simplify
                operations, strengthen capacity, and drive sustainable growth.
              </p>

              <div className="mt-12 border-t border-slate-200 pt-9 lg:mt-14">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-8">
                  <p className="text-[14px] leading-[20px] text-slate-400 lg:col-span-2">
                    Our vision
                  </p>
                  <p className="max-w-3xl text-[20px] leading-[32px] tracking-[-0.01em] text-slate-700 lg:col-span-10 lg:text-[22px] lg:leading-[34px]">
                    To be a trusted global partner in consulting, outsourcing,
                    and business support solutions.
                  </p>
                </div>
              </div>

              {team.length === 0 ? (
                <p className="mt-10 text-[14px] leading-[20px] text-slate-400">
                  The people behind Uptech Consulting — profiles coming soon.
                </p>
              ) : null}
            </Reveal>
          </div>
        </section>

        {/* ---------------- Closing ---------------- */}
        <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
          {/* An actual consultation, which is exactly what the CTA asks for. */}
          <div className="absolute inset-0 opacity-70">
            <Image
              src={images["career-review"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["career-review"].blurDataURL}
              /* Anchored high: a short, wide band centred vertically crops the
                 tops of their heads off. */
              className="object-cover object-[center_28%] lg:object-[72%_28%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/25" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
              <div className="max-w-xl">
                <h2 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl">
                  See how this works on an actual engagement
                </h2>
                <p className="text-base leading-relaxed text-slate-300">
                  One conversation is enough to tell whether we are the right
                  partner for what you are trying to do.
                </p>
              </div>

              {/* Same pairing as the homepage close. WhatsApp is required
                  prominently on every page per CLAUDE.md Section 6.8. */}
              <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row lg:flex-col">
                <Link
                  href="/contact"
                  className="gradient-teal-blue group flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[15px] font-semibold leading-5 text-white shadow-lg shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  Book a Consultation
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-md border border-slate-700 bg-navy-950/80 px-6 py-3.5 text-[15px] font-semibold leading-5 text-white backdrop-blur-sm transition-all hover:border-slate-500 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-teal-400" />
                  Chat on WhatsApp
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
