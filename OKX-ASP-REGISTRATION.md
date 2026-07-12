# EVIDIQ — OKX A2MCP ASP registration kit

EVIDIQ registers on OKX.AI as an **A2MCP** service (Agent-to-MCP): a
standardized, pay-per-call utility API. Not A2A — no negotiation, no escrow.
Everything runs automatically once listed ("when a user's agent calls your API,
billing and delivery happen in real time").

Registration is done by *prompting an agent* that has OnchainOS installed — not
by a code deploy. This file is the playbook + the exact metadata to paste.

---

## 0. Pre-flight (all green ✅ as of this build)

| Check | Command | Expected |
|-------|---------|----------|
| Skill live | `curl -s -o /dev/null -w "%{http_code}" https://evidiq.dev/skill.md` | `200` |
| MCP endpoint live | `curl -sX POST https://evidiq.dev/mcp -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'` | lists `how_to_install`, `get_evidiq_skill`, `verify_agent` |
| x402 discovery | `curl -s -o /dev/null -w "%{http_code}" https://evidiq.dev/x402` | `404` while free · `200` once paid config is set |

---

## 1. Service metadata (paste into the registration prompt)

| Field | Value |
|-------|-------|
| **Name** | EVIDIQ — Agent Trust Check |
| **Type** | A2MCP (Agent-to-MCP) |
| **Endpoint** | `https://evidiq.dev/mcp` |
| **Skill** | `https://evidiq.dev/skill.md` |
| **Category** | Verification / risk / reputation (utility API) |
| **Pricing (launch)** | **Free** — list fast, get an Agent ID |
| **Pricing (paid)** | `$0.05 USDC` per `verify_agent` call, x402, X Layer |
| **Paid tool** | `verify_agent` |
| **Free tools** | `how_to_install`, `get_evidiq_skill` |

**Description (marketplace copy):**

> Verify any AI agent before you transact. EVIDIQ checks a counterparty's
> capability and identity, scores its risk in real time (0–100), reads its
> on-chain reputation, and returns a signed Trust Report anchored on 0G — so an
> agent can decide to proceed, escrow, or walk away. Standardized, pay-per-call,
> no negotiation.

---

## 2. Register (prompt flow)

Prereqs: an agent with **OpenClaw / Hermes / Claude Code / Codex** + an email for
the **Agentic Wallet**.

```text
# 1) Install OnchainOS (then open a NEW agent session)
npx skills add okx/onchainos-skills --yes -g

# 2) Log in to the Agentic Wallet (prompt to your agent)
Log in to Agentic Wallet on Onchain OS with my email

# 3) Register EVIDIQ as an A2MCP ASP (prompt to your agent)
Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS
#   → give it: name, description, endpoint (https://evidiq.dev/mcp), pricing
#     from the table above. Launch it FREE first.

# 4) List it on the marketplace (prompt to your agent)
Help me list my ASP on OKX.AI using Onchain OS
#   → review within 24h; result goes to your Agentic Wallet email + the chat.
#     Even pre-review it's usable via its Agent ID.
```

---

## 3. Free now → paid later (no re-list needed, just config + redeploy)

List **free** to go live fast. To turn on pay-per-call, set these in the server
env (`/root/evidiq.env` on the box), redeploy, then update the service price via
OnchainOS. Values verified against a live OKX A2MCP seller (autoyield, X Layer):

```bash
X402_CHAIN=x-layer                                       # eip155:196
X402_PAY_TO=0x…                                          # your Agentic Wallet / payout address
X402_ASSET=0x74b7F16337b8972027F6196A17a631aC6dE26d22    # USDC on X Layer
X402_PRICE=50000                                         # 6 decimals → $0.05
X402_DOMAIN_NAME=USD Coin
X402_DOMAIN_VERSION=2
X402_RPC=https://rpc.xlayer.tech
X402_SETTLE_KEY=0x…                                      # gas-funded X Layer wallet (OKB) → self-settles on-chain
```

After redeploy: `curl https://evidiq.dev/x402` returns `200` with `accepts[]`
(USDC, $0.05, payTo). `verify_agent` then answers unpaid calls with HTTP 402 and
settles paid ones on-chain via `transferWithAuthorization` (see `lib/x402/settle.ts`).

**Reminder:** the settlement wallet needs a little **OKB** on X Layer for gas.
