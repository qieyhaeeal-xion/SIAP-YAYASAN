import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// ─── TAHUN AJARAN ─────────────────────────────────────
router.get('/tahun-ajaran', async (_req, res: Response) => {
  const data = await prisma.tahunAjaran.findMany({ orderBy: { kodeTahunAjaran: 'desc' } });
  res.json({ success: true, data });
});
router.get('/tahun-ajaran/aktif', async (_req, res: Response) => {
  const data = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  res.json({ success: true, data });
});
router.post('/tahun-ajaran', requireRole('admin_sistem'), async (req, res: Response) => {
  const { isAktif } = req.body;
  if (isAktif) await prisma.tahunAjaran.updateMany({ data: { isAktif: false } });
  const data = await prisma.tahunAjaran.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/tahun-ajaran/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  const { isAktif } = req.body;
  if (isAktif) await prisma.tahunAjaran.updateMany({ data: { isAktif: false } });
  const { id, createdAt, ...rest } = req.body;
  const data = await prisma.tahunAjaran.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});

// ─── UNIT PESANTREN ───────────────────────────────────
router.get('/unit-pesantren', async (_req, res: Response) => {
  const data = await prisma.unitPesantren.findMany({ include: { asrama: { include: { kamar: true } } } });
  res.json({ success: true, data });
});
router.post('/unit-pesantren', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const data = await prisma.unitPesantren.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/unit-pesantren/:id', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const { id, asrama, santri, pendaftar, ...rest } = req.body;
  const data = await prisma.unitPesantren.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/unit-pesantren/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.unitPesantren.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Unit pesantren dihapus' });
});

// ─── ASRAMA ───────────────────────────────────────────
router.get('/asrama', async (req, res: Response) => {
  const where = req.query.unitPesantrenId ? { unitPesantrenId: req.query.unitPesantrenId as string } : {};
  const data = await prisma.asrama.findMany({ where, include: { kamar: true } });
  res.json({ success: true, data });
});
router.post('/asrama', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const data = await prisma.asrama.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/asrama/:id', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const { id, kamar, unitPesantren, santri, ...rest } = req.body;
  const data = await prisma.asrama.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/asrama/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.asrama.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Asrama dihapus' });
});

// ─── KAMAR ────────────────────────────────────────────
router.get('/kamar', async (req, res: Response) => {
  const where = req.query.asramaId ? { asramaId: req.query.asramaId as string } : {};
  const data = await prisma.kamar.findMany({ where });
  res.json({ success: true, data });
});
router.post('/kamar', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const data = await prisma.kamar.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/kamar/:id', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const { id, asrama, santri, ...rest } = req.body;
  const data = await prisma.kamar.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/kamar/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.kamar.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kamar dihapus' });
});

// ─── MARHALAH MADIN ───────────────────────────────────
router.get('/marhalah', async (_req, res: Response) => {
  const data = await prisma.marhalahMadin.findMany({ include: { kelasMadin: true, kitab: true }, orderBy: { tingkat: 'asc' } });
  res.json({ success: true, data });
});
router.post('/marhalah', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const data = await prisma.marhalahMadin.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/marhalah/:id', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const { id, kelasMadin, kitab, santri, pendaftar, ...rest } = req.body;
  const data = await prisma.marhalahMadin.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/marhalah/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.marhalahMadin.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Marhalah dihapus' });
});

// ─── KELAS MADIN ──────────────────────────────────────
router.get('/kelas-madin', async (req, res: Response) => {
  const where = req.query.marhalahId ? { marhalahId: req.query.marhalahId as string } : {};
  const data = await prisma.kelasMadin.findMany({ where });
  res.json({ success: true, data });
});
router.post('/kelas-madin', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const data = await prisma.kelasMadin.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/kelas-madin/:id', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const { id, marhalah, santri, presensi, ...rest } = req.body;
  const data = await prisma.kelasMadin.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/kelas-madin/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.kelasMadin.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kelas madin dihapus' });
});

// ─── KITAB HAFALAN ────────────────────────────────────
router.get('/kitab', async (req, res: Response) => {
  const where = req.query.marhalahId ? { marhalahId: req.query.marhalahId as string } : {};
  const data = await prisma.kitabHafalan.findMany({ where });
  res.json({ success: true, data });
});
router.post('/kitab', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const data = await prisma.kitabHafalan.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/kitab/:id', requireRole('admin_sistem', 'admin_madin'), async (req, res: Response) => {
  const { id, marhalah, ...rest } = req.body;
  const data = await prisma.kitabHafalan.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/kitab/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.kitabHafalan.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kitab dihapus' });
});

// ─── UNIT SEKOLAH ─────────────────────────────────────
router.get('/unit-sekolah', async (_req, res: Response) => {
  const data = await prisma.unitSekolah.findMany({ include: { jurusan: true, kelas: true } });
  res.json({ success: true, data });
});
router.post('/unit-sekolah', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const data = await prisma.unitSekolah.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/unit-sekolah/:id', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const { id, jurusan, kelas, santri, pendaftar, ...rest } = req.body;
  const data = await prisma.unitSekolah.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/unit-sekolah/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.unitSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Unit sekolah dihapus' });
});

// ─── JURUSAN ──────────────────────────────────────────
router.get('/jurusan', async (req, res: Response) => {
  const where = req.query.sekolahId ? { sekolahId: req.query.sekolahId as string } : {};
  const data = await prisma.jurusanSekolah.findMany({ where });
  res.json({ success: true, data });
});
router.post('/jurusan', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const data = await prisma.jurusanSekolah.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/jurusan/:id', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const { id, sekolah, kelas, santri, ...rest } = req.body;
  const data = await prisma.jurusanSekolah.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/jurusan/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.jurusanSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Jurusan dihapus' });
});

// ─── KELAS SEKOLAH ────────────────────────────────────
router.get('/kelas-sekolah', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.sekolahId) where.sekolahId = req.query.sekolahId;
  if (req.query.jurusanId) where.jurusanId = req.query.jurusanId;
  const data = await prisma.kelasSekolah.findMany({ where });
  res.json({ success: true, data });
});
router.post('/kelas-sekolah', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const data = await prisma.kelasSekolah.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/kelas-sekolah/:id', requireRole('admin_sistem', 'admin_sekolah'), async (req, res: Response) => {
  const { id, sekolah, jurusan, santri, presensi, ...rest } = req.body;
  const data = await prisma.kelasSekolah.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});
router.delete('/kelas-sekolah/:id', requireRole('admin_sistem'), async (req, res: Response) => {
  await prisma.kelasSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kelas sekolah dihapus' });
});

export { router as kesantrianRouter };
