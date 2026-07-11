"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart3,
  Star,
  Lock,
  Layers,
  Boxes,
  Cpu,
  Database,
  FileCheck2,
  Blocks,
  Server,
  ArrowRight,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import Hero3D from "@/components/Hero3D";

const PILLARS = [
  { icon: ShieldCheck, title: "Verify Capability", desc: "Prove what an agent can actually do — skills, benchmarks, identity." },
  { icon: BarChart3, title: "Score Risk", desc: "Real-time risk scoring and behavior analysis before you transact." },
  { icon: Star, title: "Build Reputation", desc: "On-chain, immutable reputation that follows the agent everywhere." },
  { icon: Lock, title: "Safe Transactions", desc: "Escrow, attestation, and disputes baked into every deal." },
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

const FRAMEWORKS = ["LangChain", "AutoGen", "CrewAI", "LlamaIndex", "Haystack", "Custom"];
const WORKS_WITH = ["OKX AI Marketplace", "Other AI Marketplaces", "DeFi & dApps", "Enterprises"];
const PARTNERS = ["0G Labs", "OKX Chain", "OpenClaw / Hermes", "x402 Protocol"];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05040a] text-white">
      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="EVIDIQ" width={34} height={34} className="rounded-md" />
          <span className="text-lg font-extrabold tracking-tight">EVIDIQ</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-white/75 md:flex">
          <a href="#stack" className="hover:text-white">Stack</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#partners" className="hover:text-white">Partners</a>
        </div>
        <a href="#how" className="rounded-lg bg-gradient-to-r from-violet-300 to-violet-500 px-4 py-2 text-sm font-bold text-[#1a0b2e]">
          Get a Trust Score
        </a>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0"><Hero3D /></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_50%,rgba(5,4,10,0.9),rgba(5,4,10,0.35)_55%,transparent)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-violet-200">
              <ShieldCheck size={14} /> Trust Layer · AI Agent Economy
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              Verify. Score. Trust.
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Before every AI transaction.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              EVIDIQ is the universal trust layer that verifies AI agents&apos; capabilities, tracks
              performance, and builds on-chain reputation — so users and agents can transact with confidence.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-violet-500 px-6 py-3.5 font-bold text-[#1a0b2e]">
                Build a trusted agent <ArrowRight size={18} />
              </a>
              <a href="#stack" className="rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white/90 hover:bg-white/5">
                Explore the stack
              </a>
            </div>
          </Reveal>

          <div className="mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.2 + i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <p.icon className="text-violet-300" size={22} />
                  <div className="mt-3 text-sm font-bold">{p.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/60">{p.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10">
        <Reveal>
          <h2 className="text-center text-4xl font-extrabold tracking-tight md:text-5xl">
            One stack. Seven layers of trust.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
            From secure compute and on-chain settlement to attestation, scoring, and the developer
            surface — every layer works together to make agents verifiable.
          </p>
        </Reveal>
        <div className="mt-14 space-y-3">
          {LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 0.04}>
              <div className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-violet-500/40 hover:bg-violet-500/[0.05] md:flex-row md:items-center">
                <div className="flex items-center gap-4 md:w-72 md:shrink-0">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/10 text-lg font-extrabold text-violet-200">
                    {l.n}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      <l.icon size={16} className="text-violet-300" /> {l.name}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/45">{l.sub}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {l.items.map((it) => (
                    <span key={it} className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/75">
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
          <h2 className="text-center text-4xl font-extrabold tracking-tight md:text-5xl">
            How to build a trusted agent
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
            Six steps from any framework to a verifiable, discoverable agent ready for the economy.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-violet-500/40 bg-violet-500/10 text-sm font-bold text-violet-200">
                  {i + 1}
                </div>
                <div className="font-bold">{s.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/60">{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-6 py-5 text-center">
            <CheckCircle2 className="text-emerald-400" size={22} />
            <p className="text-sm text-white/80">
              <span className="font-bold text-white">Result: a Trusted Agent.</span> Verifiable, discoverable, and
              ready for the AI Agent Economy.
            </p>
          </div>
        </Reveal>
      </section>

      {/* FRAMEWORKS + WORKS WITH + PARTNERS */}
      <section id="partners" className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Supported frameworks", items: FRAMEWORKS, icon: Cpu },
            { title: "Works with", items: WORKS_WITH, icon: Boxes },
            { title: "Technology partners", items: PARTNERS, icon: Blocks },
          ].map((col, i) => (
            <Reveal key={col.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                  <col.icon size={15} className="text-violet-300" /> {col.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {col.items.map((it) => (
                    <span key={it} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/85">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILL / CTA */}
      <section className="relative mx-auto max-w-6xl px-6 pb-28 md:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-transparent p-8 md:p-12">
            <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">Give your agent the trust skill.</h3>
            <p className="mt-3 max-w-xl text-white/70">
              One open skill your agent installs to verify counterparties, score risk, and settle disputes.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm text-cyan-200">
              <Terminal size={16} className="text-violet-300" />
              curl -s https://evidiq.dev/skill.md
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/50 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="EVIDIQ" width={22} height={22} className="rounded" />
            <span>EVIDIQ — make every AI agent verifiable, trustworthy, and accountable.</span>
          </div>
          <div>© {new Date().getFullYear()} EVIDIQ</div>
        </div>
      </footer>
    </main>
  );
}
