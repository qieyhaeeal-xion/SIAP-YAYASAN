# Laporan Pengembangan Modul Keuangan & Syahriyah (Tab Keuangan)

**Proyek**: SIAP — Sistem Informasi Administrasi Pesantren
**Lingkup**: Redesain data model finansial + sub-tab baru "Rekap Bulanan"
**Tanggal**: Agustus 2026

---

## 1. Ringkasan

Modul Keuangan sebelumnya hanya mendukung **1 tagihan = 1 nominal per bulan** (satu kolom Syahriyah). Rekap riil pesantren (Syahriyah 2025/2026) ternyata memiliki **5 kategori tagihan terpisah per santri per bulan**: `YAYASAN`, `SEKOLAH`, `PESANTREN`, `MAKAN`, `MADIN` — masing-masing dengan nominal & status bayar sendiri, berulang selama 12 bulan tahun ajaran (Juli–Juni).

Pengembangan ini:
1. Menambahkan kolom `kategori`, `bulanKe`, `unitId` pada data model (Prisma + TypeScript).
2. Membuat helper **pivot** untuk mengubah 5 baris tagihan menjadi 1 baris rekap per santri per bulan.
3. Menambah sub-tab **"Rekap Bulanan"** di UI Keuangan — tampilan utama ala sheet Excel PONPES/SMP/MTS/MA/SMK/MADIN.
4. Menyiapkan data demo (mock) 3 santri × 5 kategori × 12 bulan = **180 tagihan**.

Semua warna brand dipertahankan (`#1A5276`, `#1ABC9C`, `#2E86C1`). Verifikasi: `npm run lint` (tsc) dan `npm run build` (vite) **lolos**.

---

## 2. Arsitektur & Alur Kerja (Workflow)

```
src/data/mockData.ts ──► src/context/AppContext.tsx ──► src/components/keuangan/KeuanganModule.tsx ──► UI
     (data awal)            (useLocalStorage)              (4 sub-tab)                  (render)
```

1. **Sumber data**: `mockData.ts` menyediakan `INITIAL_BIAYA_MASTER` (7 pos biaya) dan `INITIAL_TAGIHAN` (180 tagihan hasil `generateMockTagihan()`).
2. **State global**: `AppContext.tsx` memuat data via `useLocalStorage` (key `sisantri_app_biayaMaster`, `sisantri_app_tagihan`, `sisantri_app_transaksi`). Data tersimpan di `localStorage` browser — tidak ada panggilan API ke backend.
3. **Tampilan**: `KeuanganModule.tsx` membaca `tagihanList`, `biayaMasterList`, `santriList`, dan data unit (`unitSekolahList`, `unitsPesantren`, `marhalahList`) dari `useApp()`, lalu menghitung dan me-render.
4. **Tidak ada perubahan** pada `AppContext`/state management — cukup penambahan data di `mockData.ts`.

> **Catatan**: backend Express + Prisma (`server/`) tersedia di repo tapi **belum terhubung** ke frontend (server dikecualikan dari tsconfig, tidak ada script start). Arah ke depan: pindah ke Supabase (Postgres) — lihat §7.

---

## 3. Model Data

### 3.1 Prisma (`prisma/schema.prisma`)

```prisma
enum BiayaKategori {
  YAYASAN
  SEKOLAH
  PESANTREN
  MAKAN
  MADIN
}

model BiayaMaster {
  id         String @id @default(cuid())
  namaBiaya  String
  jenis      String
  nominal    Int
  kategori   BiayaKategori @default(PESANTREN)   // BARU
  keterangan String?
  tagihan TagihanKeuangan[]
}

model TagihanKeuangan {
  id               String @id @default(cuid())
  santriId         String
  biayaMasterId    String
  bulanTahun       String
  bulanKe          Int?   // BARU: 1..12, Juli=1 .. Juni=12 (tahun ajaran)
  unitId           String? // BARU: snapshot unit PONPES/SMP/MTS/MA/SMK/MADIN
  nominalTagihan   Int
  nominalTerbayar  Int    @default(0)
  status           String @default("Belum Lunas")
  tanggalJatuhTempo String?
  tahunAjaranId    String
  ...
  @@index([bulanKe])
  @@index([unitId])
}
```

Keputusan desain:
- `kategori` **enum + default `PESANTREN`** → integritas nilai terbatas + backward-compatible untuk baris lama.
- `bulanKe` **nullable** → urutan tahun ajaran (Juli=1) bukan kalender; data lama bisa di-backfill dari string `bulanTahun`.
- `unitId` **snapshot string tanpa relasi** → satu kolom mewakili 3 tabel unit (UnitSekolah/UnitPesantren/MarhalahMadin) agar filter sederhana seperti sheet Excel.
- `@@index` untuk akselerasi filter/sort per bulan & per unit.

### 3.2 TypeScript (`src/types/sisantri.ts`)

- `type BiayaKategori = 'YAYASAN' | 'SEKOLAH' | 'PESANTREN' | 'MAKAN' | 'MADIN'`
- `BiayaMaster.kategori?`, `TagihanKeuangan.bulanKe?`, `TagihanKeuangan.unitId?`
- `RekapBulananSantri` — hasil pivot 1 baris per santri per bulan:

```ts
interface RekapBulananSantri {
  santriId: string;
  namaSantri: string;
  bulanKe: number;
  bulanLabel: string; // "Juli", "Agustus", dst
  unitId?: string;
  kategori: {
    yayasan:   { nominal: number; terbayar: number; status: string };
    sekolah:   { nominal: number; terbayar: number; status: string };
    pesantren: { nominal: number; terbayar: number; status: string };
    makan:     { nominal: number; terbayar: number; status: string };
    madin:     { nominal: number; terbayar: number; status: string };
  };
  totalTagihan: number;
  totalTerbayar: number;
}
```

### 3.3 Helper Pivot

- `pivotTagihanToRekap(tagihanList, santriId, bulanKe, kategoriLookup?)` → mengubah 5 baris tagihan (per kategori) jadi satu `RekapBulananSantri`. Param ke-4 (opsional) adalah `Record<biayaMasterId, BiayaKategori>` karena `kategori` hidup di `BiayaMaster`; fallback `PESANTREN` bila tidak dikenal. Untuk data lama tanpa `bulanKe`, diparse dari `bulanTahun` via `bulanKeFromBulanTahun()`.
- `buildRekapRows(santriList, tagihanList, bulanKe, kategoriLookup, getNamaSantri)` → menghasilkan 1 baris per santri Aktif (5 kategori terisi 0 bila bulan itu kosong), meniru sheet Excel yang menampilkan seluruh santri.
- `BULAN_KE_LABEL` & `bulanKeLabel(bulanKe)` → label bulan tahun ajaran.

---

## 4. UI Modul Keuangan (`src/components/keuangan/KeuanganModule.tsx`)

### 4.1 Empat Sub-Tab

| Sub-tab | Fungsi |
|---|---|
| **Rekap Bulanan** (BARU, default) | Tampilan utama ala sheet Excel: 5 kategori per santri per bulan |
| **Tagihan Santri** | Daftar tagihan individual + tombol "Bayar Syahriyah" |
| **Riwayat Transaksi** | Jurnal pembayaran + tombol cetak Kuitansi Resmi |
| **Pos Biaya Master** | Daftar pos biaya (kode, nama, kategori, nominal, frekuensi) |

Tiga sub-tab lama **tidak diubah strukturnya** — hanya sub-tab baru yang ditambahkan sebagai pill pertama.

### 4.2 Cara Kerja Sub-Tab "Rekap Bulanan"

1. **Pemilih bulan** — 12 pill `Juli`–`Juni`. Hanya **1 bulan yang dirender** sekaligus (`rekapBulanKe` state). Scroll horizontal di layar kecil.
2. **Filter unit** — dropdown `Semua Unit` + `PONPES / SMP / MTS / MA / SMK / MADIN`. Pencocokan: utamakan `tagihan.unitId` (field baru), fallback diturunkan dari unit santri (`getUnitKeyFromSantri` — kode sekolah → unit sekolah, lalu PONPES, lalu MADIN).
3. **Summary strip** — total `nominal` & `terbayar` per 5 kategori + `Grand Total` (kartu navy) untuk bulan terpilih.
4. **Tabel desktop (lg+)** — kolom: `Nama Santri` + 5 kategori (nominal + badge status Lunas/Sebagian/Belum Lunas) + `Total Tagihan` + `Total Bayar`. Header `bg-[#1A5276]`.
5. **Kartu mobile (<lg)** — tiap santri jadi kartu accordion: nama + unit + total + status di header (chevron `ChevronDown`), diklik untuk expand → list 5 kategori + baris Total Bayar.
6. **Empty state** — pesan bila tidak ada tagihan di bulan/unit terpilih.

Alur perhitungan (useMemo):
```
kategoriLookup = { biayaMasterId → kategori }           // dari biayaMasterList
rekapRows      = buildRekapRows(santriAktifTerfilter, tagihanList, rekapBulanKe, kategoriLookup, getSantriNameById)
summary        = agregasi rekapRows per kategori + grand total
```

### 4.3 Data Demo (mock)

`generateMockTagihan()` menghasilkan 180 baris:
- 3 santri aktif (`snt-1`→MA, `snt-2`→SMK, `snt-3`→MTS).
- 5 kategori × 12 bulan, nominal: YAYASAN 100.000, SEKOLAH 150.000, PESANTREN 200.000, MAKAN 250.000, MADIN 75.000.
- Status simulasi: bulan lampau **Lunas**, bulan berjalan (Agustus = bulanKe 2) **beragam** (snt-1 lunas, snt-2 minus MAKAN, snt-3 sebagian), bulan depan **Belum Lunas**.
- Setiap baris punya `noTagihan`, `bulanKe`, `unitId`, `tahunAjaranId` — sekaligus memperbaiki bug lama `t.noTagihan` yang undefined.

---

## 5. Fitur Baru: Pemasukan & Distribusi (Tahap Pemasukan)

Konsep: **satu pembayaran santri = satu `Pemasukan`** (identitas transaksi asli), lalu sistem membaginya ke **5 konteks keuangan yang berdiri sejajar** — YAYASAN, MADIN, SEKOLAH, PESANTREN, MAKAN — berdasarkan nominal konfigurasi yang **disnapshot** saat transaksi. Ini adalah lapisan ledger baru yang **aditif**: alur tagihan/syahriyah lama (`TagihanKeuangan`/`TransaksiPembayaran`) tidak diubah sama sekali.

### 5.1 Desain Data (type + Prisma)

- `KonteksKeuangan = BiayaKategori` (alias) + `KONTEKS_KEUANGAN_ORDER = [YAYASAN, MADIN, SEKOLAH, PESANTREN, MAKAN]` (urutan tampil konsisten).
- `DistribusiKeuanganConfig` — name, `effectiveFrom`/`effectiveUntil` (berbasis periode agar histori aturan tersimpan), `nominals` (5 konteks), status `Draft | Aktif | Arsip`, createdBy, createdAt/updatedAt.
- `Pemasukan` — `noPemasukan` unik (`PMK-YYYYMMDD-0001`), santriId, tanggal, nominal, jenisPembayaran, metodePembayaran, periode, bulanKe, tahunAjaranId, catatan, `configId` + **`configSnapshot` beku**, createdBy, createdAt.
- `AlokasiPemasukan` — pemasukanId, konteks, nominal; `@@unique([pemasukanId, konteks])` (1:5).
- Prisma: enum `KonteksKeuangan` + 3 model + relasi `Santri.pemasukan` & `TahunAjaran.pemasukan`. SQL tersedia di `prisma/migration-pemasukan-distribusi.sql` (incremental; **apply ditunda** sampai `DATABASE_URL` tersedia).

### 5.2 Service Murni (`src/services/distributionService.ts`)

Domain logic dipisah agar testable & tidak bergantung UI/storage:

| Fungsi | Peran |
| --- | --- |
| `validateDistribution` | Tolak nominal negatif/non-bulat dan total akhir Rp 0 |
| `computeDistribution` | Gunakan alokasi nominal tetap; total alokasi harus sama dengan nominal pembayaran |
| `buildConfigSnapshot` | Bekukan konfigurasi saat transaksi (tidak pernah dihitung ulang) |
| `createPemasukanRecord` | Use-case: input pembayaran + konfigurasi + seq → `Pemasukan` + 5 `AlokasiPemasukan` |

### 5.3 State & Use-Case (AppContext)

- `distribusiConfigList`, `pemasukanList`, `alokasiList` (localStorage `distribusiConfig` / `pemasukan` / `alokasiPemasukan`).
- `getAktifDistribusiConfig()` — konfigurasi berstatus `Aktif` (hanya boleh satu).
- `saveDistribusiConfig` — validasi dulu; saat disimpan `Aktif`, konfigurasi aktif lain otomatis di-**Arsip**.
- `activateDistribusiConfig` — pindahkan status Aktif dari histori.
- `createPemasukan` — gagal bila tidak ada konfigurasi aktif / nominal ≤ 0; sukses → simpan Pemasukan + alokasi.

### 5.4 RBAC (tanpa mengubah mekanisme existing)

- **Melihat** tab = `hasPermission(role, 'keuangan', 'view')` (mekanisme `rbac.ts` existing).
- **Mencatat pemasukan** = `hasPermission(role, 'keuangan', 'edit')`.
- **Mengelola konfigurasi** = kombinasi RBAC existing + allowlist role `admin_yayasan` / `admin_sistem` (tidak membuat node permission baru). Pengurus hanya bisa melihat; form konfigurasi dinonaktifkan (`disabled`) untuk non-admin.

### 5.5 UI (2 sub-tab baru, 4 sub-tab lama utuh)

1. **Pemasukan & Distribusi** (`PemasukanDistribusi.tsx`):
   - Strip ringkasan 5 konteks + kartu Total Pemasukan (navy).
   - Form "Catat Pemasukan" (santri, tanggal, nominal, jenis, metode, periode, catatan) → modal hasil distribusi otomatis (5 kartu alokasi + snapshot konfigurasi).
   - Riwayat pemasukan sebagai accordion: tiap baris menampilkan no, santri, nominal, badge konfigurasi snapshot; expand → rincian 5 alokasi.
   - Perintah menuju tab Konfigurasi bila belum ada konfigurasi aktif.
2. **Konfigurasi Pemasukan** (`KonfigurasiPemasukan.tsx`):
    - Form 5 input nominal dengan **validasi live** (total akhir Syahriyah) + periode berlaku + nama.
   - Tombol "Simpan Konfigurasi" (otomatis Aktif & mengarsipkan yang lain) — hanya untuk admin_yayasan/admin_sistem.
    - Tabel histori: nama, periode, 5 nominal, total akhir, status, aksi "Aktifkan".

### 5.6 Data Demo (mock)

- 2 konfigurasi: **Periode A** (Arsip) & **Periode B** (Aktif), masing-masing menyimpan nominal lima pos keuangan.
- 3 pemasukan Agustus 2026 (snt-1/snt-2/snt-3) dibangun lewat `createPemasukanRecord` → Pemasukan + 15 Alokasi, semuanya memakai snapshot Periode B.

### 5.7 Test Case Utama

1. `validateDistribution`: nominal negatif/non-bulat atau total Rp 0 → ditolak; total nominal positif → diterima.
2. `computeDistribution`: nominal pembayaran yang sama dengan total konfigurasi menghasilkan alokasi lima pos yang jumlahnya **sama persis**.
3. Konfigurasi baru yang diaktifkan **tidak mengubah** snapshot pemasukan lama.
4. `createPemasukan` menolak ketika tidak ada konfigurasi aktif.
5. RBAC: pengurus dapat melihat tab pemasukan namun tombol ubah/aktifkan konfigurasi disabled.

---

## 6. Tahap 2: Pencatatan, Monitoring & Audit Alur Pemasukan

Lapisan kedua di atas alur Tahap 1 (`Pembayaran → Pemasukan → Distribusi → Pencatatan → Monitoring → Riwayat & Audit`). **Tidak** mengubah business rule tahap pertama — hanya menambah *visibility, traceability, accountability*.

### 6.1 Status Proses Transaksi

`PemasukanStatus = 'PENDING' | 'PAID' | 'DISTRIBUTED' | 'FAILED'`:
- `PAID` — pembayaran berhasil diterima (record disimpan).
- `DISTRIBUTED` — pembagian ke 5 keuangan sukses **dan terverifikasi** (Σ alokasi == nominal).
- `FAILED` — distribusi tidak sesuai nominal → `distribusiError` tersimpan, **transaksi tidak hilang**, tampil di panel error admin.

### 6.2 Validasi Integritas (`verifyDistribution`)

Service `distributionService.verifyDistribution(nominal, alokasi)` memastikan **Total Distribusi = Total Pembayaran** (pembulatan largest-remainder Tahap 1 dipertahankan). Gagal → status `FAILED` + pesan error tercatat, bukan silent failure.

### 6.3 Snapshot yang Diperkaya

- `Pemasukan.unitId` — snapshot unit santri (PONPES/SMP/MTS/MA/SMK/MADIN) untuk filter monitoring.
- `Pemasukan.configVersion` + `configSnapshot.version` — label versi konfigurasi (V-001, V-002, …) yang dipakai transaksi.
- `DistribusiKeuanganConfig.version` — nomor versi berurutan otomatis (`nextConfigVersion`).
- Timestamp proses: `paidAt`, `distributedAt`.

### 6.4 Audit Trail

- Model `AuditLog` (action, entityType, entityId, entityLabel, actorId, actorName, detail, **before/after** snapshot, createdAt).
- Aksi terekam: `CREATE_PAYMENT`, `UPDATE_DISTRIBUTION_CONFIG`, `ACTIVATE_DISTRIBUTION_CONFIG`, `DISTRIBUTION_FAILED`.
- Dipicu dari `AppContext` (`addAuditLog`) di `createPemasukan`, `saveDistribusiConfig`, `activateDistribusiConfig`. Memakai mekanisme RBAC existing — **tanpa permission baru**.

### 6.5 Monitoring & Filter (tab "Monitoring Pemasukan")

`MonitoringPemasukan.tsx` (tab default baru):
- **Apa yang masuk**: kartu Total Pemasukan + jumlah transaksi untuk range aktif.
- **Uang dibagi ke mana**: 5 kartu konteks (YAYASAN/MADIN/SEKOLAH/PESANTREN/MAKAN) — dihitung dari data transaksi, bukan mock.
- **Filter fungsional**: rentang cepat (Hari Ini/7 Hari/Bulan Ini), dari–sampai tanggal, unit, jenis pembayaran, status transaksi, konteks keuangan, operator pencatat, pencarian nama/no transaksi. Semua bekerja terhadap data sebenarnya.
- **Riwayat**: tabel (tanggal, no transaksi, santri, unit, jenis, nominal, status, pencatat) + tombol **Detail**.
- **Detail transaksi**: identitas lengkap (santri, unit, nominal, tanggal, status, metode, periode, pencatat, waktu bayar) + **Distribusi Transaksi** (5 baris + total) + **integritas terverifikasi** + **snapshot konfigurasi** (versi, nama, nominal).
- **Monitoring error**: panel merah "DISTRIBUSI GAGAL" menampilkan semua transaksi `FAILED` (no, santri, nominal, pesan error) → klik buka detail. Tidak ada silent failure.
- **Audit trail**: panel bawah tab menampilkan log dengan sebelum/sesudah.

### 6.6 UI Tahap 1 yang Diperkaya

- `PemasukanDistribusi.tsx`: badge status per baris riwayat, detail expand menampilkan unit, `paidAt`/`distributedAt`, konfigurasi+versi, dan banner error bila `FAILED`.
- `KonfigurasiPemasukan.tsx`: kolom **Versi** (V-001…) di histori + badge versi di header form aktif.

### 6.7 RBAC

Sama dengan Tahap 1: view `hasPermission('keuangan','view')`, catat `keuangan:edit`, kelola konfigurasi hanya admin_yayasan/admin_sistem. Monitoring memakai akses yang sudah ada.

### 6.8 Data Demo (mock)

- 3 pemasukan `DISTRIBUTED` (via `createPemasukanRecord` + `unitId`).
- 1 pemasukan `FAILED` (konfigurasi uji total 99.5% → `distribusiError` terekam).
- `INITIAL_AUDIT_LOG`: 2× CREATE_PAYMENT + 1× DISTRIBUTION_FAILED.

### 6.9 Migrasi DB

`prisma/migration-pemasukan-audit.sql` (incremental, apply ditunda):
- `ALTER DistribusiKeuanganConfig ADD version` (default V-001).
- `ALTER Pemasukan ADD unitId, configVersion, status, paidAt, distributedAt, distribusiError`.
- Backfill: transaksi dengan alokasi lengkap → `DISTRIBUTED` + `distributedAt = createdAt`.
- `CREATE TABLE AuditLog` (before/after JSONB) + index `entityId`, `entityType`, `createdAt`, `Pemasukan.status`, `Pemasukan.unitId`.

---

## 7. Integrasi dengan Modul Lain

- **Dashboard Admin Yayasan** (`AdminYayasanDashboard.tsx`): kartu "Ringkasan Keuangan Yayasan" (Total Kas Masuk, Tunggakan, Total Record) membaca `tagihanList` — kini menampilkan angka agregat 180 tagihan.
- **Portal Wali** & **Wali Santri Dashboard**: `tagihanList.filter(santriId)` — tetap berfungsi karena hanya menyaring per santri.
- **RBAC**: akses tab Keuangan tetap dikendalikan `hasPermission(role, 'keuangan')` — tidak diubah.

---

## 8. Verifikasi

- `npm run lint` → `tsc --noEmit` **lolos** (tanpa error).
- `npm run build` → vite build **sukses** (17xx modul; warning ukuran chunk >500 kB tidak berkaitan).
- `npx prisma validate` → **schema valid** di Prisma ORM 7.9.1 (setelah penyesuaian `prisma.config.ts`).

---

## 9. Status & Langkah Lanjutan (env terakhir)

Migrasi ke database **ditunda** sampai `DATABASE_URL` (Postgres/Supabase) tersedia. Yang sudah siap:

1. `prisma/schema.prisma` — sudah dalam format Prisma 7 (URL dipindah dari `datasource` ke `prisma.config.ts`).
2. `prisma.config.ts` — memuat `DATABASE_URL` dari `.env` via dotenv.
3. `prisma/migration-keuangan-kategori.sql` — SQL incremental & backward-compatible:
   - `CREATE TYPE "BiayaKategori" AS ENUM (...)`.
   - `ALTER TABLE "BiayaMaster" ADD COLUMN "kategori" ... DEFAULT 'PESANTREN'`.
   - `ALTER TABLE "TagihanKeuangan" ADD COLUMN "bulanKe" INTEGER` + `"unitId" TEXT`.
   - Index `bulanKe`, `unitId`.
   - Backfill `bulanKe` dari `bulanTahun` (CASE Juli→1 … Juni→12).
   - Backfill `unitId` dari join `Santri` (kode sekolah → PONPES → MADIN).
4. `prisma/migration-pemasukan-distribusi.sql` — SQL incremental & backward-compatible:
   - `CREATE TYPE "KonteksKeuangan" AS ENUM ('YAYASAN','MADIN','SEKOLAH','PESANTREN','MAKAN')`.
   - `CREATE TABLE` `DistribusiKeuanganConfig` / `Pemasukan` (dengan kolom snapshot persen) / `AlokasiPemasukan`.
   - FK ke `Santri`, `TahunAjaran`, `DistribusiKeuanganConfig`; UNIQUE `noPemasukan` & `(pemasukanId, konteks)`; index `santriId`, `configId`, `bulanKe`.

**Cara apply saat siap** (urutkan: migrasi kategori → migrasi pemasukan):
```bash
# 1) buat .env dengan DATABASE_URL
# 2) terapkan SQL (dua opsi):
npx prisma db execute --file prisma/migration-keuangan-kategori.sql --schema prisma/schema.prisma
npx prisma db execute --file prisma/migration-pemasukan-distribusi.sql --schema prisma/schema.prisma
npx prisma db execute --file prisma/migration-pemasukan-audit.sql --schema prisma/schema.prisma
# atau jalankan di Supabase SQL Editor (copy isi file)

# (opsional) buat history migrasi resmi:
npx prisma migrate dev --name add_keuangan_kategori
npx prisma migrate dev --name add_pemasukan_distribusi
npx prisma migrate dev --name add_pemasukan_audit
```

> **Catatan Prisma 7**: generator `prisma-client-js` kini deprecated (maintenance). Bila nanti menjalankan `prisma generate` untuk server, mungkin perlu pindah ke generator `prisma-client` + `output` + driver adapter (`@prisma/adapter-pg`) dan update import di `server/*`. Ini di luar scope laporan saat ini.

---

## 10. Cara Demo

1. `npm run dev` → buka `http://localhost:3000`.
2. Login sebagai **admin** (`admin` / password default).
3. Sidebar → **Keuangan & Syahriyah** (sub-tab default: **Monitoring Pemasukan**).
4. **Monitoring Pemasukan**: lihat ringkasan Total Pemasukan + 5 kartu distribusi (data aktual transaksi), panel error DISTRIBUSI GAGAL (ada 1 contoh FAILED), tabel riwayat dengan status — aktifkan filter (hari ini, unit, status, konteks, operator) → klik **Detail** salah satu baris → lihat perjalanan uang + distribusi + snapshot versi konfigurasi + audit trail di bawah.
5. Buka **Pemasukan & Distribusi** → "Catat Pemasukan" → pilih santri + nominal → lihat modal distribusi otomatis + status DISTRIBUTED pada riwayat.
6. Buka **Konfigurasi Pemasukan** → lihat kolom **Versi** (V-001, V-002) di histori → ubah nominal lima pos → Simpan → versi baru V-003 aktif, lama otomatis Arsip → buktikan transaksi lama tetap memakai snapshot lama.
7. Buka **Tagihan Santri** → cari/bayar tagihan seperti biasa (alur tahap 1 tidak berubah).
8. Cek **Audit Trail** (bawah tab Monitoring): log CREATE_PAYMENT / UPDATE_DISTRIBUTION_CONFIG / DISTRIBUTION_FAILED dengan sebelum/sesudah.
9. Untuk data demo segar: hapus key localStorage `sisantri_app_tagihan`, `sisantri_app_biayaMaster`, `sisantri_app_transaksi`, `sisantri_app_distribusiConfig`, `sisantri_app_pemasukan`, `sisantri_app_alokasiPemasukan`, `sisantri_app_auditLog`.
