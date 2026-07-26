import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Lineage Docs — Supply-chain provenance & AI dependency risk",
  description:
    "Deterministic supply-chain provenance, SBOM, AI-BOM, license auditing, and 14-rule risk analysis for AI-generated code and agent stacks with x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/lineage" },
  openGraph: {
    title: "EVIDIQ Lineage Docs",
    description: "Supply-chain provenance & AI dependency risk for autonomous agents.",
    url: "https://evidiq.dev/docs/lineage",
    images: [{ url: "/docs/lineage-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["verify_package_claim", "0.005", "Query npm/PyPI registry to verify package existence, version, and publisher metadata."],
  ["audit_licenses", "0.01", "Audit manifest dependencies for Copyleft (GPL/AGPL), incompatible, or missing licenses."],
  ["generate_sbom", "0.015", "Generate standard CycloneDX 1.6 or SPDX 3.0 Software Bill of Materials."],
  ["scan_dependencies", "0.02", "Execute full 14-rule supply-chain risk engine + live OSV vulnerability checks."],
  ["generate_aibom", "0.03", "Generate CycloneDX-AI-1.6 AI-BOM for models, datasets, and TEE runtimes."],
] as const;

const freeTools = [
  ["lineage_capabilities", "Inspect supported ecosystems, dataset versions, 14 rules catalog, and pricing."],
  ["validate_manifest", "Validate manifest or lockfile syntax without network calls or payment."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_lineage_report", "Recompute report integrity and verify trusted EIP-191 authenticity against an expected or configured signer."],
  ["get_artifact", "Retrieve a content-addressed JSON artifact by exact ID."],
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

export default function LineageDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-sky-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Lineage
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Supply-chain provenance &amp; AI dependency risk for autonomous agents. Give an agent an npm or PyPI manifest
        and receive a 14-rule risk analysis, live OSV vulnerability advisories, license audits, standard SBOMs/AI-BOMs,
        and a canonical EIP-191 signed report.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Deployment Ready
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1a130a]">EVIDIQ Lineage</p>
            <p className="font-mono text-xs text-[#201810]/60">Service Port 3005 · MCP endpoint live</p>
          </div>
        </div>
        <a
          href="https://mcp.evidiq.dev/lineage/health"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
        >
          Check Status ↗
        </a>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, and validate your manifest before making a paid call.
      </p>
      <Code>claude mcp add --transport http evidiq-lineage https://mcp.evidiq.dev/lineage/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/lineage/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Lineage Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/lineage/skill.md</Code>

      <H2 id="use-cases">What Lineage is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Typosquatting Detection", "Identify brand-jacking package names (e.g. expresss vs express) against top package catalogs."],
          ["Malicious IOC Matching", "Cross-check dependencies against a maintained database of known malicious package releases."],
          ["Live Vulnerabilities", "Query live OSV.dev advisories for open CVEs and GitHub Security Advisories."],
          ["Lifecycle Script Risk", "Flag packages using dangerous install hooks (preinstall, postinstall) that execute untrusted code."],
          ["License Auditing", "Detect Copyleft (GPL/AGPL), incompatible, missing, or unknown dependency licenses."],
          ["SBOM & AI-BOM", "Generate standard CycloneDX 1.6, SPDX 3.0, and CycloneDX-AI-1.6 specifications for software and models."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-sky-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>

      <H2 id="manifests">Supported Ecosystems &amp; Manifests</H2>
      <p className="mt-3 text-[#201810]/70">
        Lineage supports native parsing for both inline data strings and remote file URLs across npm and PyPI ecosystems.
      </p>
      <Code>{`{
  "ecosystem": "npm",
  "filename": "package.json",
  "content": "{\\"dependencies\\": {\\"express\\": \\"^4.18.2\\"}}"
}`}</Code>
      <Code>{`{
  "ecosystem": "pypi",
  "filename": "requirements.txt",
  "content": "requests==2.31.0\\nflask>=3.0.0"
}`}</Code>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight and verification. Five paid tools have different immutable prices based on workload.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid analysis &amp; BOM tools</h3>
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

      <H2 id="rules">14 Deterministic Security Risk Rules</H2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["TYPOSQUATTING", "Detects brand-jacking package names."],
          ["MALICIOUS_IOC", "Matches known malicious package IOC database."],
          ["OSV_VULNERABILITY", "Queries live OSV.dev CVE & GHDA advisories."],
          ["INSTALL_SCRIPTS", "Flags preinstall/postinstall lifecycle scripts."],
          ["LICENSE_CONFLICT", "Flags Copyleft licenses (GPL/AGPL)."],
          ["LICENSE_UNKNOWN", "Identifies missing or unrecognized licenses."],
          ["UNPINNED_DEPENDENCY", "Flags wildcards (*, latest, >=) risking takeover."],
          ["HALLUCINATED_PACKAGE", "Detects non-existent package names."],
          ["SUSPICIOUS_MAINTAINER", "Identifies disposable maintainer accounts."],
          ["PROVENANCE_MISSING", "Flags missing source repository links."],
          ["PROVENANCE_UNVERIFIED", "Detects commit hash or tag mismatches."],
          ["COMPONENTS_EXCEEDED", "Flags unexpected package count inflation."],
          ["UNSUPPORTED_MANIFEST", "Flags malformed manifest structures."],
          ["ADVISORY_DEGRADED", "Signals remote advisory API fallback."],
        ].map(([rule, desc]) => (
          <div key={rule} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <span className="font-mono text-xs font-bold text-sky-800">{rule}</span>
            <p className="mt-0.5 text-xs text-[#201810]/70">{desc}</p>
          </div>
        ))}
      </div>

      <H2 id="workflow">Recommended workflow</H2>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">lineage_capabilities</span> for current rules catalog and versions.</li>
        <li>Call <span className="font-mono">validate_manifest</span> to check manifest syntax without making network calls or paying.</li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended operation.</li>
        <li>Submit one paid call per request. Lineage enforces strict x402 payment authorization.</li>
        <li>Preserve the report and artifact IDs to verify reports received from another party.</li>
      </ol>

      <H2 id="reports">Reports and artifacts</H2>
      <p className="mt-3 text-[#201810]/70">
        Every paid result carries a complete report body: request parameters, component digests, engine version, result,
        SHA-256 integrity digest, and an EIP-191 signature.
      </p>
      <Code>{`{
  "reportId": "lin-7f9a2b1c8d3e4f0a",
  "result": {
    "verdict": "PASS",
    "score": 100,
    "totalComponents": 14,
    "findings": []
  },
  "integrity": {
    "algorithm": "sha256",
    "canonicalization": "evidiq-jcs-v1",
    "digest": "0x8f3c7e...",
    "signature": "0x1b2c3d...",
    "signer": "0x2a8efe3093278bb4bd3b2d9c7b5ba992ca4fc9b0"
  }
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
        (<span className="font-mono">eip155:196</span>). The public discovery endpoint lists all ten tools.
      </p>
      <p className="mt-4 text-[#201810]/70">
        Verification and settlement run through the{" "}
        <a
          href="https://web3.okx.com/onchainos/dev-docs/payments/service-seller-sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 hover:underline"
        >
          official OKX Onchain OS Payment SDK
        </a>{" "}
        (<span className="font-mono">@okxweb3/x402-core</span> and{" "}
        <span className="font-mono">@okxweb3/x402-evm</span>). The OKX facilitator verifies each authorization
        and settles it on X Layer before any scan begins.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/50 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-800">Deployed &amp; Live on VPS</p>
        <p className="mt-2 text-sm text-[#201810]/75">
          EVIDIQ Lineage service is live at <span className="font-mono font-semibold text-[#1a130a]">https://mcp.evidiq.dev/lineage/mcp</span>.
          All 10 MCP tools are verified and ready for agent integration.
        </p>
      </div>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Lineage code under MIT. Third-party dependencies maintain their own open-source licenses
        preserved in <span className="font-mono">THIRD_PARTY_NOTICES.md</span>.
      </p>

      <div className="mt-14 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Lineage produces <span className="font-semibold text-[#1a130a]">deterministic supply-chain risk analysis</span>.
          Review critical vulnerability findings and license conflicts before deploying agent-generated code to production.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-sky-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
