import { NextResponse } from "next/server";
import { z } from "zod";
import { probeEndpoint } from "@/lib/trust/probe";
import { assessAgent } from "@/lib/trust/score";
import { resolveErc8004Identity } from "@/lib/trust/erc8004";
import { analyzeTrust } from "@/lib/og/compute";
import { attestReport } from "@/lib/og/attest";
import type { AgentDescriptor, AgentIdentity } from "@/lib/trust/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Public demo surface for the /playground page. Runs the EXACT same trust
 * pipeline as the paid `verify_agent` MCP tool — probe → score → 0G AI
 * analysis → attest — so the playground shows real verdicts, not a mockup.
 *
 * This route is intentionally free (no x402 gate): it's the human-facing demo,
 * while programmatic agents pay via the MCP endpoint. Because it takes a
 * caller-supplied URL and fetches it server-side, we reject internal /
 * loopback / link-local / metadata hosts to limit SSRF before probing.
 */

const Body = z.object({
  agentId: z.string().trim().min(1).max(200),
  endpoint: z.string().trim().max(400).nullish(),
  declaredCapabilities: z.array(z.string().trim().max(120)).max(32).nullish(),
  framework: z.string().trim().max(120).nullish(),
  identity: z
    .object({
      address: z.string().trim().max(120).nullish(),
      ens: z.string().trim().max(200).nullish(),
      erc8004Id: z.string().trim().max(120).nullish(),
      domain: z.string().trim().max(253).nullish(),
    })
    .nullish(),
  context: z.string().trim().max(800).nullish(),
});

/**
 * Reject endpoints that resolve to obviously-internal targets. A bare hostname
 * without a scheme (unparseable as a URL) is allowed through — probeEndpoint
 * handles it as an invalid-URL signal without issuing any network request.
 */
function endpointAllowed(endpoint?: string): boolean {
  if (!endpoint) return true;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return true; // not a URL → probe reports "invalid URL", no fetch happens
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return false;
  }

  // Literal IPv4 — block loopback / private / link-local / CGNAT / metadata.
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = Number(v4[1]);
    const b = Number(v4[2]);
    if (a === 0 || a === 127 || a === 10) return false;
    if (a === 169 && b === 254) return false; // link-local + 169.254.169.254
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT
  }

  // Literal IPv6 — block loopback / link-local / unique-local.
  if (
    host === "::1" ||
    host.startsWith("fe80") ||
    host.startsWith("fc") ||
    host.startsWith("fd")
  ) {
    return false;
  }

  return true;
}

export async function POST(req: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (!endpointAllowed(data.endpoint ?? undefined)) {
    return NextResponse.json(
      {
        error:
          "Endpoint host is not allowed. Internal, loopback, and link-local addresses are blocked in the demo.",
      },
      { status: 400 }
    );
  }

  // Schema is nullish on optional fields; normalize null → undefined so the
  // trust pipeline receives clean AgentDescriptor / AgentIdentity types.
  const rawIdentity = data.identity ?? undefined;
  const identity: AgentIdentity | undefined = rawIdentity
    ? {
        address: rawIdentity.address ?? undefined,
        ens: rawIdentity.ens ?? undefined,
        erc8004Id: rawIdentity.erc8004Id ?? undefined,
        domain: rawIdentity.domain ?? undefined,
      }
    : undefined;

  const input: AgentDescriptor = {
    agentId: data.agentId,
    endpoint: data.endpoint || undefined,
    declaredCapabilities: data.declaredCapabilities?.filter(Boolean),
    framework: data.framework || undefined,
    identity,
    context: data.context || undefined,
  };

  // Same pipeline as the paid MCP tool.
  const [probe, erc8004] = await Promise.all([
    probeEndpoint(input.endpoint),
    resolveErc8004Identity(input.identity),
  ]);
  const report = assessAgent(input, probe, erc8004);
  const analysis = await analyzeTrust(report);
  if (analysis) report.analysis = analysis;
  report.attestation = await attestReport(report);

  return NextResponse.json({ report });
}
