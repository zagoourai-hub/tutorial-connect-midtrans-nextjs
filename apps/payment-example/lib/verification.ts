import { createHash, timingSafeEqual } from "node:crypto";
import { PaymentError } from "./errors";
import { parseRupiah } from "./payment-status";
import type { Notification, ProviderStatus } from "./validations/midtrans";
import type { StoredOrder } from "./checkout";

export function verifySignature(notification: Notification, serverKey: string) {
  const expected = createHash("sha512").update(notification.order_id + notification.status_code + notification.gross_amount + serverKey).digest();
  const actual = Buffer.from(notification.signature_key, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new PaymentError(401, "INVALID_SIGNATURE", "Signature tidak valid");
  }
}

export function verifyProviderStatus(order: StoredOrder, status: ProviderStatus, notification?: Notification) {
  if (status.order_id !== order.id || parseRupiah(status.gross_amount) !== order.totalAmount ||
      (order.payment?.providerTransactionId && order.payment.providerTransactionId !== status.transaction_id) ||
      (notification && (notification.transaction_id !== status.transaction_id || parseRupiah(notification.gross_amount) !== order.totalAmount))) {
    throw new PaymentError(400, "PAYMENT_MISMATCH", "Identitas atau nominal pembayaran tidak cocok");
  }
}
