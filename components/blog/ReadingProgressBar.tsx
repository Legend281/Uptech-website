"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** A thin fixed bar under the header that fills as the reader scrolls — the one purposeful motion device specific to long-form reading, not used anywhere else on the site because nowhere else is Read mode. */
export function ReadingProgressBar() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 });

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-[3px] bg-transparent">
      <motion.div className="h-full origin-left gradient-teal-blue" style={{ scaleX }} />
    </div>
  );
}
