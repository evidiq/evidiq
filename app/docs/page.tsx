import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Docs — EVIDIQ",
  description:
    "Connect the EVIDIQ trust layer: install the skill, connect the MCP server, run verify_agent, pay per call with x402, and read the 0G-anchored attestation.",
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

export default function DocsPage() {
  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Documentation</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Give your agent a trust layer
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        EVIDIQ verifies an agent&apos;s capability, scores its risk, checks its on-chain reputation,
        and returns a signed Trust Report — anchored on 0G and analyzed in a TEE — before you
        transact. Connect it in one line.
      </p>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the EVIDIQ MCP server to any MCP-capable agent (Claude Code, Cursor, custom):
      </p>
      <Code>claude mcp add --transport http evidiq https://evidiq.dev/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or drop the open skill straight into your agent:</p>
      <Code>curl -s https://evidiq.dev/skill.md</Code>

      <H2 id="mcp">MCP server</H2>
      <p className="mt-3 text-[#201810]/70">
        The remote MCP endpoint is <span className="font-mono text-violet-700">https://evidiq.dev/mcp</span>{" "}
        (Streamable HTTP). It exposes three tools:
      </p>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">how_to_install</span> — onboarding
          instructions <span className="text-[#201810]/50">(free)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">get_evidiq_skill</span> — the latest
          skill in open-skill format <span className="text-[#201810]/50">(free)</span>
        </li>
        <li>
          <span className="font-mono font-semibold text-[#1a130a]">verify_agent</span> — the core trust
          check <span className="text-[#201810]/50">(x402-paid)</span>
        </li>
      </ul>
      <Code>{`{
  "mcpServers": {
    "evidiq": { "url": "https://evidiq.dev/mcp" }
  }
}`}</Code>

      <H2 id="verify">verify_agent</H2>
      <p className="mt-3 text-[#201810]/70">
        Pass everything you know about the counterparty. The more anchors you supply, the sharper the
        verdict.
      </p>
      <Code>{`{
  "agentId": "weather-oracle",
  "endpoint": "https://agent.example/mcp",
  "declaredCapabilities": ["weather-data", "price-feed"],
  "framework": "LangChain",
  "identity": {
    "address": "0x…",
    "erc8004Id": "42",
    "domain": "example.com"
  },
  "context": "pay-per-call weather API, $2 / 1k calls"
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        It returns a Trust Report: a score (0–100), a tier, a per-dimension breakdown (identity,
        capability, reputation, risk), an explicit recommendation
        (<span className="font-mono">proceed</span>, <span className="font-mono">proceed_with_escrow</span>,{" "}
        <span className="font-mono">caution</span>, <span className="font-mono">do_not_proceed</span>),
        a TEE-verified AI analysis, and an attestation.
      </p>

      <H2 id="x402">x402 pay-per-call</H2>
      <p className="mt-3 text-[#201810]/70">
        <span className="font-mono">verify_agent</span> is metered with x402 (scheme{" "}
        <span className="font-mono">exact</span>, EIP-3009 on X Layer). Unpaid calls receive an HTTP
        402 challenge; sign it and retry with a <span className="font-mono">PAYMENT-SIGNATURE</span>{" "}
        header (the OKX Payment SDK / OnchainOS does this automatically). Pricing discovery lives at{" "}
        <span className="font-mono text-violet-700">/x402</span>.
      </p>
      <Code>curl -s https://evidiq.dev/x402</Code>

      <H2 id="attestation">Attestation &amp; 0G</H2>
      <p className="mt-3 text-[#201810]/70">
        Every paid report ships an attestation you can independently verify:
      </p>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li>
          <span className="font-semibold text-[#1a130a]">reportHash</span> — keccak256 of the canonical
          report.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">0G Storage root + tx</span> — the full evidence
          anchored on 0G mainnet (audit trail).
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">0G TEE</span> — the risk analysis runs on 0G
          Compute (GLM-5.2) in a TEE; the provider address + request id are recorded.
        </li>
        <li>
          <span className="font-semibold text-[#1a130a]">signature</span> — the verdict is signed
          (EIP-191) by the EVIDIQ key so anyone can recover the attester.
        </li>
      </ul>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          EVIDIQ produces <span className="font-semibold text-[#1a130a]">evidence and a recommendation,
          not permission</span>. Pair any nonzero-risk deal with escrow or dispute rights — never rely
          on a score alone for irreversible value.
        </p>
      </div>
    </PageShell>
  );
}
