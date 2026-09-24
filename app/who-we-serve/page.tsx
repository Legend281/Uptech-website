import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, User } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { TiltCard } from "@/components/TiltCard";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Who We Serve",
  description:
    "Uptech Consulting works with individuals building their careers or personal ventures, and with businesses and institutions that need technology run and compliance kept — in Cameroon and the United States.",
};

const audiences = [
  {
    href: "/who-we-serve/individuals",
    icon: User,
    label: "For Individuals",
    // Was "IT professionals looking for the next role" — stale since Career
    // Marketing & Placement was broadened beyond IT/tech roles (see
    // lib/who-we-serve/individuals.ts's own hero note, already updated).
    body: "Looking for the next role, income to declare in Cameroon, or a business of your own to register.",
    dot: "bg-teal-400",
  },
  {
    href: "/who-we-serve/businesses",
    icon: Building2,
    label: "For Businesses & Institutions",
    body: "Technology that needs running, a company to register or keep compliant, or a function you'd rather not staff in-house.",
    dot: "bg-blue-400",
  },
];

export default function WhoWeServePage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Who We Serve" }]} />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            <HeroImageCarousel
              keys={["dedicated-advisor", "cross-border-boardroom"]}
              imageClassName="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/65 to-navy-950/50" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal effect="rise" className="mx-auto max-w-2xl text-center lg:max-w-3xl">
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  WHO WE SERVE
                </span>
                <span className="w-7 h-[2px] bg-teal-400 inline-block" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                <TextReveal text="Which of these is you?" />
              </h1>
              <p className="mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
                Two audiences, two different sets of questions. Pick the one that
                fits and the next page is built around your situation.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-slate-100/70 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal effect="stagger" className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <TiltCard key={audience.href} max={5}>
                  <Link
                    href={audience.href}
                    className="card-hover-shadow group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-8 transition-colors hover:border-slate-300"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-teal-400 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <span className={`h-2 w-2 rounded-full ${audience.dot}`} />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-navy-950 transition-colors group-hover:text-blue-accent">
                      {audience.label}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {audience.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-accent">
                      Continue
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </Link>
                </TiltCard>
              );
            })}
          </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["career-review"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["career-review"].blurDataURL}
              className="object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/55 to-navy-950/55" />
          </div>
          <Reveal effect="rise" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight mb-4">
              Not sure which one <span className="gradient-teal-blue-text">fits?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
              Reach out directly and a specialist will point you in the right direction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact">Book a Consultation</Button>
              <WhatsAppButton phone="237678597593" />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
