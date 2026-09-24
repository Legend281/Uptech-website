"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockLeads } from "@/lib/admin/mockData";
import { deriveDepartment, deriveLeadType } from "@/lib/admin/leads";
import type { Lead, LeadServiceValue, LeadSource, LeadStatus, Department } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-leads-v2";

/*
 * Real persistence (Phase B's admin-read side) needs Supabase Auth and RLS
 * scoped to staff, which don't exist yet — the leads table's RLS
 * deliberately allows only anon INSERT (see supabase/001_leads_table.sql),
 * so the dashboard has no way to read real submitted leads without staff
 * auth in front of it. Until then, this store is the whole leads dataset —
 * seeded from mockLeads, then fully mutable and persisted to localStorage.
 * That's a genuine limitation: these edits (claims, status changes, newly
 * logged leads) only exist in the browser that made them, not shared
 * across staff or devices, until real auth + a server-side store replace
 * this.
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
  addLead: (input: NewLeadInput) => Lead;
  editLead: (id: string, input: EditableLeadFields) => void;
  deleteLead: (id: string) => void;
  claimLead: (id: string, userId: string) => void;
  reassignLead: (id: string, userId: string | undefined) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  resolveTriage: (id: string, department: Department) => void;
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

export function LeadsProvider({ children }: { children: ReactNode }) {
  // Seeded with the static mock set on first render so server and client
  // markup match exactly; the real localStorage read (which may include
  // edits from a previous visit) happens after mount, below.
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads((prev) => {
      const next = prev.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead));
      saveLeads(next);
      return next;
    });
  }

  function addLead(input: NewLeadInput): Lead {
    const department = deriveDepartment(input.service);
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
      // An ambiguous service (no derivable department) always lands in
      // needs-triage, regardless of what a form might otherwise imply —
      // never silently guessed.
      status: department ? "new" : "needs-triage",
      source: input.source,
      language: input.language,
      message: input.message.trim(),
      createdAt: now,
      statusChangedAt: now,
      // No consent timestamp: a manually-logged lead never had a checkbox
      // to tick — the visitor didn't go through the form.
    };
    setLeads((prev) => {
      const next = [lead, ...prev];
      saveLeads(next);
      return next;
    });
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
    setLeads((prev) => {
      const next = prev.filter((lead) => lead.id !== id);
      saveLeads(next);
      return next;
    });
  }

  function claimLead(id: string, userId: string) {
    updateLead(id, { assignedToId: userId });
  }

  function reassignLead(id: string, userId: string | undefined) {
    updateLead(id, { assignedToId: userId });
  }

  function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => {
      const next = prev.map((lead) => {
        if (lead.id !== id) return lead;
        const now = new Date().toISOString();
        const leavingUncontacted =
          (lead.status === "new" || lead.status === "needs-triage") && status !== "new" && status !== "needs-triage";
        return {
          ...lead,
          status,
          statusChangedAt: now,
          firstContactedAt: lead.firstContactedAt ?? (leavingUncontacted ? now : lead.firstContactedAt),
        };
      });
      saveLeads(next);
      return next;
    });
  }

  function resolveTriage(id: string, department: Department) {
    setLeads((prev) => {
      const next = prev.map((lead) => {
        if (lead.id !== id) return lead;
        const now = new Date().toISOString();
        return { ...lead, department, status: "new" as LeadStatus, statusChangedAt: now };
      });
      saveLeads(next);
      return next;
    });
  }

  return (
    <LeadsContext.Provider
      value={{ leads, addLead, editLead, deleteLead, claimLead, reassignLead, updateStatus, resolveTriage }}
    >
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
