import type { EndpointProbe } from "./types";

/**
 * Safe, bounded live probe of an agent endpoint. Never throws — a probe that
 * fails is itself a trust signal. We only issue GET requests and read headers /
 * a small prefix of the body; we never follow the endpoint's instructions.
 */
export async function probeEndpoint(
  endpoint?: string
): Promise<EndpointProbe> {
  if (!endpoint) {
    return {
      attempted: false,
      reachable: false,
      tls: false,
      advertisesX402: false,
      servesSkill: false,
      note: "no endpoint supplied",
    };
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return {
      attempted: true,
      reachable: false,
      tls: false,
      advertisesX402: false,
      servesSkill: false,
      note: "endpoint is not a valid URL",
    };
  }

  const tls = url.protocol === "https:";

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "evidiq-trust-probe" },
      signal: AbortSignal.timeout(6_000),
    });

    const paymentHeader =
      res.headers.get("payment-required") ??
      res.headers.get("www-authenticate");
    const advertisesX402 =
      res.status === 402 || (paymentHeader?.toLowerCase().includes("x402") ?? false);

    const contentType = res.headers.get("content-type") ?? "";
    let servesSkill =
      contentType.includes("markdown") || contentType.includes("json");

    // Read a small prefix to look for a skill / agent-card fingerprint.
    try {
      const text = (await res.text()).slice(0, 4096).toLowerCase();
      if (
        text.includes("skill") ||
        text.includes("mcpservers") ||
        text.includes("agent card") ||
        text.includes("x402")
      ) {
        servesSkill = true;
      }
    } catch {
      // body unavailable — headers alone still inform the probe
    }

    return {
      attempted: true,
      reachable: res.status < 500,
      status: res.status,
      tls,
      advertisesX402,
      servesSkill,
      note: `HTTP ${res.status}`,
    };
  } catch (err) {
    const isTimeout = (err as Error).name === "TimeoutError";
    return {
      attempted: true,
      reachable: false,
      tls,
      advertisesX402: false,
      servesSkill: false,
      note: isTimeout ? "endpoint timed out (6s)" : "endpoint unreachable",
    };
  }
}
