// Type definitions for SiSantri - SIM Pesantren Mukhtar Syafaat

export type UserRole = 
  | 'admin_yayasan'
  | 'pengurus'
  | 'guru'
  | 'wali_santri'
  | 'admin_sistem'; // alias backward-compatibility untuk admin_yayasan

export interface UserProfile {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  noHp?: string;
  santriIdAssociated?: string; // For Wali Santri role
}

// ---------------- TAHUN AJARAN TYPES ---------------- //

export interface TahunAjaran {
  id: string;
  kodeTahunAjaran: string; // contoh: "2025/2026"
  tanggalMulai: string;
  tanggalSelesai: string;
  isAktif: boolean;
}

// ---------------- KESANTRIAN TYPES ---------------- //

export interface UnitPesantren {
  id: string;
  kodeUnit: string;
  namaUnit: string;
  deskripsi: string;
}

export interface Asrama {
  id: string;
  unitPesantrenId: string;
  kodeAsrama: string;
  namaAsrama: string;
  pembina: string;
  kapasitas: number;
}

export interface Kamar {
  id: string;
  asramaId: string;
  kodeKamar: string;
  namaKamar: string;
  kapasitas: number;
  terisi: number;
}

export interface MarhalahMadin {
  id: string;
  kodeMarhalah: string; // ULA, WUSTHO, ULYA
  namaMarhalah: string;
  tingkat: number;
}

export interface KelasMadin {
  id: string;
  marhalahId: string;
  namaKelas: string; // 1 Ula, 2 Ula, 1 Wustho, etc.
  waliKelas: string;
}

export interface KitabHafalan {
  id: string;
  marhalahId: string;
  namaKitab: string; // e.g. Kitab 1: Aqidatul Awam, Kitab 2: Imriti, Kitab 3: Alfiyah Ibn Malik
  totalBait: number;
  pengampu: string;
}

export interface UnitSekolah {
  id: string;
  kodeSekolah: string; // MTs, MA, SMK
  namaSekolah: string;
  kepalaSekolah: string;
}

export interface JurusanSekolah {
  id: string;
  sekolahId: string;
  kodeJurusan: string;
  namaJurusan: string;
}

export interface KelasSekolah {
  id: string;
  sekolahId: string;
  jurusanId?: string;
  kodeKelas: string; // e.g. VII-A, X-TKJ-1
  namaKelas: string;
  waliKelas: string;
}

// 8 SECTION FORM SANTRI
export interface Santri {
  id: string;
  nis: string; // Auto 6 digits: YY0001 (e.g. 260001)
  status: 'Aktif' | 'Alumni' | 'Non-Aktif' | 'Mutasi';
  
  // Section A: Keterangan Santri
  nik: string;
  nisn: string;
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  anakKe: number;
  jumlahSaudara: number;
  hobi?: string;
  citaCita?: string;
  fotoUrl?: string;

  // Section B: Keterangan Tempat Tinggal
  alamat: string;
  alamatLengkap?: string;
  rt: string;
  rw: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos?: string;

  // Section C: Keterangan Kesehatan
  golonganDarah: 'A' | 'B' | 'AB' | 'O' | '-' | string;
  riwayatPenyakit: string;
  tindakanKesehatan: string;
  kondisiSaatIni: 'Sehat' | 'Dalam Perawatan' | 'Pemulihan';

  // Section D: Keterangan Pendidikan (Internal Dropdowns)
  unitPesantrenId: string;
  asramaId: string;
  kamarId: string;
  unitSekolahId: string;
  jurusanId?: string;
  kelasSekolahId: string;
  marhalahMadinId: string;
  kelasMadinId: string;

  // Section E: Keterangan Riwayat Pendidikan
  sekolahAsal: string;
  alamatSekolahAsal?: string;
  tahunLulusSekolahAsal: string;
  noKip?: string;

  // Section F: Keterangan Orang Tua / Wali
  namaAyah: string;
  nikAyah: string;
  pekerjaanAyah: string;
  penghasilanAyah: string;
  namaIbu: string;
  nikIbu: string;
  pekerjaanIbu: string;
  penghasilanIbu: string;
  namaWali?: string;
  hubunganWali?: string;
  noHpOrtu: string;
  noHp?: string;

  // Section G: Keterangan Santri Asuh
  jenisSantriAsuh: 'Bukan Asuh' | 'ASUH 1' | 'ASUH 2' | 'ASUH 3';
  alasanAsuh?: string;

  // Section H: Keterangan Keluar / Alumni
  alasanKeluar?: string;
  tahunKeluar?: string;
  noHpAlumni?: string;
  statusAlumniDetail?: string;

  // Progress & Berkas Tambahan
  targetJuz?: number;
  capaianJuz?: number;
  capaianNadhoman?: string | number;
  statusBerkasKK?: boolean | string;
  statusBerkasAkta?: boolean | string;
  statusBerkasIjazah?: boolean | string;

  tanggalDaftar: string;
  tahunAjaranId: string;
}

// ---------------- TAHFIDZ & NADHOMAN TYPES ---------------- //

export interface SetoranTahfidz {
  id: string;
  santriId: string;
  tanggal: string;
  juz: number; // 1-30
  surah: string;
  ayatMulai: number;
  ayatSelesai: number;
  jenisSetoran: 'Ziyadah' | 'Murojaah';
  nilai: 'A' | 'B' | 'C';
  pengampu: string;
  catatan: string;
  tahunAjaranId?: string;
}

export interface SetoranNadhoman {
  id: string;
  santriId: string;
  tanggal: string;
  namaKitab?: string; // e.g. Imriti, Alfiyah, Aqidatul Awam
  kitabId?: string;
  baitAwal?: number;
  baitAkhir?: number;
  jumlahBaitBaru?: number;
  totalHafalanSelesai: number; // Cumulative total
  penguji?: string;
  pengampu?: string;
  keterangan?: string;
  catatan?: string;
  tahunAjaranId?: string;
}

// ---------------- KEPENGASUHAN TYPES ---------------- //

export interface CatatanKesehatanUKS {
  id: string;
  santriId: string;
  tanggalSakit?: string;
  tanggalMasuk?: string;
  keluhan: string;
  diagnosa?: string;
  tindakanUks?: string;
  tindakan?: string;
  obatDiberikan?: string;
  status: 'Dalam Perawatan UKS' | 'Sembuh' | 'Dirujuk Rumah Sakit' | string;
  petugasUks?: string;
}

export interface PerizinanSantri {
  id: string;
  santriId: string;
  jenisIzin?: 'Izin Pulang' | 'Izin Keluar Komplek' | 'Izin Sakit/Berobat' | string;
  jenisPerizinan?: string;
  alasan?: string;
  alasanIzin?: string;
  tanggalKeluar?: string;
  tanggalIzin?: string;
  tanggalKembali?: string;
  tanggalKembaliPlan?: string;
  tanggalKembaliReal?: string;
  penjemput?: string;
  statusApproval: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | string;
  disetujuiOleh?: string;
  approver?: string;
  catatanKepengasuhan?: string;
}

export interface LogKonseling {
  id: string;
  santriId: string;
  tanggal: string;
  topik?: string;
  kategori?: 'Bimbingan Konseling' | 'Pelanggaran Disiplin' | 'Prestasi / Apresiasi' | string;
  deskripsi?: string;
  solusiPoin?: string;
  sanksiAtauSolusi?: string;
  konselor?: string;
}

export interface KunjunganSantri {
  id: string;
  santriId: string;
  tanggal: string;
  namaTamu: string;
  hubungan: string;
  noHpTamu: string;
  keperluan: string;
  jamMasuk: string;
  jamKeluar: string;
}

// ---------------- KEPEGAWAIAN TYPES ---------------- //

export interface Jabatan {
  id: string;
  namaJabatan: string;
  tunjangan: number;
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jenisKelamin?: 'L' | 'P';
  jabatanId: string;
  satminkal?: string; // e.g. Pesantren Mukhtar Syafaat, MTs, MA, SMK, Madin
  statusPegawai?: 'Aktif' | 'Non-Aktif';
  statusKepegawaian?: string;
  pendidikanTerakhir?: string;
  noHp: string;
  email?: string;
  tanggalMasuk?: string;
}

// ---------------- AKADEMIK TYPES ---------------- //

export interface PresensiRecord {
  id: string;
  tanggal: string;
  tipe?: 'Formal' | 'Madin' | string;
  kategori?: 'KBM_Madin' | 'KBM_Sekolah' | 'Sholat_Jamaah' | string;
  kelasId?: string; // Kelas Sekolah or Kelas Madin
  santriId: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  keterangan?: string;
  tahunAjaranId?: string;
}

// ---------------- KEUANGAN TYPES ---------------- //

export type BiayaKategori = 'YAYASAN' | 'SEKOLAH' | 'PESANTREN' | 'MAKAN' | 'MADIN';

export interface BiayaMaster {
  id: string;
  namaBiaya: string;
  kodeBiaya?: string;
  jenis?: 'Tahunan' | 'Syahriyah' | 'Non-Syahriyah';
  tipeFrekuensi?: string;
  nominal?: number;
  nominalStandard?: number;
  kategori?: BiayaKategori;
  keterangan?: string;
}

export interface TagihanKeuangan {
  id: string;
  santriId: string;
  biayaMasterId: string;
  noTagihan?: string;
  bulanTahun?: string; // e.g. "Agustus 2026"
  bulanPeriode?: string;
  tahunPeriode?: number | string;
  bulanKe?: number; // 1..12, Juli=1 s/d Juni=12 (tahun ajaran)
  unitId?: string; // PONPES/SMP/MTS/MA/SMK/MADIN
  nominalTagihan: number;
  nominalTerbayar: number;
  status: 'Lunas' | 'Sebagian' | 'Belum Lunas';
  tanggalJatuhTempo?: string;
  tahunAjaranId?: string;
}

export interface RekapKategoriItem {
  nominal: number;
  terbayar: number;
  status: TagihanKeuangan['status'];
}

// Hasil pivot 5 baris tagihan (per kategori) -> 1 baris rekap per santri per bulan
export interface RekapBulananSantri {
  santriId: string;
  namaSantri: string;
  bulanKe: number;
  bulanLabel: string; // "Juli", "Agustus", dst
  unitId?: string; // PONPES/SMP/MTS/MA/SMK/MADIN (dari tagihan)
  kategori: {
    yayasan: RekapKategoriItem;
    sekolah: RekapKategoriItem;
    pesantren: RekapKategoriItem;
    makan: RekapKategoriItem;
    madin: RekapKategoriItem;
  };
  totalTagihan: number;
  totalTerbayar: number;
}

// Mapping biayaMasterId -> kategori (karena kategori hidup di BiayaMaster)
export type KategoriLookup = Record<string, BiayaKategori>;

// Urutan bulan tahun ajaran: Juli=1 .. Juni=12
export const BULAN_KE_LABEL: readonly string[] = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];

export function bulanKeLabel(bulanKe: number): string {
  return BULAN_KE_LABEL[bulanKe - 1] ?? `Bulan ${bulanKe}`;
}

// Fallback untuk data lama yang belum punya bulanKe (parsing dari string "Agustus 2026")
export function bulanKeFromBulanTahun(bulanTahun: string): number | undefined {
  const idx = BULAN_KE_LABEL.findIndex(b => bulanTahun.includes(b));
  return idx >= 0 ? idx + 1 : undefined;
}

function computeStatus(nominal: number, terbayar: number): RekapKategoriItem['status'] {
  if (nominal <= 0) return 'Belum Lunas';
  if (terbayar >= nominal) return 'Lunas';
  if (terbayar > 0) return 'Sebagian';
  return 'Belum Lunas';
}

const KATEGORI_KEY_MAP: Record<BiayaKategori, keyof RekapBulananSantri['kategori']> = {
  YAYASAN: 'yayasan',
  SEKOLAH: 'sekolah',
  PESANTREN: 'pesantren',
  MAKAN: 'makan',
  MADIN: 'madin'
};

const emptyKategori = (): RekapKategoriItem => ({ nominal: 0, terbayar: 0, status: 'Belum Lunas' });

// Pivot 5 baris TagihanKeuangan (per kategori) menjadi satu RekapBulananSantri.
// Param ke-4 opsional: lookup kategori dari biayaMasterList (default 'PESANTREN' bila tidak dikenal).
export function pivotTagihanToRekap(
  tagihanList: TagihanKeuangan[],
  santriId: string,
  bulanKe: number,
  kategoriLookup: KategoriLookup = {}
): RekapBulananSantri {
  const rekap: RekapBulananSantri = {
    santriId,
    namaSantri: '',
    bulanKe,
    bulanLabel: bulanKeLabel(bulanKe),
    kategori: {
      yayasan: emptyKategori(),
      sekolah: emptyKategori(),
      pesantren: emptyKategori(),
      makan: emptyKategori(),
      madin: emptyKategori()
    },
    totalTagihan: 0,
    totalTerbayar: 0
  };

  for (const t of tagihanList) {
    if (t.santriId !== santriId) continue;
    const bKe = t.bulanKe ?? bulanKeFromBulanTahun(t.bulanTahun ?? '');
    if (bKe !== bulanKe) continue;

    const kategori = kategoriLookup[t.biayaMasterId] ?? 'PESANTREN';
    const key = KATEGORI_KEY_MAP[kategori];
    if (!key) continue;

    if (!rekap.unitId && t.unitId) rekap.unitId = t.unitId;

    const item = rekap.kategori[key];
    item.nominal += t.nominalTagihan || 0;
    item.terbayar += t.nominalTerbayar || 0;
    item.status = computeStatus(item.nominal, item.terbayar);
  }

  const kategoriKeys = Object.keys(rekap.kategori) as (keyof RekapBulananSantri['kategori'])[];
  for (const k of kategoriKeys) {
    rekap.totalTagihan += rekap.kategori[k].nominal;
    rekap.totalTerbayar += rekap.kategori[k].terbayar;
  }

  return rekap;
}

// Bikin 1 baris rekap untuk tiap santri (5 kategori terisi 0 bila bulan itu kosong),
// meniru sheet Excel yang menampilkan seluruh santri.
export function buildRekapRows(
  santriList: Santri[],
  tagihanList: TagihanKeuangan[],
  bulanKe: number,
  kategoriLookup: KategoriLookup = {},
  getNamaSantri: (id: string) => string = id => id
): RekapBulananSantri[] {
  return santriList.map(s => {
    const row = pivotTagihanToRekap(tagihanList, s.id, bulanKe, kategoriLookup);
    row.namaSantri = getNamaSantri(s.id);
    return row;
  });
}

export interface TransaksiPembayaran {
  id: string;
  tagihanId: string;
  santriId: string;
  noKuitansi: string;
  tanggal?: string;
  tanggalBayar?: string;
  nominal?: number;
  nominalDibayar?: number;
  metodePembayaran: 'Tunai' | 'Transfer Bank' | 'E-Wallet' | 'Cash' | 'Transfer' | 'VA_Bank' | 'E_Wallet' | string;
  penerima?: string;
  penerimaBendahara?: string;
  catatan?: string;
}

// ---------------- PEMASUKAN & DISTRIBUSI TYPES ---------------- //

// Lima konteks keuangan utama — SEJAJAR (tidak ada induk-anak)
export type KonteksKeuangan = BiayaKategori;

// Urutan tampil konsisten: YAYASAN, MADIN, SEKOLAH, PESANTREN, MAKAN
export const KONTEKS_KEUANGAN_ORDER: readonly KonteksKeuangan[] = ['YAYASAN', 'MADIN', 'SEKOLAH', 'PESANTREN', 'MAKAN'];

export type PercentageMap = Record<KonteksKeuangan, number>;
export type DistribusiStatus = 'Draft' | 'Aktif' | 'Arsip';

// Status proses transaksi pemasukan — bisa dipantau & ditelusuri.
// PENDING  → pembayaran tercatat, belum diproses
// PAID     → pembayaran berhasil diterima
// DISTRIBUTED → pembagian ke 5 keuangan berhasil & terverifikasi
// FAILED   → distribusi gagal (error tersimpan di distribusiError, transaksi tidak hilang)
export type PemasukanStatus = 'PENDING' | 'PAID' | 'DISTRIBUTED' | 'FAILED';

// Konfigurasi pembagian pemasukan santri ke 5 keuangan utama.
// Berbasis periode (effectiveFrom/Until) agar histori aturan tersimpan.
export interface DistribusiKeuanganConfig {
  id: string;
  name: string;
  version: string; // label versi berurutan: V-001, V-002, ...
  effectiveFrom: string; // tanggal mulai berlaku (YYYY-MM-DD)
  effectiveUntil?: string;
  percentages: PercentageMap; // total harus 100
  status: DistribusiStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Satu pembayaran santri = satu pemasukan (identitas transaksi asli).
export interface Pemasukan {
  id: string;
  noPemasukan: string; // identitas transaksi asli (unik)
  santriId: string;
  unitId?: string; // snapshot unit santri saat transaksi (PONPES/SMP/MTS/MA/SMK/MADIN)
  tanggal: string;
  nominal: number;
  jenisPembayaran: string;
  metodePembayaran: string;
  periode: string; // e.g. "Agustus 2026"
  bulanKe?: number;
  tahunAjaranId?: string;
  catatan?: string;
  configId: string; // konfigurasi yang dipakai saat transaksi
  configVersion: string; // label versi konfigurasi (snapshot)
  configSnapshot: {
    name: string;
    version: string;
    effectiveFrom: string;
    effectiveUntil?: string;
    percentages: PercentageMap;
  };
  status: PemasukanStatus;
  paidAt: string; // saat pembayaran diterima
  distributedAt?: string; // saat distribusi selesai
  distribusiError?: string; // pesan error bila status FAILED
  createdBy: string; // operator/petugas pencatat
  createdAt: string;
}

// Hasil bagi satu pemasukan ke satu konteks keuangan (snapshot persentase+nominal).
export interface AlokasiPemasukan {
  id: string;
  pemasukanId: string;
  konteks: KonteksKeuangan;
  persentase: number;
  nominal: number;
}

// ── AUDIT TRAIL ─────────────────────────────────────────
// Rekam siapa-melakukan-apa-kapan-terhadap-data-apa (sebelum & sesudah).
export type AuditAction =
  | 'CREATE_PAYMENT'
  | 'UPDATE_DISTRIBUTION_CONFIG'
  | 'ACTIVATE_DISTRIBUTION_CONFIG'
  | 'DISTRIBUTION_FAILED'
  | 'VIEW_TRANSACTION';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: 'Pemasukan' | 'DistribusiKeuanganConfig';
  entityId: string;
  entityLabel: string; // ringkas (no pemasukan / nama konfigurasi)
  actorId: string;
  actorName: string;
  detail: string; // deskripsi manusiawi
  before?: unknown; // snapshot sebelum perubahan
  after?: unknown; // snapshot sesudah perubahan
  createdAt: string; // ISO timestamp
}

// ---------------- PPDB TYPES ---------------- //

export interface PendaftarPPDB {
  id: string;
  noPendaftaran: string;
  namaLengkap: string;
  jenisKelamin?: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir?: string;
  namaOrtu?: string;
  noHpOrtu: string;
  alamat?: string;
  sekolahAsal: string;
  unitPesantrenPilihanId: string;
  unitSekolahPilihanId: string;
  marhalahPilihanId: string;
  statusSeleksi: 'Pendaftaran Baru' | 'Lulus Seleksi' | 'Ditolak' | 'Telah Dimutasi' | 'Dimutasi ke Santri' | 'Pending' | string;
  tanggalDaftar: string;
}

// ---------------- TAHFIDZ PESERTA TYPES ---------------- //

export interface PesertaTahfidz {
  id: string;
  santriId: string;
  tahunAjaranId: string;
  tanggalDaftar: string;
  status: 'Aktif' | 'Non Aktif' | 'Lulus';
}
