"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * How the element behaves when it arrives.
 *
 * - `marker`  — sets `data-revealed` and nothing else. For blocks that drive a
 *               descendant animation themselves (the Buea–Stafford rail, the
 *               philosophy beam, the Who We Are spine).
 * - `rise`    — lifts and fades in, powered by framer-motion (spring physics).
 * - `fade`    — fades only, powered by framer-motion. For anything already
 *               carrying its own motion.
 * - `stagger` — the container stays put and its direct children arrive in
 *               sequence. Use on grids and lists.
 */
export type RevealEffect = "marker" | "rise" | "fade" | "stagger";

/*
 * `marker` and `stagger` keep the original hand-rolled engine: one shared
 * IntersectionObserver for the whole page rather than one per element. These
 * pages carry roughly two dozen revealed blocks; a separate observer for
 * each is real main-thread cost on the low-end mobile hardware CLAUDE.md
 * Section 6.9 treats as a hard constraint. `rise` and `fade` — the two
 * effects used for plain content blocks rather than custom illustrations —
 * moved to framer-motion's own `whileInView` (below) for genuinely richer,
 * spring-based motion; `marker` (the rail/beam/spine illustrations) and
 * `stagger` (grids/lists, CSS transition-delay per child) stay on this
 * engine since they're tested, working, and depended on by CSS elsewhere
 * (app/globals.css) that isn't safe to touch here.
 *
 * Targets are unobserved as soon as they fire, so nothing re-animates on the
 * way back up and the map drains as the reader scrolls.
 */
const callbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observe(node: Element, onEnter: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = callbacks.get(entry.target);
          if (!callback) continue;
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
          callback();
        }
      },
      // Fires a little before the block is fully in view, so the motion has
      // finished by the time the reader's eye reaches it.
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" },
    );
  }
  callbacks.set(node, onEnter);
  sharedObserver.observe(node);
}

function unobserve(node: Element) {
  callbacks.delete(node);
  sharedObserver?.unobserve(node);
}

const riseVariants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0 },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

export function Reveal({
  children,
  className = "",
  effect = "marker",
  delay,
}: {
  children: ReactNode;
  className?: string;
  effect?: RevealEffect;
  /** Milliseconds to hold before this block starts. */
  delay?: number;
}) {
  if (effect === "rise" || effect === "fade") {
    return (
      <MotionRevealBlock effect={effect} className={className} delay={delay}>
        {children}
      </MotionRevealBlock>
    );
  }

  return (
    <LegacyRevealBlock effect={effect} className={className} delay={delay}>
      {children}
    </LegacyRevealBlock>
  );
}

function MotionRevealBlock({
  children,
  className,
  effect,
  delay,
}: {
  children: ReactNode;
  className: string;
  effect: "rise" | "fade";
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const variants = effect === "rise" ? riseVariants : fadeVariants;

  return (
    <motion.div
      // framer-motion renders its "hidden" state as an inline style even
      // during SSR, so a reader with no JavaScript would otherwise never
      // see this content at all — this site's own stated principle is that
      // a page needing JS to become visible is a broken page. Keeping the
      // same `data-reveal` marker the legacy engine used lets the existing
      // `@media (scripting: none) { [data-reveal] { opacity: 1 !important }
      // }` rule in app/globals.css catch this too: a stylesheet `!important`
      // rule overrides a plain (non-!important) inline style regardless of
      // specificity, so it correctly wins only in genuinely scriptless
      // environments and never fights the real animation in JS browsers.
      data-reveal={effect}
      className={className}
      initial={reducedMotion ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -10% 0px" }}
      variants={variants}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.9,
        delay: reducedMotion ? 0 : (delay ?? 0) / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

function LegacyRevealBlock({
  children,
  className,
  effect,
  delay,
}: {
  children: ReactNode;
  className: string;
  effect: RevealEffect;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver: show the settled state rather than nothing.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    observe(node, () => setRevealed(true));
    return () => unobserve(node);
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={effect}
      data-revealed={revealed}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
