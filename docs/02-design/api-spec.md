# API Specification

Status: **DRAFT — kontrak usulan A-03/A-04, belum diimplementasikan**  
Baseline: [Architecture](architecture.md), [Database](database.md), [Security](security.md).

## 1. Batas dan konvensi

Website dokumentasi tidak menyediakan API runtime. Semua endpoint berikut milik aplikasi contoh lokal/Sandbox. Base URL development `http://localhost:3000`; Notification URL memakai origin tunnel HTTPS milik aplikasi contoh. Origin/domain final TBD.

JSON UTF-8 untuk API; waktu ISO 8601 UTC; amount integer IDR pada API internal. Provider amount string desimal diparsing persis tanpa floating point. Error konsisten berbentuk `{"error":{"code":"INVALID_REQUEST","message":"Payload tidak valid"}}`; tidak menyertakan stack trace, secrets, atau raw SDK response. Endpoint privat memakai `Cache-Control: no-store`. Body maksimum dan parameter keamanan mengikuti `security.md`.

| Method / path | Tujuan | Akses |
| --- | --- | --- |
| POST `/api/session` | Membuat/memakai ulang cookie sesi anonim | Same-origin; tidak memerlukan akun |
| POST `/api/checkout` | Membuat atau melanjutkan order yang sama | Cookie sesi, Origin valid, Idempotency-Key |
| POST `/api/midtrans/webhook` | Menerima notifikasi provider | Signature + verifikasi status server-to-server |
| GET `/checkout/status?orderId=...` | Halaman status HTML, bukan JSON API | Cookie pemilik order |

Endpoint sesi merupakan usulan pendukung otorisasi order tanpa login (A-03), bukan requirement akun baru. Tidak menambah REST CRUD produk, endpoint admin, refund, atau API search. Katalog halaman checkout dibaca server dari seed Product; detail pembeli sensitif tidak diperlukan.

## 2. Sesi anonim

`POST /api/session`, body kosong, Origin harus cocok konfigurasi aplikasi. Respons `204 No Content`, membuat cookie acak jika belum ada atau format cookie tidak valid. Cookie valid dipakai ulang agar retry checkout tetap memiliki pemilik yang sama. Token tidak dikembalikan melalui JSON atau URL. Pembuatan sesi diselesaikan sebelum tombol checkout aktif.

Tidak membuat tabel User/Session: hash token disimpan pada setiap order. Token yang tidak berkaitan dengan order tidak memberi akses ke order lain. Akses bergantung pada cookie dan masa akses order. Sesi bukan autentikasi identitas manusia.

## 3. Membuat checkout

`POST /api/checkout`

Headers: `Content-Type: application/json`, `Origin`, cookie sesi, dan `Idempotency-Key` UUID yang dibuat browser sekali untuk satu percobaan checkout. Retry memakai key dan keranjang identik; key tidak diganti hanya karena timeout.

```json
{
  "items": [
    { "productId": "product-demo", "quantity": 1 }
  ]
}
```

Validasi: objek strict, items tidak kosong dan dibatasi, product ID valid, quantity integer dalam batas, tidak ada ID produk duplikat. Properti seperti harga/total dari client ditolak. Produk tidak aktif/tidak ditemukan menghasilkan 404. Harga dan item_details Midtrans dihitung dari snapshot database; jumlah detail harus sama dengan gross amount.

Respons pertama yang siap: `201 Created`. Replay order yang sudah READY: `200 OK` dengan identitas dan URL yang sama.

```json
{
  "orderId": "ord_example",
  "paymentStatus": "PENDING",
  "checkoutState": "READY",
  "redirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/REDACTED"
}
```

`orderId` di atas hanya contoh format konseptual. Server memvalidasi redirect URL HTTPS terhadap hostname Sandbox/Production yang dikonfigurasi secara tepat sebelum mengirim ke browser. Token Snap disimpan server; dapat ditambahkan sebagai field `snapToken` pada respons pemilik order hanya saat chapter Popup opsional diimplementasikan, dengan test dan kontrak diperbarui. Token tidak masuk log.

Request bersamaan, proses terputus, atau timeout provider: `202 Accepted`, `Retry-After` usulan 5 detik, tanpa redirect yang belum pasti.

```json
{
  "orderId": "ord_example",
  "paymentStatus": "PENDING",
  "checkoutState": "UNKNOWN",
  "message": "Hasil pembuatan transaksi sedang diperiksa. Jangan membuat checkout baru."
}
```

`checkoutState` pada 202 dapat berupa INITIATED atau UNKNOWN. Repeated request tidak memanggil create lagi. Setelah kegagalan pasti, replay menghasilkan `409 CHECKOUT_FAILED`; order baru membutuhkan aksi pengguna dan key baru setelah keamanan recovery dipastikan. Jika order telah selesai, kembalikan `409 ORDER_NOT_PAYABLE` beserta order ID yang telah diotorisasi, lalu arahkan UI ke halaman status.

| Status | Error / kondisi |
| --- | --- |
| 400 | INVALID_REQUEST: JSON/payload/key tidak valid |
| 401 | SESSION_REQUIRED: cookie belum tersedia |
| 403 | ORIGIN_FORBIDDEN |
| 404 | PRODUCT_NOT_FOUND; atau resource idempotensi tidak boleh diakses sesi ini |
| 409 | IDEMPOTENCY_CONFLICT: key sama dengan keranjang berbeda; CHECKOUT_FAILED; ORDER_NOT_PAYABLE |
| 413 / 415 | PAYLOAD_TOO_LARGE / UNSUPPORTED_MEDIA_TYPE |
| 429 | RATE_LIMITED, sertakan Retry-After |
| 502 | PROVIDER_ERROR dengan kegagalan yang diketahui pasti, bukan timeout ambigu |
| 503 | STORAGE_UNAVAILABLE atau kapasitas habis sebelum operasi eksternal |

Jika persist gagal sesudah provider mungkin sukses, respons 503 tidak membuktikan transaksi gagal. Browser tetap mempertahankan key; retry membaca order existing untuk recovery. SDK timeout tidak memicu create berulang. Panggilan GET status untuk rekonsiliasi dibatasi per order dan secara global; bukan satu panggilan provider pada setiap polling browser.

## 4. Webhook Midtrans

`POST /api/midtrans/webhook`, `Content-Type: application/json`. Contoh subset payload:

```json
{
  "order_id": "ord_example",
  "transaction_id": "provider-transaction-id",
  "status_code": "200",
  "gross_amount": "50000.00",
  "transaction_status": "settlement",
  "signature_key": "128-karakter-hex"
}
```

Contoh signature adalah placeholder dokumentasi, bukan payload valid. Validasi field wajib dan batas panjang; izinkan field tambahan resmi provider. `fraud_status` dan detail refund divalidasi bila relevan. Jangan menerima URL provider dari payload sebagai tujuan fetch.

Urutan pemrosesan:

1. Batasi ukuran body sebelum parsing, validasi JSON dan schema.
2. Verifikasi `signature_key` dengan SHA-512 dari konkatenasi string asli `order_id + status_code + gross_amount + serverKey`; jangan mengubah format nominal sebelum menghitung signature. Bandingkan digest dengan pemeriksaan panjang dan constant-time comparison.
3. Temukan order, lalu ambil status otoritatif lewat SDK `transaction.status(orderId)` menggunakan konfigurasi server.
4. Cocokkan order ID, transaction ID, currency bila tersedia, nominal snapshot dan fraud status. Provider transaction ID yang sudah tersimpan tidak boleh diam-diam berganti.
5. Terapkan transisi di `database.md` dengan kontrol revision. Payload valid saja tidak membuktikan pembayaran; respons SDK juga harus divalidasi runtime.
6. Balas sukses setelah commit atau no-op terverifikasi. Tidak ada fulfillment/email pada contoh ini.

| Respons | Kondisi |
| --- | --- |
| 200 `{"received":true}` | Commit berhasil, event duplikat, event lama tidak mengubah status, atau notifikasi valid untuk order asing yang diabaikan dan dicatat |
| 400 | Payload invalid atau nominal/identitas tidak konsisten; jangan ubah status |
| 401 | Signature tidak valid |
| 413 / 415 | Body terlalu besar / media type tidak didukung |
| 429 | Overload terkontrol; Retry-After; jangan mengakui event sebagai sudah diproses |
| 503 | Provider timeout, DB gagal, status belum bisa diverifikasi, konflik concurrent belum terselesaikan, atau status provider baru belum dipetakan |

Order asing tidak dibuat otomatis. Signature valid untuk order asing hanya di-ack setelah pencatatan diagnostik aman; cek konfigurasi merchant/env jika berulang. Ketidakcocokan nominal/identitas perlu rekonsiliasi manual; jangan mengandalkan retry provider untuk memperbaiki data salah. Retry schedule Midtrans tidak diasumsikan; perlu diverifikasi di Sandbox dan pada dokumentasi versi berjalan.

`transaction.notification()` pada source SDK resmi yang diperiksa membungkus GET status memakai `transaction_id`; itu bukan pengganti pemeriksaan signature lokal. Gunakan satu jalur logika verifikasi/transisi bersama untuk webhook dan rekonsiliasi, tanpa lapisan service generik.

## 5. Halaman status dan rekonsiliasi

GET `/checkout/status?orderId=...` membaca cookie, expiry dan hash pemilik sebelum menampilkan status/item/total. Order tidak ada, token salah, dan akses kedaluwarsa menampilkan 404 generik. Parameter callback seperti `transaction_status` tidak dipercaya. Semua respons status bersifat private/no-store dan noindex.

Refresh membaca database, tidak langsung memanggil provider. UI menyediakan refresh manual; tidak menambah polling background. Saat notifikasi terlambat, tampilkan PENDING dan instruksi pemeriksaan. Rekonsiliasi contoh dijalankan developer secara lokal menggunakan order ID dan fungsi verifikasi yang sama; bentuk command operasional TBD saat implementasi. Tidak menyediakan endpoint publik untuk memaksa rekonsiliasi/refund.

## 6. Pemeriksaan kontrak

Test wajib mencakup seluruh status HTTP di atas, checkout valid, manipulasi harga, key replay/konflik, cookie tidak ada/expired/salah, timeout sebelum/sesudah provider sukses, duplikat webhook, update bersamaan, fraud challenge, nominal berbeda, refund/partial refund dan notifikasi tidak berurutan. Simulasikan process crash dan kegagalan DB sesudah create. Sandbox diperlukan untuk memastikan format payload nyata, recovery serta retry.

Referensi: [HTTP notifications Midtrans](https://docs.midtrans.com/docs/https-notification-webhooks), [source transaction SDK](https://github.com/Midtrans/midtrans-nodejs-client/blob/master/lib/transaction.js). Source SDK telah dibaca saat desain; halaman webhook gagal diambil karena timeout. Formula/format payload dan kebijakan retry tetap harus divalidasi ulang dari dokumentasi resmi dan Sandbox sebelum implementasi dinyatakan siap.
