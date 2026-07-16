/**
 * Serves generated blog images by reading them straight off disk on every
 * request — deliberately NOT via Next's /public static-file serving.
 *
 * Why: images for auto-generated posts are written to disk WHILE the server
 * is already running (the cron hits /api/blog/generate, there is no rebuild
 * or restart in between). Next's /public serving proved unreliable for files
 * that appear after the server has started — requests 404'd (with the
 * App Router's own 404 page, confirmed by the `vary: rsc, next-router-*`
 * response headers) even though the file existed on disk, and the 404
 * persisted until the process was restarted. A plain route handler has no
 * such cache: it stats/reads the file fresh every time.
 */

import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Never cache/prerender this handler. Without this, Next 15 treats the GET as
// statically cacheable and freezes whatever it returned at build time — and at
// build time public/blog is empty, so every request would 404 forever until a
// restart. force-dynamic + revalidate 0 make it stat/read the file per request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOG_PUBLIC_DIR = path.join(process.cwd(), "public", "blog");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Reject path traversal / anything outside the blog images directory.
  if (!segments.length || segments.some((s) => s.includes("..") || s.includes("/"))) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(segments[segments.length - 1]).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return new Response("Not found", { status: 404 });

  const filePath = path.join(BLOG_PUBLIC_DIR, ...segments);
  // Defense in depth: resolved path must still be inside BLOG_PUBLIC_DIR.
  if (!filePath.startsWith(BLOG_PUBLIC_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const st = await stat(filePath);
    if (!st.isFile()) return new Response("Not found", { status: 404 });
    const bytes = await readFile(filePath);
    return new Response(bytes, {
      status: 200,
      headers: {
        "content-type": contentType,
        "content-length": String(st.size),
        // Images are content-hashed by filename-per-post, but posts can be
        // regenerated under the same slug during testing — keep caching
        // short rather than immutable.
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
