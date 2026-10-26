import { PayButton } from "@/components/pay-button";
import { getDatabase } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  let products: { id: string; name: string; price: number }[];
  try { products = await getDatabase().product.findMany({ where: { isActive: true }, select: { id: true, name: true, price: true }, orderBy: { id: "asc" } }); }
  catch { console.error("Database lokal harus diinisialisasi sebelum checkout."); products = []; }
  return <main><Link href="/">← Aplikasi contoh</Link><p><span className="eyebrow">MIDTRANS SANDBOX</span></p><h1>Checkout yang bisa ditelusuri.</h1><p className="muted">Coba satu order, periksa webhook, lalu lihat status yang disimpan server.</p>
    {products.length ? <PayButton products={products} clientKey={process.env.MIDTRANS_CLIENT_KEY ?? ""} isProduction={process.env.MIDTRANS_IS_PRODUCTION === "true"} /> : <div className="card"><h2>Siapkan database lokal</h2><p>Salin .env.example ke .env, isi kredensial Sandbox sendiri, lalu jalankan:</p><pre>{"pnpm --filter payment-example db:generate\npnpm --filter payment-example db:migrate\npnpm --filter payment-example db:seed"}</pre><p>Refresh halaman setelah migration dan seed selesai.</p></div>}
    <p className="notice">Hasil callback browser tidak membuktikan pembayaran berhasil. Order berubah setelah status Midtrans diverifikasi server.</p>
  </main>;
}
