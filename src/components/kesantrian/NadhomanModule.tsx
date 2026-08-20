import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookMarked, Plus, Search, CalendarDays } from 'lucide-react';
import { Santri } from '../../types/sisantri';

export const NadhomanModule: React.FC = () => {
  const { 
    santriList, 
    kitabList, 
    setoranNadhomanList, 
    addSetoranNadhoman, 
    getSantriNameById, 
    tahunAjaranList, 
    getTahunAjaranAktif,
    marhalahList,
    kelasMadinList
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [santriId, setSantriId] = useState('');
  const [kitabId, setKitabId] = useState(kitabList[0]?.id || '');
  const [baitAwal, setBaitAwal] = useState(1);
  const [baitAkhir, setBaitAkhir] = useState(50);
  const [pengampu, setPengampu] = useState('Ust. Abdul Wahab');
  const [catatan, setCatatan] = useState('Nadhoman lancar berirama');
  const [searchNis, setSearchNis] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahunAjaranId, setFilterTahunAjaranId] = useState<string>(
    () => getTahunAjaranAktif()?.id ?? ''
  );

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  const filteredSetoran = setoranNadhomanList.filter(sn => {
    const sName = getSantriNameById(sn.santriId).toLowerCase();
    const matchSearch = !searchQuery || sName.includes(searchQuery.toLowerCase()) || sn.namaKitab.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTA = !filterTahunAjaranId || sn.tahunAjaranId === filterTahunAjaranId;
    return matchSearch && matchTA;
  });

  const handleSearchNis = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSelectedSantri(null);
    setSantriId('');

    if (!searchNis.trim()) {
      setSearchError('Silakan masukkan NIS santri.');
      return;
    }

    const found = activeSantri.find(s => s.nis.trim() === searchNis.trim());
    if (found) {
      setSelectedSantri(found);
      setSantriId(found.id);
    } else {
      const inGeneralList = santriList.find(s => s.nis.trim() === searchNis.trim());
      if (inGeneralList) {
        setSearchError('Santri ditemukan, tetapi statusnya tidak Aktif.');
      } else {
        setSearchError('Santri dengan NIS tersebut tidak ditemukan.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriId) return;
    addSetoranNadhoman({
      santriId,
      kitabId,
      tanggal: new Date().toISOString().split('T')[0],
      baitAwal,
      baitAkhir,
      pengampu,
      catatan
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <BookMarked className="w-7 h-7 text-[#1ABC9C]" />
            Sub Setoran Nadhoman Kitab
          </h2>
          <p className="text-sm text-[#566573] mt-1">Setoran hafalan bait kitab Aqidatul Awam, Imriti, Alfiyah Ibnu Malik</p>
        </div>

        <button
          onClick={() => {
            setSearchNis('');
            setSearchError('');
            setSelectedSantri(null);
            setSantriId('');
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Input Setoran Nadhoman</span>
        </button>
      </div>

      {/* Filter Bar: Tahun Ajaran + Search */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Dropdown Tahun Ajaran */}
        <div className="flex items-center gap-2.5 shrink-0">
          <CalendarDays className="w-5 h-5 text-[#1ABC9C]" />
          <select
            value={filterTahunAjaranId}
            onChange={e => setFilterTahunAjaranId(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
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
            placeholder="Cari Nama Santri / Kitab..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C]"
          />
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Nama Santri</th>
                <th className="p-4">Kitab Nadhoman</th>
                <th className="p-4">Bait Setoran</th>
                <th className="p-4">Pengampu</th>
                <th className="p-4">Catatan Ustadz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSetoran.map(sn => {
                const kt = kitabList.find(k => k.id === sn.kitabId);
                return (
                  <tr key={sn.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono text-gray-600 text-base">{sn.tanggal}</td>
                    <td className="p-4 font-extrabold text-[#1A5276] text-base">{getSantriNameById(sn.santriId)}</td>
                    <td className="p-4 font-bold text-cyan-800 text-base">{kt?.namaKitab || sn.namaKitab || 'Kitab'}</td>
                    <td className="p-4 text-emerald-700 font-extrabold text-base">Bait {sn.baitAwal} - {sn.baitAkhir}</td>
                    <td className="p-4 text-gray-700 text-base">{sn.pengampu}</td>
                    <td className="p-4 text-gray-500 italic text-base">{sn.catatan || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Catat Setoran Nadhoman Kitab</h3>

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

            {/* Step 1: Search NIS */}
            {!selectedSantri && (
              <div className="space-y-4 text-xs">
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

                {searchError && (
                  <p className="text-rose-600 bg-rose-50 border border-rose-205 p-2 rounded-lg text-[11px] font-bold leading-relaxed">
                    ⚠️ {searchError}
                  </p>
                )}
                
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg text-gray-700 text-xs hover:bg-gray-200"
                  >
                    BATAL
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Form Input */}
            {selectedSantri && (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs pt-2 border-t border-gray-100">
                <div>
                  <label className="block font-bold mb-1 text-gray-700">Pilih Kitab *</label>
                  <select
                    value={kitabId}
                    onChange={e => setKitabId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                  >
                    {kitabList.map(k => (<option key={k.id} value={k.id}>{k.namaKitab} ({k.totalBait} Bait)</option>))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1 text-gray-700">Bait Awal *</label>
                    <input
                      type="number"
                      value={baitAwal}
                      onChange={e => setBaitAwal(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-gray-700">Bait Akhir *</label>
                    <input
                      type="number"
                      value={baitAkhir}
                      onChange={e => setBaitAkhir(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-700">Pengampu Ustaz *</label>
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
                    className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow text-xs"
                  >
                    SIMPAN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
