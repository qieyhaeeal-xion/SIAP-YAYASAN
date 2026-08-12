import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Plus, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

export const PPDBModule: React.FC = () => {
  const { 
    ppdbList, addPPDB, updatePPDBStatus, mutasiPPDBKeSantri,
    unitsPesantren, unitSekolahList, marhalahList
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [sekolahAsal, setSekolahAsal] = useState('SMP Negeri 1 Banyuwangi');
  const [noHpOrtu, setNoHpOrtu] = useState('081234567890');
  // PPDB extended fields
  const [unitPesantrenPilihanId, setUnitPesantrenPilihanId] = useState('');
  const [unitSekolahPilihanId, setUnitSekolahPilihanId] = useState('');
  const [marhalahPilihanId, setMarhalahPilihanId] = useState('');

  const [mutasiSuccessMsg, setMutasiSuccessMsg] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    addPPDB({
      namaLengkap,
      sekolahAsal,
      noHpOrtu,
      unitPesantrenPilihanId,
      unitSekolahPilihanId,
      marhalahPilihanId
    });
    setShowModal(false);
    setNamaLengkap('');
    setUnitPesantrenPilihanId('');
    setUnitSekolahPilihanId('');
    setMarhalahPilihanId('');
  };

  const handleMutasi = (id: string, nama: string) => {
    const santriBaru = mutasiPPDBKeSantri(id);
    if (santriBaru) {
      setMutasiSuccessMsg(`Santri Baru ${nama} berhasil dimutasi ke Data Santri Aktif! NIS generated: ${santriBaru.nis}`);
      setTimeout(() => setMutasiSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#1ABC9C]" />
            Modul PPDB & Mutasi Otomatis NIS
          </h2>
          <p className="text-xs text-[#566573]">Penerimaan Santri Baru, Verifikasi Kelulusan, dan Penjanaan NIS Otomatis</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Pendaftar Baru</span>
        </button>
      </div>

      {mutasiSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{mutasiSuccessMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3">No Pendaftaran</th>
                <th className="p-3">Nama Calon Santri</th>
                <th className="p-3">Sekolah Asal</th>
                <th className="p-3">Kontak Ortu</th>
                <th className="p-3">Status Seleksi</th>
                <th className="p-3 text-center">Aksi Mutasi NIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ppdbList.map(p => (
                <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1A5276]">{p.noPendaftaran}</td>
                  <td className="p-3 font-extrabold text-gray-800">{p.namaLengkap}</td>
                  <td className="p-3 text-gray-600">{p.sekolahAsal}</td>
                  <td className="p-3 text-gray-700">{p.noHpOrtu}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      p.statusSeleksi === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' :
                      p.statusSeleksi === 'Dimutasi ke Santri' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.statusSeleksi}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {p.statusSeleksi === 'Pending' ? (
                      <button
                        onClick={() => updatePPDBStatus(p.id, 'Lulus Seleksi')}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded shadow"
                      >
                        Luluskan
                      </button>
                    ) : p.statusSeleksi === 'Lulus Seleksi' ? (
                      <button
                        onClick={() => handleMutasi(p.id, p.namaLengkap)}
                        className="px-3 py-1 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-[10px] rounded shadow flex items-center gap-1 mx-auto"
                      >
                        <ArrowRight className="w-3 h-3 text-[#1ABC9C]" />
                        <span>Mutasi NIS Aktif</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-700 flex items-center justify-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Terdata Active Santri
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Pendaftaran Calon Santri Baru (PPDB)</h3>
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Lengkap Santri *</label>
                <input type="text" required value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Sekolah Asal *</label>
                <input type="text" required value={sekolahAsal} onChange={e => setSekolahAsal(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">No HP WhatsApp Wali *</label>
                <input type="text" required value={noHpOrtu} onChange={e => setNoHpOrtu(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>

              {/* Step 1: Pilih Unit Pesantren */}
              <div>
                <label className="block font-bold mb-1">Unit Pesantren Pilihan *</label>
                <select
                  required
                  value={unitPesantrenPilihanId}
                  onChange={e => {
                    setUnitPesantrenPilihanId(e.target.value);
                    // Reset dependent fields when unit pesantren changes
                    setUnitSekolahPilihanId('');
                    setMarhalahPilihanId('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  <option value="">-- Pilih Unit Pesantren --</option>
                  {unitsPesantren.map(u => (
                    <option key={u.id} value={u.id}>{u.namaUnit}</option>
                  ))}
                </select>
              </div>

              {/*
                NOTE: UnitSekolah dan MarhalahMadin tidak memiliki relasi eksplisit
                ke UnitPesantren di data master (interface UnitSekolah dan MarhalahMadin
                tidak menyimpan unitPesantrenId). Oleh karena itu, filtering dropdown
                berdasarkan Unit Pesantren tidak diterapkan — semua opsi ditampilkan.
                Jika di masa mendatang relasi ini ditambahkan ke data master,
                cukup tambahkan .filter(item => item.unitPesantrenId === unitPesantrenPilihanId)
                di bawah ini.
              */}

              {/* Step 2: Pilih Unit Sekolah — disabled sampai Unit Pesantren dipilih */}
              <div>
                <label className={`block font-bold mb-1 ${!unitPesantrenPilihanId ? 'text-gray-400' : ''}`}>
                  Unit Sekolah Pilihan
                  {!unitPesantrenPilihanId && <span className="ml-1 text-[10px] font-normal text-gray-400">(pilih Unit Pesantren dulu)</span>}
                </label>
                <select
                  value={unitSekolahPilihanId}
                  onChange={e => setUnitSekolahPilihanId(e.target.value)}
                  disabled={!unitPesantrenPilihanId}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] ${
                    !unitPesantrenPilihanId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">-- Pilih Unit Sekolah --</option>
                  {unitSekolahList.map(u => (
                    <option key={u.id} value={u.id}>{u.namaSekolah} ({u.kodeSekolah})</option>
                  ))}
                </select>
              </div>

              {/* Step 3: Pilih Marhalah Madin — disabled sampai Unit Pesantren dipilih */}
              <div>
                <label className={`block font-bold mb-1 ${!unitPesantrenPilihanId ? 'text-gray-400' : ''}`}>
                  Marhalah Madin Pilihan
                  {!unitPesantrenPilihanId && <span className="ml-1 text-[10px] font-normal text-gray-400">(pilih Unit Pesantren dulu)</span>}
                </label>
                <select
                  value={marhalahPilihanId}
                  onChange={e => setMarhalahPilihanId(e.target.value)}
                  disabled={!unitPesantrenPilihanId}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#1ABC9C] ${
                    !unitPesantrenPilihanId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">-- Pilih Marhalah --</option>
                  {marhalahList.map(m => (
                    <option key={m.id} value={m.id}>{m.namaMarhalah} ({m.kodeMarhalah})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">DAFTARKAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
