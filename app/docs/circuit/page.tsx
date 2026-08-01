import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Circuit Docs — Verifiable API Proxy, TLS Attestation & Circuit Breaker",
  description:
    "Verifiable API proxy, TLS certificate attestation, payload schema drift inspection, circuit breaker state machine enforcement, webhook signature verification, and 0G storage receipt anchoring with x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/circuit" },
  openGraph: {
    title: "EVIDIQ Circuit Docs",
    description: "Verifiable API proxy, TLS attestation, & circuit breaker guard for autonomous AI agents.",
    url: "https://evidiq.dev/docs/circuit",
    images: [{ url: "/docs/circuit-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["audit_endpoint_compliance", "0.005", "Audit TLS certificate validity, expiration, trusted CA, hostname SAN matching, and security headers."],
  ["inspect_payload_schema", "0.01", "Validate API response payload against JSON Schema and detect field data type drift from baseline."],
  ["enforce_circuit_breaker", "0.015", "Evaluate error rates, latency P95 spikes, and request velocity to return CLOSED/HALF_OPEN/OPEN breaker state."],
  ["verify_webhook_signature", "0.02", "Cryptographically verify HMAC-SHA256 or EIP-191 signatures on incoming agent webhooks."],
  ["attest_exchange_receipt", "0.03", "Generate EIP-191 signed cryptographic attestation with 0G Merkle storage anchoring."],
] as const;

const freeTools = [
  ["circuit_capabilities", "Inspect engine limits, supported auth schemes, circuit breaker defaults, and pricing."],
  ["validate_request_params", "Validate target URL syntax, headers, and schema structures prior to execution."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_circuit_report", "Recompute report integrity and verify trusted EIP-191 authenticity against 4 mathematical invariants."],
  ["get_artifact", "Retrieve a content-addressed JSON exchange receipt or 0G Merkle proof by exact ID."],
] as const;

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-[#1e293b] bg-[#0f172a] p-4 font-mono text-sm leading-relaxed text-sky-200">
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

export default function CircuitDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Circuit
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Verifiable API proxy, TLS certificate attestation, payload schema drift inspection, circuit breaker state machine enforcement,
        webhook signature verification, and 0G storage receipt anchoring for autonomous AI agents.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10377"
        agentId={10377}
        name="EVIDIQ Circuit"
        endpoint="https://mcp.evidiq.dev/circuit/mcp"
        status="listed"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, and validate target parameters before making a paid call.
      </p>
      <Code>claude mcp add --transport http evidiq-circuit https://mcp.evidiq.dev/circuit/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/circuit/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Circuit Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/circuit/skill.md</Code>

      <H2 id="use-cases">What Circuit is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["TLS Certificate Attestation", "Audit target TLS certificate validity, untrusted CAs, expiration dates, and SAN hostname matches."],
          ["Schema Drift Inspection", "Detect JSON payload structure changes and field data type drift against baseline specifications."],
          ["Circuit Breaker Engine", "Deterministic 3-state machine (CLOSED, HALF_OPEN, OPEN) tracking error rates and latency P95 spikes."],
          ["Webhook Verification", "Verify incoming agent webhook payloads using HMAC-SHA256 or EIP-191 signatures with timestamp freshness checks."],
          ["Canonical Receipts", "Generate RFC 8785 (JCS) SHA-256 report digests signed via EIP-191 ECDSA."],
          ["0G Storage Anchoring", "Anchor exchange receipt Merkle roots directly onto 0G Storage for verifiable audit trails."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight and offline verification. Five paid tools provide full verification, schema inspection, breaker state enforcement, and receipt anchoring.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid security &amp; attestation tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> — {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and verification</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {freeTools.map(([name, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> — {description}{" "}
            <span className="text-[#201810]/50">(free)</span>
          </li>
        ))}
      </ul>

      <H2 id="pipeline">Evaluation Pipeline &amp; Invariants</H2>
      <p className="mt-3 text-[#201810]/70">
        Every evaluation follows a strict 9-step pipeline that produces byte-reproducible reports verified against 4 mathematical invariants:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li><span className="font-semibold text-[#1a130a]">Trace Consistency</span>: <span className="font-mono">checksEvaluated == trace.length</span>.</li>
        <li><span className="font-semibold text-[#1a130a]">Violation Count</span>: <span className="font-mono">violations.length == failedTraceCount</span>.</li>
        <li><span className="font-semibold text-[#1a130a]">Verdict Precedence</span>: <span className="font-mono">BLOCK</span> &gt; <span className="font-mono">WARN</span> &gt; <span className="font-mono">ALLOW</span>.</li>
        <li><span className="font-semibold text-[#1a130a]">Integrity Digest</span>: <span className="font-mono">reportDigest == SHA-256(JCS(report))</span> with valid EIP-191 signature.</li>
      </ol>

      <H2 id="payments">x402 pricing</H2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-sky-200 text-left">
              <th className="py-2 pr-4 font-bold text-[#1a130a]">Tool</th>
              <th className="py-2 pr-4 font-bold text-[#1a130a]">Atomic</th>
              <th className="py-2 pr-4 font-bold text-[#1a130a]">USDT0</th>
              <th className="py-2 font-bold text-[#1a130a]">Access</th>
            </tr>
          </thead>
          <tbody className="text-[#201810]/75">
            {paidTools.map(([name, price]) => (
              <tr key={name} className="border-b border-sky-100">
                <td className="py-2 pr-4 font-mono font-semibold text-[#1a130a]">{name}</td>
                <td className="py-2 pr-4 font-mono">{String(Math.round(Number(price) * 1_000_000))}</td>
                <td className="py-2 pr-4 font-semibold text-sky-800">{price}</td>
                <td className="py-2 font-medium text-sky-700">x402-paid</td>
              </tr>
            ))}
            {freeTools.map(([name]) => (
              <tr key={name} className="border-b border-sky-100">
                <td className="py-2 pr-4 font-mono font-semibold text-[#1a130a]">{name}</td>
                <td className="py-2 pr-4 font-mono">0</td>
                <td className="py-2 pr-4 text-[#201810]/60">Free</td>
                <td className="py-2 text-[#201810]/50">Always ungated</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[#201810]/70">
        Payments use x402 v2 <span className="font-mono">exact</span> scheme with USDT0 (6 decimals) on X Layer
        (<span className="font-mono">eip155:196</span>). Verification and settlement run through the{" "}
        <a
          href="https://web3.okx.com/onchainos/dev-docs/payments/service-seller-sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 hover:underline"
        >
          official OKX Onchain OS Payment SDK
        </a>.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Live tool calls verified on-chain via OKX Facilitator:
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">audit_endpoint_compliance:</span> <a href="https://www.oklink.com/xlayer/tx/0xcef0df01460c67257271137e91c2cdb29ec7430a66461fad0c49c9eb8d30fbb8" target="_blank" rel="noopener noreferrer" className="hover:underline">0xcef0df...fbb8</a></p>
          <p><span className="font-semibold">inspect_payload_schema:</span> <a href="https://www.oklink.com/xlayer/tx/0xea7c8ccea898c99477d54d5fb90c49cc65992e1abd107ddce0cc675a1e21aede" target="_blank" rel="noopener noreferrer" className="hover:underline">0xea7c8c...aede</a></p>
          <p><span className="font-semibold">enforce_circuit_breaker:</span> <a href="https://www.oklink.com/xlayer/tx/0xbbe6ff603bb2ca3c03b05bfd878f318a7edde6e0a97a931f71556acafdf4fb95" target="_blank" rel="noopener noreferrer" className="hover:underline">0xbbe6ff...fb95</a></p>
          <p><span className="font-semibold">verify_webhook_signature:</span> <a href="https://www.oklink.com/xlayer/tx/0x6a296876efc2cf42eb544a0d16640fbb3baf39e3c710ec8419ae9632660857d0" target="_blank" rel="noopener noreferrer" className="hover:underline">0x6a2968...57d0</a></p>
          <p><span className="font-semibold">attest_exchange_receipt:</span> <a href="https://www.oklink.com/xlayer/tx/0x67ec7292ab49561217c116c157f7c068deada0e1c1e6192cc6b659a13236d961" target="_blank" rel="noopener noreferrer" className="hover:underline">0x67ec72...d961</a></p>
        </div>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Circuit code under MIT. Third-party dependencies maintain their own open-source licenses
        preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Circuit provides <span className="font-semibold text-[#1a130a]">verifiable API proxy attestation and circuit breaker enforcement</span>.
          Guard autonomous AI agent transactions against unexpected endpoint outages, payload drift, and unauthenticated webhooks.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
