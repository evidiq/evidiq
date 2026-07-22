import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Sentinel Docs — MCP and Agent Skill security preflight",
  description:
    "Scan MCP endpoints, manifests, Agent Skills, and bundles before connecting or paying. Signed PASS/REVIEW/BLOCK reports, 0G Compute semantic analysis, and 0G Storage evidence.",
  alternates: { canonical: "https://evidiq.dev/docs/sentinel" },
  openGraph: {
    title: "EVIDIQ Sentinel Docs",
    description: "Security preflight for autonomous agents — MCP scanning, signed reports, 0G Compute, and 0G Storage.",
    url: "https://evidiq.dev/docs/sentinel",
    images: [{ url: "/docs/sentinel-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["scan_mcp_endpoint", "Inspect a public MCP endpoint without invoking its tools."],
  ["scan_mcp_manifest", "Analyze supplied tool, prompt, and resource metadata."],
  ["scan_agent_skill", "Inspect Agent Skill Markdown or a public HTTPS Skill URL."],
  ["scan_bundle", "Find collisions, shadowing, and toxic flows across targets."],
] as const;

const freeTools = [
  ["sentinel_capabilities", "Read policy, version, limits, and pricing."],
  ["validate_scan_target", "Validate a target shape or URL before a paid call."],
  ["estimate_cost", "Return the exact atomic and human-readable price."],
  ["verify_scan_report", "Recompute the report hash and verify its EIP-191 signature."],
] as const;

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

function ToolList({ tools, paid }: { tools: readonly (readonly [string, string])[]; paid: boolean }) {
  return (
    <ul className="mt-4 space-y-2 text-[#201810]/75">
      {tools.map(([name, description]) => (
        <li key={name}>
          <span className="font-mono font-semibold text-[#1a130a]">{name}</span> — {description}{" "}
          <span className={paid ? "text-violet-700" : "text-[#201810]/50"}>
            {paid ? "(x402-paid, 0.02 USDT0)" : "(free)"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SentinelDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-violet-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Sentinel
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Security preflight for autonomous agents. Scan an MCP endpoint, manifest, Agent Skill, or
        bundle before your agent connects, authorizes, or pays.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">OKX.AI listing</p>
          <p className="mt-1 text-sm text-[#201810]/75">
            EVIDIQ Sentinel is registered as ASP agent <span className="font-mono font-semibold">#7584</span> and is under review.
          </p>
        </div>
        <a
          href="https://www.okx.ai/agents/7584"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
        >
          View OKX.AI listing →
        </a>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Add the remote Streamable HTTP MCP endpoint to any MCP-capable agent, then use a free
        validation tool before requesting a paid scan.
      </p>
      <Code>claude mcp add --transport http evidiq-sentinel https://mcp.evidiq.dev/sentinel/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Discover pricing and payment requirements:</p>
      <Code>curl -s https://mcp.evidiq.dev/sentinel/x402 | python3 -m json.tool</Code>

      <H2 id="what-it-scans">What Sentinel scans</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["MCP endpoints", "Public remote MCP servers, inspected without executing target tools."],
          ["MCP manifests", "Tool, prompt, and resource metadata supplied as JSON."],
          ["Agent Skills", "Markdown supplied directly or fetched from a public HTTPS URL."],
          ["Bundles", "Multiple targets analyzed together for collisions and toxic flows."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-violet-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{body}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eight MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Four free tools help agents validate a target and inspect cost. Four scanners are priced at
        <span className="font-semibold text-[#1a130a]"> 0.02 USDT0</span> per call on X Layer.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid scanners</h3>
      <ToolList tools={paidTools} paid />
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and verification</h3>
      <ToolList tools={freeTools} paid={false} />

      <H2 id="scan-example">Scan an MCP endpoint</H2>
      <p className="mt-3 text-[#201810]/70">
        First validate the target. Then call <span className="font-mono">scan_mcp_endpoint</span> through
        your MCP client; this is a paid call and returns an x402 v2 payment challenge until your
        client provides valid payment authorization.
      </p>
      <Code>{`{
  "name": "scan_mcp_endpoint",
  "arguments": {
    "url": "https://example-agent.dev/mcp"
  }
}`}</Code>

      <H2 id="report">Read the SentinelReport</H2>
      <p className="mt-3 text-[#201810]/70">
        Sentinel applies deterministic security rules for prompt injection, tool poisoning,
        shadowing, exfiltration, sensitive data, dangerous capabilities, obfuscation, transport,
        capability mismatch, and payment-contract compliance. Semantic analysis provides
        additional context but does not override a high- or critical-severity deterministic finding.
      </p>
      <Code>{`{
  "reportId": "sentinel_…",
  "verdict": "REVIEW",
  "securityScore": 72,
  "findings": [{
    "ruleId": "TOOL_SHADOWING_001",
    "severity": "medium",
    "remediation": "Use a unique tool name and document its scope."
  }],
  "reportHash": "0x…",
  "signature": "0x…",
  "signer": "0x…",
  "storageRoot": "0x…",
  "storageTx": "0x…"
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        Every report is EIP-191 signed. When an anchor succeeds, its 0G Storage root and transaction
        are included; a storage failure is reported as non-fatal metadata rather than silently
        changing the verdict.
      </p>

      <H2 id="verifiable-analysis">Verifiable analysis</H2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-[#201810]/75">
        <li>Input is normalized, size-limited, and sanitized before inspection.</li>
        <li>Deterministic policy rules generate security findings and the final score/verdict.</li>
        <li>0G Compute adds TEE-backed GLM-5.2 semantic context without reducing static findings.</li>
        <li>The canonical report is hashed and signed with EIP-191.</li>
        <li>The final evidence is anchored to 0G Storage when the best-effort write succeeds.</li>
      </ol>

      <H2 id="payments">x402 pricing</H2>
      <p className="mt-3 text-[#201810]/70">
        Paid scans use x402 v2 with the <span className="font-mono">exact</span> scheme and USDT0 on
        X Layer (<span className="font-mono">eip155:196</span>). An unpaid request receives HTTP 402
        and a <span className="font-mono">PAYMENT-REQUIRED</span> challenge. A compatible client signs
        the required authorization and retries with <span className="font-mono">PAYMENT-SIGNATURE</span>.
        Free tools never require a payment header.
      </p>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Sentinel provides <span className="font-semibold text-[#1a130a]">evidence and a security recommendation</span>,
          not permission to trust a counterparty. Review critical findings and retain normal approval,
          spending, and data-handling controls before taking an irreversible action.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-violet-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
