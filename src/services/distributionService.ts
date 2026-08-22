import {
  KonteksKeuangan,
  NominalMap,
  DEFAULT_SYAHRIAH_NOMINALS,
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
  items: { konteks: KonteksKeuangan; nominal: number }[];
}

export interface AlokasiResult {
  konteks: KonteksKeuangan;
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

export function getConfigNominals(config: { nominals?: NominalMap }): NominalMap {
  return { ...DEFAULT_SYAHRIAH_NOMINALS, ...(config.nominals ?? {}) };
}

export function sumNominal(nominals: NominalMap): number {
  return KONTEKS_KEUANGAN_ORDER.reduce((sum, k) => sum + Math.floor(nominals[k] ?? 0), 0);
}

// Validasi aturan keamanan data: semua nominal harus bilangan bulat positif atau nol,
// dan total akhir Syahriyah harus lebih dari nol.
export function validateDistribution(nominals: NominalMap): DistributionValidation {
  const errors: string[] = [];
  for (const k of KONTEKS_KEUANGAN_ORDER) {
    const v = nominals[k];
    if (typeof v !== 'number' || Number.isNaN(v) || !Number.isFinite(v)) {
      errors.push(`Nominal ${k} tidak valid.`);
      continue;
    }
    if (!Number.isInteger(v)) errors.push(`Nominal ${k} harus berupa bilangan bulat.`);
    if (v < 0) errors.push(`Nominal ${k} tidak boleh negatif.`);
  }
  const total = sumNominal(nominals);
  if (total <= 0) {
    errors.push('Total akhir Syahriyah harus lebih dari Rp 0.');
  }
  return {
    valid: errors.length === 0,
    total,
    errors,
    items: KONTEKS_KEUANGAN_ORDER.map(k => ({ konteks: k, nominal: nominals[k] ?? 0 }))
  };
}

// Alokasi memakai nominal tetap dari konfigurasi. Jika nominal pembayaran berbeda
// dari total konfigurasi, verifikasi transaksi akan menandainya sebagai gagal.
export function computeDistribution(nominal: number, nominals: NominalMap): AlokasiResult[] {
  const order = KONTEKS_KEUANGAN_ORDER;
  const safeNominal = Math.max(0, Math.floor(nominal));
  const configuredNominals = getConfigNominals({ nominals });
  const totalNominal = sumNominal(configuredNominals);

  if (safeNominal === 0 || totalNominal <= 0) {
    return order.map(k => ({ konteks: k, nominal: 0 }));
  }

  return order.map(k => ({
    konteks: k,
    nominal: Math.floor(configuredNominals[k] ?? 0)
  }));
}

// Bekukan konfigurasi saat transaksi terjadi (snapshot).
export function buildConfigSnapshot(config: DistribusiKeuanganConfig) {
  return {
    name: config.name,
    version: config.version,
    effectiveFrom: config.effectiveFrom,
    effectiveUntil: config.effectiveUntil,
    nominals: getConfigNominals(config)
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

  const alokasi = computeDistribution(input.nominal, getConfigNominals(config));
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
    nominal: a.nominal
  }));

  return { pemasukan, alokasi: alokasiRows };
}
