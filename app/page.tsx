"use client";

import { motion } from "framer-motion";
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
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

const CARD = "rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1]";
const CHIP = "rounded-lg border border-[#e7dcc7] bg-white/70 text-[#201810]/75";

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
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#201810]">
        {/* HERO */}
      <section className="relative flex min-h-screen items-center pt-24">
        <div className="absolute inset-0"><Hero3D /></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_50%,rgba(244,239,228,0.96),rgba(244,239,228,0.55)_55%,transparent)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100/70 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-violet-700">
              <ShieldCheck size={14} /> Trust Layer · AI Agent Economy
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight text-[#1a130a] md:text-7xl">
              Verify. Score. Trust.
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                Before every AI transaction.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-[#201810]/70">
              EVIDIQ is the universal trust layer that verifies AI agents&apos; capabilities, tracks
              performance, and builds on-chain reputation — so users and agents can transact with confidence.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-violet-700">
                Build a trusted agent <ArrowRight size={18} />
              </a>
              <a href="#stack" className="rounded-xl border border-[#201810]/20 px-6 py-3.5 font-semibold text-[#201810] hover:bg-[#201810]/5">
                Explore the stack
              </a>
            </div>
          </Reveal>

          <div className="mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.2 + i * 0.06}>
                <div className={`h-full ${CARD} p-4`}>
                  <p.icon className="text-violet-600" size={22} />
                  <div className="mt-3 text-sm font-bold text-[#1a130a]">{p.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[#201810]/60">{p.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
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

      {/* FRAMEWORKS + WORKS WITH + PARTNERS */}
      <section id="partners" className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Supported frameworks", items: FRAMEWORKS, icon: Cpu },
            { title: "Works with", items: WORKS_WITH, icon: Boxes },
            { title: "Technology partners", items: PARTNERS, icon: Blocks },
          ].map((col, i) => (
            <Reveal key={col.title} delay={i * 0.06}>
              <div className={`h-full ${CARD} p-6`}>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#201810]/50">
                  <col.icon size={15} className="text-violet-600" /> {col.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {col.items.map((it) => (
                    <span key={it} className={`${CHIP} px-3 py-2 text-sm`}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILL / CTA — dark contrast block */}
      <section className="relative mx-auto max-w-6xl px-6 pb-28 md:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-[#2b2140] bg-[#171021] p-8 md:p-12">
            <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Give your agent the trust skill.</h3>
            <p className="mt-3 max-w-xl text-white/70">
              One open skill your agent installs to verify counterparties, score risk, and settle disputes.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-cyan-300">
              <Terminal size={16} className="text-violet-300" />
              curl -s https://evidiq.dev/skill.md
            </div>
          </div>
        </Reveal>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
