import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Edit2, Trash2, Home, DoorOpen, X } from 'lucide-react';

export const SubPesantren: React.FC = () => {
  const { 
    unitsPesantren, addUnitPesantren, updateUnitPesantren, deleteUnitPesantren,
    asramaList, addAsrama, updateAsrama, deleteAsrama,
    kamarList, addKamar, updateKamar, deleteKamar
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'unit' | 'asrama' | 'kamar'>('unit');
  
  // Modal States
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const [kodeUnit, setKodeUnit] = useState('');
  const [namaUnit, setNamaUnit] = useState('');
  const [deskripsiUnit, setDeskripsiUnit] = useState('');

  const [showAsramaModal, setShowAsramaModal] = useState(false);
  const [editAsramaId, setEditAsramaId] = useState<string | null>(null);
  const [unitPesantrenId, setUnitPesantrenId] = useState(unitsPesantren[0]?.id || '');
  const [kodeAsrama, setKodeAsrama] = useState('');
  const [namaAsrama, setNamaAsrama] = useState('');
  const [pembina, setPembina] = useState('');
  const [kapasitasAsrama, setKapasitasAsrama] = useState(100);

  const [showKamarModal, setShowKamarModal] = useState(false);
  const [editKamarId, setEditKamarId] = useState<string | null>(null);
  const [asramaId, setAsramaId] = useState(asramaList[0]?.id || '');
  const [kodeKamar, setKodeKamar] = useState('');
  const [namaKamar, setNamaKamar] = useState('');
  const [kapasitasKamar, setKapasitasKamar] = useState(12);
  const [terisiKamar, setTerisiKamar] = useState(0);

  // Unit Form Handlers
  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUnitId) {
      updateUnitPesantren(editUnitId, { kodeUnit, namaUnit, deskripsi: deskripsiUnit });
    } else {
      addUnitPesantren({ kodeUnit, namaUnit, deskripsi: deskripsiUnit });
    }
    setShowUnitModal(false);
    resetUnitForm();
  };

  const resetUnitForm = () => {
    setEditUnitId(null);
    setKodeUnit('');
    setNamaUnit('');
    setDeskripsiUnit('');
  };

  // Asrama Form Handlers
  const handleSaveAsrama = (e: React.FormEvent) => {
    e.preventDefault();
    if (editAsramaId) {
      updateAsrama(editAsramaId, { unitPesantrenId, kodeAsrama, namaAsrama, pembina, kapasitas: kapasitasAsrama });
    } else {
      addAsrama({ unitPesantrenId, kodeAsrama, namaAsrama, pembina, kapasitas: kapasitasAsrama });
    }
    setShowAsramaModal(false);
    resetAsramaForm();
  };

  const resetAsramaForm = () => {
    setEditAsramaId(null);
    setKodeAsrama('');
    setNamaAsrama('');
    setPembina('');
    setKapasitasAsrama(100);
  };

  // Kamar Form Handlers
  const handleSaveKamar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editKamarId) {
      updateKamar(editKamarId, { asramaId, kodeKamar, namaKamar, kapasitas: kapasitasKamar, terisi: terisiKamar });
    } else {
      addKamar({ asramaId, kodeKamar, namaKamar, kapasitas: kapasitasKamar, terisi: terisiKamar });
    }
    setShowKamarModal(false);
    resetKamarForm();
  };

  const resetKamarForm = () => {
    setEditKamarId(null);
    setKodeKamar('');
    setNamaKamar('');
    setKapasitasKamar(12);
    setTerisiKamar(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Module Title Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1ABC9C]" />
            Sub Pesantren: Unit, Asrama & Kamar
          </h2>
          <p className="text-xs text-[#566573]">Pengelolaan master data struktur lokasi tempat tinggal santri</p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTabSub('unit')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'unit' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Master Unit Pesantren
          </button>
          <button
            onClick={() => setActiveTabSub('asrama')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'asrama' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Master Asrama
          </button>
          <button
            onClick={() => setActiveTabSub('kamar')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'kamar' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Master Kamar
          </button>
        </div>
      </div>

      {/* 1. MASTER UNIT PESANTREN TAB */}
      {activeTabSub === 'unit' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar Unit Pesantren</h3>
            <button
              onClick={() => { resetUnitForm(); setShowUnitModal(true); }}
              className="px-3 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Unit Pesantren</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">Kode Unit</th>
                  <th className="p-3">Nama Unit Pesantren</th>
                  <th className="p-3">Deskripsi Kompleks</th>
                  <th className="p-3 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unitsPesantren.map(u => (
                  <tr key={u.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-bold text-[#1A5276]">{u.kodeUnit}</td>
                    <td className="p-3 font-semibold">{u.namaUnit}</td>
                    <td className="p-3 text-gray-600">{u.deskripsi}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditUnitId(u.id);
                            setKodeUnit(u.kodeUnit);
                            setNamaUnit(u.namaUnit);
                            setDeskripsiUnit(u.deskripsi);
                            setShowUnitModal(true);
                          }}
                          className="p-1 text-[#2E86C1] hover:bg-sky-100 rounded"
                          title="Edit Unit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus unit ${u.namaUnit}?`)) deleteUnitPesantren(u.id);
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                          title="Hapus Unit"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* 2. MASTER ASRAMA TAB */}
      {activeTabSub === 'asrama' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar Asrama Pesantren</h3>
            <button
              onClick={() => { resetAsramaForm(); setShowAsramaModal(true); }}
              className="px-3 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Asrama</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">Kode Asrama</th>
                  <th className="p-3">Nama Asrama</th>
                  <th className="p-3">Unit Pesantren</th>
                  <th className="p-3">Pembina Asrama</th>
                  <th className="p-3">Kapasitas</th>
                  <th className="p-3 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {asramaList.map(a => {
                  const unit = unitsPesantren.find(u => u.id === a.unitPesantrenId);
                  return (
                    <tr key={a.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-3 font-bold text-[#1A5276]">{a.kodeAsrama}</td>
                      <td className="p-3 font-semibold">{a.namaAsrama}</td>
                      <td className="p-3 text-gray-600">{unit?.namaUnit || '-'}</td>
                      <td className="p-3 text-gray-700">{a.pembina}</td>
                      <td className="p-3 font-bold text-emerald-700">{a.kapasitas} Santri</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditAsramaId(a.id);
                              setUnitPesantrenId(a.unitPesantrenId);
                              setKodeAsrama(a.kodeAsrama);
                              setNamaAsrama(a.namaAsrama);
                              setPembina(a.pembina);
                              setKapasitasAsrama(a.kapasitas);
                              setShowAsramaModal(true);
                            }}
                            className="p-1 text-[#2E86C1] hover:bg-sky-100 rounded"
                            title="Edit Asrama"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus asrama ${a.namaAsrama}?`)) deleteAsrama(a.id);
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                            title="Hapus Asrama"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* 3. MASTER KAMAR TAB */}
      {activeTabSub === 'kamar' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar Kamar Asrama</h3>
            <button
              onClick={() => { resetKamarForm(); setShowKamarModal(true); }}
              className="px-3 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kamar</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">Kode Kamar</th>
                  <th className="p-3">Nama Kamar</th>
                  <th className="p-3">Asrama</th>
                  <th className="p-3">Kapasitas</th>
                  <th className="p-3">Terisi</th>
                  <th className="p-3 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kamarList.map(k => {
                  const asrama = asramaList.find(a => a.id === k.asramaId);
                  return (
                    <tr key={k.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-3 font-bold text-[#1A5276]">{k.kodeKamar}</td>
                      <td className="p-3 font-semibold">{k.namaKamar}</td>
                      <td className="p-3 text-gray-600">{asrama?.namaAsrama || '-'}</td>
                      <td className="p-3 font-bold text-[#1A5276]">{k.kapasitas}</td>
                      <td className="p-3 font-bold text-emerald-700">{k.terisi} / {k.kapasitas}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditKamarId(k.id);
                              setAsramaId(k.asramaId);
                              setKodeKamar(k.kodeKamar);
                              setNamaKamar(k.namaKamar);
                              setKapasitasKamar(k.kapasitas);
                              setTerisiKamar(k.terisi);
                              setShowKamarModal(true);
                            }}
                            className="p-1 text-[#2E86C1] hover:bg-sky-100 rounded"
                            title="Edit Kamar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus kamar ${k.namaKamar}?`)) deleteKamar(k.id);
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                            title="Hapus Kamar"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* MODAL FORM UNIT */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editUnitId ? 'Edit Unit Pesantren' : 'Tambah Unit Pesantren Baru'}
              </h3>
              <button onClick={() => setShowUnitModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kode Unit *</label>
                <input
                  type="text"
                  required
                  value={kodeUnit}
                  onChange={e => setKodeUnit(e.target.value)}
                  placeholder="e.g. UPS-04"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Unit Pesantren *</label>
                <input
                  type="text"
                  required
                  value={namaUnit}
                  onChange={e => setNamaUnit(e.target.value)}
                  placeholder="e.g. Kompleks Darul Muttaqin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Kompleks</label>
                <textarea
                  rows={2}
                  value={deskripsiUnit}
                  onChange={e => setDeskripsiUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUnitModal(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
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

      {/* MODAL FORM ASRAMA */}
      {showAsramaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editAsramaId ? 'Edit Asrama' : 'Tambah Asrama Baru'}
              </h3>
              <button onClick={() => setShowAsramaModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveAsrama} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Pesantren *</label>
                <select
                  value={unitPesantrenId}
                  onChange={e => setUnitPesantrenId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  {unitsPesantren.map(u => (
                    <option key={u.id} value={u.id}>{u.namaUnit}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode Asrama *</label>
                  <input
                    type="text"
                    required
                    value={kodeAsrama}
                    onChange={e => setKodeAsrama(e.target.value)}
                    placeholder="e.g. ASR-D"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kapasitas (Santri) *</label>
                  <input
                    type="number"
                    required
                    value={kapasitasAsrama}
                    onChange={e => setKapasitasAsrama(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Asrama *</label>
                <input
                  type="text"
                  required
                  value={namaAsrama}
                  onChange={e => setNamaAsrama(e.target.value)}
                  placeholder="e.g. Asrama Fatimah Az-Zahra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pembina Asrama *</label>
                <input
                  type="text"
                  required
                  value={pembina}
                  onChange={e => setPembina(e.target.value)}
                  placeholder="e.g. Ust. M. Ridwan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAsramaModal(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
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

      {/* MODAL FORM KAMAR */}
      {showKamarModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editKamarId ? 'Edit Kamar' : 'Tambah Kamar Baru'}
              </h3>
              <button onClick={() => setShowKamarModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveKamar} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Asrama *</label>
                <select
                  value={asramaId}
                  onChange={e => setAsramaId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  {asramaList.map(a => (
                    <option key={a.id} value={a.id}>{a.namaAsrama}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode Kamar *</label>
                  <input
                    type="text"
                    required
                    value={kodeKamar}
                    onChange={e => setKodeKamar(e.target.value)}
                    placeholder="e.g. KMR-05"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kamar *</label>
                  <input
                    type="text"
                    required
                    value={namaKamar}
                    onChange={e => setNamaKamar(e.target.value)}
                    placeholder="e.g. Kamar Usman"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kapasitas *</label>
                  <input
                    type="number"
                    required
                    value={kapasitasKamar}
                    onChange={e => setKapasitasKamar(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Terisi *</label>
                  <input
                    type="number"
                    required
                    value={terisiKamar}
                    onChange={e => setTerisiKamar(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowKamarModal(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
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
