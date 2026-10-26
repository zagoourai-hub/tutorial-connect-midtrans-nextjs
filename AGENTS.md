# AGENTS.md

## 1. Bahasa
- Gunakan Bahasa Indonesia untuk komunikasi, analisis, dan dokumentasi.
- Gunakan Bahasa Inggris untuk penamaan kode dan istilah teknis yang umum.

## 2. Project Context
- Pahami struktur repository dan tech stack sebelum bekerja.
- Baca `README.md` dan konfigurasi yang relevan jika tersedia.
- Ikuti konvensi, dependency, dan arsitektur project yang sudah ada.
- Jangan mengasumsikan framework atau database tertentu.

## 3. Workflow
- Gunakan `WORKFLOW.md` sebagai referensi utama proses development jika tersedia.
- Baca hanya bagian workflow dan dokumentasi yang relevan dengan tugas.
- Ikuti pembagian peran Architect, Engineer, dan Reviewer dalam workflow.
- Untuk fitur kompleks: Planning → Implementation → Testing → Review.
- Untuk perubahan kecil: langsung implementasikan dan validasi.
- Jangan membuat dokumentasi atau perencanaan berlebihan.

## 4. Documentation
- Buat PRD, SRS, Architecture, Database Design, API Spec, dan Task Breakdown hanya saat diperlukan.
- Untuk project baru, prioritaskan PRD sebelum technical design.
- Pisahkan requirement, asumsi, dan keputusan teknis.
- Jangan mengarang requirement. Tandai ketidakpastian dengan `TBD`.
- Jangan mengubah requirement yang disetujui tanpa persetujuan.

## 5. Implementation
- Pahami root cause sebelum memperbaiki bug.
- Ikuti coding standards dan pola project.
- Prioritaskan kode sederhana, aman, dan mudah dirawat.
- Hindari dependency dan abstraksi yang tidak diperlukan.
- Batasi perubahan sesuai scope tugas.
- Jangan mengubah file yang tidak berkaitan.

## 6. Security
- Validasi input yang tidak tepercaya.
- Jangan mengekspos secrets atau data sensitif.
- Jangan menjalankan operasi destruktif tanpa persetujuan.
- Minta persetujuan sebelum perubahan berisiko tinggi atau deployment produksi.

## 7. Validation
- Jalankan lint, typecheck, test, atau build yang relevan dan tersedia.
- Jangan mengklaim pengujian berhasil jika belum dijalankan.
- Laporkan error dan risiko yang belum terselesaikan.

## 8. Output
Setelah menyelesaikan tugas, laporkan secara singkat:
- Perubahan yang dilakukan.
- File yang diubah.
- Hasil validasi.
- Masalah yang tersisa, jika ada.