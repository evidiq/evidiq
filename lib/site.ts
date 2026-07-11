// Single source of truth for site chrome: nav, socials, ticker.

export const SITE = {
  name: "EVIDIQ",
  url: "https://evidiq.dev",
  tagline: "The trust layer for the AI agent economy",
};

export const NAV: { label: string; href: string }[] = [
  { label: "Stack", href: "/#stack" },
  { label: "How it works", href: "/#how" },
  { label: "Docs", href: "/docs" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

// GitHub is live; update the X / Telegram handles once the accounts exist.
export const SOCIALS = {
  github: "https://github.com/evidiq/evidiq",
  x: "https://x.com/evidiq_dev",
  telegram: "https://t.me/evidiq",
};

// Short phrases that scroll in the top ticker.
export const TICKER: string[] = [
  "Live on 0G mainnet",
  "curl -s https://evidiq.dev/skill.md",
  "GLM-5.2 · TEE-verified trust reports",
  "Connect MCP → evidiq.dev/mcp",
  "Verify · Score · Trust — before every AI transaction",
  "x402 pay-per-call ready",
  "Evidence anchored on 0G Storage",
];
