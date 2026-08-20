import {
  KonteksKeuangan,
  PercentageMap,
  KONTEKS_KEUANGAN_ORDER,
  DistribusiKeuanganConfig,
  Pemasukan,
  PemasukanStatus,
  AlokasiPemasukan
} from '../types/sisantri';

// ─────────────────────────────────────────────────────────────
// Domain logic distribusi pemasukan — murni (pure) & testable.
// Tidak boleh menyentuh UI/database langsung.
// ─────────────────────────────────────────────────────────────

export interface DistributionValidation {
  valid: boolean;
  total: number;
  errors: string[];
  items: { konteks: KonteksKeuangan; persentase: number }[];
}

export interface AlokasiResult {
  konteks: KonteksKeuangan;
  persentase: number;
  nominal: number;
}

export interface NewPemasukanInput {
  santriId: string;
  tanggal: string;
  nominal: number;
  jenisPembayaran: string;
  metodePembayaran: string;
  periode: string;
  bulanKe?: number;
  tahunAjaranId?: string;
  catatan?: string;
  createdBy: string;
}

export function sumPercentage(percentages: PercentageMap): number {
  return KONTEKS_KEUANGAN_ORDER.reduce((sum, k) => sum + (percentages[k] ?? 0), 0);
}

// Validasi aturan keamanan data:
// - tidak ada persentase negatif
// - tidak ada persentase > 100%
// - total harus tepat 100% (toleransi float 0.01)
export function validateDistribution(percentages: PercentageMap): DistributionValidation {
  const errors: string[] = [];
  for (const k of KONTEKS_KEUANGAN_ORDER) {
    const v = percentages[k];
    if (typeof v !== 'number' || Number.isNaN(v)) {
      errors.push(`Persentase ${k} tidak valid.`);
      continue;
    }
    if (v < 0) errors.push(`Persentase ${k} tidak boleh negatif.`);
    if (v > 100) errors.push(`Persentase ${k} tidak boleh melebihi 100%.`);
  }
  const total = sumPercentage(percentages);
  if (Math.abs(total - 100) > 0.01) {
    errors.push(`Total persentase harus 100% (saat ini ${total.toFixed(2)}%).`);
  }
  return {
    valid: errors.length === 0,
    total,
    errors,
    items: KONTEKS_KEUANGAN_ORDER.map(k => ({ konteks: k, persentase: percentages[k] ?? 0 }))
  };
}

// Hitung alokasi nominal ke 5 konteks.
// Pembulatan "largest remainder" menjamin TOTAL alokasi SELALU == nominal
// (tidak pernah melebihi, tidak pernah kurang).
export function computeDistribution(nominal: number, percentages: PercentageMap): AlokasiResult[] {
  const order = KONTEKS_KEUANGAN_ORDER;
  const safeNominal = Math.max(0, Math.floor(nominal));
  const totalPct = sumPercentage(percentages);

  if (safeNominal === 0 || totalPct <= 0) {
    return order.map(k => ({ konteks: k, persentase: percentages[k] ?? 0, nominal: 0 }));
  }

  const exact = order.map(k => (safeNominal * (percentages[k] ?? 0)) / totalPct);
  const result = order.map((k, i) => ({
    konteks: k,
    persentase: percentages[k] ?? 0,
    nominal: Math.floor(exact[i])
  }));

  let remainder = safeNominal - result.reduce((a, r) => a + r.nominal, 0);
  const byFrac = order
    .map((k, i) => ({ i, frac: exact[i] - Math.floor(exact[i]) }))
    .sort((a, b) => b.frac - a.frac);

  let idx = 0;
  while (remainder > 0) {
    result[byFrac[idx % byFrac.length].i].nominal++;
    remainder--;
    idx++;
  }
  return result;
}

// Bekukan konfigurasi saat transaksi terjadi (snapshot).
export function buildConfigSnapshot(config: DistribusiKeuanganConfig) {
  return {
    name: config.name,
    version: config.version,
    effectiveFrom: config.effectiveFrom,
    effectiveUntil: config.effectiveUntil,
    percentages: { ...config.percentages }
  };
}

// Verifikasi integritas: total alokasi HARUS sama dengan nominal pembayaran.
// Mengembalikan status DISTRIBUTED bila cocok, FAILED + pesan bila tidak.
export interface DistributionVerification {
  ok: boolean;
  status: PemasukanStatus;
  error?: string;
  totalAlokasi: number;
}

export function verifyDistribution(nominal: number, alokasi: AlokasiResult[]): DistributionVerification {
  const totalAlokasi = alokasi.reduce((a, x) => a + x.nominal, 0);
  if (totalAlokasi === Math.floor(nominal)) {
    return { ok: true, status: 'DISTRIBUTED', totalAlokasi };
  }
  return {
    ok: false,
    status: 'FAILED',
    error: `Total distribusi (${totalAlokasi}) tidak sesuai nominal pembayaran (${Math.floor(nominal)}).`,
    totalAlokasi
  };
}

// Use-case: catat satu pembayaran santri sebagai satu Pemasukan + 5 Alokasi.
// Mengembalikan data siap simpan (belum menyentuh storage/UI).
export function createPemasukanRecord(
  input: NewPemasukanInput,
  config: DistribusiKeuanganConfig,
  seq: number,
  unitId?: string
): { pemasukan: Pemasukan; alokasi: AlokasiPemasukan[] } {
  const nowIso = new Date().toISOString();
  const tanggal = input.tanggal || nowIso.slice(0, 10);
  const noPemasukan = `PMK-${tanggal.replace(/-/g, '')}-${seq.toString().padStart(4, '0')}`;

  const alokasi = computeDistribution(input.nominal, config.percentages);
  const verification = verifyDistribution(input.nominal, alokasi);
  const id = `pmk-${Date.now()}`;

  const pemasukan: Pemasukan = {
    id,
    noPemasukan,
    santriId: input.santriId,
    unitId,
    tanggal,
    nominal: Math.floor(input.nominal),
    jenisPembayaran: input.jenisPembayaran,
    metodePembayaran: input.metodePembayaran,
    periode: input.periode,
    bulanKe: input.bulanKe,
    tahunAjaranId: input.tahunAjaranId,
    catatan: input.catatan,
    configId: config.id,
    configVersion: config.version,
    configSnapshot: buildConfigSnapshot(config),
    status: verification.status,
    paidAt: nowIso,
    distributedAt: verification.ok ? nowIso : undefined,
    distribusiError: verification.ok ? undefined : verification.error,
    createdBy: input.createdBy,
    createdAt: nowIso
  };

  const alokasiRows: AlokasiPemasukan[] = alokasi.map((a, i) => ({
    id: `${id}-alk-${i + 1}`,
    pemasukanId: id,
    konteks: a.konteks,
    persentase: a.persentase,
    nominal: a.nominal
  }));

  return { pemasukan, alokasi: alokasiRows };
}