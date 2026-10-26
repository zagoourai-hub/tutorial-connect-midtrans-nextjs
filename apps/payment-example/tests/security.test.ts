import { createHash } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { readEnvironment } from "../lib/env";
import { admitRequest, clearRateLimits, readJson, takeRateLimit } from "../lib/http";
import { validateRedirectUrl } from "../lib/midtrans";
import { mapPaymentStatus, nextPaymentStatus, parseRupiah, readRefundAmount } from "../lib/payment-status";
import { createSessionToken, hashSessionToken, hasOrderAccess } from "../lib/session";
import { checkoutSchema } from "../lib/validations/checkout";
import { verifySignature } from "../lib/verification";
import type { ProviderStatus } from "../lib/validations/midtrans";

const status: ProviderStatus = { order_id: "order", transaction_id: "transaction", gross_amount: "50000.00", transaction_status: "settlement" };
afterEach(clearRateLimits);

describe("input and resource boundaries", () => {
  it("requires server configuration without exposing the provided secret", () => {
    expect(() => readEnvironment({})).toThrow("Konfigurasi pembayaran tidak valid");
    expect(() => readEnvironment({ MIDTRANS_SERVER_KEY: "sensitive-key", APP_ORIGIN: "https://site.test/path" })).toThrow();
    expect(readEnvironment({ MIDTRANS_SERVER_KEY: "SB-Mid-server-test" }).MIDTRANS_IS_PRODUCTION).toBe("false");
    expect(() => readEnvironment({ MIDTRANS_SERVER_KEY: "SB-Mid-server-test", MIDTRANS_IS_PRODUCTION: "true" })).toThrow();
  });
  it.each([
    { items: [] }, { items: [{ productId: "x", quantity: 0 }] }, { items: [{ productId: "x", quantity: 11 }] },
    { items: [{ productId: "x", quantity: 1.5 }] }, { items: [{ productId: "x", quantity: 1 }], price: 1 },
    { items: [{ productId: "x", quantity: 1 }, { productId: "x", quantity: 2 }] }
  ])("rejects malformed cart %#", input => expect(checkoutSchema.safeParse(input).success).toBe(false));
  it("enforces actual streamed bytes without Content-Length", async () => {
    const request = new Request("http://localhost:3001", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [{ productId: "x", quantity: 1 }] }) });
    await expect(readJson(request, checkoutSchema, 8)).rejects.toMatchObject({ status: 413 });
  });
  it("rejects invalid JSON and non-JSON payload", async () => {
    await expect(readJson(new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }), checkoutSchema, 1024)).rejects.toMatchObject({ status: 400 });
    await expect(readJson(new Request("http://localhost", { method: "POST", body: "plain" }), checkoutSchema, 1024)).rejects.toMatchObject({ status: 415 });
  });
  it("ignores spoofed forwarded identity and enforces origin", () => {
    expect(() => admitRequest(new Request("http://localhost:3001", { headers: { Origin: "https://evil.test" } }), "checkout", "http://localhost:3001")).toThrow();
    for (let index = 0; index < 10; index++) admitRequest(new Request("http://localhost:3001", { headers: { Origin: "http://localhost:3001", "X-Forwarded-For": `1.2.3.${index}` } }), "checkout", "http://localhost:3001");
    expect(() => admitRequest(new Request("http://localhost:3001", { headers: { Origin: "http://localhost:3001", "X-Forwarded-For": "8.8.8.8" } }), "checkout", "http://localhost:3001")).toThrow();
  });
  it("expires rate counters", () => {
    takeRateLimit("key", 1, 30, 100);
    expect(() => takeRateLimit("key", 1, 30, 110)).toThrow();
    expect(() => takeRateLimit("key", 1, 30, 131)).not.toThrow();
  });
});

describe("payment integrity", () => {
  it("hashes bearer tokens and rejects cross-session/expired access", () => {
    const token = createSessionToken();
    const order = { accessTokenHash: hashSessionToken(token), accessExpiresAt: new Date(Date.now() + 1000) };
    expect(hasOrderAccess(order, token)).toBe(true);
    expect(hasOrderAccess(order, createSessionToken())).toBe(false);
    expect(hasOrderAccess(order, token, new Date(Date.now() + 2000))).toBe(false);
    expect(order.accessTokenHash).not.toBe(token);
  });
  it("verifies signature using exact original gross_amount", () => {
    const notification = { ...status, status_code: "200", signature_key: createHash("sha512").update("order20050000.00server-key").digest("hex") };
    expect(() => verifySignature(notification, "server-key")).not.toThrow();
    expect(() => verifySignature({ ...notification, gross_amount: "50000" }, "server-key")).toThrow();
    expect(() => verifySignature({ ...notification, signature_key: "" }, "server-key")).toThrow();
  });
  it.each(["-1", "1.50", "1e5", "Infinity", "100000001", "9007199254740993"])("rejects unsafe money %s", value => expect(() => parseRupiah(value)).toThrow());
  it("parses exact integer rupiah decimals", () => expect(parseRupiah("50000.00")).toBe(50_000));
  it.each([
    ["pending", undefined, "PENDING"], ["settlement", undefined, "PAID"], ["capture", "accept", "PAID"],
    ["capture", "challenge", "PENDING"], ["capture", undefined, "PENDING"], ["expire", undefined, "EXPIRED"],
    ["cancel", undefined, "CANCELED"], ["deny", undefined, "FAILED"], ["failure", undefined, "FAILED"],
    ["refund", undefined, "REFUNDED"], ["partial_refund", undefined, "PARTIALLY_REFUNDED"]
  ] as const)("maps %s/%s safely", (transaction_status, fraud_status, expected) => expect(mapPaymentStatus({ ...status, transaction_status, fraud_status })).toBe(expected));
  it("never regresses paid/refunded states", () => {
    expect(nextPaymentStatus("PAID", "PENDING", 0, 0)).toBe("PAID");
    expect(nextPaymentStatus("REFUNDED", "PAID", 50_000, 50_000)).toBe("REFUNDED");
    expect(nextPaymentStatus("PARTIALLY_REFUNDED", "PARTIALLY_REFUNDED", 5_000, 10_000)).toBe("PARTIALLY_REFUNDED");
    expect(nextPaymentStatus("PENDING", "REFUNDED", 50_000, 0)).toBe("REFUNDED");
    expect(() => mapPaymentStatus({ ...status, transaction_status: "new_unknown" })).toThrow();
  });
  it("requires verified refund amounts rather than inferring success", () => {
    expect(readRefundAmount({ ...status, transaction_status: "partial_refund", refund_amount: "10000.00" }, 50_000)).toBe(10_000);
    expect(() => readRefundAmount({ ...status, transaction_status: "refund" }, 50_000)).toThrow();
    expect(() => readRefundAmount({ ...status, transaction_status: "refund", refund_amount: "1.00" }, 50_000)).toThrow();
  });
  it.each(["http://app.sandbox.midtrans.com/x", "https://app.sandbox.midtrans.com.evil.test/x", "https://evil.test/x", "https://user@app.sandbox.midtrans.com/x"])("rejects hostile redirect %s", url => expect(() => validateRedirectUrl(url, false)).toThrow());
});
