"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

/** Visible by default (not hover-only) — a hover-gated action is invisible to keyboard and touch. */
export function LeadRowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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

  return (
    <div className="relative" ref={ref} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <MaterialIcon name="more_vert" className="text-[18px]" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <MaterialIcon name="visibility" className="text-[16px] text-slate-400" />
            View
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <MaterialIcon name="edit" className="text-[16px] text-slate-400" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            <MaterialIcon name="delete" className="text-[16px]" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
