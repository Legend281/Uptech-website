export type NavItem = {
  label: string;
  icon: string;
  href?: string;
  /** Not built yet this pass — renders as a muted, non-interactive row with a "Soon" tag instead of a dead link. */
  soon?: boolean;
  adminOnly?: boolean;
  /** Only shown where real data backs it (Leads) — no invented count for modules with no data yet. */
  badge?: number;
};

export type NavGroup = { label: string; items: NavItem[] };

/**
 * Single source of truth for admin section labels — AdminSidebar renders
 * these as nav rows, AdminTopbar's breadcrumb reads the same `href`→`label`
 * pairs, so the two can never drift into showing different names for the
 * same page.
 */
export function getNavGroups(leadsCount: number): NavGroup[] {
  return [
    { label: "Overview", items: [{ label: "Dashboard", icon: "dashboard", href: "/admin" }] },
    { label: "Pipeline", items: [{ label: "Leads", icon: "inbox", href: "/admin/leads", badge: leadsCount }] },
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
}

/** Flat href→label lookup for the topbar breadcrumb — undefined for a dynamic route (e.g. a lead detail page), which the caller handles separately. */
export function getStaticPageLabel(pathname: string, leadsCount: number): string | undefined {
  for (const group of getNavGroups(leadsCount)) {
    for (const item of group.items) {
      if (item.href === pathname) return item.label;
    }
  }
  return undefined;
}
