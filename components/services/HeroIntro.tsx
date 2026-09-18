"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

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
 * Shared hero-text shape for the Business Formalisation & Compliance family
 * (eyebrow, one-line headline with a single highlighted clause, lead
 * paragraph, two CTA buttons) — same stagger rhythm as every other hero on
 * the site. `headlineLead` and `headlineHighlight` render on one flowing
 * line rather than the site's usual 3-line stack: this page's actual
 * headline is a single sentence, not three short phrases.
 */
export function HeroIntro({
  eyebrow,
  headlineLead,
  headlineHighlight,
  lead,
  buttons,
}: {
  eyebrow: string;
  headlineLead: string;
  headlineHighlight: string;
  lead: string;
  buttons: ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mx-auto max-w-2xl text-center lg:max-w-3xl"
      initial={reducedMotion ? "shown" : "hidden"}
      animate="shown"
      variants={container}
    >
      <motion.div variants={item} className="inline-flex items-center justify-center gap-2 mb-6">
        <span className="w-7 h-[2px] bg-teal-400 inline-block" />
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          {eyebrow}
        </span>
        <span className="w-7 h-[2px] bg-teal-400 inline-block" />
      </motion.div>

      <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
        {headlineLead}{" "}
        <span className="shimmer-text text-teal-400">{headlineHighlight}</span>
      </motion.h1>

      <motion.p variants={item} className="mx-auto text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
        {lead}
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
        {buttons}
      </motion.div>
    </motion.div>
  );
}
