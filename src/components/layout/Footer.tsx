import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-gray-200/80 pt-4 pb-6 px-4 text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-xl shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1A5276] text-white flex items-center justify-center font-bold text-[10px]">
            S
          </div>
          <div>
            <p className="font-bold text-gray-700">SIAP - Sistem Informasi Administrasi Pesantren</p>
            <p className="text-[11px] text-gray-400">© 2026 Pondok Pesantren Mukhtar Syafaat. All rights reserved.</p>
          </div>
        </div>

        {/* Media Yayasan Branding Text */}
        <div className="text-xs font-extrabold text-[#1A5276]/80 tracking-wide select-none">
          Media Yayasan Mukhtar Syafa'at
        </div>
      </div>
    </footer>
  );
};
