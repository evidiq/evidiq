import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";


export const metadata: Metadata = {
  title: "EVIDIQ Signet Docs — Structured Design Artefacts",
  description:
    "Brand and design artefacts issued as structured data — logo SVG, colour palette, type system, design tokens — each reproducible from its inputs and sealed with a signed, 0G-anchored receipt. No model anywhere; deterministic by construction.",
  alternates: { canonical: "https://evidiq.dev/docs/signet" },
  openGraph: {
    title: "EVIDIQ Signet Docs",
    description: "A signet is both the tool that stamps and the mark it leaves.",
    url: "https://evidiq.dev/docs/signet",
    images: [{ url: "/docs/signet-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["palette_tokens", "0.02", "Five-colour palette with roles, a type pairing, CSS custom properties and a JSON token file — sealed with a signed, 0G-anchored receipt."],
  ["logo_svg", "0.05", "Primary logo plus monochrome and icon-only SVG variants, with the geometry parameters that produced them."],
  ["social_kit", "0.10", "Favicon set, square avatar and OG card, all derived from the same tokens so they cannot drift apart."],
  ["kit_revision", "0.10", "Revise a previously issued kit by receipt id, locking chosen elements, returning a diff and a chained receipt."],
  ["brand_kit", "0.25", "The bundle: logo variants, palette, type, tokens, a font licence manifest, and the sealed receipt. The whole kit is uploaded to 0G."],
] as const;

const freeTools = [
  ["signet_capabilities", "Tool list, exact price table, the deterministic contract, full mood vocabulary, template families, anchoring model."],
  ["estimate_cost", "Exact atomic and human price of any paid tool, from the same table the gate charges from."],
  ["preview_tokens", "A deterministic palette-and-type preview from a mood and seed — the free hook, same generator as the paid tools."],
  ["verify_asset", "Recompute a receipt's digest, verify the EIP-191 signature, confirm the 0G anchor, walk the revision chain for gaps. Free permanently."],
  ["check_font_license", "Commercial-use status of kit fonts, what the licence does not permit, and where the claim comes from."],
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

export default function SignetDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          &larr; Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Signet
      </h1>
      <p className="mt-4 text-xl font-bold text-[#1a130a]">
        A signet is both the tool that stamps
      </p>
      <p className="text-xl font-bold text-[#1a130a]">
        and the mark it leaves.
      </p>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Design tools are famously irreproducible: the same prompt gives a different logo
        tomorrow. Signet inverts that. It issues brand and design artefacts as structured
        data — logo SVG, colour palette, type system, design tokens — every one computed,
        not imagined, from a seed derived by hashing the brand name, the mood keyword and
        the caller&apos;s seed. Same inputs, byte-identical output, in every process,
        forever. And each artefact is sealed: JCS digest signed EIP-191 by the fleet
        signer, with the whole artefact uploaded to 0G so a buyer can retrieve the kit by
        root hash even if this service disappears. 10 tools (5 free, 5 paid).
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
          <p className="text-sm font-semibold text-[#1a130a]">EVIDIQ Signet</p>
        </div>
        <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
          <p className="text-sm text-[#201810]/75">
            The endpoint below is already live; the OKX.AI listing (Agent ID) is being
            registered separately and will appear here once it exists.
          </p>
          <p className="font-mono text-xs text-[#201810]/60">https://mcp.evidiq.dev/signet/mcp</p>
        </div>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, try the free preview (the hook), check a
        font, then buy the artefacts.
      </p>
      <Code>claude mcp add --transport http evidiq-signet https://mcp.evidiq.dev/signet/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Try the free preview — same generator as the paid tools:</p>
      <Code>{`curl -s -X POST https://mcp.evidiq.dev/signet/mcp -H "content-type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"preview_tokens","arguments":{"brandName":"Northwind Labs","mood":"tech"}}}'`}</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint and the Skill file:</p>
      <Code>curl -s https://mcp.evidiq.dev/signet/x402</Code>
      <Code>curl -s https://mcp.evidiq.dev/signet/skill.md</Code>

      <H2 id="use-cases">What Signet is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Deterministic by Construction", "Palettes from colour-theory transforms over a seed, type pairings from a curated table, SVGs from parameterised templates. No model anywhere — a grep for model providers returns nothing."],
          ["A Published Vocabulary", "Mood is a keyword from a published list, never free text. An unrecognised mood is answered plainly with the supported set — never silently approximated."],
          ["Provenance That Outlives the Vendor", "Every issued kit is JCS-digested, EIP-191 signed, and the whole artefact is uploaded to 0G; the buyer can retrieve it by root hash even if this service disappears."],
          ["Revisions That Chain", "kit_revision revises a kit by receipt id, locks chosen elements, returns the diff and a new receipt linked by predecessor hash. verify_asset detects a dropped revision."],
          ["Font Licences With a Source", "Every font a kit names records its commercial status from a primary source; check_font_license is free, and an unsourced claim is never shipped."],
          ["What It Is Not", "No video, no raster generation in v1, no trademark opinion, no copywriting — said plainly in the tool descriptions."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support discovery and verification; five paid tools carry the
        artefacts.
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
        Pricing is deliberately off the fleet ladder: ART_CREATION&apos;s proven band is
        0.02–0.25 (PixelBrief&apos;s actual prices), with a category median of 0.10. Payments
        use x402 v2 <span className="font-mono">exact</span> with USDT0 (6 decimals) on X Layer
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Settlement</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          A real paid call has not settled yet — this panel stays blank until the operator
          completes the purchase.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">0G Storage Anchoring (whole artefact, chain 16661)</p>
        <div className="mt-3 space-y-1 font-mono text-xs text-teal-800">
          <p><span className="font-semibold">brand_kit (full kit):</span> <a href="https://chainscan.0g.ai/tx/0x5288fadc7d81a78ea28e68d6a7a494b89f39b9644266b6a95983bfa11bfa9a62" target="_blank" rel="noopener noreferrer" className="hover:underline">0x5288fadc…bfa9a62</a> <span className="text-teal-600">· root 0x7101a87c…8a1e039</span></p>
          <p><span className="font-semibold">palette_tokens/logo/social/revision</span> — each anchored with its own root (see the README verification log)</p>
          <p><span className="font-semibold">signer:</span> 0x8a3c7524Aaed081825aC88eC7f4cCECFc583ee7D</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Verification Log</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          Determinism asserted across two separate processes (a test spawns a fresh node
          process and compares byte-for-byte); the no-model grep returns nothing; all 10
          tools exercised live end-to-end by the OpenClaw agent (glm-5.2) on 2026-08-05,
          and the Phase 2 gate assertions were measured from outside with the 402 gate on.
          Raw run + report in the{" "}
          <a
            href="https://github.com/evidiq/evidiq-signet-mcp/tree/main/docs/live-test"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 hover:underline"
          >
            signet repo
          </a>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0f172a] p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`Determinism (2 processes)      → 4/4 byte-identical
No-model grep                 → 2/2 clean
Free Tools (HTTP 200)
  signet_capabilities · estimate_cost · preview_tokens · verify_asset · check_font_license ✓
Paid Tools (HTTP 200 — bypass mode, Phase 1)
  palette_tokens · logo_svg · social_kit · kit_revision · brand_kit ✓
  0G: whole kit uploaded — root 0x7101a87c… (brand_kit)

Phase 2 gate (bypass removed) — measured from outside:
  empty POST → 402 · no content-type → 415 · HEAD → 402 (76ms, no hang)
  5 paid bare {} → 402 · 5 free bare {} → 200
  payment quote all 5 paid tools → exact matches (0.02/0.05/0.10/0.10/0.25)`}
        </pre>
        <img
          src="/docs/signet-logo.png"
          alt="EVIDIQ Signet generated logo — Northwind Labs"
          width={512}
          height={512}
          className="mt-4 w-1/3 rounded-lg border border-violet-200"
        />
        <img
          src="/docs/signet-live-test.gif"
          alt="EVIDIQ Signet recorded OpenClaw run — all 10 tools verified"
          width={983}
          height={739}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
        <img
          src="/docs/signet-live-test.png"
          alt="EVIDIQ Signet live test report"
          width={1400}
          height={1728}
          className="mt-4 w-full rounded-lg border border-violet-200"
        />
      </div>

      <H2 id="license">License</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Signet code under MIT. Third-party dependencies maintain their own open-source licenses in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>
    </PageShell>
  );
}
