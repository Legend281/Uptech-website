"use client";

import { useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUserStatus } from "@/components/admin/providers/CurrentUserProvider";

/**
 * Shown by AdminShell whenever a session has an enrolled TOTP factor but
 * hasn't completed the challenge yet (AAL1, not AAL2) — covers both a fresh
 * login and a stale AAL1 cookie from someone who closed the tab mid-challenge.
 */
export function MfaChallengeScreen() {
  const { verifyMfa, signOut } = useCurrentUserStatus();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    const result = await verifyMfa(code.trim());
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error ?? "Invalid code. Please try again.");
      return;
    }
    setStatus("idle");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <MaterialIcon name="shield_lock" className="text-[24px]" />
        </div>
        <h1 className="mt-4 text-center font-sans text-lg font-bold text-navy-950">Two-Factor Verification</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Enter the 6-digit code from your authenticator app.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            placeholder="000000"
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-center font-mono text-lg tracking-[0.4em] text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
          />

          {status === "error" && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <MaterialIcon name="error" className="mt-0.5 shrink-0 text-[16px]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || code.length !== 6}
            className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Verifying…" : "Verify"}
          </button>
        </form>

        <button type="button" onClick={() => void signOut()} className="mt-4 w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-700">
          Sign out
        </button>
      </div>
    </div>
  );
}
