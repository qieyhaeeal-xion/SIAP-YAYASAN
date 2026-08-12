import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Plus, Search, Edit2 } from 'lucide-react';

export const KepegawaianModule: React.FC = () => {
  const { pegawaiList, jabatanList, addPegawai, updatePegawai } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [nama, setNama] = useState('');
  const [jabatanId, setJabatanId] = useState(jabatanList[0]?.id || '');
  const [noHp, setNoHp] = useState('081234567890');
  const [statusKepegawaian, setStatusKepegawaian] = useState<'Tetap' | 'Kontrak' | 'Honor'>('Tetap');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('S1 Pendidikan Agama Islam');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updatePegawai(editId, { nama, jabatanId, noHp, statusKepegawaian, pendidikanTerakhir });
    } else {
      addPegawai({ nama, jabatanId, noHp, statusKepegawaian, pendidikanTerakhir });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1ABC9C]" />
            Modul Kepegawaian (Ustaz, Guru, Pengasuh, Karyawan)
          </h2>
          <p className="text-xs text-[#566573]">Master NIP, data jabatan struktural, status kepegawaian pesantren & sekolah</p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setNama('');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pegawai / Ustaz</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3">NIP Pegawai</th>
                <th className="p-3">Nama Pegawai / Ustadz</th>
                <th className="p-3">Jabatan Struktural</th>
                <th className="p-3">Status Pegawai</th>
                <th className="p-3">Pendidikan Terakhir</th>
                <th className="p-3">No HP / WA</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pegawaiList.map(pg => {
                const jb = jabatanList.find(j => j.id === pg.jabatanId);
                return (
                  <tr key={pg.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1A5276]">{pg.nip}</td>
                    <td className="p-3 font-extrabold text-gray-800">{pg.nama}</td>
                    <td className="p-3 font-bold text-[#1ABC9C]">{jb?.namaJabatan || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-[#1A5276]">
                        {pg.statusKepegawaian}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{pg.pendidikanTerakhir}</td>
                    <td className="p-3 text-gray-700">{pg.noHp}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setEditId(pg.id);
                          setNama(pg.nama);
                          setJabatanId(pg.jabatanId);
                          setNoHp(pg.noHp);
                          setStatusKepegawaian(pg.statusKepegawaian);
                          setPendidikanTerakhir(pg.pendidikanTerakhir);
                          setShowModal(true);
                        }}
                        className="p-1 text-[#2E86C1] hover:bg-sky-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
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
            <h3 className="font-extrabold text-sm text-[#1A5276]">{editId ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Lengkap *</label>
                <input type="text" required value={nama} onChange={e => setNama(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Jabatan *</label>
                <select value={jabatanId} onChange={e => setJabatanId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {jabatanList.map(j => (<option key={j.id} value={j.id}>{j.namaJabatan}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Status Kepegawaian</label>
                  <select value={statusKepegawaian} onChange={e => setStatusKepegawaian(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Honor">Honor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Pendidikan Terakhir</label>
                  <input type="text" value={pendidikanTerakhir} onChange={e => setPendidikanTerakhir(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">No HP / WA *</label>
                <input type="text" required value={noHp} onChange={e => setNoHp(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
