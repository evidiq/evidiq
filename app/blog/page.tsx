import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { POSTS, formatDate } from "@/lib/blog";
import { listPosts } from "@/lib/blog-engine/store";

// Auto-generated posts land on disk after the container is already running
// (the cron hits /api/blog/generate, not a rebuild), so this page must be
// rendered on request, not frozen at build time.
export const dynamic = "force-dynamic";

const siteUrl = "https://evidiq.dev";

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "EVIDIQ Blog",
  description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
  url: `${siteUrl}/blog`,
  publisher: {
    "@type": "Organization",
    name: "EVIDIQ",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/evidiq-logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/blog`,
  },
};

export const metadata: Metadata = {
  title: "Blog — EVIDIQ",
  description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "EVIDIQ Blog",
    description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
    url: `${siteUrl}/blog`,
    siteName: "EVIDIQ",
    type: "website",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVIDIQ Blog",
    description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
    images: [`${siteUrl}/og.png`],
  },
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

const POSTS_PER_PAGE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

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

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Page numbers to render in the pagination bar (compact window around current).
  const pageNumbers: (number | "…")[] = [];
  const add = (n: number | "…") => {
    if (pageNumbers[pageNumbers.length - 1] !== n) pageNumbers.push(n);
  };
  add(1);
  if (currentPage - 2 > 2) add("…");
  for (let n = Math.max(2, currentPage - 1); n <= Math.min(totalPages - 1, currentPage + 1); n++) {
    add(n);
  }
  if (currentPage + 2 < totalPages - 1) add("…");
  if (totalPages > 1) add(totalPages);

  return (
    <PageShell max="max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Blog</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Writing &amp; updates
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Notes on building the trust layer for the AI agent economy.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
          {currentPage > 1 && (
            <Link
              href={`/blog${currentPage === 2 ? "" : `?page=${currentPage - 1}`}`}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e7dcc7] bg-[#fbf8f1] px-3 text-sm font-semibold text-[#201810] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
            >
              <ArrowRight size={14} className="rotate-180" /> Prev
            </Link>
          )}
          {pageNumbers.map((n, i) =>
            n === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-[#201810]/40">…</span>
            ) : (
              <Link
                key={n}
                href={`/blog${n === 1 ? "" : `?page=${n}`}`}
                aria-current={n === currentPage ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors ${
                  n === currentPage
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-[#e7dcc7] bg-[#fbf8f1] text-[#201810] hover:border-violet-300 hover:bg-violet-50/40"
                }`}
              >
                {n}
              </Link>
            )
          )}
          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e7dcc7] bg-[#fbf8f1] px-3 text-sm font-semibold text-[#201810] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
            >
              Next <ArrowRight size={14} />
            </Link>
          )}
        </nav>
      )}

      <p className="mt-6 text-center text-xs text-[#201810]/40">
        {posts.length} posts · page {currentPage} of {totalPages}
      </p>
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