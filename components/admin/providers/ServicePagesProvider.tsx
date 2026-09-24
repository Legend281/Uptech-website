"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockServicePages } from "@/lib/admin/mockData";
import type { ServicePageMeta } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-service-pages-v1";

/*
 * Same Phase A shape as LeadsProvider: seeded from the static mock set, then
 * mutable and localStorage-persisted. Before this, mockServicePages was read
 * directly and never written to — "Resolve" and "Escalate" need somewhere
 * real to land a change, which is what this provides.
 */

export type ResolveReviewInput = { completedAt: string; notes: string };

type ServicePagesContextValue = {
  pages: ServicePageMeta[];
  resolveReview: (pageId: string, input: ResolveReviewInput, resolvedByName: string) => void;
  escalateReview: (pageId: string, toUserId: string) => void;
};

const ServicePagesContext = createContext<ServicePagesContextValue | null>(null);

function loadPages(): ServicePageMeta[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockServicePages;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as ServicePageMeta[]) : mockServicePages;
  } catch {
    return mockServicePages;
  }
}

function savePages(pages: ServicePageMeta[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch {
    // Best-effort only — a private window or blocked storage shouldn't break the page.
  }
}

export function ServicePagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<ServicePageMeta[]>(mockServicePages);

  useEffect(() => {
    setPages(loadPages());
  }, []);

  function updatePage(id: string, patch: Partial<ServicePageMeta>) {
    setPages((prev) => {
      const next = prev.map((page) => (page.id === id ? { ...page, ...patch } : page));
      savePages(next);
      return next;
    });
  }

  function resolveReview(pageId: string, input: ResolveReviewInput, resolvedByName: string) {
    // A completed review clears whatever it was escalated to — resolving it is the resolution, not just a note on top of a still-open escalation.
    updatePage(pageId, { lastReviewedAt: new Date(input.completedAt).toISOString(), reviewedBy: resolvedByName, assignedToId: undefined });
  }

  function escalateReview(pageId: string, toUserId: string) {
    updatePage(pageId, { assignedToId: toUserId });
  }

  return <ServicePagesContext.Provider value={{ pages, resolveReview, escalateReview }}>{children}</ServicePagesContext.Provider>;
}

export function useServicePages(): ServicePageMeta[] {
  const ctx = useContext(ServicePagesContext);
  if (!ctx) throw new Error("useServicePages must be used within ServicePagesProvider");
  return ctx.pages;
}

export function useServicePageActions(): { resolveReview: ServicePagesContextValue["resolveReview"]; escalateReview: ServicePagesContextValue["escalateReview"] } {
  const ctx = useContext(ServicePagesContext);
  if (!ctx) throw new Error("useServicePageActions must be used within ServicePagesProvider");
  const { resolveReview, escalateReview } = ctx;
  return { resolveReview, escalateReview };
}
