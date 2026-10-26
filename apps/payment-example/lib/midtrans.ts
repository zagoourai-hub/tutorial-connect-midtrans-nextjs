import midtrans from "midtrans-client";
import { z } from "zod";
import type { Environment } from "./env";
import { PaymentError } from "./errors";
import { providerStatusSchema, snapResponseSchema, type ProviderStatus, type SnapResponse } from "./validations/midtrans";

export type SnapParameters = {
  transaction_details: { order_id: string; gross_amount: number };
  item_details: { id: string; price: number; quantity: number; name: string }[];
  callbacks: { finish: string };
};
export type PaymentGateway = {
  create(parameters: SnapParameters): Promise<SnapResponse>;
  status(orderId: string): Promise<ProviderStatus>;
};

export function validateRedirectUrl(value: string, isProduction: boolean) {
  const url = new URL(value);
  const expectedHost = isProduction ? "app.midtrans.com" : "app.sandbox.midtrans.com";
  if (url.protocol !== "https:" || url.hostname !== expectedHost || url.port || url.username || url.password) {
    throw new PaymentError(502, "PROVIDER_ERROR", "URL pembayaran provider tidak valid");
  }
  return value;
}

export function createMidtransGateway(environment: Environment): PaymentGateway {
  const isProduction = environment.MIDTRANS_IS_PRODUCTION === "true";
  const snap = new midtrans.Snap({ isProduction, serverKey: environment.MIDTRANS_SERVER_KEY, clientKey: environment.MIDTRANS_CLIENT_KEY });
  // Axios timeout aborts the transport; a Promise-only timeout would leave the create request running.
  snap.httpClient.http_client.defaults.timeout = 10_000;
  snap.httpClient.http_client.defaults.maxRedirects = 0;
  return {
    async create(parameters) {
      const response = snapResponseSchema.parse(await snap.createTransaction(parameters));
      validateRedirectUrl(response.redirect_url, isProduction);
      return response;
    },
    async status(orderId) {
      return providerStatusSchema.parse(await snap.transaction.status(orderId));
    }
  };
}

export function isDefinitiveCreateFailure(error: unknown) {
  const result = z.object({ httpStatusCode: z.coerce.number() }).safeParse(error);
  return result.success && [400, 401, 403, 404, 406, 422].includes(result.data.httpStatusCode);
}
