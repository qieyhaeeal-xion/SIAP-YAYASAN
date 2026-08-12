import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Santri,
  UnitPesantren,
  Asrama,
  Kamar,
  MarhalahMadin,
  KelasMadin,
  KitabHafalan,
  UnitSekolah,
  JurusanSekolah,
  KelasSekolah,
  SetoranTahfidz,
  SetoranNadhoman,
  CatatanKesehatanUKS,
  PerizinanSantri,
  LogKonseling,
  KunjunganSantri,
  Pegawai,
  Jabatan,
  BiayaMaster,
  TagihanKeuangan,
  TransaksiPembayaran,
  PendaftarPPDB,
  UserProfile,
  UserRole,
  PresensiRecord,
  TahunAjaran,
  PesertaTahfidz
} from '../types/sisantri';

import {
  INITIAL_UNITS_PESANTREN,
  INITIAL_ASRAMA,
  INITIAL_KAMAR,
  INITIAL_MARHALAH_MADIN,
  INITIAL_KELAS_MADIN,
  INITIAL_KITAB_HAFALAN,
  INITIAL_UNIT_SEKOLAH,
  INITIAL_JURUSAN,
  INITIAL_KELAS_SEKOLAH,
  INITIAL_SANTRI,
  INITIAL_SETORAN_TAHFIDZ,
  INITIAL_SETORAN_NADHOMAN,
  INITIAL_KESEHATAN_UKS,
  INITIAL_PERIZINAN,
  INITIAL_KONSELING,
  INITIAL_KUNJUNGAN,
  INITIAL_PEGAWAI,
  INITIAL_JABATAN,
  INITIAL_BIAYA_MASTER,
  INITIAL_TAGIHAN,
  INITIAL_TRANSAKSI,
  INITIAL_PENDAFTAR_PPDB,
  INITIAL_USERS,
  INITIAL_PRESENSI,
  INITIAL_TAHUN_AJARAN,
  INITIAL_PESERTA_TAHFIDZ
} from '../data/mockData';

interface AppContextType {
  // Mode & Auth
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  users: UserProfile[];

  // Tahun Ajaran
  tahunAjaranList: TahunAjaran[];
  addTahunAjaran: (item: Omit<TahunAjaran, 'id'>) => void;
  updateTahunAjaran: (id: string, item: Partial<TahunAjaran>) => void;
  getTahunAjaranAktif: () => TahunAjaran | undefined;

  // Master Kesantrian
  unitsPesantren: UnitPesantren[];
  addUnitPesantren: (item: Omit<UnitPesantren, 'id'>) => void;
  updateUnitPesantren: (id: string, item: Partial<UnitPesantren>) => void;
  deleteUnitPesantren: (id: string) => void;

  asramaList: Asrama[];
  addAsrama: (item: Omit<Asrama, 'id'>) => void;
  updateAsrama: (id: string, item: Partial<Asrama>) => void;
  deleteAsrama: (id: string) => void;

  kamarList: Kamar[];
  addKamar: (item: Omit<Kamar, 'id'>) => void;
  updateKamar: (id: string, item: Partial<Kamar>) => void;
  deleteKamar: (id: string) => void;

  marhalahList: MarhalahMadin[];
  addMarhalah: (item: Omit<MarhalahMadin, 'id'>) => void;
  updateMarhalah: (id: string, item: Partial<MarhalahMadin>) => void;
  deleteMarhalah: (id: string) => void;

  kelasMadinList: KelasMadin[];
  addKelasMadin: (item: Omit<KelasMadin, 'id'>) => void;
  updateKelasMadin: (id: string, item: Partial<KelasMadin>) => void;
  deleteKelasMadin: (id: string) => void;

  kitabList: KitabHafalan[];
  addKitab: (item: Omit<KitabHafalan, 'id'>) => void;
  updateKitab: (id: string, item: Partial<KitabHafalan>) => void;
  deleteKitab: (id: string) => void;

  unitSekolahList: UnitSekolah[];
  addUnitSekolah: (item: Omit<UnitSekolah, 'id'>) => void;
  updateUnitSekolah: (id: string, item: Partial<UnitSekolah>) => void;
  deleteUnitSekolah: (id: string) => void;

  jurusanList: JurusanSekolah[];
  addJurusan: (item: Omit<JurusanSekolah, 'id'>) => void;
  updateJurusan: (id: string, item: Partial<JurusanSekolah>) => void;
  deleteJurusan: (id: string) => void;

  kelasSekolahList: KelasSekolah[];
  addKelasSekolah: (item: Omit<KelasSekolah, 'id'>) => void;
  updateKelasSekolah: (id: string, item: Partial<KelasSekolah>) => void;
  deleteKelasSekolah: (id: string) => void;

  // Santri
  santriList: Santri[];
  addSantri: (santriData: Omit<Santri, 'id' | 'nis'>) => Santri;
  updateSantri: (id: string, santriData: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;

  // Tahfidz & Nadhoman
  setoranTahfidzList: SetoranTahfidz[];
  addSetoranTahfidz: (item: Omit<SetoranTahfidz, 'id'>) => void;

  setoranNadhomanList: SetoranNadhoman[];
  addSetoranNadhoman: (item: Omit<SetoranNadhoman, 'id' | 'totalHafalanSelesai'>) => void;

  // Peserta Tahfidz
  pesertaTahfidzList: PesertaTahfidz[];
  addPesertaTahfidz: (item: Omit<PesertaTahfidz, 'id' | 'tanggalDaftar'>) => void;
  updateStatusPeserta: (id: string, status: PesertaTahfidz['status']) => void;

  // Kepengasuhan
  kesehatanList: CatatanKesehatanUKS[];
  addKesehatan: (item: Omit<CatatanKesehatanUKS, 'id'>) => void;
  updateKesehatanStatus: (id: string, status: CatatanKesehatanUKS['status']) => void;

  perizinanList: PerizinanSantri[];
  addPerizinan: (item: Omit<PerizinanSantri, 'id'>) => void;
  updatePerizinanStatus: (id: string, status: PerizinanSantri['statusApproval'], approver?: string) => void;

  konselingList: LogKonseling[];
  addKonseling: (item: Omit<LogKonseling, 'id'>) => void;

  kunjunganList: KunjunganSantri[];
  addKunjungan: (item: Omit<KunjunganSantri, 'id'>) => void;

  // Kepegawaian
  jabatanList: Jabatan[];
  pegawaiList: Pegawai[];
  addPegawai: (item: Omit<Pegawai, 'id' | 'nip'>) => void;
  updatePegawai: (id: string, item: Partial<Pegawai>) => void;

  // Akademik & Presensi
  presensiList: PresensiRecord[];
  savePresensiBatch: (records: Omit<PresensiRecord, 'id'>[]) => void;

  // Keuangan
  biayaMasterList: BiayaMaster[];
  tagihanList: TagihanKeuangan[];
  transaksiList: TransaksiPembayaran[];
  addBayarTagihan: (tagihanId: string, nominal: number, metode: TransaksiPembayaran['metodePembayaran'], catatan?: string) => void;

  // PPDB
  ppdbList: PendaftarPPDB[];
  addPPDB: (item: Omit<PendaftarPPDB, 'id' | 'noPendaftaran' | 'statusSeleksi' | 'tanggalDaftar'>) => void;
  updatePPDBStatus: (id: string, status: PendaftarPPDB['statusSeleksi']) => void;
  mutasiPPDBKeSantri: (ppdbId: string) => Santri | null;

  // Utility
  generateNextNIS: () => string;
  getSantriNameById: (id: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'sisantri_app_';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [users] = useLocalStorage<UserProfile[]>('users', INITIAL_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<UserProfile>('currentUser', INITIAL_USERS[0]);

  // Master data state
  const [unitsPesantren, setUnitsPesantren] = useLocalStorage<UnitPesantren[]>('unitsPesantren', INITIAL_UNITS_PESANTREN);
  const [asramaList, setAsramaList] = useLocalStorage<Asrama[]>('asramaList', INITIAL_ASRAMA);
  const [kamarList, setKamarList] = useLocalStorage<Kamar[]>('kamarList', INITIAL_KAMAR);
  const [marhalahList, setMarhalahList] = useLocalStorage<MarhalahMadin[]>('marhalahList', INITIAL_MARHALAH_MADIN);
  const [kelasMadinList, setKelasMadinList] = useLocalStorage<KelasMadin[]>('kelasMadinList', INITIAL_KELAS_MADIN);
  const [kitabList, setKitabList] = useLocalStorage<KitabHafalan[]>('kitabList', INITIAL_KITAB_HAFALAN);
  const [unitSekolahList, setUnitSekolahList] = useLocalStorage<UnitSekolah[]>('unitSekolahList', INITIAL_UNIT_SEKOLAH);
  const [jurusanList, setJurusanList] = useLocalStorage<JurusanSekolah[]>('jurusanList', INITIAL_JURUSAN);
  const [kelasSekolahList, setKelasSekolahList] = useLocalStorage<KelasSekolah[]>('kelasSekolahList', INITIAL_KELAS_SEKOLAH);

  // Core Santri state
  const [santriList, setSantriList] = useLocalStorage<Santri[]>('santriList', INITIAL_SANTRI);

  // Tahfidz & Nadhoman
  const [setoranTahfidzList, setSetoranTahfidzList] = useLocalStorage<SetoranTahfidz[]>('setoranTahfidz', INITIAL_SETORAN_TAHFIDZ);
  const [setoranNadhomanList, setSetoranNadhomanList] = useLocalStorage<SetoranNadhoman[]>('setoranNadhoman', INITIAL_SETORAN_NADHOMAN);

  // Kepengasuhan
  const [kesehatanList, setKesehatanList] = useLocalStorage<CatatanKesehatanUKS[]>('kesehatan', INITIAL_KESEHATAN_UKS);
  const [perizinanList, setPerizinanList] = useLocalStorage<PerizinanSantri[]>('perizinan', INITIAL_PERIZINAN);
  const [konselingList, setKonselingList] = useLocalStorage<LogKonseling[]>('konseling', INITIAL_KONSELING);
  const [kunjunganList, setKunjunganList] = useLocalStorage<KunjunganSantri[]>('kunjungan', INITIAL_KUNJUNGAN);

  // Kepegawaian
  const [jabatanList] = useLocalStorage<Jabatan[]>('jabatan', INITIAL_JABATAN);
  const [pegawaiList, setPegawaiList] = useLocalStorage<Pegawai[]>('pegawai', INITIAL_PEGAWAI);

  // Akademik
  const [presensiList, setPresensiList] = useLocalStorage<PresensiRecord[]>('presensi', INITIAL_PRESENSI);

  // Keuangan
  const [biayaMasterList] = useLocalStorage<BiayaMaster[]>('biayaMaster', INITIAL_BIAYA_MASTER);
  const [tagihanList, setTagihanList] = useLocalStorage<TagihanKeuangan[]>('tagihan', INITIAL_TAGIHAN);
  const [transaksiList, setTransaksiList] = useLocalStorage<TransaksiPembayaran[]>('transaksi', INITIAL_TRANSAKSI);

  // Tahun Ajaran
  const [tahunAjaranList, setTahunAjaranList] = useLocalStorage<TahunAjaran[]>('tahunAjaran', INITIAL_TAHUN_AJARAN);

  // Peserta Tahfidz
  const [pesertaTahfidzList, setPesertaTahfidzList] = useLocalStorage<PesertaTahfidz[]>('pesertaTahfidz', INITIAL_PESERTA_TAHFIDZ);

  // PPDB
  const [ppdbList, setPpdbList] = useLocalStorage<PendaftarPPDB[]>('ppdb', INITIAL_PENDAFTAR_PPDB);

  // AUTO NIS GENERATOR
  // Format 6 digit: 2 digit tahun masuk + 4 digit sequence (e.g., 260001, 260002...)
  const generateNextNIS = (): string => {
    const yearPrefix = new Date().getFullYear().toString().slice(-2); // "26"
    const existingNisNumbers = santriList
      .map(s => s.nis)
      .filter(nis => nis && nis.startsWith(yearPrefix))
      .map(nis => parseInt(nis.slice(2), 10))
      .filter(num => !isNaN(num));

    const nextSeq = existingNisNumbers.length > 0 ? Math.max(...existingNisNumbers) + 1 : 1;
    return `${yearPrefix}${nextSeq.toString().padStart(4, '0')}`;
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `usr-${role}`,
        username: role,
        nama: `User ${role.replace('_', ' ').toUpperCase()}`,
        role: role
      });
    }
  };

  // Tahun Ajaran CRUD
  const addTahunAjaran = (item: Omit<TahunAjaran, 'id'>) => {
    const newItem: TahunAjaran = { ...item, id: `ta-${Date.now()}` };
    setTahunAjaranList(prev => {
      const base = item.isAktif ? prev.map(t => ({ ...t, isAktif: false })) : prev;
      return [...base, newItem];
    });
  };
  const updateTahunAjaran = (id: string, item: Partial<TahunAjaran>) => {
    setTahunAjaranList(prev => {
      const base = item.isAktif === true ? prev.map(t => ({ ...t, isAktif: false })) : prev;
      return base.map(t => t.id === id ? { ...t, ...item } : t);
    });
  };
  const getTahunAjaranAktif = (): TahunAjaran | undefined => {
    return tahunAjaranList.find(t => t.isAktif);
  };

  // Master Unit Pesantren CRUD
  const addUnitPesantren = (item: Omit<UnitPesantren, 'id'>) => {
    const newItem: UnitPesantren = { ...item, id: `up-${Date.now()}` };
    setUnitsPesantren(prev => [...prev, newItem]);
  };
  const updateUnitPesantren = (id: string, item: Partial<UnitPesantren>) => {
    setUnitsPesantren(prev => prev.map(u => u.id === id ? { ...u, ...item } : u));
  };
  const deleteUnitPesantren = (id: string) => {
    setUnitsPesantren(prev => prev.filter(u => u.id !== id));
  };

  // Asrama CRUD
  const addAsrama = (item: Omit<Asrama, 'id'>) => {
    const newItem: Asrama = { ...item, id: `asr-${Date.now()}` };
    setAsramaList(prev => [...prev, newItem]);
  };
  const updateAsrama = (id: string, item: Partial<Asrama>) => {
    setAsramaList(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));
  };
  const deleteAsrama = (id: string) => {
    setAsramaList(prev => prev.filter(a => a.id !== id));
  };

  // Kamar CRUD
  const addKamar = (item: Omit<Kamar, 'id'>) => {
    const newItem: Kamar = { ...item, id: `kmr-${Date.now()}` };
    setKamarList(prev => [...prev, newItem]);
  };
  const updateKamar = (id: string, item: Partial<Kamar>) => {
    setKamarList(prev => prev.map(k => k.id === id ? { ...k, ...item } : k));
  };
  const deleteKamar = (id: string) => {
    setKamarList(prev => prev.filter(k => k.id !== id));
  };

  // Marhalah CRUD
  const addMarhalah = (item: Omit<MarhalahMadin, 'id'>) => {
    const newItem: MarhalahMadin = { ...item, id: `mrh-${Date.now()}` };
    setMarhalahList(prev => [...prev, newItem]);
  };
  const updateMarhalah = (id: string, item: Partial<MarhalahMadin>) => {
    setMarhalahList(prev => prev.map(m => m.id === id ? { ...m, ...item } : m));
  };
  const deleteMarhalah = (id: string) => {
    setMarhalahList(prev => prev.filter(m => m.id !== id));
  };

  // Kelas Madin CRUD
  const addKelasMadin = (item: Omit<KelasMadin, 'id'>) => {
    const newItem: KelasMadin = { ...item, id: `km-${Date.now()}` };
    setKelasMadinList(prev => [...prev, newItem]);
  };
  const updateKelasMadin = (id: string, item: Partial<KelasMadin>) => {
    setKelasMadinList(prev => prev.map(k => k.id === id ? { ...k, ...item } : k));
  };
  const deleteKelasMadin = (id: string) => {
    setKelasMadinList(prev => prev.filter(k => k.id !== id));
  };

  // Kitab CRUD
  const addKitab = (item: Omit<KitabHafalan, 'id'>) => {
    const newItem: KitabHafalan = { ...item, id: `ktb-${Date.now()}` };
    setKitabList(prev => [...prev, newItem]);
  };
  const updateKitab = (id: string, item: Partial<KitabHafalan>) => {
    setKitabList(prev => prev.map(k => k.id === id ? { ...k, ...item } : k));
  };
  const deleteKitab = (id: string) => {
    setKitabList(prev => prev.filter(k => k.id !== id));
  };

  // Sekolah CRUD
  const addUnitSekolah = (item: Omit<UnitSekolah, 'id'>) => {
    const newItem: UnitSekolah = { ...item, id: `sekol-${Date.now()}` };
    setUnitSekolahList(prev => [...prev, newItem]);
  };
  const updateUnitSekolah = (id: string, item: Partial<UnitSekolah>) => {
    setUnitSekolahList(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
  };
  const deleteUnitSekolah = (id: string) => {
    setUnitSekolahList(prev => prev.filter(s => s.id !== id));
  };

  const addJurusan = (item: Omit<JurusanSekolah, 'id'>) => {
    const newItem: JurusanSekolah = { ...item, id: `jur-${Date.now()}` };
    setJurusanList(prev => [...prev, newItem]);
  };
  const updateJurusan = (id: string, item: Partial<JurusanSekolah>) => {
    setJurusanList(prev => prev.map(j => j.id === id ? { ...j, ...item } : j));
  };
  const deleteJurusan = (id: string) => {
    setJurusanList(prev => prev.filter(j => j.id !== id));
  };

  const addKelasSekolah = (item: Omit<KelasSekolah, 'id'>) => {
    const newItem: KelasSekolah = { ...item, id: `ks-${Date.now()}` };
    setKelasSekolahList(prev => [...prev, newItem]);
  };
  const updateKelasSekolah = (id: string, item: Partial<KelasSekolah>) => {
    setKelasSekolahList(prev => prev.map(k => k.id === id ? { ...k, ...item } : k));
  };
  const deleteKelasSekolah = (id: string) => {
    setKelasSekolahList(prev => prev.filter(k => k.id !== id));
  };

  // Santri CRUD
  const addSantri = (santriData: Omit<Santri, 'id' | 'nis'>): Santri => {
    const newNis = generateNextNIS();
    
    // Check if Section H (Alumni detail) is filled
    const isAlumni = Boolean(santriData.alasanKeluar || santriData.tahunKeluar);
    
    const newSantri: Santri = {
      ...santriData,
      id: `snt-${Date.now()}`,
      nis: newNis,
      status: isAlumni ? 'Alumni' : 'Aktif',
      tahunAjaranId: santriData.tahunAjaranId || getTahunAjaranAktif()?.id || ''
    };

    setSantriList(prev => [newSantri, ...prev]);

    // Generate initial Syahriyah invoice for new active santri
    if (newSantri.status === 'Aktif') {
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const now = new Date();
      const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
      
      const newTagihan: TagihanKeuangan = {
        id: `tgh-${Date.now()}`,
        santriId: newSantri.id,
        biayaMasterId: 'by-2',
        bulanTahun: currentMonthYear,
        nominalTagihan: 450000,
        nominalTerbayar: 0,
        status: 'Belum Lunas',
        tanggalJatuhTempo: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-10`,
        tahunAjaranId: getTahunAjaranAktif()?.id ?? ''
      };
      setTagihanList(prev => [...prev, newTagihan]);
    }

    return newSantri;
  };

  const updateSantri = (id: string, santriData: Partial<Santri>) => {
    setSantriList(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, ...santriData };
      
      // Automatic Alumni transition if Section H is filled
      if (updated.alasanKeluar || updated.tahunKeluar) {
        updated.status = 'Alumni';
      }

      return updated;
    }));
  };

  const deleteSantri = (id: string) => {
    setSantriList(prev => prev.filter(s => s.id !== id));
  };

  // Tahfidz & Nadhoman
  const addSetoranTahfidz = (item: Omit<SetoranTahfidz, 'id'>) => {
    const newItem: SetoranTahfidz = {
      ...item,
      id: `stf-${Date.now()}`,
      tahunAjaranId: item.tahunAjaranId || getTahunAjaranAktif()?.id || ''
    };
    setSetoranTahfidzList(prev => [newItem, ...prev]);
  };

  const addSetoranNadhoman = (item: Omit<SetoranNadhoman, 'id' | 'totalHafalanSelesai'>) => {
    // Accumulate total hafalan for this santri & kitab
    const existingForSantriAndKitab = setoranNadhomanList.filter(
      s => s.santriId === item.santriId && s.namaKitab === item.namaKitab
    );
    const prevTotal = existingForSantriAndKitab.length > 0
      ? Math.max(...existingForSantriAndKitab.map(s => s.totalHafalanSelesai))
      : 0;

    const cumulative = prevTotal + Number(item.jumlahBaitBaru);

    const newItem: SetoranNadhoman = {
      ...item,
      id: `stn-${Date.now()}`,
      totalHafalanSelesai: cumulative,
      tahunAjaranId: item.tahunAjaranId || getTahunAjaranAktif()?.id || ''
    };

    setSetoranNadhomanList(prev => [newItem, ...prev]);
  };

  // Peserta Tahfidz
  const addPesertaTahfidz = (item: Omit<PesertaTahfidz, 'id' | 'tanggalDaftar'>) => {
    const isDuplikat = pesertaTahfidzList.some(
      p => p.santriId === item.santriId && p.tahunAjaranId === item.tahunAjaranId
    );
    if (isDuplikat) return;
    const newItem: PesertaTahfidz = {
      ...item,
      id: `pt-${Date.now()}`,
      tanggalDaftar: new Date().toISOString().split('T')[0],
      status: item.status ?? 'Aktif'
    };
    setPesertaTahfidzList(prev => [newItem, ...prev]);
  };

  const updateStatusPeserta = (id: string, status: PesertaTahfidz['status']) => {
    setPesertaTahfidzList(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // Kepengasuhan
  const addKesehatan = (item: Omit<CatatanKesehatanUKS, 'id'>) => {
    const newItem: CatatanKesehatanUKS = { ...item, id: `uks-${Date.now()}` };
    setKesehatanList(prev => [newItem, ...prev]);
  };

  const updateKesehatanStatus = (id: string, status: CatatanKesehatanUKS['status']) => {
    setKesehatanList(prev => prev.map(k => k.id === id ? { ...k, status } : k));
  };

  const addPerizinan = (item: Omit<PerizinanSantri, 'id'>) => {
    const newItem: PerizinanSantri = { ...item, id: `izin-${Date.now()}` };
    setPerizinanList(prev => [newItem, ...prev]);
  };

  const updatePerizinanStatus = (id: string, status: PerizinanSantri['statusApproval'], approver?: string) => {
    setPerizinanList(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        statusApproval: status,
        disetujuiOleh: approver || currentUser.nama
      };
    }));
  };

  const addKonseling = (item: Omit<LogKonseling, 'id'>) => {
    const newItem: LogKonseling = { ...item, id: `ksl-${Date.now()}` };
    setKonselingList(prev => [newItem, ...prev]);
  };

  const addKunjungan = (item: Omit<KunjunganSantri, 'id'>) => {
    const newItem: KunjunganSantri = { ...item, id: `knj-${Date.now()}` };
    setKunjunganList(prev => [newItem, ...prev]);
  };

  // Kepegawaian
  const addPegawai = (item: Omit<Pegawai, 'id' | 'nip'>) => {
    const year = new Date().getFullYear();
    const count = pegawaiList.length + 1;
    const nip = `PGW-${year}-${count.toString().padStart(3, '0')}`;
    const newItem: Pegawai = { ...item, id: `pgw-${Date.now()}`, nip };
    setPegawaiList(prev => [newItem, ...prev]);
  };

  const updatePegawai = (id: string, item: Partial<Pegawai>) => {
    setPegawaiList(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
  };

  // Akademik Presensi
  const savePresensiBatch = (records: Omit<PresensiRecord, 'id'>[]) => {
    const aktivId = getTahunAjaranAktif()?.id || '';
    const newRecordsWithId: PresensiRecord[] = records.map((r, idx) => ({
      ...r,
      id: `prs-${Date.now()}-${idx}`,
      tahunAjaranId: r.tahunAjaranId || aktivId
    }));

    // Filter out previous entries for same date, type, class, and santri
    setPresensiList(prev => {
      const filtered = prev.filter(p => !records.some(r => 
        r.tanggal === p.tanggal && r.tipe === p.tipe && r.kelasId === p.kelasId && r.santriId === p.santriId
      ));
      return [...filtered, ...newRecordsWithId];
    });
  };

  // Keuangan
  const addBayarTagihan = (tagihanId: string, nominal: number, metode: TransaksiPembayaran['metodePembayaran'], catatan?: string) => {
    const tagihan = tagihanList.find(t => t.id === tagihanId);
    if (!tagihan) return;

    const nowStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const kwNumber = `KW-${nowStr}-${Math.floor(100 + Math.random() * 900)}`;

    const newTx: TransaksiPembayaran = {
      id: `trx-${Date.now()}`,
      tagihanId,
      santriId: tagihan.santriId,
      noKuitansi: kwNumber,
      tanggal: new Date().toISOString().split('T')[0],
      nominal,
      metodePembayaran: metode,
      penerima: currentUser.nama,
      catatan
    };

    setTransaksiList(prev => [newTx, ...prev]);

    // Update tagihan status
    const newTerbayar = tagihan.nominalTerbayar + nominal;
    let newStatus: TagihanKeuangan['status'] = 'Belum Lunas';
    if (newTerbayar >= tagihan.nominalTagihan) {
      newStatus = 'Lunas';
    } else if (newTerbayar > 0) {
      newStatus = 'Sebagian';
    }

    setTagihanList(prev => prev.map(t => t.id === tagihanId ? {
      ...t,
      nominalTerbayar: newTerbayar,
      status: newStatus
    } : t));
  };

  // PPDB
  const addPPDB = (item: Omit<PendaftarPPDB, 'id' | 'noPendaftaran' | 'statusSeleksi' | 'tanggalDaftar'>) => {
    const year = new Date().getFullYear();
    const count = ppdbList.length + 1;
    const noPendaftaran = `PPDB-${year}-${count.toString().padStart(3, '0')}`;
    const newItem: PendaftarPPDB = {
      ...item,
      id: `ppdb-${Date.now()}`,
      noPendaftaran,
      statusSeleksi: 'Pendaftaran Baru',
      tanggalDaftar: new Date().toISOString().split('T')[0]
    };
    setPpdbList(prev => [newItem, ...prev]);
  };

  const updatePPDBStatus = (id: string, status: PendaftarPPDB['statusSeleksi']) => {
    setPpdbList(prev => prev.map(p => p.id === id ? { ...p, statusSeleksi: status } : p));
  };

  const mutasiPPDBKeSantri = (ppdbId: string): Santri | null => {
    const pendaftar = ppdbList.find(p => p.id === ppdbId);
    if (!pendaftar) return null;

    // Find first available room & class for fallback
    const defaultAsrama = asramaList.find(a => a.unitPesantrenId === pendaftar.unitPesantrenPilihanId) || asramaList[0];
    const defaultKamar = kamarList.find(k => k.asramaId === defaultAsrama?.id) || kamarList[0];
    const defaultKelasSekolah = kelasSekolahList.find(ks => ks.sekolahId === pendaftar.unitSekolahPilihanId) || kelasSekolahList[0];
    const defaultKelasMadin = kelasMadinList.find(km => km.marhalahId === pendaftar.marhalahPilihanId) || kelasMadinList[0];

    // Build new santri record
    const newSantriData: Omit<Santri, 'id' | 'nis'> = {
      status: 'Aktif',
      nik: `3510${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      namaLengkap: pendaftar.namaLengkap,
      namaPanggilan: pendaftar.namaLengkap.split(' ')[0],
      jenisKelamin: pendaftar.jenisKelamin,
      tempatLahir: pendaftar.tempatLahir,
      tanggalLahir: pendaftar.tanggalLahir,
      anakKe: 1,
      jumlahSaudara: 2,
      alamat: pendaftar.alamat,
      rt: '01',
      rw: '01',
      dusun: 'Krajan',
      desa: 'Tegalsari',
      kecamatan: 'Tegalsari',
      kabupaten: 'Banyuwangi',
      provinsi: 'Jawa Timur',
      golonganDarah: 'O',
      riwayatPenyakit: 'Tidak ada',
      tindakanKesehatan: '-',
      kondisiSaatIni: 'Sehat',
      unitPesantrenId: pendaftar.unitPesantrenPilihanId,
      asramaId: defaultAsrama?.id || 'asr-1',
      kamarId: defaultKamar?.id || 'kmr-1',
      unitSekolahId: pendaftar.unitSekolahPilihanId,
      kelasSekolahId: defaultKelasSekolah?.id || 'ks-1',
      marhalahMadinId: pendaftar.marhalahPilihanId,
      kelasMadinId: defaultKelasMadin?.id || 'km-1',
      sekolahAsal: pendaftar.sekolahAsal,
      tahunLulusSekolahAsal: new Date().getFullYear().toString(),
      namaAyah: pendaftar.namaOrtu,
      nikAyah: `3510${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      pekerjaanAyah: 'Wiraswasta',
      penghasilanAyah: 'Rp 3.000.000 - Rp 5.000.000',
      namaIbu: 'Ibu ' + pendaftar.namaOrtu.split(' ')[0],
      nikIbu: `3510${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      pekerjaanIbu: 'Ibu Rumah Tangga',
      penghasilanIbu: 'Tidak Berpenghasilan',
      noHpOrtu: pendaftar.noHpOrtu,
      jenisSantriAsuh: 'Bukan Asuh',
      tanggalDaftar: new Date().toISOString().split('T')[0],
      tahunAjaranId: getTahunAjaranAktif()?.id ?? ''
    };

    const createdSantri = addSantri(newSantriData);

    // Update PPDB status
    updatePPDBStatus(ppdbId, 'Telah Dimutasi');

    return createdSantri;
  };

  const getSantriNameById = (id: string): string => {
    const s = santriList.find(x => x.id === id);
    return s ? `${s.namaLengkap} (${s.nis})` : 'Santri Tidak Ditemukan';
  };

  return (
    <AppContext.Provider
      value={{
        isLandingPage,
        setIsLandingPage,
        currentUser,
        setCurrentUser,
        switchRole,
        users,

        tahunAjaranList,
        addTahunAjaran,
        updateTahunAjaran,
        getTahunAjaranAktif,

        unitsPesantren,
        addUnitPesantren,
        updateUnitPesantren,
        deleteUnitPesantren,

        asramaList,
        addAsrama,
        updateAsrama,
        deleteAsrama,

        kamarList,
        addKamar,
        updateKamar,
        deleteKamar,

        marhalahList,
        addMarhalah,
        updateMarhalah,
        deleteMarhalah,

        kelasMadinList,
        addKelasMadin,
        updateKelasMadin,
        deleteKelasMadin,

        kitabList,
        addKitab,
        updateKitab,
        deleteKitab,

        unitSekolahList,
        addUnitSekolah,
        updateUnitSekolah,
        deleteUnitSekolah,

        jurusanList,
        addJurusan,
        updateJurusan,
        deleteJurusan,

        kelasSekolahList,
        addKelasSekolah,
        updateKelasSekolah,
        deleteKelasSekolah,

        santriList,
        addSantri,
        updateSantri,
        deleteSantri,

        setoranTahfidzList,
        addSetoranTahfidz,

        setoranNadhomanList,
        addSetoranNadhoman,

        pesertaTahfidzList,
        addPesertaTahfidz,
        updateStatusPeserta,

        kesehatanList,
        addKesehatan,
        updateKesehatanStatus,

        perizinanList,
        addPerizinan,
        updatePerizinanStatus,

        konselingList,
        addKonseling,

        kunjunganList,
        addKunjungan,

        jabatanList,
        pegawaiList,
        addPegawai,
        updatePegawai,

        presensiList,
        savePresensiBatch,

        biayaMasterList,
        tagihanList,
        transaksiList,
        addBayarTagihan,

        ppdbList,
        addPPDB,
        updatePPDBStatus,
        mutasiPPDBKeSantri,

        generateNextNIS,
        getSantriNameById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
