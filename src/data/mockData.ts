import {
  UnitPesantren,
  Asrama,
  Kamar,
  MarhalahMadin,
  KelasMadin,
  KitabHafalan,
  UnitSekolah,
  JurusanSekolah,
  KelasSekolah,
  Santri,
  SetoranTahfidz,
  SetoranNadhoman,
  CatatanKesehatanUKS,
  PerizinanSantri,
  LogKonseling,
  KunjunganSantri,
  Jabatan,
  Pegawai,
  BiayaMaster,
  TagihanKeuangan,
  TransaksiPembayaran,
  PendaftarPPDB,
  UserProfile,
  PresensiRecord,
  TahunAjaran,
  PesertaTahfidz,
  BiayaKategori,
  TarifPembayaran,
  JenjangSekolah,
  bulanKeLabel,
  DistribusiKeuanganConfig,
  Pemasukan,
  AlokasiPemasukan,
  AuditLog
} from '../types/sisantri';

export const INITIAL_TAHUN_AJARAN: TahunAjaran[] = [
  {
    id: 'ta-2526',
    kodeTahunAjaran: '2025/2026',
    tanggalMulai: '2025-07-01',
    tanggalSelesai: '2026-06-30',
    isAktif: true,
  },
  {
    id: 'ta-2425',
    kodeTahunAjaran: '2024/2025',
    tanggalMulai: '2024-07-01',
    tanggalSelesai: '2025-06-30',
    isAktif: false,
  },
];

export const INITIAL_UNITS_PESANTREN: UnitPesantren[] = [
  { id: 'up-1', kodeUnit: 'UPS-01', namaUnit: 'Pusat As-Syafa\'at', deskripsi: 'Kompleks Pusat Santri Putra & Pengasuhan Utama' },
  { id: 'up-2', kodeUnit: 'UPS-02', namaUnit: 'Kompleks Al-Mukhtar', deskripsi: 'Kompleks Santri Putri & Tahfidz Quran' },
  { id: 'up-3', kodeUnit: 'UPS-03', namaUnit: 'Kompleks Nurul Huda', deskripsi: 'Kompleks Khusus Santri SMK & Vokasi' },
];

export const INITIAL_ASRAMA: Asrama[] = [
  { id: 'asr-1', unitPesantrenId: 'up-1', kodeAsrama: 'ASR-A', namaAsrama: 'Darussalam (Putra A)', pembina: 'Ust. Ahmad Fauzi', kapasitas: 120 },
  { id: 'asr-2', unitPesantrenId: 'up-1', kodeAsrama: 'ASR-B', namaAsrama: 'Al-Ghazali (Putra B)', pembina: 'Ust. Muhammad Zaki', kapasitas: 100 },
  { id: 'asr-3', unitPesantrenId: 'up-2', kodeAsrama: 'ASR-C', namaAsrama: 'Khadijah (Putri A)', pembina: 'Ustadzah Nurul Latifah', kapasitas: 150 },
];

export const INITIAL_KAMAR: Kamar[] = [
  { id: 'kmr-1', asramaId: 'asr-1', kodeKamar: 'KMR-A01', namaKamar: 'Kamar Abu Bakar (01)', kapasitas: 12, terisi: 10 },
  { id: 'kmr-2', asramaId: 'asr-1', kodeKamar: 'KMR-A02', namaKamar: 'Kamar Umar bin Khattab (02)', kapasitas: 12, terisi: 11 },
  { id: 'kmr-3', asramaId: 'asr-2', kodeKamar: 'KMR-B01', namaKamar: 'Kamar Ali bin Abi Thalib (01)', kapasitas: 10, terisi: 9 },
  { id: 'kmr-4', asramaId: 'asr-3', kodeKamar: 'KMR-C01', namaKamar: 'Kamar Aisyah (01)', kapasitas: 15, terisi: 14 },
];

export const INITIAL_MARHALAH_MADIN: MarhalahMadin[] = [
  { id: 'mrh-1', kodeMarhalah: 'ULA', namaMarhalah: 'Madrasah Diniyah Ula (Dasar)', tingkat: 1 },
  { id: 'mrh-2', kodeMarhalah: 'WUSTHO', namaMarhalah: 'Madrasah Diniyah Wustho (Menengah)', tingkat: 2 },
  { id: 'mrh-3', kodeMarhalah: 'ULYA', namaMarhalah: 'Madrasah Diniyah Ulya (Tinggi)', tingkat: 3 },
];

export const INITIAL_KELAS_MADIN: KelasMadin[] = [
  { id: 'km-1', marhalahId: 'mrh-1', namaKelas: '1 Ula A', waliKelas: 'Ust. Syamsul Arifin' },
  { id: 'km-2', marhalahId: 'mrh-1', namaKelas: '2 Ula B', waliKelas: 'Ust. Abdul Halim' },
  { id: 'km-3', marhalahId: 'mrh-2', namaKelas: '1 Wustho A', waliKelas: 'Ust. Hasan Basri' },
  { id: 'km-4', marhalahId: 'mrh-2', namaKelas: '2 Wustho B', waliKelas: 'Ust. Badruddin' },
  { id: 'km-5', marhalahId: 'mrh-3', namaKelas: '1 Ulya A', waliKelas: 'Kiai M. Syafaat' },
];

export const INITIAL_KITAB_HAFALAN: KitabHafalan[] = [
  { id: 'ktb-1', marhalahId: 'mrh-1', namaKitab: 'Aqidatul Awam (Tauhid)', totalBait: 57, pengampu: 'Ust. Ahmad Fauzi' },
  { id: 'ktb-2', marhalahId: 'mrh-2', namaKitab: 'Matan Al-Imriti (Nahwu)', totalBait: 254, pengampu: 'Ust. Hasan Basri' },
  { id: 'ktb-3', marhalahId: 'mrh-3', namaKitab: 'Alfiyah Ibn Malik (Gramatika)', totalBait: 1002, pengampu: 'Kiai M. Syafaat' },
];

export const INITIAL_UNIT_SEKOLAH: UnitSekolah[] = [
  { id: 'sekol-1', kodeSekolah: 'MTS', namaSekolah: 'MTs Mukhtar Syafaat', kepalaSekolah: 'Drs. H. Mabroer, M.Pd' },
  { id: 'sekol-2', kodeSekolah: 'MA', namaSekolah: 'MA Mukhtar Syafaat', kepalaSekolah: 'H. Khoirul Anam, S.Ag' },
  { id: 'sekol-3', kodeSekolah: 'SMK', namaSekolah: 'SMK Mukhtar Syafaat', kepalaSekolah: 'Ahmad Ridwan, S.ST' },
];

export const INITIAL_JURUSAN: JurusanSekolah[] = [
  { id: 'jur-1', sekolahId: 'sekol-2', kodeJurusan: 'MIPA', namaJurusan: 'Matematika & Ilmu Pengetahuan Alam' },
  { id: 'jur-2', sekolahId: 'sekol-2', kodeJurusan: 'IPS', namaJurusan: 'Ilmu Pengetahuan Sosial' },
  { id: 'jur-3', sekolahId: 'sekol-3', kodeJurusan: 'TKJ', namaJurusan: 'Teknik Komputer & Jaringan' },
  { id: 'jur-4', sekolahId: 'sekol-3', kodeJurusan: 'AKL', namaJurusan: 'Akuntansi & Keuangan Lembaga' },
];

export const INITIAL_KELAS_SEKOLAH: KelasSekolah[] = [
  { id: 'ks-1', sekolahId: 'sekol-1', kodeKelas: 'VII-A', namaKelas: 'Kelas VII A MTs', waliKelas: 'Bu Fitriani, S.Pd' },
  { id: 'ks-2', sekolahId: 'sekol-1', kodeKelas: 'VIII-B', namaKelas: 'Kelas VIII B MTs', waliKelas: 'Pak Supriadi, M.Pd' },
  { id: 'ks-3', sekolahId: 'sekol-2', jurusanId: 'jur-1', kodeKelas: 'X-MIPA-1', namaKelas: 'Kelas X MIPA 1 MA', waliKelas: 'Bu Sri Wahyuni, M.Si' },
  { id: 'ks-4', sekolahId: 'sekol-3', jurusanId: 'jur-3', kodeKelas: 'XI-TKJ-1', namaKelas: 'Kelas XI TKJ 1 SMK', waliKelas: 'Pak Arif Rahman, S.Kom' },
];

export const INITIAL_SANTRI: Santri[] = [
  {
    id: 'snt-1',
    nis: '260001',
    status: 'Aktif',
    nik: '3510123456780001',
    nisn: '0081234567',
    namaLengkap: 'Muhammad Farhan Syafiq',
    namaPanggilan: 'Farhan',
    jenisKelamin: 'L',
    tempatLahir: 'Banyuwangi',
    tanggalLahir: '2008-04-12',
    anakKe: 1,
    jumlahSaudara: 3,
    hobi: 'Membaca Kitab & Badminton',
    citaCita: 'Ulama & Akreditator Pendidikan',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    alamat: 'Jl. Raya Tegalsari No. 45',
    rt: '02',
    rw: '03',
    dusun: 'Kradenan',
    desa: 'Tegalsari',
    kecamatan: 'Tegalsari',
    kabupaten: 'Banyuwangi',
    provinsi: 'Jawa Timur',
    kodePos: '68485',
    golonganDarah: 'O',
    riwayatPenyakit: 'Maag Ringan',
    tindakanKesehatan: 'Minum obat lambung teratur saat puasa',
    kondisiSaatIni: 'Sehat',
    unitPesantrenId: 'up-1',
    asramaId: 'asr-1',
    kamarId: 'kmr-1',
    unitSekolahId: 'sekol-2',
    jurusanId: 'jur-1',
    kelasSekolahId: 'ks-3',
    marhalahMadinId: 'mrh-2',
    kelasMadinId: 'km-3',
    sekolahAsal: 'MTs Mukhtar Syafaat',
    tahunLulusSekolahAsal: '2023',
    noKip: 'KIP-2023-88219',
    namaAyah: 'H. Abdullah Mahmud',
    nikAyah: '3510123411110001',
    pekerjaanAyah: 'Wiraswasta / Pedagang',
    penghasilanAyah: 'Rp 4.000.000 - Rp 6.000.000',
    namaIbu: 'Hj. Siti Aminah',
    nikIbu: '3510123422220002',
    pekerjaanIbu: 'Guru Guru',
    penghasilanIbu: 'Rp 2.000.000 - Rp 3.000.000',
    noHpOrtu: '081234567890',
    kategoriUtama: 'Santri',
    tipeAsuh: 'Bukan Asuh',
    program: 'Pelajar',
    tanggalDaftar: '2023-07-10',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'snt-2',
    nis: '260002',
    status: 'Aktif',
    nik: '3510123456780002',
    nisn: '0081234568',
    namaLengkap: 'Ahmad Raihan Kamil',
    namaPanggilan: 'Raihan',
    jenisKelamin: 'L',
    tempatLahir: 'Jember',
    tanggalLahir: '2009-08-25',
    anakKe: 2,
    jumlahSaudara: 2,
    hobi: 'Kaligrafi & Sepak Bola',
    citaCita: 'Arsitek Islami',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    alamat: 'Jl. Pemuda No. 12',
    rt: '01',
    rw: '01',
    dusun: 'Krajan',
    desa: 'Tanggul',
    kecamatan: 'Tanggul',
    kabupaten: 'Jember',
    provinsi: 'Jawa Timur',
    golonganDarah: 'B',
    riwayatPenyakit: 'Asma Ringan saat dingin',
    tindakanKesehatan: 'Menjaga kehangatan kamar',
    kondisiSaatIni: 'Sehat',
    unitPesantrenId: 'up-1',
    asramaId: 'asr-2',
    kamarId: 'kmr-3',
    unitSekolahId: 'sekol-3',
    jurusanId: 'jur-3',
    kelasSekolahId: 'ks-4',
    marhalahMadinId: 'mrh-2',
    kelasMadinId: 'km-4',
    sekolahAsal: 'SMP Negeri 1 Tanggul',
    tahunLulusSekolahAsal: '2024',
    namaAyah: 'Bambang Soeprapto',
    nikAyah: '3509123411110001',
    pekerjaanAyah: 'PNS / ASN',
    penghasilanAyah: 'Rp 5.000.000 - Rp 7.000.000',
    namaIbu: 'Lilik Rahayu',
    nikIbu: '3509123422220002',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    penghasilanIbu: 'Tidak Berpenghasilan',
    noHpOrtu: '081398765432',
    kategoriUtama: 'Santri',
    tipeAsuh: 'Asuh',
    golonganAsuh: 'A1',
    program: 'Pelajar',
    alasanAsuh: 'Bantuan Beasiswa Yatim Prestasi',
    tanggalDaftar: '2024-07-02',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'snt-3',
    nis: '260003',
    status: 'Aktif',
    nik: '3510123456780003',
    nisn: '0091234569',
    namaLengkap: 'Aisyah Nabila Zahra',
    namaPanggilan: 'Aisyah',
    jenisKelamin: 'P',
    tempatLahir: 'Banyuwangi',
    tanggalLahir: '2010-02-14',
    anakKe: 1,
    jumlahSaudara: 2,
    hobi: 'Menulis & Murottal',
    citaCita: 'Dokter & Hafidzah',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    alamat: 'Jl. KH. Harun No. 8',
    rt: '04',
    rw: '02',
    dusun: 'Cangaan',
    desa: 'Genteng Barat',
    kecamatan: 'Genteng',
    kabupaten: 'Banyuwangi',
    provinsi: 'Jawa Timur',
    golonganDarah: 'A',
    riwayatPenyakit: 'Tidak Ada',
    tindakanKesehatan: 'Rutin vitamin harian',
    kondisiSaatIni: 'Sehat',
    unitPesantrenId: 'up-2',
    asramaId: 'asr-3',
    kamarId: 'kmr-4',
    unitSekolahId: 'sekol-1',
    kelasSekolahId: 'ks-1',
    marhalahMadinId: 'mrh-1',
    kelasMadinId: 'km-1',
    sekolahAsal: 'SDN 1 Genteng Barat',
    tahunLulusSekolahAsal: '2024',
    namaAyah: 'Drs. Usman Arifin',
    nikAyah: '3510123433330001',
    pekerjaanAyah: 'Dosen / Pengajar',
    penghasilanAyah: 'Rp 6.000.000 - Rp 10.000.000',
    namaIbu: 'Dr. Hj. Nurjanah',
    nikIbu: '3510123444440002',
    pekerjaanIbu: 'Dokter Umum',
    penghasilanIbu: 'Rp 10.000.000+',
    noHpOrtu: '081555667788',
    kategoriUtama: 'Santri',
    tipeAsuh: 'Bukan Asuh',
    program: 'Pelajar',
    tanggalDaftar: '2024-06-15',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'snt-4',
    nis: '250012',
    status: 'Alumni',
    nik: '3510123456780004',
    nisn: '0071234570',
    namaLengkap: 'Zaidan Zulkarnain',
    namaPanggilan: 'Zaidan',
    jenisKelamin: 'L',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2006-11-05',
    anakKe: 3,
    jumlahSaudara: 3,
    hobi: 'Sains & Robotik',
    citaCita: 'Software Engineer',
    alamat: 'Jl. Darmo Indah No. 90',
    rt: '05',
    rw: '04',
    dusun: 'Darmo',
    desa: 'Wonokromo',
    kecamatan: 'Wonokromo',
    kabupaten: 'Surabaya',
    provinsi: 'Jawa Timur',
    golonganDarah: 'AB',
    riwayatPenyakit: 'Alergi debu',
    tindakanKesehatan: 'Bersihkan kamar berkala',
    kondisiSaatIni: 'Sehat',
    unitPesantrenId: 'up-1',
    asramaId: 'asr-2',
    kamarId: 'kmr-3',
    unitSekolahId: 'sekol-2',
    jurusanId: 'jur-1',
    kelasSekolahId: 'ks-3',
    marhalahMadinId: 'mrh-3',
    kelasMadinId: 'km-5',
    sekolahAsal: 'MTs Mukhtar Syafaat',
    tahunLulusSekolahAsal: '2021',
    namaAyah: 'H. Hasan Zulkarnain',
    nikAyah: '3578123411110001',
    pekerjaanAyah: 'Kontraktor',
    penghasilanAyah: 'Rp 10.000.000+',
    namaIbu: 'Hj. Dewi Rahmawati',
    nikIbu: '3578123422220002',
    pekerjaanIbu: 'Wiraswasta',
    penghasilanIbu: 'Rp 3.000.000 - Rp 5.000.000',
    noHpOrtu: '081233445566',
    kategoriUtama: 'Santri',
    tipeAsuh: 'Bukan Asuh',
    program: 'Lulus',
    alasanKeluar: 'Lulus Pendidikan MA Mukhtar Syafaat',
    tahunKeluar: '2025',
    noHpAlumni: '087788990011',
    statusAlumniDetail: 'Kuliah di UIN Maulana Malik Ibrahim Malang - Teknik Informatika',
    tanggalDaftar: '2021-07-01',
    tahunAjaranId: 'ta-2425'
  }
];

// Santri demo untuk melengkapi seluruh jalur Status Santri / Sasaran Pembayaran.
// Semua tetap Aktif agar bisa dipakai untuk preview dan generate tagihan.
const createDemoStatusSantri = (overrides: Partial<Santri> & Pick<Santri, 'id' | 'nis' | 'namaLengkap' | 'namaPanggilan' | 'kategoriUtama'>): Santri => ({
  id: overrides.id,
  nis: overrides.nis,
  status: 'Aktif',
  nik: `351099${overrides.nis}01`,
  nisn: `0099${overrides.nis}`,
  namaLengkap: overrides.namaLengkap,
  namaPanggilan: overrides.namaPanggilan,
  jenisKelamin: 'L',
  tempatLahir: 'Banyuwangi',
  tanggalLahir: '2010-01-15',
  anakKe: 1,
  jumlahSaudara: 2,
  hobi: 'Membaca dan olahraga',
  citaCita: 'Pendidik',
  alamat: 'Jl. Demo Pendidikan No. 1',
  rt: '01',
  rw: '01',
  dusun: 'Krajan',
  desa: 'Tegalsari',
  kecamatan: 'Tegalsari',
  kabupaten: 'Banyuwangi',
  provinsi: 'Jawa Timur',
  kodePos: '68485',
  golonganDarah: 'O',
  riwayatPenyakit: 'Tidak Ada',
  tindakanKesehatan: 'Pemeriksaan rutin',
  kondisiSaatIni: 'Sehat',
  unitPesantrenId: 'up-1',
  asramaId: 'asr-1',
  kamarId: 'kmr-1',
  unitSekolahId: 'sekol-1',
  kelasSekolahId: 'ks-1',
  marhalahMadinId: 'mrh-1',
  kelasMadinId: 'km-1',
  sekolahAsal: 'SMP Demo Mukhtar Syafaat',
  tahunLulusSekolahAsal: '2024',
  namaAyah: 'Bapak Demo Santri',
  nikAyah: `351099${overrides.nis}02`,
  pekerjaanAyah: 'Wiraswasta',
  penghasilanAyah: 'Rp 3.000.000 - Rp 5.000.000',
  namaIbu: 'Ibu Demo Santri',
  nikIbu: `351099${overrides.nis}03`,
  pekerjaanIbu: 'Ibu Rumah Tangga',
  penghasilanIbu: 'Tidak Berpenghasilan',
  noHpOrtu: '081200000000',
  tipeAsuh: 'Bukan Asuh',
  golonganAsuh: null,
  program: 'Pelajar',
  tanggalDaftar: '2025-07-01',
  tahunAjaranId: 'ta-2526',
  targetJuz: 2,
  capaianJuz: 1,
  capaianNadhoman: 25,
  statusBerkasKK: true,
  statusBerkasAkta: true,
  statusBerkasIjazah: true,
  ...overrides
});

export const INITIAL_DEMO_STATUS_SANTRI: Santri[] = [
  createDemoStatusSantri({
    id: 'snt-demo-desa', nis: '260010', namaLengkap: 'Daffa Demo Desa', namaPanggilan: 'Daffa', jenisKelamin: 'L',
    kategoriUtama: 'Desa', tipeAsuh: null, golonganAsuh: null, program: null
  }),
  createDemoStatusSantri({
    id: 'snt-demo-bukan-asuh-pengabdian', nis: '260011', namaLengkap: 'Rizky Demo Pengabdian', namaPanggilan: 'Rizky',
    kategoriUtama: 'Santri', tipeAsuh: 'Bukan Asuh', program: 'Pengabdian'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-bukan-asuh-lulus', nis: '260012', namaLengkap: 'Fajar Demo Lulus', namaPanggilan: 'Fajar',
    kategoriUtama: 'Santri', tipeAsuh: 'Bukan Asuh', program: 'Lulus'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a1-pengabdian', nis: '260013', namaLengkap: 'Ilham Demo A1 Pengabdian', namaPanggilan: 'Ilham',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A1', program: 'Pengabdian'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a1-lulus', nis: '260014', namaLengkap: 'Bagas Demo A1 Lulus', namaPanggilan: 'Bagas',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A1', program: 'Lulus'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a2-pelajar', nis: '260015', namaLengkap: 'Rafi Demo A2 Pelajar', namaPanggilan: 'Rafi',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A2', program: 'Pelajar'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a2-pengabdian', nis: '260016', namaLengkap: 'Hafiz Demo A2 Pengabdian', namaPanggilan: 'Hafiz',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A2', program: 'Pengabdian'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a2-lulus', nis: '260017', namaLengkap: 'Naufal Demo A2 Lulus', namaPanggilan: 'Naufal',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A2', program: 'Lulus'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a3-pelajar', nis: '260018', namaLengkap: 'Arif Demo A3 Pelajar', namaPanggilan: 'Arif',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A3', program: 'Pelajar'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a3-pengabdian', nis: '260019', namaLengkap: 'Iqbal Demo A3 Pengabdian', namaPanggilan: 'Iqbal',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A3', program: 'Pengabdian'
  }),
  createDemoStatusSantri({
    id: 'snt-demo-a3-lulus', nis: '260020', namaLengkap: 'Fikri Demo A3 Lulus', namaPanggilan: 'Fikri',
    kategoriUtama: 'Santri', tipeAsuh: 'Asuh', golonganAsuh: 'A3', program: 'Lulus'
  })
];

export const INITIAL_SETORAN_TAHFIDZ: SetoranTahfidz[] = [
  {
    id: 'stf-1',
    santriId: 'snt-1',
    tanggal: '2026-08-01',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 25,
    jenisSetoran: 'Ziyadah',
    nilai: 'A',
    pengampu: 'Ust. M. Syukron',
    catatan: 'Tajwid dan makhraj sangat baik',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'stf-2',
    santriId: 'snt-1',
    tanggal: '2026-08-05',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 26,
    ayatSelesai: 50,
    jenisSetoran: 'Murojaah',
    nilai: 'B',
    pengampu: 'Ust. M. Syukron',
    catatan: 'Kelancaran bagus, tingkatkan murojaah',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'stf-3',
    santriId: 'snt-3',
    tanggal: '2026-08-02',
    juz: 30,
    surah: 'An-Naba - An-Naziat',
    ayatMulai: 1,
    ayatSelesai: 46,
    jenisSetoran: 'Ziyadah',
    nilai: 'A',
    pengampu: 'Ustadzah Nurul Latifah',
    catatan: 'Suara merdu dan tartil',
    tahunAjaranId: 'ta-2526'
  }
];

export const INITIAL_SETORAN_NADHOMAN: SetoranNadhoman[] = [
  {
    id: 'stn-1',
    santriId: 'snt-1',
    tanggal: '2026-08-03',
    namaKitab: 'Matan Al-Imriti (Nahwu)',
    jumlahBaitBaru: 20,
    totalHafalanSelesai: 120,
    penguji: 'Ust. Hasan Basri',
    keterangan: 'Setoran lancar dengan faham murad',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'stn-2',
    santriId: 'snt-2',
    tanggal: '2026-08-04',
    namaKitab: 'Matan Al-Imriti (Nahwu)',
    jumlahBaitBaru: 15,
    totalHafalanSelesai: 85,
    penguji: 'Ust. Hasan Basri',
    keterangan: 'Bagus, lanjutkan bab Maf\'ul Bih',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'stn-3',
    santriId: 'snt-3',
    tanggal: '2026-08-02',
    namaKitab: 'Aqidatul Awam (Tauhid)',
    jumlahBaitBaru: 25,
    totalHafalanSelesai: 57,
    penguji: 'Ust. Ahmad Fauzi',
    keterangan: 'Khatam Kitab Aqidatul Awam!',
    tahunAjaranId: 'ta-2526'
  }
];

export const INITIAL_KESEHATAN_UKS: CatatanKesehatanUKS[] = [
  {
    id: 'uks-1',
    santriId: 'snt-2',
    tanggalSakit: '2026-08-04',
    keluhan: 'Demam dan pusing ringan',
    diagnosa: 'Flu ringan / kelelahan',
    tindakanUks: 'Istirahat di UKS, kompres hangat, Paracetamol 500mg',
    obatDiberikan: 'Paracetamol & Paratusin',
    status: 'Sembuh',
    petugasUks: 'M. Yusuf, Amd.Kep'
  }
];

export const INITIAL_PERIZINAN: PerizinanSantri[] = [
  {
    id: 'izin-1',
    santriId: 'snt-1',
    jenisIzin: 'Izin Pulang',
    alasan: 'Menghadiri Pernikahan Kakak Kandung',
    tanggalKeluar: '2026-08-10',
    tanggalKembaliPlan: '2026-08-12',
    penjemput: 'Bapak H. Abdullah Mahmud (Ayah)',
    statusApproval: 'Menunggu Persetujuan',
    catatanKepengasuhan: 'Persyaratan surat keterangan ortu lengkap'
  },
  {
    id: 'izin-2',
    santriId: 'snt-3',
    jenisIzin: 'Izin Keluar Komplek',
    alasan: 'Membeli perlengkapan sekolah & kitab',
    tanggalKeluar: '2026-08-07',
    tanggalKembaliPlan: '2026-08-07',
    tanggalKembaliReal: '2026-08-07',
    penjemput: 'Sendiri (Diantar Pengurus)',
    statusApproval: 'Disetujui',
    disetujuiOleh: 'Ustadzah Nurul Latifah',
    catatanKepengasuhan: 'Kembali tepat waktu sebelum Maghrib'
  }
];

export const INITIAL_KONSELING: LogKonseling[] = [
  {
    id: 'ksl-1',
    santriId: 'snt-2',
    tanggal: '2026-07-28',
    kategori: 'Bimbingan Konseling',
    deskripsi: 'Adaptasi awal masuk pesantren dan cara bagi waktu sekolah & madin',
    sanksiAtauSolusi: 'Diberikan jadwal harian terstruktur dan pendampingan santri senior',
    konselor: 'Ust. Ahmad Fauzi'
  }
];

export const INITIAL_KUNJUNGAN: KunjunganSantri[] = [
  {
    id: 'knj-1',
    santriId: 'snt-1',
    tanggal: '2026-08-03',
    namaTamu: 'H. Abdullah Mahmud',
    hubungan: 'Ayah Kandung',
    noHpTamu: '081234567890',
    keperluan: 'Mengirim bekal bulanan dan uang saku',
    jamMasuk: '10:00',
    jamKeluar: '11:30'
  }
];

export const INITIAL_JABATAN: Jabatan[] = [
  { id: 'jbt-1', namaJabatan: 'Pengasuh Utama Pesantren', tunjangan: 5000000 },
  { id: 'jbt-2', namaJabatan: 'Kepala Madrasah Diniyah', tunjangan: 3500000 },
  { id: 'jbt-3', namaJabatan: 'Kepala Sekolah Formal', tunjangan: 3500000 },
  { id: 'jbt-4', namaJabatan: 'Ustadh / Pengajar Madin', tunjangan: 2000000 },
  { id: 'jbt-5', namaJabatan: 'Pembina Asrama', tunjangan: 2500000 },
  { id: 'jbt-6', namaJabatan: 'Bendahara Pesantren', tunjangan: 3000000 },
];

export const INITIAL_PEGAWAI: Pegawai[] = [
  {
    id: 'pgw-1',
    nip: 'PGW-2020-001',
    nama: 'Kiai M. Syafaat',
    jenisKelamin: 'L',
    jabatanId: 'jbt-1',
    satminkal: 'Pesantren Mukhtar Syafaat',
    statusPegawai: 'Aktif',
    noHp: '081122334455',
    email: 'kiai.syafaat@mukhtarsyafaat.ac.id',
    tanggalMasuk: '2010-01-01'
  },
  {
    id: 'pgw-2',
    nip: 'PGW-2021-014',
    nama: 'Ust. Ahmad Fauzi',
    jenisKelamin: 'L',
    jabatanId: 'jbt-5',
    satminkal: 'Pesantren Mukhtar Syafaat',
    statusPegawai: 'Aktif',
    noHp: '081233221100',
    email: 'ahmad.fauzi@mukhtarsyafaat.ac.id',
    tanggalMasuk: '2021-06-01'
  },
  {
    id: 'pgw-3',
    nip: 'PGW-2022-022',
    nama: 'Ust. Hasan Basri',
    jenisKelamin: 'L',
    jabatanId: 'jbt-2',
    satminkal: 'Madrasah Diniyah Mukhtar Syafaat',
    statusPegawai: 'Aktif',
    noHp: '081344556677',
    email: 'hasan.basri@mukhtarsyafaat.ac.id',
    tanggalMasuk: '2022-03-15'
  }
];

export const INITIAL_BIAYA_MASTER: BiayaMaster[] = [
  { id: 'by-1', namaBiaya: 'Uang Pangkal & Pendaftaran', jenis: 'Tahunan', tipeFrekuensi: 'Sekali / Tahunan', nominal: 2500000, nominalStandard: 2500000, kategori: 'YAYASAN', kategoriPembayaran: 'Insidental', wajib: true, keterangan: 'Dibayar sekali saat masuk' },
  { id: 'by-yayasan', namaBiaya: 'Syahriyah Yayasan', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 100000, nominalStandard: 100000, kategori: 'YAYASAN', kategoriPembayaran: 'Rutin', wajib: true, keterangan: 'Iuran keuangan yayasan bulanan' },
  { id: 'by-sekolah', namaBiaya: 'SPP Sekolah', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 150000, nominalStandard: 150000, kategori: 'SEKOLAH', kategoriPembayaran: 'Rutin', wajib: true, keterangan: 'SPP pendidikan formal (MTs/MA/SMK)' },
  { id: 'by-pesantren', namaBiaya: 'Syahriyah Pesantren', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 200000, nominalStandard: 200000, kategori: 'PESANTREN', kategoriPembayaran: 'Rutin', wajib: true, keterangan: 'SPP kepesantrenan & asrama' },
  { id: 'by-makan', namaBiaya: 'Uang Makan', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 250000, nominalStandard: 250000, kategori: 'MAKAN', kategoriPembayaran: 'Rutin', wajib: true, keterangan: 'Biaya konsumsi santri bulanan' },
  { id: 'by-madin', namaBiaya: 'Syahriyah Madin', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 75000, nominalStandard: 75000, kategori: 'MADIN', kategoriPembayaran: 'Rutin', wajib: true, keterangan: 'SPP diniyah (Madin)' },
  { id: 'by-4', namaBiaya: 'Seragam & Perlengkapan Kitab', jenis: 'Non-Syahriyah', tipeFrekuensi: 'Tahunan', nominal: 750000, nominalStandard: 750000, kategori: 'PESANTREN', kategoriPembayaran: 'Insidental', wajib: true, keterangan: 'Paket kitab matan & seragam pesantren' },

  // Jenis pembayaran demo untuk menguji seluruh jalur Status Santri / Sasaran.
  { id: 'by-demo-status-desa', kodeBiaya: 'DEMO-DESA', namaBiaya: '[DEMO] Iuran Pendidikan Desa', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 75000, nominalStandard: 75000, kategori: 'SEKOLAH', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Desa', wajib: true, aktif: true, keterangan: 'Demo: Santri kategori Desa' },
  { id: 'by-demo-status-bukan-asuh-pelajar', kodeBiaya: 'DEMO-BA-PELAJAR', namaBiaya: '[DEMO] Iuran Bukan Asuh Pelajar', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 100000, nominalStandard: 100000, kategori: 'PESANTREN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pelajar', wajib: true, aktif: true, keterangan: 'Demo: Santri > Bukan Asuh > Pelajar' },
  { id: 'by-demo-status-bukan-asuh-pengabdian', kodeBiaya: 'DEMO-BA-PENGABDIAN', namaBiaya: '[DEMO] Iuran Bukan Asuh Pengabdian', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 50000, nominalStandard: 50000, kategori: 'YAYASAN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pengabdian', wajib: true, aktif: true, keterangan: 'Demo: Santri > Bukan Asuh > Pengabdian' },
  { id: 'by-demo-status-bukan-asuh-lulus', kodeBiaya: 'DEMO-BA-LULUS', namaBiaya: '[DEMO] Administrasi Bukan Asuh Lulus', jenis: 'Non-Syahriyah', tipeFrekuensi: 'Sekali Bayar', nominal: 25000, nominalStandard: 25000, kategori: 'YAYASAN', kategoriPembayaran: 'Insidental', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Lulus', wajib: true, aktif: true, keterangan: 'Demo: Santri > Bukan Asuh > Lulus' },
  { id: 'by-demo-status-a1-pelajar', kodeBiaya: 'DEMO-A1-PELAJAR', namaBiaya: '[DEMO] Iuran Asuh A1 Pelajar', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 50000, nominalStandard: 50000, kategori: 'PESANTREN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Pelajar', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A1 > Pelajar' },
  { id: 'by-demo-status-a1-pengabdian', kodeBiaya: 'DEMO-A1-PENGABDIAN', namaBiaya: '[DEMO] Iuran Asuh A1 Pengabdian', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 25000, nominalStandard: 25000, kategori: 'YAYASAN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Pengabdian', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A1 > Pengabdian' },
  { id: 'by-demo-status-a1-lulus', kodeBiaya: 'DEMO-A1-LULUS', namaBiaya: '[DEMO] Administrasi Asuh A1 Lulus', jenis: 'Non-Syahriyah', tipeFrekuensi: 'Sekali Bayar', nominal: 25000, nominalStandard: 25000, kategori: 'YAYASAN', kategoriPembayaran: 'Insidental', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Lulus', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A1 > Lulus' },
  { id: 'by-demo-status-a2-pelajar', kodeBiaya: 'DEMO-A2-PELAJAR', namaBiaya: '[DEMO] Iuran Asuh A2 Pelajar', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 75000, nominalStandard: 75000, kategori: 'PESANTREN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Pelajar', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A2 > Pelajar' },
  { id: 'by-demo-status-a2-pengabdian', kodeBiaya: 'DEMO-A2-PENGABDIAN', namaBiaya: '[DEMO] Iuran Asuh A2 Pengabdian', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 35000, nominalStandard: 35000, kategori: 'YAYASAN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Pengabdian', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A2 > Pengabdian' },
  { id: 'by-demo-status-a2-lulus', kodeBiaya: 'DEMO-A2-LULUS', namaBiaya: '[DEMO] Administrasi Asuh A2 Lulus', jenis: 'Non-Syahriyah', tipeFrekuensi: 'Sekali Bayar', nominal: 25000, nominalStandard: 25000, kategori: 'YAYASAN', kategoriPembayaran: 'Insidental', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Lulus', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A2 > Lulus' },
  { id: 'by-demo-status-a3-pelajar', kodeBiaya: 'DEMO-A3-PELAJAR', namaBiaya: '[DEMO] Iuran Asuh A3 Pelajar', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 100000, nominalStandard: 100000, kategori: 'PESANTREN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Pelajar', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A3 > Pelajar' },
  { id: 'by-demo-status-a3-pengabdian', kodeBiaya: 'DEMO-A3-PENGABDIAN', namaBiaya: '[DEMO] Iuran Asuh A3 Pengabdian', jenis: 'Syahriyah', tipeFrekuensi: 'Bulanan', nominal: 50000, nominalStandard: 50000, kategori: 'YAYASAN', kategoriPembayaran: 'Rutin', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Pengabdian', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A3 > Pengabdian' },
  { id: 'by-demo-status-a3-lulus', kodeBiaya: 'DEMO-A3-LULUS', namaBiaya: '[DEMO] Administrasi Asuh A3 Lulus', jenis: 'Non-Syahriyah', tipeFrekuensi: 'Sekali Bayar', nominal: 25000, nominalStandard: 25000, kategori: 'YAYASAN', kategoriPembayaran: 'Insidental', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Lulus', wajib: true, aktif: true, keterangan: 'Demo: Santri > Asuh > A3 > Lulus' },
];

const KATEGORI_BIAYA_ID: Record<BiayaKategori, string> = {
  YAYASAN: 'by-yayasan',
  SEKOLAH: 'by-sekolah',
  PESANTREN: 'by-pesantren',
  MAKAN: 'by-makan',
  MADIN: 'by-madin'
};

type DemoTarifProfile = {
  key: string;
  targetKategoriUtama: 'Santri' | 'Desa';
  targetTipeAsuh?: 'Asuh' | 'Bukan Asuh';
  targetGolonganAsuh?: 'A1' | 'A2' | 'A3';
  targetProgram?: 'Pengabdian' | 'Lulus' | 'Pelajar';
  rates: Record<JenjangSekolah, Record<BiayaKategori, number>>;
};

const rates = (
  yayasan: number,
  sekolahSmp: number,
  sekolahSlta: number,
  pesantren: number,
  makan: number,
  madin: number
): Record<JenjangSekolah, Record<BiayaKategori, number>> => ({
  SMP: { YAYASAN: yayasan, SEKOLAH: sekolahSmp, PESANTREN: pesantren, MAKAN: makan, MADIN: madin },
  SLTA: { YAYASAN: yayasan, SEKOLAH: sekolahSlta, PESANTREN: pesantren, MAKAN: makan, MADIN: madin }
});

// Tarif demo sementara. MA, SMA, dan SMK menggunakan kelompok jenjang SLTA.
const DEMO_TARIF_PROFILES: DemoTarifProfile[] = [
  { key: 'desa', targetKategoriUtama: 'Desa', rates: rates(0, 75000, 100000, 0, 0, 0) },
  { key: 'bukan-asuh-pelajar', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pelajar', rates: rates(100000, 150000, 175000, 200000, 250000, 75000) },
  { key: 'bukan-asuh-pengabdian', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pengabdian', rates: rates(0, 50000, 75000, 100000, 125000, 25000) },
  { key: 'bukan-asuh-lulus', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Lulus', rates: rates(0, 25000, 50000, 50000, 0, 0) },
  { key: 'a1-pelajar', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Pelajar', rates: rates(0, 50000, 75000, 100000, 125000, 25000) },
  { key: 'a1-pengabdian', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Pengabdian', rates: rates(0, 25000, 50000, 50000, 75000, 0) },
  { key: 'a1-lulus', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A1', targetProgram: 'Lulus', rates: rates(0, 0, 0, 25000, 0, 0) },
  { key: 'a2-pelajar', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Pelajar', rates: rates(25000, 75000, 100000, 125000, 150000, 50000) },
  { key: 'a2-pengabdian', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Pengabdian', rates: rates(0, 35000, 50000, 75000, 100000, 25000) },
  { key: 'a2-lulus', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A2', targetProgram: 'Lulus', rates: rates(0, 25000, 35000, 50000, 0, 0) },
  { key: 'a3-pelajar', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Pelajar', rates: rates(50000, 100000, 125000, 150000, 200000, 60000) },
  { key: 'a3-pengabdian', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Pengabdian', rates: rates(25000, 50000, 75000, 100000, 125000, 25000) },
  { key: 'a3-lulus', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Asuh', targetGolonganAsuh: 'A3', targetProgram: 'Lulus', rates: rates(0, 25000, 50000, 50000, 0, 0) }
];

const createDemoTarifPembayaran = (): TarifPembayaran[] => {
  const rows: TarifPembayaran[] = [];
  const levels: JenjangSekolah[] = ['SMP', 'SLTA'];
  const categories: BiayaKategori[] = ['YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN'];

  for (const profile of DEMO_TARIF_PROFILES) {
    for (const level of levels) {
      for (const category of categories) {
        rows.push({
          id: `tarif-demo-${profile.key}-${level.toLowerCase()}-${category.toLowerCase()}`,
          biayaMasterId: KATEGORI_BIAYA_ID[category],
          targetScope: 'Jenjang Sekolah',
          targetValue: level,
          targetKategoriUtama: profile.targetKategoriUtama,
          targetTipeAsuh: profile.targetTipeAsuh,
          targetGolonganAsuh: profile.targetGolonganAsuh,
          targetProgram: profile.targetProgram,
          targetJenjangSekolah: level,
          nominal: profile.rates[level][category],
          wajib: profile.rates[level][category] > 0,
          aktif: true,
          effectiveFrom: '2026-07-01'
        });
      }
    }
  }

  return rows;
};

export const INITIAL_TARIF_PEMBAYARAN: TarifPembayaran[] = [
  {
    id: 'tarif-asuh-sekolah',
    biayaMasterId: 'by-sekolah',
    targetScope: 'Golongan Asuh',
    targetValue: 'A1',
    nominal: 75000,
    wajib: true,
    aktif: true,
    effectiveFrom: '2026-01-01'
  },
  ...createDemoTarifPembayaran()
];

// ── Rekap Syahriyah: 5 kategori (YAYASAN/SEKOLAH/PESANTREN/MAKAN/MADIN) per santri per bulan ──
const NOMINAL_BY_KATEGORI: Record<BiayaKategori, number> = {
  YAYASAN: 100000,
  SEKOLAH: 150000,
  PESANTREN: 200000,
  MAKAN: 250000,
  MADIN: 75000
};

// Snapshot unit per santri (untuk filter PONPES/SMP/MTS/MA/SMK/MADIN)
const UNIT_BY_SANTRI: Record<string, string> = {
  'snt-1': 'MA',
  'snt-2': 'SMK',
  'snt-3': 'MTS'
};

const KATEGORI_ORDER: BiayaKategori[] = ['YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN'];

const getDemoTarifProfile = (santri: Santri): DemoTarifProfile | undefined =>
  DEMO_TARIF_PROFILES.find(profile =>
    profile.targetKategoriUtama === santri.kategoriUtama &&
    (!profile.targetTipeAsuh || profile.targetTipeAsuh === santri.tipeAsuh) &&
    (!profile.targetGolonganAsuh || profile.targetGolonganAsuh === santri.golonganAsuh) &&
    (!profile.targetProgram || profile.targetProgram === santri.program)
  );

const getDemoNominal = (santri: Santri, kategori: BiayaKategori, santriIndex: number): number => {
  const jenjang: JenjangSekolah = santri.unitSekolahId === 'sekol-1' ? 'SMP' : 'SLTA';
  const profileNominal = getDemoTarifProfile(santri)?.rates[jenjang][kategori];
  if (profileNominal !== undefined) return profileNominal;

  const fallbackVariations = [1, 0.9, 1.1, 0.8, 1.2];
  const variation = fallbackVariations[santriIndex % fallbackVariations.length];
  return Math.round((NOMINAL_BY_KATEGORI[kategori] * variation) / 5000) * 5000;
};

function generateMockTagihan(): TagihanKeuangan[] {
  const rows: TagihanKeuangan[] = [];
  const santris = [...INITIAL_SANTRI, ...INITIAL_DEMO_STATUS_SANTRI].filter(santri => santri.status === 'Aktif');
  let seq = 1;

  for (const [santriIndex, santri] of santris.entries()) {
    for (let bulanKe = 1; bulanKe <= 12; bulanKe++) {
      for (const k of KATEGORI_ORDER) {
        const nominal = getDemoNominal(santri, k, santriIndex);
        if (nominal <= 0) continue;

        rows.push({
          id: `tgh-${seq}`,
          santriId: santri.id,
          biayaMasterId: KATEGORI_BIAYA_ID[k],
          noTagihan: `TG-${bulanKe.toString().padStart(2, '0')}-${seq.toString().padStart(3, '0')}`,
          bulanTahun: `${bulanKeLabel(bulanKe)} 2026`,
          bulanPeriode: bulanKeLabel(bulanKe),
          tahunPeriode: 2026,
          bulanKe,
          unitId: UNIT_BY_SANTRI[santri.id] ?? (santri.unitSekolahId === 'sekol-1' ? 'MTS' : 'MA'),
          nominalTagihan: nominal,
          nominalTerbayar: 0,
          status: 'Belum Lunas',
          tanggalJatuhTempo: `2026-${(bulanKe <= 6 ? bulanKe + 6 : bulanKe - 6).toString().padStart(2, '0')}-10`,
          tahunAjaranId: 'ta-2526'
        });
        seq++;
      }
    }
  }
  return rows;
}

export const INITIAL_TAGIHAN: TagihanKeuangan[] = generateMockTagihan();

export const INITIAL_TRANSAKSI: TransaksiPembayaran[] = [];

// ── KONFIGURASI PEMBAGIAN PEMASUKAN (histori berbasis periode) ──
export const INITIAL_DISTRIBUSI_CONFIG: DistribusiKeuanganConfig[] = [
  {
    id: 'dcfg-1',
    name: 'Periode A — Syahriyah 2025/2026 Awal',
    version: 'V-001',
    effectiveFrom: '2025-07-01',
    effectiveUntil: '2025-12-31',
    nominals: { YAYASAN: 100000, MADIN: 75000, SEKOLAH: 125000, PESANTREN: 200000, MAKAN: 250000 },
    status: 'Arsip',
    createdBy: 'K.H. Mukhtar Syafaat',
    createdAt: '2025-06-15T08:00:00.000Z',
    updatedAt: '2025-06-15T08:00:00.000Z'
  },
  {
    id: 'dcfg-2',
    name: 'Periode B — Syahriyah 2026',
    version: 'V-002',
    effectiveFrom: '2026-01-01',
    nominals: { YAYASAN: 100000, MADIN: 75000, SEKOLAH: 150000, PESANTREN: 200000, MAKAN: 250000 },
    status: 'Aktif',
    createdBy: 'K.H. Mukhtar Syafaat',
    createdAt: '2025-12-20T09:30:00.000Z',
    updatedAt: '2025-12-20T09:30:00.000Z'
  }
];

// ── PEMASUKAN & ALOKASI (kosong agar semua demo santri belum membayar) ──
function buildMockPemasukan(): { pemasukan: Pemasukan[]; alokasi: AlokasiPemasukan[] } {
  // Data awal sengaja kosong agar seluruh demo santri dapat diuji sebagai belum membayar.
  return { pemasukan: [], alokasi: [] };
}

const { pemasukan: _pemasukanMock, alokasi: _alokasiMock } = buildMockPemasukan();
export const INITIAL_PEMASUKAN: Pemasukan[] = _pemasukanMock;
export const INITIAL_ALOKASI: AlokasiPemasukan[] = _alokasiMock;

// ── AUDIT TRAIL AWAL ────────────────────────────────────
export const INITIAL_AUDIT_LOG: AuditLog[] = [
  {
    id: 'aud-1',
    action: 'CREATE_PAYMENT',
    entityType: 'Pemasukan',
    entityId: _pemasukanMock[0]?.id ?? 'pmk-0',
    entityLabel: _pemasukanMock[0]?.noPemasukan ?? 'PMK-0000',
    actorId: 'usr-1',
    actorName: 'K.H. Mukhtar Syafaat',
    detail: 'Pencatatan pembayaran Syahriyah Rp 775.000 a.n. Ahmad Fauzi (MA) - distribusi otomatis ke 5 keuangan.',
    after: { status: 'DISTRIBUTED', nominal: 775000, unit: 'MA' },
    createdAt: '2026-08-05T08:00:00.000Z'
  },
  {
    id: 'aud-2',
    action: 'CREATE_PAYMENT',
    entityType: 'Pemasukan',
    entityId: _pemasukanMock[1]?.id ?? 'pmk-0',
    entityLabel: _pemasukanMock[1]?.noPemasukan ?? 'PMK-0000',
    actorId: 'usr-1',
    actorName: 'K.H. Mukhtar Syafaat',
    detail: 'Pencatatan pembayaran Syahriyah Rp 775.000 a.n. Ahmad Fauzi (SMK) - distribusi otomatis ke 5 keuangan.',
    after: { status: 'DISTRIBUTED', nominal: 775000, unit: 'SMK' },
    createdAt: '2026-08-07T09:15:00.000Z'
  },
  {
    id: 'aud-3',
    action: 'DISTRIBUTION_FAILED',
    entityType: 'Pemasukan',
    entityId: _pemasukanMock[3]?.id ?? 'pmk-0',
    entityLabel: _pemasukanMock[3]?.noPemasukan ?? 'PMK-0099',
    actorId: 'usr-1',
    actorName: 'K.H. Mukhtar Syafaat',
    detail: _pemasukanMock[3]?.distribusiError ?? 'Distribusi gagal: total alokasi tidak sesuai nominal pembayaran. Transaksi disimpan dengan status FAILED untuk ditinjau.',
    after: { status: 'FAILED', nominal: 775000, error: _pemasukanMock[3]?.distribusiError },
    createdAt: '2026-08-10T10:00:00.000Z'
  }
];

export const INITIAL_PENDAFTAR_PPDB: PendaftarPPDB[] = [
  {
    id: 'ppdb-1',
    noPendaftaran: 'PPDB-2026-001',
    namaLengkap: 'Fathan Mubin Abdullah',
    jenisKelamin: 'L',
    tempatLahir: 'Banyuwangi',
    tanggalLahir: '2011-05-18',
    namaOrtu: 'Drs. Supriyanto',
    noHpOrtu: '081299887766',
    alamat: 'Jl. Ahmad Yani No. 100 Banyuwangi',
    sekolahAsal: 'SDN 1 Kradenan',
    unitPesantrenPilihanId: 'up-1',
    unitSekolahPilihanId: 'sekol-1',
    marhalahPilihanId: 'mrh-1',
    statusSeleksi: 'Lulus Seleksi',
    tanggalDaftar: '2026-07-20'
  },
  {
    id: 'ppdb-2',
    noPendaftaran: 'PPDB-2026-002',
    namaLengkap: 'Nabila Azzahra Fitri',
    jenisKelamin: 'P',
    tempatLahir: 'Jember',
    tanggalLahir: '2010-09-12',
    namaOrtu: 'H. M. Mansur',
    noHpOrtu: '081388776655',
    alamat: 'Jl. Mastrip No. 12 Jember',
    sekolahAsal: 'MI Negeri 1 Jember',
    unitPesantrenPilihanId: 'up-2',
    unitSekolahPilihanId: 'sekol-2',
    marhalahPilihanId: 'mrh-2',
    statusSeleksi: 'Pendaftaran Baru',
    tanggalDaftar: '2026-08-01'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  { id: 'usr-1', username: 'admin', nama: 'K.H. Mukhtar Syafaat (Admin Yayasan)', role: 'admin_yayasan', email: 'yayasan@mukhtarsyafaat.ac.id' },
  { id: 'usr-2', username: 'pengurus', nama: 'Ust. Ahmad Fauzi (Pengurus Pesantren)', role: 'pengurus', email: 'pengurus@mukhtarsyafaat.ac.id' },
  { id: 'usr-3', username: 'guru_halim', nama: 'Ust. Abdul Halim, S.Pd.I (Guru / Ustadz)', role: 'guru', email: 'guru@mukhtarsyafaat.ac.id' },
  { id: 'usr-4', username: 'walisyafiq', nama: 'H. Abdullah Mahmud (Wali Santri Farhan)', role: 'wali_santri', email: 'wali@gmail.com', santriIdAssociated: 'snt-1' }
];

export const INITIAL_PRESENSI: PresensiRecord[] = [
  { id: 'prs-1', tanggal: '2026-08-08', tipe: 'Madin', kelasId: 'km-3', santriId: 'snt-1', status: 'Hadir', keterangan: 'Tepat Waktu', tahunAjaranId: 'ta-2526' },
  { id: 'prs-2', tanggal: '2026-08-08', tipe: 'Madin', kelasId: 'km-4', santriId: 'snt-2', status: 'Sakit', keterangan: 'Istirahat di UKS', tahunAjaranId: 'ta-2526' },
  { id: 'prs-3', tanggal: '2026-08-08', tipe: 'Madin', kelasId: 'km-1', santriId: 'snt-3', status: 'Hadir', keterangan: 'Tepat Waktu', tahunAjaranId: 'ta-2526' },
];

export const INITIAL_PESERTA_TAHFIDZ: PesertaTahfidz[] = [
  {
    id: 'pt-1',
    santriId: 'snt-1',
    tahunAjaranId: 'ta-2526',
    tanggalDaftar: '2025-07-15',
    status: 'Aktif'
  },
  {
    id: 'pt-2',
    santriId: 'snt-3',
    tahunAjaranId: 'ta-2526',
    tanggalDaftar: '2025-07-20',
    status: 'Aktif'
  }
];
