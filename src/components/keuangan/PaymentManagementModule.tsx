import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BadgeDollarSign,
  BarChart3,
  CheckCircle,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FilePlus2,
  Filter,
  Landmark,
  Plus,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCheck,
  XCircle
} from 'lucide-react';
import {
  BiayaMaster,
  BiayaKategori,
  TarifPembayaran,
  TarifTargetScope,
  TagihanKeuangan,
  TransaksiPembayaran
} from '../../types/sisantri';

type PaymentTab = 'overview' | 'types' | 'tariffs' | 'billing' | 'verification' | 'reports';
type PaymentCategory = NonNullable<BiayaMaster['kategoriPembayaran']>;

const PAYMENT_CATEGORIES: PaymentCategory[] = ['Rutin', 'Insidental', 'Sukarela'];
const PAYMENT_FREQUENCIES = ['Bulanan', 'Tahunan', 'Sekali Bayar', 'Periodik'];
const COST_CATEGORIES: BiayaKategori[] = ['YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN'];
const TARGET_SCOPES: TarifTargetScope[] = ['Semua Santri', 'Unit Sekolah', 'Unit Pesantren', 'Kelas Sekolah', 'Kelas Madin', 'Santri Asuh'];

const formatRp = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const isVerified = (transaction: TransaksiPembayaran) =>
  transaction.statusVerifikasi === undefined || transaction.statusVerifikasi === 'Terverifikasi' || transaction.statusVerifikasi === 'Otomatis';

const tabLabels: Record<PaymentTab, string> = {
  overview: 'Ringkasan',
  types: 'Jenis Pembayaran',
  tariffs: 'Tarif & Sasaran',
  billing: 'Manajemen Tagihan',
  verification: 'Verifikasi Transaksi',
  reports: 'Laporan Keuangan'
};

const statusClass: Record<TagihanKeuangan['status'], string> = {
  Lunas: 'bg-emerald-100 text-emerald-800',
  Sebagian: 'bg-amber-100 text-amber-800',
  'Belum Lunas': 'bg-rose-100 text-rose-800'
};

export const PaymentManagementModule: React.FC = () => {
  const {
    biayaMasterList,
    addBiayaMaster,
    updateBiayaMaster,
    deleteBiayaMaster,
    tarifPembayaranList,
    addTarifPembayaran,
    updateTarifPembayaran,
    deleteTarifPembayaran,
    santriList,
    unitsPesantren,
    unitSekolahList,
    kelasSekolahList,
    kelasMadinList,
    tagihanList,
    generateTagihan,
    transaksiList,
    addBayarTagihan,
    verifikasiTransaksi,
    getSantriNameById,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<PaymentTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentName, setPaymentName] = useState('');
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>('Rutin');
  const [paymentFrequency, setPaymentFrequency] = useState('Bulanan');
  const [paymentNominal, setPaymentNominal] = useState(0);
  const [paymentCostCategory, setPaymentCostCategory] = useState<BiayaKategori>('PESANTREN');
  const [paymentRequired, setPaymentRequired] = useState(true);
  const [paymentDescription, setPaymentDescription] = useState('');

  const [editingTarifId, setEditingTarifId] = useState<string | null>(null);
  const [tarifPaymentId, setTarifPaymentId] = useState(biayaMasterList[0]?.id || '');
  const [tarifScope, setTarifScope] = useState<TarifTargetScope>('Semua Santri');
  const [tarifTargetValue, setTarifTargetValue] = useState('');
  const [tarifNominal, setTarifNominal] = useState(0);
  const [tarifRequired, setTarifRequired] = useState(true);

  const [billingSantriId, setBillingSantriId] = useState(santriList[0]?.id || '');
  const [billingPaymentId, setBillingPaymentId] = useState(biayaMasterList[0]?.id || '');
  const [billingPeriod, setBillingPeriod] = useState(() => {
    const now = new Date();
    return `${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  });
  const [billingDueDate, setBillingDueDate] = useState('');
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKeuangan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<TransaksiPembayaran['metodePembayaran']>('Cash');
  const [proofUrl, setProofUrl] = useState('');

  const activePaymentTypes = biayaMasterList.filter(b => b.aktif !== false);
  const activeSantri = santriList.filter(s => s.status === 'Aktif');
  const pendingTransactions = transaksiList.filter(t => t.statusVerifikasi === 'Menunggu Verifikasi');

  const filteredTagihan = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tagihanList;
    return tagihanList.filter(t => {
      const biaya = biayaMasterList.find(b => b.id === t.biayaMasterId);
      return getSantriNameById(t.santriId).toLowerCase().includes(query) ||
        (t.noTagihan || '').toLowerCase().includes(query) ||
        biaya?.namaBiaya.toLowerCase().includes(query);
    });
  }, [searchQuery, tagihanList, biayaMasterList, getSantriNameById]);

  const reportTransactions = useMemo(
    () => transaksiList.filter(isVerified),
    [transaksiList]
  );

  const reportTotal = reportTransactions.reduce((sum, transaction) => sum + (transaction.nominal || 0), 0);
  const totalOutstanding = tagihanList.reduce((sum, tagihan) => sum + Math.max(0, tagihan.nominalTagihan - tagihan.nominalTerbayar), 0);

  const targetOptions = useMemo(() => {
    switch (tarifScope) {
      case 'Unit Sekolah': return unitSekolahList.map(item => ({ value: item.id, label: item.namaSekolah }));
      case 'Unit Pesantren': return unitsPesantren.map(item => ({ value: item.id, label: item.namaUnit }));
      case 'Kelas Sekolah': return kelasSekolahList.map(item => ({ value: item.id, label: item.namaKelas }));
      case 'Kelas Madin': return kelasMadinList.map(item => ({ value: item.id, label: item.namaKelas }));
      case 'Santri Asuh': return ['ASUH 1', 'ASUH 2', 'ASUH 3'].map(value => ({ value, label: value }));
      default: return [];
    }
  }, [tarifScope, unitSekolahList, unitsPesantren, kelasSekolahList, kelasMadinList]);

  const resetPaymentForm = () => {
    setEditingPaymentId(null);
    setPaymentName('');
    setPaymentCode('');
    setPaymentCategory('Rutin');
    setPaymentFrequency('Bulanan');
    setPaymentNominal(0);
    setPaymentCostCategory('PESANTREN');
    setPaymentRequired(true);
    setPaymentDescription('');
  };

  const handleSavePaymentType = (event: React.FormEvent) => {
    event.preventDefault();
    if (!paymentName.trim() || paymentNominal <= 0) {
      setFeedback({ ok: false, message: 'Nama dan nominal pembayaran wajib diisi.' });
      return;
    }
    const payload = {
      kodeBiaya: paymentCode.trim() || undefined,
      namaBiaya: paymentName.trim(),
      jenis: paymentCategory === 'Rutin' ? 'Syahriyah' as const : paymentFrequency === 'Tahunan' ? 'Tahunan' as const : 'Non-Syahriyah' as const,
      tipeFrekuensi: paymentFrequency,
      nominal: paymentNominal,
      nominalStandard: paymentNominal,
      kategori: paymentCostCategory,
      kategoriPembayaran: paymentCategory,
      wajib: paymentRequired,
      aktif: true,
      keterangan: paymentDescription.trim() || undefined
    };
    if (editingPaymentId) updateBiayaMaster(editingPaymentId, payload);
    else addBiayaMaster(payload);
    setFeedback({ ok: true, message: editingPaymentId ? 'Jenis pembayaran diperbarui.' : 'Jenis pembayaran ditambahkan.' });
    resetPaymentForm();
  };

  const editPaymentType = (payment: BiayaMaster) => {
    setEditingPaymentId(payment.id);
    setPaymentName(payment.namaBiaya);
    setPaymentCode(payment.kodeBiaya || '');
    setPaymentCategory(payment.kategoriPembayaran || 'Rutin');
    setPaymentFrequency(payment.tipeFrekuensi || 'Bulanan');
    setPaymentNominal(payment.nominal || 0);
    setPaymentCostCategory(payment.kategori || 'PESANTREN');
    setPaymentRequired(payment.wajib !== false);
    setPaymentDescription(payment.keterangan || '');
    setActiveTab('types');
  };

  const handleSaveTarif = (event: React.FormEvent) => {
    event.preventDefault();
    if (!tarifPaymentId || tarifNominal <= 0 || (tarifScope !== 'Semua Santri' && !tarifTargetValue)) {
      setFeedback({ ok: false, message: 'Jenis pembayaran, sasaran, dan nominal tarif wajib diisi.' });
      return;
    }
    const payload = {
      biayaMasterId: tarifPaymentId,
      targetScope: tarifScope,
      targetValue: tarifScope === 'Semua Santri' ? undefined : tarifTargetValue,
      nominal: tarifNominal,
      wajib: tarifRequired,
      aktif: true,
      effectiveFrom: new Date().toISOString().slice(0, 10)
    };
    if (editingTarifId) updateTarifPembayaran(editingTarifId, payload);
    else addTarifPembayaran(payload);
    setFeedback({ ok: true, message: editingTarifId ? 'Tarif diperbarui.' : 'Tarif sasaran ditambahkan.' });
    setEditingTarifId(null);
    setTarifTargetValue('');
    setTarifNominal(0);
  };

  const editTarif = (tarif: TarifPembayaran) => {
    setEditingTarifId(tarif.id);
    setTarifPaymentId(tarif.biayaMasterId);
    setTarifScope(tarif.targetScope);
    setTarifTargetValue(tarif.targetValue || '');
    setTarifNominal(tarif.nominal);
    setTarifRequired(tarif.wajib);
    setActiveTab('tariffs');
  };

  const handleGenerateBilling = (event: React.FormEvent) => {
    event.preventDefault();
    const result = generateTagihan({
      santriId: billingSantriId,
      biayaMasterId: billingPaymentId,
      periode: billingPeriod,
      tanggalJatuhTempo: billingDueDate || undefined
    });
    setFeedback(result
      ? { ok: true, message: `Tagihan ${result.noTagihan} berhasil dibuat.` }
      : { ok: false, message: 'Tagihan gagal dibuat. Periksa data atau tagihan duplikat.' });
  };

  const handleOpenPayment = (tagihan: TagihanKeuangan) => {
    setSelectedTagihan(tagihan);
    setPaymentAmount(tagihan.nominalTagihan - tagihan.nominalTerbayar);
    setPaymentMethod('Cash');
    setProofUrl('');
  };

  const handlePayment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTagihan) return;
    const result = addBayarTagihan(selectedTagihan.id, paymentAmount, paymentMethod, 'Pembayaran dari Manajemen Pembayaran', proofUrl || undefined);
    setFeedback(result
      ? { ok: true, message: result.statusVerifikasi === 'Menunggu Verifikasi' ? 'Pembayaran dicatat dan menunggu verifikasi.' : 'Pembayaran berhasil diverifikasi otomatis.' }
      : { ok: false, message: 'Pembayaran gagal. Nominal melebihi sisa tagihan atau data tidak ditemukan.' });
    if (result) setSelectedTagihan(null);
  };

  const handleVerify = (transaction: TransaksiPembayaran, status: 'Terverifikasi' | 'Ditolak') => {
    const result = verifikasiTransaksi(transaction.id, status, currentUser.nama);
    setFeedback(result
      ? { ok: true, message: status === 'Terverifikasi' ? 'Pembayaran diverifikasi dan tagihan diperbarui.' : 'Pembayaran ditolak.' }
      : { ok: false, message: 'Transaksi tidak dapat diproses. Periksa sisa tagihan atau status transaksi.' });
  };

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard icon={<BadgeDollarSign className="w-6 h-6" />} label="Jenis Pembayaran Aktif" value={activePaymentTypes.length.toString()} color="sky" />
        <SummaryCard icon={<Receipt className="w-6 h-6" />} label="Total Tagihan" value={formatRp(tagihanList.reduce((sum, item) => sum + item.nominalTagihan, 0))} color="violet" />
        <SummaryCard icon={<CreditCard className="w-6 h-6" />} label="Total Pemasukan Terverifikasi" value={formatRp(reportTotal)} color="emerald" />
        <SummaryCard icon={<XCircle className="w-6 h-6" />} label="Total Tunggakan" value={formatRp(totalOutstanding)} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-extrabold text-lg text-[#1A5276]">Alur Pembayaran</h3>
              <p className="text-xs text-gray-500 mt-1">Pantau proses invoice dari pembuatan sampai verifikasi.</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-[#1ABC9C]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <FlowCard label="Invoice Aktif" value={tagihanList.filter(t => t.status !== 'Lunas').length} onClick={() => setActiveTab('billing')} />
            <FlowCard label="Lunas" value={tagihanList.filter(t => t.status === 'Lunas').length} onClick={() => setActiveTab('billing')} />
            <FlowCard label="Menunggu Verifikasi" value={pendingTransactions.length} onClick={() => setActiveTab('verification')} />
            <FlowCard label="Transaksi Masuk" value={reportTransactions.length} onClick={() => setActiveTab('reports')} />
          </div>
        </div>
        <div className="bg-[#1A5276] text-white rounded-2xl shadow-sm p-6">
          <Landmark className="w-8 h-8 text-[#1ABC9C] mb-4" />
          <h3 className="font-extrabold text-lg">Aksi Cepat</h3>
          <div className="mt-4 space-y-2">
            <QuickAction label="Tambah Jenis Pembayaran" onClick={() => { resetPaymentForm(); setActiveTab('types'); }} />
            <QuickAction label="Buat Tagihan Manual" onClick={() => setActiveTab('billing')} />
            <QuickAction label="Verifikasi Transfer" onClick={() => setActiveTab('verification')} />
            <QuickAction label="Lihat Laporan" onClick={() => setActiveTab('reports')} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTypes = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <form onSubmit={handleSavePaymentType} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-[#1A5276]">{editingPaymentId ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}</h3>
            <p className="text-xs text-gray-500 mt-1">Atur pembayaran rutin, insidental, atau donasi.</p>
          </div>
          <FilePlus2 className="w-6 h-6 text-[#1ABC9C]" />
        </div>
        <Field label="Nama Pembayaran *"><input required value={paymentName} onChange={e => setPaymentName(e.target.value)} className="input" placeholder="SPP Sekolah" /></Field>
        <Field label="Kode Pembayaran"><input value={paymentCode} onChange={e => setPaymentCode(e.target.value)} className="input" placeholder="SPP-SEKOLAH" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori"><select value={paymentCategory} onChange={e => setPaymentCategory(e.target.value as PaymentCategory)} className="input">{PAYMENT_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Frekuensi"><select value={paymentFrequency} onChange={e => setPaymentFrequency(e.target.value)} className="input">{PAYMENT_FREQUENCIES.map(item => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nominal (Rp) *"><input required min={1} type="number" value={paymentNominal || ''} onChange={e => setPaymentNominal(Number(e.target.value))} className="input" /></Field>
          <Field label="Pos Keuangan"><select value={paymentCostCategory} onChange={e => setPaymentCostCategory(e.target.value as BiayaKategori)} className="input">{COST_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <Field label="Keterangan"><textarea value={paymentDescription} onChange={e => setPaymentDescription(e.target.value)} className="input" rows={2} /></Field>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="checkbox" checked={paymentRequired} onChange={e => setPaymentRequired(e.target.checked)} /> Wajib ditagihkan</label>
        <div className="flex justify-end gap-2 pt-2 border-t">
          {editingPaymentId && <button type="button" onClick={resetPaymentForm} className="button-secondary">Batal</button>}
          <button type="submit" className="button-primary"><Plus className="w-4 h-4" /> {editingPaymentId ? 'Simpan Perubahan' : 'Tambah Pembayaran'}</button>
        </div>
      </form>

      <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Jenis Pembayaran</h3><p className="text-xs text-gray-500 mt-1">Tarif standar yang dapat digunakan untuk membuat tagihan.</p></div><BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" /></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Pembayaran</th><th className="p-3">Kategori</th><th className="p-3">Frekuensi</th><th className="p-3 text-right">Nominal</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-200">{biayaMasterList.map(payment => <tr key={payment.id} className="hover:bg-sky-50"><td className="p-3"><p className="font-extrabold text-[#1A5276]">{payment.namaBiaya}</p><p className="text-[11px] text-gray-400">{payment.kodeBiaya || '-'}</p></td><td className="p-3">{payment.kategoriPembayaran || payment.jenis || '-'}</td><td className="p-3 text-gray-600">{payment.tipeFrekuensi || '-'}</td><td className="p-3 text-right font-black">{formatRp(payment.nominal || 0)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${payment.aktif === false ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-800'}`}>{payment.aktif === false ? 'Nonaktif' : payment.wajib === false ? 'Opsional' : 'Wajib'}</span></td><td className="p-3 text-center"><div className="flex justify-center gap-1"><button type="button" onClick={() => editPaymentType(payment)} className="icon-button text-sky-600">Edit</button><button type="button" onClick={() => { if (confirm(`Hapus ${payment.namaBiaya}?`)) deleteBiayaMaster(payment.id); }} className="icon-button text-rose-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );

  const renderTariffs = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <form onSubmit={handleSaveTarif} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between"><div><h3 className="font-extrabold text-lg text-[#1A5276]">{editingTarifId ? 'Edit Aturan Tarif' : 'Tambah Aturan Tarif'}</h3><p className="text-xs text-gray-500 mt-1">Berikan tarif khusus berdasarkan sasaran santri.</p></div><Settings2 className="w-6 h-6 text-[#1ABC9C]" /></div>
        <Field label="Jenis Pembayaran *"><select required value={tarifPaymentId} onChange={e => setTarifPaymentId(e.target.value)} className="input"><option value="">Pilih pembayaran</option>{activePaymentTypes.map(item => <option key={item.id} value={item.id}>{item.namaBiaya}</option>)}</select></Field>
        <Field label="Sasaran Tarif *"><select value={tarifScope} onChange={e => { setTarifScope(e.target.value as TarifTargetScope); setTarifTargetValue(''); }} className="input">{TARGET_SCOPES.map(item => <option key={item}>{item}</option>)}</select></Field>
        {tarifScope !== 'Semua Santri' && <Field label="Nilai Sasaran *"><select required value={tarifTargetValue} onChange={e => setTarifTargetValue(e.target.value)} className="input"><option value="">Pilih sasaran</option>{targetOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>}
        <Field label="Nominal Tarif (Rp) *"><input required min={1} type="number" value={tarifNominal || ''} onChange={e => setTarifNominal(Number(e.target.value))} className="input" /></Field>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="checkbox" checked={tarifRequired} onChange={e => setTarifRequired(e.target.checked)} /> Wajib untuk sasaran ini</label>
        <div className="flex justify-end gap-2 pt-2 border-t">{editingTarifId && <button type="button" onClick={() => { setEditingTarifId(null); setTarifTargetValue(''); setTarifNominal(0); }} className="button-secondary">Batal</button>}<button type="submit" className="button-primary"><Plus className="w-4 h-4" /> Simpan Tarif</button></div>
      </form>
      <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6"><div className="flex items-center justify-between mb-5"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Aturan Tarif Aktif</h3><p className="text-xs text-gray-500 mt-1">Aturan spesifik diprioritaskan di atas tarif standar.</p></div><Filter className="w-6 h-6 text-[#1ABC9C]" /></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Pembayaran</th><th className="p-3">Sasaran</th><th className="p-3 text-right">Nominal</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{tarifPembayaranList.map(tarif => { const payment = biayaMasterList.find(item => item.id === tarif.biayaMasterId); const target = targetOptions.find(item => item.value === tarif.targetValue)?.label || tarif.targetValue || 'Semua Santri'; return <tr key={tarif.id} className="hover:bg-sky-50"><td className="p-3 font-bold text-[#1A5276]">{payment?.namaBiaya || '-'}</td><td className="p-3">{tarif.targetScope}{tarif.targetScope !== 'Semua Santri' ? `: ${target}` : ''}</td><td className="p-3 text-right font-black">{formatRp(tarif.nominal)}</td><td className="p-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{tarif.aktif ? 'Aktif' : 'Nonaktif'}</span></td><td className="p-3 text-center"><div className="flex justify-center gap-1"><button type="button" onClick={() => editTarif(tarif)} className="icon-button text-sky-600">Edit</button><button type="button" onClick={() => { if (confirm('Hapus aturan tarif ini?')) deleteTarifPembayaran(tarif.id); }} className="icon-button text-rose-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>; })}</tbody></table></div></div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-5">
      <form onSubmit={handleGenerateBilling} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"><div className="flex items-center gap-2 mb-5"><ClipboardList className="w-6 h-6 text-[#1ABC9C]" /><div><h3 className="font-extrabold text-lg text-[#1A5276]">Buat Tagihan Manual</h3><p className="text-xs text-gray-500 mt-1">Nominal otomatis mengambil tarif sasaran yang paling sesuai.</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"><Field label="Santri *"><select required value={billingSantriId} onChange={e => setBillingSantriId(e.target.value)} className="input"><option value="">Pilih santri</option>{activeSantri.map(item => <option key={item.id} value={item.id}>{item.namaLengkap}</option>)}</select></Field><Field label="Jenis Pembayaran *"><select required value={billingPaymentId} onChange={e => setBillingPaymentId(e.target.value)} className="input"><option value="">Pilih pembayaran</option>{activePaymentTypes.map(item => <option key={item.id} value={item.id}>{item.namaBiaya}</option>)}</select></Field><Field label="Periode *"><input required value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} className="input" placeholder="Agustus 2026" /></Field><Field label="Jatuh Tempo"><input type="date" value={billingDueDate} onChange={e => setBillingDueDate(e.target.value)} className="input" /></Field><div className="flex items-end"><button type="submit" className="button-primary w-full"><FilePlus2 className="w-4 h-4" /> Buat Tagihan</button></div></div></form>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Tagihan Aktif</h3><p className="text-xs text-gray-500 mt-1">Cari berdasarkan santri, nomor invoice, atau jenis pembayaran.</p></div><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input pl-9" placeholder="Cari tagihan..." /></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Invoice</th><th className="p-3">Santri</th><th className="p-3">Jenis</th><th className="p-3">Periode</th><th className="p-3 text-right">Tagihan</th><th className="p-3 text-right">Terbayar</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{filteredTagihan.map(tagihan => { const payment = biayaMasterList.find(item => item.id === tagihan.biayaMasterId); return <tr key={tagihan.id} className="hover:bg-sky-50"><td className="p-3 font-mono font-bold text-[#1A5276]">{tagihan.noTagihan || '-'}</td><td className="p-3 font-bold">{getSantriNameById(tagihan.santriId)}</td><td className="p-3 text-gray-600">{payment?.namaBiaya || '-'}</td><td className="p-3 text-gray-600">{tagihan.bulanTahun || '-'}</td><td className="p-3 text-right font-black">{formatRp(tagihan.nominalTagihan)}</td><td className="p-3 text-right font-bold text-emerald-700">{formatRp(tagihan.nominalTerbayar)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusClass[tagihan.status]}`}>{tagihan.status}</span></td><td className="p-3 text-center">{tagihan.status !== 'Lunas' && <button type="button" onClick={() => handleOpenPayment(tagihan)} className="px-2.5 py-1.5 rounded-lg bg-[#1ABC9C] text-white text-xs font-bold">Bayar</button>}</td></tr>; })}</tbody></table></div></div>
    </div>
  );

  const renderVerification = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"><div className="flex items-center justify-between mb-5"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Verifikasi Pembayaran Non-Tunai</h3><p className="text-xs text-gray-500 mt-1">Transfer manual menunggu persetujuan sebelum masuk ke total terbayar.</p></div><FileCheck2 className="w-6 h-6 text-[#1ABC9C]" /></div>{pendingTransactions.length === 0 ? <div className="p-10 text-center text-gray-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-300" /><p className="font-bold">Tidak ada pembayaran yang menunggu verifikasi.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Tanggal</th><th className="p-3">Santri</th><th className="p-3">Metode</th><th className="p-3 text-right">Nominal</th><th className="p-3">Bukti</th><th className="p-3 text-center">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{pendingTransactions.map(transaction => <tr key={transaction.id} className="hover:bg-sky-50"><td className="p-3 font-mono">{transaction.tanggal || '-'}</td><td className="p-3 font-bold text-[#1A5276]">{getSantriNameById(transaction.santriId)}</td><td className="p-3">{transaction.metodePembayaran}</td><td className="p-3 text-right font-black">{formatRp(transaction.nominal || 0)}</td><td className="p-3">{transaction.buktiTransferUrl ? <a href={transaction.buktiTransferUrl} target="_blank" rel="noreferrer" className="text-sky-600 underline">Lihat bukti</a> : <span className="text-gray-400">Tidak ada</span>}</td><td className="p-3 text-center"><div className="flex justify-center gap-2"><button type="button" onClick={() => handleVerify(transaction, 'Terverifikasi')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">Setujui</button><button type="button" onClick={() => handleVerify(transaction, 'Ditolak')} className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold">Tolak</button></div></td></tr>)}</tbody></table></div>}</div>
  );

  const renderReports = () => {
    const aggregate = (keyOf: (transaction: TransaksiPembayaran) => string) => reportTransactions.reduce<Record<string, { total: number; count: number }>>((result, transaction) => {
      const key = keyOf(transaction);
      result[key] = result[key] || { total: 0, count: 0 };
      result[key].total += transaction.nominal || 0;
      result[key].count += 1;
      return result;
    }, {});
    const byDate = aggregate(transaction => transaction.tanggal || '-');
    const byMonth = aggregate(transaction => (transaction.tanggal || '-').slice(0, 7));
    const byYear = aggregate(transaction => (transaction.tanggal || '-').slice(0, 4));
    return <div className="space-y-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><SummaryCard icon={<BarChart3 className="w-6 h-6" />} label="Pemasukan Terverifikasi" value={formatRp(reportTotal)} color="emerald" /><SummaryCard icon={<Receipt className="w-6 h-6" />} label="Jumlah Transaksi" value={reportTransactions.length.toString()} color="sky" /><SummaryCard icon={<XCircle className="w-6 h-6" />} label="Tunggakan Saat Ini" value={formatRp(totalOutstanding)} color="rose" /></div><ReportTable title="Laporan Harian" rows={byDate} empty="Belum ada transaksi terverifikasi." /><ReportTable title="Laporan Bulanan" rows={byMonth} empty="Belum ada rekap bulanan." /><ReportTable title="Laporan Tahunan" rows={byYear} empty="Belum ada rekap tahunan." /></div>;
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'types': return renderPaymentTypes();
      case 'tariffs': return renderTariffs();
      case 'billing': return renderBilling();
      case 'verification': return renderVerification();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div><p className="text-xs font-extrabold text-[#1ABC9C] uppercase tracking-widest">/manage/payment</p><h2 className="mt-1 text-2xl font-black text-[#1A5276] flex items-center gap-3"><CreditCard className="w-8 h-8 text-[#1ABC9C]" /> Manajemen Pembayaran</h2><p className="text-sm text-gray-500 mt-1">Pusat kendali jenis pembayaran, tarif, tagihan, transaksi, verifikasi, dan laporan pesantren.</p></div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-[#1A5276]"><UserCheck className="w-4 h-4 text-[#1ABC9C]" /> Operator: {currentUser.nama}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-2 overflow-x-auto"><div className="flex items-center gap-1 min-w-max">{(Object.keys(tabLabels) as PaymentTab[]).map(tab => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === tab ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:bg-sky-50 hover:text-[#1A5276]'}`}>{tabLabels[tab]}</button>)}</div></div>
      {feedback && <div className={`p-3 rounded-xl text-sm font-bold border ${feedback.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{feedback.message}</div>}
      {renderActiveTab()}

      {selectedTagihan && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"><form onSubmit={handlePayment} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Catat Pembayaran</h3><p className="text-xs text-gray-500 mt-1">{getSantriNameById(selectedTagihan.santriId)} - Sisa {formatRp(selectedTagihan.nominalTagihan - selectedTagihan.nominalTerbayar)}</p></div><button type="button" onClick={() => setSelectedTagihan(null)} className="text-gray-400">X</button></div><Field label="Nominal Pembayaran (Rp) *"><input required min={1} max={selectedTagihan.nominalTagihan - selectedTagihan.nominalTerbayar} type="number" value={paymentAmount || ''} onChange={e => setPaymentAmount(Number(e.target.value))} className="input" /></Field><Field label="Metode Pembayaran"><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as TransaksiPembayaran['metodePembayaran'])} className="input"><option value="Cash">Tunai / Cash</option><option value="Transfer">Transfer Bank</option><option value="VA_Bank">Virtual Account</option><option value="E_Wallet">E-Wallet / QRIS</option></select></Field>{paymentMethod !== 'Cash' && <Field label="URL Bukti Transfer"><input type="url" value={proofUrl} onChange={e => setProofUrl(e.target.value)} className="input" placeholder="https://..." /></Field>}<div className="flex justify-end gap-2 pt-2 border-t"><button type="button" onClick={() => setSelectedTagihan(null)} className="button-secondary">Batal</button><button type="submit" className="button-primary"><CheckCircle className="w-4 h-4" /> Simpan Pembayaran</button></div></form></div>}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => <label className="block text-xs font-bold text-gray-600">{label}<span className="block mt-1">{children}</span></label>;

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: 'sky' | 'violet' | 'emerald' | 'rose' }> = ({ icon, label, value, color }) => {
  const colors = { sky: 'bg-sky-50 text-sky-600 border-sky-200', violet: 'bg-violet-50 text-violet-600 border-violet-200', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200', rose: 'bg-rose-50 text-rose-600 border-rose-200' };
  return <div className={`rounded-2xl border p-5 ${colors[color]}`}><div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wide">{label}</span>{icon}</div><p className="mt-3 text-xl font-black text-gray-900">{value}</p></div>;
};

const FlowCard: React.FC<{ label: string; value: number; onClick: () => void }> = ({ label, value, onClick }) => <button type="button" onClick={onClick} className="text-left p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-sky-50 transition-colors"><p className="text-2xl font-black text-[#1A5276]">{value}</p><p className="text-[11px] font-bold text-gray-500 mt-1">{label}</p></button>;

const QuickAction: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => <button type="button" onClick={onClick} className="w-full text-left px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors">{label}</button>;

const ReportTable: React.FC<{ title: string; rows: Record<string, { total: number; count: number }>; empty: string }> = ({ title, rows, empty }) => <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"><div className="flex items-center gap-2 mb-5"><BarChart3 className="w-6 h-6 text-[#1ABC9C]" /><div><h3 className="font-extrabold text-lg text-[#1A5276]">{title}</h3><p className="text-xs text-gray-500 mt-1">Pemasukan yang sudah terverifikasi.</p></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Periode</th><th className="p-3 text-center">Transaksi</th><th className="p-3 text-right">Total Pemasukan</th></tr></thead><tbody className="divide-y divide-gray-200">{Object.entries(rows).sort(([a], [b]) => b.localeCompare(a)).map(([period, row]) => <tr key={period}><td className="p-3 font-mono">{period}</td><td className="p-3 text-center">{row.count}</td><td className="p-3 text-right font-black text-[#1A5276]">{formatRp(row.total)}</td></tr>)}{Object.keys(rows).length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-400">{empty}</td></tr>}</tbody></table></div></div>;
