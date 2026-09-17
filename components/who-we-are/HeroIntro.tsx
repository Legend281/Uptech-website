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
 * Who We Are's hero text, entrance-animated on mount — same stagger rhythm
 * as the homepage hero (components/home/HeroIntro.tsx) so the two pages
 * read as one site rather than each having its own motion language.
 */
export function HeroIntro() {
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
          Who We Are
        </span>
        <span className="inline-block h-[2px] w-7 bg-teal-400" />
      </motion.div>

      <motion.h1
        variants={item}
        className="mb-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[68px] xl:leading-[1.08]"
      >
        Where strategy meets
        <br />
        <span className="shimmer-text text-teal-400">accountable</span>
        <br />
        <span className="shimmer-text text-sky-400">execution.</span>
      </motion.h1>

      <motion.p variants={item} className="mx-auto mb-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
        Many people know what they want to achieve. Very few know how.
        Uptech Consulting is built around the how — the part that turns
        a plan into a filed document, a placed candidate, or a system
        that still runs after we leave.
      </motion.p>
      <motion.p variants={item} className="text-sm text-slate-400">
        We do not only give advice. This page explains the machinery
        behind putting it into action.
      </motion.p>
    </motion.div>
  );
}
