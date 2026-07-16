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
  <a href="https://github.com/evidiq/evidiq-skill">Agent Skill</a> &middot;
  <a href="https://github.com/evidiq/mcp">MCP Server</a>
</p>

<p align="center">
  <a href="https://glama.ai/mcp/servers/evidiq/mcp"><img src="https://glama.ai/mcp/servers/evidiq/mcp/badges/score.svg" alt="Glama score" /></a>
  <a href="https://evidiq.dev/mcp"><img src="https://img.shields.io/badge/MCP%20Server-Verified-6E56CF?style=flat-square" alt="MCP Server" /></a>
  <a href="https://0g.ai"><img src="https://img.shields.io/badge/0G-TEE%20%2B%20Storage-00C2A8?style=flat-square" alt="0G TEE + Storage" /></a>
  <a href="https://www.oklink.com/xlayer"><img src="https://img.shields.io/badge/X%20Layer-Live-3CCF4E?style=flat-square" alt="X Layer" /></a>
  <a href="https://evidiq.dev/x402"><img src="https://img.shields.io/badge/x402-pay--per--call-2563EB?style=flat-square" alt="x402" /></a>
  <a href="https://okx.ai"><img src="https://img.shields.io/badge/OKX.AI-ASP-121212?style=flat-square&logo=okx&logoColor=white" alt="OKX.AI ASP" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-3DA639?style=flat-square" alt="License: MIT" /></a>
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

## Products

| Repository | What it is |
|------------|-----------|
| [**evidiq-skill**](https://github.com/evidiq/evidiq-skill) | The open EVIDIQ Agent Skill — the verify → score → reputation → attest workflow any skill-aware agent can install. |
| [**mcp**](https://github.com/evidiq/mcp) | The remote MCP server and install endpoint that exposes the trust tools (live at `evidiq.dev/mcp`). |

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
| Amount | `0.05 USDT0` on X Layer (`eip155:196`) |
| Flow | HTTP 402 → EIP-3009 signature → `transferWithAuthorization` (gasless for the payer) |
| Tx | [`0x6f74549e…96cca86`](https://www.oklink.com/xlayer/tx/0x6f74549eecb4627509f6397db02b8397892c9893d869790006b258b6996cca86) · SUCCESS |

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

## License

MIT © 2026 EVIDIQ — see [LICENSE](./LICENSE). The EVIDIQ Agent Skill is also
published as an open specification — see [evidiq-skill](https://github.com/evidiq/evidiq-skill).
