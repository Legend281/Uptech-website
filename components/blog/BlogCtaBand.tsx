import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { images } from "@/lib/images";

const WHATSAPP = "237678597593";

const arrowRightIcon = <ArrowRight className="h-4 w-4" strokeWidth={2} />;

/** Same navy/photo/ambient-glow final-CTA recipe used on the Homepage and Career Marketing page — a blog post is a dead end without one. */
export function BlogCtaBand() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-navy-950 py-24 text-white">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-60 lg:w-3/4 lg:opacity-75">
        <Image
          src={images["team-lounge"].src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={images["team-lounge"].blurDataURL}
          className="object-cover object-center"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50" />
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <div className="float-a absolute -left-16 top-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="float-b absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>
      <Reveal effect="rise" className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="inline-block h-[2px] w-7 bg-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Have a question about this?</span>
          <span className="inline-block h-[2px] w-7 bg-teal-400" />
        </div>
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          <TextReveal text="Talk to a real person about it." />
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Every topic we write about is something our team handles for real clients every week. If something here applies to you, the
          fastest way to get a straight answer is to ask us directly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact" icon={arrowRightIcon}>
            Get in Touch
          </Button>
          <WhatsAppButton phone={WHATSAPP} />
        </div>
      </Reveal>
    </section>
  );
}
