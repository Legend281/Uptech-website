import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";
import { getPublishedBlogPost } from "@/lib/blog";
import { sanitizeBlogHtml } from "@/lib/sanitizeHtml";

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

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={blogPostingJsonLd(post)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        <article className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
              {post.category && (
                <span className="mb-3 inline-block rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-teal-700">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">{post.title}</h1>
              <p className="mt-4 text-sm font-medium text-slate-500">
                {post.authorName} · {formatDate(post.publishedAt)}
              </p>
            </header>

            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt="" className="mb-10 w-full rounded-2xl border border-slate-200/90 object-cover shadow-lg" />
            )}

            <div className="prose prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
