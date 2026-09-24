"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useLead, useLeadActions } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useLeadDetailActions, resolvableStatuses } from "@/components/admin/hooks/useLeadDetailActions";
import { LeadFormDialog } from "@/components/admin/LeadFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { getLeadServiceLabel } from "@/lib/admin/register";
import { toWhatsAppHref } from "@/lib/admin/leads";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { Department, Lead, LeadStatus } from "@/lib/admin/types";

function hoursOrDays(hours: number): string {
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

const sectionLabel = "text-[11px] font-bold uppercase tracking-wider text-slate-400";

/**
 * Purpose-built compact layout, not the full-page content squeezed into a
 * box — a two-column spread on desktop (identity+contact+message on the
 * left, ownership+status on the right) so a typical lead needs no scroll
 * at all, with only the message given its own bounded, internally
 * scrollable area so one long message can never drag the whole modal tall.
 */
function QuickViewBody({ lead }: { lead: Lead }) {
  const {
    currentUser,
    meta,
    assignedUser,
    responseClock,
    stageClock,
    languageMismatch,
    orphaned,
    nextStepHint,
    handleClaim,
    handleReassign,
    handleStatusChange,
    handleResolveTriage,
    handleContactChannelUsed,
  } = useLeadDetailActions(lead);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Left: identity, contact, message */}
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${avatarTint(lead.name)}`}>
            {initialsOf(lead.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="truncate font-sans text-base font-bold text-navy-950">{lead.name}</h2>
              {lead.language === "French" && (
                <span className="shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  FR
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}>
                {meta.label}
              </span>
              <span className="truncate text-xs text-slate-500">
                {getLeadServiceLabel(lead.service)}
                {lead.company ? ` · ${lead.company}` : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <a
            href={`mailto:${lead.email}`}
            onClick={() => handleContactChannelUsed("email")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="mail" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Email</span>
          </a>
          <a
            href={`tel:${lead.phone}`}
            onClick={() => handleContactChannelUsed("call")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="call" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Call</span>
          </a>
          <a
            href={toWhatsAppHref(lead.phone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleContactChannelUsed("chat")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-emerald-700 transition-colors hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="chat" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Chat</span>
          </a>
        </div>
        <p className="mt-1.5 truncate text-[11px] text-slate-400">
          {lead.email} · {lead.phone} · {formatRelativeTime(lead.createdAt)}
        </p>

        <div className="mt-4">
          <p className={sectionLabel}>Message</p>
          <p className="mt-1.5 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {lead.message}
          </p>
        </div>
      </div>

      {/* Right: needs-triage, ownership, status */}
      <div className="min-w-0 border-t border-slate-100 pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        {lead.status === "needs-triage" ? (
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3.5">
            <div className="flex items-start gap-2">
              <MaterialIcon name="fork_right" className="mt-0.5 shrink-0 text-[18px] text-violet-600" />
              <p className="text-xs text-violet-700">
                Doesn&apos;t clearly belong to one department yet. Route it to resolve.
              </p>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {(["career-services-operations", "business-formalisation-compliance"] as Department[]).map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => handleResolveTriage(dept)}
                  className="w-full rounded-lg border border-violet-300 bg-white px-3 py-2 text-left text-xs font-semibold text-violet-800 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  {departmentLabels[dept]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className={sectionLabel}>Ownership</p>
            {languageMismatch && (
              <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800">
                <MaterialIcon name="translate" className="mt-0.5 shrink-0 text-[14px]" />
                <span>Prefers French — {assignedUser?.name} doesn&apos;t list it.</span>
              </div>
            )}
            {orphaned && (
              <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800">
                <MaterialIcon name="person_off" className="mt-0.5 shrink-0 text-[14px]" />
                <span>&quot;{meta.label}&quot; with no owner — claim it.</span>
              </div>
            )}
            {assignedUser ? (
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-bold text-white">
                    {assignedUser.avatarInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-950">{assignedUser.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{roleLabels[assignedUser.role]}</p>
                  </div>
                </div>
                {currentUser.role === "administrator" && (
                  <select
                    value={lead.assignedToId ?? ""}
                    onChange={(e) => handleReassign(e.target.value || undefined)}
                    className="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11px] text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
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
              <button
                type="button"
                onClick={handleClaim}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <MaterialIcon name="how_to_reg" className="text-[16px]" />
                Claim This Lead
              </button>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <p className={sectionLabel}>Status</p>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
              >
                {resolvableStatuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {nextStepHint && (
              <p className="mt-1.5 flex items-start gap-1 text-[11px] text-slate-500">
                <MaterialIcon name="arrow_forward" className="mt-0.5 shrink-0 text-[12px] text-slate-400" />
                {nextStepHint}
              </p>
            )}
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px]">
                <MaterialIcon
                  name={responseClock.overdue ? "warning" : "check_circle"}
                  className={`shrink-0 text-[14px] ${responseClock.overdue ? "text-rose-600" : "text-emerald-600"}`}
                />
                <span className={responseClock.overdue ? "font-semibold text-rose-700" : "text-slate-500"}>
                  {responseClock.contacted
                    ? "Responded within the 1-business-day commitment"
                    : responseClock.overdue
                      ? `Not contacted — ${hoursOrDays(responseClock.hoursSinceCreated)} since inquiry, overdue`
                      : `Not contacted — ${hoursOrDays(responseClock.hoursSinceCreated)} since inquiry`}
                </span>
              </div>
              {stageClock.thresholdDays !== null && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <MaterialIcon
                    name={stageClock.stale ? "hourglass_bottom" : "schedule"}
                    className={`shrink-0 text-[14px] ${stageClock.stale ? "text-amber-600" : "text-slate-400"}`}
                  />
                  <span className={stageClock.stale ? "font-semibold text-amber-700" : "text-slate-500"}>
                    In &quot;{meta.label}&quot; {Math.round(stageClock.daysInStatus)}d
                    {stageClock.stale ? ` — usual is ${stageClock.thresholdDays}d` : ""}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Everything about a lead — claim, status, contact actions, staleness,
 * edit, delete — lives here. No "open the full page" escape hatch: this
 * modal is the complete surface, not a preview of something deeper.
 *
 * Takes an id, not a lead object — see useLeadDetailActions/useLead: a
 * lead object passed in as a static prop would freeze at whatever it was
 * when the modal opened, so claiming inside it would show a stale
 * "Unclaimed" state even as a toast confirms success. Re-deriving the
 * lead from the shared store on every render is what keeps this in sync.
 */
export function LeadQuickViewModal({ leadId, onClose }: { leadId: string | null; onClose: () => void }) {
  const lead = useLead(leadId ?? "");
  const { deleteLead } = useLeadActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [leadId, onClose]);

  if (!leadId || !lead) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${lead.name} — quick view`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick View</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Edit lead"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="edit" className="text-[17px]" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete lead"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <MaterialIcon name="delete" className="text-[17px]" />
            </button>
            <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="close" className="text-[19px]" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <QuickViewBody lead={lead} />
        </div>
      </div>

      <LeadFormDialog open={editOpen} onClose={() => setEditOpen(false)} mode="edit" lead={lead} />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete this lead?"
        description={`${lead.name}'s record will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Lead"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteLead(lead.id);
          // No relatedHref — the record is gone, so a link back to it would just 404.
          logActivity({ icon: "delete", description: `${currentUser.name} deleted ${lead.name}'s lead record` });
          toast.success("Lead deleted");
          setDeleteOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
