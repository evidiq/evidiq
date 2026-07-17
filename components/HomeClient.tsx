"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  Star,
  Lock,
  Layers,
  Boxes,
  Database,
  FileCheck2,
  Blocks,
  Server,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  Play,
} from "lucide-react";
import Hero3D from "@/components/Hero3D";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LogoMarquee from "@/components/LogoMarquee";
import PartnersGrid from "@/components/PartnersGrid";
import Link from "next/link";
import { formatDate } from "@/lib/blog";
import { SOCIALS } from "@/lib/site";

const PILLARS = [
  { icon: ShieldCheck, title: "Verify Capability", desc: "Prove what an agent can actually do — skills, benchmarks, identity." },
  { icon: BarChart3, title: "Score Risk", desc: "Real-time risk scoring and behavior analysis before you transact." },
  { icon: Star, title: "Build Reputation", desc: "On-chain, immutable reputation that follows the agent everywhere." },
  { icon: Lock, title: "Safe Transactions", desc: "Escrow, attestation, and disputes baked into every deal." },
];

const MISSING = [
  { icon: FileCheck2, title: "Proof, not promises", desc: "Every Trust Report is backed by a TEE-verified evaluation and anchored on 0G — anyone can check it, no one can fake it." },
  { icon: BarChart3, title: "Portable reputation", desc: "Scores and history follow the agent across apps and chains, so a good track record compounds instead of resetting to zero." },
  { icon: ShieldCheck, title: "Accountable by default", desc: "Identity, capability, and risk are settled up front — before value moves — not argued about after a deal has already broken." },
];

type Layer = { n: number; name: string; sub: string; icon: typeof Layers; items: string[] };
const LAYERS: Layer[] = [
  { n: 7, name: "Application Layer", sub: "Interfaces & Apps", icon: Layers, items: ["Dashboard", "Agent Explorer", "Reputation Marketplace", "Developer Portal"] },
  { n: 6, name: "Trust API & SDK", sub: "Integration Layer", icon: Boxes, items: ["REST APIs", "GraphQL", "TypeScript SDK", "Python SDK", "Webhooks"] },
  { n: 5, name: "Agent Services", sub: "Core Services", icon: ShieldCheck, items: ["Identity Verification", "Capability Verification", "Performance Tracking", "Risk Assessment", "Reputation Engine"] },
  { n: 4, name: "Data & Intelligence", sub: "Intelligence Engine", icon: Database, items: ["Evidence Collector", "AI Evaluation Engine", "Behavior Analyzer", "Trust Scoring Model", "Knowledge Graph"] },
  { n: 3, name: "Verification & Proof", sub: "Trust Infrastructure", icon: FileCheck2, items: ["Attestation (TEE / ZK)", "Zero-Knowledge Proofs", "Proof Registry", "Audit Trail"] },
  { n: 2, name: "Blockchain & Settlement", sub: "Settlement & Storage", icon: Blocks, items: ["0G Storage", "x402 Protocol", "OKX Chain", "Smart Contracts", "On-chain Reputation"] },
  { n: 1, name: "Infrastructure", sub: "Compute & Network", icon: Server, items: ["Secure Compute (TEE)", "Decentralized Network", "IPFS / 0G Storage", "Monitoring & Logging"] },
];

const STEPS = [
  { t: "Build your agent", d: "Any framework — AutoGen, LangChain, CrewAI, or custom." },
  { t: "Integrate the SDK", d: "Connect the EVIDIQ SDK for verification, scoring, and reputation." },
  { t: "Submit for verification", d: "EVIDIQ runs capability tests, security checks, and identity proofs." },
  { t: "Get a Trust Score", d: "Your agent receives a Trust Score and a detailed capability report." },
  { t: "Go live & transact", d: "Start transacting with users and agents through the trust layer." },
  { t: "Build reputation", d: "Performance is tracked, reputation grows, opportunities expand." },
];

const CARD = "rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1]";
const CHIP = "rounded-lg border border-[#e7dcc7] bg-white/70 text-[#201810]/75";

// EVIDIQ demo video (YouTube) — surfaced above the hero skill-install card.
const DEMO_VIDEO_URL = "https://youtu.be/CRLUXSuRKQk";

function Reveal({
  children,
  delay = 0,
  onMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  onMount?: boolean;
}) {
  // Above-the-fold content (hero) should animate on mount; everything else
  // animates when scrolled into view.
  const trigger = onMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      {...trigger}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Dark terminal card with the one-line skill install command + copy button. */
function InstallSkill() {
  const [copied, setCopied] = useState(false);
  const cmd = "curl -s https://evidiq.dev/skill.md";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#2b2140] bg-[#171021] shadow-xl shadow-violet-950/20">
      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/45">
          <Terminal size={11} /> install the EVIDIQ trust skill
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <code className="overflow-x-auto font-mono text-[13px] text-cyan-300">
          <span className="select-none text-violet-300/70">$ </span>
          {cmd}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>
      <div className="border-t border-white/10 px-3.5 py-2 text-[11px] text-white/45">
        Paste into Claude, Cursor, or any MCP client — installs the skill to verify, score &amp; settle.
      </div>
    </div>
  );
}

/** Facade YouTube embed — shows the thumbnail + a play button, and only loads the
    (heavy) YouTube iframe on click, so the hero stays fast. */
function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  const id = "CRLUXSuRKQk";

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2b2140] bg-[#120c1c] shadow-2xl shadow-violet-950/30">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title="EVIDIQ — live agent trust check demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play the EVIDIQ demo"
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt="EVIDIQ demo — a live agent trust check"
            className="absolute inset-0 h-full w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-2xl transition-transform group-hover:scale-110">
            <Play size={26} className="translate-x-[2px] text-violet-700" fill="currentColor" />
          </span>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live demo — verify before you pay
          </span>
        </button>
      )}
    </div>
  );
}

/** Closing CTA — dark card with the skill terminal (violet accents). */
function SkillCTA() {
  const [copied, setCopied] = useState(false);
  const cmd = "curl -s https://evidiq.dev/skill.md";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2b2140] bg-[#120c1c] px-6 py-14 md:px-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">
          Payments move value. EVIDIQ makes agents{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            trustworthy
          </span>
          .
        </h3>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
          An open skill for verifiable AI agents
        </p>

        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">
            <span>skill.md</span>
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-violet-300"
            >
              View on GitHub <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <code className="overflow-x-auto font-mono text-sm text-cyan-300 md:text-[15px]">
              <span className="select-none text-violet-400">$ </span>
              {cmd}
            </code>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy install command"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check size={13} /> Copied
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/30">For your agent</span>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-violet-700"
            >
              Get a Trust Score <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export type BlogCardData = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tag: string;
  excerpt: string;
  image: string | null;
};

export type DocCardData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeTone: "live" | "review" | "soon";
  toolCount: number;
  paidCount: number;
  freeCount: number;
  href: string;
  image: string;
};

export default function HomeClient({
  blogCards,
  docCards,
}: {
  blogCards: BlogCardData[];
  docCards: DocCardData[];
}) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#201810]">
        {/* HERO */}
      <section className="relative flex min-h-[74vh] flex-col justify-center pb-10 pt-24">
        <div className="absolute inset-0"><Hero3D /></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_50%,rgba(244,239,228,0.96),rgba(244,239,228,0.55)_55%,transparent)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* LEFT — message + skill install + CTAs */}
          <div>
            <Reveal onMount>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100/70 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-violet-700">
                <ShieldCheck size={14} /> The trust check for agent payments
              </span>
            </Reveal>
            <Reveal onMount delay={0.05}>
              <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-[#1a130a] sm:text-4xl lg:text-[2.5rem]">
                The Trust &amp; Safety Layer
                <br />
                for the{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                  AI-Agent Economy
                </span>
              </h1>
            </Reveal>
            <Reveal onMount delay={0.15}>
              <div className="mt-8">
                <InstallSkill />
              </div>
            </Reveal>
            <Reveal onMount delay={0.2}>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="/playground" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-violet-700">
                  See a live trust check <ArrowRight size={18} />
                </a>
                <a href="#how" className="rounded-xl border border-[#201810]/20 px-6 py-3.5 font-semibold text-[#201810] hover:bg-[#201810]/5">
                  How it works
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — the demo video, vertically centered against the message */}
          <Reveal onMount delay={0.12}>
            <div className="flex flex-col gap-3">
              <DemoVideo />
              <a
                href={DEMO_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-end text-xs font-semibold text-[#201810]/55 transition-colors hover:text-violet-700"
              >
                Watch on YouTube <ArrowUpRight size={13} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <LogoMarquee />

      {/* VALUE PILLARS */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className={`h-full ${CARD} p-5`}>
                <p.icon className="text-violet-600" size={22} />
                <div className="mt-3 text-sm font-bold text-[#1a130a]">{p.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-[#201810]/60">{p.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROBLEM — narrative */}
      <section className="relative mx-auto max-w-4xl px-6 pt-28 md:px-10">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
            The problem
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight text-[#1a130a] md:text-5xl">
            Agents can transact. They can&apos;t yet <span className="text-violet-600">trust</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mx-auto mt-8 max-w-2xl space-y-5 text-center text-lg leading-relaxed text-[#201810]/70">
            <p>
              AI agents are starting to hire, pay, and negotiate with one another — with no human in
              the loop. What they still lack is a way to know who they&apos;re dealing with.
            </p>
            <p>
              The building blocks exist — identity, payments, compute, storage — but they&apos;re
              fragmented, and each one is built for the happy path. When a deal goes wrong, every layer
              passes the problem down the line.{" "}
              <span className="font-semibold text-[#1a130a]">
                EVIDIQ is the layer that answers one question first: can this agent be trusted?
              </span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* STACK */}
      <section id="stack" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10">
        <Reveal>
          <h2 className="text-center text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
            One stack. Seven layers of trust.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#201810]/65">
            From secure compute and on-chain settlement to attestation, scoring, and the developer
            surface — every layer works together to make agents verifiable.
          </p>
        </Reveal>
        <div className="mt-14 space-y-3">
          {LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 0.04}>
              <div className="group flex flex-col gap-4 rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-5 transition-colors hover:border-violet-300 hover:bg-violet-50/60 md:flex-row md:items-center">
                <div className="flex items-center gap-4 md:w-72 md:shrink-0">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-200 to-fuchsia-100 text-lg font-extrabold text-violet-700">
                    {l.n}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[#1a130a]">
                      <l.icon size={16} className="text-violet-600" /> {l.name}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-[#201810]/45">{l.sub}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {l.items.map((it) => (
                    <span key={it} className={`${CHIP} px-3 py-1.5 text-xs`}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <Reveal>
          <h2 className="text-center text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
            How to build a trusted agent
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#201810]/65">
            Six steps from any framework to a verifiable, discoverable agent ready for the economy.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <div className={`h-full ${CARD} p-6`}>
                <div className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-violet-300 bg-violet-100 text-sm font-bold text-violet-700">
                  {i + 1}
                </div>
                <div className="font-bold text-[#1a130a]">{s.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-[#201810]/60">{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-100/50 px-6 py-5 text-center">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <p className="text-sm text-[#201810]/80">
              <span className="font-bold text-[#1a130a]">Result: a Trusted Agent.</span> Verifiable, discoverable, and
              ready for the AI Agent Economy.
            </p>
          </div>
        </Reveal>
      </section>

      {/* THE MISSING LAYER */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="overflow-hidden rounded-3xl border border-[#e7dcc7] bg-[#efe8da]/60 p-8 md:p-14">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
              The goal
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#1a130a] md:text-5xl">
              Trust is the <span className="text-violet-600">missing layer</span> of the agent economy.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#201810]/70">
              Payments let agents transact. Verifiable trust makes them accountable — and
              accountability is what turns isolated transactions into a real economy.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {MISSING.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-[#e7dcc7] bg-white/70 p-6">
                  <m.icon className="text-violet-600" size={22} />
                  <div className="mt-3 font-bold text-[#1a130a]">{m.title}</div>
                  <div className="mt-1.5 text-sm leading-relaxed text-[#201810]/60">{m.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PartnersGrid />

      {/* PRODUCT DOCS — 3-card strip (same card size as Dispatches) */}
      {docCards.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-4 md:px-10">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
                  Documentation
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a130a] md:text-4xl">
                  MCP products
                </h2>
              </div>
              <Link
                href="/docs"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#201810]/20 px-4 py-2 text-sm font-semibold text-[#201810] transition-colors hover:bg-[#201810]/5"
              >
                All docs <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {docCards.slice(0, 3).map((doc, i) => {
              const tone =
                doc.badgeTone === "live"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : doc.badgeTone === "review"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";
              return (
                <Reveal key={doc.slug} delay={i * 0.05}>
                  <Link
                    href={doc.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
                  >
                    <div className="relative h-36 overflow-hidden bg-[#efe6d2]">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${tone}`}>
                        {doc.badge}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-bold leading-snug text-[#1a130a] transition-colors group-hover:text-violet-700">
                        {doc.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-violet-700">{doc.tagline}</p>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#201810]/65">
                        {doc.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#201810]/45">
                        <span>{doc.toolCount} tools</span>
                        <span>·</span>
                        <span>{doc.paidCount} paid</span>
                        <span>·</span>
                        <span>{doc.freeCount} free</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* DISPATCHES / BLOG — 6-card grid */}
      {blogCards.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-6 pb-16 md:px-10">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
                  Dispatches
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a130a] md:text-4xl">
                  Latest from EVIDIQ
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#201810]/20 px-4 py-2 text-sm font-semibold text-[#201810] transition-colors hover:bg-[#201810]/5"
              >
                All posts <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogCards.slice(0, 3).map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] transition-colors hover:border-violet-300 hover:bg-violet-50/40"
                >
                  <div className="relative h-36 overflow-hidden bg-[#efe6d2]">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- generated images are served by app/blog-img/, outside next/image's static pipeline
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShieldCheck className="text-violet-400/60" size={36} />
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-violet-200 backdrop-blur-sm">
                      {post.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#1a130a] transition-colors group-hover:text-violet-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#201810]/65">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#201810]/45">
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* SKILL / CTA — dark block */}
      <section className="relative mx-auto max-w-6xl px-6 pb-28 md:px-10">
        <Reveal>
          <SkillCTA />
        </Reveal>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
