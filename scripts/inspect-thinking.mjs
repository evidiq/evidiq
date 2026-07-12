import { chromium } from "playwright";

const URL = process.env.DASH_URL;
const TOKEN = process.env.GW_TOKEN;

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);

const tok = page.locator('input[placeholder*="GATEWAY_TOKEN"]').first();
if (await tok.count()) {
  await tok.fill(TOKEN);
  await page.getByRole("button", { name: "Connect" }).click();
  await page.waitForTimeout(4000);
}

const ta = page.locator('textarea[placeholder*="Message Assistant"]').first();
await ta.click();
await ta.fill(
  "Verify agent 0xd6B658dC6e53444bF9Cba598aFdd21Ede0A62Fb9 with evidiq verify_agent (DeFi swaps on X Layer). Give the full trust report table and a decision."
);
await page.keyboard.press("Enter");

// High-frequency poll of the visible text length to see if the reply STREAMS
// (many small increments) or BLOBS in (few big jumps).
const t0 = Date.now();
let prev = -1;
let changes = 0;
for (let i = 0; i < 200; i++) {
  const len = await page.evaluate(() => document.body.innerText.length).catch(() => -1);
  if (len !== prev) {
    const d = len - (prev < 0 ? 0 : prev);
    console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s len=${len} (+${d})`);
    prev = len;
    changes++;
  }
  await page.waitForTimeout(180);
}
console.log("TOTAL_CHANGES", changes);
await browser.close();
console.log("DONE");
