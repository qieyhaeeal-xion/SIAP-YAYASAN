import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  Building2, 
  Wallet, 
  FileCheck2, 
  BookOpenCheck, 
  GraduationCap, 
  ArrowUpRight, 
  UserPlus, 
  TrendingUp,
  Sparkles,
  BookOpen,
  ClipboardList,
  HeartPulse,
  ChevronRight,
  Star,
  Award,
  BarChart3,
  Activity,
  ShieldCheck,
  CalendarDays,
  Settings
} from 'lucide-react';

interface RoleDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminYayasanDashboard: React.FC<RoleDashboardProps> = ({ onNavigateTab }) => {
  const { 
    santriList, 
    unitsPesantren, 
    tagihanList, 
    perizinanList, 
    setoranTahfidzList, 
    setoranNadhomanList,
    marhalahList,
    ppdbList,
    currentUser,
    pegawaiList
  } = useApp();

  const totalActiveSantri = santriList.filter(s => s.status === 'Aktif').length;
  const totalAlumni = santriList.filter(s => s.status === 'Alumni').length;
  const pendingPermits = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;
  const approvedPermits = perizinanList.filter(p => p.statusApproval === 'Disetujui').length;
  
  const unpaidInvoices = tagihanList.filter(t => t.status === 'Belum Lunas' || t.status === 'Sebagian');
  const totalUnpaidNominal = unpaidInvoices.reduce((acc, curr) => acc + (curr.nominalTagihan - curr.nominalTerbayar), 0);
  const totalPaidNominal = tagihanList.reduce((acc, curr) => acc + (curr.nominalTerbayar || 0), 0);
  const paidCount = tagihanList.filter(t => t.status === 'Lunas').length;

  const totalTahfidzEntries = setoranTahfidzList.length;
  const totalNadhomanEntries = setoranNadhomanList.length;

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const statCards = [
    {
      label: 'Total Santri Aktif',
      value: totalActiveSantri,
      unit: 'Santri',
      sub: `${totalAlumni} santri alumni`,
      icon: <Users className="w-7 h-7" />,
      gradient: 'from-[#1A5276] to-[#2E86C1]',
      trend: '+12% Thn Ini',
      trendColor: 'text-emerald-300',
      onClick: () => onNavigateTab('data-santri'),
    },
    {
      label: 'Total Kas Syahriyah',
      value: `Rp ${(totalPaidNominal / 1000000).toFixed(1)}jt`,
      unit: '',
      sub: `${paidCount} tagihan lunas`,
      icon: <Wallet className="w-7 h-7" />,
      gradient: 'from-emerald-600 to-teal-700',
      trend: 'Penerimaan',
      trendColor: 'text-teal-200',
      onClick: () => onNavigateTab('keuangan'),
    },
    {
      label: 'Unit & Pegawai Yayasan',
      value: `${unitsPesantren.length} Unit`,
      unit: '',
      sub: `${pegawaiList.length} ustaz & pegawai`,
      icon: <Building2 className="w-7 h-7" />,
      gradient: 'from-[#1e6fa8] to-[#1ABC9C]',
      trend: 'Aktif',
      trendColor: 'text-sky-200',
      onClick: () => onNavigateTab('kepegawaian'),
    },
    {
      label: 'Piutang & Tunggakan',
      value: `Rp ${(totalUnpaidNominal / 1000000).toFixed(1)}jt`,
      unit: '',
      sub: `${unpaidInvoices.length} santri belum lunas`,
      icon: <Wallet className="w-7 h-7" />,
      gradient: 'from-rose-500 to-pink-600',
      trend: 'Perlu Follow Up',
      trendColor: 'text-pink-200',
      onClick: () => onNavigateTab('keuangan'),
    },
  ];

  const quickMenus = [
    { label: 'Data Santri (8 Form)', icon: <Users className="w-5 h-5" />, color: 'text-[#1ABC9C] bg-teal-50 border-teal-200', tab: 'data-santri' },
    { label: 'Keuangan & Syahriyah', icon: <Wallet className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', tab: 'keuangan' },
    { label: 'Verifikasi PPDB', icon: <UserPlus className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200', tab: 'ppdb' },
    { label: 'Kepegawaian & Ustaz', icon: <Award className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', tab: 'kepegawaian' },
    { label: 'Unit Pesantren & Asrama', icon: <Building2 className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200', tab: 'sub-pesantren' },
    { label: 'Akademik & Presensi', icon: <CalendarDays className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200', tab: 'akademik' },
    { label: 'Izin Kepengasuhan', icon: <FileCheck2 className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50 border-orange-200', tab: 'perizinan' },
    { label: 'Pengaturan & RBAC', icon: <Settings className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', tab: 'pengaturan' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ─── HERO BANNER ─── */}
<div className="relative bg-[#1A5276] text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-indigo-400/10" />
        <div className="absolute top-1/2 -left-16 w-64 h-64 rounded-full bg-[#1ABC9C]/10 blur-3xl" />

        <div className="relative z-10 p-11 sm:p-14 flex flex-col sm:flex-row sm:items-center justify-between gap-7">
          <div className="space-y-4">
<div className="inline-flex items-center gap-2.5 bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              <ShieldCheck className="w-5 h-5" />
              Portal Eksekutif — Admin Yayasan Utama
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              {greeting}, {currentUser.nama}! 👑
            </h2>
            <p className="text-lg text-sky-100 max-w-xl leading-relaxed">
              Ringkasan komprehensif tata kelola Yayasan Pondok Pesantren Mukhtar Syafaat. Pantau keuangan, santri, kepegawaian, dan perizinan secara real-time.
            </p>
<div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-sm font-medium text-sky-200/70">Status Akses:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                Full Super Admin
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-sm font-medium">
                <CalendarDays className="w-4 h-4" />
                T.A. 2026/2027
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateTab('keuangan')}
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center gap-3 hover:scale-105"
            >
              <Wallet className="w-6 h-6" />
              Laporan Keuangan
            </button>
            <button
              onClick={() => onNavigateTab('pengaturan')}
              className="px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white text-lg font-bold rounded-xl border border-white/30 transition-all flex items-center gap-3 hover:scale-105"
            >
              <Settings className="w-6 h-6" />
              Kelola RBAC
            </button>
          </div>
        </div>
      </div>

{/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.onClick}
            className={`relative bg-linear-to-br ${card.gradient} text-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${card.onClick ? 'cursor-pointer' : ''}`}
          >
            {/* Lingkaran dekoratif kecil — pojok kanan bawah, di belakang konten & jauh dari teks */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10 p-6 space-y-5">
              {/* Ikon + label kategori (ikon sejajar kiri, bukan watermark kanan-atas) */}
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  {card.icon}
                </span>
                <p className="text-sm font-bold uppercase tracking-wider text-white/70 leading-snug">{card.label}</p>
              </div>

              {/* Angka besar */}
              <div className="flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-black leading-none tracking-tight">{card.value}</span>
                {card.unit && <span className="text-xl font-bold text-white/60 mb-1">{card.unit}</span>}
              </div>

              {/* Baris bawah: sub kiri (truncate), trend + chevron kanan (tidak wrap) */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/60 min-w-0 flex-1 truncate">{card.sub}</p>
                <span className={`text-sm font-bold ${card.trendColor} flex items-center gap-1.5 shrink-0 whitespace-nowrap`}>
                  <TrendingUp className="w-4 h-4" />
                  {card.trend}
                </span>
                {card.onClick && <ChevronRight className="w-5 h-5 text-white/70 shrink-0" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MAIN CONTENT ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT: Keuangan Makro & Sebaran Marhalah ── */}
        <div className="lg:col-span-7 space-y-5">

{/* Marhalah Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-[#1A5276] flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
                  Sebaran Santri per Marhalah Madin
                </h3>
                <p className="text-sm text-[#566573] mt-1">Jenjang pendidikan Salafiyah Yayasan Mukhtar Syafaat</p>
              </div>
              <span className="inline-flex items-center gap-1.5 w-fit text-sm bg-teal-50 text-teal-700 font-semibold px-4 py-2 rounded-full border border-teal-200 shrink-0">
                <CalendarDays className="w-4 h-4" />
                T.A. 2026/2027
              </span>
            </div>

            <div className="space-y-4">
              {marhalahList.map((m, idx) => {
                const santriCount = santriList.filter(s => s.marhalahMadinId === m.id && s.status === 'Aktif').length;
                const percentage = totalActiveSantri > 0 ? Math.round((santriCount / totalActiveSantri) * 100) : 33;
                const tone = [
                  { bar: 'bg-teal-700', badge: 'bg-teal-700', icon: 'bg-teal-700/10 text-teal-700' },
                  { bar: 'bg-teal-600', badge: 'bg-teal-600', icon: 'bg-teal-600/10 text-teal-600' },
                  { bar: 'bg-teal-500', badge: 'bg-teal-500', icon: 'bg-teal-500/10 text-teal-500' },
                ][idx % 3];
                return (
                  <div key={m.id} className="py-4 first:pt-0 last:pb-0 border-t border-gray-100 first:border-t-0 space-y-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tone.icon}`}>
                          <GraduationCap className="w-6 h-6" />
                        </span>
                        <h4 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-2">{m.namaMarhalah}</h4>
                      </div>

                      <div className="shrink-0 text-right w-16">
                        <p className="text-lg font-black text-gray-900 leading-none">{santriCount}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Santri</p>
                      </div>

                      <span className={`shrink-0 min-w-14 px-3 py-1 rounded-full text-center text-sm font-bold text-white ${tone.badge}`}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${tone.bar}`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keuangan Yayasan */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
<div className="mb-5 space-y-2.5">
              <h3 className="font-extrabold text-xl text-[#1A5276] flex items-center gap-3">
                <Wallet className="w-7 h-7 text-emerald-500 shrink-0" />
                Ringkasan Keuangan Yayasan
              </h3>
              <div className="flex justify-end">
                <button
                  onClick={() => onNavigateTab('keuangan')}
                  className="text-sm text-[#1ABC9C] hover:underline font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  Buka Modul Keuangan <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Total Kas Masuk</p>
                <p className="text-4xl font-black text-emerald-800 mt-2">Rp {(totalPaidNominal / 1000000).toFixed(1)}jt</p>
                <p className="text-sm text-emerald-600 mt-1.5">{paidCount} tagihan lunas</p>
              </div>
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <p className="text-sm font-bold text-rose-700 uppercase tracking-wider">Tunggakan Santri</p>
                <p className="text-4xl font-black text-rose-700 mt-2">Rp {(totalUnpaidNominal / 1000000).toFixed(1)}jt</p>
                <p className="text-sm text-rose-500 mt-1.5">{unpaidInvoices.length} santri</p>
              </div>
              <div className="p-6 bg-sky-50 border border-sky-200 rounded-xl text-center">
                <p className="text-sm font-bold text-sky-700 uppercase tracking-wider">Total Record Tagihan</p>
                <p className="text-4xl font-black text-sky-800 mt-2">{tagihanList.length}</p>
                <p className="text-sm text-sky-500 mt-1.5">Semua periode</p>
              </div>
            </div>
          </div>

{/* Hafalan Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onNavigateTab('tahfidz')}
              className="bg-linear-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              {/* Top row: icon box + arrow link sejajar satu baris */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 transition-colors shrink-0" />
              </div>
              {/* Spacing proporsional: 16px / 12px / 4px */}
              <div className="mt-4">
                <p className="text-sm font-bold text-amber-700 uppercase tracking-wider">Setoran Tahfidz Al-Qur'an</p>
                <p className="text-5xl font-black text-amber-800 mt-3 leading-none">{totalTahfidzEntries}</p>
                <p className="text-sm text-amber-600 mt-1">Total rekaman rekap juz</p>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('nadhoman')}
              className="bg-linear-to-br from-cyan-50 to-sky-100 border border-cyan-200 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-[#1ABC9C] rounded-xl flex items-center justify-center shadow">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-cyan-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-cyan-700 uppercase tracking-wider">Setoran Nadhoman Kitab</p>
                <p className="text-5xl font-black text-cyan-800 mt-3 leading-none">{totalNadhomanEntries}</p>
                <p className="text-sm text-cyan-600 mt-1">Total rekaman setoran bait</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Quick Menu + PPDB + Perizinan ── */}
        <div className="lg:col-span-5 space-y-5">

{/* Quick Menu */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <Activity className="w-7 h-7 text-[#1ABC9C] shrink-0" />
              <h3 className="font-extrabold text-lg sm:text-xl text-[#1A5276] leading-snug">Akses Semua Modul Yayasan</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickMenus.map((m, i) => (
                <button
                  key={i}
                  onClick={() => onNavigateTab(m.tab)}
                  className={`w-full px-4 py-3 rounded-xl border text-left transition-all hover:scale-[1.03] hover:shadow-sm flex items-center gap-3 ${m.color}`}
                >
                  <span className="shrink-0 flex items-center justify-center">{m.icon}</span>
                  <span className="text-sm font-bold leading-snug">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Antrian PPDB */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                Pendaftar Santri Baru (PPDB)
              </h3>
              <button
                onClick={() => onNavigateTab('ppdb')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Lihat Semua <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {ppdbList.slice(0, 4).map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center text-sm font-black shrink-0">
                      {p.namaLengkap.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A5276]">{p.namaLengkap}</p>
                      <p className="text-[11px] text-gray-400">{p.noPendaftaran} Â· {p.sekolahAsal}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    p.statusSeleksi === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' :
                    p.statusSeleksi === 'Telah Dimutasi' ? 'bg-sky-100 text-sky-800' :
                    p.statusSeleksi === 'Ditolak' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {p.statusSeleksi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Perizinan */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-500" />
                Izin Santri Menunggu Persetujuan
              </h3>
              <button
                onClick={() => onNavigateTab('perizinan')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Proses Izin ({pendingPermits}) <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              {perizinanList.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      p.statusApproval === 'Disetujui' ? 'bg-emerald-500' :
                      p.statusApproval === 'Ditolak' ? 'bg-rose-500' : 'bg-amber-400'
                    }`} />
                    <div>
                      <p className="font-bold text-gray-800">{p.jenisPerizinan || p.jenisIzin}</p>
                      <p className="text-[11px] text-gray-400">{(p.alasanIzin || p.alasan || '').slice(0, 30)}...</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    p.statusApproval === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' :
                    p.statusApproval === 'Ditolak' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {p.statusApproval === 'Menunggu Persetujuan' ? 'Pending' : p.statusApproval}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};


