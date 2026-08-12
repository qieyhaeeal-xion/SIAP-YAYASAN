# PRODUCT REQUIREMENTS DOCUMENT

# SIAP
## Sistem Informasi Administrasi Pesantren Mukhtar Syafaat

---

| Field | Value |
|---|---|
| **Versi** | v1.1.0 (Diperbarui berdasarkan Analisis Frontend & Logic Flow) |
| **Tanggal** | 2026 |
| **Penyusun** | Tim Multimedia Yayasan Mukhtar Syafaat & Antigravity AI |
| **Status** | Frontend Selesai (MVP Prototype) — Menunggu Integrasi Backend REST API |
| **Institusi** | PP Mukhtar Syafaat Blokagung, Banyuwangi |

> *Dokumen ini bersifat konfidensial dan hanya untuk keperluan internal pengembangan sistem.*

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang

Pondok Pesantren Mukhtar Syafaat Blokagung, Banyuwangi, adalah lembaga pendidikan Islam yang mengelola ratusan hingga ribuan santri secara aktif. Saat ini, pengelolaan data santri, pendidikan madin, sekolah formal, kepengasuhan, hingga keuangan masih dilakukan secara manual atau menggunakan dokumen spreadsheet yang tidak terintegrasi.

Kondisi ini menimbulkan berbagai tantangan, antara lain: data yang tidak konsisten antar unit, proses pencarian dan pelaporan yang lambat, tidak adanya rekam jejak aktivitas santri secara terpusat, serta keterbatasan akses informasi real-time bagi pengasuh dan pimpinan pesantren.

**SIAP (Sistem Informasi Administrasi Pesantren)** hadir sebagai solusi sistem informasi terpadu berbasis web yang mengintegrasikan seluruh data dan proses operasional pesantren ke dalam satu platform terpadu, mulai dari penerimaan santri baru (PPDB), manajemen data santri, hafalan, madin, sekolah, kepengasuhan, kepegawaian, keuangan, hingga **Portal E-Santri** (Portal Wali Santri).

### 1.2 Tujuan Produk

- Membangun sistem informasi terpusat yang mengintegrasikan seluruh data operasional pesantren.
- Meningkatkan efisiensi administrasi dan manajemen data santri secara digital.
- Memberikan kemudahan akses informasi real-time bagi seluruh pemangku kepentingan (termasuk wali santri).
- Menyediakan laporan dan rekap data yang akurat untuk mendukung pengambilan keputusan.
- Mengurangi ketergantungan pada proses manual yang rawan kesalahan.

### 1.3 Ruang Lingkup

SiSantri mencakup sembilan modul utama:

1. **Modul Kesantrian** — manajemen data santri (8 section form), pesantren, madin, sekolah, tahfidz, nadhoman, dan alumni.
2. **Modul Kepengasuhan** — kesehatan (UKS), perizinan (approval workflow), konseling, dan kunjungan santri.
3. **Modul Kepegawaian** — jabatan dan data pegawai aktif/non-aktif.
4. **Modul Akademik** — presensi formal dan presensi madin per kelas.
5. **Modul Keuangan** — biaya tahunan, syahriyah bulanan, non-syahriyah, transaksi pembayaran, dan generasi kuitansi.
6. **Modul PPDB** — penerimaan peserta didik/santri baru & **Fitur Mutasi Otomatis 1-Click ke Data Santri**.
7. **Modul Portal Wali Santri** — portal monitoring real-time untuk orang tua/wali santri.
8. **Modul Dashboard** — ringkasan statistik, grafik, widget perizinan, dan informasi utama.
9. **Modul Pengaturan & RBAC** — manajemen pengguna, 9 level role-based access control, dan konfigurasi tahun ajaran.

### 1.4 Definisi & Istilah

| Istilah | Definisi |
|---|---|
| Santri | Siswa/peserta didik yang belajar dan tinggal di pesantren |
| Madin | Madrasah Diniyah, lembaga pendidikan agama di pesantren |
| Marhalah | Tingkatan kelas di Madin (misal: Ula, Wustho, Ulya) |
| Nadhoman | Hafalan kitab berbentuk syair/nadzom agama (misal: Aqidatul Awam, Imriti, Alfiyah) |
| Tahfidz | Program menghafal Al-Qur'an (Juz 1–30) |
| Syahriyah | Biaya bulanan santri |
| NIS | Nomor Induk Santri, 6 digit (2 digit tahun masuk + 4 digit urutan, contoh: `260001`) |
| PPDB | Penerimaan Peserta Didik Baru |
| Asrama | Tempat tinggal santri di lingkungan pesantren |
| RBAC | Role-Based Access Control (Otorisasi Akses Berdasarkan Peran User) |

---

## 2. VISI, MISI & SASARAN PRODUK

### 2.1 Visi

> *"Menjadi sistem informasi pesantren yang handal, terpadu, dan mudah digunakan, sehingga mendukung tata kelola pesantren yang modern, efisien, dan transparan."*

### 2.2 Misi

- Menyediakan platform manajemen data santri yang akurat dan mudah diakses.
- Mengintegrasikan seluruh unit pendidikan (madin, sekolah formal, tahfidz) dalam satu sistem.
- Mendukung digitalisasi proses administrasi pesantren dari PPDB hingga kelulusan/kepulangan santri.
- Memberikan kemudahan pelaporan kepada pimpinan pesantren, yayasan, serta pemantauan oleh wali santri.

### 2.3 Target Pengguna & Role System (9 Peran)

| Peran | Deskripsi | Hak Akses Utama |
|---|---|---|
| Admin Sistem | Pengelola teknis & administrator sistem | Full akses semua modul & konfigurasi RBAC |
| Admin Pesantren | Operator data kesantrian & kamar | Kesantrian, PPDB, mutasi, laporan pesantren |
| Admin Madin | Pengurus madin & marhalah | Data madin, presensi madin, setoran nadhoman |
| Admin Sekolah | Tata usaha sekolah formal (MTs, MA, SMK) | Data sekolah, presensi formal |
| Admin Kepengasuhan | Bagian pengasuhan santri & UKS | Perizinan, kesehatan UKS, konseling, kunjungan |
| Bendahara | Pengelola keuangan pesantren | Modul keuangan, syahriyah, kuitansi |
| Pimpinan | Pengasuh / kepala yayasan / Kiai | Dashboard executive, laporan read-only |
| Guru | Pengajar formal & madin | Presensi & input nilai setoran |
| Wali Santri | Orang tua/wali santri aktif | Portal Wali Santri (Monitoring Capaian & Tagihan) |

---

## 3. ARSITEKTUR SISTEM & TEKNOLOGI

### 3.1 Arsitektur Umum

SiSantri mengadopsi arsitektur Single Page Application (SPA) di sisi Frontend yang berkomunikasi via REST API ke sisi Backend.

| Layer | Komponen | Teknologi Saat Ini |
|---|---|---|
| **Frontend** | Antarmuka pengguna (SPA) | React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons |
| **State Store** | Manajemen state lokal & persistensi | Context API (`AppContext`) + `useLocalStorage` |
| **Backend (Target)** | REST API server | Laravel 11 (PHP) / Node.js Express |
| **Database (Target)** | Penyimpanan data relasional | MySQL / PostgreSQL / Supabase |
| **Auth System** | Autentikasi dan otorisasi | JWT Token + RBAC (9 Level Peran) |
| **Storage (Target)** | Upload file/foto santri & berkas PPDB | Local Storage API / S3-Compatible Cloud Storage |

---

## 4. SPESIFIKASI MODUL & FITUR

*(Seluruh antarmuka modul di bawah ini telah **Selesai Diimplementasikan (100%)** pada Frontend MVP).*

### 4.1 Modul Dashboard `[STATUS FRONTEND: SELESAI]`

Halaman utama eksekutif setelah login yang menyajikan ringkasan statistik real-time:
- Statistik total santri aktif, alumni, dan unit pesantren.
- Ringkasan tagihan keuangan belum lunas dan total penerimaan.
- Notifikasi perizinan santri yang menunggu persetujuan (*Pending Approval*).
- Rekapitulasi entri setoran Tahfidz Al-Qur'an dan Nadhoman Kitab.
- Akses navigasi cepat ke modul-modul utama.

---

### 4.2 Modul Kesantrian `[STATUS FRONTEND: SELESAI]`

#### 4.2.1 Sub Menu: Pesantren & Asrama
- Mengelola Master Data Unit Pesantren (Pusat, Al-Mukhtar, Nurul Huda), Asrama, dan Kamar.
- Monitoring terisi vs kapasitas kamar santri secara real-time.

#### 4.2.2 Sub Menu: Madin (Madrasah Diniyah)
- Mengelola Marhalah Madin (Ula, Wustho, Ulya), Kelas Madin, dan Kitab Hafalan Nadhoman.
- **Fitur Filter**: Dependent dropdown 2 tingkat (*Pilih Marhalah* → *Pilih Kelas Madin*).

#### 4.2.3 Sub Menu: Sekolah Formal
- Mengelola Unit Sekolah Formal (MTs, MA, SMK Mukhtar Syafaat), Jurusan (MIPA, IPS, TKJ, AKL), dan Kode Kelas.

#### 4.2.4 Sub Menu: Data Santri (8 Section Form)
- **Generasi NIS Otomatis**: Format 6 digit (`YY` 2 digit tahun masuk + `4 digit` urutan pendaftaran, contoh: `260001`).
- **Formulir 8 Bagian**:
  - **A. Keterangan Santri**: NIS, NIK, NISN, Nama Lengkap, Gender, TTL, Jumlah Saudara di PP, Status Keluarga.
  - **B. Tempat Tinggal**: Alamat, RT/RW, Dusun, Desa, Kecamatan, Kabupaten, Provinsi, Kode Pos.
  - **C. Kesehatan**: Golongan Darah, Riwayat Penyakit, Tindakan, Kondisi Saat Ini.
  - **D. Pendidikan**: Dropdown terintegrasi master Unit Pesantren, Asrama, Kamar, Unit Sekolah, Jurusan, Kelas, Marhalah, dan Kelas Madin.
  - **E. Riwayat Pendidikan**: Nama Sekolah Asal, Alamat, Tahun Lulus, No KIP.
  - **F. Orang Tua / Wali**: NIK & Nama Ayah/Ibu, Pekerjaan, Penghasilan, No HP Wali.
  - **G. Santri Asuh**: Jenis Santri Asuh (Bukan Asuh / ASUH 1 / ASUH 2 / ASUH 3) & Alasan.
  - **H. Keterangan Keluar**: Alasan Keluar, Tahun Keluar, No HP Alumni.
- **Otomatisasi Status Alumni**: Mengisi Bagian H secara otomatis mengubah status santri dari `'Aktif'` menjadi `'Alumni'`.

#### 4.2.5 Sub Menu: Tahfidz Al-Qur'an
- **Layout 2 Panel**: Form Input Setoran + Tabel Histori Hafalan & Popup Cari Santri.
- **Fitur Pendaftaran**: Button *"Input Peserta Tahfidz"* untuk mendaftarkan santri ke program Tahfidz.
- **Form Setoran**: Tanggal, Juz (1-30), Surah, Rentang Ayat, Jenis Setoran (Ziyadah/Murojaah), Nilai (A/B/C), Pengampu.

#### 4.2.6 Sub Menu: Setoran Nadhoman Kitab
- **Layout 2 Panel**: Form Input Setoran + Tabel Histori & Popup Cari Santri.
- **Pilihan Kitab**: *Aqidatul Awam* (Tauhid - 57 bait), *Matan Al-Imriti* (Nahwu - 254 bait), *Alfiyah Ibn Malik* (Gramatika - 1002 bait).
- **Akumulasi Otomatis**: Sistem secara otomatis menghitung akumulasi total bait selesai (`totalHafalanSelesai`) berdasarkan riwayat setoran sebelumnya.

#### 4.2.7 Sub Menu: Data Alumni
- Database khusus menampilkan santri dengan status `'Alumni'` (keluar/lulus).
- Fitur filter berdasarkan tahun keluar, unit sekolah, pencarian NIS/nama.

---

### 4.3 Modul Kepengasuhan `[STATUS FRONTEND: SELESAI]`

- **Kesehatan UKS**: Pencatatan tanggal sakit, keluhan, diagnosa, tindakan, obat, dan status (`Dalam Perawatan UKS`, `Sembuh`, `Dirujuk Rumah Sakit`).
- **Perizinan Santri**: Pengajuan izin (pulang/keluar komplek/berobat), tanggal kembali, penjemput, dan alur persetujuan (`Menunggu Persetujuan`, `Disetujui`, `Ditolak`) beserta nama pengasuh penyetuju.
- **Konseling & Kunjungan**: Log bimbingan/pelanggaran disiplin dan pencatatan tamu/wali santri di pos kepengasuhan.

---

### 4.4 Modul Kepegawaian `[STATUS FRONTEND: SELESAI]`

- **Jabatan Pegawai**: Master Jabatan (Kode, Nama, Tunjangan, Satminkal).
- **Data Pegawai**: Data pegawai Aktif & Non-Aktif dengan pembuatan NIP otomatis (`PGW-YYYY-XXX`).

---

### 4.5 Modul Akademik & Presensi `[STATUS FRONTEND: SELESAI]`

- **Presensi Formal & Madin**: Rekapitulasi & batch entry kehadiran santri per kelas/tanggal dengan status *Hadir*, *Izin*, *Sakit*, atau *Alpha*.

---

### 4.6 Modul Keuangan & Syahriyah `[STATUS FRONTEND: SELESAI]`

- **Biaya Master**: Pengaturan biaya Tahunan, Syahriyah (Bulanan), dan Non-Syahriyah.
- **Tagihan Keuangan**: Tracking status tagihan (`Lunas`, `Sebagian`, `Belum Lunas`).
- **Transaksi & Kuitansi**: Modal pencatatan pembayaran yang menghasilkan nomor kuitansi otomatis (`KW-YYYYMMDD-XXX`) serta memperbarui sisa tagihan.
- **Otomatisasi Tagihan**: Penambahan santri baru atau mutasi PPDB otomatis menghasilkan tagihan Syahriyah bulan berjalan.

---

### 4.7 Modul PPDB & Mutasi NIS `[STATUS FRONTEND: SELESAI]`

- Formulir pendaftaran calon santri baru (pilihan Unit Pesantren, Unit Sekolah, Marhalah Madin).
- Dashboard status pendaftar (`Pendaftaran Baru`, `Lulus Seleksi`, `Ditolak`, `Telah Dimutasi`).
- **Fitur Mutasi Otomatis 1-Click (`mutasiPPDBKeSantri`)**: Memindahkan pendaftar diterima menjadi Santri Aktif, meng-generate NIS 6-Digit otomatis, menetapkan kamar/kelas fallback, dan membuat tagihan Syahriyah perdana.

---

### 4.8 Modul Portal Wali Santri `[STATUS FRONTEND: SELESAI]`

- Portal khusus orang tua/wali santri untuk memantau ananda secara real-time.
- Menyajikan informasi: Profil Santri & Kamar/Sekolah, Capaian Juz Tahfidz & Bait Nadhoman, Status Pelunasan Syahriyah, Riwayat Perizinan, dan Catatan Kesehatan UKS.

---

### 4.9 Modul Pengaturan & RBAC `[STATUS FRONTEND: SELESAI]`

- **Manajemen RBAC**: Simulator pergantian 9 peran (Admin Sistem, Pesantren, Madin, Sekolah, Kepengasuhan, Bendahara, Pimpinan, Guru, Wali Santri).
- **Manajemen Tahun Ajaran**: Pengaturan Tahun Ajaran Aktif (misal: `2025/2026`) yang menjadi referensi default seluruh transaksi data.

---

## 5. ALUR KERJA UTAMA (LOGIC FLOWS)

### 5.1 Alur PPDB & Mutasi NIS Otomatis

```
[Calon Santri Daftar PPDB] 
       │
       ▼
[Admin PPDB Verifikasi & Kelulusan]
       │
       ▼
[Klik Tombol "Mutasi ke Data Santri"]
       │
       ├─► Generasi NIS Otomatis (Format: YY + 4 Digit Urutan)
       ├─► Salin Data Pendaftar ke Tabel Data Santri (8 Section)
       ├─► Tetapkan Asrama, Kamar, & Kelas Fallback
       ├─► Buat Tagihan Syahriyah Bulan Berjalan Otomatis
       └─► Ubah Status PPDB ke "Telah Dimutasi"
```

### 5.2 Alur Pencatatan Setoran Hafalan & Kalkulasi Bait

```
[Pilih Santri via Modal / Pencarian]
       │
       ├─► Tahfidz: Input Juz, Surah, Ayat, Ziyadah/Murojaah, & Nilai (A/B/C)
       │
       └─► Nadhoman: Input Tanggal, Kitab, & Jumlah Bait Baru
                 │
                 ▼
          [Sistem Cari Hitungan Bait Sebelumnya]
                 │
                 ▼
          [Kalkulasi: Bait_Lama + Bait_Baru = Total_Bait_Selesai]
```

### 5.3 Alur Keuangan & Pembayaran Syahriyah

```
[Tagihan Terbuat Otomatis / Manual]
       │
       ▼
[Admin Buka Modal Bayar Tagihan]
       │
       ▼
[Input Nominal & Metode (Tunai/Transfer/E-Wallet)]
       │
       ├─► Generate No. Kuitansi (Format: KW-YYYYMMDD-XXX)
       ├─► Hitung Total Terbayar & Sisa Tagihan
       └─► Update Status Tagihan (Lunas / Sebagian / Belum Lunas)
```

### 5.4 Alur Transisi Santri Keluar / Alumni

```
[Admin Edit Data Santri -> Isi Section H (Keterangan Keluar)]
       │
       ▼
[Sistem Deteksi Pengisian Alasan / Tahun Keluar]
       │
       ▼
[Status Santri Otomatis Berubah dari "Aktif" menjadi "Alumni"]
       │
       ▼
[Data Santri Ditampilkan pada Sub Modul Data Alumni]
```

---

## 6. DESAIN DATABASE (ERD RINGKAS)

Berikut adalah struktur tabel utama relasional untuk fase Backend:

| Tabel | Kolom Utama | Relasi |
|---|---|---|
| `tahun_ajaran` | id, kode_tahun_ajaran, tanggal_mulai, tanggal_selesai, is_aktif | Referensi global |
| `unit_pesantren` | id, kode_unit, nama_unit, deskripsi | → asrama |
| `asrama` | id, unit_pesantren_id, kode_asrama, nama_asrama, pembina, kapasitas | → kamar |
| `kamar` | id, asrama_id, kode_kamar, nama_kamar, kapasitas, terisi | → santri |
| `marhalah_madin` | id, kode_marhalah, nama_marhalah, tingkat | → kelas_madin |
| `kelas_madin` | id, marhalah_id, nama_kelas, wali_kelas | → santri |
| `kitab_hafalan` | id, marhalah_id, nama_kitab, total_bait, pengampu | → setoran_nadhoman |
| `unit_sekolah` | id, kode_sekolah, nama_sekolah, kepala_sekolah | → kelas_sekolah |
| `kelas_sekolah` | id, sekolah_id, jurusan_id, kode_kelas, nama_kelas | → santri |
| `santri` | id, nis, nik, nisn, nama_lengkap, gender, ttl, status, unit_pesantren_id, asrama_id, kamar_id, unit_sekolah_id, kelas_sekolah_id, marhalah_madin_id, kelas_madin_id, ... (8 Section Fields) | Tabel Utama |
| `peserta_tahfidz` | id, santri_id, tahun_ajaran_id, tanggal_daftar, status | → santri |
| `setoran_tahfidz` | id, santri_id, tanggal, juz, surah, ayat_mulai, ayat_selesai, jenis_setoran, nilai, pengampu | ← santri |
| `setoran_nadhoman` | id, santri_id, tanggal, nama_kitab, jumlah_bait_baru, total_hafalan_selesai, penguji | ← santri |
| `perizinan` | id, santri_id, jenis_izin, alasan, tgl_keluar, tgl_kembali_plan, tgl_kembali_real, status_approval, disetujui_oleh | ← santri |
| `kesehatan_uks` | id, santri_id, tgl_sakit, keluhan, diagnosa, tindakan_uks, obat, status | ← santri |
| `tagihan_keuangan` | id, santri_id, biaya_master_id, bulan_tahun, nominal_tagihan, nominal_terbayar, status | ← santri |
| `transaksi_pembayaran`| id, tagihan_id, santri_id, no_kuitansi, tanggal, nominal, metode_pembayaran, penerima | ← tagihan_keuangan |
| `pendaftar_ppdb` | id, no_pendaftaran, nama_lengkap, sekolah_asal, unit_pesantren_pilihan_id, status_seleksi | Transisi ke santri |
| `users` | id, username, nama, role, email, santri_id_associated | Otorisasi Akses |

---

## 7. DESAIN UI/UX & TEMA WARNA

### 7.1 Palet Warna Utama

| Elemen | Warna | Kode Hex |
|---|---|---|
| **Primary (Header & Sidebar)** | Navy Teal | `#1A5276` |
| **Secondary (Link & Submenu)** | Biru Sedang | `#2E86C1` |
| **Accent (Highlight & Badge)** | Teal Hijau | `#1ABC9C` |
| **Background Viewport** | Light Gray Canvas | `#F4F6F7` |
| **Text Primary** | Dark Slate | `#1C2833` |
| **Text Secondary** | Medium Slate | `#566573` |

---

## 8. KEAMANAN & RBAC

- **Autentikasi Token-Based (Target)**: JWT Token / Laravel Sanctum.
- **Otorisasi Server-Side**: Validasi hak akses dilakukan di level REST API endpoint sesuai 9 Peran pengguna.
- **Audit Trail**: Logging aktivitas perubahan data (siapa, kapan, dan apa yang diubah).

---

## 9. ROADMAP PENGEMBANGAN & RENCANA TASK KEDEPANNYA

Status pengembangan SiSantri saat ini dan rencana kerja ke depan:

| Fase | Durasi | Cakupan & Target | Status |
|---|---|---|---|
| **Fase MVP Frontend** | 4 Minggu | Development UI/UX React SPA 9 Modul, AppContext Store, Auto NIS, Mutasi PPDB 1-Click, Akumulasi Nadhoman, Kuitansi, & Portal Wali | **SELESAI (100%)** |
| **Fase 1: Backend & DB** | 6 Minggu | Setup REST API (Laravel 11/Node.js), Migrasi Database Relasional MySQL/Supabase, Auth JWT, API Integration | **Rencana Task 1** |
| **Fase 2: Export Engine** | 3 Minggu | Generasi PDF Kuitansi, Export Excel Data Santri/Presensi/Syahriyah, Cetak Buku Rapor Hafalan & Kartu Santri QR | **Rencana Task 2** |
| **Fase 3: Cloud Storage** | 2 Minggu | Upload Foto Santri, Upload Berkas PPDB (Ijazah/KK/Akta), & Upload Bukti Transfer Syahriyah | **Rencana Task 3** |
| **Fase 4: WA Gateway** | 3 Minggu | Integrasi WhatsApp Gateway (Fonnte/Wablas) untuk Pengingat Syahriyah, Notifikasi Izin, & Info UKS ke Ortu | **Rencana Task 4** |
| **Fase 5: QA & Launching** | 2 Minggu | Testing Menyeluruh (Load Testing 50+ Users), Audit Log, Deployment VPS Linux HTTPS, & Training Operational Admin | **Rencana Task 5** |

---

## 10. KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA)

| No | Kriteria Penerimaan | Metode Verifikasi | Status Verifikasi |
|---|---|---|---|
| 1 | Pengguna dapat berpindah role persona dengan aman | Simulator Role pada Pengaturan | **Terverifikasi (Selesai)** |
| 2 | NIS Santri digenerate otomatis 6 digit sesuai format | Tambah Santri / Mutasi PPDB | **Terverifikasi (Selesai)** |
| 3 | Dropdown Pendidikan terintegrasi dengan Master Data | Form Santri Section D | **Terverifikasi (Selesai)** |
| 4 | Input hafalan Nadhoman terakumulasi otomatis | Input setoran Nadhoman berulang | **Terverifikasi (Selesai)** |
| 5 | Mutasi PPDB memindahkan data ke Santri Aktif & buat Tagihan | Klik Mutasi PPDB pada Pendaftar | **Terverifikasi (Selesai)** |
| 6 | Pembayaran tagihan menghasilkan No Kuitansi `KW-xxx` | Bayar Tagihan via Modal Keuangan | **Terverifikasi (Selesai)** |
| 7 | Wali Santri dapat memantau capaian ananda real-time | Akses Portal Wali Santri | **Terverifikasi (Selesai)** |
| 8 | Sistem responsif pada layar desktop & mobile | Pengujian resolusi 320px - 1920px | **Terverifikasi (Selesai)** |

---

## 11. LAMPIRAN & RIWAYAT DOKUMEN

### 11.1 Referensi Berkas
- [Laporan.md](file:///d:/web/sisantri---sim-pesantren-mukhtar-syafaat/Laporan.md) — Laporan Analisis Sistem & Logic Flow Frontend
- `RENCANA_APLIKASI.xlsx` — Perencanaan awal struktur modul dan UI oleh tim multimedia
- Peraturan PPDB PP Mukhtar Syafaat Blokagung

### 11.2 Riwayat Dokumen

| Versi | Tanggal | Perubahan | Oleh |
|---|---|---|---|
| v0.1 | 2026 | Draft awal berdasarkan RENCANA_APLIKASI.xlsx | Tim Multimedia |
| v1.0 | 2026 | Dokumen PRD awal perencana sistem | Tim Multimedia |
| **v1.1.0** | **2026** | **Integrasi Hasil Laporan Analisis Frontend, Flow Logic (Auto NIS, Mutasi 1-Click, Akumulasi Nadhoman, Kuitansi KW-xxx, Auto Alumni), Spesifikasi 9 Modul (termasuk Portal Wali), dan Rencana Task Backend Kedepannya** | **Antigravity AI & Tim Multimedia** |

---

*--- Akhir Dokumen PRD v1.1.0 ---*
