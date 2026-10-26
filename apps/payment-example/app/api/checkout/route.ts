import { NextRequest } from "next/server";
import { checkout } from "@/lib/checkout";
import { admitRequest, errorResponse, jsonResponse, readJson } from "@/lib/http";
import { getPaymentRuntime } from "@/lib/runtime";
import { requireSessionToken, SESSION_COOKIE } from "@/lib/session";
import { checkoutSchema, idempotencyKeySchema } from "@/lib/validations/checkout";
import { invalidRequest } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { database, gateway, environment } = getPaymentRuntime();
    admitRequest(request, "checkout", environment.APP_ORIGIN);
    const token = requireSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    const parsedKey = idempotencyKeySchema.safeParse(request.headers.get("idempotency-key"));
    if (!parsedKey.success) invalidRequest("Idempotency-Key harus UUID");
    const input = await readJson(request, checkoutSchema, 16 * 1024);
    const result = await checkout(database, gateway, environment, input, token, parsedKey.data);
    return jsonResponse(result.body, result.status, result.retryAfter);
  } catch (error) { return errorResponse(error); }
}
