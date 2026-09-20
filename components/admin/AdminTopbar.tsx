"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { roleLabels } from "@/lib/admin/labels";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";

/**
 * A slim instrument strip, not a hero banner — this is an Operate-mode
 * surface (staff checking what needs doing), not a Persuade-mode surface
 * (a visitor to convince). Date, operator, and the single most urgent fact
 * replace a greeting photo and a motivational tagline.
 */
export function AdminTopbar({ urgentCount, onOpenSidebar }: { urgentCount: number; onOpenSidebar: () => void }) {
  const currentUser = useCurrentUser();
  const today = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date());

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 lg:hidden"
      >
        <MaterialIcon name="menu" className="text-[20px]" />
      </button>

      <h1 className="text-sm font-bold text-navy-950">Dashboard</h1>

      <div className="ml-auto flex items-center gap-4 text-sm">
        <span className="hidden text-slate-500 sm:inline">{today}</span>
        <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
          |
        </span>
        <span className="hidden text-slate-700 sm:inline">
          {currentUser.name}
          <span className="text-slate-400"> · {roleLabels[currentUser.role]}</span>
        </span>
        {urgentCount > 0 ? (
          <a
            href="#register"
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            <MaterialIcon name="warning" className="text-[14px]" />
            <span className="tabular-nums">{urgentCount}</span> overdue
          </a>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <MaterialIcon name="check_circle" className="text-[14px]" />
            All caught up
          </span>
        )}
      </div>
    </div>
  );
}
