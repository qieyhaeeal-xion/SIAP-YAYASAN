import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, HttpError } from '../middleware/validate';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// Whitelist field per model — menutup celah mass-assignment
const FIELDS = {
  tahunAjaran: ['kodeTahunAjaran', 'tanggalMulai', 'tanggalSelesai', 'isAktif'],
  unitPesantren: ['kodeUnit', 'namaUnit', 'deskripsi'],
  asrama: ['unitPesantrenId', 'kodeAsrama', 'namaAsrama', 'pembina', 'kapasitas'],
  kamar: ['asramaId', 'kodeKamar', 'namaKamar', 'kapasitas', 'terisi'],
  marhalah: ['kodeMarhalah', 'namaMarhalah', 'tingkat'],
  kelasMadin: ['marhalahId', 'namaKelas', 'waliKelas'],
  kitab: ['marhalahId', 'namaKitab', 'totalBait', 'pengampu'],
  unitSekolah: ['kodeSekolah', 'namaSekolah', 'kepalaSekolah'],
  jurusan: ['sekolahId', 'kodeJurusan', 'namaJurusan'],
  kelasSekolah: ['sekolahId', 'jurusanId', 'kodeKelas', 'namaKelas', 'waliKelas']
} as const;

const REQUIRED_ON_CREATE = {
  tahunAjaran: ['kodeTahunAjaran', 'tanggalMulai', 'tanggalSelesai'],
  unitPesantren: ['kodeUnit', 'namaUnit'],
  asrama: ['unitPesantrenId', 'kodeAsrama', 'namaAsrama'],
  kamar: ['asramaId', 'kodeKamar', 'namaKamar'],
  marhalah: ['kodeMarhalah', 'namaMarhalah', 'tingkat'],
  kelasMadin: ['marhalahId', 'namaKelas'],
  kitab: ['marhalahId', 'namaKitab', 'totalBait'],
  unitSekolah: ['kodeSekolah', 'namaSekolah'],
  jurusan: ['sekolahId', 'kodeJurusan', 'namaJurusan'],
  kelasSekolah: ['sekolahId', 'kodeKelas', 'namaKelas']
} as const;

// ─── TAHUN AJARAN ─────────────────────────────────────
router.get('/tahun-ajaran', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.tahunAjaran.findMany({ orderBy: { kodeTahunAjaran: 'desc' } });
  res.json({ success: true, data });
}));

router.get('/tahun-ajaran/aktif', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  res.json({ success: true, data });
}));

router.post('/tahun-ajaran', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.tahunAjaran]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.tahunAjaran]);
  if (data.isAktif === true) await prisma.tahunAjaran.updateMany({ data: { isAktif: false } });
  const result = await prisma.tahunAjaran.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/tahun-ajaran/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.tahunAjaran]);
  if (data.isAktif === true) await prisma.tahunAjaran.updateMany({ data: { isAktif: false } });
  const result = await prisma.tahunAjaran.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

// ─── UNIT PESANTREN ───────────────────────────────────
router.get('/unit-pesantren', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.unitPesantren.findMany({ include: { asrama: { include: { kamar: true } } } });
  res.json({ success: true, data });
}));

router.post('/unit-pesantren', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.unitPesantren]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.unitPesantren]);
  const result = await prisma.unitPesantren.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/unit-pesantren/:id', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.unitPesantren]);
  const result = await prisma.unitPesantren.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/unit-pesantren/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { unitPesantrenId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Unit pesantren masih memiliki ${santriCount} santri terdaftar`);
  await prisma.unitPesantren.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Unit pesantren dihapus' });
}));

// ─── ASRAMA ───────────────────────────────────────────
router.get('/asrama', asyncHandler(async (req, res: Response) => {
  const where = req.query.unitPesantrenId ? { unitPesantrenId: req.query.unitPesantrenId as string } : {};
  const data = await prisma.asrama.findMany({ where, include: { kamar: true } });
  res.json({ success: true, data });
}));

router.post('/asrama', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.asrama]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.asrama]);
  const result = await prisma.asrama.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/asrama/:id', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.asrama]);
  const result = await prisma.asrama.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/asrama/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { asramaId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Asrama masih dihuni ${santriCount} santri`);
  await prisma.asrama.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Asrama dihapus' });
}));

// ─── KAMAR ────────────────────────────────────────────
router.get('/kamar', asyncHandler(async (req, res: Response) => {
  const where = req.query.asramaId ? { asramaId: req.query.asramaId as string } : {};
  const data = await prisma.kamar.findMany({ where });
  res.json({ success: true, data });
}));

router.post('/kamar', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.kamar]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kamar]);
  const result = await prisma.kamar.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/kamar/:id', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kamar]);
  const result = await prisma.kamar.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/kamar/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { kamarId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Kamar masih dihuni ${santriCount} santri`);
  await prisma.kamar.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kamar dihapus' });
}));

// ─── MARHALAH MADIN ───────────────────────────────────
router.get('/marhalah', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.marhalahMadin.findMany({ include: { kelasMadin: true, kitab: true }, orderBy: { tingkat: 'asc' } });
  res.json({ success: true, data });
}));

router.post('/marhalah', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.marhalah]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.marhalah]);
  const result = await prisma.marhalahMadin.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/marhalah/:id', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.marhalah]);
  const result = await prisma.marhalahMadin.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/marhalah/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { marhalahMadinId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Marhalah masih memiliki ${santriCount} santri aktif`);
  await prisma.marhalahMadin.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Marhalah dihapus' });
}));

// ─── KELAS MADIN ──────────────────────────────────────
router.get('/kelas-madin', asyncHandler(async (req, res: Response) => {
  const where = req.query.marhalahId ? { marhalahId: req.query.marhalahId as string } : {};
  const data = await prisma.kelasMadin.findMany({ where });
  res.json({ success: true, data });
}));

router.post('/kelas-madin', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.kelasMadin]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kelasMadin]);
  const result = await prisma.kelasMadin.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/kelas-madin/:id', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kelasMadin]);
  const result = await prisma.kelasMadin.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/kelas-madin/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { kelasMadinId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Kelas madin masih memiliki ${santriCount} santri`);
  await prisma.kelasMadin.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kelas madin dihapus' });
}));

// ─── KITAB HAFALAN ────────────────────────────────────
router.get('/kitab', asyncHandler(async (req, res: Response) => {
  const where = req.query.marhalahId ? { marhalahId: req.query.marhalahId as string } : {};
  const data = await prisma.kitabHafalan.findMany({ where });
  res.json({ success: true, data });
}));

router.post('/kitab', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.kitab]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kitab]);
  const result = await prisma.kitabHafalan.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/kitab/:id', requireRole('admin_sistem', 'admin_madin'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kitab]);
  const result = await prisma.kitabHafalan.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/kitab/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  await prisma.kitabHafalan.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kitab dihapus' });
}));

// ─── UNIT SEKOLAH ─────────────────────────────────────
router.get('/unit-sekolah', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.unitSekolah.findMany({ include: { jurusan: true, kelas: true } });
  res.json({ success: true, data });
}));

router.post('/unit-sekolah', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.unitSekolah]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.unitSekolah]);
  const result = await prisma.unitSekolah.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/unit-sekolah/:id', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.unitSekolah]);
  const result = await prisma.unitSekolah.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/unit-sekolah/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { unitSekolahId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Unit sekolah masih memiliki ${santriCount} santri terdaftar`);
  await prisma.unitSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Unit sekolah dihapus' });
}));

// ─── JURUSAN ──────────────────────────────────────────
router.get('/jurusan', asyncHandler(async (req, res: Response) => {
  const where = req.query.sekolahId ? { sekolahId: req.query.sekolahId as string } : {};
  const data = await prisma.jurusanSekolah.findMany({ where });
  res.json({ success: true, data });
}));

router.post('/jurusan', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.jurusan]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.jurusan]);
  const result = await prisma.jurusanSekolah.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/jurusan/:id', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.jurusan]);
  const result = await prisma.jurusanSekolah.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/jurusan/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { jurusanId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Jurusan masih memiliki ${santriCount} santri terdaftar`);
  await prisma.jurusanSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Jurusan dihapus' });
}));

// ─── KELAS SEKOLAH ────────────────────────────────────
router.get('/kelas-sekolah', asyncHandler(async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.sekolahId) where.sekolahId = req.query.sekolahId;
  if (req.query.jurusanId) where.jurusanId = req.query.jurusanId;
  const data = await prisma.kelasSekolah.findMany({ where });
  res.json({ success: true, data });
}));

router.post('/kelas-sekolah', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  requireFields(req.body, [...REQUIRED_ON_CREATE.kelasSekolah]);
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kelasSekolah]);
  const result = await prisma.kelasSekolah.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/kelas-sekolah/:id', requireRole('admin_sistem', 'admin_sekolah'), asyncHandler(async (req, res: Response) => {
  const data = pick<Record<string, unknown>>(req.body, [...FIELDS.kelasSekolah]);
  const result = await prisma.kelasSekolah.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/kelas-sekolah/:id', requireRole('admin_sistem'), asyncHandler(async (req, res: Response) => {
  const santriCount = await prisma.santri.count({ where: { kelasSekolahId: req.params.id } });
  if (santriCount > 0) throw new HttpError(400, `Kelas sekolah masih memiliki ${santriCount} santri`);
  await prisma.kelasSekolah.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Kelas sekolah dihapus' });
}));

export { router as kesantrianRouter };
