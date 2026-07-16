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

export async function runBlogPipeline(): Promise<PipelineResult> {
  const doApiKey = process.env.BLOG_DO_API_KEY || "";

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
    const { featuredImage, bodyImages } = doApiKey
      ? await generateAllBlogImages({
          slug,
          featuredPrompt: article.featuredImagePrompt,
          bodyImagePrompts: article.bodyImagePrompts,
          doApiKey,
        })
      : { featuredImage: null, bodyImages: [] };

    const finalContent = injectImages(article.content, bodyImages);

    // ── 3. Score SEO ─────────────────────────────────────────────────────
    const seoResult = scoreSeo({
      title: article.title,
      excerpt: article.excerpt,
      content: finalContent,
      slug,
      keyword: topic.keyword,
      h1: article.h1,
    });

    // ── 4. Persist ───────────────────────────────────────────────────────
    const now = new Date().toISOString();
    const passed = seoResult.score >= 90 && humanityResult.passes;

    const post: GeneratedPost = {
      slug,
      title: article.title,
      h1: article.h1,
      excerpt: article.excerpt,
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
