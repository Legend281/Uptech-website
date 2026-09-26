"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

/**
 * Spec 1.3: withdrawing consent is ONE action that takes the testimonial off
 * every page, and offers to delete the photo in the same step. The photo box
 * starts ticked — keeping someone's face after they've said no should be
 * the deliberate choice, not the default.
 */
export function WithdrawConsentDialog({
  open,
  name,
  hasPhoto,
  isLive,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  name: string;
  hasPhoto: boolean;
  isLive: boolean;
  onConfirm: (deletePhoto: boolean) => void;
  onCancel: () => void;
}) {
  const [deletePhoto, setDeletePhoto] = useState(true);

  useEffect(() => {
    if (!open) return;
    setDeletePhoto(true);
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="withdraw-consent-title">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <MaterialIcon name="block" className="text-[20px]" />
        </div>
        <h2 id="withdraw-consent-title" className="mt-3 font-sans text-base font-bold text-navy-950">
          Record that {name} withdrew consent?
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {isLive ? "It comes off every page it's on right now, and " : "It "}
          can&apos;t be published again. The internal record stays, so there&apos;s a trail of when and who.
        </p>
        {hasPhoto && (
          <label className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={deletePhoto}
              onChange={(e) => setDeletePhoto(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/40"
            />
            <span className="text-sm text-slate-700">Also delete their photo</span>
          </label>
        )}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(hasPhoto && deletePhoto)}
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            Withdraw consent
          </button>
        </div>
      </div>
    </div>
  );
}
