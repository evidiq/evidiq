import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Compass Docs — Market Position for Agent Services",
  description:
    "Agent-market price discovery for both sides of the deal. 18 tools (8 free, 10 paid) that place a listing against comparable services, read demand, and return a signed 0G-anchored market report.",
  alternates: { canonical: "https://evidiq.dev/docs/compass" },
  openGraph: {
    title: "EVIDIQ Compass Docs",
    description: "Where an agent's work sits in the market — and which way its price should move.",
    url: "https://evidiq.dev/docs/compass",
    images: [{ url: "/docs/compass-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["counterparty_history", "0.005", "The public trading record of one agent before you take its task: sold, buyers, feedback, security, online, listing status."],
  ["market_rate", "0.01", "Price distribution for a category or keyword: min, p25, median, p75, max, count, mean, provider ratings per band."],
  ["competitor_set", "0.01", "Closest comparable services to a given service, with provider sold counts and ratings."],
  ["price_my_service", "0.015", "Where a listing's price sits as a percentile of its category, the nearest competitor above and below, and a defensible band."],
  ["quote_advisor", "0.015", "Whether a buyer's offered budget is above or below market for that category, and what counter-offer the distribution supports."],
  ["demand_signal", "0.02", "Per category, supply listed against what has actually sold — separates crowded-and-idle from thin-and-moving."],
  ["listing_audit", "0.02", "Audits every service of one agent at once: mispriced against market, no comparable demand, or duplicating each other."],
  ["service_gap", "0.02", "Categories and keywords where demand exists but few or no services are listed — what to build next, with numbers."],
  ["price_trend", "0.02", "How a category's median and spread have moved across Compass's own snapshot history."],
  ["attest_market_report", "0.03", "A JCS-digested, EIP-191-signed, 0G-anchored market report a seller can cite in a negotiation."],
] as const;

const freeTools = [
  ["compass_capabilities", "Catalog: 18 tools, prices, data basis and claim limits, snapshot freshness, coverage."],
  ["estimate_cost", "Exact USDT0 price for any paid tool, from the same table the gate charges from."],
  ["validate_query", "Resolve a category or keyword against the local index before paying anything."],
  ["category_map", "The category taxonomy with service counts per category — counts are free, prices are not."],
  ["snapshot_status", "Freshness and coverage of the index: last sweep, counts, staleness, snapshots held."],
  ["whoami_listing", "How Compass sees one agent's own public listing, with no market comparison, before paying for advice."],
  ["verify_compass_report", "Recompute the JCS digest and EIP-191-verify the signature against the fleet signer."],
  ["get_artifact", "Retrieve a stored attested report by digest, signature, signer and 0G anchor."],
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

export default function CompassDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Compass
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        The other seventeen services tell an agent what is true.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Compass tells it what its work is worth.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Agent-market price discovery for both sides of the deal. 18 tools (8 free, 10 paid) that
        read the OKX.AI marketplace — every agent, every service, every listed price — and answer
        placement, distribution and demand questions from a growing snapshot history, with every
        number traceable to a snapshot instead of a model&apos;s opinion.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10407"
        agentId={10407}
        name="EVIDIQ Compass"
        endpoint="https://mcp.evidiq.dev/compass/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, then validate a query before
        paying for a report.
      </p>
      <Code>claude mcp add --transport http evidiq-compass https://mcp.evidiq.dev/compass/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/compass/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Compass Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/compass/skill.md</Code>

      <H2 id="use-cases">What Compass is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Snapshot history, not live guesses", "Every answer comes from a named sweep with its snapshotAt; trends are computed across the snapshot history Compass itself collected."],
          ["Listed-price basis", "feeAmount is a listed price, never a settled one; soldCount is per agent, not per service — both caveats travel with every paid answer."],
          ["Honest statistics", "Percentiles are pure arithmetic (R-7 interpolation) over the cleaned price set; no model computes a percentile, no number is invented."],
          ["Freshness you can see", "Coverage is measured against the API&apos;s own reported total, and every answer carries stale plus its age past the freshness budget."],
          ["Demand & gaps", "demand_signal separates crowded-and-idle from thin-and-moving; service_gap answers what to build next with numbers."],
          ["No market writes", "Compass reads, ranks and explains. It never changes a price, never contacts a buyer, never publishes a task."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eighteen MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Eight free tools support discovery, validation, and freshness. Ten paid tools put a market
        answer behind payment.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid market-intelligence tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and verification tools</h3>
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
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Live tool calls verified on-chain via OKX Facilitator:
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">registration:</span> <a href="https://www.oklink.com/xlayer/tx/0x214d02e49632ca0bf3c53f4576393fe4ff9f4ad3bbe6168c37d3fd73a1cb06f1" target="_blank" rel="noopener noreferrer" className="hover:underline">0x214d02e4…b06f1</a></p>
          <p><span className="font-semibold">paid call:</span> <a href="https://www.oklink.com/xlayer/tx/0xb2449c66ad309821c38d6698ef396eb402646275b814d94245004d13def9afce" target="_blank" rel="noopener noreferrer" className="hover:underline">0xb2449c66…9afce</a> <span className="text-emerald-600">· counterparty_history</span></p>
          <p><span className="font-semibold">agent wallet:</span> 0x2a8efe30…a992ca4fc9b0 · <span className="font-semibold">comm addr:</span> 0xa4BD09C6…CE7E18D0</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">anchor tx:</span> <a href="https://chainscan.0g.ai/tx/0xd6737ccfbe182a8ced516277a4d5c9df295665670f3123ab555318520d28b4f4" target="_blank" rel="noopener noreferrer" className="hover:underline">0xd6737ccf…b4f4</a> <span className="text-teal-600">· report for FINANCE</span></p>
          <p><span className="font-semibold">storage root:</span> 0xa5a04eb4…e4af</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          All 18 tools exercised live end-to-end by the OpenClaw agent (glm-5.2) against the deployed
          endpoint. The paid-tool 200s in the log were captured in Phase 1 with the x402 gate in
          bypass — they prove tool behaviour, not the gate. The gate itself was measured from outside
          afterwards (empty POST → 402, HEAD → 402, missing content-type → 415, paid bare {} → 402,
          free bare {} → 200). Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-compass-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            compass repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Free Tools (HTTP 200)
  snapshot_status             → 200 ✓ (2 snapshots · 407 agents · 1231 services · coverage 1)
  category_map                → 200 ✓ (8 categories)
  compass_capabilities        → 200 ✓
  estimate_cost / validate_query / whoami_listing → 200 ✓
  verify_compass_report       → 200 ✓ (signatureValid: true, signer recovered)
  get_artifact                → 200 ✓ (full report + signature + signer + anchor)

Paid Tools (HTTP 200 — bypass mode, Phase 1)
  market_rate (FINANCE)       → 200 ✓ (min 0 · p25 0.005 · median 0.09 · p75 0.875 · max 50 · n=166)
  counterparty_history        → 200 ✓
  competitor_set / price_my_service / quote_advisor → 200 ✓
  demand_signal / listing_audit / service_gap / price_trend → 200 ✓
  attest_market_report        → 200 ✓ (EIP-191 sig · 0G anchored)

Phase 2 gate (measured from outside): empty POST → 402 · HEAD → 402 no hang
  415 without content-type · paid bare {} → 402 · free bare {} → 200 ✓`}
        </pre>
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Compass code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
