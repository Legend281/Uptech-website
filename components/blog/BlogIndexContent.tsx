"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/Reveal";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CategoryTag } from "@/components/blog/CategoryTag";
import type { PublicBlogPost } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/*
 * Category filtering is client-side, not a ?category= query param: with the
 * small number of posts a new blog actually has, a full navigation per
 * click would be slower and noisier than just re-filtering an array already
 * sitting in memory. Revisit with real server-side pagination once the post
 * count genuinely justifies it.
 */
export function BlogIndexContent({ posts }: { posts: PublicBlogPost[] }) {
  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))), [posts]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;
  // A manually-featured post wins if one exists in this (possibly
  // category-filtered) set; otherwise the most recent post fills the slot,
  // same as before "Featured" existed.
  const featuredIndex = filtered.findIndex((p) => p.isFeatured);
  const featured = featuredIndex === -1 ? filtered[0] : filtered[featuredIndex];
  const rest = featuredIndex === -1 ? filtered.slice(1) : [...filtered.slice(0, featuredIndex), ...filtered.slice(featuredIndex + 1)];

  return (
    <>
      {categories.length > 1 && (
        <section className="border-b border-slate-200/80 bg-white py-4">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 sm:px-6 lg:px-8" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                activeCategory === null ? "border-teal-500 text-navy-950" : "border-transparent text-slate-400 hover:text-navy-950"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                  activeCategory === category ? "border-teal-500 text-navy-950" : "border-transparent text-slate-400 hover:text-navy-950"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </section>
      )}

      {filtered.length === 0 ? (
        <section className="bg-slate-50/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">Nothing in this category yet.</div>
        </section>
      ) : (
        <>
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal effect="rise" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="relative lg:col-span-7">
                  <Link href={`/blog/${featured.slug}`} className="group block">
                    <TiltCard max={4} className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xl">
                      <div className="relative aspect-[1200/720] w-full">
                        {featured.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={featured.coverImage}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-slate-300">
                            <MaterialIcon name="article" className="text-[48px]" />
                          </span>
                        )}
                        {featured.category && <CategoryTag category={featured.category} />}
                      </div>
                    </TiltCard>
                  </Link>
                  {/* The reference's circular "Read the Latest" badge, in Uptech's own navy/teal rather than a copied style. Says "Featured" rather than "Latest" since staff can pin an older post here on purpose. */}
                  <div className="absolute -bottom-5 -right-5 z-10 flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-4 border-white bg-navy-950 text-center shadow-lg">
                    <span className="text-[8.5px] font-bold uppercase leading-tight tracking-wider text-teal-300">
                      Featured
                      <br />
                      Post
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-3xl">
                    <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-blue-accent">
                      {featured.title}
                    </Link>
                  </h2>
                  {featured.excerpt && <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{featured.excerpt}</p>}
                  <p className="mt-5 text-xs font-medium text-slate-400">
                    {featured.authorName} · {formatDate(featured.publishedAt)}
                  </p>
                  <Link href={`/blog/${featured.slug}`} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-accent">
                    Read the full article
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>

          {rest.length > 0 && (
            <section className="border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-xl font-bold tracking-tight text-navy-950">More posts</h2>
                <Reveal effect="stagger" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </Reveal>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
