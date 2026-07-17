/**
 * EVIDIQ product docs — single source of truth for the landing-page docs strip
 * and the /docs hub index. Add a new doc by appending to DOCS and creating
 * app/docs/<slug>/page.tsx + a hero image at public/docs/<slug>-hero.png.
 *
 * When a new MCP ships (the user targets one every 3 days), this is the only
 * file to edit on the landing-side (plus a new /docs/<slug> route).
 */

export type DocCard = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  endpoint: string;
  badge: string;
  badgeTone: "live" | "review" | "soon";
  tools: { name: string; paid: boolean }[];
  href: string;
  image: string;
};

export const DOCS: DocCard[] = [
  {
    slug: "evidiq",
    name: "EVIDIQ Trust Layer",
    tagline: "Verify capability · Score risk · Prove reputation",
    description:
      "Verify an agent's capability, score its risk, check its on-chain reputation, and return a signed Trust Report — anchored on 0G and analyzed in a TEE — before you transact.",
    endpoint: "https://evidiq.dev/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "how_to_install", paid: false },
      { name: "get_evidiq_skill", paid: false },
      { name: "verify_agent", paid: true },
    ],
    href: "/docs/evidiq",
    image: "/docs/evidiq-hero.png",
  },
  {
    slug: "notary",
    name: "EVIDIQ Notary",
    tagline: "Cryptographic receipts for AI outputs",
    description:
      "Submit a prompt + response + model id and receive a signed, timestamped, 0G-anchored receipt that anyone can verify offline. Two paid tools, four free.",
    endpoint: "https://mcp.evidiq.dev/notary/mcp",
    badge: "Under review",
    badgeTone: "review",
    tools: [
      { name: "notarize_inference", paid: true },
      { name: "notarize_batch", paid: true },
      { name: "verify_attestation", paid: false },
      { name: "get_receipt", paid: false },
      { name: "notary_stats", paid: false },
      { name: "notary_pubkey", paid: false },
    ],
    href: "/docs/notary",
    image: "/docs/notary-hero.png",
  },
];

/** Latest N docs for the landing-page strip (newest first = last-added first). */
export function latestDocs(n = 3): DocCard[] {
  return [...DOCS].reverse().slice(0, n);
}
