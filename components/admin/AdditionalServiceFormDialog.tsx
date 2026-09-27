"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { useAdditionalServiceActions } from "@/components/admin/providers/AdditionalServicesProvider";
import { publicPhotoUrl, uploadDataUrl } from "@/lib/supabase/client";
import { resizeImageToDataUrl, SERVICE_CARD_SIZE } from "@/lib/admin/resizeImage";
import { ServiceCard } from "@/components/ServiceCard";
import type { AdditionalService } from "@/lib/admin/types";

const inputClasses =
  "rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
const labelClasses = "text-xs font-bold uppercase tracking-wider text-slate-500";

type Props = { open: boolean; onClose: () => void } & ({ mode: "create" } | { mode: "edit"; service: AdditionalService });

/**
 * The 5 current, real services stay exactly as hardcoded on the Homepage
 * and /services — this only ever adds MORE, appended after them, using the
 * identical card design (app/services/page.tsx reads published rows from
 * this table directly). New services start as Draft; publishing is a
 * separate, explicit action (see AdditionalServiceRowActions), same as Job
 * Postings.
 */
export function AdditionalServiceFormDialog(props: Props) {
  const { open, onClose } = props;
  const { addService, editService } = useAdditionalServiceActions();
  const currentUser = useCurrentUser();
  const logActivity = useLogActivity();
  const formId = useId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [flag, setFlag] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [existingPhotoPath, setExistingPhotoPath] = useState<string | undefined>(undefined);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewUrl = photoDataUrl ?? (existingPhotoPath ? publicPhotoUrl("service-photos", existingPhotoPath) : undefined);
  const canSubmit = title.trim() !== "" && description.trim() !== "" && (Boolean(photoDataUrl) || Boolean(existingPhotoPath));

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      const { service } = props;
      setTitle(service.title);
      setDescription(service.description);
      setHref(service.href ?? "");
      setFlag(service.flag ?? "");
      setExistingPhotoPath(service.photoPath);
      setPhotoDataUrl(undefined);
    } else {
      setTitle("");
      setDescription("");
      setHref("");
      setFlag("");
      setExistingPhotoPath(undefined);
      setPhotoDataUrl(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setPhotoBusy(true);
    try {
      setPhotoDataUrl(await resizeImageToDataUrl(file, SERVICE_CARD_SIZE));
    } catch (error) {
      toast.error("Couldn't use that photo", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      const photoPath = photoDataUrl ? await uploadDataUrl("service-photos", photoDataUrl, "services") : (existingPhotoPath as string);
      const fields = { title: title.trim(), description: description.trim(), href: href.trim() || undefined, flag: flag.trim() || undefined, photoPath };

      if (props.mode === "edit") {
        editService(props.service.id, fields);
        logActivity({ icon: "edit_note", description: `${currentUser.name} updated the ${fields.title} service`, relatedHref: "/admin/additional-services" });
        toast.success("Service updated");
      } else {
        const created = await addService(fields, currentUser.id);
        logActivity({ icon: "person_add", description: `${currentUser.name} drafted a new service: ${created.title}`, relatedHref: "/admin/additional-services" });
        toast.success("Draft created", { description: "Publish it from the list once it's ready." });
      }
      onClose();
    } catch (error) {
      toast.error("Couldn't save this service", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const isEdit = props.mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={`${formId}-title`} className="font-sans text-base font-bold text-navy-950">
            {isEdit ? "Edit Service" : "Add a Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:overflow-hidden">
        <form id={formId} onSubmit={handleSubmit} className="min-h-0 overflow-y-auto px-5 py-5 lg:flex-1">
          {!isEdit && (
            <p className="mb-4 text-xs text-slate-500">
              Saves as a Draft — appears on the Homepage and /services, after the 5 core services, only once you
              explicitly Publish it.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Service Title <span className="text-rose-500">*</span>
              </span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} placeholder="e.g. Payroll Management" />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Description <span className="text-rose-500">*</span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className={`${inputClasses} resize-none leading-relaxed`}
                placeholder="One or two sentences — what this service actually does."
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Link to its page (optional)</span>
              <input type="text" value={href} onChange={(e) => setHref(e.target.value)} className={inputClasses} placeholder="/services/..." />
              <span className="text-xs text-slate-400">Leave blank if there&apos;s no dedicated page yet — the card links to Contact instead.</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClasses}>Flag emoji (optional)</span>
              <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} className={inputClasses} placeholder="e.g. 🇨🇲" maxLength={8} />
            </label>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={labelClasses}>
                Photo <span className="text-rose-500">*</span>
              </span>
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="" className="h-16 w-20 rounded-md object-cover" />
                ) : (
                  <span className="flex h-16 w-20 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                    <MaterialIcon name="image" className="text-[22px]" />
                  </span>
                )}
                <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                  {photoBusy ? "Resizing…" : previewUrl ? "Replace photo" : "Add photo"}
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
              </div>
              <span className="text-xs text-slate-400">A real photo of the service/work, matching the other 5 cards — no stock filler.</span>
            </div>
          </div>
        </form>

        <aside className="space-y-2 border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <span className={labelClasses}>Live Preview</span>
          <p className="text-xs text-slate-400">Exactly how this appears on the Homepage and /services once published.</p>
          <div className="group mx-auto mt-3 max-w-[240px]">
            <ServiceCard title={title} description={description} href={href.trim() || undefined} flag={flag.trim() || undefined} photoUrl={previewUrl} />
          </div>
        </aside>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={!canSubmit || saving}
            className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
