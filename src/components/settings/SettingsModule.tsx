import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ShieldCheck, CalendarDays, Check, X, Eye, Edit3, Lock, Info } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Header + Tab Navigation */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#1ABC9C]" />
            Pengaturan Sistem & Logika Perizinan RBAC
          </h2>
          <p className="text-xs text-[#566573]">Manajemen hak akses role login, matriks perizinan modul, dan konfigurasi tahun ajaran</p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rbac' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Pengguna & Role
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Matriks Perizinan Modul
          </button>

          <button
            onClick={() => setActiveTab('tahunAjaran')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tahunAjaran' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Tahun Ajaran
          </button>
        </div>
      </div>

      {/* Tab 1: Pengguna & Role */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar Pengguna & Level Akses Active</h3>
                <p className="text-xs text-gray-500">Ganti role aktif untuk menguji logika perizinan pada navigasi dan modul</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                Mode Aktif: {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                    <th className="p-3 rounded-tl-lg">Username</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">Role Level</th>
                    <th className="p-3">Wewenang / Deskripsi Singkat</th>
                    <th className="p-3 rounded-tr-lg text-center">Status / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className={`hover:bg-sky-50 transition-colors ${currentUser.role === u.role ? 'bg-sky-50/70 font-semibold' : ''}`}>
                      <td className="p-3 font-mono font-bold text-[#1A5276]">{u.username}</td>
                      <td className="p-3 font-extrabold text-gray-800">{u.nama}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 bg-sky-100 text-[#1A5276] px-2 py-0.5 rounded font-bold text-[11px] capitalize">
                          <ShieldCheck className="w-3 h-3 text-[#1ABC9C]" />
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
              return (
                <div 
                  key={roleKey}
                  className={`bg-white rounded-xl border p-4 shadow-sm transition-all space-y-2 relative overflow-hidden ${
                    isCurrent ? 'border-[#1ABC9C] ring-2 ring-[#1ABC9C]/30' : 'border-gray-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${details?.color || 'bg-gray-700 text-white'}`}>
                      {roleKey.replace('_', ' ')}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        Aktif Saat Ini
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-[#1A5276]">{details?.title || roleKey}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{details?.description}</p>

                  <div className="pt-2">
                    <button
                      onClick={() => switchRole(roleKey)}
                      className={`w-full py-1.5 rounded text-xs font-bold transition-all ${
                        isCurrent 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                          : 'bg-[#1A5276] text-white hover:bg-[#2E86C1]'
                      }`}
                    >
                      {isCurrent ? 'Pengguna Menggunakan Role Ini' : `Aktifkan Mode ${roleKey.replace('_', ' ')}`}
                    </button>
                  </div>
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
