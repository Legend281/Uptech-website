"use client";

import { useId, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { InfoNotice, CARD_SURFACE, ModuleHeader, PrimaryActionButton, SearchInput, selectClasses } from "@/components/admin/FormParts";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { TeamMemberFormDialog } from "@/components/admin/TeamMemberFormDialog";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useTeamMembers } from "@/components/admin/providers/TeamMembersProvider";
import { toastResult } from "@/lib/admin/toastResult";
import { canManageTeam, sortTeam, teamDepartmentLabels, teamEntityLabels } from "@/lib/admin/team";
import type { TeamDepartment, TeamEntity, TeamMemberRecord, TeamMemberStatus } from "@/lib/admin/types";

function MemberCard({ member, actions, onOpen }: { member: TeamMemberRecord; actions: RowAction[]; onOpen?: () => void }) {
  const visible = member.status === "visible";
  return (
    <article className={`flex flex-col overflow-hidden ${CARD_SURFACE} ${visible ? "" : "opacity-80"}`}>
      <button
        type="button"
        onClick={onOpen}
        disabled={!onOpen}
        className="relative aspect-[4/5] w-full bg-slate-100 text-left disabled:cursor-default"
        aria-label={onOpen ? `Edit ${member.name}` : undefined}
      >
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
            <MaterialIcon name="person" className="text-[40px]" />
            <span className="text-xs font-semibold">No photo</span>
          </span>
        )}
        <span
          className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
            visible ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          {visible ? "Visible" : "Hidden"}
        </span>
        <span className="absolute right-2 top-2 rounded bg-navy-950/70 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">#{member.displayOrder}</span>
      </button>
      <div className="flex flex-1 items-start gap-2 p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-bold text-navy-950">{member.name}</p>
          <p className="truncate text-xs text-slate-600">{member.title}</p>
          {/* Department + entity shown under every name, so two people who share a name are still easy to tell apart (spec 2.3). */}
          <p className="mt-1.5 truncate text-[11px] text-slate-500">
            {teamDepartmentLabels[member.department]} · {member.entity === "us" ? "US" : "Cameroon"}
          </p>
        </div>
        <RowActionsMenu actions={actions} label={`Actions for ${member.name}`} />
      </div>
    </article>
  );
}

export default function TeamMembersPage() {
  const currentUser = useCurrentUser();
  const { members, setStatus, move, deleteMember } = useTeamMembers();
  const canManage = canManageTeam(currentUser);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRecord | null>(null);
  const [confirmShow, setConfirmShow] = useState<TeamMemberRecord | null>(null);
  const [deleting, setDeleting] = useState<TeamMemberRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<TeamMemberStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<TeamDepartment | "all">("all");
  const [entityFilter, setEntityFilter] = useState<TeamEntity | "all">("all");
  const [query, setQuery] = useState("");
  const searchId = useId();

  const ordered = sortTeam(members);
  const visibleCount = members.filter((m) => m.status === "visible").length;
  const noPhotoVisible = members.filter((m) => m.status === "visible" && !m.photo).length;
  const nextOrder = members.reduce((max, m) => Math.max(max, m.displayOrder), 0) + 1;

  const filtered = ordered
    .filter((m) => statusFilter === "all" || m.status === statusFilter)
    .filter((m) => departmentFilter === "all" || m.department === departmentFilter)
    .filter((m) => entityFilter === "all" || m.entity === entityFilter)
    .filter((m) => {
      if (!query.trim()) return true;
      return `${m.name} ${m.title} ${m.bio ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
    });

  function show(member: TeamMemberRecord) {
    void toastResult(setStatus(member.id, "visible", currentUser), `${member.name} is on the team page`);
  }

  function actionsFor(member: TeamMemberRecord): RowAction[] {
    if (!canManage) return [];
    const index = ordered.findIndex((m) => m.id === member.id);
    const actions: RowAction[] = [{ label: "Edit", icon: "edit", onSelect: () => setEditing(member) }];
    if (member.status === "hidden") {
      // Spec 2.3: a missing photo is allowed, but warn before it goes public.
      actions.push({ label: "Show on site", icon: "visibility", onSelect: () => (member.photo ? show(member) : setConfirmShow(member)) });
    } else {
      actions.push({
        label: "Hide from site",
        icon: "visibility_off",
        onSelect: () => {
          void toastResult(setStatus(member.id, "hidden", currentUser), { title: `${member.name} is hidden`, description: "Their record is kept." });
        },
      });
    }
    if (index > 0) actions.push({ label: "Move earlier", icon: "arrow_back", onSelect: () => void toastResult(move(member.id, -1, currentUser), "Order updated", "Not moved") });
    if (index < ordered.length - 1) actions.push({ label: "Move later", icon: "arrow_forward", onSelect: () => void toastResult(move(member.id, 1, currentUser), "Order updated", "Not moved") });
    // Anyone who has ever been public is hidden, never deleted (spec 2.3).
    if (!member.everVisible) actions.push({ label: "Delete", icon: "delete", tone: "danger", onSelect: () => setDeleting(member) });
    return actions;
  }

  return (
    <>
      <ModuleHeader
        title="Team Members"
        summary={
          <>
            {visibleCount} on the Who We Are page · {members.length - visibleCount} hidden
            {noPhotoVisible > 0 && (
              <>
                {" "}
                · <span className="font-semibold text-amber-700">{noPhotoVisible} shown without a photo</span>
              </>
            )}
          </>
        }
        action={canManage ? <PrimaryActionButton label="Add Team Member" onClick={() => setCreating(true)} /> : undefined}
      />

      <InfoNotice>
        The roster is saved in this browser only for now, and changes here don&apos;t reach the Who We Are page yet.
        {!canManage && " Only Administrators can change the roster."}
      </InfoNotice>

      {members.length === 0 ? (
        <section className={`${CARD_SURFACE} px-5 py-12 text-center`}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <MaterialIcon name="groups" className="text-[26px]" />
          </span>
          <h2 className="mt-4 font-sans text-base font-bold text-navy-950">No team members yet</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
            Add real people with their agreement: name, title and a photo they&apos;re happy with. Until someone is
            visible, the Who We Are page leaves out its Meet the team section entirely.
          </p>
        </section>
      ) : (
        <>
          <div className={`mb-4 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5 ${CARD_SURFACE}`}>
            <select aria-label="Filter by visibility" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TeamMemberStatus | "all")} className={selectClasses}>
              <option value="all">Visible and hidden</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <select aria-label="Filter by department" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value as TeamDepartment | "all")} className={selectClasses}>
              <option value="all">All departments</option>
              {(Object.keys(teamDepartmentLabels) as TeamDepartment[]).map((d) => (
                <option key={d} value={d}>
                  {teamDepartmentLabels[d]}
                </option>
              ))}
            </select>
            <select aria-label="Filter by entity" value={entityFilter} onChange={(e) => setEntityFilter(e.target.value as TeamEntity | "all")} className={selectClasses}>
              <option value="all">Both entities</option>
              {(Object.keys(teamEntityLabels) as TeamEntity[]).map((e) => (
                <option key={e} value={e}>
                  {teamEntityLabels[e]}
                </option>
              ))}
            </select>
            <SearchInput id={searchId} value={query} onChange={setQuery} label="Search team members" />
          </div>

          {filtered.length === 0 ? (
            <div className={`${CARD_SURFACE} px-5 py-10 text-center text-sm text-slate-500`}>Nothing matches {query ? `"${query}"` : "these filters"}.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {filtered.map((member) => (
                <MemberCard key={member.id} member={member} actions={actionsFor(member)} onOpen={canManage ? () => setEditing(member) : undefined} />
              ))}
            </div>
          )}
        </>
      )}

      {creating && <TeamMemberFormDialog mode="create" nextOrder={nextOrder} onClose={() => setCreating(false)} />}
      {editing && <TeamMemberFormDialog mode="edit" member={editing} nextOrder={nextOrder} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(confirmShow)}
        tone="warning"
        title="Show without a photo?"
        description={confirmShow ? `${confirmShow.name}'s card will show an empty grey frame on the Who We Are page until a photo is added.` : ""}
        confirmLabel="Show anyway"
        onCancel={() => setConfirmShow(null)}
        onConfirm={() => {
          if (confirmShow) show(confirmShow);
          setConfirmShow(null);
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this profile?"
        description={deleting ? `${deleting.name} has never been on the public site, so their draft profile can be removed for good.` : ""}
        confirmLabel="Delete Profile"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            void toastResult(deleteMember(deleting.id, currentUser), "Profile deleted", "Not deleted");
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
