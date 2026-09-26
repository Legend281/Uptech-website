"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import type { AccessRole, Department } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

const ROLE_OPTIONS: AccessRole[] = ["administrator", "editor", "viewer"];
const DEPARTMENT_OPTIONS: Department[] = ["career-services-operations", "business-formalisation-compliance"];
const LANGUAGE_OPTIONS = ["English", "French"] as const;

/**
 * Posts to /api/admin/staff — a real Supabase Auth invite, no password ever
 * typed by the admin (see that route's own comment for why). Requires
 * custom SMTP configured in the Supabase dashboard for the invite email to
 * actually arrive; the API call still succeeds without it (Supabase's
 * limited default sender attempts delivery), so this isn't blocked on that
 * setup, just less reliable until it's done.
 */
export function StaffInviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccessRole>("editor");
  const [department, setDepartment] = useState<Department>("career-services-operations");
  const [avatarInitials, setAvatarInitials] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && avatarInitials.trim() !== "" && location.trim() !== "" && languages.length > 0;

  function toggleLanguage(lang: string) {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));
  }

  function resetForm() {
    setName("");
    setEmail("");
    setRole("editor");
    setDepartment("career-services-operations");
    setAvatarInitials("");
    setLocation("");
    setLanguages(["English"]);
    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, department, avatarInitials, location, languages }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
      }
      toast.success("Invite sent", { description: `${name} will get an email to set up their account.` });
      resetForm();
      onClose();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div
        className="absolute inset-0 bg-navy-950/50"
        onClick={() => {
          resetForm();
          onClose();
        }}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            Invite Staff Member
          </h2>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form id={formId} onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-4 text-xs text-slate-500">
            They&apos;ll get an email with a link to set their own password — you never see or handle it.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Full Name <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="e.g. Aline Ngu" />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Email <span className="text-rose-500">*</span>
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} placeholder="name@uptechconsulting.com" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as AccessRole)} className={`${inputClasses} bg-white`}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Department</span>
              <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} className={`${inputClasses} bg-white`}>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {departmentLabels[d]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Initials <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value.slice(0, 4))}
                required
                maxLength={4}
                className={inputClasses}
                placeholder="e.g. AN"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Location <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className={inputClasses} placeholder="e.g. Buea, Cameroon" />
            </label>

            <fieldset className="flex flex-col gap-1.5 sm:col-span-2">
              <legend className={labelClasses}>Languages Spoken</legend>
              <div className="flex gap-3">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <label
                    key={lang}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                      languages.includes(lang) ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <input type="checkbox" checked={languages.includes(lang)} onChange={() => toggleLanguage(lang)} className="sr-only" />
                    {lang}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {status === "error" && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={!canSubmit || status === "submitting"}
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "submitting" ? "Sending Invite…" : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
