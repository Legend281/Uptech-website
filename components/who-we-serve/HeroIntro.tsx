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
 * Who We Serve persona hero text, entrance-animated on mount — same stagger
 * rhythm as every other hero on the site. Content is per-persona (see
 * lib/who-we-serve/*.ts), unlike the other HeroIntro components, so it's
 * passed in rather than hardcoded.
 */
export function HeroIntro({
  eyebrow,
  headline,
  lead,
  note,
  situations,
}: {
  eyebrow: string;
  headline: readonly [string, string, string];
  lead: string;
  note: string;
  situations: readonly string[];
}) {
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
          {eyebrow}
        </span>
        <span className="inline-block h-[2px] w-7 bg-teal-400" />
      </motion.div>

      <motion.h1 variants={item} className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {headline[0]}
        <br />
        <span className="shimmer-text text-teal-400">{headline[1]}</span>
        <br />
        <span className="shimmer-text text-sky-400">{headline[2]}</span>
      </motion.h1>

      <motion.p variants={item} className="mx-auto mb-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
        {lead}
      </motion.p>

      <motion.p variants={item} className="mx-auto mb-8 max-w-xl border-t border-teal-400/60 pt-4 text-sm leading-relaxed text-slate-300">
        {note}
      </motion.p>

      <motion.ul variants={item} className="flex flex-wrap justify-center gap-2.5">
        {situations.map((situation) => (
          <li
            key={situation}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {situation}
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
