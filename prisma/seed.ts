import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL wajib diisi untuk menjalankan seed');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const users = [
  {
    id: 'usr-1',
    username: 'admin',
    nama: 'K.H. Mukhtar Syafaat (Admin Yayasan)',
    email: 'yayasan@mukhtarsyafaat.ac.id',
    role: 'admin_sistem',
  },
  {
    id: 'usr-2',
    username: 'pengurus',
    nama: 'Ust. Ahmad Fauzi (Pengurus Pesantren)',
    email: 'pengurus@mukhtarsyafaat.ac.id',
    role: 'pengurus',
  },
  {
    id: 'usr-3',
    username: 'guru_halim',
    nama: 'Ust. Abdul Halim, S.Pd.I (Guru / Ustadz)',
    email: 'guru@mukhtarsyafaat.ac.id',
    role: 'guru',
  },
  {
    id: 'usr-4',
    username: 'walisyafiq',
    nama: 'H. Abdullah Mahmud (Wali Santri Farhan)',
    email: 'wali@gmail.com',
    role: 'wali_santri',
  },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.tahunAjaran.upsert({
    where: { kodeTahunAjaran: '2025/2026' },
    update: { tanggalMulai: '2025-07-01', tanggalSelesai: '2026-06-30', isAktif: true },
    create: {
      id: 'ta-2526',
      kodeTahunAjaran: '2025/2026',
      tanggalMulai: '2025-07-01',
      tanggalSelesai: '2026-06-30',
      isAktif: true,
    },
  });

  await prisma.unitPesantren.upsert({
    where: { kodeUnit: 'UPS-01' },
    update: { namaUnit: 'Pusat As-Syafaat', deskripsi: 'Kompleks Pusat Santri Putra & Pengasuhan Utama' },
    create: {
      id: 'up-1',
      kodeUnit: 'UPS-01',
      namaUnit: 'Pusat As-Syafaat',
      deskripsi: 'Kompleks Pusat Santri Putra & Pengasuhan Utama',
    },
  });

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        nama: user.nama,
        email: user.email,
        role: user.role,
        passwordHash,
        isActive: true,
        ...('santriIdAssociated' in user ? { santriIdAssociated: user.santriIdAssociated } : {}),
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  console.log(`Seed selesai: ${users.length} akun demo dan data master awal dibuat.`);
}

main()
  .catch(error => {
    console.error('Seed gagal:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
