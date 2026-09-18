import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

type WhatComesNextProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  /**
   * Default "WHAT COMES NEXT" fits every sibling page, where this card
   * really does point to the next step in a sequence. Override it on a page
   * where the card points sideways instead (e.g. CNPS Compliance — the last
   * stop in its own track — linking to the separate US formation pathway).
   */
  eyebrow?: string;
};

/**
 * Mandatory Template C element per CLAUDE.md Section 4: points to the next
 * page in the compliance sequence — not a generic cross-link grid. Styled as
 * a "chapter divider" (accent spine, oversized faint arrow, a real button
 * rather than a text link) rather than a plain bordered box, since it's the
 * one element every Business Formalisation & Compliance page shares.
 */
export function WhatComesNext({ title, description, href, linkLabel, eyebrow = "WHAT COMES NEXT" }: WhatComesNextProps) {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal effect="rise" className="mb-3 inline-flex items-center gap-2">
          <span className="w-7 h-[2px] bg-teal-500 inline-block" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">{eyebrow}</span>
        </Reveal>
        <Reveal effect="fade" delay={80}>
          <TiltCard max={3} className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all hover:border-teal-500/40 hover:shadow-xl">
            <Link href={href} className="relative flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-8">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-teal-400 to-blue-accent" />
              <MaterialIcon
                name="arrow_forward"
                className="pointer-events-none absolute -right-6 -bottom-8 text-[150px] leading-none text-slate-100 transition-colors group-hover:text-teal-50"
              />

              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-teal-400 transition-transform group-hover:scale-105">
                <MaterialIcon name="arrow_forward" className="text-[24px]" />
              </span>

              <div className="relative z-10 flex-1">
                <h3 className="mb-1.5 text-lg font-bold text-navy-950 transition-colors group-hover:text-blue-accent sm:text-xl">
                  {title}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
              </div>

              <span className="gradient-teal-blue relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-950/20 transition-all group-hover:brightness-105">
                {linkLabel}
                <MaterialIcon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
