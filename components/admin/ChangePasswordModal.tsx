"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const inputClasses =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

/**
 * The self-service counterpart to /admin/set-password (which only ever
 * runs from an invite or a "Forgot password?" link) — for anyone who's
 * already signed in and just wants to pick a new password, including
 * someone who signed in on a temporary one an Administrator set for them.
 * Re-checks the current password first via a real signInWithPassword
 * call — updateUser() alone would let anyone at an unlocked, already-signed-in
 * browser tab permanently lock the real owner out, which is a meaningfully
 * worse outcome than the transient access they'd already have either way.
 */
export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const formId = useId();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setErrorMessage(null);
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match.");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();

    // currentUser (from the profiles table) never carries an email — email
    // only lives in Supabase's own Auth system, by design (003_staff_auth.sql).
    // The already-active session is the real source for it.
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user?.email) {
      setSaving(false);
      setErrorMessage("Couldn't confirm your signed-in session — try signing out and back in.");
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: authData.user.email, password: currentPassword });
    if (reauthError) {
      setSaving(false);
      setErrorMessage("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (updateError) {
      setErrorMessage(updateError.message);
      return;
    }

    toast.success("Password changed");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div data-lenis-prevent className="relative flex max-h-[90dvh] w-full max-w-sm flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            Change Password
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto overscroll-contain flex flex-col gap-4 px-5 py-5">
          <label className="flex flex-col gap-1.5">
            <span className={labelClasses}>Current Password</span>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={labelClasses}>New Password</span>
              <button type="button" onClick={() => setShowPasswords((v) => !v)} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClasses}>Confirm New Password</span>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={inputClasses}
            />
          </label>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <MaterialIcon name="error" className="mt-0.5 shrink-0 text-[16px]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Changing…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
