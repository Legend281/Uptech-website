"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActivityEntry } from "@/lib/admin/types";

/*
 * Real, shared Supabase table now — replaces what used to be a
 * localStorage-only store seeded with fictional historical entries from
 * staff who no longer have real accounts. Every authenticated staff member
 * reads the same table (see supabase/008_activity_log.sql), so this is
 * finally a real accountability record, not a per-browser illusion of one.
 *
 * Capped at the most recent 500 entries on load — an audit trail that grows
 * forever needs pagination on the dedicated page (/admin/activity), not an
 * unbounded fetch on every dashboard load.
 */
const FETCH_LIMIT = 500;

type ActivityRow = {
  id: string;
  icon: string;
  description: string;
  related_href: string | null;
  created_at: string;
};

function fromRow(row: ActivityRow): ActivityEntry {
  return {
    id: row.id,
    icon: row.icon,
    description: row.description,
    timestamp: row.created_at,
    relatedHref: row.related_href ?? undefined,
  };
}

type ActivityContextValue = {
  activity: ActivityEntry[];
  logActivity: (entry: { icon: string; description: string; relatedHref?: string }) => void;
  deleteActivityEntry: (id: string) => void;
  clearAllActivity: () => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[activity] Failed to load activity log:", error);
          return;
        }
        setActivity((data as ActivityRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function logActivity(entry: { icon: string; description: string; relatedHref?: string }) {
    const optimistic: ActivityEntry = {
      id: `pending-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setActivity((prev) => [optimistic, ...prev]);

    getSupabaseBrowserClient()
      .from("activity_log")
      .insert({ icon: entry.icon, description: entry.description, related_href: entry.relatedHref ?? null })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("[activity] Failed to save activity entry:", error);
          return;
        }
        // Swap the optimistic entry for the real row (real id, server timestamp).
        setActivity((prev) => prev.map((item) => (item.id === optimistic.id ? fromRow(data as ActivityRow) : item)));
      });
  }

  function deleteActivityEntry(id: string) {
    setActivity((prev) => prev.filter((entry) => entry.id !== id));
    getSupabaseBrowserClient()
      .from("activity_log")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[activity] Failed to delete activity entry ${id}:`, error);
      });
  }

  function clearAllActivity() {
    const ids = activity.map((entry) => entry.id);
    setActivity([]);
    if (ids.length === 0) return;
    getSupabaseBrowserClient()
      .from("activity_log")
      .delete()
      .in("id", ids)
      .then(({ error }) => {
        if (error) console.error("[activity] Failed to clear activity log:", error);
      });
  }

  return (
    <ActivityContext.Provider value={{ activity, logActivity, deleteActivityEntry, clearAllActivity }}>{children}</ActivityContext.Provider>
  );
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

export function useActivityActions(): { deleteActivityEntry: ActivityContextValue["deleteActivityEntry"]; clearAllActivity: ActivityContextValue["clearAllActivity"] } {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivityActions must be used within ActivityProvider");
  const { deleteActivityEntry, clearAllActivity } = ctx;
  return { deleteActivityEntry, clearAllActivity };
}
