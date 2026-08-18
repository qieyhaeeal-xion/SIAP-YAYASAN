import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireAkademik } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// ─── PESERTA TAHFIDZ ──────────────────────────────────
router.get('/peserta', async (req: AuthRequest, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  const data = await prisma.pesertaTahfidz.findMany({ where, orderBy: { tanggalDaftar: 'desc' } });
  res.json({ success: true, data });
});

router.post('/peserta', requireAkademik, async (req: AuthRequest, res: Response): Promise<void> => {
  const { santriId, tahunAjaranId, status } = req.body;
  // Cek duplikat
  const existing = await prisma.pesertaTahfidz.findUnique({ where: { santriId_tahunAjaranId: { santriId, tahunAjaranId } } });
  if (existing) { res.status(409).json({ success: false, message: 'Santri sudah terdaftar sebagai peserta tahfidz di tahun ajaran ini' }); return; }
  const data = await prisma.pesertaTahfidz.create({ data: { santriId, tahunAjaranId, status: status || 'Aktif', tanggalDaftar: new Date().toISOString().split('T')[0] } });
  res.status(201).json({ success: true, data });
});

router.patch('/peserta/:id/status', requireAkademik, async (req: AuthRequest, res: Response) => {
  const data = await prisma.pesertaTahfidz.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ success: true, data });
});

// ─── SETORAN TAHFIDZ ──────────────────────────────────
router.get('/setoran', async (req: AuthRequest, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  if (req.query.juz) where.juz = parseInt(req.query.juz as string);
  const data = await prisma.setoranTahfidz.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

router.post('/setoran', requireAkademik, async (req: AuthRequest, res: Response) => {
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = await prisma.setoranTahfidz.create({
    data: { ...req.body, tahunAjaranId: req.body.tahunAjaranId || tahunAjaran?.id }
  });
  res.status(201).json({ success: true, data });
});

// ─── SETORAN NADHOMAN ─────────────────────────────────
router.get('/nadhoman', async (req: AuthRequest, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.namaKitab) where.namaKitab = req.query.namaKitab;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  const data = await prisma.setoranNadhoman.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

router.post('/nadhoman', requireAkademik, async (req: AuthRequest, res: Response) => {
  const { santriId, namaKitab, jumlahBaitBaru, ...rest } = req.body;
  // Kalkulasi akumulasi bait
  const existingSetoran = await prisma.setoranNadhoman.findMany({ where: { santriId, namaKitab }, orderBy: { totalHafalanSelesai: 'desc' } });
  const prevTotal = existingSetoran.length > 0 ? existingSetoran[0].totalHafalanSelesai : 0;
  const totalHafalanSelesai = prevTotal + Number(jumlahBaitBaru);
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = await prisma.setoranNadhoman.create({
    data: { santriId, namaKitab, jumlahBaitBaru: Number(jumlahBaitBaru), totalHafalanSelesai, ...rest, tahunAjaranId: rest.tahunAjaranId || tahunAjaran?.id }
  });
  res.status(201).json({ success: true, data });
});

export { router as tahfidzRouter };
