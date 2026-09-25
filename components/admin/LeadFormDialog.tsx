"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { serviceOptions } from "@/lib/serviceOptions";
import type { Lead, LeadServiceValue } from "@/lib/admin/types";
import { useLeadActions, type NewLeadInput } from "@/components/admin/providers/LeadsProvider";

const sourceOptions: { value: NewLeadInput["source"]; label: string }[] = [
  { value: "manual-phone", label: "Phone call" },
  { value: "manual-email", label: "Direct email" },
  { value: "manual-other", label: "In person / other" },
];

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

type Props =
  | { open: boolean; onClose: () => void; mode: "create" }
  | { open: boolean; onClose: () => void; mode: "edit"; lead: Lead };

/** Shared by "Log a New Lead" and "Edit Lead" — same fields, same layout, different verbs and a source picker only creation needs. */
export function LeadFormDialog(props: Props) {
  const { open, onClose } = props;
  const { addLead, editLead } = useLeadActions();
  const formId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState<LeadServiceValue | "">("");
  const [language, setLanguage] = useState<"English" | "French">("English");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState<NewLeadInput["source"]>("manual-phone");
  const [saving, setSaving] = useState(false);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && service !== "" && message.trim() !== "";

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      const { lead } = props;
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setCompany(lead.company ?? "");
      setService(lead.service);
      setLanguage(lead.language);
      setMessage(lead.message);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setService("");
      setLanguage("English");
      setMessage("");
      setSource("manual-phone");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    const result =
      props.mode === "edit"
        ? await editLead(props.lead.id, { name, email, phone, company: company || undefined, service, language, message })
        : await addLead({ name, email, phone, company: company || undefined, service, language, message, source });
    setSaving(false);
    if (!result.ok) {
      toast.error("Not saved", { description: result.reasons[0] });
      return;
    }
    toast.success(props.mode === "edit" ? "Lead updated" : "Lead logged", {
      description: props.mode === "edit" ? undefined : `${name} was added to the register.`,
    });
    onClose();
  }

  const isEdit = props.mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {isEdit ? "Edit Lead" : "Log a New Lead"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form id={formId} onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {!isEdit && (
            <p className="mb-4 text-xs text-slate-500">
              For anything that reached you by phone, WhatsApp, or in person — not the web form, which isn&apos;t wired
              to this system yet.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Full Name <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="Their full name" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Email <span className="text-rose-500">*</span>
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} placeholder="them@email.com" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Phone / WhatsApp <span className="text-rose-500">*</span>
              </span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClasses} placeholder="+237 6XX XXX XXX" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Company / Organization</span>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClasses} placeholder="Leave blank if not applicable" />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                What do they need help with? <span className="text-rose-500">*</span>
              </span>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as LeadServiceValue)}
                required
                className={`${inputClasses} bg-white`}
              >
                <option value="">Select a service</option>
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {!isEdit && (
              <label className="flex flex-col gap-1.5">
                <span className={labelClasses}>How did this reach you?</span>
                <select value={source} onChange={(e) => setSource(e.target.value as NewLeadInput["source"])} className={`${inputClasses} bg-white`}>
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <fieldset className={`flex flex-col gap-1.5 ${isEdit ? "sm:col-span-2" : ""}`}>
              <legend className={`${labelClasses} mb-1`}>Preferred language</legend>
              <div className="flex gap-2">
                {(["English", "French"] as const).map((lang) => (
                  <label
                    key={lang}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      language === lang ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <input type="radio" name="lead-language" value={lang} checked={language === lang} onChange={() => setLanguage(lang)} className="sr-only" />
                    {lang}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                {isEdit ? "Message" : "What did they say?"} <span className="text-rose-500">*</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder="Summarize the inquiry in their own words, as closely as you can."
              />
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={!canSubmit || saving}
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEdit ? "Save Changes" : "Log Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
