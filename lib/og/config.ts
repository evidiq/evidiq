/**
 * 0G configuration.
 *
 * Storage/attestation use a single funded EVM key (OG_PRIVATE_KEY) on 0G
 * mainnet (Aristotle). Compute uses the 0G Compute Router — an OpenAI-compatible
 * TEE-backed endpoint keyed by an sk- API key.
 *
 * All optional: when unset, EVIDIQ still returns deterministic trust reports,
 * just without on-chain evidence anchoring, a signed attestation, or the
 * TEE-verified AI analysis (each clearly labeled in the report).
 */

export type OgConfig = {
  privateKey: `0x${string}`;
  storageRpc: string;
  storageIndexer: string;
  computeRpc: string;
  chainId: number;
};

/** 0G Compute Router (TEE-backed, OpenAI-compatible). */
export type OgComputeConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

const DEFAULTS = {
  // 0G Mainnet (Aristotle) — Chain ID 16661.
  storageRpc: "https://evmrpc.0g.ai",
  storageIndexer: "https://indexer-storage-turbo.0g.ai",
  computeRpc: "https://evmrpc.0g.ai",
  chainId: 16661,
  computeBaseUrl: "https://router-api.0g.ai/v1",
  computeModel: "glm-5.2",
};

function normalizeKey(raw?: string): `0x${string}` | null {
  if (!raw) return null;
  const key = raw.trim();
  const withPrefix = key.startsWith("0x") ? key : `0x${key}`;
  return /^0x[0-9a-fA-F]{64}$/.test(withPrefix)
    ? (withPrefix as `0x${string}`)
    : null;
}

/** Returns 0G storage/attestation config when a valid key is present. */
export function getOgConfig(): OgConfig | null {
  const privateKey = normalizeKey(process.env.OG_PRIVATE_KEY);
  if (!privateKey) return null;
  const chainId = Number(process.env.OG_CHAIN_ID) || DEFAULTS.chainId;
  return {
    privateKey,
    storageRpc: process.env.OG_STORAGE_RPC?.trim() || DEFAULTS.storageRpc,
    storageIndexer:
      process.env.OG_STORAGE_INDEXER?.trim() || DEFAULTS.storageIndexer,
    computeRpc: process.env.OG_COMPUTE_RPC?.trim() || DEFAULTS.computeRpc,
    chainId,
  };
}

/** Returns 0G Compute Router config when an sk- API key is present. */
export function getOgComputeConfig(): OgComputeConfig | null {
  const apiKey = process.env.OG_COMPUTE_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: process.env.OG_COMPUTE_BASE_URL?.trim() || DEFAULTS.computeBaseUrl,
    model: process.env.OG_COMPUTE_MODEL?.trim() || DEFAULTS.computeModel,
  };
}
