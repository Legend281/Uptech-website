"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminUser } from "@/lib/admin/types";
import type { UserPatch } from "@/components/admin/providers/CurrentUserProvider";

/*
 * Replaces MOCK_ADMIN_USERS — every call site that used to do
 * MOCK_ADMIN_USERS.find(...) / .map(...) now does the exact same thing
 * against useStaff()'s array, unchanged, since this returns the identical
 * AdminUser[] shape. Fetched once per admin session: assignee pickers,
 * "who's covering this," and the language-mismatch check all need the full
 * staff list, not just the signed-in user (CurrentUserProvider's job).
 *
 * updateUser (added alongside components/admin/settings/UsersSettings.tsx)
 * writes real changes to the profiles table — see
 * supabase/012_profiles_active_and_update.sql for the column and the RLS
 * policy. RLS only gates "administrator or not"; the specific rules below
 * (no self-demotion, no self-deactivation, always one active Administrator)
 * are enforced here, the same split Leads' own update policy uses.
 */

export function isActive(user: AdminUser): boolean {
  return user.active !== false;
}

/** Deactivating/reactivating and permission changes are more than routine edits — surfaced to the caller so it can log them distinctly (see UsersSettings.tsx). */
export type UserUpdateResult = { ok: true; changed: string[] } | { ok: false; reason: string };

type StaffContextValue = {
  staff: AdminUser[];
  updateUser: (id: string, patch: UserPatch, actor: AdminUser) => Promise<UserUpdateResult>;
};

const StaffContext = createContext<StaffContextValue | null>(null);

type ProfileRow = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar_initials: string;
  location: string;
  languages: string[];
  active: boolean | null;
};

function fromRow(row: ProfileRow): AdminUser {
  return {
    id: row.id,
    name: row.name,
    role: row.role as AdminUser["role"],
    department: row.department as AdminUser["department"],
    avatarInitials: row.avatar_initials,
    location: row.location,
    languages: row.languages as AdminUser["languages"],
    active: row.active ?? true,
  };
}

/**
 * The account rules, in one place:
 *  - only Administrators change accounts;
 *  - nobody changes their own role or deactivates themselves (no self-lockout, no self-promotion);
 *  - there is always at least one active Administrator.
 */
function checkUserChange(staff: AdminUser[], target: AdminUser, patch: UserPatch, actor: AdminUser): string | null {
  if (actor.role !== "administrator") return "Only an Administrator can change accounts.";
  if (target.id === actor.id && patch.role !== undefined && patch.role !== target.role) {
    return "You can't change your own role. Ask another Administrator.";
  }
  if (target.id === actor.id && patch.active === false) return "You can't deactivate your own account.";
  const losesAdmin =
    target.role === "administrator" && isActive(target) && ((patch.role !== undefined && patch.role !== "administrator") || patch.active === false);
  if (losesAdmin && !staff.some((u) => u.id !== target.id && u.role === "administrator" && isActive(u))) {
    return "This is the last active Administrator. Make someone else an Administrator first.";
  }
  return null;
}

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<AdminUser[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("profiles")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          console.error("[staff] Failed to load staff profiles:", error);
          return;
        }
        setStaff((data as ProfileRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function updateUser(id: string, patch: UserPatch, actor: AdminUser): Promise<UserUpdateResult> {
    const target = staff.find((u) => u.id === id);
    if (!target) return { ok: false, reason: "That account no longer exists." };
    const problem = checkUserChange(staff, target, patch, actor);
    if (problem) return { ok: false, reason: problem };

    const changes: string[] = [];
    if (patch.role && patch.role !== target.role) changes.push("role");
    if (patch.department && patch.department !== target.department) changes.push("department");
    if (patch.active !== undefined && patch.active !== isActive(target)) changes.push(patch.active ? "reactivated" : "deactivated");

    setStaff((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

    const row: Record<string, unknown> = {};
    if (patch.role !== undefined) row.role = patch.role;
    if (patch.department !== undefined) row.department = patch.department;
    if (patch.languages !== undefined) row.languages = patch.languages;
    if (patch.location !== undefined) row.location = patch.location;
    if (patch.active !== undefined) row.active = patch.active;

    getSupabaseBrowserClient()
      .from("profiles")
      .update(row)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[staff] Failed to update ${id}:`, error);
      });

    return { ok: true, changed: changes };
  }

  return <StaffContext.Provider value={{ staff, updateUser }}>{children}</StaffContext.Provider>;
}

export function useStaff(): AdminUser[] {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used within StaffProvider");
  return ctx.staff;
}

export function useStaffActions(): { updateUser: StaffContextValue["updateUser"] } {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaffActions must be used within StaffProvider");
  return { updateUser: ctx.updateUser };
}
