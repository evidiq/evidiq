// EVIDIQ trust model — the data shapes for a verifiable trust report.
// These are the "Data & Intelligence" (layer 4) and "Verification & Proof"
// (layer 3) contracts that every EVIDIQ surface (MCP tool, x402 endpoint,
// SDK) returns.

export type AgentIdentity = {
  /** EVM address that controls / signs for the agent. */
  address?: string;
  /** ENS or other human-readable name. */
  ens?: string;
  /** ERC-8004 on-chain agent identity id. */
  erc8004Id?: string;
  /** HTTPS domain the agent is served from. */
  domain?: string;
};

/** What the caller tells us about the agent it wants to transact with. */
export type AgentDescriptor = {
  /** Any stable identifier for the agent (address, URL, name, id). Required. */
  agentId: string;
  /** Service URL / MCP endpoint to probe for a live trust signal. */
  endpoint?: string;
  /** Capabilities the agent claims to have. */
  declaredCapabilities?: string[];
  /** Framework the agent is built on (LangChain, AutoGen, CrewAI, custom…). */
  framework?: string;
  /** Identity anchors the caller can supply. */
  identity?: AgentIdentity;
  /** Free-form description of the deal / why the check is being run. */
  context?: string;
};

/** Result of a live probe of the agent's endpoint. */
export type EndpointProbe = {
  attempted: boolean;
  reachable: boolean;
  status?: number;
  /** Served over TLS. */
  tls: boolean;
  /** Endpoint advertises an x402 paywall (payment protection available). */
  advertisesX402: boolean;
  /** Endpoint exposes a machine-readable surface (skill.md / agent card / MCP). */
  servesSkill: boolean;
  note?: string;
};

export type ScoreBreakdown = {
  /** How verifiable the agent's identity is (0-100). */
  identity: number;
  /** Evidence the agent can do what it claims (0-100). */
  capability: number;
  /** On-chain / historical reputation signal (0-100). */
  reputation: number;
  /** Risk of transacting (0 = none, 100 = maximum). */
  risk: number;
};

export type FindingSeverity = "positive" | "info" | "warning" | "critical";

export type Finding = {
  severity: FindingSeverity;
  code: string;
  message: string;
};

export type Recommendation =
  | "proceed"
  | "proceed_with_escrow"
  | "caution"
  | "do_not_proceed";

export type TrustTier = "high" | "medium" | "low" | "unverified";

/** A signed, storable attestation of a trust verdict (layer 3). */
export type Attestation = {
  /** How the verdict was attested. */
  method: "0g-tee" | "evidiq-eip191" | "unsigned";
  /** keccak256 of the canonical trust report. */
  reportHash: string;
  /** Signature over the report hash (when method !== "unsigned"). */
  signature?: string;
  /** Address / identity that produced the attestation. */
  attester?: string;
  /** 0G Storage root hash of the stored evidence, when persisted. */
  storageRoot?: string;
  /** 0G Storage upload tx hash, when persisted. */
  storageTx?: string;
  /** 0G Compute TEE trace, when the analysis ran through verifiable compute. */
  tee?: {
    model: string;
    /** On-chain provider address that served the TEE inference. */
    provider?: string;
    /** 0G router request id (billing / audit trace). */
    requestId?: string;
    verified: boolean;
  };
  note?: string;
};

/** TEE-verified AI risk analysis attached to a report (layer 4 → 3). */
export type TrustAnalysis = {
  model: string;
  provider?: string;
  requestId?: string;
  teeVerified: boolean;
  text: string;
};

/**
 * Result of resolving a caller-supplied ERC-8004 id against the live on-chain
 * IdentityRegistry. Defined in ./erc8004 (kept as a type import here to avoid a
 * viem dependency in the pure scoring path).
 */
export type Erc8004Resolution =
  | { status: "not_supplied" }
  | { status: "invalid_id"; raw: string }
  | { status: "unresolved"; agentId: string; network: string; chainId: number; note: string }
  | { status: "not_found"; agentId: string; network: string; chainId: number; registry: string }
  | {
      status: "resolved";
      agentId: string;
      network: string;
      chainId: number;
      registry: string;
      owner: string;
      agentWallet: string;
      registrationUri?: string;
      ownerMatchesSupplied: boolean | null;
    };

export type TrustReport = {
  schema: "evidiq.trust-report/v1";
  agentId: string;
  issuedAt: string;
  trustScore: number;
  tier: TrustTier;
  recommendation: Recommendation;
  breakdown: ScoreBreakdown;
  findings: Finding[];
  probe?: EndpointProbe;
  /** On-chain ERC-8004 identity resolution, when an id was supplied. */
  erc8004?: Erc8004Resolution;
  analysis?: TrustAnalysis;
  input: AgentDescriptor;
  attestation?: Attestation;
  evidiq: { version: string; layer: string };
};
