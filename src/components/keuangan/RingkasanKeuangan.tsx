import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeDollarSign, Receipt, CreditCard, XCircle, PieChart, Plus, FilePlus2, Landmark, Wallet } from 'lucide-react';
import { KonteksKeuangan, KONTEKS_KEUANGAN_ORDER, DistribusiKeuanganConfig } from '../../types/sisantri';
import { getConfigNominals } from '../../services/distributionService';
import { SummaryCard, KONTEKS_LABEL, KONTEKS_STYLE, formatRp, type KeuanganSubTab } from './shared';

const activeNominals = (k: KonteksKeuangan, cfg: DistribusiKeuanganConfig | undefined) => {
  return cfg ? getConfigNominals(cfg)[k] : 0;
};

export const RingkasanKeuangan: React.FC<{ onNavigate: (t: KeuanganSubTab) => void }> = ({ onNavigate }) => {
  const { biayaMasterList, pemasukanList, alokasiList, getAktifDistribusiConfig } = useApp();

  const activePaymentTypes = biayaMasterList.filter(b => b.aktif !== false);
  const totalPemasukan = pemasukanList.reduce((a, p) => a + p.nominal, 0);
  const distributedCount = pemasukanList.filter(p => p.status === 'DISTRIBUTED').length;
  const failedCount = pemasukanList.filter(p => p.status === 'FAILED').length;

  const konteksTotals = useMemo(() => {
    const totals: Record<KonteksKeuangan, number> = { YAYASAN: 0, MADIN: 0, SEKOLAH: 0, PESANTREN: 0, MAKAN: 0 };
    for (const a of alokasiList) totals[a.konteks] += a.nominal;
    return totals;
  }, [alokasiList]);

  const aktifConfig = getAktifDistribusiConfig();
  const maxKonteks = Math.max(1, ...KONTEKS_KEUANGAN_ORDER.map(k => konteksTotals[k]));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard icon={<BadgeDollarSign className="w-6 h-6" />} label="Jenis Pembayaran Aktif" value={activePaymentTypes.length.toString()} color="sky" />
        <SummaryCard icon={<Receipt className="w-6 h-6" />} label="Total Pemasukan" value={formatRp(totalPemasukan)} color="emerald" />
        <SummaryCard icon={<CreditCard className="w-6 h-6" />} label="Transaksi Tercatat" value={pemasukanList.length.toString()} color="violet" />
        <SummaryCard icon={<XCircle className="w-6 h-6" />} label="Distribusi Gagal" value={failedCount.toString()} color="rose" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#1ABC9C]" />
            <h3 className="font-extrabold text-base text-[#1A5276]">Distribusi per Pos Keuangan</h3>
          </div>
          {aktifConfig && (
            <span className="px-2 py-0.5 rounded bg-[#1A5276]/10 text-[#1A5276] font-black text-[11px]">
              {aktifConfig.name} · {aktifConfig.version}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {KONTEKS_KEUANGAN_ORDER.map(k => {
            const cfg = activeNominals(k, aktifConfig);
            return (
              <div key={k} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[k].badge}`}>{KONTEKS_LABEL[k]}</span>
                <p className={`mt-2 text-base font-black ${KONTEKS_STYLE[k].text}`}>{formatRp(konteksTotals[k])}</p>
                <p className="text-[11px] text-gray-400 font-bold">konfigurasi {formatRp(cfg)}</p>
                <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${KONTEKS_STYLE[k].bar}`} style={{ width: `${Math.max(4, (konteksTotals[k] / maxKonteks) * 100)}%` }} />
                </div>
              </div>
            );
          })}
          <div className="p-3 rounded-xl bg-[#1A5276] text-white border border-[#1A5276]">
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20">TOTAL</span>
            <p className="mt-2 text-base font-black">{formatRp(totalPemasukan)}</p>
            <p className="text-[11px] text-white/60 font-bold">{distributedCount} terdistribusi · {failedCount} gagal</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1A5276] text-white rounded-2xl shadow-sm p-6">
        <Landmark className="w-7 h-7 text-[#1ABC9C] mb-3" />
        <h3 className="font-extrabold text-lg">Aksi Cepat</h3>
        <div className="mt-4 space-y-2">
          <button type="button" onClick={() => onNavigate('jenis')} className="w-full text-left px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors flex items-center gap-2">
            <FilePlus2 className="w-4 h-4 text-[#1ABC9C]" /> Kelola Jenis Pembayaran
          </button>
          <button type="button" onClick={() => onNavigate('pemasukan')} className="w-full text-left px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#1ABC9C]" /> Catat Pemasukan Baru
          </button>
        </div>
      </div>
    </div>
  );
};
