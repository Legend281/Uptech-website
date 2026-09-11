import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, User } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Who We Serve",
  description:
    "Uptech Consulting works with individuals building IT careers or personal ventures, and with businesses and institutions that need technology run and compliance kept — in Cameroon and the United States.",
};

/*
 * Deliberately minimal. This route exists so the "Who We Serve" breadcrumb on
 * the two persona pages resolves to a real page instead of a 404; it will be
 * expanded into a proper hub later. Two doors, nothing else.
 */
const audiences = [
  {
    href: "/who-we-serve/individuals",
    icon: User,
    label: "For Individuals",
    body: "IT professionals looking for the next role, income to declare in Cameroon, or a business of your own to register.",
    dot: "bg-teal-400",
  },
  {
    href: "/who-we-serve/businesses",
    icon: Building2,
    label: "For Businesses & Institutions",
    body: "Technology that needs running, a company to register or keep compliant, or a function you'd rather not staff in-house.",
    dot: "bg-blue-400",
  },
];

export default function WhoWeServePage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Who We Serve" }]} />

      <main className="bg-slate-100/70">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2">
              <span className="inline-block h-[2px] w-7 bg-teal-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Who We Serve
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-navy-950 sm:text-5xl">
              Which of these is you?
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Two audiences, two different sets of questions. Pick the one that
              fits and the next page is built around your situation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <Link
                  key={audience.href}
                  href={audience.href}
                  className="card-hover-shadow group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-8 transition-colors hover:border-slate-300"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-teal-400">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className={`h-2 w-2 rounded-full ${audience.dot}`} />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy-950 transition-colors group-hover:text-blue-accent">
                    {audience.label}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {audience.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-accent">
                    Continue
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
