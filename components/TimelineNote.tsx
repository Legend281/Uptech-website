import { MaterialIcon } from "@/components/icons/MaterialIcon";

type TimelineNoteProps = {
  value: string;
  /** `dark` for the navy result panels (ComplianceRouter); `light` (default) for white/slate cards. */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Renders a pathway's timeline/deadline fact. Text starting with "[PENDING"
 * is unconfirmed data (CLAUDE.md Section 6.4) — real once someone at Uptech
 * Consulting supplies it, but until then it's shown as a muted, dashed badge
 * instead of plain text sitting at the same visual weight as a confirmed
 * fact. A visitor should never read "still being confirmed" as a stated
 * deadline, and the raw "[PENDING: ...]" bracket text should never render
 * as-is — it reads as a broken page, not a compliance safeguard.
 */
export function TimelineNote({ value, variant = "light", className = "" }: TimelineNoteProps) {
  // Some timeline strings carry a prefix before the bracket (e.g. "Typical
  // completion: [PENDING: ...]"), so this checks for the marker anywhere in
  // the string, not just at the start.
  const pending = value.includes("[PENDING");

  if (!pending) {
    return (
      <span className={`text-xs font-mono ${variant === "dark" ? "text-slate-400" : "text-slate-500"} ${className}`}>
        {value}
      </span>
    );
  }

  const shell =
    variant === "dark"
      ? "border-slate-600 bg-white/5 text-slate-300"
      : "border-slate-300 bg-slate-50 text-slate-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-dashed px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${shell} ${className}`}
    >
      <MaterialIcon name="schedule" className="text-[13px]" />
      Timeline to be confirmed
    </span>
  );
}
