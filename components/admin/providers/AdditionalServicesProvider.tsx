"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import type { AdditionalService, AdditionalServiceStatus } from "@/lib/admin/types";

/** Best-effort: the write already stands either way (see revalidatePublicPages's own comment) — this just asks the server to rebuild the Homepage and /services sooner than the next deploy. */
async function revalidate() {
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  if (data.session) await revalidatePublicPages(["/", "/services"], data.session.access_token);
}

/*
 * Real Supabase reads/writes from the start (see
 * supabase/013_additional_services.sql) — not a localStorage mock. Lets
 * Uptech add a real new service later without a code change: the 5
 * current, real services stay exactly as hardcoded on the Homepage and
 * /services; this only ever adds more, appended after them.
 */

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  href: string | null;
  flag: string | null;
  photo_path: string;
  display_order: number;
  status: AdditionalServiceStatus;
  created_by: string | null;
  created_at: string;
};

function fromRow(row: ServiceRow): AdditionalService {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href ?? undefined,
    flag: row.flag ?? undefined,
    photoPath: row.photo_path,
    displayOrder: row.display_order,
    status: row.status,
    createdById: row.created_by ?? undefined,
    createdAt: row.created_at,
  };
}

export type NewAdditionalServiceInput = {
  title: string;
  description: string;
  href?: string;
  flag?: string;
  photoPath: string;
};

export type EditableAdditionalServiceFields = {
  title: string;
  description: string;
  href?: string;
  flag?: string;
  photoPath: string;
};

type AdditionalServicesContextValue = {
  services: AdditionalService[];
  addService: (input: NewAdditionalServiceInput, createdById: string) => Promise<AdditionalService>;
  editService: (id: string, input: EditableAdditionalServiceFields) => void;
  setStatus: (id: string, status: AdditionalServiceStatus) => void;
  deleteService: (id: string) => void;
  /** Swaps display_order with the neighbour before/after, among all services (not just published ones), so a draft can be pre-ordered before it goes live. */
  move: (id: string, direction: -1 | 1) => void;
};

const AdditionalServicesContext = createContext<AdditionalServicesContextValue | null>(null);

export function AdditionalServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<AdditionalService[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("additional_services")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[additional-services] Failed to load services:", error);
          return;
        }
        setServices((data as ServiceRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateLocal(id: string, patch: Partial<AdditionalService>) {
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, ...patch } : service)));
  }

  async function addService(input: NewAdditionalServiceInput, createdById: string): Promise<AdditionalService> {
    const supabase = getSupabaseBrowserClient();
    const maxOrder = services.reduce((max, s) => Math.max(max, s.displayOrder), 0);

    const { data, error } = await supabase
      .from("additional_services")
      .insert({
        title: input.title,
        description: input.description,
        href: input.href ?? null,
        flag: input.flag ?? null,
        photo_path: input.photoPath,
        display_order: maxOrder + 1,
        status: "draft",
        created_by: createdById,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to save the new service.");
    }

    const service = fromRow(data as ServiceRow);
    setServices((prev) => [...prev, service]);
    return service;
  }

  function editService(id: string, input: EditableAdditionalServiceFields) {
    updateLocal(id, { title: input.title, description: input.description, href: input.href, flag: input.flag, photoPath: input.photoPath });
    getSupabaseBrowserClient()
      .from("additional_services")
      .update({
        title: input.title,
        description: input.description,
        href: input.href ?? null,
        flag: input.flag ?? null,
        photo_path: input.photoPath,
      })
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[additional-services] Failed to update ${id}:`, error);
        else void revalidate();
      });
  }

  function setStatus(id: string, status: AdditionalServiceStatus) {
    updateLocal(id, { status });
    getSupabaseBrowserClient()
      .from("additional_services")
      .update({ status })
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[additional-services] Failed to update status for ${id}:`, error);
        else void revalidate();
      });
  }

  function deleteService(id: string) {
    setServices((prev) => prev.filter((service) => service.id !== id));
    getSupabaseBrowserClient()
      .from("additional_services")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[additional-services] Failed to delete ${id}:`, error);
        else void revalidate();
      });
  }

  function move(id: string, direction: -1 | 1) {
    const ordered = [...services].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = ordered.findIndex((s) => s.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;

    const a = ordered[index];
    const b = ordered[targetIndex];
    updateLocal(a.id, { displayOrder: b.displayOrder });
    updateLocal(b.id, { displayOrder: a.displayOrder });

    const supabase = getSupabaseBrowserClient();
    supabase.from("additional_services").update({ display_order: b.displayOrder }).eq("id", a.id).then(({ error }) => {
      if (error) console.error(`[additional-services] Failed to reorder ${a.id}:`, error);
    });
    supabase.from("additional_services").update({ display_order: a.displayOrder }).eq("id", b.id).then(({ error }) => {
      if (error) console.error(`[additional-services] Failed to reorder ${b.id}:`, error);
    });
  }

  return (
    <AdditionalServicesContext.Provider value={{ services, addService, editService, setStatus, deleteService, move }}>
      {children}
    </AdditionalServicesContext.Provider>
  );
}

export function useAdditionalServices(): AdditionalService[] {
  const ctx = useContext(AdditionalServicesContext);
  if (!ctx) throw new Error("useAdditionalServices must be used within AdditionalServicesProvider");
  return ctx.services;
}

export function useAdditionalServiceActions(): Omit<AdditionalServicesContextValue, "services"> {
  const ctx = useContext(AdditionalServicesContext);
  if (!ctx) throw new Error("useAdditionalServiceActions must be used within AdditionalServicesProvider");
  const { addService, editService, setStatus, deleteService, move } = ctx;
  return { addService, editService, setStatus, deleteService, move };
}
