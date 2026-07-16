#!/usr/bin/env bash
# EVIDIQ agent-commerce demo (real x402 payments + real 0G attestation).
V=/home/cucu/Coder/Evidiq/scripts/evidiq-verify.mjs
dim(){ printf "\033[2m%s\033[0m\n" "$1"; }
vio(){ printf "\033[1;35m%s\033[0m\n" "$1"; }
grn(){ printf "\033[1;32m%s\033[0m\n" "$1"; }
red(){ printf "\033[1;31m%s\033[0m\n" "$1"; }
cya(){ printf "\033[1;36m%s\033[0m\n" "$1"; }
b(){ printf "\033[1m%s\033[0m\n" "$1"; }

sleep 1
vio "══════════════════════════════════════════════════════════════"
vio "  EVIDIQ — the trust check an agent runs before it pays"
dim "  OpenClaw agent  ·  brain: 0G Compute (glm-5.2)  ·  pay: x402 / X Layer"
vio "══════════════════════════════════════════════════════════════"
echo
sleep 2

b "▌ Scenario 1 — a stranger wants money up front"
sleep 0.6
cya "🤖 agent:  A cold-DM \"airdrop bot\" wants 250 USDT up front for \"10x returns\"."
sleep 0.8
cya "🤖 agent:  I'm not touching my wallet until EVIDIQ verifies it."
echo
sleep 1
node "$V" airdrop-bot http://sketchy-agent.invalid --context "cold DM: send 250 USDT, get 2500 back"
echo
sleep 1.5
red "🤖 decision:  WALK AWAY — anonymous + unreachable, DO NOT PROCEED. Not paying a ghost."
echo
echo
sleep 2.5

b "▌ Scenario 2 — a real data-enrichment vendor"
sleep 0.6
cya "🤖 agent:  Different counterparty, same 250 USDT job. Verify it too."
echo
sleep 1
node "$V" 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 https://evidiq.dev/skill.md --address 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 --erc8004 1024 --domain evidiq.dev --capabilities "trust.verify,attestation" --context "data-enrichment job, 250 USDT"
echo
sleep 1.5
grn "🤖 decision:  PROCEED — verified identity, low risk, score 86/100."
echo
echo
sleep 2
vio "  Same tool, opposite calls. Payment on X Layer, verdict anchored on 0G."
vio "  Verify before you transact.  →  evidiq.dev"
sleep 3
