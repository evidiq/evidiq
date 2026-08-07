/**
 * Blog image generation via the 0G Compute router — z-image-turbo.
 *
 * Same provider and same key as the article writer (BLOG_LLM_API_KEY +
 * BLOG_LLM_BASE_URL, the router at router-api.0g.ai/v1): the whole blog
 * pipeline now runs on one 0G account instead of splitting text (0G) and
 * images (DigitalOcean). z-image-turbo reports text->image, tee_attested true
 * on the router registry.
 *
 * The router's /images/generations returns the image base64 in data[0].b64_json
 * plus an x_0g_trace (provider, request_id, billing) on every call.
 */

export interface OgImageResult {
  b64: string;
  contentType: string;
  model: string;
  provider?: string;
  requestId?: string;
}

export async function generateImageOg(opts: {
  apiKey: string;
  baseUrl: string;
  prompt: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}): Promise<OgImageResult> {
  if (!opts.apiKey) throw new Error("0G image API key not configured");
  if (!opts.prompt || !opts.prompt.trim()) throw new Error("Empty image prompt");

  const res = await fetch(`${opts.baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({ model: "z-image-turbo", prompt: opts.prompt.trim(), n: 1 }),
    signal: opts.signal ?? AbortSignal.timeout(opts.timeoutMs ?? 120_000),
  });
  if (!res.ok) {
    const b = await res.text().catch(() => "");
    throw new Error(`0G image HTTP ${res.status}: ${b.slice(0, 200)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("0G image: result had no b64_json");
  return {
    b64,
    contentType: "image/png",
    model: "z-image-turbo",
    provider: json?.x_0g_trace?.provider,
    requestId: json?.x_0g_trace?.request_id,
  };
}
