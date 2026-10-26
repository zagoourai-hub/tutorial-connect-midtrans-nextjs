# PRD — Midtrans Integration Tutorial

**Product Name:** Midtrans Next.js Tutorial  
**Version:** 1.0.0  
**Status:** Ready for Development  
**Language:** Bahasa Indonesia  
**Framework:** Next.js `@latest`  
**Content Format:** Markdown / MDX  
**Deployment:** Vercel Hobby (Static Website)

---

## 1. Product Overview

Membangun website dokumentasi interaktif berbahasa Indonesia yang mengajarkan cara mengintegrasikan Midtrans Payment Gateway menggunakan Next.js, TypeScript, Prisma, SQLite, Zod, dan SDK resmi Midtrans.

Website menggunakan MDX agar tutorial dapat dibuat, diperbarui, dan dikelola melalui file Markdown tanpa membutuhkan CMS atau database.

Seluruh kode tutorial harus berasal dari project contoh yang telah diuji, bukan sekadar potongan kode yang belum diverifikasi.

### 1.1 Goals

1. Menyediakan tutorial Midtrans dari instalasi hingga pembayaran berhasil.
2. Menjelaskan setiap kode secara bertahap dan mudah dipahami pemula.
3. Menggunakan SDK resmi `midtrans-client`.
4. Menggunakan TypeScript strict dan Zod untuk validasi.
5. Memberikan contoh integrasi yang benar-benar dapat dijalankan.
6. Mendukung Snap Redirect sebagai tutorial utama dan Snap Popup sebagai alternatif.
7. Memastikan contoh kode lolos pemeriksaan otomatis sebelum diterbitkan.
8. Menghasilkan website dokumentasi statis yang dapat di-deploy ke Vercel Hobby.

### 1.2 Non-Goals

- Membuat payment gateway sendiri.
- Membuat dashboard merchant Midtrans.
- Memproses pembayaran sungguhan pada website dokumentasi.
- Membuat CMS atau sistem login.
- Menyimpan transaksi pembayaran pengunjung website dokumentasi.
- Menggunakan database untuk mengelola konten dokumentasi.

---

## 2. Technology Stack

### 2.1 Documentation Website

| Technology | Purpose |
|---|---|
| Next.js `@latest` | Framework dengan App Router |
| React | UI rendering |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| MDX (`@next/mdx`) | Dokumentasi berbasis Markdown |
| Shiki | Syntax highlighting |
| Lucide React | Icons |
| pnpm | Package manager |
| Vercel | Static deployment |

### 2.2 Tutorial Example Application

| Technology | Purpose |
|---|---|
| Next.js `@latest` | Full-stack application |
| TypeScript strict | Type checking |
| Prisma ORM | Database access |
| SQLite | Local development database |
| `@prisma/adapter-better-sqlite3` | Prisma SQLite adapter |
| Zod 4 | Runtime validation |
| `midtrans-client` | Official Midtrans SDK |
| Vitest | Unit dan integration testing |
| Playwright | End-to-end testing |

**Versioning requirement:**

- Saat inisialisasi gunakan versi stabil terbaru.
- Simpan versi dependency yang benar-benar terinstal di `pnpm-lock.yaml`.
- Dokumentasikan versi Node.js dan dependency yang berhasil diuji.
- Perubahan major version mengharuskan pengujian ulang.
- Jangan menggunakan API deprecated atau experimental tanpa kebutuhan yang jelas.

---

## 3. Target Users

### Primary User

Developer pemula hingga menengah yang ingin menambahkan pembayaran Midtrans pada aplikasi Next.js.

### User Problems

- Tidak mengetahui urutan integrasi pembayaran.
- Kesulitan memahami perbedaan API checkout dan webhook.
- Bingung menggunakan SDK Midtrans dengan TypeScript.
- Mengalami error saat menggunakan Prisma versi terbaru.
- Belum memahami validasi payload dengan Zod.
- Tidak memahami cara menguji pembayaran menggunakan Sandbox.
- Kesulitan memisahkan kode development dan production.

### Expected Outcome

Setelah menyelesaikan tutorial, pengguna dapat:

1. Membuat transaksi Midtrans Sandbox.
2. Mengarahkan pembeli ke Snap Redirect.
3. Menyimpan order di database Prisma.
4. Memvalidasi request menggunakan Zod.
5. Memverifikasi webhook Midtrans.
6. Memperbarui status order berdasarkan status pembayaran.
7. Menguji pembayaran berhasil, gagal, dibatalkan, dan kedaluwarsa.

---

## 4. Website Features

### FR-01 — Landing Page

Landing page menampilkan:

- Hero section dengan judul tutorial.
- Deskripsi singkat teknologi.
- Tombol "Mulai Tutorial".
- Daftar fitur yang akan dipelajari.
- Learning roadmap.
- Prasyarat instalasi.
- Tautan dokumentasi resmi Midtrans.
- Tautan source code GitHub.

### FR-02 — Documentation Layout

Halaman dokumentasi menggunakan layout tiga bagian pada desktop:

**Left Sidebar**

- Navigation chapters.
- Active chapter indicator.
- Collapse/expand navigation.

**Main Content**

- Tutorial Markdown/MDX.
- Code blocks.
- Explanations.
- Callouts.
- Tables.
- Previous/Next navigation.

**Right Sidebar**

- Table of Contents.
- Active heading indicator.
- Anchor navigation.

Pada mobile, navigasi berubah menjadi drawer.

### FR-03 — Code Blocks

Setiap kode harus menyediakan:

- Syntax highlighting.
- Tombol copy.
- Nama file.
- Bahasa pemrograman.
- Horizontal scrolling.
- Tampilan dark/light mode.
- Penjelasan bagian penting.
- Link ke file asli pada project contoh bila relevan.

Contoh format MDX:

```mdx
## Membuat Midtrans Client

Buat file `lib/midtrans.ts`.

```ts title="lib/midtrans.ts"
 // Kode tervalidasi dari project contoh.
```

Penjelasan mengenai cara kerja kode.
```

Implementasi MDX harus memakai code fence yang valid; contoh di atas menggambarkan format konten yang diinginkan.

### FR-04 — Search

Menyediakan pencarian dokumentasi berdasarkan judul dan isi tutorial.

Requirements:

- Pencarian berjalan di client.
- Search index dihasilkan saat build.
- Tidak membutuhkan database.
- Tidak membutuhkan external search API.
- Keyboard-friendly.
- Mendukung pencarian judul dan keyword.

### FR-05 — Navigation

- Previous/Next chapter.
- Breadcrumbs.
- Active sidebar navigation.
- Heading anchor links.
- Mobile navigation.
- Custom 404 page.

### FR-06 — UI Theme

Menggunakan shadcn/ui dengan:

- Light mode.
- Dark mode.
- System theme.
- Responsive layout.
- Accessible components.
- Tipografi dan spacing yang konsisten.

---

## 5. Tutorial Content Specification

Seluruh tutorial ditulis dalam Bahasa Indonesia dan menggunakan format `.mdx`.

### Chapter 01 — Introduction

**Route:** `/docs/introduction`

Materi:

- Apa itu Midtrans.
- Apa itu Snap.
- Perbedaan Snap Redirect dan Snap Popup.
- Gambaran alur pembayaran.
- Penjelasan Sandbox dan Production.
- Arsitektur Next.js + Prisma + Midtrans.

### Chapter 02 — Project Setup

**Route:** `/docs/setup`

Materi:

- Install Node.js dan pnpm.
- Create Next.js project.
- Konfigurasi TypeScript.
- Struktur folder.
- Install dependency.
- Menjalankan development server.

### Chapter 03 — Midtrans Configuration

**Route:** `/docs/midtrans-setup`

Materi:

- Membuat akun Midtrans.
- Mengaktifkan Sandbox.
- Mengambil Server Key dan Client Key.
- Konfigurasi `.env`.
- Perbedaan Server Key dan Client Key.
- Validasi environment variables.

### Chapter 04 — Prisma Setup

**Route:** `/docs/prisma`

Materi:

- Install Prisma.
- Inisialisasi SQLite.
- Konfigurasi Prisma 7 dan driver adapter.
- Membuat Prisma Client.
- Membuat schema database.
- Migrasi database.
- Generate Prisma Client.

Model minimum:

- Product.
- Order.
- OrderItem.
- Payment.

Status pembayaran menggunakan Prisma enum.

```prisma
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  CANCELED
  EXPIRED
  REFUNDED
  PARTIALLY_REFUNDED
}
```

### Chapter 05 — Zod Validation

**Route:** `/docs/validation`

Materi:

- Apa itu Zod.
- `z.object()`.
- `z.string()`.
- `z.number()`.
- `z.enum()`.
- `safeParse()`.
- `z.infer`.
- Validasi checkout.
- Validasi webhook.

Schema checkout harus memvalidasi:

- Product ID.
- Quantity.
- Maksimum quantity.
- Keranjang tidak kosong.
- Maksimum jumlah item.
- Format payload.

Jumlah pembayaran harus dihitung dari database, bukan dari request frontend.

### Chapter 06 — Midtrans SDK

**Route:** `/docs/midtrans-sdk`

Materi:

- Install SDK resmi.
- Konfigurasi Snap instance.
- Environment Sandbox dan Production.
- Membuat transaction token.
- Memahami `redirect_url`.
- Error handling SDK.
- TypeScript compatibility.

SDK utama:

```ts
snap.createTransaction(parameters);
snap.transaction.notification(notification);
snap.transaction.status(orderId);
```

Method yang digunakan harus disesuaikan dengan versi SDK yang telah diuji.

### Chapter 07 — Checkout API

**Route:** `/docs/checkout-api`

Materi:

- Next.js Route Handler.
- Validasi request menggunakan Zod.
- Mengambil harga produk menggunakan Prisma.
- Generate unique order ID.
- Menyimpan order PENDING.
- Membuat transaksi Snap.
- Mengembalikan redirect URL.
- Error handling dan retry.

API:

`POST /api/checkout`

### Chapter 08 — Frontend Payment

**Route:** `/docs/payment-button`

Materi:

- Membuat tombol pembayaran.
- Client Component.
- Loading state.
- Error state.
- Memanggil checkout API.
- Mengarahkan pembeli ke halaman Midtrans.
- Menangani pembatalan navigasi.

Snap Redirect menjadi implementasi utama karena lebih sederhana.

Snap Popup dijelaskan dalam chapter tambahan.

### Chapter 09 — Webhook

**Route:** `/docs/webhook`

Materi:

- Apa itu webhook.
- Perbedaan webhook dan frontend callback.
- Membuat endpoint webhook.
- Validasi payload dengan Zod.
- Verifikasi signature Midtrans.
- Verifikasi status melalui SDK/API Midtrans.
- Validasi nominal transaksi.
- Validasi status fraud.
- Idempotency.
- Status transition.
- Error handling dan retry.

API:

`POST /api/midtrans/webhook`

Tutorial harus menjelaskan bahwa callback frontend tidak boleh menjadi sumber kebenaran pembayaran.

### Chapter 10 — Payment Status

**Route:** `/docs/payment-status`

Materi:

- Mengambil status pembayaran dari Prisma.
- Menampilkan status kepada pembeli.
- Memahami status PENDING dan PAID.
- Menangani EXPIRED, CANCELED, dan FAILED.
- Refund dan partial refund.
- Rekonsiliasi dengan Midtrans.
- Akses halaman order yang aman.

### Chapter 11 — Sandbox Testing

**Route:** `/docs/testing`

Materi:

- Menjalankan Next.js lokal.
- Menggunakan tunnel HTTPS.
- Mengonfigurasi Notification URL.
- Menjalankan transaksi Sandbox.
- Menguji webhook.
- Memeriksa database Prisma.
- Debugging dan troubleshooting.

### Chapter 12 — Security and Production

**Route:** `/docs/production`

Materi:

- Environment variables.
- Server Key security.
- Zod validation.
- Signature verification.
- Rate limiting.
- Idempotency.
- Menghindari duplicate order.
- Timeout dan retry handling.
- Database persistence.
- Production credentials.
- Perbedaan deployment dokumentasi dan deployment backend pembayaran.

### Chapter 13 — Snap Popup (Optional)

**Route:** `/docs/snap-popup`

Materi:

- Load Snap.js.
- Client Key.
- Snap Token.
- `window.snap.pay()`.
- Callback handling.
- Redirect vs Popup trade-offs.

---

## 6. Tutorial Writing Standard

Setiap halaman tutorial wajib mengikuti template yang sama.

### Required Structure

```md
# Judul Tutorial

## Tujuan Pembelajaran

Penjelasan hasil yang akan dicapai.

## Prasyarat

Daftar persyaratan.

## Langkah 1 — Instalasi

Command lengkap.

## Langkah 2 — Implementasi

Nama file dan kode lengkap.

## Penjelasan Kode

Penjelasan bagian penting.

## Validasi dan Testing

Command dan expected output.

## Troubleshooting

Error umum dan solusi.

## Hasil Akhir

Apa yang seharusnya berhasil.

## Referensi

Link dokumentasi resmi.
```

### Content Quality Rules

1. Gunakan Bahasa Indonesia yang mudah dipahami.
2. Jelaskan fungsi setiap file.
3. Jelaskan alasan penggunaan API yang dipilih.
4. Hindari abstraksi berlebihan.
5. Gunakan TypeScript untuk seluruh contoh aplikasi.
6. Setiap kode harus kompatibel dengan project contoh.
7. Jangan menggunakan `any` tanpa alasan dan dokumentasi.
8. Jangan menyembunyikan error dengan empty catch.
9. Jangan menampilkan Server Key dalam kode frontend.
10. Jangan memberi klaim keamanan yang tidak dapat dibuktikan.
11. Setiap chapter harus dapat diikuti secara berurutan.
12. Cantumkan tautan ke dokumentasi resmi dan versi yang diuji.

---

## 7. Architecture

### 7.1 Documentation Website

Website hanya menampilkan dokumentasi statis.

```text
Markdown / MDX
      |
      v
Next.js Build
      |
      v
Static HTML + CSS + JS
      |
      v
Vercel
      |
      v
Documentation Website
```

Konfigurasi:

```ts
// next.config.ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

Tambahkan `mdx-components.tsx` pada root project sesuai dokumentasi resmi Next.js.

Semua halaman dokumentasi harus tersedia saat build. Jangan menggunakan request-dependent Route Handlers, Server Actions, atau dynamic server rendering pada website dokumentasi.

### 7.2 Example Payment Application

```text
Buyer
  |
  v
Next.js Checkout API
  |
  v
Zod Validation
  |
  v
Prisma Database
  |
  v
Midtrans SDK
  |
  v
Midtrans Checkout
  |
  v
Webhook Notification
  |
  v
Verify Signature / GET Status
  |
  v
Prisma Status Update
```

Aplikasi pembayaran adalah project contoh yang diuji secara terpisah, bukan bagian dari runtime website dokumentasi statis.

---

## 8. Project Structure

Menggunakan satu repository dengan dua aplikasi.

```text
midtrans-tutorial/
├── apps/
│   ├── docs/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── docs/
│   │   │       ├── introduction/page.mdx
│   │   │       ├── setup/page.mdx
│   │   │       ├── midtrans-setup/page.mdx
│   │   │       ├── prisma/page.mdx
│   │   │       ├── validation/page.mdx
│   │   │       ├── midtrans-sdk/page.mdx
│   │   │       ├── checkout-api/page.mdx
│   │   │       ├── payment-button/page.mdx
│   │   │       ├── webhook/page.mdx
│   │   │       ├── payment-status/page.mdx
│   │   │       ├── testing/page.mdx
│   │   │       ├── production/page.mdx
│   │   │       └── snap-popup/page.mdx
│   │   │
│   │   ├── components/
│   │   │   ├── docs-sidebar.tsx
│   │   │   ├── table-of-contents.tsx
│   │   │   ├── code-block.tsx
│   │   │   ├── copy-button.tsx
│   │   │   ├── docs-search.tsx
│   │   │   └── theme-toggle.tsx
│   │   │
│   │   ├── lib/
│   │   │   └── docs-navigation.ts
│   │   │
│   │   ├── mdx-components.tsx
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── payment-example/
│       ├── app/
│       │   ├── api/
│       │   │   ├── checkout/route.ts
│       │   │   └── midtrans/webhook/route.ts
│       │   └── checkout/
│       │       └── status/page.tsx
│       │
│       ├── components/
│       │   └── pay-button.tsx
│       ├── lib/
│       │   ├── prisma.ts
│       │   ├── midtrans.ts
│       │   └── validations/
│       │       ├── checkout.ts
│       │       └── midtrans.ts
│       ├── prisma/
│       │   └── schema.prisma
│       ├── tests/
│       │   ├── checkout.test.ts
│       │   └── webhook.test.ts
│       ├── .env.example
│       └── package.json
│
├── scripts/
│   └── validate-snippets.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
├── PRD.md
└── README.md
```

Vercel Root Directory diarahkan ke `apps/docs`.

Semua navigasi dokumen harus dipastikan tersedia pada static build.

---

## 9. Code Quality and Validation

**Ini merupakan requirement wajib dengan prioritas tertinggi.**

Semua kode tutorial harus diverifikasi sebelum diterbitkan.

### 9.1 TypeScript Requirements

- `strict: true`.
- Hindari implicit `any`.
- Gunakan Zod untuk untrusted input.
- Hindari type assertion tanpa pemeriksaan runtime.
- Seluruh import harus tersedia.
- Tidak boleh ada TypeScript compile error.
- Type declaration SDK harus diuji terhadap method runtime sebenarnya.

### 9.2 Security Requirements

- Harga pembayaran selalu berasal dari database.
- Validasi nominal sebelum update status.
- Verifikasi webhook Midtrans.
- Jangan mengandalkan frontend callback sebagai bukti pembayaran.
- Cegah pemrosesan webhook duplikat.
- Cegah state pembayaran mundur akibat webhook tidak berurutan.
- Jangan membocorkan API Key.
- Batasi ukuran payload request.
- Terapkan rate limiting untuk checkout.
- Pastikan akses detail order memiliki kontrol otorisasi atau token yang aman.

### 9.3 Payment Status Testing

| Test Case | Expected Result |
|---|---|
| Checkout valid | Transaksi dibuat |
| Product ID tidak valid | HTTP 400 |
| Produk tidak ditemukan | HTTP 404 |
| Quantity tidak valid | HTTP 400 |
| Harga dimodifikasi di frontend | Menggunakan harga database |
| Webhook payload invalid | HTTP 400 |
| Signature invalid | HTTP 401 |
| Nominal tidak cocok | Tidak menjadi PAID |
| Transaksi pending | Tetap PENDING |
| Settlement terverifikasi | Menjadi PAID |
| Capture dengan fraud accept | Menjadi PAID |
| Fraud challenge | Tidak menjadi PAID |
| Pembayaran expired | Menjadi EXPIRED |
| Pembayaran canceled | Menjadi CANCELED |
| Refund valid | Menjadi REFUNDED |
| Webhook duplikat | Tidak memproses efek samping ulang |
| SDK timeout | Error tertangani, status tidak dibuat-buat |
| Webhook tidak berurutan | Tidak merusak status order |

### 9.4 Automated Quality Gates

Gunakan command yang tersedia dalam package scripts:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Untuk project contoh, jalankan juga:

```bash
pnpm exec prisma validate
pnpm exec prisma generate
```

CI wajib memeriksa kedua aplikasi:

**Documentation website:**

- ESLint.
- TypeScript.
- MDX compilation.
- Static build.
- Internal links.
- Tutorial snippets.
- Accessibility smoke tests.

**Payment example:**

- Prisma validation.
- Prisma Client generation.
- TypeScript.
- Unit tests.
- Integration tests.
- Next.js production build.

Tidak boleh deploy otomatis ketika salah satu quality gate gagal.

### 9.5 Source Code Synchronization

Untuk mencegah tutorial berbeda dari implementasi sebenarnya:

- Project `payment-example` menjadi sumber kode utama.
- Potongan kode MDX harus sinkron dengan file asli.
- Gunakan automated snippet verification.
- Perubahan kode contoh harus memicu pengujian dan review tutorial terkait.
- Jangan menyalin kode contoh secara manual tanpa proses verifikasi.

### 9.6 Bug-Free Policy

Tidak diperbolehkan mengklaim kode bebas bug secara absolut.

Definisi kualitas yang dapat diverifikasi:

1. Tidak ada error TypeScript.
2. Tidak ada error lint.
3. Build berhasil.
4. Semua automated test lulus.
5. Tidak ada bug kritis yang diketahui.
6. Sandbox end-to-end test berhasil.
7. Semua code snippet sudah diperiksa.
8. Tidak ada kredensial rahasia yang terpublikasi.

Setiap tutorial harus memiliki label hasil validasi, versi dependency, dan tanggal pengujian terakhir.

---

## 10. UI/UX Requirements

### Design Direction

Website dokumentasi modern, minimal, fokus pada keterbacaan kode.

Referensi pola UI:

- Next.js Documentation.
- shadcn/ui Documentation.
- Dokumentasi developer modern dengan sidebar dan TOC.

### Design Tokens

- Background menggunakan token shadcn/ui.
- Border menggunakan `border-border`.
- Primary color menggunakan `primary`.
- Typography menggunakan font sans-serif untuk konten.
- Code blocks menggunakan font monospace.
- Spacing konsisten.
- Responsive dari mobile hingga desktop.

### Accessibility

- Keyboard navigation.
- Visible focus indicator.
- Semantic HTML.
- Kontras yang memadai.
- Accessible mobile navigation.
- Copy button dengan accessible label.
- Heading hierarchy yang benar.

### SEO

- Static metadata untuk setiap chapter.
- Descriptive titles.
- Meta descriptions.
- Canonical URLs.
- Sitemap.
- Robots.txt.
- Open Graph metadata.
- Structured data jika diperlukan.
- Internal linking antar chapter.

---

## 11. Deployment Requirements

### Platform

Vercel Hobby untuk website dokumentasi personal nonkomersial.

### Hosting Model

- Static export.
- Tidak menggunakan runtime database.
- Tidak menggunakan API server untuk dokumentasi.
- Konten diperbarui melalui Git.
- Deploy ulang ketika konten MDX berubah.

### Configuration

```ts
const nextConfig = {
  output: "export",
};
```

Jika seluruh halaman statis, hasil build dapat disajikan sebagai HTML, CSS, dan JavaScript tanpa backend.

### Deployment Process

1. Push repository ke GitHub.
2. Import repository ke Vercel.
3. Set Root Directory ke `apps/docs`.
4. Konfigurasi build berdasarkan pnpm workspace.
5. Jalankan automated checks.
6. Build static website.
7. Deploy.
8. Verifikasi semua route dokumentasi.

### Hosting Limitations

- Vercel Hobby hanya untuk personal non-commercial usage.
- Resource dan deployment tetap mengikuti batas Vercel.
- Website dokumentasi tidak menjalankan webhook pembayaran.
- Contoh aplikasi pembayaran berjalan lokal untuk pengujian.
- Jika aplikasi pembayaran dipublikasikan, gunakan penyimpanan database persisten dan hosting backend yang sesuai.

---

## 12. Development Roadmap

### Phase 1 — Foundation

- [ ] Initialize Next.js workspace.
- [ ] Configure pnpm.
- [ ] Configure TypeScript.
- [ ] Install Tailwind CSS.
- [ ] Setup shadcn/ui.
- [ ] Install MDX.
- [ ] Configure static export.

**Deliverable:** Website Next.js dapat menjalankan dan merender MDX.

### Phase 2 — Documentation UI

- [ ] Landing page.
- [ ] Sidebar navigation.
- [ ] Documentation layout.
- [ ] Table of Contents.
- [ ] Code blocks.
- [ ] Copy button.
- [ ] Dark/light mode.
- [ ] Previous/Next navigation.
- [ ] Mobile layout.

**Deliverable:** Tampilan dokumentasi lengkap.

### Phase 3 — Payment Example

- [ ] Setup aplikasi contoh.
- [ ] Setup Prisma + SQLite.
- [ ] Setup Midtrans SDK.
- [ ] Setup Zod.
- [ ] Implementasi checkout.
- [ ] Implementasi Snap Redirect.
- [ ] Implementasi webhook.
- [ ] Implementasi status pembayaran.
- [ ] Automated tests.

**Deliverable:** Aplikasi pembayaran Sandbox yang telah diverifikasi.

### Phase 4 — Tutorial Content

- [ ] Introduction.
- [ ] Next.js setup.
- [ ] Midtrans configuration.
- [ ] Prisma setup.
- [ ] Zod validation.
- [ ] Midtrans SDK.
- [ ] Checkout API.
- [ ] Payment frontend.
- [ ] Webhook.
- [ ] Payment status.
- [ ] Sandbox testing.
- [ ] Production and security.
- [ ] Optional Snap Popup.

**Deliverable:** Semua halaman tutorial MDX lengkap.

### Phase 5 — Quality Assurance

- [ ] TypeScript checks.
- [ ] Lint.
- [ ] Unit tests.
- [ ] Integration tests.
- [ ] Sandbox testing.
- [ ] MDX compilation checks.
- [ ] Code snippet validation.
- [ ] Responsive testing.
- [ ] Accessibility testing.
- [ ] Static build verification.

**Deliverable:** Seluruh quality gates lulus.

### Phase 6 — Deployment

- [ ] Setup GitHub repository.
- [ ] Configure Vercel.
- [ ] Deploy documentation.
- [ ] Test production website.
- [ ] Check routes and links.
- [ ] Check SEO metadata.
- [ ] Publish versioned documentation.

**Deliverable:** Website dokumentasi publik yang berfungsi.

---

## 13. Acceptance Criteria

Project dinyatakan selesai jika:

- [ ] Website berhasil menggunakan Next.js stabil terbaru yang telah diuji.
- [ ] Semua tutorial ditulis menggunakan Markdown/MDX.
- [ ] MDX berhasil di-render pada Next.js App Router.
- [ ] Website responsive pada desktop dan mobile.
- [ ] Search dokumentasi berjalan tanpa database.
- [ ] Code blocks memiliki syntax highlighting dan copy button.
- [ ] Semua tutorial memiliki penjelasan dan instruksi testing.
- [ ] Project contoh menggunakan SDK Midtrans resmi.
- [ ] Prisma dan Zod terintegrasi dengan benar.
- [ ] Webhook memverifikasi status pembayaran.
- [ ] Status pembayaran memakai enum internal.
- [ ] Code snippets sesuai dengan source code yang diuji.
- [ ] Semua required tests lulus.
- [ ] Tidak ada TypeScript atau build error.
- [ ] Transaksi Sandbox end-to-end berhasil.
- [ ] Website dokumentasi berhasil di-deploy ke Vercel.
- [ ] Seluruh halaman dapat diakses tanpa runtime backend.
- [ ] Tidak ada API Key atau informasi rahasia dalam repository.

---

## 14. Definition of Done

Satu chapter tutorial baru dianggap selesai apabila:

1. Konten MDX lengkap.
2. Semua contoh kode berasal dari project contoh yang sesuai.
3. Source code lulus typecheck, lint, dan automated tests.
4. Instruksi berhasil diverifikasi pada versi dependency yang dicantumkan.
5. Hasil yang diharapkan dijelaskan.
6. Troubleshooting tersedia.
7. Link dokumentasi resmi disertakan.
8. Halaman berhasil dibangun dan dirender.
9. Reviewer menyetujui akurasi teknis.
10. Tidak ada known critical issue pada materi tersebut.

---

## 15. Official References

**Next.js**

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/mdx
- https://nextjs.org/docs/app/guides/static-exports

**Midtrans**

- https://github.com/Midtrans/midtrans-nodejs-client
- https://docs.midtrans.com/docs/snap-snap-integration-guide
- https://docs.midtrans.com/docs/https-notification-webhooks

**Prisma**

- https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/sqlite

**Zod**

- https://zod.dev/

**Vercel**

- https://vercel.com/docs/plans/hobby

---

## 16. Final Product Requirement

Produk akhir adalah website tutorial Midtrans berbahasa Indonesia yang mudah dipelajari, memiliki dokumentasi MDX yang terstruktur, serta menyediakan source code Next.js dan Prisma yang dapat dijalankan dan telah melalui pengujian.

Prioritas pengembangan:

**Code correctness → Payment security → Tutorial clarity → Developer experience → UI polish → Deployment.**

Akurasi kode dan keamanan pembayaran tidak boleh dikorbankan demi menyederhanakan tutorial.