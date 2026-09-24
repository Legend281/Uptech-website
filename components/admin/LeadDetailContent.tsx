"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useLeadDetailActions, resolvableStatuses } from "@/components/admin/hooks/useLeadDetailActions";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { getLeadServiceLabel } from "@/lib/admin/register";
import { toWhatsAppHref } from "@/lib/admin/leads";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { Department, Lead, LeadStatus } from "@/lib/admin/types";

const CARD = "rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

function hoursOrDays(hours: number): string {
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

/** The full, spacious detail-page layout — one section per card, room to breathe. The Quick View modal uses the same hook but its own denser layout, not this component. */
export function LeadDetailContent({ lead }: { lead: Lead }) {
  const {
    currentUser,
    meta,
    assignedUser,
    responseClock,
    stageClock,
    languageMismatch,
    orphaned,
    handleClaim,
    handleReassign,
    handleStatusChange,
    handleResolveTriage,
  } = useLeadDetailActions(lead);

  return (
    <>
      {/* Identity */}
      <div className={`${CARD} p-5`}>
        <div className="flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ${avatarTint(lead.name)}`}>
            {initialsOf(lead.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-sans text-lg font-bold text-navy-950">{lead.name}</h1>
              {lead.language === "French" && (
                <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  FR
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${meta.badge}`}>
                {meta.label}
              </span>
              <span className="text-xs text-slate-500">
                {getLeadServiceLabel(lead.service)}
                {lead.company ? ` · ${lead.company}` : ""}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Submitted {formatRelativeTime(lead.createdAt)} via {lead.source.replace("manual-", "").replace("-", " ")}
            </p>
          </div>
        </div>

        {/* Quick actions — actionable, not just displayed. WhatsApp is core infrastructure, not decorative. */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={`mailto:${lead.email}`}
            className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 py-2.5 text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="mail" className="text-[18px]" />
            <span className="text-[11px] font-semibold">Email</span>
          </a>
          <a
            href={`tel:${lead.phone}`}
            className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 py-2.5 text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="call" className="text-[18px]" />
            <span className="text-[11px] font-semibold">Call</span>
          </a>
          <a
            href={toWhatsAppHref(lead.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 py-2.5 text-emerald-700 transition-colors hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="chat" className="text-[18px]" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>
        </div>
        <p className="mt-2 truncate text-xs text-slate-400">
          {lead.email} · {lead.phone}
        </p>
      </div>

      {/* Needs-triage: a distinct resolution path, not a generic status dropdown */}
      {lead.status === "needs-triage" && (
        <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-start gap-2.5">
            <MaterialIcon name="fork_right" className="mt-0.5 text-[20px] text-violet-600" />
            <div>
              <h2 className="font-sans text-sm font-bold text-violet-900">Needs triage</h2>
              <p className="mt-1 text-sm text-violet-700">
                This inquiry doesn&apos;t clearly belong to one department yet. Assign it to route it correctly —
                it won&apos;t move out of this state on its own.
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(["career-services-operations", "business-formalisation-compliance"] as Department[]).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => handleResolveTriage(dept)}
                className="rounded-lg border border-violet-300 bg-white px-3 py-2.5 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                {departmentLabels[dept]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div className={`${CARD} mt-4 p-5`}>
        <h2 className="font-sans text-sm font-bold text-navy-950">Message</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{lead.message}</p>
      </div>

      {/* Ownership */}
      <div className={`${CARD} mt-4 p-5`}>
        <h2 className="font-sans text-sm font-bold text-navy-950">Ownership</h2>
        {languageMismatch && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <MaterialIcon name="translate" className="mt-0.5 text-[16px] shrink-0" />
            <span>
              This lead prefers French, but {assignedUser?.name} doesn&apos;t list French among their languages. Worth
              a heads-up or a reassignment.
            </span>
          </div>
        )}
        {orphaned && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <MaterialIcon name="person_off" className="mt-0.5 text-[16px] shrink-0" />
            <span>
              Marked &quot;{meta.label}&quot; but nobody owns it — claim it to keep it accountable.
            </span>
          </div>
        )}
        {assignedUser ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[11px] font-bold text-white">
                {assignedUser.avatarInitials}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-950">{assignedUser.name}</p>
                <p className="text-xs text-slate-500">{roleLabels[assignedUser.role]}</p>
              </div>
            </div>
            {currentUser.role === "administrator" && (
              <select
                value={lead.assignedToId ?? ""}
                onChange={(e) => handleReassign(e.target.value || undefined)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
              >
                <option value="">Unassign</option>
                {MOCK_ADMIN_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-slate-500">Unclaimed — nobody owns this lead yet.</p>
            <button
              type="button"
              onClick={handleClaim}
              className="mt-2.5 flex items-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="how_to_reg" className="text-[18px]" />
              Claim This Lead
            </button>
          </div>
        )}
      </div>

      {/* Status + staleness clocks */}
      {lead.status !== "needs-triage" && (
        <div className={`${CARD} mt-4 p-5`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-sans text-sm font-bold text-navy-950">Status</h2>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
            >
              {resolvableStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 text-xs">
              <MaterialIcon
                name={responseClock.overdue ? "warning" : "check_circle"}
                className={`text-[15px] ${responseClock.overdue ? "text-rose-600" : "text-emerald-600"}`}
              />
              <span className={responseClock.overdue ? "font-semibold text-rose-700" : "text-slate-500"}>
                {responseClock.contacted
                  ? "First response within the 1-business-day commitment"
                  : responseClock.overdue
                    ? `Not yet contacted — ${hoursOrDays(responseClock.hoursSinceCreated)} since inquiry, past the 1-business-day commitment`
                    : `Not yet contacted — ${hoursOrDays(responseClock.hoursSinceCreated)} since inquiry`}
              </span>
            </div>
            {stageClock.thresholdDays !== null && (
              <div className="flex items-center gap-2 text-xs">
                <MaterialIcon
                  name={stageClock.stale ? "hourglass_bottom" : "schedule"}
                  className={`text-[15px] ${stageClock.stale ? "text-amber-600" : "text-slate-400"}`}
                />
                <span className={stageClock.stale ? "font-semibold text-amber-700" : "text-slate-500"}>
                  In &quot;{meta.label}&quot; for {Math.round(stageClock.daysInStatus)}d
                  {stageClock.stale ? ` — longer than the usual ${stageClock.thresholdDays}d for this stage` : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
