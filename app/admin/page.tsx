import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { RegisterList } from "@/components/admin/RegisterList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { mockServicePages, mockLeads, mockActivity } from "@/lib/admin/mockData";
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
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${CARD_ELEVATION}`}>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tint}`}>
          <MaterialIcon name={icon} className="text-[17px]" />
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
      </div>
      <p className="mt-3 font-sans text-[28px] font-extrabold leading-none tabular-nums text-navy-950">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-slate-500">{sublabel ?? " "}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const totalLeads = mockLeads.length;
  const newLeadsThisWeek = countCreatedWithinDays(mockLeads, 7);
  const bookedOrWonThisMonth = countByStatusWithinDays(mockLeads, ["consultation-booked", "won"], 30);
  const overdueCount = mockServicePages.filter((page) => getReviewStatus(page) === "overdue").length;
  const dueSoonCount = mockServicePages.filter((page) => getReviewStatus(page) === "due-soon").length;
  const needsReviewCount = overdueCount + dueSoonCount;

  const newLeadsSharePct = totalLeads > 0 ? Math.round((newLeadsThisWeek / totalLeads) * 100) : 0;

  const complianceSublabel =
    needsReviewCount === 0
      ? "All reviews current"
      : [overdueCount > 0 ? `${overdueCount} overdue` : null, dueSoonCount > 0 ? `${dueSoonCount} due soon` : null]
          .filter(Boolean)
          .join(", ");

  const rows = buildRegister(mockLeads, mockServicePages);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <ActivityLog entries={mockActivity} />
        </div>
      </div>
    </>
  );
}
