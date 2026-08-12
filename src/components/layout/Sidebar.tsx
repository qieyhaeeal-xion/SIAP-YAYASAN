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
  UserCheck2,
  Lock
} from 'lucide-react';
import { hasPermission } from '../../utils/rbac';

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

  const navItemClass = (tabId: string) => {
    const isAllowed = hasPermission(currentUser.role, tabId);
    if (!isAllowed) {
      return `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg opacity-50 cursor-not-allowed text-sky-200/60 hover:bg-white/5`;
    }
    return `
      flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer
      ${activeTab === tabId 
        ? 'bg-[#2E86C1] text-white shadow-sm border-l-4 border-[#1ABC9C]' 
        : 'text-sky-100 hover:bg-[#2E86C1]/50 hover:text-white'}
    `;
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

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
          onClick={() => handleTabClick('dashboard')}
          className={navItemClass('dashboard')}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-[#1ABC9C]" />
            <span>Dashboard SIM</span>
          </div>
          {!hasPermission(currentUser.role, 'dashboard') && <Lock className="w-3 h-3 text-amber-300" />}
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
                onClick={() => handleTabClick('sub-pesantren')}
                className={navItemClass('sub-pesantren')}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Sub Pesantren & Asrama</span>
                </div>
                {!hasPermission(currentUser.role, 'sub-pesantren') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('sub-madin')}
                className={navItemClass('sub-madin')}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Sub Madin & Kitab</span>
                </div>
                {!hasPermission(currentUser.role, 'sub-madin') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('sub-sekolah')}
                className={navItemClass('sub-sekolah')}
              >
                <div className="flex items-center gap-2.5">
                  <School className="w-3.5 h-3.5" />
                  <span>Sub Sekolah Formal</span>
                </div>
                {!hasPermission(currentUser.role, 'sub-sekolah') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('data-santri')}
                className={navItemClass('data-santri')}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Data Santri (8 Form)</span>
                </div>
                {!hasPermission(currentUser.role, 'data-santri') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('tahfidz')}
                className={navItemClass('tahfidz')}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpenCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sub Tahfidz Quran</span>
                </div>
                {!hasPermission(currentUser.role, 'tahfidz') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('nadhoman')}
                className={navItemClass('nadhoman')}
              >
                <div className="flex items-center gap-2.5">
                  <BookMarked className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Sub Setoran Nadhoman</span>
                </div>
                {!hasPermission(currentUser.role, 'nadhoman') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('alumni')}
                className={navItemClass('alumni')}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sub Data Alumni</span>
                </div>
                {!hasPermission(currentUser.role, 'alumni') && <Lock className="w-3 h-3 text-amber-300" />}
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
                onClick={() => handleTabClick('kesehatan')}
                className={navItemClass('kesehatan')}
              >
                <div className="flex items-center gap-2.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                  <span>Kesehatan (UKS)</span>
                </div>
                {!hasPermission(currentUser.role, 'kesehatan') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('perizinan')}
                className={navItemClass('perizinan')}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Perizinan Santri</span>
                </div>
                {!hasPermission(currentUser.role, 'perizinan') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>

              <div
                onClick={() => handleTabClick('konseling')}
                className={navItemClass('konseling')}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Konseling & Kunjungan</span>
                </div>
                {!hasPermission(currentUser.role, 'konseling') && <Lock className="w-3 h-3 text-amber-300" />}
              </div>
            </div>
          )}
        </div>

        {/* MODUL KEPEGAWAIAN */}
        <div
          onClick={() => handleTabClick('kepegawaian')}
          className={navItemClass('kepegawaian')}
        >
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-[#1ABC9C]" />
            <span>3. Modul Kepegawaian</span>
          </div>
          {!hasPermission(currentUser.role, 'kepegawaian') && <Lock className="w-3 h-3 text-amber-300" />}
        </div>

        {/* MODUL AKADEMIK */}
        <div
          onClick={() => handleTabClick('akademik')}
          className={navItemClass('akademik')}
        >
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-4 h-4 text-[#1ABC9C]" />
            <span>4. Modul Akademik / Presensi</span>
          </div>
          {!hasPermission(currentUser.role, 'akademik') && <Lock className="w-3 h-3 text-amber-300" />}
        </div>

        {/* MODUL KEUANGAN */}
        <div
          onClick={() => handleTabClick('keuangan')}
          className={navItemClass('keuangan')}
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-[#1ABC9C]" />
            <span>5. Modul Keuangan & Syahriyah</span>
          </div>
          {!hasPermission(currentUser.role, 'keuangan') && <Lock className="w-3 h-3 text-amber-300" />}
        </div>

        {/* MODUL PPDB */}
        <div
          onClick={() => handleTabClick('ppdb')}
          className={navItemClass('ppdb')}
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-4 h-4 text-[#1ABC9C]" />
            <span>6. Modul PPDB (Mutasi NIS)</span>
          </div>
          {!hasPermission(currentUser.role, 'ppdb') && <Lock className="w-3 h-3 text-amber-300" />}
        </div>

        {/* PORTAL WALI SANTRI */}
        <div
          onClick={() => handleTabClick('portal-wali')}
          className={navItemClass('portal-wali')}
        >
          <div className="flex items-center gap-3">
            <UserCheck2 className="w-4 h-4 text-emerald-300" />
            <span>7. Portal Wali Santri</span>
          </div>
          {!hasPermission(currentUser.role, 'portal-wali') && <Lock className="w-3 h-3 text-amber-300" />}
        </div>

        {/* MODUL PENGATURAN & RBAC */}
        <div
          onClick={() => handleTabClick('pengaturan')}
          className={navItemClass('pengaturan')}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-[#1ABC9C]" />
            <span>8. Pengaturan & RBAC</span>
          </div>
          {!hasPermission(currentUser.role, 'pengaturan') && <Lock className="w-3 h-3 text-amber-300" />}
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
