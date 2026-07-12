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
- **ERC-8004** — portable agent-identity anchors.

Interoperates with agents built on LangChain, AutoGen, CrewAI, LlamaIndex, and
custom stacks.

## Proven on-chain

Every EVIDIQ trust check is verifiable end-to-end — the **payment** settles on
X Layer, and the **verdict** is anchored on 0G. Both from live calls, not mockups.

**1 · Payment — x402 settlement on X Layer**

| | |
|---|---|
| Amount | `0.05 USDC` on X Layer (`eip155:196`) |
| Flow | HTTP 402 → EIP-3009 signature → `transferWithAuthorization` (gasless for the payer) |
| Tx | [`0x805882b3…47acfb12`](https://www.oklink.com/xlayer/tx/0x805882b3881b1ff551358ef77f3cde5324046ed090e59f1e5bc88fcd47acfb12) · SUCCESS |

**2 · Verdict — TEE-verified analysis + 0G Storage anchor**

| | |
|---|---|
| Compute | `glm-5.2` run in a TEE via 0G Compute (verified) |
| Proof | report signed (EIP-191) + anchored on 0G Storage |
| Anchor tx | [`0x3ece4ef3…aef9c64f`](https://chainscan.0g.ai/tx/0x3ece4ef3719cc7d3b7c532cdbdaf8bfc1c7bdf12860cd9461b27c017aef9c64f) · SUCCESS |

Payment on one chain, tamper-evident proof on another — the whole trust check is auditable.

## Links

- Website — https://evidiq.dev
- Skill — https://evidiq.dev/skill.md
- MCP endpoint — https://evidiq.dev/mcp
- Pricing / x402 — https://evidiq.dev/x402

## License

© EVIDIQ. All rights reserved. The EVIDIQ Agent Skill is published as an open
specification — see [evidiq-skill](https://github.com/evidiq/evidiq-skill).
