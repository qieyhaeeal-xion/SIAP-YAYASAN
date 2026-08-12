import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Building2, 
  Wallet, 
  FileCheck2, 
  BookOpenCheck, 
  GraduationCap, 
  ArrowUpRight, 
  Clock, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  const { 
    santriList, 
    unitsPesantren, 
    tagihanList, 
    perizinanList, 
    setoranTahfidzList, 
    setoranNadhomanList,
    marhalahList,
    ppdbList,
    currentUser
  } = useApp();

  const totalActiveSantri = santriList.filter(s => s.status === 'Aktif').length;
  const totalAlumni = santriList.filter(s => s.status === 'Alumni').length;
  const pendingPermits = perizinanList.filter(p => p.statusApproval === 'Menunggu Persetujuan').length;
  
  const unpaidInvoices = tagihanList.filter(t => t.status === 'Belum Lunas' || t.status === 'Sebagian');
  const totalUnpaidNominal = unpaidInvoices.reduce((acc, curr) => acc + (curr.nominalTagihan - curr.nominalTerbayar), 0);

  const totalTahfidzEntries = setoranTahfidzList.length;
  const totalNadhomanEntries = setoranNadhomanList.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner Welcome */}
      <div className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#1ABC9C]/20 border border-[#1ABC9C] text-[#1ABC9C] px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Informasi Manajemen Pesantren
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Selamat Datang, {currentUser.nama}!
            </h2>
            <p className="text-xs text-sky-100 mt-1 max-w-xl">
              Akses cepat statistik santri, perizinan, setoran tahfidz, nadhoman, dan pengelolaan syahriyah Pondok Pesantren Mukhtar Syafaat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('data-santri')}
              className="px-3.5 py-2 bg-[#1ABC9C] hover:bg-[#16a085] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Data Santri (8 Form)</span>
            </button>
            <button
              onClick={() => onNavigateTab('ppdb')}
              className="px-3.5 py-2 bg-white text-[#1A5276] hover:bg-sky-50 text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-[#1ABC9C]" />
              <span>Verifikasi PPDB</span>
            </button>
          </div>
        </div>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Santri Aktif */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#1ABC9C] transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Santri Aktif</p>
            <h3 className="text-2xl font-black text-[#1A5276] mt-1">{totalActiveSantri} Santri</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {totalAlumni} Santri Terdata Alumni
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#D6EAF8] text-[#1A5276] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Santri Per Unit Pesantren */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#1ABC9C] transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Pesantren</p>
            <h3 className="text-2xl font-black text-[#2E86C1] mt-1">{unitsPesantren.length} Unit</h3>
            <p className="text-[11px] text-gray-500 font-medium mt-1">
              Kompleks Pusat, Putri, & Vokasi
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#2E86C1] flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Perizinan Pending */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#1ABC9C] transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Izin Menunggu Approval</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingPermits} Pengajuan</h3>
            <button
              onClick={() => onNavigateTab('perizinan')}
              className="text-[11px] text-[#1ABC9C] hover:underline font-bold mt-1 flex items-center gap-0.5"
            >
              Proses Izin Kepengasuhan <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Tagihan Belum Lunas */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#1ABC9C] transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tunggakan Syahriyah</p>
            <h3 className="text-xl font-black text-rose-600 mt-1">
              Rp {totalUnpaidNominal.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-1">
              {unpaidInvoices.length} Santri Belum Lunas
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* GRAPHIC CHARTS & REKAP MARHALAH SECTION */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Rekap Marhalah Madin */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#1A5276]">Rekap Perkembangan Santri per Marhalah Madin</h3>
              <p className="text-xs text-[#566573]">Distribusi jenjang pendidikan Madrasah Diniyah Salafiyah</p>
            </div>
            <span className="text-[10px] bg-teal-50 text-[#1ABC9C] font-extrabold px-2 py-0.5 rounded-full border border-teal-200">
              T.A. 2026/2027
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {marhalahList.map((m, idx) => {
              const santriCount = santriList.filter(s => s.marhalahMadinId === m.id && s.status === 'Aktif').length;
              const percentage = totalActiveSantri > 0 ? Math.round((santriCount / totalActiveSantri) * 100) : 33;
              const colors = ['bg-[#1A5276]', 'bg-[#2E86C1]', 'bg-[#1ABC9C]'];

              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#1A5276]" />
                      {m.namaMarhalah}
                    </span>
                    <span className="text-[#1A5276]">{santriCount} Santri ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[idx % colors.length]}`}
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div className="p-3 bg-sky-50 rounded-lg text-center border border-sky-100">
              <p className="text-[11px] text-sky-800 font-semibold">Total Setoran Tahfidz</p>
              <p className="text-lg font-black text-[#1A5276]">{totalTahfidzEntries} Catatan Setoran</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
              <p className="text-[11px] text-teal-800 font-semibold">Total Setoran Nadhoman</p>
              <p className="text-lg font-black text-[#1ABC9C]">{totalNadhomanEntries} Catatan Setoran</p>
            </div>
          </div>
        </div>

        {/* Quick Menu & PPDB Queue */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Akses Cepat & Pendaftaran PPDB</h3>
            <span className="text-[10px] bg-sky-50 text-[#2E86C1] font-bold px-2 py-0.5 rounded">
              {ppdbList.length} Pendaftar Baru
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('data-santri')}
              className="p-2.5 bg-gray-50 hover:bg-[#D6EAF8] border border-gray-200 rounded-lg text-left font-bold text-[#1A5276] transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#1ABC9C]" />
              <span>Input Santri Baru</span>
            </button>

            <button
              onClick={() => onNavigateTab('tahfidz')}
              className="p-2.5 bg-gray-50 hover:bg-[#D6EAF8] border border-gray-200 rounded-lg text-left font-bold text-[#1A5276] transition-colors flex items-center gap-2"
            >
              <BookOpenCheck className="w-4 h-4 text-amber-500" />
              <span>Setoran Tahfidz</span>
            </button>

            <button
              onClick={() => onNavigateTab('nadhoman')}
              className="p-2.5 bg-gray-50 hover:bg-[#D6EAF8] border border-gray-200 rounded-lg text-left font-bold text-[#1A5276] transition-colors flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-cyan-600" />
              <span>Setoran Nadhoman</span>
            </button>

            <button
              onClick={() => onNavigateTab('keuangan')}
              className="p-2.5 bg-gray-50 hover:bg-[#D6EAF8] border border-gray-200 rounded-lg text-left font-bold text-[#1A5276] transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Bayar Syahriyah</span>
            </button>
          </div>

          {/* PPDB Pendaftar Queue */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Antrian Pendaftaran PPDB</p>
            {ppdbList.slice(0, 3).map(p => (
              <div key={p.id} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#1A5276]">{p.namaLengkap}</p>
                  <p className="text-[11px] text-gray-500">{p.noPendaftaran} • {p.sekolahAsal}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.statusSeleksi === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.statusSeleksi}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
