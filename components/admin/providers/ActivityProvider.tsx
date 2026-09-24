"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockActivity } from "@/lib/admin/mockData";
import type { ActivityEntry } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-activity-v1";

/*
 * Mirrors LeadsProvider's exact pattern (seed from mock, then mutable +
 * localStorage-persisted) — the same Phase A limitation applies: this is a
 * real, shared-looking paper trail within one browser, not yet synced across
 * staff, since that needs the same Supabase Auth phase LeadsProvider is
 * waiting on.
 */

type ActivityContextValue = {
  activity: ActivityEntry[];
  logActivity: (entry: { icon: string; description: string; relatedHref?: string }) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

function loadActivity(): ActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockActivity;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as ActivityEntry[]) : mockActivity;
  } catch {
    return mockActivity;
  }
}

function saveActivity(entries: ActivityEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Best-effort only — a private window or blocked storage shouldn't break the page.
  }
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  // Seeded with the static mock set on first render so server and client markup match; the real localStorage read happens after mount, below.
  const [activity, setActivity] = useState<ActivityEntry[]>(mockActivity);

  useEffect(() => {
    setActivity(loadActivity());
  }, []);

  function logActivity(entry: { icon: string; description: string; relatedHref?: string }) {
    setActivity((prev) => {
      const next = [
        { id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString(), ...entry },
        ...prev,
      ];
      saveActivity(next);
      return next;
    });
  }

  return <ActivityContext.Provider value={{ activity, logActivity }}>{children}</ActivityContext.Provider>;
}

export function useActivity(): ActivityEntry[] {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx.activity;
}

export function useLogActivity(): ActivityContextValue["logActivity"] {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useLogActivity must be used within ActivityProvider");
  return ctx.logActivity;
}
