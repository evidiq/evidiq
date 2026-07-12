import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";

const URL = process.env.DASH_URL;
const TOKEN = process.env.GW_TOKEN;
const OUT = "/home/cucu/Coder/Evidiq/evidiq-dashboard-demo.mp4";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  recordVideo: { dir: "/tmp/vid", size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);

// connect with gateway token
const tok = page.locator('input[placeholder*="GATEWAY_TOKEN"]').first();
if (await tok.count()) {
  await tok.click();
  await tok.pressSequentially(TOKEN, { delay: 16 }); // visibly type the gateway token
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Connect" }).click();
  await page.waitForTimeout(4000);
}

// Start a FRESH session (click "New session") so the demo NEVER inherits context
// from a previous chat. Without this, connecting resumes the last session and the
// agent summarizes old/leaked checks (that's what put a bogus "X Layer" row in).
try {
  const newBtn = page.getByRole("button", { name: /New session/i }).first();
  if (await newBtn.count()) {
    await newBtn.click();
    await page.waitForTimeout(2000);
  }
} catch {}

// Reply is DONE when the Stop/Cancel button disappears. This correctly waits
// through the tool-execution phase (where the reply text is momentarily static),
// so we never type the next message while the agent is still working.
async function waitForReply(maxMs) {
  const start = Date.now();
  let sawBusy = false;
  while (Date.now() - start < maxMs) {
    const stop = await page
      .evaluate(() => {
        const vis = (el) => el && el.offsetParent !== null;
        return Array.from(document.querySelectorAll("button")).filter(
          (b) => vis(b) && /stop|cancel/i.test(b.getAttribute("aria-label") || b.textContent || "")
        ).length;
      })
      .catch(() => 0);
    if (stop > 0) sawBusy = true;
    else if (sawBusy) break; // was generating, now finished
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(900);
}

// After a reply completes, pan through the FULL report so the entire result is
// visible: the report is taller than the viewport and the dashboard otherwise
// leaves it scrolled to the bottom. We frame the top, hold, then glide down.
async function reviewReport() {
  const ok = await page.evaluate(() => {
    const cands = Array.from(document.querySelectorAll("*")).filter((e) => {
      const s = getComputedStyle(e);
      return (
        (s.overflowY === "auto" || s.overflowY === "scroll") &&
        e.scrollHeight > e.clientHeight + 120
      );
    });
    cands.sort((a, b) => b.scrollHeight - a.scrollHeight);
    const c = cands[0];
    if (!c) return false;
    c.dataset.evScroll = "1";
    return true;
  });
  if (!ok) {
    await page.waitForTimeout(2500);
    return;
  }
  const S = '[data-ev-scroll="1"]';
  // Go to the very bottom, then jump up ~2.4 viewports to frame the report's top.
  await page.evaluate((s) => {
    const c = document.querySelector(s);
    c.scrollTop = c.scrollHeight;
  }, S);
  await page.waitForTimeout(400);
  await page.evaluate((s) => {
    const c = document.querySelector(s);
    c.scrollTop = Math.max(0, c.scrollTop - c.clientHeight * 2.4);
  }, S);
  await page.waitForTimeout(1600); // hold on the score table / top of the report
  // Glide down to the bottom in small steps so the whole report scrolls past.
  for (let i = 0; i < 12; i++) {
    const atEnd = await page.evaluate((s) => {
      const c = document.querySelector(s);
      const end = c.scrollTop + c.clientHeight >= c.scrollHeight - 4;
      if (!end) c.scrollTop = Math.min(c.scrollHeight, c.scrollTop + c.clientHeight * 0.3);
      return end;
    }, S);
    if (atEnd) break;
    await page.waitForTimeout(650);
  }
  await page.waitForTimeout(1000);
}

// Type like a human so the message is VISIBLY composed in the input before sending.
async function ask(prompt, maxWaitMs) {
  const ta = page.locator('textarea[placeholder*="Message Assistant"]').first();
  await ta.click();
  await ta.pressSequentially(prompt, { delay: 22 }); // visible char-by-char typing
  await page.waitForTimeout(1000); // hold so the viewer reads the composed message
  await page.keyboard.press("Enter");
  await waitForReply(maxWaitMs);
  await page.waitForTimeout(1000); // brief settle after completion
  await reviewReport(); // pan through the whole report so the full result is visible
}

// Scenario 1 — sketchy agent → WALK AWAY
await ask(
  "A cold-DM 'airdrop bot' (id airdrop-bot, endpoint http://sketchy-agent.invalid) wants 250 USDC upfront for 10x returns. Verify it with EVIDIQ first — call verify_agent (this pays via x402 on X Layer). FIRST show the x402 payment (USDC amount paid + the X Layer settlement tx as a clickable OKLink explorer link), then present the FULL Trust Report as a clean markdown table — Trust Score & tier, the Identity / Capability / Reputation / Risk breakdown with notes, key findings, the 0G attestation (keep the storage tx as a clickable link), and end with a clear Decision: PROCEED, ESCROW, or WALK AWAY.",
  75000
);
// Scenario 2 — verified vendor → PROCEED
await ask(
  "Now verify a real vendor before paying it 250 USDC. Call verify_agent with agentId 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984, endpoint https://evidiq.dev/skill.md, declaredCapabilities ['token price feeds','on-chain data indexing','swap routing'], framework 'LangChain', and identity { address: 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984, erc8004Id: 1024, domain: evidiq.dev } (this pays via x402 on X Layer). FIRST show the x402 payment (USDC amount + X Layer settlement tx as a clickable OKLink link), then present the FULL Trust Report as a clean markdown table — Trust Score & tier, the Identity / Capability / Reputation / Risk breakdown with notes, key findings, the 0G attestation (keep the storage tx as a clickable link), and end with a clear Decision.",
  75000
);
await page.waitForTimeout(2500);

const video = page.video();
await context.close();
const src = await video.path();
await browser.close();

execFileSync(
  ffmpegPath,
  ["-y", "-i", src, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-movflags", "+faststart", OUT],
  { stdio: "inherit" }
);
console.log("VIDEO:", OUT);
