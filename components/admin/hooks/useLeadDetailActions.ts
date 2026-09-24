import { toast } from "sonner";
import { useLeadActions } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import { departmentLabels } from "@/lib/admin/labels";
import { severityMeta, leadStatusToSeverity } from "@/lib/admin/register";
import { getResponseClock, getStageClock } from "@/lib/admin/leadStaleness";
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
 * What to actually do at each stage — without this, the status dropdown is
 * just a list of words with no indication of when to touch it. Closed
 * statuses get nothing; there's no "next" once a lead is won or lost.
 */
const NEXT_STEP_HINT: Partial<Record<LeadStatus, string>> = {
  new: "Reach out by email, call, or WhatsApp below — that'll move this to Contacted for you.",
  contacted: "Assessed the fit? Mark Qualified to move them forward, or Lost if it isn't a match.",
  qualified: "Ready for a consultation? Mark Consultation Booked once one's on the calendar.",
  "consultation-booked": "After the consultation happens, mark this Won or Lost.",
};

const CHANNEL_VERB: Record<"email" | "call" | "chat", string> = { email: "emailed", call: "called", chat: "messaged" };

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

  const meta = severityMeta[leadStatusToSeverity[lead.status]];
  const assignedUser = MOCK_ADMIN_USERS.find((user) => user.id === lead.assignedToId);
  const responseClock = getResponseClock(lead);
  const stageClock = getStageClock(lead);
  const languageMismatch = lead.language === "French" && Boolean(assignedUser) && !assignedUser?.languages.includes("French");
  const orphaned = !assignedUser && lead.status !== "needs-triage" && lead.status !== "new";
  const nextStepHint = NEXT_STEP_HINT[lead.status] ?? null;

  function handleClaim() {
    claimLead(lead.id, currentUser.id);
    toast.success("Lead claimed", { description: `You're now the owner of ${lead.name}'s inquiry.` });
  }

  function handleReassign(userId: string | undefined) {
    reassignLead(lead.id, userId);
    const user = MOCK_ADMIN_USERS.find((u) => u.id === userId);
    toast.success(user ? `Reassigned to ${user.name}` : "Lead unassigned");
  }

  function handleStatusChange(status: LeadStatus) {
    const label = resolvableStatuses.find((s) => s.value === status)?.label ?? status;
    const shouldAutoClaim = !lead.assignedToId && status !== "new";
    updateStatus(lead.id, status);
    if (shouldAutoClaim) {
      claimLead(lead.id, currentUser.id);
      toast.success(`Claimed and marked as ${label}`, {
        description: "An unclaimed lead is automatically claimed by whoever updates its status.",
      });
    } else {
      toast.success(`Marked as ${label}`);
    }
  }

  function handleResolveTriage(department: Department) {
    resolveTriage(lead.id, department);
    toast.success(`Routed to ${departmentLabels[department]}`, { description: "Now showing as a new lead in that queue." });
  }

  /*
   * Closes the gap between what actually happened and what the record says
   * happened: clicking Email/Call/WhatsApp IS contacting them, so there's no
   * reason to also make someone separately remember to flip the status
   * dropdown afterward. Only fires from "New" — a lead already past that
   * point doesn't need a second, redundant status bump every time someone
   * re-opens their email thread, and a still-unrouted needs-triage lead
   * should go through resolveTriage first, not skip straight to Contacted.
   */
  function handleContactChannelUsed(channel: "email" | "call" | "chat") {
    if (lead.status !== "new") return;
    const shouldAutoClaim = !lead.assignedToId;
    updateStatus(lead.id, "contacted");
    if (shouldAutoClaim) claimLead(lead.id, currentUser.id);
    toast.success("Marked as Contacted", {
      description: `Logged automatically since you just ${CHANNEL_VERB[channel]} them${shouldAutoClaim ? " — you're now the owner too." : "."}`,
    });
  }

  return {
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
  };
}
