"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useJobPostingActions } from "@/components/admin/providers/JobPostingsProvider";
import { downloadPublishedPostingsJson } from "@/lib/admin/exportJobPostings";
import type { JobPosting } from "@/lib/admin/types";

/**
 * Status transitions, Duplicate, and Export happen right here rather than
 * being lifted to the parent page — none of them need a modal, so there's
 * nothing for the parent to own. Only Edit, Applications, and Delete open
 * something, which is why those three are still callback props.
 */
export function JobPostingRowActions({
  posting,
  onEdit,
  onApplications,
  onDelete,
}: {
  posting: JobPosting;
  onEdit: () => void;
  onApplications: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmThinPublish, setConfirmThinPublish] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setStatus, clonePosting } = useJobPostingActions();
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

  function publishNow() {
    setStatus(posting.id, "published");
    logActivity({ icon: "check_circle", description: `${currentUser.name} published ${posting.title}`, relatedHref: "/admin/job-postings" });
    toast.success("Published", { description: "Marked ready — still needs Export + a manual step to go live on the site." });
  }

  function handlePublish() {
    const isThin = posting.description.trim() === "" || posting.requirements.length === 0;
    if (isThin) {
      setConfirmThinPublish(true);
      return;
    }
    publishNow();
  }

  function handleCloseRole() {
    setStatus(posting.id, "closed");
    logActivity({ icon: "edit_note", description: `${currentUser.name} closed ${posting.title}`, relatedHref: "/admin/job-postings" });
    toast.success("Closed");
  }

  function handleReopen() {
    setStatus(posting.id, "published");
    logActivity({ icon: "check_circle", description: `${currentUser.name} reopened ${posting.title}`, relatedHref: "/admin/job-postings" });
    toast.success("Reopened as Published");
  }

  function handleDuplicate() {
    const copy = clonePosting(posting.id, currentUser.id);
    logActivity({ icon: "person_add", description: `${currentUser.name} duplicated ${posting.title} for a new posting`, relatedHref: "/admin/job-postings" });
    toast.success("Duplicated", { description: `A new draft of "${copy.title}" was created.` });
  }

  function handleExportOne() {
    downloadPublishedPostingsJson([posting], `${posting.id}.json`);
    toast.success("Exported", { description: "Ready to hand to whoever updates the live site." });
  }

  return (
    <div className="relative" ref={ref} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Posting actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <MaterialIcon name="more_vert" className="text-[18px]" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <MaterialIcon name="edit" className="text-[16px] text-slate-400" />
            Edit
          </button>

          {posting.status === "draft" && (
            <button type="button" role="menuitem" onClick={() => { setOpen(false); handlePublish(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
              <MaterialIcon name="check_circle" className="text-[16px] text-emerald-500" />
              Publish
            </button>
          )}
          {posting.status === "published" && (
            <>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); onApplications(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <MaterialIcon name="groups" className="text-[16px] text-slate-400" />
                Applications
              </button>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); handleExportOne(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <MaterialIcon name="download" className="text-[16px] text-slate-400" />
                Export
              </button>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); handleCloseRole(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <MaterialIcon name="block" className="text-[16px] text-slate-400" />
                Close
              </button>
            </>
          )}
          {posting.status === "closed" && (
            <>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); onApplications(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <MaterialIcon name="groups" className="text-[16px] text-slate-400" />
                Applications
              </button>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); handleReopen(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <MaterialIcon name="restart_alt" className="text-[16px] text-emerald-500" />
                Reopen
              </button>
            </>
          )}

          <button type="button" role="menuitem" onClick={() => { setOpen(false); handleDuplicate(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <MaterialIcon name="content_copy" className="text-[16px] text-slate-400" />
            Duplicate
          </button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
            <MaterialIcon name="delete" className="text-[16px]" />
            Delete
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmThinPublish}
        title="Publish an incomplete posting?"
        description={`"${posting.title}" is missing a description or requirements. It can still be edited after publishing, but applicants will see it as-is.`}
        confirmLabel="Publish Anyway"
        onCancel={() => setConfirmThinPublish(false)}
        onConfirm={() => {
          setConfirmThinPublish(false);
          publishNow();
        }}
      />
    </div>
  );
}
