"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { serviceOptions, isServiceValue, type ServiceValue } from "@/lib/serviceOptions";

const CONTACT_EMAIL = "infos@uptechconsulting.com";

/*
 * Re-exported for anything already importing these from this file —
 * the actual definitions live in lib/serviceOptions.ts (a plain module,
 * not "use client") so Server Components can import them too.
 */
export { serviceOptions, isServiceValue };

export function ContactForm() {
  /*
   * Read directly via useSearchParams (client-side) rather than the parent
   * page awaiting the searchParams prop — an async Server Component that
   * awaits searchParams cannot be statically prerendered under
   * `output: "export"` (breaks the GitHub Pages preview build entirely).
   * This component is already "use client"; the page that renders it wraps
   * it in <Suspense> as Next.js requires for useSearchParams.
   */
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") ?? undefined;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState<ServiceValue | "">(
    initialService && isServiceValue(initialService) ? initialService : ""
  );
  const [language, setLanguage] = useState<"English" | "French">("English");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSend = name.trim() !== "" && email.trim() !== "" && message.trim() !== "" && consent;

  const serviceLabel = useMemo(
    () => serviceOptions.find((option) => option.value === service)?.label ?? "Not specified",
    [service]
  );

  const summary = useMemo(() => {
    const lines = [
      `Name: ${name || "—"}`,
      `Email: ${email || "—"}`,
      `Phone / WhatsApp: ${phone || "—"}`,
      `Company / Organization: ${company || "—"}`,
      `Interested in: ${serviceLabel}`,
      `Preferred language: ${language}`,
      "",
      message || "—",
    ];
    return lines.join("\n");
  }, [name, email, phone, company, serviceLabel, language, message]);

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Consultation request — ${serviceLabel}`
  )}&body=${encodeURIComponent(summary)}`;

  const buttonClasses = (enabled: boolean) =>
    `inline-flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all ${
      enabled
        ? "gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105 active:scale-[0.98]"
        : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend || status === "submitting") return;
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, service, language, message, consent }),
      });
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

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <MaterialIcon name="check_circle" className="text-[28px]" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-navy-950">Message sent</h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Thanks, {name.split(" ")[0]} — we&apos;ve received your message and will respond within 1 business day,
          usually sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Full Name <span className="text-rose-500">*</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            placeholder="Your full name"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Email <span className="text-rose-500">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            placeholder="you@email.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Phone / WhatsApp
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            placeholder="+237 6XX XXX XXX"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Company / Organization
          </span>
          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            placeholder="Leave blank if not applicable"
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            What are you reaching out about?
          </span>
          <select
            value={service}
            onChange={(event) => setService(event.target.value as ServiceValue)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
          >
            <option value="">Select a service</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-1.5 sm:col-span-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Preferred language
          </legend>
          <div className="flex gap-3">
            {(["English", "French"] as const).map((lang) => (
              <label
                key={lang}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                  language === lang
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-slate-300 text-slate-600 hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  checked={language === lang}
                  onChange={() => setLanguage(lang)}
                  className="sr-only"
                />
                {lang}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Message <span className="text-rose-500">*</span>
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={4}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 resize-none"
            placeholder="Briefly tell us what you need help with."
          />
        </label>
      </div>

      <label className="flex items-start gap-2.5 mt-5">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
        />
        <span className="text-xs text-slate-500 leading-relaxed">
          I agree to Uptech Consulting&apos;s{" "}
          <a href="/privacy-policy" className="text-blue-accent underline hover:text-blue-700">
            Privacy Policy
          </a>
          . My details are securely stored so a specialist can respond to this inquiry.
        </span>
      </label>

      {status === "error" && (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{errorMessage ?? "Something went wrong. Please try again."}</p>
          <p className="mt-1.5">
            Or{" "}
            <a href={canSend ? mailtoHref : undefined} className="font-semibold underline hover:text-rose-800">
              email us directly
            </a>{" "}
            instead.
          </p>
        </div>
      )}

      <div className="mt-6">
        <button type="submit" disabled={!canSend || status === "submitting"} className={buttonClasses(canSend && status !== "submitting")}>
          <MaterialIcon name={status === "submitting" ? "hourglass_top" : "send"} className="text-[18px]" />
          <span>{status === "submitting" ? "Sending…" : "Send Message"}</span>
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        {canSend
          ? "We'll respond within 1 business day, usually sooner."
          : "Fill in the required fields and agree to the Privacy Policy to continue."}
      </p>
    </form>
  );
}
