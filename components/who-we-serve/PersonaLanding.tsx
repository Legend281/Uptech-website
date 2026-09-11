import Image from "next/image";
import { Check } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { images } from "@/lib/images";
import { WaysWeHelp } from "./WaysWeHelp";
import type { PersonaContent } from "./types";

/*
 * Every consultation CTA on these pages goes to WhatsApp. The site's other
 * "Book a Consultation" buttons point at /contact, which does not exist yet
 * (verified 2026-09-11: no app/contact route, no API route) — a persona page
 * whose entire job is routing cannot end on a 404. Same placeholder number as
 * the homepage and Who We Are; swap all three together when the real one lands.
 */
const WHATSAPP = "https://wa.me/237670000000";

/**
 * The shared persona-landing template. Both Who We Serve pages render this
 * with their own content object; nothing audience-specific lives here.
 */
export function PersonaLanding({ content }: { content: PersonaContent }) {
  const heroImage = images[content.hero.image];
  const storyImage = images[content.story.image];

  return (
    <>
      <Header />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Who We Serve", href: "/who-we-serve" },
          { label: content.breadcrumbLabel },
        ]}
        tag={content.breadcrumbTag}
      />

      <main>
        {/* ---------------- Hero ---------------- */}
        {/* Shorter than the homepage hero on purpose: this page is a router,
            and the cards below are the real content. */}
        <section className="relative flex min-h-[480px] items-center overflow-hidden bg-navy-900 py-16 lg:min-h-[60vh] lg:py-20">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage.src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={heroImage.blurDataURL}
              className="object-cover object-[72%_center] opacity-70 lg:object-right lg:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="inline-block h-[2px] w-7 bg-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {content.hero.eyebrow}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.hero.headline[0]}
                <br />
                <span className="text-teal-400">{content.hero.headline[1]}</span>
                <br />
                <span className="text-sky-400">{content.hero.headline[2]}</span>
              </h1>

              <p className="mb-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {content.hero.lead}
              </p>

              {/* The scope disclosure sits in the hero, not in the FAQ, so
                  nobody selects a card on a false assumption. */}
              <p className="mb-8 max-w-xl border-l-2 border-teal-400/60 pl-4 text-sm leading-relaxed text-slate-300">
                {content.hero.note}
              </p>

              <ul className="flex flex-wrap gap-2.5">
                {content.hero.situations.map((situation) => (
                  <li
                    key={situation}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    {situation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- Three ways we help (the router) ---------------- */}
        <section id="ways-we-help" className="scroll-mt-24 border-b border-slate-200/80 bg-slate-100/70 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-600">
                  {content.ways.eyebrow}
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  {content.ways.heading}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">{content.ways.intro}</p>
            </div>

            <WaysWeHelp
              items={content.ways.items}
              multiNeedMessage={content.ways.multiNeedMessage}
              noDestinationMessage={content.ways.noDestinationMessage}
              ctaLabel={content.ctaLabel}
              ctaHref={WHATSAPP}
            />
          </div>
        </section>

        {/* ---------------- Story ---------------- */}
        <section className="bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal effect="rise" className="lg:col-span-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-600">
                  {content.story.eyebrow}
                </p>
                <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                  {content.story.heading}
                </h2>
                {content.story.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-navy-950">
                  {content.story.pointsHeading}
                </h3>
                <ul className="mb-8 space-y-3.5">
                  {content.story.points.map((point) => (
                    <li key={point} className="flex items-start gap-3.5 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-200/70 bg-teal-50">
                        <Check className="h-3.5 w-3.5 text-teal-600" strokeWidth={2.5} />
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* TODO(analytics): "consultation CTA clicked" (story section). Deferred site-wide. */}
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-uco-green px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-uco-green-hover active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {content.ctaLabel}
                </a>
              </Reveal>

              <Reveal effect="fade" className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={storyImage.src}
                    alt={storyImage.alt}
                    width={storyImage.width}
                    height={storyImage.height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={storyImage.blurDataURL}
                    className="h-[420px] w-full object-cover sm:h-[520px]"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="border-y border-slate-200/80 bg-slate-100/70 py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Before you get in touch.
            </h2>
            <FaqAccordion items={content.faq} />
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
          <div className="absolute inset-0 opacity-20 saturate-0">
            <Image src={images["ops-center"].src} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
              <div className="max-w-xl">
                <h2 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl">
                  {content.close.heading}
                </h2>
                <p className="text-base leading-relaxed text-slate-300">{content.close.body}</p>
              </div>

              {/* TODO(analytics): "consultation CTA clicked" (final band). Deferred site-wide. */}
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-shrink-0 items-center justify-center gap-2.5 rounded-lg bg-uco-green px-6 py-3.5 text-[15px] font-semibold leading-5 text-white shadow-lg shadow-green-950/40 transition-all hover:bg-uco-green-hover active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {content.ctaLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
