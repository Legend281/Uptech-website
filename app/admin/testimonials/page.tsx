"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TestimonialCard } from "@/components/TestimonialCard";
import { CARD_SURFACE, InfoNotice } from "@/components/admin/FormParts";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { TestimonialFormDialog, type TestimonialPrefill } from "@/components/admin/TestimonialFormDialog";
import { WithdrawConsentDialog } from "@/components/admin/WithdrawConsentDialog";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLeads } from "@/components/admin/providers/LeadsProvider";
import { useTestimonials } from "@/components/admin/providers/TestimonialsProvider";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import { toastResult } from "@/lib/admin/toastResult";
import { getLeadServiceLabel } from "@/lib/admin/register";
import {
  canCreateTestimonials,
  canManageTestimonial,
  getDisplayName,
  getPublishBlockers,
  getTestimonialPageLabel,
  isConsentOnRecord,
  isFrenchMissing,
  testimonialPages,
  testimonialServiceOptions,
} from "@/lib/admin/testimonials";
import type { LeadServiceValue, Testimonial, TestimonialPage, TestimonialStatus } from "@/lib/admin/types";

const PAGE_SIZE = 8;

const statusMeta: Record<TestimonialStatus, { label: string; badge: string; stripe: string }> = {
  published: { label: "Published", badge: "border-emerald-200 bg-emerald-50 text-emerald-700", stripe: "border-l-emerald-500" },
  draft: { label: "Draft", badge: "border-slate-200 bg-slate-50 text-slate-600", stripe: "border-l-slate-300" },
  archived: { label: "Archived", badge: "border-slate-200 bg-white text-slate-400", stripe: "border-l-slate-200" },
};

type ConsentFilter = "all" | "on-record" | "missing" | "withdrawn";

const selectClasses =
  "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40";

function ConsentBadge({ t }: { t: Testimonial }) {
  if (t.consentWithdrawnAt)
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-rose-700">
        <MaterialIcon name="block" className="text-[14px]" />
        Withdrawn
      </span>
    );
  if (isConsentOnRecord(t))
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-emerald-700">
        <MaterialIcon name="verified" className="text-[14px]" />
        {t.consentChannel === "signed-form" ? "Signed form" : "On record"}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-amber-700">
      <MaterialIcon name="warning" className="text-[14px]" />
      Missing
    </span>
  );
}

function PlacementChips({ t }: { t: Testimonial }) {
  if (t.placements.length === 0) return <span className="text-xs text-slate-400">Not placed</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {t.placements.map((p) => (
        <span key={p.page} className="whitespace-nowrap rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
          {p.page === "homepage" ? "Homepage" : "Career page"}
        </span>
      ))}
    </div>
  );
}

function QuoteCell({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="truncate font-sans text-sm font-semibold text-navy-950">{getDisplayName(t)}</p>
        {isFrenchMissing(t) ? null : (
          <span className="shrink-0 rounded border border-slate-200 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-slate-500">FR</span>
        )}
      </div>
      <p className="line-clamp-2 text-xs leading-snug text-slate-500">&ldquo;{t.quoteEn}&rdquo;</p>
    </div>
  );
}

function PreviewModal({ t, onClose }: { t: Testimonial | null; onClose: () => void }) {
  useEffect(() => {
    if (!t) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [t, onClose]);

  if (!t) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Testimonial preview">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl rounded-2xl bg-navy-950 p-4 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <MaterialIcon name="close" className="text-[20px]" />
        </button>
        <TestimonialCard
          quote={t.quoteEn}
          displayName={getDisplayName(t)}
          roleTitle={t.roleTitle}
          company={t.company}
          outcomeLine={t.outcomeLine}
          photoUrl={t.photo}
        />
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const currentUser = useCurrentUser();
  const leads = useLeads();
  const {
    testimonials,
    loading,
    signedIn,
    publishTestimonial,
    unpublishTestimonial,
    archiveTestimonial,
    restoreToDraft,
    withdrawConsent,
    deleteTestimonial,
  } = useTestimonials();

  const [creating, setCreating] = useState<{ prefill?: TestimonialPrefill } | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [previewing, setPreviewing] = useState<Testimonial | null>(null);
  const [withdrawing, setWithdrawing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);
  const [statusFilter, setStatusFilter] = useState<TestimonialStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<LeadServiceValue | "all">("all");
  const [pageFilter, setPageFilter] = useState<TestimonialPage | "unplaced" | "all">("all");
  const [consentFilter, setConsentFilter] = useState<ConsentFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const canCreate = canCreateTestimonials(currentUser);
  const publishedCount = testimonials.filter((t) => t.status === "published").length;
  const draftCount = testimonials.filter((t) => t.status === "draft").length;
  const missingConsentCount = testimonials.filter((t) => t.status !== "archived" && !isConsentOnRecord(t) && !t.consentWithdrawnAt).length;

  const filtered = testimonials
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) => serviceFilter === "all" || t.service === serviceFilter)
    .filter((t) => {
      if (pageFilter === "all") return true;
      if (pageFilter === "unplaced") return t.placements.length === 0;
      return t.placements.some((p) => p.page === pageFilter);
    })
    .filter((t) => {
      if (consentFilter === "all") return true;
      if (consentFilter === "withdrawn") return Boolean(t.consentWithdrawnAt);
      if (consentFilter === "on-record") return isConsentOnRecord(t);
      return !isConsentOnRecord(t) && !t.consentWithdrawnAt;
    })
    .filter((t) => {
      if (!query.trim()) return true;
      const haystack = `${getDisplayName(t)} ${t.quoteEn} ${t.quoteFr ?? ""} ${t.roleTitle ?? ""} ${t.company ?? ""}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Won leads with no testimonial yet — the empty state's shortcut (spec 1.4).
  const linkedLeadIds = new Set(testimonials.map((t) => t.leadId).filter(Boolean));
  const wonLeadsWithoutTestimonial = leads.filter((lead) => lead.status === "won" && !linkedLeadIds.has(lead.id));

  async function handlePublish(t: Testimonial) {
    const result = await publishTestimonial(t.id, currentUser);
    if (result.ok) {
      toast.success("Published", { description: `${getDisplayName(t)}'s testimonial is live on its pages.` });
    } else {
      toast.error("Can't publish yet", { description: result.reasons[0] });
      if (canEdit(t)) setEditing(t);
    }
  }

  /** Editors can't change or take down a Homepage testimonial — that's the Administrator's call (spec 1.2). */
  function isHomepageLocked(t: Testimonial): boolean {
    return currentUser.role !== "administrator" && t.placements.some((p) => p.page === "homepage");
  }

  function canEdit(t: Testimonial): boolean {
    return canManageTestimonial(currentUser, t) && !isHomepageLocked(t);
  }

  function actionsFor(t: Testimonial): RowAction[] {
    const actions: RowAction[] = [{ label: "Preview", icon: "visibility", onSelect: () => setPreviewing(t) }];
    if (!canManageTestimonial(currentUser, t)) return actions;

    const homepageLocked = isHomepageLocked(t);

    if (!homepageLocked) actions.push({ label: "Edit", icon: "edit", onSelect: () => setEditing(t) });
    if (t.status === "draft") {
      const ready = getPublishBlockers(t, currentUser).length === 0;
      actions.push({ label: ready ? "Publish" : "Publish… (see what's missing)", icon: "publish", onSelect: () => void handlePublish(t) });
    }
    if (t.status === "published" && !homepageLocked) {
      actions.push({
        label: "Unpublish",
        icon: "unpublished",
        onSelect: () => {
          void toastResult(unpublishTestimonial(t.id, currentUser), { title: "Unpublished", description: "It's back to draft and off the site." });
        },
      });
    }
    if (t.status === "draft") {
      actions.push({
        label: "Archive",
        icon: "archive",
        onSelect: () => {
          void toastResult(archiveTestimonial(t.id, currentUser), "Archived");
        },
      });
    }
    if (t.status === "archived" && !t.consentWithdrawnAt) {
      actions.push({
        label: "Restore to draft",
        icon: "unarchive",
        onSelect: () => {
          void toastResult(restoreToDraft(t.id, currentUser), "Restored to draft");
        },
      });
    }
    // Not homepage-locked: taking a testimonial down when the client says no is protective, so any owner can do it.
    if (t.consentGiven && !t.consentWithdrawnAt) {
      actions.push({ label: "Client withdrew consent", icon: "block", tone: "danger", onSelect: () => setWithdrawing(t) });
    }
    if (t.status !== "published" && !homepageLocked) {
      actions.push({ label: "Delete", icon: "delete", tone: "danger", onSelect: () => setDeleting(t) });
    }
    return actions;
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold text-navy-950">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            {publishedCount} published · {draftCount} draft{draftCount === 1 ? "" : "s"}
            {missingConsentCount > 0 && (
              <>
                {" "}
                · <span className="font-semibold text-amber-700">{missingConsentCount} waiting on consent</span>
              </>
            )}
          </p>
        </div>
        {canCreate && signedIn && (
          <button
            type="button"
            onClick={() => setCreating({})}
            className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Add Testimonial
          </button>
        )}
      </div>

      {!signedIn ? (
        /* Publishing writes to the live database, so it needs a staff Supabase session (staff sign-in lives elsewhere). */
        <section className={`${CARD_SURFACE} px-5 py-12 text-center`}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <MaterialIcon name="lock" className="text-[26px]" />
          </span>
          <h2 className="mt-4 font-sans text-base font-bold text-navy-950">{loading ? "Checking your sign-in…" : "Sign in to manage testimonials"}</h2>
          {!loading && (
            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              Testimonials publish straight to the Homepage and the Career Marketing &amp; Placement Support page, so this
              needs you signed in with your staff account.
            </p>
          )}
        </section>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading testimonials…</p>
      ) : (
        <>
          <InfoNotice>Published testimonials appear on the Homepage and the Career Marketing &amp; Placement Support page.</InfoNotice>
      {testimonials.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <MaterialIcon name="format_quote" className="text-[26px]" />
          </span>
          <h2 className="mt-4 font-sans text-base font-bold text-navy-950">No testimonials yet</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
            When a placed client or a finished engagement agrees to share their story, log it here. Until one is
            published, the public pages keep their current placeholder.
          </p>

          {canCreate && wonLeadsWithoutTestimonial.length > 0 && (
            <div className="mx-auto mt-6 max-w-md text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Start from a won lead</p>
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {wonLeadsWithoutTestimonial.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-navy-950">{lead.name}</span>
                      <span className="block truncate text-xs text-slate-500">{getLeadServiceLabel(lead.service)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCreating({ prefill: { leadId: lead.id, service: lead.service, fullName: lead.name } })}
                      className="shrink-0 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:border-teal-300 hover:bg-teal-100"
                    >
                      Start testimonial
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <select aria-label="Filter by status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as TestimonialStatus | "all"); setPage(1); }} className={selectClasses}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select aria-label="Filter by service" value={serviceFilter} onChange={(e) => { setServiceFilter(e.target.value as LeadServiceValue | "all"); setPage(1); }} className={selectClasses}>
              <option value="all">All services</option>
              {testimonialServiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select aria-label="Filter by page" value={pageFilter} onChange={(e) => { setPageFilter(e.target.value as TestimonialPage | "unplaced" | "all"); setPage(1); }} className={selectClasses}>
              <option value="all">All pages</option>
              {testimonialPages.map((p) => (
                <option key={p.value} value={p.value}>
                  {getTestimonialPageLabel(p.value)}
                </option>
              ))}
              <option value="unplaced">Not placed</option>
            </select>
            <select aria-label="Filter by consent" value={consentFilter} onChange={(e) => { setConsentFilter(e.target.value as ConsentFilter); setPage(1); }} className={selectClasses}>
              <option value="all">Any consent</option>
              <option value="on-record">Consent on record</option>
              <option value="missing">Consent missing</option>
              <option value="withdrawn">Consent withdrawn</option>
            </select>
            <label htmlFor={searchId} className="relative sm:ml-auto sm:w-56">
              <span className="sr-only">Search testimonials</span>
              <MaterialIcon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400" />
              <input
                id={searchId}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search…"
                autoComplete="off"
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500/40"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">Nothing matches {query ? `"${query}"` : "these filters"}.</div>
          ) : (
            <>
              <table className="hidden w-full table-fixed sm:table">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-2.5 sm:px-5">Testimonial</th>
                    <th scope="col" className="w-28 px-3 py-2.5">Status</th>
                    <th scope="col" className="w-44 px-3 py-2.5">Pages</th>
                    <th scope="col" className="w-32 px-3 py-2.5">Consent</th>
                    <th scope="col" className="w-24 px-3 py-2.5 text-right">Updated</th>
                    <th scope="col" className="w-12 px-3 py-2.5"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((t) => {
                    const meta = statusMeta[t.status];
                    return (
                      <tr
                        key={t.id}
                        onClick={() => (canEdit(t) ? setEditing(t) : setPreviewing(t))}
                        className={`cursor-pointer border-b border-l-[3px] border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 ${meta.stripe}`}
                      >
                        <td className="px-4 py-3 sm:px-5"><QuoteCell t={t} /></td>
                        <td className="px-3 py-3">
                          <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
                        </td>
                        <td className="px-3 py-3"><PlacementChips t={t} /></td>
                        <td className="px-3 py-3"><ConsentBadge t={t} /></td>
                        <td className="whitespace-nowrap px-3 py-3 text-right text-xs tabular-nums text-slate-500">{formatRelativeTime(t.updatedAt)}</td>
                        <td className="px-3 py-3"><RowActionsMenu actions={actionsFor(t)} label="Testimonial actions" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="sm:hidden">
                {paged.map((t) => {
                  const meta = statusMeta[t.status];
                  return (
                    <div key={t.id} className={`flex items-start gap-3 border-b border-l-[3px] border-slate-100 px-4 py-3.5 last:border-b-0 ${meta.stripe}`}>
                      <div className="min-w-0 flex-1 space-y-2">
                        <QuoteCell t={t} />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
                          <ConsentBadge t={t} />
                        </div>
                        <PlacementChips t={t} />
                      </div>
                      <RowActionsMenu actions={actionsFor(t)} label="Testimonial actions" />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-700">{filtered.length}</span>
                </p>
                {pageCount > 1 && (
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                      <MaterialIcon name="chevron_left" className="text-[18px]" />
                    </button>
                    <span className="px-2 text-xs font-semibold tabular-nums text-slate-600">{safePage} / {pageCount}</span>
                    <button type="button" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={safePage === pageCount} aria-label="Next page" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                      <MaterialIcon name="chevron_right" className="text-[18px]" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      )}
        </>
      )}

      {creating && (
        <TestimonialFormDialog open mode="create" prefill={creating.prefill} onClose={() => setCreating(null)} />
      )}
      {editing && <TestimonialFormDialog open mode="edit" testimonial={editing} onClose={() => setEditing(null)} />}
      <PreviewModal t={previewing} onClose={() => setPreviewing(null)} />
      <WithdrawConsentDialog
        open={Boolean(withdrawing)}
        name={withdrawing ? getDisplayName(withdrawing) : ""}
        hasPhoto={Boolean(withdrawing?.photo)}
        isLive={withdrawing?.status === "published"}
        onCancel={() => setWithdrawing(null)}
        onConfirm={(deletePhoto) => {
          if (withdrawing) {
            void toastResult(withdrawConsent(withdrawing.id, currentUser, deletePhoto), {
              title: "Consent withdrawal recorded",
              description: "It's off every page and can't be republished.",
            });
          }
          setWithdrawing(null);
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this testimonial?"
        description={
          deleting
            ? `${getDisplayName(deleting)}'s testimonial, including the consent record, will be permanently removed. If the client withdrew consent, record that instead, so there's a trail.`
            : ""
        }
        confirmLabel="Delete Testimonial"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            void toastResult(deleteTestimonial(deleting.id, currentUser), "Testimonial deleted", "Not deleted");
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
