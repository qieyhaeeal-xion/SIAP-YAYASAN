# PRODUCT REQUIREMENTS DOCUMENT

# SIAP
## Sistem Informasi Administrasi Pesantren Mukhtar Syafaat

---

| Field | Value |
|---|---|
| **Versi** | v1.2.0 |
| **Tanggal** | 7 September 2026 |
| **Penyusun** | Tim Multimedia Yayasan Mukhtar Syafaat & Antigravity AI |
| **Status** | Frontend MVP Single-Role Super Admin + Rencana Pengembangan Terencana |
| **Institusi** | PP Mukhtar Syafaat Blokagung, Banyuwangi |

> Dokumen ini bersifat konfidensial dan hanya untuk keperluan internal pengembangan sistem.

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang

Pondok Pesantren Mukhtar Syafaat Blokagung, Banyuwangi mengelola data santri, pendidikan madin, sekolah formal, kepengasuhan, kepegawaian, PPDB, dan keuangan. Sebelum SIAP, sebagian proses tersebut masih tersebar pada dokumen manual dan spreadsheet sehingga pencarian data, pelaporan, dan konsistensi antar unit belum optimal.

SIAP (Sistem Informasi Administrasi Pesantren) dikembangkan sebagai aplikasi web terpusat. Codebase saat ini merupakan frontend MVP berbasis React dengan data persisten pada `localStorage`. Backend REST API dan database relasional menjadi target fase berikutnya.

### 1.2 Tujuan Produk

- Menyatukan data operasional pesantren dalam satu aplikasi.
- Mempercepat pengelolaan data santri, pendidikan, kepengasuhan, PPDB, dan keuangan.
- Menyediakan alur kerja yang konsisten untuk Super Admin.
- Menyediakan ringkasan statistik dan laporan operasional.
- Memvalidasi logic bisnis sebelum integrasi backend produksi.

### 1.3 Status Notasi

Setiap fitur pada dokumen menggunakan status berikut:

- **[Terimplementasi]**: tersedia dan dapat digunakan pada codebase saat ini.
- **[Akan Diterapkan]**: disepakati sebagai pengembangan frontend berikutnya.
- **[Opsi]**: masih memerlukan analisis desain dan keputusan lanjutan.
- **[Roadmap]**: rencana lanjutan setelah prioritas frontend utama.
- **[Known Issue]**: keterbatasan atau masalah teknis yang telah diketahui.

### 1.4 Ruang Lingkup

SIAP mencakup delapan modul:

1. **Kesantrian**: master pesantren/asrama/kamar, madin, sekolah formal, data santri, tahfidz, nadhoman, dan alumni.
2. **Kepengasuhan**: UKS, perizinan, konseling, dan kunjungan.
3. **Kepegawaian**: data pegawai dan NIP otomatis.
4. **Akademik**: presensi batch formal dan madin.
5. **Keuangan**: jenis pembayaran, tarif, tagihan, pemasukan, distribusi, dan ringkasan.
6. **PPDB**: pendaftaran dan mutasi calon santri menjadi santri aktif.
7. **Dashboard**: ringkasan statistik dan shortcut modul.
8. **Pengaturan Admin**: profil, akun admin, identitas lembaga, backup, matriks akses, dan tahun ajaran.

Portal Wali Santri dan sistem multi-role tidak termasuk dalam scope versi ini.

---

## 2. VISI, MISI & SASARAN

### 2.1 Visi

Menjadi sistem informasi pesantren yang handal, terpadu, dan mudah digunakan untuk mendukung tata kelola pesantren yang modern, efisien, dan transparan.

### 2.2 Misi

- Menyediakan data santri yang terpusat dan mudah dicari.
- Mengintegrasikan unit pesantren, madin, sekolah formal, dan kepengasuhan.
- Mendukung digitalisasi PPDB, presensi, hafalan, dan keuangan.
- Menyediakan dasar data yang siap diintegrasikan dengan backend produksi.

### 2.3 Target Pengguna

Versi ini hanya memiliki satu peran pengguna:

| Peran | Deskripsi | Hak Akses |
|---|---|---|
| **Super Admin / Admin Yayasan** | Pengelola utama sistem | Akses seluruh modul, konfigurasi, data, backup, dan pemeliharaan |

Tidak ada role Admin Madin, Admin Sekolah, Bendahara, Guru, Pimpinan, Wali Santri, atau role tambahan lain pada scope versi ini.

---

## 3. ARSITEKTUR SISTEM & TEKNOLOGI

### 3.1 Arsitektur Saat Ini

| Layer | Implementasi |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| Routing | React Router DOM v7, route publik dan route aplikasi |
| State | React Context API melalui `AppContext` |
| Persistensi MVP | `localStorage` dengan prefix `sisantri_app_` |
| Auth MVP | `authService`, username/sandi lokal, sesi lokal |
| Authorization | Guard satu role melalui `rbac.ts` |
| Logic Distribusi | `distributionService.ts` sebagai domain logic murni |
| Deployment SPA | Vercel rewrite melalui `vercel.json` |

### 3.2 Route Utama

| URL | Halaman |
|---|---|
| `/` | Landing page publik |
| `/login` | Login Super Admin |
| `/app` | Dashboard aplikasi |
| `/app/:tab` | Modul spesifik |
| `/app/keuangan` | Redirect ke ringkasan keuangan |
| `/app/payment-management` | Redirect ke ringkasan keuangan |

### 3.3 Target Backend

Fase berikutnya dapat menggunakan Laravel 11 atau Node.js dengan database MySQL/PostgreSQL/Supabase. Auth produksi dapat menggunakan JWT atau Laravel Sanctum. Migrasi dari `localStorage` ke REST API harus mempertahankan aturan bisnis yang sudah divalidasi pada frontend.

---

## 4. SPESIFIKASI MODUL

### 4.1 Dashboard [Terimplementasi]

Dashboard Super Admin menampilkan:

- Total santri aktif dan alumni.
- Jumlah unit pesantren dan pegawai.
- Total pembayaran/tagihan dan tunggakan.
- Rekap setoran Tahfidz dan Nadhoman.
- Grafik sebaran santri berdasarkan marhalah.
- Antrian PPDB.
- Izin santri dan status persetujuan.
- Shortcut menuju modul utama.

Catatan: label tahun ajaran pada sebagian widget masih perlu diambil dinamis dari master tahun ajaran.

### 4.2 Modul Kesantrian

#### 4.2.1 Pesantren, Asrama, dan Kamar [Terimplementasi]

- CRUD unit pesantren.
- CRUD asrama yang terhubung dengan unit pesantren.
- CRUD kamar yang terhubung dengan asrama.
- Kapasitas dan nilai `terisi` kamar.

Catatan: nilai `terisi` saat ini dikelola manual. Perhitungan otomatis berdasarkan santri akan menjadi penyempurnaan berikutnya.

#### 4.2.2 Madin [Terimplementasi]

- Master marhalah Ula, Wustho, dan Ulya.
- Master kelas madin.
- Master kitab hafalan.
- Filter bertingkat: pilih marhalah lalu kelas madin.

#### 4.2.3 Sekolah Formal [Terimplementasi]

- Master unit sekolah MTs, MA, dan SMK.
- Master jurusan.
- Master kelas formal dan kode kelas.
- Relasi kelas terhadap unit sekolah.

Pengaitan jurusan langsung pada form kelas dan form santri perlu disempurnakan.

#### 4.2.4 Data Santri [Terimplementasi + Akan Diterapkan]

Form saat ini terdiri dari delapan tab:

1. **Data Pribadi**: NIK, nama, tempat/tanggal lahir, jenis kelamin, nomor HP, alamat, RT/RW, dusun, desa, kecamatan, kabupaten, provinsi, kode pos, wilayah bertingkat, dan status santri.
2. **Orang Tua/Wali**: data ayah, ibu, pekerjaan/penghasilan yang tersedia, dan nomor HP orang tua.
3. **Sekolah Formal**: unit sekolah, kelas, sekolah asal, dan tahun lulus.
4. **Madin**: marhalah dan kelas madin.
5. **Asrama**: unit pesantren, asrama, dan kamar.
6. **Hafalan**: target/capaian juz dan capaian nadhoman.
7. **UKS/Kesehatan**: golongan darah, kondisi, dan riwayat penyakit.
8. **Berkas Digital**: URL foto dan checklist KK, akta, ijazah.

Status santri menggunakan hirarki:

`Kategori Utama (Santri/Desa) -> Tipe Asuh -> Golongan (A1/A2/A3) -> Program (Pengabdian/Lulus/Pelajar)`.

Fitur berikut akan diterapkan:

- **Tab 9 Keterangan Keluar**, hanya ditampilkan saat edit santri.
- Field alasan keluar, tahun keluar, nomor HP alumni, dan detail alumni.
- Pengisian Section H mengubah status Aktif menjadi Alumni.
- Pembuatan filter dan validasi field yang belum tersedia pada form.

#### 4.2.5 Tahfidz Al-Qur'an [Terimplementasi + Akan Diterapkan]

- Registrasi peserta Tahfidz berdasarkan tahun ajaran.
- Status peserta Aktif, Non Aktif, atau Lulus.
- Histori setoran dengan juz, surah, ayat, jenis setoran, nilai, pengampu, dan catatan.
- Pencarian santri melalui kolom nama yang dapat diketik akan diterapkan pada semua alur pemilihan santri.
- Tanggal setoran akan disempurnakan agar dapat dipilih pengguna.

#### 4.2.6 Nadhoman [Terimplementasi + Akan Diperbaiki]

- Pilihan kitab dari master kitab hafalan.
- Form bait awal dan bait akhir.
- Jumlah bait baru dihitung otomatis dengan rumus:

`jumlahBaitBaru = baitAkhir - baitAwal + 1`.

- Akumulasi dihitung dengan rumus:

`totalHafalanSelesai = totalSebelumnya + jumlahBaitBaru`.

- Pencarian santri menggunakan nama yang dapat diketik.
- Sinkronisasi `kitabId`, nama kitab, jumlah bait, dan histori akan diperbaiki.

#### 4.2.7 Data Alumni [Terimplementasi + Akan Diterapkan]

Database alumni menampilkan santri berstatus Alumni. Fitur yang harus tersedia:

- Pencarian berdasarkan NIS atau nama.
- Filter tahun keluar.
- Filter unit sekolah.
- Tampilan kontak dan alamat alumni.

### 4.3 Modul Kepengasuhan [Terimplementasi + Akan Dikembangkan]

Modul terdiri dari empat area:

#### Perizinan

- Jenis izin: pulang, keluar komplek, atau berobat.
- Alasan, tanggal keluar, rencana kembali, penjemput, dan status approval.
- Status: Menunggu Persetujuan, Disetujui, atau Ditolak.
- Tombol pencatatan bahwa santri sudah kembali dengan tanggal kembali real.

#### Kesehatan UKS

- Keluhan, diagnosa, tindakan, obat, petugas, dan tanggal masuk.
- Status Dalam Perawatan UKS, Sembuh, atau Dirujuk Rumah Sakit.

#### Konseling

- Topik, uraian, solusi, dan konselor.
- Kategori Bimbingan, Pelanggaran Disiplin, atau Prestasi/Apresiasi.

#### Kunjungan

- Nama tamu, hubungan, nomor HP, keperluan, jam masuk, dan jam keluar.

Semua form pengambilan santri akan menggunakan pencarian nama yang dapat diketik, bukan dropdown panjang.

### 4.4 Modul Kepegawaian [Terimplementasi]

- Data pegawai/ustaz.
- NIP otomatis dengan format `PGW-YYYY-XXX`.
- Status kepegawaian Tetap, Kontrak, atau Honor.
- Master jabatan dari data awal.

CRUD Master Jabatan, kode jabatan, tunjangan terstruktur, dan satminkal masuk Roadmap.

### 4.5 Modul Akademik & Presensi [Terimplementasi + Opsi]

Fitur yang tersedia:

- Presensi batch per tanggal dan kelas.
- Kategori KBM Madin dan KBM Sekolah Formal.
- Filter kelas bertingkat berdasarkan unit, jurusan, tingkat, dan kode kelas.
- Konfirmasi sesi sebelum daftar santri ditampilkan.
- Status Hadir, Izin, Sakit, dan Alpha.

Rekapitulasi presensi lintas tanggal dan kelas adalah **opsi yang perlu dianalisis desainnya**. Sebelum diputuskan, perlu ditentukan format rekap, filter, periode, dan kebutuhan ekspor.

### 4.6 Modul Keuangan [Terimplementasi + Roadmap]

#### Ringkasan

Menampilkan jenis pembayaran aktif, total pemasukan, jumlah transaksi, distribusi per pos, dan distribusi gagal.

#### Jenis Pembayaran

- CRUD biaya master.
- Jenis Tahunan, Syahriyah, Non-Syahriyah, dan frekuensi.
- Target tarif berdasarkan kategori santri, tipe asuh, golongan, program, unit, dan jenjang SMP/SLTA.
- Preview dan pembuatan tagihan massal.
- Pencegahan tagihan duplikat berdasarkan santri, jenis, tahun ajaran, dan periode.

#### Pemasukan & Distribusi

- Pilih santri, jenis pembayaran, dan periode tagihan.
- Nominal otomatis berdasarkan sisa tagihan.
- Nomor transaksi menggunakan format `PMK-YYYYMMDD-XXXX`.
- Distribusi ke lima pos: Yayasan, Madin, Sekolah, Pesantren, dan Makan.
- Snapshot konfigurasi distribusi pada transaksi.
- Audit log untuk pencatatan konfigurasi dan transaksi.

Kuitansi formal `KW-YYYYMMDD-XXX`, modal bayar tagihan, dan konfigurasi distribusi melalui UI masuk Roadmap. API context terkait kuitansi belum dipakai oleh komponen aktif.

### 4.7 Modul PPDB & Mutasi [Terimplementasi]

Alur status:

`Pendaftaran Baru -> Lulus Seleksi -> Telah Dimutasi`.

Mutasi satu klik:

- Membuat NIS otomatis.
- Menyalin data pendaftar menjadi santri Aktif.
- Menentukan asrama, kamar, kelas sekolah, dan kelas madin fallback.
- Membuat tagihan Syahriyah bulan berjalan.

Pencarian dan aksi penolakan pendaftar perlu disempurnakan.

### 4.8 Pengaturan Admin [Terimplementasi]

- Profil dan keamanan Super Admin.
- Ganti kata sandi minimal enam karakter.
- CRUD akun admin tambahan dengan role yang sama.
- Identitas lembaga.
- Download, restore, dan reset backup JSON.
- Matriks akses single-role.
- Master tahun ajaran dengan satu tahun aktif.

---

## 5. ALUR KERJA UTAMA

### 5.1 PPDB & Mutasi NIS

Pendaftar dibuat -> diverifikasi lulus -> mutasi satu klik -> NIS dibuat -> data santri dibuat -> tagihan Syahriyah berjalan dibuat -> status pendaftar menjadi Telah Dimutasi.

### 5.2 Setoran Hafalan

Super Admin mencari santri berdasarkan nama -> memilih kitab/program -> memasukkan setoran -> sistem menyimpan histori. Pada Nadhoman, jumlah bait baru dan akumulasi dihitung otomatis sesuai rumus pada §4.2.6.

### 5.3 Keuangan

Super Admin memilih santri -> memilih jenis pembayaran -> memilih periode yang memiliki sisa tagihan -> sistem mengisi nominal tersisa -> transaksi dibuat dengan nomor PMK -> distribusi lima pos dibuat -> konfigurasi dan aktivitas dicatat.

### 5.4 Transisi Alumni

Super Admin membuka edit data santri -> membuka Tab 9 -> mengisi alasan/tahun keluar -> sistem mengubah status menjadi Alumni -> data tampil pada modul Alumni.

### 5.5 Pencarian Santri

Semua form yang membutuhkan santri menggunakan kolom pencarian nama yang dapat diketik. Daftar hasil difilter berdasarkan nama dan menampilkan NIS sebagai informasi tambahan.

---

## 6. DESAIN DATABASE & MAPPING STATE

ERD berikut tetap menjadi target backend relasional:

| Entitas Target | Sumber State MVP |
|---|---|
| tahun_ajaran | `tahunAjaranList` |
| unit_pesantren, asrama, kamar | `unitsPesantren`, `asramaList`, `kamarList` |
| marhalah_madin, kelas_madin, kitab_hafalan | `marhalahList`, `kelasMadinList`, `kitabList` |
| unit_sekolah, jurusan, kelas_sekolah | `unitSekolahList`, `jurusanList`, `kelasSekolahList` |
| santri | `santriList` |
| peserta_tahfidz, setoran_tahfidz | `pesertaTahfidzList`, `setoranTahfidzList` |
| setoran_nadhoman | `setoranNadhomanList` |
| kesehatan, perizinan, konseling, kunjungan | masing-masing list pada `AppContext` |
| biaya_master, tarif_pembayaran, tagihan | `biayaMasterList`, `tarifPembayaranList`, `tagihanList` |
| transaksi_pembayaran | `transaksiList` |
| pemasukan, alokasi_pemasukan | `pemasukanList`, `alokasiList` |
| distribusi_config, audit_log | `distribusiConfigList`, `auditLogList` |
| pendaftar_ppdb | `ppdbList` |
| users | `users` dan `authService` lokal |

Pada backend, seluruh relasi, constraint, audit trail, dan validasi harus dipindahkan ke server-side.

---

## 7. UI/UX, ROUTING & RESPONSIVE

Palet utama:

| Elemen | Hex |
|---|---|
| Primary Navy Teal | `#1A5276` |
| Secondary Blue | `#2E86C1` |
| Accent Teal | `#1ABC9C` |
| Background | `#F4F6F7` |

Layout menggunakan sidebar desktop dan drawer mobile. Tabel menggunakan scroll horizontal internal. Route aplikasi menggunakan URL sehingga halaman dapat dibookmark.

---

## 8. KEAMANAN & AKSES

- Versi MVP menggunakan autentikasi localStorage.
- Role aplikasi hanya Super Admin (`admin_yayasan`).
- Guard route menolak role yang tidak terdaftar.
- Password demo dapat diganti dari Pengaturan Admin.
- Audit log disimpan untuk transaksi dan konfigurasi distribusi.
- JWT/Sanctum, hashing server-side, rate limiting, CORS, dan audit server adalah target backend.

---

## 9. ROADMAP PENGEMBANGAN

### Fase 1: Backend & Database

- REST API Laravel/Node.js.
- Database relasional.
- Migrasi state localStorage.
- Auth server-side Super Admin.

### Fase 2: Export & Dokumen

- PDF kuitansi formal.
- Export Excel/PDF data santri, presensi, dan keuangan.
- Buku rapor hafalan.
- Kartu santri QR.

### Fase 3: Storage

- Upload foto santri.
- Berkas PPDB.
- Bukti transfer.

### Fase 4: Notifikasi

- WhatsApp reminder tagihan.
- Notifikasi izin dan UKS.

### Fase 5: QA & Deployment

- Unit/integration/load testing.
- Audit keamanan.
- Backup database.
- Deployment HTTPS dan pelatihan admin.

### Backlog Frontend Tambahan

- Kuitansi formal `KW-YYYYMMDD-XXX` dan modal bayar tagihan.
- UI konfigurasi distribusi pemasukan.
- CRUD Master Jabatan.
- Viewer audit log.
- Rekap presensi setelah analisis desain disetujui.
- Perhitungan `terisi` kamar dari data santri.

Portal Wali dan multi-role tidak termasuk roadmap versi ini.

---

## 10. STATUS IMPLEMENTASI & RENCANA TERENCANA

| Fitur | Status | Kriteria Hasil |
|---|---|---|
| Section H | Akan Diterapkan | Tab 9 edit-only, auto Alumni |
| Cari santri berbasis nama | Akan Diterapkan | Semua form santri menggunakan input ketik |
| Perbaikan Nadhoman | Akan Diperbaiki | Jumlah bait dan total akumulasi numerik benar |
| Filter Alumni | Akan Diterapkan | Tahun, unit sekolah, NIS/nama |
| Pengembangan Kepengasuhan | Akan Diterapkan | Jenis izin, kembali real, UKS lengkap, kategori konseling |
| Rekap Presensi | Opsi | Diputuskan setelah analisis desain |
| Kuitansi KW | Roadmap | Modal bayar dan dokumen formal |

Implementasi fitur berstatus Akan Diterapkan merupakan task coding terpisah dari penyelarasan dokumen ini.

---

## 11. KNOWN ISSUES & TECHNICAL DEBT

1. Akumulasi Nadhoman pada codebase saat ini dapat menghasilkan `NaN` karena field form belum tersinkron dengan context (`NadhomanModule.tsx:69-82`, `AppContext.tsx:860-879`).
2. Section H belum memiliki input UI pada codebase saat ini.
3. Fungsi kuitansi `KW-` tersedia di context tetapi belum dipanggil komponen aktif.
4. UI konfigurasi distribusi belum tersedia, meskipun state dan service tersedia.
5. Presensi batch belum menyimpan `kelasId` dan `tipe` secara konsisten sehingga deduplikasi perlu diperbaiki.
6. Fungsi pivot rekap tagihan pada `types/sisantri.ts` belum digunakan UI.
7. Audit log belum memiliki viewer.
8. Sebagian label tahun ajaran dashboard masih hardcode.
9. Alumni belum memiliki filter/search sesuai target §4.2.7.
10. Hapus tahun ajaran masih berupa stub alert.
11. Master Jabatan masih read-only.
12. Nilai `terisi` kamar masih manual.
13. PPDB belum memiliki aksi penolakan pada UI.
14. Tanggal setoran Tahfidz/Nadhoman masih otomatis hari ini.
15. Sejumlah field pada interface/data belum memiliki input form lengkap, termasuk NISN, anak ke, jumlah saudara, alamat sekolah asal, No KIP, data ibu, wali, alasan asuh, dan jurusan santri.

---

## 12. KRITERIA PENERIMAAN

| No | Kriteria | Status |
|---|---|---|
| 1 | Super Admin dapat login dan mengakses modul | Terverifikasi |
| 2 | NIS santri dibuat otomatis enam digit | Terverifikasi |
| 3 | Dropdown master pendidikan terintegrasi | Terverifikasi |
| 4 | Akumulasi Nadhoman benar | Akan diperbaiki |
| 5 | Mutasi PPDB membuat santri dan tagihan | Terverifikasi |
| 6 | Pemasukan PMK dan distribusi lima pos tersimpan | Terverifikasi |
| 7 | Section H mengubah santri menjadi Alumni | Akan diterapkan |
| 8 | Pencarian santri berdasarkan nama tersedia pada semua form | Akan diterapkan |
| 9 | Kepengasuhan mencatat jenis izin, kembali real, UKS, dan kategori konseling | Akan diterapkan |
| 10 | Responsif pada desktop dan mobile | Terverifikasi secara visual |

---

## 13. LAMPIRAN & RIWAYAT

### 13.1 Referensi

- `Laporan.md` — analisis codebase dan flow aktual.
- `RENCANA APLIKASI.xlsx` — rancangan awal struktur modul dan UI.
- Peraturan PPDB PP Mukhtar Syafaat Blokagung.

### 13.2 Riwayat Dokumen

| Versi | Tanggal | Perubahan |
|---|---|---|
| v0.1 | 2026 | Draft awal berdasarkan spreadsheet. |
| v1.0 | 2026 | PRD awal perencana sistem. |
| v1.1.0 | 2026 | Spesifikasi frontend MVP, flow bisnis, dan rencana backend. |
| **v1.2.0** | **7 September 2026** | Penyelarasan dengan codebase aktual, penetapan single Super Admin, penghapusan Portal Wali, Section H terencana, pencarian nama, perbaikan Nadhoman, pengembangan Alumni/Kepengasuhan, opsi rekap presensi, backlog, dan known issues. |

---

*Akhir Dokumen PRD SIAP v1.2.0.*
