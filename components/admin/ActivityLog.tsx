import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { ActivityEntry } from "@/lib/admin/types";

/** What each activity actually means, not just decoration — a warning reads as a warning, a completed review reads as done. */
const dotColor: Record<string, string> = {
  warning: "bg-amber-500",
  check_circle: "bg-emerald-500",
  fact_check: "bg-teal-400",
  edit_note: "bg-blue-accent",
  person_add: "bg-blue-accent",
  work_history: "bg-slate-300",
  help: "bg-slate-300",
};

/**
 * Secondary, quiet reference material — a real trail of who did what, which
 * is literally the company's own stated principle ("individual efforts only
 * succeed through documented, repeatable systems") built into the tool
 * itself. Deliberately calmer than the register: a hairline border, no
 * shadow, no card chrome competing with the primary surface.
 */
export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-bold text-navy-950">Activity</h2>
      <div className="relative mt-4">
        <div className="absolute bottom-1 left-[7px] top-1 w-px bg-slate-200" aria-hidden="true" />
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="relative flex gap-3 pl-0">
              <span
                className={`relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-white ring-2 ring-white ${
                  dotColor[entry.icon] ?? "bg-slate-300"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-slate-700">{entry.description}</p>
                <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTime(entry.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
