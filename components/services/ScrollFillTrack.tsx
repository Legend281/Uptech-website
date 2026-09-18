"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Wraps a vertical step list with a connecting line that fills as the
 * reader scrolls through it, instead of sitting there as a static gradient
 * — the line's progress reads as "how far through the process this is,"
 * which a static line can't communicate. The faint full-height track stays
 * visible underneath so the unfilled portion of the path is never invisible.
 */
export function ScrollFillTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.4"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-6 md:left-10 top-6 bottom-8 w-0.5 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="w-full bg-gradient-to-b from-teal-400 via-blue-accent to-teal-500"
          style={{ height: reducedMotion ? "100%" : fillHeight }}
        />
      </div>
      {children}
    </div>
  );
}
