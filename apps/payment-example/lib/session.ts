import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { PaymentError } from "./errors";

export const SESSION_COOKIE = "checkout_session";
export const ACCESS_LIFETIME_MS = 24 * 60 * 60 * 1000;
export const isSessionToken = (value: unknown): value is string => typeof value === "string" && /^[a-zA-Z0-9_-]{43}$/.test(value);
export const createSessionToken = () => randomBytes(32).toString("base64url");
export const hashSessionToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function requireSessionToken(value: unknown): string {
  if (!isSessionToken(value)) throw new PaymentError(401, "SESSION_REQUIRED", "Inisialisasikan sesi sebelum checkout");
  return value;
}

export function hasOrderAccess(order: { accessTokenHash: string; accessExpiresAt: Date }, token: unknown, now = new Date()) {
  if (!isSessionToken(token) || order.accessExpiresAt <= now || !/^[a-f0-9]{64}$/.test(order.accessTokenHash)) return false;
  return timingSafeEqual(Buffer.from(order.accessTokenHash, "hex"), Buffer.from(hashSessionToken(token), "hex"));
}
