import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/prisma";
import { hasOrderAccess, SESSION_COOKIE } from "@/lib/session";
import { orderIdSchema } from "@/lib/validations/checkout";
import { findOrder } from "@/lib/checkout";

export const dynamic = "force-dynamic";
export const metadata = { title: "Status order Sandbox", robots: { index: false, follow: false } };

const labels = { PENDING: "Menunggu pembayaran", PAID: "Pembayaran terverifikasi", FAILED: "Pembayaran gagal", CANCELED: "Pembayaran dibatalkan", EXPIRED: "Pembayaran kedaluwarsa", REFUNDED: "Dana dikembalikan penuh", PARTIALLY_REFUNDED: "Dana dikembalikan sebagian" };

export default async function StatusPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const parsed = orderIdSchema.safeParse((await searchParams).orderId);
  if (!parsed.success) notFound();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const order = await findOrder(getDatabase(), parsed.data);
  if (!order || !hasOrderAccess(order, token)) notFound();
  return <main><a href="/checkout">← Kembali ke checkout</a><p><span className="eyebrow">STATUS TERSIMPAN DI DATABASE</span></p><h1>{labels[order.paymentStatus]}</h1>
    <div className="card"><dl><dt>Order</dt><dd><code>{order.id}</code></dd><dt>Total</dt><dd>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(order.totalAmount)}</dd><dt>Status checkout</dt><dd>{order.payment?.creationStatus ?? "Belum tersedia"}</dd></dl><ul>{order.items.map(item => <li key={item.id}>{item.productName} × {item.quantity}</li>)}</ul>
      <a href={`/checkout/status?orderId=${order.id}`}>Refresh status dari database</a></div>
    <p className="notice">Status dapat terlambat jika webhook belum tiba. Refresh tidak menghubungi Midtrans langsung. Untuk hasil ambigu, jalankan command rekonsiliasi lokal dengan order ID ini.</p>
  </main>;
}
