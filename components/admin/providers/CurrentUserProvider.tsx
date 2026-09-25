"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { departmentLabels, roleLabels } from "@/lib/admin/labels";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import type { ActionResult, AdminUser } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-users-v1";

/*
 * Admin accounts (Settings, Admin_Content_Pages_Spec.md 4.2) plus the
 * "Preview as" persona switch. A UI preview, not auth: nothing here gates a
 * route. Real staff sign-in is handled separately.
 *
 * Seeded from the six mock personas, then editable and persisted to this
 * browser's localStorage, like the other browser-only modules.
 */

export type UserPatch = Partial<Pick<AdminUser, "role" | "department" | "languages" | "location" | "active">>;
export type NewUserInput = Pick<AdminUser, "name" | "email" | "role" | "department" | "location" | "languages">;

type CurrentUserContextValue = {
  users: AdminUser[];
  currentUser: AdminUser;
  setCurrentUserId: (id: string) => void;
  updateUser: (id: string, patch: UserPatch, actor: AdminUser) => Promise<ActionResult>;
  addUser: (input: NewUserInput, actor: AdminUser) => Promise<ActionResult>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

function load(): AdminUser[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as AdminUser[]) : MOCK_ADMIN_USERS;
  } catch {
    return MOCK_ADMIN_USERS;
  }
}

function save(users: AdminUser[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Best-effort only.
  }
}

export function isActive(user: AdminUser): boolean {
  return user.active !== false;
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * The account rules, in one place:
 *  - only Administrators manage accounts;
 *  - nobody changes their own role or deactivates themselves (no self-lockout, no self-promotion);
 *  - there is always at least one active Administrator.
 */
function checkUserChange(users: AdminUser[], target: AdminUser, patch: UserPatch, actor: AdminUser): string | null {
  if (actor.role !== "administrator") return "Only an Administrator can change accounts.";
  if (target.id === actor.id && patch.role !== undefined && patch.role !== target.role) return "You can't change your own role. Ask another Administrator.";
  if (target.id === actor.id && patch.active === false) return "You can't deactivate your own account.";
  const losesAdmin =
    target.role === "administrator" && isActive(target) && ((patch.role !== undefined && patch.role !== "administrator") || patch.active === false);
  if (losesAdmin && !users.some((u) => u.id !== target.id && u.role === "administrator" && isActive(u))) {
    return "This is the last active Administrator. Make someone else an Administrator first.";
  }
  return null;
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [currentUserId, setCurrentUserId] = useState(MOCK_ADMIN_USERS[0].id);
  const logActivity = useLogActivity();

  useEffect(() => {
    setUsers(load());
  }, []);

  function commit(next: AdminUser[]) {
    setUsers(next);
    save(next);
  }

  async function updateUser(id: string, patch: UserPatch, actor: AdminUser): Promise<ActionResult> {
    const target = users.find((u) => u.id === id);
    if (!target) return { ok: false, reasons: ["That account no longer exists."] };
    const problem = checkUserChange(users, target, patch, actor);
    if (problem) return { ok: false, reasons: [problem] };
    commit(users.map((u) => (u.id === id ? { ...u, ...patch } : u)));

    // Every permission change is logged (spec 0.2).
    const changes: string[] = [];
    if (patch.role && patch.role !== target.role) changes.push(`role ${roleLabels[target.role]} → ${roleLabels[patch.role]}`);
    if (patch.department && patch.department !== target.department)
      changes.push(`department ${departmentLabels[target.department]} → ${departmentLabels[patch.department]}`);
    if (patch.active !== undefined && patch.active !== isActive(target)) changes.push(patch.active ? "reactivated" : "deactivated");
    logActivity(
      changes.length
        ? { icon: patch.active === false ? "block" : "manage_accounts", description: `${actor.name} changed ${target.name}'s account: ${changes.join(", ")}.`, relatedHref: "/admin/settings" }
        : { icon: "edit_note", description: `${actor.name} updated ${target.name}'s account details.`, relatedHref: "/admin/settings" },
    );
    return { ok: true };
  }

  async function addUser(input: NewUserInput, actor: AdminUser): Promise<ActionResult> {
    if (actor.role !== "administrator") return { ok: false, reasons: ["Only an Administrator can add accounts."] };
    const name = input.name.trim();
    const email = input.email?.trim().toLowerCase() ?? "";
    if (!name) return { ok: false, reasons: ["Add their name."] };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, reasons: ["Add a valid email address."] };
    if (users.some((u) => u.email?.toLowerCase() === email)) return { ok: false, reasons: ["An account with that email already exists."] };
    if (input.languages.length === 0) return { ok: false, reasons: ["Pick at least one language they work in."] };
    const user: AdminUser = {
      ...input,
      name,
      email,
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      avatarInitials: initialsFor(name),
      active: true,
    };
    commit([...users, user]);
    logActivity({
      icon: "person_add",
      description: `${actor.name} added ${name} as ${input.role === "administrator" ? "an" : "a"} ${roleLabels[input.role]} in ${departmentLabels[input.department]}.`,
      relatedHref: "/admin/settings",
    });
    return { ok: true };
  }

  const value = useMemo<CurrentUserContextValue>(() => {
    const currentUser = users.find((user) => user.id === currentUserId && isActive(user)) ?? users.find(isActive) ?? users[0];
    return { users, currentUser, setCurrentUserId, updateUser, addUser };
    // updateUser/addUser close over `users`, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, currentUserId]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

function useCtx(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("Must be used within CurrentUserProvider");
  return ctx;
}

export function useCurrentUser(): AdminUser {
  return useCtx().currentUser;
}

export function useSetCurrentUserId(): (id: string) => void {
  return useCtx().setCurrentUserId;
}

/** Every account, active or not — look-ups for "assigned to" and "recorded by" must still resolve deactivated people. */
export function useAdminUsers(): AdminUser[] {
  return useCtx().users;
}

export function useUserActions() {
  const { updateUser, addUser } = useCtx();
  return { updateUser, addUser };
}
