"use client";

import { motion } from "framer-motion";

export type BarSegment = {
  key: string;
  label: string;
  count: number;
  colorClass: string;
};

/**
 * Part-to-whole, horizontal — the right form for "many categories" per the
 * dataviz skill's form table. The 2px white border between segments is the
 * "surface gap" spacer: it's what makes touching segments read as distinct,
 * not a stroke drawn for decoration, and it's load-bearing for a couple of
 * adjacent hues here that sit closer than ideal under color-vision deficiency
 * (see chartColors.ts) — never remove it.
 */
export function SegmentedBar({ segments, size = "md" }: { segments: BarSegment[]; size?: "sm" | "md" }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const visible = segments.filter((s) => s.count > 0);
  const height = size === "sm" ? "h-2" : "h-3";

  if (total === 0) {
    return <div className={`w-full rounded-full bg-slate-100 ${height}`} />;
  }

  return (
    <div className={`flex w-full overflow-hidden rounded-full bg-slate-100 ${height}`}>
      {visible.map((segment, i) => (
        <motion.div
          key={segment.key}
          initial={{ width: 0 }}
          animate={{ width: `${(segment.count / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
          title={`${segment.label}: ${segment.count}`}
          className={`h-full border-r-2 border-white last:border-r-0 ${segment.colorClass}`}
        />
      ))}
    </div>
  );
}

/** Identity is never color-alone: every segment gets a text label + exact count here, not just a hue. */
export function BarLegend({ segments, emptyLabel }: { segments: BarSegment[]; emptyLabel: string }) {
  const visible = segments.filter((s) => s.count > 0);

  if (visible.length === 0) {
    return <p className="mt-3 text-xs text-slate-400">{emptyLabel}</p>;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {visible.map((segment) => (
        <span key={segment.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <span className={`h-2 w-2 shrink-0 rounded-full ${segment.colorClass}`} aria-hidden="true" />
          {segment.label}
          <span className="font-semibold tabular-nums text-slate-800">{segment.count}</span>
        </span>
      ))}
    </div>
  );
}
