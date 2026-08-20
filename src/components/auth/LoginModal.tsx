import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/sisantri';
import { 
  X, 
  ShieldCheck, 
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
      if (normalizedCat === 'yayasan') {
        setSelectedRole('admin_yayasan');
        setUsername('admin');
      } else if (normalizedCat === 'pengurus') {
        setSelectedRole('pengurus');
        setUsername('pengurus');
      } else if (normalizedCat === 'guru') {
        setSelectedRole('guru');
        setUsername('guru_halim');
      } else if (normalizedCat === 'wali') {
        setSelectedRole('wali_santri');
        setUsername('walisyafiq');
      }
      setPassword('123456');
    }
  }, [isOpen, initialRoleCategory]);

  if (!isOpen) return null;

  const handleTabSelect = (category: RoleCategory) => {
    const normalizedCat: RoleCategory = category === 'admin' ? 'yayasan' : category;
    setActiveTab(normalizedCat);
    if (normalizedCat === 'yayasan') {
      setSelectedRole('admin_yayasan');
      setUsername('admin');
    } else if (normalizedCat === 'pengurus') {
      setSelectedRole('pengurus');
      setUsername('pengurus');
    } else if (normalizedCat === 'guru') {
      setSelectedRole('guru');
      setUsername('guru_halim');
    } else if (normalizedCat === 'wali') {
      setSelectedRole('wali_santri');
      setUsername('walisyafiq');
    }
    setPassword('123456');
  };

  const handlePresetSelect = (role: UserRole, user: string) => {
    setSelectedRole(role);
    setUsername(user);
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
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1ABC9C] flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Portal Login SIAP</h3>
              <p className="text-xs text-sky-200">Pondok Pesantren Mukhtar Syafaat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs: Yayasan | Pengurus | Guru | Wali */}
        <div className="bg-sky-50/80 border-b border-sky-100 p-2 grid grid-cols-2 sm:grid-cols-4 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleTabSelect('yayasan')}
            className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'yayasan'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#1ABC9C]" />
            <span>Yayasan</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('pengurus')}
            className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'pengurus'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#1ABC9C]" />
            <span>Pengurus</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('guru')}
            className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'guru'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#1ABC9C]" />
            <span>Guru</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('wali')}
            className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'wali'
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-100'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#1ABC9C]" />
            <span>Wali Santri</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Quick Demo Credentials Panel */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-[#1A5276]">
            <p className="font-extrabold mb-1.5 flex items-center gap-1 text-[#1A5276]">
              <ShieldCheck className="w-4 h-4 text-[#1ABC9C]" />
              Pilih Akun Persona Demo (4 Role):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('admin_yayasan', 'admin')}
                className={`p-2 rounded-lg text-[11px] font-bold text-left transition-all ${
                  selectedRole === 'admin_yayasan' || selectedRole === 'admin_sistem' ? 'bg-[#1A5276] text-white shadow' : 'bg-white text-gray-700 hover:bg-sky-100 border border-gray-200'
                }`}
              >
                👑 Admin Yayasan (Utama)
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('pengurus', 'pengurus')}
                className={`p-2 rounded-lg text-[11px] font-bold text-left transition-all ${
                  selectedRole === 'pengurus' ? 'bg-[#2E86C1] text-white shadow' : 'bg-white text-gray-700 hover:bg-sky-100 border border-gray-200'
                }`}
              >
                📋 Pengurus Pesantren
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('guru', 'guru_halim')}
                className={`p-2 rounded-lg text-[11px] font-bold text-left transition-all ${
                  selectedRole === 'guru' ? 'bg-[#1ABC9C] text-white shadow' : 'bg-white text-gray-700 hover:bg-sky-100 border border-gray-200'
                }`}
              >
                📖 Guru / Ustadz
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('wali_santri', 'walisyafiq')}
                className={`p-2 rounded-lg text-[11px] font-bold text-left transition-all ${
                  selectedRole === 'wali_santri' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-sky-100 border border-gray-200'
                }`}
              >
                🌸 Wali Santri Farhan
              </button>
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Username / ID Akun
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Masukkan username..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800"
              />
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Hak Akses Modul Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Hak Akses Modul</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1ABC9C] outline-none text-[#1A5276]"
            >
              <option value="admin_sistem">Admin Sistem (Akses Penuh Seluruh Modul)</option>
              <option value="admin_pesantren">Admin Pesantren (Asrama & Kesantrian)</option>
              <option value="admin_madin">Admin Madrasah Diniyah</option>
              <option value="admin_sekolah">Admin Sekolah Formal (MTs/MA/SMK)</option>
              <option value="guru">Guru Sekolah / Ustadz Diniyah</option>
              <option value="admin_kepengasuhan">Pengasuhan, Perizinan & UKS Kesehatan</option>
              <option value="bendahara">Bendahara Keuangan & Tagihan Syahriyah</option>
              <option value="pimpinan">Pengasuh Utama / Pimpinan Pesantren</option>
              <option value="wali_santri">Wali Santri / Orang Tua Murid</option>
            </select>
          </div>

          {/* Feature Highlight Pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {activeTab === 'admin' && 'Modul Keuangan, Santri, Presensi, Kepegawaian & PPDB Mutasi'}
              {activeTab === 'guru' && 'Input Presensi Batch, Setoran Tahfidz, Kitab Nadhoman & Konseling'}
              {activeTab === 'wali' && 'Portal Real-Time Monitoring Hafalan, Kesehatan, Izin & Syahriyah'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99]"
          >
            <span>MASUK KE SISTEM SIAP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-gray-400 text-center pt-2 border-t border-gray-100">
            SIM Pesantren Mukhtar Syafaat • Aman, Terintegrasi & Real-time
          </p>

        </form>

      </div>
    </div>
  );
};
