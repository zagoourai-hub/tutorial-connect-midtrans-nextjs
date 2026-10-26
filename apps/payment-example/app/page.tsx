import Link from "next/link";

export default function HomePage() {
  return <main><span className="eyebrow">APLIKASI CONTOH LOKAL</span><h1>Coba alur pembayaran dengan Midtrans.</h1><p className="muted">Contoh terpisah dari website dokumentasi. Harga berasal dari database, status pembayaran diverifikasi lewat webhook, dan seluruh percobaan menggunakan Sandbox.</p><div className="card"><h2>Mulai dari checkout</h2><p>Siapkan env lokal, migration dan seed, lalu pilih produk contoh.</p><Link href="/checkout">Buka checkout →</Link></div><p className="notice">Jangan gunakan kredensial Production atau memublikasikan SQLite lokal sebagai backend pembayaran.</p></main>;
}
