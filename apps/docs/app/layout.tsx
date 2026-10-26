import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { siteOrigin } from "@/lib/docs-navigation"
import { cn } from "@/lib/utils"

const inter = Inter({subsets:['latin'],variable:'--font-inter'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Midtrans Tutorial — Integrasi Pembayaran dengan Next.js", template: "%s | Midtrans Tutorial" },
  description: "Tutorial Midtrans berbahasa Indonesia: Next.js, TypeScript, Prisma, Zod, checkout, webhook, dan pengujian Sandbox.",
  openGraph: { type: "website", locale: "id_ID", siteName: "Midtrans Tutorial", title: "Integrasi Midtrans dengan Next.js", description: "Pelajari alur pembayaran dari setup hingga webhook terverifikasi.", images: ["/opengraph-image.svg"] },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider><a className="skip-link" href="#main-content">Lewati ke konten</a><SiteHeader />{children}<footer className="site-footer"><span><span className="brand-mark small">M</span>Midtrans Tutorial</span><p>Website tutorial. Kode contoh dipelajari dan dijalankan terpisah.</p><a href="https://docs.midtrans.com/">Dokumentasi resmi ↗</a></footer></ThemeProvider>
      </body>
    </html>
  )
}
