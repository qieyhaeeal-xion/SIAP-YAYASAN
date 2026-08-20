import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  HeartHandshake, 
  BookOpenCheck, 
  Wallet, 
  HeartPulse, 
  FileCheck2, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  Phone,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface RoleDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const WaliSantriDashboard: React.FC<RoleDashboardProps> = ({ onNavigateTab }) => {
  const { 
    currentUser, 
    santriList, 
    unitsPesantren, 
    asramaList, 
    kamarList, 
    unitSekolahList, 
    kelasSekolahList,
    marhalahList,
    kelasMadinList,
    setoranTahfidzList,
    setoranNadhomanList,
    tagihanList,
    perizinanList,
    kesehatanList
  } = useApp();

  // Associated Santri
  const santri = santriList.find(s => s.id === currentUser.santriIdAssociated) || santriList[0];

  const unitP = unitsPesantren.find(u => u.id === santri?.unitPesantrenId);
  const asrama = asramaList.find(a => a.id === santri?.asramaId);
  const kamar = kamarList.find(k => k.id === santri?.kamarId);
  const sekolah = unitSekolahList.find(s => s.id === santri?.unitSekolahId);
  const kelas = kelasSekolahList.find(k => k.id === santri?.kelasSekolahId);
  const marhalah = marhalahList.find(m => m.id === santri?.marhalahMadinId);
  const kelasMadin = kelasMadinList.find(k => k.id === santri?.kelasMadinId);

  // Setoran
  const santriTahfidz = setoranTahfidzList.filter(t => t.santriId === santri?.id);
  const santriNadhoman = setoranNadhomanList.filter(n => n.santriId === santri?.id);
  const santriTagihan = tagihanList.filter(t => t.santriId === santri?.id);
  const santriIzin = perizinanList.filter(p => p.santriId === santri?.id);
  const santriKesehatan = kesehatanList.filter(k => k.santriId === santri?.id);

  const highestJuz = santriTahfidz.length > 0 ? Math.max(...santriTahfidz.map(t => t.juz)) : (santri?.capaianJuz || 3);
  const totalBait = santriNadhoman.length > 0 ? Math.max(...santriNadhoman.map(n => n.totalHafalanSelesai)) : 250;
  const unpaidInvoices = santriTagihan.filter(t => t.status !== 'Lunas');

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* â”€â”€â”€ HERO BANNER â”€â”€â”€ */}
      <div className="relative bg-linear-to-br from-[#1A5276] via-[#16a085] to-[#1ABC9C] text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative z-10 p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/40 text-white px-3 py-1 rounded-full text-xs font-bold">
              <HeartHandshake className="w-3.5 h-3.5" />
              Portal Monitoring Wali Santri E-Santri
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              {greeting}, Bapak/Ibu {currentUser.nama}! ðŸŒ¸
            </h2>
            <p className="text-sm text-teal-50 max-w-xl leading-relaxed">
              Pantau perkembangan ananda di Pondok Pesantren Mukhtar Syafaat. Cek capaian hafalan Qur'an, setoran kitab, status tagihan Syahriyah, perizinan, dan kesehatan.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('portal-wali')}
            className="px-5 py-2.5 bg-white text-[#1A5276] hover:bg-teal-50 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
          >
            <UserCheck className="w-4 h-4 text-[#1ABC9C]" />
            Buka Portal Detail Ananda
          </button>
        </div>
      </div>

      {/* â”€â”€â”€ PROFIL ANANDA CARD â”€â”€â”€ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1A5276] to-[#1ABC9C] text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            {santri?.namaLengkap.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-gray-900">{santri?.namaLengkap}</h3>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Santri Aktif</span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">NIS: {santri?.nis} â€¢ NIK: {santri?.nik}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600 font-semibold">
              <span className="bg-gray-100 px-2 py-0.5 rounded">{unitP?.namaUnit}</span>
              <span>â€¢</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">{asrama?.namaAsrama} ({kamar?.namaKamar})</span>
              <span>â€¢</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">{sekolah?.namaSekolah} ({kelas?.namaKelas})</span>
              <span>â€¢</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Madin {marhalah?.namaMarhalah} ({kelasMadin?.namaKelas})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center w-full sm:w-auto">
            <p className="text-[11px] font-bold text-emerald-800">Status Syahriyah</p>
            <p className="text-sm font-black text-emerald-700 mt-0.5">
              {unpaidInvoices.length === 0 ? 'âœ… Lunas Semua' : `âš ï¸ ${unpaidInvoices.length} Belum Lunas`}
            </p>
          </div>
        </div>
      </div>

      {/* â”€â”€â”€ 4 METRIC CARDS â”€â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Tahfidz */}
        <div className="bg-linear-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Tahfidz Al-Qur'an</p>
            <Star className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-3xl font-black">Juz {highestJuz}</p>
          <p className="text-xs text-amber-100 font-medium">Target Capaian: {santri?.targetJuz || 30} Juz</p>
        </div>

        {/* Card 2: Nadhoman */}
        <div className="bg-linear-to-br from-[#1e6fa8] to-[#1ABC9C] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Hafalan Kitab</p>
            <BookOpen className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-3xl font-black">{totalBait} Bait</p>
          <p className="text-xs text-teal-100 font-medium">Kitab Matan Al-Imriti & Awam</p>
        </div>

        {/* Card 3: Izin */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Riwayat Perizinan</p>
            <FileCheck2 className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-3xl font-black">{santriIzin.length} Kali</p>
          <p className="text-xs text-blue-100 font-medium">Izin Pulang / Keluar Pondok</p>
        </div>

        {/* Card 4: UKS */}
        <div className="bg-linear-to-br from-rose-500 to-red-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Kesehatan Santri</p>
            <HeartPulse className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-3xl font-black">
            {santriKesehatan.some(k => k.status === 'Dalam Perawatan UKS') ? 'Dirawat' : 'Sehat'}
          </p>
          <p className="text-xs text-rose-100 font-medium">Gol. Darah: {santri?.golonganDarah || 'O'}</p>
        </div>

      </div>

      {/* â”€â”€â”€ DETAIL SECTIONS â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Tagihan & Transaksi */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#1A5276] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                Status Tagihan Syahriyah Ananda
              </h3>
              <p className="text-xs text-[#566573]">Riwayat pembayaran bulanan & tunggakan</p>
            </div>
            <button
              onClick={() => onNavigateTab('portal-wali')}
              className="text-[11px] text-[#1ABC9C] hover:underline font-bold flex items-center gap-0.5"
            >
              Lihat Kuitansi <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {santriTagihan.map(t => (
              <div key={t.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-800">{t.bulanPeriode || 'Bulan'} {t.tahunPeriode || '2026'}</p>
                  <p className="text-[11px] text-gray-500 font-mono">No Tagihan: {t.noTagihan || 'TGH-2026'}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-gray-800">Rp {t.nominalTagihan.toLocaleString('id-ID')}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    t.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hubungi Pengurus / UKS */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-linear-to-br from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1ABC9C] text-white flex items-center justify-center shadow-md shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#1A5276]">Pusat Informasi & Pengasuhan</h4>
                <p className="text-xs text-gray-600">PP Mukhtar Syafaat Blokagung</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Bapak/Ibu wali santri dapat menghubungi pengurus asrama atau pos kesehatan jika membutuhkan informasi kepulangan atau kondisi ananda:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-teal-100 flex items-center justify-between">
                <span className="font-bold text-[#1A5276]">Pos Kepengasuhan:</span>
                <span className="font-mono text-emerald-700 font-bold">0812-3456-7890</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-teal-100 flex items-center justify-between">
                <span className="font-bold text-[#1A5276]">Layanan UKS Kesehatan:</span>
                <span className="font-mono text-emerald-700 font-bold">0813-9876-5432</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

