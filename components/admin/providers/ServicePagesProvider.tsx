"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ServicePageMeta } from "@/lib/admin/types";

/*
 * Real, shared Supabase table now — replaces what used to be a
 * localStorage-only store seeded from lib/admin/mockData.ts's
 * mockServicePages array. Before this, a Resolve or Escalate action only
 * ever wrote to one browser's storage, invisible to any other staff member
 * (or the same staff member on another device). See
 * supabase/009_service_pages.sql for the table, RLS, and grants.
 */

type ServicePageRow = {
  id: string;
  title: string;
  template: "A" | "B" | "C";
  url: string;
  department: ServicePageMeta["department"];
  last_reviewed_at: string;
  review_cadence_days: number;
  reviewed_by: string;
  assigned_to_id: string | null;
};

function fromRow(row: ServicePageRow): ServicePageMeta {
  return {
    id: row.id,
    title: row.title,
    template: row.template,
    url: row.url,
    department: row.department,
    lastReviewedAt: row.last_reviewed_at,
    reviewCadenceDays: row.review_cadence_days,
    reviewedBy: row.reviewed_by,
    assignedToId: row.assigned_to_id ?? undefined,
  };
}

export type ResolveReviewInput = { completedAt: string; notes: string };

/** Everything but id — the id is derived from the title (slugified), matching the existing 4 rows' human-readable ids rather than a random UUID. */
export type NewServicePageInput = Pick<ServicePageMeta, "title" | "url" | "department" | "template" | "reviewCadenceDays" | "reviewedBy">;

type ServicePagesContextValue = {
  pages: ServicePageMeta[];
  resolveReview: (pageId: string, input: ResolveReviewInput, resolvedByName: string) => void;
  escalateReview: (pageId: string, toUserId: string) => void;
  addServicePage: (input: NewServicePageInput) => Promise<ServicePageMeta>;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ServicePagesContext = createContext<ServicePagesContextValue | null>(null);

export function ServicePagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<ServicePageMeta[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("service_pages")
      .select("*")
      .order("title", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[service-pages] Failed to load service pages:", error);
          return;
        }
        setPages((data as ServicePageRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateLocal(id: string, patch: Partial<ServicePageMeta>) {
    setPages((prev) => prev.map((page) => (page.id === id ? { ...page, ...patch } : page)));
  }

  // A completed review clears whatever it was escalated to — resolving it is
  // the resolution, not just a note on top of a still-open escalation.
  function resolveReview(pageId: string, input: ResolveReviewInput, resolvedByName: string) {
    const lastReviewedAt = new Date(input.completedAt).toISOString();
    updateLocal(pageId, { lastReviewedAt, reviewedBy: resolvedByName, assignedToId: undefined });
    getSupabaseBrowserClient()
      .from("service_pages")
      .update({ last_reviewed_at: lastReviewedAt, reviewed_by: resolvedByName, assigned_to_id: null })
      .eq("id", pageId)
      .then(({ error }) => {
        if (error) console.error(`[service-pages] Failed to resolve review for ${pageId}:`, error);
      });
  }

  function escalateReview(pageId: string, toUserId: string) {
    updateLocal(pageId, { assignedToId: toUserId });
    getSupabaseBrowserClient()
      .from("service_pages")
      .update({ assigned_to_id: toUserId })
      .eq("id", pageId)
      .then(({ error }) => {
        if (error) console.error(`[service-pages] Failed to escalate review for ${pageId}:`, error);
      });
  }

  /*
   * Administrator-only at the RLS layer (see supabase/009_service_pages.sql's
   * insert policy) — this function itself doesn't re-check role, same
   * division of labor as every other provider action in this codebase.
   * lastReviewedAt is set to right now: tracking a page starts from the
   * moment someone actually establishes its baseline, not a backdated guess.
   */
  async function addServicePage(input: NewServicePageInput): Promise<ServicePageMeta> {
    const id = slugify(input.title);
    const lastReviewedAt = new Date().toISOString();
    const { data, error } = await getSupabaseBrowserClient()
      .from("service_pages")
      .insert({
        id,
        title: input.title,
        template: input.template,
        url: input.url,
        department: input.department,
        last_reviewed_at: lastReviewedAt,
        review_cadence_days: input.reviewCadenceDays,
        reviewed_by: input.reviewedBy,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to save the new page.");
    }

    const page = fromRow(data as ServicePageRow);
    setPages((prev) => [...prev, page]);
    return page;
  }

  return (
    <ServicePagesContext.Provider value={{ pages, resolveReview, escalateReview, addServicePage }}>{children}</ServicePagesContext.Provider>
  );
}

export function useServicePages(): ServicePageMeta[] {
  const ctx = useContext(ServicePagesContext);
  if (!ctx) throw new Error("useServicePages must be used within ServicePagesProvider");
  return ctx.pages;
}

export function useServicePageActions(): Omit<ServicePagesContextValue, "pages"> {
  const ctx = useContext(ServicePagesContext);
  if (!ctx) throw new Error("useServicePageActions must be used within ServicePagesProvider");
  const { resolveReview, escalateReview, addServicePage } = ctx;
  return { resolveReview, escalateReview, addServicePage };
}
