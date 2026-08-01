import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Methodology Docs — MCP Fleet Production Framework & Verification Tools",
  description:
    "Fleet production verification tools for OKX.AI MCP builders. 15 tools that audit, validate, and attest MCP readiness with EIP-191 signed attestations and 0G Storage anchoring. 15 auto-triggering methodology skills.",
  alternates: { canonical: "https://evidiq.dev/docs/methodology" },
  openGraph: {
    title: "EVIDIQ Methodology Docs",
    description: "MCP fleet production framework & verification tools for OKX.AI builders.",
    url: "https://evidiq.dev/docs/methodology",
    images: [{ url: "/docs/methodology-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["audit_git_history", "0.005", "Scan full git history for leaked keys (EVM 0x64hex, ghp_, OKX creds, mnemonics) + git toplevel check."],
  ["check_okx_status", "0.005", "Query OKX.AI listing status (approvalLabel, approvalRemark, communicationAddress)."],
  ["validate_x402_compliance", "0.01", "Decode base64 x402 v2 challenge and verify §41-C compliance field-by-field."],
  ["validate_plan_freeze", "0.01", "Verify PLAN.md has §17 Contract Freeze, determinism contract, and all normative sections."],
  ["pre_submit_check", "0.015", "Combine curl sweep + capability diff + x402 compliance into one go/no-go report."],
  ["scan_deployment_env", "0.02", "Check container env: signerAvailable, paymentGate, OKX creds, OG key presence."],
  ["production_readiness_score", "0.02", "Score 0–100 vs 16 EVIDIQ defects with live curl sweep, git scan, and OKX status."],
  ["verify_onchain_proof", "0.02", "Verify settle tx via eth_getTransactionReceipt on X Layer."],
  ["generate_runbook_entry", "0.03", "Generate §24 registry row + §NN section template from agentId + txHash."],
  ["attest_readiness", "0.03", "Full audit + EIP-191 signed attestation + 0G Storage merkle root anchoring."],
] as const;

const freeTools = [
  ["methodology_capabilities", "Catalog: 15 skills, 15 tools, 16 defects, pricing."],
  ["validate_plan_sections", "Check PLAN.md has §0 defects + §17 freeze + two-phase scope."],
  ["diff_capabilities", "Compare tools/list vs *_capabilities.tools (defect #8/#9)."],
  ["curl_sweep", "HEAD/GET/POST sweep with 10s timeout (defect #14 HEAD /mcp hang)."],
  ["verify_determinism", "Call free MCP tool 2× and deep-compare JSON responses."],
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

export default function MethodologyDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Methodology
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Fleet production verification tools for OKX.AI MCP builders. 15 tools (5 free, 10 paid)
        that audit, validate, and attest MCP readiness — git history scan, x402 challenge validator,
        OKX status checker, production readiness score, and EIP-191 signed attestation with 0G Storage
        anchoring. Plus 15 auto-triggering methodology skills.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10389"
        agentId={10389}
        name="EVIDIQ Methodology"
        endpoint="https://mcp.evidiq.dev/methodology/mcp"
        status="listed"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, then run a readiness audit
        before submitting your MCP to OKX.AI.
      </p>
      <Code>claude mcp add --transport http evidiq-methodology https://mcp.evidiq.dev/methodology/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/methodology/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Methodology Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/methodology/skill.md</Code>

      <H2 id="use-cases">What Methodology is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Git History Audit", "Scan full commit history for leaked private keys, GitHub PATs, OKX creds, and mnemonics."],
          ["x402 Challenge Validator", "Decode and verify §41-C compliance field-by-field. Confirms WWW-Authenticate absence."],
          ["OKX Status Checker", "Query listing status — approvalLabel, approvalRemark, communicationAddress."],
          ["Plan Freeze Validator", "Check PLAN.md for §17 Contract Freeze, determinism contract, normative sections."],
          ["Pre-Submit Go/No-Go", "Combined curl sweep + capability diff + x402 compliance in one report."],
          ["Production Readiness Score", "Score 0–100 vs 16 real defects from 15 MCP builds. Live checks."],
          ["On-Chain Proof Verifier", "Verify settle tx via eth_getTransactionReceipt. Status 0x1 confirmation."],
          ["Readiness Attestation", "Full audit + EIP-191 signature + 0G Storage merkle root anchor."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Fifteen MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight and discovery. Ten paid tools provide audit, validation,
        scoring, and attestation.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid audit &amp; attestation tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-7 text-lg font-bold text-[#1a130a]">Free preflight and discovery</h3>
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
          <p><span className="font-semibold">audit_git_history:</span> <a href="https://www.oklink.com/xlayer/tx/0xb08852dcde3682645ed2927fa5577cf4d15735672fe08f3909030a33b56a5b7a" target="_blank" rel="noopener noreferrer" className="hover:underline">0xb08852d…6a5b7a</a></p>
          <p><span className="font-semibold">attest_readiness:</span> <a href="https://www.oklink.com/xlayer/tx/0xfc003a8e30055c96659bd4bc4c5d0ccd6456b4c713d47bf578b795dd6e2337cc" target="_blank" rel="noopener noreferrer" className="hover:underline">0xfc003a8…2337cc</a> <span className="text-emerald-600">· verdict READY · score 100</span></p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">anchor tx:</span> <a href="https://chainscan.0g.ai/tx/0x6a05c1da8242ec93a8d3fbab46e2157a3a71dd2244697088d28a7bead8d3defb" target="_blank" rel="noopener noreferrer" className="hover:underline">0x6a05c1d…3defb</a> <span className="text-teal-600">· status 0x1</span></p>
          <p><span className="font-semibold">storage root:</span> 0xa793d5fb…0850</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          All 15 tools tested via direct MCP protocol on VPS. 0G anchoring live.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Free Tools (HTTP 200)
  methodology_capabilities       → 200 ✓
  validate_plan_sections         → 200 ✓
  diff_capabilities              → 200 ✓
  curl_sweep                     → 200 ✓
  verify_determinism             → 200 ✓

Paid Tools (HTTP 402)
  audit_git_history              → 402 ✓
  check_okx_status               → 402 ✓
  validate_x402_compliance       → 402 ✓
  validate_plan_freeze           → 402 ✓
  pre_submit_check               → 402 ✓
  scan_deployment_env            → 402 ✓
  production_readiness_score     → 402 ✓
  verify_onchain_proof           → 402 ✓
  generate_runbook_entry         → 402 ✓
  attest_readiness               → 402 ✓

OKX Validator — all 10 paid ok=True ✓

On-Chain Settlements
  audit_git_history 0.005 → 0xb08852dc… 0x1 ✓
  attest_readiness 0.03   → 0xfc003a8e… 0x1 ✓
  verdict: READY · score: 100 ✓
  zeroGAnchorTx: 0x6a05c1da… ✓
  zeroGStorageRoot: 0xa793d5fb… ✓`}
        </pre>
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Methodology code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
