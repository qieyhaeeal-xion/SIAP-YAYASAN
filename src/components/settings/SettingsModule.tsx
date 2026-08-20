import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ShieldCheck, CalendarDays, Check, X, Eye, Edit3, Lock, Info, Users, HeartHandshake, UserCog } from 'lucide-react';
import { TahunAjaranModule } from './TahunAjaranModule';
import { MODULE_PERMISSIONS, ROLE_DETAILS } from '../../utils/rbac';
import { UserRole } from '../../types/sisantri';

type SettingsTab = 'rbac' | 'matrix' | 'tahunAjaran';

export const SettingsModule: React.FC = () => {
  const { users, currentUser, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('rbac');

  const allRoles: UserRole[] = [
    'admin_yayasan',
    'pengurus',
    'guru',
    'wali_santri'
  ];

  const roleMeta: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'admin_yayasan', label: 'Admin Yayasan', icon: <ShieldCheck className="w-5 h-5" /> },
    { role: 'pengurus', label: 'Pengurus Pesantren', icon: <UserCog className="w-5 h-5" /> },
    { role: 'guru', label: 'Guru / Ustadz', icon: <Users className="w-5 h-5" /> },
    { role: 'wali_santri', label: 'Wali Santri', icon: <HeartHandshake className="w-5 h-5" /> },
  ];

  const getModuleStats = (role: UserRole) => {
    const allowed = MODULE_PERMISSIONS.filter(m => m.allowedRoles.includes(role) || role === 'admin_sistem').length;
    const writable = MODULE_PERMISSIONS.filter(m => m.writableRoles.includes(role) || role === 'admin_sistem').length;
    return { allowed, writable };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header + Tab Navigation */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-[#1ABC9C]" />
            Pengaturan Sistem & Logika Perizinan RBAC
          </h2>
          <p className="text-sm text-[#566573] mt-1">Manajemen hak akses role login, matriks perizinan modul, dan konfigurasi tahun ajaran</p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg flex-wrap">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rbac' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Pengguna & Role
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matrix' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-5 h-5" />
            Matriks Perizinan Modul
          </button>

          <button
            onClick={() => setActiveTab('tahunAjaran')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tahunAjaran' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            Tahun Ajaran
          </button>
        </div>
      </div>

      {/* Tab 1: Pengguna & Role */}
      {activeTab === 'rbac' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Pengguna & Level Akses</h3>
                <p className="text-sm text-gray-500 mt-1">Ganti role aktif untuk menguji logika perizinan pada navigasi dan modul</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-1.5 rounded-full border border-emerald-300">
                Mode Aktif: {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                    <th className="p-4 rounded-tl-lg">Username</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Role Level</th>
                    <th className="p-4">Wewenang / Deskripsi Singkat</th>
                    <th className="p-4 rounded-tr-lg text-center">Status / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className={`hover:bg-sky-50 transition-colors ${currentUser.role === u.role ? 'bg-sky-50/70 font-semibold' : ''}`}>
                      <td className="p-4 font-mono font-bold text-[#1A5276] text-base">{u.username}</td>
                      <td className="p-4 font-extrabold text-gray-800 text-base">{u.nama}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 bg-sky-100 text-[#1A5276] px-3 py-1 rounded font-bold text-xs capitalize">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1ABC9C]" />
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-gray-600 max-w-xs truncate">
                        {ROLE_DETAILS[u.role]?.description || '-'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => switchRole(u.role)}
                          className={`px-3 py-1 rounded text-[10px] font-bold transition-all shadow-xs ${
                            currentUser.role === u.role
                              ? 'bg-emerald-600 text-white shadow-emerald-200'
                              : 'bg-[#1A5276] text-white hover:bg-[#2E86C1]'
                          }`}
                        >
                          {currentUser.role === u.role ? '✓ Role Aktif' : 'Ganti ke Role Ini'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards for each Role Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRoles.map(roleKey => {
              const details = ROLE_DETAILS[roleKey];
              const isCurrent = currentUser.role === roleKey;
              const stats = getModuleStats(roleKey);
              const meta = roleMeta.find(r => r.role === roleKey);
              return (
                <div
                  key={roleKey}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 relative overflow-hidden ${
                    isCurrent ? 'border-[#1ABC9C] ring-2 ring-[#1ABC9C]/30' : 'border-gray-200 hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${details?.color?.split(' ')[0] || 'bg-gray-700'}`} />

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow shrink-0 ${details?.color || 'bg-gray-700'}`}>
                        {meta?.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-[#1A5276] leading-tight truncate">{details?.title || roleKey}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{roleKey.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Aktif
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{details?.description}</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-sky-50 rounded-lg p-2 text-center">
                      <p className="text-base font-black text-[#1A5276]">{stats.allowed}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Modul</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <p className="text-base font-black text-emerald-700">{stats.writable}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Dapat Edit</p>
                    </div>
                    <div className={`rounded-lg p-2 text-center ${isCurrent ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <p className={`text-base font-black ${isCurrent ? 'text-emerald-700' : 'text-gray-500'}`}>{isCurrent ? 'Aktif' : 'Non'}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Status</p>
                    </div>
                  </div>

                  <button
                    onClick={() => switchRole(roleKey)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-[#1A5276] text-white hover:bg-[#2E86C1]'
                    }`}
                  >
                    {isCurrent ? '✓ Pengguna Menggunakan Role Ini' : `Aktifkan Mode ${roleKey.replace('_', ' ')}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Matriks Perizinan Modul */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-[#1A5276]">Matriks Hak Akses Perizinan Modul (RBAC Matrix)</h3>
              <p className="text-xs text-gray-500">Pemetaan wewenang perizinan setiap role pengguna terhadap 17 modul aplikasi</p>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-700">
                <Check className="w-3.5 h-3.5 bg-emerald-100 rounded text-emerald-700 p-0.5" /> Full Access
              </span>
              <span className="flex items-center gap-1 text-sky-700">
                <Edit3 className="w-3.5 h-3.5 bg-sky-100 rounded text-sky-700 p-0.5" /> View & Edit
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <Eye className="w-3.5 h-3.5 bg-amber-100 rounded text-amber-700 p-0.5" /> View Only
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <X className="w-3.5 h-3.5 bg-rose-100 rounded text-rose-700 p-0.5" /> Restricted
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg sticky left-0 bg-[#1A5276] z-10">Nama Modul</th>
                  <th className="p-3">Kategori</th>
                  {allRoles.map(r => (
                    <th key={r} className="p-2 text-center text-[10px] font-extrabold capitalize whitespace-nowrap min-w-24">
                      {r.replace('admin_', 'Adm ').replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MODULE_PERMISSIONS.map(mod => (
                  <tr key={mod.id} className="hover:bg-sky-50/70 transition-colors">
                    <td className="p-3 font-extrabold text-gray-900 sticky left-0 bg-white shadow-xs z-10">
                      {mod.label}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                        {mod.category}
                      </span>
                    </td>

                    {allRoles.map(role => {
                      const isAllowed = mod.allowedRoles.includes(role) || role === 'admin_sistem';
                      const isWritable = mod.writableRoles.includes(role) || role === 'admin_sistem';
                      const isDeletable = mod.deletableRoles.includes(role) || role === 'admin_sistem';

                      if (!isAllowed) {
                        return (
                          <td key={role} className="p-2 text-center bg-rose-50/40">
                            <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-100 text-rose-600" title="Akses Ditolak">
                              <X className="w-3 h-3" />
                            </span>
                          </td>
                        );
                      }

                      if (isDeletable) {
                        return (
                          <td key={role} className="p-2 text-center bg-emerald-50/50">
                            <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]" title="Akses Penuh (Read, Write, Delete)">
                              <Check className="w-3 h-3 text-emerald-700" /> FULL
                            </span>
                          </td>
                        );
                      }

                      if (isWritable) {
                        return (
                          <td key={role} className="p-2 text-center bg-sky-50/50">
                            <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[10px]" title="Dapat Melihat & Mengedit">
                              <Edit3 className="w-3 h-3 text-sky-700" /> EDIT
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={role} className="p-2 text-center bg-amber-50/40">
                          <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]" title="Hanya Dapat Melihat Laporan">
                            <Eye className="w-3 h-3 text-amber-700" /> VIEW
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-[#1A5276] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#1ABC9C] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Penjelasan Logika Perizinan Modul:</p>
              <ul className="list-disc list-inside text-[11px] text-gray-700 space-y-0.5 mt-1">
                <li><strong className="text-emerald-700">FULL:</strong> Pengguna memiliki akses penuh untuk melihat, menambah, mengubah, serta menghapus data modul.</li>
                <li><strong className="text-sky-700">EDIT:</strong> Pengguna dapat melihat data dan melakukan penginputan/pengeditan (misal: Guru input presensi & setoran hafalan).</li>
                <li><strong className="text-amber-700">VIEW:</strong> Pengguna hanya dapat memantau/melihat statistik & laporan tanpa dapat mengubah master data (misal: Pimpinan Pesantren).</li>
                <li><strong className="text-rose-700">Restricted (X):</strong> Modul dikunci untuk role tersebut. Percobaan navigasi langsung akan ditolak oleh sistem.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tahun Ajaran */}
      {activeTab === 'tahunAjaran' && <TahunAjaranModule />}

    </div>
  );
};
