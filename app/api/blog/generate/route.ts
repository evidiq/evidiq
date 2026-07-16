/**
 * POST /api/blog/generate
 * Cron-only endpoint: generates exactly one EVIDIQ blog post per call.
 * Auth: internal cron secret (BLOG_CRON_SECRET) via x-cron-secret header.
 *
 * Schedule (systemd timer on hackaton-do): 2x/day — 00:00 and 12:00 UTC
 * (07:00 and 19:00 WIB).
 */

import { NextRequest, NextResponse } from "next/server";
import { runBlogPipeline } from "@/lib/blog-engine/pipeline";

export const runtime = "nodejs";
export const maxDuration = 600; // writing + image generation can be slow

function isCronAuth(req: NextRequest): boolean {
  const secret = process.env.BLOG_CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("x-cron-secret") === secret;
}

export async function POST(req: NextRequest) {
  if (!isCronAuth(req)) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const result = await runBlogPipeline();

  return NextResponse.json({
    success: result.ok,
    generated: [result],
  });
}

/** GET — health check only (no generation). */
export async function GET(req: NextRequest) {
  if (!isCronAuth(req)) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true, ready: Boolean(process.env.BLOG_LLM_API_KEY) });
}
