import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Globe, 
  ShieldCheck, 
  Menu, 
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, perizinanList } = useApp();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const pendingPermitsCount = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;

  return (
    <header className="bg-[#1A5276] text-white shadow-md border-b border-[#2E86C1] sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onToggleSidebar}
            aria-label="Buka / tutup menu navigasi"
            title="Toggle Menu Navigation"
            className="md:hidden p-2 rounded-xl bg-[#2E86C1]/40 hover:bg-[#2E86C1] active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer min-w-0" onClick={() => navigate('/')}>
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl bg-[#1ABC9C] flex items-center justify-center font-bold text-white shadow-sm border border-white/20 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-lg sm:text-xl tracking-wide flex items-center gap-2 leading-tight">
                SIAP
                <span className="hidden sm:inline-block text-[10px] sm:text-sm font-semibold bg-[#1ABC9C] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SIM Pesantren
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-200 font-medium truncate">
                Pondok Pesantren Mukhtar Syafaat
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <input
            type="text"
            placeholder="Cari Santri, NIS, Asrama..."
            className="w-full pl-10 pr-3 py-2 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#1C2833] placeholder-sky-200 focus:placeholder-gray-400 text-sm rounded-xl border border-white/20 focus:border-[#1ABC9C] transition-all outline-none"
          />
          <Search className="w-5 h-5 absolute left-4 text-sky-200 pointer-events-none" />
        </div>

        {/* Right Section: Action Buttons & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">

          {/* Landing Page Toggle Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 text-sm font-semibold p-2 md:px-4 md:py-2 rounded-xl bg-[#2E86C1] hover:bg-[#1ABC9C] text-white transition-all shadow-sm shrink-0"
            title="Ke Halaman Utama / Public Landing"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">Web Utama</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-[#2E86C1] transition-colors relative shrink-0"
              title="Notifikasi & Perizinan Pending"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {pendingPermitsCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#1ABC9C] text-white font-bold text-xs rounded-full flex items-center justify-center border-2 border-[#1A5276]">
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

          {/* Super Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 pr-1.5 sm:pl-3 sm:pr-2.5 py-1.5 sm:py-2 rounded-xl border border-white/20 bg-white/5 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1ABC9C] flex items-center justify-center font-bold text-sm text-white">
              {currentUser.nama.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-bold leading-tight truncate max-w-44">{currentUser.nama}</div>
              <div className="text-xs text-sky-200 font-medium capitalize flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1ABC9C]" />
                Super Admin
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
