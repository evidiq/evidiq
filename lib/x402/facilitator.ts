import type { X402Config } from "./config";
import type {
  PaymentPayload,
  PaymentRequirements,
  SettleResult,
  VerifyResult,
} from "./types";
import { verifyPaymentLocal } from "./verify";

/**
 * Payment verification/settlement abstraction.
 *
 * - LocalVerifier: signature-only verification; settlement is a no-op that is
 *   PERMITTED ONLY for zero-value or testnet payments — otherwise it fails
 *   loudly so a misconfigured mainnet price can never give away paid calls.
 * - FacilitatorClient: standard x402 facilitator interface (POST /verify,
 *   POST /settle). OKX's exact paths under web3.okx.com are not publicly
 *   documented — FACILITATOR_PATHS is the single place to fix once confirmed.
 *   Verify falls back to local verification when the facilitator is
 *   unreachable/unknown; settle NEVER falls back.
 */

export interface PaymentVerifier {
  verify(p: PaymentPayload, reqs: PaymentRequirements): Promise<VerifyResult>;
  settle(p: PaymentPayload, reqs: PaymentRequirements): Promise<SettleResult>;
}

/** X Layer testnets — the only networks where unsettled nonzero payments are ok.
 * 1952 = current testnet (post Aug-2025 OP-Stack upgrade); 195 = deprecated. */
const TESTNET_NETWORKS = new Set(["eip155:1952", "eip155:195"]);

export class LocalVerifier implements PaymentVerifier {
  constructor(private cfg: X402Config) {}

  verify(p: PaymentPayload, reqs: PaymentRequirements): Promise<VerifyResult> {
    return verifyPaymentLocal(p, reqs, this.cfg);
  }

  async settle(
    p: PaymentPayload,
    _reqs: PaymentRequirements
  ): Promise<SettleResult> {
    const payer = p.payload.authorization.from;
    if (this.cfg.price === 0n || TESTNET_NETWORKS.has(this.cfg.network)) {
      return { success: true, transaction: "", payer };
    }
    return {
      success: false,
      transaction: "",
      payer,
      errorReason:
        "nonzero mainnet price requires facilitator settlement (set X402_USE_FACILITATOR=1 once the facilitator API is confirmed)",
    };
  }
}

// Standard x402 facilitator paths — confirm against OKX docs before relying
// on them for settlement.
const FACILITATOR_PATHS = {
  verify: "/verify",
  settle: "/settle",
} as const;

export class FacilitatorClient implements PaymentVerifier {
  private local: LocalVerifier;
  constructor(private cfg: X402Config) {
    this.local = new LocalVerifier(cfg);
  }

  private async post(
    path: string,
    p: PaymentPayload,
    reqs: PaymentRequirements
  ): Promise<Record<string, unknown> | null> {
    try {
      const res = await fetch(`${this.cfg.facilitatorUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          x402Version: p.x402Version,
          paymentPayload: p,
          paymentRequirements: reqs,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) return null;
      return (await res.json()) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  async verify(
    p: PaymentPayload,
    reqs: PaymentRequirements
  ): Promise<VerifyResult> {
    const json = await this.post(FACILITATOR_PATHS.verify, p, reqs);
    if (json && typeof json.isValid === "boolean") {
      return json.isValid
        ? { valid: true, payer: p.payload.authorization.from }
        : {
            valid: false,
            reason: String(
              json.invalidReason ?? "facilitator rejected payment"
            ),
          };
    }
    // Facilitator unreachable or unknown response shape — fall back to local
    // signature verification so free/testnet flows keep working.
    console.warn(
      "x402: facilitator verify unavailable, falling back to local verification"
    );
    return this.local.verify(p, reqs);
  }

  async settle(
    p: PaymentPayload,
    reqs: PaymentRequirements
  ): Promise<SettleResult> {
    const payer = p.payload.authorization.from;
    const json = await this.post(FACILITATOR_PATHS.settle, p, reqs);
    if (json && typeof json.success === "boolean") {
      return {
        success: json.success,
        transaction: String(json.transaction ?? json.txHash ?? ""),
        payer: String(json.payer ?? payer),
        errorReason: json.success
          ? undefined
          : String(json.errorReason ?? "facilitator settlement failed"),
      };
    }
    // No local fallback for settlement — never give away paid calls.
    return {
      success: false,
      transaction: "",
      payer,
      errorReason: "facilitator settle endpoint unavailable",
    };
  }
}

export function getVerifier(cfg: X402Config): PaymentVerifier {
  return cfg.useFacilitator
    ? new FacilitatorClient(cfg)
    : new LocalVerifier(cfg);
}
