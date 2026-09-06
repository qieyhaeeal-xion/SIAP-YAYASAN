import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { changeAdminPassword } from '../../services/authService';
import { TahunAjaranModule } from './TahunAjaranModule';
import { MODULE_PERMISSIONS } from '../../utils/rbac';
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Database,
  Download,
  Edit3,
  Eye,
  FileText,
  Info,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  Users,
  X
} from 'lucide-react';

type SettingsTab = 'profile' | 'accounts' | 'institution' | 'backup' | 'matrix' | 'tahunAjaran';
type Notice = { type: 'success' | 'error'; text: string } | null;

interface InstitutionConfig {
  namaYayasan: string;
  namaPesantren: string;
  nsp: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  telepon: string;
  email: string;
  ketuaYayasan: string;
  pengasuh: string;
}

const INSTITUTION_KEY = 'sisantri_app_institutionConfig';
const BACKUP_KEYS = [
  'users', 'unitsPesantren', 'asramaList', 'kamarList', 'marhalahList', 'kelasMadinList', 'kitabList',
  'unitSekolahList', 'jurusanList', 'kelasSekolahList', 'santriDemoSeedVersion', 'santriList',
  'setoranTahfidz', 'setoranNadhoman', 'kesehatan', 'perizinan', 'konseling', 'kunjungan', 'jabatan',
  'pegawai', 'presensi', 'biayaMaster', 'statusDemoSeedVersion', 'tarifPembayaran', 'tarifDemoSeedVersion',
  'tagihan', 'transaksi', 'distribusiConfig', 'pemasukan', 'alokasiPemasukan', 'auditLog', 'tahunAjaran',
  'pesertaTahfidz', 'ppdb', 'demoFinanceSeedVersion', 'institutionConfig'
] as const;

const DEFAULT_INSTITUTION: InstitutionConfig = {
  namaYayasan: 'Yayasan Mukhtar Syafaat',
  namaPesantren: 'Pondok Pesantren Mukhtar Syafaat',
  nsp: '',
  alamat: 'Jl. Pesantren No. 01 Blokagung, Tegalsari',
  kabupaten: 'Banyuwangi',
  provinsi: 'Jawa Timur',
  telepon: '(0333) 845123',
  email: 'yayasan@mukhtarsyafaat.ac.id',
  ketuaYayasan: '',
  pengasuh: ''
};

const inputClass = 'w-full rounded-xl border border-gray-300 px-3.5 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20';
const labelClass = 'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-600';

function readInstitution(): InstitutionConfig {
  try {
    const stored = window.localStorage.getItem(INSTITUTION_KEY);
    return stored ? { ...DEFAULT_INSTITUTION, ...JSON.parse(stored) } : DEFAULT_INSTITUTION;
  } catch {
    return DEFAULT_INSTITUTION;
  }
}

function getBackupValue(key: string, app: Record<string, unknown>): unknown {
  const sourceByKey: Record<string, string> = {
    setoranTahfidz: 'setoranTahfidzList',
    setoranNadhoman: 'setoranNadhomanList',
    kesehatan: 'kesehatanList',
    perizinan: 'perizinanList',
    konseling: 'konselingList',
    kunjungan: 'kunjunganList',
    pegawai: 'pegawaiList',
    presensi: 'presensiList',
    biayaMaster: 'biayaMasterList',
    tarifPembayaran: 'tarifPembayaranList',
    tagihan: 'tagihanList',
    transaksi: 'transaksiList',
    distribusiConfig: 'distribusiConfigList',
    pemasukan: 'pemasukanList',
    alokasiPemasukan: 'alokasiList',
    auditLog: 'auditLogList',
    tahunAjaran: 'tahunAjaranList',
    pesertaTahfidz: 'pesertaTahfidzList',
    ppdb: 'ppdbList',
    institutionConfig: 'institutionConfig'
  };
  const source = sourceByKey[key] || key;
  if (source === 'institutionConfig') return readInstitution();
  return app[source] ?? JSON.parse(window.localStorage.getItem(`sisantri_app_${key}`) || 'null');
}

export const SettingsModule: React.FC = () => {
  const app = useApp();
  const { currentUser } = app;
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notice, setNotice] = useState<Notice>(null);
  const [profile, setProfile] = useState({ nama: currentUser.nama, username: currentUser.username, email: currentUser.email || '', noHp: currentUser.noHp || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [institution, setInstitution] = useState<InstitutionConfig>(readInstitution);
  const [accountForm, setAccountForm] = useState({ nama: '', username: '', email: '', noHp: '' });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.localStorage.setItem(INSTITUTION_KEY, JSON.stringify(institution));
  }, [institution]);

  if (currentUser.role !== 'admin_yayasan') {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-rose-600" />
        <h3 className="text-lg font-extrabold text-gray-900">Akses Dibatasi</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">Pengaturan sistem hanya dapat diakses oleh Admin Yayasan (Super Admin).</p>
      </div>
    );
  }

  const setSuccess = (text: string) => setNotice({ type: 'success', text });
  const setError = (text: string) => setNotice({ type: 'error', text });

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile.nama.trim() || !profile.username.trim()) return setError('Nama dan username wajib diisi.');
    app.updateCurrentUserProfile(profile);
    setSuccess('Profil Admin Yayasan berhasil diperbarui.');
  };

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordForm.next.length < 6) return setError('Kata sandi baru minimal 6 karakter.');
    if (passwordForm.next !== passwordForm.confirm) return setError('Konfirmasi kata sandi tidak sama.');
    try {
      changeAdminPassword(currentUser.username, passwordForm.current, passwordForm.next);
      setPasswordForm({ current: '', next: '', confirm: '' });
      setSuccess('Kata sandi berhasil diubah.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kata sandi gagal diubah.');
    }
  };

  const saveAccount = (event: React.FormEvent) => {
    event.preventDefault();
    if (!accountForm.nama.trim() || !accountForm.username.trim()) return setError('Nama dan username akun wajib diisi.');
    if (editingAccountId) {
      app.updateAdminAccount(editingAccountId, accountForm);
      setSuccess('Akun Admin berhasil diperbarui.');
    } else {
      if (app.users.some(user => user.username.toLowerCase() === accountForm.username.trim().toLowerCase())) return setError('Username sudah digunakan.');
      app.addAdminAccount(accountForm);
      setSuccess('Akun Admin berhasil ditambahkan. Kata sandi awal: 123456.');
    }
    setAccountForm({ nama: '', username: '', email: '', noHp: '' });
    setEditingAccountId(null);
  };

  const editAccount = (id: string) => {
    const account = app.users.find(user => user.id === id);
    if (!account) return;
    setAccountForm({ nama: account.nama, username: account.username, email: account.email || '', noHp: account.noHp || '' });
    setEditingAccountId(id);
  };

  const downloadBackup = () => {
    const data = BACKUP_KEYS.reduce<Record<string, unknown>>((result, key) => {
      result[key] = getBackupValue(key, app as unknown as Record<string, unknown>);
      return result;
    }, {});
    const backup = { app: 'SIAP-Yayasan', version: 1, exportedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `siap-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess('Backup data berhasil diunduh.');
  };

  const restoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(String(reader.result)) as { app?: string; data?: Record<string, unknown> };
        if (backup.app !== 'SIAP-Yayasan' || !backup.data || typeof backup.data !== 'object') throw new Error('Format backup tidak dikenali.');
        BACKUP_KEYS.forEach(key => {
          if (backup.data?.[key] !== undefined) window.localStorage.setItem(`sisantri_app_${key}`, JSON.stringify(backup.data[key]));
        });
        setSuccess('Restore berhasil. Halaman akan dimuat ulang.');
        window.setTimeout(() => window.location.reload(), 700);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'File backup tidak valid.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetData = () => {
    if (!window.confirm('Reset seluruh data aplikasi? Akun Admin dan sesi login akan tetap dipertahankan.')) return;
    BACKUP_KEYS.filter(key => key !== 'users' && key !== 'institutionConfig').forEach(key => window.localStorage.removeItem(`sisantri_app_${key}`));
    setSuccess('Data aplikasi direset. Halaman akan dimuat ulang.');
    window.setTimeout(() => window.location.reload(), 700);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profil & Keamanan', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'accounts', label: 'Akun Admin', icon: <Users className="h-4 w-4" /> },
    { id: 'institution', label: 'Identitas Lembaga', icon: <Building2 className="h-4 w-4" /> },
    { id: 'backup', label: 'Backup & Maintenance', icon: <Database className="h-4 w-4" /> },
    { id: 'matrix', label: 'Matriks Akses', icon: <Lock className="h-4 w-4" /> },
    { id: 'tahunAjaran', label: 'Tahun Ajaran', icon: <CalendarDays className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <header className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-xl font-extrabold text-[#1A5276]"><ShieldAlert className="h-7 w-7 text-[#1ABC9C]" /> Pengaturan Admin Yayasan</h2>
            <p className="mt-1 text-sm text-gray-500">Kelola profil, keamanan, akun admin, identitas lembaga, dan pemeliharaan data SIAP.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Super Admin Aktif</span>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1.5">
          {tabs.map(tab => <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setNotice(null); }} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${activeTab === tab.id ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:bg-white'}`}>{tab.icon}{tab.label}</button>)}
        </nav>
      </header>

      {notice && <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{notice.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}{notice.text}</div>}

      {activeTab === 'profile' && <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={saveProfile} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div><h3 className="text-lg font-extrabold text-[#1A5276]">Profil Admin</h3><p className="mt-1 text-sm text-gray-500">Informasi ini ditampilkan pada header dan riwayat aktivitas.</p></div>
          <div><label className={labelClass}>Nama Lengkap</label><input className={inputClass} value={profile.nama} onChange={event => setProfile({ ...profile, nama: event.target.value })} /></div>
          <div><label className={labelClass}>Username</label><input className={inputClass} value={profile.username} onChange={event => setProfile({ ...profile, username: event.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Email</label><div className="relative"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" /><input type="email" className={`${inputClass} pl-9`} value={profile.email} onChange={event => setProfile({ ...profile, email: event.target.value })} /></div></div><div><label className={labelClass}>No. HP</label><div className="relative"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" /><input className={`${inputClass} pl-9`} value={profile.noHp} onChange={event => setProfile({ ...profile, noHp: event.target.value })} /></div></div></div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#1A5276] px-4 py-3 text-sm font-bold text-white hover:bg-[#2E86C1]"><Save className="h-4 w-4" /> Simpan Profil</button>
        </form>
        <form onSubmit={savePassword} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div><h3 className="text-lg font-extrabold text-[#1A5276]">Ganti Kata Sandi</h3><p className="mt-1 text-sm text-gray-500">Gunakan minimal 6 karakter dan jangan gunakan kata sandi yang mudah ditebak.</p></div>
          <div><label className={labelClass}>Kata Sandi Saat Ini</label><div className="relative"><KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" /><input required type="password" className={`${inputClass} pl-9`} value={passwordForm.current} onChange={event => setPasswordForm({ ...passwordForm, current: event.target.value })} /></div></div>
          <div><label className={labelClass}>Kata Sandi Baru</label><input required type="password" className={inputClass} value={passwordForm.next} onChange={event => setPasswordForm({ ...passwordForm, next: event.target.value })} /></div>
          <div><label className={labelClass}>Konfirmasi Kata Sandi</label><input required type="password" className={inputClass} value={passwordForm.confirm} onChange={event => setPasswordForm({ ...passwordForm, confirm: event.target.value })} /></div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#1A5276] px-4 py-3 text-sm font-bold text-white hover:bg-[#2E86C1]"><KeyRound className="h-4 w-4" /> Ubah Kata Sandi</button>
        </form>
      </div>}

      {activeTab === 'accounts' && <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="border-b border-gray-100 p-5"><h3 className="text-lg font-extrabold text-[#1A5276]">Daftar Akun Admin</h3><p className="mt-1 text-sm text-gray-500">Semua akun pada daftar ini memiliki akses Super Admin.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#1A5276] text-xs uppercase tracking-wide text-white"><tr><th className="p-3">Nama</th><th className="p-3">Username</th><th className="p-3">Kontak</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-gray-100">{app.users.map(user => <tr key={user.id} className="hover:bg-sky-50"><td className="p-3 font-bold text-gray-800">{user.nama}</td><td className="p-3 font-mono text-[#1A5276]">{user.username}</td><td className="p-3 text-xs text-gray-500">{user.email || user.noHp || '-'}</td><td className="p-3 text-right"><button type="button" onClick={() => editAccount(user.id)} className="mr-2 rounded-lg p-2 text-[#1A5276] hover:bg-sky-100" title="Edit"><Pencil className="h-4 w-4" /></button><button type="button" disabled={user.id === currentUser.id || user.id === 'usr-1'} onClick={() => { if (window.confirm('Hapus akun admin ini?')) app.deleteAdminAccount(user.id); }} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30" title="Hapus"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></section>
        <form onSubmit={saveAccount} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div><h3 className="text-lg font-extrabold text-[#1A5276]">{editingAccountId ? 'Edit Akun Admin' : 'Tambah Akun Admin'}</h3><p className="mt-1 text-xs text-gray-500">Akun baru menggunakan kata sandi awal <strong>123456</strong>.</p></div><div><label className={labelClass}>Nama Lengkap</label><input required className={inputClass} value={accountForm.nama} onChange={event => setAccountForm({ ...accountForm, nama: event.target.value })} /></div><div><label className={labelClass}>Username</label><input required disabled={Boolean(editingAccountId)} className={`${inputClass} disabled:bg-gray-100`} value={accountForm.username} onChange={event => setAccountForm({ ...accountForm, username: event.target.value })} /></div><div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={accountForm.email} onChange={event => setAccountForm({ ...accountForm, email: event.target.value })} /></div><div><label className={labelClass}>No. HP</label><input className={inputClass} value={accountForm.noHp} onChange={event => setAccountForm({ ...accountForm, noHp: event.target.value })} /></div><div className="flex gap-2"><button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A5276] px-3 py-3 text-sm font-bold text-white hover:bg-[#2E86C1]"><Plus className="h-4 w-4" /> {editingAccountId ? 'Simpan Perubahan' : 'Tambah Akun'}</button>{editingAccountId && <button type="button" onClick={() => { setEditingAccountId(null); setAccountForm({ nama: '', username: '', email: '', noHp: '' }); }} className="rounded-xl border border-gray-300 px-3 text-sm font-bold text-gray-600">Batal</button>}</div></form>
      </div>}

      {activeTab === 'institution' && <form onSubmit={event => { event.preventDefault(); setSuccess('Identitas lembaga berhasil disimpan.'); }} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div><h3 className="text-lg font-extrabold text-[#1A5276]">Identitas Lembaga</h3><p className="mt-1 text-sm text-gray-500">Data ini disiapkan untuk header laporan, kuitansi, dan dokumen resmi.</p></div><div className="grid gap-4 md:grid-cols-2"><div><label className={labelClass}>Nama Yayasan</label><input className={inputClass} value={institution.namaYayasan} onChange={event => setInstitution({ ...institution, namaYayasan: event.target.value })} /></div><div><label className={labelClass}>Nama Pesantren</label><input className={inputClass} value={institution.namaPesantren} onChange={event => setInstitution({ ...institution, namaPesantren: event.target.value })} /></div><div><label className={labelClass}>Nomor Statistik Pesantren</label><input className={inputClass} value={institution.nsp} onChange={event => setInstitution({ ...institution, nsp: event.target.value })} /></div><div><label className={labelClass}>Telepon Resmi</label><div className="relative"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" /><input className={`${inputClass} pl-9`} value={institution.telepon} onChange={event => setInstitution({ ...institution, telepon: event.target.value })} /></div></div><div className="md:col-span-2"><label className={labelClass}>Alamat Lengkap</label><div className="relative"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" /><textarea rows={2} className={`${inputClass} pl-9`} value={institution.alamat} onChange={event => setInstitution({ ...institution, alamat: event.target.value })} /></div></div><div><label className={labelClass}>Kabupaten</label><input className={inputClass} value={institution.kabupaten} onChange={event => setInstitution({ ...institution, kabupaten: event.target.value })} /></div><div><label className={labelClass}>Provinsi</label><input className={inputClass} value={institution.provinsi} onChange={event => setInstitution({ ...institution, provinsi: event.target.value })} /></div><div><label className={labelClass}>Email Resmi</label><input type="email" className={inputClass} value={institution.email} onChange={event => setInstitution({ ...institution, email: event.target.value })} /></div><div><label className={labelClass}>Ketua Yayasan</label><input className={inputClass} value={institution.ketuaYayasan} onChange={event => setInstitution({ ...institution, ketuaYayasan: event.target.value })} /></div><div><label className={labelClass}>Pengasuh</label><input className={inputClass} value={institution.pengasuh} onChange={event => setInstitution({ ...institution, pengasuh: event.target.value })} /></div></div><button className="inline-flex items-center gap-2 rounded-xl bg-[#1A5276] px-4 py-3 text-sm font-bold text-white hover:bg-[#2E86C1]"><Save className="h-4 w-4" /> Simpan Identitas</button></form>}

      {activeTab === 'backup' && <div className="grid gap-6 lg:grid-cols-3"><section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2"><h3 className="text-lg font-extrabold text-[#1A5276]">Backup & Restore Data</h3><p className="mt-1 text-sm text-gray-500">Backup mencakup seluruh data aplikasi, akun admin, dan identitas lembaga dalam format JSON.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><button type="button" onClick={downloadBackup} className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-5 text-center text-emerald-800 hover:bg-emerald-100"><Download className="h-8 w-8" /><strong>Download Backup</strong><span className="text-xs">Simpan salinan data JSON</span></button><button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-5 text-center text-sky-800 hover:bg-sky-100"><Upload className="h-8 w-8" /><strong>Restore Backup</strong><span className="text-xs">Pilih file JSON yang valid</span></button></div><input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={restoreBackup} /><div className="mt-5 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" /><span>Restore akan mengganti data lokal saat ini dan memuat ulang halaman. Download backup terbaru sebelum melakukan restore.</span></div></section><section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-extrabold text-rose-700">Zona Pemeliharaan</h3><p className="mt-1 text-sm text-gray-500">Gunakan hanya saat diperlukan. Akun Admin dan sesi login tidak dihapus.</p><button type="button" onClick={resetData} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-rose-100"><Trash2 className="h-4 w-4" /> Reset Data Aplikasi</button></section></div>}

      {activeTab === 'matrix' && <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="border-b border-gray-100 p-5"><h3 className="text-lg font-extrabold text-[#1A5276]">Matriks Akses Super Admin</h3><p className="mt-1 text-sm text-gray-500">Admin Yayasan memiliki akses penuh terhadap seluruh modul yang terdaftar.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#1A5276] text-xs uppercase tracking-wide text-white"><tr><th className="p-3">Modul</th><th className="p-3">Kategori</th><th className="p-3 text-center">Lihat</th><th className="p-3 text-center">Edit</th><th className="p-3 text-center">Hapus</th></tr></thead><tbody className="divide-y divide-gray-100">{MODULE_PERMISSIONS.map(module => <tr key={module.id}><td className="p-3 font-bold text-gray-800">{module.label}</td><td className="p-3 text-xs text-gray-500">{module.category}</td><td className="p-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-600" /></td><td className="p-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-600" /></td><td className="p-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-600" /></td></tr>)}</tbody></table></div></section>}

      {activeTab === 'tahunAjaran' && <TahunAjaranModule />}
    </div>
  );
};
