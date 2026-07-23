import { NextResponse, type NextRequest } from "next/server";

/**
 * CORS for the public MCP / x402 discovery / skill surfaces.
 *
 * The three sibling MCP services (Notary, Operator, Sentinel) run a raw
 * Node HTTP server and set these headers on every response; Core runs on
 * Next.js App Router, which has no such default. Marketplace validators
 * (e.g. OKX A2MCP) and browser-based MCP clients rely on these headers
 * being present and consistent across all four EVIDIQ services.
 *
 * PAYMENT-SIGNATURE is included because /mcp reads the x402 v2 payment
 * proof from that header (see lib/x402/verify.ts).
 */
const ALLOW_HEADERS =
  "Content-Type, Authorization, PAYMENT-SIGNATURE, MCP-Protocol-Version";
const ALLOW_METHODS = "GET, POST, DELETE, OPTIONS";

export function middleware(req: NextRequest): NextResponse {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": ALLOW_METHODS,
        "Access-Control-Allow-Headers": ALLOW_HEADERS,
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", ALLOW_METHODS);
  res.headers.set("Access-Control-Allow-Headers", ALLOW_HEADERS);
  return res;
}

export const config = {
  matcher: ["/mcp", "/sse", "/message", "/x402", "/skill.md"],
};
