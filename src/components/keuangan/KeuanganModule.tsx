import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet, BadgeDollarSign, Receipt, CreditCard, XCircle,
  PieChart, Plus, FilePlus2, Trash2, AlertTriangle, Landmark, ShieldCheck
} from 'lucide-react';
import {
  BiayaMaster, BiayaKategori, KonteksKeuangan, KONTEKS_KEUANGAN_ORDER, DistribusiKeuanganConfig
} from '../../types/sisantri';
import { getConfigNominals, sumNominal } from '../../services/distributionService';
import { PemasukanDistribusi } from './PemasukanDistribusi';

export type KeuanganSubTab = 'ringkasan' | 'jenis' | 'pemasukan';
type PaymentCategory = NonNullable<BiayaMaster['kategoriPembayaran']>;

const PAYMENT_CATEGORIES: PaymentCategory[] = ['Rutin', 'Insidental', 'Sukarela'];
const PAYMENT_FREQUENCIES = ['Bulanan', 'Tahunan', 'Sekali Bayar', 'Periodik'];
const COST_CATEGORIES: BiayaKategori[] = ['YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN'];

const KONTEKS_LABEL: Record<KonteksKeuangan, string> = {
  YAYASAN: 'Yayasan', MADIN: 'Madin', SEKOLAH: 'Sekolah', PESANTREN: 'Pesantren', MAKAN: 'Makan'
};

const KONTEKS_STYLE: Record<KonteksKeuangan, { badge: string; bar: string; text: string }> = {
  YAYASAN: { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  MADIN: { badge: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500', text: 'text-violet-700' },
  SEKOLAH: { badge: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', text: 'text-sky-700' },
  PESANTREN: { badge: 'bg-teal-100 text-teal-800', bar: 'bg-[#1ABC9C]', text: 'text-teal-700' },
  MAKAN: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', text: 'text-amber-700' }
};

const formatRp = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: 'sky' | 'violet' | 'emerald' | 'rose' }> = ({ icon, label, value, color }) => {
  const c = { sky: 'bg-sky-50 text-sky-600 border-sky-200', violet: 'bg-violet-50 text-violet-600 border-violet-200', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200', rose: 'bg-rose-50 text-rose-600 border-rose-200' };
  return (
    <div className={`rounded-2xl border p-5 ${c[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-xl font-black text-gray-900">{value}</p>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 1. RINGKASAN
// ══════════════════════════════════════════════════════════════
const RingkasanKeuangan: React.FC<{ onNavigate: (t: KeuanganSubTab) => void }> = ({ onNavigate }) => {
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

const activeNominals = (k: KonteksKeuangan, cfg: DistribusiKeuanganConfig | undefined) => {
  return cfg ? getConfigNominals(cfg)[k] : 0;
};

// ══════════════════════════════════════════════════════════════
// 2. JENIS PEMBAYARAN
// ══════════════════════════════════════════════════════════════
const JenisPembayaran: React.FC = () => {
  const { biayaMasterList, addBiayaMaster, updateBiayaMaster, deleteBiayaMaster } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<PaymentCategory>('Rutin');
  const [frequency, setFrequency] = useState('Bulanan');
  const [nominal, setNominal] = useState(0);
  const [costCategory, setCostCategory] = useState<BiayaKategori>('PESANTREN');
  const [required, setRequired] = useState(true);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const reset = () => {
    setEditingId(null);
    setName(''); setCode(''); setCategory('Rutin'); setFrequency('Bulanan');
    setNominal(0); setCostCategory('PESANTREN'); setRequired(true); setDescription('');
  };

  const edit = (p: BiayaMaster) => {
    setEditingId(p.id);
    setName(p.namaBiaya); setCode(p.kodeBiaya || '');
    setCategory(p.kategoriPembayaran || 'Rutin'); setFrequency(p.tipeFrekuensi || 'Bulanan');
    setNominal(p.nominal || 0); setCostCategory(p.kategori || 'PESANTREN');
    setRequired(p.wajib !== false); setDescription(p.keterangan || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || nominal <= 0) {
      setFeedback({ ok: false, message: 'Nama dan nominal pembayaran wajib diisi.' });
      return;
    }
    const payload = {
      kodeBiaya: code.trim() || undefined,
      namaBiaya: name.trim(),
      jenis: category === 'Rutin' ? 'Syahriyah' as const : frequency === 'Tahunan' ? 'Tahunan' as const : 'Non-Syahriyah' as const,
      tipeFrekuensi: frequency,
      nominal,
      nominalStandard: nominal,
      kategori: costCategory,
      kategoriPembayaran: category,
      wajib: required,
      aktif: true,
      keterangan: description.trim() || undefined
    };
    if (editingId) updateBiayaMaster(editingId, payload);
    else addBiayaMaster(payload);
    setFeedback({ ok: true, message: editingId ? 'Jenis pembayaran diperbarui.' : 'Jenis pembayaran ditambahkan.' });
    reset();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-[#1A5276]">{editingId ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}</h3>
              <p className="text-xs text-gray-500 mt-1">Atur pembayaran rutin, insidental, atau donasi.</p>
            </div>
            <BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" />
          </div>
          <Field label="Nama Pembayaran *"><input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="cth. Syahriyah, Seragam, Ujian" /></Field>
          <Field label="Kode Pembayaran"><input value={code} onChange={e => setCode(e.target.value)} className="input" placeholder="cth. SYH-YAYASAN" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori"><select value={category} onChange={e => setCategory(e.target.value as PaymentCategory)} className="input">{PAYMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Frekuensi"><select value={frequency} onChange={e => setFrequency(e.target.value)} className="input">{PAYMENT_FREQUENCIES.map(f => <option key={f}>{f}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nominal (Rp) *"><input required min={1} type="number" value={nominal || ''} onChange={e => setNominal(Number(e.target.value))} className="input" /></Field>
            <Field label="Pos Keuangan"><select value={costCategory} onChange={e => setCostCategory(e.target.value as BiayaKategori)} className="input">{COST_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
          </div>
          <Field label="Keterangan"><textarea value={description} onChange={e => setDescription(e.target.value)} className="input" rows={2} /></Field>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)} /> Wajib ditagihkan</label>
          <div className="flex justify-end gap-2 pt-2 border-t">
            {editingId && <button type="button" onClick={reset} className="button-secondary">Batal</button>}
            <button type="submit" className="button-primary"><Plus className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Tambah'}</button>
          </div>
        </form>

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Jenis Pembayaran</h3>
              <p className="text-xs text-gray-500 mt-1">Tarif standar yang dapat digunakan untuk membuat tagihan.</p>
            </div>
            <BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#1A5276] text-white text-xs uppercase">
                  <th className="p-3">Pembayaran</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Frekuensi</th>
                  <th className="p-3 text-right">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {biayaMasterList.map(p => (
                  <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3">
                      <p className="font-extrabold text-[#1A5276]">{p.namaBiaya}</p>
                      <p className="text-[11px] text-gray-400">{p.kodeBiaya || '-'}</p>
                    </td>
                    <td className="p-3">{p.kategoriPembayaran || p.jenis || '-'}</td>
                    <td className="p-3 text-gray-600">{p.tipeFrekuensi || '-'}</td>
                    <td className="p-3 text-right font-black">{formatRp(p.nominal || 0)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.aktif === false ? 'bg-gray-100 text-gray-500' : p.wajib === false ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.aktif === false ? 'Nonaktif' : p.wajib === false ? 'Opsional' : 'Wajib'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button type="button" onClick={() => edit(p)} className="icon-button text-sky-600">Edit</button>
                        <button type="button" onClick={() => { if (confirm(`Hapus ${p.namaBiaya}?`)) deleteBiayaMaster(p.id); }} className="icon-button text-rose-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. MAIN MODULE
// ══════════════════════════════════════════════════════════════
interface KeuanganModuleProps {
  defaultSubTab?: KeuanganSubTab;
  showSubTabs?: boolean;
  onNavigateTab?: (tab: KeuanganSubTab) => void;
}

export const KeuanganModule: React.FC<KeuanganModuleProps> = ({ defaultSubTab = 'ringkasan', showSubTabs = false, onNavigateTab }) => {
  const [activeTabSub, setActiveTabSub] = useState<KeuanganSubTab>(defaultSubTab);
  const navigateSubTab = (tab: KeuanganSubTab) => {
    if (onNavigateTab) onNavigateTab(tab);
    else setActiveTabSub(tab);
  };

  const pageTitle: Record<KeuanganSubTab, string> = {
    ringkasan: 'Ringkasan Keuangan',
    jenis: 'Jenis Pembayaran',
    pemasukan: 'Pemasukan & Distribusi'
  };

  const pageDescription: Record<KeuanganSubTab, string> = {
    ringkasan: 'Pantau ringkasan pemasukan dan distribusi pos keuangan pesantren.',
    jenis: 'Kelola jenis, kategori, frekuensi, dan nominal pembayaran.',
    pemasukan: 'Kelola pencatatan pemasukan dan distribusi ke pos keuangan.'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <Wallet className="w-7 h-7 text-[#1ABC9C]" />
             {showSubTabs ? 'Modul Keuangan & Syahriyah Pesantren' : pageTitle[activeTabSub]}
          </h2>
           <p className="text-sm text-[#566573] mt-1">{showSubTabs ? 'Pengelolaan jenis pembayaran, distribusi pemasukan, dan monitoring pos keuangan.' : pageDescription[activeTabSub]}</p>
         </div>
         {showSubTabs && <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 p-1.5">
           <button type="button" onClick={() => navigateSubTab('ringkasan')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'ringkasan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Ringkasan
           </button>
           <button type="button" onClick={() => navigateSubTab('jenis')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'jenis' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Jenis Pembayaran
           </button>
           <button type="button" onClick={() => navigateSubTab('pemasukan')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'pemasukan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Pemasukan & Distribusi
           </button>
         </div>}
       </div>

      {activeTabSub === 'ringkasan' && <RingkasanKeuangan onNavigate={setActiveTabSub} />}
      {activeTabSub === 'jenis' && <JenisPembayaran />}
      {activeTabSub === 'pemasukan' && <PemasukanDistribusi />}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-xs font-bold text-gray-600">{label}<span className="block mt-1">{children}</span></label>
);
