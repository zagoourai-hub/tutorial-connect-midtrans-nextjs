import { z } from "zod";

export const productIdSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
export const checkoutSchema = z.strictObject({
  items: z.array(z.strictObject({
    productId: productIdSchema,
    quantity: z.number().int().min(1).max(10)
  })).min(1).max(20)
}).superRefine(({ items }, context) => {
  if (new Set(items.map(item => item.productId)).size !== items.length) {
    context.addIssue({ code: "custom", path: ["items"], message: "Produk tidak boleh duplikat" });
  }
});

export const idempotencyKeySchema = z.uuid();
export const orderIdSchema = z.string().regex(/^ord_[a-f0-9]{32}$/);
export type CheckoutInput = z.infer<typeof checkoutSchema>;
