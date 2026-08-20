import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireKeuangan } from '../middleware/rbac';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, assertPositiveInt, HttpError } from '../middleware/validate';
import { withUniqueKuitansi } from '../utils/generators';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

const BIAYA_MASTER_FIELDS = ['namaBiaya', 'jenis', 'nominal', 'kategori', 'keterangan'];
const TAGIHAN_FIELDS = [
  'santriId', 'biayaMasterId', 'bulanTahun', 'bulanKe', 'unitId',
  'nominalTagihan', 'tanggalJatuhTempo', 'tahunAjaranId'
];

// ─── BIAYA MASTER ─────────────────────────────────────
router.get('/biaya-master', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.biayaMaster.findMany();
  res.json({ success: true, data });
}));

router.post('/biaya-master', requireKeuangan, asyncHandler(async (req, res: Response) => {
  requireFields(req.body, ['namaBiaya', 'jenis', 'nominal']);
  assertPositiveInt(req.body.nominal, 'nominal');
  const data = pick<Record<string, unknown>>(req.body, BIAYA_MASTER_FIELDS);
  const result = await prisma.biayaMaster.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/biaya-master/:id', requireKeuangan, asyncHandler(async (req, res: Response) => {
  if (req.body.nominal !== undefined) assertPositiveInt(req.body.nominal, 'nominal');
  const data = pick<Record<string, unknown>>(req.body, BIAYA_MASTER_FIELDS);
  const result = await prisma.biayaMaster.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

// ─── TAGIHAN KEUANGAN ─────────────────────────────────
router.get('/tagihan', asyncHandler(async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.status) where.status = req.query.status;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  if (req.query.bulanTahun) where.bulanTahun = req.query.bulanTahun;
  if (req.query.biayaMasterId) where.biayaMasterId = req.query.biayaMasterId;

  // Wali santri hanya melihat tagihan anaknya
  if (req.user?.role === 'wali_santri') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.santriIdAssociated) where.santriId = user.santriIdAssociated;
  }

  const data = await prisma.tagihanKeuangan.findMany({
    where,
    include: { biayaMaster: true, santri: { select: { nis: true, namaLengkap: true } } },
    orderBy: [{ createdAt: 'desc' }]
  });
  res.json({ success: true, data });
}));

router.post('/tagihan', requireKeuangan, asyncHandler(async (req, res: Response) => {
  requireFields(req.body, ['santriId', 'biayaMasterId', 'bulanTahun', 'nominalTagihan']);
  assertPositiveInt(req.body.nominalTagihan, 'nominalTagihan');

  const santri = await prisma.santri.findUnique({ where: { id: req.body.santriId }, select: { id: true } });
  if (!santri) throw new HttpError(400, 'Santri tidak ditemukan');
  const biaya = await prisma.biayaMaster.findUnique({ where: { id: req.body.biayaMasterId }, select: { id: true } });
  if (!biaya) throw new HttpError(400, 'Biaya master tidak ditemukan');

  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = pick<Record<string, unknown>>(req.body, TAGIHAN_FIELDS);
  data.tahunAjaranId = req.body.tahunAjaranId || tahunAjaran?.id;
  if (!data.tahunAjaranId) throw new HttpError(400, 'Tahun ajaran aktif tidak ditemukan');

  const result = await prisma.tagihanKeuangan.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

// ─── TRANSAKSI PEMBAYARAN ─────────────────────────────
router.get('/transaksi', asyncHandler(async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.tagihanId) where.tagihanId = req.query.tagihanId;

  // Wali santri hanya melihat transaksi anaknya
  if (req.user?.role === 'wali_santri') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.santriIdAssociated) where.santriId = user.santriIdAssociated;
  }

  const data = await prisma.transaksiPembayaran.findMany({
    where,
    include: { tagihan: { include: { biayaMaster: true } }, santri: { select: { nis: true, namaLengkap: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data });
}));

// POST /api/keuangan/bayar/:tagihanId - Proses pembayaran tagihan
// Kuitansi sekuensial KW-YYYYMMDD-XXX (race-safe via unique + retry)
router.post('/bayar/:tagihanId', requireKeuangan, asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['nominal', 'metodePembayaran']);
  assertPositiveInt(req.body.nominal, 'nominal');
  const { metodePembayaran, catatan } = pick<Record<string, unknown>>(req.body, ['metodePembayaran', 'catatan']);
  const tagihanId = req.params.tagihanId;

  const tagihan = await prisma.tagihanKeuangan.findUnique({ where: { id: tagihanId } });
  if (!tagihan) throw new HttpError(404, 'Tagihan tidak ditemukan');
  if (tagihan.status === 'Lunas') throw new HttpError(400, 'Tagihan sudah lunas');

  const nominal = Number(req.body.nominal);
  const sisa = tagihan.nominalTagihan - tagihan.nominalTerbayar;
  if (nominal > sisa) {
    throw new HttpError(400, `Nominal pembayaran (Rp ${nominal.toLocaleString('id-ID')}) melebihi sisa tagihan (Rp ${sisa.toLocaleString('id-ID')})`);
  }

  const tanggal = new Date().toISOString().split('T')[0];
  const newTerbayar = tagihan.nominalTerbayar + nominal;
  const status = newTerbayar >= tagihan.nominalTagihan ? 'Lunas' : 'Sebagian';

  const transaksi = await withUniqueKuitansi(prisma, (noKuitansi) =>
    prisma.$transaction(async (tx) => {
      const [trx] = await Promise.all([
        tx.transaksiPembayaran.create({
          data: {
            tagihanId,
            santriId: tagihan.santriId,
            noKuitansi,
            tanggal,
            nominal,
            metodePembayaran: metodePembayaran as string,
            penerima: req.user?.nama || 'Admin',
            catatan: (catatan as string) ?? null
          }
        }),
        tx.tagihanKeuangan.update({
          where: { id: tagihanId },
          data: { nominalTerbayar: newTerbayar, status }
        })
      ]);
      return trx;
    })
  );

  res.status(201).json({
    success: true,
    message: `Pembayaran berhasil. No. Kuitansi: ${transaksi.noKuitansi}`,
    data: { transaksi, noKuitansi: transaksi.noKuitansi, statusTagihan: status }
  });
}));

export { router as keuanganRouter };
