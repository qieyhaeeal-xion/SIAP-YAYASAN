import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/sisantri';
import { 
  X, 
  User, 
  Key, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  HeartHandshake, 
  Building2,
  CheckCircle2
} from 'lucide-react';

export type RoleCategory = 'yayasan' | 'pengurus' | 'guru' | 'wali' | 'admin';

// Hak akses modul otomatis ditentukan dari role yang dipilih (bukan pilihan manual terpisah)
const ROLE_TO_ACCESS: Record<RoleCategory, UserRole> = {
  yayasan: 'admin_yayasan',
  pengurus: 'pengurus',
  guru: 'guru',
  wali: 'wali_santri',
  admin: 'admin_yayasan',
};

// Username demo otomatis mengikuti role yang dipilih
const USERNAME_BY_CATEGORY: Record<RoleCategory, string> = {
  yayasan: 'admin',
  pengurus: 'pengurus',
  guru: 'guru_halim',
  wali: 'walisyafiq',
  admin: 'admin',
};

interface LoginModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
  initialRoleCategory?: RoleCategory;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen = true, 
  onClose,
  onSuccessLogin,
  initialRoleCategory = 'yayasan'
}) => {
  const { switchRole, setIsLandingPage, users, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState<RoleCategory>(initialRoleCategory);
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin_yayasan');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');

  // Sync tab with initialRoleCategory when opened
  useEffect(() => {
    if (isOpen) {
      const normalizedCat: RoleCategory = initialRoleCategory === 'admin' ? 'yayasan' : initialRoleCategory;
      setActiveTab(normalizedCat);
      setSelectedRole(ROLE_TO_ACCESS[normalizedCat]);
      setUsername(USERNAME_BY_CATEGORY[normalizedCat]);
      setPassword('123456');
    }
  }, [isOpen, initialRoleCategory]);

  if (!isOpen) return null;

  const handleTabSelect = (category: RoleCategory) => {
    const normalizedCat: RoleCategory = category === 'admin' ? 'yayasan' : category;
    setActiveTab(normalizedCat);
    setSelectedRole(ROLE_TO_ACCESS[normalizedCat]);
    setUsername(USERNAME_BY_CATEGORY[normalizedCat]);
    setPassword('123456');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matched user profile if exists, or switch role
    const foundUser = users.find(u => u.username === username);
    if (foundUser) {
      setCurrentUser(foundUser);
    } else {
      switchRole(selectedRole);
    }

    setIsLandingPage(false); // Direct to main app dashboard
    onSuccessLogin?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl sm:max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white p-7 sm:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#1ABC9C] flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h3 className="font-black text-2xl sm:text-4xl leading-tight">Portal Login SIAP</h3>
              <p className="text-sm sm:text-lg text-sky-200">Pondok Pesantren Mukhtar Syafaat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Category Tabs: Yayasan | Pengurus | Guru | Wali */}
        <div className="bg-sky-50/80 border-b border-sky-100 p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleTabSelect('yayasan')}
            className={`py-3.5 sm:py-5 px-1 rounded-xl text-base sm:text-lg font-extrabold flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all ${
              activeTab === 'yayasan'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ABC9C]" />
            <span>Yayasan</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('pengurus')}
            className={`py-3.5 sm:py-5 px-1 rounded-xl text-base sm:text-lg font-extrabold flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all ${
              activeTab === 'pengurus'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ABC9C]" />
            <span>Pengurus</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('guru')}
            className={`py-3.5 sm:py-5 px-1 rounded-xl text-base sm:text-lg font-extrabold flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all ${
              activeTab === 'guru'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ABC9C]" />
            <span>Guru</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('wali')}
            className={`py-3.5 sm:py-5 px-1 rounded-xl text-base sm:text-lg font-extrabold flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all ${
              activeTab === 'wali'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ABC9C]" />
            <span>Wali Santri</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleLoginSubmit} className="p-7 sm:p-10 space-y-6 sm:space-y-7 overflow-y-auto">
          
          {/* Username Input */}
          <div>
            <label className="block text-lg sm:text-xl font-bold text-gray-700 mb-2.5 sm:mb-3">
              Username / ID Akun
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Masukkan username..."
                className="w-full pl-12 sm:pl-14 pr-4 py-5 sm:py-6 border border-gray-300 rounded-xl text-lg sm:text-xl focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800 placeholder:text-gray-400"
              />
              <User className="w-7 h-7 text-gray-400 absolute left-4 sm:left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-lg sm:text-xl font-bold text-gray-700 mb-2.5 sm:mb-3">Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi..."
                className="w-full pl-12 sm:pl-14 pr-4 py-5 sm:py-6 border border-gray-300 rounded-xl text-lg sm:text-xl focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800 placeholder:text-gray-400"
              />
              <Key className="w-7 h-7 text-gray-400 absolute left-4 sm:left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Feature Highlight Pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 text-base sm:text-lg text-emerald-800 flex items-center gap-3.5 sm:gap-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            <span>
              {activeTab === 'yayasan' && 'Modul Keuangan, Santri, Presensi, Kepegawaian & PPDB Mutasi'}
              {activeTab === 'guru' && 'Input Presensi Batch, Setoran Tahfidz, Kitab Nadhoman & Konseling'}
              {activeTab === 'wali' && 'Portal Real-Time Monitoring Hafalan, Kesehatan, Izin & Syahriyah'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-5 sm:py-6 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-lg sm:text-xl rounded-xl transition-all flex items-center justify-center gap-3.5 sm:gap-4 shadow-lg hover:shadow-xl active:scale-[0.99]"
          >
            <span>MASUK KE SISTEM SIAP</span>
            <ArrowRight className="w-7 h-7" />
          </button>

          <p className="text-base sm:text-lg text-gray-400 text-center pt-5 sm:pt-6 border-t border-gray-100">
            SIM Pesantren Mukhtar Syafaat • Aman, Terintegrasi & Real-time
          </p>

        </form>

      </div>
    </div>
  );
};
