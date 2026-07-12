import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { installInstructions } from "@/lib/install";
import { evidiqSkill } from "@/lib/skill";
import {
  baseUrlFromRequest,
  currentBaseUrl,
  currentPayment,
  runWithBaseUrl,
} from "@/lib/request-context";
import { withX402Gate } from "@/lib/x402/gate";
import { assessAgent } from "@/lib/trust/score";
import { attestReport } from "@/lib/og/attest";
import { analyzeTrust } from "@/lib/og/compute";
import { probeEndpoint } from "@/lib/trust/probe";
import type { AgentDescriptor, TrustReport } from "@/lib/trust/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SERVER_INSTRUCTIONS = `EVIDIQ — the trust layer for the AI agent economy.
Before an agent transacts with, delegates to, or relies on another agent or a paid service,
this MCP server verifies the counterparty's capability, scores its risk, checks its on-chain
reputation, and returns a signed, storable Trust Report so the caller can decide: proceed,
escrow, or walk away.

Call "verify_agent" (x402-paid) for the core trust check. Call "how_to_install" and
"get_evidiq_skill" (free) to onboard. verify_agent returns a trust score (0-100), a tier, a
risk breakdown, an explicit recommendation, and — when 0G is configured — a verdict anchored
on 0G Storage and signed by the EVIDIQ key.`;

/** Compact human summary that leads the tool response before the JSON report. */
function summarize(report: TrustReport): string {
  const b = report.breakdown;
  const a = report.attestation;
  const lines = [
    `EVIDIQ Trust Report — ${report.agentId}`,
    `Score: ${report.trustScore}/100 (${report.tier.toUpperCase()})  ·  Recommendation: ${report.recommendation.replace(/_/g, " ").toUpperCase()}`,
    `Breakdown — identity ${b.identity} · capability ${b.capability} · reputation ${b.reputation} · risk ${b.risk}`,
    "",
    "Findings:",
    ...report.findings.map((f) => `  [${f.severity}] ${f.message}`),
  ];
  if (report.analysis) {
    lines.push(
      "",
      `AI risk analysis (${report.analysis.model}${report.analysis.teeVerified ? ", 0G TEE-verified" : ""}):`,
      report.analysis.text
    );
  }
  if (a) {
    lines.push(
      "",
      "Attestation:",
      `  method: ${a.method}`,
      `  reportHash: ${a.reportHash}`,
      ...(a.attester ? [`  attester: ${a.attester}`] : []),
      ...(a.signature ? [`  signature: ${a.signature}`] : []),
      ...(a.storageRoot ? [`  0G storage root: ${a.storageRoot}`] : []),
      ...(a.storageTx
        ? [`  0G storage tx: [${a.storageTx}](https://chainscan.0g.ai/tx/${a.storageTx})`]
        : []),
      ...(a.tee
        ? [
            `  0G TEE: ${a.tee.model} via provider ${a.tee.provider ? `[${a.tee.provider}](https://chainscan.0g.ai/address/${a.tee.provider})` : "?"} (req ${a.tee.requestId ?? "?"})`,
          ]
        : []),
      ...(a.note ? [`  note: ${a.note}`] : [])
    );
  }
  return lines.join("\n");
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "how_to_install",
      {
        title: "How to install / connect EVIDIQ",
        description:
          "Explain how to connect the EVIDIQ MCP server or install the EVIDIQ trust skill into your agent. Call this when the user asks to install, add, set up, or onboard EVIDIQ. Free.",
        inputSchema: {},
      },
      async () => ({
        content: [
          { type: "text", text: installInstructions(currentBaseUrl()) },
        ],
      })
    );

    server.registerTool(
      "get_evidiq_skill",
      {
        title: "Get the EVIDIQ trust skill",
        description:
          "Fetch the latest EVIDIQ agent skill (markdown, open-skill format) so you can load and act on it — the verify → score → reputation → attest workflow and routing tables. Free.",
        inputSchema: {},
      },
      async () => ({
        content: [{ type: "text", text: evidiqSkill(currentBaseUrl()) }],
      })
    );

    server.registerTool(
      "verify_agent",
      {
        title: "Verify an agent and get a Trust Report (paid, x402)",
        description:
          "The core EVIDIQ trust check. Given an agent to transact with, verifies its capability, scores its risk, checks its on-chain reputation, and returns a Trust Report (score, tier, breakdown, recommendation) with a signed attestation anchored on 0G. x402-paid: calls without a valid payment header receive an HTTP 402 challenge (pricing at GET /x402). Supply everything you know about the counterparty for the sharpest verdict.",
        inputSchema: {
          agentId: z
            .string()
            .describe(
              "A stable identifier for the agent being checked (address, URL, name, or id)."
            ),
          endpoint: z
            .string()
            .optional()
            .describe(
              "The agent's service URL / MCP endpoint. EVIDIQ probes it for a live trust signal."
            ),
          declaredCapabilities: z
            .array(z.string())
            .optional()
            .describe("Capabilities the agent claims to have."),
          framework: z
            .string()
            .optional()
            .describe("Framework the agent is built on (LangChain, AutoGen, …)."),
          identity: z
            .object({
              address: z.string().optional(),
              ens: z.string().optional(),
              erc8004Id: z.string().optional(),
              domain: z.string().optional(),
            })
            .optional()
            .describe("Identity anchors: EVM address, ENS, ERC-8004 id, domain."),
          context: z
            .string()
            .optional()
            .describe("What the deal is about / why the check is being run."),
        },
      },
      async (args) => {
        const input: AgentDescriptor = {
          agentId: args.agentId,
          endpoint: args.endpoint,
          declaredCapabilities: args.declaredCapabilities,
          framework: args.framework,
          identity: args.identity,
          context: args.context,
        };
        const probe = await probeEndpoint(input.endpoint);
        const report = assessAgent(input, probe);
        const analysis = await analyzeTrust(report);
        if (analysis) report.analysis = analysis;
        report.attestation = await attestReport(report);

        const payment = currentPayment();
        const paidLine = payment
          ? `Payment verified from ${payment.payer}${payment.transaction ? ` — settlement tx [${payment.transaction}](https://www.oklink.com/xlayer/tx/${payment.transaction})` : ""}.\n\n`
          : "";

        return {
          content: [
            { type: "text", text: paidLine + summarize(report) },
            { type: "text", text: JSON.stringify(report, null, 2) },
          ],
        };
      }
    );

    server.registerResource(
      "evidiq-skill",
      "evidiq://skill",
      {
        title: "EVIDIQ trust skill (latest)",
        description: "The latest EVIDIQ agent skill, in open-skill markdown format.",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: evidiqSkill(currentBaseUrl()),
          },
        ],
      })
    );
  },
  {
    instructions: SERVER_INSTRUCTIONS,
    capabilities: { tools: {}, resources: {} },
  },
  {
    basePath: "",
    maxDuration: 60,
    verboseLogs: false,
  }
);

// x402 gate: no-op unless X402_* env vars are configured (see lib/x402/config.ts).
const gatedHandler = withX402Gate(handler);

// Wrap so tools can derive the public base URL from the actual request host.
function withContext(req: Request): Promise<Response> {
  return runWithBaseUrl(baseUrlFromRequest(req), () => gatedHandler(req));
}

export { withContext as GET, withContext as POST, withContext as DELETE };
