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
  /** Omitted until the service actually has an OKX.AI agent id. */
  okxUrl?: string;
  /** OKX.AI agent id, so a doc page can render the listing without re-deriving it. */
  agentId?: number;
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
    agentId: 5232,
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
    agentId: 6278,
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
    agentId: 6504,
  },
  {
    slug: "sentinel",
    name: "EVIDIQ Sentinel",
    tagline: "Security preflight for autonomous agents",
    description:
      "Scan MCP endpoints, manifests, Agent Skills, and bundles before you connect, authorize, or pay. Signed reports, deterministic verdicts, 0G Compute, and 0G Storage evidence.",
    endpoint: "https://mcp.evidiq.dev/sentinel/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
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
    agentId: 7584,
  },
  {
    slug: "lineage",
    name: "EVIDIQ Lineage",
    tagline: "Supply-chain provenance & AI dependency risk",
    description:
      "Deterministic 14-rule supply-chain risk engine, SBOM (CycloneDX/SPDX), AI-BOM (CycloneDX-AI), license auditing, and live OSV advisory matching. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/lineage/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "verify_package_claim", paid: true },
      { name: "audit_licenses", paid: true },
      { name: "generate_sbom", paid: true },
      { name: "scan_dependencies", paid: true },
      { name: "generate_aibom", paid: true },
      { name: "lineage_capabilities", paid: false },
      { name: "validate_manifest", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_lineage_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/lineage",
    image: "/docs/lineage-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9575",
    agentId: 9575,
  },
  {
    slug: "atlas",
    name: "EVIDIQ Atlas",
    tagline: "Reproducible research for large datasets",
    description:
      "Profile, query, visualize, compare, and research CSV, JSON, NDJSON, or Parquet in a bounded in-memory DuckDB runtime. Canonical, optionally signed reports and content-addressed artifacts an agent can verify offline.",
    endpoint: "https://mcp.evidiq.dev/atlas/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "profile_dataset", paid: true },
      { name: "query_dataset", paid: true },
      { name: "visualize_dataset", paid: true },
      { name: "compare_datasets", paid: true },
      { name: "research_dataset", paid: true },
      { name: "atlas_capabilities", paid: false },
      { name: "validate_dataset_source", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_atlas_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/atlas",
    image: "/docs/atlas-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9023",
    agentId: 9023,
  },
  {
    slug: "vault",
    name: "EVIDIQ Vault",
    tagline: "Governed, tamper-evident memory & audit trail",
    description:
      "Append-only, hash-chained memory and audit logging for autonomous AI agents. SHA-256 prevHash linkage, 0G Merkle segment sealing, retention payload redaction, and secret detection. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/vault/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "append_record", paid: true },
      { name: "query_records", paid: true },
      { name: "seal_segment", paid: true },
      { name: "audit_report", paid: true },
      { name: "enforce_retention", paid: true },
      { name: "vault_capabilities", paid: false },
      { name: "validate_record", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_chain", paid: false },
      { name: "get_receipt", paid: false },
    ],
    href: "/docs/vault",
    image: "/docs/vault-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9622",
    agentId: 9622,
  },
  {
    slug: "redact",
    name: "EVIDIQ Redact",
    tagline: "Deterministic PII, credential & key redaction",
    description:
      "Checksum-validated detection and removal of sensitive data from text, documents, and datasets before an agent sends them anywhere. Luhn, mod-97, BIP-39 checksum, EIP-55, issuer key shapes. Signed reports, zero retention. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/redact/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "redact_text", paid: true },
      { name: "scan_document", paid: true },
      { name: "redact_document", paid: true },
      { name: "policy_check", paid: true },
      { name: "deidentify_dataset", paid: true },
      { name: "redact_capabilities", paid: false },
      { name: "validate_input", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_redaction_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/redact",
    image: "/docs/redact-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9700",
    agentId: 9700,
  },
  {
    slug: "warden",
    name: "EVIDIQ Warden",
    tagline: "Review agent-written code before it ships",
    description:
      "Deterministic review of diffs and files for injection, secrets, unsafe patterns, and complexity, with policy verdicts and a signed attestation. Built for code an agent wrote and nobody read. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/warden/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "review_diff", paid: true },
      { name: "review_files", paid: true },
      { name: "analyze_complexity", paid: true },
      { name: "check_policy", paid: true },
      { name: "attest_review", paid: true },
      { name: "warden_capabilities", paid: false },
      { name: "validate_source", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_review_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/warden",
    image: "/docs/warden-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9699",
    agentId: 9699,
  },
  {
    slug: "assay",
    name: "EVIDIQ Assay",
    tagline: "Read a transaction before you sign it",
    description:
      "Decode calldata, EIP-712 payloads, and unsigned transactions into plain-language intent, unwrapping multicall and execute wrappers. Allowance analysis, pinned-block simulation, bytecode-level counterparty screening, and signed intent attestation. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/assay/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "decode_transaction", paid: true },
      { name: "assess_approval", paid: true },
      { name: "simulate_transaction", paid: true },
      { name: "screen_counterparty", paid: true },
      { name: "attest_intent", paid: true },
      { name: "assay_capabilities", paid: false },
      { name: "validate_payload", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_assay_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/assay",
    image: "/docs/assay-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9727",
    agentId: 9727,
  },
  {
    slug: "rubric",
    name: "EVIDIQ Rubric",
    tagline: "Does this deliverable meet the contract?",
    description:
      "Deterministic acceptance checks for work an agent was paid for: JSON Schema conformance, grounding of quotes and numbers in the supplied sources, and a declarative criteria language. Returns PASS, REVIEW, BLOCK or REFUSED with the per-criterion results, signed and recomputable. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/rubric/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "check_schema", paid: true },
      { name: "verify_grounding", paid: true },
      { name: "check_acceptance", paid: true },
      { name: "diff_deliverable", paid: true },
      { name: "attest_acceptance", paid: true },
      { name: "rubric_capabilities", paid: false },
      { name: "validate_spec", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_rubric_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/rubric",
    image: "/docs/rubric-hero.svg",
    okxUrl: "https://www.okx.ai/agents/9848",
    agentId: 9848,
  },
  {
    slug: "bastion",
    name: "EVIDIQ Bastion",
    tagline: "Is this deployment configuration safe to apply?",
    description:
      "Deterministic infrastructure configuration auditor for Dockerfiles, GitHub Actions workflows, Kubernetes manifests, and IaC (Terraform / Compose). Non-root execution, secret protection, supply chain integrity, resource bounds, and signed attestations. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/bastion/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "scan_dockerfile", paid: true },
      { name: "scan_workflow", paid: true },
      { name: "scan_manifest", paid: true },
      { name: "scan_iac", paid: true },
      { name: "attest_deployment", paid: true },
      { name: "bastion_capabilities", paid: false },
      { name: "validate_config", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_bastion_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/bastion",
    image: "/docs/bastion-hero.svg",
    okxUrl: "https://www.okx.ai/agents/10359",
    agentId: 10359,
  },
  {
    slug: "aegis",
    name: "EVIDIQ Aegis",
    tagline: "Autonomous Financial Policy Engine & Budget Guard",
    description:
      "Autonomous financial policy engine, budget velocity caps, escrow release validation, fee surge protection, and signed attestation reports for AI agent transactions. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/aegis/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "verify_payment_policy", paid: true },
      { name: "audit_spending_window", paid: true },
      { name: "inspect_escrow_release", paid: true },
      { name: "guard_slippage_inflation", paid: true },
      { name: "attest_budget_verdict", paid: true },
      { name: "aegis_capabilities", paid: false },
      { name: "validate_transfer_params", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_aegis_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/aegis",
    image: "/docs/aegis-hero.svg",
    okxUrl: "https://www.okx.ai/agents/10367",
    agentId: 10367,
  },
  {
    slug: "circuit",
    name: "EVIDIQ Circuit",
    tagline: "Verifiable API Proxy, TLS Attestation & Circuit Breaker",
    description:
      "Verifiable API proxy, TLS certificate attestation, payload schema drift inspection, circuit breaker state machine enforcement, webhook signature verification, and 0G storage receipt anchoring. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/circuit/mcp",
    badge: "Listed on OKX.AI",
    badgeTone: "live",
    tools: [
      { name: "audit_endpoint_compliance", paid: true },
      { name: "inspect_payload_schema", paid: true },
      { name: "enforce_circuit_breaker", paid: true },
      { name: "verify_webhook_signature", paid: true },
      { name: "attest_exchange_receipt", paid: true },
      { name: "circuit_capabilities", paid: false },
      { name: "validate_request_params", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_circuit_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/circuit",
    image: "/docs/circuit-hero.svg",
    okxUrl: "https://www.okx.ai/agents/10377",
    agentId: 10377,
  },
  {
    slug: "bulwark",
    name: "EVIDIQ Bulwark",
    tagline: "Prompt Injection & LLM Input Safety Guard",
    description:
      "Deterministic prompt injection and LLM input safety guard. Scans for direct injection, indirect injection, jailbreak techniques, data exfiltration payloads, and system-prompt leak probes. EIP-191 signed attestations with 0G storage anchoring. Five paid tools, five free.",
    endpoint: "https://mcp.evidiq.dev/bulwark/mcp",
    badge: "Under OKX.AI review",
    badgeTone: "review",
    tools: [
      { name: "scan_prompt_injection", paid: true },
      { name: "scan_jailbreak_techniques", paid: true },
      { name: "scan_data_exfiltration", paid: true },
      { name: "scan_system_leak", paid: true },
      { name: "attest_prompt_safety", paid: true },
      { name: "bulwark_capabilities", paid: false },
      { name: "validate_prompt_input", paid: false },
      { name: "estimate_cost", paid: false },
      { name: "verify_bulwark_report", paid: false },
      { name: "get_artifact", paid: false },
    ],
    href: "/docs/bulwark",
    image: "/docs/bulwark-hero.svg",
    okxUrl: "https://www.okx.ai/agents/10385",
    agentId: 10385,
  },
];

/** Homepage order: the Core trust layer first, followed by specialist services. */
/**
 * Live catalog counters, derived from DOCS so the header can never drift from
 * the services and tools actually documented. Adding a service or a tool to
 * DOCS updates every surface that renders these numbers.
 */
export const MCP_COUNT = DOCS.length;
export const TOOL_COUNT = DOCS.reduce((total, doc) => total + doc.tools.length, 0);
export const PAID_TOOL_COUNT = DOCS.reduce(
  (total, doc) => total + doc.tools.filter((tool) => tool.paid).length,
  0
);

export function homepageDocs(): DocCard[] {
  const core = DOCS.find((doc) => doc.slug === "evidiq");
  const specialists = DOCS.filter((doc) => doc.slug !== "evidiq");
  return core ? [core, ...specialists] : specialists;
}