"use client";

import { motion } from "framer-motion";

export type BarSegment = {
  key: string;
  label: string;
  count: number;
  colorClass: string;
};

type ClickProps = {
  onSegmentClick?: (key: string) => void;
  activeKey?: string | null;
};

/**
 * Part-to-whole, horizontal — the right form for "many categories" per the
 * dataviz skill's form table. The 2px white border between segments is the
 * "surface gap" spacer: it's what makes touching segments read as distinct,
 * not a stroke drawn for decoration, and it's load-bearing for a couple of
 * adjacent hues here that sit closer than ideal under color-vision deficiency
 * (see chartColors.ts) — never remove it.
 */
export function SegmentedBar({ segments, size = "md", onSegmentClick, activeKey }: { segments: BarSegment[]; size?: "sm" | "md" } & ClickProps) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const visible = segments.filter((s) => s.count > 0);
  const height = size === "sm" ? "h-2" : "h-3";

  if (total === 0) {
    return <div className={`w-full rounded-full bg-slate-100 ${height}`} />;
  }

  return (
    <div className={`flex w-full overflow-hidden rounded-full bg-slate-100 ${height}`}>
      {visible.map((segment, i) => {
        const isDimmed = Boolean(activeKey) && activeKey !== segment.key;
        return (
          <motion.div
            key={segment.key}
            role={onSegmentClick ? "button" : undefined}
            tabIndex={onSegmentClick ? 0 : undefined}
            onClick={onSegmentClick ? () => onSegmentClick(segment.key) : undefined}
            onKeyDown={
              onSegmentClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSegmentClick(segment.key);
                    }
                  }
                : undefined
            }
            initial={{ width: 0 }}
            animate={{ width: `${(segment.count / total) * 100}%`, opacity: isDimmed ? 0.35 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
            title={`${segment.label}: ${segment.count}`}
            className={`h-full border-r-2 border-white transition-opacity last:border-r-0 ${segment.colorClass} ${
              onSegmentClick
                ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-950"
                : ""
            }`}
          />
        );
      })}
    </div>
  );
}

/** Identity is never color-alone: every segment gets a text label + exact count here, not just a hue. Also the easier click target — a 1-count bar segment can be a few pixels wide. */
export function BarLegend({ segments, emptyLabel, onSegmentClick, activeKey }: { segments: BarSegment[]; emptyLabel: string } & ClickProps) {
  const visible = segments.filter((s) => s.count > 0);

  if (visible.length === 0) {
    return <p className="mt-3 text-xs text-slate-400">{emptyLabel}</p>;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
      {visible.map((segment) => {
        const isActive = activeKey === segment.key;
        return (
          <span
            key={segment.key}
            role={onSegmentClick ? "button" : undefined}
            tabIndex={onSegmentClick ? 0 : undefined}
            onClick={onSegmentClick ? () => onSegmentClick(segment.key) : undefined}
            onKeyDown={
              onSegmentClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSegmentClick(segment.key);
                    }
                  }
                : undefined
            }
            className={`inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium transition-colors ${
              isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
            } ${onSegmentClick ? "cursor-pointer hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy-950" : ""}`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${segment.colorClass}`} aria-hidden="true" />
            {segment.label}
            <span className="font-semibold tabular-nums text-slate-800">{segment.count}</span>
          </span>
        );
      })}
    </div>
  );
}
