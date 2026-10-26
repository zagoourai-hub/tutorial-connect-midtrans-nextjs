import type { PaymentStatus } from "../generated/prisma/enums";
import { PaymentError } from "./errors";
import type { ProviderStatus } from "./validations/midtrans";

export function parseRupiah(value: string) {
  if (!/^\d{1,9}(?:\.0{1,2})?$/.test(value)) throw new PaymentError(400, "AMOUNT_MISMATCH", "Nominal IDR tidak valid");
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount > 100_000_000) throw new PaymentError(400, "AMOUNT_MISMATCH", "Nominal IDR di luar batas");
  return amount;
}

export function readRefundAmount(status: ProviderStatus, total: number) {
  const refunded = status.refund_amount !== undefined ? parseRupiah(status.refund_amount) :
    status.refunds?.reduce((sum, refund) => sum + parseRupiah(refund.refund_amount), 0);
  if (refunded === undefined || refunded <= 0 || refunded > total) {
    throw new PaymentError(503, "REFUND_UNVERIFIED", "Nominal refund belum dapat diverifikasi");
  }
  if ((status.transaction_status === "refund" && refunded !== total) ||
      (status.transaction_status === "partial_refund" && refunded >= total)) {
    throw new PaymentError(400, "AMOUNT_MISMATCH", "Status dan nominal refund tidak cocok");
  }
  return refunded;
}

export function mapPaymentStatus(status: ProviderStatus): PaymentStatus {
  switch (status.transaction_status) {
    case "pending": return "PENDING";
    case "settlement":
      if (status.fraud_status && status.fraud_status !== "accept") throw new PaymentError(400, "FRAUD_UNVERIFIED", "Status fraud belum aman");
      return "PAID";
    case "capture": return status.fraud_status === "accept" ? "PAID" : "PENDING";
    case "deny": case "failure": return "FAILED";
    case "cancel": return "CANCELED";
    case "expire": return "EXPIRED";
    case "refund": return "REFUNDED";
    case "partial_refund": return "PARTIALLY_REFUNDED";
    default: throw new PaymentError(503, "UNKNOWN_PROVIDER_STATUS", "Status provider belum didukung; perlu rekonsiliasi");
  }
}

export function nextPaymentStatus(current: PaymentStatus, candidate: PaymentStatus, refunded: number, previousRefunded: number): PaymentStatus {
  if (current === "REFUNDED" || refunded < previousRefunded) return current;
  if (candidate === "REFUNDED" || candidate === "PARTIALLY_REFUNDED") return candidate;
  if (current === "PARTIALLY_REFUNDED") return current;
  if (current === "PAID") return "PAID";
  if (current !== "PENDING" && candidate !== "PAID") return current;
  return candidate;
}
