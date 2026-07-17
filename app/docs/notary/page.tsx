import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Notary Docs — AI output receipts, x402, 0G anchoring",
  description:
    "Submit a prompt + response + model id, get a signed EIP-191 receipt anchored on 0G Storage. Six tools, x402 USDT0 payments, Merkle proofs, offline verification.",
  alternates: { canonical: "https://evidiq.dev/docs/notary" },
  openGraph: {
    title: "EVIDIQ Notary Docs",
    description: "Cryptographic receipts for AI outputs — signed, 0G-anchored, pay-per-call over x402.",
    url: "https://evidiq.dev/docs/notary",
    images: [{ url: "/docs/notary-hero.png", width: 1024, height: 1024 }],
  },
};

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-[#2b2140] bg-[#171021] p-4 font-mono text-sm leading-relaxed text-cyan-200">
      {children}
    </pre>
  );
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-32 text-2xl font-extrabold tracking-tight text-[#1a130a]">
      {children}
    </h2>
  );
}

export default function NotaryDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-violet-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Notary
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Cryptographic receipts for AI outputs. Submit a prompt + response + model id and receive a
        signed, timestamped, 0G-anchored receipt that proves existence, integrity, and provenance —
        verifiable offline by anyone.
      </p>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the EVIDIQ Notary MCP server to any MCP-capable agent:
      </p>
      <Code>claude mcp add --transport http evidiq-notary https://mcp.evidiq.dev/notary/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/notary/x402</Code>

      <H2 id="mcp">MCP server</H2>
      <p className="mt-3 text-[#201810]/70">
        The remote MCP endpoint is{" "}
        <span className="font-mono text-violet-700">https://mcp.evidiq.dev/notary/mcp</span>{" "}
        (Streamable HTTP). It exposes six tools — two paid, four free:
      </p>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">notarize_inference</span> — single
          AI output notarization <span className="text-violet-700">(x402-paid, $0.001)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">notarize_batch</span> — up to 20
          inferences in one call <span className="text-violet-700">(x402-paid, $0.005)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">verify_attestation</span> — verify
          receipt signature, hash, and Merkle proof <span className="text-[#201810]/50">(free)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">get_receipt</span> — fetch proof
          material <span className="text-[#201810]/50">(free)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">notary_stats</span> — live volume
          and top models <span className="text-[#201810]/50">(free)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">notary_pubkey</span> — notary
          address + algorithm <span className="text-[#201810]/50">(free)</span>
        </li>
      </ul>
      <Code>{`{
  "mcpServers": {
    "evidiq-notary": { "url": "https://mcp.evidiq.dev/notary/mcp" }
  }
}`}</Code>

      <H2 id="notarize">notarize_inference</H2>
      <p className="mt-3 text-[#201810]/70">
        Submit a single AI inference and receive a signed receipt anchored on 0G Storage.
      </p>
      <Code>{`{
  "prompt": "What is the capital of France?",
  "response": "The capital of France is Paris.",
  "modelId": "glm-5.2",
  "agentId": "0x1234…",
  "context": "User query via chat"
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        <span className="font-mono">prompt</span>, <span className="font-mono">response</span>, and{" "}
        <span className="font-mono">modelId</span> are required. <span className="font-mono">agentId</span>,{" "}
        <span className="font-mono">trustReportHash</span>, and <span className="font-mono">context</span>{" "}
        are optional.
      </p>
      <p className="mt-4 text-[#201810]/70">It returns a receipt:</p>
      <Code>{`{
  "attestationId": "0xfbd95c81…eeb1",
  "contentHash": "0xfbd95c81…eeb1",
  "promptHash": "0x1c8aff…",
  "responseHash": "0x8452c9…",
  "signature": "0x2f012d7f… (EIP-191)",
  "notaryAddress": "0x8a3c7524Aaed081825aC88eC7f4cCECFc583ee7D",
  "timestamp": "2026-07-17T00:41:15.303Z",
  "modelId": "glm-5.2",
  "merkleRoot": "0xfbd95c81…eeb1",
  "merkleProof": ["0x…"],
  "storageRoot": "0xae8526f7…e894",
  "storageTx": "0xa43c8186…1a5e1"
}`}</Code>

      <H2 id="x402">Paying from your agent (x402)</H2>
      <p className="mt-3 text-[#201810]/70">
        <span className="font-mono">notarize_inference</span> and{" "}
        <span className="font-mono">notarize_batch</span> are metered with x402 v2 (scheme{" "}
        <span className="font-mono">exact</span>, EIP-3009, USDT0 on X Layer /{" "}
        <span className="font-mono">eip155:196</span>). An unpaid call returns HTTP 402 with the
        payment requirements; the agent signs a gasless authorization and retries with a{" "}
        <span className="font-mono">PAYMENT-SIGNATURE</span> header. The four free tools need no
        payment — a plain <span className="font-mono">application/json</span> request works.
      </p>
      <Code>{`// 1. Unpaid call -> HTTP 402 with payment requirements
const { accepts: [req] } = await (await callNotarize()).json();

// 2. Sign EIP-3009 transferWithAuthorization (gasless for the payer)
const authorization = {
  from: account.address, to: req.payTo, value: req.amount,
  validAfter: "0", validBefore: String(now + 600), nonce: randomHex32(),
};
const signature = await account.signTypedData({
  domain: { name: req.extra.name, version: req.extra.version,
    chainId: Number(req.network.split(":")[1]), verifyingContract: req.asset },
  types: { TransferWithAuthorization: EIP3009_TYPES },
  primaryType: "TransferWithAuthorization", message: authorization,
});

// 3. Retry with PAYMENT-SIGNATURE -> server settles, returns receipt + settlement tx
const paid = await callNotarize({
  "PAYMENT-SIGNATURE": base64({ x402Version: 2, accepted: req,
    payload: { signature, authorization } }),
});`}</Code>
      <p className="mt-4 text-[#201810]/70">
        Per-tool pricing lives at{" "}
        <span className="font-mono text-violet-700">https://mcp.evidiq.dev/notary/x402</span> — it
        returns the full 6-tool pricing table in one call.
      </p>

      <H2 id="verify">verify_attestation (free)</H2>
      <p className="mt-3 text-[#201810]/70">
        Verify any receipt offline-style: recompute{" "}
        <span className="font-mono">keccak256(prompt ‖ response)</span>, recover the EIP-191 signer,
        and brute-force the Merkle proof against the root.
      </p>
      <Code>{`{
  "attestationId": "0xfbd95c81…eeb1",
  "prompt": "What is the capital of France?",
  "response": "The capital of France is Paris.",
  "modelId": "glm-5.2"
}`}</Code>
      <p className="mt-4 text-[#201810]/70">Returns:</p>
      <Code>{`{
  "valid": true,
  "contentMatch": true,
  "signatureValid": true,
  "merkleValid": true,
  "notaryAddress": "0x8a3c7524…3ee7D",
  "note": "Receipt verified: content hash matches, EIP-191 signature valid, Merkle proof valid."
}`}</Code>

      <H2 id="receipt">What a receipt proves</H2>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li>
          <span className="font-semibold text-[#1a130a]">Existence</span> — this exact prompt/response
          existed at this timestamp.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">Integrity</span> — change one character and
          the hash changes; verification fails.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">Provenance</span> — the model id, notary
          address, and optional trust report are bound into the signature.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">Independence</span> — verify offline with the
          notary address; Merkle roots anchor batches on 0G Storage.
        </li>
      </ul>

      <H2 id="attestation">0G Storage anchoring</H2>
      <p className="mt-3 text-[#201810]/70">
        Every paid receipt is anchored on 0G mainnet (Aristotle, chain 16661) via the{" "}
        <span className="font-mono">@0gfoundation/0g-ts-sdk</span>. The receipt JSON is uploaded as a{" "}
        <span className="font-mono">ZgFile</span> through the turbo indexer; the returned{" "}
        <span className="font-mono">storageRoot</span> and <span className="font-mono">storageTx</span>{" "}
        are durable, tamper-evident, and fetchable by anyone.
      </p>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li>
          <span className="font-semibold text-[#1a130a]">storageRoot</span> — 0G Storage merkle root
          of the receipt JSON.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">storageTx</span> — on-chain 0G mainnet
          transaction hash (SUCCESS).
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">signature</span> — EIP-191 over{" "}
          <span className="font-mono">"EVIDIQ Notary Receipt v1" + reportHash + merkleRoot</span>,
          signed by the notary&apos;s EVM key.
        </li>
      </ul>

      <H2 id="offline-verify">Offline verification</H2>
      <p className="mt-3 text-[#201810]/70">
        Anyone can verify a receipt without contacting the notary:
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-[#201810]/75">
        <li>Fetch the notary address: <span className="font-mono">notary_pubkey</span> tool.</li>
        <li>Recompute <span className="font-mono">contentHash = keccak256(prompt ‖ response)</span>.</li>
        <li>
          Recover the EIP-191 signer from <span className="font-mono">signature</span> over the
          attestation message — must equal <span className="font-mono">notaryAddress</span>.
        </li>
        <li>Verify the Merkle proof against <span className="font-mono">merkleRoot</span>.</li>
      </ol>

      <H2 id="pricing">Pricing</H2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-violet-200 text-left">
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Tool</th>
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Cost</th>
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Token</th>
              <th className="py-2 font-semibold text-[#1a130a]">Chain</th>
            </tr>
          </thead>
          <tbody className="text-[#201810]/75">
            <tr className="border-b border-violet-100">
              <td className="py-2 pr-4 font-mono">notarize_inference</td>
              <td className="py-2 pr-4">$0.001</td>
              <td className="py-2 pr-4">USDT0</td>
              <td className="py-2">X Layer (196)</td>
            </tr>
            <tr className="border-b border-violet-100">
              <td className="py-2 pr-4 font-mono">notarize_batch</td>
              <td className="py-2 pr-4">$0.005</td>
              <td className="py-2 pr-4">USDT0</td>
              <td className="py-2">X Layer (196)</td>
            </tr>
            <tr className="border-b border-violet-100">
              <td className="py-2 pr-4 font-mono">verify_attestation</td>
              <td className="py-2 pr-4 text-[#201810]/50">Free</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">—</td>
            </tr>
            <tr className="border-b border-violet-100">
              <td className="py-2 pr-4 font-mono">get_receipt</td>
              <td className="py-2 pr-4 text-[#201810]/50">Free</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">—</td>
            </tr>
            <tr className="border-b border-violet-100">
              <td className="py-2 pr-4 font-mono">notary_stats</td>
              <td className="py-2 pr-4 text-[#201810]/50">Free</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">—</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-mono">notary_pubkey</td>
              <td className="py-2 pr-4 text-[#201810]/50">Free</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H2 id="proven">Proven on-chain</H2>
      <p className="mt-3 text-[#201810]/70">
        Every notarization is verifiable end-to-end — the payment settles on X Layer and the receipt
        is anchored on 0G Storage.
      </p>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        <li>
          <span className="font-semibold text-[#1a130a]">Payment — x402 settlement on X Layer:</span>{" "}
          <span className="font-mono">0.001 USDT0</span> via EIP-3009{" "}
          <span className="font-mono">transferWithAuthorization</span>. Tx{" "}
          <a className="font-mono text-violet-700 hover:underline" href="https://www.oklink.com/xlayer/tx/0x53f72073820d7958d18c86c5f436ccb1e53af510c2079c329b08eb1abd0070f2" target="_blank" rel="noopener noreferrer">
            0x53f72073…0070f2
          </a>{" "}· SUCCESS
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">Receipt — 0G Storage anchor:</span> signed
          by <span className="font-mono">0x8a3c7524…3ee7D</span> (EIP-191), anchored on 0G mainnet. Tx{" "}
          <a className="font-mono text-violet-700 hover:underline" href="https://chainscan.0g.ai/tx/0xa43c8186f8a53e9540a2ac8bf407037451209123b523253d7d3be379c281a5e1" target="_blank" rel="noopener noreferrer">
            0xa43c8186…1a5e1
          </a>{" "}· SUCCESS
        </li>
      </ul>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          EVIDIQ Notary produces <span className="font-semibold text-[#1a130a]">evidence, not
          permission</span>. A receipt proves the output existed — it does not vouch for the
          output&apos;s correctness. Pair receipts with the{" "}
          <Link href="/docs/evidiq" className="font-semibold text-violet-700 hover:underline">
            EVIDIQ trust layer
          </Link>{" "}
          when you need a capability/risk verdict on the agent that produced it.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-violet-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
