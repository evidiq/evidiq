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
} from "lucide-react";
import Hero3D from "@/components/Hero3D";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LogoMarquee from "@/components/LogoMarquee";
import PartnersGrid from "@/components/PartnersGrid";
import Link from "next/link";
import { POSTS, formatDate } from "@/lib/blog";
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
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#2b2140] bg-[#171021] shadow-2xl shadow-violet-950/20">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/45">
          <Terminal size={12} /> install the EVIDIQ trust skill
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <code className="overflow-x-auto font-mono text-sm text-cyan-300 md:text-[15px]">
          <span className="select-none text-violet-300/70">$ </span>
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
      <div className="border-t border-white/10 px-4 py-2.5 text-xs text-white/45">
        Paste into Claude, Cursor, or any MCP client — your agent installs the skill to verify, score &amp; settle.
      </div>
    </div>
  );
}

/** Closing CTA — internetcourt.org-style dark card with the skill terminal (violet accents). */
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#201810]">
        {/* HERO */}
      <section className="relative min-h-[74vh] pb-6 pt-24">
        <div className="absolute inset-0"><Hero3D /></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_50%,rgba(244,239,228,0.96),rgba(244,239,228,0.55)_55%,transparent)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* LEFT — message */}
          <div>
            <Reveal onMount>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100/70 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-violet-700">
                <ShieldCheck size={14} /> Trust Layer · AI Agent Economy
              </span>
            </Reveal>
            <Reveal onMount delay={0.05}>
              <h1 className="text-4xl font-extrabold leading-[1.03] tracking-tight text-[#1a130a] sm:text-5xl lg:text-6xl">
                Verify. Score. Trust.
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                  Before every AI transaction.
                </span>
              </h1>
            </Reveal>
            <Reveal onMount delay={0.1}>
              <p className="mt-6 max-w-lg text-lg text-[#201810]/70">
                EVIDIQ is the universal trust layer that verifies AI agents&apos; capabilities, tracks
                performance, and builds on-chain reputation — so users and agents can transact with confidence.
              </p>
            </Reveal>
          </div>

          {/* RIGHT — install terminal + CTAs (float over the trust-network globe) */}
          <Reveal onMount delay={0.12}>
            <div className="flex flex-col gap-5">
              <InstallSkill />
              <div className="flex flex-wrap items-center gap-3">
                <a href="#how" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-violet-700">
                  Build a trusted agent <ArrowRight size={18} />
                </a>
                <a href="#stack" className="rounded-xl border border-[#201810]/20 px-6 py-3.5 font-semibold text-[#201810] hover:bg-[#201810]/5">
                  Explore the stack
                </a>
              </div>
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

      {/* DISPATCHES / BLOG */}
      {POSTS.length > 0 && (
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
          <Reveal delay={0.06}>
            <Link
              href={`/blog/${POSTS[0].slug}`}
              className="group grid gap-6 overflow-hidden rounded-3xl border border-[#e7dcc7] bg-[#fbf8f1] p-6 transition-colors hover:border-violet-300 hover:bg-violet-50/40 md:grid-cols-[1.5fr_1fr] md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-violet-700">
                  <span>{POSTS[0].tag}</span>
                  <span className="text-[#201810]/30">·</span>
                  <span className="text-[#201810]/45">
                    {formatDate(POSTS[0].date)} · {POSTS[0].readingTime}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-extrabold leading-tight text-[#1a130a] transition-colors group-hover:text-violet-700 md:text-3xl">
                  {POSTS[0].title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-[#201810]/65">{POSTS[0].excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-violet-700">
                  Read the post <ArrowRight size={16} />
                </span>
              </div>
              <div className="relative hidden overflow-hidden rounded-2xl border border-[#e7dcc7] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50 md:block">
                <div className="absolute inset-0 grid place-items-center">
                  <ShieldCheck className="text-violet-500/60" size={80} />
                </div>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* SKILL / CTA — internetcourt-style dark block */}
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
