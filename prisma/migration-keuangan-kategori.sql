-- SIAP - Migrasi Modul Keuangan (FASE 1)
-- Tujuan: model tagihan multi-kategori (YAYASAN/SEKOLAH/PESANTREN/MAKAN/MADIN)
--          + bulanKe (urutan tahun ajaran Juli=1..Juni=12) + unitId (filter per unit).
-- Sifat:  incremental & backward-compatible — tidak menghapus/merubah data lama.
-- Cara apply (setelah DATABASE_URL tersedia):
--   npx prisma db execute --file prisma/migration-keuangan-kategori.sql --schema prisma/schema.prisma
--   atau jalankan via psql/psql di Supabase SQL Editor (Postgres).

-- 1) Enum kategori biaya
CREATE TYPE "BiayaKategori" AS ENUM ('YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN');

-- 2) BiayaMaster: tambah kategori (default PESANTREN agar baris lama tetap valid)
ALTER TABLE "BiayaMaster" ADD COLUMN "kategori" "BiayaKategori" NOT NULL DEFAULT 'PESANTREN';

-- 3) TagihanKeuangan: bulanKe (nullable, di-backfill dari bulanTahun)
ALTER TABLE "TagihanKeuangan" ADD COLUMN "bulanKe" INTEGER;

-- 4) TagihanKeuangan: unitId snapshot (nullable; PONPES/SMP/MTS/MA/SMK/MADIN)
ALTER TABLE "TagihanKeuangan" ADD COLUMN "unitId" TEXT;

-- 5) Index untuk filter/sort per bulan & per unit
CREATE INDEX "TagihanKeuangan_bulanKe_idx" ON "TagihanKeuangan"("bulanKe");
CREATE INDEX "TagihanKeuangan_unitId_idx" ON "TagihanKeuangan"("unitId");

-- 6) Backfill bulanKe dari kolom lama bulanTahun (contoh format "Agustus 2026")
UPDATE "TagihanKeuangan"
SET "bulanKe" = CASE
  WHEN "bulanTahun" LIKE 'Juli%'      THEN 1
  WHEN "bulanTahun" LIKE 'Agustus%'   THEN 2
  WHEN "bulanTahun" LIKE 'September%' THEN 3
  WHEN "bulanTahun" LIKE 'Oktober%'   THEN 4
  WHEN "bulanTahun" LIKE 'November%'  THEN 5
  WHEN "bulanTahun" LIKE 'Desember%'  THEN 6
  WHEN "bulanTahun" LIKE 'Januari%'   THEN 7
  WHEN "bulanTahun" LIKE 'Februari%'  THEN 8
  WHEN "bulanTahun" LIKE 'Maret%'     THEN 9
  WHEN "bulanTahun" LIKE 'April%'     THEN 10
  WHEN "bulanTahun" LIKE 'Mei%'       THEN 11
  WHEN "bulanTahun" LIKE 'Juni%'      THEN 12
  ELSE NULL
END
WHERE "bulanKe" IS NULL;

-- 7) Backfill unitId dari unit santri (berdasarkan unitSekolah → kode sekolah)
UPDATE "TagihanKeuangan" tk
SET "unitId" = sk."kodeSekolah"
FROM "Santri" s
JOIN "UnitSekolah" sk ON sk."id" = s."unitSekolahId"
WHERE tk."santriId" = s."id" AND tk."unitId" IS NULL;

-- 8) Sisa tagihan tanpa unit sekolah → PONPES (jika santri ada di UnitPesantren) atau MADIN (marhalah)
UPDATE "TagihanKeuangan" tk
SET "unitId" = 'PONPES'
FROM "Santri" s
WHERE tk."santriId" = s."id" AND tk."unitId" IS NULL AND s."unitPesantrenId" IS NOT NULL;

UPDATE "TagihanKeuangan" tk
SET "unitId" = 'MADIN'
FROM "Santri" s
WHERE tk."santriId" = s."id" AND tk."unitId" IS NULL AND s."marhalahMadinId" IS NOT NULL;