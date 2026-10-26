# Implementation Task Breakdown

Tanggal: 26 Oktober 2026  
Status: **Website tutorial selesai diimplementasikan dan divalidasi lokal; hosting task terakhir**
Proses: [WORKFLOW Phase 3](../../WORKFLOW.md). Penyusunan daftar ini tidak mengubah status persetujuan desain.

## 1. Baseline dan aturan eksekusi

- PRD tersedia: [PRD.md v1.0.0](../../PRD.md). Path `docs/01-product/prd.md` belum ada; PRD root digunakan sebagai baseline TASK-002 berdasarkan pilihan task dan instruksi lanjut developer. Ini tidak mengubah requirement PRD atau menyetujui seluruh pilihan desain lain.
- Desain: [Architecture](../02-design/architecture.md), [Database/ERD](../02-design/database.md), [API](../02-design/api-spec.md), [UI/UX](../02-design/ui-ux.md), [Security](../02-design/security.md). Kelima dokumen masih DRAFT saat task breakdown dibuat.
- Referensi visual: [design.png](../../design/design.png) dan [index.css](../../design/index.css).
- Kondisi awal saat perencanaan: hanya template `next-app/`, file staged dan belum ada commit; Git root berada di `next-app/`. Snapshot historis TASK-001 dan hasil review ada di §13; perkembangan migrasi ada di §14.
- Path `apps/docs` sudah tersedia setelah TASK-002; `apps/payment-example` tetap target TASK-004, belum tersedia.
- Urutan nomor bersifat topologis: dependency task selalu bernomor lebih kecil. Di antara task yang dependency-nya sudah DONE, kerjakan P0 sebelum P1. Task pada cabang independen tidak perlu menunggu semua nomor sebelumnya.
- P0: fondasi, correctness dan keamanan pembayaran. P1: seluruh kebutuhan website/konten/quality/release yang tetap wajib untuk MVP. P2: Snap Popup opsional, tidak menghalangi MVP Redirect.
- Status mengikuti workflow: TODO → IN_PROGRESS → IN_REVIEW → DONE; BLOCKED untuk hambatan eksplisit. TODO tidak otomatis berarti siap: dependency task dan gate eksternal keduanya harus terpenuhi.
- Kerjakan satu task setelah dipilih. Sertakan test relevan di task pembuat logika; task QA hanya menutup gap lintas modul, bukan menunda testing sampai akhir.
- Semua task di luar scope login/CMS, dashboard merchant, transaksi nyata di website docs, stok, email, queue, search API eksternal dan backend publik. Tidak mengubah requirement PRD tanpa persetujuan.

## 2. Gate eksternal

Gate A-01–A-06 berasal dari register Architecture; angka atau pilihan yang masih usulan tidak dianggap sudah disetujui hanya karena masuk acceptance criteria.

| Gate | Kondisi selesai | Task yang memerlukannya |
| --- | --- | --- |
| A-01 | PRD root digunakan untuk scope TASK-002 berdasarkan task yang dipilih developer; tidak ada perubahan requirement | Baseline migrasi TASK-002 tersedia; keputusan desain backend/UI tetap mengikuti gate masing-masing |
| A-02 | **Disetujui untuk TASK-002**: developer memilih penataan Git root/workspace dan menegaskan lanjut setelah tujuan pemindahan dijelaskan | TASK-002 selesai dengan file/riwayat dipertahankan; bukan izin reset, force push atau deployment |
| A-03 | Kontrak data/API, sesi anonim, satu payment attempt dan recovery disetujui | TASK-005, TASK-008, TASK-010–TASK-019 dan task turunannya |
| A-04 | Batas body/cart/nominal/rate, timeout, conflict retry dan masa akses disepakati sesuai Security §4 | TASK-007–TASK-020 sesuai scope dan turunannya |
| A-05 | Adaptasi tokens/font/breakpoints dan interaksi UI disetujui | TASK-022 dan UI docs turunannya |
| A-06 | URL source repository sudah diketahui: `https://github.com/zagoourai-hub/tutorial-connect-midtrans-nextjs`; domain publik final tetap TBD | TASK-026/029 dapat memakai source URL nyata; TASK-043/046/048 tetap memerlukan domain/hosting final |
| E-SANDBOX | Kredensial Sandbox melalui env lokal, akun dan Notification URL/tunnel HTTPS tersedia | TASK-020; tanpa membagikan secret ke chat/Git |
| E-RELEASE | Akun/akses hosting dan Git tersedia; developer menyetujui deployment produksi | TASK-048, setelah review dan gates wajib lulus |

Penyusunan task sudah diotorisasi. Persetujuan pilihan desain yang masih terbuka dicatat pada handoff task terkait, bukan diasumsikan dari permintaan perencanaan.

## 3. Validation requirements bersama

- **V-BASE:** lint dan typecheck untuk package yang berubah; build ketika menyentuh route/config/rendering/bundling. Jalankan scripts yang benar-benar tersedia, jangan mengklaim test yang belum ada.
- **V-LOGIC:** unit test untuk branch/parser/money/security; integration test pada batas DB/API; test gagal harus membuktikan invariant, bukan sekadar menyalin implementasi.
- **V-UI:** keyboard/focus/error states, light/dark/system bila relevan, viewport 320/375/768/1024/1440 px. Periksa hasil render, bukan hanya markup.
- **V-CONTENT:** struktur PRD §6 lengkap; Bahasa Indonesia; filename/kode/penjelasan/testing/troubleshooting/hasil/referensi; versi dan tanggal hasil aktual; MDX build, links dan snippet verifier lulus; reviewer menyetujui akurasi teknis sesuai PRD §14. Jalankan langkah relevan dari keadaan awal yang dinyatakan. Chapter konseptual memakai verifikasi alur sebagai pengganti command yang tidak relevan. Jangan memublikasikan scaffold/draft sebagai tutorial teruji.
- **V-SUPPLY:** sebelum install/update dependency, package execution, migration atau build, ikuti audit dependency yang berlaku; lanjut hanya jika hasil aman (`SAFE_NO_KNOWN_IOC`). Read-only planning ini tidak menjalankan package atau audit instalasi. Lockfile dan versi Node/pnpm/dependency hasil pengujian dicatat saat implementasi.
- **V-HANDOFF:** catat scope, file berubah, command/hasil aktual, risiko dan next action pada handoff repository mengikuti WORKFLOW §5. DONE hanya setelah scope, validation, review dan temuan Critical/High terselesaikan. Tidak menjalankan operasi destruktif atau deployment produksi tanpa persetujuan.

## 4. Fondasi dan aplikasi contoh pembayaran

### TASK-001 — Verifikasi baseline dan kesiapan lingkungan

- Status: DONE
- Priority: P0
- Model: Sol
- Deskripsi: Menghasilkan baseline faktual sebelum perubahan struktur atau dependency.
- Scope: Read-only inventory Git, manifest/lockfile, Node/pnpm yang tersedia, panduan Next terpasang, dan kebutuhan versi PRD; catat hasil pada handoff task. Tidak menginstal dependency, menjalankan package, memindahkan file atau memilih ulang requirement.
- Dependencies: Tidak ada; PRD dan desain existing cukup untuk inspeksi. A-01/A-02 dicatat jika belum diputuskan.
- File/modul: `next-app/package.json`, `pnpm-lock.yaml`, `AGENTS.md`, README dan konfigurasi existing; `docs/03-planning/tasks.md` untuk handoff.
- Acceptance criteria: (1) Lokasi Git dan daftar staged/untracked tercatat tanpa membocorkan env. (2) Versi runtime/package manager yang tersedia dibedakan dari versi manifest. (3) Gap MDX, Prisma/SQLite enum/adapter dan typing SDK tercatat beserta referensi versi yang perlu diverifikasi. (4) Ada daftar gate terbuka dan command validasi yang tersedia; tidak mengklaim kompatibilitas belum diuji.
- Validation requirements: Inspeksi read-only dan cocokkan ulang hasil inventory dengan manifest/status Git; V-HANDOFF. Tidak perlu menjalankan lint/build untuk task inventory.

### TASK-002 — Bentuk pnpm workspace dan pertahankan template existing

- Status: DONE
- Priority: P0
- Model: Sol
- Deskripsi: Menyiapkan satu repository yang dapat mencakup kedua aplikasi sesuai PRD §8.
- Scope: Transisi Git yang disetujui, root workspace/scripts/ignore dan penggunaan template sebagai `apps/docs`; tidak mengubah fitur atau menghapus staged changes.
- Dependencies: TASK-001 DONE; baseline PRD root digunakan untuk task ini (A-01), dan transisi repository disetujui (A-02). Keputusan desain lain tidak ikut dianggap disetujui.
- File/modul: Root `package.json`, `pnpm-workspace.yaml`, lockfile, ignore, README; `next-app/` → `apps/docs/` sesuai keputusan.
- Acceptance criteria: (1) Git root mencakup PRD/design/docs dan target apps tanpa nested Git. (2) Semua file template dan pekerjaan staged dapat ditelusuri sebelum/sesudah transisi. (3) pnpm mengenali package docs, satu lockfile workspace digunakan. (4) Perintah docs existing tetap tersedia dari workspace; tidak ada reset/delete destruktif tanpa approval.
- Validation requirements: V-SUPPLY, V-BASE pada docs; periksa status Git, daftar workspace dan inventory TASK-001; V-HANDOFF.

### TASK-003 — Siapkan scripts dan test harness minimum

- Status: DONE
- Priority: P0
- Model: Sol
- Deskripsi: Menyediakan command kualitas yang dapat dipakai setiap task berikutnya.
- Scope: Scripts lint/typecheck/build per package, Vitest untuk unit/integration dan Playwright untuk browser; konfigurasi minimum tanpa CI/deploy dahulu.
- Dependencies: TASK-002.
- File/modul: Root/package scripts, konfigurasi test dan fixture minimum.
- Acceptance criteria: (1) Command workspace dapat menarget package secara terpisah. (2) Smoke test Vitest memeriksa elemen navigasi/teks existing melalui fixture dan browser smoke membuka halaman docs serta memeriksa konten yang benar, bukan test pass kosong. (3) Konfigurasi test dapat dijalankan tanpa env pembayaran dan tidak memakai database developer. (4) Dokumentasi membedakan mock test dari Sandbox; fixture DB/SDK menjadi scope TASK-005/009, bukan syarat tertunda untuk menyelesaikan task ini.
- Validation requirements: V-SUPPLY; jalankan smoke harness, lint/typecheck dan docs build; periksa test tidak bergantung pada aplikasi example yang belum dibuat; V-HANDOFF.

### TASK-004 — Inisialisasi payment-example dan validasi environment

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menyiapkan aplikasi Node.js terpisah untuk tutorial pembayaran.
- Scope: Next.js/TypeScript strict, Zod, env schema dan `.env.example`; tidak membuat transaksi atau mengaktifkan production.
- Dependencies: TASK-003.
- File/modul: `apps/payment-example/package.json`, konfigurasi Next/TS, `lib/validations/`, `.env.example`, ignore dan README.
- Acceptance criteria: (1) Example build terpisah dari docs dan tidak memakai static export. (2) Env invalid ditolak sebelum operasi pembayaran; Sandbox default, production eksplisit. (3) Docs build tidak membutuhkan keys pembayaran. (4) Env/database/journal lokal di-ignore dan placeholder tidak berisi secret.
- Validation requirements: V-SUPPLY, V-BASE; unit test env kosong/invalid/Sandbox/production eksplisit; scan env names/bundle docs; V-HANDOFF.

### TASK-005 — Implementasikan schema Prisma dan migration SQLite

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Membuktikan model data dan enum dapat dijalankan pada versi Prisma/adapter terpilih.
- Scope: Empat model, enum, nullable fields, FK, unique constraints, revision dan Prisma Client; tidak membuat API atau mengganti enum PRD menjadi string bebas.
- Dependencies: TASK-004; A-03.
- File/modul: `apps/payment-example/prisma/schema.prisma`, migrations, konfigurasi Prisma, `lib/prisma.ts`.
- Acceptance criteria: (1) Product/Order/OrderItem/Payment dan enum sesuai Database Design. (2) Migration berjalan pada DB sementara kosong; client dapat CRUD fixture. (3) FK/restrict, unique key, unique payment/order dan pasangan item dibuktikan menolak data salah. (4) Kegagalan transaksi rollback; DB test tidak menyentuh data lokal developer.
- Validation requirements: V-SUPPLY; Prisma validate/generate, migration DB sementara, integration tests constraints/rollback, V-BASE; V-HANDOFF.

### TASK-006 — Tambahkan seed produk yang dapat diulang

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menyediakan katalog minimal yang dapat direproduksi untuk tutorial dan test.
- Scope: Seed produk ID/nama/harga integer/aktif; fixture test memakai pola yang sama, tanpa endpoint pengelolaan produk.
- Dependencies: TASK-005.
- File/modul: `apps/payment-example/prisma/` seed dan fixtures tests.
- Acceptance criteria: (1) Seed dua kali tidak menggandakan produk. (2) Produk aktif/nonaktif dan harga valid tersedia untuk skenario test. (3) Seed tidak mereset atau menghapus order. (4) Command dan database tujuan terdokumentasi.
- Validation requirements: V-SUPPLY, V-BASE; integration test seed dua kali pada DB sementara dan order existing tetap utuh; V-HANDOFF.

### TASK-007 — Terapkan validasi request dan pembatasan resource

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menyiapkan trust boundary bersama untuk sesi, checkout dan webhook.
- Scope: Zod checkout/webhook, pembatas byte aktual, media type, Origin sesuai endpoint, rate admission dan error envelope; tidak menambah Redis/proxy baru.
- Dependencies: TASK-004; A-04.
- File/modul: `apps/payment-example/lib/validations/` dan fungsi guard yang dipakai Route Handlers.
- Acceptance criteria: (1) Keranjang kosong/duplikat, quantity/batas item dan field harga client ditolak. (2) Body terlalu besar ditolak walau tanpa Content-Length; schema webhook menerima field resmi tambahan. (3) Limiter menolak setelah batas disetujui, membersihkan expired entries dan membatasi map. (4) Origin palsu ditolak pada sesi/checkout; webhook tidak memerlukan cookie/Origin browser; header forwarded tak tepercaya tidak membypass kuota.
- Validation requirements: V-BASE, V-LOGIC; boundary tests ukuran/rate/cart, fake clock untuk expiry, request malformed dan chunked; integrasi ke route dibuktikan pada TASK-008/012/015; V-HANDOFF.

### TASK-008 — Implementasikan sesi anonim dan pemeriksaan pemilik order

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Melindungi order tanpa fitur akun/login.
- Scope: POST `/api/session`, cookie opaque, hash/expiry dan fungsi otorisasi order bersama; tidak menyimpan token di URL/localStorage atau membuat tabel User.
- Dependencies: TASK-005, TASK-007; A-03 dan A-04.
- File/modul: `apps/payment-example/app/api/session/route.ts`, fungsi akses order dan tests.
- Acceptance criteria: (1) Endpoint 204 membuat token CSPRNG dan memakai ulang cookie valid. (2) HttpOnly/SameSite/Path/Secure/masa akses sesuai keputusan; pengecualian Secure hanya localhost development. (3) DB hanya menyimpan hash; token salah/expired tidak membuka order. (4) Origin/rate limit bekerja dan response privat no-store.
- Validation requirements: V-BASE, V-LOGIC; test cookie attributes, expiry, sesi berbeda, Origin dan no-store; V-HANDOFF.

### TASK-009 — Integrasikan SDK Midtrans dengan batas transport

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Memastikan method runtime, typing dan timeout SDK cocok dengan versi yang dikunci.
- Scope: Snap server-only, create/status, validasi respons dan redirect allowlist, timeout transport, redaksi error/log; tanpa transaksi nyata.
- Dependencies: TASK-004, TASK-007; A-04.
- File/modul: `apps/payment-example/lib/midtrans.ts`, schema respons dan SDK fixtures/tests.
- Acceptance criteria: (1) Versi SDK dan method create/status/notification yang benar dicatat dari sumber resmi/versi terpasang. (2) Respons invalid dan redirect HTTP/host palsu ditolak. (3) Timeout membatasi transport yang sesungguhnya, bukan hanya menolak Promise sementara request berjalan. (4) Server Key/URL token/raw error tidak bocor ke client/log; Sandbox dan production tidak tertukar.
- Validation requirements: V-SUPPLY, V-BASE, V-LOGIC; fake transport untuk timeout dan respons malformed, typing terhadap API runtime; hasil provider nyata hanya pada TASK-020; V-HANDOFF.

### TASK-010 — Buat snapshot order dan perhitungan harga atomik

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menghitung nominal dari Product dan menyimpan satu order lengkap.
- Scope: Ambil produk aktif, snapshot nama/harga, subtotal/total, ID server dan pembuatan Order/Items/Payment dalam satu transaksi singkat; tanpa SDK call.
- Dependencies: TASK-006, TASK-008; A-03 dan A-04.
- File/modul: `apps/payment-example/lib/` logika order, integration tests.
- Acceptance criteria: (1) Harga frontend tidak dipakai; total sama dengan jumlah subtotal integer IDR. (2) Produk hilang/nonaktif menghasilkan 404 dan tidak membuat order parsial. (3) Overflow/batas total ditolak. (4) Perubahan harga produk kemudian tidak mengubah order tersimpan; kegagalan insert rollback seluruh order/items/payment.
- Validation requirements: V-BASE, V-LOGIC; integration test snapshot, batas nominal, produk tidak ada dan rollback; V-HANDOFF.

### TASK-011 — Pastikan reservasi checkout idempotent

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menentukan satu order/pemenang create untuk key yang sama.
- Scope: Unique key, fingerprint cart deterministik, replay dan pemeriksaan sesi; tidak memanggil provider dahulu.
- Dependencies: TASK-010; A-03.
- File/modul: Logika checkout/order di `apps/payment-example/lib/`, tests.
- Acceptance criteria: (1) Request paralel key/cart/sesi sama menghasilkan tepat satu order dan satu izin create. (2) Urutan items berbeda dengan pasangan sama diperlakukan identik. (3) Cart berbeda menghasilkan 409; key milik sesi lain menghasilkan 404 generik. (4) INITIATED/UNKNOWN/terminal tidak menghasilkan reservasi create kedua.
- Validation requirements: V-BASE, V-LOGIC; concurrency integration test memakai DB sementara, cek jumlah row dan winner; V-HANDOFF.

### TASK-012 — Selesaikan Checkout API dan persist hasil Snap

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menghubungkan reservasi order dengan satu pemanggilan create Snap.
- Scope: POST `/api/checkout`, persist READY/UNKNOWN/FAILED, replay dan HTTP contract; tanpa recovery otomatis atau perubahan status dari callback.
- Dependencies: TASK-009, TASK-011; A-03 dan A-04.
- File/modul: `apps/payment-example/app/api/checkout/route.ts`, logika checkout dan tests.
- Acceptance criteria: (1) Create sukses 201, replay READY 200 dengan order/URL sama; SDK create hanya sekali. (2) Proses concurrent/timeout/crash fixture menghasilkan INITIATED/UNKNOWN dan 202 tanpa create ulang. (3) DB gagal setelah SDK sukses tidak dianggap bukti gagal bayar; retry mempertahankan order/key. (4) Semua error checkout API Spec §3 memiliki test; persist Snap tidak menimpa paymentStatus yang sudah berubah.
- Validation requirements: V-BASE, V-LOGIC; Route Handler integration dengan SDK mock, fault injection sebelum/sesudah create dan race update status; V-HANDOFF.

### TASK-013 — Implementasikan state transition pembayaran

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Membuat aturan status internal yang mencegah kemunduran dan refund ganda.
- Scope: Mapping status/fraud dan fungsi transisi/revision pada model existing; tanpa endpoint webhook.
- Dependencies: TASK-005, TASK-007; A-03 dan A-04.
- File/modul: `apps/payment-example/lib/` logika status dan tests.
- Acceptance criteria: (1) Semua mapping Database §4 teruji termasuk capture accept/challenge. (2) PAID/refund tidak mundur karena pending/event lama; duplicate identik no-op. (3) Refund kumulatif tidak menurun/melebihi total; refund sebelum notifikasi PAID dapat diterapkan berdasarkan data terverifikasi. (4) Konflik revision tidak menimpa update lain; status tak dikenal tidak dipaksakan menjadi status sukses.
- Validation requirements: V-BASE, V-LOGIC; table-driven transitions dan integration tests revision/atomicity; V-HANDOFF.

### TASK-014 — Verifikasi signature dan status provider

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menetapkan data pembayaran yang boleh masuk ke state transition.
- Scope: Signature dari string asli, GET status via SDK dan pencocokan identitas/amount/fraud; tidak menerima URL fetch dari payload.
- Dependencies: TASK-009, TASK-013; A-03.
- File/modul: `apps/payment-example/lib/` verifikasi webhook/status dan tests.
- Acceptance criteria: (1) Signature salah/panjang salah ditolak sebelum provider call. (2) Formatting gross amount untuk signature dipertahankan; parsing IDR tanpa floating point. (3) Order ID, transaction ID tersimpan dan nominal mismatch tidak mengubah status. (4) Payload/response nyata dan field refund diverifikasi terhadap sumber resmi versi SDK; ketidakjelasan dicatat sebagai blocker, bukan diisi asumsi.
- Validation requirements: V-BASE, V-LOGIC; signature fixtures tanpa secret nyata, exact decimal boundary tests, SDK call-count dan mismatch tests; V-HANDOFF.

### TASK-015 — Implementasikan Webhook API atomik

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menghubungkan guards, verification dan transisi ke endpoint webhook.
- Scope: POST `/api/midtrans/webhook`, commit/no-op acknowledgement, retryable errors dan diagnostik aman; tanpa fulfillment/email.
- Dependencies: TASK-007, TASK-014; A-03 dan A-04.
- File/modul: `apps/payment-example/app/api/midtrans/webhook/route.ts`, tests.
- Acceptance criteria: (1) Respons 200 hanya setelah commit/no-op/ignore order asing yang valid sesuai kontrak. (2) Signature invalid 401; malformed/mismatch 400; oversized 413; media type 415; overload 429; provider/DB/revision unresolved 503. (3) Duplicate dan out-of-order tidak menggandakan perubahan/merusak order. (4) GET status di luar transaksi DB, retry conflict terbatas dan memverifikasi ulang sebelum commit.
- Validation requirements: V-BASE, V-LOGIC; Route Handler integration dengan fault injection dan dua notifikasi concurrent; periksa no mutation pada seluruh jalur gagal; V-HANDOFF.

### TASK-016 — Sediakan rekonsiliasi lokal untuk hasil ambigu

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Memberi developer cara memeriksa INITIATED/UNKNOWN atau webhook terlambat.
- Scope: Command lokal minimal memakai fungsi verification/transisi yang sama; kuota per-order/global; tidak membuat cron, queue atau endpoint publik.
- Dependencies: TASK-012, TASK-015; A-03 dan A-04.
- File/modul: `apps/payment-example/` command lokal, script package dan README operasional.
- Acceptance criteria: (1) Order ID tervalidasi menghasilkan hasil verifikasi tanpa create transaksi baru. (2) Timeout/hasil tak pasti tetap ambigu dan memberi instruksi aman. (3) Token/URL yang tidak dapat dipulihkan tidak dibuat-buat; kriteria transaksi baru dicatat. (4) Limit provider call dan redaksi secrets teruji; command tidak menghapus/reset data.
- Validation requirements: V-BASE, V-LOGIC; test command/fungsi dengan DB sementara dan SDK mock, fake clock rate limit; V-HANDOFF.

### TASK-017 — Buat checkout UI dengan Snap Redirect

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menyediakan frontend minimal untuk mencoba transaksi Sandbox.
- Scope: Produk seed, quantity, inisialisasi sesi, tombol/loading/error, idempotency key dan redirect; tanpa styling toko lengkap.
- Dependencies: TASK-006, TASK-008, TASK-012.
- File/modul: `apps/payment-example/app/checkout/`, `components/pay-button.tsx`.
- Acceptance criteria: (1) Tombol aktif setelah sesi siap dan mencegah double click. (2) Retry setelah network timeout memakai key/cart sama; pergantian cart tidak mereplay payload berbeda diam-diam. (3) READY redirect ke URL valid; 202/UNKNOWN tidak mengarahkan pengguna membuat order baru. (4) Error ditampilkan aksesibel tanpa raw SDK error; total informatif tidak menjadi sumber harga server.
- Validation requirements: V-BASE, V-UI; browser test double click, network failure/retry, 202, 4xx dan redirect dengan endpoint mock; V-HANDOFF.

### TASK-018 — Tampilkan status order dengan otorisasi

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Menampilkan status tersimpan tanpa mempercayai callback frontend.
- Scope: GET `/checkout/status?orderId=...`, akses cookie, tujuh label status, refresh manual dan pesan pending; tanpa polling provider langsung.
- Dependencies: TASK-008, TASK-013.
- File/modul: `apps/payment-example/app/checkout/status/page.tsx`, akses order bersama dan tests.
- Acceptance criteria: (1) Pemilik dapat membaca item/total/status; sesi lain, token expired dan order hilang memberi 404 generik sama. (2) Semua enum internal memiliki tampilan. (3) Query `transaction_status=settlement` tidak mengubah DB atau memberi label PAID. (4) Response private/no-store/noindex; refresh tidak memanggil SDK.
- Validation requirements: V-BASE, V-UI, V-LOGIC; integration/browser tests IDOR, expiry, callback spoof, semua status dan SDK call-count nol; V-HANDOFF.

### TASK-019 — Tutup gap matriks kontrak dan keamanan pembayaran

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Memastikan komponen yang sudah diuji tetap memenuhi invariant saat terintegrasi.
- Scope: Lengkapi hanya gap PRD §9.3 dan Security §7; tidak menulis ulang test yang sudah membuktikan kasus yang sama.
- Dependencies: TASK-012, TASK-015, TASK-016, TASK-017, TASK-018; A-03 dan A-04.
- File/modul: `apps/payment-example/tests/` dan handoff/matriks hasil.
- Acceptance criteria: (1) Setiap baris PRD §9.3 dipetakan ke test lulus. (2) Race checkout/webhook, crash setelah reservasi, DB fail sesudah create, refund duplikat/tidak berurutan terbukti aman. (3) Rate/body/Origin/IDOR dan redaksi secret diuji pada endpoint terintegrasi. (4) Semua test dapat dijalankan tanpa kredensial Midtrans dan DB developer tidak berubah.
- Validation requirements: V-SUPPLY, V-BASE; full unit/integration example, Prisma validate/generate, production build; catat gap Sandbox secara eksplisit; V-HANDOFF.

### TASK-020 — Verifikasi alur Sandbox end-to-end

- Status: TODO
- Priority: P0
- Model: Sol
- Deskripsi: Memvalidasi asumsi SDK, redirect, cookie return dan webhook terhadap Midtrans nyata di Sandbox.
- Scope: Satu alur sukses dan skenario gagal/batal/expired yang tersedia, notifikasi ulang, refund bila didukung akun; tidak menggunakan production keys atau uang nyata.
- Dependencies: TASK-019; E-SANDBOX.
- File/modul: `apps/payment-example/tests/` E2E, README Sandbox dan bukti hasil yang disanitasi.
- Acceptance criteria: (1) Checkout → Snap → webhook → DB → status pemilik berhasil dengan tunnel HTTPS. (2) Return cookie dan source status DB terbukti bekerja. (3) Format status/fraud/refund, signature dan retry provider dicatat dari hasil aktual. (4) Keterbatasan simulator ditandai; mock test tidak disebut Sandbox pass; skenario wajib PRD yang belum terverifikasi tetap menjadi release blocker.
- Validation requirements: E2E/Playwright bila dapat diotomasi, langkah manual tercatat untuk interaksi provider, tanggal/versi/expected-versus-actual; tidak menyimpan keys/token/screenshot sensitif; V-HANDOFF.

## 5. Website dokumentasi dan komponen

### TASK-021 — Aktifkan MDX dan static export

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Membuat fondasi dokumentasi statis tanpa runtime pembayaran.
- Scope: `@next/mdx`, mapping komponen, static export dan route introduction sebagai smoke scaffold; konten final pada TASK-028.
- Dependencies: TASK-003.
- File/modul: `apps/docs/next.config.ts`, `mdx-components.tsx`, `app/docs/introduction/page.mdx`, manifest/lockfile.
- Acceptance criteria: (1) MDX dengan heading/list/table/code berhasil dibangun ke HTML. (2) Artefak dapat disajikan server statis tanpa keys/DB/Route Handler runtime. (3) Route introduction dapat dibuka langsung dan direfresh. (4) Scaffold ditandai internal draft dan tidak dirilis sebagai chapter teruji.
- Validation requirements: V-SUPPLY, V-BASE; build dan serve artefak statis, cek route dan isolasi env; V-HANDOFF.

### TASK-022 — Terapkan tokens, tipografi dan kontrol tema

- Status: DONE
- Priority: P1
- Model: Luna
- Deskripsi: Mengadaptasi referensi visual ke sistem tema existing.
- Scope: Palet/radius/font yang disetujui, kontrol light/dark/system, semantic tokens dan Bahasa Indonesia; reuse Button/ThemeProvider/cn.
- Dependencies: TASK-021; A-05.
- File/modul: `apps/docs/app/globals.css`, `app/layout.tsx`, komponen tema.
- Acceptance criteria: (1) Satu sistem token dipakai, tanpa stylesheet tema paralel. (2) Tiga mode berfungsi dan bertahan setelah reload; tidak ada hydration error/flash yang terlihat pada pemeriksaan. (3) `lang=id`, focus ring dan kontras teks/kontrol memadai. (4) Hotkey existing tetap mengabaikan input/editable.
- Validation requirements: V-BASE, V-UI; cek render awal/reload/system change dan keyboard; V-HANDOFF.

### TASK-023 — Buat navigasi chapter dan layout desktop

- Status: DONE
- Priority: P1
- Model: Luna
- Deskripsi: Menyediakan shell dokumentasi dan metadata navigasi tunggal.
- Scope: Sidebar/collapse, artikel, slot TOC, breadcrumb, previous/next dan skip link; tidak memublikasikan chapter yang belum siap.
- Dependencies: TASK-022.
- File/modul: `apps/docs/app/docs/layout.tsx`, `components/docs-sidebar.tsx`, `lib/docs-navigation.ts`.
- Acceptance criteria: (1) Urutan route cocok dengan PRD; chapter belum tersedia tidak menjadi tautan publik aktif. (2) Desktop memiliki struktur tiga kolom dan active route `aria-current`. (3) Breadcrumb/previous-next berasal dari sumber sama; chapter pertama/terakhir tidak memiliki tautan invalid. (4) Kelompok sidebar bisa collapse tanpa kehilangan akses keyboard.
- Validation requirements: V-BASE, V-UI; test urutan/batas navigasi dan active route; V-HANDOFF.

### TASK-024 — Tambahkan mobile drawer dan layout tablet

- Status: DONE
- Priority: P1
- Model: Luna
- Deskripsi: Membuat navigasi docs dapat digunakan pada layar kecil.
- Scope: Drawer memakai metadata existing, header ringkas, layout satu/dua kolom dan TOC collapsible; tanpa navigasi kedua yang terpisah datanya.
- Dependencies: TASK-023.
- File/modul: `apps/docs/components/` mobile navigation dan docs layout.
- Acceptance criteria: (1) Drawer memiliki label, focus trap, Escape dan return focus. (2) Navigasi menutup drawer. (3) Layout sesuai rentang viewport UI/UX, tanpa page overflow pada 320 px. (4) Sidebar desktop dan drawer menunjukkan chapter aktif yang sama.
- Validation requirements: V-BASE, V-UI; browser keyboard/touch smoke dan resize antar breakpoint; V-HANDOFF.

### TASK-025 — Buat heading anchors dan Table of Contents

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menghasilkan anchor dan TOC konsisten dari heading MDX.
- Scope: Ekstraksi H2/H3, ID unik, active heading, scroll offset, desktop/mobile; tidak memelihara daftar heading manual.
- Dependencies: TASK-024.
- File/modul: `apps/docs/` pipeline MDX/heading dan `components/table-of-contents.tsx`.
- Acceptance criteria: (1) Heading berulang menghasilkan ID unik deterministik. (2) TOC mengarah ke heading hasil render yang tepat. (3) Active heading berubah saat scroll dan anchor tidak tertutup header. (4) Native anchor tetap berfungsi tanpa enhancement JS; tidak ada dua daftar TOC berulang pada tampilan sama.
- Validation requirements: V-BASE, V-LOGIC, V-UI; fixture duplicate heading, anchor deep link dan browser scroll test; V-HANDOFF.

### TASK-026 — Tambahkan code blocks dan callouts

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menyajikan contoh kode yang terbaca, dapat disalin dan ditelusuri.
- Scope: Shiki saat build, filename/language/source link, copy success/failure, table/callout dan scroll lokal; tanpa tab package manager tambahan.
- Dependencies: TASK-022, TASK-025; A-06 untuk tautan source final.
- File/modul: `apps/docs/mdx-components.tsx`, `components/code-block.tsx`, `copy-button.tsx`, callouts.
- Acceptance criteria: (1) TypeScript/Prisma/JSON/shell pada fixtures di-highlight di light/dark. (2) Copy menghasilkan teks source tanpa markup; sukses live announcement dan fallback gagal tersedia. (3) Blok panjang tidak meng-overflow halaman; filename/language terlihat. (4) Source link menuju path/versi yang sesuai; callout memakai label/ikon selain warna.
- Validation requirements: V-SUPPLY, V-BASE, V-UI; clipboard sukses/gagal dan output build diperiksa agar highlighter tidak menjadi runtime client penuh; V-HANDOFF.

### TASK-027 — Implementasikan verifikasi snippet terhadap source contoh

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mencegah konten tutorial menyimpang dari kode yang diuji.
- Scope: Referensi source/region bernama dan command pemeriksa teks snippet; tidak membuat generator dokumentasi umum.
- Dependencies: TASK-021, TASK-026; source pendukung hanya dibaca sebagai teks, tanpa menjalankan runtime pembayaran.
- File/modul: `scripts/validate-snippets.ts`, metadata MDX dan region source yang diperlukan.
- Acceptance criteria: (1) Snippet sesuai source lulus. (2) Source berubah, path/region hilang dan snippet basi menggagalkan pemeriksaan dengan lokasi jelas. (3) Snippet tidak dapat membaca path di luar workspace/source yang diizinkan. (4) Semua snippet aplikasi contoh pada chapter berikutnya terdaftar dan diverifikasi; tidak ada copy manual tanpa pemeriksaan.
- Validation requirements: V-BASE, V-LOGIC; fixtures lulus/gagal termasuk path traversal dan perubahan source; jalankan command dengan exit code benar; V-HANDOFF.

### TASK-028 — Tulis Chapter 01: Introduction

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mengganti scaffold dengan pengantar yang sesuai arsitektur teruji.
- Scope: `/docs/introduction`: Midtrans/Snap, Redirect vs Popup, Sandbox vs Production dan alur dua aplikasi.
- Dependencies: TASK-023, TASK-025, TASK-026, TASK-027; scope website tidak memerlukan E-SANDBOX.
- File/modul: `apps/docs/app/docs/introduction/page.mdx`, metadata navigasi.
- Acceptance criteria: (1) Seluruh materi Chapter 01 PRD tercakup. (2) Diagram/alur membedakan docs statis dan backend contoh, webhook dan callback. (3) Chapter lengkap menggantikan draft dan aktif di navigasi; tidak mengklaim docs memproses pembayaran.
- Validation requirements: V-CONTENT, V-BASE; cek alur terhadap Sandbox TASK-020; V-HANDOFF.

### TASK-029 — Implementasikan landing page

- Status: DONE
- Priority: P1
- Model: Luna
- Deskripsi: Menyajikan pintu masuk tutorial sesuai referensi desain.
- Scope: Hero, CTA, stack, materi, learning roadmap, prasyarat dan tautan resmi/source; tanpa FAQ/fitur tambahan mockup.
- Dependencies: TASK-024, TASK-028; A-06 untuk GitHub URL.
- File/modul: `apps/docs/app/page.tsx` dan komponen landing seperlunya.
- Acceptance criteria: (1) Seluruh daftar FR-01 tersedia. (2) CTA membuka introduction dan source URL nyata, bukan placeholder. (3) Konten Bahasa Indonesia dan layout sesuai desktop/mobile referensi. (4) Tidak ada CTA palsu, overflow atau gambar dekoratif tanpa perlakuan aksesibilitas yang tepat.
- Validation requirements: V-BASE, V-UI; klik seluruh tautan dan inspect static build; V-HANDOFF.

### TASK-030 — Bangun search index statis

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menghasilkan data pencarian dari konten yang benar-benar dipublikasikan.
- Scope: Judul, heading, teks, excerpt, route/anchor dari MDX; tanpa database/search API dan tanpa code block panjang.
- Dependencies: TASK-025, TASK-028.
- File/modul: `apps/docs/` build search script/output dan fixtures.
- Acceptance criteria: (1) Build menghasilkan index untuk semua chapter aktif dan tidak memasukkan draft/404. (2) Judul maupun keyword isi dapat ditemukan dengan normalisasi case/whitespace. (3) Route/anchor hasil valid terhadap output build. (4) Konten baru otomatis masuk index saat rebuild; tidak ada index yang ditulis manual.
- Validation requirements: V-BASE, V-LOGIC; fixtures heading/body/no-match/duplicate heading dan validasi index terhadap HTML; V-HANDOFF.

### TASK-031 — Buat search dialog yang aksesibel

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Memungkinkan pembaca mencari tutorial dengan mouse dan keyboard.
- Scope: Tombol/Cmd-Ctrl-K, lazy index, query lokal, hasil/excerpt dan loading/empty/error/retry; tanpa analytics atau AI.
- Dependencies: TASK-024, TASK-030.
- File/modul: `apps/docs/components/docs-search.tsx`, pemicu search desktop/mobile.
- Acceptance criteria: (1) Cari judul/isi membuka route atau anchor benar. (2) Keyboard arrows/Enter/Escape, focus trap dan return focus bekerja. (3) Index hanya dimuat saat diperlukan, tidak di-fetch per keystroke. (4) Tidak ada hasil dan fetch gagal memiliki pesan/aksi yang berbeda; query tidak dikirim ke backend.
- Validation requirements: V-BASE, V-LOGIC, V-UI; browser test keyboard, fetch failure/retry dan network assertions; V-HANDOFF.

## 6. Konten tutorial wajib

Semua task chapter berikut wajib V-CONTENT. Satu task mencakup satu chapter, bukan satu batch seluruh tutorial. Urutan mengikuti prasyarat pembaca; source aplikasi contoh sudah diverifikasi melalui TASK-020.

### TASK-032 — Tulis Chapter 02: Project Setup

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menjelaskan lingkungan dan setup contoh yang benar-benar dapat direproduksi.
- Scope: `/docs/setup`: Node/pnpm, create Next, strict TS, dependency, struktur dan dev server sesuai versi teruji.
- Dependencies: TASK-028.
- File/modul: `apps/docs/app/docs/setup/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 02 tersedia dengan command lengkap. (2) Langkah pada direktori sementara menghasilkan struktur/runtime yang konsisten dengan contoh. (3) Versi teruji ditulis, tanpa bergantung pada `latest` yang tidak terdokumentasi.
- Validation requirements: V-SUPPLY saat menjalankan command, V-CONTENT; V-HANDOFF.

### TASK-033 — Tulis Chapter 03: Midtrans Configuration

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menjelaskan konfigurasi Sandbox tanpa mengekspos keys.
- Scope: `/docs/midtrans-setup`: akun, Sandbox, Server/Client Key, `.env`, validasi env dan perbedaan production.
- Dependencies: TASK-032.
- File/modul: `apps/docs/app/docs/midtrans-setup/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 03 tercakup dan field UI akun diverifikasi pada sumber resmi/current Sandbox. (2) Seluruh contoh memakai placeholder aman. (3) Pembaca dapat memverifikasi env invalid ditolak dan Server Key tidak masuk frontend.
- Validation requirements: V-CONTENT, secret scan chapter/snippets; V-HANDOFF.

### TASK-034 — Tulis Chapter 04: Prisma Setup

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mengajarkan schema/adapter/migration sesuai contoh yang diuji.
- Scope: `/docs/prisma`: instalasi, SQLite, konfigurasi Prisma, empat model, enum, generate/client dan migration.
- Dependencies: TASK-033.
- File/modul: `apps/docs/app/docs/prisma/page.mdx`, navigasi.
- Acceptance criteria: (1) Seluruh materi Chapter 04 tercakup dan snippet sesuai schema/client source. (2) Langkah dari DB kosong menghasilkan empat model, enum dan seed tanpa error. (3) Batas SQLite lokal dan larangan menggunakannya sebagai persistence ephemeral dijelaskan.
- Validation requirements: V-SUPPLY, V-CONTENT; validate/generate/migration pada DB sementara; V-HANDOFF.

### TASK-035 — Tulis Chapter 05: Zod Validation

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mengajarkan schema trust boundary yang dipakai endpoint contoh.
- Scope: `/docs/validation`: API Zod PRD, safeParse/infer, schema checkout/webhook dan harga server.
- Dependencies: TASK-034.
- File/modul: `apps/docs/app/docs/validation/page.mdx`, navigasi.
- Acceptance criteria: (1) Seluruh materi Chapter 05 tercakup dengan schema asli. (2) Ada input valid dan invalid beserta hasil yang sesuai test. (3) Batas quantity/cart/payload dan penolakan harga frontend dijelaskan sesuai nilai yang disetujui.
- Validation requirements: V-CONTENT; jalankan fixture schema yang dirujuk; V-HANDOFF.

### TASK-036 — Tulis Chapter 06: Midtrans SDK

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menjelaskan SDK resmi dan batas helper notification.
- Scope: `/docs/midtrans-sdk`: instalasi, Snap, env, create token/redirect, method status/notification, typing dan error.
- Dependencies: TASK-035.
- File/modul: `apps/docs/app/docs/midtrans-sdk/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 06 sesuai SDK terkunci. (2) Contoh dapat typecheck dan merujuk implementasi nyata. (3) Tidak mengklaim notification helper sendiri memverifikasi seluruh signature/nominal; timeout ambigu dijelaskan.
- Validation requirements: V-CONTENT; cocokkan method runtime dan hasil Sandbox, test timeout yang dirujuk; V-HANDOFF.

### TASK-037 — Tulis Chapter 07: Checkout API

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mengajarkan pembuatan order/checkout yang aman dan idempotent.
- Scope: `/docs/checkout-api`: Route Handler, validasi, snapshot, order ID/PENDING, Snap response, session/key dan retry.
- Dependencies: TASK-036.
- File/modul: `apps/docs/app/docs/checkout-api/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 07 tercakup dengan request/response yang cocok API Spec. (2) Langkah memperlihatkan harga DB serta replay yang tidak menggandakan transaksi. (3) 202/UNKNOWN dibedakan dari FAILED dan pembaca tidak diarahkan mengganti key saat timeout.
- Validation requirements: V-CONTENT; jalankan request valid/invalid/replay terhadap instance test, bukan transaksi production; V-HANDOFF.

### TASK-038 — Tulis Chapter 08: Frontend Payment

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menghubungkan tombol browser ke checkout dan Snap Redirect.
- Scope: `/docs/payment-button`: Client Component, session, loading/error, key retry, redirect dan pembatalan navigasi.
- Dependencies: TASK-037.
- File/modul: `apps/docs/app/docs/payment-button/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 08 tersedia dari pay button source. (2) Sukses/loading/error/UNKNOWN dapat direproduksi. (3) Pembatalan navigasi/callback tidak disebut bukti status pembayaran; Popup hanya dirujuk sebagai alternatif opsional bila chapter tersedia.
- Validation requirements: V-CONTENT; browser smoke sesuai TASK-017 dan hasil Sandbox; V-HANDOFF.

### TASK-039 — Tulis Chapter 09: Webhook

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mengajarkan verifikasi dan update pembayaran tanpa mempercayai callback.
- Scope: `/docs/webhook`: endpoint, schema, signature, GET status, nominal/fraud, idempotensi, transisi dan retry.
- Dependencies: TASK-038.
- File/modul: `apps/docs/app/docs/webhook/page.mdx`, navigasi.
- Acceptance criteria: (1) Seluruh materi Chapter 09 tercakup dan source endpoint lengkap dapat ditelusuri. (2) Contoh signature valid/invalid, mismatch, duplicate dan out-of-order cocok hasil test. (3) Ack hanya sesudah commit dan callback frontend bukan sumber kebenaran dijelaskan eksplisit.
- Validation requirements: V-CONTENT; jalankan fixtures notification serta cocokkan payload/retry dengan TASK-020; V-HANDOFF.

### TASK-040 — Tulis Chapter 10: Payment Status

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menjelaskan akses aman dan rekonsiliasi status tersimpan.
- Scope: `/docs/payment-status`: tujuh status, Prisma read, refund/partial refund, akses order dan command rekonsiliasi.
- Dependencies: TASK-039.
- File/modul: `apps/docs/app/docs/payment-status/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 10 tersedia dengan pemetaan enum yang sama. (2) Ada bukti skenario token salah/expired dan callback spoof ditolak. (3) Refund sebelum notifikasi PAID, kehilangan cookie dan keterbatasan pemulihan redirect dijelaskan tanpa menjanjikan recovery otomatis.
- Validation requirements: V-CONTENT; jalankan status/access/reconciliation fixtures dan bandingkan UI; V-HANDOFF.

### TASK-041 — Tulis Chapter 11: Sandbox Testing

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Mendokumentasikan prosedur E2E yang benar-benar sudah dijalankan.
- Scope: `/docs/testing`: local server, HTTPS tunnel, Notification URL, transaksi, webhook, inspeksi DB dan troubleshooting.
- Dependencies: TASK-040; prosedur Sandbox ditulis sebagai materi, tanpa mengeksekusi transaksi.
- File/modul: `apps/docs/app/docs/testing/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 11 tercakup dengan expected output. (2) Langkah mengulang hasil TASK-020 tanpa rahasia pada konten. (3) Hasil mock/manual/Sandbox dibedakan, termasuk skenario provider yang tidak tersedia dan cara mendiagnosisnya.
- Validation requirements: V-CONTENT; ulangi hanya langkah prosedur yang belum dibuktikan atau berubah, tautkan bukti bertanggal; V-HANDOFF.

### TASK-042 — Tulis Chapter 12: Security and Production

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Menjelaskan kontrol keamanan dan batas transisi ke production.
- Scope: `/docs/production`: env/keys, Zod, signature, limits, idempotensi, timeout/retry, persistence dan pemisahan deployment.
- Dependencies: TASK-041.
- File/modul: `apps/docs/app/docs/production/page.mdx`, navigasi.
- Acceptance criteria: (1) Semua materi Chapter 12 tercakup dan nilai limit cocok keputusan A-04. (2) SQLite/limiter lokal tidak dipromosikan sebagai solusi backend publik. (3) Prasyarat production/persistence dan approval deploy jelas; tidak ada klaim bebas bug atau secrets nyata.
- Validation requirements: V-CONTENT; review keamanan terhadap Security Design dan matriks test; V-HANDOFF.

## 7. Quality gates dan release MVP

### TASK-043 — Tambahkan metadata statis dan halaman 404

- Status: IN_REVIEW
- Priority: P1
- Model: Sol
- Deskripsi: Menyelesaikan SEO dasar dan route fallback untuk konten final.
- Scope: Title/description/canonical/OG, sitemap, robots dan custom 404; structured data hanya jika kebutuhan disepakati.
- Dependencies: TASK-029, TASK-042; A-06.
- File/modul: `apps/docs/app/` metadata, sitemap/robots/not-found dan chapter metadata.
- Acceptance criteria: (1) Dua belas chapter wajib dan landing memiliki metadata deskriptif dengan domain final. (2) Sitemap hanya mencantumkan route terbit; canonical/OG tidak memakai localhost/placeholder. (3) Route hilang menampilkan 404 dan link kembali valid pada hosting statis. (4) Route status example tidak masuk sitemap docs.
- Validation requirements: V-BASE; inspect HTML/XML/robots dari static output dan test route tidak ada; V-HANDOFF.

### TASK-044 — Tutup gap links, responsive dan accessibility docs

- Status: DONE
- Priority: P1
- Model: Sol
- Deskripsi: Memeriksa seluruh website setelah chapter dan komponen terintegrasi.
- Scope: Internal link/anchor checker dan smoke browser yang memenuhi quality gate docs; perbaikan hanya temuan terkait scope.
- Dependencies: TASK-031, TASK-042, TASK-027; metadata/404 lokal sudah tersedia, domain produksi bukan syarat test lokal.
- File/modul: `apps/docs/` tests dan pemeriksa output statis.
- Acceptance criteria: (1) Tidak ada broken internal route/anchor pada landing dan 12 chapter. (2) Search menemukan judul dan keyword isi konten final. (3) Tidak ada horizontal page overflow pada lima viewport V-UI; keyboard/focus/drawer/copy/theme dan kontras diperiksa. (4) Snippet verifier dan static build lulus tanpa konten draft/placeholder terbit.
- Validation requirements: V-SUPPLY, V-BASE, V-UI; automated link/accessibility smoke plus visual QA, catat batas manual; V-HANDOFF.

### TASK-045 — Hubungkan CI untuk kedua aplikasi dan cegah release gagal

- Status: IN_REVIEW
- Priority: P1
- Model: Sol
- Deskripsi: Menjalankan quality gates wajib secara reproducible pada perubahan repository.
- Scope: CI lint/typecheck/test/build, Prisma validate/generate, MDX/links/snippets/accessibility; deploy harus bergantung pada checks, bukan push tanpa gate.
- Dependencies: TASK-027, TASK-044; CI hanya scope website.
- File/modul: `.github/workflows/ci.yml`, scripts workspace dan konfigurasi branch/deploy yang relevan.
- Acceptance criteria: (1) Clean checkout dengan lockfile menjalankan checks kedua aplikasi. (2) Test otomatis memakai SDK mock/DB sementara, bukan production/Sandbox keys. (3) Kegagalan salah satu gate membuat workflow gagal dan tidak dapat memicu deployment sukses. (4) Sandbox evidence TASK-020 menjadi release checklist, tidak diganti oleh mock CI.
- Validation requirements: V-SUPPLY; jalankan workflow pada branch/test run; buktikan fail-gate dengan perubahan sementara terisolasi lalu pulihkan; V-HANDOFF.

### TASK-046 — Siapkan konfigurasi hosting statis yang reviewable

- Status: TODO
- Priority: P1
- Model: Sol
- Deskripsi: Menyiapkan konfigurasi Vercel docs tanpa men-deploy produksi.
- Scope: Root Directory `apps/docs`, build/output workspace, headers/CSP yang terukur, env nonsecret dan checklist rollback/release; tidak memublikasikan backend contoh.
- Dependencies: TASK-043, TASK-045; A-06.
- File/modul: Konfigurasi hosting yang diperlukan, README deployment.
- Acceptance criteria: (1) Konfigurasi menghasilkan artefak HTML/CSS/JS tanpa runtime DB/API docs. (2) Headers/CSP sesuai aset/script/font nyata dan tidak menambahkan wildcard/unsafe-eval demi menghindari error. (3) Payment example/keys tidak diikutkan deploy. (4) Langkah deploy/rollback dan verifikasi route siap direview sebelum permintaan approval produksi.
- Validation requirements: Static artifact/config review; serve dengan header setara dan browser smoke untuk CSP; V-BASE, V-HANDOFF. Tidak deploy produksi pada task ini.

### TASK-047 — Review independen kesiapan release

- Status: IN_REVIEW
- Priority: P1
- Model: Sol
- Deskripsi: Menilai perubahan akhir terhadap PRD, desain dan hasil pengujian.
- Scope: Review dilakukan terpisah dari implementasi; temuan berlokasi/severity/dampak, tanpa mengubah source pada review awal. Eskalasi risiko tinggi mengikuti WORKFLOW Phase 6.
- Dependencies: TASK-042, TASK-044, TASK-045; review hosting terpisah saat task terakhir.
- File/modul: Diff aplikasi/config/konten dan handoff/review report sesuai kebutuhan.
- Acceptance criteria: (1) Seluruh AC PRD dipetakan ke bukti atau blocker yang eksplisit. (2) Correctness pembayaran, secrets, IDOR, recovery, snippet sync dan isolation deploy diperiksa. (3) Tidak ada Critical/High terbuka untuk release; temuan diperbaiki pada pekerjaan terpisah dan diperiksa ulang. (4) Versi/tanggal hasil Sandbox dan checks tercatat tanpa klaim bebas bug.
- Validation requirements: Review evidence aktual dan diff; rerun terarah hanya jika perubahan/temuan memerlukannya; V-HANDOFF. Temuan yang belum selesai membuat task tetap IN_REVIEW.

### TASK-048 — Deploy docs dan jalankan production smoke test

- Status: TODO
- Priority: P1
- Model: Sol
- Deskripsi: Menerbitkan dokumentasi statis setelah approval developer.
- Scope: Hanya docs pada hosting yang disetujui; smoke test route/search/SEO/headers dan rollback jika gagal; tanpa backend/payment production.
- Dependencies: TASK-047; E-RELEASE dan A-06.
- File/modul: Konfigurasi/artefak release dan catatan URL/versi hasil deploy.
- Acceptance criteria: (1) Developer menyetujui konfigurasi/bukti release konkret sebelum deploy produksi. (2) Landing, 12 chapter, direct refresh, 404, search, anchors, tema dan mobile bekerja pada URL publik. (3) Sitemap/canonical/OG/headers benar, tidak ada secrets atau backend contoh terpublikasi. (4) Versi release, hasil smoke dan langkah rollback tercatat.
- Validation requirements: Production smoke browser/HTTP dan secret/output inspection; jika gagal jalankan rollback sesuai approval; V-HANDOFF.

## 8. Snap Popup opsional setelah MVP Redirect

Task P2 berikut tidak termasuk syarat selesai MVP. Bila dipilih untuk rilis berikutnya, TASK-043–TASK-048 harus diperbarui/dijalankan sesuai perubahan agar route, index, snippets, checks, review dan approval release tetap mencakup Popup.

### TASK-049 — Tambahkan alternatif Snap Popup pada aplikasi contoh

- Status: TODO
- Priority: P2
- Model: Sol
- Deskripsi: Menyediakan implementasi alternatif yang tidak mengubah sumber kebenaran pembayaran.
- Scope: Load Snap.js, Client Key, token hanya untuk pemilik order, popup dan callback; update kontrak respons/test/CSP example yang diperlukan.
- Dependencies: TASK-048; keputusan memilih fitur opsional dan penyesuaian kontrak A-03.
- File/modul: `apps/payment-example/components/`, konfigurasi SDK/script, API checkout dan tests terkait.
- Acceptance criteria: (1) Script load/error dan popup sukses/gagal/close ditangani. (2) Token tidak dapat dibaca sesi lain dan tidak masuk log. (3) Callback tidak mengubah paymentStatus, harga server/idempotensi tetap berlaku. (4) Redirect utama tidak regresi dan alur Popup tervalidasi di Sandbox.
- Validation requirements: V-SUPPLY, V-BASE, V-LOGIC, V-UI; browser tests callback spoof/script failure, Sandbox dengan bukti disanitasi; V-HANDOFF.

### TASK-050 — Tulis Chapter 13: Snap Popup

- Status: DONE
- Priority: P2
- Model: Sol
- Deskripsi: Mendokumentasikan alternatif Popup berdasarkan implementasi teruji.
- Scope: `/docs/snap-popup`: Snap.js, Client Key, token, `window.snap.pay`, callback dan trade-off; aktifkan navigasi/index hanya saat siap.
- Dependencies: TASK-026, TASK-027, TASK-042; chapter tutorial saja, runtime Popup di luar scope aktif.
- File/modul: `apps/docs/app/docs/snap-popup/page.mdx`, metadata navigasi, index/sitemap yang dihasilkan.
- Acceptance criteria: (1) Seluruh materi Chapter 13 tercakup dengan snippet asli. (2) Callback tidak diposisikan sebagai bukti pembayaran. (3) Route/previous-next/search/sitemap menyertakan chapter opsional tanpa broken links; snippet verifier lulus. (4) Tidak dirilis sebelum checks/review/approval rilis perubahan terpenuhi.
- Validation requirements: V-CONTENT, V-BASE; browser/link/index/snippet regression yang terdampak dan release gate TASK-043–TASK-048 untuk perubahan ini; V-HANDOFF.

## 9. Pemetaan requirement ke task

| Requirement | Task utama |
| --- | --- |
| Workspace/versioning/strict TS | TASK-001–TASK-005 |
| Prisma + SQLite + empat model + enum | TASK-005–TASK-006, TASK-010, TASK-034 |
| Checkout, validation, SDK dan keamanan pembayaran | TASK-007–TASK-016, TASK-019–TASK-020 |
| Snap Redirect, frontend dan status | TASK-017–TASK-018, TASK-020 |
| MDX/static export | TASK-021 |
| FR-01 landing | TASK-029 |
| FR-02 layout, FR-05 navigation | TASK-023–TASK-025, TASK-043 |
| FR-03 code blocks/copy | TASK-026 |
| FR-04 client search | TASK-030–TASK-031 |
| FR-06 theme/responsive/accessibility | TASK-022–TASK-026, TASK-031, TASK-044 |
| 12 chapter wajib + standar penulisan | TASK-028, TASK-032–TASK-042 |
| Sinkronisasi source/snippet | TASK-027 dan V-CONTENT setiap chapter |
| SEO/404 | TASK-043 |
| Quality gates dan deployment | TASK-019–TASK-020, TASK-044–TASK-048 |
| Snap Popup opsional | TASK-049–TASK-050 |

## 10. Kesiapan saat rencana dibuat (snapshot awal; status terkini di §13)

- **Siap dipilih sekarang: TASK-001 (Sol)**, hanya inspeksi baseline read-only; tidak bergantung pada keputusan pemindahan source.
- **Implementasi source pertama: TASK-002 (Sol)** setelah TASK-001 selesai serta A-01/A-02 tercatat. Saat ini BLOCKED; tidak menyebutnya siap tanpa syarat.
- Setelah fondasi, prioritaskan TASK-004–TASK-020 untuk correctness/security pembayaran. Cabang docs mulai TASK-021 dapat berjalan setelah TASK-003; tidak bergantung pada seluruh backend, tetapi publikasi chapter berkode menunggu bukti example/Sandbox.
- Setelah TASK-021 dan A-05, TASK-022 (Luna) menjadi awal cabang styling; TASK-023/024 memakai komponen/template existing.
- Tidak ada task lain yang dependency implementasinya sudah DONE pada saat dokumen ini dibuat. Tidak ada perubahan kode atau deployment yang diotorisasi oleh pembuatan backlog ini.

## 11. Risiko dependency dan penanganan

| Risiko | Dampak | Penanganan dalam rencana |
| --- | --- | --- |
| Canonical PRD tidak ada, desain masih DRAFT | Baseline/kontrak dapat berubah | A-01–A-05 dipastikan sebelum task terkait; jangan mengubah requirement diam-diam |
| Git root belum mencakup docs dan staged changes | Dokumen tidak ikut version control; migrasi dapat menghilangkan pekerjaan | TASK-001 inventory dan TASK-002 transisi disetujui; tidak reset/delete |
| Versi Prisma/SQLite enum/adapter atau SDK typing tidak kompatibel | Backend dan konten contoh tertahan | TASK-005/009 membuktikan kompatibilitas sebelum chapter; kegagalan menjadi blocker |
| Signature/field refund/retry belum diverifikasi resmi | Status pembayaran atau retry salah | TASK-014 dan TASK-020; jangan mengganti unknown dengan sukses |
| Sandbox keys/tunnel/akun tidak tersedia | TASK-020 dan chapter final tidak dapat dinyatakan teruji | Lanjutkan test mock dan UI independen, labeli Sandbox belum terverifikasi; jangan melewati release gate |
| Timeout/crash antara DB dan SDK | Order tersimpan tetapi hasil create ambigu | TASK-011/012/016/019; key/order tetap, tanpa create ulang otomatis |
| Callback, duplicate dan out-of-order | Status palsu atau regresi pembayaran | TASK-013–TASK-015/018/019; verifikasi provider dan revision guard |
| Domain/source URL belum ditentukan | Source link, canonical dan deploy tertahan | A-06; jangan merilis placeholder; kerjakan modul lain yang tidak memerlukan URL final |
| CI/deploy otomatis tidak mematuhi gate | Website terbit walau contoh/snippet gagal | TASK-045 membuktikan fail-gate; TASK-047/048 review dan approval produksi |
| SQLite/limiter lokal dipublikasikan sebagai backend | Persistence/abuse lintas instance tidak aman | Backend publik di luar scope; TASK-042/046 memastikan batas diterangkan dan deploy hanya docs |

## 12. Handoff perencanaan

- Task: Phase 3 — task breakdown.
- Perubahan: hanya `docs/03-planning/tasks.md`; 48 task wajib termasuk persiapan/quality/release, 2 task opsional.
- Validation: struktur field, ID unik, dependency terdefinisi/tanpa siklus/urutan topologis dan tautan lokal diperiksa setelah penulisan; bukan hasil lint/build/test aplikasi.
- Risks / blockers: A-01–A-06 dan akses eksternal sesuai tabel; baseline runtime/Sandbox belum diuji.
- Next action: pilih TASK-001; selesaikan keputusan A-01/A-02 sebelum TASK-002. Task implementasi belum dimulai.

## 13. Handoff TASK-001 — baseline repository dan lingkungan

- Task: TASK-001 — Verifikasi baseline dan kesiapan lingkungan.
- Status: DONE setelah review independen Tim 2 pada 26 Oktober 2026; bukti inventory awal dipertahankan sebagai snapshot historis di bawah.
- Tanggal: 26 Oktober 2026.
- Pemilihan: request implementasi masih memakai placeholder `[TASK-ID]`; dipilih TODO pertama yang tidak memiliki dependency, sesuai instruksi melanjutkan project. Tidak melanjutkan TASK-002 secara otomatis.
- Perubahan: hanya status/keterangan dan handoff pada `docs/03-planning/tasks.md`. Tidak mengubah source, dependency, index Git, PRD atau desain.

Catatan waktu: §13.1–§13.4 merekam keadaan saat inventory TASK-001, sebelum commit pertama dan pemindahan Git. Setelah itu commit `7733eb7` dibuat/dipush, dan TASK-002 mulai memindahkan Git ke root. Angka serta command historis tidak dimaksudkan sebagai status migrasi terkini.

### 13.1 Repository dan file existing

Git root aktual: `D:/Project/project/learning-nextjs/connect-midtrans/next-app`. Direktori workspace induk tidak memiliki `.git`; PRD, desain dan backlog ini berada di luar Git aplikasi. Tidak membuat Git root baru atau memindahkan file.

`git -C next-app rev-parse --verify HEAD` gagal dengan `fatal: Needed a single revision`, sesuai kondisi branch belum memiliki commit. Ini temuan baseline, bukan kegagalan perubahan task. Karena belum ada HEAD, baseline pembanding source adalah index staged, bukan commit.

`git -C next-app status --short --untracked-files=all` menunjukkan **25 file staged berstatus A**, tanpa unstaged modification atau untracked yang tidak di-ignore. File ignored seperti `node_modules` bukan bagian hitungan ini. Inventory staged lengkap:

| Kelompok | Path relatif terhadap Git root `next-app/` |
| --- | --- |
| Aturan/dokumentasi | `AGENTS.md`, `CLAUDE.md`, `README.md` |
| Git/format | `.gitignore`, `.prettierignore`, `.prettierrc` |
| App | `app/favicon.ico`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` |
| Komponen | `components.json`, `components/.gitkeep`, `components/theme-provider.tsx`, `components/ui/button.tsx` |
| Hooks/lib/public | `hooks/.gitkeep`, `lib/.gitkeep`, `lib/utils.ts`, `public/.gitkeep` |
| Tooling | `eslint.config.mjs`, `next.config.ts`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `postcss.config.mjs`, `tsconfig.json` |

`git ls-files --stage` menjadi snapshot identitas blob/index sebelum perubahan dokumentasi, dan diperbandingkan ulang pada validasi akhir. Tidak membaca isi env atau kredensial. `.gitignore` sudah mengecualikan `.env*`, `.next`, `out`, `node_modules` dan build info; aturan database/WAL akan menjadi scope aplikasi contoh.

README masih template Next.js/shadcn. `app/page.tsx` masih “Project ready!”. `next.config.ts` kosong, TypeScript `strict: true`, dan `pnpm-workspace.yaml` masih `packages: []`. Belum ada workspace dua aplikasi, MDX, static export atau implementasi pembayaran. Root README dan field `packageManager`/`engines` pada manifest aplikasi belum tersedia; penetapan versi tim menjadi pekerjaan fondasi berikutnya.

### 13.2 Runtime, manifest, lockfile dan instalasi

| Komponen | Hasil command/instalasi aktual | Manifest / lockfile | Kesimpulan terbatas |
| --- | --- | --- | --- |
| Node.js | `node --version`: `v26.12.1`; executable `C:/Program Files/nodejs/node.exe` | Tidak dipin pada manifest aplikasi | Tersedia; bukan bukti build/adapter native kompatibel |
| pnpm | `pnpm --version`: `12.5.1`; launcher `C:/Users/zagoours/AppData/Local/pnpm/bin/pnpm.ps1` | `packageManager` tidak ditentukan; lockfile format `9.0` | CLI tersedia; belum membuktikan install/frozen-lockfile sukses |
| Next.js | Metadata `node_modules/next/package.json`: `16.4.2` | Manifest `16.4.2`; lock `16.4.2` | Cocok; engines Node `>=20.9.0` terpenuhi secara numerik |
| React / React DOM | Metadata keduanya `19.3.1` | Manifest/lock `19.3.1` | Cocok; rendering/build belum diuji |
| TypeScript | Metadata `5.9.3` | Manifest `^5`; lock `5.9.3` | Cocok; strict aktif, compiler belum dijalankan |
| Tailwind CSS | Metadata `4.3.3` | Manifest `^4`; lock `4.3.3` | Cocok; stylesheet belum diuji melalui build |

Versi instalasi dibaca dari JSON, tidak dengan menjalankan executable package project. `Get-Command` menemukan node/pnpm di PATH, tidak menemukan Corepack; Corepack tidak dipersyaratkan untuk inventory ini. Tidak mengubah versi atau menjalankan package manager install.

### 13.3 Panduan Next terpasang dan gap dependency

Panduan lokal memang tersedia dalam `next-app/node_modules/next/dist/docs/`. Bagian relevan yang dibaca:

- `01-app/01-getting-started/01-installation.md`: minimum Node 20.9; referensi menyebut minimum TypeScript 5.1.0. Angka lingkungan di atas memenuhi minimum tersebut, tanpa membuktikan seluruh stack kompatibel.
- `01-app/02-guides/mdx.md`: package MDX terkait, konfigurasi page extensions dan `mdx-components.tsx`. Target PRD `.mdx` tidak membutuhkan pengaktifan `.md` sebagai route bila tidak digunakan.
- `01-app/02-guides/static-exports.md`: `output: 'export'`; fitur request-dependent/cookies/Server Actions tidak tersedia pada docs statis. POST checkout/webhook tetap berada di aplikasi contoh terpisah.

| Gap | Bukti inventory | Versi/referensi yang perlu diverifikasi pada task berikutnya |
| --- | --- | --- |
| MDX/Shiki | Tidak ada direct dependency `@next/mdx`/Shiki di manifest dan path direct node_modules; konfigurasi/mapping belum ada | TASK-021/026: versi MDX yang kompatibel dengan Next 16.4.2, package terkait sesuai panduan lokal, Shiki stabil teruji |
| Prisma/SQLite | Prisma, client dan adapter SQLite bukan direct dependency; schema/payment-example belum ada | TASK-005: Prisma 7 sesuai chapter PRD, client/adapter yang cocok, enum SQLite, FK dan native driver pada Node/Windows aktual; lihat referensi Prisma di PRD §15 |
| Zod | Bukan direct dependency aplikasi dan tidak ada path direct; lockfile memuat **Zod 4.6.7 secara transitif** | TASK-004/007: pilih/kunci direct dependency Zod 4 yang diuji; jangan bergantung pada dependency transitive shadcn |
| SDK Midtrans | `midtrans-client` bukan direct dependency dan path direct tidak ada | TASK-009/014: versi SDK **TBD**, typing/create/status/notification, transport timeout, field refund dan signature diperiksa terhadap [SDK resmi](https://github.com/Midtrans/midtrans-nodejs-client) dan referensi webhook PRD |
| Testing | Tidak ada script `test`, direct Vitest atau Playwright test runner; lockfile menyebut Playwright sebagai peer opsional, bukan bukti test runner siap | TASK-003: tentukan versi harness yang teruji dengan Node aktual; TASK-005/009 membuktikan DB/mock fixtures |

Tidak mengeksekusi package atau melakukan audit instalasi pada task read-only ini. Tidak ada hasil `SAFE_NO_KNOWN_IOC` yang diklaim. Dependency baru dan runtime compatibility harus diaudit/divalidasi ketika task implementasi terkait dipilih; nomor versi belum terpasang tetap TBD.

### 13.4 Command validasi tersedia dan hasil task

| Pemeriksaan | Command / cara | Hasil aktual |
| --- | --- | --- |
| Git root | `git -C next-app rev-parse --show-toplevel` | Sukses, root `next-app/` |
| Commit awal | `git -C next-app rev-parse --verify HEAD` | Gagal karena belum ada commit; dicatat sebagai kondisi awal |
| Inventory Git | `git -C next-app status --short --untracked-files=all`; `git -C next-app ls-files --stage` | 25 A staged, tanpa unstaged/untracked non-ignored; snapshot dibandingkan pada akhir task |
| Runtime | `node --version`; `pnpm --version` | Sukses, masing-masing 26.12.1 dan 12.5.1 |
| Versi project | Baca manifest, importer lockfile dan metadata JSON terpasang | Versi lima package utama konsisten; gap direct dependency dipisahkan dari transitive |
| Panduan framework | Baca tiga bagian panduan lokal Next di §13.3 | Tersedia; requirement dasar dan batas static export dicatat |
| Diff aplikasi | `git -C next-app diff --exit-code`; `git -C next-app diff --check` | Tidak ada perubahan unstaged pada aplikasi; hasil akhir diverifikasi setelah handoff ditulis |
| Diff dokumentasi | Bandingkan teks `tasks.md` sebelum/sesudah dengan snapshot di memori | Perubahan dibatasi status/keterangan TASK-001 dan handoff ini; file berada di luar Git aplikasi |
| Struktur backlog | Pemeriksaan field, ID, dependensi dan tautan lokal | Diverifikasi kembali setelah pembaruan; tanpa package execution |

Scripts project yang **tersedia tetapi tidak dijalankan**: `pnpm -C next-app lint` (ESLint), `pnpm -C next-app typecheck` (`tsc --noEmit`), `pnpm -C next-app build` (`next build`). `dev`, `start` dan `format` juga tersedia; `format` menulis file sehingga tidak digunakan pada inventory. `pnpm test` dan perintah Prisma belum tersedia sebagai quality gate aplikasi ini. Tidak ada klaim lint/typecheck/build/test/Sandbox lulus.

### 13.5 Acceptance criteria, review dan tindak lanjut

| AC TASK-001 | Bukti |
| --- | --- |
| Lokasi Git dan staged/untracked diketahui tanpa kebocoran env | §13.1 dan snapshot index/status |
| Runtime aktual dipisahkan dari manifest | §13.2 |
| Gap MDX, Prisma/enum/adapter dan typing SDK berikut referensi versi dicatat | §13.3 |
| Gate dan command tersedia dicatat tanpa klaim kompatibilitas | §2, §13.4 dan catatan di bawah |

Self-review awal hanya mencakup dokumentasi task; tidak ada source, dependency atau staged blob yang diubah pada TASK-001. Risiko stack bukan hasil test yang sudah lulus.

Review independen Tim 2 (26 Oktober 2026):

- `git ls-tree -r --name-only 7733eb7` menunjukkan 25 path yang sama dengan inventory §13.1; commit tersebut mempertahankan template awal setelah tahap inventory.
- Manifest dan TypeScript dari commit diperiksa read-only dengan `git show`: scripts, dependency langsung dan `strict: true` cocok dengan inventory; belum ada script test, Prisma atau SDK Midtrans langsung.
- `node --version` dan `pnpm --version` dikonfirmasi kembali: 26.12.1 dan 12.5.1. Metadata manifest tetap dibedakan dari bukti runtime/build.
- Keempat AC inventory memiliki bukti pada §13.1–§13.4; referensi/gap dependency dan command tersedia dijelaskan tanpa klaim kompatibilitas atau pengujian yang belum dilakukan.
- Tidak ada temuan Critical/High pada scope TASK-001. Catatan Git root/belum ada commit adalah historis, bukan kesalahan inventory. Tidak menjalankan lint, build atau Sandbox untuk review dokumentasi ini.

Next action saat review TASK-001: lanjutkan TASK-002 yang telah dipilih developer. Hasil akhirnya ada di §14. A-02 disetujui untuk migrasi repository; A-03–A-05 dan domain publik pada A-06 belum dianggap selesai. Tidak menganggap Node yang memenuhi minimum Next sebagai bukti kompatibilitas native adapter Prisma atau seluruh stack pembayaran.

## 14. Handoff TASK-002 — penataan Git root dan workspace

- Task: TASK-002 — Bentuk pnpm workspace dan pertahankan template existing.
- Status: DONE setelah validasi engineer utama dan review independen Tim 2 pada 26 Oktober 2026.
- Otorisasi: developer memilih TASK-002, meminta pekerjaan dilanjutkan setelah tujuan pemindahan dijelaskan, dan meminta penggunaan branch baru untuk fitur/perubahan.
- Baseline: PRD root existing dipakai untuk scope migrasi. Tidak ada persetujuan implisit terhadap perubahan schema, bisnis, UI atau desain pembayaran lain.
- Branch pekerjaan: `chore/task-002-workspace`, dibuat dari branch lokal `frontend-ui/main`; commit existing `7733eb7` tetap menjadi baseline riwayat.
- Perubahan: satu Git root di root project, template existing di `apps/docs`, workspace/lockfile bersama, scripts root, ignore dan README sesuai scope. `apps/payment-example` belum dibuat pada task ini. Tidak mengubah core business logic, schema database atau UI template.
- Files changed: pemindahan 22 file template ke `apps/docs`; root `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `README.md`; dokumen project/reference yang kini tercakup Git root; `docs/03-planning/tasks.md`, `docs/02-design/architecture.md`; laporan `SECURITY_DEPENDENCY_AUDIT.md` dan `.security/secure-dependency-audit.json`.
- Review: Tim 2 memeriksa config/root scripts/ignore/lockfile dan kecocokan source secara independen, tanpa menjalankan package project. Tidak ada temuan Critical/High pada scope TASK-002. Hasil runtime di bawah dijalankan engineer utama, bukan diklaim sebagai test reviewer.

### 14.1 Validation results

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Audit statis dependency | `SAFE_NO_KNOWN_IOC`; 652 package exact, tanpa findings; hash dan batas scan ada pada laporan audit |
| Frozen install offline | `pnpm install --offline --frozen-lockfile --ignore-scripts` gagal karena metadata cache `@typescript-eslint/project-service` tidak tersedia; bukan bukti incompatibility source |
| Frozen install online | `pnpm install --frozen-lockfile --ignore-scripts` sukses exit 0; 572 reused, 0 downloaded; lifecycle scripts dinonaktifkan, pnpm supply-chain policy 652 package passes |
| Workspace discovery | `pnpm list --recursive --depth -1` mengenali root `midtrans-tutorial` dan package `next-app` pada `apps/docs` |
| Lint | `pnpm lint` exit 0, 0 error; warning existing unused import `Geist` pada `apps/docs/app/layout.tsx:1` |
| Typecheck | `pnpm typecheck` exit 0 |
| Build | `pnpm build` exit 0, Next.js 16.4.2; route `/` dan `/_not-found` dibangun |
| Production smoke lokal | Root `pnpm start --port 3217` berhasil; server Ready, HTTP 200 dan teks `Project ready!` sesuai template; server smoke dihentikan sesudah pemeriksaan |
| Source/history | 22 blob file template di `apps/docs` identik dengan commit awal; HEAD tetap `7733eb7`, branch `chore/task-002-workspace` |
| Config review | Scripts root menarget script existing `next-app`; graph packages/snapshots lock tidak berubah dan hanya ada satu dokumen lockfile |
| Ignore/diff | Sepuluh kasus ignore nested lolos; check whitespace code/config dengan pengecualian `*.md` lolos. Check staged mentah menandai hard break Markdown dua spasi akhir baris yang memang dipakai PRD/WORKFLOW/docs; bukan error kode. Peringatan normalisasi LF/CRLF juga tercatat |
| Struktur dokumentasi | ID/field 50 task tetap utuh; tautan lokal dan pasangan code fence diperiksa setelah pembaruan |

Tidak ada script/runner unit test pada template; tidak menambah test tiruan untuk pemindahan konfigurasi. Assert struktural, pemeriksaan blob, workspace discovery dan build memberi bukti scope task ini. Tidak mengklaim aplikasi pembayaran, MDX, static export atau Sandbox sudah diimplementasikan/diuji.

### 14.2 Acceptance criteria dan risiko tersisa

| AC TASK-002 | Bukti selesai |
| --- | --- |
| Git root mencakup PRD/design/docs dan target apps tanpa nested repository aplikasi | Git root di root project; metadata repository dipindahkan, bukan riwayat dihapus/dibuat ulang |
| Source dan pekerjaan existing terjaga | 22 blob template identik, baseline commit tetap `7733eb7`; branch lama dipertahankan |
| pnpm mengenali docs dan satu lockfile | Workspace discovery dan frozen install sukses; dependency graph tidak berubah |
| Command docs tersedia dari root | Delegasi scripts diperiksa; lint/typecheck/build dan production smoke lokal dari root lulus |

Pemindahan dependency di Windows sempat terhenti pada symlink/akses filesystem. Source aplikasi sudah lengkap di `apps/docs`, tetapi sisa cache ignored `next-app/node_modules` masih ada karena keterbatasan akses Windows; audit akhir mencatat 44 optional unavailable installed links pada cache tersebut. Cache lama bukan source aplikasi, tidak di-track, dan tidak dipakai sebagai dasar klaim dependency lengkap; instalasi workspace baru dan build telah berhasil. Tidak melakukan penghapusan cache secara paksa atau mengubah privilege sistem.

Warning unused `Geist` sudah ada pada template dan tidak diperbaiki karena di luar scope penataan workspace. Tidak memin versi dependency baru; field `packageManager` tidak ditambahkan karena pnpm 12 sempat membuat dokumen metadata manager tambahan pada lockfile; lock akhir dinormalisasi menjadi satu dokumen dengan graph dependency semula. Runtime yang dipakai dicatat di README/handoff, bukan dianggap jaminan kompatibilitas stack pembayaran.

A-01/A-02 terpenuhi khusus untuk migrasi ini. A-03–A-05 tetap mengikuti persetujuan desain terkait, dan domain publik A-06 masih TBD. Perubahan TASK-002 sudah di-stage untuk review, tetapi belum di-commit, di-push atau di-deploy. Hard break Markdown tidak direformat di luar scope migrasi.

Next action: TASK-003 siap dipilih karena dependency TASK-002 DONE. Tidak memulai task berikutnya otomatis.

## 15. Scope terbaru — website tutorial saja

Arahan developer: fokus menyelesaikan website tutorial, layout semirip `design/design.png`, dan simpan hosting sebagai task terakhir. Pengembangan runtime pembayaran serta transaksi Sandbox tidak dilanjutkan dan tidak menjadi prerequisite untuk menjalankan website. Requirement materi tutorial tetap dipertahankan; ini perubahan scope eksekusi yang diminta developer, bukan klaim aplikasi pembayaran sudah selesai.

### Implementasi website

- Branch: `feat/midtrans-tutorial`.
- Landing page: hero dua kolom, ilustrasi Snap/kode, warna biru, stack teknologi, daftar pelajaran, roadmap dan prasyarat; ilustrasi disembunyikan pada mobile mengikuti referensi.
- Dokumentasi: 13 chapter MDX, desktop sidebar/artikel/TOC, mobile drawer, breadcrumb, previous/next dan heading anchors.
- Pencarian client dengan index build-time, keyboard selection, empty/error/retry; tanpa search API.
- Syntax highlighting build-time, code blocks gelap mengikuti referensi, copy button dan source references; tema terang/gelap/sistem.
- Metadata statis, sitemap, robots dan 404 tersedia. Domain produksi belum ditentukan sehingga canonical masih memakai origin lokal.
- Command default root dan CI hanya memvalidasi website. Source `apps/payment-example` yang sudah ditulis sebelumnya dipertahankan sebagai materi pendukung; tidak dijalankan atau di-deploy oleh website.

### Hasil validasi lokal aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `pnpm lint` | Lulus, tanpa error/warning |
| `pnpm typecheck` | Lulus untuk website dan tools |
| `pnpm test` | 3 test tools + 3 test content utilities lulus |
| `pnpm build` | Lulus; 13 chapter dan route statis di `apps/docs/out` |
| `pnpm links` | 1.018 tautan/anchor internal lulus |
| `pnpm snippets` | 20 referensi file source valid; kode dibaca saat build |
| `pnpm test:ui` | 6 test browser lulus: 320/375/768/1024/1440 px, navigasi, anchors, copy, tema, drawer, search/retry, metadata dan 404 |
| Visual QA | Screenshot landing desktop, chapter desktop dan mobile diperiksa terhadap referensi |

Dua bug ditemukan dan diperbaiki melalui test browser: ilustrasi hero membuat horizontal overflow pada tablet, serta pencarian memulai request index dua kali akibat event focus dan pemanggilan load bersamaan. Build dan seluruh browser checks telah dijalankan kembali sesudah perbaikan.

### Batas status dan urutan terakhir

- Task website yang DONE dinilai terhadap scope website terbaru dan bukti di atas, bukan terhadap pembayaran Sandbox nyata.
- TASK-004–TASK-020 dan TASK-049 berada di luar scope aktif. Sebagian source sudah dibuat pada pekerjaan sebelumnya; statusnya bukan bukti aplikasi contoh terverifikasi. Tidak ada klaim test transaksi nyata lulus.
- TASK-043 IN_REVIEW: metadata lokal tersedia; canonical/domain produksi diselesaikan bersama hosting.
- TASK-045 IN_REVIEW: konfigurasi CI website tersedia; workflow GitHub belum dijalankan pada remote.
- TASK-047 IN_REVIEW: self-review dan visual QA lokal selesai; review release final menunggu hasil CI remote.
- TASK-050 berupa chapter tutorial Popup telah tersedia. Pada scope website ini dependensi implementasi runtime Popup bukan prerequisite render; source pendukung hanya ditampilkan sebagai materi.
- **Task terakhir: TASK-046 dan TASK-048 — konfigurasi hosting final, domain dan deployment**, setelah review/checks selesai. Tidak membuat hosting atau deployment pada pekerjaan website ini.
- Tidak menghapus artefak/source pekerjaan sebelumnya, tidak melakukan commit/push otomatis, tidak memulai ulang pengembangan backend.

## 16. Penyesuaian shadcn/ui dan validasi melalui MCP Playwright

Arahan terbaru: hapus installer pengujian project, gunakan MCP Playwright mode extension pada Chrome yang sudah berjalan, dan gunakan shadcn/ui untuk tema serta kartu. Branch tetap `feat/midtrans-tutorial`; hosting tetap pekerjaan terakhir.

- Pemilih Terang/Gelap/Sistem memakai shadcn `DropdownMenu`, radio items dan `Button` dengan next-themes. Pilihan tersimpan, menu menandai pilihan aktif, dan fokus kembali ke trigger setelah dipilih.
- Delapan kartu materi, tiga kartu roadmap dan kartu prasyarat memakai shadcn `Card` style `base-nova`. Layout referensi dipertahankan.
- Tidak menambahkan dependency UI. Komponen menggunakan Base UI, lucide dan utilitas `cn` yang sudah terpasang.
- Dependency Playwright/Vitest root, konfigurasi serta test harness website sebelumnya telah dihapus. CI tidak menginstal browser. Hasil `pnpm test`/`pnpm test:ui` pada bagian sebelumnya adalah catatan historis; command tersebut tidak tersedia lagi untuk website.
- Bug static export Next.js pada Windows menghasilkan nama file segment bersarang dan 404 saat prefetch. Postbuild menyalin payload ke nama datar yang diminta browser; tidak mengubah runtime aplikasi pembayaran. Regression check memakai test runner bawaan Node.js, tanpa installer tambahan.

Validasi lokal 26 Oktober 2026:

| Pemeriksaan | Hasil |
| --- | --- |
| Audit dependency | SAFE_NO_KNOWN_IOC, 968 exact packages, tanpa temuan IOC diketahui |
| `pnpm lint`, `pnpm typecheck` | Lulus |
| `node --test apps/docs/scripts/normalize-static-export.test.mjs` | 1 test lulus: payload bersarang dinormalkan, file datar/HTML tetap, hasil aman diproses ulang |
| `pnpm build` | Lulus, 19 halaman statis; 14 file segment dinormalkan |
| `pnpm links`, `pnpm snippets` | 1.018 tautan/anchor dan 20 referensi source valid |
| MCP Playwright, Chrome extension | Tema terang/gelap/sistem, persistence reload, indikator pilihan, keyboard/fokus, 12 Card dan tautan chapter lulus |
| Responsive melalui Chrome | Landing dan chapter tidak horizontal overflow pada 320, 375, 768, 1024 dan 1440 px |
| Search dan drawer melalui Chrome | Empty search, keyword/result navigation, drawer mobile dan penutupan setelah navigasi lulus. Pointer tema dan buka/tutup drawer diuji kembali tanpa force saat tab aktif; search diuji dengan force saat tab background |
| Visual QA | Screenshot landing terang dan gelap diperiksa; struktur kartu tetap mengikuti referensi |
| Console | Tidak ada error/warning pada navigasi chapter setelah normalisasi hasil build |

Self-review mencakup diff komponen, postbuild, dokumentasi dan pemeriksaan whitespace. Merge ke main dan push telah diotorisasi pengguna; CI remote serta deployment belum diverifikasi pada tahap ini. Hasil lokal tidak mencakup transaksi pembayaran nyata.
