"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockActivity } from "@/lib/admin/mockData";
import type { ActivityEntry } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-activity-v1";
const MAX_LOGGED = 200;

/*
 * The Activity feed's live half: every publish, unpublish, consent change
 * and permission change is logged here, per Admin_Content_Pages_Spec.md
 * Section 0.2. Browser-only — entries live in this browser's localStorage
 * until a shared audit table replaces it. The static mockActivity entries
 * stay underneath so the feed isn't empty on a fresh browser.
 */
type ActivityContextValue = {
  entries: ActivityEntry[];
  logActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

function loadLogged(): ActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLogged(entries: ActivityEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Best-effort only.
  }
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    setLogged(loadLogged());
  }, []);

  function logActivity(entry: Omit<ActivityEntry, "id" | "timestamp">) {
    const full: ActivityEntry = {
      ...entry,
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    setLogged((prev) => {
      const next = [full, ...prev].slice(0, MAX_LOGGED);
      saveLogged(next);
      return next;
    });
  }

  const entries = [...logged, ...mockActivity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return <ActivityContext.Provider value={{ entries, logActivity }}>{children}</ActivityContext.Provider>;
}

export function useActivity(): ActivityEntry[] {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx.entries;
}

export function useLogActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useLogActivity must be used within ActivityProvider");
  return ctx.logActivity;
}
