import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Generator nomor dokumen yang aman terhadap race condition.
// Mengandalkan unique constraint di DB + retry pada P2002.
// ─────────────────────────────────────────────────────────────

const MAX_RETRY = 5;

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

// NIS 6 digit: YY + 4 digit urutan (contoh: 260001)
export async function withUniqueNIS<T>(
  prisma: PrismaClient,
  createFn: (nis: string) => Promise<T>
): Promise<T> {
  const yearPrefix = new Date().getFullYear().toString().slice(-2);

  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    const lastSantri = await prisma.santri.findFirst({
      where: { nis: { startsWith: yearPrefix } },
      orderBy: { nis: 'desc' }
    });
    const nextSeq = lastSantri ? parseInt(lastSantri.nis.slice(2), 10) + 1 : 1;
    const nis = `${yearPrefix}${nextSeq.toString().padStart(4, '0')}`;

    try {
      return await createFn(nis);
    } catch (error) {
      if (isUniqueViolation(error) && attempt < MAX_RETRY - 1) continue;
      throw error;
    }
  }
  throw new Error('Gagal menghasilkan NIS unik setelah beberapa percobaan');
}

// Kuitansi sekuensial: KW-YYYYMMDD-XXX (urut per hari, tanpa random)
export async function withUniqueKuitansi<T>(
  prisma: PrismaClient,
  createFn: (noKuitansi: string) => Promise<T>
): Promise<T> {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const prefix = `KW-${today}-`;

  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    const lastTrx = await prisma.transaksiPembayaran.findFirst({
      where: { noKuitansi: { startsWith: prefix } },
      orderBy: { noKuitansi: 'desc' }
    });
    const nextSeq = lastTrx ? parseInt(lastTrx.noKuitansi.slice(prefix.length), 10) + 1 : 1;
    const noKuitansi = `${prefix}${nextSeq.toString().padStart(3, '0')}`;

    try {
      return await createFn(noKuitansi);
    } catch (error) {
      if (isUniqueViolation(error) && attempt < MAX_RETRY - 1) continue;
      throw error;
    }
  }
  throw new Error('Gagal menghasilkan nomor kuitansi unik setelah beberapa percobaan');
}

// NIP pegawai: PGW-YYYY-XXX
export async function withUniqueNip<T>(
  prisma: PrismaClient,
  createFn: (nip: string) => Promise<T>
): Promise<T> {
  const year = new Date().getFullYear().toString();
  const prefix = `PGW-${year}-`;

  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    const last = await prisma.pegawai.findFirst({
      where: { nip: { startsWith: prefix } },
      orderBy: { nip: 'desc' }
    });
    const nextSeq = last ? parseInt(last.nip.slice(prefix.length), 10) + 1 : 1;
    const nip = `${prefix}${nextSeq.toString().padStart(3, '0')}`;

    try {
      return await createFn(nip);
    } catch (error) {
      if (isUniqueViolation(error) && attempt < MAX_RETRY - 1) continue;
      throw error;
    }
  }
  throw new Error('Gagal menghasilkan NIP unik setelah beberapa percobaan');
}
