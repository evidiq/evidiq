import { mcpEndpoint } from "@/lib/install";
import { baseUrlFromRequest } from "@/lib/request-context";
import { buildDiscoveryResponse } from "@/lib/x402/challenge";
import { getX402Config } from "@/lib/x402/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * x402 pricing / challenge discovery for marketplace validators (e.g. OKX).
 * Static route — wins over the [transport] dynamic segment. Returns 404 when
 * x402 is not configured (the endpoint is running free).
 */
export function GET(req: Request): Response {
  const cfg = getX402Config();
  if (!cfg) {
    return new Response(
      JSON.stringify({
        error: "x402 not configured on this deployment (endpoint is free)",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      }
    );
  }
  return buildDiscoveryResponse(cfg, mcpEndpoint(baseUrlFromRequest(req)));
}
