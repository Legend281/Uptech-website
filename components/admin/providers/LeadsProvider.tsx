"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockLeads } from "@/lib/admin/mockData";
import { deriveDepartment, deriveLeadType } from "@/lib/admin/leads";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useAdminUsers, useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useSettings } from "@/components/admin/providers/SettingsProvider";
import { severityMeta, leadStatusToSeverity } from "@/lib/admin/register";
import { departmentLabels } from "@/lib/admin/labels";
import { nextAssignee } from "@/lib/admin/settings";
import type { ActionResult, Lead, LeadServiceValue, LeadSource, LeadStatus, Department } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-leads-v2";

/*
 * Real persistence (Phase B's admin-read side) needs staff auth and RLS
 * scoped to staff — the leads table's RLS deliberately allows only anon
 * INSERT (see supabase/001_leads_table.sql). Until then, this store is the
 * whole leads dataset — seeded from mockLeads, then fully mutable and
 * persisted to localStorage. That's a genuine limitation: these edits
 * (claims, status changes, newly logged leads) only exist in the browser
 * that made them, not shared across staff or devices.
 *
 * Actions return a Promise so callers already wait for an answer, the same
 * way they will once this reads and writes the database.
 */

export type NewLeadInput = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: LeadServiceValue;
  language: "English" | "French";
  message: string;
  source: Extract<LeadSource, "manual-phone" | "manual-email" | "manual-other">;
};

export type EditableLeadFields = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: LeadServiceValue;
  language: "English" | "French";
  message: string;
};

type LeadsContextValue = {
  leads: Lead[];
  loading: boolean;
  addLead: (input: NewLeadInput) => Promise<ActionResult & { autoAssignee?: string }>;
  editLead: (id: string, input: EditableLeadFields) => Promise<ActionResult>;
  deleteLead: (id: string) => Promise<ActionResult>;
  claimLead: (id: string, userId: string) => Promise<ActionResult>;
  reassignLead: (id: string, userId: string | undefined) => Promise<ActionResult>;
  updateStatus: (id: string, status: LeadStatus, alsoClaimFor?: string) => Promise<ActionResult>;
  resolveTriage: (id: string, department: Department) => Promise<ActionResult>;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function loadLeads(): Lead[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockLeads;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as Lead[]) : mockLeads;
  } catch {
    return mockLeads;
  }
}

function saveLeads(leads: Lead[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Best-effort only — a private window or blocked storage shouldn't break the page.
  }
}

function makeLeadId(): string {
  return `lead-manual-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const OK: ActionResult = { ok: true };
const missing: ActionResult = { ok: false, reasons: ["This lead no longer exists."] };

export function LeadsProvider({ children }: { children: ReactNode }) {
  // Seeded with the static mock set on first render so server and client
  // markup match exactly; the real localStorage read happens after mount.
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const logActivity = useLogActivity();
  const currentUser = useCurrentUser();
  const users = useAdminUsers();
  const { settings } = useSettings();

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  function commit(next: Lead[]) {
    setLeads(next);
    saveLeads(next);
  }

  // Every lead change lands in the Activity feed (Admin_Content_Pages_Spec.md 0.2).
  function log(icon: string, description: string, leadId?: string) {
    logActivity({ icon, description, relatedHref: leadId ? `/admin/leads/${leadId}` : "/admin/leads" });
  }
  function nameOf(userId: string | undefined): string {
    return users.find((u) => u.id === userId)?.name ?? "someone";
  }

  /** Settings 4.1 round-robin: whoever comes after the owner of the department's most recent assigned lead. */
  function autoAssigneeFor(department: Department): string | undefined {
    const config = settings.assignment[department];
    const last = [...leads]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .find((l) => l.department === department && l.assignedToId && config.poolUserIds.includes(l.assignedToId));
    return nextAssignee(config, users, department, last?.assignedToId);
  }

  function patchLead(id: string, patch: Partial<Lead>) {
    commit(leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
  }

  async function addLead(input: NewLeadInput): Promise<ActionResult & { autoAssignee?: string }> {
    const department = deriveDepartment(input.service);
    const autoAssignee = department ? autoAssigneeFor(department) : undefined;
    const now = new Date().toISOString();
    const lead: Lead = {
      id: makeLeadId(),
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      company: input.company?.trim() || undefined,
      service: input.service,
      type: deriveLeadType(input.service),
      department,
      // An ambiguous service always lands in needs-triage — never silently guessed.
      status: department ? "new" : "needs-triage",
      source: input.source,
      language: input.language,
      message: input.message.trim(),
      createdAt: now,
      statusChangedAt: now,
      assignedToId: autoAssignee,
      // No consent timestamp: a manually-logged lead never had a checkbox to tick.
    };
    commit([lead, ...leads]);
    log("person_add", `${currentUser.name} logged a new lead: ${lead.name}.`, lead.id);
    if (autoAssignee) log("manage_accounts", `${lead.name}'s inquiry was auto-assigned to ${nameOf(autoAssignee)} (round-robin).`, lead.id);
    return { ok: true, autoAssignee };
  }

  async function editLead(id: string, input: EditableLeadFields): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return missing;
    // Leaves department/status untouched — correcting a typo'd phone number
    // shouldn't silently override a triage decision a human already made.
    patchLead(id, {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      company: input.company?.trim() || undefined,
      service: input.service,
      type: deriveLeadType(input.service),
      language: input.language,
      message: input.message.trim(),
    });
    log("edit_note", `${currentUser.name} edited ${lead.name}'s lead details.`, id);
    return OK;
  }

  async function deleteLead(id: string): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return OK;
    commit(leads.filter((l) => l.id !== id));
    log("delete", `${currentUser.name} deleted ${lead.name}'s lead.`);
    return OK;
  }

  async function claimLead(id: string, userId: string): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return missing;
    patchLead(id, { assignedToId: userId });
    log("how_to_reg", `${nameOf(userId)} claimed ${lead.name}'s inquiry.`, id);
    return OK;
  }

  async function reassignLead(id: string, userId: string | undefined): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return missing;
    patchLead(id, { assignedToId: userId });
    log(
      "manage_accounts",
      userId ? `${currentUser.name} assigned ${lead.name}'s inquiry to ${nameOf(userId)}.` : `${currentUser.name} unassigned ${lead.name}'s inquiry.`,
      id,
    );
    return OK;
  }

  async function updateStatus(id: string, status: LeadStatus, alsoClaimFor?: string): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return missing;
    const now = new Date().toISOString();
    const leavingUncontacted = (lead.status === "new" || lead.status === "needs-triage") && status !== "new" && status !== "needs-triage";
    patchLead(id, {
      status,
      statusChangedAt: now,
      firstContactedAt: lead.firstContactedAt ?? (leavingUncontacted ? now : undefined),
      ...(alsoClaimFor ? { assignedToId: alsoClaimFor } : {}),
    });
    log("edit_note", `${currentUser.name} moved ${lead.name} to “${severityMeta[leadStatusToSeverity[status]].label}”.`, id);
    if (alsoClaimFor) log("how_to_reg", `${nameOf(alsoClaimFor)} claimed ${lead.name}'s inquiry.`, id);
    return OK;
  }

  async function resolveTriage(id: string, department: Department): Promise<ActionResult> {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return missing;
    const autoAssignee = lead.assignedToId ? undefined : autoAssigneeFor(department);
    patchLead(id, { department, status: "new", statusChangedAt: new Date().toISOString(), assignedToId: lead.assignedToId ?? autoAssignee });
    log("fact_check", `${currentUser.name} routed ${lead.name} to ${departmentLabels[department]}.`, id);
    if (autoAssignee) log("manage_accounts", `${lead.name}'s inquiry was auto-assigned to ${nameOf(autoAssignee)} (round-robin).`, id);
    return OK;
  }

  return (
    <LeadsContext.Provider value={{ leads, loading: false, addLead, editLead, deleteLead, claimLead, reassignLead, updateStatus, resolveTriage }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads(): Lead[] {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx.leads;
}

export function useLeadsLoading(): boolean {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeadsLoading must be used within LeadsProvider");
  return ctx.loading;
}

export function useLead(id: string): Lead | undefined {
  return useLeads().find((lead) => lead.id === id);
}

export function useLeadActions() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeadActions must be used within LeadsProvider");
  const { addLead, editLead, deleteLead, claimLead, reassignLead, updateStatus, resolveTriage } = ctx;
  return { addLead, editLead, deleteLead, claimLead, reassignLead, updateStatus, resolveTriage };
}
