import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { apiLimiter } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, HttpError } from '../middleware/validate';
import { withUniqueNIS } from '../utils/generators';

const router = Router();
const prisma = new PrismaClient();
router.use(apiLimiter);
router.use(verifyToken);

// Field ortu/wali (Section F) disimpan di tabel Wali
const WALI_FIELDS = [
  'namaAyah', 'nikAyah', 'pekerjaanAyah', 'penghasilanAyah',
  'namaIbu', 'nikIbu', 'pekerjaanIbu', 'penghasilanIbu',
  'namaWali', 'hubunganWali', 'noHpOrtu'
] as const;

const WALI_SELECT = Object.fromEntries(WALI_FIELDS.map((f) => [f, true]));

// Field penempatan yang diarsipkan ke RiwayatPenempatan per tahun ajaran
const PENEMPATAN_FIELDS = [
  'unitPesantrenId', 'asramaId', 'kamarId', 'unitSekolahId', 'jurusanId',
  'kelasSekolahId', 'marhalahMadinId', 'kelasMadinId'
] as const;

const SANTRI_SELECT = {
  id: true, nis: true, status: true, namaLengkap: true, namaPanggilan: true,
  jenisKelamin: true, tempatLahir: true, tanggalLahir: true, anakKe: true,
  jumlahSaudara: true, hobi: true, citaCita: true, fotoUrl: true,
  nik: true, nisn: true, alamat: true, rt: true, rw: true, dusun: true,
  desa: true, kecamatan: true, kabupaten: true, provinsi: true, kodePos: true,
  golonganDarah: true, riwayatPenyakit: true, tindakanKesehatan: true, kondisiSaatIni: true,
  unitPesantrenId: true, asramaId: true, kamarId: true, unitSekolahId: true,
  jurusanId: true, kelasSekolahId: true, marhalahMadinId: true, kelasMadinId: true,
  sekolahAsal: true, alamatSekolahAsal: true, tahunLulusSekolahAsal: true, noKip: true,
  waliId: true,
  statusSantri: true, jenisSantriAsuh: true, alasanAsuh: true,
  alasanKeluar: true, tahunKeluar: true, noHpAlumni: true, statusAlumniDetail: true,
  tanggalDaftar: true, tahunAjaranId: true, createdAt: true, updatedAt: true,
  wali: { select: WALI_SELECT }
};

// Whitelist field yang boleh ditulis client (8 section form PRD 4.2.4)
// Field ortu dipetakan otomatis ke tabel Wali — kontrak API tetap datar.
const SANTRI_WRITABLE = [
  'nik', 'nisn', 'namaLengkap', 'namaPanggilan', 'jenisKelamin',
  'tempatLahir', 'tanggalLahir', 'anakKe', 'jumlahSaudara', 'hobi', 'citaCita', 'fotoUrl',
  'alamat', 'rt', 'rw', 'dusun', 'desa', 'kecamatan', 'kabupaten', 'provinsi', 'kodePos',
  'golonganDarah', 'riwayatPenyakit', 'tindakanKesehatan', 'kondisiSaatIni',
  'unitPesantrenId', 'asramaId', 'kamarId', 'unitSekolahId', 'jurusanId',
  'kelasSekolahId', 'marhalahMadinId', 'kelasMadinId',
  'sekolahAsal', 'alamatSekolahAsal', 'tahunLulusSekolahAsal', 'noKip',
  'statusSantri', 'jenisSantriAsuh', 'alasanAsuh',
  'alasanKeluar', 'tahunKeluar', 'noHpAlumni', 'statusAlumniDetail',
  'tanggalDaftar', 'tahunAjaranId',
  'waliId'
];

type SantriWithWali = Record<string, unknown> & { wali?: Record<string, unknown> | null };

// Ratakan field Wali ke payload respons agar kontrak API (frontend) tidak berubah
function flattenWali<T extends SantriWithWali>(santri: T | null) {
  if (!santri) return santri;
  const { wali, ...rest } = santri;
  return { ...rest, ...(wali ?? {}) };
}

// Cari/buat/perbarui record Wali. Dedup saat santri baru: noHpOrtu lalu nikAyah.
async function resolveWaliId(
  tx: Prisma.TransactionClient,
  waliData: Record<string, unknown>,
  currentWaliId?: string | null
): Promise<string | null> {
  const hasData = WALI_FIELDS.some((f) => waliData[f] !== undefined && waliData[f] !== null && waliData[f] !== '');
  if (!hasData) return currentWaliId ?? null;

  if (currentWaliId) {
    await tx.wali.update({ where: { id: currentWaliId }, data: waliData as never });
    return currentWaliId;
  }

  let existing = null;
  if (waliData.noHpOrtu) {
    existing = await tx.wali.findFirst({ where: { noHpOrtu: waliData.noHpOrtu as string } });
  }
  if (!existing && waliData.nikAyah) {
    existing = await tx.wali.findFirst({ where: { nikAyah: waliData.nikAyah as string } });
  }
  if (existing) {
    await tx.wali.update({ where: { id: existing.id }, data: waliData as never });
    return existing.id;
  }
  const created = await tx.wali.create({ data: waliData as never });
  return created.id;
}

// Arsipkan penempatan santri saat ini ke RiwayatPenempatan (1 baris per santri per TA)
async function syncRiwayatPenempatan(
  tx: Prisma.TransactionClient,
  santri: { id: string; tahunAjaranId: string } & Record<string, unknown>,
  keterangan?: string
) {
  const penempatan = Object.fromEntries(PENEMPATAN_FIELDS.map((f) => [f, santri[f] ?? null]));
  await tx.riwayatPenempatan.upsert({
    where: { santriId_tahunAjaranId: { santriId: santri.id, tahunAjaranId: santri.tahunAjaranId } },
    create: { santriId: santri.id, tahunAjaranId: santri.tahunAjaranId, ...penempatan, keterangan } as never,
    update: { ...penempatan } as never
  });
}

// GET /api/santri/options - Lookup ringan untuk modal "Cari Santri" di semua modul.
// PENTING: dideklarasikan sebelum '/:id' agar tidak tertangkap sebagai id.
router.get('/options', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search = '', status } = req.query;
  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { namaLengkap: { contains: search as string, mode: 'insensitive' } },
      { nis: { contains: search as string } }
    ];
  }

  const data = await prisma.santri.findMany({
    where,
    select: {
      id: true, nis: true, namaLengkap: true, jenisKelamin: true, status: true,
      kamar: { select: { namaKamar: true, asrama: { select: { namaAsrama: true } } } },
      kelasSekolah: { select: { namaKelas: true } },
      kelasMadin: { select: { namaKelas: true } }
    },
    orderBy: { namaLengkap: 'asc' },
    take: 20
  });

  res.json({ success: true, data });
}));

// GET /api/santri - List santri dengan filter & pagination
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, search, unitPesantrenId, marhalahMadinId, unitSekolahId, tahunAjaranId, page = '1', limit = '20' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (unitPesantrenId) where.unitPesantrenId = unitPesantrenId;
  if (marhalahMadinId) where.marhalahMadinId = marhalahMadinId;
  if (unitSekolahId) where.unitSekolahId = unitSekolahId;
  if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
  if (search) {
    where.OR = [
      { namaLengkap: { contains: search as string, mode: 'insensitive' } },
      { nis: { contains: search as string } },
      { nik: { contains: search as string } }
    ];
  }

  // Wali santri hanya bisa melihat data anaknya sendiri
  if (req.user?.role === 'wali_santri') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.santriIdAssociated) where.id = user.santriIdAssociated;
  }

  const [total, data] = await Promise.all([
    prisma.santri.count({ where }),
    prisma.santri.findMany({ where, select: SANTRI_SELECT, skip, take: limitNum, orderBy: { createdAt: 'desc' } })
  ]);

  res.json({ success: true, data: data.map(flattenWali), meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } });
}));

// GET /api/santri/:id
router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  // Wali santri hanya boleh melihat detail anaknya
  if (req.user?.role === 'wali_santri') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.santriIdAssociated !== req.params.id) {
      throw new HttpError(403, 'Akses ditolak: Anda hanya dapat melihat data santri Anda sendiri');
    }
  }
  const santri = await prisma.santri.findFirst({ where: { id: req.params.id, deletedAt: null }, select: SANTRI_SELECT });
  if (!santri) throw new HttpError(404, 'Santri tidak ditemukan');
  res.json({ success: true, data: flattenWali(santri) });
}));

// POST /api/santri - Tambah santri baru (NIS otomatis & race-safe)
router.post('/', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['namaLengkap', 'jenisKelamin']);

  const data = pick<Record<string, unknown>>(req.body, SANTRI_WRITABLE);

  // Otomatisasi status alumni (PRD 5.4): Section H terisi -> Alumni
  const status = (data.alasanKeluar || data.tahunKeluar) ? 'Alumni' : 'Aktif';

  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const tahunAjaranId = data.tahunAjaranId || tahunAjaran?.id;
  if (!tahunAjaranId) throw new HttpError(400, 'Tahun ajaran aktif tidak ditemukan');

  // Validasi kamar jika diisi
  if (data.kamarId) {
    const kamar = await prisma.kamar.findUnique({ where: { id: data.kamarId as string }, select: { terisi: true, kapasitas: true } });
    if (!kamar) throw new HttpError(400, 'Kamar tidak ditemukan');
    if (status === 'Aktif' && kamar.terisi >= kamar.kapasitas) {
      throw new HttpError(400, 'Kamar sudah penuh (kapasitas tercapai)');
    }
  }

  const santri = await withUniqueNIS(prisma, (nis) =>
    prisma.$transaction(async (tx) => {
      const newSantri = await tx.santri.create({
        data: { ...data, nis, status, tahunAjaranId, tanggalDaftar: (data.tanggalDaftar as string) || new Date().toISOString().split('T')[0] } as never,
        select: SANTRI_SELECT
      });
      // Sinkronisasi counter kamar
      if (newSantri.kamarId && status === 'Aktif') {
        await tx.kamar.update({ where: { id: newSantri.kamarId }, data: { terisi: { increment: 1 } } });
      }
      // Arsipkan penempatan awal
      await syncRiwayatPenempatan(tx, newSantri as never, 'Penempatan awal pendaftaran');
      return newSantri;
    })
  );

  // Auto generate tagihan syahriyah bulan berjalan untuk santri aktif (PRD 4.6)
  if (status === 'Aktif') {
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const now = new Date();
    const bulanTahun = `${bulan[now.getMonth()]} ${now.getFullYear()}`;
    const biayaSyahriyah = await prisma.biayaMaster.findFirst({ where: { jenis: 'Syahriyah' } });
    if (biayaSyahriyah && tahunAjaran) {
      await prisma.tagihanKeuangan.create({
        data: {
          santriId: santri.id, biayaMasterId: biayaSyahriyah.id, bulanTahun,
          nominalTagihan: biayaSyahriyah.nominal, nominalTerbayar: 0, status: 'Belum Lunas',
          tanggalJatuhTempo: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-10`,
          tahunAjaranId
        }
      });
    }
  }

  res.status(201).json({ success: true, message: `Santri berhasil ditambahkan dengan NIS: ${santri.nis}`, data: flattenWali(santri as never) });
}));

// PUT /api/santri/:id - Update santri
router.put('/:id', requireRole('admin_sistem', 'admin_pesantren'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.santri.findUnique({ where: { id: req.params.id }, select: { id: true, kamarId: true, status: true } });
  if (!existing) throw new HttpError(404, 'Santri tidak ditemukan');

  const data = pick<Record<string, unknown>>(req.body, SANTRI_WRITABLE);

  // Otomatisasi status alumni (PRD 5.4)
  if (data.alasanKeluar || data.tahunKeluar) data.status = 'Alumni';

  // Validasi kamar tujuan jika berubah
  if (data.kamarId && data.kamarId !== existing.kamarId) {
    const kamar = await prisma.kamar.findUnique({ where: { id: data.kamarId as string }, select: { terisi: true, kapasitas: true } });
    if (!kamar) throw new HttpError(400, 'Kamar tidak ditemukan');
    if (kamar.terisi >= kamar.kapasitas) {
      throw new HttpError(400, 'Kamar tujuan sudah penuh (kapasitas tercapai)');
    }
  }

  const santri = await prisma.$transaction(async (tx) => {
    // Resolve Wali
    if (data.waliId || WALI_FIELDS.some(f => data[f] !== undefined)) {
      data.waliId = await resolveWali(tx, waliData, existing.waliId);
    }
    const updated = await tx.santri.update({ where: { id: req.params.id }, data: data as never, select: SANTRI_SELECT });

    // Sinkronisasi counter kamar saat pindah kamar
    const oldKamar = existing.kamarId;
    const newKamar = updated.kamarId;
    if (oldKamar && newKamar && oldKamar !== newKamar) {
      await tx.kamar.update({ where: { id: oldKamar }, data: { terisi: { decrement: 1 } } });
      await tx.kamar.update({ where: { id: newKamar }, data: { terisi: { increment: 1 } } });
    } else if (!oldKamar && newKamar && updated.status === 'Aktif') {
      await tx.kamar.update({ where: { id: newKamar }, data: { terisi: { increment: 1 } } });
    } else if (oldKamar && !newKamar) {
      await tx.kamar.update({ where: { id: oldKamar }, data: { terisi: { decrement: 1 } } });
    }
    // Arsipkan penempatan jika ada perubahan penempatan
    if (PENEMPATAN_FIELDS.some(f => data[f] !== undefined)) {
       await syncRiwayatPenempatan(tx, updated as never, 'Update data penempatan');
    }
    return updated;
  });

  res.json({ success: true, message: 'Data santri berhasil diperbarui', data: flattenWali(santri as never) });
}));

// DELETE /api/santri/:id (Soft-delete)
router.delete('/:id', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.santri.findFirst({ where: { id: req.params.id, deletedAt: null }, select: { id: true, kamarId: true, status: true } });
  if (!existing) throw new HttpError(404, 'Santri tidak ditemukan');

  await prisma.$transaction(async (tx) => {
    if (existing.kamarId && existing.status === 'Aktif') {
      await tx.kamar.update({ where: { id: existing.kamarId }, data: { terisi: { decrement: 1 } } });
    }
    await tx.santri.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  });

  res.json({ success: true, message: 'Data santri berhasil dinonaktifkan (soft-delete)' });
}));

export { router as santriRouter };
