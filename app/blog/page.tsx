import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";
import { TextReveal } from "@/components/TextReveal";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { BlogCtaBand } from "@/components/blog/BlogCtaBand";
import { getPublishedBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates, guidance, and perspective from Uptech Consulting on career placement, business formalisation, and compliance across Cameroon and the United States.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
};

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Blog" }];

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        {/* Uptech's real navy/teal brand, but deliberately restrained —
            a quiet, compact band (not the full marketing-hero treatment
            used for the Homepage/Career Marketing) so the page reads as
            editorial rather than a landing page. No Ken Burns zoom, no
            ambient glow, a heavier wash so the photo reads as texture. */}
        <section className="relative overflow-hidden border-b border-slate-800/80 bg-navy-950 py-14 sm:py-16">
          <div className="absolute inset-0 z-0">
            <HeroImageCarousel keys={["compliance-advisory", "team-presenting"]} intervalMs={9000} />
            <div className="absolute inset-0 bg-navy-950/80" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center justify-center gap-2">
              <span className="inline-block h-[2px] w-6 bg-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Uptech Consulting Blog</span>
              <span className="inline-block h-[2px] w-6 bg-teal-400" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              <TextReveal text="Updates, guidance, and perspective." />
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              Notes from our team on career placement, business formalisation, and compliance across Cameroon and the United
              States.
            </p>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="bg-slate-50/70 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-14">
                <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <MaterialIcon name="article" className="text-[28px]" />
                </div>
                <h2 className="mb-2 font-sans text-xl font-bold text-navy-950">Nothing published yet</h2>
                <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-600">
                  We&apos;re working on our first posts — check back soon, or get in touch in the meantime.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <BlogIndexContent posts={posts} />
        )}

        <BlogCtaBand />
      </main>

      <Footer />
    </>
  );
}
