import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { login } from '../../services/authService';
import { 
  X, 
  User, 
  Key, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';

interface LoginModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen = true, 
  onClose,
  onSuccessLogin,
}) => {
  const { setCurrentUser } = useApp();
  
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername('admin');
      setPassword('123456');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const authenticatedUser = await login(username, password);
      setCurrentUser(authenticatedUser);
      onClose();
      onSuccessLogin?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg sm:max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-[#1ABC9C] flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl sm:text-2xl leading-tight">Portal Login Super Admin</h3>
              <p className="text-xs sm:text-sm text-sky-200">Pondok Pesantren Mukhtar Syafaat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleLoginSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
              Username / ID Akun
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Masukkan username Super Admin..."
                className="w-full pl-10 sm:pl-11 pr-3 py-3.5 sm:py-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800 placeholder:text-gray-400"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 sm:pl-11 pr-3 py-3.5 sm:py-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent outline-none font-semibold text-gray-800 placeholder:text-gray-400"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Feature Highlight Pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 sm:gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Akses Penuh Manajemen SIM Pesantren (Super Admin Yayasan)</span>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 sm:py-4 bg-[#1A5276] hover:bg-[#2E86C1] disabled:cursor-not-allowed disabled:opacity-60 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2.5 sm:gap-3 shadow-lg hover:shadow-xl active:scale-[0.99]"
          >
            <span>{isSubmitting ? 'MEMERIKSA AKUN...' : 'MASUK KE SISTEM SIAP'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs sm:text-sm text-gray-400 text-center pt-3 sm:pt-4 border-t border-gray-100">
            SIM Pesantren Mukhtar Syafaat • Aman, Terintegrasi & Real-time
          </p>

        </form>

      </div>
    </div>
  );
};
