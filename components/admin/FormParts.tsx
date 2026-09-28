"use client";

import { useEffect, type ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

/*
 * The building blocks every content-module dialog shares (Testimonials,
 * Team Members, FAQ Items), so the three read as one tool: numbered
 * sections in a fixed order, plain-language labels, and the same
 * preview-plus-checklist side panel.
 */

export const inputClasses =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400";
export const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";
export const hintClasses = "text-xs text-slate-500";

export function Section({ step, title, description, children }: { step: number; title: string; description: string; children: ReactNode }) {
  return (
    <section className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[11px] font-bold text-white">
          {step}
        </span>
        <div>
          <h3 className="font-sans text-sm font-bold text-navy-950">{title}</h3>
          <p className={hintClasses}>{description}</p>
        </div>
      </div>
      <div className="space-y-4 pl-9">{children}</div>
    </section>
  );
}

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClasses}>
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className={hintClasses}>{hint}</span>}
    </label>
  );
}

/** Red "can't go live yet" items and amber "worth a look" items — the side panel under each preview. */
export function ReadinessList({
  heading = "Before this can go live",
  blockers,
  warnings,
  notes = [],
  readyLabel = "Ready to publish",
}: {
  heading?: string;
  blockers: string[];
  warnings: string[];
  /** Neutral, informational items (e.g. a missing translation). */
  notes?: { icon: string; text: string }[];
  readyLabel?: string;
}) {
  return (
    <>
      <div>
        <span className={labelClasses}>{heading}</span>
        {blockers.length === 0 ? (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <MaterialIcon name="check_circle" className="text-[16px]" />
            {readyLabel}
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {blockers.map((b) => (
              <li key={b} className="flex gap-1.5 text-xs leading-snug text-rose-700">
                <MaterialIcon name="block" className="mt-px text-[14px]" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      {(warnings.length > 0 || notes.length > 0) && (
        <div>
          <span className={labelClasses}>Worth a look</span>
          <ul className="mt-2 space-y-1.5">
            {warnings.map((w) => (
              <li key={w} className="flex gap-1.5 text-xs leading-snug text-amber-800">
                <MaterialIcon name="warning" className="mt-px text-[14px]" />
                {w}
              </li>
            ))}
            {notes.map((n) => (
              <li key={n.text} className="flex gap-1.5 text-xs leading-snug text-slate-500">
                <MaterialIcon name={n.icon} className="mt-px text-[14px]" />
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/** Overlay, header, Escape-to-close, and a fixed footer. The body scrolls; on large screens it can split into form + side panel. */
export function DialogShell({
  titleId,
  title,
  onClose,
  footer,
  size = "wide",
  children,
}: {
  titleId: string;
  title: string;
  onClose: () => void;
  footer: ReactNode;
  size?: "wide" | "medium";
  children: ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      {/* data-lenis-prevent: the site-wide smooth scroller (components/SmoothScroll.tsx)
          otherwise swallows the mouse wheel, so nothing inside the dialog would scroll. */}
      <div
        data-lenis-prevent
        className={`relative flex max-h-[94vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl ${
          size === "wide" ? "sm:max-w-5xl" : "sm:max-w-3xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={titleId} className="font-sans text-base font-bold text-navy-950">
            {title}
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
        {children}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          {footer}
        </div>
      </div>
    </div>
  );
}

export const buttonClasses = {
  ghost:
    "rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
  secondary:
    "rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40",
  primary:
    "rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-40",
};

/** A calm, one-line note at the top of a module page. */
export function InfoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex gap-2.5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
      <MaterialIcon name="info" className="mt-px text-[18px] text-sky-600" />
      <p>{children}</p>
    </div>
  );
}

/** Top-of-page title row: heading, one-line summary, and the module's primary action. */
export function ModuleHeader({ title, summary, action }: { title: string; summary: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-sans text-xl font-bold text-navy-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{summary}</p>
      </div>
      {action}
    </div>
  );
}

export function PrimaryActionButton({ icon = "add", label, onClick }: { icon?: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
    >
      <MaterialIcon name={icon} className="text-[18px]" />
      {label}
    </button>
  );
}

export const selectClasses =
  "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40";

export function SearchInput({ id, value, onChange, label }: { id: string; value: string; onChange: (value: string) => void; label: string }) {
  return (
    <label htmlFor={id} className="relative sm:ml-auto sm:w-56">
      <span className="sr-only">{label}</span>
      <MaterialIcon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        autoComplete="off"
        className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
      />
    </label>
  );
}

export const CARD_SURFACE =
  "rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";
