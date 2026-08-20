import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/sisantri';
import { AdminYayasanDashboard } from './roles/AdminYayasanDashboard';
import { PengurusDashboard } from './roles/PengurusDashboard';
import { GuruDashboard } from './roles/GuruDashboard';
import { WaliSantriDashboard } from './roles/WaliSantriDashboard';
import { ShieldCheck, UserCheck, Users, HeartHandshake, UserCog } from 'lucide-react';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  const { currentUser, switchRole } = useApp();

  const roleOptions: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'admin_yayasan', label: 'Admin Yayasan (Utama)', icon: <ShieldCheck className="w-6 h-6" />, color: 'hover:bg-[#1A5276] hover:text-white' },
    { role: 'pengurus', label: 'Pengurus Pesantren', icon: <UserCog className="w-6 h-6" />, color: 'hover:bg-[#2E86C1] hover:text-white' },
    { role: 'guru', label: 'Guru / Ustadz', icon: <Users className="w-6 h-6" />, color: 'hover:bg-[#1ABC9C] hover:text-white' },
    { role: 'wali_santri', label: 'Wali Santri', icon: <HeartHandshake className="w-6 h-6" />, color: 'hover:bg-emerald-600 hover:text-white' },
  ];

  // Render role-tailored dashboard component
  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'admin_yayasan':
      case 'admin_sistem':
        return <AdminYayasanDashboard onNavigateTab={onNavigateTab} />;
      case 'pengurus':
        return <PengurusDashboard onNavigateTab={onNavigateTab} />;
      case 'guru':
        return <GuruDashboard onNavigateTab={onNavigateTab} />;
      case 'wali_santri':
        return <WaliSantriDashboard onNavigateTab={onNavigateTab} />;
      default:
        return <AdminYayasanDashboard onNavigateTab={onNavigateTab} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Role Switcher Demo Bar */}
      <div className="bg-white px-8 py-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-500 flex items-center gap-2.5 text-base">
            <UserCheck className="w-6 h-6 text-[#1ABC9C]" />
            Pratinjau Dashboard Role:
          </span>
          <span className="font-extrabold text-[#1A5276] uppercase bg-sky-50 border border-sky-200 px-4 py-1.5 rounded-lg text-base">
            [{currentUser.role.replace('_', ' ')}]
          </span>
        </div>

        {/* 4 Role Selector Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {roleOptions.map((opt) => {
            const isActive = currentUser.role === opt.role || (opt.role === 'admin_yayasan' && currentUser.role === 'admin_sistem');
            return (
              <button
                key={opt.role}
                onClick={() => switchRole(opt.role)}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2.5 text-base ${
                  isActive
                    ? 'bg-[#1A5276] text-white shadow-sm ring-2 ring-[#1ABC9C]/40'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Dedicated Dashboard Content */}
      {renderDashboardByRole()}
    </div>
  );
};
