"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { departmentLabels } from "@/lib/admin/labels";
import { useServicePageActions, type NewServicePageInput } from "@/components/admin/providers/ServicePagesProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import type { Department } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

const DEPARTMENTS: Department[] = ["business-formalisation-compliance", "career-services-operations"];

/**
 * Administrator-only trigger (enforced by the caller, not this form) —
 * finishes what supabase/009_service_pages.sql's insert policy was already
 * built for. Template is fixed to "C" and never shown as a field: the
 * review-cadence concept this whole page exists for is specifically a
 * Template C (Regulatory/Procedure) requirement per CLAUDE.md Section 4 —
 * Template A/B pages have no such requirement to track.
 */
export function ServicePageFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addServicePage } = useServicePageActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const formId = useId();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [reviewCadenceDays, setReviewCadenceDays] = useState("180");
  const [reviewedBy, setReviewedBy] = useState("Uptech Consulting Management");

  const canSubmit = title.trim() !== "" && url.trim() !== "" && department !== "" && Number(reviewCadenceDays) > 0;

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setUrl("");
    setDepartment("");
    setReviewCadenceDays("180");
    setReviewedBy("Uptech Consulting Management");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim() === "" || url.trim() === "" || department === "" || !(Number(reviewCadenceDays) > 0)) return;

    const input: NewServicePageInput = {
      title: title.trim(),
      url: url.trim(),
      department,
      template: "C",
      reviewCadenceDays: Number(reviewCadenceDays),
      reviewedBy: reviewedBy.trim() || "Uptech Consulting Management",
    };

    try {
      const created = await addServicePage(input);
      logActivity({ icon: "person_add", description: `${currentUser.name} started tracking ${created.title}`, relatedHref: "/admin/service-pages" });
      toast.success("Page tracked", { description: `${input.title} is now in the compliance review register.` });
      onClose();
    } catch (error) {
      toast.error("Couldn't track this page", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            Track a Page
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
          <p className="mb-4 text-xs text-slate-500">
            For a new Template C (Regulatory/Procedure) page that needs its review cadence tracked — not for a
            general service page, which has no such requirement.
          </p>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Page Title <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} placeholder="e.g. Import/Export Compliance — Cameroon" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Live URL <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className={inputClasses}
                placeholder="/services/business-formalisation-compliance/..."
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Department <span className="text-rose-500">*</span>
              </span>
              <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} required className={`${inputClasses} bg-white`}>
                <option value="">Select a department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {departmentLabels[dept]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Review Cadence (days) <span className="text-rose-500">*</span>
              </span>
              <input
                type="number"
                min={1}
                value={reviewCadenceDays}
                onChange={(e) => setReviewCadenceDays(e.target.value)}
                required
                className={inputClasses}
              />
              <span className="text-xs text-slate-400">180 matches the other 4 tracked pages, unless this one needs a different cycle.</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Reviewed By</span>
              <input type="text" value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)} className={inputClasses} />
              <span className="text-xs text-slate-400">Who&apos;s establishing this page&apos;s baseline review, starting today.</span>
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
            disabled={!canSubmit}
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
