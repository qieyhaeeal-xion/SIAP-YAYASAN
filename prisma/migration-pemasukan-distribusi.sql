-- SIAP - Migrasi Pemasukan & Distribusi (tahap pemasukan)
-- Konsep: 1 pembayaran santri = 1 Pemasukan, dibagi ke 5 konteks keuangan SEJAJAR
--         (YAYASAN/MADIN/SEKOLAH/PESANTREN/MAKAN) berdasar nominal konfigurasi
--         yang disnapshot saat transaksi.
-- Sifat:  incremental & backward-compatible (hanya menambah tabel, tidak mengubah data lama).
-- Cara apply (setelah DATABASE_URL tersedia):
--   npx prisma db execute --file prisma/migration-pemasukan-distribusi.sql --schema prisma/schema.prisma
--   atau jalankan via psql / Supabase SQL Editor.

-- 0) Metadata jenis pembayaran dan tarif sasaran
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "kategoriPembayaran" TEXT NOT NULL DEFAULT 'Rutin';
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "wajib" BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "aktif" BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "kodeBiaya" TEXT;
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "tipeFrekuensi" TEXT;
ALTER TABLE "BiayaMaster" ADD COLUMN IF NOT EXISTS "nominalStandard" INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS "BiayaMaster_kodeBiaya_key" ON "BiayaMaster"("kodeBiaya");

ALTER TABLE "TransaksiPembayaran" ADD COLUMN IF NOT EXISTS "statusVerifikasi" TEXT NOT NULL DEFAULT 'Terverifikasi';
ALTER TABLE "TransaksiPembayaran" ADD COLUMN IF NOT EXISTS "buktiTransferUrl" TEXT;
ALTER TABLE "TransaksiPembayaran" ADD COLUMN IF NOT EXISTS "verifiedBy" TEXT;
ALTER TABLE "TransaksiPembayaran" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);
ALTER TABLE "TransaksiPembayaran" ADD COLUMN IF NOT EXISTS "appliedToTagihan" BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS "TarifPembayaran" (
  "id" TEXT NOT NULL,
  "biayaMasterId" TEXT NOT NULL,
  "targetScope" TEXT NOT NULL,
  "targetValue" TEXT,
  "nominal" INTEGER NOT NULL,
  "wajib" BOOLEAN NOT NULL DEFAULT TRUE,
  "aktif" BOOLEAN NOT NULL DEFAULT TRUE,
  "effectiveFrom" TEXT,
  "effectiveUntil" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TarifPembayaran_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "TarifPembayaran" ADD CONSTRAINT "TarifPembayaran_biayaMasterId_fkey" FOREIGN KEY ("biayaMasterId") REFERENCES "BiayaMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "TarifPembayaran_biayaMasterId_idx" ON "TarifPembayaran"("biayaMasterId");
CREATE INDEX IF NOT EXISTS "TarifPembayaran_targetScope_targetValue_idx" ON "TarifPembayaran"("targetScope", "targetValue");

-- 1) Enum konteks keuangan
CREATE TYPE "KonteksKeuangan" AS ENUM ('YAYASAN', 'MADIN', 'SEKOLAH', 'PESANTREN', 'MAKAN');

-- 2) Konfigurasi pembagian pemasukan (berbasis periode, punya histori)
CREATE TABLE "DistribusiKeuanganConfig" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "effectiveFrom" TEXT NOT NULL,
  "effectiveUntil" TEXT,
  "yayasanNominal" INTEGER NOT NULL DEFAULT 0,
  "madinNominal" INTEGER NOT NULL DEFAULT 0,
  "sekolahNominal" INTEGER NOT NULL DEFAULT 0,
  "pesantrenNominal" INTEGER NOT NULL DEFAULT 0,
  "makanNominal" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'Draft',
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DistribusiKeuanganConfig_pkey" PRIMARY KEY ("id")
);

-- 3) Pemasukan (identitas transaksi asli + snapshot konfigurasi saat transaksi)
CREATE TABLE "Pemasukan" (
  "id" TEXT NOT NULL,
  "noPemasukan" TEXT NOT NULL,
  "santriId" TEXT NOT NULL,
  "tanggal" TEXT NOT NULL,
  "nominal" INTEGER NOT NULL,
  "jenisPembayaran" TEXT NOT NULL,
  "metodePembayaran" TEXT NOT NULL,
  "periode" TEXT NOT NULL,
  "bulanKe" INTEGER,
  "tahunAjaranId" TEXT,
  "catatan" TEXT,
  "configId" TEXT NOT NULL,
  "configName" TEXT NOT NULL,
  "configEffectiveFrom" TEXT NOT NULL,
  "configEffectiveUntil" TEXT,
  "yayasanNominalSnapshot" INTEGER NOT NULL,
  "madinNominalSnapshot" INTEGER NOT NULL,
  "sekolahNominalSnapshot" INTEGER NOT NULL,
  "pesantrenNominalSnapshot" INTEGER NOT NULL,
  "makanNominalSnapshot" INTEGER NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Pemasukan_pkey" PRIMARY KEY ("id")
);

-- 4) Alokasi pemasukan -> 5 konteks keuangan
CREATE TABLE "AlokasiPemasukan" (
  "id" TEXT NOT NULL,
  "pemasukanId" TEXT NOT NULL,
  "konteks" "KonteksKeuangan" NOT NULL,
  "nominal" INTEGER NOT NULL,
  CONSTRAINT "AlokasiPemasukan_pkey" PRIMARY KEY ("id")
);

-- 5) Foreign keys & constraint unik
ALTER TABLE "Pemasukan" ADD CONSTRAINT "Pemasukan_noPemasukan_key" UNIQUE ("noPemasukan");
ALTER TABLE "Pemasukan" ADD CONSTRAINT "Pemasukan_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Pemasukan" ADD CONSTRAINT "Pemasukan_configId_fkey" FOREIGN KEY ("configId") REFERENCES "DistribusiKeuanganConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Pemasukan" ADD CONSTRAINT "Pemasukan_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AlokasiPemasukan" ADD CONSTRAINT "AlokasiPemasukan_pemasukanId_fkey" FOREIGN KEY ("pemasukanId") REFERENCES "Pemasukan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AlokasiPemasukan" ADD CONSTRAINT "AlokasiPemasukan_pemasukanId_konteks_key" UNIQUE ("pemasukanId", "konteks");

-- 6) Index untuk lookup cepat
CREATE INDEX "Pemasukan_santriId_idx" ON "Pemasukan"("santriId");
CREATE INDEX "Pemasukan_configId_idx" ON "Pemasukan"("configId");
CREATE INDEX "Pemasukan_bulanKe_idx" ON "Pemasukan"("bulanKe");
