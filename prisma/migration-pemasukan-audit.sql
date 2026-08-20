-- SIAP - Migrasi Pemasukan: Monitoring, Status & Audit Trail (Tahap 2)
-- Sifat: incremental & backward-compatible (hanya menambah kolom/tabel).
-- Apply setelah DATABASE_URL tersedia, SESUDAH migration-pemasukan-distribusi.sql:
--   npx prisma db execute --file prisma/migration-pemasukan-audit.sql --schema prisma/schema.prisma

-- 1) Versi konfigurasi (V-001, V-002, ...)
ALTER TABLE "DistribusiKeuanganConfig" ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'V-001';

-- 2) Kolom monitoring/status pada Pemasukan
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "unitId" TEXT;
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "configVersion" TEXT NOT NULL DEFAULT 'V-001';
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PAID';
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "distributedAt" TIMESTAMP(3);
ALTER TABLE "Pemasukan" ADD COLUMN IF NOT EXISTS "distribusiError" TEXT;

-- 3) Backfill status: semua transaksi yang punya 5 alokasi penuh = DISTRIBUTED
UPDATE "Pemasukan" SET "status" = 'DISTRIBUTED', "distributedAt" = "createdAt"
WHERE EXISTS (
  SELECT 1 FROM "AlokasiPemasukan" a WHERE a."pemasukanId" = "Pemasukan"."id"
);

-- 4) Audit trail
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL DEFAULT 'Pemasukan',
  "entityId" TEXT NOT NULL,
  "entityLabel" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorName" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- 5) Index lookup monitoring
CREATE INDEX IF NOT EXISTS "Pemasukan_status_idx" ON "Pemasukan"("status");
CREATE INDEX IF NOT EXISTS "Pemasukan_unitId_idx" ON "Pemasukan"("unitId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");