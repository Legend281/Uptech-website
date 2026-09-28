"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Where both a staff invite link (app/api/admin/staff/route.ts's redirectTo)
 * and a "Forgot password?" reset link (app/admin/login/page.tsx's
 * resetPasswordForEmail call) land. Either way, Supabase has already turned
 * the email link into a real session by the time this page loads — this
 * only ever asks "is there a usable session right now," never how it got
 * here, so one page serves both flows with no branching needed. Standalone,
 * like /admin/login (see AdminShell.tsx's pathname bypass) — no sidebar, no
 * data providers.
 */
export default function SetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <h1 className="mt-6 text-center font-sans text-lg font-bold text-navy-950">Set Your Password</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Choose a password to finish signing in.</p>

        {!ready ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center text-sm text-slate-500">
            <MaterialIcon name="error" className="text-[24px] text-slate-300" />
            This link has expired or already been used. Request a new one — an invite from an Administrator, or
            &quot;Forgot password?&quot; on the sign-in page — and try again.
          </div>
        ) : status === "success" ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center text-sm text-slate-600">
            <MaterialIcon name="check_circle" className="text-[24px] text-emerald-500" />
            Password set — taking you to the dashboard…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</span>
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
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
