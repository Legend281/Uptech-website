import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Right-aligned status tag, e.g. "SUB-SERVICE 01/05 • RCCM & OHADA UNIFORM ACT". No pillar numbers — see the IT Consulting page. */
  tag?: string;
};

export function Breadcrumb({ items, tag }: BreadcrumbProps) {
  // Middle steps (everything between Home and the current page) collapse
  // into a single "…" below the sm breakpoint. A full 4-level trail with a
  // long label ("Business Formalisation & Compliance") has no room on a
  // ~390px screen — it used to wrap mid-label into a ragged multi-line
  // stack instead of staying a clean single-line trail.
  const first = items[0];
  const middle = items.slice(1, -1);
  const last = items.length > 1 ? items[items.length - 1] : undefined;

  return (
    <section className="w-full bg-[#081120] border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400 font-medium min-w-0">
          {first && (
            <span className="flex items-center gap-2 shrink-0">
              {first.href && last ? (
                <Link href={first.href} className="hover:text-teal-400 transition-colors">
                  {first.label}
                </Link>
              ) : (
                <span className={!last ? "text-white font-semibold" : ""}>{first.label}</span>
              )}
              {last && <span className="text-slate-600">/</span>}
            </span>
          )}

          {middle.length > 0 && (
            <span className="sm:hidden flex items-center gap-2 shrink-0 text-slate-600" aria-hidden="true">
              <span>…</span>
              <span>/</span>
            </span>
          )}

          {middle.map((item) => (
            <span key={item.label} className="hidden sm:flex items-center gap-2 shrink-0">
              {item.href ? (
                <Link href={item.href} className="hover:text-teal-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              <span className="text-slate-600">/</span>
            </span>
          ))}

          {last && (
            <span className="min-w-0">
              <span className="block truncate text-white font-semibold">{last.label}</span>
            </span>
          )}
        </nav>
        {tag && (
          <div className="w-full sm:w-auto inline-flex items-center gap-2 bg-white/[0.05] border border-slate-700/60 px-3 py-1 rounded-full text-slate-300 font-mono text-[11px] shrink-0 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <span className="text-slate-400 truncate">{tag}</span>
          </div>
        )}
      </div>
    </section>
  );
}
