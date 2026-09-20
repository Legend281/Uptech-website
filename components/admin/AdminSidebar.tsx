"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { MOCK_ADMIN_USERS, mockLeads } from "@/lib/admin/mockData";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { useCurrentUser, useSetCurrentUserId } from "@/components/admin/providers/CurrentUserProvider";

type NavItem = {
  label: string;
  icon: string;
  href?: string;
  /** Not built yet this pass — renders as a muted, non-interactive row with a "Soon" tag instead of a dead link. */
  soon?: boolean;
  adminOnly?: boolean;
  /** Only shown where real mock data backs it (Leads) — no invented count for modules with no data yet. */
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", icon: "dashboard", href: "/admin" }] },
  { label: "Pipeline", items: [{ label: "Leads", icon: "inbox", soon: true, badge: mockLeads.length }] },
  { label: "Careers", items: [{ label: "Job Postings", icon: "work", soon: true }] },
  {
    label: "Site Content",
    items: [
      { label: "Service Pages", icon: "description", soon: true },
      { label: "Case Studies", icon: "auto_stories", soon: true },
      { label: "Testimonials", icon: "format_quote", soon: true },
      { label: "Team Members", icon: "groups", soon: true },
      { label: "FAQ Items", icon: "quiz", soon: true },
    ],
  },
  { label: "System", items: [{ label: "Settings", icon: "settings", soon: true, adminOnly: true }] },
];

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const rowClasses =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400";

  if (item.soon || !item.href) {
    return (
      <div className={`${rowClasses} cursor-default border border-transparent text-slate-500`}>
        <MaterialIcon name={item.icon} className="text-[20px] text-slate-600" />
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && (
          <span className="rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-slate-300">
            {item.badge}
          </span>
        )}
        <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Soon
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${rowClasses} border ${
        active
          ? "border-teal-400/25 bg-gradient-to-r from-teal-400/15 to-blue-accent/10 text-white"
          : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <MaterialIcon name={item.icon} className={`text-[20px] ${active ? "text-teal-400" : "text-slate-400"}`} />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const setCurrentUserId = useSetCurrentUserId();

  const content = (
    <div className="flex h-full flex-col bg-navy-950">
      <div>
        <div className="flex items-center gap-2 px-5 py-5">
          <Image src="/UPTECH_LOG.png" alt="Uptech Consulting & Outsourcing" width={572} height={233} className="h-9 w-auto" priority />
          <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
            Admin
          </span>
        </div>
        <div className="mx-5 h-0.5 rounded-full bg-gradient-to-r from-teal-400 to-blue-accent" />
      </div>

      <nav aria-label="Admin sections" data-lenis-prevent className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => !item.adminOnly || currentUser.role === "administrator");
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <div className="space-y-1">
                {items.map((item) => (
                  <NavRow key={item.label} item={item} active={item.href === pathname} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg border border-white/10 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          <p className="text-sm font-semibold leading-snug text-white">
            We close the distance between strategy and execution.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-400">
            See the live site
            <MaterialIcon name="arrow_forward" className="text-[14px] transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-400 text-xs font-bold text-navy-950">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-400">
              {roleLabels[currentUser.role]} · {departmentLabels[currentUser.department]}
            </p>
          </div>
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Preview as
          </span>
          <select
            value={currentUser.id}
            onChange={(event) => setCurrentUserId(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-navy-900 px-2.5 py-2 text-xs font-medium text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
          >
            {MOCK_ADMIN_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {roleLabels[user.role]}, {departmentLabels[user.department]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setCurrentUserId(MOCK_ADMIN_USERS[0].id)}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          <MaterialIcon name="logout" className="text-[16px]" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed rail, always visible */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-72">{content}</aside>

      {/* Mobile: off-canvas drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-navy-950/60 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform duration-200 ease-out"
          style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
        >
          {content}
        </div>
      </div>
    </>
  );
}
