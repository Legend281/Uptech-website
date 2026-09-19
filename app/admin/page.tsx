import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Sparkline } from "@/components/admin/Sparkline";
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
  getServiceDotClass,
  leadStatusMeta,
  PIPELINE_STAGE_COLOR,
} from "@/lib/admin/leadStats";
import { images } from "@/lib/images";

/** Shared border treatment for the metrics strip cells — stacked with a bottom rule below `lg`, a single row with a right rule at `lg`. Keeps the 4-up layout safe from the divide-x/divide-y wrapping bugs a 2-column intermediate breakpoint would introduce. */
const metricCellClasses = "border-b border-slate-100 p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0";

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

      {/* Metrics strip — one bordered container with internal rules, not four identical cards. The numbers read as one connected summary; only the last cell (an alert, not a growth metric) gets a distinct amber wash. */}
      <section className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white lg:grid-cols-4">
        <div className={metricCellClasses}>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <MaterialIcon name="groups" className="text-[15px]" />
            Total Leads
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950">{totalLeads}</p>
          <div className="mt-4 h-7">
            <Sparkline points={dailyTrend} colorClassName="text-blue-accent" />
          </div>
        </div>

        <div className={metricCellClasses}>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <MaterialIcon name="auto_awesome" className="text-[15px]" />
            New Leads
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950">{newLeadsThisWeek}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-teal-600">
            <MaterialIcon name="trending_up" className="text-[13px]" />
            {newLeadsToday > 0 ? `+${newLeadsToday} today` : "This week"}
          </p>
          <div className="mt-2 h-7">
            <Sparkline points={dailyTrend} colorClassName="text-teal-500" />
          </div>
        </div>

        <div className={metricCellClasses}>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <MaterialIcon name="event_available" className="text-[15px]" />
            Booked / Won
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950">{bookedOrWonThisMonth}</p>
          <p className="mt-1 text-xs text-slate-400">This month</p>
        </div>

        <Link href="#compliance-alerts" className={`${metricCellClasses} bg-amber-50/60 transition-colors hover:bg-amber-50`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <MaterialIcon name="warning" className="text-[15px]" />
              Needs Review
            </div>
            <MaterialIcon name="arrow_forward" className="text-[15px] text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950">{overdueOrDueSoonCount}</p>
          <p className="mt-1 text-xs text-amber-700/80">Compliance pages</p>
        </Link>
      </section>

      {/* Lead pipeline — a real proportional funnel, not identical tiles: the bar's own width per segment shows the shape of the pipeline at a glance. */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-navy-950 p-6 sm:p-7">
        <h2 className="text-base font-bold text-white">Lead Pipeline</h2>
        <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-white/10">
          {pipeline
            .filter((stage) => stage.percent > 0)
            .map((stage, index) => (
              <div
                key={stage.status}
                style={{ width: `${stage.percent}%` }}
                className={`${PIPELINE_STAGE_COLOR[stage.status]} ${index > 0 ? "border-l-2 border-navy-950" : ""}`}
              />
            ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {pipeline.map((stage) => (
            <div key={stage.status} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${PIPELINE_STAGE_COLOR[stage.status]}`} />
              <span className="text-sm font-bold text-white">{stage.count}</span>
              <span className="text-xs text-slate-400">{stage.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent leads */}
      <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-navy-950">Recent Leads</h2>
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
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${getServiceDotClass(lead.service)}`} />
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
                      <span className="inline-flex items-center gap-2 text-slate-600">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${getServiceDotClass(lead.service)}`} />
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
        {/* Compliance review alerts — a warm tint (not the default white/border/shadow every other card uses) signals this is the one panel that wants attention, not just information. */}
        <section id="compliance-alerts" className="lg:col-span-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950">Compliance Review Alerts</h2>
            <span className="text-xs font-medium text-amber-700/80">Sorted by urgency</span>
          </div>
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
                  className={`flex items-center justify-between gap-4 rounded-r-lg border-l-4 bg-white/70 py-3 pl-4 pr-3 shadow-sm transition-colors hover:bg-white ${meta.border}`}
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

        {/* Recent activity — a connecting rail behind the icons reads as a timeline, not a generic icon-plus-text list. */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Recent Activity</h2>
          <div className="relative mt-5">
            <div className="absolute bottom-2 left-4 top-2 w-px bg-slate-100" aria-hidden="true" />
            <div className="space-y-4">
              {mockActivity.map((entry) => (
                <div key={entry.id} className="relative flex gap-3">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-4 ring-white">
                    <MaterialIcon name={entry.icon} className="text-[16px]" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="text-sm text-slate-700">{entry.description}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTime(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
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
