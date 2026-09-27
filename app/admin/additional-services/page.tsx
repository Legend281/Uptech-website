"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdditionalServiceFormDialog } from "@/components/admin/AdditionalServiceFormDialog";
import { AdditionalServiceRowActions } from "@/components/admin/AdditionalServiceRowActions";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { useAdditionalServices, useAdditionalServiceActions } from "@/components/admin/providers/AdditionalServicesProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { canManageContent } from "@/lib/admin/permissions";
import { publicPhotoUrl } from "@/lib/supabase/client";
import type { AdditionalService } from "@/lib/admin/types";

const CARD_ELEVATION = "shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const statusMeta = {
  draft: { label: "Draft", badge: "border-slate-200 bg-slate-50 text-slate-600" },
  published: { label: "Published", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
};

function ServiceRow({
  service,
  onEdit,
  onDelete,
}: {
  service: AdditionalService;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = statusMeta[service.status];
  const photoUrl = publicPhotoUrl("service-photos", service.photoPath);

  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0 sm:px-5">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="h-14 w-[70px] shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="flex h-14 w-[70px] shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          <MaterialIcon name="image" className="text-[20px]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {service.flag && <span aria-hidden="true">{service.flag}</span>}
          <p className="truncate font-sans text-sm font-semibold text-navy-950">{service.title}</p>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{service.description}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`shrink-0 truncate rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
          {service.href ? (
            <span className="truncate text-xs text-slate-400">{service.href}</span>
          ) : (
            <span className="truncate text-xs text-slate-400">No page yet — links to Contact</span>
          )}
        </div>
      </div>
      <AdditionalServiceRowActions service={service} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export default function AdditionalServicesPage() {
  const services = useAdditionalServices();
  const { deleteService } = useAdditionalServiceActions();
  const currentUser = useCurrentUser();
  const canManage = canManageContent(currentUser);
  const logActivity = useLogActivity();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | null>(null);
  const [deletingService, setDeletingService] = useState<AdditionalService | null>(null);

  const publishedCount = services.filter((s) => s.status === "published").length;
  const ordered = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-sans text-xl font-bold text-navy-950">Additional Services</h1>
            <p className="mt-1 text-sm text-slate-500">
              <AnimatedNumber value={services.length} /> total
              {publishedCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-emerald-700">
                    <AnimatedNumber value={publishedCount} /> published
                  </span>
                </>
              )}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">
              The 5 core services stay exactly as they are on the Homepage and /services. Anything added here appears
              after them, in the same design, once published.
            </p>
          </div>
          {canManage && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Add a Service
            </motion.button>
          )}
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_ELEVATION}`}>
          {ordered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-slate-500">
              <MaterialIcon name="storefront" className="text-[32px] text-slate-300" />
              <p>No additional services yet — the 5 core ones keep showing exactly as they do today.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {ordered.map((service) => (
                <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <ServiceRow service={service} onEdit={() => setEditingService(service)} onDelete={() => setDeletingService(service)} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.section>
      </motion.div>

      <AdditionalServiceFormDialog open={createOpen} onClose={() => setCreateOpen(false)} mode="create" />
      {editingService && (
        <AdditionalServiceFormDialog open={Boolean(editingService)} onClose={() => setEditingService(null)} mode="edit" service={editingService} />
      )}

      <ConfirmDialog
        open={deletingService !== null}
        title="Delete this service?"
        description={deletingService ? `"${deletingService.title}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Service"
        onCancel={() => setDeletingService(null)}
        onConfirm={() => {
          if (!deletingService) return;
          deleteService(deletingService.id);
          logActivity({ icon: "delete", description: `${currentUser.name} deleted the ${deletingService.title} service` });
          toast.success("Service deleted");
          setDeletingService(null);
        }}
      />
    </>
  );
}
