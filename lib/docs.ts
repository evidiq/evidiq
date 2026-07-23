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
  okxUrl: string;
};

export const DOCS: DocCard[] = [
  {
    slug: "evidiq",
    name: "EVIDIQ Core",
    tagline: "Verify capability · Score risk · Prove reputation",
    description:
      "The trust layer for agent transactions: verify capability and identity, score interaction risk, and return a signed Trust Report backed by 0G evidence before value moves.",
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
    okxUrl: "https://www.okx.ai/agents/5232",
  },
  {
    slug: "notary",
    name: "EVIDIQ Notary",
    tagline: "Cryptographic receipts for AI outputs",
    description:
      "Submit a prompt + response + model id and receive a signed, timestamped, 0G-anchored receipt that anyone can verify offline. Two paid tools, four free.",
    endpoint: "https://mcp.evidiq.dev/notary/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
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
    okxUrl: "https://www.okx.ai/agents/6278",
  },
  {
    slug: "operator",
    name: "EVIDIQ Operator",
    tagline: "Computer Use Infrastructure for AI Agents",
    description:
      "Drive a real browser from natural language — login, fill forms, download docs, extract data, run multi-step workflows. GPT-5.6-Terra via 0G Compute plans each action. 7 paid tools, 4 free.",
    endpoint: "https://mcp.evidiq.dev/operator/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "browser_task", paid: true },
      { name: "login_and_extract", paid: true },
      { name: "fill_form", paid: true },
      { name: "download_document", paid: true },
      { name: "navigate", paid: true },
      { name: "screenshot", paid: true },
      { name: "multi_step_workflow", paid: true },
      { name: "health", paid: false },
      { name: "capabilities", paid: false },
      { name: "supported_targets", paid: false },
      { name: "estimate_cost", paid: false },
    ],
    href: "/docs/operator",
    image: "/docs/operator-hero.png",
    okxUrl: "https://www.okx.ai/agents/6504",
  },
  {
    slug: "sentinel",
    name: "EVIDIQ Sentinel",
    tagline: "Security preflight for autonomous agents",
    description:
      "Scan MCP endpoints, manifests, Agent Skills, and bundles before you connect, authorize, or pay. Signed reports, deterministic verdicts, 0G Compute, and 0G Storage evidence.",
    endpoint: "https://mcp.evidiq.dev/sentinel/mcp",
    badge: "Under OKX.AI review",
    badgeTone: "review",
    tools: [
      { name: "scan_mcp_endpoint", paid: true },
      { name: "scan_mcp_manifest", paid: true },
      { name: "scan_agent_skill", paid: true },
      { name: "scan_bundle", paid: true },
      { name: "sentinel_capabilities", paid: false },
      { name: "validate_scan_target", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_scan_report", paid: false },
    ],
    href: "/docs/sentinel",
    image: "/docs/sentinel-hero.svg",
    okxUrl: "https://www.okx.ai/agents/7584",
  },
];

/** Homepage order: the Core trust layer first, followed by specialist services. */
export function homepageDocs(): DocCard[] {
  const core = DOCS.find((doc) => doc.slug === "evidiq");
  const specialists = DOCS.filter((doc) => doc.slug !== "evidiq");
  return core ? [core, ...specialists] : specialists;
}
