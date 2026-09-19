import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { mockServicePages, mockActivity, mockLeads, MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { getReviewStatus, daysSinceReview, type ReviewStatus } from "@/lib/admin/staleness";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import {
  countCreatedWithinDays,
  countByStatusWithinDays,
  getDailyLeadCounts,
  getPipelineCounts,
  getLeadServiceLabel,
  getServiceAccentClasses,
  leadStatusMeta,
} from "@/lib/admin/leadStats";
import { images } from "@/lib/images";

const reviewStatusMeta: Record<ReviewStatus, { label: string; tone: "success" | "warning" | "danger"; border: string }> = {
  "on-track": { label: "On Track", tone: "success", border: "border-l-emerald-400" },
  "due-soon": { label: "Due Soon", tone: "warning", border: "border-l-amber-400" },
  overdue: { label: "Overdue", tone: "danger", border: "border-l-rose-400" },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  return name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

function getAssignee(id?: string) {
  return id ? MOCK_ADMIN_USERS.find((user) => user.id === id) : undefined;
}

const sourceIcons: Record<string, string> = {
  "contact-form": "mail",
  referral: "person_add",
  whatsapp: "chat",
  website: "language",
};

export default function AdminDashboardPage() {
  // The current mock user isn't threaded server-side yet in this pass (CurrentUserProvider
  // is client-only); a hardcoded first Administrator greets here, matching the sidebar's own default.
  const currentUser = MOCK_ADMIN_USERS[0];

  const pagesWithStatus = mockServicePages
    .map((page) => ({ page, status: getReviewStatus(page) }))
    .sort((a, b) => {
      const order: Record<ReviewStatus, number> = { overdue: 0, "due-soon": 1, "on-track": 2 };
      return order[a.status] - order[b.status];
    });
  const overdueOrDueSoonCount = pagesWithStatus.filter((p) => p.status !== "on-track").length;

  const totalLeads = mockLeads.length;
  const newLeadsThisWeek = countCreatedWithinDays(mockLeads, 7);
  const newLeadsToday = countCreatedWithinDays(mockLeads, 1);
  const bookedOrWonThisMonth = countByStatusWithinDays(mockLeads, ["consultation-booked", "won"], 30);
  const dailyTrend = getDailyLeadCounts(mockLeads, 7);
  const pipeline = getPipelineCounts(mockLeads);
  const recentLeads = [...mockLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      {/* Greeting hero */}
      <section className="relative mb-8 overflow-hidden rounded-2xl">
        <Image
          src={images["infrastructure-corridor"].src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="relative flex flex-col gap-4 px-6 py-8 sm:px-8 sm:py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {getGreeting()}, {currentUser.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Here&apos;s what&apos;s happening across leads and compliance today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <MaterialIcon name="calendar_today" className="text-[16px] text-teal-400" />
            {today}
            <span className="text-slate-500">·</span>
            <MaterialIcon name="location_on" className="text-[16px] text-teal-400" />
            {currentUser.location}
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} icon="groups" accent="blue" trend={dailyTrend} />
        <StatCard
          label="New Leads"
          value={newLeadsThisWeek}
          icon="auto_awesome"
          accent="teal"
          delta={newLeadsToday > 0 ? `+${newLeadsToday} today` : "This week"}
          trend={dailyTrend}
        />
        <StatCard
          label="Consultations Booked / Won"
          value={bookedOrWonThisMonth}
          icon="event_available"
          accent="emerald"
          delta="This month"
        />
        <StatCard
          label="Compliance Pages Needing Review"
          value={overdueOrDueSoonCount}
          icon="warning"
          accent="amber"
          href="#compliance-alerts"
        />
      </div>

      {/* Lead pipeline */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-navy-950 p-6 sm:p-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Lead Pipeline</h2>
            <p className="mt-1 text-sm text-slate-400">Where every open lead sits right now.</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {pipeline.map((stage) => (
            <div key={stage.status} className="frosted-glass rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stage.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{stage.count}</p>
              <p className="mt-0.5 text-xs text-slate-400">{stage.percent}% of pipeline</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent leads */}
      <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-950">Recent Leads</h2>
            <p className="mt-1 text-sm text-slate-500">The latest enquiries, across every service.</p>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Full inbox coming soon
          </span>
        </div>

        {/* Mobile: card list — a 6-column table forced onto a narrow screen needs horizontal scroll with no visible affordance, which reads as broken rather than dense. */}
        <div className="mt-5 divide-y divide-slate-100 md:hidden">
          {recentLeads.map((lead) => {
            const assignee = getAssignee(lead.assignedToId);
            const statusMeta = leadStatusMeta[lead.status];
            return (
              <div key={lead.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {getInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy-950">{lead.name}</p>
                      {lead.company && <p className="truncate text-xs text-slate-500">{lead.company}</p>}
                    </div>
                  </div>
                  <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-[42px] text-xs text-slate-500">
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${getServiceAccentClasses(lead.service)}`}>
                    {getLeadServiceLabel(lead.service)}
                  </span>
                  <span>{formatRelativeTime(lead.createdAt)}</span>
                  <span>{assignee ? assignee.name.split(" ")[0] : "Unassigned"}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Service</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Source</th>
                <th className="pb-3 pr-4 font-semibold">Received</th>
                <th className="pb-3 font-semibold">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => {
                const assignee = getAssignee(lead.assignedToId);
                const statusMeta = leadStatusMeta[lead.status];
                return (
                  <tr key={lead.id}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-950">{lead.name}</p>
                          {lead.company && <p className="truncate text-xs text-slate-500">{lead.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getServiceAccentClasses(lead.service)}`}>
                        {getLeadServiceLabel(lead.service)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <MaterialIcon name={sourceIcons[lead.source]} className="text-[16px] text-slate-400" />
                        <span className="capitalize">{lead.source.replace("-", " ")}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-500">{formatRelativeTime(lead.createdAt)}</td>
                    <td className="py-3">
                      {assignee ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-accent text-[10px] font-bold text-white">
                            {assignee.avatarInitials}
                          </span>
                          {assignee.name.split(" ")[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Compliance review alerts */}
        <section id="compliance-alerts" className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Compliance Review Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">
            The 4 Business Formalisation &amp; Compliance pages, sorted by how urgently each needs review.
          </p>
          <div className="mt-5 space-y-3">
            {pagesWithStatus.map(({ page, status }) => {
              const meta = reviewStatusMeta[status];
              const days = daysSinceReview(page);
              const reviewedOn = new Date(page.lastReviewedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <Link
                  key={page.id}
                  href={page.url}
                  className={`flex items-center justify-between gap-4 rounded-r-lg border-l-4 bg-slate-50/80 py-3 pl-4 pr-3 transition-colors hover:bg-slate-100 ${meta.border}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                      <span className="text-xs text-slate-400">{days} days since review</span>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-semibold text-navy-950">{page.title}</p>
                    <p className="text-xs text-slate-500">Last reviewed {reviewedOn}</p>
                  </div>
                  <MaterialIcon name="chevron_right" className="shrink-0 text-[20px] text-slate-300" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent activity */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-500">What the team has been doing lately.</p>
          <div className="mt-5 space-y-4">
            {mockActivity.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <MaterialIcon name={entry.icon} className="text-[16px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">{entry.description}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Services strip — reuses the homepage's own positioning line and real service pages, not invented copy. */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-navy-950 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <h2 className="text-lg font-extrabold text-white">
              From strategy to <span className="text-teal-400">execution.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Every service the public site offers, in one place.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-400 hover:text-teal-300"
            >
              Explore our services
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-2/3">
            {[
              { label: "Career Marketing & Placement", icon: "work", href: "/services/career-marketing-placement" },
              { label: "Business Formalisation & Compliance", icon: "gavel", href: "/services/business-formalisation-compliance" },
              { label: "Tax & CNPS Compliance", icon: "receipt_long", href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon" },
            ].map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="frosted-glass flex flex-col gap-2 rounded-xl p-4 transition-colors hover:bg-white/[0.08]"
              >
                <MaterialIcon name={service.icon} className="text-[22px] text-teal-400" />
                <span className="text-sm font-semibold text-white">{service.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
