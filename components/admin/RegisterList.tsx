"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { severityMeta, type RegisterRow } from "@/lib/admin/register";

type Filter = "all" | "lead" | "compliance";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lead", label: "Leads" },
  { value: "compliance", label: "Compliance" },
];

function Row({ row }: { row: RegisterRow }) {
  const meta = severityMeta[row.severity];
  const kindIcon = row.kind === "lead" ? "person" : "gavel";

  const inner = (
    <>
      <MaterialIcon name={kindIcon} className="mt-0.5 shrink-0 text-[16px] text-slate-400" />
      <span className={`mt-0.5 w-20 shrink-0 text-xs font-bold uppercase tracking-wide ${meta.color}`}>
        {meta.label}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-950">{row.title}</p>
        {row.detail && <p className="truncate text-xs text-slate-500">{row.detail}</p>}
      </div>
      <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-slate-400">
        {formatRelativeTime(row.timeLabel)}
      </span>
      {row.href && <MaterialIcon name="chevron_right" className="shrink-0 text-[18px] text-slate-300" />}
    </>
  );

  const rowClasses = `flex items-start gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3 last:border-b-0 sm:px-5 ${meta.stripe}`;

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
  const searchId = useId();

  const filtered = rows.filter((row) => {
    if (filter !== "all" && row.kind !== filter) return false;
    if (query.trim()) {
      const haystack = `${row.title} ${row.detail ?? ""}`.toLowerCase();
      if (!haystack.includes(query.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <section id="register" className="scroll-mt-20 rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-1" role="tablist" aria-label="Filter register">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                filter === f.value ? "bg-navy-950 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
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
            onChange={(event) => setQuery(event.target.value)}
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
        <div>
          {filtered.map((row) => (
            <Row key={`${row.kind}-${row.id}`} row={row} />
          ))}
        </div>
      )}
    </section>
  );
}
