import { MaterialIcon } from "@/components/icons/MaterialIcon";

type PhotoPlaceholderProps = {
  label: string;
  className?: string;
};

/**
 * The Stitch mockups hotlink ephemeral Google-hosted preview images
 * (lh3.googleusercontent.com/aida-...) that aren't licensed or stable enough
 * to ship in the real build. This stands in until real UCO photography is
 * supplied — same placeholder-safe treatment as a `[PENDING]` content tag.
 */
export function PhotoPlaceholder({ label, className = "" }: PhotoPlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 16px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center">
        <MaterialIcon name="image" className="text-slate-500 text-3xl" />
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          [PENDING: {label}]
        </span>
      </div>
    </div>
  );
}
