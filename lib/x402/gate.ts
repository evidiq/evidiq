import { mcpEndpoint } from "@/lib/install";
import { currentBaseUrl, runWithPayment } from "@/lib/request-context";
import {
  build402Response,
  buildAccepts,
  encodePaymentResponseHeader,
} from "./challenge";
import { getX402Config } from "./config";
import { getVerifier } from "./facilitator";
import { decodePaymentHeader } from "./verify";

/**
 * x402 gate in front of the EVIDIQ MCP handler.
 *
 * - No X402_* config → transparent pass-through (free A2MCP endpoint).
 * - Free methods/tools pass through, but 406/405s from bare probes are
 *   rewritten into a 402 challenge so marketplace validators discover accepts[].
 * - tools/call on a paid tool (or everything with X402_GATE_ALL=1) requires a
 *   valid PAYMENT-SIGNATURE / X-PAYMENT header; unpaid → HTTP 402 (dual
 *   emission). The server is stateless, so a 402 never breaks an MCP session.
 */

export const PAID_TOOLS: ReadonlySet<string> = new Set(["verify_agent"]);

type JsonRpcCall = { method?: unknown; params?: { name?: unknown } };

function isPaidCall(msg: JsonRpcCall): boolean {
  return (
    msg?.method === "tools/call" &&
    typeof msg?.params?.name === "string" &&
    PAID_TOOLS.has(msg.params.name)
  );
}

function rebuildRequest(req: Request, bodyText: string): Request {
  return new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: bodyText,
  });
}

export function withX402Gate(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    const cfg = getX402Config();
    if (!cfg) return handler(req);

    const resourceUrl = mcpEndpoint(currentBaseUrl());

    if (req.method !== "POST") {
      // GET (SSE probe) / DELETE: pass through, but surface the challenge to
      // bare validator probes instead of the SDK's 406/405.
      const res = await handler(req);
      if (req.method === "GET" && (res.status === 406 || res.status === 405)) {
        return build402Response(cfg, resourceUrl);
      }
      return res;
    }

    const bodyText = await req.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      // Not JSON — let the SDK produce its own error, then rewrite 406.
    }
    const messages: JsonRpcCall[] = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object"
        ? [parsed as JsonRpcCall]
        : [];

    const gated = cfg.gateAll || messages.some(isPaidCall);
    if (!gated) {
      const res = await handler(rebuildRequest(req, bodyText));
      if (res.status === 406) {
        return build402Response(cfg, resourceUrl);
      }
      return res;
    }

    const payment = decodePaymentHeader(req);
    if (!payment) {
      return build402Response(cfg, resourceUrl, undefined);
    }

    const reqs = buildAccepts(cfg, resourceUrl)[0];
    const verifier = getVerifier(cfg);
    const verdict = await verifier.verify(payment, reqs);
    if (!verdict.valid) {
      return build402Response(
        cfg,
        resourceUrl,
        `invalid payment: ${verdict.reason}`
      );
    }

    const settlement = await verifier.settle(payment, reqs);
    if (!settlement.success) {
      return build402Response(
        cfg,
        resourceUrl,
        `settlement failed: ${settlement.errorReason ?? "unknown"}`
      );
    }

    const res = await runWithPayment(
      {
        payer: verdict.payer,
        amount: cfg.price.toString(),
        transaction: settlement.transaction,
      },
      () => handler(rebuildRequest(req, bodyText))
    );

    const headers = new Headers(res.headers);
    headers.set(
      "payment-response",
      encodePaymentResponseHeader({
        status: settlement.transaction ? "settled" : "verified",
        transaction: settlement.transaction,
        amount: cfg.price.toString(),
        payer: verdict.payer,
      })
    );
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  };
}
