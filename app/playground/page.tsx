"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Satellite,
  BarChart3,
  Cpu,
  FileCheck2,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Lock,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
  Wifi,
  WifiOff,
  ShieldAlert,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import type {
  Finding,
  FindingSeverity,
  Recommendation,
  TrustReport,
} from "@/lib/trust/types";

/* ────────────────────────────────────────────────────────────────────────
   Demo counterparties — curated so the story reads green → escrow → red.
   Every one runs through the REAL pipeline; nothing here is hard-coded.
   ──────────────────────────────────────────────────────────────────────── */

type Fields = {
  agentId: string;
  endpoint: string;
  address: string;
  erc8004Id: string;
  domain: string;
  framework: string;
  capabilities: string;
  context: string;
};

const EMPTY: Fields = {
  agentId: "",
  endpoint: "",
  address: "",
  erc8004Id: "",
  domain: "",
  framework: "",
  capabilities: "",
  context: "",
};

type Preset = {
  key: string;
  label: string;
  hint: string;
  Icon: typeof ShieldCheck;
  tone: string;
  fields: Fields;
};

const PRESETS: Preset[] = [
  {
    key: "trusted",
    label: "Verified service agent",
    hint: "Live endpoint · TLS · on-chain identity",
    Icon: ShieldCheck,
    tone: "text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100",
    fields: {
      agentId: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      endpoint: "https://evidiq.dev/skill.md",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      erc8004Id: "1024",
      domain: "evidiq.dev",
      framework: "MCP",
      capabilities: "trust.verify, attestation, x402.settle",
      context: "About to pay this agent 250 USDC for a data-enrichment job.",
    },
  },
  {
    key: "escrow",
    label: "Unknown marketplace agent",
    hint: "Reachable + an address, but thin identity",
    Icon: AlertTriangle,
    tone: "text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100",
    fields: {
      ...EMPTY,
      agentId: "market-bot.example.com",
      endpoint: "https://example.com",
      address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      framework: "custom",
      capabilities: "trade.execute, quote",
      context: "Wants to execute trades on my behalf.",
    },
  },
  {
    key: "walkaway",
    label: "Anonymous cold-DM agent",
    hint: "No identity · unreachable · no TLS",
    Icon: ShieldAlert,
    tone: "text-red-700 border-red-300 bg-red-50 hover:bg-red-100",
    fields: {
      ...EMPTY,
      agentId: "anon-agent-0xdead",
      endpoint: "http://sketchy-agent.invalid",
      capabilities: "send.funds, swap",
      context: "Cold DM offering to 10x my funds if I send first.",
    },
  },
];

/* ────────────────────────────────────────────────────────────────────────
   Verdict styling
   ──────────────────────────────────────────────────────────────────────── */

const REC: Record<
  Recommendation,
  { label: string; ring: string; text: string; chip: string; Icon: typeof CheckCircle2 }
> = {
  proceed: {
    label: "Proceed",
    ring: "#059669",
    text: "text-emerald-700",
    chip: "border-emerald-300 bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  proceed_with_escrow: {
    label: "Proceed with escrow",
    ring: "#7c3aed",
    text: "text-violet-700",
    chip: "border-violet-300 bg-violet-50 text-violet-700",
    Icon: Lock,
  },
  caution: {
    label: "Caution",
    ring: "#d97706",
    text: "text-amber-700",
    chip: "border-amber-300 bg-amber-50 text-amber-700",
    Icon: AlertTriangle,
  },
  do_not_proceed: {
    label: "Do not proceed",
    ring: "#dc2626",
    text: "text-red-700",
    chip: "border-red-300 bg-red-50 text-red-700",
    Icon: Ban,
  },
};

const SEV: Record<FindingSeverity, string> = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-[#e7dcc7] bg-white text-[#201810]/70",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  critical: "border-red-200 bg-red-50 text-red-800",
};

const SEV_DOT: Record<FindingSeverity, string> = {
  positive: "bg-emerald-500",
  info: "bg-slate-400",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

/* ────────────────────────────────────────────────────────────────────────
   Small helpers
   ──────────────────────────────────────────────────────────────────────── */

function useCountUp(target: number, run: boolean, ms = 1100): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 0.5 - Math.cos(Math.PI * p) / 2; // easeInOut
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}

function short(v?: string, head = 10, tail = 8): string {
  if (!v) return "";
  return v.length > head + tail + 3 ? `${v.slice(0, head)}…${v.slice(-tail)}` : v;
}

function Mono({ label, value, href }: { label: string; value?: string; href?: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#e7dcc7] bg-white/70 px-3 py-2">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#201810]/45">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-[#201810]/80">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={value}
            className="truncate text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-800"
          >
            {short(value)}
          </a>
        ) : (
          <span className="truncate" title={value}>
            {short(value)}
          </span>
        )}
        <button type="button" onClick={copy} aria-label="Copy" className="group shrink-0">
          {copied ? (
            <Check size={12} className="text-emerald-600" />
          ) : (
            <Copy size={12} className="opacity-40 group-hover:opacity-90" />
          )}
        </button>
      </span>
    </div>
  );
}

/* Signal chip (probe results) */
function Signal({ ok, label, warn }: { ok: boolean; label: string; warn?: boolean }) {
  const cls = ok
    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
    : warn
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-[#e7dcc7] bg-white text-[#201810]/45";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
      {ok ? <Check size={12} /> : warn ? <Ban size={12} /> : null}
      {label}
    </span>
  );
}

/* Score bar */
function Bar({
  label,
  value,
  invert,
  run,
}: {
  label: string;
  value: number;
  invert?: boolean;
  run: boolean;
}) {
  // invert = risk (high is bad → red)
  const good = invert ? value < 40 : value >= 60;
  const mid = invert ? value < 70 : value >= 40;
  const color = good
    ? "bg-emerald-500"
    : mid
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-[#201810]/70">{label}</span>
        <span className="font-mono text-[#201810]/50">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e7dcc7]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: run ? `${value}%` : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* Stage wrapper — reveals with a delay so the pipeline reads sequentially */
function Stage({
  n,
  title,
  Icon,
  delay,
  children,
}: {
  n: number;
  title: string;
  Icon: typeof Satellite;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-5"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-200 to-fuchsia-100 text-violet-700">
          <Icon size={16} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#201810]/45">
          Step {n}
        </span>
        <span className="font-bold text-[#1a130a]">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Running pipeline (while the real request is in flight)
   ──────────────────────────────────────────────────────────────────────── */

const RUN_STAGES = [
  { Icon: Satellite, label: "Probing endpoint" },
  { Icon: BarChart3, label: "Scoring risk" },
  { Icon: Cpu, label: "AI analysis · 0G Compute (TEE)" },
  { Icon: FileCheck2, label: "Anchoring + signing on 0G" },
];

function RunningPipeline({ agentId }: { agentId: string }) {
  const [active, setActive] = useState(0);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const a = setInterval(() => setActive((v) => (v + 1) % RUN_STAGES.length), 900);
    const s = setInterval(() => setSecs((v) => +(v + 0.1).toFixed(1)), 100);
    return () => {
      clearInterval(a);
      clearInterval(s);
    };
  }, []);
  return (
    <div className="rounded-3xl border border-[#e7dcc7] bg-[#fbf8f1] p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-[#1a130a]">
          <Loader2 size={18} className="animate-spin text-violet-600" />
          Verifying <span className="font-mono text-sm text-[#201810]/60">{short(agentId, 16, 8)}</span>
        </div>
        <span className="font-mono text-sm text-[#201810]/45">{secs.toFixed(1)}s</span>
      </div>
      <div className="space-y-2.5">
        {RUN_STAGES.map((s, i) => {
          const done = i < active;
          const now = i === active;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                now
                  ? "border-violet-300 bg-violet-50"
                  : done
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-[#e7dcc7] bg-white/50"
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-lg ${
                  now ? "bg-violet-200 text-violet-700" : done ? "bg-emerald-200 text-emerald-700" : "bg-[#efe8da] text-[#201810]/40"
                }`}
              >
                {now ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : done ? (
                  <Check size={15} />
                ) : (
                  <s.Icon size={15} />
                )}
              </span>
              <span className={`text-sm font-medium ${now ? "text-violet-800" : "text-[#201810]/70"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Results (staged reveal of the REAL report)
   ──────────────────────────────────────────────────────────────────────── */

function Results({ report }: { report: TrustReport }) {
  const rec = REC[report.recommendation];
  const b = report.breakdown;
  const probe = report.probe;
  const att = report.attestation;
  const analysis = report.analysis;

  // Reveal timeline (seconds)
  const D = { probe: 0.05, score: 0.6, analysis: 1.2, attest: 1.8, verdict: 2.5 };

  const [showRing, setShowRing] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowRing(true), D.verdict * 1000);
    return () => clearTimeout(t);
  }, [D.verdict]);
  const score = useCountUp(report.trustScore, showRing);

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <div className="space-y-4">
      {/* STEP 1 — probe */}
      <Stage n={1} title="Endpoint probe" Icon={Satellite} delay={D.probe}>
        {probe?.attempted ? (
          <div className="flex flex-wrap gap-2">
            <Signal ok={probe.reachable} warn={!probe.reachable} label={probe.reachable ? "Reachable" : "Unreachable"} />
            <Signal ok={probe.tls} label="TLS" />
            <Signal ok={probe.advertisesX402} label="x402 paywall" />
            <Signal ok={probe.servesSkill} label="Machine-readable" />
            {typeof probe.status === "number" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e7dcc7] bg-white px-3 py-1 text-xs font-mono text-[#201810]/60">
                HTTP {probe.status}
              </span>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-[#201810]/55">
            <WifiOff size={15} /> No endpoint supplied — scored on declared signals only.
          </p>
        )}
        {probe?.note && (
          <p className="mt-2 text-xs text-[#201810]/45">{probe.note}</p>
        )}
      </Stage>

      {/* STEP 2 — score breakdown */}
      <Stage n={2} title="Risk scoring" Icon={BarChart3} delay={D.score}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Bar label="Identity" value={b.identity} run />
          <Bar label="Capability" value={b.capability} run />
          <Bar label="Reputation" value={b.reputation} run />
          <Bar label="Risk" value={b.risk} invert run />
        </div>
        <p className="mt-3 text-xs text-[#201810]/45">
          Deterministic + explainable — the same inputs always yield the same verdict.
        </p>
      </Stage>

      {/* STEP 3 — AI analysis */}
      <Stage n={3} title="AI risk analysis" Icon={Cpu} delay={D.analysis}>
        {analysis ? (
          <>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Cpu size={12} /> {analysis.model}
              </span>
              {analysis.teeVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck size={12} /> 0G TEE-verified
                </span>
              )}
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#201810]/80">
              {analysis.text}
            </p>
          </>
        ) : (
          <p className="flex items-center gap-2 text-sm text-[#201810]/55">
            <Wifi size={15} /> 0G Compute not configured on this instance — deterministic scoring
            only. When enabled, a TEE-verified LLM analysis appears here.
          </p>
        )}
      </Stage>

      {/* STEP 4 — attestation */}
      <Stage n={4} title="Verifiable attestation" Icon={FileCheck2} delay={D.attest}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              att?.method === "unsigned"
                ? "border-[#e7dcc7] bg-white text-[#201810]/50"
                : "border-violet-300 bg-violet-50 text-violet-700"
            }`}
          >
            <FileCheck2 size={12} />
            {att?.method === "0g-tee"
              ? "0G TEE attestation"
              : att?.method === "evidiq-eip191"
                ? "Signed (EIP-191)"
                : "Unsigned"}
          </span>
          {att?.storageRoot && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck size={12} /> Anchored on 0G Storage
            </span>
          )}
          {att?.tee?.verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Cpu size={12} /> TEE-verified · {att.tee.model}
            </span>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Mono label="Report hash" value={att?.reportHash} />
          <Mono label="Attester" value={att?.attester} />
          <Mono label="Signature" value={att?.signature} />
          <Mono
            label="0G storage tx"
            value={att?.storageTx}
            href={att?.storageTx ? `https://chainscan.0g.ai/tx/${att.storageTx}` : undefined}
          />
          <Mono label="0G storage root" value={att?.storageRoot} />
          <Mono
            label="0G TEE provider"
            value={att?.tee?.provider}
            href={att?.tee?.provider ? `https://chainscan.0g.ai/address/${att.tee.provider}` : undefined}
          />
          <Mono label="0G TEE request" value={att?.tee?.requestId} />
        </div>
        {att?.note && <p className="mt-2 text-xs text-[#201810]/45">{att.note}</p>}
      </Stage>

      {/* STEP 5 — verdict */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: D.verdict, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-3xl border border-[#2b2140] bg-[#120c1c] p-6 md:p-8"
      >
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          {/* score ring */}
          <div className="relative grid shrink-0 place-items-center">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={R} fill="none" stroke="#2b2140" strokeWidth="12" />
              <motion.circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={rec.ring}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: showRing ? C * (1 - report.trustScore / 100) : C }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white">{score}</span>
              <span className="text-[11px] uppercase tracking-widest text-white/40">/ 100</span>
            </div>
          </div>

          {/* verdict text */}
          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              EVIDIQ verdict · {report.tier} trust
            </p>
            <div className="mt-2 flex items-center justify-center gap-2.5 md:justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: rec.ring }}>
                <rec.Icon size={18} className="text-white" />
              </span>
              <span className="text-2xl font-extrabold text-white md:text-3xl">{rec.label}</span>
            </div>
            <p className="mt-3 break-words font-mono text-xs text-white/45">{report.agentId}</p>
            {report.input.context && (
              <p className="mt-2 text-sm text-white/60">“{report.input.context}”</p>
            )}
          </div>
        </div>

        {/* findings */}
        <div className="mt-6 grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-2">
          {report.findings.map((f: Finding, i: number) => (
            <div
              key={`${f.code}-${i}`}
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEV_DOT[f.severity]}`} />
              <span className="text-sm leading-relaxed text-white/75">{f.message}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */

type Status = "idle" | "running" | "done" | "error";

export default function PlaygroundPage() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<TrustReport | null>(null);
  const [error, setError] = useState<string>("");
  const [activePreset, setActivePreset] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function run(src: Fields) {
    setStatus("running");
    setReport(null);
    setError("");
    // give the running pipeline a moment to render, then scroll to it
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);

    const body = {
      agentId: src.agentId.trim() || "unnamed-agent",
      endpoint: src.endpoint.trim() || undefined,
      framework: src.framework.trim() || undefined,
      declaredCapabilities: src.capabilities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      identity: {
        address: src.address.trim() || undefined,
        erc8004Id: src.erc8004Id.trim() || undefined,
        domain: src.domain.trim() || undefined,
      },
      context: src.context.trim() || undefined,
    };

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Verification failed.");
        setStatus("error");
        return;
      }
      setReport(json.report as TrustReport);
      setStatus("done");
    } catch {
      setError("Network error — could not reach the verifier.");
      setStatus("error");
    }
  }

  function applyPreset(p: Preset) {
    setF(p.fields);
    setActivePreset(p.key);
    // Fill the form only — do NOT auto-run. The user presses "Verify" so the
    // inputs being judged are visible on screen before the verdict appears.
    setReport(null);
    setStatus("idle");
    setError("");
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60
    );
  }

  const canRun = f.agentId.trim().length > 0 && status !== "running";

  return (
    <PageShell max="max-w-5xl">
      {/* header */}
      <div className="text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100/70 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-violet-700">
          <Sparkles size={14} /> Live playground
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1a130a] md:text-5xl">
          Watch EVIDIQ verify an agent
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            before a single dollar moves.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[#201810]/65">
          Pick a counterparty or paste your own. EVIDIQ probes it live, scores the risk, runs a
          TEE-verified analysis on 0G, and returns a signed Trust Report — proceed, escrow, or walk
          away.
        </p>
      </div>

      {/* presets */}
      <div className="mt-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#201810]/45">
          Try a scenario
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => applyPreset(p)}
              disabled={status === "running"}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors disabled:opacity-60 ${p.tone} ${
                activePreset === p.key ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-[#f4efe4]" : ""
              }`}
            >
              <p.Icon size={22} className="mt-0.5 shrink-0" />
              <span>
                <span className="block text-sm font-bold leading-tight">{p.label}</span>
                <span className="mt-1 block text-xs opacity-80">{p.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* form */}
      <div ref={formRef} className="mt-6 scroll-mt-24 rounded-3xl border border-[#e7dcc7] bg-[#fbf8f1] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Agent ID *" placeholder="address, URL, or name" value={f.agentId} onChange={(v) => set("agentId", v)} />
          <Field label="Endpoint" placeholder="https://agent.example/mcp" value={f.endpoint} onChange={(v) => set("endpoint", v)} />
          <Field label="EVM address" placeholder="0x…" value={f.address} onChange={(v) => set("address", v)} />
          <Field label="ERC-8004 id" placeholder="on-chain agent id" value={f.erc8004Id} onChange={(v) => set("erc8004Id", v)} />
          <Field label="Domain" placeholder="agent.example" value={f.domain} onChange={(v) => set("domain", v)} />
          <Field label="Framework" placeholder="LangChain, AutoGen, MCP…" value={f.framework} onChange={(v) => set("framework", v)} />
          <Field label="Declared capabilities" placeholder="comma, separated, skills" value={f.capabilities} onChange={(v) => set("capabilities", v)} className="md:col-span-2" />
          <Field label="Deal context" placeholder="What is this agent about to do for you?" value={f.context} onChange={(v) => set("context", v)} className="md:col-span-2" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => run(f)}
            disabled={!canRun}
            className={`inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 ${
              activePreset && status === "idle" && !report
                ? "ring-4 ring-violet-300 ring-offset-2 ring-offset-[#fbf8f1]"
                : ""
            }`}
          >
            {status === "running" ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Verifying…
              </>
            ) : (
              <>
                <ShieldCheck size={17} /> Verify agent
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setF(EMPTY);
              setActivePreset("");
              setReport(null);
              setStatus("idle");
              setError("");
            }}
            disabled={status === "running"}
            className="rounded-xl border border-[#201810]/15 px-5 py-3 font-semibold text-[#201810]/70 transition-colors hover:bg-[#201810]/5 disabled:opacity-50"
          >
            Reset
          </button>
          <span className="text-xs text-[#201810]/45">
            {activePreset && status === "idle" && !report ? (
              <span className="font-semibold text-violet-700">
                Preset loaded — press Verify to run the trust check.
              </span>
            ) : (
              <>
                Free demo · same pipeline as the paid{" "}
                <span className="font-mono">verify_agent</span> MCP tool.
              </>
            )}
          </span>
        </div>
      </div>

      {/* results */}
      <div ref={resultsRef} className="mt-8 scroll-mt-28">
        {status === "running" && <RunningPipeline agentId={f.agentId} />}
        {status === "error" && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-red-700">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
        {status === "done" && report && <Results report={report} />}
      </div>

      {/* footer note */}
      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-[#e7dcc7] bg-[#efe8da]/50 px-6 py-6 text-center">
        <Gavel size={20} className="text-violet-600" />
        <p className="max-w-xl text-sm text-[#201810]/65">
          This is the same trust check an agent runs automatically over MCP before it transacts. Add
          it to your own agent in one line.
        </p>
        <p className="text-xs text-[#201810]/55">
          Paid calls settle on-chain via x402 —{" "}
          <a
            href="https://www.oklink.com/xlayer/tx/0x6f74549eecb4627509f6397db02b8397892c9893d869790006b258b6996cca86"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-800"
          >
            see a real settlement on X Layer &#8599;
          </a>
        </p>
        <a
          href="/docs"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700"
        >
          Install the skill <ArrowRight size={15} />
        </a>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#201810]/50">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e7dcc7] bg-white px-3.5 py-2.5 text-sm text-[#201810] outline-none transition-colors placeholder:text-[#201810]/30 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
      />
    </label>
  );
}
