"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CARD_SURFACE, buttonClasses, hintClasses, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { useAdminUsers, useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useSettings } from "@/components/admin/providers/SettingsProvider";
import { useLeads } from "@/components/admin/providers/LeadsProvider";
import { toastResult } from "@/lib/admin/toastResult";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { RESPONSE_SLA_HOURS } from "@/lib/admin/leadStaleness";
import { canEditSystemSettings, isPoolEligible, nextAssignee, validateAssignment, type DepartmentAssignment } from "@/lib/admin/settings";
import type { Department } from "@/lib/admin/types";

const departments: Department[] = ["career-services-operations", "business-formalisation-compliance"];

function DepartmentCard({ department }: { department: Department }) {
  const currentUser = useCurrentUser();
  const users = useAdminUsers();
  const { settings, saveAssignment } = useSettings();
  const leads = useLeads();
  const saved = settings.assignment[department];
  const [draft, setDraft] = useState<DepartmentAssignment>(saved);
  const editable = canEditSystemSettings(currentUser);

  const eligible = users.filter((u) => isPoolEligible(u, department));
  // People saved in the pool who no longer qualify (moved, deactivated, made a Viewer): shown so nobody wonders why they get no leads.
  const stale = draft.poolUserIds.map((id) => users.find((u) => u.id === id)).filter((u) => u && !isPoolEligible(u, department));
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const errors = validateAssignment(draft, users, department);
  // Whose turn is next: after the owner of this department's most recent auto-assignable lead.
  const lastAssigned = leads.find((l) => l.department === department && l.assignedToId && draft.poolUserIds.includes(l.assignedToId))?.assignedToId;
  const upNext = nextAssignee(draft, users, department, lastAssigned);
  const roundRobin = draft.mode === "round-robin";

  function set<K extends keyof DepartmentAssignment>(key: K, value: DepartmentAssignment[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function togglePool(id: string, on: boolean) {
    setDraft((prev) => ({ ...prev, poolUserIds: on ? [...prev.poolUserIds, id] : prev.poolUserIds.filter((p) => p !== id) }));
  }

  function save() {
    void toastResult(saveAssignment(department, draft, currentUser), "Assignment settings saved");
  }

  return (
    <section className={`${CARD_SURFACE} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-sans text-sm font-bold text-navy-950">{departmentLabels[department]}</h3>
          <p className={hintClasses}>
            {!saved.enabled || saved.mode === "manual"
              ? "Now: new leads wait in the list for someone to claim them."
              : `Now: round-robin across ${saved.poolUserIds.length} ${saved.poolUserIds.length === 1 ? "person" : "people"}.`}
          </p>
        </div>
        {roundRobin && (
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={draft.enabled}
              disabled={!editable}
              onChange={(e) => set("enabled", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
            />
            {draft.enabled ? "On" : "Paused"}
          </label>
        )}
      </div>

      <fieldset className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" disabled={!editable}>
        <legend className={`${labelClasses} mb-1.5`}>How new leads are assigned</legend>
        {(
          [
            { value: "round-robin", label: "Round-robin", hint: "Each new lead goes to the next person in the pool." },
            { value: "manual", label: "Manual", hint: "Leads wait in the list and staff claim them." },
          ] as const
        ).map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
              draft.mode === option.value ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <input
              type="radio"
              name={`${department}-mode`}
              checked={draft.mode === option.value}
              onChange={() => setDraft((prev) => ({ ...prev, mode: option.value, enabled: option.value === "round-robin" ? true : prev.enabled }))}
              className="sr-only"
            />
            <span className={`block text-sm font-semibold ${draft.mode === option.value ? "text-teal-800" : "text-slate-700"}`}>{option.label}</span>
            <span className="block text-[11px] text-slate-500">{option.hint}</span>
          </label>
        ))}
      </fieldset>

      {roundRobin && (
        <div className="mt-4">
          <p className={labelClasses}>Pool</p>
          <p className={`${hintClasses} mb-2`}>Active Editors and Administrators in this department. Viewers can&apos;t work leads.</p>
          {eligible.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
              Nobody in this department can take leads yet. Add an Editor under Users &amp; roles.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {eligible.map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`Include ${user.name}`}
                    checked={draft.poolUserIds.includes(user.id)}
                    disabled={!editable}
                    onChange={(e) => togglePool(user.id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="block text-[11px] text-slate-500">
                      {roleLabels[user.role]} · {user.languages.join(" & ")}
                    </span>
                  </span>
                  {draft.enabled && upNext === user.id && (
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-teal-700">Next up</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {stale.length > 0 && (
            <p className="mt-2 flex gap-1.5 text-xs text-amber-800">
              <MaterialIcon name="warning" className="text-[14px]" />
              {stale.map((u) => u?.name).join(", ")} {stale.length === 1 ? "is" : "are"} still listed but no longer eligible, so they&apos;re skipped.
            </p>
          )}
        </div>
      )}

      <label className="mt-4 flex max-w-sm flex-col gap-1.5">
        <span className={labelClasses}>Escalation window (hours)</span>
        <input
          type="number"
          min={1}
          max={RESPONSE_SLA_HOURS}
          value={draft.escalationHours}
          disabled={!editable}
          onChange={(e) => set("escalationHours", Math.round(Number(e.target.value)))}
          className={inputClasses}
        />
        <span className={hintClasses}>
          A new lead nobody has contacted is flagged after this long. At most {RESPONSE_SLA_HOURS}: the site promises a reply within one business day.
        </span>
      </label>

      {editable && (
        <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          {errors.length > 0 && <p className="mr-auto text-xs text-rose-700">{errors[0]}</p>}
          {dirty && (
            <button type="button" onClick={() => setDraft(saved)} className={buttonClasses.ghost}>
              Discard
            </button>
          )}
          <button type="button" onClick={save} disabled={!dirty || errors.length > 0} className={buttonClasses.primary}>
            Save
          </button>
        </div>
      )}
    </section>
  );
}

/** Spec 4.1. Changes apply to leads logged from now on — nothing already assigned is reshuffled. */
export function AssignmentSettings() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Applies to leads logged or routed from now on. Leads that already have an owner keep them. Every change is recorded in
        the Activity feed.
      </p>
      {departments.map((department) => (
        <DepartmentCard key={department} department={department} />
      ))}
    </div>
  );
}
