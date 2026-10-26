import { z } from "zod";
import type { PrismaClient } from "../generated/prisma/client";
import { findOrder } from "./checkout";
import { PaymentError } from "./errors";
import { takeRateLimit } from "./http";
import type { PaymentGateway } from "./midtrans";
import { mapPaymentStatus, nextPaymentStatus, readRefundAmount } from "./payment-status";
import { verifyProviderStatus } from "./verification";
import type { Notification } from "./validations/midtrans";

class RevisionConflict extends Error {}

function isConflict(error: unknown) {
  const parsed = z.object({ code: z.string() }).safeParse(error);
  return error instanceof RevisionConflict || (parsed.success && ["P2034", "SQLITE_BUSY"].includes(parsed.data.code));
}

export async function reconcileOrder(database: PrismaClient, gateway: PaymentGateway, orderId: string, notification?: Notification) {
  if (!notification) {
    takeRateLimit("reconcile:global", 30);
    takeRateLimit(`reconcile:${orderId}`, 1, 30_000);
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const order = await findOrder(database, orderId);
    if (!order) return null;
    if (!order.payment) throw new PaymentError(503, "STORAGE_UNAVAILABLE", "Data pembayaran belum lengkap");
    let status;
    try { status = await gateway.status(order.id); }
    catch { throw new PaymentError(503, "PROVIDER_UNAVAILABLE", "Status provider belum dapat diverifikasi"); }
    verifyProviderStatus(order, status, notification);
    const candidate = mapPaymentStatus(status);
    const isRefund = ["REFUNDED", "PARTIALLY_REFUNDED"].includes(candidate);
    const refunded = isRefund ? readRefundAmount(status, order.totalAmount) : order.payment.refundedAmount;
    const paymentStatus = nextPaymentStatus(order.paymentStatus, candidate, refunded, order.payment.refundedAmount);
    const refundedAmount = Math.max(refunded, order.payment.refundedAmount);
    if (paymentStatus === order.paymentStatus && refundedAmount === order.payment.refundedAmount && order.payment.providerTransactionId) return order;
    try {
      await database.$transaction(async transaction => {
        const update = await transaction.order.updateMany({ where: { id: order.id, revision: order.revision }, data: { paymentStatus, revision: { increment: 1 } } });
        if (update.count !== 1) throw new RevisionConflict();
        await transaction.payment.update({ where: { orderId: order.id }, data: {
          providerTransactionId: status.transaction_id, providerStatus: status.transaction_status,
          fraudStatus: status.fraud_status ?? null, refundedAmount, lastVerifiedAt: new Date()
        } });
      });
      return findOrder(database, order.id);
    } catch (error) {
      if (!isConflict(error)) throw error;
      if (attempt === 2) throw new PaymentError(503, "CONCURRENT_UPDATE", "Update bersamaan belum selesai; ulangi notifikasi");
    }
  }
  throw new PaymentError(503, "CONCURRENT_UPDATE", "Update belum selesai");
}
