import { NextResponse } from "next/server";
import type { z } from "zod";
import { PaymentError, invalidRequest } from "./errors";

const counters = new Map<string, { count: number; expiresAt: number }>();

export function takeRateLimit(key: string, limit: number, windowMs = 60_000, now = Date.now()) {
  for (const [storedKey, counter] of counters) if (counter.expiresAt <= now) counters.delete(storedKey);
  const counter = counters.get(key);
  if ((!counter && counters.size >= 5000) || (counter && counter.count >= limit)) {
    throw new PaymentError(429, "RATE_LIMITED", "Terlalu banyak permintaan; coba lagi nanti", 60);
  }
  counters.set(key, { count: (counter?.count ?? 0) + 1, expiresAt: counter?.expiresAt ?? now + windowMs });
}

export function clearRateLimits() {
  counters.clear();
}

export function admitRequest(request: Request, operation: "session" | "checkout" | "webhook", origin: string) {
  if (operation !== "webhook" && request.headers.get("origin") !== origin) {
    throw new PaymentError(403, "ORIGIN_FORBIDDEN", "Origin tidak diizinkan");
  }
  takeRateLimit(`${operation}:global`, operation === "webhook" ? 120 : 100);
  // shortcut: local clients share a conservative quota; use trusted ingress identity before public hosting.
  if (operation !== "webhook") takeRateLimit(`${operation}:local-client`, 10);
}

export async function readJson<T>(request: Request, schema: z.ZodType<T>, maxBytes: number): Promise<T> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json" ||
      ![null, "identity"].includes(request.headers.get("content-encoding"))) {
    throw new PaymentError(415, "UNSUPPORTED_MEDIA_TYPE", "Gunakan application/json tanpa kompresi");
  }
  const reader = request.body?.getReader();
  if (!reader) invalidRequest();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new PaymentError(413, "PAYLOAD_TOO_LARGE", "Payload terlalu besar");
    }
    chunks.push(value);
  }
  let input: unknown;
  try {
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  } catch { invalidRequest("JSON tidak valid"); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) invalidRequest();
  return parsed.data;
}

export function jsonResponse(body: unknown, status = 200, retryAfter?: number) {
  return NextResponse.json(body, { status, headers: {
    "Cache-Control": "private, no-store, max-age=0",
    ...(retryAfter ? { "Retry-After": String(retryAfter) } : {})
  } });
}

export function errorResponse(error: unknown) {
  if (error instanceof PaymentError) {
    return jsonResponse({ error: { code: error.code, message: error.message } }, error.status, error.retryAfter);
  }
  console.error("Operasi pembayaran tidak tersedia; periksa konfigurasi dan database lokal.");
  return jsonResponse({ error: { code: "STORAGE_UNAVAILABLE", message: "Layanan pembayaran belum tersedia" } }, 503);
}
