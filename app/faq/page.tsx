import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FAQ — EVIDIQ",
  description: "Frequently asked questions about EVIDIQ, the trust layer for the AI agent economy.",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is EVIDIQ?",
    a: "EVIDIQ is the trust layer for the AI agent economy. Before an agent transacts with, delegates to, or relies on another agent or a paid service, EVIDIQ verifies its capability, scores its risk, checks its on-chain reputation, and returns a signed Trust Report.",
  },
  {
    q: "How is a Trust Score calculated?",
    a: "The score is deterministic and explainable — it combines four dimensions (identity, capability, reputation, risk) from the signals you supply and a live probe of the agent's endpoint. The same inputs always produce the same verdict, so it is auditable rather than a black box.",
  },
  {
    q: "What makes the report tamper-evident?",
    a: "Each paid report is hashed (keccak256), the full evidence is anchored on 0G mainnet Storage, and the verdict is signed with the EVIDIQ key (EIP-191). Anyone can re-fetch the evidence by its 0G root hash, re-hash it, and recover the signer.",
  },
  {
    q: "Where does the AI analysis run?",
    a: "The qualitative risk analysis runs on 0G Compute (model GLM-5.2) inside a TEE. The response records the on-chain provider address and request id, so the inference is attributable to a verified enclave — not a black-box API.",
  },
  {
    q: "How do I connect it to my agent?",
    a: "Add the remote MCP server in one line: `claude mcp add --transport http evidiq https://evidiq.dev/mcp`, or fetch the open skill with `curl -s https://evidiq.dev/skill.md`. See the Docs for details.",
  },
  {
    q: "How much does it cost?",
    a: "The skill and onboarding tools are free. The verify_agent trust check is metered with x402 (pay-per-call). Unpaid calls receive an HTTP 402 challenge; sign it and retry to run the check.",
  },
  {
    q: "Which frameworks and chains does it work with?",
    a: "Any agent framework — LangChain, AutoGen, CrewAI, LlamaIndex, Haystack, or custom. It settles on 0G (storage + compute/TEE) and X Layer (x402 payments), and lists on the OKX AI marketplace.",
  },
  {
    q: "Does a high score guarantee a safe deal?",
    a: "No. EVIDIQ produces evidence and a recommendation, not permission. It never holds funds or grants authority. For any deal with real exposure, pair the verdict with escrow or dispute rights.",
  },
  {
    q: "Is EVIDIQ open?",
    a: "Yes — the skill is served openly at /skill.md and the code is on GitHub. It complements agent-to-agent commerce skills such as Internet Court rather than replacing them.",
  },
];

export default function FaqPage() {
  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">FAQ</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Questions, answered
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Everything you need to know about the trust layer for the AI agent economy.
      </p>

      <div className="mt-10 space-y-4">
        {FAQ.map((item) => (
          <div key={item.q} className="rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-6">
            <h2 className="text-lg font-bold text-[#1a130a]">{item.q}</h2>
            <p className="mt-2 leading-relaxed text-[#201810]/70">{item.a}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
