import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { POSTS, formatDate } from "@/lib/blog";
import { listPosts } from "@/lib/blog-engine/store";
import { BLOG_AUTHOR } from "@/lib/blog-engine/author";

// Generated posts land on disk after the container is already running (the
// cron hits /api/blog/generate, not a rebuild) — this page must render on
// request, not freeze at build time, same as /blog and /blog/[slug].
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BLOG_AUTHOR.name} — EVIDIQ Blog`,
  description: BLOG_AUTHOR.bio,
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

export default function AuthorPage() {
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
    <PageShell max="max-w-4xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800"
      >
        <ArrowLeft size={15} /> All posts
      </Link>

      <div className="mt-6 flex items-start gap-5 rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a130a] text-2xl font-bold text-white">
          {BLOG_AUTHOR.initial}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
            Author
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1a130a]">
            {BLOG_AUTHOR.name}
          </h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-[#201810]/70">{BLOG_AUTHOR.bio}</p>
          <a
            href="https://evidiq.dev"
            className="mt-3 inline-block text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            evidiq.dev →
          </a>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-[#1a130a]">
        {posts.length} post{posts.length === 1 ? "" : "s"} by {BLOG_AUTHOR.name}
      </h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
          >
            <div className="relative h-36 overflow-hidden bg-[#efe6d2]">
              {post.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- served by app/blog-img/, outside next/image's static pipeline
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShieldCheck className="text-violet-400/60" size={36} />
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-violet-200 backdrop-blur-sm">
                {post.tag}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#1a130a] transition-colors group-hover:text-violet-700">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#201810]/65">
                {post.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#201810]/45">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
