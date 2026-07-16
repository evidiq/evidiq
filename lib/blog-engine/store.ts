/**
 * File-based storage for EVIDIQ auto-blog posts (no database — EVIDIQ has
 * none, unlike ZYVA's Postgres/Prisma setup).
 *
 * Posts live as one JSON file per slug under content/blog/. In production
 * this directory is a bind-mounted host volume (see deploy/run.sh) so
 * generated posts survive container recreation on redeploy. Topic rotation
 * state lives in content/blog/_topics-state.json.
 */

import fs from "fs";
import path from "path";
import { EVIDIQ_INTERNAL_LINKS, SEED_TOPICS, type TopicDef } from "./topics";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const TOPICS_STATE_FILE = path.join(CONTENT_DIR, "_topics-state.json");

export type PostStatus = "draft" | "published";

export interface GeneratedPost {
  slug: string;
  title: string;
  h1: string;
  excerpt: string;
  content: string; // markdown
  category: string;
  tags: string[];
  readTime: string;
  featuredImage: string | null;
  bodyImages: { placeholder: string; url: string; alt: string }[];
  status: PostStatus;
  seoScore: number;
  humanityScore: number;
  keyword: string;
  topicId: string;
  createdAt: string;
  publishedAt: string | null;
}

function ensureDir(): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

function postPath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.json`);
}

export function savePost(post: GeneratedPost): void {
  ensureDir();
  fs.writeFileSync(postPath(post.slug), JSON.stringify(post, null, 2));
}

export function getPost(slug: string): GeneratedPost | null {
  try {
    const raw = fs.readFileSync(postPath(slug), "utf8");
    return JSON.parse(raw) as GeneratedPost;
  } catch {
    return null;
  }
}

/** All generated posts, newest first. Never throws — returns [] if the
 *  content directory doesn't exist yet (fresh deploy, no posts generated). */
export function listPosts(opts: { onlyPublished?: boolean } = {}): GeneratedPost[] {
  ensureDir();
  let files: string[] = [];
  try {
    files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  } catch {
    return [];
  }
  const posts = files
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as GeneratedPost;
      } catch {
        return null;
      }
    })
    .filter((p): p is GeneratedPost => p !== null);

  const filtered = opts.onlyPublished ? posts.filter((p) => p.status === "published") : posts;
  return filtered.sort((a, b) => {
    const ta = a.publishedAt ?? a.createdAt;
    const tb = b.publishedAt ?? b.createdAt;
    return tb.localeCompare(ta);
  });
}

// ── Topic rotation ──────────────────────────────────────────────────────────

type TopicsState = Record<string, string>; // topicId -> ISO lastUsedAt

function readTopicsState(): TopicsState {
  try {
    return JSON.parse(fs.readFileSync(TOPICS_STATE_FILE, "utf8")) as TopicsState;
  } catch {
    return {};
  }
}

function writeTopicsState(state: TopicsState): void {
  ensureDir();
  fs.writeFileSync(TOPICS_STATE_FILE, JSON.stringify(state, null, 2));
}

/** Pick the least-recently-used topic (never-used topics come first), and
 *  mark it used now. Cycles forever through the fixed seed list — with a
 *  small topic pool and an indefinite 2x/day schedule, round-robin is the
 *  right model (vs. ZYVA's "use once, re-seed when empty" for a bigger pool). */
export function pickNextTopic(): TopicDef {
  const state = readTopicsState();
  const sorted = [...SEED_TOPICS].sort((a, b) => {
    const ta = state[a.id] ?? "";
    const tb = state[b.id] ?? "";
    return ta.localeCompare(tb);
  });
  const topic = sorted[0];
  state[topic.id] = new Date().toISOString();
  writeTopicsState(state);
  return topic;
}

export function pickInternalLinks(count = 3): typeof EVIDIQ_INTERNAL_LINKS {
  return EVIDIQ_INTERNAL_LINKS.slice(0, count);
}
