"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
  },
};

/**
 * The homepage hero's text content, entrance-animated on mount (stagger:
 * eyebrow → headline → subhead → buttons). Split out from app/page.tsx
 * (a server component) since this needs "use client" for framer-motion.
 */
export function HeroIntro({ whatsapp }: { whatsapp: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mx-auto max-w-2xl text-center lg:max-w-3xl"
      initial={reducedMotion ? "shown" : "hidden"}
      animate="shown"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 inline-flex items-center justify-center gap-2">
        <span className="inline-block h-[2px] w-7 bg-teal-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Uptech Consulting &amp; Outsourcing
        </span>
        <span className="inline-block h-[2px] w-7 bg-teal-400" />
      </motion.div>

      <motion.h1
        variants={item}
        className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
        We close the distance between
        <br />
        <span className="text-teal-400">strategy and</span>
        <br />
        <span className="text-sky-400">execution.</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
      >
        Technology-driven consulting, outsourcing and business support for
        individuals and organisations operating across Cameroon and the
        United States.
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/contact"
          className="gradient-teal-blue flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <span>Book a Consultation</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-navy-950/80 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500 active:scale-[0.98]"
        >
          <WhatsAppIcon className="h-4 w-4 text-teal-400" />
          <span>Chat on WhatsApp</span>
        </a>
      </motion.div>
    </motion.div>
  );
}
