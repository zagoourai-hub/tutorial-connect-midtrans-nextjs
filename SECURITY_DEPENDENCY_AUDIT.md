# Security Dependency Audit

Verdict: **SAFE_NO_KNOWN_IOC**

- Waktu: 2026-10-26T06:50:37.520Z
- Lockfile: pnpm-lock.yaml
- SHA-256 lockfile: 1b2b013ac3adc515c4c7b8b3ea1fb04d4979059f596cb403dd132e1bdfe8ed93
- Paket exact: 968; manifest statis: 2428; file: 94851.
- IOC: feed Wiz resmi, 2317 pasangan exact; hash snapshot 138c7a54f25d90ae339f4de652c49bd663c0a8a4accbf921707178b0e90330a0.
- Temuan: 0.
- Scope: scan statis lockfile pnpm v9/packages/snapshots, metadata package yang tersedia (link cache rusak: 0; graph dependency exact tetap diperiksa dari lockfile), nama artefak, lifecycle dan konfigurasi agent/editor/CI. Symlink keluar root ditolak. Isi env/credential tidak dibaca.
- Tidak ada dependency project yang dieksekusi selama scan. Verdict bukan jaminan bebas malware dan tidak menggantikan review lifecycle atau pengujian aplikasi.
- Tidak memasang guard/hook global; bukan task integrasi installer.
