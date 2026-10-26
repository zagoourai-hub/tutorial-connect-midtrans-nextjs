# Midtrans Next.js Tutorial

Website tutorial integrasi Midtrans berbahasa Indonesia. Requirement produk ada di [PRD.md](PRD.md), rancangan di [docs/02-design](docs/02-design/architecture.md), dan pekerjaan bertahap di [tasks.md](docs/03-planning/tasks.md).

## Struktur repository

```text
apps/
  docs/              Template Next.js untuk website dokumentasi
design/              Referensi visual
docs/02-design/      Rancangan teknis
docs/03-planning/    Task dan handoff
PRD.md               Baseline requirement
pnpm-workspace.yaml Konfigurasi workspace
pnpm-lock.yaml      Lockfile bersama
```

`apps/docs` adalah website tutorial statis dengan nama package `next-app`: landing page, 13 chapter MDX, sidebar, daftar isi, pencarian lokal, copy kode, serta tema terang/gelap/sistem. Layout mengikuti referensi di `design/`.

Scope terbaru adalah **website tutorial saja**. `apps/payment-example` menyimpan source pendukung materi dari pekerjaan sebelumnya; website hanya membacanya saat build untuk menampilkan contoh kode. Website tidak menjalankan checkout, database, webhook atau koneksi Midtrans dan tidak memerlukan Server Key. Pengembangan serta pengujian aplikasi pembayaran berada di luar pekerjaan website saat ini.

## Menjalankan project

Lingkungan validasi website: Node.js 26.12.1 dan pnpm 12.5.1. Gunakan pnpm dan lockfile bersama.

Jalankan dari root repository. Sebelum instalasi atau package execution, ikuti audit dependency sesuai instruksi project.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

Buka `http://localhost:3000`. Command website tersedia dari root:

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
pnpm snippets
pnpm links
```

`build` menghasilkan `apps/docs/out` dan menormalkan nama file segment Next.js untuk hasil build Windows. `start` menyajikan output tersebut di `http://localhost:4173`, tanpa server pembayaran. `links` dan pemeriksaan browser memerlukan hasil build. E2E dijalankan melalui MCP Playwright mode extension pada Chrome yang sudah terbuka; tidak ada installer browser atau dependency Playwright/Vitest di project. `format` juga tersedia dan menulis file.

Regression check normalisasi export memakai test runner bawaan Node.js: `node --test apps/docs/scripts/normalize-static-export.test.mjs`.

Pencarian memakai index JSON yang dihasilkan saat build; syntax highlighting juga berjalan saat build. Snippet ditampilkan langsung dari file source sehingga tidak ada salinan kode manual yang berbeda. Hasil test website tidak merupakan bukti bahwa transaksi pembayaran nyata telah berhasil.

## Git dan deployment

Git root sekarang berada di root project, mencakup aplikasi, PRD, desain dan task. Riwayat commit template dipertahankan saat file dipindahkan ke `apps/docs`.

Repository: [tutorial-connect-midtrans-nextjs](https://github.com/zagoourai-hub/tutorial-connect-midtrans-nextjs). Branch pekerjaan: `feat/midtrans-tutorial`. Perubahan tidak otomatis di-commit, di-push atau di-deploy.

**Hosting adalah task terakhir.** Saat domain ditentukan, set `NEXT_PUBLIC_SITE_URL` sebelum build untuk canonical URL dan sitemap produksi. Default lokal adalah `http://localhost:3000`. Artefak yang diunggah hanya `apps/docs/out`; runtime aplikasi contoh tidak ikut dipublikasikan. Konfigurasi hosting final dan deployment belum dikerjakan.

File env, database SQLite, dependency terpasang dan output build diabaikan oleh Git. Jangan memasukkan Server Key atau data pembayaran ke repository.
