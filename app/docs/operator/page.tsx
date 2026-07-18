import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Operator Docs — Computer Use Infrastructure for AI agents",
  description:
    "Drive a real browser from natural language — login, fill forms, download docs, extract data, multi-step workflows. GPT-5.6-Terra via 0G Compute, x402 USDT0 pay-per-call.",
  alternates: { canonical: "https://evidiq.dev/docs/operator" },
  openGraph: {
    title: "EVIDIQ Operator Docs",
    description: "Computer Use Infrastructure for Autonomous AI Agents — MCP, x402, 0G Compute.",
    url: "https://evidiq.dev/docs/operator",
    images: [{ url: "/docs/operator-hero.png", width: 1024, height: 1024 }],
  },
};

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-[#2b2140] bg-[#171021] p-4 font-mono text-sm leading-relaxed text-cyan-200">
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

export default function OperatorDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-violet-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Operator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Computer Use Infrastructure for Autonomous AI Agents. Drive a real browser from
        natural language — login, fill forms, download documents, extract data, run
        multi-step workflows. GPT-5.6-Terra via 0G Compute plans each action from screenshots.
      </p>

      <OkxAiLiveBlock url="https://www.okx.ai/agents/6504" agentId={6504} name="EVIDIQ Operator" />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the EVIDIQ Operator MCP server to any MCP-capable agent:
      </p>
      <Code>claude mcp add --transport http evidiq-operator https://mcp.evidiq.dev/operator/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/operator/x402</Code>

      <H2 id="mcp">MCP server</H2>
      <p className="mt-3 text-[#201810]/70">
        The remote MCP endpoint is{" "}
        <span className="font-mono text-violet-700">https://mcp.evidiq.dev/operator/mcp</span>{" "}
        (Streamable HTTP). It exposes eleven tools — seven paid, four free:
      </p>
      <ul className="mt-4 space-y-2 text-[#201810]/75">
        <li><span className="font-mono font-semibold text-[#1a130a]">browser_task</span> — natural-language browser task <span className="text-violet-700">(x402-paid, $0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">login_and_extract</span> — login + extract data <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">fill_form</span> — fill + submit a form <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">download_document</span> — download a file <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">navigate</span> — go to URL + screenshot <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">screenshot</span> — single snapshot <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">multi_step_workflow</span> — chained workflow <span className="text-violet-700">($0.02)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">health</span> — service status + pool <span className="text-[#201810]/50">(free)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">capabilities</span> — tool catalog + pricing <span className="text-[#201810]/50">(free)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">supported_targets</span> — supported sites/types <span className="text-[#201810]/50">(free)</span></li>
        <li><span className="font-mono font-semibold text-[#1a130a]">estimate_cost</span> — pre-call cost estimate <span className="text-[#201810]/50">(free)</span></li>
      </ul>

      <H2 id="browser_task">browser_task</H2>
      <p className="mt-3 text-[#201810]/70">
        Submit a natural-language task description. The LLM (GPT-5.6-Terra via 0G Compute) plans
        each action from screenshots and drives a real Chromium browser.
      </p>
      <Code>{`{
  "task": "Go to example.com, login as user@example.com, and download the latest invoice PDF",
  "startUrl": "https://example.com/login",
  "maxSteps": 25
}`}</Code>
      <p className="mt-4 text-[#201810]/70">Returns structured JSON:</p>
      <Code>{`{
  "task": "Go to example.com, login...",
  "success": true,
  "steps": 12,
  "summary": "Logged in, downloaded invoice-2026-07.pdf (245KB)",
  "extractedData": { "file": "invoice-2026-07.pdf", "size": 250880 },
  "storageTx": "0x…",
  "stepLog": [
    { "step": 1, "action": "navigate" },
    { "step": 2, "action": "click" },
    { "step": 3, "action": "type" },
    ...
    { "step": 12, "action": "done" }
  ]
}`}</Code>

      <H2 id="how-it-works">How it works</H2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-[#201810]/75">
        <li>Agent calls <span className="font-mono">browser_task</span> with a natural-language goal.</li>
        <li>Server spawns (or reuses) a dedicated Chromium browser sandbox.</li>
        <li>GPT-5.6-Terra (via 0G Compute) receives a screenshot + the task.</li>
        <li>LLM returns a single structured action: <span className="font-mono">click</span>, <span className="font-mono">type</span>, <span className="font-mono">scroll</span>, <span className="font-mono">navigate</span>, <span className="font-mono">extract</span>, <span className="font-mono">done</span>.</li>
        <li>Server executes the action on the sandbox (via Playwright).</li>
        <li>Repeat until <span className="font-mono">done</span> or max steps reached.</li>
        <li>Return: summary + step log + extracted data + optional 0G anchor.</li>
      </ol>
      <p className="mt-4 text-[#201810]/70">
        The LLM <strong>never runs browser code</strong> — it only describes the next action.
        The server executes it. This is the standard &ldquo;computer use&rdquo; agent loop.
      </p>

      <H2 id="x402">Paying from your agent (x402)</H2>
      <p className="mt-3 text-[#201810]/70">
        The seven browser tools are metered with x402 v2 (scheme{" "}
        <span className="font-mono">exact</span>, EIP-3009, USDT0 on X Layer /{" "}
        <span className="font-mono">eip155:196</span>). An unpaid call returns HTTP 402; the
        agent signs a gasless authorization and retries with a{" "}
        <span className="font-mono">PAYMENT-SIGNATURE</span> header. The four free tools need
        no payment.
      </p>
      <Code>{`// 1. Unpaid call -> HTTP 402 with payment requirements
const { accepts: [req] } = await (await callBrowserTask()).json();

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

// 3. Retry with PAYMENT-SIGNATURE -> server settles, returns result
const paid = await callBrowserTask({
  "PAYMENT-SIGNATURE": base64({ x402Version: 2, accepted: req,
    payload: { signature, authorization } }),
});`}</Code>
      <p className="mt-4 text-[#201810]/70">
        Per-tool pricing lives at{" "}
        <span className="font-mono text-violet-700">https://mcp.evidiq.dev/operator/x402</span>.
      </p>

      <H2 id="pricing">Pricing</H2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-violet-200 text-left">
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Tool</th>
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Cost</th>
              <th className="py-2 pr-4 font-semibold text-[#1a130a]">Token</th>
              <th className="py-2 font-semibold text-[#1a130a]">Chain</th>
            </tr>
          </thead>
          <tbody className="text-[#201810]/75">
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">browser_task</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">login_and_extract</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">fill_form</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">download_document</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">navigate</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">screenshot</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">multi_step_workflow</td><td className="py-2 pr-4">$0.02</td><td className="py-2 pr-4">USDT0</td><td className="py-2">X Layer</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">health</td><td className="py-2 pr-4 text-[#201810]/50">Free</td><td className="py-2 pr-4">—</td><td className="py-2">—</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">capabilities</td><td className="py-2 pr-4 text-[#201810]/50">Free</td><td className="py-2 pr-4">—</td><td className="py-2">—</td></tr>
            <tr className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">supported_targets</td><td className="py-2 pr-4 text-[#201810]/50">Free</td><td className="py-2 pr-4">—</td><td className="py-2">—</td></tr>
            <tr><td className="py-2 pr-4 font-mono">estimate_cost</td><td className="py-2 pr-4 text-[#201810]/50">Free</td><td className="py-2 pr-4">—</td><td className="py-2">—</td></tr>
          </tbody>
        </table>
      </div>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          EVIDIQ Operator produces <span className="font-semibold text-[#1a130a]">structured
          results, not guarantees</span>. A screenshot proves the browser reached a state — it
          does not vouch for the website&apos;s correctness. Pair Operator with the{" "}
          <Link href="/docs/evidiq" className="font-semibold text-violet-700 hover:underline">
            EVIDIQ trust layer
          </Link>{" "}
          when you need a capability/risk verdict on the site or agent you&apos;re driving.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-violet-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
