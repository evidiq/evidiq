import type { X402Config } from "./config";
import type { PaymentRequirements, PaymentResponseHeader } from "./types";

/**
 * x402 challenge construction, standardized on v2:
 * - PAYMENT-REQUIRED response header: base64 JSON {x402Version: 2, resource, accepts}
 * - response body: {x402Version: 2, resource, accepts} (+ error on a 402)
 * Each accepts[] entry carries `amount` (v2) and, as an alias, `maxAmountRequired`
 * (v1) so both v2 and legacy v1 payers resolve the same price.
 */

function b64(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

const RESOURCE_DESCRIPTION =
  "EVIDIQ — x402-gated trust check (verify_agent): capability verification, risk scoring, on-chain reputation and a signed attestation anchored on 0G. The skill and install tools remain free.";

export function buildAccepts(
  cfg: X402Config,
  resourceUrl: string
): PaymentRequirements[] {
  // x402 v2 uses `amount`; we also emit `maxAmountRequired` (= amount) so
  // legacy v1 payers keep resolving the price. Same value in both fields.
  const amount = cfg.price.toString();
  return [
    {
      scheme: "exact",
      network: cfg.network,
      amount,
      maxAmountRequired: amount,
      resource: resourceUrl,
      description: RESOURCE_DESCRIPTION,
      mimeType: "application/json",
      payTo: cfg.payTo,
      maxTimeoutSeconds: 300,
      asset: cfg.asset,
      extra: { name: cfg.domainName, version: cfg.domainVersion },
    },
  ];
}

function paymentRequiredHeader(
  accepts: PaymentRequirements[],
  resourceUrl: string
): string {
  return b64({ x402Version: 2, resource: resourceUrl, accepts });
}

/** HTTP 402 challenge (v2 header + v1 body). */
export function build402Response(
  cfg: X402Config,
  resourceUrl: string,
  error?: string
): Response {
  const accepts = buildAccepts(cfg, resourceUrl);
  const body = {
    x402Version: 2,
    resource: resourceUrl,
    error:
      error ??
      `Payment required. Sign the x402 challenge (PAYMENT-REQUIRED header / accepts[] below) and retry with a PAYMENT-SIGNATURE or X-PAYMENT header. Pricing discovery: ${resourceUrl.replace(/\/mcp$/, "")}/x402 — the skill and install tools (how_to_install, get_evidiq_skill) are free.`,
    accepts,
  };
  return new Response(JSON.stringify(body), {
    status: 402,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "payment-required": paymentRequiredHeader(accepts, resourceUrl),
    },
  });
}

/** 200 discovery variant for GET /x402 — same payload, non-error status. */
export function buildDiscoveryResponse(
  cfg: X402Config,
  resourceUrl: string
): Response {
  const accepts = buildAccepts(cfg, resourceUrl);
  const body = { x402Version: 2, resource: resourceUrl, accepts };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "payment-required": paymentRequiredHeader(accepts, resourceUrl),
    },
  });
}

export function encodePaymentResponseHeader(r: PaymentResponseHeader): string {
  return b64(r);
}
