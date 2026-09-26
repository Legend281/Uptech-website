"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Where a staff invite link (app/api/admin/staff/route.ts's redirectTo)
 * lands. Clicking the invite email signs the person in with a real session
 * but no usable password yet — this is the one required step before they
 * can ever log in again normally. Standalone, like /admin/login (see
 * AdminShell.tsx's pathname bypass) — no sidebar, no data providers.
 */
export default function SetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setReady(Boolean(data.user));
    });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords don't match.");
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("success");
    window.location.href = "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
        <div className="flex justify-center">
          <Image src="/UPTECH_LOG.png" alt="Uptech Consulting & Outsourcing" width={160} height={40} className="h-10 w-auto" priority />
        </div>
        <h1 className="mt-6 text-center font-sans text-lg font-bold text-navy-950">Welcome to the Team</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Set a password to finish activating your account.</p>

        {!ready ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center text-sm text-slate-500">
            <MaterialIcon name="error" className="text-[24px] text-slate-300" />
            This link has expired or already been used. Ask an Administrator to send a new invite.
          </div>
        ) : status === "success" ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center text-sm text-slate-600">
            <MaterialIcon name="check_circle" className="text-[24px] text-emerald-500" />
            Password set — taking you to the dashboard…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
              />
            </label>

            {status === "error" && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                <MaterialIcon name="error" className="mt-0.5 shrink-0 text-[16px]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Setting password…" : "Set Password & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
