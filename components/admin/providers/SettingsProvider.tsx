"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useAdminUsers } from "@/components/admin/providers/CurrentUserProvider";
import { departmentLabels } from "@/lib/admin/labels";
import { RESPONSE_SLA_HOURS } from "@/lib/admin/leadStaleness";
import { mockServicePages } from "@/lib/admin/mockData";
import {
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_SETTINGS,
  canEditSystemSettings,
  validateAssignment,
  validateCompany,
  validateReviewCycle,
  type CompanyDetails,
  type DepartmentAssignment,
  type NotificationPrefs,
  type ReviewCycle,
  type Settings,
} from "@/lib/admin/settings";
import type { ActionResult, AdminUser, Department, ServicePageMeta } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-settings-v1";

/*
 * Settings (Admin_Content_Pages_Spec.md Section 4). Browser-only for now.
 * Unlike the content modules, these values are READ by the dashboard
 * itself: lead auto-assignment, the lead escalation window, and the
 * compliance review cycles all come from here.
 */

type SettingsContextValue = {
  settings: Settings;
  /** False until this browser's saved settings are read. Forms wait for it, so they never start from defaults. */
  loaded: boolean;
  saveAssignment: (department: Department, value: DepartmentAssignment, actor: AdminUser) => Promise<ActionResult>;
  saveReviewCycles: (cycles: Record<string, ReviewCycle>, actor: AdminUser) => Promise<ActionResult>;
  saveCompany: (details: CompanyDetails, actor: AdminUser) => Promise<ActionResult>;
  /** Anyone can change their own notification preferences — nobody else's. */
  saveNotifications: (userId: string, prefs: NotificationPrefs, actor: AdminUser) => Promise<ActionResult>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function load(): Settings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    // Merge over defaults so a setting added later still has a value.
    return {
      assignment: { ...DEFAULT_SETTINGS.assignment, ...parsed.assignment },
      reviewCycles: { ...DEFAULT_SETTINGS.reviewCycles, ...parsed.reviewCycles },
      notifications: { ...parsed.notifications },
      company: { ...DEFAULT_SETTINGS.company, ...parsed.company },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function save(settings: Settings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Best-effort only.
  }
}

const adminOnly: ActionResult = { ok: false, reasons: ["Only an Administrator can change system settings."] };

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const users = useAdminUsers();
  const logActivity = useLogActivity();

  useEffect(() => {
    setSettings(load());
    setLoaded(true);
  }, []);

  function commit(next: Settings) {
    setSettings(next);
    save(next);
  }

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/settings" });
  }

  async function saveAssignment(department: Department, value: DepartmentAssignment, actor: AdminUser): Promise<ActionResult> {
    if (!canEditSystemSettings(actor)) return adminOnly;
    const errors = validateAssignment(value, users, department);
    if (errors.length) return { ok: false, reasons: errors };
    commit({ ...settings, assignment: { ...settings.assignment, [department]: value } });
    const state = !value.enabled || value.mode === "manual" ? "manual claiming" : `round-robin across ${value.poolUserIds.length} ${value.poolUserIds.length === 1 ? "person" : "people"}`;
    log("manage_accounts", `${actor.name} set ${departmentLabels[department]} lead assignment to ${state}, escalating after ${value.escalationHours}h.`);
    return { ok: true };
  }

  async function saveReviewCycles(cycles: Record<string, ReviewCycle>, actor: AdminUser): Promise<ActionResult> {
    if (!canEditSystemSettings(actor)) return adminOnly;
    for (const [pageId, cycle] of Object.entries(cycles)) {
      const errors = validateReviewCycle(cycle);
      const title = mockServicePages.find((p) => p.id === pageId)?.title ?? pageId;
      if (errors.length) return { ok: false, reasons: errors.map((e) => `${title}: ${e}`) };
    }
    const changed = Object.entries(cycles).filter(([id, c]) => {
      const before = settings.reviewCycles[id];
      return !before || before.cadenceDays !== c.cadenceDays || before.dueSoonDays !== c.dueSoonDays;
    });
    commit({ ...settings, reviewCycles: { ...settings.reviewCycles, ...cycles } });
    for (const [id, c] of changed) {
      const title = mockServicePages.find((p) => p.id === id)?.title ?? id;
      log("fact_check", `${actor.name} set ${title} to a ${c.cadenceDays}-day review cycle, flagged ${c.dueSoonDays} days ahead.`);
    }
    return { ok: true };
  }

  async function saveCompany(details: CompanyDetails, actor: AdminUser): Promise<ActionResult> {
    if (!canEditSystemSettings(actor)) return adminOnly;
    const trimmed = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v.trim()])) as CompanyDetails;
    const errors = validateCompany(trimmed);
    if (errors.length) return { ok: false, reasons: errors };
    commit({ ...settings, company: trimmed });
    log("edit_note", `${actor.name} updated the company details.`);
    return { ok: true };
  }

  async function saveNotifications(userId: string, prefs: NotificationPrefs, actor: AdminUser): Promise<ActionResult> {
    if (actor.id !== userId) return { ok: false, reasons: ["You can only change your own notification preferences."] };
    commit({ ...settings, notifications: { ...settings.notifications, [userId]: prefs } });
    return { ok: true };
  }

  return (
    <SettingsContext.Provider value={{ settings, loaded, saveAssignment, saveReviewCycles, saveCompany, saveNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/** The compliance pages with Settings' review cycles applied — what the dashboard's review countdowns run on (spec 4.4). */
export function useServicePages(): ServicePageMeta[] {
  const { settings } = useSettings();
  return useMemo(
    () =>
      mockServicePages.map((page) => {
        const cycle = settings.reviewCycles[page.id];
        return cycle ? { ...page, reviewCadenceDays: cycle.cadenceDays, dueSoonDays: cycle.dueSoonDays } : page;
      }),
    [settings.reviewCycles],
  );
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
