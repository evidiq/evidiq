/**
 * SEO scorer for EVIDIQ blog posts — ported from ZYVA's engine/blog/seo.ts,
 * with the internal-link domain check pointed at evidiq.dev.
 * Posts must score >= 85 (and have no critical fail) to auto-publish.
 */

export interface SeoCheck {
  label: string;
  value: string;
  ok: boolean;
  critical: boolean;
}

export interface SeoResult {
  score: number;
  checks: SeoCheck[];
  canPublish: boolean;
}

/**
 * Robust keyword-presence check. The LLM writes natural titles with hyphens
 * ("Agent-to-Agent"), connector words ("in 2026"), and verb conjugation
 * ("Verifies" vs keyword "verify") — a naive `includes()` substring match
 * fails these even though the keyword is semantically present. This normalizes
 * punctuation AND falls back to token-level stem-prefix matching so good
 * natural-language titles score as passing.
 *
 * The auto-publish pipeline was silently stuck at "draft" for days because the
 * old literal match flagged keyword-in-title as a fail on otherwise-excellent
 * posts (humanity 100, all other SEO checks green). Don't regress this.
 */
function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function tokenize(s: string): string[] {
  return normalizeText(s).split(" ").filter((t) => t.length > 3);
}
function tokenStemMatch(keywordToken: string, targetToken: string): boolean {
  if (keywordToken === targetToken) return true;
  // stem-prefix: "verify" ~ "verifies" (4-char prefix), "agent" ~ "agents"
  const prefixLen = Math.min(4, Math.min(keywordToken.length, targetToken.length));
  return (
    targetToken.startsWith(keywordToken.slice(0, prefixLen)) ||
    keywordToken.startsWith(targetToken.slice(0, prefixLen))
  );
}
function keywordPresent(target: string, keyword: string): boolean {
  const tNorm = normalizeText(target);
  const kNorm = normalizeText(keyword);
  if (!kNorm) return false;
  // 1. exact phrase match after punctuation normalization (handles hyphens/quotes)
  if (tNorm.includes(kNorm)) return true;
  // 2. token-level: every significant keyword token (len>3) matches some target
  //    token via stem-prefix (handles verb conjugation + reordering + connectors)
  const kTokens = tokenize(keyword);
  if (kTokens.length === 0) return tNorm.includes(kNorm);
  const tTokens = tokenize(target);
  return kTokens.every((kt) => tTokens.some((tt) => tokenStemMatch(kt, tt)));
}

/**
 * Count how often the keyword's CONCEPT appears — not just verbatim full-phrase
 * matches. The generator is deliberately told to bold PARTIAL natural
 * repetitions of a long keyword (e.g. "trust score" for "AI agent trust
 * score"), so a naive exact-full-phrase count under-counts otherwise-excellent
 * long-tail articles and silently stalls them at "draft". We take the max of
 * the exact-phrase count and the count of the keyword's single most
 * distinctive (longest) significant token — the topic word that a real article
 * repeats — while ignoring short common tokens like "agent" that would
 * over-count. This is the same robustness fix already applied to the
 * keyword-in-title/H1 checks; keep density consistent with it.
 */
function countKeywordMentions(content: string, keyword: string): number {
  const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const exact = (content.match(new RegExp(esc(keyword), "gi")) || []).length;
  const distinctive = tokenize(keyword)
    .slice()
    .sort((a, b) => b.length - a.length)[0];
  const tokenCount = distinctive
    ? (content.toLowerCase().match(new RegExp("\\b" + esc(distinctive), "g")) || []).length
    : 0;
  return Math.max(exact, tokenCount);
}

export function scoreSeo(post: {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  keyword: string;
  h1: string;
}): SeoResult {
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const excerptLen = post.excerpt.length;
  const titleLen = post.title.length;
  const h2Count = (post.content.match(/^## /gm) || []).length;
  const h3Count = (post.content.match(/^### /gm) || []).length;
  const internalLinks = (post.content.match(/\]\(https?:\/\/(?:www\.)?evidiq\.dev/g) || []).length;
  const hasFAQ = /## Frequently Asked/i.test(post.content);
  const hasKeywordInTitle = keywordPresent(post.title, post.keyword);
  const hasKeywordInH1 = keywordPresent(post.h1, post.keyword);
  const hasKeywordInExcerpt = keywordPresent(post.excerpt, post.keyword);
  const keywordCount = countKeywordMentions(post.content, post.keyword);
  // Forgiving featured-snippet check: an H2 immediately followed by a
  // definition paragraph (>=40 chars, ending in sentence punctuation). The old
  // 39-120 CHAR window directly contradicted the generator's 40-60 WORD
  // instruction (~250 chars) and failed good snippets — a point that helped
  // stall otherwise-excellent posts at draft.
  const hasFeaturedSnippet = /^##\s+.+\n+\s*[A-Z][^\n]{40,}[.?!]/m.test(post.content);
  const hasSlug = !!post.slug && /^[a-z0-9-]+$/.test(post.slug) && post.slug.length >= 10;
  const hasBold = /\*\*[^*]+\*\*/.test(post.content);
  const hasBodyImage = /!\[.+\]\(.+\)/.test(post.content);
  const hasNumberedList = /^\d+\.\s/m.test(post.content);
  const hasBulletList = /^[-*]\s/m.test(post.content);
  const mentionsEvidiq = /\bEVIDIQ\b/.test(post.content);

  const checks: SeoCheck[] = [
    { label: "Title length", value: `${titleLen}/60 chars`, ok: titleLen >= 30 && titleLen <= 65, critical: true },
    { label: "Keyword in title", value: hasKeywordInTitle ? "✓" : "Missing", ok: hasKeywordInTitle, critical: true },
    {
      label: "Meta description length",
      value: `${excerptLen}/155 chars`,
      ok: excerptLen >= 80 && excerptLen <= 160,
      critical: true,
    },
    {
      label: "Keyword in excerpt",
      value: hasKeywordInExcerpt ? "✓" : "Missing",
      ok: hasKeywordInExcerpt,
      critical: false,
    },
    { label: "Word count", value: `${wordCount.toLocaleString()} words`, ok: wordCount >= 1400, critical: true },
    { label: "H2 sections", value: `${h2Count} H2 headings`, ok: h2Count >= 4, critical: false },
    { label: "FAQ section", value: hasFAQ ? "✓" : "Missing", ok: hasFAQ, critical: false },
    { label: "H3 FAQ items", value: `${h3Count} H3 headings`, ok: h3Count >= 3, critical: false },
    {
      label: "Internal links (evidiq.dev)",
      value: `${internalLinks} link(s)`,
      ok: internalLinks >= 2,
      critical: false,
    },
    {
      label: "Featured Snippet paragraph",
      value: hasFeaturedSnippet ? "✓" : "Add 40-60 word definition after first H2",
      ok: hasFeaturedSnippet,
      critical: false,
    },
    {
      label: "Keyword density",
      value: `${keywordCount}x in body`,
      ok: keywordCount >= 3 && keywordCount <= 40,
      critical: false,
    },
    { label: "Bold terms", value: hasBold ? "✓" : "Missing **bold**", ok: hasBold, critical: false },
    { label: "Body images", value: hasBodyImage ? "✓" : "No images in body", ok: hasBodyImage, critical: false },
    { label: "Numbered list", value: hasNumberedList ? "✓" : "Add a step-by-step list", ok: hasNumberedList, critical: false },
    { label: "Bullet list", value: hasBulletList ? "✓" : "Add a bullet list", ok: hasBulletList, critical: false },
    { label: "URL slug", value: post.slug || "Not set", ok: hasSlug, critical: true },
    { label: "Keyword in H1", value: hasKeywordInH1 ? "✓" : "Missing", ok: hasKeywordInH1, critical: false },
    {
      label: "Actually about EVIDIQ",
      value: mentionsEvidiq ? "✓" : "EVIDIQ not mentioned",
      ok: mentionsEvidiq,
      critical: true,
    },
  ];

  const totalWeight = checks.length;
  const passedWeight = checks.filter((c) => c.ok).length;
  const score = Math.round((passedWeight / totalWeight) * 100);
  const hasCriticalFail = checks.some((c) => c.critical && !c.ok);
  // Publish at >= 85 (allows up to ~2 non-critical misses out of 18) with NO
  // critical fail. The 6 critical checks (title, keyword-in-title, meta-desc
  // length, word count, slug, mentions-EVIDIQ) still hard-gate, so quality
  // stays high — this only stops good posts stalling on 1-2 cosmetic misses.
  const canPublish = score >= 85 && !hasCriticalFail;

  return { score, checks, canPublish };
}
