"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { severityMeta, type RegisterRow } from "@/lib/admin/register";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";

type Filter = "all" | "lead" | "compliance";

const PAGE_SIZE = 6;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lead", label: "Leads" },
  { value: "compliance", label: "Compliance" },
];

function Row({ row }: { row: RegisterRow }) {
  const meta = severityMeta[row.severity];

  const avatar =
    row.kind === "lead" ? (
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarTint(row.title)}`}
      >
        {initialsOf(row.title)}
      </span>
    ) : (
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${meta.badge}`}
      >
        <MaterialIcon name="gavel" className="text-[17px]" />
      </span>
    );

  const inner = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-navy-950">{row.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}
          >
            {meta.label}
          </span>
          {row.detail && <p className="truncate text-xs text-slate-500">{row.detail}</p>}
        </div>
        <p className="mt-1 text-xs tabular-nums text-slate-500 sm:hidden">{formatRelativeTime(row.timeLabel)}</p>
      </div>
      <span className="hidden shrink-0 whitespace-nowrap text-xs tabular-nums text-slate-500 sm:inline">
        {formatRelativeTime(row.timeLabel)}
      </span>
      {row.href && <MaterialIcon name="chevron_right" className="shrink-0 text-[18px] text-slate-300" />}
    </>
  );

  const rowClasses = `flex items-center gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 last:border-b-0 sm:px-5 ${meta.stripe}`;

  if (row.href) {
    return (
      <Link
        href={row.href}
        className={`${rowClasses} transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={rowClasses}>{inner}</div>;
}

export function RegisterList({ rows }: { rows: RegisterRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const filtered = rows.filter((row) => {
    if (filter !== "all" && row.kind !== filter) return false;
    if (query.trim()) {
      const haystack = `${row.title} ${row.detail ?? ""}`.toLowerCase();
      if (!haystack.includes(query.trim().toLowerCase())) return false;
    }
    return true;
  });

  const counts: Record<Filter, number> = {
    all: rows.length,
    lead: rows.filter((row) => row.kind === "lead").length,
    compliance: rows.filter((row) => row.kind === "compliance").length,
  };

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <section
      id="register"
      className="scroll-mt-20 rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]"
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div
            className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5"
            role="tablist"
            aria-label="Filter register"
          >
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => {
                  setFilter(f.value);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                  filter === f.value ? "bg-white text-navy-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {f.label} <span className="tabular-nums opacity-60">({counts[f.value]})</span>
              </button>
            ))}
          </div>
          {/* Not a raw creation-date feed — buildRegister already ranks every tab by urgency, so this stays true regardless of which one is active. */}
          <p className="mt-1.5 pl-1 text-[11px] font-medium text-slate-400">Sorted by urgency</p>
        </div>
        <label htmlFor={searchId} className="relative sm:w-56">
          <span className="sr-only">Search the register</span>
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400"
          />
          <input
            id={searchId}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            autoComplete="off"
            className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          Nothing matches {query ? `"${query}"` : "this filter"}.
        </div>
      ) : (
        <>
          {/* mode="popLayout" lets a row leaving (filter change, page change) collapse out of flow immediately, instead of holding its space until the fade finishes. */}
          <div>
            <AnimatePresence mode="popLayout" initial={false}>
              {paged.map((row) => (
                <motion.div
                  key={`${row.kind}-${row.id}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Row row={row} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{filtered.length}</span>
            </p>
            {pageCount > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MaterialIcon name="chevron_left" className="text-[18px]" />
                </button>
                <span className="px-2 text-xs font-semibold tabular-nums text-slate-600">
                  {safePage} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={safePage === pageCount}
                  aria-label="Next page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MaterialIcon name="chevron_right" className="text-[18px]" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
