"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type PromiseStatement = {
  /** Plain opening of the statement. */
  lead: string;
  /** The half that carries the gradient — the part worth remembering. */
  emphasis: string;
  support: string;
  ctaLabel: string;
  ctaHref: string;
};

const INTERVAL_MS = 7000;
/** Horizontal travel before a drag counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD_PX = 45;

/**
 * One stage, several statements. Every line here is drawn from copy already
 * approved elsewhere on the site or from Uptech Consulting's own materials —
 * nothing is invented to fill a slide (CLAUDE.md Section 6.4).
 *
 * Reachable four ways, so no input method is left out: swipe or drag, the
 * arrow buttons, the dots, and the left/right keyboard arrows. Auto-advance
 * stops while a pointer is over the block or keyboard focus is inside it, and
 * never starts at all for anyone who has asked the OS to reduce motion.
 */
export function RotatingPromise({ items }: { items: PromiseStatement[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const count = items.length;

  const go = useCallback(
    (next: number) => setActive(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % count),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count]);

  // Keyboard focus anywhere inside the block counts as "someone is reading".
  const onFocus = useCallback(() => setPaused(true), []);
  const onBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!regionRef.current?.contains(event.relatedTarget as Node | null)) {
      setPaused(false);
    }
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    dragStart.current = { x: event.clientX, y: event.clientY };
  }, []);

  /* Once a drag is clearly horizontal, stop the browser turning it into a text
     selection — dragging a mouse across the statement otherwise highlights it.
     Small movements are left alone so click-to-select still works normally. */
  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const start = dragStart.current;
    if (!start || dragging) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      setDragging(true);
      window.getSelection()?.removeAllRanges();
    }
  }, [dragging]);

  const onPointerEnd = useCallback(
    (event: React.PointerEvent) => {
      const start = dragStart.current;
      dragStart.current = null;
      setDragging(false);
      if (!start) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      // Only claim the gesture when it is clearly horizontal, so a vertical
      // flick still scrolls the page instead of flipping the statement.
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return;
      go(active + (dx < 0 ? 1 : -1));
    },
    [active, go],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(active + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(active - 1);
      }
    },
    [active, go],
  );

  const arrowClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-navy-900/70 text-slate-300 transition-colors hover:border-slate-500 hover:text-white";

  return (
    <div
      ref={regionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={() => {
        dragStart.current = null;
        setDragging(false);
      }}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="What working with Uptech Consulting means"
      /* pan-y keeps vertical scrolling native while horizontal drags reach the
         handlers above; without it the browser swallows the swipe. */
      className={`touch-pan-y ${dragging ? "select-none" : ""}`}
    >
      {/* All statements share one grid cell, so the block is always as tall as
          the longest one and nothing below it jumps when the copy changes. */}
      <div className="grid">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <div
              key={item.lead}
              className={`col-start-1 row-start-1 transition-opacity duration-500 ease-out ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              inert={!isActive}
              aria-hidden={!isActive}
            >
              <blockquote className="text-2xl font-extrabold leading-[1.3] tracking-tight text-white sm:text-3xl lg:text-4xl">
                {item.lead}{" "}
                <span className="gradient-teal-blue-text">{item.emphasis}</span>
              </blockquote>
              <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-slate-400">
                {item.support}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={item.ctaHref}
                  tabIndex={isActive ? undefined : -1}
                  /* A drag that ends on the button must not also follow it. */
                  draggable={false}
                  onClick={(event) => {
                    if (dragStart.current) event.preventDefault();
                  }}
                  className="gradient-teal-blue inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/50 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous statement"
            className={arrowClass}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5">
            {items.map((item, index) => (
              <button
                key={item.lead}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show statement ${index + 1} of ${count}`}
                aria-current={index === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-8 bg-teal-400"
                    : "w-3 bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next statement"
            className={arrowClass}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
