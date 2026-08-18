import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireKeuangan } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// ─── BIAYA MASTER ─────────────────────────────────────
router.get('/biaya-master', async (_req, res: Response) => {
  const data = await prisma.biayaMaster.findMany();
  res.json({ success: true, data });
});
router.post('/biaya-master', requireKeuangan, async (req, res: Response) => {
  const data = await prisma.biayaMaster.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.put('/biaya-master/:id', requireKeuangan, async (req, res: Response) => {
  const { id, tagihan, ...rest } = req.body;
  const data = await prisma.biayaMaster.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});

// ─── TAGIHAN KEUANGAN ─────────────────────────────────
router.get('/tagihan', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.status) where.status = req.query.status;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  if (req.query.bulanTahun) where.bulanTahun = req.query.bulanTahun;
  const data = await prisma.tagihanKeuangan.findMany({ where, include: { biayaMaster: true }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

router.post('/tagihan', requireKeuangan, async (req, res: Response) => {
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = await prisma.tagihanKeuangan.create({ data: { ...req.body, tahunAjaranId: req.body.tahunAjaranId || tahunAjaran?.id } });
  res.status(201).json({ success: true, data });
});

// ─── TRANSAKSI PEMBAYARAN ─────────────────────────────
router.get('/transaksi', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.tagihanId) where.tagihanId = req.query.tagihanId;
  const data = await prisma.transaksiPembayaran.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

// POST /api/keuangan/bayar/:tagihanId - Proses pembayaran tagihan
router.post('/bayar/:tagihanId', requireKeuangan, async (req: AuthRequest, res: Response): Promise<void> => {
  const { nominal, metodePembayaran, catatan } = req.body;
  const tagihanId = req.params.tagihanId;

  const tagihan = await prisma.tagihanKeuangan.findUnique({ where: { id: tagihanId } });
  if (!tagihan) { res.status(404).json({ success: false, message: 'Tagihan tidak ditemukan' }); return; }

  // Generate nomor kuitansi
  const nowStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.floor(100 + Math.random() * 900);
  const noKuitansi = `KW-${nowStr}-${rand}`;

  // Hitung status pembayaran
  const newTerbayar = tagihan.nominalTerbayar + Number(nominal);
  const status = newTerbayar >= tagihan.nominalTagihan ? 'Lunas' : newTerbayar > 0 ? 'Sebagian' : 'Belum Lunas';

  // Buat transaksi & update tagihan secara atomic
  const [transaksi] = await prisma.$transaction([
    prisma.transaksiPembayaran.create({
      data: { tagihanId, santriId: tagihan.santriId, noKuitansi, tanggal: new Date().toISOString().split('T')[0], nominal: Number(nominal), metodePembayaran, penerima: req.user?.nama || 'Admin', catatan }
    }),
    prisma.tagihanKeuangan.update({ where: { id: tagihanId }, data: { nominalTerbayar: newTerbayar, status } })
  ]);

  res.status(201).json({ success: true, message: `Pembayaran berhasil. No. Kuitansi: ${noKuitansi}`, data: { transaksi, noKuitansi, statusTagihan: status } });
});

// ─── KEPEGAWAIAN ──────────────────────────────────────
router.get('/jabatan', verifyToken, async (_req, res: Response) => {
  const data = await prisma.jabatan.findMany();
  res.json({ success: true, data });
});
router.post('/jabatan', requireKeuangan, async (req, res: Response) => {
  const data = await prisma.jabatan.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.get('/pegawai', verifyToken, async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.statusPegawai) where.statusPegawai = req.query.statusPegawai;
  const data = await prisma.pegawai.findMany({ where, include: { jabatan: true }, orderBy: { nama: 'asc' } });
  res.json({ success: true, data });
});
router.post('/pegawai', requireKeuangan, async (req, res: Response) => {
  const year = new Date().getFullYear();
  const count = await prisma.pegawai.count();
  const nip = `PGW-${year}-${(count + 1).toString().padStart(3, '0')}`;
  const { jabatanId, ...rest } = req.body;
  const data = await prisma.pegawai.create({ data: { ...rest, jabatanId, nip } });
  res.status(201).json({ success: true, data });
});
router.put('/pegawai/:id', requireKeuangan, async (req, res: Response) => {
  const { id, jabatan, nip, createdAt, ...rest } = req.body;
  const data = await prisma.pegawai.update({ where: { id: req.params.id }, data: rest });
  res.json({ success: true, data });
});

export { router as keuanganRouter };
