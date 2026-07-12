// evidiq-verify — a tool an agent can call to verify a counterparty via EVIDIQ,
// paying the x402 fee automatically. Wraps the full wire dance so the agent
// just gets a Trust Report back.
//
//   node scripts/evidiq-verify.mjs <agentId> [endpoint] [context]
//
// Buyer key is read from ~/.evidiq-x402-test-wallet.json. Prints a compact,
// agent-readable Trust Report + the on-chain settlement tx.

import { privateKeyToAccount } from "viem/accounts";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const MCP_URL = process.env.EVIDIQ_MCP || "https://evidiq.dev/mcp";

// Parse: <agentId> [endpoint] [--address 0x..] [--erc8004 id] [--domain x.com]
//        [--capabilities "a,b"] [--framework name] [--context "..."]
const argv = process.argv.slice(2);
const agentId = argv[0];
if (!agentId || agentId.startsWith("--")) {
  console.error(
    'usage: evidiq-verify <agentId> [endpoint] [--address 0x..] [--erc8004 id] [--domain x] [--capabilities "a,b"] [--framework f] [--context "..."]'
  );
  process.exit(1);
}
let endpoint;
const flags = {};
for (let i = 1; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) flags[a.slice(2)] = argv[++i];
  else if (!endpoint) endpoint = a;
}

const wallet = JSON.parse(
  readFileSync(`${homedir()}/.evidiq-x402-test-wallet.json`, "utf8")
);
const account = privateKeyToAccount(wallet.privateKey);
const b64 = (o) => Buffer.from(JSON.stringify(o), "utf8").toString("base64");

let sessionId = null;
const H = (extra = {}) => ({
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
  ...(sessionId ? { "mcp-session-id": sessionId } : {}),
  ...extra,
});
const rpc = (o) => JSON.stringify({ jsonrpc: "2.0", ...o });
const args = { agentId };
if (endpoint) args.endpoint = endpoint;
if (flags.context) args.context = flags.context;
if (flags.framework) args.framework = flags.framework;
if (flags.capabilities)
  args.declaredCapabilities = flags.capabilities.split(",").map((s) => s.trim());
const identity = {};
if (flags.address) identity.address = flags.address;
if (flags.erc8004) identity.erc8004Id = flags.erc8004;
if (flags.domain) identity.domain = flags.domain;
if (Object.keys(identity).length > 0) args.identity = identity;
const callBody = () =>
  rpc({ id: 2, method: "tools/call", params: { name: "verify_agent", arguments: args } });

// MCP initialize (best effort).
const init = await fetch(MCP_URL, {
  method: "POST",
  headers: H(),
  body: rpc({
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "evidiq-verify", version: "1.0" },
    },
  }),
});
sessionId = init.headers.get("mcp-session-id");

// Unpaid attempt.
let res = await fetch(MCP_URL, { method: "POST", headers: H(), body: callBody() });

// If payment is required, sign an EIP-3009 authorization and retry.
if (res.status === 402) {
  const reqs = (await res.json())?.accepts?.[0];
  const now = Math.floor(Date.now() / 1000);
  const authorization = {
    from: account.address,
    to: reqs.payTo,
    value: reqs.maxAmountRequired,
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
  const xPayment = b64({
    x402Version: 1,
    scheme: "exact",
    network: reqs.network,
    payload: { signature, authorization },
  });
  console.log(
    `[x402] payment required — paid ${Number(reqs.maxAmountRequired) / 1e6} USDC on ${reqs.network}`
  );
  res = await fetch(MCP_URL, {
    method: "POST",
    headers: H({ "x-payment": xPayment }),
    body: callBody(),
  });
  const pr = res.headers.get("payment-response");
  if (pr) {
    const d = JSON.parse(Buffer.from(pr, "base64").toString("utf8"));
    if (d.transaction) {
      console.log(`[x402] settled on-chain — tx ${d.transaction}`);
      console.log(`[x402] explorer https://www.oklink.com/xlayer/tx/${d.transaction}`);
    }
  }
}

// Extract the human-readable Trust Report from the (SSE or JSON) response.
const text = await res.text();
const report =
  text
    .split("\n")
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice(5).trim())
    .map((l) => {
      try {
        return JSON.parse(l)?.result?.content?.[0]?.text;
      } catch {
        return null;
      }
    })
    .find(Boolean) || text.slice(0, 1200);

console.log("\n" + report);
