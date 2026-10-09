"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CARD_SURFACE, buttonClasses } from "@/components/admin/FormParts";
import { publicPhotoUrl } from "@/lib/supabase/client";
import { usePartnerLogos, usePartnerLogoActions } from "@/components/admin/providers/PartnerLogosProvider";
import { PartnerLogoFormDialog } from "@/components/admin/PartnerLogoFormDialog";
import type { PartnerLogo } from "@/lib/admin/types";

export function PartnerLogosSettings() {
  const { partners, loading, loadError } = usePartnerLogos();
  const { deletePartner, setStatus, move } = usePartnerLogoActions();

  const [dialogState, setDialogState] = useState<{ open: boolean; mode: "create" | "edit"; partner?: PartnerLogo }>({
    open: false,
    mode: "create",
  });
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPartners = partners
    .filter((p) => {
      if (filter === "published") return p.status === "published";
      if (filter === "draft") return p.status === "draft";
      return true;
    })
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase().trim()));

  const publishedCount = partners.filter((p) => p.status === "published").length;
  const draftCount = partners.filter((p) => p.status === "draft").length;

  function handleDelete(partner: PartnerLogo) {
    if (confirm(`Are you sure you want to remove the logo for "${partner.name}"?`)) {
      setDeletingId(partner.id);
      void deletePartner(partner.id)
        .then(() => toast.success(`Partner "${partner.name}" removed`))
        .catch(() => toast.error("Failed to remove partner"))
        .finally(() => setDeletingId(null));
    }
  }

  function handleToggleStatus(partner: PartnerLogo) {
    const nextStatus = partner.status === "published" ? "draft" : "published";
    void setStatus(partner.id, nextStatus)
      .then(() =>
        toast.success(
          nextStatus === "published"
            ? `"${partner.name}" is now visible on the homepage`
            : `"${partner.name}" moved to drafts (hidden)`
        )
      )
      .catch(() => toast.error("Failed to update status"));
  }

  return (
    <section className={`${CARD_SURFACE} p-5 sm:p-6 space-y-6`}>
      {/* Header & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-navy-950">Partner Logos</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Logos displayed in the scrolling &ldquo;Our Partners&rdquo; strip on the public homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogState({ open: true, mode: "create" })}
          className={`${buttonClasses.primary} flex items-center gap-1.5 shrink-0`}
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Add partner logo
        </button>
      </div>

      {/* Migration Notice if database table is not yet created */}
      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-800">
          <MaterialIcon name="info" className="text-[20px] text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Database setup note</p>
            <p className="leading-relaxed">
              The <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">partner_logos</code> table is not yet present
              in Supabase. Initial partner logos are active from defaults. To persist additions across sessions, execute the
              migration script <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">supabase/032_partner_logos.sql</code> in
              your Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* Stats & Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === "all" ? "bg-navy-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({partners.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("published")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === "published" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("draft")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === "draft" ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400"
          />
          <input
            type="text"
            placeholder="Search partners…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-navy-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Partner Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <MaterialIcon name="progress_activity" className="animate-spin text-[24px]" />
          <span className="ml-2 text-sm">Loading partner logos…</span>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <MaterialIcon name="handshake" className="text-[24px]" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No partner logos found</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {search ? "No partners match your search criteria." : "Get started by adding your first partner logo."}
          </p>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              Clear search
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDialogState({ open: true, mode: "create" })}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
            >
              Add partner logo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner, index) => {
            const logoSrc = publicPhotoUrl("partner-logos", partner.logoUrl) ?? partner.logoUrl;

            return (
              <div
                key={partner.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm"
              >
                {/* Top: Logo Frame */}
                <div>
                  <div className="relative flex h-24 w-full items-center justify-center rounded-lg border border-slate-100 bg-slate-50/70 p-3 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoSrc}
                      alt={partner.name}
                      className="max-h-12 max-w-full object-contain"
                    />
                    <span className="absolute top-2 left-2 rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                      #{partner.displayOrder}
                    </span>
                    <span
                      className={`absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        partner.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          partner.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {partner.status === "published" ? "Live" : "Draft"}
                    </span>
                  </div>

                  {/* Partner Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-navy-950 truncate" title={partner.name}>
                      {partner.name}
                    </h3>
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-teal-700 hover:underline truncate"
                        title={partner.websiteUrl}
                      >
                        <span className="truncate">{partner.websiteUrl.replace(/^https?:\/\//, "")}</span>
                        <MaterialIcon name="open_in_new" className="text-[12px] shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">No link set</span>
                    )}
                  </div>
                </div>

                {/* Bottom: Action Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  {/* Reorder arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => void move(partner.id, -1)}
                      title="Move earlier in ribbon"
                      aria-label={`Move ${partner.name} earlier`}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <MaterialIcon name="arrow_upward" className="text-[16px]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredPartners.length - 1}
                      onClick={() => void move(partner.id, 1)}
                      title="Move later in ribbon"
                      aria-label={`Move ${partner.name} later`}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <MaterialIcon name="arrow_downward" className="text-[16px]" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(partner)}
                      title={partner.status === "published" ? "Unpublish (hide from homepage)" : "Publish (show on homepage)"}
                      aria-label={`Toggle status for ${partner.name}`}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      <MaterialIcon
                        name={partner.status === "published" ? "visibility_off" : "visibility"}
                        className="text-[16px]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDialogState({ open: true, mode: "edit", partner })}
                      title="Edit partner logo"
                      aria-label={`Edit ${partner.name}`}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      <MaterialIcon name="edit" className="text-[16px]" />
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === partner.id}
                      onClick={() => handleDelete(partner)}
                      title="Remove partner logo"
                      aria-label={`Remove ${partner.name}`}
                      className="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                    >
                      <MaterialIcon name="delete" className="text-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {dialogState.open && (
        <PartnerLogoFormDialog
          open={dialogState.open}
          onClose={() => setDialogState({ open: false, mode: "create" })}
          {...(dialogState.mode === "edit"
            ? { mode: "edit", partner: dialogState.partner! }
            : { mode: "create" })}
        />
      )}
    </section>
  );
}
