import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, FileCheck2, MessageSquare, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export type KepengasuhanSubTab = 'perizinan' | 'kesehatan' | 'konseling' | 'kunjungan';

interface KepengasuhanModuleProps {
  defaultSubTab?: KepengasuhanSubTab;
  showSubTabs?: boolean;
}

export const KepengasuhanModule: React.FC<KepengasuhanModuleProps> = ({ defaultSubTab = 'perizinan', showSubTabs = false }) => {
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

  const [activeTabSub, setActiveTabSub] = useState<KepengasuhanSubTab>(defaultSubTab);

  // Modal States
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showKonselingModal, setShowKonselingModal] = useState(false);
  const [showKunjunganModal, setShowKunjunganModal] = useState(false);

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

  // Kunjungan form state
  const [kunjunganSantriId, setKunjunganSantriId] = useState(activeSantri[0]?.id || '');
  const [tanggalKunjungan, setTanggalKunjungan] = useState(new Date().toISOString().split('T')[0]);
  const [namaTamu, setNamaTamu] = useState('');
  const [hubunganTamu, setHubunganTamu] = useState('');
  const [noHpTamu, setNoHpTamu] = useState('');
  const [keperluanKunjungan, setKeperluanKunjungan] = useState('');
  const [jamMasuk, setJamMasuk] = useState('08:00');
  const [jamKeluar, setJamKeluar] = useState('10:00');

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

  const handleSaveKunjungan = (e: React.FormEvent) => {
    e.preventDefault();
    addKunjungan({
      santriId: kunjunganSantriId,
      tanggal: tanggalKunjungan,
      namaTamu,
      hubungan: hubunganTamu,
      noHpTamu,
      keperluan: keperluanKunjungan,
      jamMasuk,
      jamKeluar
    });
    setShowKunjunganModal(false);
  };

  const pageTitle = {
    perizinan: 'Keamanan Santri',
    kesehatan: 'Kesehatan Santri',
    konseling: 'Kepengasuhan Santri',
    kunjungan: 'Kunjungan Santri'
  }[activeTabSub];

  const pageDescription = {
    perizinan: 'Pengelolaan perizinan santri untuk keperluan pulang dan keluar pesantren',
    kesehatan: 'Pencatatan layanan kesehatan santri dan perawatan UKS',
    konseling: 'Pencatatan bimbingan dan pendampingan pengasuhan santri',
    kunjungan: 'Pencatatan tamu dan aktivitas kunjungan santri'
  }[activeTabSub];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <HeartPulse className="w-7 h-7 text-[#1ABC9C]" />
             {showSubTabs ? 'Modul Kepengasuhan Santri' : pageTitle}
          </h2>
          <p className="text-sm text-[#566573] mt-1">{showSubTabs ? 'Pengelolaan keamanan, kesehatan, kepengasuhan, dan kunjungan santri' : pageDescription}</p>
        </div>

        {/* Sub Pills Navigation */}
        {showSubTabs && <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 p-1.5">
          <button
            onClick={() => setActiveTabSub('perizinan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'perizinan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Perizinan Pulang/Keluar
          </button>
          <button
            onClick={() => setActiveTabSub('kesehatan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'kesehatan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kesehatan (UKS)
          </button>
          <button
            onClick={() => setActiveTabSub('konseling')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'konseling' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Konseling
          </button>
          <button
            onClick={() => setActiveTabSub('kunjungan')}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-all ${
              activeTabSub === 'kunjungan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kunjungan
          </button>
        </div>}
      </div>

      {/* 1. PERIZINAN TAB */}
      {activeTabSub === 'perizinan' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Pengajuan Perizinan Pulang & Keluar</h3>
            <button
              onClick={() => setShowIzinModal(true)}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Surat Perizinan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Tanggal Izin - Kembali</th>
                  <th className="p-4">Alasan Izin</th>
                  <th className="p-4">Penjemput</th>
                  <th className="p-4">Status Approval</th>
                  <th className="p-4 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {perizinanList.map(p => (
                  <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-extrabold text-[#1A5276] text-base">{getSantriNameById(p.santriId)}</td>
                    <td className="p-4 font-semibold text-gray-700">{p.tanggalIzin} s/d {p.tanggalKembali}</td>
                    <td className="p-4 text-gray-800">{p.alasanIzin}</td>
                    <td className="p-4 text-gray-600">{p.penjemput}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-xs font-extrabold ${
                        p.statusApproval === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                        p.statusApproval === 'Ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.statusApproval}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.statusApproval === 'Menunggu Persetujuan' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updatePerizinanStatus(p.id, 'Disetujui', currentUser.nama)}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" /> Setujui
                          </button>
                          <button
                            onClick={() => updatePerizinanStatus(p.id, 'Ditolak', currentUser.nama)}
                            className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-semibold">Oleh {p.approver || 'Pengasuh'}</span>
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Catatan Santri Sakit / UKS</h3>
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Input Catatan Sakit</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">Tanggal Masuk</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Keluhan & Diagnosa</th>
                  <th className="p-4">Tindakan Medis</th>
                  <th className="p-4">Status Perawatan</th>
                  <th className="p-4 text-center">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kesehatanList.map(k => (
                  <tr key={k.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono text-gray-600">{k.tanggalMasuk}</td>
                    <td className="p-4 font-extrabold text-[#1A5276] text-base">{getSantriNameById(k.santriId)}</td>
                    <td className="p-4">
                      <p className="font-bold text-rose-700 text-base">{k.keluhan}</p>
                      <p className="text-xs text-gray-500 mt-1">{k.diagnosa}</p>
                    </td>
                    <td className="p-4 text-gray-700">{k.tindakan}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-xs font-extrabold ${
                        k.status === 'Sembuh' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {k.status !== 'Sembuh' && (
                        <button
                          onClick={() => updateKesehatanStatus(k.id, 'Sembuh')}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded shadow"
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A5276]">Log Konseling & Bimbingan Pengasuhan</h3>
            <button
              onClick={() => setShowKonselingModal(true)}
              className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Input Log Konseling</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Topik Pembimbingan</th>
                  <th className="p-4">Solusi & Arahan</th>
                  <th className="p-4">Konselor Ustaz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {konselingList.map(ks => (
                  <tr key={ks.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono text-gray-600">{ks.tanggal}</td>
                    <td className="p-4 font-extrabold text-[#1A5276] text-base">{getSantriNameById(ks.santriId)}</td>
                    <td className="p-4 font-bold text-gray-800 text-base">{ks.topik}</td>
                    <td className="p-4 text-gray-700">{ks.solusiPoin}</td>
                    <td className="p-4 font-semibold text-[#1ABC9C]">{ks.konselor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. KUNJUNGAN TAB */}
      {activeTabSub === 'kunjungan' && (
        <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-extrabold text-[#1A5276]">Daftar Kunjungan Santri</h3>
            <button
              onClick={() => setShowKunjunganModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#1A5276] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#2E86C1]"
            >
              <Plus className="h-5 w-5" />
              <span>Catat Kunjungan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#1A5276] text-sm font-bold uppercase tracking-wider text-white">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Tamu & Hubungan</th>
                  <th className="p-4">No. HP</th>
                  <th className="p-4">Keperluan</th>
                  <th className="p-4">Jam Kunjungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kunjunganList.map(k => (
                  <tr key={k.id} className="transition-colors hover:bg-sky-50">
                    <td className="p-4 font-mono text-gray-600">{k.tanggal}</td>
                    <td className="p-4 text-base font-extrabold text-[#1A5276]">{getSantriNameById(k.santriId)}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{k.namaTamu}</p>
                      <p className="mt-1 text-xs text-gray-500">{k.hubungan}</p>
                    </td>
                    <td className="p-4 text-gray-700">{k.noHpTamu}</td>
                    <td className="p-4 text-gray-700">{k.keperluan}</td>
                    <td className="p-4 font-semibold text-[#1ABC9C]">{k.jamMasuk} - {k.jamKeluar}</td>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      {/* MODAL KUNJUNGAN */}
      {showKunjunganModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-extrabold text-[#1A5276]">Catat Kunjungan Santri</h3>
            <form onSubmit={handleSaveKunjungan} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-bold">Pilih Santri *</label>
                <select value={kunjunganSantriId} onChange={e => setKunjunganSantriId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                  {activeSantri.map(s => (<option key={s.id} value={s.id}>{s.namaLengkap}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold">Tanggal Kunjungan *</label>
                  <input type="date" required value={tanggalKunjungan} onChange={e => setTanggalKunjungan(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block font-bold">Nama Tamu *</label>
                  <input type="text" required value={namaTamu} onChange={e => setNamaTamu(e.target.value)} placeholder="Nama pengunjung" className="w-full rounded-lg border px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold">Hubungan *</label>
                  <input type="text" required value={hubunganTamu} onChange={e => setHubunganTamu(e.target.value)} placeholder="Ayah, ibu, wali" className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block font-bold">No. HP *</label>
                  <input type="tel" required value={noHpTamu} onChange={e => setNoHpTamu(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full rounded-lg border px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-bold">Keperluan *</label>
                <textarea required rows={2} value={keperluanKunjungan} onChange={e => setKeperluanKunjungan(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold">Jam Masuk *</label>
                  <input type="time" required value={jamMasuk} onChange={e => setJamMasuk(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block font-bold">Jam Keluar *</label>
                  <input type="time" required value={jamKeluar} onChange={e => setJamKeluar(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-2">
                <button type="button" onClick={() => setShowKunjunganModal(false)} className="rounded-lg bg-gray-100 px-3 py-1.5 font-bold">BATAL</button>
                <button type="submit" className="rounded-lg bg-[#1A5276] px-4 py-1.5 font-bold text-white shadow">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
