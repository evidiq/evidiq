// Install / connect instructions for the EVIDIQ trust skill.
// Host-aware so the same code produces correct URLs on a preview deployment
// and on the final evidiq.dev domain.

export const PROD_BASE_URL = "https://evidiq.dev";

/** Normalize an incoming origin/base URL (no trailing slash). */
export function normalizeBaseUrl(input?: string | null): string {
  if (!input) return PROD_BASE_URL;
  return input.replace(/\/+$/, "");
}

/** The MCP Streamable-HTTP endpoint for a given host. */
export function mcpEndpoint(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}/mcp`;
}

/** The public skill document for a given host. */
export function skillUrl(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}/skill.md`;
}

/** The x402 pricing / challenge discovery endpoint for a given host. */
export function x402Endpoint(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}/x402`;
}

/**
 * The canonical "how to install / connect EVIDIQ" answer. Returns Markdown.
 *
 * EVIDIQ is a single open skill (served at /skill.md) plus a remote MCP server
 * that exposes the trust tools (verify capability, score risk, check
 * reputation, issue attestations). Agents can connect the MCP server directly
 * or drop the skill file into their skills directory.
 */
export function installInstructions(baseUrl: string): string {
  const base = normalizeBaseUrl(baseUrl);
  const mcp = mcpEndpoint(base);
  const skill = skillUrl(base);
  return `# Install the EVIDIQ trust skill

EVIDIQ is the trust layer for the AI agent economy. It lets your agent verify a
counterparty's capabilities, score its risk, check its on-chain reputation, and
attach a verifiable attestation to the verdict — before any value changes hands.

## Option A — Connect the EVIDIQ MCP server (recommended, zero-install)

Gives any MCP-capable agent live access to the EVIDIQ trust tools.

**Claude Code (CLI):**
\`\`\`bash
claude mcp add --transport http evidiq ${mcp}
\`\`\`

**Config file (\`mcp.json\` / \`.mcp.json\`):**
\`\`\`json
{
  "mcpServers": {
    "evidiq": { "url": "${mcp}" }
  }
}
\`\`\`

Then ask your agent to *"verify this agent with EVIDIQ before we transact."*

The \`how_to_install\` and \`get_evidiq_skill\` tools are free. The \`verify_agent\`
trust check is x402-paid: unauthenticated calls receive an HTTP 402 challenge,
and pricing discovery lives at ${x402Endpoint(base)}.

## Option B — Install the skill file into your agent

\`\`\`bash
curl -s ${skill} -o ~/.claude/skills/evidiq/SKILL.md
\`\`\`

Restart your agent and give it a commerce task — the skill routes it through the
verify → score → reputation → attest workflow, calling the MCP tools above.

## Verify the install

Ask your agent: *"Load EVIDIQ and explain how you'd vet a counterparty."* A
correct install leads with the discovery-first / trust-level framing rather than
protocol names, and knows to run \`verify_agent\` before recommending a deal.
`;
}
