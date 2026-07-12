// Render an asciinema cast into a crisp full-terminal MP4 via the asciinema web
// player inside headless chromium + playwright recording + ffmpeg-static.
// Not a GIF — real browser font rendering, sped up, idle gaps capped.
//
//   node scripts/term-video.mjs
// Input:  /tmp/evidiq-x402-v2.cast   Output: evidiq-terminal-demo.mp4

import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CAST = readFileSync("/tmp/evidiq-x402-v2.cast", "utf8");
const CSS = readFileSync("node_modules/asciinema-player/dist/bundle/asciinema-player.css", "utf8");
const JS = readFileSync("node_modules/asciinema-player/dist/bundle/asciinema-player.min.js", "utf8");
const OUT = "/home/cucu/Coder/Evidiq/evidiq-terminal-demo.mp4";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 1080 },
  deviceScaleFactor: 2,
  recordVideo: { dir: "/tmp/tvid", size: { width: 1280, height: 1080 } },
});
const page = await context.newPage();

await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;height:100vh;background:radial-gradient(90% 90% at 30% 20%,#141033,#0b0a1f);display:flex;align-items:center;justify-content:center;font-family:ui-monospace,Menlo,monospace">
    <div id="wrap" style="width:1080px;padding:20px 22px 24px;border-radius:14px;background:#181226;box-shadow:0 26px 80px rgba(0,0,0,.6);border:1px solid #2a2140">
      <div style="display:flex;align-items:center;gap:8px;margin:2px 4px 14px">
        <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#27c93f;display:inline-block"></span>
        <span style="margin-left:12px;color:#9a8fc0;font:600 12px ui-monospace,monospace;letter-spacing:.04em">EVIDIQ — x402 pay-per-call · X Layer</span>
      </div>
      <div id="player"></div>
    </div>
  </body></html>`,
  { waitUntil: "load" }
);

await page.addStyleTag({ content: CSS });
await page.addScriptTag({ content: JS });

await page.evaluate((cast) => {
  const blob = new Blob([cast], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  window.__ended = false;
  const p = AsciinemaPlayer.create(url, document.getElementById("player"), {
    autoPlay: true,
    speed: 1,
    idleTimeLimit: 3,
    fit: "width",
    controls: false,
  });
  p.addEventListener("ended", () => {
    window.__ended = true;
  });
}, CAST);

// Wait for playback to finish (fallback cap 40s).
const start = Date.now();
while (Date.now() - start < 40000) {
  if (await page.evaluate(() => window.__ended === true).catch(() => false)) break;
  await page.waitForTimeout(400);
}
await page.waitForTimeout(4000); // hold on the final frame (full Trust Report + 0G attestation)

const video = page.video();
await context.close();
const src = await video.path();
await browser.close();

execFileSync(
  ffmpegPath,
  [
    "-y", "-i", src,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "20",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-movflags", "+faststart",
    OUT,
  ],
  { stdio: "inherit" }
);
console.log("VIDEO:", OUT);
