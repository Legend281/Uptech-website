import { RegisterList } from "@/components/admin/RegisterList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { mockServicePages, mockLeads, mockActivity } from "@/lib/admin/mockData";
import { getReviewStatus } from "@/lib/admin/staleness";
import { buildRegister, countCreatedWithinDays, countByStatusWithinDays } from "@/lib/admin/register";

function Count({ value, label, dot }: { value: number; label: string; dot: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 first:pl-0 last:pr-0">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="flex items-baseline gap-1.5">
        <span className="text-lg font-extrabold tabular-nums text-navy-950">{value}</span>
        <span className="text-sm text-slate-500">{label}</span>
      </span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const totalLeads = mockLeads.length;
  const newLeadsThisWeek = countCreatedWithinDays(mockLeads, 7);
  const bookedOrWonThisMonth = countByStatusWithinDays(mockLeads, ["consultation-booked", "won"], 30);
  const needsReviewCount = mockServicePages.filter((page) => getReviewStatus(page) !== "on-track").length;

  const rows = buildRegister(mockLeads, mockServicePages);

  return (
    <>
      {/* Quick counts — quiet reference numbers, not oversized stat cards competing for attention. */}
      <div className="mb-6 flex flex-wrap divide-x divide-slate-200 border-b border-slate-200 pb-1">
        <Count value={totalLeads} label="leads" dot="bg-blue-accent" />
        <Count value={newLeadsThisWeek} label="new this week" dot="bg-teal-400" />
        <Count value={bookedOrWonThisMonth} label="booked or won this month" dot="bg-emerald-500" />
        <Count value={needsReviewCount} label="compliance pages need review" dot={needsReviewCount > 0 ? "bg-amber-500" : "bg-emerald-500"} />
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
