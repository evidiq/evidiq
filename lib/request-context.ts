import { AsyncLocalStorage } from "node:async_hooks";
import { PROD_BASE_URL, normalizeBaseUrl } from "./install";

type PaymentCtx = { payer: string; amount: string; transaction: string };
type Ctx = { baseUrl: string; payment?: PaymentCtx };

const storage = new AsyncLocalStorage<Ctx>();

/** Derive the public base URL (proto://host) from an incoming request. */
export function baseUrlFromRequest(req: Request): string {
  try {
    const url = new URL(req.url);
    const proto =
      req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    const host =
      req.headers.get("x-forwarded-host") ??
      req.headers.get("host") ??
      url.host;
    return normalizeBaseUrl(`${proto}://${host}`);
  } catch {
    return PROD_BASE_URL;
  }
}

export function runWithBaseUrl<T>(baseUrl: string, fn: () => T): T {
  return storage.run({ baseUrl }, fn);
}

export function currentBaseUrl(): string {
  return storage.getStore()?.baseUrl ?? PROD_BASE_URL;
}

/** Run fn with a verified payment attached, preserving the current base URL. */
export function runWithPayment<T>(payment: PaymentCtx, fn: () => T): T {
  const baseUrl = currentBaseUrl();
  return storage.run({ baseUrl, payment }, fn);
}

export function currentPayment(): PaymentCtx | undefined {
  return storage.getStore()?.payment;
}
