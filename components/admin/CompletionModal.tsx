"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export type CompletionInput = { completedAt: string; notes: string };

/**
 * Generic "mark complete with a note" pattern — first built for resolving an
 * overdue compliance review, but kept item-agnostic (title/labels are all
 * caller-supplied) so a job posting going live, a testimonial approval, or
 * any future "record what happened, when, and why" flow can reuse this
 * exact component instead of growing its own bespoke modal.
 */
export function CompletionModal({
  open,
  title,
  description,
  notesLabel = "What was done?",
  notesPlaceholder = "Briefly describe what was filed, reviewed, or changed.",
  confirmLabel = "Mark Complete",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (input: CompletionInput) => void;
}) {
  const formId = useId();
  const [completedAt, setCompletedAt] = useState(todayIsoDate());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setCompletedAt(todayIsoDate());
    setNotes("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const canSubmit = notes.trim() !== "";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onConfirm({ completedAt, notes: notes.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <div className="absolute inset-0 bg-navy-950/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form id={formId} onSubmit={handleSubmit} className="px-5 py-5">
          {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Completion date</span>
              <input
                type="date"
                value={completedAt}
                max={todayIsoDate()}
                onChange={(event) => setCompletedAt(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>
                {notesLabel} <span className="text-rose-500">*</span>
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                required
                rows={3}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder={notesPlaceholder}
              />
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
