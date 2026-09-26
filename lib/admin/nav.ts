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
export function getNavGroups(leadsCount: number, jobPostingsCount: number, servicePagesNeedingReviewCount: number): NavGroup[] {
  return [
    { label: "Overview", items: [{ label: "Dashboard", icon: "dashboard", href: "/admin" }] },
    { label: "Pipeline", items: [{ label: "Leads", icon: "inbox", href: "/admin/leads", badge: leadsCount }] },
    { label: "Careers", items: [{ label: "Job Postings", icon: "work", href: "/admin/job-postings", badge: jobPostingsCount }] },
    {
      label: "Site Content",
      items: [
        { label: "Service Pages", icon: "description", href: "/admin/service-pages", badge: servicePagesNeedingReviewCount },
        { label: "Case Studies", icon: "auto_stories", soon: true },
        { label: "Testimonials", icon: "format_quote", href: "/admin/testimonials" },
        { label: "Team Members", icon: "groups", href: "/admin/team" },
        { label: "FAQ Items", icon: "quiz", href: "/admin/faqs" },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Staff", icon: "badge", href: "/admin/staff", adminOnly: true },
        { label: "Settings", icon: "settings", href: "/admin/settings", adminOnly: true },
      ],
    },
  ];
}

/** Flat href→label lookup for the topbar breadcrumb — undefined for a dynamic route (e.g. a lead detail page), which the caller handles separately. */
export function getStaticPageLabel(
  pathname: string,
  leadsCount: number,
  jobPostingsCount: number,
  servicePagesNeedingReviewCount: number,
): string | undefined {
  for (const group of getNavGroups(leadsCount, jobPostingsCount, servicePagesNeedingReviewCount)) {
    for (const item of group.items) {
      if (item.href === pathname) return item.label;
    }
  }
  return undefined;
}
