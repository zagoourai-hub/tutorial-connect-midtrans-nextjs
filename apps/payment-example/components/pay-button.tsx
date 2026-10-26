"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import { SnapPopupButton } from "./snap-popup-button";
import { checkoutSchema } from "@/lib/validations/checkout";

type Product = { id: string; name: string; price: number };
const checkoutResponse = z.object({ orderId: z.string(), checkoutState: z.string(), snapToken: z.string().optional(), redirectUrl: z.string().optional(), message: z.string().optional() });
const storedAttempt = z.object({ key: z.uuid(), fingerprint: z.string(), orderId: z.string().optional() });
const errorResponse = z.object({ error: z.object({ code: z.string(), message: z.string() }) });

export function PayButton({ products, clientKey, isProduction }: { products: Product[]; clientKey: string; isProduction: boolean }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [canStartNewOrder, setCanStartNewOrder] = useState(false);
  const pendingRequest = useRef(false);
  const attempt = useRef<z.infer<typeof storedAttempt> | null>(null);
  const selectedProduct = products.find(product => product.id === productId);

  async function initializeSession() {
    setIsBusy(true);
    try {
      const response = await fetch("/api/session", { method: "POST" });
      if (!response.ok) throw new Error("Sesi belum tersedia. Periksa env lokal dan tunggu jika kuota terlampaui.");
      setIsSessionReady(true);
      setMessage("Sesi aman aktif. Pilih metode pembayaran.");
      try {
        const saved = storedAttempt.safeParse(JSON.parse(sessionStorage.getItem("midtrans-checkout-attempt") ?? "null"));
        if (saved.success) {
          const cart = checkoutSchema.parse(JSON.parse(saved.data.fingerprint));
          attempt.current = saved.data;
          setProductId(cart.items[0].productId); setQuantity(cart.items[0].quantity);
          setOrderId(saved.data.orderId ?? ""); setIsLocked(true);
          setMessage("Checkout sebelumnya dipulihkan. Periksa order yang sama sebelum membuat transaksi baru.");
        }
      } catch { setMessage("Sesi aktif. Data checkout lama tidak tersedia; jangan membuat transaksi baru jika hasil sebelumnya belum pasti."); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sesi gagal dibuat"); }
    finally { setIsBusy(false); }
  }

  async function createTransaction() {
    if (pendingRequest.current || !isSessionReady) return null;
    pendingRequest.current = true;
    setIsBusy(true);
    const fingerprint = JSON.stringify({ items: [{ productId, quantity }] });
    if (!attempt.current) {
      try {
        const parsed = storedAttempt.safeParse(JSON.parse(sessionStorage.getItem("midtrans-checkout-attempt") ?? "null"));
        if (parsed.success && parsed.data.fingerprint === fingerprint) attempt.current = parsed.data;
      } catch { setMessage("Penyimpanan sesi tidak tersedia; jangan reload selama checkout diproses."); }
    }
    if (!attempt.current || (!isLocked && attempt.current.fingerprint !== fingerprint)) {
      attempt.current = { key: crypto.randomUUID(), fingerprint };
    }
    try {
      sessionStorage.setItem("midtrans-checkout-attempt", JSON.stringify(attempt.current));
    } catch { setMessage("Penyimpanan sesi tidak tersedia; jangan reload selama checkout diproses."); }
    setIsLocked(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.current.key }, body: attempt.current.fingerprint });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const error = errorResponse.safeParse(payload);
        if (error.success && ["CHECKOUT_FAILED", "ORDER_NOT_PAYABLE", "PROVIDER_ERROR"].includes(error.data.error.code)) setCanStartNewOrder(true);
        if (response.status < 500 && response.status !== 409) setIsLocked(false);
        throw new Error(error.success ? error.data.error.message : "Checkout belum tersedia. Jangan membuat order baru jika hasilnya belum pasti.");
      }
      const result = checkoutResponse.parse(payload);
      setOrderId(result.orderId);
      attempt.current.orderId = result.orderId;
      try { sessionStorage.setItem("midtrans-checkout-attempt", JSON.stringify(attempt.current)); }
      catch { setMessage("Order tersimpan; gunakan tautan status sebelum meninggalkan halaman."); }
      if (response.status === 202 || !result.snapToken || !result.redirectUrl) {
        setMessage(result.message ?? "Transaksi sedang diperiksa. Periksa status atau jalankan rekonsiliasi lokal.");
        return null;
      }
      const redirect = new URL(result.redirectUrl);
      if (redirect.protocol !== "https:" || redirect.hostname !== (isProduction ? "app.midtrans.com" : "app.sandbox.midtrans.com")) throw new Error("URL provider tidak valid");
      return { snapToken: result.snapToken, orderId: result.orderId, redirectUrl: result.redirectUrl };
    } catch (error) { setMessage(error instanceof Error ? error.message : "Koneksi terputus. Periksa checkout yang sama, jangan membuat order baru."); return null; }
    finally { setIsBusy(false); pendingRequest.current = false; }
  }

  async function redirectToPayment() {
    const transaction = await createTransaction();
    if (transaction) window.location.assign(transaction.redirectUrl);
  }

  function startNewOrder() {
    try { sessionStorage.removeItem("midtrans-checkout-attempt"); }
    catch { setMessage("Penyimpanan sesi tidak tersedia; jangan reload selama checkout."); }
    attempt.current = null; setIsLocked(false); setCanStartNewOrder(false); setOrderId("");
  }

  return <div className="card">
    <h2>Pilih produk contoh</h2>
    <label className="field">Produk<select value={productId} disabled={isLocked || isBusy} onChange={event => setProductId(event.target.value)}>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
    <label className="field">Jumlah<input type="number" min={1} max={10} value={quantity} disabled={isLocked || isBusy} onChange={event => setQuantity(Number(event.target.value))} /></label>
    <p>Total informatif: <strong>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format((selectedProduct?.price ?? 0) * quantity)}</strong></p>
    <p className="muted">Server menghitung ulang harga dari database. Tidak ada pembayaran sungguhan pada website dokumentasi.</p>
    {!isSessionReady && <button type="button" disabled={isBusy} onClick={initializeSession}>{isBusy ? "Menyiapkan sesi…" : "Aktifkan sesi aman"}</button>}
    <div className="actions"><button type="button" disabled={!isSessionReady || isBusy || (!selectedProduct && !isLocked) || quantity < 1 || quantity > 10 || !Number.isInteger(quantity)} onClick={redirectToPayment}>{isBusy ? "Memproses…" : isLocked ? "Periksa checkout yang sama" : "Bayar dengan Snap Redirect"}</button>
      {clientKey && <SnapPopupButton clientKey={clientKey} isProduction={isProduction} disabled={!isSessionReady || isBusy || !selectedProduct} getTransaction={createTransaction} onMessage={setMessage} />}</div>
    {message && <p role="status" className="notice">{message}</p>}
    {orderId && <p><a href={`/checkout/status?orderId=${orderId}`}>Periksa status order →</a></p>}
    {canStartNewOrder && <button type="button" className="secondary" onClick={startNewOrder}>Mulai order baru setelah hasil sebelumnya dipastikan</button>}
  </div>;
}
