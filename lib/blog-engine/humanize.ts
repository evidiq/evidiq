/**
 * Humanity scorer for EVIDIQ blog posts — ported from ZYVA's
 * engine/blog/humanize.ts. Detects AI-writing patterns; score 0-100, posts
 * must hit >= 80 before auto-publishing.
 */

export interface HumanityCheck {
  label: string;
  penalty: number;
  triggered: boolean;
  detail?: string;
}

export interface HumanityResult {
  score: number;
  checks: HumanityCheck[];
  passes: boolean;
}

const CLICHE_PHRASES = [
  "in today's fast-paced",
  "in the ever-evolving",
  "it's important to note",
  "in conclusion,",
  "let's dive in",
  "look no further",
  "game-changer",
  "revolutionize",
  "unlock the potential",
  "leverage ",
  "whether you're a",
  "at the end of the day,",
  "needless to say,",
  "it goes without saying",
  "in a nutshell,",
  "rest assured",
  "as per",
  "utilize ",
  "delve into",
  "it is worth noting",
];

function sentenceVariety(text: string): { ok: boolean; avgLen: number; cv: number } {
  const sentences = text
    .replace(/[^\w.!?]+$/, "")
    .split(/[.!?]+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 2);
  if (sentences.length < 5) return { ok: true, avgLen: 0, cv: 0 };
  const avg = sentences.reduce((a, b) => a + b, 0) / sentences.length;
  const std = Math.sqrt(sentences.reduce((s, l) => s + (l - avg) ** 2, 0) / sentences.length);
  const cv = std / avg;
  return { ok: cv >= 0.28, avgLen: Math.round(avg), cv: Math.round(cv * 100) / 100 };
}

function paragraphOpenings(text: string): { ok: boolean; repeats: string[] } {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 20);
  const openers = paragraphs.map((p) => p.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase());
  const freq = new Map<string, number>();
  for (const o of openers) freq.set(o, (freq.get(o) ?? 0) + 1);
  const repeats = [...freq.entries()].filter(([, c]) => c > 2).map(([w]) => w);
  return { ok: repeats.length === 0, repeats };
}

function hasFirstPerson(text: string): boolean {
  return /\b(we|our|we've|we're|honestly|in my|from my)\b/i.test(text);
}

function hasRhetoricalQuestions(text: string): boolean {
  return (text.match(/\?/g) || []).length >= 2;
}

export function scoreHumanity(content: string): HumanityResult {
  const lower = content.toLowerCase();
  const checks: HumanityCheck[] = [];
  let penalty = 0;

  for (const phrase of CLICHE_PHRASES) {
    if (lower.includes(phrase)) {
      const p = 5;
      penalty += p;
      checks.push({ label: `Cliché: "${phrase}"`, penalty: p, triggered: true, detail: "Remove or rephrase" });
    }
  }

  const sv = sentenceVariety(content);
  if (!sv.ok) {
    const p = 10;
    penalty += p;
    checks.push({
      label: "Sentence length too uniform",
      penalty: p,
      triggered: true,
      detail: `avg ${sv.avgLen} words, CV=${sv.cv} (need >=0.28)`,
    });
  } else {
    checks.push({ label: "Sentence length variety", penalty: 0, triggered: false, detail: `CV=${sv.cv}` });
  }

  const po = paragraphOpenings(content);
  if (!po.ok) {
    const p = 8;
    penalty += p;
    checks.push({ label: "Repeated paragraph openers", penalty: p, triggered: true, detail: po.repeats.join(", ") });
  } else {
    checks.push({ label: "Paragraph opener diversity", penalty: 0, triggered: false });
  }

  if (!hasFirstPerson(content)) {
    const p = 5;
    penalty += p;
    checks.push({ label: "Missing first-person voice (we/our)", penalty: p, triggered: true });
  } else {
    checks.push({ label: "First-person voice present", penalty: 0, triggered: false });
  }

  if (!hasRhetoricalQuestions(content)) {
    const p = 4;
    penalty += p;
    checks.push({ label: "No rhetorical questions", penalty: p, triggered: true });
  } else {
    checks.push({ label: "Rhetorical questions found", penalty: 0, triggered: false });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, checks, passes: score >= 80 };
}
