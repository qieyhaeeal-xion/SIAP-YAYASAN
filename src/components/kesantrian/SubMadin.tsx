import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Plus, Edit2, Trash2, BookMarked, Filter, X } from 'lucide-react';

export const SubMadin: React.FC = () => {
  const {
    marhalahList, addMarhalah, updateMarhalah, deleteMarhalah,
    kelasMadinList, addKelasMadin, updateKelasMadin, deleteKelasMadin,
    kitabList, addKitab, updateKitab, deleteKitab
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'marhalah' | 'kelas' | 'kitab'>('kelas');

  // DEPENDENT FILTER STATE
  const [selectedMarhalahFilter, setSelectedMarhalahFilter] = useState<string>('ALL');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('ALL');

  // Modal States
  const [showMarhalahModal, setShowMarhalahModal] = useState(false);
  const [editMarhalahId, setEditMarhalahId] = useState<string | null>(null);
  const [kodeMarhalah, setKodeMarhalah] = useState('');
  const [namaMarhalah, setNamaMarhalah] = useState('');
  const [tingkatMarhalah, setTingkatMarhalah] = useState(1);

  const [showKelasModal, setShowKelasModal] = useState(false);
  const [editKelasId, setEditKelasId] = useState<string | null>(null);
  const [marhalahId, setMarhalahId] = useState(marhalahList[0]?.id || '');
  const [namaKelasMadin, setNamaKelasMadin] = useState('');
  const [waliKelasMadin, setWaliKelasMadin] = useState('');

  const [showKitabModal, setShowKitabModal] = useState(false);
  const [editKitabId, setEditKitabId] = useState<string | null>(null);
  const [marhalahKitabId, setMarhalahKitabId] = useState(marhalahList[0]?.id || '');
  const [namaKitab, setNamaKitab] = useState('');
  const [totalBait, setTotalBait] = useState(100);
  const [pengampuKitab, setPengampuKitab] = useState('');

  // Dependent Filter Logic: Get Available Classes for selected Marhalah
  const availableKelasForFilter = selectedMarhalahFilter === 'ALL'
    ? kelasMadinList
    : kelasMadinList.filter(k => k.marhalahId === selectedMarhalahFilter);

  // Filtered List of Classes
  const filteredKelasList = kelasMadinList.filter(k => {
    if (selectedMarhalahFilter !== 'ALL' && k.marhalahId !== selectedMarhalahFilter) return false;
    if (selectedKelasFilter !== 'ALL' && k.id !== selectedKelasFilter) return false;
    return true;
  });

  // Handlers
  const handleSaveMarhalah = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMarhalahId) {
      updateMarhalah(editMarhalahId, { kodeMarhalah, namaMarhalah, tingkat: tingkatMarhalah });
    } else {
      addMarhalah({ kodeMarhalah, namaMarhalah, tingkat: tingkatMarhalah });
    }
    setShowMarhalahModal(false);
  };

  const handleSaveKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (editKelasId) {
      updateKelasMadin(editKelasId, { marhalahId, namaKelas: namaKelasMadin, waliKelas: waliKelasMadin });
    } else {
      addKelasMadin({ marhalahId, namaKelas: namaKelasMadin, waliKelas: waliKelasMadin });
    }
    setShowKelasModal(false);
  };

  const handleSaveKitab = (e: React.FormEvent) => {
    e.preventDefault();
    if (editKitabId) {
      updateKitab(editKitabId, { marhalahId: marhalahKitabId, namaKitab, totalBait, pengampu: pengampuKitab });
    } else {
      addKitab({ marhalahId: marhalahKitabId, namaKitab, totalBait, pengampu: pengampuKitab });
    }
    setShowKitabModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-[#1ABC9C]" />
            Sub Madrasah Diniyah (Madin) & Kitab Hafalan
          </h2>
          <p className="text-sm text-[#566573] mt-1">Master Marhalah (Ula, Wustho, Ulya), Kelas Diniyah, dan Kitab Hafalan</p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
          <button
            onClick={() => setActiveTabSub('marhalah')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'marhalah' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Marhalah Madin
          </button>
          <button
            onClick={() => setActiveTabSub('kelas')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'kelas' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kelas Madin
          </button>
          <button
            onClick={() => setActiveTabSub('kitab')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'kitab' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kitab Hafalan
          </button>
        </div>
      </div>

      {/* DEPENDENT FILTER BAR (PILIH MARHALAH -> PILIH KELAS MADIN) */}
      <div className="bg-sky-50 border border-sky-200 p-5 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2.5 text-sm font-bold text-[#1A5276] shrink-0">
          <Filter className="w-5 h-5 text-[#1ABC9C]" />
          <span>FILTER BERTINGKAT:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {/* Step 1: PILIH MARHALAH */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">1. PILIH MARHALAH</label>
            <select
              value={selectedMarhalahFilter}
              onChange={e => {
                setSelectedMarhalahFilter(e.target.value);
                setSelectedKelasFilter('ALL'); // Reset dependent kelas filter
              }}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1ABC9C] outline-none"
            >
              <option value="ALL">-- SEMUA MARHALAH --</option>
              {marhalahList.map(m => (
                <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
              ))}
            </select>
          </div>

          {/* Step 2: PILIH KELAS MADIN */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">2. PILIH KELAS MADIN</label>
            <select
              value={selectedKelasFilter}
              onChange={e => setSelectedKelasFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1ABC9C] outline-none"
            >
              <option value="ALL">-- SEMUA KELAS MADIN --</option>
              {availableKelasForFilter.map(k => (
                <option key={k.id} value={k.id}>{k.namaKelas}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. MASTER MARHALAH TAB */}
      {activeTabSub === 'marhalah' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Master Marhalah Diniyah</h3>
            <button
              onClick={() => { setEditMarhalahId(null); setKodeMarhalah(''); setNamaMarhalah(''); setShowMarhalahModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Marhalah</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Kode Marhalah</th>
                  <th className="p-4">Nama Marhalah</th>
                  <th className="p-4">Tingkat Jenjang</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {marhalahList.map(m => (
                  <tr key={m.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-bold text-[#1A5276] text-base">{m.kodeMarhalah}</td>
                    <td className="p-4 font-semibold text-base">{m.namaMarhalah}</td>
                    <td className="p-4 font-bold text-[#1ABC9C] text-base">Jenjang ke-{m.tingkat}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditMarhalahId(m.id);
                            setKodeMarhalah(m.kodeMarhalah);
                            setNamaMarhalah(m.namaMarhalah);
                            setTingkatMarhalah(m.tingkat);
                            setShowMarhalahModal(true);
                          }}
                          className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Hapus marhalah ${m.namaMarhalah}?`)) deleteMarhalah(m.id); }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. KELAS MADIN TAB */}
      {activeTabSub === 'kelas' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Kelas Madin</h3>
            <button
              onClick={() => { setEditKelasId(null); setNamaKelasMadin(''); setWaliKelasMadin(''); setShowKelasModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kelas Madin</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Nama Kelas Madin</th>
                  <th className="p-4">Marhalah</th>
                  <th className="p-4">Wali Kelas Diniyah</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKelasList.map(k => {
                  const m = marhalahList.find(x => x.id === k.marhalahId);
                  return (
                    <tr key={k.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-4 font-bold text-[#1A5276] text-base">{k.namaKelas}</td>
                      <td className="p-4 text-gray-700 font-semibold text-base">{m?.namaMarhalah || '-'}</td>
                      <td className="p-4 text-gray-600 text-base">{k.waliKelas}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditKelasId(k.id);
                              setMarhalahId(k.marhalahId);
                              setNamaKelasMadin(k.namaKelas);
                              setWaliKelasMadin(k.waliKelas);
                              setShowKelasModal(true);
                            }}
                            className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Hapus kelas ${k.namaKelas}?`)) deleteKelasMadin(k.id); }}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. KITAB HAFALAN TAB */}
      {activeTabSub === 'kitab' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Kitab Hafalan (Aqidatul Awam, Imriti, Alfiyah)</h3>
            <button
              onClick={() => { setEditKitabId(null); setNamaKitab(''); setTotalBait(100); setPengampuKitab(''); setShowKitabModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kitab</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Nama Kitab</th>
                  <th className="p-4">Marhalah Madin</th>
                  <th className="p-4">Total Bait</th>
                  <th className="p-4">Pengampu Kitab</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kitabList.map(kt => {
                  const m = marhalahList.find(x => x.id === kt.marhalahId);
                  return (
                    <tr key={kt.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-4 font-bold text-[#1A5276] flex items-center gap-2.5 text-base">
                        <BookMarked className="w-5 h-5 text-[#1ABC9C]" />
                        {kt.namaKitab}
                      </td>
                      <td className="p-4 text-gray-700 font-semibold text-base">{m?.namaMarhalah || '-'}</td>
                      <td className="p-4 font-bold text-emerald-700 text-base">{kt.totalBait} Bait</td>
                      <td className="p-4 text-gray-600 text-base">{kt.pengampu}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditKitabId(kt.id);
                              setMarhalahKitabId(kt.marhalahId);
                              setNamaKitab(kt.namaKitab);
                              setTotalBait(kt.totalBait);
                              setPengampuKitab(kt.pengampu);
                              setShowKitabModal(true);
                            }}
                            className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Hapus kitab ${kt.namaKitab}?`)) deleteKitab(kt.id); }}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FORM KELAS MADIN */}
      {showKelasModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editKelasId ? 'Edit Kelas Madin' : 'Tambah Kelas Madin Baru'}
              </h3>
              <button onClick={() => setShowKelasModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveKelas} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Marhalah Madin *</label>
                <select
                  value={marhalahId}
                  onChange={e => setMarhalahId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kelas Madin *</label>
                <input
                  type="text"
                  required
                  value={namaKelasMadin}
                  onChange={e => setNamaKelasMadin(e.target.value)}
                  placeholder="e.g. 1 Ula C"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Wali Kelas Madin *</label>
                <input
                  type="text"
                  required
                  value={waliKelasMadin}
                  onChange={e => setWaliKelasMadin(e.target.value)}
                  placeholder="e.g. Ust. Abdul Jabbar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowKelasModal(false)}
                  className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-xs font-bold rounded-lg shadow"
                >
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM KITAB */}
      {showKitabModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editKitabId ? 'Edit Kitab Hafalan' : 'Tambah Kitab Hafalan Baru'}
              </h3>
              <button onClick={() => setShowKitabModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveKitab} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Marhalah Madin *</label>
                <select
                  value={marhalahKitabId}
                  onChange={e => setMarhalahKitabId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kitab *</label>
                <input
                  type="text"
                  required
                  value={namaKitab}
                  onChange={e => setNamaKitab(e.target.value)}
                  placeholder="e.g. Matan Alfiyah Ibn Malik"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Bait *</label>
                  <input
                    type="number"
                    required
                    value={totalBait}
                    onChange={e => setTotalBait(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pengampu Kitab *</label>
                  <input
                    type="text"
                    required
                    value={pengampuKitab}
                    onChange={e => setPengampuKitab(e.target.value)}
                    placeholder="e.g. Ust. Hasan Basri"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowKitabModal(false)}
                  className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-xs font-bold rounded-lg shadow"
                >
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
