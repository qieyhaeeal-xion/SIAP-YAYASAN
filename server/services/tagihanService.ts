import { Prisma } from '@prisma/client';

const BULAN_KE_LABEL = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
] as const;

type TagihanClient = Prisma.TransactionClient;

type SantriTarget = {
  id: string;
  status: string;
  kategoriUtama?: string | null;
  tipeAsuh?: string | null;
  golonganAsuh?: string | null;
  program?: string | null;
  unitPesantrenId?: string | null;
  unitSekolahId?: string | null;
};

type BiayaTarget = {
  id: string;
  namaBiaya: string;
  jenis: string;
  tipeFrekuensi: string | null;
  nominal: number;
  aktif: boolean;
  targetKategoriUtama: string | null;
  targetTipeAsuh: string | null;
  targetGolonganAsuh: string | null;
  targetProgram: string | null;
  targetUnitPesantrenId: string | null;
  targetUnitSekolahId: string | null;
};

type TarifTarget = {
  biayaMasterId: string;
  targetScope: string;
  targetValue: string | null;
  nominal: number;
  aktif: boolean;
};

type TahunAjaranTarget = {
  id: string;
  kodeTahunAjaran: string;
};

export function isBiayaTargetMatch(santri: SantriTarget, biaya: BiayaTarget): boolean {
  if (biaya.targetKategoriUtama && santri.kategoriUtama !== biaya.targetKategoriUtama) return false;
  if (biaya.targetTipeAsuh && santri.tipeAsuh !== biaya.targetTipeAsuh) return false;
  if (biaya.targetGolonganAsuh && santri.golonganAsuh !== biaya.targetGolonganAsuh) return false;
  if (biaya.targetProgram && santri.program !== biaya.targetProgram) return false;
  if (biaya.targetUnitPesantrenId && santri.unitPesantrenId !== biaya.targetUnitPesantrenId) return false;
  if (biaya.targetUnitSekolahId && santri.unitSekolahId !== biaya.targetUnitSekolahId) return false;
  return true;
}

function isTarifMatch(santri: SantriTarget, tarif: TarifTarget): boolean {
  switch (tarif.targetScope) {
    case 'Unit Sekolah': return santri.unitSekolahId === tarif.targetValue;
    case 'Unit Pesantren': return santri.unitPesantrenId === tarif.targetValue;
    case 'Kategori Utama': return santri.kategoriUtama === tarif.targetValue;
    case 'Tipe Asuh': return santri.tipeAsuh === tarif.targetValue;
    case 'Golongan Asuh': return santri.golonganAsuh === tarif.targetValue;
    case 'Program': return santri.program === tarif.targetValue;
    default: return true;
  }
}

export function getApplicableNominal(santri: SantriTarget, biaya: BiayaTarget, tariffs: TarifTarget[]): number {
  const tarif = tariffs
    .filter(item => item.biayaMasterId === biaya.id && item.aktif && isTarifMatch(santri, item))
    .sort((a, b) => (a.targetScope === 'Semua Santri' ? 1 : 0) - (b.targetScope === 'Semua Santri' ? 1 : 0))[0];
  return tarif?.nominal ?? biaya.nominal;
}

function academicYearStart(tahunAjaran: TahunAjaranTarget): number {
  const year = Number(tahunAjaran.kodeTahunAjaran.slice(0, 4));
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

export function buildBillingPeriods(
  biaya: BiayaTarget,
  tahunAjaran: TahunAjaranTarget,
  bulanMulai: number,
  bulanSelesai: number
) {
  if (bulanMulai < 1 || bulanSelesai > 12 || bulanMulai > bulanSelesai) return [];
  const recurring = biaya.jenis === 'Syahriyah' || biaya.tipeFrekuensi === 'Bulanan' || biaya.tipeFrekuensi === 'Periodik';
  const months = recurring
    ? Array.from({ length: bulanSelesai - bulanMulai + 1 }, (_, index) => bulanMulai + index)
    : [bulanMulai];
  const startYear = academicYearStart(tahunAjaran);

  return months.map(bulanKe => {
    const year = bulanKe <= 6 ? startYear + 1 : startYear;
    const month = bulanKe <= 6 ? bulanKe : bulanKe - 6;
    return {
      bulanKe,
      bulanTahun: `${BULAN_KE_LABEL[bulanKe - 1]} ${year}`,
      tanggalJatuhTempo: `${year}-${month.toString().padStart(2, '0')}-10`
    };
  });
}

export async function generateTagihanForSantri(
  tx: TagihanClient,
  santri: SantriTarget,
  tahunAjaran: TahunAjaranTarget,
  biayaList: BiayaTarget[],
  tariffs: TarifTarget[],
  bulanMulai: number,
  bulanSelesai: number
) {
  const tagihans: Array<Record<string, unknown>> = [];
  const activeBiaya = biayaList.filter(biaya => biaya.aktif && isBiayaTargetMatch(santri, biaya));

  for (const biaya of activeBiaya) {
    const nominal = getApplicableNominal(santri, biaya, tariffs);
    if (nominal <= 0) continue;
    for (const period of buildBillingPeriods(biaya, tahunAjaran, bulanMulai, bulanSelesai)) {
      const exists = await tx.tagihanKeuangan.findFirst({
        where: {
          santriId: santri.id,
          biayaMasterId: biaya.id,
          tahunAjaranId: tahunAjaran.id,
          bulanTahun: period.bulanTahun
        },
        select: { id: true }
      });
      if (exists) continue;

      tagihans.push({
        santriId: santri.id,
        biayaMasterId: biaya.id,
        bulanTahun: period.bulanTahun,
        bulanKe: period.bulanKe,
        nominalTagihan: nominal,
        nominalTerbayar: 0,
        status: 'Belum Lunas',
        tanggalJatuhTempo: period.tanggalJatuhTempo,
        tahunAjaranId: tahunAjaran.id
      });
    }
  }

  for (const tagihan of tagihans) {
    await tx.tagihanKeuangan.create({ data: tagihan as never });
  }
  return tagihans.length;
}

export { BULAN_KE_LABEL };
