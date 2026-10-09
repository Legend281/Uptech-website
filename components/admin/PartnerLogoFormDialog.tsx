"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { resizeLogoToDataUrl } from "@/lib/admin/resizeImage";
import { publicPhotoUrl } from "@/lib/supabase/client";
import { usePartnerLogoActions } from "@/components/admin/providers/PartnerLogosProvider";
import type { PartnerLogo, PartnerStatus } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

type Props = {
  open: boolean;
  onClose: () => void;
} & ({ mode: "create" } | { mode: "edit"; partner: PartnerLogo });

export function PartnerLogoFormDialog(props: Props) {
  const { open, onClose } = props;
  const { addPartner, editPartner } = usePartnerLogoActions();
  const formId = useId();

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [existingLogoPath, setExistingLogoPath] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<PartnerStatus>("published");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [busyPhoto, setBusyPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize fields on open
  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      const { partner } = props;
      setName(partner.name);
      setWebsiteUrl(partner.websiteUrl ?? "");
      setStatus(partner.status);
      setDisplayOrder(partner.displayOrder);
      setExistingLogoPath(partner.logoUrl);
      setLogoDataUrl(undefined);
      setCustomLogoUrl("");
      setUseCustomUrl(false);
    } else {
      setName("");
      setWebsiteUrl("");
      setStatus("published");
      setDisplayOrder(0);
      setExistingLogoPath(undefined);
      setLogoDataUrl(undefined);
      setCustomLogoUrl("");
      setUseCustomUrl(false);
    }
  }, [open, props]);

  // Handle ESC key
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const currentPreviewUrl = useCustomUrl
    ? customLogoUrl.trim() || undefined
    : logoDataUrl ?? (existingLogoPath ? publicPhotoUrl("partner-logos", existingLogoPath) : undefined);

  const canSubmit = name.trim() !== "" && Boolean(currentPreviewUrl);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusyPhoto(true);
    try {
      const dataUrl = await resizeLogoToDataUrl(file);
      setLogoDataUrl(dataUrl);
      setUseCustomUrl(false);
    } catch (err) {
      toast.error("Couldn't process image", {
        description: err instanceof Error ? err.message : "Please check the file format.",
      });
    } finally {
      setBusyPhoto(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || saving) return;

    if (websiteUrl.trim() && !websiteUrl.trim().startsWith("http://") && !websiteUrl.trim().startsWith("https://")) {
      toast.error("Website URL must start with http:// or https://");
      return;
    }

    setSaving(true);
    const finalLogoUrl = useCustomUrl
      ? customLogoUrl.trim()
      : logoDataUrl ?? (existingLogoPath as string);

    try {
      if (props.mode === "edit") {
        await editPartner(props.partner.id, {
          name: name.trim(),
          logoUrl: finalLogoUrl,
          websiteUrl: websiteUrl.trim() || undefined,
          displayOrder: displayOrder || props.partner.displayOrder,
          status,
        });
        toast.success(`Partner "${name.trim()}" updated`);
      } else {
        await addPartner({
          name: name.trim(),
          logoUrl: finalLogoUrl,
          websiteUrl: websiteUrl.trim() || undefined,
          displayOrder: displayOrder > 0 ? displayOrder : undefined,
          status,
        });
        toast.success(`Partner "${name.trim()}" added to marquee`);
      }
      onClose();
    } catch (err) {
      toast.error("Failed to save partner logo", {
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <MaterialIcon name="handshake" className="text-[22px]" />
            </div>
            <div>
              <h2 id="partner-dialog-title" className="text-base font-bold text-navy-950">
                {props.mode === "edit" ? "Edit Partner Logo" : "Add Partner Logo"}
              </h2>
              <p className="text-xs text-slate-500">
                This logo will appear in the &ldquo;Our Partners&rdquo; scrolling ribbon on the public homepage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form id={formId} onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Partner Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-name" className={labelClasses}>
              Partner / Brand Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="partner-name"
              type="text"
              required
              placeholder="e.g. Capital One, Accenture, Google Cloud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Website URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-website" className={labelClasses}>
              Website URL <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="partner-website"
              type="url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className={inputClasses}
            />
            <p className="text-[11px] text-slate-400">
              When provided, visitors clicking the logo on the homepage will be directed to this link.
            </p>
          </div>

          {/* Logo Upload & Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={labelClasses}>
                Logo Image <span className="text-rose-500">*</span>
              </span>
              <button
                type="button"
                onClick={() => setUseCustomUrl(!useCustomUrl)}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                {useCustomUrl ? "Upload image file instead" : "Use existing URL / path instead"}
              </button>
            </div>

            {useCustomUrl ? (
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. /images/s1.webp or https://example.com/logo.png"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  className={inputClasses}
                />
                <p className="text-[11px] text-slate-400">
                  Enter a path in /public or an external HTTPS image URL.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-teal-400">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <MaterialIcon name="cloud_upload" className="text-[28px] text-slate-400" />
                  <div className="flex flex-col sm:flex-row items-center gap-1 text-xs text-slate-600">
                    <label
                      htmlFor="partner-logo-file"
                      className="cursor-pointer font-bold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      Click to choose image
                    </label>
                    <span>or drag & drop here</span>
                  </div>
                  <input
                    id="partner-logo-file"
                    type="file"
                    accept="image/png,image/webp,image/svg+xml,image/jpeg"
                    disabled={busyPhoto}
                    onChange={(e) => void handleFile(e.target.files?.[0])}
                    className="sr-only"
                  />
                  <p className="text-[11px] text-slate-400">
                    PNG, WebP, SVG, or JPG. Transparent backgrounds are preserved.
                  </p>
                  {busyPhoto && (
                    <span className="flex items-center gap-1.5 text-xs text-teal-700">
                      <MaterialIcon name="progress_activity" className="animate-spin text-[16px]" />
                      Processing image…
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Live Logo Preview Box */}
            {currentPreviewUrl && (
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-100/70 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Marquee Preview
                  </span>
                  <span className="text-[10px] text-slate-400">Neutral background</span>
                </div>
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-white p-3 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPreviewUrl}
                    alt={name || "Preview"}
                    className="max-h-12 max-w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="partner-status" className={labelClasses}>
                Status
              </label>
              <select
                id="partner-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PartnerStatus)}
                className={inputClasses}
              >
                <option value="published">Published (Visible on site)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="partner-order" className={labelClasses}>
                Display Order
              </label>
              <input
                id="partner-order"
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-teal-700 disabled:opacity-50"
            >
              {saving && <MaterialIcon name="progress_activity" className="animate-spin text-[16px]" />}
              {props.mode === "edit" ? "Save Changes" : "Add Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
