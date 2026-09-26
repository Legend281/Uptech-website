import { isLeadStale } from "@/lib/admin/leadStaleness";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";
import { roleLabels } from "@/lib/admin/labels";
import type { AdminUser, Lead, ServicePageMeta } from "@/lib/admin/types";

const CLOSED_STATUSES = new Set(["won", "lost"]);

type WorkloadRow = {
  user: AdminUser;
  openLeads: number;
  staleLeads: number;
  escalatedPages: number;
  total: number;
};

function buildWorkload(staff: AdminUser[], leads: Lead[], servicePages: ServicePageMeta[]): WorkloadRow[] {
  return staff
    .map((user) => {
      const ownedLeads = leads.filter((lead) => lead.assignedToId === user.id && !CLOSED_STATUSES.has(lead.status));
      const openLeads = ownedLeads.length;
      const staleLeads = ownedLeads.filter((lead) => isLeadStale(lead)).length;
      const escalatedPages = servicePages.filter((page) => page.assignedToId === user.id).length;
      return { user, openLeads, staleLeads, escalatedPages, total: openLeads + escalatedPages };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * Administrator-only, always across the WHOLE team regardless of the
 * dashboard's own "mine"/"all" scope toggle — that toggle controls what an
 * individual sees of their own work, but a workload view is a cross-team
 * management read by definition, so it always takes the full unscoped
 * leads/servicePages arrays, never the scoped ones.
 */
export function TeamWorkload({ staff, leads, servicePages }: { staff: AdminUser[]; leads: Lead[]; servicePages: ServicePageMeta[] }) {
  const rows = buildWorkload(staff, leads, servicePages);
  const maxTotal = Math.max(1, ...rows.map((row) => row.total));

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(7,14,27,0.03)] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-sans text-sm font-bold text-navy-950">Team Workload</h2>
        <span className="text-xs font-semibold tabular-nums text-slate-500">
          {rows.reduce((sum, row) => sum + row.total, 0)} open items
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No staff accounts yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.user.id} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${avatarTint(row.user.name)}`}>
                {initialsOf(row.user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-navy-950">
                    {row.user.name} <span className="font-normal text-slate-400">· {roleLabels[row.user.role]}</span>
                  </p>
                  <p className="shrink-0 text-xs font-semibold tabular-nums text-slate-700">{row.total}</p>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.staleLeads > 0 ? "bg-amber-500" : "bg-teal-500"}`}
                    style={{ width: `${(row.total / maxTotal) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {row.openLeads} open lead{row.openLeads === 1 ? "" : "s"}
                  {row.escalatedPages > 0 ? ` · ${row.escalatedPages} escalated review${row.escalatedPages === 1 ? "" : "s"}` : ""}
                  {row.staleLeads > 0 && (
                    <span className="font-semibold text-amber-700">
                      {" "}
                      · {row.staleLeads} overdue
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
