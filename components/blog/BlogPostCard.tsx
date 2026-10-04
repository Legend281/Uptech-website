import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CategoryTag } from "@/components/blog/CategoryTag";
import type { PublicBlogPost } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** The one post-preview card every blog surface uses — the index grid and the detail page's "More from the blog" strip — so a post never renders two different ways depending on where it's linked from. */
export function BlogPostCard({ post }: { post: PublicBlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <TiltCard max={4} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(7,14,27,0.04),0_10px_24px_-16px_rgba(7,14,27,0.14)] transition-shadow duration-300 group-hover:shadow-[0_4px_8px_rgba(7,14,27,0.06),0_20px_36px_-16px_rgba(7,14,27,0.18)]">
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-slate-100">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-slate-300">
              <MaterialIcon name="article" className="text-[32px]" />
            </span>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/15 via-transparent to-transparent" />
          {post.category && <CategoryTag category={post.category} />}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-navy-950 transition-colors group-hover:text-blue-accent">{post.title}</h3>
          {post.excerpt && <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-400">
              {post.authorName} · {formatDate(post.publishedAt)}
            </p>
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-blue-accent opacity-0 transition-opacity group-hover:opacity-100">
              Read
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}
