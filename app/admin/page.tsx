"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { RegisterList } from "@/components/admin/RegisterList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { useLeads } from "@/components/admin/providers/LeadsProvider";
import { useServicePages } from "@/components/admin/providers/SettingsProvider";
import { useActivity } from "@/components/admin/providers/ActivityProvider";
import { getReviewStatus } from "@/lib/admin/staleness";
import { buildRegister, countCreatedWithinDays, countByStatusWithinDays } from "@/lib/admin/register";

/** Soft, layered elevation — a hairline border plus a very low, wide shadow reads as "lifted" without a hard drop-shadow edge. */
const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

function StatCard({
  icon,
  tint,
  value,
  label,
  sublabel,
}: {
  icon: string;
  tint: string;
  value: number;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-3 sm:p-4 ${CARD_ELEVATION}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${tint}`}>
          <MaterialIcon name={icon} className="text-[15px] sm:text-[17px]" />
        </span>
        <span className="truncate text-[10.5px] font-bold uppercase leading-tight tracking-wide text-slate-600 sm:text-xs">
          {label}
        </span>
      </div>
      <p className="mt-2.5 font-sans text-2xl font-extrabold leading-none tabular-nums text-navy-950 sm:mt-3 sm:text-[28px]">
        {value}
      </p>
      <p className="mt-1.5 truncate text-[11px] font-medium text-slate-500 sm:text-xs">{sublabel ?? " "}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const leads = useLeads();
  const activity = useActivity();
  // Review cycles come from Settings (spec 4.4).
  const servicePages = useServicePages();
  const totalLeads = leads.length;
  const newLeadsThisWeek = countCreatedWithinDays(leads, 7);
  const bookedOrWonThisMonth = countByStatusWithinDays(leads, ["consultation-booked", "won"], 30);
  const overdueCount = servicePages.filter((page) => getReviewStatus(page) === "overdue").length;
  const dueSoonCount = servicePages.filter((page) => getReviewStatus(page) === "due-soon").length;
  const needsReviewCount = overdueCount + dueSoonCount;

  const newLeadsSharePct = totalLeads > 0 ? Math.round((newLeadsThisWeek / totalLeads) * 100) : 0;

  const complianceSublabel =
    needsReviewCount === 0
      ? "All reviews current"
      : [overdueCount > 0 ? `${overdueCount} overdue` : null, dueSoonCount > 0 ? `${dueSoonCount} due soon` : null]
          .filter(Boolean)
          .join(", ");

  const rows = buildRegister(leads, servicePages);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon="inbox" tint="bg-blue-accent/10 text-blue-accent" value={totalLeads} label="Leads" sublabel="Across both departments" />
        <StatCard
          icon="bolt"
          tint="bg-teal-50 text-teal-600"
          value={newLeadsThisWeek}
          label="New this week"
          sublabel={`${newLeadsSharePct}% of all leads`}
        />
        <StatCard icon="task_alt" tint="bg-emerald-50 text-emerald-600" value={bookedOrWonThisMonth} label="Booked or won" sublabel="This month" />
        <StatCard
          icon="gavel"
          tint={needsReviewCount > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}
          value={needsReviewCount}
          label="Need review"
          sublabel={complianceSublabel}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RegisterList rows={rows} />
        </div>
        <div>
          <ActivityLog entries={activity.slice(0, 8)} />
        </div>
      </div>
    </>
  );
}
