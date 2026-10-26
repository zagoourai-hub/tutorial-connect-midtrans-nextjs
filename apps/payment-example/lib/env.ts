import { z } from "zod";

export const environmentSchema = z.object({
  DATABASE_URL: z.string().startsWith("file:").default("file:./prisma/dev.db"),
  APP_ORIGIN: z.url().default("http://localhost:3001").refine(value => {
    const url = new URL(value);
    return url.origin === value && (url.protocol === "https:" ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)));
  }, "Origin harus HTTPS atau localhost dan tanpa path"),
  MIDTRANS_IS_PRODUCTION: z.enum(["true", "false"]).default("false"),
  MIDTRANS_SERVER_KEY: z.string().min(10),
  MIDTRANS_CLIENT_KEY: z.string().default("")
}).superRefine((value, context) => {
  if (value.MIDTRANS_IS_PRODUCTION === "true" && value.MIDTRANS_SERVER_KEY.startsWith("SB-")) {
    context.addIssue({ code: "custom", path: ["MIDTRANS_SERVER_KEY"], message: "Key Sandbox tidak dapat digunakan pada production" });
  }
});

export type Environment = z.infer<typeof environmentSchema>;

export function readEnvironment(source: Record<string, string | undefined> = process.env): Environment {
  const parsed = environmentSchema.safeParse(source);
  if (!parsed.success) throw new Error("Konfigurasi pembayaran tidak valid; periksa env lokal tanpa mencetak key.");
  return parsed.data;
}
