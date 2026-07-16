import type { X402Config } from "./config";
import type {
  PaymentRequirements,
  PaymentResponseHeader,
  X402Resource,
} from "./types";

/**
 * x402 v2 challenge construction, matching the OKX A2MCP documented shape:
 *
 *   { x402Version: 2,
 *     resource: { url, description, mimeType },   // an OBJECT, not a URL string
 *     accepts: [ { scheme, network, asset, amount, payTo, maxTimeoutSeconds, extra } ] }
 *
 * The base64 of this object goes in the PAYMENT-REQUIRED response header — that
 * header is what the OKX marketplace validates (not the body) — and we mirror
 * the same object in the 402 body. EVIDIQ speaks x402 v2 only.
 */

function b64(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

const RESOURCE_DESCRIPTION =
  "EVIDIQ — x402-gated trust check (verify_agent): capability verification, risk scoring, on-chain reputation and a signed attestation anchored on 0G. The skill and install tools remain free.";

/** Top-level resource descriptor (object form, per the OKX A2MCP spec). */
function buildResource(resourceUrl: string): X402Resource {
  return {
    url: resourceUrl,
    description: RESOURCE_DESCRIPTION,
    mimeType: "application/json",
  };
}

/** Lean accepts[] entry — the price lives in `amount`; no v1 fields. */
export function buildAccepts(cfg: X402Config): PaymentRequirements[] {
  return [
    {
      scheme: "exact",
      network: cfg.network,
      asset: cfg.asset,
      amount: cfg.price.toString(),
      payTo: cfg.payTo,
      maxTimeoutSeconds: 300,
      extra: { name: cfg.domainName, version: cfg.domainVersion },
    },
  ];
}

type Challenge = {
  x402Version: 2;
  resource: X402Resource;
  accepts: PaymentRequirements[];
};

/** The canonical v2 challenge object — identical in the header and the body. */
function challenge(cfg: X402Config, resourceUrl: string): Challenge {
  return {
    x402Version: 2,
    resource: buildResource(resourceUrl),
    accepts: buildAccepts(cfg),
  };
}

function paymentRequiredHeader(cfg: X402Config, resourceUrl: string): string {
  return b64(challenge(cfg, resourceUrl));
}

/** HTTP 402 challenge (v2 PAYMENT-REQUIRED header + mirrored body). */
export function build402Response(
  cfg: X402Config,
  resourceUrl: string,
  error?: string
): Response {
  const body = {
    ...challenge(cfg, resourceUrl),
    error:
      error ??
      `Payment required. Sign the x402 v2 challenge (PAYMENT-REQUIRED header / accepts[] below) and retry with a PAYMENT-SIGNATURE header. Pricing discovery: ${resourceUrl.replace(/\/mcp$/, "")}/x402 — the skill and install tools (how_to_install, get_evidiq_skill) are free.`,
  };
  return new Response(JSON.stringify(body), {
    status: 402,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "payment-required": paymentRequiredHeader(cfg, resourceUrl),
    },
  });
}

/** 200 discovery variant for GET /x402 — same challenge object, non-error status. */
export function buildDiscoveryResponse(
  cfg: X402Config,
  resourceUrl: string
): Response {
  return new Response(JSON.stringify(challenge(cfg, resourceUrl), null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "payment-required": paymentRequiredHeader(cfg, resourceUrl),
    },
  });
}

export function encodePaymentResponseHeader(r: PaymentResponseHeader): string {
  return b64(r);
}
