"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { StaffInviteDialog } from "@/components/admin/StaffInviteDialog";
import { useStaff } from "@/components/admin/providers/StaffProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";

const CARD = "rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

/**
 * Administrator-only (see the "adminOnly" nav flag in lib/admin/nav.ts,
 * which hides the link — this page-level check is the second layer for
 * anyone who navigates here directly; app/api/admin/staff/route.ts is the
 * real enforcement boundary per Admin_Dashboard_Requirements.md Section 9).
 */
export default function StaffPage() {
  const currentUser = useCurrentUser();
  const staff = useStaff();
  const [inviteOpen, setInviteOpen] = useState(false);

  if (currentUser.role !== "administrator") {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-slate-500">
        <MaterialIcon name="lock" className="text-[28px] text-slate-300" />
        Only Administrators can manage staff accounts.
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold text-navy-950">Staff</h1>
          <p className="mt-1 text-sm text-slate-500">{staff.length} account{staff.length === 1 ? "" : "s"} with dashboard access.</p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-navy-950 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
        >
          <MaterialIcon name="person_add" className="text-[18px]" />
          Invite Staff Member
        </button>
      </div>

      <div className={CARD}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th scope="col" className="px-5 py-2.5">
                Name
              </th>
              <th scope="col" className="px-3 py-2.5">
                Role
              </th>
              <th scope="col" className="px-3 py-2.5">
                Department
              </th>
              <th scope="col" className="px-3 py-2.5">
                Location
              </th>
              <th scope="col" className="px-3 py-2.5">
                Languages
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[11px] font-bold text-white">
                      {user.avatarInitials}
                    </span>
                    <span className="font-sans text-sm font-semibold text-navy-950">{user.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-slate-600">{roleLabels[user.role]}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{departmentLabels[user.department]}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{user.location}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{user.languages.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No staff accounts yet.</p>}
      </div>

      <StaffInviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
