import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, HttpError } from '../middleware/validate';
import { withUniqueNip } from '../utils/generators';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

const requireKepegawaian = requireRole('admin_sistem', 'bendahara');

const PEGAWAI_WRITABLE = [
  'nama', 'jenisKelamin', 'jabatanId', 'satminkal',
  'statusPegawai', 'noHp', 'email', 'tanggalMasuk'
];

// ─── JABATAN ──────────────────────────────────────────
router.get('/jabatan', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.jabatan.findMany({ include: { _count: { select: { pegawai: true } } }, orderBy: { namaJabatan: 'asc' } });
  res.json({ success: true, data });
}));

router.post('/jabatan', requireKepegawaian, asyncHandler(async (req, res: Response) => {
  requireFields(req.body, ['namaJabatan']);
  const data = pick<Record<string, unknown>>(req.body, ['namaJabatan', 'tunjangan']);
  const jabatan = await prisma.jabatan.create({ data: data as never });
  res.status(201).json({ success: true, data: jabatan });
}));

router.put('/jabatan/:id', requireKepegawaian, asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, ['namaJabatan', 'tunjangan']);
  const jabatan = await prisma.jabatan.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: jabatan });
}));

router.delete('/jabatan/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const inUse = await prisma.pegawai.count({ where: { jabatanId: req.params.id } });
  if (inUse > 0) throw new HttpError(400, `Jabatan masih dipakai ${inUse} pegawai. Pindahkan pegawai terlebih dahulu.`);
  await prisma.jabatan.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Jabatan berhasil dihapus' });
}));

// ─── PEGAWAI ──────────────────────────────────────────
router.get('/pegawai', asyncHandler(async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.statusPegawai) where.statusPegawai = req.query.statusPegawai;
  if (req.query.jabatanId) where.jabatanId = req.query.jabatanId;
  if (req.query.search) {
    where.OR = [
      { nama: { contains: req.query.search as string, mode: 'insensitive' } },
      { nip: { contains: req.query.search as string } }
    ];
  }
  const data = await prisma.pegawai.findMany({ where, include: { jabatan: true }, orderBy: { nama: 'asc' } });
  res.json({ success: true, data });
}));

router.get('/pegawai/:id', asyncHandler(async (req, res: Response) => {
  const data = await prisma.pegawai.findUnique({ where: { id: req.params.id }, include: { jabatan: true } });
  if (!data) throw new HttpError(404, 'Pegawai tidak ditemukan');
  res.json({ success: true, data });
}));

// POST /api/kepegawaian/pegawai - NIP otomatis PGW-YYYY-XXX (race-safe)
router.post('/pegawai', requireKepegawaian, asyncHandler(async (req, res: Response) => {
  requireFields(req.body, ['nama', 'jenisKelamin', 'jabatanId', 'tanggalMasuk']);
  const data = pick<Record<string, unknown>>(req.body, PEGAWAI_WRITABLE);

  const jabatan = await prisma.jabatan.findUnique({ where: { id: req.body.jabatanId }, select: { id: true } });
  if (!jabatan) throw new HttpError(400, 'Jabatan tidak ditemukan');

  const pegawai = await withUniqueNip(prisma, (nip) =>
    prisma.pegawai.create({ data: { ...data, nip } as never, include: { jabatan: true } })
  );
  res.status(201).json({ success: true, message: `Pegawai berhasil ditambahkan dengan NIP: ${(pegawai as { nip: string }).nip}`, data: pegawai });
}));

router.put('/pegawai/:id', requireKepegawaian, asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, PEGAWAI_WRITABLE);
  const pegawai = await prisma.pegawai.update({ where: { id: req.params.id }, data: data as never, include: { jabatan: true } });
  res.json({ success: true, data: pegawai });
}));

export { router as kepegawaianRouter };
