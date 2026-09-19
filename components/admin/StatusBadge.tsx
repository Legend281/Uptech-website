export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

/*
 * Same accent-map pattern as components/TrustStrip.tsx's badgeAccent — the
 * closest existing precedent for a colored-status-chip in this codebase.
 * `uco-green` stays reserved for WhatsApp per the sitewide convention, so
 * "success" uses Tailwind's default emerald instead.
 */
const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-sky-50 text-sky-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
