// Single source of truth for site chrome: nav, socials, ecosystem.

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

// The protocols, chains, and frameworks EVIDIQ builds on / interoperates with.
// Rendered as the "founding partners" text grid.
export const ECOSYSTEM: string[] = [
  "0G",
  "OKX Chain",
  "OKX AI",
  "X Layer",
  "x402",
  "ERC-8004",
  "EIP-3009",
  "MCP",
  "TEE + ZK",
  "Internet Court",
  "GenLayer",
  "MetaMask",
  "OpenClaw / Hermes",
  "LangChain",
  "AutoGen",
  "CrewAI",
  "LlamaIndex",
  "Haystack",
  "GLM-5.2",
  "viem",
  "Next.js",
];

// Real brand logos for the scrolling marquee (stored in /public/logos).
// Kept to the brands EVIDIQ genuinely builds on so the strip stays honest.
export type Brand = { name: string; src: string };
export const BRAND_LOGOS: Brand[] = [
  { name: "0G", src: "/logos/0g.png" },
  { name: "OKX", src: "/logos/okx.svg" },
  { name: "Ethereum", src: "/logos/ethereum.svg" },
  { name: "Anthropic · MCP", src: "/logos/anthropic.svg" },
  { name: "Coinbase · x402", src: "/logos/coinbase.svg" },
  { name: "MetaMask", src: "/logos/metamask.svg" },
  { name: "LangChain", src: "/logos/langchain.svg" },
  { name: "CrewAI", src: "/logos/crewai.svg" },
  { name: "Next.js", src: "/logos/nextdotjs.svg" },
];
