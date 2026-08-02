import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Cadence Docs — The Temporal Layer for Autonomous Agents",
  description:
    "Durable, attested future execution for agents. 18 tools that schedule one-shot, recurring, retry, expiration, and standing-monitor jobs with EIP-191 receipts and 0G-anchored attestations.",
  alternates: { canonical: "https://evidiq.dev/docs/cadence" },
  openGraph: {
    title: "EVIDIQ Cadence Docs",
    description: "The temporal layer for autonomous agents: schedule work after the response ends.",
    url: "https://evidiq.dev/docs/cadence",
    images: [{ url: "/docs/cadence-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["schedule_job", "0.005", "One-shot: run at an absolute timestamp or after a delay. Payload is opaque to Cadence and returned verbatim on firing."],
  ["schedule_recurring", "0.01", "Fixed interval or cron expression, with an optional end date and max-fires cap."],
  ["schedule_retry", "0.01", "A backoff ladder (e.g. 1m, 10m, 1h, 6h) that stops on the first acknowledged delivery."],
  ["schedule_expiration", "0.01", "Watch a deadline and fire before it lapses, with a configurable lead time."],
  ["schedule_verification", "0.015", "Convenience wrapper over schedule_monitor pre-wired to EVIDIQ services."],
  ["schedule_monitor", "0.02", "Recurring call to a target MCP tool plus a condition; fires only when the condition trips."],
  ["schedule_workflow", "0.03", "An ordered chain of steps, each with its own deadline; a step that misses its deadline fires an escalation."],
  ["reschedule_job", "0.005", "Change the time, interval, backoff or payload of an existing job."],
  ["resume_job", "0.005", "Return a paused job or series to active, keeping its history and its pollKey."],
  ["attest_execution", "0.03", "Signed bundle of a job's whole firing history — scheduled at, fired at, attempts, acknowledgements — anchored on 0G Storage."],
] as const;

const freeTools = [
  ["cadence_capabilities", "Catalog: 18 tools, pricing, delivery modes actually proven, timing guarantees."],
  ["estimate_cost", "Exact USDT0 price for a proposed schedule."],
  ["validate_schedule", "Parse and validate a schedule spec — cron, timezone, lead time, backoff — without creating anything."],
  ["verify_receipt", "Recompute the JCS digest and EIP-191-verify the signature against the fleet signer."],
  ["get_job", "Read a job's spec, state, history, and pending deliveries."],
  ["poll_due", "Fetch due deliveries for a pollKey, each with a signed receipt + idempotency key."],
  ["pause_job", "Freeze a recurring job; history and pollKey preserved."],
  ["cancel_job", "Terminal cancel with a signed closing receipt; stopping is always free."],
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

export default function CadenceDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Cadence
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        The other sixteen services answer questions.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Cadence answers them again when tomorrow arrives.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Durable, attested future execution for agents. 18 tools (8 free, 10 paid) that schedule
        one-shot, recurring, retry-ladder, expiration, standing-monitor, and workflow jobs — and
        hand back an EIP-191 receipt for every firing, with 0G-anchored attestations. AI agents
        don&apos;t have a future; Cadence sells time as a service.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10405"
        agentId={10405}
        name="EVIDIQ Cadence"
        endpoint="https://mcp.evidiq.dev/cadence/mcp"
        status="listed"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, then validate a schedule
        spec before paying for it.
      </p>
      <Code>claude mcp add --transport http evidiq-cadence https://mcp.evidiq.dev/cadence/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/cadence/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Cadence Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/cadence/skill.md</Code>

      <H2 id="use-cases">What Cadence is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Durable Scheduling", "One-shot, recurring (interval/cron), retry ladders, and expirations with lead time — jobs survive restarts in SQLite on a mounted volume."],
          ["Standing Monitors", "Recurring call to any target MCP tool plus a condition; fires only when the condition trips."],
          ["Workflow Chains", "Ordered steps, each with its own deadline; a missed deadline fires an escalation instead of stalling."],
          ["EIP-191 Receipts", "Every firing carries a signed receipt over a closed field set plus an idempotency key — at-least-once, never exactly-once, never early."],
          ["Attestation", "attest_execution bundles a job's whole firing history into a signed attestation anchored on 0G Storage."],
          ["Free Lifecycle", "pause_job and cancel_job cost nothing; a cancelled or expired job is a terminal state with a receipt — silence is never an outcome."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eighteen MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Eight free tools support discovery, validation, and the lifecycle. Ten paid tools put
        future work on the clock.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid scheduling &amp; attestation tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and lifecycle</h3>
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
          <p><span className="font-semibold">registration:</span> <a href="https://www.oklink.com/xlayer/tx/0x992a2504425bae4c60cb266cd3a7e766df190bcd4796b8e0ae86736c0a96930e" target="_blank" rel="noopener noreferrer" className="hover:underline">0x992a250…96930e</a></p>
          <p><span className="font-semibold">paid call:</span> <a href="https://www.oklink.com/xlayer/tx/0xd3a86a0a3a8a608b7aef91c6b86d0a19e9a29609ea977694a0fb13b6d07fae3e" target="_blank" rel="noopener noreferrer" className="hover:underline">0xd3a86a0…7fae3e</a> <span className="text-emerald-600">· attest_execution</span></p>
          <p><span className="font-semibold">agent wallet:</span> 0x2a8efe30…a992ca4fc9b0 · <span className="font-semibold">comm addr:</span> 0xDE9E80AC…a3A22d2fEf</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">anchor tx:</span> <a href="https://chainscan.0g.ai/tx/0x5201221f9535ac9a1ab1396347d160f4a649967df28e19e7edd53b9f941a132f" target="_blank" rel="noopener noreferrer" className="hover:underline">0x5201221…941a132f</a> <span className="text-teal-600">· status 0x1</span></p>
          <p><span className="font-semibold">storage root:</span> 0x158f608e…916ddd3</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          All 18 tools exercised live end-to-end by the OpenClaw agent (glm-5.2) against the deployed
          endpoint on 2026-08-02. Phase 1 ran with the gate in bypass; the 402 gate flips on in
          Phase 2. Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-cadence-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            cadence repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Free Tools (HTTP 200)
  cadence_capabilities        → 200 ✓
  validate_schedule           → 200 ✓
  estimate_cost               → 200 ✓
  get_job                     → 200 ✓
  poll_due                    → 200 ✓
  verify_receipt              → 200 ✓ (digestValid + signatureValid, signer recovered)
  pause_job → resume_job      → 200 ✓
  cancel_job                  → 200 ✓

Paid Tools (HTTP 200 — bypass mode, Phase 1)
  schedule_job                → 200 ✓ (fired in 5s, receipt signed)
  schedule_recurring          → 200 ✓
  schedule_retry              → 200 ✓
  schedule_expiration         → 200 ✓
  schedule_monitor            → 200 ✓
  schedule_verification       → 200 ✓
  schedule_workflow           → 200 ✓
  reschedule_job              → 200 ✓
  resume_job                  → 200 ✓
  attest_execution            → 200 ✓ (0G anchored)

HEAD /mcp → 402 · empty body (no hang) ✓
Live receipt verification: recoveredSigner == fleet signer ✓`}
        </pre>
        <img
          src="/docs/cadence-live-test.png"
          alt="EVIDIQ Cadence live test report — all 18 tools verified via the OpenClaw agent"
          width={1400}
          height={1083}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Cadence code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
