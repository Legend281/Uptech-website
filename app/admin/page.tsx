import { RegisterList } from "@/components/admin/RegisterList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { mockServicePages, mockLeads, mockActivity } from "@/lib/admin/mockData";
import { getReviewStatus } from "@/lib/admin/staleness";
import { buildRegister, countCreatedWithinDays, countByStatusWithinDays } from "@/lib/admin/register";

function Count({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5 px-4 py-3 first:pl-0 last:pr-0">
      <span className="text-lg font-extrabold tabular-nums text-navy-950">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
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
        <Count value={totalLeads} label="leads" />
        <Count value={newLeadsThisWeek} label="new this week" />
        <Count value={bookedOrWonThisMonth} label="booked or won this month" />
        <Count value={needsReviewCount} label="compliance pages need review" />
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
