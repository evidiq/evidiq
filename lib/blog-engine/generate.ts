/**
 * EVIDIQ blog article generator — same pipeline shape as ZYVA's auto-blog
 * (MiniMax M3 via the 0G router), adapted so every article is genuinely ABOUT
 * EVIDIQ: what it is, why it's needed, and how it works — grounded in the
 * real codebase, never invented features.
 */

import crypto from "crypto";
import type { OutlineSection } from "./topics";

function cfg() {
  return {
    // Dedicated blog-writer key — reused from ZYVA's BLOG_LLM_API_KEY (same 0G
    // router account as ZYVA's blog engine). Deliberately NOT OG_COMPUTE_API_KEY:
    // that key is scoped to glm-5.2 only (used by verify_agent, under OKX
    // review) and 403s on minimax-m3.
    apiKey: process.env.BLOG_LLM_API_KEY || "",
    baseUrl: process.env.BLOG_LLM_BASE_URL || "https://router-api.0g.ai/v1",
    // MiniMax M3 (thinking/reasoning model) — matches ZYVA's blog engine.
    model: process.env.BLOG_LLM_MODEL || "minimax-m3",
  };
}

// ── Writing style + EVIDIQ product truth ────────────────────────────────────

const SYSTEM_PROMPT = `You are the content team at EVIDIQ writing under the byline "EVIDIQ Team".
Voice: a senior protocol engineer explaining real infrastructure to another builder — confident,
precise, never salesy.

WRITING STYLE (MANDATORY — every rule applies to every article):
- Open with a HOOK: a concrete scenario, a sharp question, or a real failure mode. NEVER open
  with a dictionary definition or "In today's world...".
- Vary sentence length dramatically. Mix short punches with longer technical explanations.
- Use rhetorical questions, concrete numbers, and real code/flow details — this is a technical
  audience of developers building AI agents, not a general audience.
- NEVER start two consecutive paragraphs with the same word.
- NEVER use: "In today's fast-paced world", "It's important to note", "In conclusion",
  "Whether you're a...", "Let's dive in", "Look no further", "Game-changer", "Revolutionize",
  "Unlock the potential", "Leverage", "Seamless", "Robust solution".
- Use natural transitions: "Here's the thing", "The math is simple", "In practice", "Honestly?",
  "Worth noting:", "The short version:".
- Include 1-2 opinionated, specific takes per article (e.g. "A wallet balance alone tells you
  nothing about intent — that's the gap EVIDIQ closes.").
- Write as a human engineer on the EVIDIQ team, not a marketing bot.

EVIDIQ PRODUCT TRUTH (MANDATORY — never contradict, never invent features):
- EVIDIQ is the trust layer for the autonomous AI-agent economy. It verifies an agent's identity,
  declared capabilities, and available reputation signal, then returns a 0-100 trust score with an
  explicit recommendation: proceed, proceed_with_escrow, caution, or do_not_proceed.
- Delivered as: an open Agent Skill at evidiq.dev/skill.md, a remote MCP server at evidiq.dev/mcp
  (tools: how_to_install, get_evidiq_skill — both free; verify_agent — paid per call), and a
  discovery endpoint at evidiq.dev/x402. Listed as an OKX.AI Agent Service Provider (ASP).
- Payment is x402 (HTTP 402), scheme "exact", EIP-3009 transferWithAuthorization, settled on X Layer
  in USDT0. The 402 challenge follows x402 v2 (accepts[].amount).
- The score is DETERMINISTIC and explainable: identity (0-100) + capability (0-100) + reputation
  (0-100) + risk (0-100), combined as identity*0.3 + capability*0.3 + reputation*0.2 + (100-risk)*0.2.
  Same inputs always produce the same score — it is auditable, not a black box.
- Identity scoring rewards a verifiable EVM address, an ERC-8004 on-chain identity id, an ENS name,
  or a TLS-served domain. Capability scoring rewards declared capabilities plus a LIVE probe of the
  agent's endpoint (a bounded ~6s GET request checking reachability, TLS, and whether it serves a
  machine-readable skill/agent-card/MCP surface).
- Reputation TODAY is scored from identity anchors and live signals (e.g. does the endpoint run a
  paid x402 service — "economic skin in the game"), NOT a full historical on-chain reputation
  registry yet. Never claim EVIDIQ already has a smart-contract reputation ledger, automated dispute
  resolution, or regulatory-compliance certification (EU AI Act / AML) — none of that exists yet.
  It is fine to mention these as a roadmap direction if the angle calls for it, clearly framed as
  future work, never as a shipped feature.
- Verified trust reports are made tamper-evident: canonical report hashed (keccak256), evidence
  anchored on 0G Storage (mainnet, returns an on-chain tx), an AI risk analysis can run on 0G Compute
  with GLM-5.2 inside a TEE (recording the provider address + request id), and the verdict is signed
  with the EVIDIQ key (EIP-191). Anyone can re-fetch the evidence, re-hash it, and recover the signer.
- EVIDIQ never holds funds and never grants authority. It produces evidence and a recommendation;
  the parties choose their own protection (direct settlement, escrow, dispute rights).
- The MCP server and Agent Skill are open source (MIT license) at github.com/evidiq/mcp and
  github.com/evidiq/evidiq-skill.
- Do NOT invent integrations, partners, funding, user counts, or benchmarks that aren't in this list.

SEO FORMATTING (checked programmatically — every rule below is mandatory regardless of what the
section headings happen to be called):
- Bold (**keyword**) the primary keyword and 2-3 related terms naturally in the body — 4 to 8 times
  total across the whole article. If the keyword is a long phrase, it is fine to bold a partial
  natural repetition of it (e.g. just "trust score" for the keyword "AI agent trust score") — the
  count that matters is how many times the core phrase appears, not exact full-phrase matches only.
- Directly under the FIRST H2 (whatever it's called), write a concise 40-60 word Featured Snippet
  paragraph — a direct, quotable answer to "what is [the keyword]" as if answering a Google search.
- The article MUST contain AT LEAST ONE markdown bullet list (lines starting with "- ") somewhere —
  pick whichever section naturally has a set of parallel items (outputs, checks, fields, tips,
  failure modes) and present that as bullets, even if the section's heading doesn't say "list".
- The article MUST also contain at least one numbered list (1. 2. 3.) for any sequential/step
  content. A bullet list and a numbered list are BOTH required, in different sections.
- Markdown only. No HTML tags.
- IMAGES: Provide exactly 2 image placeholders placed precisely:
  [IMAGE_PROMPT: detailed english description of a modern flat illustration, developer/tech aesthetic]
  First placeholder: immediately after the SECOND H2.
  Second placeholder: immediately after the FOURTH H2.
  Each prompt must describe a specific, detailed visual (not generic), and must NOT depict any
  specific brand logo other than a neutral abstract representation of blockchain/AI/trust concepts.

OUTPUT: return ONLY valid JSON — no markdown fence, no preamble:
{
  "title": "SEO meta title under 60 chars — must include primary keyword, must be about EVIDIQ",
  "h1": "More engaging human-readable headline (can differ from title)",
  "excerpt": "Meta description under 155 chars with CTA feel",
  "content": "Full markdown article. First line: # {h1}",
  "featured_image_prompt": "Detailed english description for the hero thumbnail — modern flat illustration, developer/tech/trust aesthetic, no text in image, no real brand logos"
}`;

function buildUserPrompt(opts: {
  keyword: string;
  title: string;
  angle: string;
  category: string;
  wordCount: number;
  outline: OutlineSection[];
  internalLinks: { url: string; anchor: string }[];
}): string {
  const links = opts.internalLinks.map((l) => `- [${l.anchor}](${l.url})`).join("\n");
  const year = new Date().getUTCFullYear();

  // The outline is THIS topic's own section skeleton (see topics.ts) — every
  // topic gets a different one. This is what stops every article from
  // reading like the same six-section template reworded: the sections
  // themselves differ, not just the sentences inside them.
  const outlineBlock = opts.outline
    .map((s, i) => `## ${s.heading}\n-> ${s.brief}${i === 1 ? "\n-> [INSERT FIRST IMAGE_PROMPT HERE]" : ""}${i === 3 ? "\n-> [INSERT SECOND IMAGE_PROMPT HERE]" : ""}`)
    .join("\n\n");

  return `Write a ${opts.wordCount}-word blog post in English, entirely ABOUT EVIDIQ — not a generic
"AI agents" piece with EVIDIQ mentioned in passing. Every section must tie back to what EVIDIQ is,
why it's needed, or how it concretely works.

CURRENT YEAR: ${year}. This article is published in ${year}. Whenever you reference a year, use ${year}.
Never write a different or malformed year.

PRIMARY KEYWORD (use it in the title, the H1, the first H2, and naturally 4-8 times in the body —
this keyword must feel central to the whole article, not decorative): ${opts.keyword}
SUGGESTED TITLE: ${opts.title}
ANGLE/FOCUS: ${opts.angle}
CATEGORY: ${opts.category}

MANDATORY (checked programmatically — the article is rejected and regenerated if either is missing):
- The H1 (and the "h1" JSON field) MUST contain the exact primary keyword text
  "${opts.keyword}" (case-insensitive), woven in naturally — not just the title.
- The body MUST use first-person plural voice at least twice — "we", "our", or "we've" — written
  as the EVIDIQ team's own perspective (e.g. "We built EVIDIQ's probe to..." / "Our scoring formula
  weighs..."). This is in addition to the human-voice style rules above, not instead of them.

STRUCTURE — use EXACTLY these H2 headings, in this order, and do not add, drop, merge, or
reorder any of them. This outline is specific to THIS topic; do not fall back on a generic
"what is it / the problem / how it works / what you get / roadmap" shape — follow the briefs below,
which are deliberately different from any other article's structure:

${outlineBlock}

Then, after the last section above, add:

## Frequently Asked Questions
-> 3-5 items as ### H3 headings with paragraph answers. MUST include: "Is EVIDIQ free to use?"
   (answer: the skill and install tools are free; verify_agent is pay-per-call via x402) and one
   about how the trust score can be verified independently. Vary the OTHER questions by topic —
   don't reuse the same filler questions every time.

Right after the FIRST H2 above (not necessarily a heading called "What Is..."), write a concise
40-60 word Featured Snippet paragraph that directly answers "what is [the keyword]" — even though
the heading itself is topic-specific, the first paragraph under it should still read as a clean,
quotable definition naming EVIDIQ.

INTERNAL LINKS (weave at least 3 naturally into body text):
${links}

CTA: End with a 2-3 sentence casual CTA paragraph (no heading) pointing a developer to
https://evidiq.dev/skill.md or https://evidiq.dev/playground.

OUTPUT FORMAT — return ONLY valid JSON (no markdown fence):
{
  "title": "...",
  "h1": "...",
  "excerpt": "...",
  "content": "...",
  "featured_image_prompt": "..."
}`;
}

// ── LLM call ─────────────────────────────────────────────────────────────

export interface GeneratedArticle {
  title: string;
  h1: string;
  excerpt: string;
  content: string;
  featuredImagePrompt: string;
  bodyImagePrompts: string[];
}

/**
 * Call the 0G router (MiniMax M3, thinking model) to generate a full EVIDIQ
 * article. MiniMax M3 spends a large <think> block before the JSON answer, so
 * max_tokens is generously sized (well above ZYVA's 24k) to avoid truncation.
 * Retries once at a lower temperature if the first response fails JSON parse.
 */
export async function generateArticle(opts: {
  keyword: string;
  title: string;
  angle: string;
  category: string;
  outline: OutlineSection[];
  wordCount?: number;
  internalLinks?: { url: string; anchor: string }[];
}): Promise<GeneratedArticle> {
  const { apiKey, baseUrl, model } = cfg();
  if (!apiKey) throw new Error("BLOG_LLM_API_KEY not set");

  const wordCount = opts.wordCount ?? 1600;
  const internalLinks =
    opts.internalLinks ?? [{ url: "https://evidiq.dev", anchor: "EVIDIQ" }];

  const userPrompt = buildUserPrompt({
    keyword: opts.keyword,
    title: opts.title,
    angle: opts.angle,
    category: opts.category,
    wordCount,
    outline: opts.outline,
    internalLinks,
  });

  const callLLM = async (
    temperature: number,
    maxTokens: number
  ): Promise<GeneratedArticle> => {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature,
        // MiniMax M3 is a reasoning model: it spends thousands of tokens on a
        // <think> block BEFORE the JSON answer. Sized generously (higher than
        // ZYVA's 24k) so reasoning + the ~1600-word JSON article never gets
        // cut mid-string.
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: AbortSignal.timeout(280_000),
    });
    if (!res.ok) {
      throw new Error(`Blog LLM ${res.status}: ${await res.text().catch(() => "")}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const finish = data.choices?.[0]?.finish_reason;
    const stripped = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    let clean = stripped.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) clean = clean.slice(firstBrace, lastBrace + 1);

    let parsed: {
      title: string;
      h1: string;
      excerpt: string;
      content: string;
      featured_image_prompt: string;
    };
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      const hint =
        finish === "length"
          ? " — LLM output was truncated (finish_reason=length); max_tokens too low"
          : "";
      throw new Error(`Blog JSON parse failed${hint}: ${(err as Error).message}`);
    }

    const bodyImagePrompts = extractBodyImagePrompts(parsed.content);
    return {
      title: fixYears(parsed.title),
      h1: fixYears(parsed.h1),
      excerpt: fixYears(parsed.excerpt),
      content: fixYears(parsed.content),
      featuredImagePrompt: parsed.featured_image_prompt,
      bodyImagePrompts,
    };
  };

  const meetsHardRequirements = (a: GeneratedArticle): boolean =>
    a.h1.toLowerCase().includes(opts.keyword.toLowerCase()) &&
    /\b(we|our|we've)\b/i.test(a.content);

  let article: GeneratedArticle;
  try {
    article = await callLLM(0.7, 32_000);
  } catch {
    // Retry lower-temperature with even more headroom, in case a verbose
    // reasoning pass crowded out the article on the first attempt.
    article = await callLLM(0.55, 40_000);
  }
  if (meetsHardRequirements(article)) return article;

  // One more attempt, explicitly told what it missed last time.
  const missing = [
    !article.h1.toLowerCase().includes(opts.keyword.toLowerCase())
      ? `the H1 did not contain the exact keyword "${opts.keyword}"`
      : null,
    !/\b(we|our|we've)\b/i.test(article.content) ? 'no first-person "we/our" voice was used' : null,
  ]
    .filter(Boolean)
    .join(" and ");
  const retryUser = `${userPrompt}\n\nNOTE: your previous attempt failed a hard requirement: ${missing}. Fix this exactly — do not change anything else about the structure.`;
  const retryRes = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: retryUser },
      ],
      temperature: 0.6,
      max_tokens: 40_000,
      stream: false,
    }),
    signal: AbortSignal.timeout(280_000),
  }).catch(() => null);
  if (!retryRes || !retryRes.ok) return article; // best-effort — ship what we have
  try {
    const data = (await retryRes.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const stripped = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    let clean = stripped.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const fb = clean.indexOf("{");
    const lb = clean.lastIndexOf("}");
    if (fb >= 0 && lb > fb) clean = clean.slice(fb, lb + 1);
    const parsed = JSON.parse(clean) as {
      title: string;
      h1: string;
      excerpt: string;
      content: string;
      featured_image_prompt: string;
    };
    const fixed: GeneratedArticle = {
      title: fixYears(parsed.title),
      h1: fixYears(parsed.h1),
      excerpt: fixYears(parsed.excerpt),
      content: fixYears(parsed.content),
      featuredImagePrompt: parsed.featured_image_prompt,
      bodyImagePrompts: extractBodyImagePrompts(parsed.content),
    };
    return meetsHardRequirements(fixed) ? fixed : article;
  } catch {
    return article; // best-effort — ship the earlier valid article
  }
}

/** Normalize wrong/stale/malformed years to the current year. */
export function fixYears(text: string, year = new Date().getUTCFullYear()): string {
  if (!text) return text;
  return text.replace(/\b20\d{3}\b/g, String(year)).replace(/\b202[0-5]\b/g, String(year));
}

/** Extract [IMAGE_PROMPT: …] placeholders from markdown content. */
export function extractBodyImagePrompts(content: string): string[] {
  const re = /\[IMAGE_PROMPT:\s*([^\]]+)\]/gi;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) out.push(m[1].trim());
  return out;
}

/** Replace [IMAGE_PROMPT: …] placeholders with real markdown images. */
export function injectImages(
  content: string,
  replacements: { placeholder: string; url: string; alt: string }[]
): string {
  let out = content;
  for (const r of replacements) {
    out = out.replace(`[IMAGE_PROMPT: ${r.placeholder}]`, `![${r.alt}](${r.url})`);
  }
  return out;
}

/** Generate a URL-safe slug from a title. */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80)
      .replace(/-$/, "") +
    "-" +
    crypto.randomBytes(3).toString("hex")
  );
}

/** Estimate read time from word count. */
export function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
