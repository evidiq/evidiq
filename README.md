<p align="center">
  <img src="https://raw.githubusercontent.com/evidiq/evidiq/main/assets/evidiq.png" width="88" alt="EVIDIQ" />
</p>

<h1 align="center">EVIDIQ</h1>

<p align="center"><strong>The trust layer for the AI agent economy.</strong></p>

<p align="center">
  Verify capability &middot; Score risk &middot; Prove reputation — before value moves between agents.
</p>

<p align="center">
  <a href="https://evidiq.dev">evidiq.dev</a> &middot;
  <a href="https://evidiq.dev/skill.md">Agent Skill</a> &middot;
  <a href="https://evidiq.dev/mcp">Core MCP</a> &middot;
  <a href="#evidiq-mcp-suite">MCP Suite</a>
</p>

<p align="center">
  <a href="https://glama.ai/mcp/servers/evidiq/mcp"><img src="https://glama.ai/mcp/servers/evidiq/mcp/badges/score.svg" alt="Glama score" /></a> <a href="https://evidiq.dev/mcp"><img src="https://img.shields.io/badge/MCP%20Server-Verified-6E56CF?style=flat-square" alt="MCP Server" /></a> <a href="https://0g.ai"><img src="https://img.shields.io/badge/0G-TEE%20%2B%20Storage-00C2A8?style=flat-square" alt="0G TEE + Storage" /></a> <a href="https://www.oklink.com/xlayer"><img src="https://img.shields.io/badge/X%20Layer-Live-3CCF4E?style=flat-square" alt="X Layer" /></a> <a href="https://evidiq.dev/x402"><img src="https://img.shields.io/badge/x402-pay--per--call-2563EB?style=flat-square" alt="x402" /></a> <a href="https://www.okx.ai/agents/5232"><img src="https://img.shields.io/badge/OKX.AI-Agent%20%235232%20Listed-121212?style=flat-square&logo=okx&logoColor=white" alt="OKX.AI Agent 5232 listed" /></a> <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-3DA639?style=flat-square" alt="License: MIT" /></a>
</p>

---

Autonomous agents can already discover each other, negotiate, and pay. What they
still lack is a way to know whether a counterparty they have never met can be
trusted. **EVIDIQ is the verification and reputation layer that answers that
question** — delivered as an open Agent Skill and a remote MCP server, billed
per call.

## What EVIDIQ does

Before an agent transacts with, delegates to, or relies on another agent or a
paid service, EVIDIQ returns a **Trust Report**:

- **Verify** — prove what an agent can actually do (capability + identity).
- **Score** — quantify how risky the interaction is right now (0–100 and a tier).
- **Trust** — record and prove standing (on-chain reputation + a signed attestation).

Every paid verdict is anchored on 0G Storage and cryptographically signed, so it
stays auditable and tamper-evident long after the deal closes.

## Use it from any agent

```bash
# Read the open skill
curl -s https://evidiq.dev/skill.md

# Or connect the remote MCP server (Claude Code)
claude mcp add --transport http evidiq https://evidiq.dev/mcp
```

`how_to_install` and `get_evidiq_skill` are free. `verify_agent` — the trust
check itself — is **pay-per-call over [x402](https://evidiq.dev/x402)**:
unauthenticated requests receive an HTTP 402 challenge; sign it and retry.

## EVIDIQ MCP Suite

This repository is the public hub for the EVIDIQ product family: seventeen MCP
services — sixteen live on OKX.AI, and Cadence, the newest, under review. Core
is served from this repository; the sixteen specialists are independently
deployed and keep their source in their own repositories, while this directory
is the single place to discover every EVIDIQ MCP.

| Service | Use it for | Remote MCP endpoint | Access |
|---------|------------|---------------------|--------|
| [**EVIDIQ Core**](https://evidiq.dev/docs/evidiq) | Verify an agent's capability, identity, risk, and reputation before value moves. | [`evidiq.dev/mcp`](https://evidiq.dev/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 discovery/verification tools are free. Live on OKX.AI as Agent #5232. |
| [**EVIDIQ Notary**](https://github.com/evidiq/evidiq-notary-mcp)<br/>[Docs](https://evidiq.dev/docs/notary) | Create cryptographic, signed, 0G-anchored receipts for AI outputs. | [`mcp.evidiq.dev/notary/mcp`](https://mcp.evidiq.dev/notary/mcp) | 2 paid tools — `0.001` / `0.005 USDT0`; 4 verification tools are free. Live on OKX.AI as Agent #6278. |
| [**EVIDIQ Operator**](https://github.com/evidiq/evidiq-operator)<br/>[Docs](https://evidiq.dev/docs/operator) | Give autonomous agents isolated browser and computer-use execution. | [`mcp.evidiq.dev/operator/mcp`](https://mcp.evidiq.dev/operator/mcp) | 7 browser tools — `0.02 USDT0` each; 4 discovery tools are free. Live on OKX.AI as Agent #6504. |
| [**EVIDIQ Sentinel**](https://github.com/evidiq/evidiq-sentinel-mcp)<br/>[Docs](https://evidiq.dev/docs/sentinel) | Security-preflight MCP endpoints, manifests, Agent Skills, and bundles before connection or payment. | [`mcp.evidiq.dev/sentinel/mcp`](https://mcp.evidiq.dev/sentinel/mcp) | 4 scan tools — `0.02 USDT0` each; 4 preflight/verification tools are free. Live on OKX.AI as Agent #7584. |
| [**EVIDIQ Atlas**](https://github.com/evidiq/evidiq-atlas-mcp)<br/>[Docs](https://evidiq.dev/docs/atlas) | Profile, query, visualize, compare, and research bounded datasets with reproducible reports. | [`mcp.evidiq.dev/atlas/mcp`](https://mcp.evidiq.dev/atlas/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9023. |
| [**EVIDIQ Lineage**](https://github.com/evidiq/evidiq-lineage-mcp)<br/>[Docs](https://evidiq.dev/docs/lineage) | Verify that a dependency is real, safe, and license-clean before an agent installs it; emit signed SBOM and AI-BOM inventories. | [`mcp.evidiq.dev/lineage/mcp`](https://mcp.evidiq.dev/lineage/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9575. |
| [**EVIDIQ Vault**](https://github.com/evidiq/evidiq-vault-mcp)<br/>[Docs](https://evidiq.dev/docs/vault) | Record what an agent did in append-only, hash-chained memory; audit continuity, seal Merkle segments to 0G, and enforce retention. | [`mcp.evidiq.dev/vault/mcp`](https://mcp.evidiq.dev/vault/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9622, with paid calls proven on X Layer. |
| [**EVIDIQ Redact**](https://github.com/evidiq/evidiq-redact-mcp)<br/>[Docs](https://evidiq.dev/docs/redact) | Detect and remove PII, credentials, and keys from text, documents, and datasets before an agent sends them anywhere — checksum-validated, with a signed report and zero retention. | [`mcp.evidiq.dev/redact/mcp`](https://mcp.evidiq.dev/redact/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9700. |
| [**EVIDIQ Warden**](https://github.com/evidiq/evidiq-warden-mcp)<br/>[Docs](https://evidiq.dev/docs/warden) | Review code an agent wrote before it ships: injection, secrets, unsafe patterns, complexity, and policy verdicts, with a signed attestation. | [`mcp.evidiq.dev/warden/mcp`](https://mcp.evidiq.dev/warden/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9699. |
| [**EVIDIQ Assay**](https://github.com/evidiq/evidiq-assay-mcp)<br/>[Docs](https://evidiq.dev/docs/assay) | Read a transaction before signing it: decode calldata and EIP-712 into plain-language intent, unwrap multicall, assess allowances, simulate, and screen the counterparty. | [`mcp.evidiq.dev/assay/mcp`](https://mcp.evidiq.dev/assay/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9727. |
| [**EVIDIQ Rubric**](https://github.com/evidiq/evidiq-rubric-mcp)<br/>[Docs](https://evidiq.dev/docs/rubric) | Decide whether a deliverable meets the contract it was paid for: schema conformance, grounding in supplied sources, and acceptance criteria, with a signed verdict. | [`mcp.evidiq.dev/rubric/mcp`](https://mcp.evidiq.dev/rubric/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #9848, with paid calls proven on X Layer. |
| [**EVIDIQ Bastion**](https://github.com/evidiq/evidiq-bastion-mcp)<br/>[Docs](https://evidiq.dev/docs/bastion) | Audit deployment configurations (Dockerfiles, CI workflows, Kubernetes manifests, and IaC) for non-root, privilege, secret protection, supply chain integrity, and resource bounds. | [`mcp.evidiq.dev/bastion/mcp`](https://mcp.evidiq.dev/bastion/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #10359, with paid calls proven on X Layer. |
| [**EVIDIQ Aegis**](https://github.com/evidiq/evidiq-aegis-mcp)<br/>[Docs](https://evidiq.dev/docs/aegis) | Hold an agent's spending to a policy: budget velocity caps, escrow release validation, and fee surge protection before a transfer is signed. | [`mcp.evidiq.dev/aegis/mcp`](https://mcp.evidiq.dev/aegis/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #10367. |
| [**EVIDIQ Circuit**](https://github.com/evidiq/evidiq-circuit-mcp)<br/>[Docs](https://evidiq.dev/docs/circuit) | Keep an agent's outbound API calls honest: endpoint and TLS compliance, payload schema drift, circuit breaker state, and webhook signature verification. | [`mcp.evidiq.dev/circuit/mcp`](https://mcp.evidiq.dev/circuit/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #10377. |
| [**EVIDIQ Bulwark**](https://github.com/evidiq/evidiq-bulwark-mcp)<br/>[Docs](https://evidiq.dev/docs/bulwark) | Screen text before it reaches a model: direct and indirect prompt injection, jailbreak techniques, data exfiltration payloads, and system-prompt leak probes. | [`mcp.evidiq.dev/bulwark/mcp`](https://mcp.evidiq.dev/bulwark/mcp) | 5 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #10385. |
| [**EVIDIQ Methodology**](https://github.com/evidiq/evidiq-methodology-mcp)<br/>[Docs](https://evidiq.dev/docs/methodology) | Check an MCP service against the practices this fleet learned the hard way: git history secret scan, x402 challenge compliance, OKX listing status, and a production readiness score. | [`mcp.evidiq.dev/methodology/mcp`](https://mcp.evidiq.dev/methodology/mcp) | 10 paid tools — `0.005`–`0.03 USDT0`; 5 preflight/verification tools are free. Live on OKX.AI as Agent #10389. |
| [**EVIDIQ Cadence**](https://github.com/evidiq/evidiq-cadence-mcp)<br/>[Docs](https://evidiq.dev/docs/cadence) | Give agents a future: schedule one-shot, recurring, retry, expiration, and standing-monitor jobs that fire after the response ends, with EIP-191 receipts and 0G-anchored attestations. | [`mcp.evidiq.dev/cadence/mcp`](https://mcp.evidiq.dev/cadence/mcp) | 10 paid tools — `0.005`–`0.03 USDT0`; 8 discovery/verification tools are free. OKX.AI Agent #10405 is under review. |

All paid tools use x402 v2 with USDT0 on X Layer. Read a service's `/x402`
endpoint before payment for its live pricing and payment requirements.

## Architecture

```
agent (any MCP client)
  │  tools/call verify_agent
  ▼
Traefik ─ evidiq.dev/mcp ─ Next.js route handler (app/[transport]/route.ts)
  │
  ├─ lib/x402/gate.ts ......... payment gate: challenge, decode, verify, settle
  │     └─ lib/x402/okx.ts .... official OKX SDK → OKX facilitator → X Layer
  │
  ├─ lib/verify/ .............. identity, capability, reputation, risk scoring
  │     └─ deterministic rules decide the score and the verdict
  │
  ├─ lib/ai/ .................. GLM-5.2 in a 0G TEE, advisory only, never scoring
  │
  └─ lib/og/ .................. report digest anchored to 0G Storage
        └─ EIP-191 signature over the canonical report
```

The gate runs before the tool. Payment settles first, so a free tool never touches
it and a paid tool never runs unpaid. The resource URL in the challenge comes from
configuration rather than the request, because a proxy that rewrites paths would
otherwise make one service advertise another's endpoint as the thing being paid for.

Scoring is deterministic by construction: the same input yields the same score,
tier, findings and digest. The model in `lib/ai/` adds narrative context that is
included in the report and excluded from the verdict — it can never turn a
DO-NOT-PROCEED into a PROCEED.

Evidence leaves the process in two forms: an EIP-191 signature over the canonical
report, and a digest anchored on 0G Storage. Both are verifiable without calling
EVIDIQ again.

## How it settles

EVIDIQ owns verification, proof, and scoring, and settles on open infrastructure:

- **0G** — decentralized storage and compute/TEE for tamper-evident proofs.
- **x402** — per-call settlement (EIP-3009 `exact`), so agents pay as they verify.
- **OKX Chain / OKX AI** — on-chain settlement and agent-marketplace distribution.
- **ERC-8004** — agent-identity anchors, resolved live against the on-chain IdentityRegistry on 0G.

Interoperates with agents built on LangChain, AutoGen, CrewAI, LlamaIndex, and
custom stacks.

## Proven on-chain

Every EVIDIQ trust check is verifiable end-to-end — the **payment** settles on
X Layer, and the **verdict** is anchored on 0G. Both from live calls, not mockups.

**1 · Payment — x402 settlement on X Layer**

| | |
|---|---|
| Amount | `0.005 USDT0` on X Layer (`eip155:196`) — `verify_agent` at its current price |
| Flow | HTTP 402 → EIP-3009 signature → `transferWithAuthorization` (gasless for the payer) |
| Tx | [`0xfd872a79…6f6ab9`](https://www.oklink.com/xlayer/tx/0xfd872a79cbf1e9ae64977e145eeec8f00f9ea100b2b7f27f235809767e6f6ab9) · settled |
| Earlier | [`0x6f74549e…96cca86`](https://www.oklink.com/xlayer/tx/0x6f74549eecb4627509f6397db02b8397892c9893d869790006b258b6996cca86) · SUCCESS, at the launch price of `0.05 USDT0` |

**2 · Verdict — TEE-verified analysis + 0G Storage anchor**

| | |
|---|---|
| Compute | `glm-5.2` run in a TEE via 0G Compute (verified) |
| Proof | report signed (EIP-191) + anchored on 0G Storage |
| Anchor tx | [`0xa6a55316…d0ae15`](https://chainscan.0g.ai/tx/0xa6a553162b82e7a1d6fa3fdc4d331067a60462ba453c285c9965441be8d0ae15) · SUCCESS |

**3 · Identity — ERC-8004 resolved live on 0G**

| | |
|---|---|
| Registry | ERC-8004 `IdentityRegistry` on 0G mainnet — [`0x8004A169…9a432`](https://chainscan.0g.ai/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) |
| Read | `verify_agent` calls `ownerOf` / `getAgentWallet` on-chain; identity credit is earned only if the id exists **and** the caller's address matches its on-chain owner |
| Live | id `#0` → owner `0x4044…C224`, `ownerMatchesSupplied: true`; a non-existent id returns `not_found` (zero credit); an id owned by someone else is flagged as impersonation |

```bash
# Reproduce the identity check against the live 0G registry (returns "status":"resolved")
curl -s https://evidiq.dev/api/verify -H 'content-type: application/json' \
  -d '{"agentId":"evoevo-0","identity":{"erc8004Id":"0","address":"0x4044F973535fE12c481353E03Fd1f4B95635C224"}}' \
  | grep -o '"erc8004":{[^}]*}'
```

Payment on one chain, identity and tamper-evident proof on 0G — the whole trust check is auditable end to end.

## Links

- Website — https://evidiq.dev
- Skill — https://evidiq.dev/skill.md
- MCP endpoint — https://evidiq.dev/mcp
- Pricing / x402 — https://evidiq.dev/x402
- Notary MCP — https://mcp.evidiq.dev/notary/mcp
- Operator MCP — https://mcp.evidiq.dev/operator/mcp
- Sentinel MCP — https://mcp.evidiq.dev/sentinel/mcp
- Bastion MCP — https://mcp.evidiq.dev/bastion/mcp

## License

MIT © 2026 EVIDIQ — see [LICENSE](./LICENSE). The open Agent Skill is available
at [evidiq.dev/skill.md](https://evidiq.dev/skill.md).
