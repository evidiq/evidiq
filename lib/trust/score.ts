import type {
  AgentDescriptor,
  EndpointProbe,
  Erc8004Resolution,
  Finding,
  Recommendation,
  ScoreBreakdown,
  TrustReport,
  TrustTier,
} from "./types";

export const EVIDIQ_VERSION = "0.1.0";

const isAddress = (v?: string): boolean =>
  typeof v === "string" && /^0x[0-9a-fA-F]{40}$/.test(v.trim());

const clamp = (n: number, lo = 0, hi = 100): number =>
  Math.max(lo, Math.min(hi, Math.round(n)));

/**
 * Deterministic, explainable trust scoring. Given what the caller supplied and
 * a live endpoint probe, produce a Trust Report. The same inputs always yield
 * the same verdict — the score is auditable, not a black box.
 *
 * Honesty rule: EVIDIQ scores what it can actually observe. Where a signal is
 * an anchor (an identity that *could* be looked up) rather than a confirmed
 * history, the findings say so.
 */
export function assessAgent(
  input: AgentDescriptor,
  probe: EndpointProbe,
  erc8004?: Erc8004Resolution
): TrustReport {
  const findings: Finding[] = [];
  const id = input.identity ?? {};
  const declared = input.declaredCapabilities ?? [];

  // ── Identity (0-100) ──────────────────────────────────────────────
  let identity = 0;
  if (isAddress(id.address)) {
    identity += 40;
    findings.push({
      severity: "positive",
      code: "id.address",
      message: "Controlling EVM address supplied — signatures are verifiable.",
    });
  }

  // ERC-8004: credit is earned by a LIVE on-chain lookup, not a self-declared
  // id. `erc8004` is the result of reading the IdentityRegistry (see
  // lib/trust/erc8004.ts). Only a resolved id counts; a claimed-but-absent id
  // earns nothing and is flagged.
  let erc8004Verified = false;
  let erc8004RiskBump = 0;
  const res = erc8004 ?? (id.erc8004Id ? { status: "unresolved" as const, agentId: id.erc8004Id, network: "unknown", chainId: 0, note: "no on-chain check performed" } : { status: "not_supplied" as const });
  switch (res.status) {
    case "resolved": {
      if (res.ownerMatchesSupplied === false) {
        // The id is real, but the caller's supplied address does NOT control
        // it. Claiming an id you don't own is an impersonation signal: no
        // identity/reputation credit, and a risk bump.
        erc8004RiskBump += 15;
        findings.push({
          severity: "warning",
          code: "id.erc8004_owner_mismatch",
          message: `ERC-8004 id #${res.agentId} exists on ${res.network} (owner ${res.owner}, agent wallet ${res.agentWallet}) but does NOT match the supplied address — possible impersonation of an id the caller does not control. No identity credit given.`,
        });
        break;
      }
      erc8004Verified = true;
      identity += 25;
      if (res.ownerMatchesSupplied === true) {
        identity += 15;
        findings.push({
          severity: "positive",
          code: "id.erc8004_verified",
          message: `ERC-8004 id #${res.agentId} verified on-chain (${res.network}); the supplied address controls it (owner/agent wallet ${res.owner}). Ownership confirmed.`,
        });
      } else {
        findings.push({
          severity: "positive",
          code: "id.erc8004_verified",
          message: `ERC-8004 id #${res.agentId} verified on-chain (${res.network}); owner ${res.owner}. No address supplied to confirm control.`,
        });
      }
      break;
    }
    case "not_found":
      findings.push({
        severity: "warning",
        code: "id.erc8004_unverified",
        message: `Claimed ERC-8004 id #${res.agentId} does not exist in the IdentityRegistry on ${res.network} — ignored, no identity credit given.`,
      });
      break;
    case "unresolved":
      identity += 10;
      findings.push({
        severity: "info",
        code: "id.erc8004_unresolved",
        message: `ERC-8004 id #${res.agentId} could not be verified on-chain (${res.note}); treated as self-declared only.`,
      });
      break;
    case "invalid_id":
      findings.push({
        severity: "warning",
        code: "id.erc8004_invalid",
        message: `Supplied ERC-8004 id "${res.raw}" is not a valid token id.`,
      });
      break;
    case "not_supplied":
      break;
  }

  if (id.ens) identity += 20;
  if (id.domain) {
    identity += 25;
    if (probe.tls) identity += 10;
  }
  identity = clamp(identity);
  if (identity < 20) {
    findings.push({
      severity: "critical",
      code: "id.anonymous",
      message:
        "No verifiable identity anchor (address / ERC-8004 / domain). Counterparty is effectively anonymous.",
    });
  }

  // ── Capability (0-100) ────────────────────────────────────────────
  let capability = 10;
  if (declared.length > 0) {
    capability += 25;
    findings.push({
      severity: "info",
      code: "cap.declared",
      message: `${declared.length} capability(ies) declared: ${declared
        .slice(0, 6)
        .join(", ")}.`,
    });
  }
  if (input.framework) capability += 10;
  if (probe.attempted) {
    if (probe.reachable) {
      capability += 30;
      findings.push({
        severity: "positive",
        code: "cap.reachable",
        message: `Endpoint is live (${probe.note}).`,
      });
    } else {
      findings.push({
        severity: "warning",
        code: "cap.unreachable",
        message: `Endpoint could not be reached (${probe.note}); declared capabilities are unproven.`,
      });
    }
    if (probe.servesSkill) {
      capability += 15;
      findings.push({
        severity: "positive",
        code: "cap.machine_readable",
        message:
          "Endpoint exposes a machine-readable surface (skill / agent card / MCP).",
      });
    }
  }
  capability = clamp(capability);

  // ── Reputation (0-100) — anchor-based, not a live history query ────
  let reputation = 30;
  if (erc8004Verified) reputation += 30;
  if (isAddress(id.address)) reputation += 20;
  if (probe.advertisesX402) {
    reputation += 20;
    findings.push({
      severity: "positive",
      code: "rep.paid_service",
      message:
        "Endpoint runs a paid (x402) service — economic skin in the game.",
    });
  }
  reputation = clamp(reputation);
  findings.push({
    severity: "info",
    code: "rep.method",
    message:
      "Reputation is scored from on-chain identity anchors and live signals. A full historical reputation query requires the EVIDIQ on-chain registry.",
  });

  // ── Risk (0 = none, 100 = max) ────────────────────────────────────
  let risk = 10;
  if (identity < 20) risk += 40;
  if (probe.attempted && !probe.reachable) risk += 25;
  if (input.endpoint && !probe.tls) {
    risk += 15;
    findings.push({
      severity: "warning",
      code: "risk.no_tls",
      message: "Endpoint is not served over TLS.",
    });
  }
  if (declared.length > 0 && probe.attempted && !probe.reachable) risk += 10;
  if (!probe.advertisesX402) risk += 10;
  else risk -= 10;
  risk += erc8004RiskBump;
  risk = clamp(risk);

  // ── Composite ─────────────────────────────────────────────────────
  const breakdown: ScoreBreakdown = { identity, capability, reputation, risk };
  const trustScore = clamp(
    identity * 0.3 + capability * 0.3 + reputation * 0.2 + (100 - risk) * 0.2
  );

  const tier: TrustTier =
    trustScore >= 80
      ? "high"
      : trustScore >= 60
        ? "medium"
        : trustScore >= 40
          ? "low"
          : "unverified";

  const recommendation: Recommendation =
    risk >= 70 || trustScore < 40
      ? "do_not_proceed"
      : trustScore >= 75 && risk < 35
        ? "proceed"
        : trustScore >= 55 && risk < 60
          ? "proceed_with_escrow"
          : "caution";

  findings.push({
    severity:
      recommendation === "proceed"
        ? "positive"
        : recommendation === "do_not_proceed"
          ? "critical"
          : "warning",
    code: `rec.${recommendation}`,
    message: recommendationMessage(recommendation),
  });

  return {
    schema: "evidiq.trust-report/v1",
    agentId: input.agentId,
    issuedAt: new Date().toISOString(),
    trustScore,
    tier,
    recommendation,
    breakdown,
    findings,
    probe,
    ...(res.status !== "not_supplied" ? { erc8004: res } : {}),
    input,
    evidiq: { version: EVIDIQ_VERSION, layer: "trust-api/v1" },
  };
}

function recommendationMessage(r: Recommendation): string {
  switch (r) {
    case "proceed":
      return "Verified and low-risk. Safe to transact directly.";
    case "proceed_with_escrow":
      return "Reasonably trusted but not risk-free. Transact through escrow (A2A) and release on delivery.";
    case "caution":
      return "Partial verification only. Limit exposure, require attestation, and prefer escrow with dispute rights.";
    case "do_not_proceed":
      return "Insufficient trust or high risk. Do not transact until identity and capability are verified.";
  }
}

/** Canonical JSON for hashing / storage — recursively sorted keys, stable. */
export function canonicalReport(report: TrustReport): string {
  return canonicalize(report);
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys
    .filter((k) => obj[k] !== undefined)
    .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
  return `{${entries.join(",")}}`;
}
