import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Right-aligned pillar/status tag, e.g. "PILLAR 04 / 05 • INDIVIDUAL CAREER ADVANCEMENT". */
  tag?: string;
};

export function Breadcrumb({ items, tag }: BreadcrumbProps) {
  return (
    <section className="w-full bg-[#081120] border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400 font-medium">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={item.label} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-teal-400 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white font-semibold" : ""}>{item.label}</span>
                )}
                {!isLast && <span className="text-slate-600">/</span>}
              </span>
            );
          })}
        </nav>
        {tag && (
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-slate-700/60 px-3 py-1 rounded-full text-slate-300 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-slate-400">{tag}</span>
          </div>
        )}
      </div>
    </section>
  );
}
