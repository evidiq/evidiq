import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { DOCS } from "@/lib/docs";

export const metadata: Metadata = {
  title: "EVIDIQ Documentation — Trust layer + Notary for AI agents",
  description:
    "Documentation hub for EVIDIQ products: the agent trust layer (verify_agent + x402 + 0G attestation) and the AI output notary (signed receipts, Merkle proofs, 0G anchoring).",
  alternates: { canonical: "https://evidiq.dev/docs" },
  openGraph: {
    title: "EVIDIQ Documentation",
    description: "Trust layer + Notary for AI agents — MCP servers, x402 payments, 0G Storage anchors.",
    url: "https://evidiq.dev/docs",
  },
};

const BADGE_TONE: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-800 border-emerald-200",
  review: "bg-amber-100 text-amber-800 border-amber-200",
  soon: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DocsHubPage() {
  return (
    <PageShell max="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Documentation</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Build with EVIDIQ
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Open MCP servers for the AI agent economy — trust verification and output notarization,
        pay-per-call over x402, anchored on 0G Storage. Pick a product below for the full reference.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {DOCS.map((doc) => (
          <Link
            key={doc.slug}
            href={doc.href}
            className="group overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#171021]">
              <img
                src={doc.image}
                alt={`${doc.name} cover`}
                className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1a130a]">{doc.name}</h2>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${BADGE_TONE[doc.badgeTone] ?? BADGE_TONE.live}`}>
                  {doc.badge}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-violet-700">{doc.tagline}</p>
              <p className="mt-3 text-sm text-[#201810]/70">{doc.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {doc.tools.map((t) => (
                  <span
                    key={t.name}
                    className={`rounded-md px-2 py-0.5 font-mono text-xs ${
                      t.paid
                        ? "bg-violet-100 text-violet-800"
                        : "bg-[#f4efe4] text-[#201810]/60"
                    }`}
                  >
                    {t.name}
                    {t.paid ? " · paid" : " · free"}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-700">
                Read the docs
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <h2 className="text-lg font-bold text-[#1a130a]">Both products share the same stack</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-[#201810]/75">
          <li>· x402 v2 (EIP-3009 <span className="font-mono">exact</span>) — gasless for the payer, USDT0 on X Layer</li>
          <li>· 0G Storage mainnet (Aristotle, chain 16661) — tamper-evident anchoring via <span className="font-mono">@0gfoundation/0g-ts-sdk</span></li>
          <li>· EIP-191 signatures — recoverable offline from any receipt</li>
          <li>· MCP Streamable HTTP — works with Claude Code, Cursor, OnchainOS, and any MCP client</li>
        </ul>
      </div>
    </PageShell>
  );
}
