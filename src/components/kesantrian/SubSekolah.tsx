import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, Plus, Edit2, Trash2, X } from 'lucide-react';

export const SubSekolah: React.FC = () => {
  const {
    unitSekolahList, addUnitSekolah, updateUnitSekolah, deleteUnitSekolah,
    jurusanList, addJurusan, updateJurusan, deleteJurusan,
    kelasSekolahList, addKelasSekolah, updateKelasSekolah, deleteKelasSekolah
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'sekolah' | 'jurusan' | 'kelas'>('kelas');

  // Modal States
  const [showSekolahModal, setShowSekolahModal] = useState(false);
  const [editSekolahId, setEditSekolahId] = useState<string | null>(null);
  const [kodeSekolah, setKodeSekolah] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [kepalaSekolah, setKepalaSekolah] = useState('');

  const [showJurusanModal, setShowJurusanModal] = useState(false);
  const [editJurusanId, setEditJurusanId] = useState<string | null>(null);
  const [sekolahJurusanId, setSekolahJurusanId] = useState(unitSekolahList[0]?.id || '');
  const [kodeJurusan, setKodeJurusan] = useState('');
  const [namaJurusan, setNamaJurusan] = useState('');

  const [showKelasModal, setShowKelasModal] = useState(false);
  const [editKelasId, setEditKelasId] = useState<string | null>(null);
  const [sekolahKelasId, setSekolahKelasId] = useState(unitSekolahList[0]?.id || '');
  const [jurusanKelasId, setJurusanKelasId] = useState('');
  const [kodeKelas, setKodeKelas] = useState('');
  const [namaKelas, setNamaKelas] = useState('');
  const [waliKelas, setWaliKelas] = useState('');

  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSekolahId) {
      updateUnitSekolah(editSekolahId, { kodeSekolah, namaSekolah, kepalaSekolah });
    } else {
      addUnitSekolah({ kodeSekolah, namaSekolah, kepalaSekolah });
    }
    setShowSekolahModal(false);
  };

  const handleSaveJurusan = (e: React.FormEvent) => {
    e.preventDefault();
    if (editJurusanId) {
      updateJurusan(editJurusanId, { sekolahId: sekolahJurusanId, kodeJurusan, namaJurusan });
    } else {
      addJurusan({ sekolahId: sekolahJurusanId, kodeJurusan, namaJurusan });
    }
    setShowJurusanModal(false);
  };

  const handleSaveKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (editKelasId) {
      updateKelasSekolah(editKelasId, {
        sekolahId: sekolahKelasId,
        jurusanId: jurusanKelasId || undefined,
        kodeKelas,
        namaKelas,
        waliKelas
      });
    } else {
      addKelasSekolah({
        sekolahId: sekolahKelasId,
        jurusanId: jurusanKelasId || undefined,
        kodeKelas,
        namaKelas,
        waliKelas
      });
    }
    setShowKelasModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <School className="w-7 h-7 text-[#1ABC9C]" />
            Sub Sekolah Formal: MTs, MA, SMK
          </h2>
          <p className="text-sm text-[#566573] mt-1">Pengelolaan master unit sekolah formal, jurusan, dan kelas formal</p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
          <button
            onClick={() => setActiveTabSub('sekolah')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'sekolah' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unit Sekolah (MTs/MA/SMK)
          </button>
          <button
            onClick={() => setActiveTabSub('jurusan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'jurusan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Jurusan
          </button>
          <button
            onClick={() => setActiveTabSub('kelas')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'kelas' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kelas Formal
          </button>
        </div>
      </div>

      {/* 1. UNIT SEKOLAH TAB */}
      {activeTabSub === 'sekolah' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Unit Sekolah Formal</h3>
            <button
              onClick={() => { setEditSekolahId(null); setKodeSekolah(''); setNamaSekolah(''); setKepalaSekolah(''); setShowSekolahModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Sekolah</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Kode Sekolah</th>
                  <th className="p-4">Nama Sekolah</th>
                  <th className="p-4">Kepala Sekolah</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unitSekolahList.map(s => (
                  <tr key={s.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-bold text-[#1A5276] text-base">{s.kodeSekolah}</td>
                    <td className="p-4 font-semibold text-base">{s.namaSekolah}</td>
                    <td className="p-4 text-gray-700 text-base">{s.kepalaSekolah}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditSekolahId(s.id);
                            setKodeSekolah(s.kodeSekolah);
                            setNamaSekolah(s.namaSekolah);
                            setKepalaSekolah(s.kepalaSekolah);
                            setShowSekolahModal(true);
                          }}
                          className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Hapus sekolah ${s.namaSekolah}?`)) deleteUnitSekolah(s.id); }}
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

      {/* 2. JURUSAN TAB */}
      {activeTabSub === 'jurusan' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Jurusan Sekolah</h3>
            <button
              onClick={() => { setEditJurusanId(null); setKodeJurusan(''); setNamaJurusan(''); setShowJurusanModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Jurusan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Kode Jurusan</th>
                  <th className="p-4">Nama Jurusan</th>
                  <th className="p-4">Induk Sekolah</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jurusanList.map(j => {
                  const s = unitSekolahList.find(x => x.id === j.sekolahId);
                  return (
                    <tr key={j.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-4 font-bold text-[#1A5276] text-base">{j.kodeJurusan}</td>
                      <td className="p-4 font-semibold text-base">{j.namaJurusan}</td>
                      <td className="p-4 text-gray-700 text-base">{s?.namaSekolah || '-'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditJurusanId(j.id);
                              setSekolahJurusanId(j.sekolahId);
                              setKodeJurusan(j.kodeJurusan);
                              setNamaJurusan(j.namaJurusan);
                              setShowJurusanModal(true);
                            }}
                            className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Hapus jurusan ${j.namaJurusan}?`)) deleteJurusan(j.id); }}
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

      {/* 3. KELAS FORMAL TAB */}
      {activeTabSub === 'kelas' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Kelas Formal</h3>
            <button
              onClick={() => { setEditKelasId(null); setKodeKelas(''); setNamaKelas(''); setWaliKelas(''); setShowKelasModal(true); }}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kelas Formal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4 rounded-tl-lg">Kode Kelas</th>
                  <th className="p-4">Nama Kelas</th>
                  <th className="p-4">Sekolah</th>
                  <th className="p-4">Wali Kelas</th>
                  <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kelasSekolahList.map(k => {
                  const s = unitSekolahList.find(x => x.id === k.sekolahId);
                  return (
                    <tr key={k.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-4 font-bold text-[#1A5276] text-base">{k.kodeKelas}</td>
                      <td className="p-4 font-semibold text-base">{k.namaKelas}</td>
                      <td className="p-4 text-gray-700 text-base">{s?.namaSekolah || '-'}</td>
                      <td className="p-4 text-gray-600 text-base">{k.waliKelas}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditKelasId(k.id);
                              setSekolahKelasId(k.sekolahId);
                              setJurusanKelasId(k.jurusanId || '');
                              setKodeKelas(k.kodeKelas);
                              setNamaKelas(k.namaKelas);
                              setWaliKelas(k.waliKelas);
                              setShowKelasModal(true);
                            }}
                            className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Hapus kelas ${k.namaKelas}?`)) deleteKelasSekolah(k.id); }}
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

      {/* MODALS */}
      {showSekolahModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">{editSekolahId ? 'Edit Sekolah' : 'Tambah Sekolah'}</h3>
              <button onClick={() => setShowSekolahModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveSekolah} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kode Sekolah *</label>
                <input type="text" required value={kodeSekolah} onChange={e => setKodeSekolah(e.target.value)} placeholder="e.g. MTS" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Sekolah *</label>
                <input type="text" required value={namaSekolah} onChange={e => setNamaSekolah(e.target.value)} placeholder="e.g. MTs Mukhtar Syafaat" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kepala Sekolah *</label>
                <input type="text" required value={kepalaSekolah} onChange={e => setKepalaSekolah(e.target.value)} placeholder="e.g. Drs. H. Mabroer, M.Pd" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowSekolahModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white text-xs font-bold rounded-lg shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showKelasModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">{editKelasId ? 'Edit Kelas Formal' : 'Tambah Kelas Formal'}</h3>
              <button onClick={() => setShowKelasModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveKelas} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Sekolah *</label>
                <select value={sekolahKelasId} onChange={e => setSekolahKelasId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]">
                  {unitSekolahList.map(s => (<option key={s.id} value={s.id}>{s.namaSekolah}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode Kelas *</label>
                  <input type="text" required value={kodeKelas} onChange={e => setKodeKelas(e.target.value)} placeholder="e.g. X-MIPA-1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kelas *</label>
                  <input type="text" required value={namaKelas} onChange={e => setNamaKelas(e.target.value)} placeholder="e.g. Kelas X MIPA 1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Wali Kelas *</label>
                <input type="text" required value={waliKelas} onChange={e => setWaliKelas(e.target.value)} placeholder="e.g. Bu Sri Wahyuni, M.Si" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowKelasModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white text-xs font-bold rounded-lg shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
