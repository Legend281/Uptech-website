import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContactForm } from "@/components/ContactForm";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { HeroIntro } from "@/components/contact/HeroIntro";
import { ScrollCue } from "@/components/home/ScrollCue";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { TiltCard } from "@/components/TiltCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Tell us what you need. A specialist reviews your request and responds directly by email.",
};

const trustStripItems = [
  {
    icon: "translate",
    title: "Bilingual Support",
    badgeText: "English & French",
    badgeAccent: "teal" as const,
    description: "Every inquiry handled in the language you're most comfortable in.",
  },
  {
    // Was "Direct WhatsApp Access" — no longer true on this page specifically:
    // the form's WhatsApp option was removed (email-only now) and this page
    // has no floating WhatsApp button either (unlike the service pages).
    // Reusing the hero's own "no ticket queue, no automated replies" wording
    // rather than inventing a new claim.
    icon: "mail",
    title: "Direct Email Intake",
    badgeText: "Real Person, Not a Bot",
    badgeAccent: "sky" as const,
    description: "Message goes straight to a specialist — no ticket queue, no automated replies.",
  },
  {
    icon: "public",
    title: "Cross-Border Desk",
    badgeText: "Buea & Stafford, Texas",
    badgeAccent: "emerald" as const,
    description: "One team, structured to operate across Cameroon and the United States.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Send your request",
    description: "Fill in the form and continue the conversation by email.",
  },
  {
    number: "02",
    title: "A specialist reviews it",
    description: "Your message is matched to the right desk for the service you selected.",
  },
  {
    number: "03",
    title: "You hear back directly",
    description: "A real person responds through the channel you reached out on.",
  },
];

// Same three facts as the FAQ below, condensed and surfaced next to the
// form itself — nothing claimed here that isn't already stated there.
const sidebarNotes = [
  {
    icon: "schedule",
    title: "Fast response",
    description: "Within 1 business day, usually sooner — no ticket queue on our end.",
  },
  {
    icon: "lock",
    title: "Confidential by design",
    description: "Nothing is submitted to a server. This just prepares an email for you to send yourself.",
  },
  {
    icon: "help",
    title: "Not sure what to select?",
    description: "Choose \"Something else\" and briefly describe your situation — we'll point you to the right service.",
  },
];

const faqItems = [
  {
    question: "Is this a paid consultation?",
    answer:
      "Reaching out and having an initial conversation about your needs is free. If your request requires paid work, your specialist will always confirm scope and cost with you before anything is billed.",
  },
  {
    // Reasonable estimate consistent with the site's existing "no ticket
    // queue, real person" positioning — not a figure Uptech Consulting has
    // separately confirmed. Flag for a real commitment once the team has
    // one.
    question: "How soon will I hear back?",
    answer:
      "Within 1 business day, usually sooner — there's no ticket queue on our end, so your message goes straight to the right specialist.",
  },
  {
    question: "I'm not sure which service I need — can I still reach out?",
    answer:
      "Yes. Select \"Business Formalisation & Compliance (not sure which)\" or \"Something else\" in the form, and briefly describe your situation — your specialist will point you to the right service.",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Yes. This form does not submit your details to any server — it prepares an email for you to send yourself, so only Uptech Consulting receives it, exactly as you'd expect from emailing us directly.",
  },
  {
    question: "I'm looking for a job, not a business consultation — is this the right page?",
    answer:
      "You can still reach out here, but Career Marketing & Placement has its own dedicated intake built for job seekers. Visit that page and use \"Start Your Career Campaign\" for a faster start.",
  },
];

/*
 * The 5 real, live services listed individually — not bundled as 2 broad
 * "pillars" (the previous structure here). Same flattening applied to the
 * primary nav, footer, homepage and /services directory — see the comment
 * on the `services` array in components/Header.tsx. IT Consulting &
 * Outsourcing stays excluded — paused by leadership decision, soft-hidden
 * sitewide. The page and its code still exist; only this cross-link is gone.
 */
const otherServices = [
  { icon: "gavel", title: "Business Formalisation — Cameroon", href: "/services/business-formalisation-compliance/cameroon" },
  { icon: "public", title: "Business Formalisation — United States", href: "/services/business-formalisation-compliance/united-states" },
  { icon: "receipt_long", title: "Tax Compliance — Cameroon", href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon" },
  { icon: "diversity_3", title: "CNPS Compliance — Cameroon", href: "/services/business-formalisation-compliance/cnps-compliance-cameroon" },
  { icon: "trending_up", title: "Career Marketing & Placement", href: "/services/career-marketing-placement" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Book a Consultation" }]} />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            {/* Grounded gradient over a rotating background (management
                request: hero backgrounds cycle automatically) — full-color,
                unblended images, darkest at the bottom where the CTA
                buttons/trust strip sit, still clearly visible as photos. */}
            <HeroImageCarousel
              keys={["dedicated-advisor", "career-review"]}
              imageClassName="hero-ken-burns object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/55 to-navy-950/55" />
          </div>

          {/* Ambient depth — same slow-drifting glows as every other hero
              on the site, replacing the single static blur circle this
              section had before. */}
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

        {/* What happens next */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                WHAT HAPPENS NEXT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                <TextReveal text="Three steps, no waiting in the dark." />
              </h2>
            </Reveal>
            <Reveal effect="stagger" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {nextSteps.map((step) => (
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

        {/* Form */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                Get in touch
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Fields marked <span className="text-rose-500">*</span> are required.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <Reveal effect="fade" className="lg:col-span-7">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </Reveal>

              {/* Photo + the same facts already stated in the FAQ below,
                  surfaced here next to the form itself rather than making a
                  reader scroll down to find them — nothing new claimed. */}
              <Reveal effect="stagger" delay={120} className="lg:col-span-5 flex flex-col gap-4">
                <TiltCard max={4} className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
                  <Image
                    src={images["compliance-advisory"].src}
                    alt={images["compliance-advisory"].alt}
                    width={images["compliance-advisory"].width}
                    height={images["compliance-advisory"].height}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    placeholder="blur"
                    blurDataURL={images["compliance-advisory"].blurDataURL}
                    className="h-56 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="text-sm font-bold leading-snug">A specialist reviews it.</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Your message is matched to the right desk for the service you selected.
                    </p>
                  </div>
                </TiltCard>
                {sidebarNotes.map((note) => (
                  <TiltCard
                    key={note.title}
                    max={3}
                    className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <MaterialIcon name={note.icon} className="text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-950 mb-1">{note.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{note.description}</p>
                    </div>
                  </TiltCard>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3 justify-center">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                <TextReveal text="Before you reach out" />
              </h2>
            </Reveal>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Cross-link grid */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                <TextReveal text="Want to explore first?" />
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Browse what each service actually includes before reaching out.
              </p>
            </Reveal>
            <Reveal effect="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {otherServices.map((service) => (
                <TiltCard key={service.href} max={4}>
                  <Link
                    href={service.href}
                    className="flex items-center gap-3 bg-white rounded-xl p-5 border border-slate-200/80 hover:border-teal-500/40 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <MaterialIcon name={service.icon} className="text-[20px]" />
                    </div>
                    <span className="text-sm font-bold text-navy-950 group-hover:text-teal-600 transition-colors">
                      {service.title}
                    </span>
                  </Link>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
