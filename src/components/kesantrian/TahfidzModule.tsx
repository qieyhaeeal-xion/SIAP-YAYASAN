import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpenCheck, Plus, Search, CalendarDays } from 'lucide-react';
import { Santri } from '../../types/sisantri';

export const TahfidzModule: React.FC = () => {
  const { 
    santriList, 
    setoranTahfidzList, 
    addSetoranTahfidz, 
    getSantriNameById, 
    tahunAjaranList, 
    getTahunAjaranAktif,
    pesertaTahfidzList,
    addPesertaTahfidz,
    updateStatusPeserta,
    marhalahList,
    kelasMadinList
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [santriId, setSantriId] = useState(santriList[0]?.id || '');
  const [juz, setJuz] = useState(1);
  const [surah, setSurah] = useState('Al-Baqarah');
  const [ayatMulai, setAyatMulai] = useState(1);
  const [ayatSelesai, setAyatSelesai] = useState(50);
  const [jenisSetoran, setJenisSetoran] = useState<'Ziyadah' | 'Murojaah'>('Ziyadah');
  const [nilai, setNilai] = useState<'A' | 'B' | 'C'>('A');
  const [pengampu, setPengampu] = useState('Ust. Ahmad Fauzi, S.Pd.I');
  const [catatan, setCatatan] = useState('Lancar, makhroj tajwid mumtaz.');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahunAjaranId, setFilterTahunAjaranId] = useState<string>(
    () => getTahunAjaranAktif()?.id ?? ''
  );
  const [pesertaSantriId, setPesertaSantriId] = useState('');
  const [searchNis, setSearchNis] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);



  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  const filteredSetoran = setoranTahfidzList.filter(st => {
    const sName = getSantriNameById(st.santriId).toLowerCase();
    const matchSearch = sName.includes(searchQuery.toLowerCase()) || st.surah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTA = !filterTahunAjaranId || st.tahunAjaranId === filterTahunAjaranId;
    return matchSearch && matchTA;
  });

  const filteredPesertaList = pesertaTahfidzList.filter(p => 
    !filterTahunAjaranId || p.tahunAjaranId === filterTahunAjaranId
  );

  const activePesertaSantriList = filteredPesertaList
    .filter(p => p.status === 'Aktif')
    .map(p => santriList.find(s => s.id === p.santriId))
    .filter((s): s is Santri => !!s);

  const handleRegisterPeserta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesertaSantriId) return;
    addPesertaTahfidz({
      santriId: pesertaSantriId,
      tahunAjaranId: filterTahunAjaranId || getTahunAjaranAktif()?.id || '',
      status: 'Aktif'
    });
    setPesertaSantriId('');
  };

  const handleSearchNis = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSelectedSantri(null);
    setSantriId('');

    if (!searchNis.trim()) {
      setSearchError('Silakan masukkan NIS santri.');
      return;
    }

    const found = activePesertaSantriList.find(s => s.nis.trim() === searchNis.trim());
    if (found) {
      setSelectedSantri(found);
      setSantriId(found.id);
    } else {
      const inGeneralList = santriList.find(s => s.nis.trim() === searchNis.trim());
      if (inGeneralList) {
        setSearchError('Santri ditemukan, tetapi tidak terdaftar sebagai peserta aktif program Tahfidz pada tahun ajaran ini.');
      } else {
        setSearchError('Santri dengan NIS tersebut tidak ditemukan di sistem.');
      }
    }
  };




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSetoranTahfidz({
      santriId,
      tanggal: new Date().toISOString().split('T')[0],
      juz,
      surah,
      ayatMulai,
      ayatSelesai,
      jenisSetoran,
      nilai,
      pengampu,
      catatan
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-[#1ABC9C]" />
            Sub Tahfidz Quran (Buku Setoran Digital)
          </h2>
          <p className="text-xs text-[#566573]">Pencatatan setoran hafalan Ziyadah & Murojaah Al-Qur'an 30 Juz</p>
        </div>

        <button
          onClick={() => {
            setSearchNis('');
            setSearchError('');
            setSelectedSantri(null);
            setSantriId('');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Input Setoran Tahfidz</span>
        </button>
      </div>

      {/* Filter Bar: Tahun Ajaran + Search */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Dropdown Tahun Ajaran */}
        <div className="flex items-center gap-2 shrink-0">
          <CalendarDays className="w-4 h-4 text-[#1ABC9C]" />
          <select
            value={filterTahunAjaranId}
            onChange={e => setFilterTahunAjaranId(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
          >
            <option value="">Semua Tahun Ajaran</option>
            {tahunAjaranList.map(ta => (
              <option key={ta.id} value={ta.id}>
                {ta.kodeTahunAjaran}{ta.isAktif ? ' (Aktif)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari Nama Santri / Surah..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Panel Registrasi Peserta Tahfidz */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-[#1A5276] flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-[#1ABC9C]" />
            Registrasi Peserta Tahfidz
          </h3>
          <p className="text-xs text-[#566573]">Daftarkan santri ke program Tahfidz Quran untuk tahun ajaran yang sedang difilter</p>
        </div>

        <form onSubmit={handleRegisterPeserta} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="w-full max-w-md">
            <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Santri (Status Aktif) *</label>
            <select
              value={pesertaSantriId}
              onChange={e => setPesertaSantriId(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
            >
              <option value="">-- Pilih Santri --</option>
              {activeSantri.map(s => (
                <option key={s.id} value={s.id}>
                  {s.namaLengkap} ({s.nis})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!pesertaSantriId}
            className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] disabled:bg-gray-300 text-white font-bold text-xs rounded-lg shadow transition-all shrink-0"
          >
            Daftarkan Peserta
          </button>
        </form>

        <div className="border-t border-gray-100 pt-3">
          <h4 className="font-bold text-xs text-[#1A5276] mb-2">Daftar Peserta Tahfidz Terdaftar</h4>
          <div className="overflow-x-auto border border-gray-150 rounded-lg max-h-60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-2">Nama Santri</th>
                  <th className="p-2">Tanggal Daftar</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredPesertaList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-400 italic">
                      Tidak ada peserta terdaftar untuk filter Tahun Ajaran saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredPesertaList.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 font-semibold text-gray-800">{getSantriNameById(p.santriId)}</td>
                      <td className="p-2 font-mono text-gray-600">{p.tanggalDaftar}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          p.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'Lulus' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          <select
                            value={p.status}
                            onChange={e => updateStatusPeserta(p.id, e.target.value as any)}
                            className="bg-transparent border-none text-[10px] font-bold p-0 m-0 focus:ring-0 cursor-pointer outline-none"
                          >
                            <option value="Aktif" className="text-emerald-800 bg-white">Aktif</option>
                            <option value="Non Aktif" className="text-gray-800 bg-white">Non Aktif</option>
                            <option value="Lulus" className="text-sky-800 bg-white">Lulus</option>
                          </select>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Nama Santri</th>
                <th className="p-3">Juz & Surah</th>
                <th className="p-3">Ayat</th>
                <th className="p-3">Jenis Setoran</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Pengampu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSetoran.map(st => (
                <tr key={st.id} className="hover:bg-sky-50 transition-colors">
                  <td className="p-3 font-mono text-gray-600">{st.tanggal}</td>
                  <td className="p-3 font-extrabold text-[#1A5276]">{getSantriNameById(st.santriId)}</td>
                  <td className="p-3 font-bold text-emerald-700">Juz {st.juz} - {st.surah}</td>
                  <td className="p-3 text-gray-700 font-semibold">Ayat {st.ayatMulai} - {st.ayatSelesai}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      st.jenisSetoran === 'Ziyadah' ? 'bg-teal-100 text-teal-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {st.jenisSetoran}
                    </span>
                  </td>
                  <td className="p-3 font-black text-amber-600">{st.nilai}</td>
                  <td className="p-3 text-gray-600">{st.pengampu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Catat Setoran Tahfidz Quran</h3>
            {activePesertaSantriList.length === 0 ? (
              <div className="space-y-4 text-xs">
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                  Belum ada peserta Tahfidz terdaftar untuk tahun ajaran ini. Daftarkan peserta di panel atas terlebih dahulu.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg"
                  >
                    TUTUP
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Cari NIS Form */}
                <form onSubmit={handleSearchNis} className="flex gap-2 items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Cari NIS Santri... (contoh: 260001)"
                      value={searchNis}
                      onChange={e => setSearchNis(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow transition-all shrink-0"
                  >
                    Cari
                  </button>
                </form>

                {/* Error message */}
                {searchError && (
                  <p className="text-rose-600 bg-rose-50 border border-rose-205 p-2 rounded-lg text-[11px] font-bold leading-relaxed">
                    ⚠️ {searchError}
                  </p>
                )}

                {/* Kartu Informasi Santri */}
                {selectedSantri && (
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex gap-3 items-center">
                    <img
                      src={selectedSantri.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={selectedSantri.namaLengkap}
                      className="w-12 h-12 object-cover rounded-lg border border-sky-200 shrink-0 shadow-sm"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-extrabold text-xs text-[#1A5276] truncate">{selectedSantri.namaLengkap}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">NIS: {selectedSantri.nis}</p>
                      <p className="text-[10px] text-gray-700 font-medium">
                        Madin: <span className="font-bold text-[#1ABC9C]">{marhalahList.find(m => m.id === selectedSantri.marhalahMadinId)?.namaMarhalah || '-'}</span> | Kelas: <span className="font-bold text-[#1ABC9C]">{kelasMadinList.find(k => k.id === selectedSantri.kelasMadinId)?.namaKelas || '-'}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Input Setoran */}
                {selectedSantri && (
                  <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Juz (1-30) *</label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={juz}
                          onChange={e => setJuz(Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Nama Surah *</label>
                        <input
                          type="text"
                          required
                          value={surah}
                          onChange={e => setSurah(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Ayat Mulai *</label>
                        <input
                          type="number"
                          value={ayatMulai}
                          onChange={e => setAyatMulai(Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Ayat Selesai *</label>
                        <input
                          type="number"
                          value={ayatSelesai}
                          onChange={e => setAyatSelesai(Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Jenis Setoran</label>
                        <select
                          value={jenisSetoran}
                          onChange={e => setJenisSetoran(e.target.value as any)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        >
                          <option value="Ziyadah">Ziyadah (Baru)</option>
                          <option value="Murojaah">Murojaah (Ulang)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1 text-gray-700">Nilai Kelancaran</label>
                        <select
                          value={nilai}
                          onChange={e => setNilai(e.target.value as any)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                        >
                          <option value="A">A (Sangat Lancar)</option>
                          <option value="B">B (Lancar)</option>
                          <option value="C">C (Cukup)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-gray-700">Pengampu / Ustaz *</label>
                      <input
                        type="text"
                        required
                        value={pengampu}
                        onChange={e => setPengampu(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-gray-700">Catatan Ustadz</label>
                      <textarea
                        value={catatan}
                        onChange={e => setCatatan(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-medium"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg text-gray-700 text-xs hover:bg-gray-200"
                      >
                        BATAL
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold rounded-lg shadow text-xs"
                      >
                        SIMPAN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
