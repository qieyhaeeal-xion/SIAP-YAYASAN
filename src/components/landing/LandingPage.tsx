import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#1C2833] font-sans">

      {/* Top Header Bar */}
      <div className="bg-[#1A5276] text-white text-xs py-2 px-4 border-b border-[#2E86C1]">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] text-sky-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1ABC9C]" />
              Blokagung, Tegalsari, Banyuwangi
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#1ABC9C]" />
              (0333) 845123 / 0812-3456-7890
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-sky-200 hidden md:inline">Portal Login Fast-Access:</span>
            <button
              onClick={() => openLogin('admin')}
              className="text-white hover:text-[#1ABC9C] font-semibold bg-white/10 px-2.5 py-1 rounded transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => openLogin('guru')}
              className="text-white hover:text-[#1ABC9C] font-semibold bg-white/10 px-2.5 py-1 rounded transition-colors"
            >
              Guru & Pengurus
            </button>
            <button
              onClick={() => openLogin('wali')}
              className="text-[#1ABC9C] font-extrabold bg-white/20 px-2.5 py-1 rounded hover:bg-white/30 transition-colors"
            >
              Orang Tua / Wali
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A5276] flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-6 h-6 text-[#1ABC9C]" />
            </div>
            <div>
              <div className="font-black text-lg text-[#1A5276] leading-tight flex items-center gap-1.5">
                SIAP
                <span className="text-[10px] bg-[#1ABC9C] text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
                  Mukhtar Syafaat
                </span>
              </div>
              <p className="text-[11px] text-[#566573] hidden sm:block">Sistem Informasi Manajemen Pesantren Terpadu</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#1C2833]">
            <a href="#portal-roles" className="hover:text-[#2E86C1] transition-colors">Portal Akses</a>
            <a href="#program" className="hover:text-[#2E86C1] transition-colors">Program Unggulan</a>
            <a href="#modul" className="hover:text-[#2E86C1] transition-colors">Fitur Modul</a>
            <a href="#ppdb" className="hover:text-[#2E86C1] transition-colors">PPDB Online</a>
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => openLogin('wali')}
              className="px-3.5 py-2 border border-[#1A5276] text-[#1A5276] hover:bg-sky-50 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4 text-[#1ABC9C]" />
              <span>Portal Wali</span>
            </button>
            <button
              onClick={() => openLogin('admin')}
              className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
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
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { openLogin('admin'); setIsMobileMenuOpen(false); }}
                className="p-2 bg-sky-50 text-[#1A5276] rounded-lg text-xs font-bold text-center border border-sky-200"
              >
                Login Admin
              </button>
              <button
                onClick={() => { openLogin('guru'); setIsMobileMenuOpen(false); }}
                className="p-2 bg-sky-50 text-[#1A5276] rounded-lg text-xs font-bold text-center border border-sky-200"
              >
                Login Guru
              </button>
              <button
                onClick={() => { openLogin('wali'); setIsMobileMenuOpen(false); }}
                className="p-2 bg-[#1ABC9C] text-white rounded-lg text-xs font-extrabold text-center shadow"
              >
                Portal Wali
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner Section */}
      <header className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white py-16 lg:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10 grid md:grid-cols-12 gap-8 items-center">

          <div className="md:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#1ABC9C]/20 border border-[#1ABC9C] text-[#1ABC9C] px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4" />
              Sistem Informasi Pesantren Terpadu T.A. 2026/2027
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Pondok Pesantren <br />
              <span className="text-[#1ABC9C]">Mukhtar Syafaat</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-sky-100 max-w-xl leading-relaxed">
              Mewujudkan generasi santri unggul ber-Akhlakul Karimah, fasih Al-Qur'an & Kitab Salaf, terintegrasi pendidikan formal (MTs, MA, SMK) serta Madrasah Diniyah Ula, Wustho, Ulya.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsLandingPage(false)}
                className="px-6 py-3.5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>BUKA SIAP DASHBOARD UTAMA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowPpdbForm(true)}
                className="px-6 py-3.5 bg-white text-[#1A5276] hover:bg-sky-50 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#1ABC9C]" />
                <span>DAFTAR PPDB SANTRI BARU</span>
              </button>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="md:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white space-y-5 max-w-md w-full shadow-2xl">

              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1ABC9C] flex items-center justify-center text-white font-bold text-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Portal Multi-Akses</h3>
                    <p className="text-xs text-sky-200">Silakan pilih role untuk masuk</p>
                  </div>
                </div>
              </div>

              {/* 3 Role Entry Cards */}
              <div className="space-y-2.5">
                <button
                  onClick={() => openLogin('admin')}
                  className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A5276] flex items-center justify-center text-white font-bold">
                      <Building2 className="w-4 h-4 text-[#1ABC9C]" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-white group-hover:text-[#1ABC9C] transition-colors">
                        1. Portal Admin & Bendahara
                      </div>
                      <div className="text-[11px] text-sky-200">Manajemen Santri, Keuangan, PPDB & Pegawai</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => openLogin('guru')}
                  className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A5276] flex items-center justify-center text-white font-bold">
                      <GraduationCap className="w-4 h-4 text-[#1ABC9C]" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-white group-hover:text-[#1ABC9C] transition-colors">
                        2. Portal Guru & Ustadz
                      </div>
                      <div className="text-[11px] text-sky-200">Input Setoran Tahfidz, Nadhoman & Absensi</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => openLogin('wali')}
                  className="w-full p-3 bg-[#1ABC9C] hover:bg-[#16a085] rounded-xl text-white transition-all text-left flex items-center justify-between shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-white">
                        3. Portal Orang Tua / Wali
                      </div>
                      <div className="text-[11px] text-teal-100">Cek Hafalan, Sakit UKS, Izin Pulang & Tagihan</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </header>

      {/* Quick Statistics Banner */}
      <section className="bg-white py-10 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#1A5276]">1.250+</div>
            <div className="text-xs text-[#566573] font-bold mt-1">Santri Aktif Putra & Putri</div>
          </div>
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#2E86C1]">3 Unit</div>
            <div className="text-xs text-[#566573] font-bold mt-1">Kompleks Asrama Pesantren</div>
          </div>
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#1ABC9C]">3 Lembaga</div>
            <div className="text-xs text-[#566573] font-bold mt-1">Sekolah Formal (MTs, MA, SMK, SMP)</div>
          </div>
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#1A5276]">3 Marhalah</div>
            <div className="text-xs text-[#566573] font-bold mt-1">Madrasah Diniyah (Ula, Wustho, Ulya)</div>
          </div>
        </div>
      </section>

      {/* Role Portal Overview Section */}
      <section id="portal-roles" className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#1ABC9C] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Integrasi Tiga Layanan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A5276]">
              Portal Akses Terpadu SIAP
            </h2>
            <p className="text-xs sm:text-sm text-[#566573]">
              Aplikasi dirancang secara spesifik sesuai peran pengguna untuk kenyamanan, efisiensi, dan akurasi data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Admin Card */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-200 hover:border-[#1A5276] transition-all hover:shadow-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#1A5276] text-white flex items-center justify-center font-bold shadow-md">
                  <Building2 className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#1A5276]">1. Portal Admin & Pengelola</h3>
                  <p className="text-xs text-[#566573] mt-1">Akses penuh untuk staf tata usaha, bendahara, & pengasuhan.</p>
                </div>
                <ul className="space-y-2 text-xs text-gray-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>8 Section Biodata Santri + Auto NIS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Tagihan & Transaksi Kuitansi Syahriyah</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>PPDB & Fitur Mutasi Santri Baru</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Manajemen Kepegawaian & Master Data</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('admin')}
                className="w-full mt-6 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-xs rounded-xl transition-all text-center shadow-md"
              >
                MASUK SEBAGAI ADMIN
              </button>
            </div>

            {/* Guru Card */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-200 hover:border-[#2E86C1] transition-all hover:shadow-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#2E86C1] text-white flex items-center justify-center font-bold shadow-md">
                  <GraduationCap className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#1A5276]">2. Portal Guru & Ustadz</h3>
                  <p className="text-xs text-[#566573] mt-1">Kemudahan pencatatan setoran & kehadiran harian santri.</p>
                </div>
                <ul className="space-y-2 text-xs text-gray-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Batch Presensi Kelas Formal & Madin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Input Setoran Tahfidz Juz 1-30</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Pencatatan Hafalan Kitab Nadhoman</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Jurnal Konseling & Bimbingan Santri</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('guru')}
                className="w-full mt-6 py-2.5 bg-[#2E86C1] hover:bg-sky-600 text-white font-extrabold text-xs rounded-xl transition-all text-center shadow-md"
              >
                MASUK SEBAGAI GURU / USTADZ
              </button>
            </div>

            {/* Wali Card */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-200 hover:border-[#1ABC9C] transition-all hover:shadow-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#1ABC9C] text-white flex items-center justify-center font-bold shadow-md">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#1A5276]">3. Portal Orang Tua / Wali</h3>
                  <p className="text-xs text-[#566573] mt-1">Transparansi perkembangan putra/putri langsung di HP.</p>
                </div>
                <ul className="space-y-2 text-xs text-gray-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Monitoring Real-Time Hafalan Qur'an</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Riwayat Kesehatan & Perawatan UKS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Status Perizinan Keluar & Pulang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1ABC9C] shrink-0" />
                    <span>Rincian Tagihan & Download Kuitansi</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openLogin('wali')}
                className="w-full mt-6 py-2.5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-extrabold text-xs rounded-xl transition-all text-center shadow-md"
              >
                MASUK PORTAL WALI SANTRI
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Program Unggulan Pesantren */}
      <section id="program" className="py-16 px-4 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-7xl text-center space-y-12">

          <div>
            <span className="text-xs font-bold text-[#1ABC9C] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Kurikulum Pesantren
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A5276] mt-2">
              Program Unggulan Pesantren Mukhtar Syafaat
            </h2>
            <p className="text-xs sm:text-sm text-[#566573] max-w-xl mx-auto mt-1">
              Pendidikan komprehensif mengawinkan tradisi Salafiyah dan ilmu pengetahuan formal secara berkesinambungan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-6 h-6 text-[#1A5276]" />
              </div>
              <h3 className="font-extrabold text-base text-[#1A5276]">Tahfidzul Qur'an 30 Juz</h3>
              <p className="text-xs text-[#566573] mt-2 leading-relaxed">
                Program bimbingan hafalan Al-Qur'an secara terstruktur dengan pengujian kelancaran tajwid, makhraj, serta murojaah berkala.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#1ABC9C] flex items-center justify-center font-bold mb-4">
                <GraduationCap className="w-6 h-6 text-[#1ABC9C]" />
              </div>
              <h3 className="font-extrabold text-base text-[#1A5276]">Setoran Kitab Nadhoman</h3>
              <p className="text-xs text-[#566573] mt-2 leading-relaxed">
                Hafalan bait matan klasik: Aqidatul Awam (Tauhid), Matan Al-Imriti (Gramatika), hingga Alfiyah Ibn Malik (1000 Bait).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#2E86C1] flex items-center justify-center font-bold mb-4">
                <School className="w-6 h-6 text-[#2E86C1]" />
              </div>
              <h3 className="font-extrabold text-base text-[#1A5276]">Madrasah Diniyah Salafiyah</h3>
              <p className="text-xs text-[#566573] mt-2 leading-relaxed">
                Pendidikan Diniyah berjenjang Ula, Wustho, dan Ulya mendalami Fiqih, Nahwu, Shorof, Akhlaq, Tasawuf, dan Hadits An-Nawawi.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PPDB Online Section */}
      <section id="ppdb" className="py-16 bg-[#D6EAF8]/40 border-t border-b border-[#2E86C1]/30 px-4">
        <div className="container mx-auto max-w-4xl bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-sky-200">

          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#1ABC9C] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase mb-1">
                PPDB T.A. 2026/2027
              </div>
              <h3 className="text-xl font-black text-[#1A5276]">Formulir Pendaftaran PPDB Santri Baru</h3>
              <p className="text-xs text-[#566573]">Pondok Pesantren Mukhtar Syafaat Banyuwangi</p>
            </div>
            {showPpdbForm && (
              <button
                onClick={() => setShowPpdbForm(false)}
                className="text-xs font-bold px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Sembunyikan Form
              </button>
            )}
          </div>

          {ppdbSuccessMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{ppdbSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handlePpdbSubmit} className="space-y-4">

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Calon Santri *</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  placeholder="e.g. Ahmad Rayhan Fitri"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin *</label>
                <select
                  value={jenisKelamin}
                  onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                >
                  <option value="L">Laki-laki (Putera)</option>
                  <option value="P">Perempuan (Puteri)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tempat Lahir *</label>
                <input
                  type="text"
                  required
                  value={tempatLahir}
                  onChange={e => setTempatLahir(e.target.value)}
                  placeholder="e.g. Banyuwangi"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  value={tanggalLahir}
                  onChange={e => setTanggalLahir(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Orang Tua / Wali *</label>
                <input
                  type="text"
                  required
                  value={namaOrtu}
                  onChange={e => setNamaOrtu(e.target.value)}
                  placeholder="e.g. H. Mansur Syafi'i"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">No HP WhatsApp Ortu *</label>
                <input
                  type="tel"
                  required
                  value={noHpOrtu}
                  onChange={e => setNoHpOrtu(e.target.value)}
                  placeholder="e.g. 081234567890"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap *</label>
              <textarea
                rows={2}
                required
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="Dusun, Desa, Kecamatan, Kabupaten..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Pesantren</label>
                <select
                  value={unitPesantrenPilihanId}
                  onChange={e => setUnitPesantrenPilihanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {unitsPesantren.map(u => (
                    <option key={u.id} value={u.id}>{u.namaUnit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pilihan Sekolah Formal</label>
                <select
                  value={unitSekolahPilihanId}
                  onChange={e => setUnitSekolahPilihanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {unitSekolahList.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSekolah}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Marhalah Madin</label>
                <select
                  value={marhalahPilihanId}
                  onChange={e => setMarhalahPilihanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold text-[#1A5276]"
                >
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-extrabold text-xs rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#1ABC9C]" />
              <span>KIRIM PENDAFTARAN PPDB SANTRI BARU</span>
            </button>

          </form>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A5276] text-white py-12 px-4 border-t border-[#2E86C1]">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-4 gap-8 text-xs">

          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-lg">
              <div className="w-8 h-8 rounded-lg bg-[#1ABC9C] flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              SIAP Mukhtar Syafaat
            </div>
            <p className="text-sky-200 leading-relaxed">
              Sistem Informasi Manajemen Pesantren modern terintegrasi untuk pengelolaan santri, akademik, tahfidz, kesehatan, perizinan, dan keuangan syahriyah.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#1ABC9C] uppercase tracking-wider mb-3">Unit Pendidikan</h4>
            <ul className="space-y-2 text-sky-100">
              <li>Pondok Pesantren Putra & Putri</li>
              <li>Madrasah Diniyah Ula, Wustho, Ulya</li>
              <li>SMP Mukhtar Syafaat</li>
              <li>MTs Mukhtar Syafaat</li>
              <li>MA Mukhtar Syafaat</li>
              <li>SMK Mukhtar Syafaat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#1ABC9C] uppercase tracking-wider mb-3">Kontak & Lokasi</h4>
            <ul className="space-y-2 text-sky-100">
              <li>Jl. Pesantren No. 01 Blokagung, Tegalsari</li>
              <li>Kabupaten Banyuwangi, Jawa Timur</li>
              <li>Telepon: (0333) 845123</li>
              <li>WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#1ABC9C] uppercase tracking-wider mb-3">Akses Portal</h4>
            <div className="space-y-2">
              <button
                onClick={() => openLogin('wali')}
                className="w-full py-2.5 bg-[#1ABC9C] hover:bg-[#16a085] font-extrabold text-white rounded-xl transition-colors text-center block"
              >
                Portal Wali Santri
              </button>
              <button
                onClick={() => openLogin('guru')}
                className="w-full py-2.5 bg-[#2E86C1] hover:bg-sky-600 font-extrabold text-white rounded-xl transition-colors text-center block"
              >
                Portal Guru / Ustadz
              </button>
              <button
                onClick={() => openLogin('admin')}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 font-extrabold text-white rounded-xl transition-colors text-center block border border-white/20"
              >
                Portal Admin Sistem
              </button>
            </div>
          </div>

        </div>

        <div className="container mx-auto max-w-7xl mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-200 gap-4">
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
