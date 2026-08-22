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

const BIAYA_MASTER_FIELDS = [
  'kodeBiaya', 'namaBiaya', 'jenis', 'tipeFrekuensi', 'nominal', 'nominalStandard',
  'kategori', 'kategoriPembayaran', 'wajib', 'aktif', 'keterangan'
];
const TARIF_FIELDS = ['biayaMasterId', 'targetScope', 'targetValue', 'nominal', 'wajib', 'aktif', 'effectiveFrom', 'effectiveUntil'];
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

router.delete('/biaya-master/:id', requireKeuangan, asyncHandler(async (req, res: Response) => {
  const result = await prisma.biayaMaster.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: result });
}));

// ─── TARIF PEMBAYARAN ──────────────────────────────────
router.get('/tarif', asyncHandler(async (_req, res: Response) => {
  const data = await prisma.tarifPembayaran.findMany({ include: { biayaMaster: true }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
}));

router.post('/tarif', requireKeuangan, asyncHandler(async (req, res: Response) => {
  requireFields(req.body, ['biayaMasterId', 'targetScope', 'nominal']);
  assertPositiveInt(req.body.nominal, 'nominal');
  const data = pick<Record<string, unknown>>(req.body, TARIF_FIELDS);
  const result = await prisma.tarifPembayaran.create({ data: data as never });
  res.status(201).json({ success: true, data: result });
}));

router.put('/tarif/:id', requireKeuangan, asyncHandler(async (req, res: Response) => {
  if (req.body.nominal !== undefined) assertPositiveInt(req.body.nominal, 'nominal');
  const data = pick<Record<string, unknown>>(req.body, TARIF_FIELDS);
  const result = await prisma.tarifPembayaran.update({ where: { id: req.params.id }, data: data as never });
  res.json({ success: true, data: result });
}));

router.delete('/tarif/:id', requireKeuangan, asyncHandler(async (req, res: Response) => {
  const result = await prisma.tarifPembayaran.delete({ where: { id: req.params.id } });
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
  const { metodePembayaran, catatan, buktiTransferUrl } = pick<Record<string, unknown>>(req.body, ['metodePembayaran', 'catatan', 'buktiTransferUrl']);
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
  const otomatisTerverifikasi = ['Cash', 'Tunai'].includes(metodePembayaran as string);

  const transaksi = await withUniqueKuitansi(prisma, (noKuitansi) =>
    prisma.$transaction(async (tx) => {
      const trx = await tx.transaksiPembayaran.create({
        data: {
          tagihanId,
          santriId: tagihan.santriId,
          noKuitansi,
          tanggal,
          nominal,
          metodePembayaran: metodePembayaran as string,
          penerima: req.user?.nama || 'Admin',
          catatan: (catatan as string) ?? null,
          buktiTransferUrl: (buktiTransferUrl as string) ?? null,
          statusVerifikasi: otomatisTerverifikasi ? 'Terverifikasi' : 'Menunggu Verifikasi',
          verifiedBy: otomatisTerverifikasi ? (req.user?.nama || 'Admin') : null,
          verifiedAt: otomatisTerverifikasi ? new Date() : null,
          appliedToTagihan: otomatisTerverifikasi
        }
      });
      if (otomatisTerverifikasi) {
        await tx.tagihanKeuangan.update({
          where: { id: tagihanId },
          data: { nominalTerbayar: newTerbayar, status }
        });
      }
      return trx;
    })
  );

  res.status(201).json({
    success: true,
    message: `Pembayaran berhasil. No. Kuitansi: ${transaksi.noKuitansi}`,
    data: { transaksi, noKuitansi: transaksi.noKuitansi, statusTagihan: status }
  });
}));

// POST /api/keuangan/transaksi/:id/verifikasi - Verifikasi transfer manual
router.post('/transaksi/:id/verifikasi', requireKeuangan, asyncHandler(async (req: AuthRequest, res: Response) => {
  const status = req.body.status as string;
  if (status !== 'Terverifikasi' && status !== 'Ditolak') {
    throw new HttpError(400, 'Status verifikasi tidak valid');
  }
  const transaksi = await prisma.transaksiPembayaran.findUnique({ where: { id: req.params.id } });
  if (!transaksi) throw new HttpError(404, 'Transaksi tidak ditemukan');
  if (transaksi.statusVerifikasi !== 'Menunggu Verifikasi') {
    throw new HttpError(400, 'Transaksi sudah diproses');
  }

  const result = await prisma.$transaction(async (tx) => {
    if (status === 'Terverifikasi') {
      const tagihan = await tx.tagihanKeuangan.findUnique({ where: { id: transaksi.tagihanId } });
      if (!tagihan) throw new HttpError(404, 'Tagihan tidak ditemukan');
      const sisa = tagihan.nominalTagihan - tagihan.nominalTerbayar;
      if (transaksi.nominal > sisa) throw new HttpError(400, 'Nominal transaksi melebihi sisa tagihan');
      await tx.tagihanKeuangan.update({
        where: { id: tagihan.id },
        data: {
          nominalTerbayar: { increment: transaksi.nominal },
          status: tagihan.nominalTerbayar + transaksi.nominal >= tagihan.nominalTagihan ? 'Lunas' : 'Sebagian'
        }
      });
    }
    return tx.transaksiPembayaran.update({
      where: { id: transaksi.id },
      data: {
        statusVerifikasi: status,
        verifiedBy: req.user?.nama || 'Admin',
        verifiedAt: new Date(),
        appliedToTagihan: status === 'Terverifikasi'
      }
    });
  });
  res.json({ success: true, data: result });
}));

export { router as keuanganRouter };
