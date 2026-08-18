import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
const prisma = new PrismaClient();
router.use(apiLimiter);
router.use(verifyToken);

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
  namaAyah: true, nikAyah: true, pekerjaanAyah: true, penghasilanAyah: true,
  namaIbu: true, nikIbu: true, pekerjaanIbu: true, penghasilanIbu: true,
  namaWali: true, hubunganWali: true, noHpOrtu: true,
  jenisSantriAsuh: true, alasanAsuh: true,
  alasanKeluar: true, tahunKeluar: true, noHpAlumni: true, statusAlumniDetail: true,
  tanggalDaftar: true, tahunAjaranId: true, createdAt: true, updatedAt: true
};

// GET /api/santri - List santri with filters
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, unitPesantrenId, marhalahMadinId, unitSekolahId, tahunAjaranId, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Record<string, unknown> = {};
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

    // Wali santri hanya bisa lihat data anaknya sendiri
    if (req.user?.role === 'wali_santri') {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.santriIdAssociated) {
        where.id = user.santriIdAssociated;
      }
    }

    const [total, data] = await Promise.all([
      prisma.santri.count({ where }),
      prisma.santri.findMany({ where, select: SANTRI_SELECT, skip, take: parseInt(limit as string), orderBy: { createdAt: 'desc' } })
    ]);

    res.json({ success: true, data, meta: { total, page: parseInt(page as string), limit: parseInt(limit as string), totalPages: Math.ceil(total / parseInt(limit as string)) } });
  } catch (error) {
    console.error('[Santri GET Error]', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data santri' });
  }
});

// GET /api/santri/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const santri = await prisma.santri.findUnique({ where: { id: req.params.id }, select: SANTRI_SELECT });
    if (!santri) { res.status(404).json({ success: false, message: 'Santri tidak ditemukan' }); return; }
    res.json({ success: true, data: santri });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data santri' });
  }
});

// POST /api/santri - Tambah santri baru
router.post('/', requireRole('admin_sistem', 'admin_pesantren'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Auto generate NIS
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const lastSantri = await prisma.santri.findFirst({
      where: { nis: { startsWith: yearPrefix } },
      orderBy: { nis: 'desc' }
    });
    const nextSeq = lastSantri ? parseInt(lastSantri.nis.slice(2)) + 1 : 1;
    const nis = `${yearPrefix}${nextSeq.toString().padStart(4, '0')}`;

    // Auto alumni transition
    const status = (data.alasanKeluar || data.tahunKeluar) ? 'Alumni' : 'Aktif';

    const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });

    const santri = await prisma.santri.create({
      data: { ...data, nis, status, tahunAjaranId: data.tahunAjaranId || tahunAjaran?.id },
      select: SANTRI_SELECT
    });

    // Auto generate tagihan syahriyah untuk santri aktif
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
            tahunAjaranId: tahunAjaran.id
          }
        });
      }
    }

    res.status(201).json({ success: true, message: `Santri berhasil ditambahkan dengan NIS: ${nis}`, data: santri });
  } catch (error) {
    console.error('[Santri POST Error]', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan santri' });
  }
});

// PUT /api/santri/:id - Update santri
router.put('/:id', requireRole('admin_sistem', 'admin_pesantren'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    // Auto alumni transition
    if (data.alasanKeluar || data.tahunKeluar) data.status = 'Alumni';

    const { id, nis, createdAt, updatedAt, ...updateData } = data;
    const santri = await prisma.santri.update({ where: { id: req.params.id }, data: updateData, select: SANTRI_SELECT });
    res.json({ success: true, message: 'Data santri berhasil diperbarui', data: santri });
  } catch (error) {
    console.error('[Santri PUT Error]', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui data santri' });
  }
});

// DELETE /api/santri/:id
router.delete('/:id', requireRole('admin_sistem'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.santri.delete({ where: { id: _req.params.id } });
    res.json({ success: true, message: 'Data santri berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus santri' });
  }
});

export { router as santriRouter };
