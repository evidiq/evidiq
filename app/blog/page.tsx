import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { POSTS, formatDate } from "@/lib/blog";
import { listPosts } from "@/lib/blog-engine/store";

// Auto-generated posts land on disk after the container is already running
// (the cron hits /api/blog/generate, not a rebuild), so this page must be
// rendered on request, not frozen at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — EVIDIQ",
  description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
};

type Card = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tag: string;
  excerpt: string;
  image: string | null;
};

export default function BlogPage() {
  // Hand-written posts (lib/blog.ts) + auto-generated posts (content/blog/),
  // merged and sorted newest-first. The hand-written post always keeps its
  // own static route (app/blog/evidiq-live-on-0g/); generated posts route
  // through app/blog/[slug]/.
  const handWritten: Card[] = POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    readingTime: p.readingTime,
    tag: p.tag,
    excerpt: p.excerpt,
    image: p.image,
  }));
  const generated: Card[] = listPosts({ onlyPublished: true }).map((p) => ({
    slug: p.slug,
    title: p.h1,
    date: p.publishedAt ?? p.createdAt,
    readingTime: p.readTime,
    tag: p.category,
    excerpt: p.excerpt,
    image: p.featuredImage,
  }));
  const posts = [...handWritten, ...generated].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageShell max="max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Blog</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Writing &amp; updates
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Notes on building the trust layer for the AI agent economy.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </PageShell>
  );
}

function BlogCard({ post }: { post: Card }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
    >
      <div className="relative h-40 overflow-hidden bg-[#efe6d2]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- generated images are served by app/blog-img/, outside next/image's static pipeline
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShieldCheck className="text-violet-400/60" size={40} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-violet-200 backdrop-blur-sm">
          {post.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-base font-bold leading-snug text-[#1a130a] transition-colors group-hover:text-violet-700">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#201810]/65">
          {post.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#201810]/45">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
