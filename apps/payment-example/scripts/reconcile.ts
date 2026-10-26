import { readEnvironment } from "../lib/env";
import { PaymentError } from "../lib/errors";
import { createMidtransGateway } from "../lib/midtrans";
import { getDatabase } from "../lib/prisma";
import { reconcileOrder } from "../lib/reconcile";
import { orderIdSchema } from "../lib/validations/checkout";

const parsedId = orderIdSchema.safeParse(process.argv[2]);
if (!parsedId.success) throw new Error("Gunakan: pnpm --filter payment-example reconcile -- ord_<32 karakter hex>");
const database = getDatabase();
try {
  const environment = readEnvironment();
  const order = await reconcileOrder(database, createMidtransGateway(environment), parsedId.data);
  if (!order) throw new PaymentError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan");
  console.info({ orderId: order.id, paymentStatus: order.paymentStatus, checkoutState: order.payment?.creationStatus });
} catch (error) {
  console.error(error instanceof PaymentError ? `${error.code}: ${error.message}` : "Rekonsiliasi gagal. Periksa env, database, atau provider tanpa mencetak key.");
  process.exitCode = 1;
} finally {
  await database.$disconnect();
}
