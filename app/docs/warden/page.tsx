import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Warden Docs — Review agent-written code before it ships",
  description:
    "Deterministic review of diffs and files for injection, secrets, unsafe patterns, and complexity, with policy verdicts, a signed attestation, and x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/warden" },
  openGraph: {
    title: "EVIDIQ Warden Docs",
    description: "Code review for what an agent wrote and nobody read.",
    url: "https://evidiq.dev/docs/warden",
    images: [{ url: "/docs/warden-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["review_diff", "0.005", "Review a unified diff and return findings scoped to the changed lines, with a verdict."],
  ["review_files", "0.01", "Review whole files: injection, secrets, unsafe patterns, error handling, and hygiene."],
  ["analyze_complexity", "0.015", "Cyclomatic and cognitive complexity per function, with the hotspots ranked."],
  ["check_policy", "0.02", "Evaluate the source against a named policy profile and return PASS, REVIEW, or BLOCK."],
  ["attest_review", "0.03", "Bind the review and verdict to a content digest and sign it with EIP-191."],
] as const;

const freeTools = [
  ["warden_capabilities", "Rule catalog with severities, policy profiles, supported languages, limits, and full pricing."],
  ["validate_source", "Parse-check files and return finding counts by severity — without the findings, and without charging."],
  ["estimate_cost", "Quote one paid tool, or the whole price table when no tool is named."],
  ["verify_review_report", "Recompute the report digest and verify its EIP-191 signature offline."],
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

export default function WardenDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Warden
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Review for code an agent wrote and nobody read. Warden checks diffs and files against a fixed rule set —
        injection, secrets, unsafe patterns, error handling, complexity — and returns a verdict with the findings that
        caused it. Same input, same rule set, same answer: no model decides whether your code ships.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/9699"
        agentId={9699}
        name="EVIDIQ Warden"
        endpoint="https://mcp.evidiq.dev/warden/mcp"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, then preflight for free before paying.
      </p>
      <Code>claude mcp add --transport http evidiq-warden https://mcp.evidiq.dev/warden/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/warden/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Warden Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/warden/skill.md</Code>

      <H2 id="use-cases">What Warden is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Agent-written pull requests", "The generated diff nobody reviewed line by line, checked before it merges."],
          ["Injection and dynamic code", "eval, dynamic import, shell interpolation, and unsanitized template execution."],
          ["Secrets in source", "Keys and tokens by issuer shape, plus credentials pasted into config and tests."],
          ["Complexity as a review signal", "Cyclomatic and cognitive scores per function, so review effort goes where it pays."],
          ["Policy gates in CI", "Four profiles turn findings into PASS, REVIEW, or BLOCK your pipeline can act on."],
          ["A verdict you can show", "attest_review signs the digest, so a counterparty can check the review covered these exact bytes."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools cover discovery, preflight, and offline verification. Five paid tools handle review, complexity,
        policy evaluation, and attestation.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid review</h3>
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

      <H2 id="limits">Engine limits</H2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["maxInputBytes", "524288"],
          ["maxFiles", "40 per call"],
          ["ruleBudgetMs", "8000"],
          ["artifactTtlMs", "600000 (10 minutes, in memory)"],
          ["ruleSetVersion", "1.0.0"],
          ["languages", "typescript · tsx · javascript · python"],
        ].map(([name, value]) => (
          <div key={name} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <span className="font-mono text-xs font-bold text-sky-800">{name}</span>
            <p className="mt-0.5 break-all font-mono text-xs text-[#201810]/70">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[#201810]/70">
        Policy profiles: <span className="font-mono">agent-written-code</span>,{" "}
        <span className="font-mono">security-baseline</span>, <span className="font-mono">library-publish</span>,{" "}
        <span className="font-mono">pre-commit</span>. Live values come from the free{" "}
        <span className="font-mono">warden_capabilities</span> tool.
      </p>

      <H2 id="workflow">Recommended workflow</H2>
      <p className="mt-3 text-[#201810]/70">
        Settlement happens <span className="font-semibold text-[#1a130a]">before</span> a paid tool runs, so a malformed
        argument is still a paid call. Preflight for free first.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">warden_capabilities</span> for the rule set version, profiles, and prices.</li>
        <li>Call <span className="font-mono">validate_source</span> — it parse-checks the files and returns counts by severity for free, so you can decide whether a full review is worth buying.</li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended tool.</li>
        <li>Review the diff with <span className="font-mono">review_diff</span>, or whole files with <span className="font-mono">review_files</span>.</li>
        <li>Gate on <span className="font-mono">check_policy</span>, then <span className="font-mono">attest_review</span> if a counterparty needs proof.</li>
        <li>Verify offline with <span className="font-mono">verify_review_report</span> and re-fetch with <span className="font-mono">get_artifact</span> while its TTL lasts.</li>
      </ol>

      <H2 id="reports">What a report proves, and what it does not</H2>
      <p className="mt-3 text-[#201810]/70">
        A report proves that this exact source, under this rule set version and this policy version, produced these
        findings and this verdict. Anyone can re-run it and compare digests. It does{" "}
        <span className="font-semibold text-[#1a130a]">not</span> prove the code is correct or safe: a fixed rule set has
        a recall limit, logic bugs are out of scope, and a clean report is the absence of known patterns rather than
        evidence of quality.
      </p>
      <Code>{`{
  "verdict": "BLOCK",
  "ruleSetVersion": "1.0.0",
  "policy": "agent-written-code",
  "findings": [
    { "rule": "EVAL_DYNAMIC_CODE", "family": "injection", "severity": "blocker",
      "file": "a.ts", "line": 1, "cwe": "CWE-95",
      "why": "Evaluating a runtime value executes whatever reaches it." }
  ],
  "integrity": { "algorithm": "SHA-256", "digest": "...", "signature": "0x...", "signer": "0x..." }
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
        settles it on X Layer before any review runs.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          A live <span className="font-mono">review_diff</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.005 USDT0</span> (5000 atomic) on a one-line diff that
          introduced <span className="font-mono">eval</span>. Warden returned{" "}
          <span className="font-mono">BLOCK</span> with <span className="font-mono">EVAL_DYNAMIC_CODE</span> at
          CWE-95. The receipt is <span className="font-mono">status 0x1</span> and the transaction was broadcast by an
          OKX facilitator relayer rather than a Warden-held key — the on-chain evidence that settlement ran through the
          official SDK.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x170b0f4c63ea16129e3877c9a8b16d427b3d707cfb5fac5e0e5319c90c426fee"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x170b0f4c63ea16129e3877c9a8b16d427b3d707cfb5fac5e0e5319c90c426fee
        </a>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Warden code under MIT. Third-party dependencies keep their own open-source
        licenses, preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Warden reviews the code an agent <span className="font-semibold text-[#1a130a]">writes</span>. For the
          dependencies it pulls in, use{" "}
          <Link href="/docs/lineage" className="font-semibold text-sky-700 hover:underline">EVIDIQ Lineage</Link>; for
          the endpoints it connects to, use{" "}
          <Link href="/docs/sentinel" className="font-semibold text-sky-700 hover:underline">EVIDIQ Sentinel</Link>; for
          what it sends out, use{" "}
          <Link href="/docs/redact" className="font-semibold text-sky-700 hover:underline">EVIDIQ Redact</Link>. No
          certification is claimed; policy profiles are engineering defaults, not legal advice.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
