"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useLead, useLeadActions } from "@/components/admin/providers/LeadsProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { LeadFormDialog } from "@/components/admin/LeadFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LeadDetailContent } from "@/components/admin/LeadDetailContent";

const CARD = "rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

export function LeadDetailPageClient({ id }: { id: string }) {
  const router = useRouter();
  const lead = useLead(id);
  const { deleteLead } = useLeadActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!lead) {
    return (
      <div className={`${CARD} p-8 text-center`}>
        <p className="text-sm text-slate-500">
          This lead isn&apos;t in your local data — it may have been added on a different device or browser.
        </p>
        <Link href="/admin/leads" className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-950"
        >
          <MaterialIcon name="arrow_back" className="text-[18px]" />
          Back to Leads
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            aria-label="Edit lead"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="edit" className="text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete lead"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            <MaterialIcon name="delete" className="text-[18px]" />
          </button>
        </div>
      </div>

      <LeadDetailContent lead={lead} />

      <LeadFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        lead={lead}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete this lead?"
        description={`${lead.name}'s record will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Lead"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteLead(lead.id);
          logActivity({ icon: "delete", description: `${currentUser.name} deleted ${lead.name}'s lead record` });
          toast.success("Lead deleted");
          router.push("/admin/leads");
        }}
      />
    </div>
  );
}
