import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { FaqAccordion } from "@/components/FaqAccordion";
import { OpenPositions, type JobPosting } from "@/components/OpenPositions";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { HeroIntro } from "@/components/careers/HeroIntro";
import { ScrollCue } from "@/components/home/ScrollCue";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { TiltCard } from "@/components/TiltCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Careers at Uptech Consulting",
  description:
    "Join the team building Uptech Consulting's cross-border practice across Buea and Stafford, Texas.",
};

const trustStripItems = [
  {
    icon: "public",
    title: "Cross-Border Team",
    badgeText: "Buea & Stafford, Texas",
    badgeAccent: "teal" as const,
    description: "Work alongside colleagues on both sides of an active dual-jurisdiction practice.",
  },
  {
    icon: "schema",
    title: "Documented Systems",
    badgeText: "Not Individual Heroics",
    badgeAccent: "sky" as const,
    description: "Your work is backed by process, not left to depend on any one person.",
  },
  {
    icon: "translate",
    title: "Bilingual-Ready Culture",
    badgeText: "English & French",
    badgeAccent: "emerald" as const,
    description: "Official operating languages across our systems, records, and daily work.",
  },
];

const coreValues = [
  {
    icon: "verified_user",
    name: "Integrity",
    definition: "How we behave.",
    proof: "You're trusted to flag your own mistakes and help fix them — not manage optics.",
  },
  {
    icon: "workspace_premium",
    name: "Professionalism",
    definition: "The standard we maintain.",
    proof:
      "Every piece of work you produce is held to the same bar we hold client deliverables to — no separate standard for internal work.",
  },
  {
    icon: "handshake",
    name: "Commitment",
    definition: "How we serve.",
    proof:
      "The same follow-through we promise clients applies to each other: no one is left to solve a hard problem alone.",
  },
  {
    icon: "bolt",
    name: "Innovation",
    definition: "How we solve problems and improve.",
    proof:
      "If a process is manual and repetitive, your job is to question it — we build systems, not workarounds.",
  },
];

/*
 * FLAG FOR TEAM: IT Consulting & Outsourcing and Recruitment & BPO are
 * displayed below as normal, fully-active departments — same visual weight
 * as Business Formalisation & Compliance and Career Marketing & Placement —
 * but both are paused/deprioritized everywhere else on the site per
 * leadership's direction (see CLAUDE.md Section 5/9, components/Header.tsx).
 * This may be intentional (a careers page can reasonably describe the
 * company's full internal structure separately from what's actively being
 * marketed to clients), or it may be an inconsistency that should match the
 * paused treatment used elsewhere. This is a deliberate open decision, not
 * yet resolved — do not change the department grid's current display until
 * the team responds either way.
 */
const departments = [
  {
    icon: "terminal",
    title: "IT Consulting & Outsourcing",
    description: "Managed IT support, cloud migration, database administration, and cybersecurity delivery.",
  },
  {
    icon: "gavel",
    title: "Business Formalisation & Compliance",
    description: "Corporate formation, tax compliance, and regulatory filing across Cameroon and the US.",
  },
  {
    icon: "trending_up",
    title: "Career Marketing & Placement",
    description: "Profile positioning, application management, and recruiter follow-up for job seekers.",
  },
  {
    icon: "groups",
    title: "Recruitment & BPO",
    description: "Recruitment, selection, and payroll management support for client organizations.",
  },
  {
    icon: "inventory_2",
    title: "General Contracts & Supplies",
    description: "Contracts and supply arrangements supporting client operations — scope still being defined.",
  },
  {
    // FLAG FOR TEAM: confirm "Corporate & Administration" is a real internal
    // department before this stays live — not found in any official company
    // documentation referenced elsewhere in this project (CLAUDE.md's own
    // service/organizational inventory does not name it). Do not remove or
    // rename it without team confirmation either way.
    icon: "account_balance",
    title: "Corporate & Administration",
    description: "The internal operations, finance, and administration that keep both offices running.",
  },
];

const hiringSteps = [
  {
    number: "01",
    title: "Application review",
    description: "Your application and CV are reviewed against the role's actual requirements.",
  },
  {
    number: "02",
    title: "A real conversation",
    description: "A direct conversation with the team you'd be joining — not a generic screening call.",
  },
  {
    number: "03",
    title: "A clear decision",
    description: "You hear back either way, directly from the person you spoke with.",
  },
];

const faqItems = [
  {
    question: "Can I apply if there's no open role listed for what I do?",
    answer:
      "Yes. Use the \"Send Us Your CV\" option in the Open Positions section. We keep general applications on file and reach out when a matching role opens.",
  },
  {
    // Kept as a reasonable, generic "depends on the role" answer rather
    // than a specific confirmed policy — deliberately doesn't commit to a
    // ratio or list of remote-eligible roles the team hasn't confirmed.
    // Flag for a real policy statement once the team has one.
    question: "Do you hire remote, or only in Buea and Stafford, Texas?",
    answer:
      "It depends on the role. Some positions require being on-site in Buea or Stafford; others can be done remotely. Each listing will state this — if you're unsure, ask when you apply.",
  },
  {
    question: "Can I apply to more than one role at a time?",
    answer:
      "Yes, though we'd ask you to send a separate application for each role so it reaches the right team directly.",
  },
  {
    question: "Is this the same as Career Marketing & Placement?",
    answer:
      "No. Career Marketing & Placement is a paid service for clients seeking jobs with other companies. This page is for people who want to work at Uptech Consulting itself.",
  },
];

// No fabricated postings — an honest empty state until real roles are supplied.
const jobPostings: JobPosting[] = [];

export default function CareersPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            {/* Grounded gradient over a rotating background (management
                request: hero backgrounds cycle automatically). */}
            <HeroImageCarousel
              keys={["it-advisory", "ops-center"]}
              imageClassName="hero-ken-burns object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/55 to-navy-950/55" />
          </div>

          {/* Ambient depth — same slow-drifting glows as the other two
              hero treatments sitewide, replacing the single static blur
              circle this section had before. */}
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
            <div className="float-a absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl" />
            <div className="float-b absolute bottom-0 -right-16 w-80 h-80 rounded-full bg-sky-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroIntro />
          </div>

          <ScrollCue />
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Why work here */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  WHY WORK HERE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                  <TextReveal text="The same values we hold clients to, we hold ourselves to." />
                </h2>
              </div>
            </Reveal>
            <Reveal effect="stagger">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreValues.map((value) => (
                  <TiltCard
                    key={value.name}
                    max={5}
                    className="group bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-blue-accent" />
                    <div className="w-11 h-11 rounded-xl bg-white text-teal-700 shadow-sm border border-slate-200/80 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <MaterialIcon name={value.icon} className="text-[22px]" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-950 mb-1">{value.name}</h3>
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-3">
                      {value.definition}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{value.proof}</p>
                  </TiltCard>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Departments */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  WHERE YOU MIGHT FIT
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                  <TextReveal text="Six departments, one practice." />
                </h2>
              </div>
            </Reveal>
            <Reveal effect="stagger">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <TiltCard
                    key={dept.title}
                    max={5}
                    className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <MaterialIcon name={dept.icon} className="text-[22px]" />
                    </div>
                    <h3 className="text-base font-bold text-navy-950 mb-1.5">{dept.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{dept.description}</p>
                  </TiltCard>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  OPEN POSITIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                  <TextReveal text="Current opportunities" />
                </h2>
              </div>
            </Reveal>
            <Reveal effect="fade" delay={120}>
              <OpenPositions jobs={jobPostings} />
            </Reveal>
          </div>
        </section>

        {/* How we hire */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  HOW WE HIRE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                  <TextReveal text="Three steps, no waiting in the dark." />
                </h2>
              </div>
            </Reveal>
            <Reveal effect="stagger" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {hiringSteps.map((step) => (
                <div key={step.number} className="text-center sm:text-left">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-mono font-bold text-sm mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-base font-bold text-navy-950 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 mb-3 justify-center">
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    FREQUENTLY ASKED QUESTIONS
                  </span>
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                  <TextReveal text="Before you apply" />
                </h2>
              </div>
            </Reveal>
            <Reveal effect="fade" delay={120}>
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>

        {/* Final CTA — this page had no closing band at all before this
            pass; it just trailed off after the FAQ straight into the
            footer. Added to match the pattern every other main page on the
            site ends on. */}
        <section className="relative py-24 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* dedicated-advisor is a naturally bright, window-lit photo —
                needs a stronger overlay than the darker/dusk images used
                for this same treatment elsewhere, or the heading sits on a
                too-light patch. */}
            <Image
              src={images["dedicated-advisor"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["dedicated-advisor"].blurDataURL}
              className="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/92 via-navy-950/68 to-navy-950/68" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
            <div className="float-a absolute -left-16 top-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="float-b absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
          </div>

          <Reveal effect="rise" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Ready to build something <span className="gradient-teal-blue-text">real?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
              Browse open roles, or send us your CV if nothing&apos;s listed for what you do yet.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="#open-positions">View Open Positions</Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
