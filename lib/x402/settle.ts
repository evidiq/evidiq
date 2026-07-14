import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { X402Config } from "./config";
import type { PaymentVerifier } from "./facilitator";
import type {
  PaymentPayload,
  PaymentRequirements,
  SettleResult,
  VerifyResult,
} from "./types";
import { verifyPaymentLocal } from "./verify";

/**
 * On-chain x402 settlement for the `exact` (EIP-3009) scheme.
 *
 * Verifies the payer's signature locally, then settles by submitting their
 * signed `transferWithAuthorization` to the token contract from the EVIDIQ
 * settlement wallet (`X402_SETTLE_KEY`) — gasless for the payer, gas paid by
 * us. This is the OKX A2MCP-compatible path and needs no external facilitator.
 *
 * Selected by `getVerifier` when `X402_SETTLE_KEY` is set and
 * `X402_USE_FACILITATOR` is off. If the key is absent, settlement of a
 * nonzero mainnet price fails loudly so paid calls are never given away.
 */

const EIP3009_ABI = [
  {
    type: "function",
    name: "transferWithAuthorization",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export class OnchainSettler implements PaymentVerifier {
  constructor(private cfg: X402Config) {}

  verify(p: PaymentPayload, reqs: PaymentRequirements): Promise<VerifyResult> {
    return verifyPaymentLocal(p, reqs, this.cfg);
  }

  async settle(
    p: PaymentPayload,
    _reqs: PaymentRequirements
  ): Promise<SettleResult> {
    const auth = p.payload.authorization;
    const payer = auth.from;

    // Zero-value price → signature-only, nothing to move on-chain.
    if (this.cfg.price === 0n) {
      return { success: true, transaction: "", payer };
    }
    if (!this.cfg.settleKey) {
      return {
        success: false,
        transaction: "",
        payer,
        errorReason:
          "on-chain settlement requires X402_SETTLE_KEY (a gas-funded X Layer wallet)",
      };
    }

    const chain = defineChain({
      id: this.cfg.chainId,
      name: `xlayer-${this.cfg.chainId}`,
      nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
      rpcUrls: { default: { http: [this.cfg.rpcUrl] } },
    });
    const account = privateKeyToAccount(this.cfg.settleKey);
    const wallet = createWalletClient({
      account,
      chain,
      transport: http(this.cfg.rpcUrl),
    });
    const pub = createPublicClient({ chain, transport: http(this.cfg.rpcUrl) });

    try {
      // Public X Layer RPCs intermittently answer "block is out of range" for
      // eth_getBlockByNumber, which viem calls during EIP-1559 fee estimation
      // (estimateFeesPerGas) and gas estimation while preparing a tx. Provide
      // explicit LEGACY gas params so submission never touches that flaky path
      // — only eth_gasPrice (single, reliable) + eth_getTransactionCount +
      // eth_sendRawTransaction are used.
      let gasPrice: bigint;
      try {
        gasPrice = ((await pub.getGasPrice()) * 12n) / 10n; // +20% headroom
      } catch {
        gasPrice = 1_000_000_000n; // 1 gwei fallback (X Layer fees are tiny)
      }
      // Submit the buyer's gasless authorization: pulls `value` from `from`
      // to `to` (our payTo) using the signature they already produced.
      const hash = await wallet.writeContract({
        address: this.cfg.asset,
        abi: EIP3009_ABI,
        functionName: "transferWithAuthorization",
        args: [
          auth.from,
          auth.to,
          BigInt(auth.value),
          BigInt(auth.validAfter),
          BigInt(auth.validBefore),
          auth.nonce,
          p.payload.signature,
        ],
        gas: 300_000n, // fixed cap → skips eth_estimateGas
        gasPrice, // legacy tx → skips estimateFeesPerGas / eth_getBlockByNumber
      });
      // Poll for the receipt by tx hash. We deliberately avoid
      // waitForTransactionReceipt (which watches new blocks via
      // eth_getBlockByNumber): public X Layer RPCs behind a load balancer
      // intermittently answer "block is out of range" for that call. Looking
      // the receipt up directly by hash is resilient to that inconsistency.
      let receipt: { status: string } | null = null;
      for (let i = 0; i < 40; i++) {
        try {
          receipt = (await pub.getTransactionReceipt({ hash })) as unknown as {
            status: string;
          };
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      if (receipt && receipt.status !== "success") {
        return {
          success: false,
          transaction: hash,
          payer,
          errorReason: "settlement transaction reverted",
        };
      }
      // Broadcast succeeded (receipt confirmed, or still pending but on-chain).
      return { success: true, transaction: hash, payer };
    } catch (e) {
      return {
        success: false,
        transaction: "",
        payer,
        errorReason: `settlement failed: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }
  }
}
