"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Sitewide buttery/inertia smooth scroll. Mounted once near the root of
 * <body> — renders nothing, just drives the scroll feel every page inherits.
 *
 * Skipped entirely for prefers-reduced-motion: reduce, so native (instant)
 * scrolling is what a reduced-motion reader gets — no inertia to override.
 *
 * The `<html>` element's old `scroll-smooth` Tailwind class was removed in
 * favor of this: Lenis explicitly recommends dropping CSS `scroll-behavior:
 * smooth` when it's active, since the two smoothing systems fight each
 * other (CSS trying to animate the same scroll position Lenis is already
 * animating via rAF).
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
