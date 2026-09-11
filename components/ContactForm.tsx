"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

const WHATSAPP_NUMBER = "237600000000";
const CONTACT_EMAIL = "infos@uptechconsulting.com";

export const serviceOptions = [
  { value: "it-consulting", label: "IT Consulting & Outsourcing" },
  { value: "business-formalisation", label: "Business Formalisation & Compliance (not sure which)" },
  { value: "business-formalisation-cameroon", label: "Business Formalisation — Cameroon" },
  { value: "business-formalisation-us", label: "Business Formalisation — United States" },
  { value: "tax-compliance-businesses", label: "Tax Compliance for Businesses — Cameroon" },
  { value: "tax-compliance-individuals", label: "Tax Compliance for Individuals — Cameroon" },
  { value: "cnps-compliance", label: "CNPS Compliance — Cameroon" },
  { value: "career-marketing", label: "Career Marketing & Placement" },
  { value: "other", label: "Something else" },
] as const;

type ServiceValue = (typeof serviceOptions)[number]["value"];

function isServiceValue(value: string): value is ServiceValue {
  return serviceOptions.some((option) => option.value === value);
}

export function ContactForm({ initialService }: { initialService?: string }) {
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

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Uptech Consulting, I'd like to book a consultation.\n\n${summary}`
  )}`;
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Consultation request — ${serviceLabel}`
  )}&body=${encodeURIComponent(summary)}`;

  const linkClasses = (enabled: boolean, variant: "whatsapp" | "email") =>
    `inline-flex flex-1 items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all ${
      enabled
        ? variant === "whatsapp"
          ? "bg-uco-green text-white hover:bg-uco-green-hover shadow-sm"
          : "gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105 active:scale-[0.98]"
        : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
    }`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
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
          . My details are used only to respond to this inquiry — nothing is stored until I send
          this message myself via WhatsApp or email below.
        </span>
      </label>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <a
          href={canSend ? whatsappHref : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSend}
          className={linkClasses(canSend, "whatsapp")}
        >
          <MaterialIcon name="chat" className="text-[18px]" />
          <span>Continue on WhatsApp</span>
        </a>
        <a
          href={canSend ? mailtoHref : undefined}
          aria-disabled={!canSend}
          className={linkClasses(canSend, "email")}
        >
          <MaterialIcon name="mail" className="text-[18px]" />
          <span>Continue via Email</span>
        </a>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        {canSend
          ? "This opens WhatsApp or your email app with your details already filled in — just hit send."
          : "Fill in the required fields and agree to the Privacy Policy to continue."}
      </p>
    </div>
  );
}
