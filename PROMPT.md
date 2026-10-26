Bertindak sebagai Product Architect dan Principal Software Engineer.

Saya ingin memulai atau mengevaluasi project ini.

Instruksi:

1. Baca AGENTS.md dan bagian yang relevan dari WORKFLOW.md.
2. Analisis struktur repository.
3. Identifikasi tujuan, jenis aplikasi, tech stack, dan dependency yang tersedia.
4. Baca dokumentasi existing jika ada.
5. Tentukan tahap development project saat ini.
6. Identifikasi kebutuhan dan keputusan yang belum jelas.
7. Rekomendasikan langkah pengembangan berikutnya berdasarkan WORKFLOW.md.

Aturan:
- Gunakan Bahasa Indonesia.
- Jangan mengasumsikan tech stack.
- Jangan mengubah source code.
- Jangan membuat seluruh dokumentasi sekaligus.
- Jika PRD sudah ada, evaluasi sebelum membuat yang baru.
- Pisahkan fakta, asumsi, dan rekomendasi.

Output:
- Ringkasan project.
- Status development saat ini.
- Gap analysis.
- Rekomendasi dokumen yang diperlukan.
- Langkah berikutnya.






<!-- . Prompt singkat untuk melanjutkan project -->
Baca AGENTS.md dan bagian relevan dari WORKFLOW.md.

Analisis status project berdasarkan dokumentasi dan repository.

Buka docs/03-planning/tasks.md jika tersedia.

Identifikasi task aktif atau task TODO berikutnya yang dependency-nya telah terpenuhi.

Jelaskan:
1. Status project saat ini.
2. Task yang direkomendasikan.
3. Model AI yang cocok.
4. File dan dokumentasi yang diperlukan.
5. Acceptance criteria.

Jangan mengimplementasikan task sebelum saya memilih pekerjaan yang akan dijalankan.

Gunakan Bahasa Indonesia dan hindari membaca file yang tidak relevan.


Ikuti AGENTS.md dan Phase 2 pada WORKFLOW.md.

Baca PRD yang telah disetujui:
`docs/01-product/prd.md`

Analisis repository dan buat dokumentasi teknis yang relevan:

1. Architecture Design.
2. Database Design dan ERD, jika menggunakan database.
3. API Specification, jika menyediakan API.
4. UI/UX Specification, jika memiliki antarmuka pengguna.
5. Security dan authentication design sesuai kebutuhan.

Simpan dokumentasi ke `docs/02-design/`.

Ketentuan:
- Gunakan Bahasa Indonesia.
- Gunakan Mermaid untuk diagram arsitektur dan ERD.
- Pastikan desain konsisten dengan PRD.
- Jelaskan trade-off keputusan penting.
- Hindari overengineering.
- Jangan mengubah source code.
- Tandai keputusan yang belum disetujui.

Output:
- Daftar dokumen dibuat atau diperbarui.
- Ringkasan arsitektur.
- Risiko teknis.
- Keputusan yang memerlukan approval.

Jangan mulai implementasi sebelum desain disetujui.

<!-- Prompt A — Inisialisasi project baru -->
Bertindak sebagai Product Architect dan Principal Software Engineer.

Saya ingin memulai atau mengevaluasi project ini.

Instruksi:

1. Baca AGENTS.md dan bagian yang relevan dari WORKFLOW.md.
2. Analisis struktur repository.
3. Identifikasi tujuan, jenis aplikasi, tech stack, dan dependency yang tersedia.
4. Baca dokumentasi existing jika ada.
5. Tentukan tahap development project saat ini.
6. Identifikasi kebutuhan dan keputusan yang belum jelas.
7. Rekomendasikan langkah pengembangan berikutnya berdasarkan WORKFLOW.md.

Aturan:
- Gunakan Bahasa Indonesia.
- Jangan mengasumsikan tech stack.
- Jangan mengubah source code.
- Jangan membuat seluruh dokumentasi sekaligus.
- Jika PRD sudah ada, evaluasi sebelum membuat yang baru.
- Pisahkan fakta, asumsi, dan rekomendasi.

Output:
- Ringkasan project.
- Status development saat ini.
- Gap analysis.
- Rekomendasi dokumen yang diperlukan.
- Langkah berikutnya.



<!-- Prompt B — Membuat PRD -->
Bertindak sebagai Technical Lead.

Ikuti Phase 3 pada WORKFLOW.md.

Baca:
- PRD yang disetujui.
- Architecture Design.
- Database Design jika tersedia.
- API dan UI/UX Specification jika tersedia.

Pecah kebutuhan menjadi implementation tasks yang kecil dan dapat diuji.

Untuk setiap task tentukan:
- Task ID.
- Deskripsi.
- Priority.
- Scope.
- Dependencies.
- Acceptance criteria.
- Model yang direkomendasikan: Sol atau Luna.
- Validation requirements.

Urutkan berdasarkan dependency dan prioritas MVP.

Simpan ke:
`docs/03-planning/tasks.md`

Aturan:
- Jangan mengimplementasikan kode.
- Hindari task terlalu besar.
- Jangan membuat fitur di luar PRD.
- Setiap task harus memiliki acceptance criteria yang terukur.

Laporkan task yang siap diimplementasikan dan risiko dependency.


<!-- Prompt C — Membuat dokumentasi teknis -->
Bertindak sebagai Principal Software Architect.

Ikuti AGENTS.md dan Phase 2 pada WORKFLOW.md.

Baca PRD yang telah disetujui:
`docs/01-product/prd.md`

Analisis repository dan buat dokumentasi teknis yang relevan:

1. Architecture Design.
2. Database Design dan ERD, jika menggunakan database.
3. API Specification, jika menyediakan API.
4. UI/UX Specification, jika memiliki antarmuka pengguna.
5. Security dan authentication design sesuai kebutuhan.

Simpan dokumentasi ke `docs/02-design/`.

Ketentuan:
- Gunakan Bahasa Indonesia.
- Gunakan Mermaid untuk diagram arsitektur dan ERD.
- Pastikan desain konsisten dengan PRD.
- Jelaskan trade-off keputusan penting.
- Hindari overengineering.
- Jangan mengubah source code.
- Tandai keputusan yang belum disetujui.

Output:
- Daftar dokumen dibuat atau diperbarui.
- Ringkasan arsitektur.
- Risiko teknis.
- Keputusan yang memerlukan approval.

Jangan mulai implementasi sebelum desain disetujui.


<!-- Prompt D — Membuat task breakdown -->
Bertindak sebagai Technical Lead.

Ikuti Phase 3 pada WORKFLOW.md.

Baca:
- PRD yang disetujui.
- Architecture Design.
- Database Design jika tersedia.
- API dan UI/UX Specification jika tersedia.

Pecah kebutuhan menjadi implementation tasks yang kecil dan dapat diuji.

Untuk setiap task tentukan:
- Task ID.
- Deskripsi.
- Priority.
- Scope.
- Dependencies.
- Acceptance criteria.
- Model yang direkomendasikan: Sol atau Luna.
- Validation requirements.

Urutkan berdasarkan dependency dan prioritas MVP.

Simpan ke:
`docs/03-planning/tasks.md`

Aturan:
- Jangan mengimplementasikan kode.
- Hindari task terlalu besar.
- Jangan membuat fitur di luar PRD.
- Setiap task harus memiliki acceptance criteria yang terukur.

Laporkan task yang siap diimplementasikan dan risiko dependency.




<!-- Prompt E — Implementasi menggunakan Sol -->
Bertindak sebagai Senior Software Engineer.

Ikuti AGENTS.md dan Phase 4–5 pada WORKFLOW.md.

Task yang harus dikerjakan:
[TASK-ID]

Instruksi:

1. Baca detail task dari docs/03-planning/tasks.md.
2. Baca dokumentasi teknis yang relevan.
3. Periksa implementasi existing.
4. Identifikasi file yang perlu diubah.
5. Implementasikan sesuai scope dan acceptance criteria.
6. Tambahkan atau perbarui test yang relevan.
7. Jalankan validasi yang tersedia.
8. Periksa git diff.
9. Laporkan hasil implementasi.

Aturan:
- Gunakan Bahasa Indonesia untuk laporan.
- Ikuti coding conventions project.
- Jangan menambahkan dependency yang tidak diperlukan.
- Jangan mengubah file di luar scope.
- Jangan menjalankan operasi destruktif tanpa persetujuan.
- Jangan mengklaim test berhasil jika belum dijalankan.

Output:
- Implementation summary.
- Files changed.
- Validation results.
- Known issues.
- Review status.


<!-- Prompt F — Implementasi menggunakan Luna -->
Bertindak sebagai Frontend dan Task Implementation Engineer.

Ikuti AGENTS.md dan Phase 4 pada WORKFLOW.md.

Task:
[TASK-ID]

Instruksi:

1. Baca spesifikasi task.
2. Periksa komponen existing.
3. Implementasikan hanya perubahan yang diminta.
4. Gunakan design system dan conventions project.
5. Pastikan layout responsive jika relevan.
6. Jalankan validasi yang tersedia.
7. Laporkan file yang diubah.

Batasan:
- Jangan mengubah core business logic.
- Jangan mengubah database schema.
- Jangan melakukan refactoring di luar scope.
- Jangan menambahkan dependency tanpa kebutuhan.
- Eskalasikan tugas jika memerlukan perubahan arsitektur.

Output:
- Ringkasan perubahan.
- Files changed.
- Validation results.
- Issues atau kebutuhan eskalasi.


<!-- Prompt G — Testing dan Code Review -->
Bertindak sebagai Independent Senior Code Reviewer.

Ikuti AGENTS.md dan Phase 5–6 pada WORKFLOW.md.

Review implementasi:
[TASK-ID]

Instruksi:

1. Baca acceptance criteria dan technical design yang relevan.
2. Periksa git diff dan source code yang berubah.
3. Evaluasi correctness, security, maintainability, dan performance.
4. Periksa potensi breaking changes serta regresi.
5. Jalankan pengujian yang relevan jika memungkinkan.
6. Klasifikasikan temuan berdasarkan severity.

Severity:
- Critical
- High
- Medium
- Low

Setiap temuan harus mencantumkan:
- File dan lokasi masalah.
- Root cause.
- Dampak.
- Rekomendasi perbaikan.

Jangan mengubah kode pada tahap review awal.

Output:
- Review findings.
- Validation results.
- Risiko yang tersisa.
- Keputusan PASS atau CHANGES REQUIRED.

Jika tidak ada temuan, jelaskan batasan review yang telah dilakukan.