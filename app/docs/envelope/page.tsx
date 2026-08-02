import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Envelope Docs — Inbound Message Authenticity",
  description:
    "Cryptographic verification of inbound messages: SPF, DKIM, DMARC and ARC on the raw message, sender-spoofing and lookalike-domain detection, header-chain forensics, and structural risk of attachments and links — with the DNS answers pinned into a signed report.",
  alternates: { canonical: "https://evidiq.dev/docs/envelope" },
  openGraph: {
    title: "EVIDIQ Envelope Docs",
    description: "Bulwark reads what the message says. Envelope proves who sent it.",
    url: "https://evidiq.dev/docs/envelope",
    images: [{ url: "/docs/envelope-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["verify_dkim", "0.005", "Per-signature DKIM verification: canonicalisation, body hash, key retrieval, algorithm, expiry — with the reason for each failure."],
  ["check_dmarc_alignment", "0.005", "DMARC policy for the From domain and RFC 7489 identifier alignment against DKIM d= and the SPF domain, strict or relaxed."],
  ["verify_message_auth", "0.01", "The composite verdict: SPF, DKIM, DMARC and alignment in one call, with the pinned DNS records behind it."],
  ["validate_arc_chain", "0.01", "ARC chain validation so forwarded and mailing-list mail is not treated as forgery per hop."],
  ["detect_sender_spoofing", "0.015", "Display-name impersonation, homoglyph / punycode / edit-distance lookalikes against expected senders, Reply-To / Return-Path divergence."],
  ["audit_header_chain", "0.015", "Received-chain forensics: hop consistency, timestamp ordering, injected or duplicated critical headers, gaps that indicate a forged path."],
  ["assess_attachment_surface", "0.02", "Structural risk without opening anything: extension against magic bytes, double extensions, macro-capable formats, encrypted archives."],
  ["assess_link_surface", "0.02", "Structural link analysis without fetching: punycode hosts, anchor text vs href, credential-shaped URLs, redirector patterns, lookalike hosts."],
  ["screen_domain_posture", "0.02", "The sender domain's own posture: SPF validity and lookup count, resolvable DKIM selectors, DMARC policy strength, DNSSEC, MX."],
  ["attest_message_verdict", "0.03", "EIP-191 signed, 0G-anchored attestation of a verification, pinned DNS included — the record that survives key rotation."],
] as const;

const freeTools = [
  ["envelope_capabilities", "Catalog: 18 tools, prices, claim limits, boundaries against the other services."],
  ["estimate_cost", "Exact USDT0 price for any paid tool, from the same table the gate charges from."],
  ["validate_message_input", "Is this parseable, which auth headers are present, which paid checks can run — before paying."],
  ["parse_message_structure", "MIME tree and header inventory. Structure only, no verdict."],
  ["explain_auth_result", "Plain-language meaning of a result code, and what it does not prove."],
  ["check_dns_txt", "Raw SPF, DKIM-selector and DMARC records for a domain, no verdict."],
  ["verify_envelope_report", "Recompute the JCS digest and EIP-191-verify the signature. Verification is never charged."],
  ["get_artifact", "Retrieve a stored attested verdict by digest, including the 0G anchor if present."],
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

export default function EnvelopeDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Envelope
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        Bulwark reads what the message says.
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        Envelope proves who sent it.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Agents now read mailboxes and act on what they find. Envelope is the missing
        direction: cryptographic verification of inbound messages — SPF, DKIM, DMARC and
        ARC on the raw message, sender-spoofing and lookalike-domain detection,
        header-chain forensics, and structural risk of attachments and links — with the
        DNS answers pinned into a signed report. 18 tools (8 free, 10 paid).
      </p>

      <div className="mt-8 rounded-2xl border p-5 border-amber-200 bg-amber-50/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Under OKX.AI review
          </span>
          <p className="text-sm font-semibold text-[#1a130a]">EVIDIQ Envelope</p>
        </div>
        <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
          <p className="text-sm text-[#201810]/75">
            The endpoint below is already live; the OKX.AI listing (Agent ID) is being
            registered separately and will appear here once it exists.
          </p>
          <p className="font-mono text-xs text-[#201810]/60">https://mcp.evidiq.dev/envelope/mcp</p>
        </div>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, and validate a
        message before paying for a verdict.
      </p>
      <Code>claude mcp add --transport http evidiq-envelope https://mcp.evidiq.dev/envelope/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/envelope/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Envelope Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/envelope/skill.md</Code>

      <H2 id="use-cases">What Envelope is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Transport Authenticity", "SPF, DKIM, DMARC and ARC over the raw message — per-signature DKIM detail, RFC 7489 identifier alignment, ARC chain validation for forwarded mail."],
          ["Never Intent", "A message from a genuine but compromised account passes every check. Every verdict says so in its own body — authenticity of transport, never intent or safety."],
          ["Absence Is Not Evidence", "No DKIM signature does not mean forged; a valid signature does not mean safe. Both directions are stated in the response."],
          ["Pinned DNS", "Every report carries the DNS answers the verdict was derived from, so a verdict is meaningful against the records as they stood at verification time."],
          ["Never a Proxy", "Envelope never fetches a URL found in a message, never opens or extracts an attachment, never sends mail, and never persists the raw message."],
          ["Attestation", "attest_message_verdict returns a JCS-digested, EIP-191-signed, 0G-anchored report — the record that survives key rotation."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Eighteen MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Eight free tools support discovery, validation, and verification. Ten paid tools
        run the cryptographic checks.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid verification tools</h3>
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
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settled on X Layer</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Live tool calls verified on-chain via OKX Facilitator:
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs text-emerald-800">
          <p><span className="font-semibold">paid call:</span> <a href="https://www.oklink.com/xlayer/tx/0xb8e6ede1e89d417f7103d42e00d55b0b91c6290c60375794a232ebcab15e51a0" target="_blank" rel="noopener noreferrer" className="hover:underline">0xb8e6ede…15e51a0</a> <span className="text-emerald-600">· verify_dkim</span></p>
          <p><span className="font-semibold">agent wallet:</span> 0x2a8efe30…a992ca4fc9b0</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (0G mainnet, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">anchor tx:</span> <a href="https://chainscan.0g.ai/tx/0xcbd7f01cd75770757bd1c1a1f93ec5761027dc1f2be51477cd542c18cd891de5" target="_blank" rel="noopener noreferrer" className="hover:underline">0xcbd7f01…891de5</a> <span className="text-teal-600">· status 0x1</span></p>
          <p><span className="font-semibold">storage root:</span> 0xa377a863…bbe23d147</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          The §6 fixture gate passed 7/7 against mailauth 4.13.3 (three deviations
          reported and operator-approved: body-hash and missing-key label as neutral
          not-pass; strict identifier alignment computed locally per RFC 7489 because
          mailauth&apos;s strict mode compares registrable domains). All 18 tools exercised
          live end-to-end by the OpenClaw agent (glm-5.2) against the deployed endpoint on
          2026-08-03; the 402 gate is on. Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-envelope-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            envelope repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Free Tools (HTTP 200)
  envelope_capabilities        → 200 ✓ (18 tools, 8 claim limits)
  estimate_cost                → 200 ✓ (verify_message_auth = 0.01 USDT0)
  validate_message_input       → 200 ✓ (parseable, which paid checks can run)
  parse_message_structure      → 200 ✓ (9 headers, 1 Received hop, structure only)
  explain_auth_result          → 200 ✓ (code explained + what it does not prove)
  check_dns_txt                → 200 ✓ (SPF -all · DMARC reject · selector)
  verify_envelope_report       → 200 ✓ (signatureValid: true, fleet signer)
  get_artifact                 → 200 ✓ (artifact with anchorRoot + anchorTx)

Paid Tools (HTTP 200 — bypass mode, Phase 1)
  verify_dkim                  → 200 ✓ (0/1 signatures, not-pass with reason)
  check_dmarc_alignment        → 200 ✓ (dmarc-not-aligned, adkim=s aspf=s)
  verify_message_auth          → 200 ✓ (not-authenticated; DKIM/SPF/DMARC)
  validate_arc_chain           → 200 ✓ (no-arc-chain — normal for direct mail)
  detect_sender_spoofing       → 200 ✓ (no-indicators, matches expected sender)
  audit_header_chain           → 200 ✓ (1 hop, internally consistent)
  assess_attachment_surface    → 200 ✓ (risky: .pdf.exe double extension)
  assess_link_surface          → 200 ✓ (structural only, never fetched)
  screen_domain_posture        → 200 ✓ (SPF valid -all · DMARC reject · 6 selectors)
  attest_message_verdict       → 200 ✓ (EIP-191 signed, 0G anchored)

Phase 2 gate (bypass removed) — measured from outside:
  empty POST → 402 · no content-type → 415 · HEAD → 402 (72ms, no hang)
  10 paid bare {} → 402 · 8 free bare {} → 200
  paid call settled on X Layer: 0xb8e6ede…15e51a0 (verify_dkim, 0.005 USDT0)`}
        </pre>
        <img
          src="/docs/envelope-live-test.png"
          alt="EVIDIQ Envelope live test report — all 18 tools verified via the OpenClaw agent"
          width={1400}
          height={1191}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Envelope code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
