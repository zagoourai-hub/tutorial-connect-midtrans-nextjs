import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contoh Pembayaran Midtrans Sandbox",
  description: "Aplikasi contoh lokal untuk tutorial Midtrans dan Next.js.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
