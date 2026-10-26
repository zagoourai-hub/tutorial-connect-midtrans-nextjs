# Security dan Authentication Design

Status: **DRAFT — usulan A-03/A-04, menunggu persetujuan**  
Scope: PRD bagian 1.2, 9.1–9.4, 11; [Architecture](architecture.md), [API](api-spec.md), [Database](database.md).

## 1. Batas kepercayaan

| Boundary | Ancaman | Kontrol rancangan |
| --- | --- | --- |
| Contributor → MDX/build | MDX dapat menjalankan kode; dependency berbahaya | Hanya source tepercaya, review perubahan, lockfile, audit dependency sebelum package execution |
| Browser → checkout | Harga palsu, payload besar, spam dan checkout berulang | Zod, body limit, harga database, rate limit, idempotensi |
| Browser → order | Akses order orang lain/IDOR | Token anonim + hash pemilik, expiry dan respons generik |
| Provider → webhook | Pemalsuan/replay/event lama | Signature, GET status terautentikasi, cocokkan identitas/nominal, transisi atomik |
| SDK → aplikasi | Timeout, payload tidak sesuai type, URL redirect tidak aman | Timeout terbatas, validasi runtime, allowlist URL, recovery UNKNOWN |
| Server → logs/Git | Kebocoran keys, token, data order | Secrets server-only, masking, ignore database/env, log minimum |

## 2. Authentication dan authorization

### Dokumentasi

Tidak ada login, role, session, JWT, API key client, atau database. Halaman bersifat publik. Search dan tema hanya berjalan di browser. Login/CMS bertentangan dengan non-goals PRD dan tidak ditambahkan.

### Aplikasi pembayaran

Usulan A-03: gunakan **opaque token sesi anonim**, bukan akun pengguna. `POST /api/session` membuat 32 random bytes dengan CSPRNG, dikodekan base64url. Token dipakai ulang di browser; database hanya menyimpan SHA-256 hash pada Order. Order ID bukan kredensial.

Cookie usulan: `checkout_session`, `HttpOnly`, `SameSite=Lax`, `Path=/`, tanpa Domain; `Secure` wajib pada HTTPS. Pengecualian Secure hanya untuk localhost HTTP development. Max-Age usulan 24 jam; `Order.accessExpiresAt` juga membatasi akses 24 jam sejak order dibuat. Refresh sesi tidak memperpanjang hak akses order yang telah kedaluwarsa.

Semua pembacaan status dan replay idempotensi memeriksa hash token dan expiry. Tidak mengirim token melalui URL, localStorage, JSON, log atau Midtrans. Tidak menambah recovery akun: cookie hilang/expired berarti akses order tidak dapat dipulihkan sendiri. Ini trade-off contoh lokal, bukan desain akun merchant.

SameSite=Lax membantu return navigation tingkat atas dari Midtrans; alur return nyata harus diuji di Sandbox. Halaman status tidak bergantung pada cookie pihak ketiga. Untuk sesi dan checkout, wajib cocokkan Origin dengan konfigurasi server; jangan percaya Host/X-Forwarded-Host mentah sebagai allowlist. Tidak mengaktifkan credentialed CORS untuk origin lain. Webhook tidak memakai cookie/Origin check browser; autentikasinya signature dan status server-to-server.

## 3. Secrets dan lingkungan

- `MIDTRANS_SERVER_KEY` hanya pada runtime server contoh; jangan memakai prefix `NEXT_PUBLIC_`. Client Key diperlukan hanya untuk Popup, memang bersifat publik, namun tetap dipisahkan per environment.
- `MIDTRANS_IS_PRODUCTION` default false dan harus divalidasi eksplisit; tidak otomatis mengaktifkan production berdasarkan `NODE_ENV`.
- `DATABASE_URL`, origin aplikasi, dan keys divalidasi ketika aplikasi contoh mulai; konfigurasi invalid menghentikan operasi pembayaran.
- `.env.example` hanya placeholder. Database SQLite, file journal/WAL, backup, env lokal dan laporan berisi token tidak masuk Git.
- Docs build tidak membutuhkan Midtrans keys. Tidak mengirim secrets pembayaran ke pipeline deploy dokumentasi atau bundle statis.
- Tutorial menunjukkan nama variabel/placeholder, bukan nilai keys nyata. Jika secrets pernah masuk Git/log, lakukan rotasi; menghapus teks saja tidak cukup.

## 4. Validasi dan kontrol resource — angka usulan A-04

PRD mensyaratkan pembatasan tetapi tidak menetapkan angkanya. Nilai berikut belum disetujui dan harus dibuktikan cukup untuk payload Sandbox serta adapter/runtime terpilih.

| Parameter | Usulan awal |
| --- | --- |
| Checkout body | Maksimum 16 KiB, enforce sebelum JSON parsing |
| Webhook body | Maksimum 64 KiB, enforce sebelum JSON parsing |
| Cart | 1–20 item berbeda; quantity 1–10 per item |
| Nominal | Harga integer positif; total maksimum Rp100.000.000; subtotal/total harus aman dalam Prisma Int |
| Idempotency key | UUID; bound panjang sebelum lookup |
| Checkout/session rate | Masing-masing 10 request/menit per IP dan 100/menit global pada contoh single-process |
| Webhook admission | 120 request/menit global; validasi signature sebelum GET provider, retryable overload |
| Provider timeout | 10 detik dengan pembatalan transport yang benar-benar diuji, bukan Promise timeout semata |
| Rekonsiliasi | Maksimum sekali/30 detik per order, global 30/menit; tidak dipicu langsung setiap refresh browser |
| Conflict retry | Maksimum 2 retry setelah percobaan awal; kegagalan berikutnya 503 |
| Cookie/access | 24 jam; perubahan retensi/akses memerlukan keputusan eksplisit |

Limiter lokal harus membatasi ukuran map dan membersihkan key expired. IP hanya berasal dari koneksi/proxy tepercaya. Header forwarded dari browser tidak boleh menjadi identitas limiter yang dapat dipalsukan. Restart me-reset limiter dan beberapa proses tidak berbagi kuota: cukup sebagai batas contoh lokal, tidak cukup untuk backend publik. Bila dipublikasikan, pilih limiter bersama dan konfigurasi proxy/ingress yang dipercaya melalui desain terpisah; tidak menambahkan Redis pada tutorial lokal sekarang.

Rate limit diterapkan sebelum panggilan provider dan sebelum pekerjaan mahal. Jangan mengandalkan Content-Length saja: batasi byte aktual yang dibaca. Metode/content type yang tidak didukung ditolak. Detail pesan SDK disanitasi.

## 5. Integritas pembayaran

- Tidak percaya total/price/status dari frontend. Nominal dihitung dari Product dan disimpan sebagai snapshot atomik.
- Webhook memverifikasi SHA-512 signature dari string asli, kemudian GET status melalui SDK dengan Server Key. Validasi kembali respons SDK sebagai untrusted data.
- Cocokkan order ID, transaction ID, gross amount dan fraud status; capture hanya PAID ketika fraud accept. Nominal string diparsing tepat; pecahan nonnol untuk IDR contoh ditolak.
- GET status memakai ID tervalidasi pada endpoint SDK tetap. Redirect URL harus HTTPS dan hostname harus persis allowlist environment, bukan pencocokan substring/suffix longgar.
- Webhook duplikat/no-op tidak menjalankan efek samping. Update status bersama Payment berlangsung atomik dengan revision guard; refund kumulatif tidak boleh mundur.
- Tidak ada endpoint refund/admin pada contoh. Materi refund menjelaskan penerimaan status terverifikasi, bukan memberi browser kuasa melakukan refund.
- Order terminal tidak dipakai untuk create baru. Timeout/crash diperlakukan ambigu sampai rekonsiliasi; tidak menganggap provider gagal hanya karena koneksi terputus.

## 6. Content, headers dan observability

- MDX lokal diperlakukan sebagai kode yang harus direview. Tidak ada runtime upload/remote MDX atau raw HTML dari pengunjung. Hasil search/teks provider dirender sebagai teks yang di-escape.
- Usulan header host docs: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, frame protection melalui CSP `frame-ancestors`. Karena docs static export, konfigurasi header berada pada hosting, bukan request handler aplikasi.
- CSP harus disusun setelah kebutuhan script/font build terukur; jangan menambahkan `unsafe-eval`/wildcard demi meloloskan error. Aplikasi Popup memiliki kebijakan berbeda dan memerlukan allowlist host resmi Snap yang telah diverifikasi; tidak melonggarkan CSP docs untuk Popup contoh.
- Endpoint/status privat memakai no-store dan noindex. Jangan memasukkan query/status privat ke sitemap.
- Log operasional minimum: correlation ID, order ID internal, jenis operasi, kode hasil, durasi, transisi dan konflik. Redaksi cookie, signature, Snap token, Server Key, redirect URL lengkap, body notifikasi dan raw SDK error.
- Unknown status, signature invalid berulang, nominal mismatch dan recovery UNKNOWN memerlukan diagnostik lokal; tidak menambah layanan monitoring berbayar.

## 7. Security validation dan batas produksi

Wajib menguji: replay/konkurensi idempotensi; IDOR termasuk replay key lintas sesi; Origin/CORS dan cookie expiry; oversized/chunked body; manipulasi nominal; signature salah; fraud challenge; provider timeout; URL allowlist; refund/status lama; log redaction; dan secrets pada output build. Unit tests tidak menggantikan Sandbox E2E.

Source resmi SDK yang dibaca menunjukkan `transaction.notification()` mengambil status; jangan menyimpulkan helper itu melakukan semua verifikasi yang dibutuhkan. Dokumentasi HTTP notifications dan Prisma sempat timeout saat pengambilan; detail integrasi tersebut masih harus diverifikasi terhadap versi terkunci sebelum implementasi diterima.

Tidak ada klaim bebas bug atau siap production. Backend publik/pembayaran nyata memerlukan persetujuan tambahan, persistence, limit lintas instance, kebijakan retensi, backup/restore dan recovery operasional teruji. Website statis dapat dirilis hanya setelah quality gates PRD terpenuhi dan developer menyetujui deploy.
