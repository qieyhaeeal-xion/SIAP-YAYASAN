-- =============================================================
-- Migrasi: Santri sebagai Data Induk (Master Key Preparation)
-- 1. Tabel Wali baru (data ortu/wali dipisah dari Santri, dipakai bersama antar saudara)
-- 2. Tabel RiwayatPenempatan baru (arsip penempatan per tahun ajaran)
-- 3. Kolom baru Santri: deletedAt (soft-delete), waliId, statusSantri
-- 4. Index santriId pada seluruh tabel transaksi
-- URUTAN PENTING: data ortu Santri dimigrasikan ke Wali SEBELUM kolom lama di-drop.
-- =============================================================

-- CreateTable Wali (harus sebelum backfill)
CREATE TABLE "Wali" (
    "id" TEXT NOT NULL,
    "namaAyah" TEXT,
    "nikAyah" TEXT,
    "pekerjaanAyah" TEXT,
    "penghasilanAyah" TEXT,
    "namaIbu" TEXT,
    "nikIbu" TEXT,
    "pekerjaanIbu" TEXT,
    "penghasilanIbu" TEXT,
    "namaWali" TEXT,
    "hubunganWali" TEXT,
    "noHpOrtu" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wali_pkey" PRIMARY KEY ("id")
);

-- AlterTable Santri: tambah kolom baru dulu (belum drop apa pun)
ALTER TABLE "Santri"
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "statusSantri" TEXT NOT NULL DEFAULT 'Reguler',
ADD COLUMN     "waliId" TEXT,
ALTER COLUMN "jenisSantriAsuh" DROP NOT NULL,
ALTER COLUMN "jenisSantriAsuh" DROP DEFAULT;

-- Backfill Wali dari data ortu Santri yang sudah ada (dedup per kombinasi data ortu)
INSERT INTO "Wali" ("id", "namaAyah", "nikAyah", "pekerjaanAyah", "penghasilanAyah", "namaIbu", "nikIbu", "pekerjaanIbu", "penghasilanIbu", "namaWali", "hubunganWali", "noHpOrtu", "updatedAt")
SELECT replace(gen_random_uuid()::text, '-', ''), d."namaAyah", d."nikAyah", d."pekerjaanAyah", d."penghasilanAyah", d."namaIbu", d."nikIbu", d."pekerjaanIbu", d."penghasilanIbu", d."namaWali", d."hubunganWali", d."noHpOrtu", CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "namaAyah", "nikAyah", "pekerjaanAyah", "penghasilanAyah", "namaIbu", "nikIbu", "pekerjaanIbu", "penghasilanIbu", "namaWali", "hubunganWali", "noHpOrtu"
    FROM "Santri"
    WHERE "namaAyah" IS NOT NULL OR "namaIbu" IS NOT NULL OR "namaWali" IS NOT NULL OR "noHpOrtu" IS NOT NULL
) d;

-- Tautkan Santri ke Wali hasil backfill
UPDATE "Santri" s SET "waliId" = w."id"
FROM "Wali" w
WHERE s."namaAyah" IS NOT DISTINCT FROM w."namaAyah"
  AND s."nikAyah" IS NOT DISTINCT FROM w."nikAyah"
  AND s."namaIbu" IS NOT DISTINCT FROM w."namaIbu"
  AND s."nikIbu" IS NOT DISTINCT FROM w."nikIbu"
  AND s."namaWali" IS NOT DISTINCT FROM w."namaWali"
  AND s."noHpOrtu" IS NOT DISTINCT FROM w."noHpOrtu";

-- AlterTable BiayaMaster (perubahan skema yang sudah ada di working tree)
ALTER TABLE "BiayaMaster" ADD COLUMN     "targetStatusSantri" TEXT;

-- CreateTable RiwayatPenempatan
CREATE TABLE "RiwayatPenempatan" (
    "id" TEXT NOT NULL,
    "santriId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "unitPesantrenId" TEXT,
    "asramaId" TEXT,
    "kamarId" TEXT,
    "unitSekolahId" TEXT,
    "jurusanId" TEXT,
    "kelasSekolahId" TEXT,
    "marhalahMadinId" TEXT,
    "kelasMadinId" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatPenempatan_pkey" PRIMARY KEY ("id")
);

-- Backfill RiwayatPenempatan dari penempatan Santri saat ini
INSERT INTO "RiwayatPenempatan" ("id", "santriId", "tahunAjaranId", "unitPesantrenId", "asramaId", "kamarId", "unitSekolahId", "jurusanId", "kelasSekolahId", "marhalahMadinId", "kelasMadinId")
SELECT replace(gen_random_uuid()::text, '-', ''), "id", "tahunAjaranId", "unitPesantrenId", "asramaId", "kamarId", "unitSekolahId", "jurusanId", "kelasSekolahId", "marhalahMadinId", "kelasMadinId"
FROM "Santri"
ON CONFLICT ("santriId", "tahunAjaranId") DO NOTHING;

-- Drop kolom ortu lama di Santri (data sudah aman di Wali)
ALTER TABLE "Santri" DROP COLUMN "hubunganWali",
DROP COLUMN "namaAyah",
DROP COLUMN "namaIbu",
DROP COLUMN "namaWali",
DROP COLUMN "nikAyah",
DROP COLUMN "nikIbu",
DROP COLUMN "noHpOrtu",
DROP COLUMN "pekerjaanAyah",
DROP COLUMN "pekerjaanIbu",
DROP COLUMN "penghasilanAyah",
DROP COLUMN "penghasilanIbu";

-- CreateIndex
CREATE UNIQUE INDEX "RiwayatPenempatan_santriId_tahunAjaranId_key" ON "RiwayatPenempatan"("santriId", "tahunAjaranId");

-- CreateIndex
CREATE INDEX "RiwayatPenempatan_santriId_idx" ON "RiwayatPenempatan"("santriId");

-- CreateIndex
CREATE INDEX "Santri_waliId_idx" ON "Santri"("waliId");

-- CreateIndex
CREATE INDEX "Santri_tahunAjaranId_idx" ON "Santri"("tahunAjaranId");

-- CreateIndex
CREATE INDEX "Santri_status_idx" ON "Santri"("status");

-- CreateIndex
CREATE INDEX "SetoranTahfidz_santriId_idx" ON "SetoranTahfidz"("santriId");

-- CreateIndex
CREATE INDEX "SetoranNadhoman_santriId_idx" ON "SetoranNadhoman"("santriId");

-- CreateIndex
CREATE INDEX "KesehatanUks_santriId_idx" ON "KesehatanUks"("santriId");

-- CreateIndex
CREATE INDEX "Perizinan_santriId_idx" ON "Perizinan"("santriId");

-- CreateIndex
CREATE INDEX "LogKonseling_santriId_idx" ON "LogKonseling"("santriId");

-- CreateIndex
CREATE INDEX "KunjunganSantri_santriId_idx" ON "KunjunganSantri"("santriId");

-- CreateIndex
CREATE INDEX "Presensi_santriId_idx" ON "Presensi"("santriId");

-- CreateIndex
CREATE INDEX "TagihanKeuangan_santriId_idx" ON "TagihanKeuangan"("santriId");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_santriId_idx" ON "TransaksiPembayaran"("santriId");

-- AddForeignKey
ALTER TABLE "Santri" ADD CONSTRAINT "Santri_waliId_fkey" FOREIGN KEY ("waliId") REFERENCES "Wali"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_unitPesantrenId_fkey" FOREIGN KEY ("unitPesantrenId") REFERENCES "UnitPesantren"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_asramaId_fkey" FOREIGN KEY ("asramaId") REFERENCES "Asrama"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_kamarId_fkey" FOREIGN KEY ("kamarId") REFERENCES "Kamar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_unitSekolahId_fkey" FOREIGN KEY ("unitSekolahId") REFERENCES "UnitSekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "JurusanSekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_kelasSekolahId_fkey" FOREIGN KEY ("kelasSekolahId") REFERENCES "KelasSekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_marhalahMadinId_fkey" FOREIGN KEY ("marhalahMadinId") REFERENCES "MarhalahMadin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPenempatan" ADD CONSTRAINT "RiwayatPenempatan_kelasMadinId_fkey" FOREIGN KEY ("kelasMadinId") REFERENCES "KelasMadin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
