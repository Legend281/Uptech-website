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
import { HIRING_DEPARTMENTS } from "@/lib/hiringDepartments";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Careers at Uptech Consulting",
  description:
    "Join the team building Uptech Consulting's cross-border practice across Buea and Stafford, Texas.",
};

/*
 * Re-fetched at most once a minute (Next.js ISR) rather than on every
 * request — job postings don't change often enough to justify a database
 * round-trip on every page load, and this site's mobile/low-bandwidth
 * audience (CLAUDE.md Section 9) benefits from the faster static-feeling
 * page. "Publish" in the admin still reaches this page live, just within
 * about a minute rather than instantly.
 */
export const revalidate = 60;

type JobPostingRow = {
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string[];
  apply_url: string | null;
};

async function getPublishedJobPostings(): Promise<JobPosting[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("job_postings")
    .select("title, department, location, employment_type, description, requirements, apply_url")
    .eq("status", "published")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("[careers] Failed to load published job postings:", error);
    return [];
  }

  return (data as JobPostingRow[]).map((row) => ({
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.employment_type,
    description: row.description,
    requirements: row.requirements.length > 0 ? row.requirements : undefined,
    applyUrl: row.apply_url ?? undefined,
  }));
}

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

// Moved to lib/hiringDepartments.ts — now the shared source of truth for both this page and the admin's Job Postings department dropdown. Both open-decision flags noted there are carried over unchanged, not resolved by this move.
const departments = HIRING_DEPARTMENTS;

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
    question: "Is this the same as Career Marketing & Placement Support?",
    answer:
      "No. Career Marketing & Placement Support is a paid service for clients seeking jobs with other companies. This page is for people who want to work at Uptech Consulting itself.",
  },
];

export default async function CareersPage() {
  const jobPostings = await getPublishedJobPostings();

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
        <section className="py-24 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Reveal effect="rise">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
                    <TextReveal text="The same values we hold clients to, we hold ourselves to." />
                  </h2>
                  <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
                    Four commitments that show up in how the work actually gets done — not framed on a wall.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <Reveal effect="stagger">
                  <div className="border-t border-slate-200">
                    {coreValues.map((value) => (
                      <div key={value.name} className="group flex flex-col gap-3 border-b border-slate-200 py-7 sm:flex-row sm:gap-10">
                        <div className="flex shrink-0 items-start gap-4 sm:w-64">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700 transition-colors duration-300 group-hover:bg-teal-50">
                            <MaterialIcon name={value.icon} className="text-[19px]" />
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-navy-950">{value.name}</h3>
                            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{value.definition}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 sm:pt-1.5">{value.proof}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-24 sm:py-28 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <h2 className="max-w-2xl text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                <TextReveal text="Six departments, one practice." />
              </h2>
            </Reveal>
            <Reveal effect="stagger">
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                {departments.map((dept, i) => {
                  const featured = i < 2;
                  return (
                    <TiltCard
                      key={dept.title}
                      max={4}
                      className={`group relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${
                        featured ? "bg-navy-950 border-navy-900 lg:col-span-6" : "bg-white border-slate-200/80 lg:col-span-3"
                      }`}
                    >
                      {featured && <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent" />}
                      <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${featured ? "bg-white/10 text-teal-300" : "bg-teal-50 text-teal-700"}`}>
                        <MaterialIcon name={dept.icon} className="text-[22px]" />
                      </div>
                      <h3 className={`relative mt-5 text-base font-bold ${featured ? "text-white" : "text-navy-950"}`}>{dept.title}</h3>
                      <p className={`relative mt-1.5 text-sm leading-relaxed ${featured ? "text-slate-300" : "text-slate-600"}`}>{dept.description}</p>
                    </TiltCard>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-24 sm:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="mb-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                  <TextReveal text="Current opportunities" />
                </h2>
                <p className="mt-3 text-sm text-slate-500">Nothing listed for what you do? Send us your CV anyway — we keep it on file.</p>
              </div>
            </Reveal>
            <Reveal effect="fade" delay={120}>
              <OpenPositions jobs={jobPostings} />
            </Reveal>
          </div>
        </section>

        {/* How we hire */}
        <section className="py-24 sm:py-28 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <h2 className="max-w-xl text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                <TextReveal text="Three steps, no waiting in the dark." />
              </h2>
            </Reveal>
            {/* The line draws across before the steps beneath it rise — same
                authored beat as the Philosophy beam on Who We Are, reused
                here because this is a real sequence: the line becoming whole
                is the process becoming clear. */}
            <Reveal className="relative mt-14">
              <div
                aria-hidden="true"
                className="beam-draw absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-teal-400 via-sky-500 to-blue-accent sm:block"
              />
              <Reveal effect="stagger" delay={260} className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
                {hiringSteps.map((step) => (
                  <div key={step.number} className="relative text-left">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-teal-50 font-mono text-sm font-bold text-teal-700">
                      {step.number}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-navy-950">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                ))}
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise">
              <div className="mb-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                  <TextReveal text="Before you apply" />
                </h2>
                <p className="mt-3 text-sm text-slate-500">A few things worth knowing before you send anything in.</p>
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
