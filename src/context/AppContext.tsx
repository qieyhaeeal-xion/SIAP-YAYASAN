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
  TarifPembayaran,
  TarifTargetScope,
  TagihanKeuangan,
  TagihanGenerationInput,
  TagihanGenerationPreview,
  TagihanGenerationResult,
  TagihanPreviewItem,
  TransaksiPembayaran,
  PendaftarPPDB,
  UserProfile,
  PresensiRecord,
  TahunAjaran,
  PesertaTahfidz,
  Pemasukan,
  NewPemasukanInput,
  AuditLog,
  AuditAction,
  BULAN_KE_LABEL,
  bulanKeFromBulanTahun,
  JenjangSekolah
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
  INITIAL_DEMO_STATUS_SANTRI,
  INITIAL_SETORAN_TAHFIDZ,
  INITIAL_SETORAN_NADHOMAN,
  INITIAL_KESEHATAN_UKS,
  INITIAL_PERIZINAN,
  INITIAL_KONSELING,
  INITIAL_KUNJUNGAN,
  INITIAL_PEGAWAI,
  INITIAL_JABATAN,
  INITIAL_BIAYA_MASTER,
  INITIAL_TARIF_PEMBAYARAN,
  INITIAL_TAGIHAN,
  INITIAL_TRANSAKSI,
  INITIAL_PENDAFTAR_PPDB,
  INITIAL_USERS,
  INITIAL_PRESENSI,
  INITIAL_TAHUN_AJARAN,
  INITIAL_PESERTA_TAHFIDZ,
  INITIAL_PEMASUKAN,
  INITIAL_AUDIT_LOG
} from '../data/mockData';
import { getCurrentUser as getAuthenticatedUser, renameAdminPassword, saveAuthenticatedUser } from '../services/authService';

interface AppContextType {
  // Mode & Auth
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  updateCurrentUserProfile: (updates: Partial<Pick<UserProfile, 'nama' | 'username' | 'email' | 'noHp'>>) => void;
  addAdminAccount: (account: Omit<UserProfile, 'id' | 'role'>) => void;
  updateAdminAccount: (id: string, updates: Partial<Omit<UserProfile, 'id' | 'role'>>) => void;
  deleteAdminAccount: (id: string) => boolean;

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
  addBiayaMaster: (item: Omit<BiayaMaster, 'id'>) => BiayaMaster;
  updateBiayaMaster: (id: string, item: Partial<BiayaMaster>) => void;
  deleteBiayaMaster: (id: string) => void;
  tarifPembayaranList: TarifPembayaran[];
  addTarifPembayaran: (item: Omit<TarifPembayaran, 'id'>) => void;
  updateTarifPembayaran: (id: string, item: Partial<TarifPembayaran>) => void;
  deleteTarifPembayaran: (id: string) => void;
  tagihanList: TagihanKeuangan[];
  transaksiList: TransaksiPembayaran[];
  generateTagihan: (input: { santriId: string; biayaMasterId: string; periode: string; bulanKe?: number; tanggalJatuhTempo?: string }) => TagihanKeuangan | null;
  getNominalBiayaSantri: (santriId: string, biayaMasterId: string) => number;
  getTagihanPreview: (santri: Partial<Santri>) => TagihanPreviewItem[];
  previewGenerateTagihan: (input: TagihanGenerationInput) => TagihanGenerationPreview | null;
  generateTagihanMassal: (input: TagihanGenerationInput) => TagihanGenerationResult | null;
  addBayarTagihan: (tagihanId: string, nominal: number, metode: TransaksiPembayaran['metodePembayaran'], catatan?: string, buktiTransferUrl?: string) => TransaksiPembayaran | null;
  verifikasiTransaksi: (id: string, status: 'Terverifikasi' | 'Ditolak', verifiedBy?: string) => boolean;

  // Pemasukan
  pemasukanList: Pemasukan[];
  createPemasukan: (input: NewPemasukanInput) => { ok: boolean; error?: string; pemasukan?: Pemasukan };
  getUnitKeyFromSantri: (santriId: string) => string | undefined;

  // Audit Trail
  auditLogList: AuditLog[];
  addAuditLog: (input: { action: AuditAction; entityType: 'Pemasukan'; entityId: string; entityLabel: string; detail: string; before?: unknown; after?: unknown }) => void;

  // PPDB
  ppdbList: PendaftarPPDB[];
  addPPDB: (item: Omit<PendaftarPPDB, 'id' | 'noPendaftaran' | 'statusSeleksi' | 'tanggalDaftar'>) => void;
  updatePPDBStatus: (id: string, status: PendaftarPPDB['statusSeleksi']) => void;
  mutasiPPDBKeSantri: (ppdbId: string) => Santri | null;

  // Utility
  generateNextNIS: () => string;
  getSantriNameById: (id: string) => string;
}

type SantriFinanceProfile = Pick<Santri, 'kategoriUtama'> & Partial<Pick<Santri,
  'tipeAsuh' | 'golonganAsuh' | 'program' | 'unitPesantrenId' | 'unitSekolahId' | 'kelasSekolahId' | 'kelasMadinId'
>>;

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'sisantri_app_';
const DEMO_FINANCE_SEED_VERSION = 4;

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
  const [storedUsers, setStoredUsers] = useLocalStorage<UserProfile[]>('users', INITIAL_USERS);
  const users = storedUsers.filter(user => user.role === 'admin_yayasan');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);

  useEffect(() => {
    if (storedUsers.some(user => user.role !== 'admin_yayasan')) {
      setStoredUsers(prev => prev.filter(user => user.role === 'admin_yayasan'));
    }
  }, [storedUsers, setStoredUsers]);

  const updateCurrentUserProfile = (updates: Partial<Pick<UserProfile, 'nama' | 'username' | 'email' | 'noHp'>>) => {
    const updatedUser = { ...currentUser, ...updates, role: 'admin_yayasan' as const };
    if (updates.username) renameAdminPassword(currentUser.username, updates.username);
    setCurrentUser(updatedUser);
    setStoredUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    saveAuthenticatedUser(updatedUser);
  };

  const addAdminAccount = (account: Omit<UserProfile, 'id' | 'role'>) => {
    const newAccount: UserProfile = { ...account, id: `usr-${Date.now()}`, role: 'admin_yayasan' };
    setStoredUsers(prev => [...prev.filter(user => user.role === 'admin_yayasan'), newAccount]);
  };

  const updateAdminAccount = (id: string, updates: Partial<Omit<UserProfile, 'id' | 'role'>>) => {
    setStoredUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates, role: 'admin_yayasan' } : user));
    if (currentUser.id === id) updateCurrentUserProfile(updates);
  };

  const deleteAdminAccount = (id: string): boolean => {
    if (id === currentUser.id || id === 'usr-1') return false;
    setStoredUsers(prev => prev.filter(user => user.id !== id));
    return true;
  };

  useEffect(() => {
    let mounted = true;
    getAuthenticatedUser().then(user => {
      if (mounted && user) setCurrentUser(user);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
  const [santriDemoSeedVersion, setSantriDemoSeedVersion] = useLocalStorage<number>('santriDemoSeedVersion', 0);
  const [santriList, setSantriList] = useLocalStorage<Santri[]>('santriList', [...INITIAL_SANTRI, ...INITIAL_DEMO_STATUS_SANTRI]);

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
  const [biayaMasterList, setBiayaMasterList] = useLocalStorage<BiayaMaster[]>('biayaMaster', INITIAL_BIAYA_MASTER);
  const [statusDemoSeedVersion, setStatusDemoSeedVersion] = useLocalStorage<number>('statusDemoSeedVersion', 0);
  const [tarifPembayaranList, setTarifPembayaranList] = useLocalStorage<TarifPembayaran[]>('tarifPembayaran', INITIAL_TARIF_PEMBAYARAN);
  const [tarifDemoSeedVersion, setTarifDemoSeedVersion] = useLocalStorage<number>('tarifDemoSeedVersion', 0);
  const [tagihanList, setTagihanList] = useLocalStorage<TagihanKeuangan[]>('tagihan', INITIAL_TAGIHAN);
  const [transaksiList, setTransaksiList] = useLocalStorage<TransaksiPembayaran[]>('transaksi', INITIAL_TRANSAKSI);

  // Pemasukan
  const [pemasukanList, setPemasukanList] = useLocalStorage<Pemasukan[]>('pemasukan', INITIAL_PEMASUKAN);
  const [auditLogList, setAuditLogList] = useLocalStorage<AuditLog[]>('auditLog', INITIAL_AUDIT_LOG);

  // Tahun Ajaran
  const [tahunAjaranList, setTahunAjaranList] = useLocalStorage<TahunAjaran[]>('tahunAjaran', INITIAL_TAHUN_AJARAN);

  // Peserta Tahfidz
  const [pesertaTahfidzList, setPesertaTahfidzList] = useLocalStorage<PesertaTahfidz[]>('pesertaTahfidz', INITIAL_PESERTA_TAHFIDZ);

  // PPDB
  const [ppdbList, setPpdbList] = useLocalStorage<PendaftarPPDB[]>('ppdb', INITIAL_PENDAFTAR_PPDB);

  // MIGRASI: Konversi data lama ke struktur hirarki status santri (kategoriUtama/tipeAsuh/golonganAsuh/program)
  useEffect(() => {
    setSantriList(prev => {
      const needsMigration = prev.some(s => s.kategoriUtama === undefined);
      if (!needsMigration) return prev;
      const ASUH_MAP: Record<string, string> = { 'Bukan Asuh': 'Bukan Asuh', 'ASUH 1': 'A1', 'ASUH 2': 'A2', 'ASUH 3': 'A3' };
      return prev.map(s => {
        if (s.kategoriUtama) return s;
        const rec = s as unknown as Record<string, unknown>;
        const oldJenis = rec.jenisSantriAsuh as string | undefined;
        const oldStatus = (s as unknown as { statusSantri?: string }).statusSantri;
        let kategoriUtama: Santri['kategoriUtama'] = 'Santri';
        let tipeAsuh: Santri['tipeAsuh'] = 'Bukan Asuh';
        let golonganAsuh: Santri['golonganAsuh'] = undefined;
        let program: Santri['program'] = 'Pelajar';
        if (oldStatus === 'Desa') {
          kategoriUtama = 'Desa'; tipeAsuh = null; golonganAsuh = null; program = null;
        } else if (oldStatus && ['A1', 'A2', 'A3'].includes(oldStatus)) {
          tipeAsuh = 'Asuh'; golonganAsuh = oldStatus as Santri['golonganAsuh'];
        } else if (oldStatus === 'Pengabdian') {
          program = 'Pengabdian';
        } else if (oldStatus === 'Lulus') {
          program = 'Lulus';
        } else if (oldJenis) {
          const mapped = ASUH_MAP[oldJenis];
          if (mapped === 'Bukan Asuh') { tipeAsuh = 'Bukan Asuh'; }
          else { tipeAsuh = 'Asuh'; golonganAsuh = mapped as Santri['golonganAsuh']; }
        }
        return { ...s, kategoriUtama, tipeAsuh, golonganAsuh, program } as Santri;
      });
    });
    setTarifPembayaranList(prev => {
      const needsMigration = prev.some(t => (t.targetScope as string) === 'Santri Asuh' || (t.targetScope as string) === 'Status Santri');
      if (!needsMigration) return prev;
      return prev.map(t => {
        const scope = t.targetScope as string;
        if (scope === 'Santri Asuh' || scope === 'Status Santri') {
          const val = t.targetValue || '';
          const isGolongan = ['A1', 'A2', 'A3'].includes(val);
          return {
            ...t,
            targetScope: (isGolongan ? 'Golongan Asuh' : scope === 'Santri Asuh' ? 'Tipe Asuh' : 'Program') as TarifTargetScope,
            targetValue: val
          };
        }
        return t;
      });
    });
  }, []);

  // Tambahkan jenis pembayaran demo baru ke browser lama tanpa menggandakan data.
  useEffect(() => {
    if (statusDemoSeedVersion >= 2) return;
    setBiayaMasterList(prev => prev.filter(item => !item.id.startsWith('by-demo-status-')));
    setStatusDemoSeedVersion(2);
  }, [statusDemoSeedVersion]);

  // Tambahkan aturan tarif demo hierarkis ke browser lama tanpa menggandakan data.
  useEffect(() => {
    if (tarifDemoSeedVersion >= 2) return;

    setTarifPembayaranList(prev => {
      const kept = prev.filter(item =>
        !item.id.startsWith('tarif-demo-') && !item.id.startsWith('tarif-syahriyah-')
      );
      return [...kept, ...INITIAL_TARIF_PEMBAYARAN];
    });
    setTarifDemoSeedVersion(2);
  }, [tarifDemoSeedVersion]);

  // Tambahkan santri demo status ke browser lama tanpa menggandakan data.
  useEffect(() => {
    if (santriDemoSeedVersion >= 1) return;

    setSantriList(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const demoItems = INITIAL_DEMO_STATUS_SANTRI.filter(item => !existingIds.has(item.id));
      return demoItems.length > 0 ? [...prev, ...demoItems] : prev;
    });
    setSantriDemoSeedVersion(1);
  }, [santriDemoSeedVersion]);

  // Refresh tagihan demo lama agar santri demo baru ikut memiliki tagihan belum lunas.
  useEffect(() => {
    const financeSeedVersion = Number(window.localStorage.getItem(`${STORAGE_PREFIX}demoFinanceSeedVersion`) || 0);
    if (financeSeedVersion >= DEMO_FINANCE_SEED_VERSION) return;

    const demoSantriIds = new Set(INITIAL_TAGIHAN.map(tagihan => tagihan.santriId));
    const demoPemasukanIds = new Set(
      pemasukanList
        .filter(pemasukan => demoSantriIds.has(pemasukan.santriId))
        .map(pemasukan => pemasukan.id)
    );

    setTagihanList(prev => [
      ...INITIAL_TAGIHAN,
      ...prev.filter(tagihan => !demoSantriIds.has(tagihan.santriId))
    ]);
    setTransaksiList(prev => prev.filter(transaksi => !demoSantriIds.has(transaksi.santriId)));
    setPemasukanList(prev => prev.filter(pemasukan => !demoSantriIds.has(pemasukan.santriId)));
    setAuditLogList(prev => prev.filter(log => !demoPemasukanIds.has(log.entityId)));
    window.localStorage.setItem(`${STORAGE_PREFIX}demoFinanceSeedVersion`, String(DEMO_FINANCE_SEED_VERSION));
  }, [pemasukanList]);

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

  // Payment types and tariff rules
  const isBiayaTargetMatch = (santri: SantriFinanceProfile, biaya: BiayaMaster): boolean => {
    if (biaya.targetKategoriUtama && santri.kategoriUtama !== biaya.targetKategoriUtama) return false;
    if (biaya.targetTipeAsuh && santri.tipeAsuh !== biaya.targetTipeAsuh) return false;
    if (biaya.targetGolonganAsuh && santri.golonganAsuh !== biaya.targetGolonganAsuh) return false;
    if (biaya.targetProgram && santri.program !== biaya.targetProgram) return false;
    if (biaya.targetUnitPesantrenId && santri.unitPesantrenId !== biaya.targetUnitPesantrenId) return false;
    if (biaya.targetUnitSekolahId && santri.unitSekolahId !== biaya.targetUnitSekolahId) return false;
    return true;
  };

  const getJenjangSekolah = (santri: SantriFinanceProfile): JenjangSekolah | undefined => {
    const kodeSekolah = unitSekolahList.find(unit => unit.id === santri.unitSekolahId)?.kodeSekolah?.toUpperCase();
    if (!kodeSekolah) return undefined;
    if (kodeSekolah === 'MTS' || kodeSekolah === 'SMP') return 'SMP';
    if (kodeSekolah === 'MA' || kodeSekolah === 'SMA' || kodeSekolah === 'SMK') return 'SLTA';
    return undefined;
  };

  const isTarifMatch = (santri: SantriFinanceProfile, tarif: TarifPembayaran): boolean => {
    const hasHierarchicalTarget = Boolean(
      tarif.targetKategoriUtama ||
      tarif.targetTipeAsuh ||
      tarif.targetGolonganAsuh ||
      tarif.targetProgram ||
      tarif.targetJenjangSekolah ||
      tarif.targetUnitPesantrenId ||
      tarif.targetUnitSekolahId
    );

    if (hasHierarchicalTarget) {
      if (tarif.targetKategoriUtama && santri.kategoriUtama !== tarif.targetKategoriUtama) return false;
      if (tarif.targetTipeAsuh && santri.tipeAsuh !== tarif.targetTipeAsuh) return false;
      if (tarif.targetGolonganAsuh && santri.golonganAsuh !== tarif.targetGolonganAsuh) return false;
      if (tarif.targetProgram && santri.program !== tarif.targetProgram) return false;
      if (tarif.targetJenjangSekolah && getJenjangSekolah(santri) !== tarif.targetJenjangSekolah) return false;
      if (tarif.targetUnitPesantrenId && santri.unitPesantrenId !== tarif.targetUnitPesantrenId) return false;
      if (tarif.targetUnitSekolahId && santri.unitSekolahId !== tarif.targetUnitSekolahId) return false;
      return true;
    }

    switch (tarif.targetScope) {
      case 'Unit Sekolah': return santri.unitSekolahId === tarif.targetValue;
      case 'Unit Pesantren': return santri.unitPesantrenId === tarif.targetValue;
      case 'Kelas Sekolah': return santri.kelasSekolahId === tarif.targetValue;
      case 'Kelas Madin': return santri.kelasMadinId === tarif.targetValue;
      case 'Kategori Utama': return santri.kategoriUtama === tarif.targetValue;
      case 'Tipe Asuh': return santri.tipeAsuh === tarif.targetValue;
      case 'Golongan Asuh': return santri.golonganAsuh === tarif.targetValue;
      case 'Program': return santri.program === tarif.targetValue;
      case 'Jenjang Sekolah': return getJenjangSekolah(santri) === tarif.targetValue;
      default: return true;
    }
  };

  const getTarifSpecificity = (tarif: TarifPembayaran): number => {
    const dimensions = [
      tarif.targetKategoriUtama,
      tarif.targetTipeAsuh,
      tarif.targetGolonganAsuh,
      tarif.targetProgram,
      tarif.targetJenjangSekolah,
      tarif.targetUnitPesantrenId,
      tarif.targetUnitSekolahId
    ];
    const hierarchicalSpecificity = dimensions.filter(Boolean).length;
    return hierarchicalSpecificity > 0 ? hierarchicalSpecificity : tarif.targetScope === 'Semua Santri' ? 0 : 1;
  };

  const getApplicableNominal = (santri: SantriFinanceProfile, biaya: BiayaMaster): number => {
    const tarif = tarifPembayaranList
      .filter(t => t.biayaMasterId === biaya.id && t.aktif && isTarifMatch(santri, t))
      .sort((a, b) => getTarifSpecificity(b) - getTarifSpecificity(a))[0];
    const hasHierarchicalRules = tarifPembayaranList.some(t =>
      t.biayaMasterId === biaya.id && (t.id.startsWith('tarif-demo-') || Boolean(t.elemen))
    );
    if (!tarif && hasHierarchicalRules) return 0;
    return tarif?.nominal ?? biaya.nominal ?? 0;
  };

  const getNominalBiayaSantri = (santriId: string, biayaMasterId: string): number => {
    const santri = santriList.find(item => item.id === santriId);
    const biaya = biayaMasterList.find(item => item.id === biayaMasterId);
    if (!santri || santri.status !== 'Aktif' || !biaya || biaya.aktif === false || !isBiayaTargetMatch(santri, biaya)) return 0;
    return getApplicableNominal(santri, biaya);
  };

  const getAcademicYearStart = (tahunAjaran: TahunAjaran): number => {
    const year = Number(tahunAjaran.kodeTahunAjaran.slice(0, 4));
    return Number.isFinite(year) ? year : new Date().getFullYear();
  };

  const getPeriodInfo = (tahunAjaran: TahunAjaran, bulanKe: number) => {
    const startYear = getAcademicYearStart(tahunAjaran);
    const calendarYear = bulanKe <= 6 ? startYear + 1 : startYear;
    const monthNumber = bulanKe <= 6 ? bulanKe : bulanKe - 6;
    return {
      bulanKe,
      bulanTahun: `${BULAN_KE_LABEL[bulanKe - 1]} ${calendarYear}`,
      tanggalJatuhTempo: `${calendarYear}-${monthNumber.toString().padStart(2, '0')}-10`
    };
  };

  const getGenerationPeriods = (biaya: BiayaMaster, tahunAjaran: TahunAjaran, bulanMulai: number, bulanSelesai: number) => {
    if (bulanMulai < 1 || bulanSelesai > 12 || bulanMulai > bulanSelesai) return [];
    const isRecurring = biaya.jenis === 'Syahriyah' || biaya.tipeFrekuensi === 'Bulanan' || biaya.tipeFrekuensi === 'Periodik';
    const months = isRecurring ? Array.from({ length: bulanSelesai - bulanMulai + 1 }, (_, index) => bulanMulai + index) : [bulanMulai];
    return months.map(month => getPeriodInfo(tahunAjaran, month));
  };

  const getTagihanPeriodKey = (tagihan: TagihanKeuangan, tahunAjaranId: string): string =>
    `${tagihan.tahunAjaranId || tahunAjaranId}:${tagihan.bulanKe ?? tagihan.bulanTahun ?? ''}`;

  const addBiayaMaster = (item: Omit<BiayaMaster, 'id'>): BiayaMaster => {
    const newItem: BiayaMaster = {
      ...item,
      id: `by-${Date.now()}`,
      aktif: item.aktif !== false
    };
    setBiayaMasterList(prev => [...prev, newItem]);
    return newItem;
  };

  const updateBiayaMaster = (id: string, item: Partial<BiayaMaster>) => {
    setBiayaMasterList(prev => prev.map(b => b.id === id ? { ...b, ...item, id } : b));
  };

  const deleteBiayaMaster = (id: string) => {
    if (id !== 'by-yayasan') setBiayaMasterList(prev => prev.filter(b => b.id !== id));
  };

  const addTarifPembayaran = (item: Omit<TarifPembayaran, 'id'>) => {
    setTarifPembayaranList(prev => [...prev, { ...item, id: `tarif-${Date.now()}-${prev.length}` }]);
  };

  const updateTarifPembayaran = (id: string, item: Partial<TarifPembayaran>) => {
    setTarifPembayaranList(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));
  };

  const deleteTarifPembayaran = (id: string) => {
    setTarifPembayaranList(prev => prev.filter(t => t.id !== id));
  };

  const getTagihanPreview = (santri: Partial<Santri>): TagihanPreviewItem[] => {
    if (santri.status && santri.status !== 'Aktif') return [];
    if (!santri.kategoriUtama) return [];

    const profile = santri as SantriFinanceProfile;
    return biayaMasterList
      .filter(biaya =>
        biaya.jenis === 'Syahriyah' &&
        biaya.aktif !== false &&
        biaya.wajib !== false &&
        !biaya.id.startsWith('by-demo-status-') &&
        isBiayaTargetMatch(profile, biaya)
      )
      .map(biaya => ({
        biayaMasterId: biaya.id,
        namaBiaya: biaya.namaBiaya,
        kategori: biaya.kategori,
        nominal: getApplicableNominal(profile, biaya),
        wajib: biaya.wajib !== false
      }))
      .filter(item => item.nominal > 0);
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

    // Generate the mandatory monthly payment types that match this santri.
    if (newSantri.status === 'Aktif') {
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const now = new Date();
      const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
      const currentBulanKe = now.getMonth() >= 6 ? now.getMonth() - 5 : now.getMonth() + 7;
      const syahriyahCosts = biayaMasterList.filter(b =>
        b.jenis === 'Syahriyah' &&
        b.aktif !== false &&
        b.wajib !== false &&
        !b.id.startsWith('by-demo-status-') &&
        isBiayaTargetMatch(newSantri, b)
      );
      const createdAt = Date.now();
      const newTagihans: TagihanKeuangan[] = syahriyahCosts.map((biaya, index) => ({
        id: `tgh-${createdAt}-${index}`,
        santriId: newSantri.id,
        biayaMasterId: biaya.id,
        bulanTahun: currentMonthYear,
        bulanKe: currentBulanKe,
        unitId: getUnitKeyFromSantri(newSantri.id, newSantri),
        nominalTagihan: getApplicableNominal(newSantri, biaya),
        nominalTerbayar: 0,
        status: 'Belum Lunas' as const,
        tanggalJatuhTempo: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-10`,
        tahunAjaranId: getTahunAjaranAktif()?.id ?? ''
      })).filter(tagihan => tagihan.nominalTagihan > 0);
      setTagihanList(prev => [...newTagihans, ...prev]);
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
  const generateTagihan = (input: { santriId: string; biayaMasterId: string; periode: string; bulanKe?: number; tanggalJatuhTempo?: string }): TagihanKeuangan | null => {
    const santri = santriList.find(s => s.id === input.santriId);
    const biaya = biayaMasterList.find(b => b.id === input.biayaMasterId);
    if (!santri || santri.status !== 'Aktif' || !biaya || biaya.aktif === false || !isBiayaTargetMatch(santri, biaya)) return null;
    if (tagihanList.some(t => t.santriId === input.santriId && t.biayaMasterId === input.biayaMasterId && t.bulanTahun === input.periode)) return null;

    const nominal = getApplicableNominal(santri, biaya);
    if (nominal <= 0) return null;
    const [bulanPeriode, tahun] = input.periode.split(/\s+(?=\d{4}$)/);
    const newTagihan: TagihanKeuangan = {
      id: `tgh-${Date.now()}`,
      santriId: input.santriId,
      biayaMasterId: input.biayaMasterId,
      noTagihan: `TG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(tagihanList.length + 1).toString().padStart(4, '0')}`,
      bulanTahun: input.periode,
      bulanPeriode,
      tahunPeriode: tahun ? Number(tahun) : undefined,
      bulanKe: input.bulanKe,
      unitId: getUnitKeyFromSantri(input.santriId),
      nominalTagihan: nominal,
      nominalTerbayar: 0,
      status: 'Belum Lunas',
      tanggalJatuhTempo: input.tanggalJatuhTempo,
      tahunAjaranId: getTahunAjaranAktif()?.id ?? ''
    };
    setTagihanList(prev => [newTagihan, ...prev]);
    return newTagihan;
  };

  const applyPaymentToTagihan = (transaksi: TransaksiPembayaran): boolean => {
    const tagihan = tagihanList.find(t => t.id === transaksi.tagihanId);
    if (!tagihan || transaksi.nominal === undefined) return false;
    const sisa = tagihan.nominalTagihan - tagihan.nominalTerbayar;
    if (transaksi.nominal <= 0 || transaksi.nominal > sisa) return false;
    const newTerbayar = tagihan.nominalTerbayar + transaksi.nominal;
    const status: TagihanKeuangan['status'] = newTerbayar >= tagihan.nominalTagihan ? 'Lunas' : 'Sebagian';
    setTagihanList(prev => prev.map(t => t.id === tagihan.id ? { ...t, nominalTerbayar: newTerbayar, status } : t));
    return true;
  };

  // Pembayaran tunai langsung terverifikasi; non-tunai menunggu verifikasi bendahara.
  const addBayarTagihan = (tagihanId: string, nominal: number, metode: TransaksiPembayaran['metodePembayaran'], catatan?: string, buktiTransferUrl?: string): TransaksiPembayaran | null => {
    const tagihan = tagihanList.find(t => t.id === tagihanId);
    if (!tagihan || nominal <= 0 || nominal > tagihan.nominalTagihan - tagihan.nominalTerbayar) return null;
    const now = new Date().toISOString();
    const otomatisTerverifikasi = ['Cash', 'Tunai'].includes(metode);
    const transaksi: TransaksiPembayaran = {
      id: `trx-${Date.now()}`,
      tagihanId,
      santriId: tagihan.santriId,
      noKuitansi: `KW-${now.slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      tanggal: now.slice(0, 10),
      nominal,
      metodePembayaran: metode,
      penerima: currentUser.nama,
      catatan,
      buktiTransferUrl,
      statusVerifikasi: otomatisTerverifikasi ? 'Terverifikasi' : 'Menunggu Verifikasi',
      verifiedBy: otomatisTerverifikasi ? currentUser.nama : undefined,
      verifiedAt: otomatisTerverifikasi ? now : undefined,
      appliedToTagihan: false
    };
    if (otomatisTerverifikasi && applyPaymentToTagihan(transaksi)) transaksi.appliedToTagihan = true;
    setTransaksiList(prev => [transaksi, ...prev]);
    return transaksi;
  };

  const verifikasiTransaksi = (id: string, status: 'Terverifikasi' | 'Ditolak', verifiedBy = currentUser.nama): boolean => {
    const transaksi = transaksiList.find(t => t.id === id);
    if (!transaksi || transaksi.statusVerifikasi === 'Terverifikasi' || transaksi.statusVerifikasi === 'Ditolak') return false;
    const now = new Date().toISOString();
    if (status === 'Terverifikasi' && !applyPaymentToTagihan(transaksi)) return false;
    setTransaksiList(prev => prev.map(t => t.id === id ? {
      ...t,
      statusVerifikasi: status,
      verifiedBy,
      verifiedAt: now,
      appliedToTagihan: status === 'Terverifikasi'
    } : t));
    return true;
  };

  // Resolusi unit santri (PONPES/SMP/MTS/MA/SMK/MADIN) — untuk snapshot & filter monitoring.
  const getUnitKeyFromSantri = (santriId: string, santriOverride?: Santri): string | undefined => {
    const s = santriOverride ?? santriList.find(x => x.id === santriId);
    if (!s) return undefined;
    const sekolah = unitSekolahList.find(u => u.id === s.unitSekolahId);
    if (sekolah?.kodeSekolah) return sekolah.kodeSekolah;
    const pesantren = unitsPesantren.find(u => u.id === s.unitPesantrenId);
    if (pesantren) return 'PONPES';
    const madin = marhalahList.find(m => m.id === s.marhalahMadinId);
    if (madin) return 'MADIN';
    return undefined;
  };

  const previewGenerateTagihan = (input: TagihanGenerationInput): TagihanGenerationPreview | null => {
    const biaya = biayaMasterList.find(b => b.id === input.biayaMasterId);
    const tahunAjaran = tahunAjaranList.find(t => t.id === (input.tahunAjaranId || getTahunAjaranAktif()?.id));
    if (!biaya || biaya.aktif === false || !tahunAjaran) return null;

    const periods = getGenerationPeriods(biaya, tahunAjaran, input.bulanMulai, input.bulanSelesai);
    const eligibleSantri = santriList.filter(s => s.status === 'Aktif' && isBiayaTargetMatch(s, biaya));
    let existingTagihanCount = 0;
    let calonTagihanCount = 0;
    let totalNominal = 0;

    for (const santri of eligibleSantri) {
      const nominal = getApplicableNominal(santri, biaya);
      if (nominal <= 0) continue;
      for (const period of periods) {
        const exists = tagihanList.some(t =>
          t.santriId === santri.id &&
          t.biayaMasterId === biaya.id &&
          getTagihanPeriodKey(t, tahunAjaran.id) === `${tahunAjaran.id}:${period.bulanKe}`
        );
        if (exists) existingTagihanCount++;
        else {
          calonTagihanCount++;
          totalNominal += nominal;
        }
      }
    }

    return {
      biayaMasterId: biaya.id,
      tahunAjaranId: tahunAjaran.id,
      periodeCount: periods.length,
      eligibleSantriCount: eligibleSantri.length,
      calonTagihanCount,
      existingTagihanCount,
      totalNominal,
      periodeLabels: periods.map(period => period.bulanTahun)
    };
  };

  const generateTagihanMassal = (input: TagihanGenerationInput): TagihanGenerationResult | null => {
    const biaya = biayaMasterList.find(b => b.id === input.biayaMasterId);
    const tahunAjaran = tahunAjaranList.find(t => t.id === (input.tahunAjaranId || getTahunAjaranAktif()?.id));
    if (!biaya || biaya.aktif === false || !tahunAjaran) return null;

    const periods = getGenerationPeriods(biaya, tahunAjaran, input.bulanMulai, input.bulanSelesai);
    const eligibleSantri = santriList.filter(s => s.status === 'Aktif' && isBiayaTargetMatch(s, biaya));
    const createdAt = Date.now();
    const newTagihans: TagihanKeuangan[] = [];
    let skippedCount = 0;
    let sequence = tagihanList.length + 1;

    for (const santri of eligibleSantri) {
      const nominal = getApplicableNominal(santri, biaya);
      if (nominal <= 0) continue;
      for (const period of periods) {
        const exists = tagihanList.some(t =>
          t.santriId === santri.id &&
          t.biayaMasterId === biaya.id &&
          getTagihanPeriodKey(t, tahunAjaran.id) === `${tahunAjaran.id}:${period.bulanKe}`
        ) || newTagihans.some(t =>
          t.santriId === santri.id &&
          t.biayaMasterId === biaya.id &&
          getTagihanPeriodKey(t, tahunAjaran.id) === `${tahunAjaran.id}:${period.bulanKe}`
        );

        if (exists) {
          skippedCount++;
          continue;
        }

        newTagihans.push({
          id: `tgh-${createdAt}-${newTagihans.length}`,
          santriId: santri.id,
          biayaMasterId: biaya.id,
          noTagihan: `TG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(sequence++).toString().padStart(4, '0')}`,
          bulanTahun: period.bulanTahun,
          bulanPeriode: BULAN_KE_LABEL[period.bulanKe - 1],
          tahunPeriode: Number(period.bulanTahun.slice(-4)),
          bulanKe: period.bulanKe,
          unitId: getUnitKeyFromSantri(santri.id),
          nominalTagihan: nominal,
          nominalTerbayar: 0,
          status: 'Belum Lunas',
          tanggalJatuhTempo: period.tanggalJatuhTempo,
          tahunAjaranId: tahunAjaran.id
        });
      }
    }

    if (newTagihans.length > 0) setTagihanList(prev => [...newTagihans, ...prev]);

    return {
      biayaMasterId: biaya.id,
      tahunAjaranId: tahunAjaran.id,
      eligibleSantriCount: eligibleSantri.length,
      periodeCount: periods.length,
      createdCount: newTagihans.length,
      skippedCount,
      totalNominal: newTagihans.reduce((total, tagihan) => total + tagihan.nominalTagihan, 0),
      tagihan: newTagihans
    };
  };

  // Rekam audit trail (siapa-melakukan-apa-kapan-terhadap-apa).
  const addAuditLog = (input: {
    action: AuditAction;
    entityType: 'Pemasukan';
    entityId: string;
    entityLabel: string;
    detail: string;
    before?: unknown;
    after?: unknown;
  }) => {
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      entityLabel: input.entityLabel,
      actorId: currentUser.id,
      actorName: currentUser.nama,
      detail: input.detail,
      before: input.before,
      after: input.after,
      createdAt: new Date().toISOString()
    };
    setAuditLogList(prev => [log, ...prev]);
  };

  const createPemasukan = (input: NewPemasukanInput): {
    ok: boolean;
    error?: string;
    pemasukan?: Pemasukan;
  } => {
    const biaya = input.biayaMasterId ? biayaMasterList.find(item => item.id === input.biayaMasterId) : undefined;
    const tahunAjaranId = getTahunAjaranAktif()?.id;
    const isRecurring = Boolean(biaya && (
      biaya.jenis === 'Syahriyah' || biaya.tipeFrekuensi === 'Bulanan' || biaya.tipeFrekuensi === 'Periodik'
    ));
    const bulanKe = input.bulanKe ?? bulanKeFromBulanTahun(input.periode);
    const matchingTagihans = biaya && input.biayaMasterId
      ? tagihanList.filter(tagihan => {
        const sameYear = !tahunAjaranId || !tagihan.tahunAjaranId || tagihan.tahunAjaranId === tahunAjaranId;
        const samePeriod = !isRecurring || tagihan.bulanKe === bulanKe || (
          !tagihan.bulanKe && bulanKeFromBulanTahun(tagihan.bulanTahun ?? '') === bulanKe
        );
        return tagihan.santriId === input.santriId &&
          tagihan.biayaMasterId === input.biayaMasterId &&
          sameYear && samePeriod &&
          tagihan.nominalTagihan > tagihan.nominalTerbayar;
      })
      : [];

    if (!biaya) return { ok: false, error: 'Jenis pembayaran tidak ditemukan.' };
    if (isRecurring && !bulanKe) {
      return { ok: false, error: 'Periode bulan wajib dipilih untuk pembayaran bulanan.' };
    }
    if (matchingTagihans.length === 0) {
      return { ok: false, error: 'Tagihan untuk jenis pembayaran dan periode ini belum dibuat. Generate tagihan terlebih dahulu di tab Jenis Pembayaran.' };
    }

    let amountToApply = input.nominal;
    const tagihanApplications: { id: string; nominal: number }[] = [];
    for (const tagihan of matchingTagihans) {
      const remaining = Math.max(0, tagihan.nominalTagihan - tagihan.nominalTerbayar);
      const applied = Math.min(remaining, amountToApply);
      if (applied > 0) {
        tagihanApplications.push({ id: tagihan.id, nominal: applied });
        amountToApply -= applied;
      }
      if (amountToApply <= 0) break;
    }
    if (amountToApply > 0) {
      return { ok: false, error: 'Nominal pembayaran melebihi sisa tagihan pada jenis dan periode yang dipilih.' };
    }

    if (!input.nominal || input.nominal <= 0) {
      return { ok: false, error: 'Nominal pembayaran harus lebih dari 0.' };
    }
    const unitId = getUnitKeyFromSantri(input.santriId);
    const nowIso = new Date().toISOString();
    const id = `pmk-${Date.now()}`;
    const tanggal = input.tanggal || nowIso.slice(0, 10);
    const pemasukan: Pemasukan = {
      id,
      noPemasukan: `PMK-${tanggal.replace(/-/g, '')}-${(pemasukanList.length + 1).toString().padStart(4, '0')}`,
      santriId: input.santriId,
      biayaMasterId: input.biayaMasterId,
      unitId,
      tanggal,
      nominal: Math.floor(input.nominal),
      jenisPembayaran: input.jenisPembayaran,
      metodePembayaran: input.metodePembayaran,
      periode: input.periode,
      bulanKe: input.bulanKe,
      tahunAjaranId: input.tahunAjaranId,
      catatan: input.catatan,
      status: 'PAID',
      paidAt: nowIso,
      createdBy: input.createdBy,
      createdAt: nowIso,
      appliedTagihanIds: tagihanApplications.map(application => application.id)
    };
    setPemasukanList(prev => [pemasukan, ...prev]);
    if (tagihanApplications.length > 0) {
      setTagihanList(prev => prev.map(tagihan => {
        const application = tagihanApplications.find(item => item.id === tagihan.id);
        if (!application) return tagihan;
        const nominalTerbayar = Math.min(tagihan.nominalTagihan, tagihan.nominalTerbayar + application.nominal);
        return {
          ...tagihan,
          nominalTerbayar,
          status: nominalTerbayar >= tagihan.nominalTagihan ? 'Lunas' : 'Sebagian'
        };
      }));
    }

    const santriNama = getSantriNameById(input.santriId);
    addAuditLog({
      action: 'CREATE_PAYMENT',
      entityType: 'Pemasukan',
      entityId: pemasukan.id,
      entityLabel: pemasukan.noPemasukan,
      detail: `Pencatatan pembayaran ${pemasukan.jenisPembayaran} Rp ${pemasukan.nominal.toLocaleString('id-ID')} a.n. ${santriNama} (${unitId ?? '-'}) — ${pemasukan.appliedTagihanIds?.length ?? 0} tagihan diperbarui.`,
      after: { status: pemasukan.status, nominal: pemasukan.nominal, unit: unitId, appliedTagihanIds: pemasukan.appliedTagihanIds }
    });
    return { ok: true, pemasukan };
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
      kategoriUtama: 'Santri',
      tipeAsuh: 'Bukan Asuh',
      program: 'Pelajar',
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
        currentUser,
        setCurrentUser,
        users,
        updateCurrentUserProfile,
        addAdminAccount,
        updateAdminAccount,
        deleteAdminAccount,

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
        addBiayaMaster,
        updateBiayaMaster,
        deleteBiayaMaster,
        tarifPembayaranList,
        addTarifPembayaran,
        updateTarifPembayaran,
        deleteTarifPembayaran,
        tagihanList,
        transaksiList,
        generateTagihan,
        getNominalBiayaSantri,
        getTagihanPreview,
        previewGenerateTagihan,
        generateTagihanMassal,
        addBayarTagihan,
        verifikasiTransaksi,

        pemasukanList,
        createPemasukan,
        getUnitKeyFromSantri,

        auditLogList,
        addAuditLog,

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
