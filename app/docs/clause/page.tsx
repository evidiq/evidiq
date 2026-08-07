import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Clause Docs — Decode Documents, Prove Statements",
  description:
    "Plain-language decoding of agreements and policy documents — every statement quoted and checked against your document, reasoning inside TEE-attested 0G Compute enclaves, every report EIP-191 signed and 0G-anchored.",
  alternates: { canonical: "https://evidiq.dev/docs/clause" },
  openGraph: {
    title: "EVIDIQ Clause Docs",
    description: "Decoding documents. Proving truth.",
    url: "https://evidiq.dev/docs/clause",
    images: [{ url: "/docs/clause-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["decode_document", "0.05", "Plain-language rendering, section by section. Every rendered statement carries the quoted original span it came from; statements the model cannot quote are never asserted."],
  ["risk_flags", "0.10", "The seven hazards enumerated: auto-renewal, unilateral change, liability cap, penalty, notice period, assignment, arbitration venue. Each flag: severity, quoted span, why it matters to the reader."],
  ["obligation_calendar", "0.10", "Dated duties extracted into a schedule: what is owed, by whom, when, from which quoted clause. Relative dates resolved against a caller-supplied reference date."],
  ["compare_documents", "0.15", "Two documents diffed on meaning rather than characters, with which side each change favours and the quoted spans on both sides, each verified against its own source."],
  ["verdict_report", "0.25", "Decode + flags + calendar + bottom line, two-pass: an extractor, then an independent reviewing pass that must justify or drop each flag. EIP-191 signed, chained, anchored to 0G Storage, full compute trace."],
] as const;

const freeTools = [
  ["capabilities", "Tool list, exact prices, the models in use with their TEE status, limits."],
  ["verify_report", "Recomputes the JCS digest, checks the EIP-191 signature, walks the chain for gaps, re-checks every citation against the supplied source text. Pure cryptography and string matching — free forever."],
  ["quote", "The exact x402 challenge for any paid tool, from the same table the gate charges from."],
];

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

export default function ClauseDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Clause
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        Decoding documents.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Proving truth.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Clause turns agreements and policy documents into plain language and makes the
        reading checkable. Every statement carries the quoted span it came from, and the
        server mechanically verifies that quote against your document before it reaches
        you — a fabricated clause is dropped, not returned. The reasoning runs on 0G
        Compute, only on models whose TEE attestation is checked live against the router
        registry, and every paid response records the provider address, request id and
        exact cost. The sealed report — JCS digest, EIP-191 signature, chain linkage, 0G
        anchor — can be re-verified by anyone, for free, forever. 8 tools (3 free, 5
        paid).
      </p>

      <img
        src="/docs/clause-banner.png"
        alt="EVIDIQ Clause — decoding documents, proving truth"
        width={1672}
        height={941}
        className="mx-auto mt-8 block w-full rounded-2xl border border-sky-100"
      />

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10584"
        agentId={10584}
        name="EVIDIQ Clause"
        endpoint="https://mcp.evidiq.dev/clause/mcp"
        status="listed"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, ask what the service can do for free,
        then buy a decoding.
      </p>
      <Code>claude mcp add --transport http evidiq-clause https://mcp.evidiq.dev/clause/mcp</Code>
      <p className="mt-4 text-[#201810]/70">
        The free tools answer a bare call — try <span className="font-mono">capabilities</span>:
      </p>
      <Code>{`curl -s -X POST https://mcp.evidiq.dev/clause/mcp -H "content-type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"capabilities","arguments":{}}}'`}</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint and the Skill file:</p>
      <Code>curl -s https://mcp.evidiq.dev/clause/x402</Code>
      <Code>curl -s https://mcp.evidiq.dev/clause/skill.md</Code>

      <H2 id="use-cases">What Clause is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Citations are checked, not trusted", "Every statement carries a quote plus character offsets into your document. The server locates the quote verbatim and DROPS any statement whose quote is not there, reporting citationsDropped. An invented clause is mechanically impossible, not a matter of prompt discipline."],
          ["The reasoning step is attributable", "Inference runs on 0G Compute, only on models whose tee_attested is true — checked against the router's live registry at call time, not a hardcoded allowlist. Each report records model, provider address, request id, TDX attestation and the exact cost in wei."],
          ["The record is sealed", "A JCS digest over a closed field set, an EIP-191 signature, chained to the previous report so a removed record shows as a sequence gap, and anchored to 0G Storage — with the anchored body sealed with AES-256-GCM unless anchorInClear is set."],
          ["Checking is free", "verify_report re-verifies the digest, the signature, the chain and every citation against the supplied source. It never calls the model — it is pure cryptography and string matching, and it never will call the model."],
          ["Unsupported stays unsupported", "A tenancy agreement with no arbitration clause answers \"unsupported\" with a stated reason. A plausible-sounding venue is caught by the citation check and dropped before it reaches you."],
          ["What it is not", "Not legal advice, no outbound fetching (documents arrive in the request as text or base64 pages), no marketplace reputation fields."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eight MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Three free tools support discovery and verification; five paid tools carry the
        decoding.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid tools</h3>
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
        Priced on the LIFESTYLE band: the category median is 0.175 USDT0 and the incumbent
        document-decoding service sells at 0.02–0.10. Payments use x402 v2{" "}
        <span className="font-mono">exact</span> with USDT0 (6 decimals) on X Layer
        (<span className="font-mono">eip155:196</span>) via the{" "}
        <a
          href="https://web3.okx.com/onchainos/dev-docs/payments/service-seller-sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 hover:underline"
        >
          official OKX Onchain OS Payment SDK
        </a>.
      </p>

      <H2 id="x402">Paying from your agent (x402)</H2>
      <p className="mt-3 text-[#201810]/70">
        <span className="font-mono">decode_document</span> and the other four paid tools
        are metered with x402 v2 (scheme <span className="font-mono">exact</span>,
        EIP-3009, USDT0 on X Layer / <span className="font-mono">eip155:196</span>). An
        unpaid call returns HTTP 402 with the payment requirements; the agent signs a
        gasless authorization and retries with a{" "}
        <span className="font-mono">PAYMENT-SIGNATURE</span> header. The three free tools
        need no payment — a plain <span className="font-mono">application/json</span>{" "}
        request works.
      </p>
      <Code>{`// 1. Unpaid call -> HTTP 402 with payment requirements
const { accepts: [req] } = await (await callClause()).json();

// 2. Sign EIP-3009 transferWithAuthorization (gasless for the payer)
const authorization = {
  from: account.address, to: req.payTo, value: req.amount,
  validAfter: "0", validBefore: String(now + 600), nonce: randomHex32(),
};
const signature = await account.signTypedData({
  domain: { name: req.extra.name, version: req.extra.version,
    chainId: Number(req.network.split(":")[1]), verifyingContract: req.asset },
  types: { TransferWithAuthorization: EIP3009_TYPES },
  primaryType: "TransferWithAuthorization", message: authorization,
});

// 3. Retry with PAYMENT-SIGNATURE -> server settles, returns the decoded report
const paid = await callClause({
  "PAYMENT-SIGNATURE": base64({ x402Version: 2, accepted: req,
    payload: { signature, authorization } }),
});`}</Code>

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settlement</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Five real paid calls settled on X Layer on 2026-08-06, every one status
          "settled" — 0.65 USDT0 total (payer and payee are both the fleet wallet, so the
          balance is unchanged by design; these are evidence of settlement, not revenue).
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">decode_document (0.05, 21s):</span> <a href="https://www.oklink.com/xlayer/tx/0x5f6a50dce42aecff239dce08c302c0575e2c49e39a29db6f27388f9fa4bf87e2" target="_blank" rel="noopener noreferrer" className="hover:underline">0x5f6a50dc…f87e2</a></p>
          <p><span className="font-semibold">risk_flags (0.10, 13s):</span> <a href="https://www.oklink.com/xlayer/tx/0x69f37d98462585a932f2c465b11a55c25251335017e6da736fab980ec88eda6e" target="_blank" rel="noopener noreferrer" className="hover:underline">0x69f37d98…eda6e</a></p>
          <p><span className="font-semibold">obligation_calendar (0.10, 9s):</span> <a href="https://www.oklink.com/xlayer/tx/0x8a1f9831bbaf28ec3704d636b4f5ebce68d77d66cb09e5b4ff65009ed301f99a" target="_blank" rel="noopener noreferrer" className="hover:underline">0x8a1f9831…f99a</a></p>
          <p><span className="font-semibold">compare_documents (0.15, 22s):</span> <a href="https://www.oklink.com/xlayer/tx/0x909eacc110a359f40bffacd9b811d31296712b85759367dce931b438d8f55a8f" target="_blank" rel="noopener noreferrer" className="hover:underline">0x909eacc1…55a8f</a></p>
          <p><span className="font-semibold">verdict_report (0.25, 85s):</span> <a href="https://www.oklink.com/xlayer/tx/0x5ac9ef154280b4a65c76a7566c1522b53e8ee59dc433736592c1adf0f4ff3c8a" target="_blank" rel="noopener noreferrer" className="hover:underline">0x5ac9ef15…ff3c8a</a></p>
          <p><span className="font-semibold">total:</span> 0.65 USDT0</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">verdict_report (seq 6):</span> <a href="https://chainscan.0g.ai/tx/0x832f933046bd22ce2ced423429f43f77fb8ab143dc551b772d30a08c15d17e92" target="_blank" rel="noopener noreferrer" className="hover:underline">0x832f9330…17d92</a> <span className="text-teal-600">· root 0xaaaa989e…32b9b · citationsDropped 0</span></p>
          <p><span className="font-semibold">digest:</span> 0x215b1b00…b2ab5</p>
          <p><span className="font-semibold">signer:</span> 0x8a3c7524Aaed081825aC88eC7f4cCECFc583ee7D (EIP-191)</p>
          <p><span className="font-semibold">compute:</span> qwen3-vl-30b (TDX/dstack) + deepseek-v4-flash (TDX/dstack) — provider, request id and wei costs recorded per pass</p>
          <p className="text-teal-600">The anchored body is sealed with AES-256-GCM; the readable manifest carries sequence, previous hash, digest, timestamp and compute traces.</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          All eight tools exercised live against the deployed endpoint with the x402 gate
          enforced, measured from outside; the paid run settled the five tools above and
          <span className="font-mono"> verify_report</span> re-verified the signed verdict
          (digest, signature, chain, citations) and detected a one-character tamper.
          Genuine asciinema capture with <span className="font-mono">--idle-time-limit 2</span>
          — waits over two seconds are shortened; no frame was edited. Raw run, the five
          paid outputs and the signed report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-clause-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            clause repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Tests                              → 40/40 across twelve gates (C1 C2 C3 T1 T2 F1 F2 G1 V1 B1 S1 L1)
Gate (measured from outside)
  5 paid bare {}                  → 402 with x402 challenge
  no content-type                 → 415 · empty body → 402
  3 free bare {}                  → 200
Settled paid calls (X Layer, 2026-08-06)
  decode_document 21s · risk_flags 13s · obligation_calendar 9s
  compare_documents 22s · verdict_report 85s   → 0.65 USDT0 total
verify_report on the signed verdict (seq 6)
  digestMatch true · signatureValid true · chain ok · citations 0 failures
  one character flipped → digestMatch false · signatureValid false`}
        </pre>
        <img
          src="/docs/clause-live-test.gif"
          alt="EVIDIQ Clause recorded live test — all eight tools, five settled paid calls"
          width={1021}
          height={874}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Clause code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
