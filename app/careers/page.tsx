import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { OpenPositions, type JobPosting } from "@/components/OpenPositions";
import { Reveal } from "@/components/Reveal";
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
    name: "Integrity",
    definition: "How we behave.",
    proof: "You're trusted to flag your own mistakes and help fix them — not manage optics.",
  },
  {
    name: "Professionalism",
    definition: "The standard we maintain.",
    proof:
      "Every piece of work you produce is held to the same bar we hold client deliverables to — no separate standard for internal work.",
  },
  {
    name: "Commitment",
    definition: "How we serve.",
    proof:
      "The same follow-through we promise clients applies to each other: no one is left to solve a hard problem alone.",
  },
  {
    name: "Innovation",
    definition: "How we solve problems and improve.",
    proof:
      "If a process is manual and repetitive, your job is to question it — we build systems, not workarounds.",
  },
];

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
    description: "Profile positioning, application management, and recruiter follow-up for IT job seekers.",
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
            <Image
              src={images["it-advisory"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["it-advisory"].blurDataURL}
              className="object-cover object-center opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                CAREERS AT UPTECH CONSULTING
              </span>
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Build your career on{" "}
              <span className="gradient-teal-blue-text">both sides of the bridge.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-4">
              We&apos;re a cross-border team working across IT, compliance, recruitment, and career
              services — in Buea and in Stafford, Texas.
            </p>
            <p className="text-sm text-slate-400">
              Looking for a job with one of our clients instead?{" "}
              <Link
                href="/services/career-marketing-placement"
                className="text-teal-400 underline hover:text-white font-semibold"
              >
                Career Marketing &amp; Placement
              </Link>{" "}
              is built for that.
            </p>
          </div>
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
                  The same values we hold clients to, we hold ourselves to.
                </h2>
              </div>
            </Reveal>
            <Reveal effect="stagger">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreValues.map((value) => (
                  <div
                    key={value.name}
                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-blue-accent" />
                    <h3 className="text-lg font-bold text-navy-950 mt-1 mb-1">{value.name}</h3>
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-3">
                      {value.definition}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{value.proof}</p>
                  </div>
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
                  Six departments, one practice.
                </h2>
              </div>
            </Reveal>
            <Reveal effect="stagger">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <div
                    key={dept.title}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                      <MaterialIcon name={dept.icon} className="text-[22px]" />
                    </div>
                    <h3 className="text-base font-bold text-navy-950 mb-1.5">{dept.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{dept.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                OPEN POSITIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Current opportunities
              </h2>
            </div>
            <OpenPositions jobs={jobPostings} />
          </div>
        </section>

        {/* How we hire */}
        <section className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                HOW WE HIRE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Three steps, no waiting in the dark.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {hiringSteps.map((step) => (
                <div key={step.number} className="text-center sm:text-left">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-mono font-bold text-sm mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-base font-bold text-navy-950 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3 justify-center">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Before you apply
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
