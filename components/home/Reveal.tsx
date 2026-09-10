"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sets `data-revealed="true"` on its wrapper the first time it scrolls into
 * view, and then disconnects. Used for the one orchestrated moment on the page
 * (the Buea–Stafford rail) — deliberately not applied section-by-section, which
 * is the scroll-reveal pattern that makes pages feel templated.
 */
export function Reveal({
  children,
  className = "",
  threshold = 0.35,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or reduced motion) — show the settled state.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} data-revealed={revealed} className={className}>
      {children}
    </div>
  );
}
