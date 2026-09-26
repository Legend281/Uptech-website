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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
        <div className="flex justify-center">
          <Image src="/UPTECH_LOG.png" alt="Uptech Consulting & Outsourcing" width={160} height={40} className="h-10 w-auto" priority />
        </div>
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
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
      </div>
    </div>
  );
}
