"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { canManageTeam, getTeamSaveErrors, normalizeTeamInput, sortTeam, type TeamMemberInput } from "@/lib/admin/team";
import type { ActionResult, AdminUser, TeamMemberRecord, TeamMemberStatus } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-team-v1";

/*
 * Browser-only for now: supabase/003_team_members.sql defines the real
 * table, but this module doesn't write to it yet. Until then this is the
 * whole roster, in this browser's localStorage, and the Who We Are page
 * (which reads Supabase) is unaffected by edits here.
 *
 * Seeded EMPTY: no real names, roles or portraits have been supplied, and
 * CLAUDE.md Section 6.4 rules out inventing them, even as demo data.
 */

type TeamContextValue = {
  members: TeamMemberRecord[];
  loading: boolean;
  addMember: (input: TeamMemberInput, user: AdminUser) => Promise<ActionResult>;
  updateMember: (id: string, input: TeamMemberInput, user: AdminUser) => Promise<ActionResult>;
  setStatus: (id: string, status: TeamMemberStatus, user: AdminUser) => Promise<ActionResult>;
  /** Swaps display order with the neighbour before/after, among all members. */
  move: (id: string, direction: -1 | 1, user: AdminUser) => Promise<ActionResult>;
  deleteMember: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const TeamContext = createContext<TeamContextValue | null>(null);

function load(): TeamMemberRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as TeamMemberRecord[]) : [];
  } catch {
    return [];
  }
}

function save(members: TeamMemberRecord[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    // Best-effort only; portraits are resized small on upload to stay well under quota.
  }
}

const denied: ActionResult = { ok: false, reasons: ["Only an Administrator can change the team roster."] };
const OK: ActionResult = { ok: true };

export function TeamMembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const logActivity = useLogActivity();

  useEffect(() => {
    setMembers(load());
  }, []);

  function commit(next: TeamMemberRecord[]) {
    setMembers(next);
    save(next);
  }

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/team" });
  }

  async function addMember(input: TeamMemberInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const clean = normalizeTeamInput(input);
    const errors = getTeamSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };
    const now = new Date().toISOString();
    const member: TeamMemberRecord = {
      ...clean,
      id: `team-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      everVisible: clean.status === "visible",
      createdById: user.id,
      createdAt: now,
      updatedAt: now,
    };
    commit([...members, member]);
    log(
      clean.status === "visible" ? "person_add" : "edit_note",
      clean.status === "visible"
        ? `${user.name} added ${member.name} to the Who We Are team.`
        : `${user.name} added ${member.name} to the team roster (hidden for now).`,
    );
    return OK;
  }

  async function updateMember(id: string, input: TeamMemberInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing) return { ok: false, reasons: ["This team member no longer exists."] };
    const clean = normalizeTeamInput(input);
    const errors = getTeamSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };
    const now = new Date().toISOString();
    commit(members.map((m) => (m.id === id ? { ...m, ...clean, everVisible: m.everVisible || clean.status === "visible", updatedAt: now } : m)));
    if (clean.status !== existing.status) {
      log(clean.status === "visible" ? "publish" : "unpublished", `${user.name} ${clean.status === "visible" ? "showed" : "hid"} ${clean.name} on the Who We Are page.`);
    } else {
      log("edit_note", `${user.name} edited ${clean.name}'s team profile.`);
    }
    return OK;
  }

  async function setStatus(id: string, status: TeamMemberStatus, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing || existing.status === status) return OK;
    const now = new Date().toISOString();
    commit(members.map((m) => (m.id === id ? { ...m, status, everVisible: m.everVisible || status === "visible", updatedAt: now } : m)));
    log(status === "visible" ? "publish" : "unpublished", `${user.name} ${status === "visible" ? "showed" : "hid"} ${existing.name} on the Who We Are page.`);
    return OK;
  }

  async function move(id: string, direction: -1 | 1, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    // Renumber 1..n in current order first, so duplicate order numbers can't make a swap a no-op.
    const ordered = sortTeam(members).map((m, index) => ({ ...m, displayOrder: index + 1 }));
    const index = ordered.findIndex((m) => m.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return OK;
    [ordered[index].displayOrder, ordered[target].displayOrder] = [ordered[target].displayOrder, ordered[index].displayOrder];
    commit(ordered);
    return OK;
  }

  async function deleteMember(id: string, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing) return OK;
    if (existing.everVisible) {
      return { ok: false, reasons: ["They've been on the public site, so hide them instead. Other pages may still refer to them."] };
    }
    commit(members.filter((m) => m.id !== id));
    log("delete", `${user.name} deleted ${existing.name}'s draft team profile.`);
    return OK;
  }

  return (
    <TeamContext.Provider value={{ members, loading: false, addMember, updateMember, setStatus, move, deleteMember }}>{children}</TeamContext.Provider>
  );
}

export function useTeamMembers() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeamMembers must be used within TeamMembersProvider");
  return ctx;
}
