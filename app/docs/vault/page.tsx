import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Vault Docs — Governed, tamper-evident memory & audit trail",
  description:
    "Append-only, hash-chained memory and audit logging for autonomous AI agents with 0G Merkle segment sealing, payload retention redaction, and secret detection.",
  alternates: { canonical: "https://evidiq.dev/docs/vault" },
  openGraph: {
    title: "EVIDIQ Vault Docs",
    description: "Governed, tamper-evident memory and audit trail for autonomous AI agents.",
    url: "https://evidiq.dev/docs/vault",
    images: [{ url: "/docs/vault-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["append_record", "0.005", "Append an action/decision record to a governed namespace with SHA-256 hash chaining and secret detection."],
  ["query_records", "0.01", "Query bounded records by actor, authority, action, tags, or window with optional Merkle inclusion proofs."],
  ["seal_segment", "0.015", "Compute binary SHA-256 Merkle root across a range of records and optionally seal to 0G Storage."],
  ["audit_report", "0.02", "Audit namespace continuity and output INTACT, GAP, or BREAK verdict with policy violation details."],
  ["enforce_retention", "0.03", "Apply retention policy by tombstoning raw payload data while preserving contentDigest and recordHash linkage."],
] as const;

const freeTools = [
  ["vault_capabilities", "Inspect engine parameters, namespace pattern limits, secret scanning rules, and x402 pricing."],
  ["validate_record", "Validate record input schema and test for secrets without appending or paying."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_chain", "Verify cryptographic hash-chain continuity and genesis linkage across a set of records."],
  ["get_receipt", "Retrieve a content-addressed JSON receipt or proof by exact ID."],
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

export default function VaultDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Vault
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Governed, tamper-evident memory and audit trail for autonomous AI agents, anchored on 0G. Record agent actions,
        hash-chain sequences, seal Merkle segments, redact sensitive payloads via tombstoning without breaking hash chains,
        and audit continuity across namespaces.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Under review on OKX.AI
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1a130a]">EVIDIQ Vault</p>
            <p className="font-mono text-xs text-[#201810]/60">MCP endpoint live</p>
          </div>
        </div>
        <a
          href="https://mcp.evidiq.dev/vault/x402"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
        >
          Inspect Endpoint ↗
        </a>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, and validate your record input before appending.
      </p>
      <Code>claude mcp add --transport http evidiq-vault https://mcp.evidiq.dev/vault/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/vault/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Vault Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/vault/skill.md</Code>

      <H2 id="use-cases">What Vault is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Append-Only Hash Chains", "Monotonically sequenced record log where each record stores the SHA-256 hash of the previous record."],
          ["0G Merkle Sealing", "Compute binary SHA-256 Merkle roots over record batches and anchor sealed segments to 0G Storage."],
          ["Retention & Tombstoning", "Redact raw payload contents while preserving contentDigest and recordHash, ensuring chain integrity."],
          ["Secret Interception", "Automatically reject private keys, mnemonics, and bearer tokens before they enter the record chain."],
          ["Continuity Audits", "Evaluate namespace logs for INTACT, GAP, or BREAK verdicts with detailed policy violation tracking."],
          ["Inclusion Proofs", "Generate and verify Merkle inclusion proofs for individual records within sealed segments."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight, validation, and offline verification. Five paid tools handle durable append, queries, sealing, auditing, and retention.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid memory &amp; audit tools</h3>
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
        (<span className="font-mono">eip155:196</span>).
      </p>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Vault code under MIT. Third-party dependencies maintain their own open-source licenses
        preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
