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
 * Careers hero's text, entrance-animated on mount — same stagger rhythm as
 * the homepage and Who We Are heroes, so all three read as one site.
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
          CAREERS AT UPTECH CONSULTING
        </span>
        <span className="w-7 h-[2px] bg-teal-400 inline-block" />
      </motion.div>
      <motion.h1
        variants={item}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6"
      >
        Get a job{" "}
        <span className="shimmer-text text-teal-400">at Uptech.</span>
      </motion.h1>
      <motion.p variants={item} className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
        We&apos;re a cross-border team working across IT, compliance, recruitment, and career
        services — in Buea, Cameroon and in Stafford, Texas.
      </motion.p>
    </motion.div>
  );
}
