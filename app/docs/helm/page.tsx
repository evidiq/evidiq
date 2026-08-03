import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Helm Docs — Rule-Bound Execution",
  description:
    "Rule-bound execution for the OKX.AI Trading Hackathon: a declarative trading mandate enforced by a deterministic engine, every decision EIP-191 signed and 0G-anchored before the fill, records chained by sequence number and predecessor hash.",
  alternates: { canonical: "https://evidiq.dev/docs/helm" },
  openGraph: {
    title: "EVIDIQ Helm Docs",
    description: "Compass prices the market. Helm proves how it traded.",
    url: "https://evidiq.dev/docs/helm",
    images: [{ url: "/docs/helm-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["decision_log", "0.005", "The signed decision chain over a window: which signal fired, which rule matched, what stop was set, at what price — sequence number, signature and anchor per record."],
  ["signal_digest", "0.01", "The current ranked watchlist with its basis: which sources contributed and when the offline pass ran."],
  ["risk_report", "0.01", "Live exposure: open positions, where each stop sits, distance to the daily loss limit, drawdown from the principal base."],
  ["performance_attestation", "0.015", "A signed PnL statement for a window, tied to the decision chain, anchored on 0G — the number and the reasoning arrive together."],
  ["mandate_compliance_audit", "0.03", "Walks every position and decision in a window against the mandate in force and lists violations — including a no-trade that should have been a trade."],
] as const;

const freeTools = [
  ["helm_capabilities", "Catalog: 10 tools, prices, mandate summary, trust model and boundaries."],
  ["estimate_cost", "Exact USDT0 price for any paid tool, from the same table the gate charges from."],
  ["get_mandate", "The rule set and risk limits currently in force, verbatim. Free forever."],
  ["chain_status", "Freshness and integrity: last decision, current sequence number, gaps, anchored versus pending records."],
  ["verify_helm_decision", "Offline verification of any record: recompute the digest, check the EIP-191 signature, walk the predecessor hashes, report gaps. Free forever."],
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

export default function HelmDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Helm
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        Compass prices the market.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Helm proves how it traded.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Every other hackathon entry will publish a PnL number. Helm publishes a number
        with evidence behind it: which signal fired, which rule matched, what stop was
        set, at what price — signed EIP-191 by the fleet signer and anchored on 0G
        Storage <span className="font-semibold">before</span> the fill, chained so that
        dropping a record leaves a hole anyone can see. The mandate is a public
        commitment: <span className="font-mono">get_mandate</span> returns it verbatim,
        free forever. 10 tools (5 free, 5 paid).
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10453"
        agentId={10453}
        name="EVIDIQ Helm"
        endpoint="https://mcp.evidiq.dev/helm/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, read the mandate in force (free), then
        check the decision chain before paying for anything.
      </p>
      <Code>claude mcp add --transport http evidiq-helm https://mcp.evidiq.dev/helm/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Read the mandate — free forever, this is the public commitment:</p>
      <Code>{`curl -s -X POST https://mcp.evidiq.dev/helm/mcp -H "content-type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_mandate","arguments":{}}}'`}</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint and the Skill file:</p>
      <Code>curl -s https://mcp.evidiq.dev/helm/x402</Code>
      <Code>curl -s https://mcp.evidiq.dev/helm/skill.md</Code>

      <H2 id="use-cases">What Helm is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Declarative Mandate", "Entry, exit, sizing, stop distance and daily loss limit are configuration the engine loads and enforces; the shipped default is a clearly-marked conservative placeholder for the owner to confirm."],
          ["No LLM in the Execution Path", "A model ranks the watchlist offline, once or twice a day; deterministic code decides and places orders. If the model is slow or wrong, only the watchlist goes stale."],
          ["Anchor Before the Fill", "Every decision is EIP-191 signed and 0G-anchored before the order is submitted; no-trade decisions are anchored too. A 0G outage degrades the evidence, never the trading."],
          ["A Chain an Outsider Can Audit", "Records carry a sequence number, the predecessor hash, a JCS digest over a closed field set and a signature; verify_helm_decision walks the chain and reports gaps."],
          ["The Compliance Claim", "mandate_compliance_audit walks positions and decisions against the mandate in force and lists violations — including a no-trade that should have been a trade."],
          ["No Custody", "Helm sells its evidence and its signals; it never takes a subscriber's funds, keys or API credentials."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support discovery and verification; five paid tools carry the
        evidence.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid execution and evidence tools</h3>
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

      <H2 id="pricing">x402 pricing</H2>
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
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Registered on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Agent #10453, category TRADING, ten A2MCP tools plus one A2A subscription —
          diff against live <span className="font-mono">tools/list</span> empty in both
          directions:
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">registration:</span> <a href="https://www.oklink.com/xlayer/tx/0x0cc68aa0c0025af0c04a8a4900bcd0c5521005a1ad25607fc32d6ce02939ba14" target="_blank" rel="noopener noreferrer" className="hover:underline">0x0cc68aa…39ba14</a></p>
          <p><span className="font-semibold">subscription added:</span> <a href="https://www.oklink.com/xlayer/tx/0x132928476e0ffd401b39878c8324d88f9feef59a5c7a2b237f0ea880119e4dd1" target="_blank" rel="noopener noreferrer" className="hover:underline">0x1329284…9e4dd1</a> <span className="text-emerald-600">· Rule-bound spot signals, 0.3 USDT/month, 72h trial</span></p>
          <p><span className="font-semibold">comm addr:</span> 0xB6B7922C…fB054c06</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">anchor tx:</span> <a href="https://chainscan.0g.ai/tx/0x088420ea8aad205c2beb6f6d8e1490085cbe6d30200faa839ec8e0bf5dcfb26d" target="_blank" rel="noopener noreferrer" className="hover:underline">0x088420e…dcfb26d</a> <span className="text-teal-600">· performance_attestation</span></p>
          <p><span className="font-semibold">storage root:</span> 0xf20ccb79…460b477e5</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          The rules-engine fixture gate passed 14/14 before any tool existed; the
          decision-chain suite (digest, EIP-191, gap detection including omission) and
          the compliance audit suite pass; all 10 tools exercised live end-to-end by the
          OpenClaw agent on the VPS on 2026-08-03, and the Phase 2 gate assertions were
          measured from outside with the 402 gate on. Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-helm-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            helm repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Fixture gate (14/14)
  F1 strong signal, no positions        → enter, size 60 USDT, stop 97 000 ✓
  F2 signal below threshold             → wait (never a phantom trade)   ✓
  F3 daily loss limit reached           → halt even with a strong signal  ✓
  F5 instrument outside mandate scope   → wait                            ✓
  F7/F9 stop hit (long/short)           → exit (stop-hit)                ✓
  F10 price between stop and TP         → hold                           ✓
  F14 determinism                       → identical inputs, identical    ✓

Free Tools (HTTP 200)
  helm_capabilities · estimate_cost · get_mandate · chain_status · verify_helm_decision ✓
Paid Tools (HTTP 200 — bypass mode, Phase 1)
  decision_log · signal_digest · risk_report · performance_attestation · mandate_compliance_audit ✓
  0G anchored twice (root 0xf20ccb79… / 0x154af1…)

Phase 2 gate (bypass removed) — measured from outside:
  empty POST → 402 · no content-type → 415 · HEAD → 402 (75ms, no hang)
  5 paid bare {} → 402 · 5 free bare {} → 200
  payment quote all 5 paid tools → exact matches the price ladder (0.005/0.01/0.01/0.015/0.03)`}
        </pre>
        <img
          src="/docs/helm-live-test.png"
          alt="EVIDIQ Helm live test report — all 10 tools verified via the OpenClaw agent"
          width={1400}
          height={922}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Helm code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
