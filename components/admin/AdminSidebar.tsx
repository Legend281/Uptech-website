"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLeads } from "@/components/admin/providers/LeadsProvider";

type NavItem = {
  label: string;
  icon: string;
  href?: string;
  /** Not built yet this pass — renders as a muted, non-interactive row with a "Soon" tag instead of a dead link. */
  soon?: boolean;
  adminOnly?: boolean;
  /** Only shown where real data backs it (Leads) — no invented count for modules with no data yet. */
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

function getNavGroups(leadsCount: number): NavGroup[] {
  return [
    { label: "Overview", items: [{ label: "Dashboard", icon: "dashboard", href: "/admin" }] },
    { label: "Pipeline", items: [{ label: "Leads", icon: "inbox", href: "/admin/leads", badge: leadsCount }] },
    { label: "Careers", items: [{ label: "Job Postings", icon: "work", soon: true }] },
    {
      label: "Site Content",
      items: [
        { label: "Service Pages", icon: "description", soon: true },
        { label: "Case Studies", icon: "auto_stories", soon: true },
        { label: "Testimonials", icon: "format_quote", href: "/admin/testimonials" },
        { label: "Team Members", icon: "groups", href: "/admin/team" },
        { label: "FAQ Items", icon: "quiz", href: "/admin/faqs" },
      ],
    },
    { label: "System", items: [{ label: "Settings", icon: "settings", href: "/admin/settings" }] },
  ];
}

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const rowClasses =
    "flex items-center gap-3 rounded-lg px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400";

  if (item.soon || !item.href) {
    return (
      <div className={`${rowClasses} cursor-default border border-transparent py-2 text-sm font-medium text-slate-400`}>
        <MaterialIcon name={item.icon} className="text-[16px] text-slate-500" />
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && (
          <span className="text-[11px] font-bold tabular-nums text-slate-400">{item.badge}</span>
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Soon</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${rowClasses} border py-2.5 font-sans text-sm font-semibold ${
        active
          ? "border-teal-400/20 bg-gradient-to-r from-teal-400/15 to-blue-accent/10 text-white shadow-[0_0_24px_-8px_rgba(45,212,191,0.45)]"
          : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
          active ? "bg-teal-400/15 text-teal-300" : "bg-white/5 text-slate-400"
        }`}
      >
        <MaterialIcon name={item.icon} className="text-[18px]" />
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={`rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
            active ? "text-teal-200" : "text-slate-400"
          }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const leads = useLeads();
  const navGroups = getNavGroups(leads.length);

  const content = (
    <div className="flex h-full flex-col bg-navy-950">
      <div>
        <div className="flex items-center px-5 py-7">
          <Image
            src="/UPTECH_LOG.png"
            alt="Uptech Consulting & Outsourcing"
            width={587}
            height={224}
            className="h-16 w-auto"
            priority
          />
        </div>
        <div className="mx-5 h-0.5 rounded-full bg-gradient-to-r from-teal-400 to-blue-accent" />
      </div>

      <nav
        aria-label="Admin sections"
        data-lenis-prevent
        className="scrollbar-dark min-h-0 flex-1 space-y-8 overflow-y-auto px-3 py-8"
      >
        {navGroups.map((group) => {
          const items = group.items.filter((item) => !item.adminOnly || currentUser.role === "administrator");
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <NavRow key={item.label} item={item} active={item.href === pathname} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-center text-[11px] text-slate-400">Uptech Consulting · Admin</p>
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
