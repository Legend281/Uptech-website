"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { GENERAL_INTEREST_EMAIL } from "@/components/OpenPositions";
import { HIRING_DEPARTMENT_NAMES } from "@/lib/hiringDepartments";
import { EMPLOYMENT_TYPES } from "@/lib/admin/jobPostings";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useJobPostingActions, type NewJobPostingInput } from "@/components/admin/providers/JobPostingsProvider";
import type { JobPosting } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

type Props = { open: boolean; onClose: () => void } & ({ mode: "create" } | { mode: "edit"; posting: JobPosting });

/** New postings always start as Draft — publishing is a separate, explicit action (see JobPostingRowActions), not something this form does implicitly. */
export function JobPostingFormDialog(props: Props) {
  const { open, onClose } = props;
  const { addPosting, editPosting } = useJobPostingActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const formId = useId();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [closingDate, setClosingDate] = useState("");

  const canSubmit = title.trim() !== "" && department !== "" && location.trim() !== "" && employmentType !== "";

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
      const { posting } = props;
      setTitle(posting.title);
      setDepartment(posting.department);
      setLocation(posting.location);
      setEmploymentType(posting.employmentType);
      setDescription(posting.description);
      setRequirementsText(posting.requirements.join("\n"));
      setContactEmail(posting.contactEmail ?? "");
      setApplyUrl(posting.applyUrl ?? "");
      setClosingDate(posting.closingDate ?? "");
    } else {
      setTitle("");
      setDepartment("");
      setLocation("");
      setEmploymentType("");
      setDescription("");
      setRequirementsText("");
      setContactEmail("");
      setApplyUrl("");
      setClosingDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    const input: NewJobPostingInput = {
      title: title.trim(),
      department,
      location: location.trim(),
      employmentType,
      description: description.trim(),
      requirements: requirementsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      contactEmail: contactEmail.trim() || undefined,
      applyUrl: applyUrl.trim() || undefined,
      closingDate: closingDate.trim() || undefined,
    };

    if (props.mode === "edit") {
      editPosting(props.posting.id, input);
      logActivity({ icon: "edit_note", description: `${currentUser.name} updated the ${input.title} posting`, relatedHref: "/admin/job-postings" });
      toast.success("Posting updated");
    } else {
      try {
        const posting = await addPosting(input, currentUser.id);
        logActivity({ icon: "person_add", description: `${currentUser.name} drafted a new posting: ${posting.title}`, relatedHref: "/admin/job-postings" });
        toast.success("Draft created", { description: "Publish it from the list once it's ready." });
      } catch (error) {
        toast.error("Couldn't save this posting", { description: error instanceof Error ? error.message : "Please try again." });
        return;
      }
    }
    onClose();
  }

  const isEdit = props.mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {isEdit ? "Edit Posting" : "New Job Posting"}
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
              Saves as a Draft — nothing here is visible on the public site until you explicitly Publish it, at which
              point it appears on the live Careers page automatically within about a minute.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Role Title <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} placeholder="e.g. Compliance Associate" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Department <span className="text-rose-500">*</span>
              </span>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required className={`${inputClasses} bg-white`}>
                <option value="">Select a department</option>
                {HIRING_DEPARTMENT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                Employment Type <span className="text-rose-500">*</span>
              </span>
              <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} required className={`${inputClasses} bg-white`}>
                <option value="">Select a type</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Location <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className={inputClasses} placeholder="e.g. Buea, Cameroon" />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>Application Closing Date (optional)</span>
              <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className={inputClasses} />
              <span className="text-xs text-slate-400">
                Only for a fixed-duration posting with a real intake window (e.g. a trainee program) — leave blank for
                an open-ended role, which uses a generic &quot;been open a while&quot; flag instead.
              </span>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder="What this role actually does day to day."
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>Requirements</span>
              <textarea
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                rows={4}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder={"One per line, e.g.\n2+ years in corporate compliance\nComfortable in English and French"}
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>Contact Email</span>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClasses}
                placeholder={`Leave blank to use the default (${GENERAL_INTEREST_EMAIL})`}
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>External Application Link (optional)</span>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                className={inputClasses}
                placeholder="e.g. a Google Form URL — leave blank to use the site's own Apply flow"
              />
              <span className="text-xs text-slate-400">
                When set, the public &quot;Apply&quot; button sends visitors here instead of opening the site&apos;s résumé-upload form.
              </span>
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
            {isEdit ? "Save Changes" : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
