"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useAdditionalServiceActions } from "@/components/admin/providers/AdditionalServicesProvider";
import { canManageContent } from "@/lib/admin/permissions";
import type { AdditionalService } from "@/lib/admin/types";

export function AdditionalServiceRowActions({
  service,
  onEdit,
  onDelete,
}: {
  service: AdditionalService;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setStatus, move } = useAdditionalServiceActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();

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

  if (!canManageContent(currentUser)) return null;

  function handlePublish() {
    setStatus(service.id, "published");
    logActivity({ icon: "publish", description: `${currentUser.name} published the ${service.title} service`, relatedHref: "/services" });
    toast.success("Published", { description: "Live on the Homepage and /services within about a minute." });
  }

  function handleUnpublish() {
    setStatus(service.id, "draft");
    logActivity({ icon: "unpublished", description: `${currentUser.name} unpublished the ${service.title} service`, relatedHref: "/admin/additional-services" });
    toast.success("Unpublished");
  }

  return (
    <div className="relative" ref={ref} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Service actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <MaterialIcon name="more_vert" className="text-[18px]" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <MaterialIcon name="edit" className="text-[16px] text-slate-400" />
            Edit
          </button>
          {service.status === "draft" ? (
            <button type="button" role="menuitem" onClick={() => { setOpen(false); handlePublish(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
              <MaterialIcon name="check_circle" className="text-[16px] text-emerald-500" />
              Publish
            </button>
          ) : (
            <button type="button" role="menuitem" onClick={() => { setOpen(false); handleUnpublish(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
              <MaterialIcon name="block" className="text-[16px] text-slate-400" />
              Unpublish
            </button>
          )}
          <button type="button" role="menuitem" onClick={() => { setOpen(false); move(service.id, -1); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <MaterialIcon name="arrow_upward" className="text-[16px] text-slate-400" />
            Move Up
          </button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); move(service.id, 1); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <MaterialIcon name="arrow_downward" className="text-[16px] text-slate-400" />
            Move Down
          </button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
            <MaterialIcon name="delete" className="text-[16px]" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
