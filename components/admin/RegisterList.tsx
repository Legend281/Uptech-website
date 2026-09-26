"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { severityMeta, type RegisterRow, type Severity } from "@/lib/admin/register";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";
import { useStaff } from "@/components/admin/providers/StaffProvider";

type Filter = "all" | "lead" | "compliance";

const PAGE_SIZE = 6;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lead", label: "Leads" },
  { value: "compliance", label: "Compliance" },
];

/** Reuses the same three hues as everywhere else (rose/amber/slate) rather than inventing a fourth badge color — an icon, not a pill, so it doesn't compete with the status/stale badges for space. */
const temperatureMeta: Record<string, { icon: string; className: string; label: string }> = {
  hot: { icon: "local_fire_department", className: "text-rose-500", label: "Hot lead" },
  warm: { icon: "thermostat", className: "text-amber-500", label: "Warm lead" },
  cold: { icon: "ac_unit", className: "text-slate-400", label: "Cold lead" },
};

type RowActions = {
  onSendReminder?: (row: RegisterRow) => void;
  onResolve?: (row: RegisterRow) => void;
  onEscalate?: (row: RegisterRow) => void;
  /** A lead row opens the quick-view modal instead of navigating — same surface the Leads page's own table row opens. */
  onOpenLead?: (leadId: string) => void;
};

function Row({ row, onSendReminder, onResolve, onEscalate, onOpenLead }: { row: RegisterRow } & RowActions) {
  const router = useRouter();
  const meta = severityMeta[row.severity];
  // Only a stale lead someone actually owns has anyone to nudge — an unassigned lead needs claiming first, not a reminder.
  const canRemind = row.kind === "lead" && row.isStale && Boolean(row.assignedToId) && Boolean(onSendReminder);
  const canResolve = row.kind === "compliance" && row.severity === "overdue" && Boolean(onResolve);
  const staff = useStaff();
  const assignee = row.assignedToId ? staff.find((user) => user.id === row.assignedToId) : undefined;

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

  // A resolvable compliance row's href points to the LIVE PUBLIC PAGE, not
  // an admin route — when the whole row doubled as that link, clicking the
  // title (the natural click target) silently left the dashboard instead of
  // opening Resolve/Escalate. Scoping the link to just the title, with an
  // explicit "opens the live page" icon, keeps that navigation available
  // without it ambushing someone reaching for the buttons next to it.
  const titleText = (
    <>
      <span className="truncate">{row.title}</span>
      {row.temperature && (
        <span title={temperatureMeta[row.temperature].label} className="shrink-0">
          <MaterialIcon name={temperatureMeta[row.temperature].icon} className={`text-[14px] ${temperatureMeta[row.temperature].className}`} />
        </span>
      )}
    </>
  );

  const inner = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        {canResolve && row.href ? (
          <Link
            href={row.href}
            onClick={(event) => event.stopPropagation()}
            title="Open the live public page"
            className="group/title flex w-fit max-w-full items-center gap-1 truncate font-sans text-sm font-semibold text-navy-950 hover:text-teal-700 hover:underline"
          >
            {titleText}
            <MaterialIcon name="open_in_new" className="shrink-0 text-[12px] text-slate-400 group-hover/title:text-teal-600" />
          </Link>
        ) : (
          <p className="flex items-center gap-1 truncate font-sans text-sm font-semibold text-navy-950">{titleText}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}
          >
            {meta.label}
          </span>
          {row.isStale && (
            <span className="shrink-0 truncate rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-amber-700">
              Stale
            </span>
          )}
          {row.dueSoonSLA && (
            <span
              title="Approaching its SLA window — not overdue yet"
              className="shrink-0 truncate rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-sky-700"
            >
              Due Soon
            </span>
          )}
          {row.detail && (
            <p className="truncate text-xs text-slate-500">
              {row.detail}
              {/* Sheds on mobile like the timestamp/assignee avatar do — a low-priority tag isn't worth swallowing the service detail it's appended to at 2-column width. */}
              {row.autoRouted && <span className="hidden sm:inline"> · Auto-routed</span>}
            </p>
          )}
        </div>
        <p className="mt-1 text-xs tabular-nums text-slate-500 sm:hidden">{formatRelativeTime(row.timeLabel)}</p>
      </div>
      {assignee && (
        <span
          title={`Assigned to ${assignee.name}`}
          className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[9px] font-bold text-white sm:flex"
        >
          {assignee.avatarInitials}
        </span>
      )}
      <span className="hidden shrink-0 whitespace-nowrap text-xs tabular-nums text-slate-500 sm:inline">
        {formatRelativeTime(row.timeLabel)}
      </span>
      {canRemind && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSendReminder?.(row);
          }}
          className="flex shrink-0 items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
        >
          <MaterialIcon name="notifications_active" className="text-[13px]" />
          <span className="hidden sm:inline">Remind</span>
        </button>
      )}
      {canResolve && (
        <div className="flex shrink-0 items-center gap-1.5">
          {onEscalate && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEscalate(row);
              }}
              title="Escalate to a team lead"
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="arrow_upward" className="text-[12px]" />
              <span className="hidden lg:inline">Escalate</span>
            </button>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onResolve?.(row);
            }}
            className="flex items-center gap-1 rounded-md bg-navy-950 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="task_alt" className="text-[13px]" />
            <span className="hidden sm:inline">Resolve</span>
          </button>
        </div>
      )}
      {/* Only a plain (non-resolvable) row's chevron implies "click anywhere to go" — a resolvable row's own navigation now lives on its title link instead, so the chevron would misrepresent the rest of the row as clickable too. */}
      {row.href && !canResolve && <MaterialIcon name="chevron_right" className="shrink-0 text-[18px] text-slate-300" />}
    </>
  );

  const rowClasses = `flex items-center gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 last:border-b-0 sm:px-5 ${meta.stripe}`;

  // A lead row opens a modal, not a URL — no anchor semantics (ctrl-click, "open in new tab") apply to that, so it's always a synthetic click target when this handler is wired in.
  if (row.kind === "lead" && onOpenLead) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenLead(row.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenLead(row.id);
          }
        }}
        className={`${rowClasses} cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500`}
      >
        {inner}
      </div>
    );
  }

  // A resolvable compliance row is never itself a link — its title carries
  // its own real <Link> to the live page above, and Resolve/Escalate are
  // plain buttons, so this is just a static container for the three.
  if (canResolve) {
    return <div className={rowClasses}>{inner}</div>;
  }

  // A row with a nested real button can't also be a real <a> (invalid nested-interactive HTML) — it becomes a synthetic, keyboard-reachable click target instead. Every other row keeps a real Link, so ctrl/middle-click and "open in new tab" keep working there. (canRemind only reaches here when onOpenLead isn't wired in — otherwise the branch above already handled this row.)
  if (canRemind && row.href) {
    const href = row.href;
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(event) => {
          if (event.key === "Enter") router.push(href);
        }}
        className={`${rowClasses} cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500`}
      >
        {inner}
      </div>
    );
  }

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

export function RegisterList({
  rows,
  onSendReminder,
  onResolve,
  onEscalate,
  onOpenLead,
  severityFilter,
  onClearSeverityFilter,
}: { rows: RegisterRow[]; severityFilter?: Severity | null; onClearSeverityFilter?: () => void } & RowActions) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  // An externally-driven filter (a Pipeline Breakdown segment click) always lands on page 1 — staying on whatever page was scrolled to under the old filter would show the wrong rows.
  useEffect(() => {
    setPage(1);
  }, [severityFilter]);

  const filtered = rows.filter((row) => {
    if (filter !== "all" && row.kind !== filter) return false;
    if (severityFilter && row.severity !== severityFilter) return false;
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
          {severityFilter ? (
            <button
              type="button"
              onClick={onClearSeverityFilter}
              className="mt-1.5 flex items-center gap-1 pl-1 text-[11px] font-semibold text-navy-950 hover:text-slate-600"
            >
              Filtered: {severityMeta[severityFilter].label}
              <MaterialIcon name="close" className="text-[13px]" />
            </button>
          ) : (
            // Not a raw creation-date feed — buildRegister already ranks every tab by urgency, so this stays true regardless of which one is active.
            <p className="mt-1.5 pl-1 text-[11px] font-medium text-slate-400">Sorted by urgency</p>
          )}
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
                  <Row row={row} onSendReminder={onSendReminder} onResolve={onResolve} onEscalate={onEscalate} onOpenLead={onOpenLead} />
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
