import { motion, type Variants } from "framer-motion";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { ActivityEntry } from "@/lib/admin/types";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const entryVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

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
 * itself. Deliberately calmer than the register: same hairline border, but
 * a much lighter shadow so it doesn't compete for the eye's attention first.
 */
export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(7,14,27,0.03)] sm:p-5">
      <h2 className="font-sans text-sm font-bold text-navy-950">Activity</h2>
      <div className="relative mt-4">
        <div className="absolute bottom-1 left-[7px] top-1 w-px bg-slate-200" aria-hidden="true" />
        <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-4">
          {entries.map((entry) => (
            <motion.li key={entry.id} variants={entryVariants} className="relative flex gap-3 pl-0">
              <span
                className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white ${
                  dotColor[entry.icon] ?? "bg-slate-300"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-slate-700">{entry.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">{formatRelativeTime(entry.timestamp)}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
