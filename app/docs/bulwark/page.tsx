import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Bulwark Docs — Prompt Injection & LLM Input Safety Guard",
  description:
    "Deterministic prompt injection and LLM input safety guard for autonomous AI agents. Direct injection, indirect injection, jailbreak, data exfiltration, and system-prompt leak detection with EIP-191 signed attestations and 0G storage anchoring.",
  alternates: { canonical: "https://evidiq.dev/docs/bulwark" },
  openGraph: {
    title: "EVIDIQ Bulwark Docs",
    description: "Prompt injection & LLM input safety guard for autonomous AI agents.",
    url: "https://evidiq.dev/docs/bulwark",
    images: [{ url: "/docs/bulwark-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["scan_prompt_injection", "0.005", "Scan for direct prompt injection (role hijack, instruction override) and indirect injection in retrieved content."],
  ["scan_jailbreak_techniques", "0.01", "Detect DAN variants, prefix injection, roleplay bypass, and credential interleaving."],
  ["scan_data_exfiltration", "0.015", "Detect URL-based extraction, encoded payloads, and tool-call hijack for data theft."],
  ["scan_system_leak", "0.02", "Detect system-prompt leak probes, rule extraction, and config reflection."],
  ["attest_prompt_safety", "0.03", "Run the full Bulwark pipeline and bind results into an EIP-191 signed attestation with 0G anchoring."],
] as const;

const freeTools = [
  ["bulwark_capabilities", "Engine limits, detection categories, rule catalog, technique signatures, and pricing."],
  ["validate_prompt_input", "Preflight parse-check: validates structure, detects encoding anomalies, checks size limits."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_bulwark_report", "Recompute report integrity and verify EIP-191 authenticity against 4 mathematical invariants."],
  ["get_artifact", "Retrieve a content-addressed scan report or 0G Merkle proof by exact ID."],
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

export default function BulwarkDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Bulwark
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Deterministic prompt injection and LLM input safety guard for autonomous AI agents. Scans for
        direct injection, indirect injection, jailbreak techniques, data exfiltration payloads, and
        system-prompt leak probes with EIP-191 signed attestations and 0G storage anchoring.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10385"
        agentId={10385}
        name="EVIDIQ Bulwark"
        endpoint="https://mcp.evidiq.dev/bulwark/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, validate prompt structure, then run a paid scan.
      </p>
      <Code>claude mcp add --transport http evidiq-bulwark https://mcp.evidiq.dev/bulwark/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/bulwark/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Bulwark Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/bulwark/skill.md</Code>

      <H2 id="use-cases">What Bulwark is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Direct Injection Detection", "Catch role hijack, instruction override, and delimiter violation in user prompts."],
          ["Indirect Injection Detection", "Detect hidden instructions in retrieved RAG context, web pages, and tool outputs."],
          ["Jailbreak Technique Signatures", "Identify DAN variants, prefix injection, roleplay bypass, and credential interleaving."],
          ["Data Exfiltration Detection", "Find URL-based extraction, encoded payloads, and tool-call hijack for data theft."],
          ["System Prompt Leak Probes", "Detect instruction repetition requests, rule extraction, and config reflection."],
          ["Canonical Attestations", "Generate RFC 8785 JCS SHA-256 report digests signed via EIP-191 ECDSA."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight and offline verification. Five paid tools provide full scan, detection, and attestation.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid scan &amp; attestation tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and verification</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {freeTools.map(([name, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-[#201810]/50">(free)</span>
          </li>
        ))}
      </ul>

      <H2 id="pipeline">Detection Pipeline &amp; Invariants</H2>
      <p className="mt-3 text-[#201810]/70">
        Every evaluation follows a strict pipeline that produces byte-reproducible reports verified against 4 mathematical invariants:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li><span className="font-semibold text-[#1a130a]">Trace Consistency</span>: <span className="font-mono">checksEvaluated == trace.length</span>.</li>
        <li><span className="font-semibold text-[#1a130a]">Violation Count</span>: <span className="font-mono">violations.length &gt;= failedTraceCount</span>.</li>
        <li><span className="font-semibold text-[#1a130a]">Verdict Determinism</span>: <span className="font-mono">BLOCK</span> iff a BLOCK-action violation exists.</li>
        <li><span className="font-semibold text-[#1a130a]">Integrity Digest</span>: <span className="font-mono">reportDigest == SHA-256(JCS(report))</span> with valid EIP-191 signature.</li>
      </ol>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Bulwark code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
