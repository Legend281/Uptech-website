"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useJobPostingActions } from "@/components/admin/providers/JobPostingsProvider";
import type { JobPosting } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

/**
 * Deliberately separate from JobPostingFormDialog: checking the recruiting
 * inbox and bumping a count is a frequent, lightweight action that shouldn't
 * require opening the full content-edit form (title, description,
 * requirements) every time. A manual counter, not a real applicant tracker —
 * see JobPosting.applicationsReceived's own comment for why that's fine here.
 */
export function JobPostingApplicationsModal({ posting, onClose }: { posting: JobPosting | null; onClose: () => void }) {
  const { updateApplications } = useJobPostingActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const formId = useId();

  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!posting) return;
    setCount(posting.applicationsReceived);
    setNotes(posting.notes ?? "");
  }, [posting]);

  useEffect(() => {
    if (!posting) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [posting, onClose]);

  if (!posting) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateApplications(posting!.id, count, notes.trim() || undefined);
    logActivity({
      icon: "edit_note",
      description: `${currentUser.name} updated applications for ${posting!.title} (${count})`,
      relatedHref: "/admin/job-postings",
    });
    toast.success("Applications updated");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {posting.title}
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

        <form id={formId} onSubmit={handleSubmit} className="px-5 py-5">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Applications received</span>
              <input
                type="number"
                min={0}
                value={count}
                onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder="e.g. Shortlisting in progress, two strong candidates"
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
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
