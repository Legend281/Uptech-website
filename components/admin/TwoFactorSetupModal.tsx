"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type FactorState = { status: "loading" } | { status: "not-enrolled" } | { status: "enrolled"; factorId: string } | { status: "enrolling"; factorId: string; qrCode: string; secret: string };

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";

/**
 * Admin_Dashboard_Requirements.md Section 2/9: "Enable 2FA wherever Supabase
 * supports it." Self-service, per staff account — there's no "require every
 * account to enroll" enforcement (that would need a Settings/user-management
 * screen that doesn't exist yet), but AdminShell's MfaChallengeScreen
 * enforces the check for any account that HAS enrolled one.
 */
export function TwoFactorSetupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const formId = useId();
  const [state, setState] = useState<FactorState>({ status: "loading" });
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCode("");
    refreshState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function refreshState() {
    setState({ status: "loading" });
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error || !data) {
      toast.error("Couldn't load two-factor status", { description: error?.message });
      setState({ status: "not-enrolled" });
      return;
    }
    // .totp is typed (and populated) as verified-only factors — .all carries every status.
    const verified = data.totp[0];
    if (verified) {
      setState({ status: "enrolled", factorId: verified.id });
      return;
    }
    // Clean up any abandoned enrollment attempt so a fresh one can start.
    const unverified = data.all.find((f) => f.factor_type === "totp" && f.status === "unverified");
    if (unverified) {
      await supabase.auth.mfa.unenroll({ factorId: unverified.id });
    }
    setState({ status: "not-enrolled" });
  }

  async function handleStartEnroll() {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error || !data) {
      toast.error("Couldn't start setup", { description: error?.message });
      return;
    }
    setState({ status: "enrolling", factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    if (state.status !== "enrolling") return;
    setVerifying(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: state.factorId, code: code.trim() });
    setVerifying(false);
    if (error) {
      toast.error("Invalid code", { description: error.message });
      return;
    }
    toast.success("Two-factor authentication enabled");
    setState({ status: "enrolled", factorId: state.factorId });
  }

  async function handleRemove() {
    if (state.status !== "enrolled") return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId: state.factorId });
    if (error) {
      toast.error("Couldn't remove", { description: error.message });
      return;
    }
    toast.success("Two-factor authentication removed");
    setState({ status: "not-enrolled" });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            Two-Factor Authentication
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <div className="px-5 py-5">
          {state.status === "loading" && (
            <div className="flex justify-center py-6">
              <MaterialIcon name="progress_activity" className="animate-spin text-[24px] text-slate-400" />
            </div>
          )}

          {state.status === "not-enrolled" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <MaterialIcon name="shield" className="text-[32px] text-slate-300" />
              <p className="text-sm text-slate-600">
                Not enabled. Add an authenticator app (like Google Authenticator or Authy) for a second layer of
                protection on your login.
              </p>
              <button type="button" onClick={handleStartEnroll} className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-900">
                Set Up Two-Factor Authentication
              </button>
            </div>
          )}

          {state.status === "enrolling" && (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <p className="text-sm text-slate-600">Scan this with your authenticator app, then enter the 6-digit code it shows.</p>
              <img src={state.qrCode} alt="Two-factor setup QR code" className="mx-auto h-40 w-40 rounded-lg border border-slate-200" />
              <p className="text-center text-xs text-slate-400">
                Can&apos;t scan? Enter manually: <span className="font-mono text-slate-600">{state.secret}</span>
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="000000"
                className={`${inputClasses} text-center font-mono text-lg tracking-[0.4em]`}
              />
              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verifying ? "Verifying…" : "Verify & Enable"}
              </button>
            </form>
          )}

          {state.status === "enrolled" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <MaterialIcon name="verified_user" className="text-[32px] text-emerald-500" />
              <p className="text-sm text-slate-600">Two-factor authentication is enabled on your account.</p>
              <button type="button" onClick={handleRemove} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                Remove two-factor authentication
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
