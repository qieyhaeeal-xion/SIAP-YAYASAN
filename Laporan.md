# LAPORAN ANALISIS SISTEM & FLOW LOGIC SIAP
## Sistem Informasi Administrasi Pesantren Mukhtar Syafaat Blokagung

---

| Parameter | Keterangan |
|---|---|
| **Nama Aplikasi** | SIAP (Sistem Informasi Administrasi Pesantren) |
| **Versi Frontend** | v1.2.0 - SPA Multi-URL Routing, Single Super Admin |
| **Teknologi Utama** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM v7 |
| **Dokumen Acuan** | `prd.md` v1.2.0 dan `RENCANA APLIKASI.xlsx` |
| **Tanggal Laporan** | 7 September 2026 |

---

## 1. RINGKASAN EKSEKUTIF

SIAP adalah frontend MVP untuk administrasi Pondok Pesantren Mukhtar Syafaat. Codebase menggunakan React, TypeScript, Context API, dan `localStorage` sebagai penyimpanan sementara sebelum integrasi backend.

Scope akses versi ini hanya **Super Admin/Admin Yayasan**. Tidak terdapat role Admin Madin, Admin Sekolah, Bendahara, Guru, Pimpinan, atau Wali Santri.

Fitur pengembangan berikut telah ditetapkan dalam PRD v1.2.0 namun belum seluruhnya ada di codebase: Tab 9 Section H, pencarian santri berbasis nama, perbaikan akumulasi Nadhoman, filter Alumni, dan pengembangan Kepengasuhan.

---

## 2. ARSITEKTUR & STRUKTUR FILE

```text
src/
├── App.tsx                         # BrowserRouter, route aplikasi, layout, dan guard
├── main.tsx                        # Entry point React
├── index.css                       # Style/Tailwind
├── types/sisantri.ts               # Domain types, helper rekap dan keuangan
├── context/AppContext.tsx          # State, localStorage, dan business logic
├── services/authService.ts         # Login dan password Super Admin lokal
├── services/distributionService.ts # Distribusi dan verifikasi pemasukan
├── data/mockData.ts                # Seed data demo
├── data/wilayahIndonesia.ts        # Master wilayah bertingkat
└── components/
    ├── layout/                     # Header, Sidebar, Footer
    ├── auth/                       # LoginModal
    ├── landing/                    # LandingPage
    ├── dashboard/                 # Dashboard Super Admin
    ├── kesantrian/                # Master, data santri, hafalan, alumni
    ├── kepengasuhan/              # UKS, izin, konseling, kunjungan
    ├── kepegawaian/               # Pegawai dan NIP
    ├── akademik/                  # Presensi batch
    ├── keuangan/                  # Ringkasan, pembayaran, pemasukan
    ├── ppdb/                      # PPDB dan mutasi
    └── settings/                  # Admin, backup, tahun ajaran
```

Route utama: `/`, `/login`, `/app`, dan `/app/:tab`. Alias keuangan diarahkan ke `/app/keuangan-ringkasan`.

---

## 3. FLOW LOGIC AKTUAL DAN TARGET

### 3.1 PPDB dan Mutasi

`addPPDB` membuat nomor pendaftaran. Setelah status Lulus Seleksi, `mutasiPPDBKeSantri` memanggil `addSantri`, menghasilkan NIS enam digit, memilih fallback asrama/kamar/kelas, membuat tagihan Syahriyah bulan berjalan, dan mengubah status menjadi Telah Dimutasi.

### 3.2 Data Santri

Data Santri saat ini memiliki delapan tab: pribadi, orang tua/wali, sekolah, madin, asrama, hafalan, UKS, dan berkas. Status santri memakai hirarki kategori, tipe asuh, golongan, dan program.

Tab 9 Keterangan Keluar akan ditambahkan khusus mode edit. Data alasan/tahun keluar akan mengubah status santri menjadi Alumni.

### 3.3 Tahfidz dan Nadhoman

Tahfidz saat ini memiliki registrasi peserta, filter tahun ajaran, histori setoran, dan modal pencarian NIS. Target pengembangan mengganti pemilihan tersebut dengan input pencarian nama yang dapat diketik.

Nadhoman saat ini menyimpan kitab dan rentang bait, tetapi sinkronisasi `kitabId`, `namaKitab`, `jumlahBaitBaru`, dan total akumulasi belum benar. Target perbaikannya adalah menghitung `baitAkhir - baitAwal + 1`, lalu menjumlahkannya dengan total sebelumnya.

### 3.4 Keuangan

Modul Keuangan terdiri dari Ringkasan, Jenis Pembayaran, dan Pemasukan & Distribusi. Tarif dapat dicocokkan dengan profil santri dan jenjang sekolah. Pemasukan menggunakan nomor PMK dan distribusi snapshot ke lima pos.

Fungsi kuitansi `KW-YYYYMMDD-XXX` tersedia di context tetapi belum digunakan oleh UI aktif. Modal pembayaran dan kuitansi formal berada di Roadmap.

### 3.5 Kepengasuhan

Kepengasuhan saat ini memiliki empat submodul: perizinan, kesehatan, konseling, dan kunjungan. Pengembangan berikutnya mencakup jenis izin, tanggal kembali real, UKS lengkap, dan kategori konseling sesuai PRD v1.2.0.

### 3.6 Presensi

Akademik menyediakan entry batch dengan konfirmasi sesi, filter unit/kelas, dan status Hadir, Izin, Sakit, Alpha. Rekap presensi masih berstatus opsi karena format laporan dan kebutuhan desain perlu diputuskan terlebih dahulu.

---

## 4. STATUS MODUL

| Modul | Status Codebase | Tindak Lanjut |
|---|---|---|
| Dashboard Super Admin | Terimplementasi | Sinkronisasi label tahun ajaran |
| Master Kesantrian | Terimplementasi | Penyempurnaan relasi jurusan dan kapasitas kamar |
| Data Santri | 8 tab terimplementasi | Tambah Tab 9 edit-only |
| Tahfidz | Terimplementasi | Pencarian nama dan tanggal input |
| Nadhoman | Perlu perbaikan | Sinkronisasi dan rumus akumulasi |
| Alumni | Tabel terimplementasi | Tambah filter tahun/unit/NIS/nama |
| Kepengasuhan | 4 submodul terimplementasi | Tambah empat kelompok fitur sesuai PRD |
| Kepegawaian | Terimplementasi | CRUD Master Jabatan masuk Roadmap |
| Akademik | Presensi batch terimplementasi | Rekap masih opsi |
| Keuangan | Terimplementasi | Kuitansi formal dan UI konfigurasi masuk Roadmap |
| PPDB | Terimplementasi | Penyempurnaan aksi penolakan |
| Pengaturan Admin | Terimplementasi | Tetap single Super Admin |
| Portal Wali | Tidak termasuk scope | Dihapus dari PRD |

---

## 5. DAFTAR GAP DAN TECHNICAL DEBT

1. Nadhoman dapat menghasilkan `NaN` karena field form dan context belum sinkron.
2. Section H belum memiliki input UI.
3. Pencarian santri masih berbasis NIS/dropdown, belum input nama di semua modul.
4. Alumni belum memiliki filter sesuai PRD.
5. Kepengasuhan belum memiliki seluruh field target.
6. Kuitansi KW belum terhubung ke UI.
7. UI konfigurasi distribusi belum tersedia.
8. Presensi belum konsisten menyimpan `kelasId` dan `tipe` untuk deduplikasi.
9. Rekap tagihan pivot belum digunakan oleh UI.
10. Audit log belum memiliki viewer.
11. Sebagian label tahun ajaran dashboard masih hardcode.
12. Hapus tahun ajaran masih stub.
13. Master Jabatan masih read-only.
14. Nilai terisi kamar masih manual.
15. Sebagian field type/data belum memiliki input form.

---

## 6. RENCANA TASK BERIKUTNYA

Urutan yang disepakati:

1. Menambahkan Tab 9 Keterangan Keluar pada mode edit santri.
2. Mengubah pemilihan santri menjadi pencarian nama yang dapat diketik pada seluruh modul terkait.
3. Memperbaiki rumus dan penyimpanan akumulasi Nadhoman.
4. Menambahkan filter Alumni sesuai PRD.
5. Mengembangkan Kepengasuhan: jenis izin, kembali real, UKS lengkap, kategori konseling.
6. Menganalisis desain rekap presensi sebelum memutuskan implementasi.
7. Menyelesaikan Roadmap kuitansi, konfigurasi distribusi, Master Jabatan, dan viewer audit.

---

## 7. KESIMPULAN

Frontend SIAP telah memiliki fondasi kuat untuk operasi Super Admin, termasuk master data, PPDB, mutasi NIS, tarif keuangan, tagihan massal, pemasukan, dashboard, dan presensi batch. PRD v1.2.0 kini membedakan dengan jelas antara fitur yang sudah ada, fitur yang akan diterapkan, opsi yang masih dianalisis, dan technical debt.

Dokumen ini diselaraskan dengan `prd.md` v1.2.0 dan `RENCANA APLIKASI.xlsx`. Tidak ada perubahan source code dalam penyelarasan dokumentasi ini.

---

*Laporan v1.2.0.*
