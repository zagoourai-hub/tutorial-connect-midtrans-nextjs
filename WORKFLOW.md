# WORKFLOW.md — Universal AI Development Workflow

> Bahasa: Indonesia  
> Berlaku untuk: Semua jenis project dan tech stack  
> Metode: Documentation-first untuk fitur kompleks, implementasi bertahap, dan review independen.

## 1. Tujuan

- Memisahkan perencanaan, implementasi, testing, dan review.
- Menghemat konteks: baca hanya dokumentasi dan source code yang relevan.
- Menghindari asumsi teknologi, overengineering, dan perubahan di luar scope.
- Memastikan hasil pekerjaan dapat diuji dan ditelusuri ke requirement.

## 2. Pembagian Peran Model

| Peran | Model yang direkomendasikan | Tanggung jawab |
| --- | --- | --- |
| Product & Software Architect | Astra | Discovery, PRD, SRS bila perlu, arsitektur, database/ERD, API contract, task breakdown, review berisiko tinggi |
| Senior Software Engineer | Sol | Implementasi core, integrasi, debugging kompleks, testing, code review |
| Implementation Assistant | Luna | UI, styling, responsive layout, komponen sederhana, refactoring kecil |

> Nama model adalah pembagian peran, **bukan mekanisme pergantian model otomatis**. Pilih model yang benar-benar tersedia di Codex. Jika nama model tidak tersedia, gunakan model dengan kemampuan setara.

## 3. Struktur Dokumentasi

Buat hanya file yang relevan dengan project:

```text
project/
├── AGENTS.md
├── WORKFLOW.md
├── README.md
└── docs/
    ├── 01-product/
    │   ├── prd.md
    │   ├── srs.md               # opsional
    │   └── user-stories.md      # opsional
    ├── 02-design/
    │   ├── architecture.md
    │   ├── database.md          # jika ada database
    │   ├── api-spec.md          # jika ada API
    │   └── ui-ux.md             # jika ada UI
    ├── 03-planning/
    │   ├── roadmap.md           # opsional
    │   └── tasks.md
    └── 04-quality/
        ├── test-plan.md         # jika dibutuhkan
        └── security.md          # jika dibutuhkan
```

## 4. Development Lifecycle

### Phase 0 — Discovery (Astra)

1. Pahami ide, tujuan, target pengguna, dan batasan produk.
2. Jika repository sudah ada, inspeksi `README.md`, konfigurasi, dan struktur project.
3. Pisahkan kebutuhan terkonfirmasi, asumsi, dan pertanyaan terbuka.
4. Jangan menentukan tech stack tanpa bukti atau keputusan developer.

**Output:** Ringkasan project, requirement awal, gap analysis.  
**Gate:** Kebutuhan inti cukup jelas untuk menyusun PRD.

### Phase 1 — PRD (Astra)

Buat atau evaluasi `docs/01-product/prd.md` yang memuat:

- Problem statement, tujuan, target users, dan success metrics.
- MVP scope dan out of scope.
- Functional requirements (`FR-001`, dst.) dan non-functional requirements.
- User stories, business rules, acceptance criteria.
- Dependencies, risiko, asumsi, dan keputusan `TBD`.

**Aturan:** PRD membahas **apa** dan **mengapa**, bukan langsung detail implementasi. Jangan mengarang requirement.  
**Gate:** Persetujuan developer untuk requirement penting.

### Phase 2 — Technical Design (Astra)

Berdasarkan PRD yang disetujui:

1. Buat `architecture.md` untuk komponen, modul, alur data, auth, dan trade-off.
2. Buat `database.md` dan diagram Mermaid ERD jika membutuhkan database.
3. Buat `api-spec.md` jika project memiliki API.
4. Buat `ui-ux.md` jika project memiliki interface pengguna.
5. Tandai perubahan berisiko, asumsi, dan keputusan terbuka.

**Aturan:** Sesuaikan desain dengan project nyata; jangan mengubah source code saat tugas hanya merancang.  
**Gate:** Persetujuan developer untuk desain berdampak besar.

### Phase 3 — Task Breakdown (Astra)

Buat `docs/03-planning/tasks.md`. Setiap task berisi:

- ID, judul, prioritas, status, dan model yang disarankan.
- Deskripsi, scope / out of scope, dependencies.
- Acceptance criteria yang dapat diuji.
- File atau modul terkait bila sudah diketahui.

Status: `TODO` → `IN_PROGRESS` → `IN_REVIEW` → `DONE`; gunakan `BLOCKED` jika terhambat.

**Gate:** Task siap diimplementasikan dan dependensinya terpenuhi.

### Phase 4 — Implementation (Sol / Luna)

1. Pilih **satu task** dan baca hanya dokumen serta file yang relevan.
2. Periksa implementasi existing sebelum mengubah kode.
3. Kerjakan perubahan terkecil yang memenuhi acceptance criteria.
4. Tambahkan/perbarui test yang relevan.
5. Hindari dependency baru, perubahan schema, atau refactoring di luar scope tanpa alasan jelas.
6. Jangan menjalankan perintah destruktif tanpa persetujuan.

**Pembagian:** Sol mengerjakan core logic, API, database, auth, dan integrasi; Luna mengerjakan UI dan tugas kecil. Eskalasikan apabila scope meningkat.

### Phase 5 — Validation & Integration (Sol)

- Jalankan lint, typecheck, unit/integration test, dan build **jika tersedia dan relevan**.
- Periksa edge cases, error handling, security, serta kesesuaian kontrak API.
- Jika gagal: temukan root cause, perbaiki masalah, lalu validasi ulang.
- Jangan mengklaim hasil pengujian yang tidak dijalankan.

**Gate:** Acceptance criteria dan validasi yang relevan terpenuhi.

### Phase 6 — Code Review (Sol; Astra bila high-risk)

Review correctness, maintainability, security, performance, regresi, dan kesesuaian desain.

- Sol: review rutin, integrasi, dan kualitas implementasi.
- Astra: review arsitektur, autentikasi, pembayaran, migrasi data, atau risiko keamanan tinggi.
- Laporkan temuan menurut `Critical / High / Medium / Low`, sertakan lokasi, dampak, dan saran perbaikan.
- Review awal tidak mengubah source code; perbaikan dilakukan pada tahap terpisah.

**Gate:** Temuan Critical dan High sudah diselesaikan atau ditangani sesuai keputusan developer.

### Phase 7 — Release (Developer)

- Konfirmasi review dan validasi.
- Cek environment variables, migration, backup/rollback bila relevan.
- Minta persetujuan developer sebelum deployment produksi.
- Lakukan smoke test setelah deployment.

## 5. Handoff Antar-Model

Setiap perpindahan tugas merujuk pada file repository, bukan mengandalkan chat panjang.

```md
## Handoff
Task: TASK-001
Status: IN_REVIEW
Dikerjakan oleh: Sol
Referensi: docs/03-planning/tasks.md
Perubahan: [ringkasan]
Files changed: [daftar file]
Validation: [perintah dan hasil aktual]
Risks / blockers: [jika ada]
Next action: [review / perbaikan / task berikutnya]
```

- **Astra → Sol/Luna:** requirement, desain, task, dan acceptance criteria.
- **Luna → Sol:** ringkasan perubahan, file, dan hasil validasi.
- **Sol → Astra:** isu arsitektur, risiko keamanan, dan trade-off besar.

## 6. Aturan Dokumentasi & Context

1. `AGENTS.md` memuat aturan ringkas yang selalu berlaku; dokumen ini memuat alur lengkap.
2. Baca bagian `WORKFLOW.md` dan file `docs/` yang relevan saja.
3. Jangan menduplikasi seluruh `WORKFLOW.md` ke `AGENTS.md`.
4. Ubah PRD bila requirement berubah; ubah dokumentasi teknis bila desain disetujui berubah.
5. Untuk bug kecil atau edit visual sederhana, lewati fase PRD dan desain yang tidak diperlukan.
6. Pilih model paling ringan yang mampu menyelesaikan tugas dengan benar.

## 7. Definition of Done

- [ ] Scope dan acceptance criteria terpenuhi.
- [ ] Kode sesuai konvensi serta arsitektur project.
- [ ] Validasi relevan dijalankan dan hasilnya dilaporkan.
- [ ] Tidak ada temuan Critical/High yang belum ditangani.
- [ ] Perubahan ditinjau dan dokumentasi diperbarui bila diperlukan.
- [ ] Perubahan destruktif atau deployment produksi mendapat persetujuan developer.

## 8. Format Laporan Akhir

1. **Task:** ID dan ringkasan.
2. **Files changed:** File dibuat atau diubah.
3. **Validation:** Perintah dijalankan dan hasil aktual.
4. **Issues:** Masalah atau risiko tersisa.
5. **Next step:** Langkah lanjutan yang disarankan.

## 9. Prompt Eksekusi Singkat

### Discovery & PRD — Astra

> Ikuti AGENTS.md dan Phase 0–1 WORKFLOW.md. Analisis repository serta kebutuhan produk. Evaluasi PRD existing jika ada; jika belum ada, buat `docs/01-product/prd.md` dalam Bahasa Indonesia. Tandai asumsi dan TBD. Jangan mengubah source code. Laporkan keputusan yang membutuhkan persetujuan.

### Technical Design — Astra

> Ikuti Phase 2 WORKFLOW.md. Baca PRD yang disetujui dan analisis repository. Buat hanya dokumen teknis yang relevan di `docs/02-design/`, termasuk diagram Mermaid bila diperlukan. Jelaskan trade-off dan risiko. Jangan mengimplementasikan kode.

### Task Breakdown — Astra

> Ikuti Phase 3 WORKFLOW.md. Pecah PRD dan desain teknis yang telah disetujui menjadi task kecil di `docs/03-planning/tasks.md`. Tentukan ID, prioritas, dependensi, model yang disarankan, dan acceptance criteria. Jangan mengubah source code.

### Implementasi — Sol / Luna

> Ikuti Phase 4–5 WORKFLOW.md. Kerjakan `[TASK-ID]` dari `docs/03-planning/tasks.md` sesuai acceptance criteria. Baca hanya konteks relevan, implementasikan secara terfokus, jalankan validasi, dan laporkan perubahan serta risiko. Jangan mengubah file di luar scope.

### Code Review — Sol / Astra

> Ikuti Phase 6 WORKFLOW.md. Review `[TASK-ID]` terhadap acceptance criteria, desain, dan git diff. Laporkan temuan berdasarkan severity, beserta root cause, dampak, lokasi, dan saran perbaikan. Jangan mengubah kode saat review awal.

### Lanjutkan Project

> Baca AGENTS.md dan bagian relevan WORKFLOW.md. Periksa status project serta `docs/03-planning/tasks.md` jika tersedia. Rekomendasikan task berikutnya beserta model yang cocok, dependency, dan acceptance criteria. Jangan langsung implementasi sebelum task dipilih.
