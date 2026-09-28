"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { revalidatePublicPages } from "@/lib/admin/revalidate";
import { type FaqCategory } from "@/lib/faqContent";
import {
  canManageFaqCategory,
  canReviewFaq,
  getFaqCategory,
  getFaqPublishBlockers,
  getFaqSaveErrors,
  needsLegalReview,
  type FaqInput,
} from "@/lib/admin/faqs";
import { describeDbError, getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActionResult, AdminUser, FaqItemRecord } from "@/lib/admin/types";

/*
 * FAQ Items, stored in Supabase (supabase/004_faq_items.sql +
 * 018_faq_items_staff_policies.sql) — real writes now, reaching the same
 * published_faq_items view lib/faqs.ts already reads for every public FAQ
 * section (category "replace, never merge" against the built-in copy —
 * see that file's own comment).
 *
 * The review gate (spec 3.2 — a review-gated category can't stay published
 * without a current review, and nobody approves their own wording) is
 * enforced a SECOND time by a real database trigger
 * (enforce_faq_review_gate, 004_faq_items.sql), which is stricter in one
 * way the old browser-only mock wasn't: it raises a hard error rather than
 * silently downgrading status if an update would leave a review-gated FAQ
 * published without a review. So this provider pre-computes the same
 * mustUnpublish the mock used to and sends status: "draft" itself when
 * needed — the trigger then just confirms rather than ever having to object.
 */

type Row = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  display_order: number;
  status: FaqItemRecord["status"];
  reviewed_by: string | null;
  reviewed_at: string | null;
  awaiting_first_review: boolean;
  last_edited_by: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

function rowToFaq(row: Row): FaqItemRecord {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    displayOrder: row.display_order,
    status: row.status,
    reviewedById: row.reviewed_by ?? undefined,
    reviewedAt: row.reviewed_at ?? undefined,
    awaitingFirstReview: row.awaiting_first_review || undefined,
    lastEditedById: row.last_edited_by,
    createdById: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type UpdateResult = ActionResult & { unpublished?: boolean };

type FaqContextValue = {
  items: FaqItemRecord[];
  loading: boolean;
  addFaq: (input: FaqInput, user: AdminUser, publish: boolean) => Promise<ActionResult>;
  updateFaq: (id: string, input: FaqInput, user: AdminUser) => Promise<UpdateResult>;
  publishFaq: (id: string, user: AdminUser) => Promise<ActionResult>;
  unpublishFaq: (id: string, user: AdminUser) => Promise<ActionResult>;
  reviewFaq: (id: string, user: AdminUser) => Promise<ActionResult>;
  /** Sets the order of one category's items to exactly this id sequence (drag-and-drop, move up/down). */
  reorder: (category: FaqCategory, orderedIds: string[], user: AdminUser) => Promise<ActionResult>;
  deleteFaq: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const FaqContext = createContext<FaqContextValue | null>(null);

const denied = (category: FaqCategory): ActionResult => ({
  ok: false,
  reasons: [`You can't change ${getFaqCategory(category).label} FAQs. That's the owning department's or an Administrator's call.`],
});

function short(question: string): string {
  return question.length > 70 ? `${question.slice(0, 67)}…` : question;
}

export function FaqItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FaqItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const logActivity = useLogActivity();

  async function revalidate(category: FaqCategory) {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    if (data.session) await revalidatePublicPages([getFaqCategory(category).url], data.session.access_token);
  }

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient().from("faq_items").select("*").order("category").order("display_order", { ascending: true });
    if (!error && data) setItems((data as Row[]).map(rowToFaq));
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    function apply(hasSession: boolean) {
      if (hasSession) void refresh();
      else {
        setItems([]);
        setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "TOKEN_REFRESHED") apply(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/faqs" });
  }

  function nextOrder(category: FaqCategory, list = items): number {
    return list.filter((i) => i.category === category).reduce((max, i) => Math.max(max, i.displayOrder), 0) + 1;
  }

  async function addFaq(input: FaqInput, user: AdminUser, publish: boolean): Promise<ActionResult> {
    if (!canManageFaqCategory(user, input.category)) return denied(input.category);
    const clean = { question: input.question.trim(), answer: input.answer.trim(), category: input.category };
    const errors = publish ? getFaqPublishBlockers(clean) : getFaqSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    const { data, error } = await getSupabaseBrowserClient()
      .from("faq_items")
      .insert({
        question: clean.question,
        answer: clean.answer,
        category: clean.category,
        display_order: nextOrder(clean.category),
        status: publish ? "published" : "draft",
        last_edited_by: user.id,
        created_by: user.id,
      })
      .select()
      .single();
    if (error || !data) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    if (publish) void revalidate(clean.category);
    log(publish ? "publish" : "edit_note", `${user.name} ${publish ? "published" : "drafted"} a ${getFaqCategory(clean.category).label} FAQ: “${short(clean.question)}”`);
    return { ok: true };
  }

  async function updateFaq(id: string, input: FaqInput, user: AdminUser): Promise<UpdateResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: false, reasons: ["This FAQ no longer exists."] };
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);
    if (!canManageFaqCategory(user, input.category)) return denied(input.category);
    const clean = { question: input.question.trim(), answer: input.answer.trim(), category: input.category };
    const errors = getFaqSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };

    const wordingChanged = clean.question !== existing.question || clean.answer !== existing.answer;
    const categoryChanged = clean.category !== existing.category;
    const stillReviewed = !wordingChanged && Boolean(existing.reviewedById);
    // Pre-empt the database trigger's own hard block: it raises an error
    // rather than downgrading status itself, so this sends the row already
    // in the state the trigger would insist on.
    const mustUnpublish = existing.status === "published" && needsLegalReview(clean.category) && (wordingChanged || categoryChanged) && !stillReviewed;

    const { error } = await getSupabaseBrowserClient()
      .from("faq_items")
      .update({
        question: clean.question,
        answer: clean.answer,
        category: clean.category,
        display_order: categoryChanged ? nextOrder(clean.category) : existing.displayOrder,
        status: mustUnpublish ? "draft" : existing.status,
        last_edited_by: wordingChanged ? user.id : existing.lastEditedById,
      })
      .eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    if (existing.status === "published" || mustUnpublish) {
      void revalidate(existing.category);
      if (categoryChanged) void revalidate(clean.category);
    }

    if (categoryChanged) {
      log("edit_note", `${user.name} moved “${short(clean.question)}” from ${getFaqCategory(existing.category).pageLabel} to ${getFaqCategory(clean.category).pageLabel}.`);
    } else {
      log("edit_note", `${user.name} edited the FAQ “${short(clean.question)}”.`);
    }
    if (mustUnpublish) log("unpublished", `“${short(clean.question)}” came off the site until it's re-reviewed.`);
    return { ok: true, unpublished: mustUnpublish };
  }

  async function publishFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: false, reasons: ["This FAQ no longer exists."] };
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);
    const blockers = getFaqPublishBlockers(existing);
    if (blockers.length) return { ok: false, reasons: blockers };

    const { error } = await getSupabaseBrowserClient().from("faq_items").update({ status: "published" }).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    void revalidate(existing.category);
    log("publish", `${user.name} published the FAQ “${short(existing.question)}”.`);
    return { ok: true };
  }

  async function unpublishFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: false, reasons: ["This FAQ no longer exists."] };
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);

    const { error } = await getSupabaseBrowserClient().from("faq_items").update({ status: "draft" }).eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    void revalidate(existing.category);
    log("unpublished", `${user.name} unpublished the FAQ “${short(existing.question)}”.`);
    return { ok: true };
  }

  async function reviewFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: false, reasons: ["This FAQ no longer exists."] };
    if (!canReviewFaq(user, existing)) {
      return {
        ok: false,
        reasons: [user.id === existing.lastEditedById ? "You wrote the current wording, so someone else has to review it." : "You can't review this category's FAQs."],
      };
    }

    const { error } = await getSupabaseBrowserClient()
      .from("faq_items")
      .update({ reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    log("fact_check", `${user.name} reviewed the ${getFaqCategory(existing.category).label} FAQ “${short(existing.question)}”.`);
    return { ok: true };
  }

  async function reorder(category: FaqCategory, orderedIds: string[], user: AdminUser): Promise<ActionResult> {
    if (!canManageFaqCategory(user, category)) return denied(category);
    const supabase = getSupabaseBrowserClient();
    const results = await Promise.all(
      orderedIds.map((id, index) => supabase.from("faq_items").update({ display_order: index + 1 }).eq("id", id)),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) return { ok: false, reasons: [describeDbError(failed.error)] };
    await refresh();
    return { ok: true };
  }

  async function deleteFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: true };
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);
    if (existing.status === "published") return { ok: false, reasons: ["Unpublish it first."] };

    const { error } = await getSupabaseBrowserClient().from("faq_items").delete().eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    log("delete", `${user.name} deleted the draft FAQ “${short(existing.question)}”.`);
    return { ok: true };
  }

  return (
    <FaqContext.Provider value={{ items, loading, addFaq, updateFaq, publishFaq, unpublishFaq, reviewFaq, reorder, deleteFaq }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaqItems() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error("useFaqItems must be used within FaqItemsProvider");
  return ctx;
}
