"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import { canManageTeam, getTeamSaveErrors, normalizeTeamInput, type TeamMemberInput } from "@/lib/admin/team";
import { describeDbError, getSupabaseBrowserClient, publicPhotoUrl, uploadDataUrl } from "@/lib/supabase/client";
import type { ActionResult, AdminUser, TeamMemberRecord, TeamMemberStatus } from "@/lib/admin/types";

/*
 * Team Members, stored in Supabase (supabase/003_team_members.sql +
 * 017_team_members_staff_policies.sql) — the admin module behind the Who We
 * Are page's "Meet the Team" section (lib/team.ts reads the
 * visible_team_members view directly). Real writes now, replacing what used
 * to be a localStorage-only store that the public page could never see.
 *
 * Same posture as TestimonialsProvider: every write goes through the
 * signed-in staff session, so the database's policies and triggers (RLS
 * plus the "hide, never delete once ever_visible" guard) have the final
 * say; lib/admin/team.ts's checks just give a clear message before the
 * round trip.
 */

type Row = {
  id: string;
  name: string;
  title: string;
  department: TeamMemberRecord["department"];
  entity: TeamMemberRecord["entity"];
  photo_path: string | null;
  bio: string | null;
  profile_url: string | null;
  display_order: number;
  status: TeamMemberStatus;
  ever_visible: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function rowToMember(row: Row): TeamMemberRecord {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    department: row.department,
    entity: row.entity,
    photoPath: row.photo_path ?? undefined,
    photo: publicPhotoUrl("team-photos", row.photo_path),
    bio: row.bio ?? undefined,
    linkedinUrl: row.profile_url ?? undefined,
    displayOrder: row.display_order,
    status: row.status,
    everVisible: row.ever_visible,
    createdById: row.created_by ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToColumns(input: TeamMemberInput, photoPath: string | null) {
  return {
    name: input.name,
    title: input.title,
    department: input.department,
    entity: input.entity,
    photo_path: photoPath,
    bio: input.bio ?? null,
    profile_url: input.linkedinUrl ?? null,
    display_order: input.displayOrder,
    status: input.status,
  };
}

type TeamContextValue = {
  members: TeamMemberRecord[];
  loading: boolean;
  loadError: string | null;
  addMember: (input: TeamMemberInput, user: AdminUser) => Promise<ActionResult>;
  updateMember: (id: string, input: TeamMemberInput, user: AdminUser) => Promise<ActionResult>;
  setStatus: (id: string, status: TeamMemberStatus, user: AdminUser) => Promise<ActionResult>;
  /** Swaps display order with the neighbour before/after, among all members. */
  move: (id: string, direction: -1 | 1, user: AdminUser) => Promise<ActionResult>;
  deleteMember: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const TeamContext = createContext<TeamContextValue | null>(null);

const denied: ActionResult = { ok: false, reasons: ["Only an Administrator can change the team roster."] };

export function TeamMembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const logActivity = useLogActivity();

  async function revalidate() {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    if (data.session) await revalidatePublicPages(["/who-we-are"], data.session.access_token);
  }

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient().from("team_members").select("*").order("display_order", { ascending: true });
    if (error) {
      console.error("[team] Failed to load team members:", error);
      setLoadError(describeDbError(error));
    } else if (data) {
      setMembers((data as Row[]).map(rowToMember));
      setLoadError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    function apply(hasSession: boolean) {
      if (hasSession) void refresh();
      else {
        setMembers([]);
        setLoadError(null);
        setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "TOKEN_REFRESHED") apply(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/team" });
  }

  async function savePhoto(input: TeamMemberInput, currentPath?: string): Promise<string | null> {
    if (!input.photo) return null;
    if (input.photo.startsWith("data:")) {
      try {
        return await uploadDataUrl("team-photos", input.photo, "team");
      } catch (err) {
        console.warn("[team-photos] Storage upload failed, saving optimized photo directly:", err);
        return input.photo;
      }
    }
    return currentPath ?? null;
  }

  async function addMember(input: TeamMemberInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const clean = normalizeTeamInput(input);
    const errors = getTeamSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    let photoPath: string | null;
    try {
      photoPath = await savePhoto(clean);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The photo couldn't be uploaded."] };
    }

    const { data, error } = await getSupabaseBrowserClient()
      .from("team_members")
      .insert({ ...inputToColumns(clean, photoPath), created_by: user.id })
      .select()
      .single();
    if (error || !data) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    if (clean.status === "visible") void revalidate();
    log(
      clean.status === "visible" ? "person_add" : "edit_note",
      clean.status === "visible" ? `${user.name} added ${clean.name} to the Who We Are team.` : `${user.name} added ${clean.name} to the team roster (hidden for now).`,
    );
    return { ok: true };
  }

  async function updateMember(id: string, input: TeamMemberInput, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing) return { ok: false, reasons: ["This team member no longer exists."] };
    const clean = normalizeTeamInput(input);
    const errors = getTeamSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    let photoPath: string | null;
    try {
      photoPath = await savePhoto(clean, existing.photoPath);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The photo couldn't be uploaded."] };
    }

    const { error } = await getSupabaseBrowserClient().from("team_members").update(inputToColumns(clean, photoPath)).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    if (existing.photoPath && existing.photoPath !== photoPath) void getSupabaseBrowserClient().storage.from("team-photos").remove([existing.photoPath]);
    if (existing.status === "visible" || clean.status === "visible") void revalidate();

    if (clean.status !== existing.status) {
      log(clean.status === "visible" ? "publish" : "unpublished", `${user.name} ${clean.status === "visible" ? "showed" : "hid"} ${clean.name} on the Who We Are page.`);
    } else {
      log("edit_note", `${user.name} edited ${clean.name}'s team profile.`);
    }
    return { ok: true };
  }

  async function setStatus(id: string, status: TeamMemberStatus, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing || existing.status === status) return { ok: true };

    const { error } = await getSupabaseBrowserClient().from("team_members").update({ status }).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    void revalidate();
    log(status === "visible" ? "publish" : "unpublished", `${user.name} ${status === "visible" ? "showed" : "hid"} ${existing.name} on the Who We Are page.`);
    return { ok: true };
  }

  async function move(id: string, direction: -1 | 1, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const ordered = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = ordered.findIndex((m) => m.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return { ok: true };

    const a = ordered[index];
    const b = ordered[targetIndex];
    const supabase = getSupabaseBrowserClient();
    const [{ error: errorA }, { error: errorB }] = await Promise.all([
      supabase.from("team_members").update({ display_order: b.displayOrder }).eq("id", a.id),
      supabase.from("team_members").update({ display_order: a.displayOrder }).eq("id", b.id),
    ]);
    if (errorA || errorB) return { ok: false, reasons: [describeDbError(errorA ?? errorB)] };

    await refresh();
    if (a.status === "visible" || b.status === "visible") void revalidate();
    return { ok: true };
  }

  async function deleteMember(id: string, user: AdminUser): Promise<ActionResult> {
    if (!canManageTeam(user)) return denied;
    const existing = members.find((m) => m.id === id);
    if (!existing) return { ok: true };

    const { error } = await getSupabaseBrowserClient().from("team_members").delete().eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    if (existing.photoPath) void getSupabaseBrowserClient().storage.from("team-photos").remove([existing.photoPath]);
    await refresh();
    if (existing.status === "visible") void revalidate();
    log("delete", `${user.name} deleted ${existing.name}'s team profile.`);
    return { ok: true };
  }

  return (
    <TeamContext.Provider value={{ members, loading, loadError, addMember, updateMember, setStatus, move, deleteMember }}>{children}</TeamContext.Provider>
  );
}

export function useTeamMembers() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeamMembers must be used within TeamMembersProvider");
  return ctx;
}
