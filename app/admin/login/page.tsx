"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Standalone — deliberately outside AdminShell's sidebar/topbar/provider
 * tree (see AdminShell.tsx's own pathname check). No LeadsProvider here:
 * there's no session yet for it to fetch anything with.
 */
export default function AdminLoginPage() {
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
      return;
    }

    // A full navigation (not router.push) so middleware re-runs against the
    // now-authenticated request and every provider re-mounts with a real session.
    window.location.href = "/admin";
  }

  function openForgotPassword() {
    setResetEmail(email);
    setResetStatus("idle");
    setMode("forgot");
  }

  function backToSignIn() {
    setMode("signin");
    setStatus("idle");
    setErrorMessage(null);
  }

  /*
   * Lands on /admin/set-password — the same page an invite link uses. That
   * page only checks "is there a usable session right now" before letting
   * someone pick a password; it never asks how the session got there, so a
   * password-recovery link works through it with no changes.
   *
   * Never reveals whether resetEmail actually belongs to a staff account —
   * same response either way, so this can't be used to enumerate real staff
   * emails. Supabase's own send-rate limiting on this endpoint is what
   * keeps this from being spammed, the same protection signInWithPassword
   * above already relies on for its own endpoint.
   */
  async function handleResetSubmit(event: FormEvent) {
    event.preventDefault();
    setResetStatus("submitting");
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/admin/set-password`,
    });
    setResetStatus("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
        <div className="flex justify-center">
          <Image src="/UPTECH_LOG.png" alt="Uptech Consulting & Outsourcing" width={160} height={40} className="h-10 w-auto" priority />
        </div>

        {mode === "signin" ? (
          <>
            <h1 className="mt-6 text-center font-sans text-lg font-bold text-navy-950">Staff Sign In</h1>
            <p className="mt-1 text-center text-sm text-slate-500">Internal dashboard — Uptech Consulting staff only.</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
                  <button type="button" onClick={openForgotPassword} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  >
                    <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} className="text-[18px]" />
                  </button>
                </div>
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
                {status === "submitting" ? (
                  <>
                    <MaterialIcon name="hourglass_top" className="text-[16px]" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-center font-sans text-lg font-bold text-navy-950">Reset Your Password</h1>
            <p className="mt-1 text-center text-sm text-slate-500">
              {resetStatus === "sent"
                ? "Check your email for a link to set a new password."
                : "Enter your staff email — we'll send a link to set a new one."}
            </p>

            {resetStatus === "sent" ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-2 text-center">
                <MaterialIcon name="mark_email_read" className="text-[28px] text-teal-600" />
                <p className="text-sm text-slate-600">
                  If <span className="font-semibold text-navy-950">{resetEmail.trim()}</span> has a staff account, a reset
                  link is on its way. It can take a couple of minutes to arrive.
                </p>
                <button type="button" onClick={backToSignIn} className="mt-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  />
                </label>

                <button
                  type="submit"
                  disabled={resetStatus === "submitting"}
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetStatus === "submitting" ? (
                    <>
                      <MaterialIcon name="hourglass_top" className="text-[16px]" />
                      Sending…
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button type="button" onClick={backToSignIn} className="text-sm font-semibold text-slate-500 hover:text-navy-950">
                  ← Back to Sign In
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
