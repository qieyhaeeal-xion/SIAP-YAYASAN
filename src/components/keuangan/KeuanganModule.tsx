import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Plus, CheckCircle, Search, X } from 'lucide-react';
import { TransaksiPembayaran, TagihanKeuangan } from '../../types/sisantri';
import { PemasukanDistribusi } from './PemasukanDistribusi';
import { KonfigurasiPemasukan } from './KonfigurasiPemasukan';
import { MonitoringPemasukan } from './MonitoringPemasukan';

export const KeuanganModule: React.FC = () => {
  const {
    tagihanList,
    addBayarTagihan,
    getSantriNameById
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'monitoring' | 'tagihan' | 'pemasukan' | 'konfigurasi'>('monitoring');

  // Modal Pembayaran
  const [showBayarModal, setShowBayarModal] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKeuangan | null>(null);
  const [nominalBayar, setNominalBayar] = useState(0);
  const [metodePembayaran, setMetodePembayaran] = useState<TransaksiPembayaran['metodePembayaran']>('Cash');
  const [catatanPembayaran, setCatatanPembayaran] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenBayar = (t: TagihanKeuangan) => {
    setSelectedTagihan(t);
    setNominalBayar(t.nominalTagihan - t.nominalTerbayar);
    setMetodePembayaran('Cash');
    setCatatanPembayaran('Pembayaran Syahriyah');
    setShowBayarModal(true);
  };

  const handleProcessBayar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTagihan) return;
    addBayarTagihan(selectedTagihan.id, nominalBayar, metodePembayaran, catatanPembayaran);
    setShowBayarModal(false);
  };

  const filteredTagihan = tagihanList.filter(t => {
    const sName = getSantriNameById(t.santriId).toLowerCase();
    return sName.includes(searchQuery.toLowerCase()) || (t.noTagihan || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <Wallet className="w-7 h-7 text-[#1ABC9C]" />
            Modul Keuangan & Syahriyah Pesantren
          </h2>
          <p className="text-sm text-[#566573] mt-1">Pengelolaan tagihan bulanan santri, entri pembayaran, dan cetak kuitansi resmi</p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
          <button
            onClick={() => setActiveTabSub('monitoring')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'monitoring' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monitoring Pemasukan
          </button>
          <button
            onClick={() => setActiveTabSub('tagihan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'tagihan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tagihan Santri
          </button>
          <button
            onClick={() => setActiveTabSub('pemasukan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'pemasukan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pemasukan & Distribusi
          </button>
          <button
            onClick={() => setActiveTabSub('konfigurasi')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'konfigurasi' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Konfigurasi Pemasukan
          </button>
        </div>
      </div>

      {/* 1. TAGIHAN SANTRI TAB */}
      {activeTabSub === 'tagihan' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari Tagihan / Nama Santri..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              />
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">No Tagihan</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Bulan / Periode</th>
                  <th className="p-4">Nominal Tagihan</th>
                  <th className="p-4">Terbayar</th>
                  <th className="p-4">Sisa Tunggakan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTagihan.map(t => {
                  const sisa = t.nominalTagihan - t.nominalTerbayar;
                  return (
                    <tr key={t.id} className="hover:bg-sky-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#1A5276] text-base">{t.noTagihan}</td>
                      <td className="p-4 font-extrabold text-gray-800 text-base">{getSantriNameById(t.santriId)}</td>
                      <td className="p-4 text-gray-600">{t.bulanPeriode} {t.tahunPeriode}</td>
                      <td className="p-4 font-bold text-gray-800 text-base">Rp {t.nominalTagihan.toLocaleString('id-ID')}</td>
                      <td className="p-4 font-bold text-emerald-700 text-base">Rp {t.nominalTerbayar.toLocaleString('id-ID')}</td>
                      <td className="p-4 font-bold text-rose-600 text-base">Rp {sisa.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-extrabold ${
                          t.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'Sebagian' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {t.status !== 'Lunas' ? (
                          <button
                            onClick={() => handleOpenBayar(t)}
                            className="px-4 py-2 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-bold text-xs rounded shadow transition-all"
                          >
                            Bayar Syahriyah
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-extrabold flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Lunas
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 0. MONITORING PEMASUKAN TAB */}
      {activeTabSub === 'monitoring' && <MonitoringPemasukan />}

      {/* 3. PEMASUKAN & DISTRIBUSI TAB */}
      {activeTabSub === 'pemasukan' && <PemasukanDistribusi />}

      {/* 6. KONFIGURASI PEMASUKAN TAB */}
      {activeTabSub === 'konfigurasi' && <KonfigurasiPemasukan />}

      {/* MODAL BAYAR TAGIHAN */}
      {showBayarModal && selectedTagihan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#1A5276]">Form Entri Pembayaran Syahriyah</h3>
              <button onClick={() => setShowBayarModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleProcessBayar} className="space-y-3 text-xs">
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200">
                <p className="font-extrabold text-[#1A5276]">{getSantriNameById(selectedTagihan.santriId)}</p>
                <p className="text-[11px] text-gray-600">No Tagihan: {selectedTagihan.noTagihan} ({selectedTagihan.bulanPeriode} {selectedTagihan.tahunPeriode})</p>
                <p className="text-xs font-bold text-rose-600 mt-1">Sisa Tunggakan: Rp {(selectedTagihan.nominalTagihan - selectedTagihan.nominalTerbayar).toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="block font-bold mb-1">Nominal Pembayaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={nominalBayar}
                  onChange={e => setNominalBayar(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Metode Pembayaran</label>
                <select
                  value={metodePembayaran}
                  onChange={e => setMetodePembayaran(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Cash">Cash / Tunai di Bendahara</option>
                  <option value="Transfer">Transfer Bank</option>
                  <option value="VA_Bank">Virtual Account Bank</option>
                  <option value="E_Wallet">E-Wallet (QRIS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Catatan Transaksi</label>
                <input
                  type="text"
                  value={catatanPembayaran}
                  onChange={e => setCatatanPembayaran(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowBayarModal(false)} className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg">BATAL</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A5276] text-white font-bold rounded-lg shadow">PROSES BAYAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};