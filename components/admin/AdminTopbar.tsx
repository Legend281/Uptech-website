"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { getStaticPageLabel } from "@/lib/admin/nav";
import { useCurrentUser, useSetCurrentUserId } from "@/components/admin/providers/CurrentUserProvider";
import { useLead, useLeads } from "@/components/admin/providers/LeadsProvider";
import { useServicePages } from "@/components/admin/providers/ServicePagesProvider";
import { getReviewStatus } from "@/lib/admin/staleness";

type Crumb = { label: string; href?: string };

/** Reads the same nav data AdminSidebar renders, so the two never show different names for the same page — falls back to the lead's own name for the one dynamic route. */
function useBreadcrumb(): Crumb[] {
  const pathname = usePathname();
  const leadsCount = useLeads().length;
  const leadIdMatch = pathname.match(/^\/admin\/leads\/(.+)$/);
  const lead = useLead(leadIdMatch?.[1] ?? "");

  if (leadIdMatch) {
    return [{ label: "Leads", href: "/admin/leads" }, { label: lead?.name ?? "Lead" }];
  }
  return [{ label: getStaticPageLabel(pathname, leadsCount) ?? "Dashboard" }];
}

function Breadcrumb({ segments }: { segments: Crumb[] }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 font-sans text-sm font-bold text-navy-950">
      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1;
        return (
          // Only the current page's name shows on mobile — the trail (e.g. "Leads /") only earns its space from sm: up.
          <span key={i} className={`flex min-w-0 items-center gap-1.5 ${isLast ? "" : "hidden sm:flex"}`}>
            {i > 0 && <MaterialIcon name="chevron_right" className="shrink-0 text-[14px] text-slate-300" />}
            {segment.href ? (
              <Link href={segment.href} className="shrink-0 font-semibold text-slate-500 transition-colors hover:text-navy-950">
                {segment.label}
              </Link>
            ) : (
              <span className="truncate">{segment.label}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/**
 * A slim instrument strip, not a hero banner — this is an Operate-mode
 * surface (staff checking what needs doing), not a Persuade-mode surface
 * (a visitor to convince). Date, operator, and the single most urgent fact
 * replace a greeting photo and a motivational tagline.
 *
 * The account identity, persona switcher, and log-out action live here as a
 * single compact menu rather than a permanent card in the sidebar — the
 * standard placement for this kind of control (Linear, Vercel, Stripe), and
 * one that costs no vertical space when it isn't open.
 */
export function AdminTopbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const currentUser = useCurrentUser();
  const servicePages = useServicePages();
  const urgentCount = servicePages.filter((page) => getReviewStatus(page) === "overdue").length;
  const setCurrentUserId = useSetCurrentUserId();
  const breadcrumb = useBreadcrumb();
  const today = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date());

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/85 px-4 py-3 shadow-[0_1px_2px_rgba(7,14,27,0.04)] backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 lg:hidden"
      >
        <MaterialIcon name="menu" className="text-[20px]" />
      </button>

      <Breadcrumb segments={breadcrumb} />

      <div className="ml-auto flex shrink-0 items-center gap-4 text-sm">
        <span className="hidden items-center gap-1.5 text-slate-500 sm:flex">
          <MaterialIcon name="calendar_today" className="text-[13px] text-slate-400" />
          {today}
        </span>
        <span className="hidden h-4 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />
        {urgentCount > 0 ? (
          <a
            href="#register"
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            <MaterialIcon name="warning" className="text-[14px]" />
            <span className="tabular-nums">{urgentCount}</span> overdue
          </a>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <MaterialIcon name="check_circle" className="text-[14px]" />
            All caught up
          </span>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg border border-transparent py-1 pl-1 pr-1.5 transition-colors hover:border-slate-200 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:pr-2"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-accent text-[11px] font-bold text-white ring-2 ring-teal-400/15">
              {currentUser.avatarInitials}
            </span>
            <span className="hidden font-sans text-slate-700 sm:inline">
              {currentUser.name}
              <span className="font-body text-slate-500"> · {roleLabels[currentUser.role]}</span>
            </span>
            <MaterialIcon name="expand_more" className="hidden text-[16px] text-slate-400 sm:inline" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                aria-label="Account"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
              >
                <p className="border-b border-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Preview as
                </p>
                <ul className="max-h-96 overflow-y-auto py-1">
                  {MOCK_ADMIN_USERS.map((user) => {
                    const isCurrent = user.id === currentUser.id;
                    return (
                      <li key={user.id}>
                        <button
                          type="button"
                          role="menuitemradio"
                          aria-checked={isCurrent}
                          onClick={() => {
                            setCurrentUserId(user.id);
                            setMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                            isCurrent ? "bg-teal-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-bold text-white">
                            {user.avatarInitials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-sans font-semibold text-navy-950">{user.name}</span>
                            <span className="block truncate text-xs text-slate-500">
                              {roleLabels[user.role]} · {departmentLabels[user.department]}
                            </span>
                          </span>
                          {isCurrent && <MaterialIcon name="check" className="shrink-0 text-[16px] text-teal-600" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUserId(MOCK_ADMIN_USERS[0].id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600"
                >
                  <MaterialIcon name="logout" className="text-[16px]" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
