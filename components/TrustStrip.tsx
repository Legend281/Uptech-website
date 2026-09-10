import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type TrustStripItem = {
  icon: string;
  title: string;
  badgeText: string;
  badgeAccent: "teal" | "sky" | "emerald";
  /** Omitted on the homepage strip, where each item is a single hard fact. */
  description?: string;
};

type TrustStripVariant = "dark" | "light";

const accentClasses: Record<
  TrustStripItem["badgeAccent"],
  { glow: string; icon: string; dot: string; text: string; lightText: string }
> = {
  teal: {
    glow: "from-teal-500/15",
    icon: "text-teal-400",
    dot: "bg-teal-400",
    text: "text-teal-300",
    lightText: "text-slate-500",
  },
  sky: {
    glow: "from-sky-500/15",
    icon: "text-sky-400",
    dot: "bg-blue-accent",
    text: "text-sky-300",
    lightText: "text-slate-500",
  },
  emerald: {
    glow: "from-emerald-500/15",
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    lightText: "text-slate-500",
  },
};

const columnClasses: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * The "docked" trust bar that overlaps the hero. `dark` is the service-page
 * treatment; `light` is the homepage treatment, where the strip sits against a
 * pale section and carries jurisdiction facts rather than service claims.
 */
export function TrustStrip({
  items,
  variant = "dark",
}: {
  items: TrustStripItem[];
  variant?: TrustStripVariant;
}) {
  const isLight = variant === "light";
  const columns = columnClasses[items.length] ?? "sm:grid-cols-3";

  const shell = isLight
    ? "bg-white/95 border-slate-200/90 divide-slate-100 shadow-[0_20px_50px_rgba(8,17,32,0.12),0_1px_3px_rgba(0,0,0,0.05)]"
    : "bg-navy-900/95 border-slate-800 divide-slate-800/90 text-white shadow-[0_20px_50px_rgba(7,14,27,0.4),0_1px_3px_rgba(0,0,0,0.2)]";

  return (
    <div className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:-mt-14 lg:px-8">
      <div
        className={`grid grid-cols-1 overflow-hidden rounded-2xl border divide-y backdrop-blur-xl sm:divide-y-0 sm:divide-x ${columns} ${shell}`}
      >
        {items.map((item) => {
          const accent = accentClasses[item.badgeAccent];
          return (
            <div
              key={item.title}
              className={`flex items-center gap-4 p-6 transition-colors ${
                isLight ? "hover:bg-slate-50/60" : "hover:bg-navy-850/60"
              }`}
            >
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700/60 bg-navy-950 shadow-md">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accent.glow} to-transparent`}
                />
                <MaterialIcon
                  name={item.icon}
                  className={`relative z-10 ${accent.icon}`}
                />
              </div>
              <div>
                {/* Service pages use these as landmark headings; on the homepage
                    they are supporting facts under the hero's own h1. */}
                {isLight ? (
                  <p className="text-sm font-bold leading-snug text-navy-950">
                    {item.title}
                  </p>
                ) : (
                  <h2 className="text-sm font-bold leading-snug text-white">
                    {item.title}
                  </h2>
                )}
                <p
                  className={`mt-0.5 flex items-center gap-1.5 text-xs font-medium ${
                    isLight ? accent.lightText : accent.text
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                  {item.badgeText}
                </p>
                {item.description && (
                  <p
                    className={`mt-1 text-[11px] leading-snug ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
