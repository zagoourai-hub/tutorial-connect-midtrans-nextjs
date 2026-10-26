import { z } from "zod";

const identifier = z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/);
const amount = z.string().max(30).regex(/^\d+(?:\.\d{1,2})?$/);
const providerStatus = z.string().regex(/^[a-z_]{1,40}$/);

export const notificationSchema = z.looseObject({
  order_id: identifier,
  transaction_id: identifier,
  status_code: z.string().regex(/^\d{3}$/),
  gross_amount: amount,
  transaction_status: providerStatus,
  signature_key: z.string().regex(/^[a-fA-F0-9]{128}$/),
  fraud_status: z.enum(["accept", "deny", "challenge"]).optional()
});

export const providerStatusSchema = z.looseObject({
  order_id: identifier,
  transaction_id: identifier,
  transaction_status: providerStatus,
  gross_amount: amount,
  currency: z.literal("IDR").optional(),
  fraud_status: z.enum(["accept", "deny", "challenge"]).optional(),
  refund_amount: amount.optional(),
  refunds: z.array(z.looseObject({ refund_amount: amount })).max(100).optional()
});

export const snapResponseSchema = z.object({ token: z.string().min(1).max(512), redirect_url: z.url() });
export type Notification = z.infer<typeof notificationSchema>;
export type ProviderStatus = z.infer<typeof providerStatusSchema>;
export type SnapResponse = z.infer<typeof snapResponseSchema>;
