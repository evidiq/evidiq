import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Rubric Docs — Does this deliverable meet the contract?",
  description:
    "Deterministic acceptance checks for agent deliverables: schema conformance, grounding in supplied sources, and declarative criteria, with a signed verdict and x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/rubric" },
  openGraph: {
    title: "EVIDIQ Rubric Docs",
    description: "A verdict on work an agent was paid for, that anyone can recompute.",
    url: "https://evidiq.dev/docs/rubric",
    images: [{ url: "/docs/rubric-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["check_schema", "0.005", "Validate a structured deliverable against a JSON Schema; every violation is reported by path, with the expected and actual type."],
  ["verify_grounding", "0.01", "Check that every quoted span, number and date is supported by the sources supplied with the deliverable; unsupported spans come back with offsets."],
  ["check_acceptance", "0.015", "Evaluate a deliverable against an acceptance spec and return PASS, REVIEW, BLOCK or REFUSED with the per-criterion results that decided it."],
  ["diff_deliverable", "0.02", "Compare a revision against the previous version and the spec: which criteria flipped, and what changed between them."],
  ["attest_acceptance", "0.03", "Bind the spec digest, deliverable digest and verdict into one EIP-191 signed attestation, and anchor the digest."],
] as const;

const freeTools = [
  ["rubric_capabilities", "Spec DSL version, criterion catalogue with severities, supported deliverable kinds, limits, full pricing, and the names of all ten tools."],
  ["validate_spec", "Parse-check the spec and the deliverable and return counts by severity — refusing exactly what a paid check would refuse."],
  ["estimate_cost", "Price one tool, or the whole table when none is named."],
  ["verify_rubric_report", "Recompute the digest and verify the EIP-191 signature offline."],
  ["get_artifact", "Retrieve a stored report or attestation by id, within its in-memory TTL."],
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

export default function RubricDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Rubric
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Payment for work implies acceptance, and acceptance is usually one person&apos;s opinion — which is exactly
        what neither side can verify later. Rubric turns it into a verdict against a spec both sides agreed on before
        the work started, computed the same way every time by anyone holding the same bytes.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/9848"
        agentId={9848}
        name="EVIDIQ Rubric"
        endpoint="https://mcp.evidiq.dev/rubric/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, then preflight for free before paying.
      </p>
      <Code>claude mcp add --transport http evidiq-rubric https://mcp.evidiq.dev/rubric/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/rubric/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Rubric Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/rubric/skill.md</Code>

      <H2 id="use-cases">What Rubric is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Paying for delegated work", "An agent hires another agent. The spec was agreed up front; Rubric decides whether the delivery honours it."],
          ["Disputes with evidence", "attest_acceptance signs the spec digest, the deliverable digest and the verdict, so a disagreement is settled by recomputation rather than argument."],
          ["Structured output that must hold", "JSON Schema conformance with violations reported by path — the check every LLM pipeline writes badly, once per project."],
          ["Claims tied to sources", "Quotes, numbers and dates are matched against the sources supplied; anything unsupported is reported by offset."],
          ["Reworks", "diff_deliverable shows which criteria flipped, so a second submission is judged on what actually changed."],
          ["CI gates", "PASS, REVIEW, BLOCK or REFUSED is a value a pipeline can branch on without a human reading the output."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="spec">The acceptance spec</H2>
      <p className="mt-3 text-[#201810]/70">
        A spec is JSON — no expressions, no code, no hidden regex. It is versioned, and an unknown version is refused
        rather than guessed at.
      </p>
      <Code>{`{
  "specVersion": "1.0",
  "deliverable": { "kind": "markdown" },
  "criteria": [
    { "id": "has-summary", "severity": "blocker",
      "type": "requiredSection", "section": "Summary", "minWords": 40 },
    { "id": "cites-sources", "severity": "blocker", "type": "minCitations", "count": 2 },
    { "id": "no-placeholder", "severity": "blocker",
      "type": "forbiddenPhrase", "phrases": ["TODO", "lorem ipsum", "as an AI"] },
    { "id": "length", "severity": "high", "type": "wordCount", "min": 300, "max": 1200 },
    { "id": "numbers-grounded", "severity": "high",
      "type": "numbersGrounded", "tolerance": 0.001 }
  ]
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        The verdict rules are fixed and published, not tuned per call: any failing{" "}
        <span className="font-mono">blocker</span> is <span className="font-mono">BLOCK</span>; otherwise any failing{" "}
        <span className="font-mono">high</span> is <span className="font-mono">REVIEW</span>; everything passing is{" "}
        <span className="font-mono">PASS</span>. A criterion that cannot be evaluated is{" "}
        <span className="font-mono">INCONCLUSIVE</span>, is excluded from a pass, and forces at least{" "}
        <span className="font-mono">REVIEW</span>.
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

      <H2 id="workflow">Recommended workflow</H2>
      <p className="mt-3 text-[#201810]/70">
        Settlement happens <span className="font-semibold text-[#1a130a]">before</span> a paid tool runs, so a spec
        the engine would refuse is still a paid call. Preflight for free first.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">rubric_capabilities</span> for the DSL version, criterion types, limits and prices.</li>
        <li>Call <span className="font-mono">validate_spec</span> — it refuses exactly what a paid check refuses, including a spec with no criteria.</li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended tool.</li>
        <li>Run <span className="font-mono">check_acceptance</span>, adding <span className="font-mono">check_schema</span> or <span className="font-mono">verify_grounding</span> where the spec needs them.</li>
        <li>If a counterparty needs proof, call <span className="font-mono">attest_acceptance</span> and hand over the report.</li>
        <li>Verify offline with <span className="font-mono">verify_rubric_report</span>, and re-fetch with <span className="font-mono">get_artifact</span> while its TTL lasts.</li>
      </ol>

      <H2 id="reports">What a verdict proves, and what it does not</H2>
      <p className="mt-3 text-[#201810]/70">
        It proves that this exact deliverable, under this spec version and this rule set version, produced these
        criterion results and this verdict — recomputable by anyone with the same bytes. It does{" "}
        <span className="font-semibold text-[#1a130a]">not</span> prove the work is correct, useful, or complete in a
        sense the spec did not encode. A <span className="font-mono">PASS</span> means the spec&apos;s criteria were
        met, no more. And absence of support for a claim is not evidence that the claim is false.
      </p>
      <Code>{`{
  "verdict": "PASS",
  "verdictReason": "All criteria passed.",
  "counts": { "pass": 3, "fail": 0, "inconclusive": 0 },
  "criteria": [
    { "id": "has-summary", "type": "requiredSection", "severity": "blocker", "status": "PASS" }
  ],
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
          A live <span className="font-mono">check_acceptance</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.015 USDT0</span> and returned{" "}
          <span className="font-mono">PASS</span> with three per-criterion results; a{" "}
          <span className="font-mono">check_schema</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.005 USDT0</span> and returned{" "}
          <span className="font-mono">BLOCK</span> on an out-of-range value, naming the offending path. Both receipts
          are <span className="font-mono">status 0x1</span>, broadcast by an OKX facilitator relayer rather than a
          Rubric-held key, and the signed report validates through the free{" "}
          <span className="font-mono">verify_rubric_report</span>.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x4bddfabc88bbe2d5ecabe14f2806631dfe0f02b3d1771ee18ea0bdabfc2676d5"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x4bddfabc88bbe2d5ecabe14f2806631dfe0f02b3d1771ee18ea0bdabfc2676d5
        </a>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Rubric code under MIT. Third-party dependencies keep their own
        open-source licenses, preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Rubric judges the work. For the counterparty that produced it, use{" "}
          <Link href="/docs/evidiq" className="font-semibold text-sky-700 hover:underline">EVIDIQ Core</Link>; to prove
          an output happened at all, use{" "}
          <Link href="/docs/notary" className="font-semibold text-sky-700 hover:underline">EVIDIQ Notary</Link>; to keep
          the verdict in a tamper-evident record, use{" "}
          <Link href="/docs/vault" className="font-semibold text-sky-700 hover:underline">EVIDIQ Vault</Link>. A spec is
          an engineering artifact, not a legal contract.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
