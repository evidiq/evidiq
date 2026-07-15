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
 * - Free tools/methods (how_to_install, get_evidiq_skill, initialize,
 *   tools/list, …) ALWAYS pass through — only PAID_TOOLS (or everything when
 *   X402_GATE_ALL=1) require payment. A content-negotiation 406 is NEVER
 *   turned into a 402 on the tool path, so free tools can never look paid.
 * - tools/call on a paid tool requires a valid PAYMENT-SIGNATURE / X-PAYMENT
 *   header; unpaid → HTTP 402. The server is stateless, so a 402 never breaks
 *   an MCP session.
 * - Accept-header leniency: the MCP Streamable-HTTP transport requires the
 *   caller to Accept BOTH application/json and text/event-stream, and 406s
 *   otherwise. Many x402 callers only send `application/json`. We normalize the
 *   Accept header the handler sees so those callers are not rejected, and when
 *   the caller did not ask for text/event-stream we unwrap the SSE response
 *   back into a plain application/json body (standard HTTP behavior).
 */

export const PAID_TOOLS: ReadonlySet<string> = new Set(["verify_agent"]);

/** Accept value the MCP Streamable-HTTP transport needs to not return 406. */
const ACCEPT_BOTH = "application/json, text/event-stream";

type JsonRpcCall = { method?: unknown; params?: { name?: unknown } };

function isPaidCall(msg: JsonRpcCall): boolean {
  return (
    msg?.method === "tools/call" &&
    typeof msg?.params?.name === "string" &&
    PAID_TOOLS.has(msg.params.name)
  );
}

/** Did the original caller explicitly accept an SSE (text/event-stream) body? */
function acceptsEventStream(accept: string | null): boolean {
  if (!accept) return false;
  return (
    accept.includes("text/event-stream") ||
    accept.includes("*/*") ||
    accept.includes("text/*")
  );
}

/**
 * Rebuild the request for the MCP handler with a spec-compliant Accept header.
 * Callers that omit Accept or send only `application/json` would otherwise be
 * rejected with 406 "Not Acceptable" by the Streamable-HTTP transport.
 */
function handlerRequest(req: Request, bodyText: string): Request {
  const headers = new Headers(req.headers);
  headers.set("accept", ACCEPT_BOTH);
  return new Request(req.url, {
    method: req.method,
    headers,
    body: bodyText,
  });
}

/** Extract the JSON-RPC message(s) carried in an SSE `data:` stream. */
function parseSseData(sse: string): unknown[] {
  const out: unknown[] = [];
  for (const block of sse.split(/\r?\n\r?\n/)) {
    const data = block
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).replace(/^ /, ""))
      .join("\n");
    if (!data) continue;
    try {
      out.push(JSON.parse(data));
    } catch {
      // Non-JSON SSE comment/keepalive — ignore.
    }
  }
  return out;
}

/**
 * Finalize the handler response. When the caller did not accept
 * text/event-stream, convert the transport's SSE body into a single
 * application/json response so plain-HTTP x402 callers can parse it. Merges any
 * extra headers (e.g. payment-response) either way.
 */
async function finalize(
  res: Response,
  clientWantsEventStream: boolean,
  extraHeaders?: Record<string, string>
): Promise<Response> {
  const isSse = (res.headers.get("content-type") ?? "").includes(
    "text/event-stream"
  );

  if (clientWantsEventStream || !isSse) {
    if (!extraHeaders) return res;
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(extraHeaders)) headers.set(k, v);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }

  const messages = parseSseData(await res.text());
  const payload = messages.length === 1 ? messages[0] : messages;
  const headers = new Headers(res.headers);
  headers.set("content-type", "application/json");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) headers.set(k, v);
  }
  return new Response(JSON.stringify(payload), {
    status: res.status,
    statusText: res.statusText,
    headers,
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
      // GET (SSE session channel) / DELETE (session end): pass through. A bare
      // GET probe with an incompatible Accept surfaces the challenge so
      // validators can still discover accepts[] (pricing also at GET /x402).
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
      // Not JSON — the SDK will produce its own JSON-RPC error.
    }
    const messages: JsonRpcCall[] = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object"
        ? [parsed as JsonRpcCall]
        : [];

    const clientWantsEventStream = acceptsEventStream(
      req.headers.get("accept")
    );

    // Free path: everything except paid tools (or everything when gateAll).
    // We NEVER convert a 406 here into a 402 — a free tool must never look paid.
    const gated = cfg.gateAll || messages.some(isPaidCall);
    if (!gated) {
      const res = await handler(handlerRequest(req, bodyText));
      return finalize(res, clientWantsEventStream);
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
      () => handler(handlerRequest(req, bodyText))
    );

    return finalize(res, clientWantsEventStream, {
      "payment-response": encodePaymentResponseHeader({
        status: settlement.transaction ? "settled" : "verified",
        transaction: settlement.transaction,
        amount: cfg.price.toString(),
        payer: verdict.payer,
      }),
    });
  };
}
