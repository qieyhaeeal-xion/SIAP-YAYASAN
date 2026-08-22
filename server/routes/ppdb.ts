import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// GET /api/ppdb
router.get('/', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.statusSeleksi) where.statusSeleksi = req.query.statusSeleksi;
  if (req.query.tahunAjaranId) where.tahunAjaranId = req.query.tahunAjaranId;
  const data = await prisma.pendaftarPpdb.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

// POST /api/ppdb - Tambah pendaftar baru
router.post('/', async (req, res: Response) => {
  const year = new Date().getFullYear();
  const count = await prisma.pendaftarPpdb.count();
  const noPendaftaran = `PPDB-${year}-${(count + 1).toString().padStart(3, '0')}`;
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });
  const data = await prisma.pendaftarPpdb.create({
    data: { ...req.body, noPendaftaran, statusSeleksi: 'Pendaftaran Baru', tanggalDaftar: new Date().toISOString().split('T')[0], tahunAjaranId: req.body.tahunAjaranId || tahunAjaran?.id }
  });
  res.status(201).json({ success: true, data });
});

// PATCH /api/ppdb/:id/status - Update status seleksi
router.patch('/:id/status', requireRole('admin_sistem', 'admin_pesantren'), async (req, res: Response) => {
  const data = await prisma.pendaftarPpdb.update({ where: { id: req.params.id }, data: { statusSeleksi: req.body.statusSeleksi } });
  res.json({ success: true, data });
});

// POST /api/ppdb/:id/mutasi - Mutasi PPDB ke Santri Aktif (1-Click)
router.post('/:id/mutasi', requireRole('admin_sistem', 'admin_pesantren'), async (req: AuthRequest, res: Response): Promise<void> => {
  const pendaftar = await prisma.pendaftarPpdb.findUnique({ where: { id: req.params.id } });
  if (!pendaftar) { res.status(404).json({ success: false, message: 'Pendaftar tidak ditemukan' }); return; }
  if (pendaftar.statusSeleksi === 'Telah Dimutasi') { res.status(409).json({ success: false, message: 'Pendaftar sudah dimutasi' }); return; }

  // Cari default asrama, kamar, kelas
  const defaultAsrama = await prisma.asrama.findFirst({ where: { unitPesantrenId: pendaftar.unitPesantrenPilihanId || undefined } });
  const defaultKamar = await prisma.kamar.findFirst({ where: { asramaId: defaultAsrama?.id } });
  const defaultKelasSekolah = await prisma.kelasSekolah.findFirst({ where: { sekolahId: pendaftar.unitSekolahPilihanId || undefined } });
  const defaultKelasMadin = await prisma.kelasMadin.findFirst({ where: { marhalahId: pendaftar.marhalahPilihanId || undefined } });
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isAktif: true } });

  // Auto NIS
  const yearPrefix = new Date().getFullYear().toString().slice(-2);
  const lastSantri = await prisma.santri.findFirst({ where: { nis: { startsWith: yearPrefix } }, orderBy: { nis: 'desc' } });
  const nextSeq = lastSantri ? parseInt(lastSantri.nis.slice(2)) + 1 : 1;
  const nis = `${yearPrefix}${nextSeq.toString().padStart(4, '0')}`;

  const [santri] = await prisma.$transaction(async (tx) => {
    const newSantri = await tx.santri.create({
      data: {
        nis, status: 'Aktif', namaLengkap: pendaftar.namaLengkap, namaPanggilan: pendaftar.namaLengkap.split(' ')[0],
        jenisKelamin: pendaftar.jenisKelamin, tempatLahir: pendaftar.tempatLahir || '', tanggalLahir: pendaftar.tanggalLahir || '',
        alamat: pendaftar.alamat || '', namaAyah: pendaftar.namaOrtu || '', noHpOrtu: pendaftar.noHpOrtu || '',
        sekolahAsal: pendaftar.sekolahAsal || '', statusSantri: 'Reguler',
        unitPesantrenId: pendaftar.unitPesantrenPilihanId, asramaId: defaultAsrama?.id,
        kamarId: defaultKamar?.id, unitSekolahId: pendaftar.unitSekolahPilihanId,
        kelasSekolahId: defaultKelasSekolah?.id, marhalahMadinId: pendaftar.marhalahPilihanId,
        kelasMadinId: defaultKelasMadin?.id, golonganDarah: 'O', kondisiSaatIni: 'Sehat',
        riwayatPenyakit: 'Tidak ada', tindakanKesehatan: '-', nikAyah: '', pekerjaanAyah: 'Wiraswasta',
        penghasilanAyah: 'Rp 3.000.000 - Rp 5.000.000', namaIbu: '', nikIbu: '',
        pekerjaanIbu: 'Ibu Rumah Tangga', penghasilanIbu: 'Tidak Berpenghasilan', anakKe: 1, jumlahSaudara: 2,
        tanggalDaftar: new Date().toISOString().split('T')[0], tahunAjaranId: tahunAjaran?.id || ''
      }
    });

    // Generate tagihan syahriyah perdana
    const biayaSyahriyah = await tx.biayaMaster.findFirst({ where: { jenis: 'Syahriyah' } });
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const now = new Date();
    if (biayaSyahriyah && tahunAjaran) {
      await tx.tagihanKeuangan.create({
        data: { santriId: newSantri.id, biayaMasterId: biayaSyahriyah.id, bulanTahun: `${bulan[now.getMonth()]} ${now.getFullYear()}`, nominalTagihan: biayaSyahriyah.nominal, nominalTerbayar: 0, status: 'Belum Lunas', tanggalJatuhTempo: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-10`, tahunAjaranId: tahunAjaran.id }
      });
    }

    await tx.pendaftarPpdb.update({ where: { id: req.params.id }, data: { statusSeleksi: 'Telah Dimutasi' } });
    return [newSantri];
  });

  res.status(201).json({ success: true, message: `Mutasi berhasil! Santri terdaftar dengan NIS: ${santri.nis}`, data: santri });
});

export { router as ppdbRouter };
