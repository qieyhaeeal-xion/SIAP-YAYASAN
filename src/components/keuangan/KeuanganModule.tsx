import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Plus, Printer, CheckCircle, Search, X, FileText, ArrowUpRight } from 'lucide-react';
import { TransaksiPembayaran, TagihanKeuangan } from '../../types/sisantri';

export const KeuanganModule: React.FC = () => {
  const {
    tagihanList,
    biayaMasterList,
    transaksiList,
    addBayarTagihan,
    getSantriNameById,
    santriList,
    currentUser
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'tagihan' | 'transaksi' | 'master'>('tagihan');

  // Modal Pembayaran
  const [showBayarModal, setShowBayarModal] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKeuangan | null>(null);
  const [nominalBayar, setNominalBayar] = useState(0);
  const [metodePembayaran, setMetodePembayaran] = useState<TransaksiPembayaran['metodePembayaran']>('Cash');
  const [catatanPembayaran, setCatatanPembayaran] = useState('');

  // Modal Cetak Kuitansi
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<TransaksiPembayaran | null>(null);

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

  const handleOpenReceipt = (tr: TransaksiPembayaran) => {
    setReceiptData(tr);
    setShowReceiptModal(true);
  };

  const filteredTagihan = tagihanList.filter(t => {
    const sName = getSantriNameById(t.santriId).toLowerCase();
    return sName.includes(searchQuery.toLowerCase()) || t.noTagihan.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
          <button
            onClick={() => setActiveTabSub('tagihan')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'tagihan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tagihan Santri
          </button>
          <button
            onClick={() => setActiveTabSub('transaksi')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'transaksi' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            onClick={() => setActiveTabSub('master')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTabSub === 'master' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pos Biaya Master
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

      {/* 2. RIWAYAT TRANSAKSI TAB */}
      {activeTabSub === 'transaksi' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-extrabold text-lg text-[#1A5276]">Jurnal Transaksi Pembayaran Syahriyah</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">No Kuitansi</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Nominal Terbayar</th>
                  <th className="p-4">Metode</th>
                  <th className="p-4 text-center">Cetak Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transaksiList.map(tr => (
                  <tr key={tr.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1A5276] text-base">{tr.noKuitansi}</td>
                    <td className="p-4 font-mono text-gray-600">{tr.tanggalBayar}</td>
                    <td className="p-4 font-extrabold text-gray-800 text-base">{getSantriNameById(tr.santriId)}</td>
                    <td className="p-4 font-extrabold text-emerald-700 text-base">Rp {tr.nominalDibayar.toLocaleString('id-ID')}</td>
                    <td className="p-4 font-semibold text-gray-700">{tr.metodePembayaran}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenReceipt(tr)}
                        className="px-3.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-[#1A5276] rounded text-xs font-bold flex items-center gap-1.5 mx-auto"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Kuitansi Resmi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. POS BIAYA MASTER TAB */}
      {activeTabSub === 'master' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-extrabold text-lg text-[#1A5276]">Master Pos Biaya Syahriyah & Administrasi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">Kode Biaya</th>
                  <th className="p-4">Nama Pos Biaya</th>
                  <th className="p-4">Nominal Standar</th>
                  <th className="p-4">Tipe Frekuensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {biayaMasterList.map(b => (
                  <tr key={b.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1A5276] text-base">{b.kodeBiaya}</td>
                    <td className="p-4 font-extrabold text-gray-800 text-base">{b.namaBiaya}</td>
                    <td className="p-4 font-bold text-emerald-700 text-base">Rp {b.nominalStandard.toLocaleString('id-ID')}</td>
                    <td className="p-4 font-semibold text-gray-600">{b.tipeFrekuensi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* MODAL CETAK KUITANSI RESMI */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border-2 border-[#1A5276]">
            <div className="text-center border-b pb-3 border-gray-200">
              <p className="text-xs font-black text-[#1A5276] uppercase tracking-wider">PONDOK PESANTREN MUKHTAR SYAFAAT</p>
              <p className="text-[10px] text-gray-500">Blokagung, Karangdoro, Tegalsari, Banyuwangi, Jawa Timur</p>
              <div className="mt-2 text-sm font-extrabold text-[#1ABC9C] border-y border-dashed border-gray-300 py-1">
                KUITANSI PEMBAYARAN SYAHRIYAH RESMI
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-gray-500">No. Kuitansi:</span>
                <span className="font-bold text-[#1A5276]">{receiptData.noKuitansi}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-gray-500">Tanggal:</span>
                <span>{receiptData.tanggalBayar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama Santri:</span>
                <span className="font-bold">{getSantriNameById(receiptData.santriId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode:</span>
                <span className="font-semibold">{receiptData.metodePembayaran}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center mt-3">
                <span className="font-bold text-emerald-900">JUMLAH DIBAYAR:</span>
                <span className="text-base font-black text-emerald-700">Rp {receiptData.nominalDibayar.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-[10px] text-gray-400">
                <p>Kasir: {receiptData.penerimaBendahara}</p>
                <p>Status: Sah & Terverifikasi</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Media Yayasan Mukhtar Syafa'at</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-3 py-1.5 bg-gray-100 font-bold text-xs rounded-lg"
                >
                  TUTUP
                </button>
                <button
                  onClick={() => { window.print(); setShowReceiptModal(false); }}
                  className="px-4 py-1.5 bg-[#1A5276] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> PRINT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
