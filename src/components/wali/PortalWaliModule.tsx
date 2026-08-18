import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck2, BookOpenCheck, Wallet, FileCheck2, HeartPulse, GraduationCap, Building2 } from 'lucide-react';

export const PortalWaliModule: React.FC = () => {
  const {
    santriList,
    setoranTahfidzList,
    setoranNadhomanList,
    tagihanList,
    perizinanList,
    kesehatanList,
    asramaList,
    marhalahList,
    unitSekolahList
  } = useApp();

  const [selectedSantriId, setSelectedSantriId] = useState(santriList[0]?.id || '');

  const activeSantri = santriList.find(s => s.id === selectedSantriId) || santriList[0];

  const santriTahfidz = setoranTahfidzList.filter(st => st.santriId === activeSantri?.id);
  const santriNadhoman = setoranNadhomanList.filter(sn => sn.santriId === activeSantri?.id);
  const santriTagihan = tagihanList.filter(t => t.santriId === activeSantri?.id);
  const santriIzin = perizinanList.filter(p => p.santriId === activeSantri?.id);
  const santriSakit = kesehatanList.filter(k => k.santriId === activeSantri?.id);

  const asrama = asramaList.find(a => a.id === activeSantri?.asramaId);
  const marhalah = marhalahList.find(m => m.id === activeSantri?.marhalahMadinId);
  const sekolah = unitSekolahList.find(s => s.id === activeSantri?.unitSekolahId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Title */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <UserCheck2 className="w-5 h-5 text-[#1ABC9C]" />
            Portal Wali Santri Monitoring Real-time
          </h2>
          <p className="text-xs text-[#566573]">Pantau perkembangan hafalan, Syahriyah, perizinan, dan kesehatan ananda secara terpadu</p>
        </div>

        {/* Santri Selector */}
        <div className="flex items-center gap-2 bg-sky-50 p-2 rounded-lg border border-sky-200">
          <span className="text-xs font-bold text-[#1A5276]">Pilih Ananda:</span>
          <select
            value={selectedSantriId}
            onChange={e => setSelectedSantriId(e.target.value)}
            className="px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-extrabold text-[#1A5276]"
          >
            {santriList.map(s => (
              <option key={s.id} value={s.id}>{s.namaLengkap} ({s.nis})</option>
            ))}
          </select>
        </div>
      </div>

      {activeSantri && (
        <>
          {/* Santri Profile Card */}
          <div className="bg-linear-to-r from-[#1A5276] to-[#2E86C1] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-5">
            <img
              src={activeSantri.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={activeSantri.namaLengkap}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#1ABC9C] shadow"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-black">{activeSantri.namaLengkap}</h3>
              <p className="text-xs text-sky-200 font-mono">NIS: {activeSantri.nis} â€¢ Status: {activeSantri.status}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-[11px] font-bold">
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#1ABC9C]" /> {asrama?.namaAsrama || 'Asrama'}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" /> {marhalah?.namaMarhalah || 'Madin'}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck2 className="w-3.5 h-3.5 text-cyan-300" /> {sekolah?.namaSekolah || 'Sekolah Formal'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Overview Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Hafalan Tahfidz & Nadhoman */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-[#1A5276] flex items-center gap-2 border-b pb-2">
                <BookOpenCheck className="w-4 h-4 text-[#1ABC9C]" />
                Perkembangan Setoran Hafalan
              </h4>
              
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-bold text-amber-900">Capaian Tahfidz Al-Qur'an:</p>
                <p className="text-lg font-black text-amber-700">{activeSantri.capaianJuz} / {activeSantri.targetJuz} Juz</p>
                <p className="text-[11px] text-amber-800">Capaian Nadhoman: {activeSantri.capaianNadhoman}</p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                {santriTahfidz.map(st => (
                  <div key={st.id} className="p-2 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#1A5276]">Juz {st.juz} - {st.surah}</p>
                      <p className="text-[10px] text-gray-500">Ayat {st.ayatMulai}-{st.ayatSelesai} ({st.jenisSetoran})</p>
                    </div>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Nilai {st.nilai}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Syahriyah & Financial Status */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-[#1A5276] flex items-center gap-2 border-b pb-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Status Tagihan Syahriyah
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                {santriTagihan.map(t => {
                  const sisa = t.nominalTagihan - t.nominalTerbayar;
                  return (
                    <div key={t.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">Syahriyah {t.bulanPeriode} {t.tahunPeriode}</p>
                        <p className="text-[10px] font-mono text-gray-500">{t.noTagihan}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.status}
                        </span>
                        <p className="text-xs font-bold text-rose-600 mt-1">Sisa: Rp {sisa.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

