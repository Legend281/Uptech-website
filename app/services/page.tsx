import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Services",
  description: "Everything Uptech Consulting offers — for careers and for business.",
};

export default function ServicesHubPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <main>
        <section className="py-24 sm:py-32 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Services Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-3">
              This page is coming soon.
            </h1>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              A complete, organized directory of everything Uptech Consulting offers is being
              built here. In the meantime, use the Services menu above to reach any individual
              page directly.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
