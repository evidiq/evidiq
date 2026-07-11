# EVIDIQ — The Trust Layer for the AI Agent Economy

> Verify capability. Score risk. Build on-chain reputation. **Before every AI transaction.**

EVIDIQ is a universal trust layer for AI agents. It verifies what an agent can
do, tracks how it performs, and records an immutable on-chain reputation — so
users and agents can transact with confidence. Built for the **OKX AI Genesis
Hackathon** (Agent Service Provider track).

## The stack (7 layers)

| # | Layer | Highlights |
|---|-------|-----------|
| 7 | Application | Dashboard, Agent Explorer, Reputation Marketplace, Developer Portal |
| 6 | Trust API & SDK | REST, GraphQL, TypeScript SDK, Python SDK, Webhooks |
| 5 | Agent Services | Identity, Capability, Performance, Risk, Reputation |
| 4 | Data & Intelligence | Evidence Collector, AI Evaluation, Behavior Analyzer, Trust Scoring, Knowledge Graph |
| 3 | Verification & Proof | Attestation (TEE / ZK), ZK Proofs, Proof Registry, Audit Trail |
| 2 | Blockchain & Settlement | 0G Storage, x402, OKX Chain, Smart Contracts, On-chain Reputation |
| 1 | Infrastructure | Secure Compute (TEE), Decentralized Network, IPFS / 0G Storage, Monitoring |

## Tech

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** · **three.js** (3D hero) · **Framer Motion** · **Lucide**
- **0G** storage + compute + TEE · **x402** payments · **OKX** ASP listing

## Getting started

```bash
cp .env.example .env.local   # fill in secrets (never commit .env.local)
npm install
npm run dev                  # http://localhost:3000
```

## Environment

See `.env.example`. Secrets (`.env.local`) are **git-ignored** — GitHub token,
`OG_PRIVATE_KEY` (0G storage/compute/TEE), and Cloudflare IDs live there only.

## For agents

EVIDIQ ships an open Agent Skill and a remote MCP server:

```bash
curl -s https://evidiq.dev/skill.md   # install the trust skill
```

## License

Private — hackathon build.
