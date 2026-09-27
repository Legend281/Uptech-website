"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useStaff as useAdminUsers } from "@/components/admin/providers/StaffProvider";
import { departmentLabels } from "@/lib/admin/labels";
import { RESPONSE_SLA_HOURS } from "@/lib/admin/leadStaleness";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_SETTINGS,
  canEditSystemSettings,
  validateAssignment,
  validateCompany,
  type CompanyDetails,
  type DepartmentAssignment,
  type NotificationPrefs,
  type Settings,
} from "@/lib/admin/settings";
import type { ActionResult, AdminUser, Department } from "@/lib/admin/types";

/*
 * Settings (Admin_Content_Pages_Spec.md Section 4) — real Supabase now
 * (supabase/021_settings_real_data.sql), not the browser-only store this
 * used to be. Assignment Settings in particular is read by real, live code
 * (LeadsProvider's autoAssigneeFor decides who actually gets the next
 * lead), so it needed a shared source of truth, not one copy per browser.
 *
 * app_settings holds one row per section ('assignment', 'company'); own
 * notification_prefs row is fetched per signed-in session. Same
 * optimistic-write posture as every other real provider here: update local
 * state immediately, fire the write, log errors only.
 */

type SettingsContextValue = {
  settings: Settings;
  /** False until the signed-in session's settings have been read at least once. Forms wait for it, so they never start from defaults over a real saved value. */
  loaded: boolean;
  saveAssignment: (department: Department, value: DepartmentAssignment, actor: AdminUser) => Promise<ActionResult>;
  saveCompany: (details: CompanyDetails, actor: AdminUser) => Promise<ActionResult>;
  /** Anyone can change their own notification preferences — nobody else's. */
  saveNotifications: (userId: string, prefs: NotificationPrefs, actor: AdminUser) => Promise<ActionResult>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const adminOnly: ActionResult = { ok: false, reasons: ["Only an Administrator can change system settings."] };

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const users = useAdminUsers();
  const logActivity = useLogActivity();

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setSettings(DEFAULT_SETTINGS);
      setLoaded(true);
      return;
    }

    const [{ data: appRows, error: appError }, { data: prefRow, error: prefError }] = await Promise.all([
      supabase.from("app_settings").select("key, value"),
      supabase.from("notification_prefs").select("prefs").eq("staff_id", userId).maybeSingle(),
    ]);

    if (appError) console.error("[settings] Failed to load app_settings:", appError.message);
    if (prefError) console.error("[settings] Failed to load notification_prefs:", prefError.message);

    const rows = (appRows ?? []) as { key: string; value: unknown }[];
    const assignmentRow = rows.find((r) => r.key === "assignment")?.value as Settings["assignment"] | undefined;
    const companyRow = rows.find((r) => r.key === "company")?.value as CompanyDetails | undefined;

    setSettings({
      assignment: { ...DEFAULT_SETTINGS.assignment, ...assignmentRow },
      notifications: prefRow ? { [userId]: prefRow.prefs as NotificationPrefs } : {},
      company: { ...DEFAULT_SETTINGS.company, ...companyRow },
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "TOKEN_REFRESHED") void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/settings" });
  }

  async function upsertAppSetting(key: "assignment" | "company", value: unknown, actorId: string): Promise<string | null> {
    const { error } = await getSupabaseBrowserClient()
      .from("app_settings")
      .upsert({ key, value, updated_by: actorId, updated_at: new Date().toISOString() });
    return error?.message ?? null;
  }

  async function saveAssignment(department: Department, value: DepartmentAssignment, actor: AdminUser): Promise<ActionResult> {
    if (!canEditSystemSettings(actor)) return adminOnly;
    const errors = validateAssignment(value, users, department);
    if (errors.length) return { ok: false, reasons: errors };

    const nextAssignment = { ...settings.assignment, [department]: value };
    setSettings((prev) => ({ ...prev, assignment: nextAssignment }));
    const saveError = await upsertAppSetting("assignment", nextAssignment, actor.id);
    if (saveError) return { ok: false, reasons: [saveError] };

    const state = !value.enabled || value.mode === "manual" ? "manual claiming" : `round-robin across ${value.poolUserIds.length} ${value.poolUserIds.length === 1 ? "person" : "people"}`;
    log("manage_accounts", `${actor.name} set ${departmentLabels[department]} lead assignment to ${state}, escalating after ${value.escalationHours}h.`);
    return { ok: true };
  }

  async function saveCompany(details: CompanyDetails, actor: AdminUser): Promise<ActionResult> {
    if (!canEditSystemSettings(actor)) return adminOnly;
    const trimmed = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v.trim()])) as CompanyDetails;
    const errors = validateCompany(trimmed);
    if (errors.length) return { ok: false, reasons: errors };

    setSettings((prev) => ({ ...prev, company: trimmed }));
    const saveError = await upsertAppSetting("company", trimmed, actor.id);
    if (saveError) return { ok: false, reasons: [saveError] };

    log("edit_note", `${actor.name} updated the company details.`);
    return { ok: true };
  }

  async function saveNotifications(userId: string, prefs: NotificationPrefs, actor: AdminUser): Promise<ActionResult> {
    if (actor.id !== userId) return { ok: false, reasons: ["You can only change your own notification preferences."] };
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, [userId]: prefs } }));
    const { error } = await getSupabaseBrowserClient()
      .from("notification_prefs")
      .upsert({ staff_id: userId, prefs, updated_at: new Date().toISOString() });
    if (error) return { ok: false, reasons: [error.message] };
    return { ok: true };
  }

  return (
    <SettingsContext.Provider value={{ settings, loaded, saveAssignment, saveCompany, saveNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/** A lead's escalation window: its department's setting, never more than the public 24h promise. Untriaged leads use 24h. */
export function useEscalationHours(): (department: Department | undefined) => number {
  const { settings } = useSettings();
  return (department) =>
    department ? Math.min(settings.assignment[department]?.escalationHours ?? RESPONSE_SLA_HOURS, RESPONSE_SLA_HOURS) : RESPONSE_SLA_HOURS;
}

export function useNotificationPrefs(userId: string): NotificationPrefs {
  const { settings } = useSettings();
  return settings.notifications[userId] ?? DEFAULT_NOTIFICATION_PREFS;
}
