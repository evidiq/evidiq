#!/usr/bin/env node
/**
 * EVIDIQ Blog Cron Worker — runs on the VPS, calls the internal API via
 * localhost (avoids any edge/proxy timeout), generous 10-minute timeout.
 *
 * Scheduled via systemd timer 2x/day: 00:00 and 12:00 UTC (07:00 and 19:00 WIB).
 * Run manually: cd /root/evidiq-src && export $(grep -v '^#' /root/evidiq.env | xargs) && node scripts/blog-cron.mjs
 */

const CRON = process.env.BLOG_CRON_SECRET || "";
if (!CRON) {
  console.error("[blog-cron] BLOG_CRON_SECRET not set");
  process.exit(1);
}

console.log("[blog-cron] Starting — generating 1 post");

const { default: http } = await import("http");

const result = await new Promise((resolve, reject) => {
  const req = http.request(
    {
      hostname: "localhost",
      port: 3010,
      path: "/api/blog/generate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": 0,
        "x-cron-secret": CRON,
      },
      timeout: 600_000,
    },
    (res) => {
      let raw = "";
      res.on("data", (c) => {
        raw += c;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error(`Bad JSON: ${raw.slice(0, 300)}`));
        }
      });
    }
  );
  req.on("error", reject);
  req.on("timeout", () => {
    req.destroy(new Error("Request timed out after 10 min"));
  });
  req.end();
});

console.log("[blog-cron] Result:", JSON.stringify(result, null, 2));
if (!result.success) {
  console.error("[blog-cron] Pipeline error");
  process.exit(1);
}
for (const g of result.generated || []) {
  if (g.ok) {
    console.log(`[blog-cron] done: ${g.slug} status=${g.status} seo=${g.seoScore} humanity=${g.humanityScore}`);
  } else {
    console.error(`[blog-cron] failed: ${g.error}`);
  }
}
console.log("[blog-cron] Done.");
