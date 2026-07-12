import puppeteer from "puppeteer-core";

const URL = process.env.DASH_URL;
const TOKEN = process.env.GW_TOKEN;
const PROMPT =
  "Use the evidiq verify_agent tool to check the agent with id 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 and endpoint https://evidiq.dev/skill.md. Then report its trust score, tier, and recommendation in one short paragraph.";

const b = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const p = await b.newPage();
await p.setViewport({ width: 1300, height: 900 });
await p.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));

// connect with token
const tok = await p.$('input[placeholder*="GATEWAY_TOKEN"], input[placeholder*="token" i]');
if (tok) {
  await tok.click();
  await tok.type(TOKEN, { delay: 5 });
  for (const x of await p.$$("button")) {
    const t = (await p.evaluate((e) => e.innerText, x)).trim();
    if (t === "Connect") {
      await x.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 5000));
}

// type + send prompt
const ta = await p.waitForSelector('textarea[placeholder*="Message Assistant"]', { timeout: 15000 });
await ta.click();
await ta.type(PROMPT, { delay: 3 });
await p.keyboard.press("Enter");
console.log("prompt sent; waiting for agent response...");

for (let i = 1; i <= 7; i++) {
  await new Promise((r) => setTimeout(r, 15000));
  await p.screenshot({ path: `/tmp/chat-${i}.png` });
  const txt = await p.evaluate(() => document.body.innerText);
  const hit = /(trust score|\/\s?100|PROCEED|DO NOT PROCEED|recommendation|unverified|high)/i.test(txt);
  console.log(`t=${i * 15}s  responded=${hit}`);
  if (hit && i >= 3) break;
}
await p.screenshot({ path: "/tmp/chat-final.png" });
await b.close();
console.log("done");
