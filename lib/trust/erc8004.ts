/**
 * ERC-8004 on-chain identity resolver.
 *
 * EVIDIQ does NOT trust a caller-supplied `erc8004Id` on its own — anyone can
 * paste an id they don't own. This module reads the ERC-8004 IdentityRegistry
 * (an ERC-721 contract, https://github.com/erc-8004/erc-8004-contracts) live on
 * 0G and confirms: does the id actually exist, who owns it, and does it match
 * the address the caller claims? Only a *resolved* id earns identity credit.
 *
 * The registry is deployed at deterministic (CREATE2 singleton) addresses that
 * are identical across every supported chain, so the only per-chain knobs are
 * the RPC and chain id. We default to 0G mainnet (Aristotle, 16661) — the same
 * chain EVIDIQ already uses for 0G Storage + Compute.
 *
 * This function NEVER throws. A registry that can't be reached is a distinct,
 * clearly-labelled signal ("unresolved") from an id that genuinely does not
 * exist ("not_found").
 */

import {
  createPublicClient,
  http,
  defineChain,
  getAddress,
  ContractFunctionRevertedError,
  type Abi,
} from "viem";
import type { AgentIdentity, Erc8004Resolution } from "./types";

export type { Erc8004Resolution };

/** Deterministic ERC-8004 IdentityRegistry singleton addresses. */
const REGISTRY_MAINNET = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
const REGISTRY_TESTNET = "0x8004A818BFB912233c491871b3d84c89A494BD9e";

type Erc8004Network = {
  label: string;
  chainId: number;
  rpc: string;
  registry: string;
};

const NETWORKS: Record<"mainnet" | "testnet", Erc8004Network> = {
  // 0G Mainnet (Aristotle).
  mainnet: { label: "0G mainnet", chainId: 16661, rpc: "https://evmrpc.0g.ai", registry: REGISTRY_MAINNET },
  // 0G Galileo testnet.
  testnet: { label: "0G Galileo testnet", chainId: 16601, rpc: "https://evmrpc-testnet.0g.ai", registry: REGISTRY_TESTNET },
};

/** Resolve which 0G network + registry to read, honouring env overrides. */
function getNetwork(): Erc8004Network {
  const which = process.env.ERC8004_NETWORK?.trim().toLowerCase() === "testnet" ? "testnet" : "mainnet";
  const base = NETWORKS[which];
  return {
    label: base.label,
    chainId: Number(process.env.ERC8004_CHAIN_ID) || base.chainId,
    rpc: process.env.ERC8004_RPC?.trim() || base.rpc,
    registry: process.env.ERC8004_REGISTRY?.trim() || base.registry,
  };
}

/** Minimal read ABI — the ERC-721 + ERC-8004 view functions we need. */
const REGISTRY_ABI = [
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }] },
  { type: "function", name: "getAgentWallet", stateMutability: "view", inputs: [{ name: "agentId", type: "uint256" }], outputs: [{ type: "address" }] },
] as const satisfies Abi;

const ZERO = "0x0000000000000000000000000000000000000000";

/**
 * Look up a claimed ERC-8004 id against the live 0G IdentityRegistry.
 * @param identity the caller-supplied identity anchors (erc8004Id + optional address)
 */
export async function resolveErc8004Identity(
  identity?: AgentIdentity
): Promise<Erc8004Resolution> {
  const raw = identity?.erc8004Id?.trim();
  if (!raw) return { status: "not_supplied" };

  // Accept a bare integer id or a "chain:id" / "#id" style — take the digits.
  const digits = raw.replace(/^#/, "").split(":").pop()?.trim() ?? raw;
  if (!/^\d+$/.test(digits)) return { status: "invalid_id", raw };

  let tokenId: bigint;
  try {
    tokenId = BigInt(digits);
  } catch {
    return { status: "invalid_id", raw };
  }

  const net = getNetwork();
  const chain = defineChain({
    id: net.chainId,
    name: net.label,
    nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
    rpcUrls: { default: { http: [net.rpc] } },
  });
  const client = createPublicClient({ chain, transport: http(net.rpc, { timeout: 6_000, retryCount: 1 }) });
  const registry = net.registry as `0x${string}`;

  // ownerOf reverts (ERC721NonexistentToken) when the id was never registered.
  let owner: string;
  try {
    owner = await client.readContract({ address: registry, abi: REGISTRY_ABI, functionName: "ownerOf", args: [tokenId] });
  } catch (err) {
    const reverted =
      err instanceof ContractFunctionRevertedError ||
      (err as Error & { walk?: (fn: (e: unknown) => boolean) => unknown })?.walk?.(
        (e) => e instanceof ContractFunctionRevertedError
      ) instanceof ContractFunctionRevertedError ||
      /revert|nonexistent|erc721/i.test((err as Error)?.message ?? "");
    if (reverted) {
      return { status: "not_found", agentId: digits, network: net.label, chainId: net.chainId, registry };
    }
    // Network / RPC failure — we could not verify, but the id is not disproven.
    return {
      status: "unresolved",
      agentId: digits,
      network: net.label,
      chainId: net.chainId,
      note: ((err as Error)?.message ?? "RPC unavailable").slice(0, 120),
    };
  }

  // Best-effort extra reads — a failure here doesn't unseat "resolved".
  let agentWallet = ZERO;
  let registrationUri: string | undefined;
  try {
    agentWallet = await client.readContract({ address: registry, abi: REGISTRY_ABI, functionName: "getAgentWallet", args: [tokenId] });
  } catch {
    /* wallet not set / unreadable */
  }
  try {
    const uri = await client.readContract({ address: registry, abi: REGISTRY_ABI, functionName: "tokenURI", args: [tokenId] });
    registrationUri = uri || undefined;
  } catch {
    /* no tokenURI */
  }

  // Does the address the caller claims actually control this id?
  let ownerMatchesSupplied: boolean | null = null;
  const supplied = identity?.address?.trim();
  if (supplied && /^0x[0-9a-fA-F]{40}$/.test(supplied)) {
    let s: string, o: string, w: string;
    try {
      s = getAddress(supplied);
      o = getAddress(owner);
      w = agentWallet !== ZERO ? getAddress(agentWallet) : ZERO;
    } catch {
      s = supplied.toLowerCase();
      o = owner.toLowerCase();
      w = agentWallet.toLowerCase();
    }
    ownerMatchesSupplied = s === o || s === w;
  }

  return {
    status: "resolved",
    agentId: digits,
    network: net.label,
    chainId: net.chainId,
    registry,
    owner,
    agentWallet,
    registrationUri,
    ownerMatchesSupplied,
  };
}
