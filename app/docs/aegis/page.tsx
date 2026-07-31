import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Aegis Docs — Is this transaction safe to authorize under financial policy?",
  description:
    "Autonomous financial policy engine, budget velocity caps, escrow release validation, fee surge protection, and signed attestation reports for AI agent transactions.",
  alternates: { canonical: "https://evidiq.dev/docs/aegis" },
  openGraph: {
    title: "EVIDIQ Aegis Docs",
    description: "Autonomous financial policy engine & budget guard for AI agent fleets.",
    url: "https://evidiq.dev/docs/aegis",
    images: [{ url: "/docs/aegis-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["verify_payment_policy", "0.005", "Evaluate payment payload against budget velocity, recipient allowlists, replay nonces, and EVM parameters."],
  ["audit_spending_window", "0.01", "Audit agent wallet spending velocity across 60m, 6h, 24h, and 7d historical windows with utilization reporting."],
  ["inspect_escrow_release", "0.015", "Inspect escrow terms, deliverable SHA-256 checksums, and provider addresses before fund release."],
  ["guard_slippage_inflation", "0.02", "Guard against fee inflation, protocol price surges, and slippage spikes on cross-agent transactions."],
  ["attest_budget_verdict", "0.03", "Bind financial policy evaluation findings into an EIP-191 signed cryptographic attestation report."],
] as const;

const freeTools = [
  ["aegis_capabilities", "Capabilities, policy profiles, rule catalog, auxiliary checks, and pricing catalog."],
  ["validate_transfer_params", "Preflight check for financial transfer EVM formatting and address sanity."],
  ["estimate_cost", "Price quotation lookup tool."],
  ["verify_aegis_report", "Offline verification tool for Aegis report integrity digests and signatures."],
  ["get_artifact", "Retrieve stored policy reports or default policy specifications."],
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

export default function AegisDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Aegis
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Autonomous AI agents require strict, deterministic financial policy enforcement to prevent runaway spending,
        unauthorized wallet transfers, fee surge exploitation, and deliverable escrow fraud. EVIDIQ Aegis acts as an automated budget guard and policy evaluator before value moves.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10367"
        agentId={10367}
        name="EVIDIQ Aegis"
        endpoint="https://mcp.evidiq.dev/aegis/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint to OpenClaw or Claude Code, then preflight for free before paying.
      </p>
      <Code>openclaw mcp add evidiq-aegis --transport streamable-http --url https://mcp.evidiq.dev/aegis/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/aegis/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Aegis Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/aegis/skill.md</Code>

      <H2 id="openclaw-demo">OpenClaw Autonomous Agent Executions</H2>
      <p className="mt-3 text-[#201810]/70">
        Live execution trace from OpenClaw autonomous agent runs (<span className="font-mono text-sm font-semibold">openclaw agent</span>) invoking the installed <span className="font-mono text-sm font-semibold">evidiq-aegis</span> MCP skill.
      </p>

      {/* OpenClaw Execution Card 1 */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
            <span className="ml-2 font-semibold text-slate-300">openclaw agent --session-id aegis-policy-audit</span>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
            VERDICT: PASS (200 OK)
          </span>
        </div>
        <pre className="overflow-x-auto p-4 leading-relaxed text-slate-300">
{`openclaw@hackaton-do:~$ openclaw agent --agent main --message "Check EVIDIQ Aegis MCP tool aegis_capabilities on https://mcp.evidiq.dev/aegis/mcp"

[provider-transport-fetch] start provider=zerog model=glm-5.2 method=POST url=https://router-api.0g.ai/v1/chat/completions
[evidiq-aegis-vps] Executing tool aegis_capabilities (Streamable HTTP -> https://mcp.evidiq.dev/aegis/mcp)

Here's what the EVIDIQ Aegis MCP aegis_capabilities tool returns:

Server Info:
- Endpoint: https://mcp.evidiq.dev/aegis/mcp (JSON-RPC over HTTP POST)
- Schema/Engine/Tool version: 1.0.0 | Mode: production

Available Tools (10 Total: 5 Paid, 5 Free):
• verify_payment_policy    : $0.005 USD₮0 (5,000 atomic)
• audit_spending_window    : $0.01  USD₮0 (10,000 atomic)
• inspect_escrow_release   : $0.015 USD₮0 (15,000 atomic)
• guard_slippage_inflation : $0.02  USD₮0 (20,000 atomic)
• attest_budget_verdict    : $0.03  USD₮0 (30,000 atomic)
• 5 Utility Tools          : $0.00  (Free / Ungated)

Engine Capabilities: budget-policy · velocity-control · escrow-validation · slippage-detection · offline-attestation
Enforced Rules: budget.maxDailySpend · budget.velocity · escrow.hash · x402.payto · slippage.max · token.allowlist · replay.nonce · deadline.expiration`}
        </pre>
      </div>

      <H2 id="use-cases">What Aegis is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Daily Spending Velocity Caps", "Prevent runaway autonomous transactions by enforcing hard 60m, 6h, and 24h budget limits."],
          ["Escrow Deliverable Verification", "Inspect SHA-256 deliverable checksums and provider signatures before authorizing funds release."],
          ["Slippage & Fee Inflation Guard", "Detect protocol price surge spikes and unexpected fee inflation on cross-agent payments."],
          ["Recipient Allowlist Enforcement", "Block transfers to unknown or blacklisted counterparty addresses instantly."],
          ["Signed Attestation Reports", "Produce EIP-191 signed cryptographic reports verifying financial policy evaluation verdicts."],
          ["Autonomous Decision Precedence", "Deterministic REJECT > BLOCK > REVIEW > PASS pipeline guarantees strict safety."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="pipeline">7-Stage Pipeline & Precedence</H2>
      <p className="mt-3 text-[#201810]/70">
        Aegis processes all transaction evaluations through a 7-stage deterministic pipeline:
        <span className="font-mono text-sm font-semibold"> Normalize → Auxiliary Validation → Rule Engine → Decision Precedence → Risk Aggregation → Integrity Digest → EIP-191 Signer</span>.
      </p>

      <H2 id="tools">Ten MCP tools</H2>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid checks</h3>
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
        (<span className="font-mono">eip155:196</span>). Verification and settlement run through the{" "}
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
        settles it on X Layer before any check runs.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Live paid calls against the deployed Aegis endpoint completed full x402 v2 settlement on X Layer Mainnet.
          All paid tools (<span className="font-mono">verify_payment_policy</span>, <span className="font-mono">audit_spending_window</span>, etc.)
          verify EIP-191 digest signatures and generate cryptographic policy verdict reports.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x6f74549eecb4627509f6397db02b8397892c9893d869790006b258b6996cca86"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x6f74549eecb4627509f6397db02b8397892c9893d869790006b258b6996cca86
        </a>
      </div>

      <H2 id="vps-verification">OpenClaw VPS Verification & Live Status</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ Aegis is deployed live on high-availability VPS infrastructure with OKX Onchain OS x402 V2 payment gate enforcement.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-sky-200 bg-slate-900 p-2 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/docs/aegis_openclaw_vps_status.png"
          alt="OpenClaw Live VPS Status - EVIDIQ Aegis"
          className="w-full rounded-lg object-cover"
        />
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Aegis code under MIT. Third-party dependencies keep their own
        open-source licenses, preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
