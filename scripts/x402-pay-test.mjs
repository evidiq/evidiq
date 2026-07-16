// EVIDIQ x402 buyer test client.
//
// Simulates a paying agent end-to-end against the real EVIDIQ MCP endpoint:
//   initialize → call verify_agent (no pay) → receive HTTP 402 → sign an
//   EIP-3009 transferWithAuthorization → retry with PAYMENT-SIGNATURE → read the
//   on-chain settlement tx. This is the exact wire dance an OKX A2MCP buyer
//   (e.g. an OpenClaw agent) performs — just scripted so we control it.
//
// The buyer wallet only SIGNS (gasless); the EVIDIQ settler submits the tx and
// pays gas. So the buyer key needs USDT0 on X Layer, not OKB.
//
// Usage:
//   BUYER_KEY=0x<64-hex private key> node scripts/x402-pay-test.mjs [mcpUrl]
//   (defaults to https://evidiq.dev/mcp)

import { privateKeyToAccount } from "viem/accounts";
import { randomBytes } from "node:crypto";

const MCP_URL = process.argv[2] || "https://evidiq.dev/mcp";
const KEY = process.env.BUYER_KEY;

const die = (m) => {
  console.error(`\n\u2717 ${m}\n`);
  process.exit(1);
};

if (!KEY || !/^0x[0-9a-fA-F]{64}$/.test(KEY)) {
  die("Set BUYER_KEY=0x<64-hex private key> (a wallet holding USDT0 on X Layer).");
}

const account = privateKeyToAccount(KEY);
const b64 = (o) => Buffer.from(JSON.stringify(o), "utf8").toString("base64");

let sessionId = null;
const H = (extra = {}) => ({
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
  ...(sessionId ? { "mcp-session-id": sessionId } : {}),
  ...extra,
});
const rpc = (o) => JSON.stringify({ jsonrpc: "2.0", ...o });
const callBody = () =>
  rpc({
    id: 2,
    method: "tools/call",
    params: {
      name: "verify_agent",
      arguments: {
        agentId: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        endpoint: "https://evidiq.dev/skill.md",
        declaredCapabilities: ["token price feeds", "on-chain data indexing", "swap routing"],
        framework: "LangChain",
        identity: {
          address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          erc8004Id: "1024",
          domain: "evidiq.dev",
        },
        context: "verify a vendor before a 250 USDT job",
      },
    },
  });

console.log(`\nEVIDIQ x402 buyer test`);
console.log(`  buyer : ${account.address}`);
console.log(`  target: ${MCP_URL}\n`);

// [0] MCP initialize → session id (best effort; the gate 402s regardless).
console.log("\u2192 [0] MCP initialize \u2026");
const init = await fetch(MCP_URL, {
  method: "POST",
  headers: H(),
  body: rpc({
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "evidiq-x402-test", version: "1.0" },
    },
  }),
}).catch((e) => die(`cannot reach ${MCP_URL}: ${e.message}`));
sessionId = init.headers.get("mcp-session-id");
console.log(
  `   status ${init.status}${sessionId ? `  session ${sessionId.slice(0, 8)}\u2026` : "  (no session id)"}`
);
if (sessionId) {
  await fetch(MCP_URL, {
    method: "POST",
    headers: H(),
    body: rpc({ method: "notifications/initialized" }),
  }).catch(() => {});
}

// [1] Unpaid call → expect 402 challenge.
console.log("\n\u2192 [1] verify_agent with NO payment \u2026");
const first = await fetch(MCP_URL, { method: "POST", headers: H(), body: callBody() });
console.log(`   status ${first.status}`);
if (first.status !== 402) {
  if (first.status === 200) {
    die(
      "Endpoint answered 200 without payment \u2192 it is in FREE mode. Set X402_ASSET/PRICE/PAY_TO/SETTLE_KEY + redeploy to test the paid path."
    );
  }
  die(`Expected 402, got ${first.status}: ${(await first.text()).slice(0, 400)}`);
}
const reqs = (await first.json())?.accepts?.[0];
if (!reqs) die("402 had no accepts[] — cannot read payment requirements.");
console.log(
  `   402 challenge: ${reqs.amount} atomic of ${reqs.asset} (${reqs.extra?.name} v${reqs.extra?.version}) on ${reqs.network} \u2192 ${reqs.payTo}`
);

// [2] Sign EIP-3009 transferWithAuthorization.
console.log("\n\u2192 [2] signing EIP-3009 transferWithAuthorization \u2026");
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
console.log(`   signed ${signature.slice(0, 20)}\u2026`);
const paymentSignature = b64({
  x402Version: 2,
  accepted: reqs,
  payload: { signature, authorization },
});

// [3] Retry with PAYMENT-SIGNATURE → settlement.
console.log("\n\u2192 [3] retrying with PAYMENT-SIGNATURE header \u2026");
const paid = await fetch(MCP_URL, {
  method: "POST",
  headers: H({ "payment-signature": paymentSignature }),
  body: callBody(),
});
console.log(`   status ${paid.status}`);
if (paid.status === 402) {
  die(`Payment rejected: ${(await paid.json().catch(() => ({})))?.error ?? "unknown"}`);
}

const pr = paid.headers.get("payment-response");
if (pr) {
  const d = JSON.parse(Buffer.from(pr, "base64").toString("utf8"));
  console.log(`\n\u2713 SETTLED  status=${d.status}  payer=${d.payer}  amount=${d.amount}`);
  if (d.transaction) {
    console.log(`   tx      : ${d.transaction}`);
    console.log(`   explorer: https://www.oklink.com/xlayer/tx/${d.transaction}`);
  } else {
    console.log("   (zero-value / signature-only settlement — no on-chain tx)");
  }
} else {
  console.log("\n\u2713 200 but no payment-response header — check server config.");
}

const body = await paid.text();

// Parse the paid tool response and print the full EVIDIQ Trust Report + 0G attestation.
function parseReport(raw) {
  for (const line of raw.split("\n")) {
    const s = line.startsWith("data:") ? line.slice(5).trim() : line.trim();
    if (!s.startsWith("{")) continue;
    try {
      const j = JSON.parse(s);
      const c = j?.result?.content;
      if (Array.isArray(c)) {
        const jt = c.find((x) => x?.text && x.text.trim().startsWith("{"));
        if (jt) return JSON.parse(jt.text);
      }
    } catch {}
  }
  return null;
}
const sh = (h) => (typeof h === "string" && h.length > 16 ? `${h.slice(0, 10)}\u2026${h.slice(-6)}` : h ?? "-");
const C = { g: "\x1b[32m", cy: "\x1b[36m", mg: "\x1b[35m", d: "\x1b[2m", bd: "\x1b[1m", z: "\x1b[0m" };
const rep = parseReport(body);
if (rep) {
  const b = rep.breakdown || {};
  const a = rep.attestation || {};
  const an = rep.analysis || {};
  console.log(`\n${C.g}${C.bd}\u2713 Trust Report received${C.z} ${C.d}(paid via x402)${C.z}\n`);
  console.log(`   Agent      ${rep.agentId}`);
  console.log(
    `   Score      ${C.bd}${rep.trustScore}/100${C.z}   ${String(rep.tier).toUpperCase()}   \u2192  ${C.g}${C.bd}${String(rep.recommendation).replace(/_/g, " ").toUpperCase()}${C.z}`
  );
  console.log(
    `   Breakdown  identity ${b.identity} \u00b7 capability ${b.capability} \u00b7 reputation ${b.reputation} \u00b7 risk ${b.risk}`
  );
  if (an.text)
    console.log(
      `   ${C.d}AI (${an.model}${an.teeVerified ? ", 0G TEE" : ""}): ${an.text.replace(/\s+/g, " ").slice(0, 92)}\u2026${C.z}`
    );
  console.log(`\n   ${C.mg}0G on-chain attestation${C.z}`);
  console.log(`     report hash   ${C.cy}${sh(a.reportHash)}${C.z}`);
  if (a.storageRoot || a.storageTx) {
    console.log(`     0G storage    root ${sh(a.storageRoot)}   tx ${C.cy}${sh(a.storageTx)}${C.z}`);
    if (a.storageTx) console.log(`     ${C.d}\u21b3 chainscan.0g.ai/tx/${a.storageTx}${C.z}`);
  }
  if (a.tee) console.log(`     0G TEE        ${a.tee.model} @ ${sh(a.tee.provider)}  ${C.g}verified \u2713${C.z}`);
  if (a.signature) console.log(`     EVIDIQ sig    ${sh(a.signature)}  ${C.d}by ${sh(a.attester)}${C.z}`);
  console.log();
} else {
  console.log(`\n   result: ${body.slice(0, 200)}\n`);
}
