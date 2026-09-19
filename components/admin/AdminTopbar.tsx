"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { roleLabels } from "@/lib/admin/labels";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";

export function AdminTopbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const currentUser = useCurrentUser();

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
      >
        <MaterialIcon name="menu" className="text-[20px]" />
      </button>

      <label className="relative hidden flex-1 max-w-md sm:block">
        <MaterialIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400"
        />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search leads, services, or anything..."
          suppressHydrationWarning
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-16 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-400/40"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
          ⌘K
        </span>
      </label>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <MaterialIcon name="notifications" className="text-[20px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-accent text-xs font-bold text-white">
            {currentUser.avatarInitials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-navy-950">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{roleLabels[currentUser.role]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
