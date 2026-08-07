/**
 * DigitalOcean image generation — ported verbatim (interface + behavior) from
 * ZYVA's engine/providers/doImage.ts. Reuses the SAME DO Inference account/key
 * as ZYVA (BLOG_DO_API_KEY = the value of ZYVA's ZYVA_DO_API_KEY), per the
 * user's explicit decision to share the DO image quota across both apps.
 *
 * Two backends on the same DO key:
 *  1) FLUX schnell (default) — async via /v1/async-invoke (submit → poll → URL).
 *  2) Stable Diffusion 3.5 Large (fallback, only if a prompt needs legible text).
 */

const DO_BASE = "https://inference.do-ai.run/v1";

export const FLUX_MODEL = process.env.BLOG_IMAGE_MODEL || "fal-ai/flux/schnell";
export const TEXT_IMAGE_MODEL =
  process.env.BLOG_IMAGE_TEXT_MODEL || "stable-diffusion-3.5-large";

export interface GenerateImageResult {
  url?: string;
  b64?: string;
  width?: number;
  height?: number;
  contentType?: string;
  model: string;
}

export function imageNeedsText(prompt: string): boolean {
  const p = (prompt || "").toLowerCase();
  return (
    /\b(logo|wordmark|banner|poster|typograph|headline text|text that says|with the (?:word|text)|slogan|sign that reads)\b/.test(
      p
    ) || /["“'].{1,40}["”']/.test(prompt)
  );
}

export function pickImageModel(prompt: string, opts?: { model?: string; hasText?: boolean }): string {
  if (opts?.model) return opts.model;
  const needsText = opts?.hasText ?? imageNeedsText(prompt);
  return needsText ? TEXT_IMAGE_MODEL : FLUX_MODEL;
}

const isAsyncModel = (model: string) => /^fal-ai\//.test(model);

export async function generateImageDo(
  apiKey: string,
  prompt: string,
  opts: {
    model?: string;
    hasText?: boolean;
    imageSize?: string;
    outputFormat?: string;
    signal?: AbortSignal;
    pollMs?: number;
    timeoutMs?: number;
  } = {}
): Promise<GenerateImageResult> {
  if (!apiKey) throw new Error("DO image API key not configured");
  if (!prompt || !prompt.trim()) throw new Error("Empty image prompt");
  const model = pickImageModel(prompt, opts);
  return isAsyncModel(model)
    ? generateAsync(apiKey, model, prompt.trim(), opts)
    : generateSync(apiKey, model, prompt.trim(), opts);
}

/**
 * Dispatcher. Default provider is the 0G router's z-image-turbo — the same
 * account the article writer uses (BLOG_LLM_API_KEY / BLOG_LLM_BASE_URL) — so
 * text and images come from one provider. DigitalOcean (BLOG_DO_API_KEY) is
 * kept as the fallback and can be forced with BLOG_IMAGE_PROVIDER=do.
 */
export async function generateImage(
  prompt: string,
  opts: {
    hasText?: boolean;
    imageSize?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
  } = {}
): Promise<GenerateImageResult> {
  if (!prompt || !prompt.trim()) throw new Error("Empty image prompt");

  const provider = (process.env.BLOG_IMAGE_PROVIDER || "og").toLowerCase();
  const ogKey = process.env.BLOG_LLM_API_KEY || "";
  const ogBase = process.env.BLOG_LLM_BASE_URL || "https://router-api.0g.ai/v1";
  const doKey = process.env.BLOG_DO_API_KEY || "";

  const tryOg = async (): Promise<GenerateImageResult> => {
    const { generateImageOg } = await import("./ogImage");
    const r = await generateImageOg({
      apiKey: ogKey,
      baseUrl: ogBase,
      prompt: prompt.trim(),
      signal: opts.signal,
      timeoutMs: opts.timeoutMs ?? 120_000,
    });
    return { b64: r.b64, contentType: r.contentType, model: r.model };
  };
  const tryDo = (): Promise<GenerateImageResult> =>
    generateImageDo(doKey, prompt, { ...opts, imageSize: opts.imageSize ?? "landscape_16_9" });

  const primary = provider === "do" ? tryDo : tryOg;
  const fallback = provider === "do" ? tryOg : tryDo;
  const primaryReady = provider === "do" ? Boolean(doKey) : Boolean(ogKey);
  const fallbackReady = provider === "do" ? Boolean(ogKey) : Boolean(doKey);

  try {
    if (!primaryReady) throw new Error(`${provider} image key not configured`);
    return await primary();
  } catch (primaryErr) {
    if (fallbackReady) {
      try {
        return await fallback();
      } catch (fallbackErr) {
        throw new Error(
          `image generation failed (${provider}: ${(primaryErr as Error).message}; fallback: ${(fallbackErr as Error).message})`
        );
      }
    }
    throw primaryErr;
  }
}

async function generateAsync(
  apiKey: string,
  model: string,
  prompt: string,
  opts: { imageSize?: string; outputFormat?: string; signal?: AbortSignal; pollMs?: number; timeoutMs?: number }
): Promise<GenerateImageResult> {
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
  const input: Record<string, unknown> = { prompt, num_images: 1 };
  if (opts.imageSize) input.image_size = opts.imageSize;
  if (opts.outputFormat) input.output_format = opts.outputFormat;

  const submitRes = await fetch(`${DO_BASE}/async-invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model_id: model, input }),
    signal: opts.signal ?? AbortSignal.timeout(30_000),
  });
  if (!submitRes.ok) {
    const b = await submitRes.text().catch(() => "");
    throw new Error(`DO image submit HTTP ${submitRes.status}: ${b.slice(0, 200)}`);
  }
  const submit = await submitRes.json();
  const requestId: string = submit.request_id;
  if (!requestId) throw new Error("DO image: no request_id returned");

  const pollMs = opts.pollMs ?? 2_000;
  const deadline = Date.now() + (opts.timeoutMs ?? 90_000);
  let status = String(submit.status || "QUEUED").toUpperCase();
  while (!["COMPLETED", "FAILED", "ERROR"].includes(status)) {
    if (Date.now() > deadline) throw new Error("DO image generation timed out");
    await new Promise((r) => setTimeout(r, pollMs));
    const st = await fetch(`${DO_BASE}/async-invoke/${requestId}/status`, { headers, signal: opts.signal });
    if (!st.ok) continue;
    const sj = await st.json().catch(() => ({}));
    status = String(sj.status || status).toUpperCase();
  }
  if (status !== "COMPLETED") throw new Error(`DO image generation ${status.toLowerCase()}`);

  const resRes = await fetch(`${DO_BASE}/async-invoke/${requestId}`, { headers, signal: opts.signal });
  if (!resRes.ok) {
    const b = await resRes.text().catch(() => "");
    throw new Error(`DO image result HTTP ${resRes.status}: ${b.slice(0, 200)}`);
  }
  const result = await resRes.json();
  const img = result?.output?.images?.[0];
  if (!img?.url) throw new Error("DO image: result had no image URL");
  return { url: img.url, width: img.width, height: img.height, contentType: img.content_type, model };
}

async function generateSync(
  apiKey: string,
  model: string,
  prompt: string,
  opts: { signal?: AbortSignal; timeoutMs?: number }
): Promise<GenerateImageResult> {
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
  const res = await fetch(`${DO_BASE}/images/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, prompt, n: 1 }),
    signal: opts.signal ?? AbortSignal.timeout(opts.timeoutMs ?? 90_000),
  });
  if (!res.ok) {
    const b = await res.text().catch(() => "");
    throw new Error(`DO image (sync) HTTP ${res.status}: ${b.slice(0, 200)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("DO image (sync): result had no b64_json");
  return { b64, contentType: "image/png", model };
}
