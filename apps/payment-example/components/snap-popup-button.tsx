"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap?: { pay(token: string, callbacks: { onSuccess(): void; onPending(): void; onError(): void; onClose(): void }): void };
  }
}

type SnapPopupButtonProps = {
  clientKey: string;
  isProduction: boolean;
  disabled: boolean;
  getTransaction(): Promise<{ snapToken: string; orderId: string } | null>;
  onMessage(message: string): void;
};

export function SnapPopupButton({ clientKey, isProduction, disabled, getTransaction, onMessage }: SnapPopupButtonProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  async function openPopup() {
    setIsOpening(true);
    try {
      const transaction = await getTransaction();
      if (!transaction || !window.snap) return;
      const showStatus = () => { router.push(`/checkout/status?orderId=${transaction.orderId}`); };
      window.snap.pay(transaction.snapToken, {
        onSuccess: showStatus, onPending: showStatus, onError: showStatus,
        onClose: () => onMessage("Popup ditutup. Status order belum tentu batal; periksa status sebelum mencoba transaksi baru.")
      });
    } catch { onMessage("Popup belum dapat dibuka. Periksa status order sebelum mencoba kembali."); }
    finally { setIsOpening(false); }
  }
  return <>
    <Script src={`https://${isProduction ? "app.midtrans.com" : "app.sandbox.midtrans.com"}/snap/snap.js`} data-client-key={clientKey} onReady={() => setIsLoaded(true)} onError={() => onMessage("Snap.js gagal dimuat. Anda dapat memakai Snap Redirect.")} />
    <button className="secondary" type="button" disabled={disabled || !isLoaded || isOpening} onClick={openPopup}>{isOpening ? "Membuka popup…" : "Alternatif: Snap Popup"}</button>
  </>;
}
