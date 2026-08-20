import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  Building2, 
  FileCheck2, 
  HeartPulse, 
  ArrowUpRight, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  Home,
  ClipboardList,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  BedDouble,
  Activity,
  AlertCircle
} from 'lucide-react';

interface RoleDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const PengurusDashboard: React.FC<RoleDashboardProps> = ({ onNavigateTab }) => {
  const { 
    santriList, 
    asramaList,
    kamarList,
    perizinanList, 
    kesehatanList,
    ppdbList,
    currentUser,
    updatePerizinanStatus,
    mutasiPPDBKeSantri
  } = useApp();

  const totalActiveSantri = santriList.filter(s => s.status === 'Aktif').length;
  const pendingPermits = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan');
  const activePatients = kesehatanList.filter(k => k.status === 'Dalam Perawatan UKS');
  const pendingPPDB = ppdbList.filter(p => p.statusSeleksi === 'Lulus Seleksi' || p.statusSeleksi === 'Pendaftaran Baru');

  // Kapasitas Kamar
  const totalKapasitas = kamarList.reduce((acc, k) => acc + (k.kapasitas || 0), 0);
  const totalTerisi = kamarList.reduce((acc, k) => acc + (k.terisi || 0), 0);
  const persentaseOkupansi = totalKapasitas > 0 ? Math.round((totalTerisi / totalKapasitas) * 100) : 85;

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const statCards = [
    {
      label: 'Santri Aktif di Asrama',
      value: totalActiveSantri,
      unit: 'Santri',
      sub: `${asramaList.length} Asrama Terkelola`,
      icon: <Users className="w-7 h-7" />,
      gradient: 'from-[#1A5276] to-[#2E86C1]',
      trend: `${persentaseOkupansi}% Okupansi`,
      trendColor: 'text-emerald-300',
      onClick: () => onNavigateTab('data-santri'),
    },
    {
      label: 'Izin Perlu Approval',
      value: pendingPermits.length,
      unit: 'Pengajuan',
      sub: 'Perizinan Keluar / Pulang',
      icon: <FileCheck2 className="w-7 h-7" />,
      gradient: 'from-amber-500 to-orange-600',
      trend: pendingPermits.length > 0 ? 'Urgent' : 'Aman',
      trendColor: 'text-yellow-200',
      onClick: () => onNavigateTab('perizinan'),
    },
    {
      label: 'Santri Sakit di UKS',
      value: activePatients.length,
      unit: 'Santri',
      sub: 'Dalam Perawatan UKS',
      icon: <HeartPulse className="w-7 h-7" />,
      gradient: 'from-rose-500 to-red-600',
      trend: activePatients.length > 0 ? 'Pantau Medis' : 'Semua Sehat',
      trendColor: 'text-rose-200',
      onClick: () => onNavigateTab('kesehatan'),
    },
    {
      label: 'Antrian Mutasi PPDB',
      value: pendingPPDB.length,
      unit: 'Pendaftar',
      sub: 'Siap Dimutasi ke Santri',
      icon: <UserPlus className="w-7 h-7" />,
      gradient: 'from-[#1e6fa8] to-[#1ABC9C]',
      trend: 'Proses NIS',
      trendColor: 'text-teal-200',
      onClick: () => onNavigateTab('ppdb'),
    },
  ];

  const quickMenus = [
    { label: 'Input Santri Baru', icon: <Users className="w-5 h-5" />, color: 'text-[#1ABC9C] bg-teal-50 border-teal-200', tab: 'data-santri' },
    { label: 'Approval Perizinan', icon: <FileCheck2 className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50 border-orange-200', tab: 'perizinan' },
    { label: 'Kesehatan UKS', icon: <HeartPulse className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50 border-rose-200', tab: 'kesehatan' },
    { label: 'Mutasi Santri PPDB', icon: <UserPlus className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200', tab: 'ppdb' },
    { label: 'Kelola Asrama & Kamar', icon: <Home className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', tab: 'sub-pesantren' },
    { label: 'Presensi Santri Batch', icon: <CalendarCheck className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', tab: 'akademik' },
    { label: 'Konseling & Tamu Pos', icon: <ClipboardList className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', tab: 'konseling' },
    { label: 'Database Alumni', icon: <Users className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200', tab: 'alumni' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* â”€â”€â”€ HERO BANNER â”€â”€â”€ */}
      <div className="relative bg-linear-to-br from-[#1A5276] via-[#2E86C1] to-[#1e6fa8] text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-40 h-40 rounded-full bg-[#1ABC9C]/10" />

        <div className="relative z-10 p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#1ABC9C]/25 border border-[#1ABC9C]/50 text-[#1ABC9C] px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Dashboard Operasional â€” Pengurus Pesantren
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              {greeting}, {currentUser.nama}! ðŸ“‹
            </h2>
            <p className="text-sm text-sky-100 max-w-xl leading-relaxed">
              Pusat komando operasional harian pondok. Pantau ketertiban asrama, persetujuan izin santri, penanganan kesehatan UKS, dan penerimaan santri baru.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('perizinan')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <FileCheck2 className="w-4 h-4" />
              Approval Izin ({pendingPermits.length})
            </button>
            <button
              onClick={() => onNavigateTab('data-santri')}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm font-bold rounded-xl border border-white/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Users className="w-4 h-4" />
              Data Santri
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

      {/* â”€â”€â”€ MAIN ROW â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* â”€â”€ LEFT: Quick Approval Perizinan + UKS â”€â”€ */}
        <div className="lg:col-span-7 space-y-5">

          {/* Quick Approval Perizinan Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-orange-500" />
                  Antrian Persetujuan Izin Santri
                </h3>
                <p className="text-xs text-[#566573]">Pengurus dapat langsung menyetujui izin pulang atau keluar komplek</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                {pendingPermits.length} Menunggu
              </span>
            </div>

            <div className="space-y-3">
              {pendingPermits.slice(0, 4).map(p => {
                const s = santriList.find(item => item.id === p.santriId);
                return (
                  <div key={p.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1A5276]">{s?.namaLengkap || 'Santri'}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#1A5276] text-white rounded">NIS: {s?.nis || '-'}</span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium">
                        <span className="font-bold text-amber-800">{p.jenisPerizinan || p.jenisIzin}:</span> {p.alasanIzin || p.alasan}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Tanggal: {p.tanggalIzin || p.tanggalKeluar} s/d {p.tanggalKembali || p.tanggalKembaliPlan} â€¢ Penjemput: {p.penjemput || 'Orang Tua'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updatePerizinanStatus(p.id, 'Disetujui', currentUser.nama)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Setujui
                      </button>
                      <button
                        onClick={() => updatePerizinanStatus(p.id, 'Ditolak', currentUser.nama)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Tolak
                      </button>
                    </div>
                  </div>
                );
              })}

              {pendingPermits.length === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Semua perizinan santri telah diproses. Tidak ada antrian pending.
                </div>
              )}
            </div>
          </div>

          {/* Status Kamar & Asrama */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-indigo-500" />
                  Kapasitas & Okupansi Asrama Pesantren
                </h3>
                <p className="text-xs text-[#566573]">Total {totalTerisi} dari {totalKapasitas} ranjang terisi</p>
              </div>
              <button
                onClick={() => onNavigateTab('sub-pesantren')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Kelola Kamar <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {asramaList.map((asr) => {
                const kamarsInAsr = kamarList.filter(k => k.asramaId === asr.id);
                const asrKapasitas = kamarsInAsr.reduce((acc, k) => acc + (k.kapasitas || 0), 0);
                const asrTerisi = kamarsInAsr.reduce((acc, k) => acc + (k.terisi || 0), 0);
                const pct = asrKapasitas > 0 ? Math.round((asrTerisi / asrKapasitas) * 100) : 80;

                return (
                  <div key={asr.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{asr.namaAsrama}</p>
                        <p className="text-[11px] text-gray-500">Pembina: {asr.pembina} â€¢ {kamarsInAsr.length} Kamar</p>
                      </div>
                      <span className="font-black text-[#1A5276]">{asrTerisi} / {asrKapasitas} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 95 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-[#1ABC9C]'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* â”€â”€ RIGHT: Quick Actions + Pasien UKS + PPDB Mutasi â”€â”€ */}
        <div className="lg:col-span-5 space-y-5">

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#1ABC9C]" />
              Aksi Cepat Pengurus
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

          {/* Pasien UKS Aktif */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                Pasien UKS Aktif ({activePatients.length})
              </h3>
              <button
                onClick={() => onNavigateTab('kesehatan')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Log UKS <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {activePatients.slice(0, 3).map(k => {
                const s = santriList.find(item => item.id === k.santriId);
                return (
                  <div key={k.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-rose-900">{s?.namaLengkap || 'Santri'}</p>
                      <p className="text-[11px] text-rose-700">{k.keluhan} â€¢ {k.diagnosa || 'Pemeriksaan UKS'}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full">
                      Rawat Inap
                    </span>
                  </div>
                );
              })}
              {activePatients.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Alhamdulillah tidak ada santri rawat inap di UKS.</p>
              )}
            </div>
          </div>

          {/* Antrian PPDB Siap Mutasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                Calon Santri Lulus Seleksi PPDB
              </h3>
              <button
                onClick={() => onNavigateTab('ppdb')}
                className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
              >
                Modul PPDB <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {ppdbList.filter(p => p.statusSeleksi === 'Lulus Seleksi').slice(0, 3).map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1A5276]">{p.namaLengkap}</p>
                    <p className="text-[11px] text-gray-500">{p.noPendaftaran} â€¢ {p.sekolahAsal}</p>
                  </div>
                  <button
                    onClick={() => mutasiPPDBKeSantri(p.id)}
                    className="px-2.5 py-1 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-bold text-[10px] rounded shadow transition"
                  >
                    Mutasi NIS
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

