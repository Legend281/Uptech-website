"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard, type TestimonialCardProps } from "@/components/TestimonialCard";

type Item = TestimonialCardProps & { id: string };

const INTERVAL_MS = 8000;
/** Horizontal travel before a drag counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD_PX = 45;
/** Space between cards, in px — also part of the page offset below. */
const GAP_PX = 24;

/**
 * The Homepage's published testimonials, side by side and paged: two per
 * page on large screens, one on smaller ones. Pagination mirrors
 * RotatingPromise (the "Meet your dedicated person" block above it on the
 * Homepage) so the page has one carousel language: round arrows, numbered
 * page pills, swipe/drag, left/right keys, and an auto-advance that pauses
 * on hover or focus and never runs for anyone who asked to reduce motion.
 */
export function TestimonialCarousel({ items }: { items: Item[] }) {
  const [wide, setWide] = useState(false);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const widthQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setWide(widthQuery.matches);
    setReducedMotion(motionQuery.matches);
    const onWidth = (event: MediaQueryListEvent) => setWide(event.matches);
    const onMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    widthQuery.addEventListener("change", onWidth);
    motionQuery.addEventListener("change", onMotion);
    return () => {
      widthQuery.removeEventListener("change", onWidth);
      motionQuery.removeEventListener("change", onMotion);
    };
  }, []);

  // Never more cards per page than there are cards, so a lone testimonial isn't half-width.
  const perPage = Math.max(1, Math.min(wide ? 2 : 1, items.length));
  const pageCount = Math.ceil(items.length / perPage);
  const current = Math.min(page, pageCount - 1);

  const go = useCallback((next: number) => setPage(((next % pageCount) + pageCount) % pageCount), [pageCount]);

  useEffect(() => {
    if (paused || reducedMotion || pageCount < 2) return;
    const id = window.setInterval(() => setPage((p) => (Math.min(p, pageCount - 1) + 1) % pageCount), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, pageCount]);

  const onBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!regionRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const start = dragStart.current;
      if (!start || dragging) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      // Once clearly horizontal, stop the drag becoming a text selection.
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        setDragging(true);
        window.getSelection()?.removeAllRanges();
      }
    },
    [dragging],
  );

  const onPointerEnd = useCallback(
    (event: React.PointerEvent) => {
      const start = dragStart.current;
      dragStart.current = null;
      setDragging(false);
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      // Only a clearly horizontal gesture pages; a vertical flick still scrolls the page.
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return;
      go(current + (dx < 0 ? 1 : -1));
    },
    [current, go],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(current - 1);
      }
    },
    [current, go],
  );

  const arrowClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-navy-900/70 text-slate-300 transition-colors hover:border-slate-500 hover:text-white";

  // Each card is (100% - gaps) / perPage wide; one page is the full width plus one gap.
  const cardBasis = perPage === 1 ? "100%" : `calc((100% - ${GAP_PX * (perPage - 1)}px) / ${perPage})`;

  return (
    <div
      ref={regionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
      onPointerDown={(event) => {
        dragStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={() => {
        dragStart.current = null;
        setDragging(false);
      }}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      /* pan-y keeps vertical scrolling native while horizontal drags reach the handlers above. */
      className={`touch-pan-y ${dragging ? "select-none" : ""} ${items.length === 1 ? "max-w-3xl" : ""}`}
    >
      <div className="overflow-hidden">
        <div
          className="flex items-stretch"
          style={{
            gap: `${GAP_PX}px`,
            transform: `translateX(calc(${-current} * (100% + ${GAP_PX}px)))`,
            transition: reducedMotion ? "none" : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {items.map(({ id, ...card }, index) => {
            const visible = Math.floor(index / perPage) === current;
            return (
              <div
                key={id}
                className="shrink-0 [&>figure]:h-full"
                style={{ flexBasis: cardBasis }}
                inert={!visible}
                aria-hidden={!visible}
                aria-roledescription="slide"
                aria-label={`Testimonial ${index + 1} of ${items.length}`}
              >
                <TestimonialCard {...card} tone="dark" />
              </div>
            );
          })}
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(current - 1)} aria-label="Previous testimonials" className={arrowClass}>
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show page ${index + 1} of ${pageCount}`}
                aria-current={index === current}
                className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[10px] font-bold transition-all duration-300 ${
                  index === current
                    ? "border-teal-400/50 bg-teal-400/10 text-teal-300"
                    : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => go(current + 1)} aria-label="Next testimonials" className={arrowClass}>
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
