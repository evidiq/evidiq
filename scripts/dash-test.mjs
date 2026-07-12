import puppeteer from "puppeteer-core";

const URL = process.env.DASH_URL;
const TOKEN = process.env.GW_TOKEN;

const b = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const p = await b.newPage();
await p.setViewport({ width: 1300, height: 900 });

await p.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));
await p.screenshot({ path: "/tmp/dash-a.png" });

// If an auth form is present, fill the gateway token and connect.
const tokenEl = await p.$('input[placeholder*="GATEWAY_TOKEN"], input[placeholder*="token" i]');
if (tokenEl) {
  await tokenEl.click();
  await tokenEl.type(TOKEN, { delay: 5 });
  const btns = await p.$$("button");
  for (const btn of btns) {
    const t = (await p.evaluate((e) => e.innerText, btn)).trim();
    if (t === "Connect") {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 5000));
}
await p.screenshot({ path: "/tmp/dash-b.png" });

// Dump the current DOM's inputs / textareas / buttons so we can find the chat box.
const info = await p.evaluate(() => {
  const ins = [...document.querySelectorAll("input,textarea")].map((i) => ({
    tag: i.tagName,
    ph: i.placeholder || "",
    type: i.type || "",
    aria: i.getAttribute("aria-label") || "",
  }));
  const bs = [...document.querySelectorAll("button")]
    .map((x) => (x.innerText || x.getAttribute("aria-label") || "").trim())
    .filter(Boolean);
  const bodyText = document.body.innerText.slice(0, 400);
  return { inputs: ins, buttons: bs, bodyText };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
