import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OkxAiLiveBlock from "@/components/OkxAiLiveBlock";

export const metadata: Metadata = {
  title: "EVIDIQ Bastion Docs — Is this deployment configuration safe to apply?",
  description:
    "Deterministic infrastructure configuration auditor for Dockerfiles, GitHub Actions workflows, Kubernetes manifests, and IaC (Terraform / Compose). Non-root execution, secret protection, supply chain integrity, resource bounds, and signed attestations.",
  alternates: { canonical: "https://evidiq.dev/docs/bastion" },
  openGraph: {
    title: "EVIDIQ Bastion Docs",
    description: "A deterministic security audit for infrastructure deployment configurations.",
    url: "https://evidiq.dev/docs/bastion",
    images: [{ url: "/docs/bastion-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["scan_dockerfile", "0.005", "Audit Dockerfile for root user execution, unpinned base images, build-stage secrets, ADD URLs, and hygiene issues."],
  ["scan_workflow", "0.01", "Audit GitHub Actions workflow YAML for unpinned actions (missing 40-char SHA), pull_request_target untrusted checkout risk, script injection, and broad permissions."],
  ["scan_manifest", "0.015", "Audit Kubernetes manifests for privileged mode, hostPath/hostNetwork, missing CPU/memory resource limits, and secrets mounted as environment variables."],
  ["scan_iac", "0.02", "Audit Terraform HCL and Docker Compose for open world ingress (0.0.0.0/0), public storage buckets, plaintext variable defaults, and privileged containers."],
  ["attest_deployment", "0.03", "Bind deployment configuration digest and verdict into an EIP-191 signed attestation and anchor on 0G storage. Refuses without a configured signer."],
] as const;

const freeTools = [
  ["bastion_capabilities", "Rule catalog with severities, supported config kinds, limits, full pricing, and tool list."],
  ["validate_config", "Free preflight parse-check: auto-detects config type, computes SHA-256 digest, checks for input secrets, and reports severity counts without charging."],
  ["estimate_cost", "Price quotation lookup tool."],
  ["verify_bastion_report", "Offline verification tool for SHA-256 content digest and EIP-191 signatures."],
  ["get_artifact", "Retrieve a stored audit report or attestation by artifactId (10-minute TTL)."],
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

export default function BastionDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Bastion
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Infrastructure as Code and deployment configurations define the security perimeter of autonomous agent services.
        Bastion reviews Dockerfiles, CI workflows, Kubernetes manifests, and Terraform HCL deterministically — enforcing
        non-root execution, credential insulation, supply-chain integrity, and resource constraints before deployment.
      </p>

      <OkxAiLiveBlock
        url="https://www.okx.ai/agents/10359"
        agentId={10359}
        name="EVIDIQ Bastion"
        endpoint="https://mcp.evidiq.dev/bastion/mcp"
        status="review"
      />

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint to OpenClaw or Claude Code, then preflight for free before paying.
      </p>
      <Code>openclaw mcp add evidiq-bastion --transport streamable-http --url https://mcp.evidiq.dev/bastion/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the public pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/bastion/x402</Code>
      <p className="mt-4 text-[#201810]/70">Prefer a Skill file? Fetch the agent-readable EVIDIQ Bastion Skill:</p>
      <Code>curl -s https://mcp.evidiq.dev/bastion/skill.md</Code>

      <H2 id="openclaw-demo">OpenClaw Autonomous Agent Executions</H2>
      <p className="mt-3 text-[#201810]/70">
        Live execution trace from OpenClaw autonomous agent runs (<span className="font-mono text-sm font-semibold">openclaw agent</span>) invoking the installed <span className="font-mono text-sm font-semibold">evidiq-bastion</span> MCP skill on VPS.
      </p>

      {/* OpenClaw Execution Card 1 */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
            <span className="ml-2 font-semibold text-slate-300">openclaw agent --session-id bastion-dockerfile-audit</span>
          </div>
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400 border border-red-500/20">
            VERDICT: BLOCK
          </span>
        </div>
        <pre className="overflow-x-auto p-4 leading-relaxed text-slate-300">
{`openclaw@evidiq-vps:~$ openclaw agent --session-id bastion-dockerfile-audit \\
  --message "Use tool scan_dockerfile from evidiq-bastion MCP to audit: 'FROM node:22-alpine\\nCMD [\\"node\\"]'" --local

[provider-transport-fetch] start provider=zerog model=glm-5.2 method=POST url=https://router-api.0g.ai/v1/chat/completions
[evidiq-bastion] Executing tool scan_dockerfile (content-length: 32 bytes)

## Dockerfile Audit Results
Verdict: 🚫 BLOCK (1 blocker finding)

Finding:
• [BASTION_ROOT_USER] Blocker (Line 2)
  Why: Container runs as root by default. A container escape gives root access on the host node.
  Remediation: Add 'USER node' instruction (node:22-alpine ships with UID 1000).

Report Integrity:
  Digest: 86e0124f52a23e277f9864190fcbff9
  Signer: 0x131E4A54aB221929834815c99195dAec316aC270
  Artifact ID: art_86e0124f52a23e27`}
        </pre>
      </div>

      {/* OpenClaw Execution Card 2 */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
            <span className="ml-2 font-semibold text-slate-300">openclaw agent --session-id bastion-workflow-audit</span>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-500/20">
            VERDICT: REVIEW
          </span>
        </div>
        <pre className="overflow-x-auto p-4 leading-relaxed text-slate-300">
{`openclaw@evidiq-vps:~$ openclaw agent --session-id bastion-workflow-audit \\
  --message "Use tool scan_workflow from evidiq-bastion MCP to audit GitHub Actions workflow" --local

[provider-transport-fetch] start provider=zerog model=glm-5.2 method=POST url=https://router-api.0g.ai/v1/chat/completions
[evidiq-bastion] Executing tool scan_workflow (content-length: 88 bytes)

## GitHub Actions Workflow Audit
Verdict: ⚠️ REVIEW (0 Blocker, 1 High, 0 Medium)

Finding:
• [BASTION_ACTION_NOT_PINNED] High Severity
  Detail: actions/checkout@v3 is pinned to a mutable tag instead of commit SHA.
  Why: Mutable tags can be hijacked. Pinning to a SHA prevents untrusted action code updates.
  Remediation: Pin action to immutable 40-character commit SHA (e.g., actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11).

Integrity:
  Signature: EIP-191 signed by 0x131E4A54aB221929834815c99195dAec316aC270
  Artifact ID: art_960389b236d8cb9f`}
        </pre>
      </div>

      <H2 id="use-cases">What Bastion is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Pre-deployment Security Gate", "Prevent agent services from starting root containers or mounting open world ingress security groups."],
          ["Supply-Chain Pinning", "Enforce full 40-character commit SHA pinning for GitHub Actions and immutable digests for base container images."],
          ["Credential Insulation", "Detect secrets in build ARG/ENV parameters or hardcoded IaC variable default values before image build."],
          ["Kubernetes Hardening", "Verify securityContext rules to block privileged mode, hostPath volume mounts, and hostNetwork exposure."],
          ["Signed Deployment Attestations", "Generate EIP-191 signed attestations bound to config digests and anchored on 0G storage."],
          ["CI/CD Pipeline Integration", "Deterministic PASS, REVIEW, BLOCK verdicts allow pipelines to reject insecure deployments automatically."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="rules">Rule Engine & Verdicts</H2>
      <p className="mt-3 text-[#201810]/70">
        Bastion enforces 14 deterministic rules categorized into 6 core families: Privilege, Exposure, Secrets, Supply Chain, Resource, and Hygiene.
      </p>
      <p className="mt-4 text-[#201810]/70">
        The verdict rules are fixed: any failing <span className="font-mono">blocker</span> yields <span className="font-mono">BLOCK</span>;
        otherwise any failing <span className="font-mono">high</span> yields <span className="font-mono">REVIEW</span>;
        clean evaluations yield <span className="font-mono">PASS</span>.
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

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Bastion code under MIT. Third-party dependencies keep their own
        open-source licenses, preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
