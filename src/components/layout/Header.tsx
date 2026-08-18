import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/sisantri';
import { 
  Bell, 
  Search, 
  UserCheck, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X,
  BookOpen,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenLoginModal }) => {
  const { currentUser, switchRole, perizinanList, isLandingPage, setIsLandingPage } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const pendingPermitsCount = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'admin_yayasan', label: 'Admin Yayasan (Utama)' },
    { role: 'pengurus', label: 'Pengurus Pesantren' },
    { role: 'guru', label: 'Guru / Ustadz' },
    { role: 'wali_santri', label: 'Wali Santri' },
  ];

  return (
    <header className="bg-[#1A5276] text-white shadow-md border-b border-[#2E86C1] sticky top-0 z-30">
      <div className="px-4 py-2.5 flex items-center justify-between">
        
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#2E86C1] transition-colors text-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            title="Toggle Menu Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setIsLandingPage(true)}>
            <div className="w-9 h-9 rounded-lg bg-[#1ABC9C] flex items-center justify-center font-bold text-white shadow-sm border border-white/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wide flex items-center gap-1.5 leading-tight">
                SIAP
                <span className="text-[10px] font-semibold bg-[#1ABC9C] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  SIM Pesantren
                </span>
              </div>
              <p className="text-[11px] text-sky-200 font-medium hidden sm:block">
                Pondok Pesantren Mukhtar Syafaat
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="hidden md:flex items-center relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Cari Santri, NIS, Asrama..."
            className="w-full pl-9 pr-3 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#1C2833] placeholder-sky-200 focus:placeholder-gray-400 text-xs rounded-md border border-white/20 focus:border-[#1ABC9C] transition-all outline-none"
          />
          <Search className="w-4 h-4 absolute left-2.5 text-sky-200 pointer-events-none" />
        </div>

        {/* Right Section: Action Buttons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Landing Page Toggle Button */}
          <button
            onClick={() => setIsLandingPage(!isLandingPage)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-[#2E86C1] hover:bg-[#1ABC9C] text-white transition-all shadow-sm"
            title="Ke Halaman Utama / Public Landing"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLandingPage ? 'Buka Dashboard' : 'Web Utama'}</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="p-2 rounded-lg hover:bg-[#2E86C1] transition-colors relative"
              title="Notifikasi & Perizinan Pending"
            >
              <Bell className="w-5 h-5" />
              {pendingPermitsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#1ABC9C] text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-[#1A5276]">
                  {pendingPermitsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-[#1C2833] rounded-lg shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A5276]">Notifikasi Sistem</h4>
                  <span className="text-[10px] bg-sky-100 text-[#2E86C1] font-semibold px-1.5 py-0.5 rounded">
                    {pendingPermitsCount} Izin Pending
                  </span>
                </div>
                {pendingPermitsCount > 0 ? (
                  <div className="text-xs space-y-2 max-h-48 overflow-y-auto">
                    <div className="p-2 bg-amber-50 rounded border border-amber-200">
                      <p className="font-semibold text-amber-900">Perizinan Menunggu Approval</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">Ada {pendingPermitsCount} pengajuan perizinan santri yang membutuhkan verifikasi kepengasuhan.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-3 text-center">Tidak ada notifikasi perizinan baru.</p>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher & Profile */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-[#2E86C1] transition-colors border border-white/20 bg-white/5"
            >
              <div className="w-7 h-7 rounded-full bg-[#1ABC9C] flex items-center justify-center font-bold text-xs text-white">
                {currentUser.nama.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold leading-tight truncate max-w-32.5">{currentUser.nama}</div>
                <div className="text-[10px] text-sky-200 font-medium capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#1ABC9C]" />
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-sky-200" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-[#1C2833] rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ganti Role Akses (Demo)</p>
                  <p className="text-xs font-semibold text-[#1A5276] truncate">{currentUser.nama}</p>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#D6EAF8] transition-colors ${
                        currentUser.role === r.role ? 'font-bold text-[#1A5276] bg-sky-50' : 'text-gray-700'
                      }`}
                    >
                      <span>{r.label}</span>
                      {currentUser.role === r.role && (
                        <span className="w-2 h-2 rounded-full bg-[#1ABC9C]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-1 mt-1 px-1">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLoginModal();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Portal Login Modal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
