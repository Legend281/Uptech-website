import { toastResult } from "@/lib/admin/toastResult";
import { useLeadActions } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { departmentLabels } from "@/lib/admin/labels";
import { severityMeta, leadStatusToSeverity } from "@/lib/admin/register";
import { getResponseClock, getStageClock, RESPONSE_SLA_HOURS } from "@/lib/admin/leadStaleness";
import { useAdminUsers } from "@/components/admin/providers/CurrentUserProvider";
import { useEscalationHours } from "@/components/admin/providers/SettingsProvider";
import type { Department, Lead, LeadStatus } from "@/lib/admin/types";

export const resolvableStatuses: { value: Exclude<LeadStatus, "needs-triage">; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "consultation-booked", label: "Consultation booked" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

/**
 * Shared between the full detail page and the Quick View modal, so the two
 * can never drift in behavior even though they render it very differently.
 *
 * The unassigned-lead question this was built to answer: should ownership
 * and status be allowed to drift apart — a lead marked "Contacted" with
 * nobody attached to it? Two of the seeded mock leads already have exactly
 * that gap (Brenda Fokou, Kevin Ateh — both "Contacted", both unclaimed),
 * which is a real accountability hole, not a hypothetical. Two answers,
 * not one:
 *  1. Prevent it going forward — advancing an unclaimed lead's status here
 *     auto-claims it for whoever made the change, since in practice
 *     whoever moves a lead to "Contacted" is the one who contacted them.
 *  2. Flag it where it already happened — `orphaned` surfaces the
 *     already-broken case for the two seeded leads above.
 */
export function useLeadDetailActions(lead: Lead) {
  const { claimLead, reassignLead, updateStatus, resolveTriage } = useLeadActions();
  const currentUser = useCurrentUser();
  const users = useAdminUsers();
  const escalationHoursFor = useEscalationHours();

  const meta = severityMeta[leadStatusToSeverity[lead.status]];
  const assignedUser = users.find((user) => user.id === lead.assignedToId);
  // The department's escalation window from Settings (never more than the public 24h promise).
  const windowHours = escalationHoursFor(lead.department);
  const responseClock = getResponseClock(lead, new Date(), windowHours);
  const windowIsCommitment = windowHours >= RESPONSE_SLA_HOURS;
  const stageClock = getStageClock(lead);
  const languageMismatch = lead.language === "French" && Boolean(assignedUser) && !assignedUser?.languages.includes("French");
  const orphaned = !assignedUser && lead.status !== "needs-triage" && lead.status !== "new";

  function handleClaim() {
    void toastResult(claimLead(lead.id, currentUser.id), { title: "Lead claimed", description: `You're now the owner of ${lead.name}'s inquiry.` });
  }

  function handleReassign(userId: string | undefined) {
    const user = users.find((u) => u.id === userId);
    void toastResult(reassignLead(lead.id, userId), user ? `Reassigned to ${user.name}` : "Lead unassigned");
  }

  function handleStatusChange(status: LeadStatus) {
    const label = resolvableStatuses.find((s) => s.value === status)?.label ?? status;
    const shouldAutoClaim = !lead.assignedToId && status !== "new";
    // One update, not two: the status change and the auto-claim land together or not at all.
    void toastResult(
      updateStatus(lead.id, status, shouldAutoClaim ? currentUser.id : undefined),
      shouldAutoClaim
        ? { title: `Claimed and marked as ${label}`, description: "An unclaimed lead is automatically claimed by whoever updates its status." }
        : `Marked as ${label}`,
    );
  }

  function handleResolveTriage(department: Department) {
    void toastResult(resolveTriage(lead.id, department), {
      title: `Routed to ${departmentLabels[department]}`,
      description: "Now showing as a new lead in that queue.",
    });
  }

  return {
    currentUser,
    meta,
    assignedUser,
    responseClock,
    windowHours,
    windowIsCommitment,
    /** People a lead can be handed to: active accounts only. */
    assignableUsers: users.filter((u) => u.active !== false),
    stageClock,
    languageMismatch,
    orphaned,
    handleClaim,
    handleReassign,
    handleStatusChange,
    handleResolveTriage,
  };
}
