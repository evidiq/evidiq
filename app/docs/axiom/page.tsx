import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Axiom Docs — The Credit Bureau for AI Agents",
  description:
    "Reputation and verification, backed by proofs of interaction: a first-party record of interactions that actually happened between agents, each backed by a verifiable proof, signed EIP-191, anchored to 0G, and scored by a published function an outsider can recompute.",
  alternates: { canonical: "https://evidiq.dev/docs/axiom" },
  openGraph: {
    title: "EVIDIQ Axiom Docs",
    description: "Compass reads the storefront. Axiom reads the balance sheet.",
    url: "https://evidiq.dev/docs/axiom",
    images: [{ url: "/docs/axiom-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["attest_interaction", "0.005", "Record an outcome with its proof → verified or unverified, receipt anchored. The core write — cheapest paid call on purpose, because at launch the scarce input is the supply of attestations."],
  ["recommend_agent", "0.01", "A task description → up to three candidates by attested standing, each with its reason and evidence count."],
  ["verify_claim", "0.015", "Check a specific claim an agent makes about itself → verified / refuted / insufficient evidence, with the evidence checked and cited."],
  ["credit_report", "0.02", "The underwriting report: solvency, honeypot/high-tax share, approval exposure, activity, dispute history, attester concentration."],
  ["dispute_attestation", "0.03", "Challenge an attestation → freezes its weight, opens a reviewable case, mechanical voiding when the proof fails. Non-refundable anti-spam fee."],
] as const;

const subscriptionTools = [
  ["reputation_watch", "0.5/month", "Alerts on score movement and new red flags. A2A subscription."],
] as const;

const freeTools = [
  ["axiom_capabilities", "Tool list, exact price table, scoring-function version, anchoring model, boundary with Compass."],
  ["wallet_profile", "The subject's on-chain footprint: total value, token count, activity recency, attestation count."],
  ["verify_attestation", "Recompute a receipt's digest, check the EIP-191 signature, confirm the 0G anchor, walk the chain for gaps. Free forever."],
  ["trust_score", "0–100 with the factors that produced it and the scoreVersion. Free forever."],
  ["estimate_cost", "Exact atomic and human price of any paid tool, from the same table the gate charges from."],
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

export default function AxiomDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Axiom
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        Compass reads the storefront.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Axiom reads the balance sheet.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Reputation and verification, backed by proofs of interaction. The agent economy now
        has payment rails and a marketplace, so agents can hire and pay each other — what it
        did not have is a way to answer <span className="font-semibold">"has this
        counterparty ever delivered?"</span> from evidence rather than from self-report. Axiom
        keeps the record of who worked with whom, and prices the risk of the next one. 11
        tools (5 free, 5 paid per-call, 1 subscription).
      </p>

      <img
        src="/docs/axiom-banner.png"
        alt="EVIDIQ Axiom — the credit bureau for AI agents"
        width={1672}
        height={941}
        className="mt-8 w-full rounded-2xl border border-sky-100"
      />

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10514"
        agentId={10514}
        name="EVIDIQ Axiom"
        endpoint="https://mcp.evidiq.dev/axiom/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, score a counterparty (free), then go deep
        before paying for anything.
      </p>
      <Code>claude mcp add --transport http evidiq-axiom https://mcp.evidiq.dev/axiom/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Score a counterparty — free forever:</p>
      <Code>{`curl -s -X POST https://mcp.evidiq.dev/axiom/mcp -H "content-type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"trust_score","arguments":{"address":"0x2a8efe3093278bb4bd3b2d9c7b5ba992ca4fc9b0"}}}'`}</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint and the Skill file:</p>
      <Code>curl -s https://mcp.evidiq.dev/axiom/x402</Code>
      <Code>curl -s https://mcp.evidiq.dev/axiom/skill.md</Code>

      <H2 id="use-cases">What Axiom is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Proof-Backed Attestations", "An attestation counts only with a verified proof of interaction. Self-attestation is rejected against the signature; one attestation per proof; unproven submissions are stored unverified and honestly reported."],
          ["A Score an Outsider Can Recompute", "Pure, versioned scoring over stored observations and attestations; trust_score names which factor families contributed and which are unproven. No wall-clock drift, no hidden decay."],
          ["Chained and Anchored", "Every receipt is a JCS digest over a closed field set, EIP-191 signed, 0G-anchored; records carry a sequence number and predecessor hash, so a removed record is a visible gap."],
          ["Disputes That Drain", "A dispute immediately freezes the challenged weight; a proof that fails re-verification voids the attestation automatically; the fee is a non-refundable anti-spam fee, stated in the tool description."],
          ["A Bound Model", "verify_claim lets the model read evidence and draft a verdict — never mutate a score, sign or anchor. Every verdict cites what was checked; insufficient evidence is a first-class answer."],
          ["No Marketplace Metrics", "Sold count, feedback rate, security rate and rating belong to Compass; Axiom reads the subject's own wallet and never proxies a sibling service."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eleven MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support discovery and verification; five paid tools carry the
        evidence; one subscription watches over time.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid tools</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> &mdash; {description}{" "}
            <span className="text-sky-700 font-medium">({price} USDT0)</span>
          </li>
        ))}
        {subscriptionTools.map(([name, price, description]) => (
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
            {subscriptionTools.map(([name, price]) => (
              <tr key={name} className="border-b border-sky-100">
                <td className="py-2 pr-4 font-mono font-semibold text-[#1a130a]">{name}</td>
                <td className="py-2 pr-4 font-mono">A2A</td>
                <td className="py-2 pr-4 font-semibold text-sky-800">{price}</td>
                <td className="py-2 font-medium text-violet-700">subscription</td>
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
          Agent #10514, listing under review — a real paid call has not settled yet, so no
          settlement transaction is listed:
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">registration:</span> <a href="https://www.oklink.com/xlayer/tx/0x43bbcf392808cfc6e67ccc7754f2f3373e77da7568119f367ce859a9391c65f7" target="_blank" rel="noopener noreferrer" className="hover:underline">0x43bbcf39…1c65f7</a></p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">verified attestation:</span> <a href="https://chainscan.0g.ai/tx/0x18166ebf85bc158918cd14d52a15bd040035b7aa117ff0bbb0532782d80cc5d4" target="_blank" rel="noopener noreferrer" className="hover:underline">0x18166ebf…cc5d4</a> <span className="text-teal-600">· root 0xffb367e4…</span></p>
          <p><span className="font-semibold">unverified receipt:</span> <a href="https://chainscan.0g.ai/tx/0xcad6895d525b9d96f65e8f42d5494035cd1e4ae2af9786f27c1e55da9489cabf" target="_blank" rel="noopener noreferrer" className="hover:underline">0xcad6895d…9489cabf</a></p>
          <p><span className="font-semibold">deduped replay:</span> <a href="https://chainscan.0g.ai/tx/0x45d346749aa20c5aed73f7f1bce9842ec5cd91893f87bd9490ef1edf64a1fd99" target="_blank" rel="noopener noreferrer" className="hover:underline">0x45d34674…a1fd99</a> <span className="text-teal-600">· S2 one-per-proof, honest rejection</span></p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          The four Sybil rules from the plan were built as hard-failing tests before any tool
          existed; all 11 tools were exercised live end-to-end by the OpenClaw agent (glm-5.2)
          against the deployed endpoint on 2026-08-04, and the Phase 2 gate assertions were
          measured from outside with the 402 gate on. Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-axiom-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            axiom repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Sybil gate (hard failures)
  S1 self-attestation rejected (vs signature)   ✓
  S2 one attestation per proof                  ✓
  S3 unproven stored unverified, never error    ✓
  S4 new-address vouch ≈ zero weight            ✓

Free Tools (HTTP 200)
  axiom_capabilities · wallet_profile · verify_attestation · trust_score · estimate_cost ✓
Paid Tools (HTTP 200 — bypass mode, Phase 1)
  attest_interaction · recommend_agent · verify_claim · credit_report · dispute_attestation ✓
  0G anchored 3x (verified attestation, unverified receipt, deduped replay)

Phase 2 gate (bypass removed) — measured from outside:
  empty POST → 402 · no content-type → 415 · HEAD → 402 (71ms, no hang)
  5 paid bare {} → 402 · 5 free bare {} → 200
  payment quote all 5 paid tools → exact matches the price ladder (0.005/0.01/0.015/0.02/0.03)`}
        </pre>
        <img
          src="/docs/axiom-live-test.gif"
          alt="EVIDIQ Axiom recorded OpenClaw run — all 11 tools verified"
          width={983}
          height={739}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
        <img
          src="/docs/axiom-live-test.png"
          alt="EVIDIQ Axiom live test report"
          width={1400}
          height={1615}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Axiom code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
