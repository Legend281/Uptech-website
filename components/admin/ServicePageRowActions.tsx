"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ServicePageMeta } from "@/lib/admin/types";

/** Always available regardless of current review status — unlike the Dashboard register, which only shows these for an overdue page, this dedicated page lets staff act on any tracked page at any time (e.g. resolving early, or escalating something that's merely due soon). */
export function ServicePageRowActions({
  page,
  onResolve,
  onEscalate,
}: {
  page: ServicePageMeta;
  onResolve: () => void;
  onEscalate: () => void;
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
        aria-label="Page actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <MaterialIcon name="more_vert" className="text-[18px]" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onResolve();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <MaterialIcon name="task_alt" className="text-[16px] text-emerald-500" />
            Resolve Review
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEscalate();
            }}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <MaterialIcon name="arrow_upward" className="text-[16px] text-slate-400" />
            Escalate
          </button>
        </div>
      )}
    </div>
  );
}
