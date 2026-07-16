/**
 * x402 v2 payment protocol types, as consumed by the OKX AI Marketplace:
 * - 402 challenge: `accepts[]` of PaymentRequirements — base64 JSON in the
 *   PAYMENT-REQUIRED response header (also mirrored in the 402 body).
 * - Payment proof: PaymentPayload — carried in the PAYMENT-SIGNATURE header.
 * - Scheme is always `exact` — EIP-3009 transferWithAuthorization.
 * EVIDIQ speaks x402 v2 only (no v1, no X-PAYMENT).
 */

export type Hex = `0x${string}`;

export type PaymentRequirements = {
  scheme: "exact";
  /** CAIP-2 network id, e.g. "eip155:196" (X Layer mainnet). */
  network: string;
  /** x402 v2 amount — atomic units, decimal string. "0" is a valid zero value. */
  amount: string;
  /** Absolute URL of the paid resource. */
  resource: string;
  description: string;
  mimeType: string;
  /** Recipient address for the payment. */
  payTo: string;
  maxTimeoutSeconds: number;
  /** ERC-20 token contract address. */
  asset: string;
  /** EIP-712 domain of the token — must match on-chain or signatures break. */
  extra: { name: string; version: string };
};

/** EIP-3009 TransferWithAuthorization message fields (uint256s as decimal strings). */
export type Eip3009Authorization = {
  from: Hex;
  to: Hex;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: Hex;
};

export type PaymentPayload = {
  x402Version: number;
  scheme: "exact";
  network: string;
  payload: {
    signature: Hex;
    authorization: Eip3009Authorization;
  };
};

export type VerifyResult =
  | { valid: true; payer: Hex }
  | { valid: false; reason: string };

export type SettleResult = {
  success: boolean;
  /** On-chain tx hash when settled; "" for zero-value/local no-op settlement. */
  transaction: string;
  payer: string;
  errorReason?: string;
};

/** Payload of the PAYMENT-RESPONSE header returned on successful paid calls. */
export type PaymentResponseHeader = {
  status: "settled" | "verified";
  transaction: string;
  amount: string;
  payer: string;
};
