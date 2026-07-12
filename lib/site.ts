// Single source of truth for site chrome: nav, socials, ecosystem.

export const SITE = {
  name: "EVIDIQ",
  url: "https://evidiq.dev",
  tagline: "The trust layer for the AI agent economy",
};

export const NAV: { label: string; href: string }[] = [
  { label: "Playground", href: "/playground" },
  { label: "Stack", href: "/#stack" },
  { label: "How it works", href: "/#how" },
  { label: "Docs", href: "/docs" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

// GitHub and X are live; update the Telegram handle once the account exists.
export const SOCIALS = {
  github: "https://github.com/evidiq/evidiq",
  x: "https://x.com/evidiqdev",
  telegram: "https://t.me/evidiq",
};

// The protocols, chains, and frameworks EVIDIQ builds on / interoperates with.
// Rendered as the "founding ecosystem" grid (real logo where we have one,
// otherwise a monogram mark).
export const ECOSYSTEM: string[] = [
  "0G",
  "OKX Chain",
  "OKX AI",
  "X Layer",
  "x402",
  "ERC-8004",
  "EIP-3009",
  "MCP",
  "GenLayer",
  "MetaMask",
  "OpenClaw",
  "Hermes",
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

// Which ecosystem entries have a real brand logo (used by the partners grid).
// A logo is attached only where the entry genuinely is / rides on that brand.
export const ECOSYSTEM_LOGOS: Record<string, string> = {
  "0G": "/logos/0g.png",
  "OKX Chain": "/logos/okx.svg",
  "OKX AI": "/logos/okx.svg",
  "X Layer": "/logos/xlayer.svg",
  x402: "/logos/coinbase.svg",
  "ERC-8004": "/logos/ethereum.svg",
  "EIP-3009": "/logos/ethereum.svg",
  MCP: "/logos/anthropic.svg",
  GenLayer: "/logos/genlayer.png",
  MetaMask: "/logos/metamask.svg",
  OpenClaw: "/logos/openclaw.svg",
  Hermes: "/logos/hermes.svg",
  LangChain: "/logos/langchain.svg",
  AutoGen: "/logos/autogen.png",
  CrewAI: "/logos/crewai.svg",
  LlamaIndex: "/logos/llamaindex.png",
  Haystack: "/logos/haystack.png",
  "GLM-5.2": "/logos/glm.svg",
  viem: "/logos/viem.png",
  "Next.js": "/logos/nextdotjs.svg",
};
