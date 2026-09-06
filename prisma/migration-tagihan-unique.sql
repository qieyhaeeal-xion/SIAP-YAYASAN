-- Prevent duplicate tanggungan for the same santri, payment type, academic year,
-- and billing period. Check existing duplicates before applying in production.
CREATE UNIQUE INDEX IF NOT EXISTS "TagihanKeuangan_santriId_biayaMasterId_tahunAjaranId_bulanTahun_key"
  ON "TagihanKeuangan" ("santriId", "biayaMasterId", "tahunAjaranId", "bulanTahun");
