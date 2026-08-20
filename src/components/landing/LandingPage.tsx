import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LoginModal, RoleCategory } from '../auth/LoginModal';
import {
  BookOpen,
  GraduationCap,
  School,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  Building2,
  Lock,
  Wallet,
  Activity,
  UserCheck,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onOpenDashboard?: () => void;
  onOpenLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDashboard, onOpenLogin }) => {
  const { setIsLandingPage, addPPDB, unitsPesantren, unitSekolahList, marhalahList } = useApp();

  // Login Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginCategory, setLoginCategory] = useState<RoleCategory>('admin');

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clockDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const clockDateShort = currentTime.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const clockTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });

  // PPDB Form State
  const [showPpdbForm, setShowPpdbForm] = useState(false);
  const [ppdbSuccessMsg, setPpdbSuccessMsg] = useState('');

  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [namaOrtu, setNamaOrtu] = useState('');
  const [noHpOrtu, setNoHpOrtu] = useState('');
  const [alamat, setAlamat] = useState('');
  const [sekolahAsal, setSekolahAsal] = useState('');
  const [unitPesantrenPilihanId, setUnitPesantrenPilihanId] = useState(unitsPesantren[0]?.id || '');
  const [unitSekolahPilihanId, setUnitSekolahPilihanId] = useState(unitSekolahList[0]?.id || '');
  const [marhalahPilihanId, setMarhalahPilihanId] = useState(marhalahList[0]?.id || '');

  const openLogin = (category: RoleCategory = 'admin') => {
    setLoginCategory(category);
    setIsLoginModalOpen(true);
  };

  const handlePpdbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPPDB({
      namaLengkap,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      namaOrtu,
      noHpOrtu,
      alamat,
      sekolahAsal,
      unitPesantrenPilihanId,
      unitSekolahPilihanId,
      marhalahPilihanId
    });

    setPpdbSuccessMsg('Pendaftaran Berhasil! Nomor Pendaftaran Anda telah dicatat oleh sistem PPDB.');
    setNamaLengkap('');
    setNamaOrtu('');
    setNoHpOrtu('');
    setAlamat('');
    setSekolahAsal('');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1C2833] font-sans">

      {/* Top Header Bar */}
      <div className="bg-[#1A5276] text-white text-xs sm:text-sm py-2.5 px-4 sm:px-6 border-b border-[#2E86C1]">
        <div className="container mx-auto max-w-screen-2xl flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1 text-xs sm:text-sm text-sky-200">
            <span className="flex items-start sm:items-center gap-2 font-medium min-w-0">
              <MapPin className="w-4 h-4 text-[#1ABC9C] shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-snug">Blokagung, Tegalsari, Banyuwangi</span>
            </span>
            <span className="hidden md:flex items-center gap-2 font-medium shrink-0">
              <Phone className="w-4 h-4 text-[#1ABC9C]" />
              (0333) 845123 / 0812-3456-7890
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-200 font-medium shrink-0">
            <Clock className="w-4 h-4 text-[#1ABC9C] shrink-0" />
            <span className="tabular-nums leading-snug">
              <span className="lg:hidden">{clockDateShort} · {clockTime} WIB</span>
              <span className="hidden lg:inline">{clockDate} · {clockTime} WIB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">

          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1A5276] flex items-center justify-center font-bold text-white shadow-md shrink-0">
              <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-[#1ABC9C]" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-lg sm:text-xl lg:text-2xl text-[#1A5276] leading-tight flex flex-wrap items-center gap-x-2 gap-y-1">
                SIAP
                <span className="text-[10px] sm:text-xs bg-[#1ABC9C] text-white px-1.5 sm:px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide truncate max-w-[9rem] sm:max-w-none">
                  Mukhtar Syafaat
                </span>
              </div>
              <p className="text-[11px] sm:text-sm text-[#566573] font-medium hidden sm:block truncate">Sistem Informasi Manajemen Pesantren Terpadu</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm sm:text-base font-extrabold text-[#1C2833]">
            <a href="#portal-roles" className="hover:text-[#2E86C1] transition-colors py-1">Portal Akses</a>
            <a href="#program" className="hover:text-[#2E86C1] transition-colors py-1">Program Unggulan</a>
            <a href="#ppdb" className="hover:text-[#2E86C1] transition-colors py-1">PPDB Online</a>
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openLogin('wali')}
              className="px-5 py-2.5 border-2 border-[#1A5276] text-[#1A5276] hover:bg-sky-50 font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-[#1ABC9C]" />
              <span>Portal Wali</span>
            </button>
            <button
              onClick={() => openLogin('admin')}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#1ABC9C]" />
              <span>Masuk SIAP</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#1A5276] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 sm:px-6 py-4 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2 text-sm font-extrabold text-[#1C2833]">
              <a href="#portal-roles" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-sky-50 transition-colors">Portal Akses</a>
              <a href="#program" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-sky-50 transition-colors">Program Unggulan</a>
              <a href="#ppdb" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-sky-50 transition-colors">PPDB Online</a>
            </div>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2.5">
              <button
                onClick={() => { openLogin('admin'); setIsMobileMenuOpen(false); }}
                className="p-3 bg-sky-50 text-[#1A5276] rounded-xl text-xs sm:text-sm font-extrabold text-center border border-sky-200"
              >
                Login Admin
              </button>
              <button
                onClick={() => { openLogin('guru'); setIsMobileMenuOpen(false); }}
                className="p-3 bg-sky-50 text-[#1A5276] rounded-xl text-xs sm:text-sm font-extrabold text-center border border-sky-200"
              >
                Login Guru
              </button>
              <button
                onClick={() => { openLogin('wali'); setIsMobileMenuOpen(false); }}
                className="p-3 bg-[#1ABC9C] text-white rounded-xl text-xs sm:text-sm font-extrabold text-center shadow"
              >
                Portal Wali
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner Section */}
      <header className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white py-12 sm:py-16 lg:py-28 2xl:py-36 px-4 sm:px-6 2xl:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="container mx-auto max-w-screen-2xl 2xl:max-w-[1700px] relative z-10 grid md:grid-cols-12 gap-8 lg:gap-14 2xl:gap-20 items-center">

          <div className="md:col-span-7 space-y-5 sm:space-y-7 2xl:space-y-8 text-left">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#1ABC9C]/20 border border-[#1ABC9C] text-[#1ABC9C] px-3 sm:px-4 2xl:px-5 py-1.5 sm:py-2 2xl:py-2.5 rounded-full text-[11px] sm:text-sm 2xl:text-base font-extrabold tracking-wide max-w-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 shrink-0" />
              <span className="leading-snug">Sistem Informasi Pesantren Terpadu T.A. 2026/2027</span>
            </div>

            <h1 className="text-3xl min-[480px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.1] tracking-tight">
              Pondok Pesantren <br />
              <span className="text-[#1ABC9C]">Mukhtar Syafaat</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-xl 2xl:text-2xl text-sky-100 max-w-2xl 2xl:max-w-3xl leading-relaxed font-normal">
              Mewujudkan generasi santri unggul ber-Akhlakul Karimah, fasih Al-Qur'an & Kitab Salaf, terintegrasi pendidikan formal (MTs, MA, SMK) serta Madrasah Diniyah Ula, Wustho, Ulya.
            </p>

            <div className="flex flex-col min-[480px]:flex-row flex-wrap items-stretch min-[480px]:items-center gap-3 sm:gap-4 2xl:gap-6 pt-2 sm:pt-3">
              <button
                onClick={() => setIsLandingPage(false)}
                className="w-full min-[480px]:w-auto px-6 sm:px-8 2xl:px-12 py-3.5 sm:py-4 2xl:py-5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-black text-xs sm:text-base 2xl:text-lg rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 2xl:gap-4 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-center leading-snug">BUKA SIAP DASHBOARD UTAMA</span>
                <ArrowRight className="w-5 h-5 2xl:w-6 2xl:h-6 shrink-0" />
              </button>

              <button
                onClick={() => setShowPpdbForm(true)}
                className="w-full min-[480px]:w-auto px-6 sm:px-8 2xl:px-12 py-3.5 sm:py-4 2xl:py-5 bg-white text-[#1A5276] hover:bg-sky-50 font-black text-xs sm:text-base 2xl:text-lg rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 2xl:gap-4 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                <span className="text-center leading-snug">DAFTAR PPDB SANTRI BARU</span>
              </button>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="md:col-span-5 flex justify-center w-full">
            <div className="bg-white/10 backdrop-blur-md p-5 sm:p-8 lg:p-10 2xl:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/20 text-white space-y-4 sm:space-y-6 2xl:space-y-8 max-w-lg 2xl:max-w-2xl w-full shadow-2xl">

              <div className="flex items-center justify-between pb-4 2xl:pb-6 border-b border-white/20">
                <div className="flex items-center gap-4 2xl:gap-5">
                  <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-2xl bg-[#1ABC9C] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    <BookOpen className="w-7 h-7 2xl:w-10 2xl:h-10" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl 2xl:text-3xl">Portal Multi-Akses</h3>
                    <p className="text-xs sm:text-sm 2xl:text-base text-sky-200">Silakan pilih role untuk masuk</p>
                  </div>
                </div>
              </div>

              {/* 3 Role Entry Cards */}
              <div className="space-y-3 2xl:space-y-4">
                <button
                  onClick={() => openLogin('admin')}
                  className="w-full p-3.5 sm:p-4 2xl:p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all text-left flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-xl bg-[#1A5276] flex items-center justify-center text-white font-bold shrink-0">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-[#1ABC9C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm 2xl:text-lg font-black text-white group-hover:text-[#1ABC9C] transition-colors leading-snug">
                        1. Portal Admin & Bendahara
                      </div>
                      <div className="text-[11px] sm:text-xs 2xl:text-sm text-sky-200 mt-0.5 2xl:mt-1 leading-snug">Manajemen Santri, Keuangan, PPDB & Pegawai</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-sky-200 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={() => openLogin('guru')}
                  className="w-full p-3.5 sm:p-4 2xl:p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all text-left flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-xl bg-[#1A5276] flex items-center justify-center text-white font-bold shrink-0">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-[#1ABC9C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm 2xl:text-lg font-black text-white group-hover:text-[#1ABC9C] transition-colors leading-snug">
                        2. Portal Guru & Ustadz
                      </div>
                      <div className="text-[11px] sm:text-xs 2xl:text-sm text-sky-200 mt-0.5 2xl:mt-1 leading-snug">Input Setoran Tahfidz, Nadhoman & Absensi</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-sky-200 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={() => openLogin('wali')}
                  className="w-full p-3.5 sm:p-4 2xl:p-5 bg-[#1ABC9C] hover:bg-[#16a085] rounded-2xl text-white transition-all text-left flex items-center justify-between gap-2 shadow-xl group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold shrink-0">
                      <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm 2xl:text-lg font-black text-white leading-snug">
                        3. Portal Orang Tua / Wali
                      </div>
                      <div className="text-[11px] sm:text-xs 2xl:text-sm text-teal-100 mt-0.5 2xl:mt-1 leading-snug">Cek Hafalan, Sakit UKS, Izin Pulang & Tagihan</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-white group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </header>

      {/* Quick Statistics Banner */}
      <section className="bg-white py-8 sm:py-12 lg:py-16 2xl:py-24 border-b border-gray-200 px-4 sm:px-6 2xl:px-12">
        <div className="container mx-auto max-w-screen-2xl 2xl:max-w-[1700px] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 2xl:gap-10 text-center">
          <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 rounded-2xl sm:rounded-3xl 2xl:rounded-[2rem] bg-sky-50/60 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-[#1A5276]">1.250+</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-base lg:text-lg 2xl:text-xl text-[#566573] font-extrabold mt-1.5 sm:mt-2 2xl:mt-3 leading-snug">Santri Aktif Putra & Putri</div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 rounded-2xl sm:rounded-3xl 2xl:rounded-[2rem] bg-sky-50/60 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-[#2E86C1]">3 Unit</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-base lg:text-lg 2xl:text-xl text-[#566573] font-extrabold mt-1.5 sm:mt-2 2xl:mt-3 leading-snug">Kompleks Asrama Pesantren</div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 rounded-2xl sm:rounded-3xl 2xl:rounded-[2rem] bg-sky-50/60 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-[#1ABC9C]">3 Lembaga</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-base lg:text-lg 2xl:text-xl text-[#566573] font-extrabold mt-1.5 sm:mt-2 2xl:mt-3 leading-snug">Sekolah Formal (MTs, MA, SMK, SMP)</div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 rounded-2xl sm:rounded-3xl 2xl:rounded-[2rem] bg-sky-50/60 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-[#1A5276]">3 Marhalah</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-base lg:text-lg 2xl:text-xl text-[#566573] font-extrabold mt-1.5 sm:mt-2 2xl:mt-3 leading-snug">Madrasah Diniyah (Ula, Wustho, Ulya)</div>
          </div>
        </div>
      </section>

      {/* Role Portal Overview Section */}
      <section id="portal-roles" className="py-12 sm:py-20 lg:py-28 2xl:py-36 px-4 sm:px-6 2xl:px-12 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-screen-2xl 2xl:max-w-[1700px] space-y-10 sm:space-y-16 2xl:space-y-20">

          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto space-y-3 2xl:space-y-4">
            <span className="text-xs sm:text-sm 2xl:text-base font-extrabold text-[#1ABC9C] uppercase tracking-wider bg-teal-50 px-4 py-1.5 2xl:px-6 2xl:py-2 rounded-full border border-teal-200 inline-block">
              Integrasi Tiga Layanan
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-[#1A5276]">
              Portal Akses Terpadu SIAP
            </h2>
            <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-[#566573] leading-relaxed">
              Aplikasi dirancang secara spesifik sesuai peran pengguna untuk kenyamanan, efisiensi, dan akurasi data.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 2xl:gap-12">

            {/* Admin Card */}
            <div className="bg-[#F8FAFC] p-8 sm:p-10 2xl:p-14 rounded-3xl 2xl:rounded-[2rem] border border-gray-200 hover:border-[#1A5276] transition-all hover:shadow-xl flex flex-col justify-between">
              <div className="space-y-6 2xl:space-y-8">
                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-2xl 2xl:rounded-3xl bg-[#1A5276] text-white flex items-center justify-center font-bold shadow-lg">
                  <Building2 className="w-7 h-7 2xl:w-10 2xl:h-10 text-[#1ABC9C]" />
                </div>
                <div>
                  <h3 className="font-black text-xl sm:text-2xl 2xl:text-3xl text-[#1A5276]">1. Portal Admin & Pengelola</h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#566573] mt-2 2xl:mt-3 leading-relaxed">Akses penuh untuk staf tata usaha, bendahara, & pengasuhan.</p>
                </div>
                <ul className="space-y-3 2xl:space-y-4 text-xs sm:text-sm 2xl:text-base text-gray-700 pt-2 font-medium">
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>8 Section Biodata Santri + Auto NIS</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Tagihan & Transaksi Kuitansi Syahriyah</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>PPDB & Fitur Mutasi Santri Baru</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Manajemen Kepegawaian & Master Data</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('admin')}
                className="w-full mt-8 2xl:mt-10 py-4 2xl:py-5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-black text-sm sm:text-base 2xl:text-lg rounded-2xl transition-all text-center shadow-lg hover:shadow-xl"
              >
                MASUK SEBAGAI ADMIN
              </button>
            </div>

            {/* Guru Card */}
            <div className="bg-[#F8FAFC] p-8 sm:p-10 2xl:p-14 rounded-3xl 2xl:rounded-[2rem] border border-gray-200 hover:border-[#2E86C1] transition-all hover:shadow-xl flex flex-col justify-between">
              <div className="space-y-6 2xl:space-y-8">
                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-2xl 2xl:rounded-3xl bg-[#2E86C1] text-white flex items-center justify-center font-bold shadow-lg">
                  <GraduationCap className="w-7 h-7 2xl:w-10 2xl:h-10 text-[#1ABC9C]" />
                </div>
                <div>
                  <h3 className="font-black text-xl sm:text-2xl 2xl:text-3xl text-[#1A5276]">2. Portal Guru & Ustadz</h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#566573] mt-2 2xl:mt-3 leading-relaxed">Kemudahan pencatatan setoran & kehadiran harian santri.</p>
                </div>
                <ul className="space-y-3 2xl:space-y-4 text-xs sm:text-sm 2xl:text-base text-gray-700 pt-2 font-medium">
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Batch Presensi Kelas Formal & Madin</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Input Setoran Tahfidz Juz 1-30</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Pencatatan Hafalan Kitab Nadhoman</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Jurnal Konseling & Bimbingan Santri</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('guru')}
                className="w-full mt-8 2xl:mt-10 py-4 2xl:py-5 bg-[#2E86C1] hover:bg-sky-600 text-white font-black text-sm sm:text-base 2xl:text-lg rounded-2xl transition-all text-center shadow-lg hover:shadow-xl"
              >
                MASUK SEBAGAI GURU / USTADZ
              </button>
            </div>

            {/* Wali Card */}
            <div className="bg-[#F8FAFC] p-8 sm:p-10 2xl:p-14 rounded-3xl 2xl:rounded-[2rem] border border-gray-200 hover:border-[#1ABC9C] transition-all hover:shadow-xl flex flex-col justify-between">
              <div className="space-y-6 2xl:space-y-8">
                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-2xl 2xl:rounded-3xl bg-[#1ABC9C] text-white flex items-center justify-center font-bold shadow-lg">
                  <HeartHandshake className="w-7 h-7 2xl:w-10 2xl:h-10" />
                </div>
                <div>
                  <h3 className="font-black text-xl sm:text-2xl 2xl:text-3xl text-[#1A5276]">3. Portal Orang Tua / Wali</h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#566573] mt-2 2xl:mt-3 leading-relaxed">Transparansi perkembangan putra/putri langsung di HP.</p>
                </div>
                <ul className="space-y-3 2xl:space-y-4 text-xs sm:text-sm 2xl:text-base text-gray-700 pt-2 font-medium">
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Monitoring Real-Time Hafalan Qur'an</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Riwayat Kesehatan & Perawatan UKS</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Status Perizinan Keluar & Pulang</span>
                  </li>
                  <li className="flex items-center gap-3 2xl:gap-4">
                    <CheckCircle2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#1ABC9C] shrink-0" />
                    <span>Rincian Tagihan & Download Kuitansi</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('wali')}
                className="w-full mt-8 2xl:mt-10 py-4 2xl:py-5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-black text-sm sm:text-base 2xl:text-lg rounded-2xl transition-all text-center shadow-lg hover:shadow-xl"
              >
                MASUK PORTAL WALI SANTRI
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Program Unggulan Pesantren */}
      <section id="program" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-screen-2xl text-center space-y-10 sm:space-y-16">

          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#1ABC9C] uppercase tracking-wider bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200 inline-block">
              Kurikulum Pesantren
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A5276]">
              Program Unggulan Pesantren Mukhtar Syafaat
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#566573] leading-relaxed">
              Pendidikan komprehensif mengawinkan tradisi Salafiyah dan ilmu pengetahuan formal secara berkesinambungan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center font-bold mb-6">
                <BookOpen className="w-7 h-7 text-[#1A5276]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Tahfidzul Qur'an 30 Juz</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Program bimbingan hafalan Al-Qur'an secara terstruktur dengan pengujian kelancaran tajwid, makhraj, serta murojaah berkala.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-[#1ABC9C] flex items-center justify-center font-bold mb-6">
                <GraduationCap className="w-7 h-7 text-[#1ABC9C]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Setoran Kitab Nadhoman</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Hafalan bait matan klasik: Aqidatul Awam (Tauhid), Matan Al-Imriti (Gramatika), hingga Alfiyah Ibn Malik (1000 Bait).
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-[#2E86C1] flex items-center justify-center font-bold mb-6">
                <School className="w-7 h-7 text-[#2E86C1]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Madrasah Diniyah Salafiyah</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Pendidikan Diniyah berjenjang Ula, Wustho, dan Ulya mendalami Fiqih, Nahwu, Shorof, Akhlaq, Tasawuf, dan Hadits An-Nawawi.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PPDB Online Section */}
      <section id="ppdb" className="py-12 sm:py-20 lg:py-28 bg-[#D6EAF8]/40 border-t border-b border-[#2E86C1]/30 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl bg-white p-4 sm:p-8 lg:p-14 rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-sky-200">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 mb-6 sm:mb-8 border-b border-gray-100">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 bg-[#1ABC9C] text-white text-xs font-black px-3.5 py-1 rounded-md uppercase mb-2">
                PPDB T.A. 2026/2027
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#1A5276] leading-tight">Formulir Pendaftaran PPDB Santri Baru</h3>
              <p className="text-xs sm:text-sm text-[#566573] font-semibold mt-1">Pondok Pesantren Mukhtar Syafaat Banyuwangi</p>
            </div>
            {showPpdbForm && (
              <button
                onClick={() => setShowPpdbForm(false)}
                className="text-xs sm:text-sm font-bold px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shrink-0 self-start"
              >
                Sembunyikan Form
              </button>
            )}
          </div>

          {ppdbSuccessMsg && (
            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>{ppdbSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handlePpdbSubmit} className="space-y-6">

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Nama Lengkap Calon Santri *</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  placeholder="e.g. Ahmad Rayhan Fitri"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Jenis Kelamin *</label>
                <select
                  value={jenisKelamin}
                  onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                >
                  <option value="L">Laki-laki (Putera)</option>
                  <option value="P">Perempuan (Puteri)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Tempat Lahir *</label>
                <input
                  type="text"
                  required
                  value={tempatLahir}
                  onChange={e => setTempatLahir(e.target.value)}
                  placeholder="e.g. Banyuwangi"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  value={tanggalLahir}
                  onChange={e => setTanggalLahir(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Nama Orang Tua / Wali *</label>
                <input
                  type="text"
                  required
                  value={namaOrtu}
                  onChange={e => setNamaOrtu(e.target.value)}
                  placeholder="e.g. H. Mansur Syafi'i"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">No HP WhatsApp Ortu *</label>
                <input
                  type="tel"
                  required
                  value={noHpOrtu}
                  onChange={e => setNoHpOrtu(e.target.value)}
                  placeholder="e.g. 081234567890"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Alamat Lengkap *</label>
              <textarea
                rows={3}
                required
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="Dusun, Desa, Kecamatan, Kabupaten..."
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Unit Pesantren</label>
                <select
                  value={unitPesantrenPilihanId}
                  onChange={e => setUnitPesantrenPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {unitsPesantren.map(u => (
                    <option key={u.id} value={u.id}>{u.namaUnit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Pilihan Sekolah Formal</label>
                <select
                  value={unitSekolahPilihanId}
                  onChange={e => setUnitSekolahPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {unitSekolahList.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSekolah}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Marhalah Madin</label>
                <select
                  value={marhalahPilihanId}
                  onChange={e => setMarhalahPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-black text-xs sm:text-base rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.99] flex items-center justify-center gap-2 sm:gap-3 px-4"
            >
              <UserPlus className="w-5 h-5 text-[#1ABC9C] shrink-0" />
              <span className="text-center leading-snug">KIRIM PENDAFTARAN PPDB SANTRI BARU</span>
            </button>

          </form>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A5276] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 border-t border-[#2E86C1]">
        <div className="container mx-auto max-w-screen-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs sm:text-sm">

          <div className="space-y-4">
            <div className="flex items-center gap-3 font-black text-xl sm:text-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#1ABC9C] flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              SIAP Mukhtar Syafaat
            </div>
            <p className="text-sky-200 leading-relaxed text-xs sm:text-sm">
              Sistem Informasi Manajemen Pesantren modern terintegrasi untuk pengelolaan santri, akademik, tahfidz, kesehatan, perizinan, dan keuangan syahriyah.
            </p>
          </div>

          <div>
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Unit Pendidikan</h4>
            <ul className="space-y-2.5 text-sky-100 font-medium">
              <li>Pondok Pesantren Putra & Putri</li>
              <li>Madrasah Diniyah Ula, Wustho, Ulya</li>
              <li>SMP Mukhtar Syafaat</li>
              <li>MTs Mukhtar Syafaat</li>
              <li>MA Mukhtar Syafaat</li>
              <li>SMK Mukhtar Syafaat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Kontak & Lokasi</h4>
            <ul className="space-y-2.5 text-sky-100 font-medium">
              <li>Jl. Pesantren No. 01 Blokagung, Tegalsari</li>
              <li>Kabupaten Banyuwangi, Jawa Timur</li>
              <li>Telepon: (0333) 845123</li>
              <li>WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Akses Portal</h4>
            <div className="space-y-3">
              <button
                onClick={() => openLogin('wali')}
                className="w-full py-3 bg-[#1ABC9C] hover:bg-[#16a085] font-black text-white rounded-xl transition-colors text-center block shadow"
              >
                Portal Wali Santri
              </button>
              <button
                onClick={() => openLogin('guru')}
                className="w-full py-3 bg-[#2E86C1] hover:bg-sky-600 font-black text-white rounded-xl transition-colors text-center block shadow"
              >
                Portal Guru / Ustadz
              </button>
              <button
                onClick={() => openLogin('admin')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 font-black text-white rounded-xl transition-colors text-center block border border-white/20"
              >
                Portal Admin Sistem
              </button>
            </div>
          </div>

        </div>

        <div className="container mx-auto max-w-screen-2xl mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-sky-200 gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 Pondok Pesantren Mukhtar Syafaat. All rights reserved.</p>
          <div className="font-extrabold text-white/90 tracking-wide">
            Media Yayasan Mukhtar Syafa'at
          </div>
        </div>
      </footer>

      {/* Login Modal with Role Support */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialRoleCategory={loginCategory}
      />

    </div>
  );
};
