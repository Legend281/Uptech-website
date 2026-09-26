"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TestimonialCard } from "@/components/TestimonialCard";
import { DialogShell, Field, ReadinessList, Section, buttonClasses, hintClasses, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useStaff as useAdminUsers } from "@/components/admin/providers/StaffProvider";
import { useLeads, useLeadsLoading } from "@/components/admin/providers/LeadsProvider";
import { useTestimonials } from "@/components/admin/providers/TestimonialsProvider";
import { getLeadServiceLabel } from "@/lib/admin/register";
import { resizeImageToDataUrl } from "@/lib/admin/resizeImage";
import {
  QUOTE_SOFT_LIMIT,
  attributionModeLabels,
  audienceLabels,
  getDisplayName,
  getPublishBlockers,
  getWarnings,
  isFrenchMissing,
  normalizeAttribution,
  servicesFor,
  testimonialPages,
  testimonialServiceOptions,
  type TestimonialInput,
} from "@/lib/admin/testimonials";
import type {
  AttributionMode,
  LeadServiceValue,
  Testimonial,
  TestimonialAudience,
  TestimonialPage,
  TestimonialPlacement,
} from "@/lib/admin/types";

/** Pre-fill from a Won lead (the empty state's shortcut). */
export type TestimonialPrefill = { leadId: string; service?: LeadServiceValue; fullName?: string };

type Props =
  | { open: boolean; onClose: () => void; mode: "create"; prefill?: TestimonialPrefill }
  | { open: boolean; onClose: () => void; mode: "edit"; testimonial: Testimonial };

function emptyInput(): TestimonialInput {
  return {
    quoteEn: "",
    quoteFr: "",
    quoteFrIsTranslation: true,
    outcomeLine: "",
    attributionMode: "full_name",
    fullName: "",
    firstName: "",
    lastInitial: "",
    anonymisedDescriptor: "",
    roleTitle: "",
    company: "",
    audience: undefined,
    photo: undefined,
    service: "" as LeadServiceValue,
    originalWording: "",
    consentGiven: false,
    consentDate: "",
    consentChannel: undefined,
    leadId: undefined,
    placements: [],
  };
}

/** Shared by "Add Testimonial" and "Edit Testimonial". Sections run Quote → Attribution → Consent → Placement (spec 1.4) — consent comes before placement so it can't be skipped. */
export function TestimonialFormDialog(props: Props) {
  const { open, onClose } = props;
  const formId = useId();
  const currentUser = useCurrentUser();
  const leads = useLeads();
  const leadsLoading = useLeadsLoading();
  const users = useAdminUsers();
  const { addTestimonial, updateTestimonial } = useTestimonials();

  const [input, setInput] = useState<TestimonialInput>(emptyInput);
  const [previewPage, setPreviewPage] = useState<TestimonialPage>("career-marketing-placement");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const existing = props.mode === "edit" ? props.testimonial : undefined;
  const withdrawn = Boolean(existing?.consentWithdrawnAt);

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      const t = props.testimonial;
      // Only the editable fields — never status/audit fields, which a stale
      // copy here would otherwise write back over newer values on save.
      setInput({
        quoteEn: t.quoteEn,
        quoteFr: t.quoteFr ?? "",
        quoteFrIsTranslation: t.quoteFrIsTranslation,
        outcomeLine: t.outcomeLine ?? "",
        attributionMode: t.attributionMode,
        fullName: t.fullName ?? "",
        firstName: t.firstName ?? "",
        lastInitial: t.lastInitial ?? "",
        anonymisedDescriptor: t.anonymisedDescriptor ?? "",
        roleTitle: t.roleTitle ?? "",
        company: t.company ?? "",
        audience: t.audience,
        photo: t.photo,
        service: t.service,
        originalWording: t.originalWording,
        consentGiven: t.consentGiven,
        consentDate: t.consentDate ?? "",
        consentChannel: t.consentChannel,
        leadId: t.leadId,
        placements: t.placements,
      });
      setPreviewPage(t.placements[0]?.page ?? "career-marketing-placement");
    } else {
      const base = emptyInput();
      if (props.prefill) {
        base.leadId = props.prefill.leadId;
        if (props.prefill.service && testimonialServiceOptions.some((o) => o.value === props.prefill?.service)) {
          base.service = props.prefill.service;
        }
        base.fullName = props.prefill.fullName ?? "";
      }
      setInput(base);
      setPreviewPage("career-marketing-placement");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function set<K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  /** One tick: records consent as confirmed by staff, dated today. An existing record keeps its original date and channel. */
  function setConsent(given: boolean) {
    setInput((prev) =>
      given
        ? {
            ...prev,
            consentGiven: true,
            consentDate: prev.consentDate || new Date().toISOString().slice(0, 10),
            consentChannel: prev.consentChannel ?? "confirmed",
          }
        : { ...prev, consentGiven: false, consentDate: "", consentChannel: undefined },
    );
  }

  function togglePlacement(page: TestimonialPage, on: boolean) {
    setInput((prev) => {
      const others = prev.placements.filter((p) => p.page !== page);
      const placements: TestimonialPlacement[] = on ? [...others, { page, displayOrder: 1 }] : others;
      return { ...prev, placements };
    });
    if (on) setPreviewPage(page);
  }

  function setOrder(page: TestimonialPage, displayOrder: number) {
    setInput((prev) => ({
      ...prev,
      placements: prev.placements.map((p) => (p.page === page ? { ...p, displayOrder } : p)),
    }));
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setPhotoBusy(true);
    try {
      set("photo", await resizeImageToDataUrl(file));
    } catch (error) {
      toast.error("Couldn't use that photo", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setPhotoBusy(false);
    }
  }

  const normalized = normalizeAttribution(input);
  const blockers = getPublishBlockers({ ...normalized, consentWithdrawnAt: existing?.consentWithdrawnAt }, currentUser);
  const warnings = getWarnings(normalized);
  const frenchMissing = isFrenchMissing(normalized);
  const quoteLength = input.quoteEn.trim().length;
  const isPublished = existing?.status === "published";
  const serviceChoices = servicesFor(currentUser);
  const recordedBy =
    existing?.consentRecordedById && input.consentGiven === existing.consentGiven
      ? users.find((u) => u.id === existing.consentRecordedById)?.name
      : input.consentGiven
        ? `${currentUser.name} (you)`
        : undefined;

  // Won leads first: a finished engagement is where a testimonial usually comes from.
  const wonLeads = leads.filter((lead) => lead.status === "won");
  const otherLeads = leads.filter((lead) => lead.status !== "won");

  async function submit(publish: boolean) {
    if (saving) return;
    setSaving(true);
    const result =
      props.mode === "edit"
        ? await updateTestimonial(props.testimonial.id, input, currentUser)
        : await addTestimonial(input, currentUser, publish);
    setSaving(false);
    if (!result.ok) {
      toast.error("Not saved", { description: result.reasons[0] });
      return;
    }
    toast.success(props.mode === "edit" ? "Testimonial updated" : publish ? "Testimonial published" : "Draft saved");
    onClose();
  }

  const displayName = getDisplayName(normalized) || "Client name";
  const previewTone = previewPage === "homepage" ? "light" : "dark";

  const footer = (
    <>
      <button type="button" onClick={onClose} className={buttonClasses.ghost}>
        Cancel
      </button>
      {isPublished ? (
        <button type="button" onClick={() => void submit(false)} disabled={saving || blockers.length > 0} title={blockers[0]} className={buttonClasses.primary}>
          Save live changes
        </button>
      ) : (
        <>
          <button type="submit" form={formId} disabled={saving} className={buttonClasses.secondary}>
            {props.mode === "edit" ? "Save changes" : "Save as draft"}
          </button>
          {props.mode === "create" && (
            <button type="button" onClick={() => void submit(true)} disabled={saving || blockers.length > 0} title={blockers[0]} className={buttonClasses.primary}>
              Save &amp; publish
            </button>
          )}
        </>
      )}
    </>
  );

  return (
    <DialogShell titleId={`${formId}-title`} title={props.mode === "edit" ? "Edit Testimonial" : "Add a Testimonial"} onClose={onClose} footer={footer}>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
              void submit(false);
            }}
            className="space-y-6 px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain"
          >
            {withdrawn && (
              <div className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                <MaterialIcon name="block" className="text-[18px]" />
                <p>
                  The client withdrew consent. You can still edit the internal record, but this testimonial can&apos;t be
                  published again.
                </p>
              </div>
            )}

            <Section step={1} title="Quote" description="Their words. Staff never write or rewrite a testimonial beyond fixing typos.">
              <Field label="Client's original wording" required hint="Exactly as they gave it, typos and all. Internal only, never shown on the site.">
                <textarea
                  value={input.originalWording}
                  onChange={(e) => set("originalWording", e.target.value)}
                  rows={3}
                  className={`${inputClasses} resize-y leading-relaxed`}
                  placeholder="Paste the message, email or form text they sent."
                />
              </Field>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={labelClasses}>
                    Public quote (English) <span className="text-rose-500">*</span>
                  </span>
                  {input.originalWording.trim() && !input.quoteEn.trim() && (
                    <button
                      type="button"
                      onClick={() => set("quoteEn", input.originalWording)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Start from the original
                    </button>
                  )}
                </div>
                <textarea
                  aria-label="Public quote (English)"
                  value={input.quoteEn}
                  onChange={(e) => set("quoteEn", e.target.value)}
                  rows={4}
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
                <span className={`text-right text-xs tabular-nums ${quoteLength > QUOTE_SOFT_LIMIT ? "font-semibold text-amber-700" : "text-slate-400"}`}>
                  {quoteLength} / {QUOTE_SOFT_LIMIT}
                </span>
              </div>

              <Field label="Public quote (French)" hint="Optional. Leave blank rather than guess.">
                <textarea
                  value={input.quoteFr ?? ""}
                  onChange={(e) => set("quoteFr", e.target.value)}
                  rows={3}
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
              </Field>
              {input.quoteFr?.trim() && (
                <fieldset className="flex flex-wrap gap-2">
                  <legend className="sr-only">Where the French text came from</legend>
                  {[
                    { value: true, label: "Our translation" },
                    { value: false, label: "Client's own French" },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        input.quoteFrIsTranslation === option.value
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${formId}-fr-source`}
                        checked={input.quoteFrIsTranslation === option.value}
                        onChange={() => set("quoteFrIsTranslation", option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </fieldset>
              )}

              <Field
                label="Outcome line"
                hint="Optional, e.g. “Placed within 8 weeks”. A factual claim: it needs a linked lead to check it against."
              >
                <input type="text" value={input.outcomeLine ?? ""} onChange={(e) => set("outcomeLine", e.target.value)} className={inputClasses} />
              </Field>
            </Section>

            <Section step={2} title="Attribution" description="Who it's from, and how much of their identity they agreed to show.">
              <Field label="Service" required hint="Only active services are listed. This also sets which department owns the testimonial.">
                <select
                  value={input.service}
                  onChange={(e) => set("service", e.target.value as LeadServiceValue)}
                  className={`${inputClasses} bg-white`}
                >
                  <option value="">Select a service</option>
                  {serviceChoices.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <fieldset>
                <legend className={`${labelClasses} mb-1.5`}>How they&apos;re named</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {(Object.keys(attributionModeLabels) as AttributionMode[]).map((mode) => (
                    <label
                      key={mode}
                      className={`cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
                        input.attributionMode === mode ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${formId}-mode`}
                        checked={input.attributionMode === mode}
                        onChange={() => set("attributionMode", mode)}
                        className="sr-only"
                      />
                      <span className={`block text-sm font-semibold ${input.attributionMode === mode ? "text-teal-800" : "text-slate-700"}`}>
                        {attributionModeLabels[mode].label}
                      </span>
                      <span className="block text-[11px] leading-snug text-slate-500">{attributionModeLabels[mode].hint}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {input.attributionMode === "full_name" && (
                  <Field label="Full name" required>
                    <input type="text" value={input.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} className={inputClasses} />
                  </Field>
                )}
                {input.attributionMode === "first_name_initial" && (
                  <>
                    <Field label="First name" required>
                      <input type="text" value={input.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} className={inputClasses} />
                    </Field>
                    <Field label="Last-name initial" required>
                      <input
                        type="text"
                        maxLength={1}
                        value={input.lastInitial ?? ""}
                        onChange={(e) => set("lastInitial", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>
                  </>
                )}
                {input.attributionMode === "anonymised" && (
                  <div className="sm:col-span-2">
                    <Field label="Anonymised description" required hint="Role and place, never anything that identifies them.">
                      <input
                        type="text"
                        value={input.anonymisedDescriptor ?? ""}
                        onChange={(e) => set("anonymisedDescriptor", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g. Finance graduate, Buea"
                      />
                    </Field>
                  </div>
                )}
                {input.attributionMode !== "anonymised" && (
                  <Field label="Role / title">
                    <input type="text" value={input.roleTitle ?? ""} onChange={(e) => set("roleTitle", e.target.value)} className={inputClasses} />
                  </Field>
                )}
                {input.attributionMode === "full_name" && (
                  <Field label="Company">
                    <input type="text" value={input.company ?? ""} onChange={(e) => set("company", e.target.value)} className={inputClasses} />
                  </Field>
                )}
                <Field label="Where they are">
                  <select
                    value={input.audience ?? ""}
                    onChange={(e) => set("audience", (e.target.value || undefined) as TestimonialAudience | undefined)}
                    className={`${inputClasses} bg-white`}
                  >
                    <option value="">Not specified</option>
                    {(Object.keys(audienceLabels) as TestimonialAudience[]).map((a) => (
                      <option key={a} value={a}>
                        {audienceLabels[a]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {input.attributionMode === "full_name" ? (
                <div className="flex items-center gap-3">
                  {input.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={input.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <MaterialIcon name="person" className="text-[22px]" />
                    </span>
                  )}
                  <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                    {photoBusy ? "Resizing…" : input.photo ? "Replace photo" : "Add photo (optional)"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={photoBusy}
                      onChange={(e) => {
                        void handlePhoto(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {input.photo && (
                    <button type="button" onClick={() => set("photo", undefined)} className="text-xs font-semibold text-rose-600 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <p className={hintClasses}>Photos are only used with a full name. A face undoes an initial or an anonymised description.</p>
              )}
              {leads.length === 0 ? (
                /* Nothing to pick from: say so plainly instead of showing an empty dropdown. */
                <div className="flex flex-col gap-1.5">
                  <span className={labelClasses}>Linked lead</span>
                  <p className="rounded-lg border border-dashed border-slate-300 px-3.5 py-2.5 text-sm text-slate-500">
                    {leadsLoading
                      ? "Loading leads…"
                      : "No leads to link yet. Optional: you only need one for an outcome line. Leads from the Leads page and the contact form appear here."}
                  </p>
                </div>
              ) : (
              <Field label="Linked lead" hint="Optional. Pick the lead this client came from, usually a Won one. Needed only for an outcome line.">
                <select
                  value={input.leadId ?? ""}
                  onChange={(e) => set("leadId", e.target.value || undefined)}
                  className={`${inputClasses} bg-white`}
                >
                  <option value="">No linked lead</option>
                  {wonLeads.length > 0 && (
                    <optgroup label="Won">
                      {wonLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name}: {getLeadServiceLabel(lead.service)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {otherLeads.length > 0 && (
                    <optgroup label={wonLeads.length > 0 ? "Other leads" : "Leads"}>
                      {otherLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name}: {getLeadServiceLabel(lead.service)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </Field>
              )}
            </Section>

            <Section step={3} title="Placement" description="Confirm the client agreed, then choose where it appears. Only pages with a testimonial slot are listed.">
              <div className="space-y-2">
              {/* The one consent step: a tick, dated today and recorded as confirmed by staff.
                  It sits here because it is what lets a testimonial go live; the database refuses to publish without it. */}
              <label className={`flex items-start gap-2.5 rounded-lg border p-3 ${input.consentGiven ? "border-emerald-300 bg-emerald-50" : "border-slate-300"}`}>
                <input
                  type="checkbox"
                  checked={input.consentGiven}
                  disabled={withdrawn}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                />
                <span className="text-sm text-slate-700">
                  The client agreed to this quote being published with the attribution chosen above.
                </span>
              </label>
              {recordedBy && input.consentGiven && (
                <p className={hintClasses}>
                  Confirmed by <span className="font-semibold text-slate-700">{recordedBy}</span>
                  {input.consentDate ? ` on ${input.consentDate}` : ""}
                </p>
              )}
                {testimonialPages.map((page) => {
                  const placement = input.placements.find((p) => p.page === page.value);
                  const locked = page.adminOnly && currentUser.role !== "administrator";
                  // A mismatched page can't be newly ticked. One ticked before the service changed stays
                  // untickable-to-off and shows as a blocker, rather than silently disappearing.
                  const wrongService = Boolean(page.onlyService && input.service && input.service !== page.onlyService);
                  return (
                    <div
                      key={page.value}
                      className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5 ${
                        placement ? "border-teal-500 bg-teal-50/60" : "border-slate-300"
                      } ${locked || (wrongService && !placement) ? "opacity-60" : ""}`}
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={Boolean(placement)}
                          disabled={locked || (wrongService && !placement)}
                          onChange={(e) => togglePlacement(page.value, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">{page.label}</span>
                          <span className="block text-[11px] text-slate-500">
                            {page.value === "homepage"
                              ? locked
                                ? "Administrators only. Needs the client's full name."
                                : "Needs the client's full name."
                              : wrongService
                                ? "Only for Career Marketing & Placement Support testimonials."
                                : "Any attribution; a WhatsApp or email yes is enough."}
                          </span>
                        </span>
                      </label>
                      {placement && (
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          Order
                          <input
                            type="number"
                            min={1}
                            value={placement.displayOrder}
                            onChange={(e) => setOrder(page.value, Math.max(1, Number(e.target.value) || 1))}
                            className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm text-navy-950"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          </form>

          {/* Preview + publish readiness */}
          <aside className="space-y-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-t-0">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className={labelClasses}>Preview</span>
                <div className="flex rounded-md border border-slate-200 bg-white p-0.5 text-[11px] font-semibold">
                  {testimonialPages.map((page) => (
                    <button
                      key={page.value}
                      type="button"
                      onClick={() => setPreviewPage(page.value)}
                      className={`rounded px-2 py-1 ${previewPage === page.value ? "bg-navy-950 text-white" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      {page.value === "homepage" ? "Homepage" : "Career page"}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`rounded-xl p-3 ${previewTone === "dark" ? "bg-navy-950" : "border border-slate-200 bg-white"}`}>
                <TestimonialCard
                  quote={normalized.quoteEn || "The client's quote appears here."}
                  displayName={displayName}
                  roleTitle={normalized.roleTitle}
                  company={normalized.company}
                  outcomeLine={normalized.outcomeLine}
                  photoUrl={normalized.photo}
                  tone={previewTone}
                />
              </div>
            </div>

            <ReadinessList
              blockers={blockers}
              warnings={warnings}
              notes={frenchMissing ? [{ icon: "translate", text: "No French version yet." }] : []}
            />
          </aside>
        </div>
      </DialogShell>
  );
}
