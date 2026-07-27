import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

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

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/9622"
        agentId={9622}
        name="EVIDIQ Vault"
        endpoint="https://mcp.evidiq.dev/vault/mcp"
      />

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

      <H2 id="limits">Engine limits</H2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["maxPayloadBytes", "65536"],
          ["maxTagsPerRecord", "16"],
          ["maxQueryLimit", "500"],
          ["namespacePattern", "^[a-z0-9][a-z0-9._/-]{2,63}$"],
        ].map(([name, value]) => (
          <div key={name} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <span className="font-mono text-xs font-bold text-sky-800">{name}</span>
            <p className="mt-0.5 break-all font-mono text-xs text-[#201810]/70">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[#201810]/70">
        Chain format <span className="font-mono">v1</span>: SHA-256 <span className="font-mono">prevHash</span>{" "}
        linkage, with an all-zero <span className="font-mono">prevHash</span> at genesis.
      </p>

      <H2 id="workflow">Recommended workflow</H2>
      <p className="mt-3 text-[#201810]/70">
        Settlement happens <span className="font-semibold text-[#1a130a]">before</span> a paid tool runs, so a
        malformed argument is still a paid call. Preflight for free first.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">vault_capabilities</span> for current limits, secret-scanning rules, and prices.</li>
        <li>
          Call <span className="font-mono">validate_record</span> to check the record schema and secret scan without
          appending or paying. <span className="font-mono">contentDigest</span> must be bare 64-character SHA-256 hex —
          a <span className="font-mono">0x</span> prefix is rejected.
        </li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended operation.</li>
        <li>Submit one paid call per request. Vault enforces strict x402 payment authorization.</li>
        <li>Re-read and verify afterwards for free with <span className="font-mono">get_receipt</span> and <span className="font-mono">verify_chain</span>.</li>
      </ol>

      <H2 id="records">Records and receipts</H2>
      <p className="mt-3 text-[#201810]/70">
        Every paid append returns the stored record, its content-addressed ID, and an integrity envelope carrying a
        SHA-256 digest and an EIP-191 signature.
      </p>
      <Code>{`{
  "engine": "EVIDIQ-Vault/1.0",
  "chainFormatVersion": "v1",
  "data": {
    "record": {
      "seq": 1,
      "namespace": "evidiq-sdk-proof",
      "actor": "0xd6B658dC6e53444bF9Cba598aFdd21Ede0A62Fb9",
      "authority": "operator",
      "action": "verify",
      "contentDigest": "18b7a227d4c939603fb44112e78be92e434e46cd6abf0ecd92e56e45746cd28d",
      "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "recordHash": "e81012620100231edcc2488d0571dc0586322e1fc0f95be0cc795b8b5e8aa5ac"
    }
  },
  "integrity": { "algorithm": "SHA-256", "digest": "..." }
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        <span className="font-mono">verify_chain</span> recomputes each{" "}
        <span className="font-mono">recordHash</span> and checks the{" "}
        <span className="font-mono">prevHash</span> linkage, so a reordered or edited log is detectable without
        trusting Vault. <span className="font-mono">enforce_retention</span> keeps{" "}
        <span className="font-mono">contentDigest</span> and <span className="font-mono">recordHash</span> when it
        redacts a payload, which is why continuity still verifies as{" "}
        <span className="font-mono">INTACT</span> after redaction.
      </p>

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
        (<span className="font-mono">eip155:196</span>). The public discovery endpoint lists all ten tools.
      </p>
      <p className="mt-4 text-[#201810]/70">
        Verification and settlement run through the{" "}
        <a
          href="https://web3.okx.com/onchainos/dev-docs/payments/service-seller-sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 hover:underline"
        >
          official OKX Onchain OS Payment SDK
        </a>{" "}
        (<span className="font-mono">@okxweb3/x402-core</span> and{" "}
        <span className="font-mono">@okxweb3/x402-evm</span>). The OKX facilitator verifies each authorization and
        settles it on X Layer before any record is written. Each price reaches the SDK as an explicit USD₮0 atomic
        asset amount rather than a USD string, so neither the fee nor its token can be substituted by conversion.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          A live <span className="font-mono">append_record</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.005 USDT0</span> (5000 atomic) and stored{" "}
          <span className="font-mono">seq 1</span> with an all-zero genesis{" "}
          <span className="font-mono">prevHash</span>. An <span className="font-mono">audit_report</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.02 USDT0</span> (20000 atomic) and returned verdict{" "}
          <span className="font-mono">INTACT</span> with no policy violations. Both receipts are{" "}
          <span className="font-mono">status 0x1</span>, and both were broadcast by an OKX facilitator relayer rather
          than a Vault-held key — the on-chain evidence that settlement ran through the official SDK. The appended
          record was then re-read with the free <span className="font-mono">get_receipt</span>, so the paid write is
          durable.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x7e96398e1f2bae0637af884b55b35cbc82099b8241858a1fdde3ab67c94db4b6"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x7e96398e1f2bae0637af884b55b35cbc82099b8241858a1fdde3ab67c94db4b6
        </a>
        <a
          href="https://www.oklink.com/xlayer/tx/0x2b67c2109fc799b9d167aa6ebd710b478a56c7ad9f026e07069febcd525bbb6e"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x2b67c2109fc799b9d167aa6ebd710b478a56c7ad9f026e07069febcd525bbb6e
        </a>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Vault code under MIT. Third-party dependencies maintain their own open-source licenses
        preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Vault produces <span className="font-semibold text-[#1a130a]">tamper-evident evidence of agent behaviour</span>,
          not a judgement about it. Route dependency provenance to{" "}
          <Link href="/docs/lineage" className="font-semibold text-sky-700 hover:underline">EVIDIQ Lineage</Link>{" "}
          and endpoint or Agent Skill security scanning to{" "}
          <Link href="/docs/sentinel" className="font-semibold text-sky-700 hover:underline">EVIDIQ Sentinel</Link>.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
