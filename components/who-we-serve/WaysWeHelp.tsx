"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Check,
  Receipt,
  Rocket,
  Server,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { Way, WayIcon } from "./types";

const icons: Record<WayIcon, LucideIcon> = {
  briefcase: Briefcase,
  receipt: Receipt,
  rocket: Rocket,
  server: Server,
  "shield-check": ShieldCheck,
  users: Users,
};

type WaysWeHelpProps = {
  items: Way[];
  multiNeedMessage: string;
  noDestinationMessage: string;
  ctaLabel: string;
  ctaHref: string;
};

/*
 * The cards are the router. A visitor ticks whatever applies; the panel
 * beneath resolves the selection:
 *
 *   one card, with a page  → a single "Continue" link to that page
 *   one card, no page      → the consultation CTA (the pillar is paused)
 *   two or more            → the multi-need message and the consultation CTA
 *
 * Navigation happens from the panel rather than the instant a card is
 * ticked — jumping on the first click would make a second selection
 * impossible, and the second selection is the whole point of the section.
 *
 * Each card is one toggle button (`aria-pressed`) plus a separate "Learn
 * more" link in its footer, so the two actions never nest.
 */
export function WaysWeHelp({
  items,
  multiNeedMessage,
  noDestinationMessage,
  ctaLabel,
  ctaHref,
}: WaysWeHelpProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const chosen = items.filter((item) => selected.includes(item.key));
  const single = chosen.length === 1 ? chosen[0] : null;
  const multi = chosen.length > 1;

  useEffect(() => {
    if (!multi) return;
    // TODO(analytics): "multi-need message shown" — fire once per page view.
    // Deferred site-wide: no provider is wired up, connect-src 'self' would
    // block one, and the Privacy Policy (CLAUDE.md §7) is not published yet.
  }, [multi]);

  function toggle(key: string) {
    // TODO(analytics): "card selected / deselected" with `key`. See note above.
    setSelected((previous) =>
      previous.includes(key) ? previous.filter((k) => k !== key) : [...previous, key],
    );
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Select everything that applies to you"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {items.map((item) => {
          const isSelected = selected.includes(item.key);
          const Icon = icons[item.icon];

          return (
            <div
              key={item.key}
              className={`card-hover-shadow flex flex-col overflow-hidden rounded-2xl border bg-white transition-colors ${
                isSelected
                  ? "border-teal-500 ring-2 ring-teal-500/25"
                  : "border-slate-200/90"
              }`}
            >
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(item.key)}
                className="flex flex-1 flex-col p-7 text-left"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? "bg-navy-900 text-teal-400" : "bg-slate-100 text-navy-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  {/* The visible checkbox. State is announced by the button's
                      aria-pressed, so this is purely visual. */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      isSelected
                        ? "border-teal-500 bg-teal-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-tight text-navy-950">{item.title}</h3>
                {item.scope && (
                  <p className="mt-2 inline-flex w-fit items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {item.scope}
                  </p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </button>

              <div className="flex items-center justify-between border-t border-slate-200/80 px-7 py-4">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-accent hover:text-blue-700"
                  >
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </Link>
                ) : (
                  <span className="text-xs font-semibold leading-snug text-slate-500">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Outcome of the selection. Live so a screen-reader user hears the
          route resolve without hunting for it. */}
      <div aria-live="polite" className="mt-8">
        {chosen.length === 0 && (
          <p className="text-sm text-slate-500">
            Tick one, or all of them — the next step depends on what you select.
          </p>
        )}

        {single && single.href && (
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/90 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="text-base text-slate-700">
              One thing: <span className="font-bold text-navy-950">{single.title}</span>. That has
              its own page, with the full process on it.
            </p>
            <Link
              href={single.href}
              className="gradient-teal-blue inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/30 transition-all hover:brightness-105 active:scale-[0.98]"
            >
              Continue to {single.title}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        )}

        {single && !single.href && (
          <ConsultationPanel message={noDestinationMessage} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        )}

        {multi && (
          <ConsultationPanel message={multiNeedMessage} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        )}
      </div>
    </div>
  );
}

function ConsultationPanel({
  message,
  ctaLabel,
  ctaHref,
}: {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-teal-400/30 bg-navy-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <p className="max-w-xl text-base leading-relaxed text-slate-200">{message}</p>
      {/* TODO(analytics): "consultation CTA clicked" from the router panel. Deferred — see top of file. */}
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-shrink-0 items-center justify-center gap-2.5 rounded-lg bg-uco-green px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-uco-green-hover active:scale-[0.98]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        {ctaLabel}
      </a>
    </div>
  );
}
