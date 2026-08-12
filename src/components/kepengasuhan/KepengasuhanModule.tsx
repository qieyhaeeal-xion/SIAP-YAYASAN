import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, FileCheck2, MessageSquare, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export const KepengasuhanModule: React.FC<{ defaultSubTab?: string }> = ({ defaultSubTab = 'perizinan' }) => {
  const {
    santriList,
    kesehatanList,
    addKesehatan,
    updateKesehatanStatus,
    perizinanList,
    addPerizinan,
    updatePerizinanStatus,
    konselingList,
    addKonseling,
    kunjunganList,
    addKunjungan,
    getSantriNameById,
    currentUser
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'perizinan' | 'kesehatan' | 'konseling'>(
    defaultSubTab as any || 'perizinan'
  );

  // Modal States
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showKonselingModal, setShowKonselingModal] = useState(false);

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  // Izin Form State
  const [izinSantriId, setIzinSantriId] = useState(activeSantri[0]?.id || '');
  const [alasanIzin, setAlasanIzin] = useState('');
  const [tglMulai, setTglMulai] = useState(new Date().toISOString().split('T')[0]);
  const [tglSelesai, setTglSelesai] = useState(new Date().toISOString().split('T')[0]);
  const [penjemput, setPenjemput] = useState('');

  // Health Form State
  const [healthSantriId, setHealthSantriId] = useState(activeSantri[0]?.id || '');
  const [keluhan, setKeluhan] = useState('');
  const [diagnosa, setDiagnosa] = useState('');
  const [tindakan, setTindakan] = useState('');

  // Konseling Form State
  const [konselingSantriId, setKonselingSantriId] = useState(activeSantri[0]?.id || '');
  const [topik, setTopik] = useState('');
  const [solusi, setSolusi] = useState('');
  const [konselor, setKonselor] = useState(currentUser.nama);

  const handleSaveIzin = (e: React.FormEvent) => {
    e.preventDefault();
    addPerizinan({
      santriId: izinSantriId,
      tanggalIzin: tglMulai,
      tanggalKembali: tglSelesai,
      alasanIzin,
      penjemput,
      statusApproval: 'Menunggu Persetujuan'
    });
    setShowIzinModal(false);
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    addKesehatan({
      santriId: healthSantriId,
      tanggalMasuk: new Date().toISOString().split('T')[0],
      keluhan,
      diagnosa,
      tindakan,
      status: 'Dalam Perawatan UKS'
    });
    setShowHealthModal(false);
  };

  const handleSaveKonseling = (e: React.FormEvent) => {
    e.preventDefault();
    addKonseling({
      santriId: konselingSantriId,
      tanggal: new Date().toISOString().split('T')[0],
      topik,
      solusiPoin: solusi,
      konselor
    });
    setShowKonselingModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#1ABC9C]" />
            Modul Kepengasuhan & Ketertiban Santri
          </h2>
          <p className="text-xs text-[#566573]">Pengelolaan perizinan pulang/keluar, pelayanan UKS kesehatan, dan log konseling</p>
        </div>

        {/* Sub Pills Navigation */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTabSub('perizinan')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'perizinan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Perizinan Santri
          </button>
          <button
            onClick={() => setActiveTabSub('kesehatan')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'kesehatan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kesehatan (UKS)
          </button>
          <button
            onClick={() => setActiveTabSub('konseling')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTabSub === 'konseling' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Konseling & Kunjungan
          </button>
        </div>
      </div>

      {/* 1. PERIZINAN TAB */}
      {activeTabSub === 'perizinan' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Daftar Pengajuan Perizinan Pulang & Keluar</h3>
            <button
              onClick={() => setShowIzinModal(true)}
              className="px-3.5 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Surat Perizinan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3">Nama Santri</th>
                  <th className="p-3">Tanggal Izin - Kembali</th>
                  <th className="p-3">Alasan Izin</th>
                  <th className="p-3">Penjemput</th>
                  <th className="p-3">Status Approval</th>
                  <th className="p-3 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {perizinanList.map(p => (
                  <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-extrabold text-[#1A5276]">{getSantriNameById(p.santriId)}</td>
                    <td className="p-3 font-semibold text-gray-700">{p.tanggalIzin} s/d {p.tanggalKembali}</td>
                    <td className="p-3 text-gray-800">{p.alasanIzin}</td>
                    <td className="p-3 text-gray-600">{p.penjemput}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        p.statusApproval === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                        p.statusApproval === 'Ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.statusApproval}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {p.statusApproval === 'Menunggu Persetujuan' ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updatePerizinanStatus(p.id, 'Disetujui', currentUser.nama)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Setujui
                          </button>
                          <button
                            onClick={() => updatePerizinanStatus(p.id, 'Ditolak', currentUser.nama)}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold">Oleh {p.approver || 'Pengasuh'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. KESEHATAN UKS TAB */}
      {activeTabSub === 'kesehatan' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Catatan Santri Sakit / UKS</h3>
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-3.5 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Input Catatan Sakit</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3">Tanggal Masuk</th>
                  <th className="p-3">Nama Santri</th>
                  <th className="p-3">Keluhan & Diagnosa</th>
                  <th className="p-3">Tindakan Medis</th>
                  <th className="p-3">Status Perawatan</th>
                  <th className="p-3 text-center">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kesehatanList.map(k => (
                  <tr key={k.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-mono text-gray-600">{k.tanggalMasuk}</td>
                    <td className="p-3 font-extrabold text-[#1A5276]">{getSantriNameById(k.santriId)}</td>
                    <td className="p-3">
                      <p className="font-bold text-rose-700">{k.keluhan}</p>
                      <p className="text-[10px] text-gray-500">{k.diagnosa}</p>
                    </td>
                    <td className="p-3 text-gray-700">{k.tindakan}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        k.status === 'Sembuh' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {k.status !== 'Sembuh' && (
                        <button
                          onClick={() => updateKesehatanStatus(k.id, 'Sembuh')}
                          className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded shadow"
                        >
                          Tandai Sembuh
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. KONSELING TAB */}
      {activeTabSub === 'konseling' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Log Konseling & Bimbingan Pengasuhan</h3>
            <button
              onClick={() => setShowKonselingModal(true)}
              className="px-3.5 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Input Log Konseling</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Nama Santri</th>
                  <th className="p-3">Topik Pembimbingan</th>
                  <th className="p-3">Solusi & Arahan</th>
                  <th className="p-3">Konselor Ustaz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {konselingList.map(ks => (
                  <tr key={ks.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-mono text-gray-600">{ks.tanggal}</td>
                    <td className="p-3 font-extrabold text-[#1A5276]">{getSantriNameById(ks.santriId)}</td>
                    <td className="p-3 font-bold text-gray-800">{ks.topik}</td>
                    <td className="p-3 text-gray-700">{ks.solusiPoin}</td>
                    <td className="p-3 font-semibold text-[#1ABC9C]">{ks.konselor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PERIZINAN */}
      {showIzinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Buat Surat Perizinan Pulang/Keluar</h3>
            <form onSubmit={handleSaveIzin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Pilih Santri *</label>
                <select value={izinSantriId} onChange={e => setIzinSantriId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {activeSantri.map(s => (<option key={s.id} value={s.id}>{s.namaLengkap}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Alasan Perizinan *</label>
                <input type="text" required value={alasanIzin} onChange={e => setAlasanIzin(e.target.value)} placeholder="e.g. Acara Pernikahan Keluarga" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Tgl Mulai *</label>
                  <input type="date" required value={tglMulai} onChange={e => setTglMulai(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tgl Kembali *</label>
                  <input type="date" required value={tglSelesai} onChange={e => setTglSelesai(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Penjemput / Wali *</label>
                <input type="text" required value={penjemput} onChange={e => setPenjemput(e.target.value)} placeholder="e.g. Bpk. Slamet (Ayah)" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowIzinModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">AJUKAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HEALTH */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Catat Santri Sakit / UKS</h3>
            <form onSubmit={handleSaveHealth} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Pilih Santri *</label>
                <select value={healthSantriId} onChange={e => setHealthSantriId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {activeSantri.map(s => (<option key={s.id} value={s.id}>{s.namaLengkap}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Keluhan *</label>
                <input type="text" required value={keluhan} onChange={e => setKeluhan(e.target.value)} placeholder="e.g. Demam dan Pusing" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Diagnosa *</label>
                <input type="text" required value={diagnosa} onChange={e => setDiagnosa(e.target.value)} placeholder="e.g. Tipes Ringan" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Tindakan Medis & Obat *</label>
                <input type="text" required value={tindakan} onChange={e => setTindakan(e.target.value)} placeholder="e.g. Istirahat UKS, Paracetamol" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowHealthModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONSELING */}
      {showKonselingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1A5276]">Catat Log Bimbingan Konseling</h3>
            <form onSubmit={handleSaveKonseling} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Pilih Santri *</label>
                <select value={konselingSantriId} onChange={e => setKonselingSantriId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {activeSantri.map(s => (<option key={s.id} value={s.id}>{s.namaLengkap}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Topik Bimbingan *</label>
                <input type="text" required value={topik} onChange={e => setTopik(e.target.value)} placeholder="e.g. Motivasi Hafalan & Kedisiplinan" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Solusi & Arahan Konselor *</label>
                <textarea required rows={2} value={solusi} onChange={e => setSolusi(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowKonselingModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
