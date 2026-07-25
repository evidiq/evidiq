import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "EVIDIQ Atlas Docs — Reproducible dataset research via MCP",
  description:
    "Profile, query, visualize, compare, and research CSV, JSON, NDJSON, and Parquet in a bounded DuckDB runtime with canonical, optionally signed reports and x402 pricing.",
  alternates: { canonical: "https://evidiq.dev/docs/atlas" },
  openGraph: {
    title: "EVIDIQ Atlas Docs",
    description: "Secure dataset research, analysis, comparison, and Plotly-compatible visualization for AI agents.",
    url: "https://evidiq.dev/docs/atlas",
    images: [{ url: "/docs/atlas-hero.svg", width: 1200, height: 750 }],
  },
};

const paidTools = [
  ["profile_dataset", "0.005", "Infer schema and measure rows, missingness, distincts, distributions, and sample records."],
  ["query_dataset", "0.01", "Run one bounded read-only SELECT/CTE against the loaded dataset table."],
  ["visualize_dataset", "0.015", "Produce deterministic bar, line, scatter, histogram, or box chart JSON."],
  ["compare_datasets", "0.02", "Compare row/schema/null/distinct drift and optional key overlap."],
  ["research_dataset", "0.03", "Run profiling, duplicate estimation, correlations, IQR outliers, and optional trends."],
] as const;

const freeTools = [
  ["atlas_capabilities", "Inspect formats, limits, providers, security boundaries, and pricing."],
  ["validate_dataset_source", "Validate inline data or remote URL/DNS safety before payment."],
  ["estimate_cost", "Quote the immutable cost of any paid tool."],
  ["verify_atlas_report", "Recompute report integrity and verify trusted EIP-191 authenticity against an expected or configured signer."],
  ["get_artifact", "Retrieve a content-addressed JSON artifact by exact ID."],
] as const;

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

export default function AtlasDocsPage() {
  return (
    <PageShell max="max-w-4xl">
      <p className="text-sm">
        <Link href="/docs" className="font-semibold uppercase tracking-[0.24em] text-violet-700 hover:underline">
          ← Documentation
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        EVIDIQ Atlas
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-[#201810]/70">
        Reproducible research for large datasets. Give an agent CSV, JSON, NDJSON, or Parquet and
        receive bounded analysis, chart specifications, content-addressed artifacts, and a canonical
        report that can be verified independently.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Under review on OKX.AI
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1a130a]">EVIDIQ Atlas</p>
            <p className="font-mono text-xs text-[#201810]/60">Agent #9023 · MCP endpoint live</p>
          </div>
        </div>
        <a
          href="https://www.okx.ai/agents/9023"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
        >
          Open ↗
        </a>
      </div>

      <H2 id="quickstart">Quickstart</H2>
      <p className="mt-3 text-[#201810]/70">
        Connect the Streamable HTTP MCP endpoint, inspect capabilities, and validate the exact source
        before making a paid call.
      </p>
      <Code>claude mcp add --transport http evidiq-atlas https://mcp.evidiq.dev/atlas/mcp</Code>
      <p className="mt-4 text-[#201810]/70">Or probe the live pricing discovery endpoint:</p>
      <Code>curl -s https://mcp.evidiq.dev/atlas/x402</Code>
      <p className="mt-4 text-[#201810]/70">
        Prefer a Skill file? Fetch the agent-readable EVIDIQ Atlas Skill:
      </p>
      <Code>curl -s https://mcp.evidiq.dev/atlas/skill.md</Code>

      <H2 id="use-cases">What Atlas is for</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Data quality", "Infer schema and surface missingness, cardinality, distributions, duplicate estimates, and outliers."],
          ["Read-only analytics", "Ask precise questions with one bounded DuckDB SELECT or CTE."],
          ["Visualization", "Return deterministic Plotly-compatible specifications without copying Plotly source."],
          ["Version comparison", "Measure row, schema, null-rate, distinct-count, and key-overlap drift."],
          ["Longer research", "Combine profiles, correlations, IQR checks, and monthly trends into one canonical, optionally signed report."],
          ["Evidence", "Retain dataset digests, methods, assumptions, warnings, artifacts, and optional 0G anchors."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-violet-100 bg-white p-4">
            <h3 className="font-bold text-[#1a130a]">{title}</h3>
            <p className="mt-1 text-sm text-[#201810]/70">{description}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[#201810]/70">
        Atlas is intentionally not a generic coding or vibe-coding agent. It exposes no user-authored
        Python, JavaScript, shell, package installation, database attachment, or arbitrary file export.
      </p>

      <H2 id="sources">Dataset sources</H2>
      <p className="mt-3 text-[#201810]/70">
        Inline sources support CSV, JSON, and newline-delimited JSON. Public remote URLs additionally
        support Parquet. A source object is explicit so Atlas never guesses whether a string is data or a URL.
      </p>
      <Code>{`{
  "kind": "inline",
  "format": "csv",
  "name": "sales.csv",
  "data": "month,region,revenue\\n2026-01,APAC,1200\\n2026-02,EMEA,1450"
}`}</Code>
      <Code>{`{
  "kind": "url",
  "format": "parquet",
  "name": "events.parquet",
  "url": "https://data.example.org/events.parquet"
}`}</Code>

      <H2 id="tools">Ten MCP tools</H2>
      <p className="mt-3 text-[#201810]/70">
        Five free tools support preflight and verification. Five paid tools have different immutable
        prices based on their bounded workload.
      </p>
      <h3 className="mt-6 text-lg font-bold text-[#1a130a]">Paid analysis</h3>
      <ul className="mt-4 space-y-3 text-[#201810]/75">
        {paidTools.map(([name, price, description]) => (
          <li key={name}>
            <span className="font-mono font-semibold text-[#1a130a]">{name}</span> — {description}{" "}
            <span className="text-violet-700">({price} USDT0)</span>
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

      <H2 id="workflow">Recommended workflow</H2>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#201810]/75">
        <li>Call <span className="font-mono">atlas_capabilities</span> for current formats and limits.</li>
        <li>Call <span className="font-mono">validate_dataset_source</span>; remote validation checks URL and DNS without downloading content.</li>
        <li>Call <span className="font-mono">estimate_cost</span> for the intended operation.</li>
        <li>Submit one paid call per request. Atlas rejects batches with multiple paid calls instead of undercharging.</li>
        <li>Preserve the report/artifact IDs and verify reports received from another party.</li>
      </ol>
      <p className="mt-4 text-[#201810]/70">
        Payment settles before the bounded operation begins and covers the allocated attempt, including
        safe fetch and computation. Free validation exists to catch malformed or unsafe input first.
      </p>

      <H2 id="query">Read-only SQL</H2>
      <p className="mt-3 text-[#201810]/70">
        A single dataset is exposed as table <span className="font-mono">dataset</span>. Atlas accepts
        exactly one <span className="font-mono">SELECT</span> or <span className="font-mono">WITH</span>
        statement and applies row, response-size, memory, and time limits.
      </p>
      <Code>{`{
  "source": { "kind": "url", "format": "parquet", "url": "https://data.example.org/sales.parquet" },
  "sql": "SELECT region, sum(revenue) AS total FROM dataset GROUP BY region ORDER BY total DESC",
  "rowLimit": 500
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        Atlas rejects external readers, globbing, extension install/load, ATTACH, COPY, DDL, DML,
        multiple statements, system schemas, table functions, environment/settings introspection, and
        volatile expressions such as random, UUID, or current-time functions. Ad-hoc SQL reports are
        marked deterministic only when the outer query has an effective <span className="font-mono">ORDER BY</span>;
        otherwise the report records <span className="font-mono">deterministic: false</span>.
      </p>

      <H2 id="visualization">Visualization</H2>
      <p className="mt-3 text-[#201810]/70">
        <span className="font-mono">visualize_dataset</span> emits a deterministic Plotly-compatible
        JSON specification. The caller controls rendering; Atlas does not execute browser code.
      </p>
      <Code>{`{
  "source": { "kind": "inline", "format": "csv", "data": "month,revenue\\n2026-01,1200\\n2026-02,1450" },
  "chart": { "type": "line", "x": "month", "y": "revenue", "title": "Monthly revenue" }
}`}</Code>

      <H2 id="reports">Reports and artifacts</H2>
      <p className="mt-3 text-[#201810]/70">
        Every paid result carries a complete report body: request parameters, dataset digests, engine
        version, result, methods, assumptions, warnings, and reproducibility metadata. Atlas computes
        SHA-256 over canonical JSON for the complete body and adds an EIP-191 signature when its signer
        key is configured.
      </p>
      <Code>{`{
  "reportId": "atlas_report_…",
  "body": {
    "schemaVersion": "evidiq.atlas.report.v1",
    "tool": "profile_dataset",
    "datasets": [{ "digest": "sha256:…", "format": "csv", "bytes": 18422 }],
    "methods": ["DuckDB schema inference", "descriptive statistics"],
    "warnings": []
  },
  "integrity": {
    "algorithm": "sha256",
    "canonicalization": "evidiq-jcs-v1",
    "digest": "sha256:…",
    "signature": "0x…",
    "signer": "0x…"
  }
}`}</Code>
      <p className="mt-4 text-[#201810]/70">
        Report verification separates integrity from trusted authenticity. An unsigned report can have a
        valid structure, derived report ID, and body digest, but <span className="font-mono">valid</span> and
        <span className="font-mono"> authentic</span> become true only when its EIP-191 signature matches an
        explicit <span className="font-mono">expectedSigner</span> or the deployment&apos;s configured trusted signer.
      </p>
      <p className="mt-4 text-[#201810]/70">
        Artifacts are file-backed and content-addressed. Their ID-derived kind, digest, byte count,
        content type, and canonical content are checked on retrieval. They provide integrity and
        reproducibility, not authorization; deployments must protect sensitive artifact IDs and apply
        their own data policy.
      </p>

      <H2 id="security">Remote-fetch and runtime security</H2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-[#201810]/75">
        <li>HTTP(S) only, no URL credentials, and only standard ports.</li>
        <li>A and AAAA records are checked; private, loopback, link-local, CGNAT, multicast, reserved, documentation, and cloud-metadata ranges are rejected.</li>
        <li>The checked public IP is pinned for the connection; every redirect is revalidated and re-resolved.</li>
        <li>Redirect, timeout, content type, Content-Length, and decompressed-byte limits are enforced.</li>
        <li>Each paid call gets a fresh in-memory DuckDB database and private temporary directory. External database access is disabled after controlled ingest.</li>
      </ul>

      <H2 id="providers">DuckDB, E2B, and 0G</H2>
      <p className="mt-3 text-[#201810]/70">
        DuckDB is Atlas&apos;s primary engine because its MIT-licensed in-process OLAP runtime fits
        CSV/JSON/Parquet and bounded read-only SQL. E2B is retained behind an optional provider boundary,
        but Atlas v1 honestly keeps deterministic tools on DuckDB and does not expose E2B&apos;s generic code runtime.
      </p>
      <p className="mt-4 text-[#201810]/70">
        0G Storage anchoring is optional and best-effort. Its public, privacy-minimized record contains
        only the report ID, fixed integrity labels and report-body digest, plus each dataset&apos;s format,
        digest, and byte count. It excludes artifact IDs/digests/kinds, dataset names, source URLs,
        signatures, signer addresses, raw datasets, results, samples, and query rows. A storage failure
        is surfaced as <span className="font-mono">storageNote</span> and does not falsify the local report.
      </p>

      <H2 id="payments">x402 pricing</H2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="border-b border-violet-200 text-left"><th className="py-2 pr-4">Tool</th><th className="py-2 pr-4">Atomic</th><th className="py-2 pr-4">USDT0</th><th className="py-2">Access</th></tr></thead>
          <tbody className="text-[#201810]/75">
            {paidTools.map(([name, price]) => (
              <tr key={name} className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">{name}</td><td className="py-2 pr-4">{String(Math.round(Number(price) * 1_000_000))}</td><td className="py-2 pr-4">{price}</td><td className="py-2">x402</td></tr>
            ))}
            {freeTools.map(([name]) => (
              <tr key={name} className="border-b border-violet-100"><td className="py-2 pr-4 font-mono">{name}</td><td className="py-2 pr-4">0</td><td className="py-2 pr-4">Free</td><td className="py-2">Always ungated</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[#201810]/70">
        Payments use x402 v2 <span className="font-mono">exact</span> with USDT0 (6 decimals) on X Layer
        (<span className="font-mono">eip155:196</span>). The public discovery endpoint lists all ten tools.
        If a broadcast settlement is awaiting confirmation, Atlas returns HTTP 202 with its transaction
        hash; retry the same authorization so confirmation can be checked without broadcasting or paying again.
        Ambiguous facilitator settlement returns a service error instead of a new 402 challenge.
      </p>

      <H2 id="licensing">Licensing</H2>
      <p className="mt-3 text-[#201810]/70">
        EVIDIQ owns and licenses its original Atlas integration code under MIT. DuckDB, E2B, the 0G SDK,
        MCP SDK, and other dependencies remain third-party technology under their own licenses. Atlas
        consumes pinned packages, does not copy upstream source, and preserves notices in
        <span className="font-mono"> THIRD_PARTY_NOTICES.md</span> and package distributions.
      </p>

      <div className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
        <p className="text-sm text-[#201810]/75">
          Atlas produces <span className="font-semibold text-[#1a130a]">reproducible descriptive evidence</span>,
          not a guarantee that a source is complete, unbiased, legally usable, or causally explanatory.
          Review source provenance, sampling, units, and domain assumptions before acting on a result.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/docs" className="font-semibold text-violet-700 hover:underline">← Back to docs</Link>
      </p>
    </PageShell>
  );
}
