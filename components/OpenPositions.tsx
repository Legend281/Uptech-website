"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type JobPosting = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string[];
};

// Exported so the admin's Job Postings module can use the exact same default rather than redefining it and risking drift.
export const GENERAL_INTEREST_EMAIL = "infos@uptechconsulting.com";

function applyMailto(roleTitle: string) {
  const subject = `Application — ${roleTitle}`;
  const body = `Hi Uptech Consulting,\n\nI'd like to apply for the ${roleTitle} role.\n\nName:\nLocation:\nLinkedIn / portfolio (optional):\n\nPlease attach your CV before sending this email.\n\n`;
  return `mailto:${GENERAL_INTEREST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const generalInterestHref = `mailto:${GENERAL_INTEREST_EMAIL}?subject=${encodeURIComponent(
  "General Interest — Future Opportunities"
)}&body=${encodeURIComponent(
  "Hi Uptech Consulting,\n\nI don't see an open role that matches my background right now, but I'd like to be considered for future opportunities.\n\nName:\nArea of interest:\nLocation:\nLinkedIn / portfolio (optional):\n\nPlease attach your CV before sending this email.\n\n"
)}`;

/*
 * FIX 2 finding, worth keeping visible in code: "Send Us Your CV" / "Apply
 * for This Role" were already real working mailto: links (not a dead end) —
 * same client-side handoff pattern ContactForm.tsx uses for every other
 * lead-capture form on this site (no Next.js API route + Supabase/Resend
 * backend exists anywhere in this codebase to wire this into instead;
 * verified by search). A mailto link has no server round-trip, so there is
 * nothing to show a "Sending..." state for — the honest equivalent, and
 * what's implemented below, is the same inline guidance copy ContactForm.tsx
 * already uses ("this opens your email app — hit send yourself").
 *
 * What WAS genuinely missing (Fix 1): no consent checkbox gated either
 * apply action, unlike ContactForm.tsx's. Added below, mirroring that same
 * component's copy and disabled-state pattern exactly.
 */
export function OpenPositions({ jobs }: { jobs: JobPosting[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [consent, setConsent] = useState(false);
  const baseId = useId();

  const consentCheckbox = (
    <label className="flex items-start gap-2.5 max-w-xl mx-auto text-left mb-6">
      <input
        type="checkbox"
        checked={consent}
        onChange={(event) => setConsent(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40 shrink-0"
      />
      <span className="text-xs text-slate-500 leading-relaxed">
        I agree to Uptech Consulting storing and reviewing my information as described in the{" "}
        <a href="/privacy-policy" className="text-blue-accent underline hover:text-blue-700">
          Privacy Policy
        </a>
        .
      </span>
    </label>
  );

  const applyLinkClasses = (enabled: boolean, size: "md" | "sm" = "md") =>
    `inline-flex items-center gap-2 rounded-lg font-semibold transition-all ${
      size === "md" ? "px-6 py-3 text-sm" : "px-5 py-2.5 text-xs uppercase tracking-wider"
    } ${
      enabled
        ? "gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105 active:scale-[0.98]"
        : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
    }`;

  const consentHint = consent
    ? "This opens your email app with a pre-filled message — attach your CV, then hit send."
    : "Check the box above to continue.";

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 sm:p-14 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-5">
          <MaterialIcon name="work_history" className="text-[28px]" />
        </div>
        <h3 className="text-xl font-bold text-navy-950 mb-2">No open positions right now</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          We&apos;re not actively hiring at this exact moment, but we&apos;re always interested in
          exceptional people across every department above. Send us your CV and we&apos;ll reach
          out when something fits.
        </p>
        {consentCheckbox}
        <a
          href={consent ? generalInterestHref : undefined}
          aria-disabled={!consent}
          className={applyLinkClasses(consent)}
        >
          <MaterialIcon name="mail" className="text-[18px]" />
          <span>Send Us Your CV</span>
        </a>
        <p className="text-xs text-slate-400 mt-3">{consentHint}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {consentCheckbox}
      {jobs.map((job, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={job.title}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
              >
                <div>
                  <span className="text-base font-bold text-navy-950 block">{job.title}</span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="apartment" className="text-[14px]" />
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="location_on" className="text-[14px]" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="schedule" className="text-[14px]" />
                      {job.type}
                    </span>
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-teal-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
                  {job.requirements && job.requirements.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                      {job.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm text-slate-600">
                          <MaterialIcon
                            name="check_circle"
                            className="text-emerald-600 text-[16px] shrink-0 mt-0.5"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={consent ? applyMailto(job.title) : undefined}
                    aria-disabled={!consent}
                    className={`mt-5 ${applyLinkClasses(consent, "sm")}`}
                  >
                    <MaterialIcon name="send" className="text-[16px]" />
                    <span>Apply for This Role</span>
                  </a>
                  <p className="text-xs text-slate-400 mt-2">{consentHint}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
