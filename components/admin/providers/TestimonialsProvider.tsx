"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import {
  departmentForService,
  getDisplayName,
  getPublishBlockers,
  getSaveErrors,
  normalizeAttribution,
  testimonialPages,
  type TestimonialInput,
} from "@/lib/admin/testimonials";
import { describeDbError, getSupabaseBrowserClient, publicPhotoUrl, uploadDataUrl } from "@/lib/supabase/client";
import type { ActionResult, AdminUser, Testimonial, TestimonialPage, TestimonialPlacement } from "@/lib/admin/types";

/*
 * Testimonials, stored in Supabase (supabase/002 + 006) — the one admin
 * module that publishes to the live site. The Homepage and the Career
 * Marketing page read the published_testimonials view, so a testimonial
 * published here is what visitors see.
 *
 * Every write goes through the Supabase session of whoever is signed in
 * (staff sign-in lives elsewhere), so the database's policies and triggers
 * — staff only, consent, Homepage rules — have the final say. The checks in
 * lib/admin/testimonials.ts run first only to give a clear message before a
 * round trip. The "Preview as" persona only drives what the screen offers.
 *
 * After any change that could alter a public page, the affected pages are
 * rebuilt (lib/admin/revalidate.ts) so visitors see it.
 */

type Row = {
  id: string;
  quote_en: string;
  quote_fr: string | null;
  quote_fr_is_translation: boolean;
  outcome_line: string | null;
  attribution_mode: Testimonial["attributionMode"];
  full_name: string | null;
  first_name: string | null;
  last_initial: string | null;
  anonymised_descriptor: string | null;
  role_title: string | null;
  company: string | null;
  audience: Testimonial["audience"] | null;
  photo_path: string | null;
  service: Testimonial["service"];
  department: Testimonial["department"];
  original_wording: string;
  consent_given: boolean;
  consent_date: string | null;
  consent_channel: Testimonial["consentChannel"] | null;
  consent_recorded_by: string | null;
  consent_withdrawn_at: string | null;
  lead_id: string | null;
  status: Testimonial["status"];
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  testimonial_placements: { page: TestimonialPage; display_order: number }[];
};

const SELECT = "*, testimonial_placements(page, display_order)";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const u = <T,>(v: T | null): T | undefined => (v === null ? undefined : v);

function rowToTestimonial(row: Row): Testimonial {
  return {
    id: row.id,
    quoteEn: row.quote_en,
    quoteFr: u(row.quote_fr),
    quoteFrIsTranslation: row.quote_fr_is_translation,
    outcomeLine: u(row.outcome_line),
    attributionMode: row.attribution_mode,
    fullName: u(row.full_name),
    firstName: u(row.first_name),
    lastInitial: u(row.last_initial),
    anonymisedDescriptor: u(row.anonymised_descriptor),
    roleTitle: u(row.role_title),
    company: u(row.company),
    audience: u(row.audience),
    photoPath: u(row.photo_path),
    photo: publicPhotoUrl("testimonial-photos", row.photo_path),
    service: row.service,
    department: row.department,
    originalWording: row.original_wording,
    consentGiven: row.consent_given,
    consentDate: u(row.consent_date),
    consentChannel: u(row.consent_channel),
    consentRecordedById: u(row.consent_recorded_by),
    consentWithdrawnAt: u(row.consent_withdrawn_at),
    leadId: u(row.lead_id),
    status: row.status,
    placements: (row.testimonial_placements ?? []).map((p) => ({ page: p.page, displayOrder: p.display_order })),
    publishedAt: u(row.published_at),
    createdById: row.created_by ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** The editable columns. Audit columns (created_by, consent_recorded_by) are stamped by the database. */
function inputToColumns(input: TestimonialInput, photoPath: string | null) {
  return {
    quote_en: input.quoteEn,
    quote_fr: input.quoteFr ?? null,
    quote_fr_is_translation: input.quoteFrIsTranslation,
    outcome_line: input.outcomeLine ?? null,
    attribution_mode: input.attributionMode,
    full_name: input.fullName ?? null,
    first_name: input.firstName ?? null,
    last_initial: input.lastInitial ?? null,
    anonymised_descriptor: input.anonymisedDescriptor ?? null,
    role_title: input.roleTitle ?? null,
    company: input.company ?? null,
    audience: input.audience ?? null,
    photo_path: photoPath,
    service: input.service,
    department: departmentForService(input.service),
    original_wording: input.originalWording,
    consent_given: input.consentGiven,
    consent_date: input.consentDate || null,
    consent_channel: input.consentChannel ?? null,
    // Only database leads can be linked; the dashboard's browser-only preview leads have no row to point at.
    lead_id: input.leadId && UUID.test(input.leadId) ? input.leadId : null,
  };
}

function pathsFor(...placementLists: TestimonialPlacement[][]): string[] {
  return placementLists.flat().map((p) => testimonialPages.find((page) => page.value === p.page)?.url ?? "/");
}

type TestimonialsContextValue = {
  testimonials: Testimonial[];
  loading: boolean;
  /** Whether a Supabase staff session exists in this browser. Nothing can be read or published without one. */
  signedIn: boolean;
  /** Saves as a draft, then publishes if asked and allowed. */
  addTestimonial: (input: TestimonialInput, user: AdminUser, publish: boolean) => Promise<ActionResult>;
  updateTestimonial: (id: string, input: TestimonialInput, user: AdminUser) => Promise<ActionResult>;
  publishTestimonial: (id: string, user: AdminUser) => Promise<ActionResult>;
  unpublishTestimonial: (id: string, user: AdminUser) => Promise<ActionResult>;
  archiveTestimonial: (id: string, user: AdminUser) => Promise<ActionResult>;
  restoreToDraft: (id: string, user: AdminUser) => Promise<ActionResult>;
  withdrawConsent: (id: string, user: AdminUser, deletePhoto: boolean) => Promise<ActionResult>;
  deleteTestimonial: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const TestimonialsContext = createContext<TestimonialsContextValue | null>(null);

function nameFor(t: Pick<Testimonial, "attributionMode" | "fullName" | "firstName" | "lastInitial" | "anonymisedDescriptor">): string {
  return getDisplayName(t) || "an unnamed testimonial";
}

export function TestimonialsProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const logActivity = useLogActivity();
  const db = getSupabaseBrowserClient();

  async function revalidate(paths: string[]) {
    const { data } = await db.auth.getSession();
    if (data.session) await revalidatePublicPages(paths, data.session.access_token);
  }

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient().from("testimonials").select(SELECT).order("updated_at", { ascending: false });
    if (!error && data) setTestimonials((data as Row[]).map(rowToTestimonial));
    setLoading(false);
  }, []);

  // Follow the Supabase session: load when someone signs in, clear when they sign out.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    function apply(hasSession: boolean) {
      setSignedIn(hasSession);
      if (hasSession) void refresh();
      else {
        setTestimonials([]);
        setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "TOKEN_REFRESHED") apply(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function find(id: string) {
    return testimonials.find((t) => t.id === id);
  }

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/testimonials" });
  }

  async function savePhoto(input: TestimonialInput, currentPath?: string): Promise<string | null> {
    if (!input.photo) return null;
    if (input.photo.startsWith("data:")) return uploadDataUrl("testimonial-photos", input.photo, "testimonials");
    return currentPath ?? null;
  }

  async function setPlacements(id: string, placements: TestimonialPlacement[]): Promise<string | null> {
    const pages = placements.map((p) => p.page);
    const remove = await db.from("testimonial_placements").delete().eq("testimonial_id", id).not("page", "in", `(${pages.length ? pages.join(",") : "__none__"})`);
    if (remove.error) return describeDbError(remove.error);
    if (placements.length) {
      const upsert = await db
        .from("testimonial_placements")
        .upsert(placements.map((p) => ({ testimonial_id: id, page: p.page, display_order: p.displayOrder })), { onConflict: "testimonial_id,page" });
      if (upsert.error) return describeDbError(upsert.error);
    }
    return null;
  }

  async function setStatus(id: string, patch: Record<string, unknown>): Promise<string | null> {
    const { error } = await db.from("testimonials").update(patch).eq("id", id);
    return error ? describeDbError(error) : null;
  }

  async function addTestimonial(input: TestimonialInput, user: AdminUser, publish: boolean): Promise<ActionResult> {
    const clean = normalizeAttribution(input);
    const errors = getSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };
    if (publish) {
      const blockers = getPublishBlockers(clean, user);
      if (blockers.length) return { ok: false, reasons: blockers };
    }

    let photoPath: string | null;
    try {
      photoPath = await savePhoto(clean);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The photo couldn't be uploaded."] };
    }

    // Draft first, then pages, then publish — so the database judges the finished testimonial.
    const { data, error } = await db.from("testimonials").insert({ ...inputToColumns(clean, photoPath), status: "draft" }).select("id").single();
    if (error || !data) return { ok: false, reasons: [describeDbError(error)] };
    const placementError = await setPlacements(data.id, clean.placements);
    if (placementError) {
      await refresh();
      return { ok: false, reasons: [`Saved as a draft, but its pages weren't set: ${placementError}`] };
    }
    if (publish) {
      const publishError = await setStatus(data.id, { status: "published", published_at: new Date().toISOString() });
      if (publishError) {
        await refresh();
        return { ok: false, reasons: [`Saved as a draft, but not published: ${publishError}`] };
      }
      void revalidate(pathsFor(clean.placements));
    }
    await refresh();
    log(
      publish ? "publish" : "edit_note",
      publish ? `${user.name} added and published a testimonial from ${nameFor(clean)}.` : `${user.name} saved a draft testimonial from ${nameFor(clean)}.`,
    );
    return { ok: true };
  }

  async function updateTestimonial(id: string, input: TestimonialInput, user: AdminUser): Promise<ActionResult> {
    const existing = find(id);
    if (!existing) return { ok: false, reasons: ["This testimonial no longer exists."] };
    const clean = normalizeAttribution(input);
    const errors = getSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };
    // A live testimonial can't be edited into a state it couldn't have been published in.
    if (existing.status === "published") {
      const blockers = getPublishBlockers({ ...clean, consentWithdrawnAt: existing.consentWithdrawnAt }, user);
      if (blockers.length) return { ok: false, reasons: blockers };
    }

    let photoPath: string | null;
    try {
      photoPath = await savePhoto(clean, existing.photoPath);
    } catch (error) {
      return { ok: false, reasons: [error instanceof Error ? error.message : "The photo couldn't be uploaded."] };
    }

    const { error } = await db.from("testimonials").update(inputToColumns(clean, photoPath)).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };
    const placementError = await setPlacements(id, clean.placements);
    await refresh();
    if (placementError) return { ok: false, reasons: [`Details saved, but its pages weren't updated: ${placementError}`] };

    // The old photo is no longer referenced once replaced or removed.
    if (existing.photoPath && existing.photoPath !== photoPath) void db.storage.from("testimonial-photos").remove([existing.photoPath]);
    if (existing.status === "published") void revalidate(pathsFor(existing.placements, clean.placements));

    const consentChanged =
      clean.consentGiven !== existing.consentGiven || clean.consentDate !== existing.consentDate || clean.consentChannel !== existing.consentChannel;
    log(
      "edit_note",
      consentChanged ? `${user.name} updated the consent record on ${nameFor(existing)}'s testimonial.` : `${user.name} edited ${nameFor(existing)}'s testimonial.`,
    );
    return { ok: true };
  }

  async function publishTestimonial(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = find(id);
    if (!existing) return { ok: false, reasons: ["This testimonial no longer exists."] };
    const blockers = getPublishBlockers(existing, user);
    if (blockers.length) return { ok: false, reasons: blockers };
    const error = await setStatus(id, { status: "published", published_at: new Date().toISOString() });
    await refresh();
    if (error) return { ok: false, reasons: [error] };
    void revalidate(pathsFor(existing.placements));
    log("publish", `${user.name} published ${nameFor(existing)}'s testimonial.`);
    return { ok: true };
  }

  async function changeStatus(
    id: string,
    user: AdminUser,
    patch: Record<string, unknown>,
    icon: string,
    verb: string,
  ): Promise<ActionResult> {
    const existing = find(id);
    if (!existing) return { ok: false, reasons: ["This testimonial no longer exists."] };
    const error = await setStatus(id, patch);
    await refresh();
    if (error) return { ok: false, reasons: [error] };
    if (existing.status === "published") void revalidate(pathsFor(existing.placements));
    log(icon, `${user.name} ${verb} ${nameFor(existing)}'s testimonial.`);
    return { ok: true };
  }

  const unpublishTestimonial = (id: string, user: AdminUser) => changeStatus(id, user, { status: "draft" }, "unpublished", "unpublished");
  const archiveTestimonial = (id: string, user: AdminUser) => changeStatus(id, user, { status: "archived" }, "archive", "archived");
  const restoreToDraft = (id: string, user: AdminUser) => changeStatus(id, user, { status: "draft" }, "edit_note", "restored to draft");

  /** Spec 1.3: one action takes it off every page at once, and can remove the photo too. */
  async function withdrawConsent(id: string, user: AdminUser, deletePhoto: boolean): Promise<ActionResult> {
    const existing = find(id);
    if (!existing) return { ok: false, reasons: ["This testimonial no longer exists."] };
    const removePhoto = deletePhoto && Boolean(existing.photoPath);
    const error = await setStatus(id, {
      status: "archived",
      consent_withdrawn_at: new Date().toISOString(),
      ...(removePhoto ? { photo_path: null } : {}),
    });
    if (error) {
      await refresh();
      return { ok: false, reasons: [error] };
    }
    // The file itself goes too — unlinking it would leave their face at a public URL.
    if (removePhoto && existing.photoPath) await db.storage.from("testimonial-photos").remove([existing.photoPath]);
    await refresh();
    if (existing.status === "published") void revalidate(pathsFor(existing.placements));
    log(
      "block",
      `${user.name} recorded that ${nameFor(existing)} withdrew consent. The testimonial was taken off every page${removePhoto ? " and the photo deleted" : ""}.`,
    );
    return { ok: true };
  }

  async function deleteTestimonial(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = find(id);
    if (!existing) return { ok: true };
    if (existing.status === "published") return { ok: false, reasons: ["Unpublish it first."] };
    const { error } = await db.from("testimonials").delete().eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };
    if (existing.photoPath) void db.storage.from("testimonial-photos").remove([existing.photoPath]);
    await refresh();
    log("delete", `${user.name} deleted ${nameFor(existing)}'s testimonial.`);
    return { ok: true };
  }

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        loading,
        signedIn,
        addTestimonial,
        updateTestimonial,
        publishTestimonial,
        unpublishTestimonial,
        archiveTestimonial,
        restoreToDraft,
        withdrawConsent,
        deleteTestimonial,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const ctx = useContext(TestimonialsContext);
  if (!ctx) throw new Error("useTestimonials must be used within TestimonialsProvider");
  return ctx;
}
