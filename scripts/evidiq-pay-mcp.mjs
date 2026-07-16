// EVIDIQ x402 payment MCP server (local, streamable-http).
//
// Gives an agent (OpenClaw) a `verify_agent` tool that AUTO-PAYS EVIDIQ's
// x402-gated verify_agent on X Layer: call -> 402 -> sign EIP-3009 -> retry
// with PAYMENT-SIGNATURE -> return the Trust Report + the on-chain settlement tx.
//
// This is the buyer wire-dance (scripts/x402-pay-test.mjs) wrapped as an MCP
// tool so the agent can pay for a paid MCP service — the core OKX A2MCP flow.
//
// Run from the Evidiq repo root (so node_modules resolves):
//   BUYER_KEY=0x<64hex> node scripts/evidiq-pay-mcp.mjs
// Then point OpenClaw at http://127.0.0.1:8402/mcp (transport: streamable-http).

import http from "node:http";
import { randomBytes } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { privateKeyToAccount } from "viem/accounts";

const PORT = Number(process.env.PAY_MCP_PORT || 8402);
const EVIDIQ_MCP = process.env.EVIDIQ_MCP_URL || "https://evidiq.dev/mcp";
const KEY = process.env.BUYER_KEY;

if (!KEY || !/^0x[0-9a-fA-F]{64}$/.test(KEY)) {
  console.error("evidiq-pay-mcp: set BUYER_KEY=0x<64-hex private key> (holds USDT0 on X Layer)");
  process.exit(1);
}
const account = privateKeyToAccount(KEY);
const b64 = (o) => Buffer.from(JSON.stringify(o), "utf8").toString("base64");

/** Run the full x402 buyer flow against EVIDIQ for the given verify_agent args. */
async function payAndVerify(args) {
  let sessionId = null;
  const H = (extra = {}) => ({
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    ...extra,
  });
  const rpc = (o) => JSON.stringify({ jsonrpc: "2.0", ...o });
  const callBody = () =>
    rpc({ id: 2, method: "tools/call", params: { name: "verify_agent", arguments: args } });

  const init = await fetch(EVIDIQ_MCP, {
    method: "POST",
    headers: H(),
    body: rpc({
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "evidiq-pay-mcp", version: "1.0" },
      },
    }),
  });
  sessionId = init.headers.get("mcp-session-id");
  if (sessionId) {
    await fetch(EVIDIQ_MCP, {
      method: "POST",
      headers: H(),
      body: rpc({ method: "notifications/initialized" }),
    }).catch(() => {});
  }

  // Unpaid call — expect 402 (or 200 if EVIDIQ is in free mode).
  const first = await fetch(EVIDIQ_MCP, { method: "POST", headers: H(), body: callBody() });
  if (first.status === 200) {
    return { paid: false, note: "EVIDIQ is in FREE mode — no payment required.", body: await first.text() };
  }
  if (first.status !== 402) {
    throw new Error(`expected 402, got ${first.status}: ${(await first.text()).slice(0, 300)}`);
  }
  const reqs = (await first.json())?.accepts?.[0];
  if (!reqs) throw new Error("402 challenge had no accepts[] payment requirements");

  // Sign EIP-3009 transferWithAuthorization (gasless; the seller settles).
  const now = Math.floor(Date.now() / 1000);
  const authorization = {
    from: account.address,
    to: reqs.payTo,
    value: reqs.amount,
    validAfter: "0",
    validBefore: String(now + 600),
    nonce: "0x" + randomBytes(32).toString("hex"),
  };
  const signature = await account.signTypedData({
    domain: {
      name: reqs.extra.name,
      version: reqs.extra.version,
      chainId: Number(reqs.network.split(":")[1]),
      verifyingContract: reqs.asset,
    },
    types: {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    message: {
      from: authorization.from,
      to: authorization.to,
      value: BigInt(authorization.value),
      validAfter: 0n,
      validBefore: BigInt(now + 600),
      nonce: authorization.nonce,
    },
  });
  const paymentSignature = b64({
    x402Version: 2,
    accepted: reqs,
    payload: { signature, authorization },
  });

  // Retry with PAYMENT-SIGNATURE → EVIDIQ verifies + settles on X Layer.
  const paid = await fetch(EVIDIQ_MCP, {
    method: "POST",
    headers: H({ "payment-signature": paymentSignature }),
    body: callBody(),
  });
  if (paid.status === 402) {
    throw new Error(`payment rejected: ${(await paid.text()).slice(0, 200)}`);
  }
  let settle = null;
  const pr = paid.headers.get("payment-response");
  if (pr) {
    try {
      settle = JSON.parse(Buffer.from(pr, "base64").toString("utf8"));
    } catch {}
  }
  return {
    paid: true,
    amount: reqs.amount,
    asset: reqs.asset,
    network: reqs.network,
    payTo: reqs.payTo,
    settle,
    body: await paid.text(),
  };
}

/** Pull the human-readable tool text out of the MCP (SSE or JSON) response body. */
function extractReport(body) {
  const texts = [];
  for (const line of body.split("\n")) {
    const s = line.startsWith("data:") ? line.slice(5).trim() : line.trim();
    if (!s.startsWith("{")) continue;
    try {
      const j = JSON.parse(s);
      const content = j?.result?.content;
      if (Array.isArray(content)) {
        for (const c of content) if (c?.type === "text" && c.text) texts.push(c.text);
      }
    } catch {}
  }
  // First text block is the human summary (score, breakdown, findings, attestation).
  return texts[0] || texts.join("\n\n") || body.slice(0, 1200);
}

function buildServer() {
  const server = new McpServer(
    { name: "evidiq-x402", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.registerTool(
    "verify_agent",
    {
      title: "Verify an agent via EVIDIQ (auto-pays x402 on X Layer)",
      description:
        "The EVIDIQ trust check for a counterparty agent. EVIDIQ is an x402-paid MCP service: this tool AUTOMATICALLY pays the required USDT0 on X Layer (EIP-3009, gasless signature) and returns the signed Trust Report (score, tier, breakdown, recommendation) plus the on-chain settlement transaction. Call this before transacting with, paying, or delegating to another agent. Supply everything you know about the counterparty.",
      inputSchema: {
        agentId: z
          .string()
          .describe("A stable identifier for the agent being checked (address, URL, name, or id)."),
        endpoint: z.string().optional().describe("The agent's service URL / MCP endpoint."),
        declaredCapabilities: z
          .array(z.string())
          .optional()
          .describe("Capabilities the agent claims to have."),
        framework: z.string().optional().describe("Framework the agent is built on."),
        identity: z
          .object({
            address: z.string().optional(),
            ens: z.string().optional(),
            erc8004Id: z.string().optional(),
            domain: z.string().optional(),
          })
          .optional()
          .describe("Identity anchors: EVM address, ENS, ERC-8004 id, domain."),
        context: z.string().optional().describe("What the deal is about / why the check is run."),
      },
    },
    async (args) => {
      try {
        const r = await payAndVerify(args);
        const report = extractReport(r.body);
        if (!r.paid) {
          return { content: [{ type: "text", text: report }] };
        }
        const amt = (Number(r.amount) / 1e6).toFixed(2);
        const tx = r.settle?.transaction;
        const header = [
          `x402 PAYMENT SETTLED on X Layer — paid ${amt} USDT0 to ${r.payTo}.`,
          tx
            ? `Settlement tx: [${tx}](https://www.oklink.com/xlayer/tx/${tx})`
            : "(signature-only / zero-value settlement — no on-chain tx)",
          "",
          "----- EVIDIQ Trust Report -----",
          "",
        ].join("\n");
        return { content: [{ type: "text", text: header + report }] };
      } catch (e) {
        return {
          content: [{ type: "text", text: `x402 pay+verify failed: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}

// Stateless streamable-http: a fresh server+transport per request.
const httpServer = http.createServer((req, res) => {
  if (!req.url || !req.url.startsWith("/mcp")) {
    res.writeHead(404).end("not found");
    return;
  }
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", async () => {
    try {
      const parsed = raw ? JSON.parse(raw) : undefined;
      const server = buildServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, parsed);
    } catch (e) {
      if (!res.headersSent) res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32603, message: String(e) } }));
    }
  });
});

httpServer.listen(PORT, "127.0.0.1", () => {
  console.error(`evidiq-pay-mcp listening on http://127.0.0.1:${PORT}/mcp  buyer=${account.address}`);
});
