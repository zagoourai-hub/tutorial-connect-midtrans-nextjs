import { getPaymentRuntime } from "@/lib/runtime";
import { admitRequest, errorResponse, jsonResponse, readJson } from "@/lib/http";
import { reconcileOrder } from "@/lib/reconcile";
import { notificationSchema } from "@/lib/validations/midtrans";
import { verifySignature } from "@/lib/verification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { database, gateway, environment } = getPaymentRuntime();
    admitRequest(request, "webhook", environment.APP_ORIGIN);
    const notification = await readJson(request, notificationSchema, 64 * 1024);
    verifySignature(notification, environment.MIDTRANS_SERVER_KEY);
    const order = await reconcileOrder(database, gateway, notification.order_id, notification);
    if (!order) console.info("Notifikasi valid untuk order asing diabaikan.");
    return jsonResponse({ received: true });
  } catch (error) { return errorResponse(error); }
}
