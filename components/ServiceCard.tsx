import { TiltCard } from "@/components/TiltCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type ServiceCardProps = {
  title: string;
  description: string;
  /** A dedicated page for this service, if one exists — undefined shows "Get in touch" instead of "Explore," matching the fallback the public page links to Contact with. */
  href?: string;
  flag?: string;
  /** A real, already-resolved image URL (public Storage URL on the live site, or a local data: URL while previewing an unsaved photo in the admin dialog) — never a local ImageKey, which the 5 core hardcoded services use instead (see app/services/page.tsx). */
  photoUrl?: string;
};

/**
 * The exact card design the 5 core services already use on /services,
 * extracted so an admin-added service (app/services/page.tsx) and its
 * admin-dialog live preview (AdditionalServiceFormDialog.tsx) render from
 * one shared component — never two hand-kept copies that can drift.
 * Caller decides whether to wrap this in a real <Link> (the public page
 * does; the admin preview doesn't, since it isn't going anywhere).
 */
export function ServiceCard({ title, description, href, flag, photoUrl }: ServiceCardProps) {
  return (
    <>
      <TiltCard max={5} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-slate-300">
            <MaterialIcon name="image" className="text-[32px]" />
          </span>
        )}
      </TiltCard>
      <div className="relative -mt-10 mx-4 rounded-xl bg-white p-6 shadow-xl transition-shadow group-hover:shadow-2xl">
        <h3 className="mb-2 flex items-start gap-2 break-words text-lg font-bold leading-snug text-navy-950">
          {flag && (
            <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
              {flag}
            </span>
          )}
          <span className="min-w-0">{title || "Service title"}</span>
        </h3>
        <p className="mb-4 break-words text-sm leading-relaxed text-slate-600">{description || "A short description of what this service actually does."}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2">
          {href ? "Explore" : "Get in touch"}
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </span>
      </div>
    </>
  );
}
