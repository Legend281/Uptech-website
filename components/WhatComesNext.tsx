import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

type WhatComesNextProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

/**
 * Mandatory Template C element per CLAUDE.md Section 4: points to the next
 * page in the compliance sequence — not a generic cross-link grid.
 */
export function WhatComesNext({ title, description, href, linkLabel }: WhatComesNextProps) {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-7 h-[2px] bg-teal-500 inline-block" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">WHAT COMES NEXT</span>
        </div>
        <Link
          href={href}
          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-navy-950 group-hover:text-blue-accent transition-colors mb-1.5">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{description}</p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-blue-accent group-hover:text-teal-600">
            {linkLabel}
            <MaterialIcon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
}
