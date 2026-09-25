"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type RowAction = {
  label: string;
  icon: string;
  onSelect: () => void;
  /** "danger" rows get the rose treatment and a divider above them. */
  tone?: "danger";
};

/** LeadRowActions' menu, generalised to any list of actions. Visible by default — a hover-gated action is invisible to keyboard and touch. */
export function RowActionsMenu({ actions, label = "Row actions" }: { actions: RowAction[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (actions.length === 0) return null;

  return (
    <div className="relative" ref={ref} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <MaterialIcon name="more_vert" className="text-[18px]" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                action.tone === "danger"
                  ? "border-t border-slate-100 text-rose-600 hover:bg-rose-50"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MaterialIcon
                name={action.icon}
                className={`text-[16px] ${action.tone === "danger" ? "" : "text-slate-400"}`}
              />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
