"use client";

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
 * Contact hero's text, entrance-animated on mount — same stagger rhythm as
 * the homepage, Who We Are and Careers heroes, so all four read as one site.
 */
export function HeroIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      initial={reducedMotion ? "shown" : "hidden"}
      animate="shown"
      variants={container}
    >
      <motion.div variants={item} className="inline-flex items-center gap-2 mb-6 justify-center">
        <span className="w-7 h-[2px] bg-teal-400 inline-block" />
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          BOOK A CONSULTATION
        </span>
        <span className="w-7 h-[2px] bg-teal-400 inline-block" />
      </motion.div>
      <motion.h1
        variants={item}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6"
      >
        Tell us what you need. <br className="hidden sm:inline" />
        <span className="shimmer-text text-teal-400">A specialist responds directly.</span>
      </motion.h1>
      <motion.p variants={item} className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
        No ticket queue, no automated replies. Fill in a few details and continue the
        conversation by email.
      </motion.p>
    </motion.div>
  );
}
