import { recoverTypedDataAddress } from "viem";
import { z } from "zod";
import type { X402Config } from "./config";
import type {
  Hex,
  PaymentPayload,
  PaymentRequirements,
  VerifyResult,
} from "./types";

/**
 * Local x402 `exact` (EIP-3009 transferWithAuthorization) verification.
 *
 * Checks the signature and challenge-field match only — NOT on-chain balance
 * or nonce reuse; that is the facilitator's / settlement's job. Local verify
 * alone is therefore acceptable only for zero-value or testnet payments.
 */

const hex = z.custom<Hex>(
  (v) => typeof v === "string" && /^0x[0-9a-fA-F]*$/.test(v)
);
const address = z.custom<Hex>(
  (v) => typeof v === "string" && /^0x[0-9a-fA-F]{40}$/.test(v)
);
const uint = z.string().regex(/^\d+$/);

const proofSchema = z.object({
  signature: hex,
  authorization: z.object({
    from: address,
    to: address,
    value: uint,
    validAfter: uint,
    validBefore: uint,
    nonce: hex,
  }),
});

// x402 v2 wire shape — the ONLY shape EVIDIQ accepts. The signed proof arrives
// in the standard `PAYMENT-SIGNATURE` header (as emitted by OKX OnchainOS): the
// chosen accepts entry is echoed back under `accepted`, with the signed EIP-3009
// authorization under `payload`. EVIDIQ is x402 v2 only — no v1, no X-PAYMENT.
const v2PayloadSchema = z.object({
  x402Version: z.number(),
  accepted: z.looseObject({
    scheme: z.literal("exact"),
    network: z.string(),
  }),
  payload: proofSchema,
});

/**
 * Read and decode the payment proof from the standard x402 v2 `PAYMENT-SIGNATURE`
 * header, normalizing to PaymentPayload. Returns null when the header is absent
 * or does not carry a valid v2 payload. v1 / the legacy `X-PAYMENT` header are
 * NOT supported — EVIDIQ speaks x402 v2 only.
 */
export function decodePaymentHeader(req: Request): PaymentPayload | null {
  const raw = req.headers.get("payment-signature");
  if (!raw) return null;
  try {
    const json = JSON.parse(Buffer.from(raw.trim(), "base64").toString("utf8"));
    const v2 = v2PayloadSchema.safeParse(json);
    if (!v2.success) return null;
    return {
      x402Version: v2.data.x402Version,
      scheme: v2.data.accepted.scheme,
      network: v2.data.accepted.network,
      payload: v2.data.payload,
    } as PaymentPayload;
  } catch {
    return null;
  }
}

const EIP3009_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

/** Small tolerance for clock skew between signer and server. */
const CLOCK_SKEW_SECONDS = 6n;

export async function verifyPaymentLocal(
  p: PaymentPayload,
  reqs: PaymentRequirements,
  cfg: X402Config
): Promise<VerifyResult> {
  if (p.scheme !== "exact") {
    return { valid: false, reason: `unsupported scheme "${p.scheme}"` };
  }
  if (p.network !== cfg.network) {
    return {
      valid: false,
      reason: `network mismatch: got ${p.network}, expected ${cfg.network}`,
    };
  }
  const auth = p.payload.authorization;
  if (auth.to.toLowerCase() !== cfg.payTo.toLowerCase()) {
    return { valid: false, reason: `payTo mismatch: got ${auth.to}` };
  }
  const required = reqs.amount;
  if (BigInt(auth.value) < BigInt(required)) {
    return {
      valid: false,
      reason: `value ${auth.value} below required ${required}`,
    };
  }
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (BigInt(auth.validAfter) > now + CLOCK_SKEW_SECONDS) {
    return { valid: false, reason: "authorization not yet valid (validAfter)" };
  }
  if (BigInt(auth.validBefore) < now - CLOCK_SKEW_SECONDS) {
    return { valid: false, reason: "authorization expired (validBefore)" };
  }
  let recovered: Hex;
  try {
    recovered = await recoverTypedDataAddress({
      domain: {
        name: cfg.domainName,
        version: cfg.domainVersion,
        chainId: cfg.chainId,
        verifyingContract: cfg.asset,
      },
      types: EIP3009_TYPES,
      primaryType: "TransferWithAuthorization",
      message: {
        from: auth.from,
        to: auth.to,
        value: BigInt(auth.value),
        validAfter: BigInt(auth.validAfter),
        validBefore: BigInt(auth.validBefore),
        nonce: auth.nonce,
      },
      signature: p.payload.signature,
    });
  } catch {
    return { valid: false, reason: "signature recovery failed" };
  }
  if (recovered.toLowerCase() !== auth.from.toLowerCase()) {
    return {
      valid: false,
      reason: `signer ${recovered} does not match authorization.from ${auth.from}`,
    };
  }
  return { valid: true, payer: auth.from };
}
