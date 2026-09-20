"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_ADMIN_USERS } from "@/lib/admin/mockData";
import type { AdminUser } from "@/lib/admin/types";

/*
 * Plain in-memory Context — a UI preview convenience for switching between
 * the 6 mock personas, not session/auth logic. Nothing persists to
 * localStorage and nothing gates any route. Real auth (Supabase) replaces
 * this entirely in a later phase.
 */
type CurrentUserContextValue = {
  currentUser: AdminUser;
  setCurrentUserId: (id: string) => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(MOCK_ADMIN_USERS[0].id);

  const value = useMemo<CurrentUserContextValue>(() => {
    const currentUser =
      MOCK_ADMIN_USERS.find((user) => user.id === currentUserId) ?? MOCK_ADMIN_USERS[0];
    return { currentUser, setCurrentUserId };
  }, [currentUserId]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): AdminUser {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx.currentUser;
}

export function useSetCurrentUserId(): (id: string) => void {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useSetCurrentUserId must be used within CurrentUserProvider");
  return ctx.setCurrentUserId;
}
