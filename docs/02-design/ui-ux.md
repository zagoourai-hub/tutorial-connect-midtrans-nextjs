# UI/UX Specification

Status: **DRAFT — usulan A-05, menunggu persetujuan**  
Baseline: PRD FR-01–FR-06, bagian 5–6 dan 10; [Architecture](architecture.md). Referensi: [design.png](../../design/design.png), [index.css](../../design/index.css).

## 1. Prinsip dan penggunaan referensi

Prioritas: keterbacaan tutorial/kode, navigasi bertahap, aksesibilitas, lalu kesetiaan visual. Gambar adalah referensi presentasi; requirement dan urutan chapter mengikuti PRD. Jangan menerbitkan snippet, klaim SDK, atau logo/ilustrasi dari mockup sebagai materi teknis yang telah diverifikasi.

Mockup memperlihatkan landing page dan layout dokumentasi tiga kolom, mobile drawer, search dialog, dark mode, code tabs dan callout. FAQ pada header, tab beberapa package manager, dan pilihan bahasa yang tersirat pada mockup bukan fitur wajib PRD; tidak ditambahkan pada MVP. pnpm cukup sebagai command utama. Learning roadmap, prasyarat dan tautan resmi tetap dibuat walau tidak seluruhnya terlihat pada gambar.

## 2. Information architecture

| Route | Konten |
| --- | --- |
| `/` | Hero, CTA, stack, materi yang dipelajari, roadmap, prasyarat, referensi/source |
| `/docs/introduction` | Midtrans, Snap, redirect/popup, Sandbox/Production dan alur |
| `/docs/setup` | Setup Next.js dan tooling |
| `/docs/midtrans-setup` | Akun Sandbox, keys dan environment |
| `/docs/prisma` | Prisma, SQLite, schema dan migration |
| `/docs/validation` | Zod dan validasi trust boundary |
| `/docs/midtrans-sdk` | SDK dan pembuatan transaksi |
| `/docs/checkout-api` | Checkout dan harga server |
| `/docs/payment-button` | Tombol, loading/error dan redirect |
| `/docs/webhook` | Signature, status, idempotensi |
| `/docs/payment-status` | Status, refund dan akses order |
| `/docs/testing` | Sandbox dan troubleshooting |
| `/docs/production` | Security dan batas deployment |
| `/docs/snap-popup` | Tambahan opsional; tampil dalam navigasi hanya jika konten siap |
| Route tidak dikenal | Custom 404 dengan tautan kembali |

Kelompok sidebar: Pengenalan; Persiapan Project; Implementasi; Pengujian; Produksi; Tambahan. Satu sumber metadata navigasi mengendalikan sidebar, breadcrumb dan previous/next. Heading di MDX mengendalikan TOC; tidak membuat dua TOC independen seperti bagian berulang dalam mockup.

## 3. Layout responsive — ukuran usulan

| Lebar viewport | Perilaku |
| --- | --- |
| Di bawah 768 px | Satu kolom; header ringkas, sidebar melalui drawer; TOC collapsible di atas artikel |
| 768–1199 px | Sidebar kiri sekitar 240 px dan artikel; TOC collapsible; tanpa kolom kanan tetap |
| Mulai 1200 px | Sidebar kiri sekitar 240 px, artikel fleksibel maksimum sekitar 760 px, TOC kanan sekitar 200 px |

Ukuran dapat disesuaikan setelah pemeriksaan desain pada 320, 375, 768, 1024 dan 1440 px. Artikel tidak menyebabkan horizontal page scrolling. Code block dan tabel panjang memiliki area scroll sendiri. Sidebar/TOC sticky di desktop dengan ruang untuk header; anchor memakai scroll offset agar heading tidak tertutup.

Hero memakai judul berbahasa Indonesia, primary CTA ke introduction, secondary CTA ke source GitHub yang telah ditetapkan. Ilustrasi bersifat dekoratif; boleh dibuat dari markup/aset lokal yang tersedia tanpa menambah layanan gambar. Pada mobile, CTA ditumpuk dan teks tetap menjadi fokus.

## 4. Tokens dan tipografi

- Reuse Button, `cn`, dan ThemeProvider existing. Gunakan komponen shadcn yang diperlukan, tanpa mengganti library UI.
- Referensi light primary `#155dfc`, radius `0.525rem`, background putih, border `#e5e5e5`; adaptasikan ke semantic tokens existing, bukan menambah sistem tema kedua.
- Referensi CSS memakai Agdasima/Playfair, sedangkan template memakai Inter/Geist Mono. **Usulan A-05: pertahankan Inter untuk keterbacaan tutorial, Geist Mono untuk kode, dan ambil palet/radius referensi.** Alternatif memakai font referensi memerlukan evaluasi keterbacaan dan approval visual.
- Dark mode mengikuti semantic tokens referensi dan pemeriksaan kontras. Light/dark/system tersedia dengan kontrol berlabel; hotkey existing `d` boleh tetap sebagai tambahan, tidak menjadi satu-satunya kontrol.
- Warna biru untuk primary/link/active; status tidak dikomunikasikan melalui warna saja. Pertahankan focus ring yang terlihat.
- Font body usulan 16 px, line-height sekitar 1.7, satu H1 per halaman; heading tersusun hierarkis. Ukuran/radius final mengikuti hasil review visual, bukan klaim pixel-perfect.

## 5. Komponen dan interaksi

| Komponen | Perilaku dan states |
| --- | --- |
| DocsSidebar | Active route memakai `aria-current`; kelompok bisa collapse; link tetap berfungsi tanpa script pengamatan heading |
| Mobile drawer | Tombol buka/tutup berlabel, focus trap, Escape menutup, fokus kembali ke pemicu, tutup setelah navigasi |
| TableOfContents | Heading H2/H3, anchor stabil, active heading saat scroll; native anchor tetap bekerja tanpa enhancement |
| DocsSearch | Dialog dari tombol atau Cmd/Ctrl+K; input berlabel; loading index, hasil, kosong dan gagal; tombol retry jika index gagal |
| Search results | Cari judul dan isi, tanpa backend; judul chapter/heading dan excerpt singkat; keyboard arrows/Enter/Escape dengan focus management; hasil nol menjelaskan cara mengganti kata kunci |
| CodeBlock | Highlight saat build, filename/language, scroll horizontal, copy, link source asli bila relevan |
| CopyButton | Salin teks mentah tanpa line numbers; sukses diumumkan melalui live region; gagal memberi petunjuk salin manual |
| Callout | Info, warning, error, success dengan ikon/label, tanpa bergantung pada warna |
| Chapter footer | Previous/next sesuai urutan; hilangkan tombol yang tidak memiliki tujuan |
| ThemeToggle | Pilihan terang/gelap/sistem, label aksesibel; hindari flash dan hydration mismatch |

Search index tidak dimuat berulang pada setiap keystroke. Query hanya di browser, tidak dicatat ke layanan analytics. Tidak ada pencarian AI atau tracking pengguna. Animasi sederhana menghormati `prefers-reduced-motion`.

## 6. Format chapter dan metadata

Setiap chapter mengikuti PRD: tujuan, prasyarat, langkah, kode/nama file, penjelasan, validasi/testing, troubleshooting, hasil akhir dan referensi. Tambahkan versi dependency yang diuji, tanggal validasi dan hasil aktual; jangan memberi label teruji pada konten draft.

Metadata statis mencakup title, description, canonical, Open Graph, sitemap dan robots. Domain/source URL TBD (A-06). Breadcrumb menunjukkan posisi chapter. Tautan eksternal diberi label jelas; tautan source menuju file/versi yang sesuai snippet. Structured data hanya ditambahkan jika kebutuhan dan kontennya jelas.

## 7. UI aplikasi contoh pembayaran

Tidak menambah desain e-commerce penuh. Halaman checkout sederhana menampilkan produk seed, jumlah, total informatif, dan tombol bayar. Harga frontend bukan otoritas.

- Saat sesi/checkout diproses: tampilkan loading dan cegah klik berulang; Idempotency-Key tetap dipertahankan saat retry.
- Error validasi dapat diperbaiki; provider gagal pasti menampilkan pesan aman; hasil UNKNOWN/PENDING menampilkan instruksi menunggu/rekonsiliasi tanpa mendorong order baru.
- Setelah redirect kembali, halaman status membaca database dan memerlukan cookie pemilik; status callback di URL tidak mengubah status.
- Tampilkan PENDING, PAID, FAILED, CANCELED, EXPIRED, PARTIALLY_REFUNDED dan REFUNDED dengan label Bahasa Indonesia; refresh manual tersedia.
- Token hilang/expired atau order tidak dikenal menggunakan halaman 404 generik tanpa membocorkan keberadaan order. Jelaskan batas kehilangan akses pada tutorial.
- Snap Popup hanya chapter opsional; pembatalan popup bukan bukti transaksi CANCELED di database.

## 8. Acceptance checks implementasi

- Semua route dan CTA valid pada static export, bukan hanya development server.
- Desktop/mobile sesuai struktur desain; tidak ada overflow halaman pada lebar 320 px.
- Keyboard dapat membuka/menutup drawer dan search, memilih hasil, memakai copy/theme, dan kembali ke fokus semula.
- Semantic landmarks, skip link, heading terurut, input berlabel, kontras WCAG AA, dan target sentuh yang memadai diperiksa.
- Tema light/dark/system, empty/error states, clipboard gagal, search index gagal, anchor duplikat dan chapter pertama/terakhir diuji.
- Tidak ada kontrol palsu, tautan placeholder atau klaim pembayaran sukses dari callback.

Acceptance checks ini adalah target implementasi; visual QA dan accessibility test belum dilakukan pada aplikasi karena source tidak diubah.
