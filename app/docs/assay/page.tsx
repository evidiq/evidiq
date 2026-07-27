import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Assay Docs — Read a transaction before you sign it",
  description:
    "Decode calldata, EIP-712 payloads, and unsigned transactions into plain-language intent, with allowance analysis, pinned-block simulation, counterparty screening, and signed attestation.",
  alternates: { canonical: "https://evidiq.dev/docs/assay" },
  openGraph: {
    title: "EVIDIQ Assay Docs",
    description: "Transaction intent, in plain language, before a signature exists.",
    url: "https://evidiq.dev/docs/assay",
    images: [{ url: "/docs/assay-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["decode_transaction", "0.005", "Decode calldata, EIP-712, or an unsigned transaction into plain-language intent, unwrapping multicall and execute wrappers to reach the inner call."],
  ["assess_approval", "0.01", "Allowance analysis: unlimited or excessive amounts, setApprovalForAll, Permit and Permit2 grants, and the spender's existing on-chain allowance."],
  ["simulate_transaction", "0.015", "Simulate against a pinned block and report net asset deltas per address."],
  ["screen_counterparty", "0.02", "Bytecode-level screening: proxy and upgradeability slots, owner privileges, mint, pause, blacklist and fee-setter surface, and whether any code exists at all."],
  ["attest_intent", "0.03", "Bind the decoded intent and verdict to a content digest, sign it with EIP-191, and anchor the digest."],
] as const;

const freeTools = [
  ["assay_capabilities", "Rule catalog with severities and which rules are heuristic, plus supported chains, selector-set version, limits, and full pricing."],
  ["validate_payload", "Parse-check the payload and return the detected kind and counts by severity — without the findings, and without charging."],
  ["estimate_cost", "Quote one paid tool, or the whole price table when no tool is named."],
  ["verify_assay_report", "Recompute the report digest and verify its EIP-191 signature offline."],
  ["get_artifact", "Retrieve a stored report or attestation by id, within its TTL."],
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

export default function AssayDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Assay
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        A signature is irreversible, and hex is unreadable. Assay turns calldata, an EIP-712 payload, or an unsigned
        transaction into a plain-language statement of what it will do — unwrapping multicall and execute wrappers to
        reach the call that actually matters — and flags the parts worth refusing.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/9727"
        agentId={9727}
        name="EVIDIQ Assay"
        endpoint="https://mcp.evidiq.dev/assay/mcp"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, then preflight for free before paying.
      </p>
      <Code>claude mcp add --transport http evidiq-assay https://mcp.evidiq.dev/assay/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/assay/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Assay Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/assay/skill.md</Code>

      <H2 id="use-cases">What Assay is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Before an agent signs", "Read the intent while refusing is still free — after signing there is nothing to decide."],
          ["Wrapped calls", "multicall and execute hide the real call; Assay decodes the inner one, not the wrapper."],
          ["Allowance traps", "Unlimited approvals, setApprovalForAll, Permit and Permit2 grants, and what the spender already holds."],
          ["Net effect, not intent", "Pinned-block simulation reports asset deltas per address, so the outcome is checked rather than assumed."],
          ["Who you are dealing with", "Bytecode screening for proxies, owner privileges, mint, pause, blacklist, and fee setters — or no code at all."],
          ["Proof for a counterparty", "attest_intent signs the digest, so both sides can show the check covered exactly these bytes."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools cover discovery, preflight, and offline verification. Five paid tools handle decoding, allowance
        analysis, simulation, counterparty screening, and attestation.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid analysis</h3>
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

      <H2 id="inputs">What it accepts</H2>
      <p className="mt-3 text-[#201810]/70">
        Raw calldata, an EIP-712 typed-data JSON document, an unsigned transaction JSON, or a plain message. The kind is
        detected rather than declared, and <span className="font-mono">validate_payload</span> reports which kind it read
        before you pay. A payload it cannot parse is never scored as safe.
      </p>
      <Code>{`# calldata: approve(spender, 2^256-1)
0x095ea7b3000000000000000000000000<spender>ffffffff…ffff`}</Code>

      <H2 id="workflow">Recommended workflow</H2>
      <p className="mt-3 text-[#201810]/70">
        Settlement happens <span className="font-semibold text-[#1a130a]">before</span> a paid tool runs, so a malformed
        argument is still a paid call. Preflight for free first.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">assay_capabilities</span> for the rule and selector set versions, chains, and prices.</li>
        <li>Call <span className="font-mono">validate_payload</span> — it returns the detected kind and counts by severity for free.</li>
        <li>Decode with <span className="font-mono">decode_transaction</span>; for an approval, add <span className="font-mono">assess_approval</span>.</li>
        <li>Check the net effect with <span className="font-mono">simulate_transaction</span>, and the target with <span className="font-mono">screen_counterparty</span>.</li>
        <li>If a counterparty needs proof, call <span className="font-mono">attest_intent</span> and hand over the report.</li>
        <li>Verify offline with <span className="font-mono">verify_assay_report</span>, and re-fetch with <span className="font-mono">get_artifact</span> while its TTL lasts.</li>
      </ol>

      <H2 id="reports">What a report proves, and what it does not</H2>
      <p className="mt-3 text-[#201810]/70">
        A report proves that these exact bytes, under this selector set and rule set version, decode to this intent and
        produced these findings. Anyone can re-run it and compare digests. It does{" "}
        <span className="font-semibold text-[#1a130a]">not</span> prove a transaction is safe to sign: simulation reflects
        one pinned block, some rules are explicitly heuristic and marked as such, and an unknown selector is reported as
        unknown rather than assumed harmless. Credentials are refused outright — a private key or mnemonic in the input is
        an error, and nothing is stored, attested, or anchored.
      </p>
      <Code>{`{
  "engine": "EVIDIQ-Assay/1.0",
  "selectorSetVersion": "1.0.0",
  "chain": "eip155:196",
  "intent": "Approve <spender> to move an unlimited amount of <token>",
  "findings": [
    { "rule": "UNLIMITED_APPROVAL", "severity": "high", "heuristic": false }
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
        settles it on X Layer before any decoding runs.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          A live <span className="font-mono">decode_transaction</span> call paid{" "}
          <span className="font-semibold text-[#1a130a]">0.005 USDT0</span> (5000 atomic) on{" "}
          <span className="font-mono">approve</span> calldata carrying a max-uint amount, and returned the decoded intent
          with the unlimited-allowance finding. The receipt is <span className="font-mono">status 0x1</span> and the
          transaction was broadcast by an OKX facilitator relayer rather than an Assay-held key — the on-chain evidence
          that settlement ran through the official SDK.
        </p>
        <a
          href="https://www.oklink.com/xlayer/tx/0x804a7454d75fefbbdfe43a365ec494d52e02700f18ebc3a85c75e8223b66d4ee"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block break-all font-mono text-xs text-emerald-800 hover:underline"
        >
          0x804a7454d75fefbbdfe43a365ec494d52e02700f18ebc3a85c75e8223b66d4ee
        </a>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Assay code under MIT. Third-party dependencies keep their own open-source
        licenses, preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Assay reads what an agent is about to <span className="font-semibold text-[#1a130a]">sign</span>. For the
          counterparty agent itself, use{" "}
          <Link href="/docs/evidiq" className="font-semibold text-sky-700 hover:underline">EVIDIQ Core</Link>; for the
          endpoint serving it, use{" "}
          <Link href="/docs/sentinel" className="font-semibold text-sky-700 hover:underline">EVIDIQ Sentinel</Link>; to
          keep a tamper-evident record of what was signed, use{" "}
          <Link href="/docs/vault" className="font-semibold text-sky-700 hover:underline">EVIDIQ Vault</Link>. Nothing
          here is financial advice, and no report is a guarantee of safety.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
