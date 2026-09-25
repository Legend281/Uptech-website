"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DialogShell, Field, ReadinessList, Section, buttonClasses, hintClasses, inputClasses } from "@/components/admin/FormParts";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useFaqItems } from "@/components/admin/providers/FaqItemsProvider";
import {
  canReviewFaq,
  getFaqCategory,
  getFaqPublishBlockers,
  getFaqSaveErrors,
  getFaqWarnings,
  isReviewed,
  manageableCategories,
  needsLegalReview,
  type FaqInput,
} from "@/lib/admin/faqs";
import type { FaqCategory } from "@/lib/faqContent";
import type { FaqItemRecord } from "@/lib/admin/types";

type Props = { onClose: () => void } & ({ mode: "create"; category?: FaqCategory } | { mode: "edit"; item: FaqItemRecord });

/** Shared by "Add FAQ" and "Edit FAQ". Sections run Question → Answer → Page & review (spec 3.3). */
export function FaqFormDialog(props: Props) {
  const { onClose } = props;
  const formId = useId();
  const currentUser = useCurrentUser();
  const { addFaq, updateFaq, reviewFaq } = useFaqItems();
  const categories = manageableCategories(currentUser);
  const existing = props.mode === "edit" ? props.item : undefined;

  const [input, setInput] = useState<FaqInput>(() =>
    existing
      ? { question: existing.question, answer: existing.answer, category: existing.category }
      : { question: "", answer: "", category: (props.mode === "create" && props.category) || categories[0]?.value || "general" },
  );
  const [markReviewed, setMarkReviewed] = useState(false);
  const [confirmMove, setConfirmMove] = useState(false);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FaqInput>(key: K, value: FaqInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const legal = needsLegalReview(input.category);
  const wordingChanged = existing ? input.question.trim() !== existing.question || input.answer.trim() !== existing.answer : true;
  const categoryChanged = existing ? input.category !== existing.category : false;
  // The review box only appears for someone allowed to review, and only while
  // the wording is untouched — editing makes you the author of what you'd approve.
  const canReviewHere = Boolean(existing && !wordingChanged && !isReviewed(existing) && canReviewFaq(currentUser, { ...existing, category: input.category }));
  const reviewedAfterSave = Boolean(existing && !wordingChanged && (isReviewed(existing) || markReviewed));
  const blockers = getFaqPublishBlockers({
    ...input,
    reviewedById: reviewedAfterSave ? existing?.reviewedById ?? currentUser.id : undefined,
    reviewedAt: reviewedAfterSave ? existing?.reviewedAt ?? "now" : undefined,
  });
  const saveErrors = getFaqSaveErrors(input);
  const warnings = getFaqWarnings(input);
  const isPublished = existing?.status === "published";
  const willComeOff = Boolean(isPublished && legal && (wordingChanged || categoryChanged) && !reviewedAfterSave);
  const notes = [
    ...(willComeOff ? [{ icon: "unpublished", text: "Saving takes this off the site until someone else reviews the new wording." }] : []),
    ...(legal && existing?.awaitingFirstReview ? [{ icon: "history", text: "Live since before the review step existed. It still needs a first review." }] : []),
  ];

  async function save(publish: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      await persist(publish);
    } finally {
      setSaving(false);
    }
  }

  async function persist(publish: boolean) {
    if (props.mode === "edit") {
      const result = await updateFaq(props.item.id, input, currentUser);
      if (!result.ok) return toast.error("Not saved", { description: result.reasons[0] });
      if (markReviewed && canReviewHere) {
        const reviewed = await reviewFaq(props.item.id, currentUser);
        if (!reviewed.ok) toast.error("Saved, but not marked reviewed", { description: reviewed.reasons[0] });
      }
      toast.success(result.unpublished ? "Saved, and taken off the site" : "FAQ updated", {
        description: result.unpublished ? "It goes back up once a second person reviews it." : undefined,
      });
    } else {
      const result = await addFaq(input, currentUser, publish);
      if (!result.ok) return toast.error("Not saved", { description: result.reasons[0] });
      toast.success(publish ? "FAQ published" : legal ? "Draft saved — ask a colleague to review it" : "Draft saved");
    }
    onClose();
  }

  function submit(publish: boolean) {
    // Spec 3.3: moving an FAQ to another category changes which page it appears on — confirm first.
    if (categoryChanged) {
      setConfirmMove(true);
      return;
    }
    void save(publish);
  }

  const footer = (
    <>
      <button type="button" onClick={onClose} className={buttonClasses.ghost}>
        Cancel
      </button>
      {props.mode === "edit" ? (
        <button type="submit" form={formId} disabled={saving || saveErrors.length > 0} title={saveErrors[0]} className={buttonClasses.primary}>
          Save changes
        </button>
      ) : (
        <>
          <button type="submit" form={formId} disabled={saving || saveErrors.length > 0} title={saveErrors[0]} className={buttonClasses.secondary}>
            Save as draft
          </button>
          <button type="button" onClick={() => submit(true)} disabled={saving || blockers.length > 0} title={blockers[0]} className={buttonClasses.primary}>
            Save &amp; publish
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      <DialogShell titleId={`${formId}-title`} title={props.mode === "edit" ? "Edit FAQ" : "Add an FAQ"} onClose={onClose} footer={footer}>
        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:overflow-hidden">
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
              submit(false);
            }}
            className="space-y-6 px-5 py-5 lg:overflow-y-auto"
          >
            <Section step={1} title="Question" description="Phrased the way a visitor would actually ask it.">
              <Field label="Question" required>
                <input type="text" value={input.question} onChange={(e) => set("question", e.target.value)} className={inputClasses} />
              </Field>
            </Section>

            <Section step={2} title="Answer" description="Written by staff. Plain, accurate, and no promises the service can't keep.">
              <Field label="Answer" required>
                <textarea
                  value={input.answer}
                  onChange={(e) => set("answer", e.target.value)}
                  rows={7}
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
              </Field>
              <div className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 ${hintClasses}`}>
                <p className="mb-1 font-semibold text-slate-600">Formatting</p>
                <p>
                  <code>**bold**</code> · <code>[link text](https://…)</code> · a blank line starts a new paragraph · lines starting
                  with <code>- </code> become bullet points. Links must start with https://, mailto:, tel: or /.
                </p>
              </div>
            </Section>

            <Section step={3} title="Page & review" description="Which page's FAQ it belongs to, and the second-person check for compliance answers.">
              <Field label="Category" hint={`Shows on the ${getFaqCategory(input.category).pageLabel}. Only active services are listed.`}>
                <select value={input.category} onChange={(e) => set("category", e.target.value as FaqCategory)} className={`${inputClasses} bg-white`}>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                      {c.legalReview ? " (needs second-person review)" : ""}
                    </option>
                  ))}
                </select>
              </Field>

              {legal && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="font-semibold">Legal review required</p>
                  <p className="mt-0.5 text-xs leading-relaxed">
                    {getFaqCategory(input.category).label} answers carry legal risk if they&apos;re wrong. Someone other than
                    the last person to edit the wording must review it before it goes live, and any later change to the
                    wording clears that review.
                  </p>
                  {existing && isReviewed(existing) && !wordingChanged && (
                    <p className="mt-2 text-xs font-semibold text-emerald-800">Reviewed. The current wording has been checked.</p>
                  )}
                  {canReviewHere && (
                    <label className="mt-3 flex items-start gap-2.5 rounded-md border border-amber-300 bg-white p-2.5">
                      <input
                        type="checkbox"
                        checked={markReviewed}
                        onChange={(e) => setMarkReviewed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                      />
                      <span className="text-xs text-slate-700">
                        I&apos;ve checked this answer against current requirements and it&apos;s accurate.
                      </span>
                    </label>
                  )}
                </div>
              )}
            </Section>
          </form>

          <aside className="space-y-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Preview</span>
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4">
                <FaqAccordion
                  defaultOpenIndex={0}
                  items={[{ question: input.question.trim() || "Your question", answer: input.answer.trim() || "Your answer." }]}
                />
              </div>
            </div>
            <ReadinessList blockers={blockers} warnings={warnings} notes={notes} />
          </aside>
        </div>
      </DialogShell>

      <ConfirmDialog
        open={confirmMove}
        tone="warning"
        title="Move this FAQ to another page?"
        description={`It will stop showing on the ${existing ? getFaqCategory(existing.category).pageLabel : ""} and show on the ${getFaqCategory(input.category).pageLabel} instead.`}
        confirmLabel="Move it"
        onCancel={() => setConfirmMove(false)}
        onConfirm={() => {
          setConfirmMove(false);
          void save(false);
        }}
      />
    </>
  );
}
