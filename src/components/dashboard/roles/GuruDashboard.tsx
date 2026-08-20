import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  BookOpenCheck, 
  BookOpen, 
  CalendarCheck, 
  Users, 
  ArrowUpRight, 
  Star, 
  Award, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MessageSquarePlus,
  BookMarked,
  Activity
} from 'lucide-react';

interface RoleDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const GuruDashboard: React.FC<RoleDashboardProps> = ({ onNavigateTab }) => {
  const { 
    santriList, 
    setoranTahfidzList, 
    setoranNadhomanList, 
    presensiList,
    kitabList,
    currentUser
  } = useApp();

  const totalActiveSantri = santriList.filter(s => s.status === 'Aktif').length;
  const totalTahfidz = setoranTahfidzList.length;
  const totalNadhoman = setoranNadhomanList.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPresensi = presensiList.filter(p => p.tanggal === todayStr);

  const recentTahfidz = setoranTahfidzList.slice(0, 4);
  const recentNadhoman = setoranNadhomanList.slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const statCards = [
    {
      label: 'Setoran Tahfidz Quran',
      value: totalTahfidz,
      unit: 'Entri',
      sub: 'Ziyadah & Murojaah',
      icon: <Star className="w-7 h-7" />,
      gradient: 'from-amber-500 to-orange-600',
      trend: 'Juz 1 - 30',
      trendColor: 'text-amber-200',
      onClick: () => onNavigateTab('tahfidz'),
    },
    {
      label: 'Setoran Nadhoman Kitab',
      value: totalNadhoman,
      unit: 'Entri',
      sub: 'Aqidatul Awam, Imriti, Alfiyah',
      icon: <BookOpen className="w-7 h-7" />,
      gradient: 'from-[#1e6fa8] to-[#1ABC9C]',
      trend: `${kitabList.length} Kitab Aktif`,
      trendColor: 'text-teal-200',
      onClick: () => onNavigateTab('nadhoman'),
    },
    {
      label: 'Presensi KBM Hari Ini',
      value: todayPresensi.length,
      unit: 'Santri',
      sub: 'Sholat, Madin & Formal',
      icon: <CalendarCheck className="w-7 h-7" />,
      gradient: 'from-blue-600 to-indigo-700',
      trend: 'Tercatat',
      trendColor: 'text-sky-200',
      onClick: () => onNavigateTab('akademik'),
    },
    {
      label: 'Total Santri Bimbingan',
      value: totalActiveSantri,
      unit: 'Santri',
      sub: 'Santri Aktif Terdaftar',
      icon: <Users className="w-7 h-7" />,
      gradient: 'from-[#1A5276] to-[#2E86C1]',
      trend: 'Madin & Formal',
      trendColor: 'text-sky-200',
      onClick: () => onNavigateTab('data-santri'),
    },
  ];

  const quickMenus = [
    { label: 'Input Setoran Tahfidz', icon: <BookOpenCheck className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200', tab: 'tahfidz' },
    { label: 'Input Setoran Nadhoman', icon: <BookOpen className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', tab: 'nadhoman' },
    { label: 'Presensi KBM Batch', icon: <CalendarCheck className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', tab: 'akademik' },
    { label: 'Catat Konseling & Nilai', icon: <MessageSquarePlus className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200', tab: 'konseling' },
    { label: 'Daftar Kelas Madin', icon: <BookMarked className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200', tab: 'sub-madin' },
    { label: 'Daftar Kelas Formal', icon: <GraduationCap className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', tab: 'sub-sekolah' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* â”€â”€â”€ HERO BANNER â”€â”€â”€ */}
      <div className="relative bg-linear-to-br from-[#1A5276] via-[#16a085] to-[#1ABC9C] text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative z-10 p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/40 text-white px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Guru & Ustadz Pengampu
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              {greeting}, {currentUser.nama}! ðŸ“–
            </h2>
            <p className="text-sm text-teal-50 max-w-xl leading-relaxed">
              Selamat datang di ruang kerja guru. Catat setoran hafalan Al-Qur'an (Tahfidz), setoran bait kitab kuning (Nadhoman), dan absensi KBM santri secara mudah dan cepat.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('tahfidz')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <BookOpenCheck className="w-4 h-4" />
              Setoran Tahfidz
            </button>
            <button
              onClick={() => onNavigateTab('nadhoman')}
              className="px-5 py-2.5 bg-white text-[#1A5276] hover:bg-teal-50 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <BookOpen className="w-4 h-4 text-[#1ABC9C]" />
              Setoran Nadhoman
            </button>
          </div>
        </div>
      </div>

      {/* â”€â”€â”€ STAT CARDS â”€â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.onClick}
            className={`relative bg-linear-to-br ${card.gradient} text-white p-6 rounded-2xl shadow-lg overflow-hidden group transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${card.onClick ? 'cursor-pointer' : ''}`}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute right-5 top-5 opacity-15 group-hover:opacity-25 transition-opacity">
              {card.icon}
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">{card.label}</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl sm:text-4xl font-black leading-none">{card.value}</span>
                {card.unit && <span className="text-sm font-bold text-white/60 mb-1.5">{card.unit}</span>}
              </div>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-white/60">{card.sub}</p>
                <span className={`text-xs font-bold ${card.trendColor} flex items-center gap-0.5`}>
                  {card.trend}
                </span>
              </div>
            </div>
            {card.onClick && (
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* â”€â”€â”€ MAIN CONTENT ROW â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* â”€â”€ LEFT: Setoran Tahfidz & Nadhoman Terkini â”€â”€ */}
        <div className="lg:col-span-7 space-y-5">

          {/* Setoran Tahfidz Quran Feed */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Catatan Setoran Tahfidz Al-Qur'an Terbaru
                </h3>
                <p className="text-xs text-[#566573]">Rekap penilaian hafalan Al-Qur'an santri</p>
              </div>
              <button
                onClick={() => onNavigateTab('tahfidz')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Buka Tahfidz <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTahfidz.map(t => {
                const s = santriList.find(item => item.id === t.santriId);
                return (
                  <div key={t.id} className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-gray-900">{s?.namaLengkap || 'Santri'}</p>
                      <p className="text-[11px] text-gray-600 font-medium">
                        Juz {t.juz} â€¢ {t.surah} (Ayat {t.ayatMulai}-{t.ayatSelesai}) â€¢ <span className="font-bold text-[#1A5276]">{t.jenisSetoran}</span>
                      </p>
                      <p className="text-[10px] text-gray-400">Pengampu: {t.pengampu} â€¢ {t.tanggal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        t.nilai === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        t.nilai === 'B' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Nilai {t.nilai}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Setoran Nadhoman Kitab Feed */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-600" />
                  Setoran Nadhoman Kitab Terkini
                </h3>
                <p className="text-xs text-[#566573]">Setoran bait Aqidatul Awam, Imriti, dan Alfiyah</p>
              </div>
              <button
                onClick={() => onNavigateTab('nadhoman')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Buka Nadhoman <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNadhoman.map(n => {
                const s = santriList.find(item => item.id === n.santriId);
                return (
                  <div key={n.id} className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/40 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-gray-900">{s?.namaLengkap || 'Santri'}</p>
                      <p className="text-[11px] text-gray-600">
                        Kitab: <span className="font-bold text-[#1A5276]">{n.namaKitab || 'Kitab'}</span> â€¢ Tambah <span className="font-black text-emerald-700">+{n.jumlahBaitBaru || (n.baitAkhir ? n.baitAkhir - (n.baitAwal || 0) + 1 : 10)} Bait</span>
                      </p>
                      <p className="text-[10px] text-gray-400">Total Akumulasi: {n.totalHafalanSelesai} Bait â€¢ {n.tanggal}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#1ABC9C]/15 text-[#1A5276] font-extrabold text-xs rounded-lg border border-[#1ABC9C]/30">
                      Terselesaikan
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* â”€â”€ RIGHT: Quick Menu + Presensi â”€â”€ */}
        <div className="lg:col-span-5 space-y-5">

          {/* Quick Menu */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#1ABC9C]" />
              Aksi Cepat Pengajar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickMenus.map((m, i) => (
                <button
                  key={i}
                  onClick={() => onNavigateTab(m.tab)}
                  className={`p-3.5 rounded-xl border text-left transition-all hover:scale-[1.03] hover:shadow-sm flex items-center gap-2.5 ${m.color}`}
                >
                  {m.icon}
                  <span className="text-xs font-bold leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Presensi Batch Banner */}
          <div className="bg-linear-to-br from-indigo-50 to-sky-50 border border-indigo-200 rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-indigo-950">Presensi Harian KBM Santri</h4>
              <p className="text-xs text-indigo-700 mt-1">
                Gunakan fitur batch entry untuk mengisi presensi Sholat Jamaah, KBM Madrasah Diniyah, dan KBM Formal sekali klik.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('akademik')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <span>Isi Presensi KBM Sekarang</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

