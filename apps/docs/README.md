# Website Midtrans Tutorial

Website dokumentasi statis berbahasa Indonesia, mengikuti [referensi desain](../../design/design.png).

Dari root repository:

```sh
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm links
pnpm snippets
pnpm start
```

- Konten: `content/*.mdx`, dengan urutan chapter di `content/chapters.json`.
- `SourceCode` membaca source pendukung hanya saat build, bukan menjalankan pembayaran.
- Pencarian memakai `public/search-index.json`, dihasilkan otomatis sebelum dev/build.
- Hasil static export: `out/`. Website tidak memerlukan database atau Midtrans API key.
- Preview build melalui `pnpm start`: `http://localhost:4173`.
- Tema memakai shadcn/ui `DropdownMenu` dan `Button` dengan next-themes; kartu materi, roadmap dan prasyarat memakai `Card` dari style `base-nova`.
- E2E memakai MCP Playwright mode extension pada Chrome yang sudah terbuka, tanpa installer browser di project.
- Postbuild menormalkan file segment static export Next.js pada Windows. Regression check memakai `node --test apps/docs/scripts/normalize-static-export.test.mjs` dari root.
- Domain produksi ditentukan nanti melalui `NEXT_PUBLIC_SITE_URL`; hosting tetap task terakhir.

Lihat [README root](../../README.md) dan [task breakdown](../../docs/03-planning/tasks.md) untuk scope dan status validasi.
