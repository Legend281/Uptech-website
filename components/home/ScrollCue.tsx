"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * A small "there's more below" cue at the foot of the hero. Fades in after
 * the hero's own entrance has settled, then bobs gently in place — never
 * hidden outright for reduced-motion, just held still, since it is
 * genuinely informative (this page is long) rather than decoration.
 */
export function ScrollCue() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center sm:bottom-6"
      aria-hidden="true"
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
      >
        <ChevronDown className="h-4 w-4 text-slate-300" strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
}
