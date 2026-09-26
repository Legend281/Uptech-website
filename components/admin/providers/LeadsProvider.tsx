"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { deriveLeadType } from "@/lib/admin/leads";
import type { Lead, LeadServiceValue, LeadSource, LeadStatus, LeadType, Department } from "@/lib/admin/types";

/*
 * Real Supabase reads/writes — replaces what used to be a localStorage-only
 * store (see this file's own prior history: "Real persistence needs
 * Supabase Auth and RLS scoped to staff, which don't exist yet"). Those now
 * exist (supabase/003_staff_auth.sql), so this reads whatever the signed-in
 * user's RLS scope allows (their own department + needs-triage, or
 * everything for an Administrator) and writes straight back to Postgres.
 *
 * Writes are optimistic (update local state immediately, fire the Supabase
 * call after) with no rollback on failure — errors are logged, not silently
 * retried or reverted. That matches this codebase's existing best-effort
 * posture elsewhere (e.g. a failed localStorage write here used to just be a
 * swallowed comment) rather than a new pattern invented for this file. A
 * failed write leaves the local UI and the database disagreeing until the
 * next reload, which is a real, known gap — full rollback-on-failure is a
 * reasonable follow-up, not built here.
 */

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  type: string;
  department: string | null;
  status: string;
  source: string;
  language: string;
  message: string;
  assigned_to_id: string | null;
  consent_at: string | null;
  created_at: string;
  first_contacted_at: string | null;
  status_changed_at: string;
  was_manually_triaged: boolean;
  resume_url: string | null;
};

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company ?? undefined,
    service: row.service as LeadServiceValue,
    type: row.type as LeadType,
    department: (row.department as Department | null) ?? undefined,
    status: row.status as LeadStatus,
    source: row.source as LeadSource,
    language: row.language as "English" | "French",
    message: row.message,
    createdAt: row.created_at,
    assignedToId: row.assigned_to_id ?? undefined,
    consentAt: row.consent_at ?? undefined,
    firstContactedAt: row.first_contacted_at ?? undefined,
    statusChangedAt: row.status_changed_at,
    wasManuallyTriaged: row.was_manually_triaged,
    resumeUrl: row.resume_url ?? undefined,
  };
}

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
  addLead: (input: NewLeadInput) => Promise<Lead>;
  editLead: (id: string, input: EditableLeadFields) => void;
  deleteLead: (id: string) => void;
  claimLead: (id: string, userId: string) => void;
  reassignLead: (id: string, userId: string | undefined) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  resolveTriage: (id: string, department: Department) => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[leads] Failed to load leads:", error);
          return;
        }
        setLeads((data as LeadRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));

    const row: Record<string, unknown> = {};
    if ("name" in patch) row.name = patch.name;
    if ("email" in patch) row.email = patch.email;
    if ("phone" in patch) row.phone = patch.phone;
    if ("company" in patch) row.company = patch.company ?? null;
    if ("service" in patch) row.service = patch.service;
    if ("type" in patch) row.type = patch.type;
    if ("department" in patch) row.department = patch.department ?? null;
    if ("status" in patch) row.status = patch.status;
    if ("message" in patch) row.message = patch.message;
    if ("language" in patch) row.language = patch.language;
    if ("assignedToId" in patch) row.assigned_to_id = patch.assignedToId ?? null;
    if ("firstContactedAt" in patch) row.first_contacted_at = patch.firstContactedAt ?? null;
    if ("statusChangedAt" in patch) row.status_changed_at = patch.statusChangedAt;
    if ("wasManuallyTriaged" in patch) row.was_manually_triaged = patch.wasManuallyTriaged;

    getSupabaseBrowserClient()
      .from("leads")
      .update(row)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[leads] Failed to save update for lead ${id}:`, error);
      });
  }

  async function addLead(input: NewLeadInput): Promise<Lead> {
    const supabase = getSupabaseBrowserClient();
    const type = deriveLeadType(input.service);
    // A manually-logged lead is always entered by staff who already know
    // which department it belongs to (that's the point of logging it by
    // hand) — unlike a public-form submission, there's no ambiguous case to
    // route to needs-triage here.
    const department: Department = type === "job-seeker" ? "career-services-operations" : "business-formalisation-compliance";

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        company: input.company?.trim() || null,
        service: input.service,
        type,
        department,
        status: "new",
        source: input.source,
        language: input.language,
        message: input.message.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to save the new lead.");
    }

    const lead = fromRow(data as LeadRow);
    setLeads((prev) => [lead, ...prev]);
    return lead;
  }

  function editLead(id: string, input: EditableLeadFields) {
    // Deliberately leaves department/status untouched — correcting a typo'd
    // phone number shouldn't silently override a triage decision a human
    // already made. Only `type` is safe to recompute from the (possibly
    // changed) service, since it has no "manually resolved" state to protect.
    updateLead(id, {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      company: input.company?.trim() || undefined,
      service: input.service,
      type: deriveLeadType(input.service),
      language: input.language,
      message: input.message.trim(),
    });
  }

  function deleteLead(id: string) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    getSupabaseBrowserClient()
      .from("leads")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[leads] Failed to delete lead ${id}:`, error);
      });
  }

  function claimLead(id: string, userId: string) {
    updateLead(id, { assignedToId: userId });
  }

  function reassignLead(id: string, userId: string | undefined) {
    updateLead(id, { assignedToId: userId });
  }

  function updateStatus(id: string, status: LeadStatus) {
    const lead = leads.find((candidate) => candidate.id === id);
    if (!lead) return;
    const now = new Date().toISOString();
    const leavingUncontacted = (lead.status === "new" || lead.status === "needs-triage") && status !== "new" && status !== "needs-triage";
    updateLead(id, {
      status,
      statusChangedAt: now,
      firstContactedAt: lead.firstContactedAt ?? (leavingUncontacted ? now : lead.firstContactedAt),
    });
  }

  function resolveTriage(id: string, department: Department) {
    updateLead(id, { department, status: "new", statusChangedAt: new Date().toISOString(), wasManuallyTriaged: true });
  }

  return (
    <LeadsContext.Provider value={{ leads, addLead, editLead, deleteLead, claimLead, reassignLead, updateStatus, resolveTriage }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads(): Lead[] {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx.leads;
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
