import { z } from "zod";

/**
 * x402 configuration for the EVIDIQ paid trust check, entirely env-driven —
 * no hardcoded addresses.
 *
 * Absent config (no asset set) is a graceful no-op: the MCP server and the
 * verify_agent tool behave like a free A2MCP endpoint. Partial or malformed
 * config throws loudly at request time rather than half-gating.
 *
 * Network resolution accepts either:
 * - X402_NETWORK — a CAIP-2 id directly (e.g. "eip155:196"), or
 * - X402_CHAIN   — a friendly slug ("x-layer", "x-layer-testnet") mapped below.
 *
 * Environments:
 * - preview/dev: X Layer testnet (eip155:1952), test token, price 0.
 * - production:  X Layer mainnet (eip155:196), USDT0 — set once X402_PAY_TO is
 *   confirmed and X402_USE_FACILITATOR=1.
 */

/** Friendly chain slug → CAIP-2 network id. */
const CHAIN_SLUGS: Record<string, string> = {
  "x-layer": "eip155:196",
  xlayer: "eip155:196",
  "x-layer-mainnet": "eip155:196",
  "x-layer-testnet": "eip155:1952",
  "xlayer-testnet": "eip155:1952",
};

/** Resolve the CAIP-2 network from X402_NETWORK or X402_CHAIN. */
function resolveNetwork(): string | undefined {
  const direct = process.env.X402_NETWORK?.trim();
  if (direct) return direct;
  const slug = process.env.X402_CHAIN?.trim().toLowerCase();
  if (slug && CHAIN_SLUGS[slug]) return CHAIN_SLUGS[slug];
  return undefined;
}

const envSchema = z.object({
  network: z
    .string()
    .regex(/^eip155:\d+$/, "network must resolve to CAIP-2, e.g. eip155:196"),
  X402_ASSET: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "X402_ASSET must be a 0x… token address"),
  X402_PAY_TO: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "X402_PAY_TO must be a 0x… address"),
  X402_DOMAIN_NAME: z.string().min(1).default("USDT0"),
  X402_DOMAIN_VERSION: z.string().min(1).default("1"),
  X402_PRICE: z
    .string()
    .regex(/^\d+$/, "X402_PRICE must be atomic units (decimal integer)")
    .default("0"),
  X402_FACILITATOR_URL: z.url().default("https://web3.okx.com"),
  X402_GATE_ALL: z.string().optional(),
  X402_USE_FACILITATOR: z.string().optional(),
});

export type X402Config = {
  /** CAIP-2 id, e.g. "eip155:196". */
  network: string;
  chainId: number;
  asset: `0x${string}`;
  payTo: `0x${string}`;
  /** EIP-712 domain of the asset token. */
  domainName: string;
  domainVersion: string;
  /** Price in atomic units; 0n means signature-only (no settlement). */
  price: bigint;
  facilitatorUrl: string;
  /** Gate every MCP method (initialize/tools/list/…), not just paid tools. */
  gateAll: boolean;
  /** Verify+settle through the facilitator instead of local-only verify. */
  useFacilitator: boolean;
};

/**
 * Returns the parsed config, or null when x402 is not configured at all.
 * We consider x402 "enabled" once a paid asset + recipient are present.
 * Throws when config is present but partial or malformed.
 */
export function getX402Config(): X402Config | null {
  const network = resolveNetwork();
  const asset = process.env.X402_ASSET;
  const payTo = process.env.X402_PAY_TO;

  // Not configured at all → transparent no-op (free endpoint).
  if (!asset && !process.env.X402_NETWORK && !process.env.X402_CHAIN) {
    return null;
  }
  // An asset is what turns the endpoint paid; without it we stay free.
  if (!asset) return null;

  const missing: string[] = [];
  if (!network) missing.push("X402_NETWORK or X402_CHAIN");
  if (!payTo) missing.push("X402_PAY_TO");
  if (missing.length > 0) {
    throw new Error(
      `x402 config is partial — X402_ASSET is set but missing: ${missing.join(", ")}`
    );
  }

  const env = envSchema.parse({
    network,
    X402_ASSET: asset,
    X402_PAY_TO: payTo,
    X402_DOMAIN_NAME: process.env.X402_DOMAIN_NAME,
    X402_DOMAIN_VERSION: process.env.X402_DOMAIN_VERSION,
    X402_PRICE: process.env.X402_PRICE,
    X402_FACILITATOR_URL: process.env.X402_FACILITATOR_URL,
    X402_GATE_ALL: process.env.X402_GATE_ALL,
    X402_USE_FACILITATOR: process.env.X402_USE_FACILITATOR,
  });

  return {
    network: env.network,
    chainId: Number(env.network.split(":")[1]),
    asset: env.X402_ASSET as `0x${string}`,
    payTo: env.X402_PAY_TO as `0x${string}`,
    domainName: env.X402_DOMAIN_NAME,
    domainVersion: env.X402_DOMAIN_VERSION,
    price: BigInt(env.X402_PRICE),
    facilitatorUrl: env.X402_FACILITATOR_URL,
    gateAll: env.X402_GATE_ALL === "1",
    useFacilitator: env.X402_USE_FACILITATOR === "1",
  };
}
