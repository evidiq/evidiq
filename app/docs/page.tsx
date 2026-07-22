import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { DOCS, type DocCard } from "@/lib/docs";

export const metadata: Metadata = {
  title: "EVIDIQ Documentation — Core trust and specialist MCP services",
  description:
    "Documentation for EVIDIQ Core, Notary, Operator, and Sentinel: verifiable MCP services for trust, receipts, execution, and security preflight.",
  alternates: { canonical: "https://evidiq.dev/docs" },
  openGraph: {
    title: "Build with the EVIDIQ MCP ecosystem",
    description: "One core trust layer with specialist MCP services for notarization, execution, and security.",
    url: "https://evidiq.dev/docs",
  },
};

const BADGE_TONE: Record<string, string> = {
  live: "border-emerald-300/40 bg-emerald-300/15 text-emerald-200",
  review: "border-amber-300/40 bg-amber-300/15 text-amber-200",
  soon: "border-white/20 bg-white/10 text-white/60",
};

function ToolChips({ doc, dark = false }: { doc: DocCard; dark?: boolean }) {
  return (
    <div className="mt-5 flex flex-wrap gap-1.5">
      {doc.tools.map((tool) => (
        <span
          key={tool.name}
          className={`rounded-md px-2 py-1 font-mono text-[11px] ${
            dark
              ? tool.paid
                ? "bg-violet-400/15 text-violet-200"
                : "bg-white/[0.07] text-white/50"
              : tool.paid
                ? "bg-violet-100 text-violet-800"
                : "bg-[#f4efe4] text-[#201810]/60"
          }`}
        >
          {tool.name} · {tool.paid ? "paid" : "free"}
        </span>
      ))}
    </div>
  );
}

function ServiceCard({ doc }: { doc: DocCard }) {
  return (
    <Link
      href={doc.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#171021]">
        <img
          src={doc.image}
          alt={`${doc.name} cover`}
          className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          loading="lazy"
        />
        <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${BADGE_TONE[doc.badgeTone]}`}>
          {doc.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-[#1a130a] transition-colors group-hover:text-violet-700">{doc.name}</h3>
        <p className="mt-1 text-sm font-semibold text-violet-700">{doc.tagline}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-[#201810]/65">{doc.description}</p>
        <ToolChips doc={doc} />
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
          Explore service <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function DocsHubPage() {
  const core = DOCS.find((doc) => doc.slug === "evidiq");
  const specialists = DOCS.filter((doc) => doc.slug !== "evidiq");

  return (
    <PageShell max="max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Documentation</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-6xl">
        Build trust into every agent interaction.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#201810]/65">
        Begin with EVIDIQ Core for identity, capability, and risk verification. Add specialist MCP
        services when your workflow needs cryptographic receipts, browser execution, or security preflight.
      </p>

      {core && (
        <Link
          href={core.href}
          className="group relative mt-12 grid overflow-hidden rounded-[2rem] border border-violet-300/60 bg-gradient-to-br from-violet-100/80 via-white/55 to-fuchsia-100/60 shadow-[0_24px_80px_rgba(109,76,160,0.16)] backdrop-blur-sm lg:grid-cols-[1.05fr_1fr]"
        >
          <div className="relative min-h-72 overflow-hidden lg:min-h-[410px]">
            <img
              src={core.image}
              alt={`${core.name} cover`}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-50/10 to-violet-100/95" />
            <span className={`absolute left-5 top-5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${BADGE_TONE[core.badgeTone]}`}>
              {core.badge}
            </span>
          </div>
          <div className="relative flex flex-col justify-center p-8 text-[#1a130a] md:p-12 lg:-ml-12 lg:pl-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">Core trust layer</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{core.name}</h2>
            <p className="mt-2 font-semibold text-cyan-800">{core.tagline}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-[#201810]/65">{core.description}</p>
            <ToolChips doc={core} />
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-violet-700 group-hover:text-violet-950">
              Start with EVIDIQ Core <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      )}

      <section className="mt-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">Specialist services</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a130a] md:text-4xl">
              Extend the stack without changing your trust foundation.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#201810]/60">
            Independent endpoints, consistent x402 payments, signed evidence, and one developer experience.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {specialists.map((doc) => <ServiceCard key={doc.slug} doc={doc} />)}
        </div>
      </section>

      <div className="mt-16 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-cyan-50/60 p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">Shared foundation</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a130a]">Shared primitives, service-specific guarantees.</h2>
        <div className="mt-6 grid gap-4 text-sm text-[#201810]/70 sm:grid-cols-2 lg:grid-cols-4">
          <div><span className="font-bold text-[#1a130a]">x402 v2</span><br />A consistent USDT0 payment rail on X Layer</div>
          <div><span className="font-bold text-[#1a130a]">0G infrastructure</span><br />Compute or storage where each service requires it</div>
          <div><span className="font-bold text-[#1a130a]">Explicit evidence</span><br />Receipts, reports, or execution records per service</div>
          <div><span className="font-bold text-[#1a130a]">MCP native</span><br />Streamable HTTP for any compatible client</div>
        </div>
      </div>
    </PageShell>
  );
}
