/**
 * EVIDIQ blog image generator — same shape as ZYVA's engine/blog/images.ts.
 * Generates the featured thumbnail + all in-body images via DigitalOcean
 * Inference (reused ZYVA key) and saves them to /public/blog/<slug>/.
 */

import fs from "fs";
import path from "path";
import { generateImage } from "./doImage";

const BLOG_PUBLIC_DIR = path.join(process.cwd(), "public", "blog");

function ensureDir(slug: string): string {
  const dir = path.join(BLOG_PUBLIC_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function downloadBytes(url: string): Promise<Buffer> {
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`Image download failed HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function generateAndSaveBlogImage(opts: {
  prompt: string;
  slug: string;
  filename: string;
  doApiKey: string;
  hasText?: boolean;
}): Promise<string | null> {
  try {
    const result = await generateImage(opts.doApiKey, opts.prompt, {
      hasText: opts.hasText ?? false,
      imageSize: "landscape_16_9",
    });

    let bytes: Buffer;
    let ext = "jpg";
    if (result.b64) {
      bytes = Buffer.from(result.b64, "base64");
      ext = "png";
    } else if (result.url) {
      bytes = await downloadBytes(result.url);
      ext = result.contentType?.includes("png") ? "png" : "jpg";
    } else {
      return null;
    }

    const dir = ensureDir(opts.slug);
    const fname = `${opts.filename}.${ext}`;
    fs.writeFileSync(path.join(dir, fname), bytes);
    // Served by app/blog-img/[...path]/route.ts (reads straight off disk on
    // every request) — NOT /blog/<slug>/<file>, which collides with the
    // /blog/[slug] page route and hit Next's unreliable static-file caching
    // for files written after the server started. See that route's doc
    // comment for the full story.
    return `/blog-img/${opts.slug}/${fname}`;
  } catch (e) {
    console.error("[blog-engine/images]", opts.filename, e instanceof Error ? e.message : e);
    return null;
  }
}

export interface BlogImageSet {
  featuredImage: string | null;
  bodyImages: { placeholder: string; url: string; alt: string }[];
}

/** Generate the featured + all body images for one post. Best-effort — a
 *  failed image never blocks the post from being saved. */
export async function generateAllBlogImages(opts: {
  slug: string;
  featuredPrompt: string;
  bodyImagePrompts: string[];
  doApiKey: string;
}): Promise<BlogImageSet> {
  const [featured, ...body] = await Promise.all([
    generateAndSaveBlogImage({
      prompt: opts.featuredPrompt,
      slug: opts.slug,
      filename: "hero",
      doApiKey: opts.doApiKey,
    }),
    ...opts.bodyImagePrompts.slice(0, 4).map((prompt, i) =>
      generateAndSaveBlogImage({
        prompt,
        slug: opts.slug,
        filename: `body-${i + 1}`,
        doApiKey: opts.doApiKey,
      })
    ),
  ]);

  const bodyImages = opts.bodyImagePrompts
    .slice(0, 4)
    .map((prompt, i) => ({
      placeholder: prompt,
      url: body[i] ?? "",
      alt: `EVIDIQ blog illustration ${i + 1}`,
    }))
    .filter((b) => !!b.url);

  return { featuredImage: featured, bodyImages };
}
