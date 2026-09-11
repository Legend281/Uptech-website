import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/Button";
import { images } from "@/lib/images";

const arrowRightIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const metadata: Metadata = {
  title: "Career Marketing & Placement",
  description:
    "A dedicated human specialist takes over your CV, your LinkedIn, your daily applications, and your recruiter follow-up — so you can focus on showing up to interview.",
};

const trustStripItems = [
  {
    icon: "group",
    title: "Dedicated Account Worker",
    badgeText: "Not an automated bot",
    badgeAccent: "teal" as const,
    description: "Real human hands submitting tailored, custom applications daily.",
  },
  {
    icon: "translate",
    title: "Bilingual Support",
    badgeText: "English & French",
    badgeAccent: "sky" as const,
    description: "Native bilingual positioning across US, Canadian, and African markets.",
  },
  {
    icon: "verified",
    title: "Ongoing Recruiter Follow-Up",
    badgeText: "Until Placement",
    badgeAccent: "emerald" as const,
    description: "Continuous outreach and pipeline cadence until you sign an offer.",
  },
];

const campaignStages = [
  {
    number: "01",
    eyebrow: "Stage 01 • Architecture",
    title: "Profile & CV Audit",
    icon: "rule",
    description:
      "In-depth architectural review of your professional achievements, metric recalibration, rigorous ATS reformatting, and cross-border market positioning.",
    tags: ["ATS-compliant Executive Resume", "Master Credential Matrix", "Job Title Mapping"],
  },
  {
    number: "02",
    eyebrow: "Stage 02 • Digital Visibility",
    title: "LinkedIn & Portal Setup",
    icon: "badge",
    description:
      "Complete LinkedIn profile revamp, algorithm-optimized headline and 'About' sections, keyword realignment, and setup across private tier-1 talent aggregators.",
    tags: ["Algorithm-optimized persona", "Recruiter Boolean search indexing"],
  },
  {
    number: "03",
    eyebrow: "Stage 03 • Daily Core Rhythm",
    title: "Daily Targeted Applications",
    icon: "send",
    description:
      "Active, hand-tailored submissions directly matching your target role specifications. Every application has customized cover letters and role-specific adjustments.",
    tags: ["Live submission log shared with you", "Role-matched customization"],
  },
  {
    number: "04",
    eyebrow: "Stage 04 • Strategic Drills",
    title: "Interview Preparation",
    icon: "co_present",
    description:
      "Direct briefing on hiring manager backgrounds, company operational models, mock behavioral and technical screening drills, and salary negotiation tactics.",
    tags: ["1-on-1 prep sessions before calls", "Company intelligence dossiers"],
  },
  {
    number: "05",
    eyebrow: "Stage 05 • Persistence",
    title: "Ongoing Recruiter Follow-Up",
    icon: "mark_email_read",
    description:
      "Persistent, respectful follow-up across email, LinkedIn, and direct channels until interviews are scheduled, feedback is collected, and offers are finalized.",
    tags: ["Structured recruiter cadence", "Compensation & offer package evaluation"],
  },
];

const personas = [
  {
    number: "PROFILE 01 • EARLY CAREER",
    icon: "school",
    accent: "teal",
    title: "Recent IT graduates with qualifications but no interview calls",
    friction:
      "Sending applications into corporate portals without response; ATS filters that favor years of tenure over demonstrated skill.",
    outcome:
      "Tailored technical portfolio framing and project indexing that forces hiring managers to evaluate competence over arbitrary years of experience.",
  },
  {
    number: "PROFILE 02 • MID-TO-SENIOR",
    icon: "work_history",
    accent: "blue",
    title: "Experienced professionals re-entering the job market",
    friction:
      "Career break gaps, an outdated resume, and no time to dedicate hours every evening while balancing family or existing commitments.",
    outcome:
      "Executive-level repositioning, gap-narrative coaching, and a structured submission schedule managed without taking away your free time.",
  },
  {
    number: "PROFILE 03 • INTERNATIONAL",
    icon: "public",
    accent: "emerald",
    title: "Diaspora professionals seeking placement while relocating or remote",
    friction:
      "Navigating unfamiliar foreign hiring nuances, time-zone disconnects, and geographic bias against non-local candidates.",
    outcome:
      "Bilateral guidance, localized applications, and continuous proactive recruiter follow-up across both American and African business hours.",
  },
];

const personaAccentClasses: Record<string, { iconBg: string; iconText: string; badgeBg: string; badgeText: string }> = {
  teal: { iconBg: "bg-teal-50", iconText: "text-teal-600", badgeBg: "bg-teal-50", badgeText: "text-teal-600" },
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-accent", badgeBg: "bg-blue-50", badgeText: "text-blue-accent" },
  emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
};

const faqItems = [
  {
    question: "What happens if I don't get placed right away?",
    answer:
      "Our active advocacy campaigns operate in continuous sprints. If an offer isn't finalized within the initial sprint, your account specialist recalibrates target criteria, adjusts keyword positioning, and continues daily outreach without interruption until you have signed an acceptable employment offer.",
  },
  {
    question: "How is this different from doing it myself or using automated AI apply tools?",
    answer:
      "AI spam tools can trigger employer spam filters, hurting your reputation across LinkedIn and company databases. Doing it alone requires many hours of repetitive manual work each week while you're exhausted from your current routine. UCO assigns a dedicated human worker who customizes every submission, completes employer screening questionnaires accurately, and personally follows up with hiring managers.",
  },
  {
    question: "Do you guarantee a job?",
    answer:
      "No ethical firm can guarantee a hiring decision made by an independent third-party company. What we do guarantee is disciplined, auditable pipeline volume: tailored applications submitted regularly, continuous recruiter follow-ups, and transparent progress updates. You show up prepared; we ensure you get the meetings.",
  },
  {
    question: "How long does the campaign typically take from audit to first interview?",
    answer:
      "Timelines vary by role, market, and seniority. Your account specialist will scope a realistic timeline with you at the start of your campaign rather than a one-size-fits-all number — [PENDING: confirm typical stage durations and time-to-first-screen benchmarks with UCO].",
  },
  {
    question: "Is my personal data and employment confidentiality protected?",
    answer:
      "Strictly. If you are currently employed, we utilize stealth application protocols: suppressing your current employer from search vectors, avoiding internal company openings, and utilizing designated intermediary routing for outbound recruiter inquiries.",
  },
];

const otherPillars = [
  {
    icon: "terminal",
    number: "Pillar 01",
    title: "IT Consulting & Outsourcing",
    href: "/services/it-consulting-outsourcing",
  },
  {
    icon: "description",
    number: "Pillar 02",
    title: "Business Formalisation & Compliance",
    href: "/services/business-formalisation-compliance",
  },
];

export default function CareerMarketingPlacementPage() {
  return (
    <>
      <Header activeService="career-marketing" ctaLabel="Start Campaign" ctaHref="#start-campaign" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Career Marketing & Placement" },
        ]}
        tag="INDIVIDUAL CAREER ADVANCEMENT"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-70 lg:opacity-80 pointer-events-none">
            <Image
              src={images["career-review"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["career-review"].blurDataURL}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40 pointer-events-none" />
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  CAREER MARKETING &amp; PLACEMENT
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                You don&apos;t chase jobs. <br className="hidden sm:inline" />
                <span className="gradient-teal-blue-text">We do.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                A dedicated human specialist takes over your CV, your LinkedIn, your daily
                applications, and your recruiter follow-up — so you can take your evenings back
                and focus solely on showing up to interview.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Button href="#start-campaign" icon={arrowRightIcon}>
                  Start Your Career Campaign
                </Button>
                <WhatsAppButton phone="237600000000" />
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Campaign Process */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    END-TO-END EXECUTION
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight mb-4">
                  One unbroken campaign. One dedicated advocate on your side.
                </h2>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                  We don&apos;t sell disconnected services. We dedicate a full-time worker to your
                  account whose job is to make sure you never miss a relevant posting, and follow
                  up with recruiters until you&apos;re placed.
                </p>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-navy-950">
                  <Image
                    src={images["dedicated-advisor"].src}
                    alt={images["dedicated-advisor"].alt}
                    width={images["dedicated-advisor"].width}
                    height={images["dedicated-advisor"].height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["dedicated-advisor"].blurDataURL}
                    className="w-full h-[360px] sm:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-navy-900/85 backdrop-blur-md text-teal-400 border border-teal-500/30">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      ACTIVE ADVOCACY CADENCE
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-navy-950/90 backdrop-blur-md border border-slate-700/80 text-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                        Human Placement Engine
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Non-Automated</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every cover letter, questionnaire response, and recruiter touchpoint tailored
                      manually by your account specialist.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 divide-y divide-slate-200/80">
                {campaignStages.map((stage) => (
                  <div
                    key={stage.number}
                    className="py-7 first:pt-0 group hover:bg-slate-50/70 p-5 -mx-4 rounded-xl transition-all border border-transparent hover:border-teal-500/20 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-950 border border-slate-800 text-teal-400 text-xs font-mono font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        {stage.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 font-bold">
                              {stage.eyebrow}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-navy-950 group-hover:text-blue-accent transition-colors">
                              {stage.title}
                            </h3>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <MaterialIcon name={stage.icon} className="text-[18px]" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{stage.description}</p>
                        <div className="mt-3.5 flex flex-wrap items-center gap-2">
                          {stage.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-navy-950 p-6 md:p-8 rounded-2xl text-white shadow-xl border border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-teal-400/30 flex items-center justify-center shrink-0 text-teal-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Relentless Execution Guarantee</h3>
                  <p className="text-sm text-slate-300 mt-0.5">
                    We do the tedious weekly job hunt grind so you don&apos;t burn out or lose career momentum.
                  </p>
                </div>
              </div>
              <Button href="#start-campaign" size="sm" className="shrink-0">
                Claim Your Account Worker
              </Button>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section className="py-24 bg-slate-100/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHO THIS IS FOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Built for ambitious professionals tired of shouting into the algorithmic void.
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Three candidate profiles where dedicated institutional advocacy shifts the hiring odds in your favor.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {personas.map((persona) => {
                const accent = personaAccentClasses[persona.accent];
                return (
                  <div
                    key={persona.number}
                    className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-md card-hover-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl border border-slate-200/70 flex items-center justify-center ${accent.iconBg} ${accent.iconText}`}>
                          <MaterialIcon name={persona.icon} className="text-[20px]" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded ${accent.badgeBg} ${accent.badgeText}`}>
                          {persona.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-950 leading-snug mb-3">{persona.title}</h3>
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-mono font-bold text-rose-600 uppercase">The Friction</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{persona.friction}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-7 -mb-7 p-5 rounded-b-2xl">
                      <span className="font-bold text-navy-950 uppercase text-[10px] tracking-wider block mb-1 font-mono">
                        Expected Outcome
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{persona.outcome}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Real Results — placeholder-safe until UCO supplies a real client story */}
        <section className="py-24 bg-navy-950 text-white relative overflow-hidden border-b border-slate-800/80">
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-60 lg:opacity-75 pointer-events-none">
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
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">REAL RESULTS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
                A verified placement story is coming soon.
              </h2>
              <div className="rounded-2xl border border-dashed border-slate-500/60 bg-white/[0.03] p-8">
                <p className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-3">
                  [PENDING: real client testimonial &amp; placement outcome]
                </p>
                <p className="text-base text-slate-300 leading-relaxed">
                  This section is reserved for a verified candidate story — their name, role, and
                  the outcome of their campaign — once UCO confirms one for publication. We do not
                  publish invented quotes or placement figures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENT QUESTIONS</span>
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Clarity on scope before we begin.
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Explore other pillars */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">EXPLORE OTHER SERVICES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                  Comprehensive capability across advisory and execution.
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              {otherPillars.map((pillar) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-navy-950 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <MaterialIcon name={pillar.icon} className="text-[18px]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {pillar.number}
                    </span>
                    <h3 className="text-sm font-bold text-navy-950 group-hover:text-blue-accent transition-colors mt-1">
                      {pillar.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-accent group-hover:text-teal-600">
                    <span>View details</span>
                    <MaterialIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          id="start-campaign"
          className="py-24 bg-navy-950 text-white relative overflow-hidden border-b border-slate-800/80"
        >
          <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full opacity-60 lg:opacity-75 pointer-events-none">
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
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">LAUNCH YOUR STRATEGY</span>
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight mb-4">
              Ready to stop job hunting alone? <br />
              <span className="gradient-teal-blue-text">One conversation will tell us.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Book a strategic consultation with a senior placement specialist to review your
              background and scope your active campaign.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?service=career-marketing" icon={arrowRightIcon}>
                Start Your Career Campaign
              </Button>
              <WhatsAppButton phone="237600000000" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
