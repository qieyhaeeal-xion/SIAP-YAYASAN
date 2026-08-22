import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  Briefcase, 
  CalendarCheck, 
  CreditCard,
  BadgeDollarSign,
  PieChart,
  Receipt,
  UserPlus, 
  ShieldAlert, 
  ChevronDown,
  UserCheck2,
  Lock,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { hasPermission, ROLE_DETAILS } from '../../utils/rbac';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

interface SidebarSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ label, isOpen, onToggle, children }) => (
  <section className="space-y-1.5">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]/50"
    >
      <span className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-300/65 transition-colors group-hover:text-sky-200">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1ABC9C]/70 transition-transform duration-200 group-hover:scale-125" />
        {label}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="text-sky-300/60 group-hover:text-white"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="space-y-1 pt-0.5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </section>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, isOpen, onClose }) => {
  const { currentUser, perizinanList, ppdbList } = useApp();
  const [openKeamanan, setOpenKeamanan] = useState(true);
  const [openKepengasuhan, setOpenKepengasuhan] = useState(true);
  const [openKeuangan, setOpenKeuangan] = useState(true);
  const [showAllMenus, setShowAllMenus] = useState(false); // Toggle to show restricted menus or clean filter

  const pendingPermitsCount = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;
  const pendingPPDBCount = ppdbList.filter(p => p.statusSeleksi === 'Lulus Seleksi' || p.statusSeleksi === 'Pendaftaran Baru').length;

  const roleInfo = ROLE_DETAILS[currentUser.role] || {
    title: currentUser.role.replace('_', ' '),
    color: 'bg-[#1ABC9C] text-white'
  };

 const isTabAllowed = (tabId: string) => hasPermission(
   currentUser.role,
   tabId === 'payment-management' || tabId.startsWith('keuangan-') ? 'keuangan' : tabId
 );

const handleTabClick = (tabId: string) => {
    if (isTabAllowed(tabId)) {
      onNavigate(tabId);
      onClose?.();
    }
  };

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
          className="flex cursor-not-allowed select-none items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-sky-200/40 transition-colors hover:bg-white/5"
          title="Modul terkunci untuk role akun Anda"
        >
          <div className="flex items-center gap-3">
            <span className="opacity-40">{icon}</span>
            <span className="truncate">{label}</span>
          </div>
          <Lock className="h-4 w-4 text-amber-400/60" />
        </div>
      );
    }

    return (
      <motion.button
        key={tabId}
        type="button"
        onClick={() => handleTabClick(tabId)}
        whileHover={{ x: isActive ? 0 : 3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-linear-to-r from-[#1ABC9C] to-[#16a085] font-bold text-white shadow-md shadow-[#1ABC9C]/20'
            : 'text-sky-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-white/90" />}
        <div className="flex min-w-0 items-center gap-3 truncate">
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-[#1ABC9C] group-hover:text-white'}`}>
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </div>

        {badge !== undefined && Number(badge) > 0 && (
          <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-black ${badgeColor} shadow-sm ${isActive ? 'ring-2 ring-white/25' : ''}`}>
            {badge}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop — hanya tampil di < 768px saat drawer terbuka */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

       {/* Off-canvas drawer di mobile (< md) / sidebar terkunci di desktop (>= md) */}
          <aside
          className={`flex h-full min-h-0 w-80 shrink-0 flex-col overflow-hidden bg-linear-to-b from-[#1A5276] via-[#154360] to-[#0E2F44] text-white border-r border-[#2E86C1]/40 shadow-2xl transition-transform duration-300 ease-in-out select-none
            fixed inset-y-0 left-0 z-50 max-w-[85vw]
            md:relative md:inset-auto md:z-auto md:max-w-none
            ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none md:translate-x-0 md:pointer-events-auto'}`}
        >
       <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#2E86C1]/10 blur-3xl" />
       <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#1ABC9C]/10 blur-3xl" />

       {/* User Persona Header */}
       <div className="relative space-y-3 border-b border-white/10 bg-white/5 p-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2.5">
             <span className="relative flex h-2.5 w-2.5">
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1ABC9C] opacity-60" />
               <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1ABC9C]" />
             </span>
             <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-200">
               Mode Akses
             </span>
           </div>

          {/* Toggle show/hide locked menus */}
          <button
            onClick={() => setShowAllMenus(!showAllMenus)}
             className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-sky-300/80 transition hover:bg-white/10 hover:text-white"
            title={showAllMenus ? 'Sembunyikan menu terkunci' : 'Tampilkan semua menu'}
          >
            {showAllMenus ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4 text-[#1ABC9C]" />}
            <span>{showAllMenus ? 'Saring' : 'Semua'}</span>
          </button>
        </div>

         <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm">
           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#1ABC9C] to-[#2E86C1] text-lg font-black text-white shadow ring-2 ring-white/10">
             {currentUser.nama.charAt(0)}
           </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-white truncate leading-tight">{currentUser.nama}</p>
            <p className="text-xs font-extrabold text-[#1ABC9C] uppercase tracking-wide truncate mt-0.5">
              {roleInfo.title.split(' ')[0]} {roleInfo.title.split(' ')[1] || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
       <div className="custom-scrollbar relative min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3">
        
        {/* SECTION: UTAMA */}
         <div className="space-y-1.5">
           <p className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-300/65">Menu Utama</p>
           {renderNavItem('dashboard', 'Dashboard SIM', <LayoutDashboard className="h-[18px] w-[18px]" />)}
         </div>

         {/* SECTION: KESANTRIAN & AKADEMIK */}
         {(isTabAllowed('data-santri') || isTabAllowed('tahfidz') || isTabAllowed('nadhoman') || isTabAllowed('sub-madin') || isTabAllowed('sub-sekolah') || isTabAllowed('sub-pesantren') || showAllMenus) && (
            <section className="space-y-1.5">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1ABC9C]/70" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-300/65">Kesantrian & KBM</span>
              </div>
              <div className="space-y-1 pt-0.5">
              {renderNavItem('data-santri', 'Data Santri (8 Form)', <Users className="h-[18px] w-[18px]" />)}
              {renderNavItem('tahfidz', 'Tahfidz Al-Qur\'an', <BookOpenCheck className="h-[18px] w-[18px]" />)}
              {renderNavItem('nadhoman', 'Setoran Nadhoman', <BookMarked className="h-[18px] w-[18px]" />)}
              {renderNavItem('sub-madin', 'Madrasah Diniyah', <GraduationCap className="h-[18px] w-[18px]" />)}
              {renderNavItem('sub-sekolah', 'Sekolah Formal', <School className="h-[18px] w-[18px]" />)}
              {renderNavItem('sub-pesantren', 'Unit & Asrama', <Building2 className="h-[18px] w-[18px]" />)}
              {renderNavItem('alumni', 'Database Alumni', <UserCheck className="h-[18px] w-[18px]" />)}
              </div>
            </section>
        )}

         {/* SECTION: KEAMANAN */}
         {(isTabAllowed('perizinan') || showAllMenus) && (
           <SidebarSection label="Keamanan" isOpen={openKeamanan} onToggle={() => setOpenKeamanan(!openKeamanan)}>
             {renderNavItem('perizinan', 'Perizinan Pulang/Keluar', <ShieldAlert className="h-[18px] w-[18px]" />, pendingPermitsCount, 'bg-amber-500 text-white')}
             {renderNavItem('kunjungan', 'Kunjungan Santri', <Users className="h-[18px] w-[18px]" />)}
           </SidebarSection>
         )}

         {/* HEALTH: STANDALONE, OUTSIDE KEAMANAN */}
         {renderNavItem('kesehatan', 'Kesehatan (UKS)', <HeartPulse className="h-[18px] w-[18px]" />)}

         {/* SECTION: KEPENGASUHAN */}
         {(isTabAllowed('konseling') || showAllMenus) && (
           <SidebarSection label="Kepengasuhan" isOpen={openKepengasuhan} onToggle={() => setOpenKepengasuhan(!openKepengasuhan)}>
             {renderNavItem('konseling', 'Konseling', <UserCheck2 className="h-[18px] w-[18px]" />)}
           </SidebarSection>
         )}

         {/* SECTION: ADMINISTRASI & KEUANGAN */}
        {(isTabAllowed('akademik') || isTabAllowed('keuangan') || isTabAllowed('ppdb') || isTabAllowed('kepegawaian') || showAllMenus) && (
           <section className="space-y-1.5">
             <div className="flex items-center gap-2.5 px-3 py-2">
               <span className="h-1.5 w-1.5 rounded-full bg-[#1ABC9C]/70" />
               <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-300/65">Administrasi</span>
              </div>
              <div className="space-y-1 pt-0.5">
              {renderNavItem('akademik', 'Presensi KBM Batch', <CalendarCheck className="h-[18px] w-[18px]" />)}
              <SidebarSection label="Manajemen Pembayaran" isOpen={openKeuangan} onToggle={() => setOpenKeuangan(!openKeuangan)}>
                {renderNavItem('keuangan-ringkasan', 'Ringkasan', <PieChart className="h-[18px] w-[18px]" />)}
                {renderNavItem('keuangan-jenis', 'Jenis Pembayaran', <BadgeDollarSign className="h-[18px] w-[18px]" />)}
                {renderNavItem('keuangan-pemasukan', 'Pemasukan & Distribusi', <Receipt className="h-[18px] w-[18px]" />)}
              </SidebarSection>
               {renderNavItem('ppdb', 'PPDB (Mutasi NIS)', <UserPlus className="h-[18px] w-[18px]" />, pendingPPDBCount, 'bg-blue-500 text-white')}
              {renderNavItem('kepegawaian', 'Data Kepegawaian', <Briefcase className="h-[18px] w-[18px]" />)}
              </div>
            </section>
         )}

        {/* SECTION: PORTAL & SISTEM */}
         <section className="space-y-1.5">
           <div className="flex items-center gap-2.5 px-3 py-2">
             <span className="h-1.5 w-1.5 rounded-full bg-[#1ABC9C]/70" />
             <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-300/65">Lainnya</span>
           </div>
           <div className="space-y-1 pt-0.5">
           {renderNavItem('portal-wali', 'Portal Wali Santri', <UserCheck2 className="h-[18px] w-[18px]" />)}
           {renderNavItem('pengaturan', 'Pengaturan & RBAC', <Settings className="h-[18px] w-[18px]" />)}
           </div>
         </section>

      </div>

      {/* Footer Branding */}
       <div className="relative flex items-center justify-between border-t border-white/10 bg-black/20 p-4 text-sm text-sky-200/80">
        <div className="space-y-0.5">
          <p className="font-bold text-base text-white">SIAP Mukhtar Syafaat</p>
          <p className="text-xs text-sky-300/60">SIM Pesantren v1.1.0</p>
        </div>
        <div className="w-3 h-3 rounded-full bg-emerald-400" title="Sistem Aktif" />
      </div>
</aside>
    </>
  );
};

