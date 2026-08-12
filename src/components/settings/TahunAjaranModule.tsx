import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarDays, Plus, Edit2, Trash2, X, CheckCircle, Circle } from 'lucide-react';

export const TahunAjaranModule: React.FC = () => {
  const { tahunAjaranList, addTahunAjaran, updateTahunAjaran } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [kodeTahunAjaran, setKodeTahunAjaran] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [isAktif, setIsAktif] = useState(false);

  const resetForm = () => {
    setEditId(null);
    setKodeTahunAjaran('');
    setTanggalMulai('');
    setTanggalSelesai('');
    setIsAktif(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (id: string) => {
    const item = tahunAjaranList.find(t => t.id === id);
    if (!item) return;
    setEditId(id);
    setKodeTahunAjaran(item.kodeTahunAjaran);
    setTanggalMulai(item.tanggalMulai);
    setTanggalSelesai(item.tanggalSelesai);
    setIsAktif(item.isAktif);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { kodeTahunAjaran, tanggalMulai, tanggalSelesai, isAktif };
    if (editId) {
      updateTahunAjaran(editId, payload);
    } else {
      addTahunAjaran(payload);
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string, kode: string) => {
    const item = tahunAjaranList.find(t => t.id === id);
    if (item?.isAktif) {
      alert('Tidak dapat menghapus tahun ajaran yang sedang aktif.');
      return;
    }
    if (confirm(`Hapus Tahun Ajaran ${kode}?`)) {
      alert('Fungsi hapus belum diekspos di context. Tambahkan deleteTahunAjaran ke AppContext jika diperlukan.');
    }
  };

  const filtered = tahunAjaranList.filter(t =>
    t.kodeTahunAjaran.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[#1A5276] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#1ABC9C]" />
            Master Tahun Ajaran
          </h3>
          <p className="text-xs text-[#566573] mt-0.5">
            Kelola daftar tahun ajaran pesantren. Hanya satu tahun ajaran yang boleh aktif dalam satu waktu.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tahun Ajaran</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari kode tahun ajaran... (contoh: 2025/2026)"
          className="w-full max-w-sm px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3 rounded-tl-lg">Kode Tahun Ajaran</th>
                <th className="p-3">Tanggal Mulai</th>
                <th className="p-3">Tanggal Selesai</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 rounded-tr-lg text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                    Tidak ada data tahun ajaran ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-extrabold text-[#1A5276]">{t.kodeTahunAjaran}</td>
                    <td className="p-3 font-mono text-gray-700">{t.tanggalMulai}</td>
                    <td className="p-3 font-mono text-gray-700">{t.tanggalSelesai}</td>
                    <td className="p-3 text-center">
                      {t.isAktif ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold">
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold">
                          <Circle className="w-3 h-3" />
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(t.id)}
                          className="p-1 text-[#2E86C1] hover:bg-sky-100 rounded"
                          title="Edit Tahun Ajaran"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.kodeTahunAjaran)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                          title="Hapus Tahun Ajaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">
                {editId ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">

              {/* Kode Tahun Ajaran */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kode Tahun Ajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kodeTahunAjaran}
                  onChange={e => setKodeTahunAjaran(e.target.value)}
                  placeholder="contoh: 2026/2027"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={e => setTanggalMulai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={e => setTanggalSelesai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              {/* Toggle isAktif */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Jadikan Tahun Ajaran Aktif</span>
                  <button
                    type="button"
                    onClick={() => setIsAktif(prev => !prev)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                      isAktif ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle Aktif"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        isAktif ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  ⚠️ Mengaktifkan tahun ajaran ini akan otomatis menonaktifkan semua tahun ajaran lainnya. Hanya satu tahun ajaran yang boleh aktif dalam satu waktu.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
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
