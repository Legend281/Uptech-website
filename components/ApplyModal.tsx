"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TurnstileWidget } from "@/components/TurnstileWidget";

const CONTACT_EMAIL = "infos@uptechconsulting.com";

function mailtoFallback(roleTitle?: string): string {
  const subject = roleTitle ? `Application — ${roleTitle}` : "General Interest — Future Opportunities";
  const body = roleTitle
    ? `Hi Uptech Consulting,\n\nI'd like to apply for the ${roleTitle} role.\n\nName:\nLocation:\nLinkedIn / portfolio (optional):\n\nPlease attach your CV before sending this email.\n\n`
    : "Hi Uptech Consulting,\n\nI don't see an open role that matches my background right now, but I'd like to be considered for future opportunities.\n\nName:\nArea of interest:\nLocation:\nLinkedIn / portfolio (optional):\n\nPlease attach your CV before sending this email.\n\n";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The real submission path behind "Apply for This Role" / "Send Us Your CV"
 * — replaces what used to be a mailto: link (see OpenPositions.tsx's own
 * history). Posts multipart/form-data to /api/apply, which uploads the
 * resume to Supabase Storage and creates a real Lead record (service:
 * career-marketing, source: careers-apply) per Admin_Dashboard_Requirements
 * .md Section 3.11. roleTitle is undefined for the general "Send Us Your
 * CV" case (no open positions, or no specific role selected).
 */
export function ApplyModal({ open, onClose, roleTitle }: { open: boolean; onClose: () => void; roleTitle?: string }) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<"English" | "French">("English");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setLanguage("English");
    setResumeFile(null);
    setConsent(false);
    setTurnstileToken(null);
    setStatus("idle");
    setErrorMessage(null);
  }, [open, roleTitle]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const canSend = name.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && Boolean(resumeFile) && consent;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSend || status === "submitting" || !resumeFile) return;
    setStatus("submitting");
    setErrorMessage(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("language", language);
    if (roleTitle) formData.set("roleTitle", roleTitle);
    if (message.trim()) formData.set("message", message.trim());
    formData.set("consent", "true");
    if (turnstileToken) formData.set("turnstileToken", turnstileToken);
    formData.set("resume", resumeFile);

    try {
      const response = await fetch("/api/apply", { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {roleTitle ? `Apply — ${roleTitle}` : "Send Us Your CV"}
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

        {status === "success" ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <MaterialIcon name="check_circle" className="text-[28px]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-navy-950">Application received</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Thanks, {name.split(" ")[0]} — we&apos;ve received your resume and will be in touch if it&apos;s a fit.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-lg bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-900"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <form id={formId} onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Full Name <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+237 6XX XXX XXX"
                    className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                </label>

                <fieldset className="flex flex-col gap-1.5 sm:col-span-2">
                  <legend className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Preferred language</legend>
                  <div className="flex gap-3">
                    {(["English", "French"] as const).map((lang) => (
                      <label
                        key={lang}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                          language === lang ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        <input type="radio" name="language" value={lang} checked={language === lang} onChange={() => setLanguage(lang)} className="sr-only" />
                        {lang}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resume / CV <span className="text-rose-500">*</span>
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    required
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3.5 py-2.5 text-sm text-slate-500 hover:border-teal-400 hover:text-teal-700"
                  >
                    <MaterialIcon name="upload_file" className="text-[18px]" />
                    {resumeFile ? resumeFile.name : "Choose a PDF or Word file (max 5MB)"}
                  </button>
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Anything you&apos;d like to add? (optional)</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                </label>
              </div>

              <label className="mt-4 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I agree to Uptech Consulting storing and reviewing my information as described in the{" "}
                  <a href="/privacy-policy" className="text-blue-accent underline hover:text-blue-700">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <div className="mt-4">
                <TurnstileWidget onVerify={setTurnstileToken} />
              </div>

              {status === "error" && (
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <p>{errorMessage ?? "Something went wrong. Please try again."}</p>
                  <p className="mt-1.5">
                    Or{" "}
                    <a href={mailtoFallback(roleTitle)} className="font-semibold underline hover:text-rose-800">
                      email us directly
                    </a>{" "}
                    with your resume attached instead.
                  </p>
                </div>
              )}
            </form>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                type="submit"
                form={formId}
                disabled={!canSend || status === "submitting"}
                className="inline-flex items-center gap-2 rounded-lg gradient-teal-blue px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/40 transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MaterialIcon name={status === "submitting" ? "hourglass_top" : "send"} className="text-[16px]" />
                {status === "submitting" ? "Sending…" : "Submit Application"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
