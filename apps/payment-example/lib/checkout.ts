import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { PrismaClient } from "../generated/prisma/client";
import type { Environment } from "./env";
import { PaymentError } from "./errors";
import { isDefinitiveCreateFailure, type PaymentGateway } from "./midtrans";
import { ACCESS_LIFETIME_MS, hasOrderAccess, hashSessionToken } from "./session";
import type { CheckoutInput } from "./validations/checkout";

const includeOrder = { items: true, payment: true } as const;
export type StoredOrder = NonNullable<Awaited<ReturnType<typeof findOrder>>>;

export function findOrder(database: PrismaClient, id: string) {
  return database.order.findUnique({ where: { id }, include: includeOrder });
}

export function cartFingerprint(input: CheckoutInput) {
  const items = input.items.toSorted((left, right) => left.productId.localeCompare(right.productId));
  return createHash("sha256").update(JSON.stringify(items)).digest("hex");
}

function verifyReplay(order: StoredOrder, token: string, fingerprint: string) {
  if (!hasOrderAccess(order, token)) throw new PaymentError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan");
  if (order.cartFingerprint !== fingerprint) throw new PaymentError(409, "IDEMPOTENCY_CONFLICT", "Key ini sudah dipakai untuk keranjang berbeda");
}

async function reserveOrder(database: PrismaClient, input: CheckoutInput, token: string, key: string) {
  const fingerprint = cartFingerprint(input);
  const existing = await database.order.findUnique({ where: { idempotencyKey: key }, include: includeOrder });
  if (existing) {
    verifyReplay(existing, token, fingerprint);
    return { order: existing, created: false };
  }
  try {
    const order = await database.$transaction(async transaction => {
      const products = await transaction.product.findMany({ where: { id: { in: input.items.map(item => item.productId) }, isActive: true } });
      if (products.length !== input.items.length) throw new PaymentError(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan atau tidak aktif");
      const items = input.items.map(item => {
        const product = products.find(product => product.id === item.productId);
        if (!product || !Number.isSafeInteger(product.price) || product.price <= 0) throw new PaymentError(503, "STORAGE_UNAVAILABLE", "Harga produk belum valid");
        return { productId: product.id, productName: product.name, unitPrice: product.price, quantity: item.quantity, subtotal: product.price * item.quantity };
      });
      const totalAmount = items.reduce((total, item) => total + item.subtotal, 0);
      if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0 || totalAmount > 100_000_000) {
        throw new PaymentError(400, "INVALID_REQUEST", "Total melebihi batas transaksi contoh");
      }
      return transaction.order.create({ data: {
        id: `ord_${randomUUID().replaceAll("-", "")}`,
        idempotencyKey: key,
        accessTokenHash: hashSessionToken(token),
        accessExpiresAt: new Date(Date.now() + ACCESS_LIFETIME_MS),
        cartFingerprint: fingerprint,
        totalAmount,
        items: { create: items },
        payment: { create: {} }
      }, include: includeOrder });
    });
    return { order, created: true };
  } catch (error) {
    const code = z.object({ code: z.string() }).safeParse(error);
    if (!code.success || code.data.code !== "P2002") throw error;
    const winner = await database.order.findUnique({ where: { idempotencyKey: key }, include: includeOrder });
    if (!winner) throw error;
    verifyReplay(winner, token, fingerprint);
    return { order: winner, created: false };
  }
}

function checkoutResult(order: StoredOrder, created: boolean) {
  if (order.paymentStatus !== "PENDING") throw new PaymentError(409, "ORDER_NOT_PAYABLE", "Order sudah selesai; buka halaman status order");
  const payment = order.payment;
  if (!payment) throw new PaymentError(503, "STORAGE_UNAVAILABLE", "Data pembayaran belum tersedia");
  if (payment.creationStatus === "FAILED") throw new PaymentError(409, "CHECKOUT_FAILED", "Pembuatan checkout gagal secara pasti; periksa konfigurasi");
  if (payment.creationStatus !== "READY" || !payment.redirectUrl || !payment.snapToken) {
    return { status: 202, retryAfter: 5, body: { orderId: order.id, paymentStatus: order.paymentStatus, checkoutState: payment.creationStatus, message: "Hasil transaksi belum pasti. Jangan membuat order baru; lakukan rekonsiliasi lokal." } };
  }
  return { status: created ? 201 : 200, body: { orderId: order.id, paymentStatus: order.paymentStatus, checkoutState: "READY", redirectUrl: payment.redirectUrl, snapToken: payment.snapToken } };
}

export async function checkout(
  database: PrismaClient,
  gateway: PaymentGateway,
  environment: Environment,
  input: CheckoutInput,
  token: string,
  key: string
) {
  const { order, created } = await reserveOrder(database, input, token, key);
  if (!created) return checkoutResult(order, false);
  let snap;
  try {
    snap = await gateway.create({
      transaction_details: { order_id: order.id, gross_amount: order.totalAmount },
      item_details: order.items.map(item => ({ id: item.productId, price: item.unitPrice, quantity: item.quantity, name: item.productName.slice(0, 50) })),
      callbacks: { finish: `${environment.APP_ORIGIN}/checkout/status?orderId=${order.id}` }
    });
  } catch (error) {
    const failed = isDefinitiveCreateFailure(error);
    await database.payment.update({ where: { orderId: order.id }, data: {
      creationStatus: failed ? "FAILED" : "UNKNOWN", lastErrorCode: failed ? "PROVIDER_REJECTED" : "CREATE_OUTCOME_UNKNOWN"
    } });
    if (failed) throw new PaymentError(502, "PROVIDER_ERROR", "Provider menolak pembuatan transaksi; periksa konfigurasi Sandbox");
    const pending = await findOrder(database, order.id);
    if (!pending) throw new PaymentError(503, "STORAGE_UNAVAILABLE", "Order tidak dapat dibaca");
    return checkoutResult(pending, false);
  }
  await database.payment.update({ where: { orderId: order.id }, data: {
    creationStatus: "READY", snapToken: snap.token, redirectUrl: snap.redirect_url, lastErrorCode: null
  } });
  const saved = await findOrder(database, order.id);
  if (!saved) throw new PaymentError(503, "STORAGE_UNAVAILABLE", "Order tidak dapat dibaca");
  return checkoutResult(saved, true);
}
