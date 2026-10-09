"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { describeDbError, getSupabaseBrowserClient, uploadDataUrl } from "@/lib/supabase/client";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import type {
  EditablePartnerLogoFields,
  NewPartnerLogoInput,
  PartnerLogo,
  PartnerStatus,
} from "@/lib/admin/types";

export const INITIAL_PARTNERS: PartnerLogo[] = [
  { id: "partner-1", name: "Capital One", logoUrl: "/images/s1.webp", websiteUrl: "", displayOrder: 1, status: "published", createdAt: new Date().toISOString() },
  { id: "partner-2", name: "CenturyLink", logoUrl: "/images/s2.webp", websiteUrl: "", displayOrder: 2, status: "published", createdAt: new Date().toISOString() },
  { id: "partner-3", name: "HMS", logoUrl: "/images/s3.webp", websiteUrl: "", displayOrder: 3, status: "published", createdAt: new Date().toISOString() },
  { id: "partner-4", name: "Accenture", logoUrl: "/images/s4.webp", websiteUrl: "", displayOrder: 4, status: "published", createdAt: new Date().toISOString() },
  { id: "partner-5", name: "GVEC", logoUrl: "/images/s5.webp", websiteUrl: "", displayOrder: 5, status: "published", createdAt: new Date().toISOString() },
  { id: "partner-6", name: "KiawiTech IT Academy", logoUrl: "/images/header-logo.webp", websiteUrl: "", displayOrder: 6, status: "published", createdAt: new Date().toISOString() },
];

type PartnerRow = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  status: PartnerStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: PartnerRow): PartnerLogo {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url ?? undefined,
    displayOrder: row.display_order,
    status: row.status,
    createdById: row.created_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function triggerRevalidate() {
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  if (data.session) await revalidatePublicPages(["/"], data.session.access_token);
}

type PartnerLogosContextValue = {
  partners: PartnerLogo[];
  loading: boolean;
  loadError: string | null;
  addPartner: (input: NewPartnerLogoInput) => Promise<PartnerLogo>;
  editPartner: (id: string, input: EditablePartnerLogoFields) => Promise<void>;
  setStatus: (id: string, status: PartnerStatus) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  move: (id: string, direction: -1 | 1) => Promise<void>;
};

const PartnerLogosContext = createContext<PartnerLogosContextValue | null>(null);

export function PartnerLogosProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<PartnerLogo[]>(INITIAL_PARTNERS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const logActivity = useLogActivity();
  const currentUser = useCurrentUser();

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    try {
      const { data, error } = await supabase
        .from("partner_logos")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        // Table hasn't been migrated yet; keep initial seeded defaults
        console.warn("[partner-logos] Database load note:", error.message);
        setLoadError(describeDbError(error));
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setPartners((data as PartnerRow[]).map(fromRow));
      } else {
        // Empty table: keep the 6 defaults
        setPartners(INITIAL_PARTNERS);
      }
      setLoadError(null);
    } catch (err) {
      console.error("[partner-logos] Load failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveLogoUrl(urlOrData: string): Promise<string> {
    if (urlOrData.startsWith("data:")) {
      return await uploadDataUrl("partner-logos", urlOrData, "partners");
    }
    return urlOrData;
  }

  async function addPartner(input: NewPartnerLogoInput): Promise<PartnerLogo> {
    const resolvedLogoUrl = await resolveLogoUrl(input.logoUrl);
    const maxOrder = partners.reduce((max, p) => Math.max(max, p.displayOrder), 0);
    const displayOrder = input.displayOrder ?? maxOrder + 1;
    const status: PartnerStatus = input.status ?? "published";

    const tempId = `partner-${Date.now()}`;
    const optimisticItem: PartnerLogo = {
      id: tempId,
      name: input.name.trim(),
      logoUrl: resolvedLogoUrl,
      websiteUrl: input.websiteUrl?.trim() || undefined,
      displayOrder,
      status,
      createdById: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setPartners((prev) => [...prev, optimisticItem]);

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("partner_logos")
      .insert({
        name: optimisticItem.name,
        logo_url: optimisticItem.logoUrl,
        website_url: optimisticItem.websiteUrl ?? null,
        display_order: optimisticItem.displayOrder,
        status: optimisticItem.status,
        created_by: currentUser.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[partner-logos] Insert error:", error.message);
      // If table missing, keep optimistic row so preview still functions
    } else if (data) {
      const realItem = fromRow(data as PartnerRow);
      setPartners((prev) => prev.map((p) => (p.id === tempId ? realItem : p)));
    }

    logActivity({
      icon: "handshake",
      description: `${currentUser.name} added partner logo "${input.name.trim()}".`,
      relatedHref: "/admin/settings",
    });

    void triggerRevalidate();
    return optimisticItem;
  }

  async function editPartner(id: string, input: EditablePartnerLogoFields): Promise<void> {
    const resolvedLogoUrl = await resolveLogoUrl(input.logoUrl);

    setPartners((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: input.name.trim(),
              logoUrl: resolvedLogoUrl,
              websiteUrl: input.websiteUrl?.trim() || undefined,
              displayOrder: input.displayOrder ?? p.displayOrder,
              status: input.status ?? p.status,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("partner_logos")
      .update({
        name: input.name.trim(),
        logo_url: resolvedLogoUrl,
        website_url: input.websiteUrl?.trim() || null,
        display_order: input.displayOrder,
        status: input.status,
      })
      .eq("id", id);

    if (error) {
      console.error("[partner-logos] Update error:", error.message);
    }

    logActivity({
      icon: "edit",
      description: `${currentUser.name} updated partner logo "${input.name.trim()}".`,
      relatedHref: "/admin/settings",
    });

    void triggerRevalidate();
  }

  async function setStatus(id: string, status: PartnerStatus): Promise<void> {
    const target = partners.find((p) => p.id === id);
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("partner_logos").update({ status }).eq("id", id);
    if (error) console.error("[partner-logos] setStatus error:", error.message);

    if (target) {
      logActivity({
        icon: status === "published" ? "visibility" : "visibility_off",
        description: `${currentUser.name} ${status === "published" ? "published" : "unpublished"} partner logo "${target.name}".`,
        relatedHref: "/admin/settings",
      });
    }

    void triggerRevalidate();
  }

  async function deletePartner(id: string): Promise<void> {
    const target = partners.find((p) => p.id === id);
    setPartners((prev) => prev.filter((p) => p.id !== id));

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("partner_logos").delete().eq("id", id);
    if (error) console.error("[partner-logos] Delete error:", error.message);

    if (target) {
      logActivity({
        icon: "delete",
        description: `${currentUser.name} deleted partner logo "${target.name}".`,
        relatedHref: "/admin/settings",
      });
    }

    void triggerRevalidate();
  }

  async function move(id: string, direction: -1 | 1): Promise<void> {
    const index = partners.findIndex((p) => p.id === id);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const currentItem = partners[index];
    const targetItem = partners[targetIndex];

    const currentOrder = currentItem.displayOrder;
    const targetOrder = targetItem.displayOrder;

    const nextList = [...partners];
    nextList[index] = { ...targetItem, displayOrder: currentOrder };
    nextList[targetIndex] = { ...currentItem, displayOrder: targetOrder };
    setPartners(nextList);

    const supabase = getSupabaseBrowserClient();
    await Promise.all([
      supabase.from("partner_logos").update({ display_order: targetOrder }).eq("id", currentItem.id),
      supabase.from("partner_logos").update({ display_order: currentOrder }).eq("id", targetItem.id),
    ]);

    void triggerRevalidate();
  }

  return (
    <PartnerLogosContext.Provider
      value={{
        partners,
        loading,
        loadError,
        addPartner,
        editPartner,
        setStatus,
        deletePartner,
        move,
      }}
    >
      {children}
    </PartnerLogosContext.Provider>
  );
}

export function usePartnerLogos() {
  const ctx = useContext(PartnerLogosContext);
  if (!ctx) throw new Error("usePartnerLogos must be used within PartnerLogosProvider");
  return { partners: ctx.partners, loading: ctx.loading, loadError: ctx.loadError };
}

export function usePartnerLogoActions() {
  const ctx = useContext(PartnerLogosContext);
  if (!ctx) throw new Error("usePartnerLogoActions must be used within PartnerLogosProvider");
  return {
    addPartner: ctx.addPartner,
    editPartner: ctx.editPartner,
    setStatus: ctx.setStatus,
    deletePartner: ctx.deletePartner,
    move: ctx.move,
  };
}
