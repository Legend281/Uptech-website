"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/**
 * Counts smoothly between values instead of snapping — most useful the first
 * time real data (from LeadsProvider's post-mount localStorage read) replaces
 * the server-rendered mock count, so that swap reads as a live update rather
 * than a flash of wrong numbers.
 */
export function AnimatedNumber({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString("en-US"));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, motionValue, prefersReducedMotion]);

  return <motion.span>{rounded}</motion.span>;
}
