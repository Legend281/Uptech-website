"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { siteFaqs, type FaqCategory } from "@/lib/faqContent";
import {
  EXISTING_SITE_AUTHOR,
  canManageFaqCategory,
  canReviewFaq,
  faqCategories,
  getFaqCategory,
  getFaqPublishBlockers,
  getFaqSaveErrors,
  needsLegalReview,
  type FaqInput,
} from "@/lib/admin/faqs";
import type { ActionResult, AdminUser, FaqItemRecord } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-faqs-v1";

/*
 * Browser-only for now (supabase/004_faq_items.sql holds the real table,
 * but this module doesn't write to it yet). Seeded from lib/faqContent.ts —
 * the FAQs the site already shows. That's real, approved copy, not invented
 * demo data, and starting empty would hide from staff what is actually live.
 */

type UpdateResult = ActionResult & { unpublished?: boolean };

type FaqContextValue = {
  items: FaqItemRecord[];
  loading: boolean;
  /** Always true here: the browser store seeds itself from the site's FAQs. */
  imported: boolean;
  importSiteFaqs: (user: AdminUser) => Promise<ActionResult>;
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

function seed(): FaqItemRecord[] {
  const now = new Date().toISOString();
  return faqCategories.flatMap((category) =>
    siteFaqs[category.value].map((faq, index) => ({
      id: `faq-site-${category.value}-${index + 1}`,
      question: faq.question,
      answer: faq.answer,
      category: category.value,
      displayOrder: index + 1,
      status: "published" as const,
      awaitingFirstReview: category.legalReview || undefined,
      lastEditedById: EXISTING_SITE_AUTHOR,
      createdById: EXISTING_SITE_AUTHOR,
      createdAt: now,
      updatedAt: now,
    })),
  );
}

function load(): FaqItemRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FaqItemRecord[]) : seed();
  } catch {
    return seed();
  }
}

function save(items: FaqItemRecord[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Best-effort only.
  }
}

const denied = (category: FaqCategory): ActionResult => ({
  ok: false,
  reasons: [`You can't change ${getFaqCategory(category).label} FAQs. That's the owning department's or an Administrator's call.`],
});

const OK: ActionResult = { ok: true };

function short(question: string): string {
  return question.length > 70 ? `${question.slice(0, 67)}…` : question;
}

export function FaqItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FaqItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const logActivity = useLogActivity();

  useEffect(() => {
    setItems(load());
    setLoading(false);
  }, []);

  function commit(next: FaqItemRecord[]) {
    setItems(next);
    save(next);
  }

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/faqs" });
  }

  function nextOrder(category: FaqCategory, list = items): number {
    return list.filter((i) => i.category === category).reduce((max, i) => Math.max(max, i.displayOrder), 0) + 1;
  }

  async function importSiteFaqs(): Promise<ActionResult> {
    return OK;
  }

  async function addFaq(input: FaqInput, user: AdminUser, publish: boolean): Promise<ActionResult> {
    if (!canManageFaqCategory(user, input.category)) return denied(input.category);
    const clean = { question: input.question.trim(), answer: input.answer.trim(), category: input.category };
    const errors = publish ? getFaqPublishBlockers(clean) : getFaqSaveErrors(clean);
    if (errors.length) return { ok: false, reasons: errors };
    const now = new Date().toISOString();
    const item: FaqItemRecord = {
      ...clean,
      id: `faq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      displayOrder: nextOrder(clean.category),
      status: publish ? "published" : "draft",
      lastEditedById: user.id,
      createdById: user.id,
      createdAt: now,
      updatedAt: now,
    };
    commit([...items, item]);
    log(publish ? "publish" : "edit_note", `${user.name} ${publish ? "published" : "drafted"} a ${getFaqCategory(clean.category).label} FAQ: “${short(clean.question)}”`);
    return OK;
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
    // Spec 3.2: any change to the words clears the review.
    const review = wordingChanged ? { reviewedById: undefined, reviewedAt: undefined } : {};
    const stillReviewed = !wordingChanged && Boolean(existing.reviewedById);
    // A legal-review answer can't stay live unreviewed once anyone changes
    // it. Grandfathered (pre-gate) answers keep their place only while
    // nobody edits them.
    const mustUnpublish =
      existing.status === "published" && needsLegalReview(clean.category) && (wordingChanged || categoryChanged) && !stillReviewed;

    const now = new Date().toISOString();
    commit(
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              ...clean,
              ...review,
              awaitingFirstReview: wordingChanged || categoryChanged ? undefined : i.awaitingFirstReview,
              lastEditedById: wordingChanged ? user.id : i.lastEditedById,
              displayOrder: categoryChanged ? nextOrder(clean.category) : i.displayOrder,
              status: mustUnpublish ? "draft" : i.status,
              updatedAt: now,
            }
          : i,
      ),
    );
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
    commit(items.map((i) => (i.id === id ? { ...i, status: "published", updatedAt: new Date().toISOString() } : i)));
    log("publish", `${user.name} published the FAQ “${short(existing.question)}”.`);
    return OK;
  }

  async function unpublishFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return { ok: false, reasons: ["This FAQ no longer exists."] };
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);
    commit(items.map((i) => (i.id === id ? { ...i, status: "draft", updatedAt: new Date().toISOString() } : i)));
    log("unpublished", `${user.name} unpublished the FAQ “${short(existing.question)}”.`);
    return OK;
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
    const now = new Date().toISOString();
    commit(items.map((i) => (i.id === id ? { ...i, reviewedById: user.id, reviewedAt: now, awaitingFirstReview: undefined, updatedAt: now } : i)));
    log("fact_check", `${user.name} reviewed the ${getFaqCategory(existing.category).label} FAQ “${short(existing.question)}”.`);
    return OK;
  }

  async function reorder(category: FaqCategory, orderedIds: string[], user: AdminUser): Promise<ActionResult> {
    if (!canManageFaqCategory(user, category)) return denied(category);
    const position = new Map(orderedIds.map((id, index) => [id, index + 1]));
    commit(items.map((i) => (i.category === category && position.has(i.id) ? { ...i, displayOrder: position.get(i.id)! } : i)));
    return OK;
  }

  async function deleteFaq(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = items.find((i) => i.id === id);
    if (!existing) return OK;
    if (!canManageFaqCategory(user, existing.category)) return denied(existing.category);
    if (existing.status === "published") return { ok: false, reasons: ["Unpublish it first."] };
    commit(items.filter((i) => i.id !== id));
    log("delete", `${user.name} deleted the draft FAQ “${short(existing.question)}”.`);
    return OK;
  }

  return (
    <FaqContext.Provider
      value={{ items, loading, imported: true, importSiteFaqs, addFaq, updateFaq, publishFaq, unpublishFaq, reviewFaq, reorder, deleteFaq }}
    >
      {children}
    </FaqContext.Provider>
  );
}

export function useFaqItems() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error("useFaqItems must be used within FaqItemsProvider");
  return ctx;
}
