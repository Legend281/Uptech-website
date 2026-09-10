"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * How the element behaves when it arrives.
 *
 * - `marker`  — sets `data-revealed` and nothing else. For blocks that drive a
 *               descendant animation themselves (the Buea–Stafford rail, the
 *               philosophy beam, the Who We Are spine).
 * - `rise`    — lifts and fades in.
 * - `fade`    — fades only. For anything already carrying its own motion.
 * - `stagger` — the container stays put and its direct children arrive in
 *               sequence. Use on grids and lists.
 */
export type RevealEffect = "marker" | "rise" | "fade" | "stagger";

/*
 * One IntersectionObserver for the whole page rather than one per element.
 * These pages carry roughly two dozen revealed blocks; a separate observer for
 * each is real main-thread cost on the low-end mobile hardware CLAUDE.md
 * Section 6.9 treats as a hard constraint.
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
