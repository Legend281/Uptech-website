"use client";

import { useEffect, useId, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { roleLabels } from "@/lib/admin/labels";
import type { AdminUser, ServicePageMeta } from "@/lib/admin/types";

/**
 * Unlike the Dashboard register's Escalate (which auto-picks "an
 * administrator in the same department, or any administrator" with no
 * chooser), this dedicated page lets staff pick exactly who they're handing
 * a review to — a more deliberate surface deserves an explicit choice, not
 * an automatic guess.
 */
export function EscalateServicePageDialog({
  open,
  page,
  staff,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  page: ServicePageMeta | null;
  staff: AdminUser[];
  onCancel: () => void;
  onConfirm: (toUserId: string) => void;
}) {
  const formId = useId();
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (open) setSelectedId("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open || !page) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            Escalate {page.title}
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

        <div className="px-5 py-5">
          <p className="mb-4 text-sm text-slate-500">Who should own getting this review resolved?</p>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assign To</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-950 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              <option value="">Select a staff member</option>
              {staff.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {roleLabels[user.role]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => onConfirm(selectedId)}
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}
