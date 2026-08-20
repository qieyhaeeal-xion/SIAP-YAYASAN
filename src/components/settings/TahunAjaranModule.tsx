import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarDays, Plus, Edit2, Trash2, X, CheckCircle, Circle, Search, CalendarRange, AlertTriangle } from 'lucide-react';

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

  const formatTanggal = (iso: string) => {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d} ${months[+m - 1]} ${y}`;
  };

  const totalCount = tahunAjaranList.length;
  const aktifCount = tahunAjaranList.filter(t => t.isAktif).length;
  const nonAktifCount = totalCount - aktifCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-[#1A5276] text-white flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6" />
            </span>
            Master Tahun Ajaran
          </h3>
          <p className="text-sm text-[#566573] mt-1">
            Kelola daftar tahun ajaran pesantren. Hanya satu tahun ajaran yang boleh aktif dalam satu waktu.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow shrink-0 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Tahun Ajaran</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#2E86C1] flex items-center justify-center shrink-0">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1A5276]">{totalCount}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Tahun Ajaran</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-700">{aktifCount}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Aktif</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-600">{nonAktifCount}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Non-Aktif</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-[#1A5276] text-base">Daftar Tahun Ajaran</h4>
            <p className="text-xs text-gray-500 mt-0.5">Menampilkan {filtered.length} dari {totalCount} tahun ajaran</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari kode tahun ajaran..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                <th className="p-4">Kode Tahun Ajaran</th>
                <th className="p-4">Tanggal Mulai</th>
                <th className="p-4">Tanggal Selesai</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <CalendarDays className="w-10 h-10 mb-3 text-gray-300" />
                      <p className="font-bold text-gray-500 text-sm">Tidak ada data tahun ajaran</p>
                      <p className="text-xs mt-1">Tambahkan tahun ajaran baru untuk mulai mencatat.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className={`hover:bg-sky-50 transition-colors ${t.isAktif ? 'bg-emerald-50/40' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.isAktif ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-[#2E86C1]'}`}>
                          <CalendarDays className="w-4 h-4" />
                        </span>
                        <span className="font-extrabold text-[#1A5276] text-base">{t.kodeTahunAjaran}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{formatTanggal(t.tanggalMulai)}</td>
                    <td className="p-4 font-semibold text-gray-700">{formatTanggal(t.tanggalSelesai)}</td>
                    <td className="p-4 text-center">
                      {t.isAktif ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                          <Circle className="w-3.5 h-3.5" />
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(t.id)}
                          className="p-2 text-[#2E86C1] hover:bg-sky-100 rounded-lg transition-colors"
                          title="Edit Tahun Ajaran"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.kodeTahunAjaran)}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Hapus Tahun Ajaran"
                        >
                          <Trash2 className="w-5 h-5" />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-linear-to-r from-[#1A5276] via-[#2E86C1] to-[#1A5276] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold flex items-center gap-2">
                {editId ? <Edit2 className="w-5 h-5 text-[#1ABC9C]" /> : <Plus className="w-5 h-5 text-[#1ABC9C]" />}
                {editId ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">

              {/* Kode Tahun Ajaran */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Kode Tahun Ajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kodeTahunAjaran}
                  onChange={e => setKodeTahunAjaran(e.target.value)}
                  placeholder="contoh: 2026/2027"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition-all"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={e => setTanggalMulai(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tanggal Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={e => setTanggalSelesai(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition-all"
                  />
                </div>
              </div>

              {/* Toggle isAktif */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Jadikan Tahun Ajaran Aktif</span>
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
                <p className="text-[11px] text-amber-700 leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  Mengaktifkan tahun ajaran ini akan otomatis menonaktifkan semua tahun ajaran lainnya. Hanya satu tahun ajaran yang boleh aktif dalam satu waktu.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-sm font-bold rounded-lg shadow transition-colors"
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