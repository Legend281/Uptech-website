import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";
import { Reveal } from "@/components/Reveal";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogCtaBand } from "@/components/blog/BlogCtaBand";
import { BlogShareRow } from "@/components/blog/BlogShareRow";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blog";
import { sanitizeBlogHtml } from "@/lib/sanitizeHtml";
import { initialsOf, avatarTint } from "@/lib/admin/avatar";

const WORDS_PER_MINUTE = 200;

/** Derived from the real content length, never a fabricated figure. */
function readingTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const revalidate = 60;

/*
 * `output: export` (the GitHub Pages preview build) refuses a dynamic
 * route with no generateStaticParams at all, and also refuses a genuinely
 * empty array from it (tested directly on /admin/leads/[id], same
 * situation) — so this returns one placeholder that resolves to notFound()
 * below, exactly like that route does. On the real Hostinger server
 * (not a static export), dynamicParams defaults to true, so every other
 * real slug still renders normally, fetched live — this placeholder only
 * satisfies the static-export build, it doesn't limit what's servable.
 */
export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  // Up to 3 other posts — same category first (genuinely "related", not
  // just "recent"), topped up with the next most recent posts if the
  // category doesn't have enough on its own. A reader who finishes an
  // article should land on something relevant, not just whatever's newest.
  const allOtherPosts = (await getPublishedBlogPosts()).filter((p) => p.slug !== post.slug);
  const sameCategory = allOtherPosts.filter((p) => p.category && p.category === post.category);
  const otherCategory = allOtherPosts.filter((p) => !p.category || p.category !== post.category);
  const otherPosts = [...sameCategory, ...otherCategory].slice(0, 3);
  const minutes = readingTimeMinutes(post.content);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }];

  function Byline({ authorName, publishedAt, tone }: { authorName: string; publishedAt: string; tone: "light" | "dark" }) {
    const dark = tone === "dark";
    return (
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            dark ? "bg-white/10 text-white ring-1 ring-white/20" : avatarTint(authorName)
          }`}
        >
          {initialsOf(authorName)}
        </span>
        <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-500"}`}>
          <span className={`font-semibold ${dark ? "text-white" : "text-navy-950"}`}>{authorName}</span>
          <span className="mx-1.5">·</span>
          {formatDate(publishedAt)}
          <span className="mx-1.5">·</span>
          {minutes} min read
        </p>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={blogPostingJsonLd(post)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        <article className="bg-white">
          {post.coverImage ? (
            // Same full-bleed photo/gradient/ambient-glow hero construction
            // as every other page on the site (Homepage, Career Marketing) —
            // a generously-padded section with the image as an absolute
            // background, not a thin cropped aspect-ratio strip.
            <section className="relative overflow-hidden border-b border-slate-800/80 bg-navy-950 pb-16 pt-14 lg:pb-20 lg:pt-20">
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt="" className="hero-ken-burns absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/65 to-navy-950/45" />
              </div>
              <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
                <div className="float-a absolute -left-16 top-0 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
                <div className="float-b absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
              </div>

              <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {post.category && (
                  <span className="mb-4 inline-block rounded-full border border-white/15 bg-navy-950/60 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-teal-300 backdrop-blur-md">
                    {post.category}
                  </span>
                )}
                <h1 className="mb-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
                <Byline authorName={post.authorName} publishedAt={post.publishedAt} tone="dark" />
              </div>
            </section>
          ) : (
            <header className="border-b border-slate-200/80 py-14 sm:py-16">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {post.category && (
                  <span className="mb-3 inline-block rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-teal-700">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-950 sm:text-4xl lg:text-5xl">{post.title}</h1>
                <div className="mt-5">
                  <Byline authorName={post.authorName} publishedAt={post.publishedAt} tone="light" />
                </div>
              </div>
            </header>
          )}

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-10 flex items-center justify-between gap-4">
              <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-accent">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
                Back to Blog
              </Link>
              <BlogShareRow url={postUrl} title={post.title} />
            </div>

            {post.excerpt && <p className="mb-8 text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">{post.excerpt}</p>}

            <div className="prose prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />

            {post.authorBio && (
              <div className="mt-12 flex gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarTint(post.authorName)}`}>
                  {initialsOf(post.authorName)}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">About the author</p>
                  <p className="mt-1 font-sans text-sm font-bold text-navy-950">{post.authorName}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{post.authorBio}</p>
                </div>
              </div>
            )}
          </div>
        </article>

        {otherPosts.length > 0 && (
          <section className="border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-10 text-xl font-bold tracking-tight text-navy-950">More from the blog</h2>
              <Reveal effect="stagger" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {otherPosts.map((p) => (
                  <BlogPostCard key={p.id} post={p} />
                ))}
              </Reveal>
            </div>
          </section>
        )}

        <BlogCtaBand />
      </main>

      <Footer />
    </>
  );
}
