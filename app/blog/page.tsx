import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getPublishedBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates, guidance, and perspective from Uptech Consulting on career placement, business formalisation, and compliance across Cameroon and the United States.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Blog" }];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Blog</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              <TextReveal text="Updates, guidance, and perspective." />
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Notes from our team on career placement, business formalisation, and compliance across Cameroon and the United States.
            </p>
          </div>
        </section>

        <section className="bg-slate-50/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <MaterialIcon name="article" className="text-[26px]" />
                </span>
                <h2 className="font-sans text-base font-bold text-navy-950">Nothing published yet</h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  We&apos;re working on our first posts — check back soon, or{" "}
                  <Link href="/contact" className="font-semibold text-blue-accent hover:text-blue-700">
                    get in touch
                  </Link>{" "}
                  in the meantime.
                </p>
              </div>
            ) : (
              <Reveal effect="stagger" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                    <TiltCard max={4} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)]">
                      <div className="relative aspect-[1200/630] w-full bg-slate-100">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-slate-300">
                            <MaterialIcon name="article" className="text-[32px]" />
                          </span>
                        )}
                        {post.category && (
                          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-navy-950/85 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-teal-300 backdrop-blur-md">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h2 className="text-lg font-bold leading-snug text-navy-950 transition-colors group-hover:text-blue-accent">{post.title}</h2>
                        {post.excerpt && <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>}
                        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          {post.authorName} · {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </TiltCard>
                  </Link>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
