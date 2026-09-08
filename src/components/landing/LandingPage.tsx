import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LoginModal } from '../auth/LoginModal';
import {
  BookOpen,
  GraduationCap,
  School,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  UserPlus,
  Building2,
  Lock,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const { addPPDB, unitsPesantren, unitSekolahList, marhalahList, tahunAjaranList } = useApp();

  // Login Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  const activeTahunAjaran = tahunAjaranList.find(item => item.isAktif) || tahunAjaranList[0];
  const maxTanggalLahir = new Date().toISOString().split('T')[0];

  const openLogin = () => setIsLoginModalOpen(true);

  const openPpdbForm = () => {
    setShowPpdbForm(true);
    window.requestAnimationFrame(() => {
      document.getElementById('ppdb-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handlePpdbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registration = addPPDB({
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

    setPpdbSuccessMsg(`Pendaftaran berhasil. Nomor pendaftaran Anda: ${registration.noPendaftaran}. Simpan nomor ini untuk pelacakan.`);
    setNamaLengkap('');
    setJenisKelamin('L');
    setTempatLahir('');
    setTanggalLahir('');
    setNamaOrtu('');
    setNoHpOrtu('');
    setAlamat('');
    setSekolahAsal('');
    setUnitPesantrenPilihanId(unitsPesantren[0]?.id || '');
    setUnitSekolahPilihanId(unitSekolahList[0]?.id || '');
    setMarhalahPilihanId(marhalahList[0]?.id || '');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1C2833] font-sans">

      {/* Top Header Bar */}
      <div className="bg-[#0C1E30] text-white text-xs sm:text-sm py-2.5 px-4 sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
        <div className="container mx-auto max-w-screen-xl flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1 text-xs sm:text-sm text-sky-300/80">
            <span className="flex items-start sm:items-center gap-2 font-medium min-w-0">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-snug">Blokagung, Tegalsari, Banyuwangi</span>
            </span>
            <span className="hidden md:flex items-center gap-2 font-medium shrink-0">
              <Phone className="w-4 h-4 text-emerald-400" />
              (0333) 845123 / 0812-3456-7890
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-300/80 font-medium shrink-0">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="tabular-nums leading-snug">
              <span className="lg:hidden">{clockDateShort} · {clockTime} WIB</span>
              <span className="hidden lg:inline">{clockDate} · {clockTime} WIB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3">

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
              <p className="text-[11px] sm:text-sm text-[#566573] font-medium hidden sm:block truncate">Sistem Informasi Administrasi Pesantren</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm sm:text-base font-extrabold text-[#1C2833]">
             <a href="#program" className="hover:text-[#2E86C1] transition-colors py-1">Program Unggulan</a>
            <a href="#ppdb" className="hover:text-[#2E86C1] transition-colors py-1">PPDB Online</a>
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={openLogin}
              className="px-5 py-2.5 border-[1.5px] border-[#1A5276]/30 text-[#1A5276] hover:bg-[#1A5276] hover:text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#1ABC9C]" />
              <span>Login Admin</span>
            </button>
            <button
                   onClick={openLogin}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(26,82,118,0.25)] hover:shadow-[0_4px_12px_rgba(26,82,118,0.35)] flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#1ABC9C]" />
              <span>Masuk SIAP</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
             aria-expanded={isMobileMenuOpen}
             aria-controls="landing-mobile-menu"
             className="lg:hidden p-2 text-gray-700 hover:text-[#1A5276] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
           <div id="landing-mobile-menu" className="lg:hidden bg-white border-b border-gray-100 px-4 sm:px-6 py-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-lg">
            <div className="flex flex-col gap-2 text-sm font-extrabold text-[#1C2833]">
               <a href="#program" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#1A5276]/5 transition-colors duration-200">Program Unggulan</a>
              <a href="#ppdb" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#1A5276]/5 transition-colors duration-200">PPDB Online</a>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => { openLogin(); setIsMobileMenuOpen(false); }}
                className="p-3 bg-[#1A5276]/5 text-[#1A5276] rounded-xl text-xs sm:text-sm font-extrabold text-center border border-[#1A5276]/10 transition-colors duration-200 hover:bg-[#1A5276]/10"
               >
                 Login Admin
               </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner Section */}
      <header className="bg-linear-to-r from-[#0C1E30] via-[#1A5276] to-[#0C1E30] text-white py-12 sm:py-14 lg:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564769625905-50e93615e808?auto=format&fit=crop&w=2200&q=85')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0B2740]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-[#1A5276]/80 via-[#2E86C1]/60 to-[#1A5276]/80 pointer-events-none" />
        <div className="container mx-auto max-w-screen-xl relative z-10 grid md:grid-cols-12 gap-6 lg:gap-10 items-center">

          <div className="md:col-span-7 text-left">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-extrabold tracking-wide max-w-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
                <span className="leading-snug">Sistem Informasi Administrasi Pesantren</span>
              </div>

              <h1 className="text-3xl min-[480px]:text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.6rem] font-black leading-[1.08] tracking-tight">
                Pondok Pesantren <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-300 to-teal-200">Mukhtar Syafaat</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-sky-200/80 max-w-2xl leading-relaxed font-normal">
                Mewujudkan generasi santri unggul ber-Akhlakul Karimah, fasih Al-Qur'an & Kitab Salaf, terintegrasi pendidikan formal (SMP, MTs, MA, SMK) serta Madrasah Diniyah Ula, Wustho, Ulya.
              </p>
            </div>

            <div className="mt-7 sm:mt-8 grid grid-cols-1 min-[480px]:grid-cols-2 gap-3.5 w-full max-w-2xl">
              <button
                onClick={openLogin}
                className="w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-black text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(26,188,156,0.35)] flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(26,188,156,0.45)] active:scale-[0.98]"
              >
                <span className="text-center leading-snug">MASUK KE DASHBOARD SIAP</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>

              <button
                onClick={openPpdbForm}
                className="w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-white/95 text-[#1A5276] hover:bg-white font-black text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5 text-[#1ABC9C] shrink-0" />
                <span className="text-center leading-snug">DAFTAR PPDB SANTRI BARU</span>
              </button>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="md:col-span-5 flex justify-center w-full">
            <div className="bg-white/[0.08] backdrop-blur-lg p-5 sm:p-6 rounded-3xl border border-white/15 text-white space-y-4 max-w-lg w-full shadow-[0_8px_32px_rgba(0,0,0,0.25)]">

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1ABC9C] flex items-center justify-center text-white font-bold text-2xl shadow-[0_4px_12px_rgba(26,188,156,0.4)]">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl">Portal Multi-Akses</h3>
                    <p className="text-xs sm:text-sm text-sky-200/80">Akses khusus Admin Yayasan</p>
                  </div>
                </div>
              </div>

               <div className="space-y-3">
                <button
                   onClick={openLogin}
                  className="w-full p-3 sm:p-3.5 bg-white/[0.08] hover:bg-[#1ABC9C]/20 rounded-2xl border border-white/10 transition-all duration-200 text-left flex items-center justify-between gap-2 group hover:border-[#1ABC9C]/40"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A5276] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1ABC9C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-white group-hover:text-[#1ABC9C] transition-colors duration-200 leading-snug">
                        1. Portal Admin & Bendahara
                      </div>
                      <div className="text-[11px] sm:text-xs text-sky-200/80 mt-0.5 leading-snug">Manajemen Santri, Keuangan, PPDB & Pegawai</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200/80 group-hover:translate-x-1 transition-transform duration-200 shrink-0 group-hover:text-[#1ABC9C]" />
                </button>

               </div>

            </div>
          </div>

        </div>
      </header>

      {/* Quick Statistics Banner */}
      <section className="bg-white py-8 sm:py-10 lg:py-12 border-b border-gray-100 px-4 sm:px-6">
        <div className="container mx-auto max-w-screen-xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 text-center">
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-b from-sky-50 to-white border border-sky-100/80 shadow-[0_2px_12px_rgba(26,82,118,0.06)] hover:shadow-[0_6px_20px_rgba(26,82,118,0.1)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-[#1A5276]/10 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A5276]" />
            </div>
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-4xl xl:text-4xl font-black text-[#1A5276] tabular-nums">550+</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-sm lg:text-base text-[#566573] font-extrabold mt-1.5 leading-snug">Santri Aktif Putra & Putri</div>
          </div>
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-b from-sky-50 to-white border border-sky-100/80 shadow-[0_2px_12px_rgba(26,82,118,0.06)] hover:shadow-[0_6px_20px_rgba(26,82,118,0.1)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-[#2E86C1]/10 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E86C1]" />
            </div>
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-4xl xl:text-4xl font-black text-[#2E86C1] tabular-nums">12 Unit</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-sm lg:text-base text-[#566573] font-extrabold mt-1.5 leading-snug">Kompleks Asrama Pesantren</div>
          </div>
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-b from-sky-50 to-white border border-sky-100/80 shadow-[0_2px_12px_rgba(26,82,118,0.06)] hover:shadow-[0_6px_20px_rgba(26,82,118,0.1)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-[#1ABC9C]/10 flex items-center justify-center mb-3">
              <School className="w-5 h-5 sm:w-6 sm:h-6 text-[#1ABC9C]" />
            </div>
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-4xl xl:text-4xl font-black text-[#1ABC9C] tabular-nums">5 Lembaga</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-sm lg:text-base text-[#566573] font-extrabold mt-1.5 leading-snug">Sekolah Formal (TK/PAUD, MTs, MA, SMK, SMP)</div>
          </div>
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-b from-sky-50 to-white border border-sky-100/80 shadow-[0_2px_12px_rgba(26,82,118,0.06)] hover:shadow-[0_6px_20px_rgba(26,82,118,0.1)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-[#1A5276]/10 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A5276]" />
            </div>
            <div className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-4xl xl:text-4xl font-black text-[#1A5276] tabular-nums">3 Marhalah</div>
            <div className="text-[10px] min-[480px]:text-xs sm:text-sm lg:text-base text-[#566573] font-extrabold mt-1.5 leading-snug">Madrasah Diniyah (Ula, Wustho, Ulya)</div>
          </div>
        </div>
      </section>

      {/* Program Unggulan Pesantren */}
      <section id="program" className="py-12 sm:py-16 lg:py-18 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-screen-xl text-center space-y-8 sm:space-y-10">

          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs sm:text-sm font-extrabold text-[#1ABC9C] uppercase tracking-wider bg-teal-50 px-4 py-1.5 rounded-xl border border-teal-200 inline-block">
              Kurikulum Pesantren
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A5276] tracking-tight">
              Program Unggulan Pesantren Mukhtar Syafaat
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#566573] leading-relaxed">
              Pendidikan komprehensif mengawinkan tradisi Salafiyah dan ilmu pengetahuan formal secara berkesinambungan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">

            <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(26,82,118,0.05)] hover:shadow-[0_12px_32px_rgba(26,82,118,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-[#1A5276]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Tahfidzul Qur'an 30 Juz</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Program bimbingan hafalan Al-Qur'an secara terstruktur dengan pengujian kelancaran tajwid, makhraj, serta murojaah berkala.
              </p>
            </div>

            <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(26,82,118,0.05)] hover:shadow-[0_12px_32px_rgba(26,82,118,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-100 text-[#1ABC9C] flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-[#1ABC9C]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Setoran Kitab Nadhoman</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Hafalan bait matan klasik: Amtsilatu Tashrifiyah (Tata Bahasa), Al-Qusyairiyah (Terjemah Kitab Al-Jurumiyah) Matan Al-Imriti (Gramatika), hingga Alfiyah Ibn Malik (1000 Bait).
              </p>
            </div>

            <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(26,82,118,0.05)] hover:shadow-[0_12px_32px_rgba(26,82,118,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-100 text-[#2E86C1] flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                <School className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E86C1]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Madrasah Diniyah Salafiyah</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Pendidikan Diniyah berjenjang Ula, Wustho, dan Ulya mendalami Fiqih, Nahwu, Shorof, Akhlaq, Tasawuf, dan Hadits An-Nawawi.
              </p>
            </div>

            <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(26,82,118,0.05)] hover:shadow-[0_12px_32px_rgba(26,82,118,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                <School className="w-7 h-7 sm:w-8 sm:h-8 text-[#1A5276]" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1A5276]">Pendidikan Formal Terpadu</h3>
              <p className="text-sm sm:text-base text-[#566573] mt-3 leading-relaxed font-normal">
                Pilihan pendidikan SMP, MTs, MA, dan SMK yang terintegrasi dengan pembinaan pesantren untuk membangun kompetensi akademik dan karakter santri.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PPDB Online Section */}
       <section id="ppdb" className="py-12 sm:py-16 lg:py-18 bg-[#D6EAF8]/30 border-t border-b border-[#2E86C1]/20 px-4 sm:px-6">
         <div className="container mx-auto max-w-5xl bg-white p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(26,82,118,0.08)] border border-sky-100">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 mb-6 sm:mb-8 border-b border-gray-100">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 bg-[#1ABC9C] text-white text-xs font-black px-3.5 py-1 rounded-lg uppercase mb-2.5 shadow-[0_2px_8px_rgba(26,188,156,0.3)]">
                 PPDB T.A. {activeTahunAjaran?.kodeTahunAjaran || 'Belum Ditentukan'}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#1A5276] leading-tight tracking-tight">Formulir Pendaftaran PPDB Santri Baru</h3>
             <p className="text-xs sm:text-sm text-[#566573] font-semibold mt-1">Pondok Pesantren Mukhtar Syafaat Banyuwangi</p>
             </div>
             {showPpdbForm && (
               <button
                 onClick={() => setShowPpdbForm(false)}
                 type="button"
                 className="text-xs sm:text-sm font-bold px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shrink-0 self-start transition-colors duration-200"
              >
                 Sembunyikan Form
               </button>
             )}
           </div>

           {ppdbSuccessMsg && (
             <div role="status" aria-live="polite" className="mb-8 p-5 bg-emerald-50/80 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3">
               <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
               <span>{ppdbSuccessMsg}</span>
             </div>
           )}

           {!showPpdbForm && (
             <div className="space-y-5">
               <div className="grid sm:grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="ppdb-preview-nama" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Nama Lengkap Calon Santri</label>
                   <input
                     id="ppdb-preview-nama"
                     name="namaLengkapPreview"
                     type="text"
                     value={namaLengkap}
                     onChange={e => setNamaLengkap(e.target.value)}
                     placeholder="Contoh: Ahmad Rayhan Fitri"
                     className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                   />
                 </div>

                 <div>
                   <label htmlFor="ppdb-preview-jenis-kelamin" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Jenis Kelamin</label>
                   <select
                     id="ppdb-preview-jenis-kelamin"
                     name="jenisKelaminPreview"
                     value={jenisKelamin}
                     onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                     className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                   >
                     <option value="L">Laki-laki (Putera)</option>
                     <option value="P">Perempuan (Puteri)</option>
                   </select>
                 </div>

                 <div>
                   <label htmlFor="ppdb-preview-tanggal-lahir" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Tanggal Lahir</label>
                   <input
                     id="ppdb-preview-tanggal-lahir"
                     name="tanggalLahirPreview"
                     type="date"
                     max={maxTanggalLahir}
                     value={tanggalLahir}
                     onChange={e => setTanggalLahir(e.target.value)}
                     className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                   />
                 </div>

                 <div>
                   <label htmlFor="ppdb-preview-no-hp" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">No. WhatsApp Orang Tua</label>
                   <input
                     id="ppdb-preview-no-hp"
                     name="noHpOrtuPreview"
                     type="tel"
                     inputMode="tel"
                     pattern="[+]?[0-9 -]{8,20}"
                     title="Masukkan nomor HP yang valid"
                     value={noHpOrtu}
                     onChange={e => setNoHpOrtu(e.target.value)}
                     placeholder="Contoh: 081234567890"
                     className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                   />
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-sky-50/80 border border-sky-100 p-4">
                 <p className="text-xs sm:text-sm text-[#566573] font-semibold text-center sm:text-left">Lengkapi data berikutnya untuk menyelesaikan pendaftaran santri baru.</p>
                 <button
                   type="button"
                   onClick={openPpdbForm}
                   className="w-full sm:w-auto shrink-0 px-5 py-3 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-black text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(26,82,118,0.25)] hover:shadow-[0_4px_12px_rgba(26,82,118,0.35)]"
                 >
                   Lanjutkan Formulir
                 </button>
               </div>
             </div>
           )}

           {showPpdbForm && (
           <form id="ppdb-form" onSubmit={handlePpdbSubmit} className="space-y-6 scroll-mt-28">

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                 <label htmlFor="ppdb-nama" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Nama Lengkap Calon Santri *</label>
                 <input
                   id="ppdb-nama"
                   name="namaLengkap"
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  placeholder="e.g. Ahmad Rayhan Fitri"
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                />
              </div>

              <div>
                 <label htmlFor="ppdb-jenis-kelamin" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Jenis Kelamin *</label>
                 <select
                   id="ppdb-jenis-kelamin"
                   name="jenisKelamin"
                  value={jenisKelamin}
                  onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                >
                  <option value="L">Laki-laki (Putera)</option>
                  <option value="P">Perempuan (Puteri)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                 <label htmlFor="ppdb-tempat-lahir" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Tempat Lahir *</label>
                 <input
                   id="ppdb-tempat-lahir"
                   name="tempatLahir"
                  type="text"
                  required
                  value={tempatLahir}
                  onChange={e => setTempatLahir(e.target.value)}
                  placeholder="e.g. Banyuwangi"
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                />
              </div>

              <div>
                 <label htmlFor="ppdb-tanggal-lahir" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Tanggal Lahir *</label>
                 <input
                   id="ppdb-tanggal-lahir"
                   name="tanggalLahir"
                   type="date"
                   required
                   max={maxTanggalLahir}
                  value={tanggalLahir}
                  onChange={e => setTanggalLahir(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                 <label htmlFor="ppdb-nama-ortu" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Nama Orang Tua / Wali *</label>
                 <input
                   id="ppdb-nama-ortu"
                   name="namaOrtu"
                  type="text"
                  required
                  value={namaOrtu}
                  onChange={e => setNamaOrtu(e.target.value)}
                  placeholder="e.g. H. Mansur Syafi'i"
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                />
              </div>

              <div>
                 <label htmlFor="ppdb-no-hp" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">No HP WhatsApp Ortu *</label>
                 <input
                   id="ppdb-no-hp"
                   name="noHpOrtu"
                   type="tel"
                   required
                   inputMode="tel"
                   pattern="[+]?[0-9 -]{8,20}"
                   title="Masukkan nomor HP yang valid"
                  value={noHpOrtu}
                  onChange={e => setNoHpOrtu(e.target.value)}
                  placeholder="e.g. 081234567890"
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
               <label htmlFor="ppdb-alamat" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Alamat Lengkap *</label>
               <textarea
                 id="ppdb-alamat"
                 name="alamat"
                rows={3}
                required
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="Dusun, Desa, Kecamatan, Kabupaten..."
                className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                 <label htmlFor="ppdb-unit-pesantren" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Unit Pesantren *</label>
                 <select
                   id="ppdb-unit-pesantren"
                   name="unitPesantrenPilihanId"
                   required
                  value={unitPesantrenPilihanId}
                  onChange={e => setUnitPesantrenPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold text-[#1A5276]"
                >
                  {unitsPesantren.map(u => (
                    <option key={u.id} value={u.id}>{u.namaUnit}</option>
                  ))}
                </select>
              </div>

              <div>
                 <label htmlFor="ppdb-unit-sekolah" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Pilihan Sekolah Formal *</label>
                 <select
                   id="ppdb-unit-sekolah"
                   name="unitSekolahPilihanId"
                   required
                  value={unitSekolahPilihanId}
                  onChange={e => setUnitSekolahPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold text-[#1A5276]"
                >
                  {unitSekolahList.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSekolah}</option>
                  ))}
                </select>
              </div>

              <div>
                 <label htmlFor="ppdb-marhalah" className="block text-xs sm:text-sm font-extrabold text-gray-700 mb-2">Marhalah Madin *</label>
                 <select
                   id="ppdb-marhalah"
                   name="marhalahPilihanId"
                   required
                  value={marhalahPilihanId}
                  onChange={e => setMarhalahPilihanId(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-lg text-xs sm:text-sm outline-none focus:border-[#1ABC9C] focus:ring-[3px] focus:ring-[#1ABC9C]/15 transition-all font-semibold text-[#1A5276]"
                >
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-black text-xs sm:text-base rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(26,82,118,0.25)] hover:shadow-[0_6px_20px_rgba(26,82,118,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 sm:gap-3 px-4"
            >
              <UserPlus className="w-5 h-5 text-[#1ABC9C] shrink-0" />
              <span className="text-center leading-snug">KIRIM PENDAFTARAN PPDB SANTRI BARU</span>
            </button>

           </form>
           )}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C1E30] text-white py-10 sm:py-12 lg:py-14 px-4 sm:px-6 border-t border-white/5">
        <div className="container mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 text-xs sm:text-sm">

          <div className="space-y-4 lg:col-span-3">
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

          <div className="lg:col-span-2">
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Unit Pendidikan</h4>
            <ul className="space-y-2.5 text-sky-100/80 font-medium">
              <li className="transition-colors duration-200 hover:text-white">Pondok Pesantren Putra & Putri</li>
              <li className="transition-colors duration-200 hover:text-white">Madrasah Diniyah Ula, Wustho, Ulya</li>
              <li className="transition-colors duration-200 hover:text-white">SMP Mukhtar Syafaat</li>
              <li className="transition-colors duration-200 hover:text-white">MTs Mukhtar Syafaat</li>
              <li className="transition-colors duration-200 hover:text-white">MA Mukhtar Syafaat</li>
              <li className="transition-colors duration-200 hover:text-white">SMK Mukhtar Syafaat</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Kontak & Lokasi</h4>
            <ul className="space-y-2.5 text-sky-100/80 font-medium">
              <li className="transition-colors duration-200 hover:text-white">Jl. Pesantren No. 01 Blokagung, Tegalsari</li>
              <li className="transition-colors duration-200 hover:text-white">Kabupaten Banyuwangi, Jawa Timur</li>
              <li className="transition-colors duration-200 hover:text-white">Telepon: (0333) 845123</li>
              <li className="transition-colors duration-200 hover:text-white">WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Akses Portal</h4>
            <div className="space-y-3">
               <button
                  onClick={openLogin}
                 className="w-full py-3 bg-[#1ABC9C] hover:bg-[#16a085] font-black text-white rounded-xl transition-colors duration-200 text-center block shadow-[0_2px_8px_rgba(26,188,156,0.3)]"
               >
                 Portal Admin Yayasan
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <h4 className="font-black text-sm sm:text-base text-[#1ABC9C] uppercase tracking-wider mb-4">Peta Lokasi Pesantren</h4>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
              <iframe
                title="Peta lokasi Pondok Pesantren Mukhtar Syafaat"
                src="https://maps.google.com/maps?q=H432%2BW78+Kaligesing+Karangmulyo+Tegalsari+Banyuwangi+Jawa+Timur+68485&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="pointer-events-auto h-52 w-full touch-pan-x touch-pan-y border-0 sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allow="geolocation"
                tabIndex={0}
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-sky-200">Geser atau zoom peta untuk melihat area sekitar pesantren.</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Pondok+Pesantren+Mukhtar+Syafaat+Blokagung+Banyuwangi"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-extrabold text-sky-100 hover:text-white transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#1ABC9C]" />
              Buka di Google Maps
            </a>
          </div>

        </div>

        <div className="container mx-auto max-w-screen-xl mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-sky-200/70 gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 Pondok Pesantren Mukhtar Syafaat. All rights reserved.</p>
          <div className="font-extrabold text-white/90 tracking-wide">
            Media Yayasan Mukhtar Syafa'at
          </div>
        </div>
      </footer>

      {/* Login Modal Super Admin */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={() => navigate('/app')}
      />

    </div>
  );
};
