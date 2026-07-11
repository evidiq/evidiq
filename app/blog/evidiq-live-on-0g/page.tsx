import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getPost, formatDate } from "@/lib/blog";

const post = getPost("evidiq-live-on-0g")!;

export const metadata: Metadata = {
  title: `${post.title} — EVIDIQ`,
  description: post.excerpt,
};

export default function Post() {
  return (
    <PageShell max="max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800">
        <ArrowLeft size={15} /> All posts
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-[#201810]/50">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-semibold text-violet-700">{post.tag}</span>
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#1a130a] md:text-5xl">
        {post.title}
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#201810]/80">
        <p>
          Agents can already discover each other, negotiate, and pay. What they still lack is a way to
          know whether a counterparty they have never met can be trusted. EVIDIQ answers three
          questions before any value moves: can this agent do what it claims, how risky is the deal,
          and what is its standing — and can I prove the verdict later?
        </p>

        <h2 className="pt-4 text-2xl font-bold text-[#1a130a]">A verdict you can prove</h2>
        <p>
          Every check returns a Trust Report: a deterministic score across identity, capability,
          reputation, and risk, plus an explicit recommendation. The score is explainable by design —
          the same inputs always produce the same verdict, so it can be audited rather than trusted
          blindly.
        </p>
        <p>
          The report is then made tamper-evident. The full evidence is anchored on{" "}
          <span className="font-semibold text-[#1a130a]">0G mainnet Storage</span> (returning an
          on-chain transaction and a merkle root), a qualitative risk analysis runs on{" "}
          <span className="font-semibold text-[#1a130a]">0G Compute with GLM-5.2 inside a TEE</span>{" "}
          (recording the provider address and request id), and the verdict is signed with the EVIDIQ
          key. Anyone can re-fetch the evidence by its root hash, re-hash it, and recover the signer.
        </p>

        <h2 className="pt-4 text-2xl font-bold text-[#1a130a]">Open, and easy to adopt</h2>
        <p>
          EVIDIQ ships the way agents actually consume capabilities: an open skill at{" "}
          <span className="font-mono text-violet-700">/skill.md</span>, a remote MCP server at{" "}
          <span className="font-mono text-violet-700">/mcp</span>, and an x402 pay-per-call endpoint so
          the core <span className="font-mono">verify_agent</span> check can be metered like any other
          agent service. Connect it to Claude Code, Cursor, or a custom agent in one line.
        </p>

        <h2 className="pt-4 text-2xl font-bold text-[#1a130a]">Evidence, not permission</h2>
        <p>
          EVIDIQ never holds funds or grants authority — it produces evidence and a recommendation.
          For any deal with real exposure, the report is meant to be paired with escrow or dispute
          rights. That is the point of a trust layer: make the risk legible, then let the parties
          choose their protection.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-[#2b2140] bg-[#171021] p-6">
        <p className="text-white/80">Give your agent the trust skill:</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 font-mono text-sm text-cyan-300">
          curl -s https://evidiq.dev/skill.md
        </div>
      </div>
    </PageShell>
  );
}
