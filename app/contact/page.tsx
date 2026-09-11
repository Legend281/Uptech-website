import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContactForm } from "@/components/ContactForm";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Tell us what you need. A specialist reviews your request and responds directly by WhatsApp or email.",
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
    icon: "chat",
    title: "Direct WhatsApp Access",
    badgeText: "Real Person, Not a Bot",
    badgeAccent: "sky" as const,
    description: "Message our desk directly — no ticket queue, no automated replies.",
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
    description: "Fill in the form and continue on WhatsApp or email — whichever you prefer.",
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

const faqItems = [
  {
    question: "Is this a paid consultation?",
    answer:
      "Reaching out and having an initial conversation about your needs is free. If your request requires paid work, your specialist will always confirm scope and cost with you before anything is billed.",
  },
  {
    question: "How soon will I hear back?",
    answer:
      "[PENDING: confirm a response-time commitment with Uptech Consulting]. Once confirmed, this will state a real, honest turnaround rather than an estimate.",
  },
  {
    question: "I'm not sure which service I need — can I still reach out?",
    answer:
      "Yes. Select \"Business Formalisation & Compliance (not sure which)\" or \"Something else\" in the form, and briefly describe your situation — your specialist will point you to the right service.",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Yes. This form does not submit your details to any server — it prepares a WhatsApp message or email for you to send yourself, so only Uptech Consulting receives it, exactly as you'd expect from messaging us directly.",
  },
  {
    question: "I'm looking for a job, not a business consultation — is this the right page?",
    answer:
      "You can still reach out here, but Career Marketing & Placement has its own dedicated intake built for job seekers. Visit that page and use \"Start Your Career Campaign\" for a faster start.",
  },
];

const otherPillars = [
  { icon: "terminal", title: "IT Consulting & Outsourcing", href: "/services/it-consulting-outsourcing" },
  { icon: "gavel", title: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
  { icon: "trending_up", title: "Career Marketing & Placement", href: "/services/career-marketing-placement" },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Book a Consultation" }]} />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["dedicated-advisor"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["dedicated-advisor"].blurDataURL}
              className="object-cover object-[75%_center] opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                BOOK A CONSULTATION
              </span>
              <span className="w-7 h-[2px] bg-teal-400 inline-block" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Tell us what you need. <br className="hidden sm:inline" />
              <span className="gradient-teal-blue-text">A specialist responds directly.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              No ticket queue, no automated replies. Fill in a few details and continue the
              conversation on WhatsApp or email — whichever you prefer.
            </p>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* What happens next */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                WHAT HAPPENS NEXT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
                Three steps, no waiting in the dark.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {nextSteps.map((step) => (
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

        {/* Form */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                Get in touch
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Fields marked <span className="text-rose-500">*</span> are required.
              </p>
            </div>
            <ContactForm initialService={service} />
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
                Before you reach out
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Cross-link grid */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Want to explore first?
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Browse what each pillar actually includes before reaching out.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherPillars.map((pillar) => (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="flex items-center gap-3 bg-white rounded-xl p-5 border border-slate-200/80 hover:border-teal-500/40 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <MaterialIcon name={pillar.icon} className="text-[20px]" />
                  </div>
                  <span className="text-sm font-bold text-navy-950 group-hover:text-teal-600 transition-colors">
                    {pillar.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
