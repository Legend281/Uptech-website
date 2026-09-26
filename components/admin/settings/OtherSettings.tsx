"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { toastResult } from "@/lib/admin/toastResult";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CARD_SURFACE, Field, buttonClasses, hintClasses, inputClasses } from "@/components/admin/FormParts";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useNotificationPrefs, useSettings } from "@/components/admin/providers/SettingsProvider";
import { useServicePages, useServicePageActions } from "@/components/admin/providers/ServicePagesProvider";
import { getReviewStatus, DEFAULT_DUE_SOON_DAYS } from "@/lib/admin/staleness";
import {
  COMPANY_DISPLAY_NAME,
  COMPANY_LEGAL_NAME,
  canEditSystemSettings,
  notificationEventLabels,
  validateCompany,
  validateReviewCycle,
  type CompanyDetails,
  type NotificationChannel,
  type NotificationEvent,
  type NotificationPrefs,
  type ReviewCycle,
} from "@/lib/admin/settings";

function SaveBar({ dirty, error, onDiscard, onSave }: { dirty: boolean; error?: string; onDiscard: () => void; onSave: () => void }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
      {error && <p className="mr-auto text-xs text-rose-700">{error}</p>}
      {dirty && (
        <button type="button" onClick={onDiscard} className={buttonClasses.ghost}>
          Discard
        </button>
      )}
      <button type="button" onClick={onSave} disabled={!dirty || Boolean(error)} className={buttonClasses.primary}>
        Save
      </button>
    </div>
  );
}

/** A plain, visible label for settings that are stored but not yet acted on — so nothing looks live that isn't. */
export function NotYetConnected({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
      <MaterialIcon name="power_off" className="text-[16px] text-slate-400" />
      <p>{children}</p>
    </div>
  );
}

// 4.3 ----------------------------------------------------------------------------

export function NotificationSettings() {
  const currentUser = useCurrentUser();
  const saved = useNotificationPrefs(currentUser.id);
  const { saveNotifications } = useSettings();
  const [draft, setDraft] = useState<NotificationPrefs>(saved);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function toggle(event: NotificationEvent, channel: NotificationChannel, on: boolean) {
    setDraft((prev) => ({ ...prev, [event]: { ...prev[event], [channel]: on } }));
  }

  return (
    <section className={`${CARD_SURFACE} p-5`}>
      <p className="mb-4 text-sm text-slate-600">
        Your own preferences, {currentUser.name}. Nobody else can change them.
      </p>
      <NotYetConnected>
        Saved now, but nothing is sent yet: email alerts need the Resend notification wiring, and in-app alerts need a
        notifications inbox. Neither exists yet. When they do, they&apos;ll follow these choices.
      </NotYetConnected>
      <table className="mt-4 w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th scope="col" className="py-2">When</th>
            <th scope="col" className="w-20 py-2 text-center">Email</th>
            <th scope="col" className="w-20 py-2 text-center">In-app</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(notificationEventLabels) as NotificationEvent[]).map((event) => (
            <tr key={event} className="border-b border-slate-100 last:border-b-0">
              <td className="py-3 pr-3">
                <span className="block text-sm font-semibold text-slate-800">{notificationEventLabels[event].label}</span>
                <span className="block text-xs text-slate-500">{notificationEventLabels[event].hint}</span>
              </td>
              {(["email", "inApp"] as NotificationChannel[]).map((channel) => (
                <td key={channel} className="py-3 text-center">
                  <input
                    type="checkbox"
                    aria-label={`${notificationEventLabels[event].label}: ${channel === "email" ? "email" : "in-app"}`}
                    checked={draft[event][channel]}
                    onChange={(e) => toggle(event, channel, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <SaveBar
        dirty={dirty}
        onDiscard={() => setDraft(saved)}
        onSave={() => {
          void toastResult(saveNotifications(currentUser.id, draft, currentUser), "Preferences saved");
        }}
      />
    </section>
  );
}

// 4.4 ----------------------------------------------------------------------------

/** Pulled from each real service_pages row's own reviewCadenceDays/dueSoonDays — see ServicePagesProvider.tsx and supabase/011_service_pages_due_soon_days.sql. Not a separate Settings-owned copy: editing here writes straight back to that same row. */
function toCycle(page: { reviewCadenceDays: number; dueSoonDays?: number }): ReviewCycle {
  return { cadenceDays: page.reviewCadenceDays, dueSoonDays: page.dueSoonDays ?? DEFAULT_DUE_SOON_DAYS };
}

export function ReviewCycleSettings() {
  const currentUser = useCurrentUser();
  const pages = useServicePages();
  const { updateReviewCadence } = useServicePageActions();
  const saved = Object.fromEntries(pages.map((p) => [p.id, toCycle(p)]));
  const [draft, setDraft] = useState<Record<string, ReviewCycle>>({});
  // Pages load asynchronously from Supabase (empty on first render) — this
  // syncs the draft once real data arrives, without stomping on an edit
  // already in progress if the page count doesn't change again afterward.
  useEffect(() => {
    setDraft(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const firstError = pages.map((p) => draft[p.id] && validateReviewCycle(draft[p.id]).map((e) => `${p.title}: ${e}`)[0]).find(Boolean);
  const editable = canEditSystemSettings(currentUser);

  function set(pageId: string, key: keyof ReviewCycle, value: number) {
    setDraft((prev) => ({ ...prev, [pageId]: { ...prev[pageId], [key]: Math.round(value) } }));
  }

  return (
    <section className={`${CARD_SURFACE} p-5`}>
      <p className="mb-4 text-sm text-slate-600">
        How often each compliance page must be re-checked against current law, and how early the dashboard starts warning.
        These drive the review countdowns on the Dashboard and the &ldquo;overdue&rdquo; count in the top bar.
      </p>
      <div className="space-y-3">
        {pages.map((page) => {
          const cycle = draft[page.id] ?? toCycle(page);
          const preview = getReviewStatus({ ...page, reviewCadenceDays: cycle.cadenceDays, dueSoonDays: cycle.dueSoonDays });
          const dueDate = new Date(new Date(page.lastReviewedAt).getTime() + cycle.cadenceDays * 86_400_000);
          return (
            <div key={page.id} className="grid grid-cols-1 items-end gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(0,1fr)_130px_150px]">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{page.title}</p>
                <p className="text-xs text-slate-500">
                  Next review due {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(dueDate)} ·{" "}
                  <span className={preview === "overdue" ? "font-semibold text-rose-700" : preview === "due-soon" ? "font-semibold text-amber-700" : "text-emerald-700"}>
                    {preview === "overdue" ? "Overdue" : preview === "due-soon" ? "Due soon" : "On track"}
                  </span>
                </p>
              </div>
              <Field label="Every (days)">
                <input type="number" min={30} max={730} value={cycle.cadenceDays} disabled={!editable} onChange={(e) => set(page.id, "cadenceDays", Number(e.target.value))} className={inputClasses} />
              </Field>
              <Field label="Warn (days before)">
                <input type="number" min={1} value={cycle.dueSoonDays} disabled={!editable} onChange={(e) => set(page.id, "dueSoonDays", Number(e.target.value))} className={inputClasses} />
              </Field>
            </div>
          );
        })}
      </div>
      {editable && (
        <SaveBar
          dirty={dirty}
          error={firstError || undefined}
          onDiscard={() => setDraft(saved)}
          onSave={() => {
            const changed = Object.entries(draft).filter(([id, cycle]) => {
              const before = saved[id];
              return !before || before.cadenceDays !== cycle.cadenceDays || before.dueSoonDays !== cycle.dueSoonDays;
            });
            for (const [pageId, cycle] of changed) {
              updateReviewCadence(pageId, { reviewCadenceDays: cycle.cadenceDays, dueSoonDays: cycle.dueSoonDays });
            }
            toast.success("Review cycles saved");
          }}
        />
      )}
    </section>
  );
}

// 4.5 ----------------------------------------------------------------------------

const companyFields: { key: keyof CompanyDetails; label: string; hint?: string; type?: string; group: string }[] = [
  { key: "contactEmail", label: "Contact email", type: "email", group: "Contact" },
  { key: "whatsappNumber", label: "WhatsApp number", hint: "With country code.", group: "Contact" },
  { key: "phoneNumber", label: "Phone number", hint: "If different from WhatsApp.", group: "Contact" },
  { key: "cameroonEntity", label: "Cameroon entity", group: "Entities" },
  { key: "cameroonAddress", label: "Buea office address", hint: "Leave blank until confirmed.", group: "Entities" },
  { key: "usEntity", label: "US entity", group: "Entities" },
  { key: "usAddress", label: "Stafford office address", hint: "Leave blank until confirmed.", group: "Entities" },
  { key: "linkedinUrl", label: "LinkedIn", group: "Social links" },
  { key: "facebookUrl", label: "Facebook", group: "Social links" },
  { key: "tiktokUrl", label: "TikTok", group: "Social links" },
  { key: "xUrl", label: "X", group: "Social links" },
];

export function CompanySettings() {
  const currentUser = useCurrentUser();
  const { settings, saveCompany } = useSettings();
  const [draft, setDraft] = useState<CompanyDetails>(settings.company);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings.company);
  const errors = validateCompany(draft);
  const editable = canEditSystemSettings(currentUser);
  const groups = [...new Set(companyFields.map((f) => f.group))];

  return (
    <section className={`${CARD_SURFACE} p-5`}>
      <NotYetConnected>
        The public site doesn&apos;t read these yet. Pages still carry their own copies of the email and WhatsApp number, and
        the footer&apos;s social icons point nowhere. Connecting the site to this one source is a separate step.
      </NotYetConnected>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Name used on the site</p>
          <p className="mt-0.5 text-sm font-semibold text-navy-950">{COMPANY_DISPLAY_NAME}</p>
          <p className={hintClasses}>Fixed. Never &ldquo;UCO&rdquo;, which is only the logo monogram.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Official name</p>
          <p className="mt-0.5 text-sm font-semibold text-navy-950">{COMPANY_LEGAL_NAME}</p>
          <p className={hintClasses}>Fixed.</p>
        </div>
      </div>
      {groups.map((group) => (
        <fieldset key={group} className="mt-5" disabled={!editable}>
          <legend className="mb-2 font-sans text-sm font-bold text-navy-950">{group}</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {companyFields
              .filter((f) => f.group === group)
              .map((f) => (
                <Field key={f.key} label={f.label} hint={f.hint ?? (group === "Social links" ? "Full https:// link, or leave blank." : undefined)}>
                  <input
                    type={f.type ?? (group === "Social links" ? "url" : "text")}
                    value={draft[f.key]}
                    onChange={(e) => setDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className={inputClasses}
                  />
                </Field>
              ))}
          </div>
        </fieldset>
      ))}
      {editable && (
        <SaveBar
          dirty={dirty}
          error={errors[0]}
          onDiscard={() => setDraft(settings.company)}
          onSave={() => {
            void toastResult(saveCompany(draft, currentUser), "Company details saved");
          }}
        />
      )}
    </section>
  );
}
