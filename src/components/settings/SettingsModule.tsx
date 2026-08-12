import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ShieldCheck, CalendarDays } from 'lucide-react';
import { TahunAjaranModule } from './TahunAjaranModule';

type SettingsTab = 'rbac' | 'tahunAjaran';

export const SettingsModule: React.FC = () => {
  const { users, currentUser, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('rbac');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Header + Tab Navigation */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#1ABC9C]" />
            Pengaturan Sistem
          </h2>
          <p className="text-xs text-[#566573]">Manajemen hak akses RBAC, tahun ajaran, dan konfigurasi pesantren</p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rbac' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Hak Akses (RBAC)
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

      {/* Tab: RBAC */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar User & Level Akses Sistem</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">Username</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Role Level</th>
                  <th className="p-3 rounded-tr-lg text-center">Status Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1A5276]">{u.username}</td>
                    <td className="p-3 font-extrabold text-gray-800">{u.nama}</td>
                    <td className="p-3 font-bold text-[#1ABC9C] capitalize">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => switchRole(u.role)}
                        className={`px-3 py-1 rounded text-[10px] font-bold ${
                          currentUser.role === u.role
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1A5276] text-white hover:bg-[#2E86C1]'
                        }`}
                      >
                        {currentUser.role === u.role ? 'Role Aktif Saat Ini' : 'Ganti ke Role Ini'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Tahun Ajaran */}
      {activeTab === 'tahunAjaran' && <TahunAjaranModule />}

    </div>
  );
};

