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
  PesertaTahfidz
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
    jenisSantriAsuh: 'Bukan Asuh',
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
    jenisSantriAsuh: 'ASUH 1',
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
    jenisSantriAsuh: 'Bukan Asuh',
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
    jenisSantriAsuh: 'Bukan Asuh',
    alasanKeluar: 'Lulus Pendidikan MA Mukhtar Syafaat',
    tahunKeluar: '2025',
    noHpAlumni: '087788990011',
    statusAlumniDetail: 'Kuliah di UIN Maulana Malik Ibrahim Malang - Teknik Informatika',
    tanggalDaftar: '2021-07-01',
    tahunAjaranId: 'ta-2425'
  }
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
  { id: 'by-1', namaBiaya: 'Uang Pangkal & Pendaftaran', jenis: 'Tahunan', nominal: 2500000, keterangan: 'Dibayar sekali saat masuk' },
  { id: 'by-2', namaBiaya: 'Syahriyah Pesantren (SPP Bulanan)', jenis: 'Syahriyah', nominal: 450000, keterangan: 'Biaya makan, asrama & listrik bulanan' },
  { id: 'by-3', namaBiaya: 'Syahriyah Madin (SPP Diniyah)', jenis: 'Syahriyah', nominal: 100000, keterangan: 'Biaya pendidikan diniyah bulanan' },
  { id: 'by-4', namaBiaya: 'Seragam & Perlengkapan Kitab', jenis: 'Non-Syahriyah', nominal: 750000, keterangan: 'Paket kitab matan & seragam pesantren' },
];

export const INITIAL_TAGIHAN: TagihanKeuangan[] = [
  {
    id: 'tgh-1',
    santriId: 'snt-1',
    biayaMasterId: 'by-2',
    bulanTahun: 'Agustus 2026',
    nominalTagihan: 450000,
    nominalTerbayar: 450000,
    status: 'Lunas',
    tanggalJatuhTempo: '2026-08-10',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'tgh-2',
    santriId: 'snt-2',
    biayaMasterId: 'by-2',
    bulanTahun: 'Agustus 2026',
    nominalTagihan: 450000,
    nominalTerbayar: 0,
    status: 'Belum Lunas',
    tanggalJatuhTempo: '2026-08-10',
    tahunAjaranId: 'ta-2526'
  },
  {
    id: 'tgh-3',
    santriId: 'snt-3',
    biayaMasterId: 'by-2',
    bulanTahun: 'Agustus 2026',
    nominalTagihan: 450000,
    nominalTerbayar: 200000,
    status: 'Sebagian',
    tanggalJatuhTempo: '2026-08-10',
    tahunAjaranId: 'ta-2526'
  }
];

export const INITIAL_TRANSAKSI: TransaksiPembayaran[] = [
  {
    id: 'trx-1',
    tagihanId: 'tgh-1',
    santriId: 'snt-1',
    noKuitansi: 'KW-20260801-001',
    tanggal: '2026-08-01',
    nominal: 450000,
    metodePembayaran: 'Transfer Bank',
    penerima: 'H. Ahmad Rifa\'i (Bendahara)',
    catatan: 'Pembayaran Syahriyah Lunas via Bank Syariah Indonesia'
  },
  {
    id: 'trx-2',
    tagihanId: 'tgh-3',
    santriId: 'snt-3',
    noKuitansi: 'KW-20260805-002',
    tanggal: '2026-08-05',
    nominal: 200000,
    metodePembayaran: 'Tunai',
    penerima: 'H. Ahmad Rifa\'i (Bendahara)',
    catatan: 'Pembayaran Syahriyah Sebagian (Sisa Rp 250.000)'
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
