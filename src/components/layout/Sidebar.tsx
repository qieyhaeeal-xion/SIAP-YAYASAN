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
  Lock,
  Sparkles,
  Layers,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { hasPermission, ROLE_DETAILS } from '../../utils/rbac';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const { currentUser, perizinanList, ppdbList } = useApp();
  const [openKesantrian, setOpenKesantrian] = useState(true);
  const [openKepengasuhan, setOpenKepengasuhan] = useState(true);
  const [showAllMenus, setShowAllMenus] = useState(false); // Toggle to show restricted menus or clean filter

  const pendingPermitsCount = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;
  const pendingPPDBCount = ppdbList.filter(p => p.statusSeleksi === 'Lulus Seleksi' || p.statusSeleksi === 'Pendaftaran Baru').length;

  const roleInfo = ROLE_DETAILS[currentUser.role] || {
    title: currentUser.role.replace('_', ' '),
    color: 'bg-[#1ABC9C] text-white'
  };

  const isTabAllowed = (tabId: string) => hasPermission(currentUser.role, tabId);

  const handleTabClick = (tabId: string) => {
    if (isTabAllowed(tabId)) {
      setActiveTab(tabId);
    }
  };

  if (!isOpen) return null;

  const renderNavItem = (
    tabId: string,
    label: string,
    icon: React.ReactNode,
    badge?: string | number,
    badgeColor: string = 'bg-amber-500 text-white'
  ) => {
    const allowed = isTabAllowed(tabId);
    const isActive = activeTab === tabId;

    if (!allowed && !showAllMenus) {
      return null; // Clean mode: only show accessible menus
    }

    if (!allowed) {
      return (
        <div
          key={tabId}
          className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-sky-200/40 cursor-not-allowed select-none transition-colors hover:bg-white/5"
          title="Modul terkunci untuk role akun Anda"
        >
          <div className="flex items-center gap-2.5">
            <span className="opacity-40">{icon}</span>
            <span className="truncate">{label}</span>
          </div>
          <Lock className="w-3.5 h-3.5 text-amber-400/60" />
        </div>
      );
    }

    return (
      <button
        key={tabId}
        type="button"
        onClick={() => handleTabClick(tabId)}
        className={`w-full flex items-center justify-between px-6 py-4.5 text-lg font-bold rounded-xl transition-all duration-200 text-left group ${
          isActive
            ? 'bg-linear-to-r from-[#1ABC9C] to-[#16a085] text-white shadow-md shadow-[#1ABC9C]/20 font-bold'
            : 'text-sky-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-5 truncate">
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-[#1ABC9C] group-hover:text-white'}`}>
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </div>

        {badge !== undefined && Number(badge) > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-black ${badgeColor} shadow-sm shrink-0 ml-1.5`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-96 bg-linear-to-b from-[#1A5276] via-[#154360] to-[#0E2F44] text-white flex flex-col shrink-0 border-r border-[#2E86C1]/40 shadow-2xl transition-all duration-300 select-none">
      
      {/* User Persona Header */}
      <div className="p-3.5 bg-white/5 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1ABC9C] animate-pulse" />
            <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">
              Akses Persona Aktif
            </span>
          </div>

          {/* Toggle show/hide locked menus */}
          <button
            onClick={() => setShowAllMenus(!showAllMenus)}
            className="text-[10px] text-sky-300/80 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md transition"
            title={showAllMenus ? 'Sembunyikan menu terkunci' : 'Tampilkan semua menu'}
          >
            {showAllMenus ? <EyeOff className="w-3 h-3 text-amber-300" /> : <Eye className="w-3 h-3 text-[#1ABC9C]" />}
            <span>{showAllMenus ? 'Saring' : 'Semua'}</span>
          </button>
        </div>

        <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2.5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#1ABC9C] to-[#2E86C1] flex items-center justify-center text-white font-black text-sm shadow">
            {currentUser.nama.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-white truncate leading-tight">{currentUser.nama}</p>
            <p className="text-[10px] font-extrabold text-[#1ABC9C] uppercase tracking-wide truncate mt-0.5">
              {roleInfo.title.split(' ')[0]} {roleInfo.title.split(' ')[1] || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 custom-scrollbar">
        
        {/* SECTION: UTAMA */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-sky-300/60 uppercase tracking-wider">Menu Utama</p>
          {renderNavItem('dashboard', 'Dashboard SIM', <LayoutDashboard className="w-7 h-7" />)}
        </div>

        {/* SECTION: KESANTRIAN & AKADEMIK */}
        {(isTabAllowed('data-santri') || isTabAllowed('tahfidz') || isTabAllowed('nadhoman') || isTabAllowed('sub-madin') || isTabAllowed('sub-sekolah') || isTabAllowed('sub-pesantren') || showAllMenus) && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pt-1">
              <p className="text-[10px] font-extrabold text-sky-300/60 uppercase tracking-wider">Kesantrian & KBM</p>
              <button
                onClick={() => setOpenKesantrian(!openKesantrian)}
                className="text-sky-300/60 hover:text-white transition"
              >
                {openKesantrian ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>

            {openKesantrian && (
              <div className="space-y-1 pt-0.5">
                {renderNavItem('data-santri', 'Data Santri (8 Form)', <Users className="w-7 h-7" />)}
                {renderNavItem('tahfidz', 'Tahfidz Al-Qur\'an', <BookOpenCheck className="w-7 h-7" />)}
                {renderNavItem('nadhoman', 'Setoran Nadhoman', <BookMarked className="w-7 h-7" />)}
                {renderNavItem('sub-madin', 'Madrasah Diniyah', <GraduationCap className="w-7 h-7" />)}
                {renderNavItem('sub-sekolah', 'Sekolah Formal', <School className="w-7 h-7" />)}
                {renderNavItem('sub-pesantren', 'Unit & Asrama', <Building2 className="w-7 h-7" />)}
                {renderNavItem('alumni', 'Database Alumni', <UserCheck className="w-7 h-7" />)}
              </div>
            )}
          </div>
        )}

        {/* SECTION: KEPENGASUHAN & KESEHATAN */}
        {(isTabAllowed('perizinan') || isTabAllowed('kesehatan') || isTabAllowed('konseling') || showAllMenus) && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pt-1">
              <p className="text-[10px] font-extrabold text-sky-300/60 uppercase tracking-wider">Pengasuhan & UKS</p>
              <button
                onClick={() => setOpenKepengasuhan(!openKepengasuhan)}
                className="text-sky-300/60 hover:text-white transition"
              >
                {openKepengasuhan ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>

            {openKepengasuhan && (
              <div className="space-y-1 pt-0.5">
                {renderNavItem('perizinan', 'Perizinan Santri', <FileCheck2 className="w-7 h-7" />, pendingPermitsCount, 'bg-amber-500 text-white')}
                {renderNavItem('kesehatan', 'Kesehatan (UKS)', <HeartPulse className="w-7 h-7" />)}
                {renderNavItem('konseling', 'Konseling & Tamu', <MessageSquare className="w-7 h-7" />)}
              </div>
            )}
          </div>
        )}

        {/* SECTION: ADMINISTRASI & KEUANGAN */}
        {(isTabAllowed('akademik') || isTabAllowed('keuangan') || isTabAllowed('ppdb') || isTabAllowed('kepegawaian') || showAllMenus) && (
          <div className="space-y-1">
            <p className="px-3 pt-1 text-[10px] font-extrabold text-sky-300/60 uppercase tracking-wider">Administrasi</p>
            <div className="space-y-1">
              {renderNavItem('akademik', 'Presensi KBM Batch', <CalendarCheck className="w-7 h-7" />)}
              {renderNavItem('keuangan', 'Keuangan & Syahriyah', <Wallet className="w-7 h-7" />)}
              {renderNavItem('ppdb', 'PPDB (Mutasi NIS)', <UserPlus className="w-7 h-7" />, pendingPPDBCount, 'bg-blue-500 text-white')}
              {renderNavItem('kepegawaian', 'Data Kepegawaian', <Briefcase className="w-7 h-7" />)}
            </div>
          </div>
        )}

        {/* SECTION: PORTAL & SISTEM */}
        <div className="space-y-1">
          <p className="px-3 pt-1 text-[10px] font-extrabold text-sky-300/60 uppercase tracking-wider">Lainnya</p>
          <div className="space-y-1">
            {renderNavItem('portal-wali', 'Portal Wali Santri', <UserCheck2 className="w-7 h-7" />)}
            {renderNavItem('pengaturan', 'Pengaturan & RBAC', <Settings className="w-7 h-7" />)}
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="p-3 bg-black/20 border-t border-white/10 text-[10px] text-sky-200/80 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-bold text-white">SIAP Mukhtar Syafaat</p>
          <p className="text-[9px] text-sky-300/60">SIM Pesantren v1.1.0</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400" title="Sistem Aktif" />
      </div>
    </aside>
  );
};

