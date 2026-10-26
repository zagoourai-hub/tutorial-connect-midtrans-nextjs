import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDatabase } from "../lib/prisma";
import { cartFingerprint, checkout } from "../lib/checkout";
import { readEnvironment } from "../lib/env";
import { clearRateLimits } from "../lib/http";
import { reconcileOrder } from "../lib/reconcile";
import { createSessionToken } from "../lib/session";
import type { ProviderStatus } from "../lib/validations/midtrans";

let database: ReturnType<typeof createDatabase>;
let temporaryDirectory: string;
const environment = readEnvironment({ MIDTRANS_SERVER_KEY: "SB-Mid-server-test-key" });
const input = { items: [{ productId: "demo", quantity: 2 }] };
let token: string;
let key: string;
let orderId: string;
const create = vi.fn(async () => ({ token: "test-snap-token", redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/test" }));
const status = vi.fn<() => Promise<ProviderStatus>>();
const gateway = { create, status };

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "midtrans-test-"));
  database = createDatabase(`file:${join(temporaryDirectory, "test.db")}`);
  const migration = await readFile(new URL("../prisma/migrations/202610260001_initial/migration.sql", import.meta.url), "utf8");
  for (const statement of migration.split(/;\s*(?:\r?\n|$)/).filter(value => value.trim())) await database.$executeRawUnsafe(statement);
  await database.product.create({ data: { id: "demo", name: "Produk demo", price: 25_000 } });
  token = createSessionToken(); key = randomUUID();
  create.mockClear(); status.mockReset(); clearRateLimits();
  create.mockResolvedValue({ token: "test-snap-token", redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/test" });
});

afterEach(async () => {
  await database?.$disconnect();
  if (temporaryDirectory && resolve(temporaryDirectory).startsWith(resolve(tmpdir()) + (process.platform === "win32" ? "\\" : "/"))) await rm(temporaryDirectory, { recursive: true, force: true });
});

async function createOrder() {
  const result = await checkout(database, gateway, environment, input, token, key);
  orderId = result.body.orderId;
  return result;
}

function provider(transaction_status = "settlement", extra: Partial<ProviderStatus> = {}): ProviderStatus {
  return { order_id: orderId, transaction_id: "provider-transaction", gross_amount: "50000.00", transaction_status, ...extra };
}

describe("checkout persistence and idempotency", () => {
  it("calculates snapshot from database and replays without another SDK create", async () => {
    const result = await createOrder();
    expect(result.status).toBe(201);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ transaction_details: { order_id: orderId, gross_amount: 50_000 } }));
    await database.product.update({ where: { id: "demo" }, data: { price: 5 } });
    expect((await checkout(database, gateway, environment, input, token, key)).status).toBe(200);
    expect(create).toHaveBeenCalledTimes(1);
    const saved = await database.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
    expect(saved.totalAmount).toBe(50_000); expect(saved.items[0].unitPrice).toBe(25_000);
  });
  it("rejects cross-session replay and changed cart without revealing the order", async () => {
    await createOrder();
    await expect(checkout(database, gateway, environment, input, createSessionToken(), key)).rejects.toMatchObject({ status: 404 });
    await expect(checkout(database, gateway, environment, { items: [{ productId: "demo", quantity: 1 }] }, token, key)).rejects.toMatchObject({ status: 409, code: "IDEMPOTENCY_CONFLICT" });
    expect(create).toHaveBeenCalledTimes(1);
  });
  it("never retries an ambiguous create", async () => {
    create.mockRejectedValueOnce(new Error("timeout"));
    expect((await createOrder()).status).toBe(202);
    expect((await checkout(database, gateway, environment, input, token, key)).status).toBe(202);
    expect(create).toHaveBeenCalledTimes(1);
    expect((await database.payment.findUniqueOrThrow({ where: { orderId } })).creationStatus).toBe("UNKNOWN");
  });
  it("records definitive provider rejection and rejects terminal replay", async () => {
    create.mockRejectedValueOnce({ httpStatusCode: 400 });
    await expect(createOrder()).rejects.toMatchObject({ status: 502 });
    await expect(checkout(database, gateway, environment, input, token, key)).rejects.toMatchObject({ status: 409, code: "CHECKOUT_FAILED" });
    expect(create).toHaveBeenCalledTimes(1);
  });
  it("rolls back missing product and invalid total without partial orders", async () => {
    await expect(checkout(database, gateway, environment, { items: [{ productId: "missing", quantity: 1 }] }, token, key)).rejects.toMatchObject({ status: 404 });
    await database.product.update({ where: { id: "demo" }, data: { price: 100_000_000 } });
    await expect(createOrder()).rejects.toMatchObject({ status: 400 });
    expect(await database.order.count()).toBe(0); expect(await database.payment.count()).toBe(0);
  });
  it("normalizes fingerprint by product ID", () => {
    const first = { productId: "one", quantity: 1 }, second = { productId: "two", quantity: 2 };
    expect(cartFingerprint({ items: [first, second] })).toBe(cartFingerprint({ items: [second, first] }));
  });
  it("enforces database foreign keys and financial delete restriction", async () => {
    await createOrder();
    await expect(database.product.delete({ where: { id: "demo" } })).rejects.toThrow();
    await expect(database.orderItem.create({ data: { orderId, productId: "missing", productName: "Missing", quantity: 1, unitPrice: 1, subtotal: 1 } })).rejects.toThrow();
  });
});

describe("provider verification and atomic transitions", () => {
  beforeEach(createOrder);
  it("applies settlement once and ignores duplicate/older pending", async () => {
    status.mockResolvedValue(provider());
    expect((await reconcileOrder(database, gateway, orderId, undefined))?.paymentStatus).toBe("PAID");
    const first = await database.order.findUniqueOrThrow({ where: { id: orderId } });
    clearRateLimits();
    await reconcileOrder(database, gateway, orderId);
    expect((await database.order.findUniqueOrThrow({ where: { id: orderId } })).revision).toBe(first.revision);
    clearRateLimits(); status.mockResolvedValue(provider("pending"));
    expect((await reconcileOrder(database, gateway, orderId))?.paymentStatus).toBe("PAID");
  });
  it("rejects amount/identity mismatch and unknown status without mutation", async () => {
    for (const response of [provider("settlement", { gross_amount: "1.00" }), provider("settlement", { order_id: "foreign" }), provider("unknown")]) {
      clearRateLimits(); status.mockResolvedValue(response);
      await expect(reconcileOrder(database, gateway, orderId)).rejects.toThrow();
      expect((await database.order.findUniqueOrThrow({ where: { id: orderId } })).paymentStatus).toBe("PENDING");
    }
  });
  it("does not mark capture challenge as paid", async () => {
    status.mockResolvedValue(provider("capture", { fraud_status: "challenge" }));
    expect((await reconcileOrder(database, gateway, orderId))?.paymentStatus).toBe("PENDING");
  });
  it("accepts verified refund before PAID and never reduces refund totals", async () => {
    status.mockResolvedValue(provider("partial_refund", { refund_amount: "10000.00" }));
    expect((await reconcileOrder(database, gateway, orderId))?.paymentStatus).toBe("PARTIALLY_REFUNDED");
    clearRateLimits(); status.mockResolvedValue(provider("partial_refund", { refund_amount: "5000.00" }));
    await reconcileOrder(database, gateway, orderId);
    expect((await database.payment.findUniqueOrThrow({ where: { orderId } })).refundedAmount).toBe(10_000);
    clearRateLimits(); status.mockResolvedValue(provider("refund", { refund_amount: "50000.00" }));
    expect((await reconcileOrder(database, gateway, orderId))?.paymentStatus).toBe("REFUNDED");
  });
  it("returns retryable error after provider timeout with status unchanged", async () => {
    status.mockRejectedValue(new Error("network secret must never be exposed"));
    await expect(reconcileOrder(database, gateway, orderId)).rejects.toMatchObject({ status: 503, code: "PROVIDER_UNAVAILABLE" });
    expect((await database.order.findUniqueOrThrow({ where: { id: orderId } })).paymentStatus).toBe("PENDING");
  });
});
