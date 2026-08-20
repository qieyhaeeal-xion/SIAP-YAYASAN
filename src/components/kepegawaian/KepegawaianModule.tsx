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
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-[#1ABC9C]" />
            Modul Kepegawaian (Ustaz, Guru, Pengasuh, Karyawan)
          </h2>
          <p className="text-sm text-[#566573] mt-1">Master NIP, data jabatan struktural, status kepegawaian pesantren & sekolah</p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setNama('');
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pegawai / Ustaz</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                <th className="p-4">NIP Pegawai</th>
                <th className="p-4">Nama Pegawai / Ustadz</th>
                <th className="p-4">Jabatan Struktural</th>
                <th className="p-4">Status Pegawai</th>
                <th className="p-4">Pendidikan Terakhir</th>
                <th className="p-4">No HP / WA</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pegawaiList.map(pg => {
                const jb = jabatanList.find(j => j.id === pg.jabatanId);
                return (
                  <tr key={pg.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1A5276] text-base">{pg.nip}</td>
                    <td className="p-4 font-extrabold text-gray-800 text-base">{pg.nama}</td>
                    <td className="p-4 font-bold text-[#1ABC9C] text-base">{jb?.namaJabatan || '-'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded text-xs font-bold bg-sky-100 text-[#1A5276]">
                        {pg.statusKepegawaian}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-base">{pg.pendidikanTerakhir}</td>
                    <td className="p-4 text-gray-700 text-base">{pg.noHp}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditId(pg.id);
                          setNama(pg.nama);
                          setJabatanId(pg.jabatanId);
                          setNoHp(pg.noHp);
                          setStatusKepegawaian((pg.statusKepegawaian || 'Tetap') as any);
                          setPendidikanTerakhir(pg.pendidikanTerakhir || '');
                          setShowModal(true);
                        }}
                        className="p-1.5 text-[#2E86C1] hover:bg-sky-100 rounded"
                      >
                        <Edit2 className="w-5 h-5" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
