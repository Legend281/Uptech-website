import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type TestimonialCardProps = {
  quote: string;
  displayName: string;
  roleTitle?: string;
  company?: string;
  outcomeLine?: string;
  /** Already small (resized to ≤320px on upload), so it skips next/image on purpose — see below. */
  photoUrl?: string;
  /** "dark" sits on the navy Career Marketing section; "light" on white sections like the Homepage. */
  tone?: "dark" | "light";
};

/*
 * The one testimonial card, shared by the public site and the admin
 * preview (Admin_Content_Pages_Spec.md 1.4) — so what staff preview is
 * exactly what visitors see. The dark tone reproduces the card the Career
 * Marketing page shipped with.
 */
export function TestimonialCard({
  quote,
  displayName,
  roleTitle,
  company,
  outcomeLine,
  photoUrl,
  tone = "dark",
}: TestimonialCardProps) {
  const dark = tone === "dark";
  const subline = [roleTitle, company].filter(Boolean).join(" · ");

  return (
    <figure
      className={`rounded-2xl border p-8 ${
        dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200/80 bg-slate-50 shadow-sm"
      }`}
    >
      <MaterialIcon name="format_quote" className={`mb-3 text-[32px] ${dark ? "text-teal-400" : "text-teal-500"}`} />
      <blockquote className={`mb-5 whitespace-pre-line text-lg leading-relaxed ${dark ? "text-white" : "text-navy-950"}`}>
        {quote}
      </blockquote>
      {outcomeLine && (
        <p
          className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            dark ? "border-teal-400/30 bg-teal-400/10 text-teal-300" : "border-teal-200 bg-teal-50 text-teal-700"
          }`}
        >
          <MaterialIcon name="check_circle" className="text-[14px]" />
          {outcomeLine}
        </p>
      )}
      <figcaption className="flex items-center gap-3">
        {photoUrl && (
          // A plain <img>: the file is already resized to a tiny avatar on
          // upload, so the optimizer has nothing to add — and it would need
          // remotePatterns plus a GitHub Pages loader special case to reach
          // Supabase Storage at all.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        )}
        <span className="min-w-0">
          <span className={`block text-sm font-semibold ${dark ? "text-slate-300" : "text-navy-950"}`}>{displayName}</span>
          {subline && <span className={`block text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{subline}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
