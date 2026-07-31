import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Redact Docs — Deterministic PII, credential & key redaction",
  description:
    "Checksum-validated detection and removal of sensitive data from text, documents, and datasets, with a signed report, zero retention, and x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/redact" },
  openGraph: {
    title: "EVIDIQ Redact Docs",
    description: "Deterministic content redaction for autonomous agents.",
    url: "https://evidiq.dev/docs/redact",
    images: [{ url: "/docs/redact-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["redact_text", "0.005", "Detect and redact one text blob; returns redacted text, findings with offsets, and a signed report."],
  ["scan_document", "0.01", "Inventory only, no rewriting: which sensitive entities exist, where, and at what confidence."],
  ["redact_document", "0.015", "Structure-preserving redaction of markdown, HTML, CSV, JSON, NDJSON, or plain text."],
  ["policy_check", "0.02", "Evaluate content against a named policy profile and return PASS, REVIEW, or BLOCK with violations."],
  ["deidentify_dataset", "0.03", "Column-aware pseudonymization with stable tokens and re-identification-risk warnings."],
] as const;

const freeTools = [
  ["redact_capabilities", "Detector catalog and versions, policy profiles, limits, redaction modes, and full pricing."],
  ["validate_input", "Validate size, format, and encoding and return the finding count — without returning content or charging."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_redaction_report", "Recompute the report digest and verify its EIP-191 signature."],
  ["get_artifact", "Retrieve a redacted artifact by id, within its in-memory TTL."],
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

export default function RedactDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Redact
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Deterministic detection and removal of sensitive data — before an agent sends anything anywhere. Redact finds
        sensitive values by structure rather than by guesswork, removes them in the mode you choose, and returns a signed
        report of exactly what was found and where. No model in the hot path, and nothing is stored.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/9700"
        agentId={9700}
        name="EVIDIQ Redact"
        endpoint="https://mcp.evidiq.dev/redact/mcp"
        status="live"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, then preflight for free before paying.
      </p>
      <Code>claude mcp add --transport http evidiq-redact https://mcp.evidiq.dev/redact/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/redact/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Redact Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/redact/skill.md</Code>

      <H2 id="use-cases">What Redact is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Before a prompt", "Strip customer records, credentials, and keys out of context before it reaches a model."],
          ["Checksum-validated detection", "Luhn for cards, mod-97 for IBANs, wordlist plus checksum for BIP-39 mnemonics, EIP-55 for EVM addresses."],
          ["Credential interception", "AWS, GitHub, OpenAI, Anthropic, Stripe keys and .env blocks by issuer shape."],
          ["Structure-preserving output", "Markdown, HTML, CSV, JSON, NDJSON, and plain text keep their shape after redaction."],
          ["Policy verdicts", "Versioned profiles return PASS, REVIEW, or BLOCK with the violations that caused it."],
          ["Zero retention", "Content is processed in memory; artifacts live in a short-TTL cache addressed by digest."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools cover discovery, preflight, and offline verification. Five paid tools handle detection,
        redaction, policy evaluation, and dataset de-identification.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid detection &amp; redaction</h3>
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
          ["maxInputBytes", "262144"],
          ["artifactTtlMs", "600000 (10 minutes, in memory)"],
          ["detectorSetVersion", "1.0.0 — 20 detectors"],
          ["redactionModes", "mask · label · hash · token · remove"],
        ].map(([name, value]) => (
          <div key={name} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <span className="font-mono text-xs font-bold text-sky-800">{name}</span>
            <p className="mt-0.5 break-all font-mono text-xs text-[#201810]/70">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[#201810]/70">
        Policy profiles: <span className="font-mono">pii-basic</span>,{" "}
        <span className="font-mono">pci-lite</span>, <span className="font-mono">health-lite</span>,{" "}
        <span className="font-mono">crypto-hygiene</span>, <span className="font-mono">pre-prompt</span>. Live values come
        from the free <span className="font-mono">redact_capabilities</span> tool.
      </p>

      <H2 id="workflow">Recommended workflow</H2>
      <p className="mt-3 text-[#201810]/70">
        Settlement happens <span className="font-semibold text-[#1a130a]">before</span> a paid tool runs, so a malformed
        argument is still a paid call. Preflight for free first.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">redact_capabilities</span> for the detector set version, profiles, and prices.</li>
        <li>Call <span className="font-mono">validate_input</span> — it returns the finding count for free, so you can decide whether redaction is worth buying.</li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended operation.</li>
        <li>Submit one paid call per request. Redact enforces strict x402 payment authorization.</li>
        <li>Verify offline with <span className="font-mono">verify_redaction_report</span>, and re-fetch output with <span className="font-mono">get_artifact</span> while its TTL lasts.</li>
      </ol>

      <H2 id="reports">What a report proves, and what it does not</H2>
      <p className="mt-3 text-[#201810]/70">
        A report proves that this exact input, under this detector set version and this policy version, produced this
        exact output and these findings. Anyone can re-run and compare digests. It does{" "}
        <span className="font-semibold text-[#1a130a]">not</span> prove the content is now free of sensitive data:
        deterministic detection has a recall limit, and unstructured personal names and postal addresses are the weak
        spot. They are reported at low confidence and can never alone drive a{" "}
        <span className="font-mono">BLOCK</span>.
      </p>
      <p className="mt-4 text-[#201810]/70">
        Findings carry <span className="font-semibold text-[#1a130a]">offsets and detector ids, never the matched
        values</span>. A report that quoted what it found would itself be a leak, and reports get pasted into tickets.
      </p>
      <Code>{`{
  "engine": "EVIDIQ-Redact/1.0",
  "detectorSetVersion": "1.0.0",
  "policy": "pre-prompt",
  "findings": [
    { "detector": "BIP39_MNEMONIC", "family": "crypto_secret",
      "confidence": "validated", "start": 812, "end": 913, "action": "remove" }
  ],
  "verdict": "BLOCK",
  "integrity": { "algorithm": "SHA-256", "digest": "...", "signature": "0x...", "signer": "0x8a3c7524..." }
}`}</Code>

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
        settles it on X Layer before any detection runs. Each price reaches the SDK as an explicit USD₮0 atomic asset
        amount rather than a USD string, so neither the fee nor its token can be substituted by conversion.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          A live <span className="font-mono">redact_text</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.005 USDT0</span> (5000 atomic) on content carrying an email,
          a Luhn-valid card number, a BIP-39 mnemonic, and a private key. All four were detected, the verdict was{" "}
          <span className="font-mono">BLOCK</span>, every secret was removed from the output, and no matched value
          appeared in the report. The receipt is <span className="font-mono">status 0x1</span> and the transaction was
          broadcast by an OKX facilitator relayer rather than a Redact-held key — the on-chain evidence that settlement
          ran through the official SDK. Test values were synthetic.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x001261081770e0c9bc82a736a4a7e8739d25fe01ca578a445aa311f238e8efc4"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x001261081770e0c9bc82a736a4a7e8739d25fe01ca578a445aa311f238e8efc4
        </a>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Redact code under MIT. Third-party dependencies maintain their own
        open-source licenses preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Redact inspects what an agent <span className="font-semibold text-[#1a130a]">emits</span>. For what an agent
          consumes, route endpoint and Agent Skill scanning to{" "}
          <Link href="/docs/sentinel" className="font-semibold text-sky-700 hover:underline">EVIDIQ Sentinel</Link>; for
          durable action logging, use{" "}
          <Link href="/docs/vault" className="font-semibold text-sky-700 hover:underline">EVIDIQ Vault</Link>. No
          compliance certification is claimed; policy profiles are engineering defaults, not legal advice.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
