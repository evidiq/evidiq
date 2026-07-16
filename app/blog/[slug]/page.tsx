import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageShell from "@/components/PageShell";
import FaqAccordion from "@/components/FaqAccordion";
import { getPost } from "@/lib/blog-engine/store";
import { BLOG_AUTHOR } from "@/lib/blog-engine/author";
import { extractFaq, extractToc, headingId, childrenToText } from "@/lib/blog-engine/parse";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateISO(iso: string): string {
  return new Date(iso).toISOString();
}

// New posts land on disk after the container is already running (the cron
// hits /api/blog/generate, not a rebuild) — so this route must always render
// on request, never pre-rendered/cached at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.status !== "published") return {};

  const siteUrl = "https://evidiq.dev";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const publishedTime = new Date(post.publishedAt ?? post.createdAt).toISOString();
  const modifiedTime = new Date(post.createdAt).toISOString();

  return {
    title: `${post.title} — EVIDIQ`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "EVIDIQ",
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [BLOG_AUTHOR.name],
      section: post.category,
      tags: post.tags,
      images: post.featuredImage
        ? [{ url: `${siteUrl}${post.featuredImage}`, width: 1200, height: 630 }]
        : [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage
        ? [`${siteUrl}${post.featuredImage}`]
        : [`${siteUrl}/og.png`],
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": BLOG_AUTHOR.name,
      "article:section": post.category,
      "article:tag": post.tags.join(","),
    },
  };
}

export default async function AutoBlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.status !== "published") notFound();

  const siteUrl = "https://evidiq.dev";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const publishedTime = formatDateISO(post.publishedAt ?? post.createdAt);
  const modifiedTime = formatDateISO(post.createdAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? `${siteUrl}${post.featuredImage}` : `${siteUrl}/og.png`,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.href,
    },
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
      "@id": postUrl,
    },
  };

  // Strip the leading "# {h1}" line (h1 is rendered separately above), then
  // pull the FAQ section out into structured data for the accordion below.
  const withoutH1 = post.content.replace(/^# .+\n/, "");
  const toc = extractToc(withoutH1);
  const { body, faq } = extractFaq(withoutH1);

  return (
    <PageShell max="max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800"
      >
        <ArrowLeft size={15} /> All posts
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-[#201810]/50">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-semibold text-violet-700">
          {post.category}
        </span>
        <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#1a130a] md:text-5xl">
        {post.h1}
      </h1>

      {post.featuredImage && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#e7dcc7]">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated images live outside next/image's static asset pipeline */}
          <img src={post.featuredImage} alt={post.h1} className="w-full" />
        </div>
      )}

      {toc.length > 0 && (
        <nav className="mt-8 rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1a130a]">
            Table of Contents
          </p>
          <ol className="mt-4 divide-y divide-[#e7dcc7]">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group flex items-center gap-3 py-2.5 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-medium text-[#201810]/80 transition-colors group-hover:text-violet-700">
                    {item.text}
                  </span>
                </a>
              </li>
            ))}
            {faq.length > 0 && (
              <li>
                <a href="#faq" className="group flex items-center gap-3 py-2.5 transition-colors">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {toc.length + 1}
                  </span>
                  <span className="font-medium text-[#201810]/80 transition-colors group-hover:text-violet-700">
                    Frequently Asked Questions
                  </span>
                </a>
              </li>
            )}
          </ol>
        </nav>
      )}

      <article className="evidiq-prose mt-8 max-w-none text-lg leading-relaxed text-[#201810]/80">
        <ReactMarkdown
          components={{
            h1: () => null, // content already starts with "# {h1}"; h1 rendered above
            h2: (p) => {
              const id = headingId(childrenToText(p.children));
              return <h2 id={id} className="mt-10 mb-3 text-2xl font-bold text-[#1a130a]" {...p} />;
            },
            h3: (p) => <h3 className="mt-8 mb-2 text-xl font-bold text-[#1a130a]" {...p} />,
            p: (p) => <p className="mb-5" {...p} />,
            strong: (p) => <strong className="font-semibold text-[#1a130a]" {...p} />,
            a: (p) => <a className="font-medium text-violet-700 hover:text-violet-800" {...p} />,
            ul: (p) => <ul className="mb-5 list-disc space-y-1.5 pl-5" {...p} />,
            ol: (p) => <ol className="mb-5 list-decimal space-y-1.5 pl-5" {...p} />,
            code: (p) => <code className="rounded bg-[#efe6d2] px-1.5 py-0.5 font-mono text-sm" {...p} />,
            // eslint-disable-next-line @next/next/no-img-element -- body images are generated files served from /public/blog
            img: (p) => (
              <img
                {...p}
                alt={p.alt ?? ""}
                className="my-8 w-full rounded-2xl border border-[#e7dcc7]"
              />
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </article>

      {faq.length > 0 && (
        <div id="faq">
          <FaqAccordion items={faq} />
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-[#2b2140] bg-[#171021] p-6">
        <p className="text-white/80">Give your agent the trust skill:</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 font-mono text-sm text-cyan-300">
          curl -s https://evidiq.dev/skill.md
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a130a] text-lg font-bold text-white">
          {BLOG_AUTHOR.initial}
        </div>
        <div>
          <p className="font-bold text-[#1a130a]">{BLOG_AUTHOR.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#201810]/70">{BLOG_AUTHOR.bio}</p>
          <a
            href={BLOG_AUTHOR.href}
            className="mt-2 inline-block text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            {BLOG_AUTHOR.linkLabel} →
          </a>
        </div>
      </div>
    </PageShell>
  );
}
