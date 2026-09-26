"use client";

import { useId, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CARD_SURFACE, DialogShell, Field, buttonClasses, hintClasses, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { isActive, useStaff, useStaffActions } from "@/components/admin/providers/StaffProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { StaffInviteDialog } from "@/components/admin/StaffInviteDialog";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import type { AccessRole, AdminUser, Department } from "@/lib/admin/types";

const roleDescriptions: Record<AccessRole, string> = {
  administrator: "Everything: all content, all departments, Settings, accounts, and Homepage testimonials.",
  editor: "Leads and content for their own department only.",
  viewer: "Read-only, within their own department.",
};

const LANGUAGES = ["English", "French"] as const;
const LOCATIONS = ["Buea, Cameroon", "Stafford, TX"];

type Draft = { role: AccessRole; department: Department; languages: ("English" | "French")[]; location: string; active: boolean };

function RoleFields({
  draft,
  setDraft,
  lockRole,
  formId,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  lockRole: boolean;
  formId: string;
}) {
  return (
    <>
      <fieldset>
        <legend className={`${labelClasses} mb-1.5`}>Role</legend>
        <div className="space-y-2">
          {(Object.keys(roleDescriptions) as AccessRole[]).map((role) => (
            <label
              key={role}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 ${
                draft.role === role ? "border-teal-500 bg-teal-50" : "border-slate-300"
              } ${lockRole ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name={`${formId}-role`}
                checked={draft.role === role}
                disabled={lockRole}
                onChange={() => setDraft((prev) => ({ ...prev, role }))}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{roleLabels[role]}</span>
                <span className="block text-[11px] text-slate-500">{roleDescriptions[role]}</span>
              </span>
            </label>
          ))}
        </div>
        {lockRole && <p className={`${hintClasses} mt-1.5`}>You can&apos;t change your own role. Another Administrator has to.</p>}
      </fieldset>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Department">
          <select
            value={draft.department}
            onChange={(e) => setDraft((prev) => ({ ...prev, department: e.target.value as Department }))}
            className={`${inputClasses} bg-white`}
          >
            {(Object.keys(departmentLabels) as Department[]).map((d) => (
              <option key={d} value={d}>
                {departmentLabels[d]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Office">
          <select value={draft.location} onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))} className={`${inputClasses} bg-white`}>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <fieldset>
        <legend className={`${labelClasses} mb-1.5`}>Works in</legend>
        <div className="flex gap-4">
          {LANGUAGES.map((lang) => (
            <label key={lang} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.languages.includes(lang)}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    languages: e.target.checked ? [...prev.languages, lang] : prev.languages.filter((l) => l !== lang),
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
              />
              {lang}
            </label>
          ))}
        </div>
        <p className={`${hintClasses} mt-1`}>Used to flag a French-speaking lead claimed by someone who doesn&apos;t work in French.</p>
      </fieldset>
    </>
  );
}

function EditUserDialog({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const formId = useId();
  const currentUser = useCurrentUser();
  const { updateUser } = useStaffActions();
  const logActivity = useLogActivity();
  const isSelf = user.id === currentUser.id;
  const [draft, setDraft] = useState<Draft>({
    role: user.role,
    department: user.department,
    languages: user.languages,
    location: user.location,
    active: isActive(user),
  });

  // Spelled out before saving: permission changes deserve a second look (spec 4 — "review it more carefully").
  const changes = [
    draft.role !== user.role && `Role: ${roleLabels[user.role]} → ${roleLabels[draft.role]}`,
    draft.department !== user.department && `Department: ${departmentLabels[user.department]} → ${departmentLabels[draft.department]}`,
    draft.active !== isActive(user) && (draft.active ? "Reactivate the account" : "Deactivate the account"),
    draft.location !== user.location && `Office: ${user.location} → ${draft.location}`,
    draft.languages.join() !== user.languages.join() && `Languages: ${draft.languages.join(" & ") || "none"}`,
  ].filter(Boolean) as string[];

  const [saving, setSaving] = useState(false);

  async function save() {
    if (draft.languages.length === 0) return toast.error("Not saved", { description: "Pick at least one language." });
    setSaving(true);
    const result = await updateUser(user.id, draft, currentUser);
    setSaving(false);
    if (!result.ok) return toast.error("Not saved", { description: result.reason });
    logActivity({
      icon: draft.active === false ? "block" : "manage_accounts",
      description: `${currentUser.name} changed ${user.name}'s account: ${changes.join(", ") || "updated details"}.`,
      relatedHref: "/admin/settings",
    });
    toast.success("Account updated");
    onClose();
  }

  const footer = (
    <>
      <button type="button" onClick={onClose} className={buttonClasses.ghost}>
        Cancel
      </button>
      <button type="button" onClick={() => void save()} disabled={saving || changes.length === 0} className={buttonClasses.primary}>
        Save changes
      </button>
    </>
  );

  return (
    <DialogShell titleId={`${formId}-title`} title={`Edit ${user.name}`} onClose={onClose} footer={footer} size="medium">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <RoleFields draft={draft} setDraft={setDraft} lockRole={isSelf} formId={formId} />
        <label className={`flex items-start gap-2.5 rounded-lg border p-3 ${draft.active ? "border-slate-300" : "border-rose-200 bg-rose-50"}`}>
          <input
            type="checkbox"
            checked={!draft.active}
            disabled={isSelf}
            onChange={(e) => setDraft((prev) => ({ ...prev, active: !e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/40"
          />
          <span className="text-sm text-slate-700">
            <span className="block font-semibold">Deactivate this account</span>
            <span className="block text-xs text-slate-500">
              They can&apos;t sign in or be assigned leads. Their name stays on past work. Accounts are deactivated, never deleted.
            </span>
          </span>
        </label>
        {changes.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">You&apos;re about to change</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-amber-900">
              {changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DialogShell>
  );
}

/** Spec 4.2: who can sign in to this dashboard, and what they can touch. Distinct from the public Team Members roster. */
export function UsersSettings() {
  const currentUser = useCurrentUser();
  const users = useStaff();
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [adding, setAdding] = useState(false);
  const adminCount = users.filter((u) => u.role === "administrator" && isActive(u)).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Dashboard sign-in accounts, not the public team page. Role changes take effect immediately and are recorded in the
          Activity feed. There&apos;s always at least one active Administrator. {adminCount === 1 && "Right now there is exactly one."}
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          <MaterialIcon name="person_add" className="text-[16px]" />
          Add account
        </button>
      </div>

      <div className={`${CARD_SURFACE} overflow-hidden`}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th scope="col" className="px-4 py-2.5 sm:px-5">Person</th>
              <th scope="col" className="hidden px-3 py-2.5 md:table-cell">Department</th>
              <th scope="col" className="px-3 py-2.5">Role</th>
              <th scope="col" className="w-20 px-3 py-2.5"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b border-slate-100 last:border-b-0 ${isActive(user) ? "" : "bg-slate-50 text-slate-400"}`}>
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-bold text-white">{user.avatarInitials}</span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-950">
                        {user.name}
                        {user.id === currentUser.id && <span className="rounded bg-teal-50 px-1.5 py-px text-[10px] font-bold uppercase text-teal-700">You</span>}
                        {!isActive(user) && <span className="rounded bg-slate-200 px-1.5 py-px text-[10px] font-bold uppercase text-slate-600">Deactivated</span>}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {user.location} · {user.languages.join(" & ")}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-xs text-slate-600 md:table-cell">{departmentLabels[user.department]}</td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-700">{roleLabels[user.role]}</td>
                <td className="px-3 py-3 text-right">
                  <button type="button" onClick={() => setEditing(user)} className="rounded-md px-2 py-1 text-xs font-semibold text-blue-accent hover:bg-slate-100">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditUserDialog user={editing} onClose={() => setEditing(null)} />}
      <StaffInviteDialog open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}
