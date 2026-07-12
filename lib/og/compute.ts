import type { TrustAnalysis, TrustReport } from "@/lib/trust/types";
import { getOgComputeConfig } from "./config";

/** Budget for the TEE inference so it never hangs a paid call. */
const COMPUTE_TIMEOUT_MS = 22_000;

const SYSTEM_PROMPT = `You are EVIDIQ's senior trust analyst. Given a deterministic trust report about an AI agent that someone is about to transact with, write a concise, professional risk assessment (<=140 words) for the counterparty deciding whether to proceed.

Rules:
- Ground every statement in the evidence provided. Do not invent capabilities, history, or identity you were not given.
- State the key strengths, the key risks, and end with one clear line: PROCEED, PROCEED WITH ESCROW, CAUTION, or DO NOT PROCEED — consistent with the score unless the evidence clearly warrants otherwise.
- Plain text, no markdown headings.`;

/** Compact, model-friendly view of the evidence. */
function evidenceDigest(report: TrustReport): string {
  const b = report.breakdown;
  const probe = report.probe;
  return JSON.stringify(
    {
      agentId: report.agentId,
      trustScore: report.trustScore,
      tier: report.tier,
      recommendation: report.recommendation,
      breakdown: b,
      declaredCapabilities: report.input.declaredCapabilities ?? [],
      framework: report.input.framework ?? null,
      identityAnchors: {
        address: Boolean(report.input.identity?.address),
        erc8004: Boolean(report.input.identity?.erc8004Id),
        ens: Boolean(report.input.identity?.ens),
        domain: Boolean(report.input.identity?.domain),
      },
      endpoint: probe
        ? {
            attempted: probe.attempted,
            reachable: probe.reachable,
            tls: probe.tls,
            advertisesX402: probe.advertisesX402,
            servesSkill: probe.servesSkill,
          }
        : null,
      dealContext: report.input.context ?? null,
      findings: report.findings.map((f) => `${f.severity}: ${f.message}`),
    },
    null,
    0
  );
}

type ChatResponse = {
  choices?: Array<{
    message?: { content?: string; reasoning_content?: string };
  }>;
  x_0g_trace?: { provider?: string; request_id?: string };
};

/**
 * Run the trust analysis through 0G Compute (TEE-backed, OpenAI-compatible
 * router). Returns a TrustAnalysis with the provider + request-id trace that
 * anchors the TEE attestation, or null when compute is not configured or the
 * call fails. Never throws.
 */
export async function analyzeTrust(
  report: TrustReport
): Promise<TrustAnalysis | null> {
  const cfg = getOgComputeConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Trust report evidence:\n${evidenceDigest(report)}`,
          },
        ],
        max_tokens: 900,
        temperature: 0.2,
        reasoning_effort: "none",
      }),
      signal: AbortSignal.timeout(COMPUTE_TIMEOUT_MS),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as ChatResponse;
    const msg = json.choices?.[0]?.message;
    const raw = (msg?.content || msg?.reasoning_content || "").trim();
    if (!raw) return null;

    const provider = json.x_0g_trace?.provider;
    return {
      model: cfg.model,
      provider,
      requestId: json.x_0g_trace?.request_id,
      teeVerified: Boolean(provider),
      text: raw.slice(0, 1600),
    };
  } catch {
    return null;
  }
}
