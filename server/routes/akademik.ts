import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireAkademik } from '../middleware/rbac';
import { apiLimiter } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, HttpError } from '../middleware/validate';

const router = Router();
const prisma = new PrismaClient();
router.use(apiLimiter);
router.use(verifyToken);

const VALID_STATUS = ['Hadir', 'Izin', 'Sakit', 'Alpha'];
const VALID_TIPE = ['Formal', 'Madin'];

function assertTipe(tipe: unknown): string {
  if (typeof tipe !== 'string' || !VALID_TIPE.includes(tipe)) {
    throw new HttpError(400, `Tipe presensi tidak valid. Pilihan: ${VALID_TIPE.join(', ')}`);
  }
  return tipe;
}

function assertStatus(status: unknown): string {
  if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    throw new HttpError(400, `Status kehadiran tidak valid. Pilihan: ${VALID_STATUS.join(', ')}`);
  }
  return status;
}

function buildWhere(query: Record<string, unknown>, santriIdOverride?: string): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (santriIdOverride) {
    where.santriId = santriIdOverride;
  } else if (query.santriId) {
    where.santriId = query.santriId;
  }
  if (query.tanggal) where.tanggal = query.tanggal;
  if (query.tipe) where.tipe = query.tipe;
  if (query.kelasSekolahId) where.kelasSekolahId = query.kelasSekolahId;
  if (query.kelasMadinId) where.kelasMadinId = query.kelasMadinId;
  if (query.tahunAjaranId) where.tahunAjaranId = query.tahunAjaranId;
  return where;
}

// Wali santri hanya melihat presensi anaknya sendiri
async function getWaliScopeSantriId(req: AuthRequest): Promise<string | null> {
  if (req.user?.role !== 'wali_santri') return null;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user?.santriIdAssociated) {
    throw new HttpError(403, 'Akun wali santri belum terhubung ke data santri');
  }
  return user.santriIdAssociated;
}

// GET /api/akademik/presensi - Daftar presensi dengan filter
router.get('/presensi', asyncHandler(async (req: AuthRequest, res: Response) => {
  const waliScope = await getWaliScopeSantriId(req);
  const where = buildWhere(req.query as Record<string, unknown>, waliScope ?? undefined);

  const data = await prisma.presensi.findMany({
    where,
    include: {
      santri: { select: { id: true, nis: true, namaLengkap: true } }
    },
    orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }]
  });
  res.json({ success: true, data });
}));

// GET /api/akademik/presensi/rekap - Rekap jumlah per status
router.get('/presensi/rekap', asyncHandler(async (req: AuthRequest, res: Response) => {
  const waliScope = await getWaliScopeSantriId(req);
  const where = buildWhere(req.query as Record<string, unknown>, waliScope ?? undefined);

  const grouped = await prisma.presensi.groupBy({
    by: ['status'],
    where,
    _count: { _all: true }
  });
  const rekap: Record<string, number> = { Hadir: 0, Izin: 0, Sakit: 0, Alpha: 0 };
  for (const g of grouped) rekap[g.status] = g._count._all;

  res.json({ success: true, data: { rekap, total: grouped.reduce((a, g) => a + g._count._all, 0) } });
}));

// POST /api/akademik/presensi - Upsert satu record presensi
router.post('/presensi', requireAkademik, asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['santriId', 'tanggal', 'tipe', 'status']);
  const tipe = assertTipe(req.body.tipe);
  const status = assertStatus(req.body.status);

  const santri = await prisma.santri.findUnique({ where: { id: req.body.santriId }, select: { id: true } });
  if (!santri) throw new HttpError(400, 'Santri tidak ditemukan');

  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = pick<Record<string, unknown>>(req.body, ['santriId', 'tanggal', 'kelasSekolahId', 'kelasMadinId', 'keterangan']);
  data.tipe = tipe;
  data.status = status;
  data.tahunAjaranId = req.body.tahunAjaranId || tahunAjaran?.id;
  if (!data.tahunAjaranId) throw new HttpError(400, 'Tahun ajaran aktif tidak ditemukan');

  const existing = await prisma.presensi.findFirst({
    where: { santriId: data.santriId as string, tanggal: data.tanggal as string, tipe }
  });

  const record = existing
    ? await prisma.presensi.update({ where: { id: existing.id }, data: data as never })
    : await prisma.presensi.create({ data: data as never });

  res.status(existing ? 200 : 201).json({ success: true, data: record });
}));

// POST /api/akademik/presensi/batch - Batch entry presensi per kelas & tanggal
router.post('/presensi/batch', requireAkademik, asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['tanggal', 'tipe', 'entries']);
  const tipe = assertTipe(req.body.tipe);
  const { tanggal, entries } = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new HttpError(400, 'entries harus array berisi minimal 1 item');
  }
  for (const e of entries) {
    requireFields(e, ['santriId', 'status']);
    assertStatus(e.status);
  }
  if (!req.body.kelasSekolahId && !req.body.kelasMadinId) {
    throw new HttpError(400, 'kelasSekolahId atau kelasMadinId wajib diisi');
  }

  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  if (!tahunAjaran) throw new HttpError(400, 'Tahun ajaran aktif tidak ditemukan');

  const kelasWhere: Record<string, unknown> = { tanggal, tipe };
  if (req.body.kelasSekolahId) kelasWhere.kelasSekolahId = req.body.kelasSekolahId;
  if (req.body.kelasMadinId) kelasWhere.kelasMadinId = req.body.kelasMadinId;

  const result = await prisma.$transaction(async (tx) => {
    // Hapus presensi lama kelas tersebut pada tanggal & tipe itu, lalu ganti batch baru
    const deleted = await tx.presensi.deleteMany({ where: kelasWhere });
    const created = await tx.presensi.createMany({
      data: entries.map((e: { santriId: string; status: string; keterangan?: string }) => ({
        santriId: e.santriId,
        tanggal,
        tipe,
        status: e.status,
        keterangan: e.keterangan ?? null,
        kelasSekolahId: req.body.kelasSekolahId ?? null,
        kelasMadinId: req.body.kelasMadinId ?? null,
        tahunAjaranId: req.body.tahunAjaranId || tahunAjaran.id
      }))
    });
    return { deleted: deleted.count, created: created.count };
  });

  res.status(201).json({
    success: true,
    message: `Batch presensi tersimpan (${result.created} entri, ${result.deleted} entri lama diganti)`,
    data: result
  });
}));

export { router as akademikRouter };
