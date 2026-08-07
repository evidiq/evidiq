/**
 * EVIDIQ blog pipeline orchestrator — same generate -> score -> save shape as
 * ZYVA's engine/blog/pipeline.ts, adapted to file-based storage (no DB) and a
 * fixed EVIDIQ-specific topic pool.
 */

import { generateArticle, injectImages, slugify, estimateReadTime } from "./generate";
import { generateAllBlogImages } from "./images";
import { scoreSeo } from "./seo";
import { scoreHumanity } from "./humanize";
import { pickInternalLinks, pickNextTopic, savePost, type GeneratedPost } from "./store";

export interface PipelineResult {
  ok: boolean;
  slug?: string;
  seoScore?: number;
  humanityScore?: number;
  status?: "draft" | "published";
  error?: string;
}

/**
 * Guarantee a publishable meta description. The SEO scorer treats
 * meta-description length (80-160 chars) as a CRITICAL check and keyword-in-
 * excerpt as a scored check — an LLM excerpt that overshoots 160, comes in
 * under 80, or paraphrases away the keyword silently pins the post at "draft"
 * forever. This normalizes the excerpt so both checks always pass without
 * touching the article body: ensure the keyword phrase is present, clamp to
 * <=160 at a word boundary, and pad a short excerpt to >=80 with a meaningful
 * EVIDIQ tail.
 */
export function normalizeExcerpt(excerpt: string, keyword: string, title: string): string {
  const kw = keyword.trim();
  let ex = (excerpt || "").replace(/\s+/g, " ").trim();
  if (!ex) ex = title.replace(/\s+/g, " ").trim();

  // 1. Keyword must appear (keyword-in-excerpt check).
  if (!ex.toLowerCase().includes(kw.toLowerCase())) {
    const cap = kw.charAt(0).toUpperCase() + kw.slice(1);
    ex = `${cap}: ${ex}`;
  }
  // 2. Clamp to <= 160 at a word boundary (keeps the keyword, which is at the front).
  if (ex.length > 160) {
    ex = ex.slice(0, 159).replace(/\s+\S*$/, "").replace(/[\s.,;:!?—-]+$/, "").trim() + "…";
  }
  // 3. Pad a too-short excerpt to >= 80 with a real EVIDIQ tail, then re-clamp.
  if (ex.length < 80) {
    const tail = " EVIDIQ returns a signed, on-chain-anchored verdict so agents can decide before money moves.";
    ex = (ex.replace(/[…\s]+$/, "").replace(/\.+$/, "") + "." + tail).replace(/\s+/g, " ").trim();
    if (ex.length > 160) ex = ex.slice(0, 159).replace(/\s+\S*$/, "").trim() + "…";
  }
  return ex;
}

export async function runBlogPipeline(): Promise<PipelineResult> {
  // Images run on the 0G router's z-image-turbo by default (same key as the
  // writer); DigitalOcean remains the fallback when BLOG_DO_API_KEY is set.
  const imageProvider = (process.env.BLOG_IMAGE_PROVIDER || "og").toLowerCase();
  const imagesReady = imageProvider === "do"
    ? Boolean(process.env.BLOG_DO_API_KEY)
    : Boolean(process.env.BLOG_LLM_API_KEY);

  try {
    const topic = pickNextTopic();

    // ── 1. Generate article (retry once for humanity) ──────────────────
    let article = await generateArticle({
      keyword: topic.keyword,
      title: topic.title,
      angle: topic.angle,
      category: topic.category,
      outline: topic.outline,
      wordCount: 1600,
      internalLinks: pickInternalLinks(3),
    });

    let humanityResult = scoreHumanity(article.content);
    if (!humanityResult.passes) {
      article = await generateArticle({
        keyword: topic.keyword,
        title: topic.title,
        angle: `${topic.angle} — write in a more conversational, human tone with varied sentence lengths and opinionated takes`,
        category: topic.category,
        outline: topic.outline,
        wordCount: 1600,
        internalLinks: pickInternalLinks(3),
      });
      humanityResult = scoreHumanity(article.content);
    }

    // ── 2. Generate images (best-effort) ────────────────────────────────
    const slug = slugify(article.title);
    const { featuredImage, bodyImages } = imagesReady
      ? await generateAllBlogImages({
          slug,
          featuredPrompt: article.featuredImagePrompt,
          bodyImagePrompts: article.bodyImagePrompts,
        })
      : { featuredImage: null, bodyImages: [] };

    const finalContent = injectImages(article.content, bodyImages);

    // ── 3. Score SEO ─────────────────────────────────────────────────────
    const excerpt = normalizeExcerpt(article.excerpt, topic.keyword, article.title);
    const seoResult = scoreSeo({
      title: article.title,
      excerpt,
      content: finalContent,
      slug,
      keyword: topic.keyword,
      h1: article.h1,
    });

    // ── 4. Persist ───────────────────────────────────────────────────────
    const now = new Date().toISOString();
    // canPublish = score >= 85 AND no critical fail (see seo.ts). Using it (not
    // a raw >= 90) is what stops good posts stalling at draft on cosmetic misses.
    const passed = seoResult.canPublish && humanityResult.passes;

    const post: GeneratedPost = {
      slug,
      title: article.title,
      h1: article.h1,
      excerpt,
      content: finalContent,
      category: topic.category,
      tags: [topic.keyword, topic.category.toLowerCase(), "evidiq"],
      readTime: estimateReadTime(finalContent),
      featuredImage: featuredImage ?? null,
      bodyImages,
      status: passed ? "published" : "draft",
      seoScore: seoResult.score,
      humanityScore: humanityResult.score,
      keyword: topic.keyword,
      topicId: topic.id,
      createdAt: now,
      publishedAt: passed ? now : null,
    };
    savePost(post);

    return {
      ok: true,
      slug,
      seoScore: seoResult.score,
      humanityScore: humanityResult.score,
      status: post.status,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
