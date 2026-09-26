"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminUser } from "@/lib/admin/types";

/*
 * Replaces MOCK_ADMIN_USERS — every call site that used to do
 * MOCK_ADMIN_USERS.find(...) / .map(...) now does the exact same thing
 * against useStaff()'s array, unchanged, since this returns the identical
 * AdminUser[] shape. Fetched once per admin session: assignee pickers,
 * "who's covering this," and the language-mismatch check all need the full
 * staff list, not just the signed-in user (CurrentUserProvider's job).
 */
const StaffContext = createContext<AdminUser[] | null>(null);

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
        setStaff(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            role: row.role as AdminUser["role"],
            department: row.department as AdminUser["department"],
            avatarInitials: row.avatar_initials,
            location: row.location,
            languages: row.languages as AdminUser["languages"],
          }))
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <StaffContext.Provider value={staff}>{children}</StaffContext.Provider>;
}

export function useStaff(): AdminUser[] {
  const ctx = useContext(StaffContext);
  if (ctx === null) throw new Error("useStaff must be used within StaffProvider");
  return ctx;
}
