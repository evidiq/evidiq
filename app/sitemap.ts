import type { MetadataRoute } from "next";
import { DOCS } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://evidiq.dev";
  const now = new Date();
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
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];
}
