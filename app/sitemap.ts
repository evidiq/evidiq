import type { MetadataRoute } from "next";
import { DOCS } from "@/lib/docs";
import { POSTS } from "@/lib/blog";
import { listPosts } from "@/lib/blog-engine/store";

// Generated posts arrive on a bind-mounted volume after the container is running
// (`/root/evidiq-blog-content:/app/content/blog`), so a sitemap frozen at build time
// only ever lists the handful of posts committed to the repo. Measured 2026-08-04:
// 25 URLs served, none of them a post, while 50 posts were live on disk. Revalidating
// makes the file re-read the volume instead of reporting the image's contents forever.
export const revalidate = 300;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://evidiq.dev";
  const now = new Date();

  // Both sources feed /blog, so both belong here. Hand-written posts win on a slug
  // collision because they are the curated version of the same URL.
  const bySlug = new Map<string, { url: string; lastModified: Date }>();

  for (const post of listPosts({ onlyPublished: true })) {
    bySlug.set(post.slug, {
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt ?? post.createdAt),
    });
  }
  for (const post of POSTS) {
    bySlug.set(post.slug, {
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    });
  }

  const posts = [...bySlug.values()].map((entry) => ({
    url: entry.url,
    lastModified: Number.isNaN(entry.lastModified.getTime()) ? now : entry.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Derived from DOCS. The hand-written list had gone stale by five services:
    // Lineage, Vault, Redact, Warden and Assay were all live and unlisted here.
    ...DOCS.map((doc) => ({
      url: `${base}${doc.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/skill.md`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/playground`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/blog/author/evidiq-team`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    ...posts,
  ];
}
