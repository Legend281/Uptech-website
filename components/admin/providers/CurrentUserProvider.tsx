"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminUser } from "@/lib/admin/types";

/*
 * Real Supabase Auth session, replacing what used to be a plain in-memory
 * "preview as one of 6 mock personas" switcher (see this file's own history
 * — it used to say "nothing gates any route... Real auth replaces this
 * entirely in a later phase"). middleware.ts is what actually blocks an
 * unauthenticated request from reaching any /admin page; this provider's
 * job is turning that session into the AdminUser shape the rest of the
 * dashboard already expects, and — per Admin_Dashboard_Requirements.md
 * Section 2/9's "2FA wherever Supabase supports it" — gating access behind
 * a TOTP challenge for any account that has enrolled one.
 *
 * mfaPending is checked here (not just once on the login page) because a
 * session cookie alone only proves AAL1 (password). Someone who closes the
 * tab mid-challenge, or already has a stale AAL1 cookie, could otherwise
 * navigate straight to /admin and skip the code entirely if this were only
 * enforced on the login form.
 *
 * Editing an existing staff member's role/department or deactivating them
 * (UserPatch below) isn't wired to real Supabase writes yet — see
 * components/admin/settings/UsersSettings.tsx's own note. Creating a new
 * account for real goes through StaffInviteDialog.tsx instead (a real
 * emailed invite, not this file).
 */

export type UserPatch = Partial<Pick<AdminUser, "role" | "department" | "languages" | "location" | "active">>;

type CurrentUserContextValue = {
  currentUser: AdminUser | null;
  loading: boolean;
  mfaPending: boolean;
  verifyMfa: (code: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

function toAdminUser(id: string, row: {
  name: string;
  role: string;
  department: string;
  avatar_initials: string;
  location: string;
  languages: string[];
}): AdminUser {
  return {
    id,
    name: row.name,
    role: row.role as AdminUser["role"],
    department: row.department as AdminUser["department"],
    avatarInitials: row.avatar_initials,
    location: row.location,
    languages: row.languages as AdminUser["languages"],
  };
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    async function loadProfile(userId: string) {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (cancelled) return;
      if (error || !data) {
        console.error("[auth] Signed in, but no matching profiles row exists for this account:", error);
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      setCurrentUser(toAdminUser(userId, data));
      setLoading(false);
    }

    async function handleSession(userId: string) {
      const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (cancelled) return;
      if (aalError) {
        console.error("[auth] Failed to check MFA status:", aalError);
      }
      // nextLevel > currentLevel means a verified TOTP factor exists but this
      // specific session hasn't completed the challenge yet — block on it
      // before loading (or re-loading) the profile.
      if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
        setMfaPending(true);
        setLoading(false);
        return;
      }
      setMfaPending(false);
      await loadProfile(userId);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      if (data.user) {
        handleSession(data.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSession(session.user.id);
      } else {
        setCurrentUser(null);
        setMfaPending(false);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function verifyMfa(code: string): Promise<{ ok: boolean; error?: string }> {
    const supabase = getSupabaseBrowserClient();
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError || !factors) {
      return { ok: false, error: listError?.message ?? "Couldn't load your authentication factors." };
    }
    const factor = factors.totp[0];
    if (!factor) {
      return { ok: false, error: "No verified authenticator found on this account." };
    }
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (verifyError) {
      return { ok: false, error: verifyError.message };
    }
    setMfaPending(false);
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (!profileError && profileData) {
        setCurrentUser(toAdminUser(data.user.id, profileData));
      }
    }
    setLoading(false);
    return { ok: true };
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, loading, mfaPending, verifyMfa, signOut }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

/** Every existing call site expects a real, non-null AdminUser — safe everywhere it's actually called, because AdminShell doesn't render its children until useCurrentUserStatus() reports a loaded, MFA-satisfied user. */
export function useCurrentUser(): AdminUser {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  if (!ctx.currentUser) throw new Error("useCurrentUser called before the session finished loading — gate rendering on useCurrentUserStatus() first (see AdminShell.tsx).");
  return ctx.currentUser;
}

/** The one place allowed to see the loading/unauthenticated/MFA-pending states directly — AdminShell's gate, the account menu's sign-out action, and the 2FA setup modal. */
export function useCurrentUserStatus(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUserStatus must be used within CurrentUserProvider");
  return ctx;
}
