import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  GraduationCap, 
  School, 
  BookOpenCheck, 
  BookMarked, 
  UserCheck, 
  HeartPulse, 
  FileCheck2, 
  MessageSquare, 
  Briefcase, 
  CalendarCheck, 
  Wallet, 
  UserPlus, 
  ShieldAlert, 
  ChevronDown, 
  ChevronRight,
  UserCheck2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const { currentUser } = useApp();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('kesantrian');

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(prev => prev === menu ? null : menu);
  };

  const navItemClass = (tabId: string) => `
    flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer
    ${activeTab === tabId 
      ? 'bg-[#2E86C1] text-white shadow-sm border-l-4 border-[#1ABC9C]' 
      : 'text-sky-100 hover:bg-[#2E86C1]/50 hover:text-white'}
  `;

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-[#1A5276] text-white flex flex-col shrink-0 border-r border-[#2E86C1] shadow-xl transition-all duration-200">
      
      {/* Role Badge Indicator */}
      <div className="p-3 bg-[#2E86C1]/40 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1ABC9C] animate-pulse" />
          <span className="text-[11px] font-bold text-sky-100 uppercase tracking-wider">
            Mode: {currentUser.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        
        {/* Dashboard */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className={navItemClass('dashboard')}
        >
          <LayoutDashboard className="w-4 h-4 text-[#1ABC9C]" />
          <span>Dashboard SIM</span>
        </div>

        {/* MODUL KESANTRIAN */}
        <div>
          <button
            onClick={() => toggleSubmenu('kesantrian')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-sky-200 uppercase tracking-wider hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1ABC9C]" />
              <span>1. Modul Kesantrian</span>
            </div>
            {openSubmenu === 'kesantrian' ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSubmenu === 'kesantrian' && (
            <div className="ml-3 pl-3 border-l-2 border-[#2E86C1] my-1 space-y-1 text-xs">
              <div
                onClick={() => setActiveTab('sub-pesantren')}
                className={navItemClass('sub-pesantren')}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Sub Pesantren & Asrama</span>
              </div>

              <div
                onClick={() => setActiveTab('sub-madin')}
                className={navItemClass('sub-madin')}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Sub Madin & Kitab</span>
              </div>

              <div
                onClick={() => setActiveTab('sub-sekolah')}
                className={navItemClass('sub-sekolah')}
              >
                <School className="w-3.5 h-3.5" />
                <span>Sub Sekolah Formal</span>
              </div>

              <div
                onClick={() => setActiveTab('data-santri')}
                className={navItemClass('data-santri')}
              >
                <Users className="w-3.5 h-3.5 text-emerald-300" />
                <span>Data Santri (8 Form)</span>
              </div>

              <div
                onClick={() => setActiveTab('tahfidz')}
                className={navItemClass('tahfidz')}
              >
                <BookOpenCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Sub Tahfidz Quran</span>
              </div>

              <div
                onClick={() => setActiveTab('nadhoman')}
                className={navItemClass('nadhoman')}
              >
                <BookMarked className="w-3.5 h-3.5 text-cyan-300" />
                <span>Sub Setoran Nadhoman</span>
              </div>

              <div
                onClick={() => setActiveTab('alumni')}
                className={navItemClass('alumni')}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sub Data Alumni</span>
              </div>
            </div>
          )}
        </div>

        {/* MODUL KEPENGASUHAN */}
        <div>
          <button
            onClick={() => toggleSubmenu('kepengasuhan')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-sky-200 uppercase tracking-wider hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#1ABC9C]" />
              <span>2. Modul Kepengasuhan</span>
            </div>
            {openSubmenu === 'kepengasuhan' ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSubmenu === 'kepengasuhan' && (
            <div className="ml-3 pl-3 border-l-2 border-[#2E86C1] my-1 space-y-1 text-xs">
              <div
                onClick={() => setActiveTab('kesehatan')}
                className={navItemClass('kesehatan')}
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                <span>Kesehatan (UKS)</span>
              </div>

              <div
                onClick={() => setActiveTab('perizinan')}
                className={navItemClass('perizinan')}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Perizinan Santri</span>
              </div>

              <div
                onClick={() => setActiveTab('konseling')}
                className={navItemClass('konseling')}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Konseling & Kunjungan</span>
              </div>
            </div>
          )}
        </div>

        {/* MODUL KEPEGAWAIAN */}
        <div
          onClick={() => setActiveTab('kepegawaian')}
          className={navItemClass('kepegawaian')}
        >
          <Briefcase className="w-4 h-4 text-[#1ABC9C]" />
          <span>3. Modul Kepegawaian</span>
        </div>

        {/* MODUL AKADEMIK */}
        <div
          onClick={() => setActiveTab('akademik')}
          className={navItemClass('akademik')}
        >
          <CalendarCheck className="w-4 h-4 text-[#1ABC9C]" />
          <span>4. Modul Akademik / Presensi</span>
        </div>

        {/* MODUL KEUANGAN */}
        <div
          onClick={() => setActiveTab('keuangan')}
          className={navItemClass('keuangan')}
        >
          <Wallet className="w-4 h-4 text-[#1ABC9C]" />
          <span>5. Modul Keuangan & Syahriyah</span>
        </div>

        {/* MODUL PPDB */}
        <div
          onClick={() => setActiveTab('ppdb')}
          className={navItemClass('ppdb')}
        >
          <UserPlus className="w-4 h-4 text-[#1ABC9C]" />
          <span>6. Modul PPDB (Mutasi NIS)</span>
        </div>

        {/* PORTAL WALI SANTRI */}
        <div
          onClick={() => setActiveTab('portal-wali')}
          className={navItemClass('portal-wali')}
        >
          <UserCheck2 className="w-4 h-4 text-emerald-300" />
          <span>7. Portal Wali Santri</span>
        </div>

        {/* MODUL PENGATURAN & RBAC */}
        <div
          onClick={() => setActiveTab('pengaturan')}
          className={navItemClass('pengaturan')}
        >
          <ShieldAlert className="w-4 h-4 text-[#1ABC9C]" />
          <span>8. Pengaturan & RBAC</span>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="p-3 bg-[#1A5276] border-t border-white/10 text-[10px] text-sky-200 text-center">
        <p className="font-semibold">SIAP System © 2026</p>
        <p className="text-gray-300">PP. Mukhtar Syafaat</p>
      </div>
    </aside>
  );
};
