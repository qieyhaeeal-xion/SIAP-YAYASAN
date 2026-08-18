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

export interface BiayaMaster {
  id: string;
  namaBiaya: string;
  kodeBiaya?: string;
  jenis?: 'Tahunan' | 'Syahriyah' | 'Non-Syahriyah';
  tipeFrekuensi?: string;
  nominal?: number;
  nominalStandard?: number;
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
  nominalTagihan: number;
  nominalTerbayar: number;
  status: 'Lunas' | 'Sebagian' | 'Belum Lunas';
  tanggalJatuhTempo?: string;
  tahunAjaranId?: string;
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
