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

const GENERAL_INTEREST_EMAIL = "infos@uptechconsulting.com";

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

export function OpenPositions({ jobs }: { jobs: JobPosting[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

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
        <a
          href={generalInterestHref}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <MaterialIcon name="mail" className="text-[18px]" />
          <span>Send Us Your CV</span>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
                    href={applyMailto(job.title)}
                    className="inline-flex items-center gap-2 mt-5 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider gradient-teal-blue text-white shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
                  >
                    <MaterialIcon name="send" className="text-[16px]" />
                    <span>Apply for This Role</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
