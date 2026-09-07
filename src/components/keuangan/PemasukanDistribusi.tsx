import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, Plus, Printer, Receipt, Wallet, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BULAN_KE_LABEL, Pemasukan, TagihanKeuangan, bulanKeFromBulanTahun } from '../../types/sisantri';

const METODE_OPTIONS = ['Tunai', 'Transfer Bank', 'E-Wallet (QRIS)', 'Giro'];
const INSTITUTION_KEY = 'sisantri_app_institutionConfig';
const DEFAULT_INSTITUTION = {
  namaYayasan: 'Yayasan Mukhtar Syafaat',
  namaPesantren: 'Pondok Pesantren Mukhtar Syafaat',
  alamat: 'Jl. Pesantren No. 01 Blokagung, Tegalsari',
  kabupaten: 'Banyuwangi',
  provinsi: 'Jawa Timur',
  telepon: '',
  email: ''
};

const readInstitution = () => {
  try {
    const stored = window.localStorage.getItem(INSTITUTION_KEY);
    return stored ? { ...DEFAULT_INSTITUTION, ...JSON.parse(stored) } : DEFAULT_INSTITUTION;
  } catch {
    return DEFAULT_INSTITUTION;
  }
};

const rp = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const formatTanggal = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};
const normalizePeriode = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('id-ID');

const getTagihanPeriode = (tagihan: TagihanKeuangan) => {
  if (tagihan.bulanTahun) return tagihan.bulanTahun.replace(/\s+/g, ' ').trim();
  const rawBulan = String(tagihan.bulanPeriode ?? tagihan.bulanKe ?? '').trim();
  const bulanKe = Number(rawBulan);
  const bulan = Number.isInteger(bulanKe) && bulanKe >= 1 && bulanKe <= 12 ? BULAN_KE_LABEL[bulanKe - 1] : rawBulan;
  return `${bulan} ${tagihan.tahunPeriode ?? ''}`.replace(/\s+/g, ' ').trim();
};

const STATUS_STYLE: Record<Pemasukan['status'], string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-emerald-100 text-emerald-800'
};

export const PemasukanDistribusi: React.FC = () => {
  const {
    pemasukanList,
    santriList,
    tagihanList,
    biayaMasterList,
    getSantriNameById,
    createPemasukan,
    getNominalBiayaSantri,
    getTahunAjaranAktif,
    currentUser
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<Pemasukan | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [printingPemasukan, setPrintingPemasukan] = useState<Pemasukan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [santriId, setSantriId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [nominal, setNominal] = useState(0);
  const [biayaMasterId, setBiayaMasterId] = useState('by-yayasan');
  const [metode, setMetode] = useState('Tunai');
  const [periode, setPeriode] = useState('');
  const [catatan, setCatatan] = useState('');

  const activeSantris = santriList.filter(item => item.status === 'Aktif');
  const activePaymentTypes = biayaMasterList.filter(item => item.aktif !== false);
  const matchingPaymentTypes = useMemo(() => {
    if (!santriId) return activePaymentTypes;
    return activePaymentTypes.filter(item => getNominalBiayaSantri(santriId, item.id) > 0);
  }, [activePaymentTypes, getNominalBiayaSantri, santriId]);
  const activePaymentType = activePaymentTypes.find(item => item.id === biayaMasterId);
  const activeTahunAjaran = getTahunAjaranAktif();

  useEffect(() => {
    if (!matchingPaymentTypes.some(item => item.id === biayaMasterId)) {
      setBiayaMasterId(matchingPaymentTypes[0]?.id || '');
    }
  }, [biayaMasterId, matchingPaymentTypes]);

  const availablePeriodes = useMemo(() => {
    if (!santriId || !activePaymentType) return [];
    const seen = new Set<string>();
    return tagihanList
      .filter(tagihan => tagihan.santriId === santriId && tagihan.biayaMasterId === activePaymentType.id &&
        (!activeTahunAjaran || !tagihan.tahunAjaranId || tagihan.tahunAjaranId === activeTahunAjaran.id) &&
        tagihan.nominalTagihan > tagihan.nominalTerbayar)
      .map(getTagihanPeriode)
      .filter(label => {
        const key = normalizePeriode(label);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [activePaymentType, activeTahunAjaran, santriId, tagihanList]);

  useEffect(() => {
    if (!availablePeriodes.includes(periode)) setPeriode(availablePeriodes[0] || '');
  }, [availablePeriodes, periode]);

  const selectedNominalTarif = santriId && activePaymentType ? getNominalBiayaSantri(santriId, activePaymentType.id) : 0;
  const selectedNominalTerbayar = useMemo(() => tagihanList
    .filter(tagihan => tagihan.santriId === santriId && tagihan.biayaMasterId === activePaymentType?.id &&
      (!activeTahunAjaran || !tagihan.tahunAjaranId || tagihan.tahunAjaranId === activeTahunAjaran.id) &&
      normalizePeriode(getTagihanPeriode(tagihan)) === normalizePeriode(periode))
    .reduce((total, tagihan) => total + tagihan.nominalTerbayar, 0),
  [activePaymentType, activeTahunAjaran, periode, santriId, tagihanList]);
  const selectedNominalRemaining = Math.max(0, selectedNominalTarif - selectedNominalTerbayar);

  useEffect(() => setNominal(selectedNominalRemaining), [selectedNominalRemaining]);

  useEffect(() => {
    if (!printingPemasukan) return;
    const printTimer = window.setTimeout(() => window.print(), 100);
    const finishPrint = () => setPrintingPemasukan(null);
    window.addEventListener('afterprint', finishPrint);
    return () => {
      window.clearTimeout(printTimer);
      window.removeEventListener('afterprint', finishPrint);
    };
  }, [printingPemasukan]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!santriId) { setError('Pilih santri terlebih dahulu.'); return; }
    if (!activePaymentType) { setError('Pilih jenis pembayaran terlebih dahulu.'); return; }
    if (!periode) { setError('Pilih periode tagihan terlebih dahulu.'); return; }
    if (!nominal || nominal <= 0) { setError('Nominal pembayaran harus lebih dari 0.'); return; }
    if (nominal !== selectedNominalRemaining) {
      setError(`Nominal pembayaran harus sama dengan sisa tagihan ${rp(selectedNominalRemaining)}.`);
      return;
    }

    const selectedTagihan = tagihanList.find(tagihan =>
      tagihan.santriId === santriId && tagihan.biayaMasterId === activePaymentType.id &&
      (!activeTahunAjaran || !tagihan.tahunAjaranId || tagihan.tahunAjaranId === activeTahunAjaran.id) &&
      normalizePeriode(getTagihanPeriode(tagihan)) === normalizePeriode(periode) &&
      tagihan.nominalTagihan > tagihan.nominalTerbayar
    );
    const response = createPemasukan({
      santriId,
      biayaMasterId: activePaymentType.id,
      tanggal,
      nominal,
      jenisPembayaran: activePaymentType.namaBiaya,
      metodePembayaran: metode,
      periode,
      bulanKe: selectedTagihan?.bulanKe ?? bulanKeFromBulanTahun(periode),
      tahunAjaranId: activeTahunAjaran?.id,
      catatan: catatan || undefined,
      createdBy: currentUser.nama
    });
    if (!response.ok) { setError(response.error || 'Gagal mencatat pembayaran.'); return; }
      setResult(response.pemasukan!);
      setShowForm(false);
    setSantriId(''); setNominal(0); setMetode('Tunai'); setPeriode(''); setCatatan('');
  };

  const sortedPemasukan = useMemo(
    () => [...pemasukanList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [pemasukanList]
  );
  const printInstitution = readInstitution();
  const printSantri = printingPemasukan ? santriList.find(item => item.id === printingPemasukan.santriId) : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="text-[11px] font-extrabold uppercase text-gray-500">Jenis Aktif</div>
           <div className="mt-2 text-lg font-black text-[#1A5276]">{activePaymentType?.namaBiaya || 'Belum dipilih'}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="text-[11px] font-extrabold uppercase text-gray-500">Tarif Dasar</div>
           <div className="mt-2 text-lg font-black text-emerald-700">{rp(selectedNominalTarif)}</div>
        </div>
        <div className="bg-[#1A5276] rounded-xl border border-[#1A5276] shadow-sm p-4 text-white">
          <div className="text-[11px] font-extrabold uppercase text-white/70">Total Pemasukan</div>
          <div className="mt-2 text-lg font-black">{rp(pemasukanList.reduce((total, item) => total + item.nominal, 0))}</div>
          <div className="text-[11px] text-white/70 font-bold">{pemasukanList.length} transaksi tercatat</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2.5"><Wallet className="w-6 h-6 text-[#1ABC9C]" /> Pencatatan Pembayaran</h3>
           <p className="text-sm text-[#566573] mt-1">Pilih santri dan jenis pembayaran, lalu sistem mengisi nominal sesuai sisa tagihan.</p>
        </div>
        <button onClick={() => { setShowForm(value => !value); setError(null); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-bold rounded-lg shadow transition-all">
          <Plus className="w-4 h-4" /> {showForm ? 'Tutup Form' : 'Catat Pembayaran'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
           <div className="flex items-center gap-2 mb-5"><Wallet className="w-5 h-5 text-[#1A5276]" /><h4 className="font-extrabold text-base text-[#1A5276]">Pembayaran {activePaymentType?.namaBiaya || 'Santri'}</h4></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <label className="block text-xs font-bold text-gray-600">Santri *<select value={santriId} onChange={event => { setSantriId(event.target.value); setPeriode(''); }} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276]"><option value="">— Pilih Santri —</option>{activeSantris.map(item => <option key={item.id} value={item.id}>{item.namaLengkap} ({item.nis})</option>)}</select></label>
             <label className="block text-xs font-bold text-gray-600">Tanggal *<input type="date" value={tanggal} onChange={event => setTanggal(event.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276]" /></label>
             <label className="block text-xs font-bold text-gray-600">Jenis Pembayaran *<select value={biayaMasterId} onChange={event => { setBiayaMasterId(event.target.value); setPeriode(''); }} disabled={!santriId || matchingPaymentTypes.length === 0} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] disabled:bg-gray-100"><option value="">— Pilih Jenis —</option>{matchingPaymentTypes.map(item => <option key={item.id} value={item.id}>{item.namaBiaya}</option>)}</select></label>
            <label className="block text-xs font-bold text-gray-600">Periode *<select value={periode} onChange={event => setPeriode(event.target.value)} disabled={!santriId || availablePeriodes.length === 0} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] disabled:bg-gray-100"><option value="">{santriId ? '— Pilih Periode —' : '— Pilih Santri —'}</option>{availablePeriodes.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="block text-xs font-bold text-gray-600">Nominal *<input type="number" value={nominal || ''} readOnly className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-[#1A5276] bg-gray-100" /></label>
            <label className="block text-xs font-bold text-gray-600">Metode Pembayaran *<select value={metode} onChange={event => setMetode(event.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276]">{METODE_OPTIONS.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="block text-xs font-bold text-gray-600 sm:col-span-2 lg:col-span-3">Catatan (opsional)<input value={catatan} onChange={event => setCatatan(event.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276]" placeholder="Catatan pembayaran" /></label>
          </div>
           {santriId && !availablePeriodes.length && <p className="mt-4 text-xs font-bold text-amber-700">Belum ada tagihan yang tersisa untuk santri ini. Buat tanggungan terlebih dahulu di tab Jenis Pembayaran.</p>}
          {error && <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold"><AlertCircle className="w-4 h-4" />{error}</div>}
          <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg">Batal</button><button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A5276] text-white font-bold rounded-lg"><CheckCircle className="w-4 h-4" /> Simpan Pembayaran</button></div>
        </form>
      )}

      {result && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"><div className="flex items-start justify-between mb-4"><div><h4 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Pembayaran Tercatat</h4><p className="text-xs text-gray-500 font-bold mt-0.5">No. {result.noPemasukan}</p></div><button onClick={() => setResult(null)} className="text-gray-400"><X className="w-5 h-5" /></button></div><div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1.5"><div className="flex justify-between"><span className="text-gray-500 font-bold">Santri</span><span className="font-extrabold text-[#1A5276]">{getSantriNameById(result.santriId)}</span></div><div className="flex justify-between"><span className="text-gray-500 font-bold">Periode</span><span>{result.periode}</span></div><div className="flex justify-between"><span className="text-gray-500 font-bold">Total</span><span className="font-black text-emerald-600">{rp(result.nominal)}</span></div></div><button onClick={() => setResult(null)} className="mt-5 w-full px-5 py-2.5 bg-[#1A5276] text-white font-bold rounded-lg">Tutup</button></div></div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Riwayat Pembayaran</h4>
          <span className="ml-auto text-xs font-extrabold text-gray-400">{sortedPemasukan.length} transaksi</span>
        </div>
        <div className="space-y-3">
          {sortedPemasukan.map(item => {
            const open = expandedId === item.id;
            return (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button type="button" onClick={() => setExpandedId(open ? null : item.id)} className="w-full flex items-center gap-4 p-4 hover:bg-sky-50 text-left">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#1A5276]/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-[#1A5276]" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-extrabold text-[#1A5276] truncate">{getSantriNameById(item.santriId)}</span><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${STATUS_STYLE[item.status]}`}>{item.status}</span></div>
                    <div className="text-xs text-gray-500 font-bold">{item.noPemasukan} · {item.tanggal} · {item.periode}</div>
                  </div>
                  <div className="text-right"><div className="font-black text-[#1A5276]">{rp(item.nominal)}</div><div className="text-[10px] text-gray-400 font-bold">{item.metodePembayaran}</div></div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50 text-xs font-bold text-gray-500">
                    <div>Dicatat oleh {item.createdBy} · {new Date(item.paidAt).toLocaleString('id-ID')}{item.catatan ? ` · ${item.catatan}` : ''}</div>
                    <div className="mt-4 flex justify-end border-t border-gray-200 pt-4">
                      <button type="button" onClick={() => setPrintingPemasukan(item)} className="inline-flex items-center gap-2 rounded-lg bg-[#1A5276] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#154360]"><Printer className="h-4 w-4" /> Cetak Kwitansi</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {sortedPemasukan.length === 0 && <div className="text-center py-10 text-gray-400 font-bold text-sm">Belum ada pembayaran tercatat.</div>}
        </div>
      </div>

      {printingPemasukan && (
        <div className="receipt-print-root" aria-hidden="true">
          <div className="receipt-print-sheet">
            <header className="receipt-print-header">
              <div>
                <p className="receipt-print-foundation">{printInstitution.namaYayasan}</p>
                <h1>{printInstitution.namaPesantren}</h1>
                <p>{printInstitution.alamat}, {printInstitution.kabupaten}, {printInstitution.provinsi}</p>
                {(printInstitution.telepon || printInstitution.email) && <p>{[printInstitution.telepon, printInstitution.email].filter(Boolean).join(' | ')}</p>}
              </div>
              <div className="receipt-print-mark">KWITANSI</div>
            </header>
            <div className="receipt-print-title"><h2>KWITANSI PEMBAYARAN</h2><p>No. {printingPemasukan.noPemasukan}</p></div>
            <div className="receipt-print-body">
              <div className="receipt-print-row"><span>Telah diterima dari</span><strong>{printSantri?.namaLengkap || 'Santri Tidak Ditemukan'}</strong></div>
              <div className="receipt-print-row"><span>NIS</span><strong>{printSantri?.nis || '-'}</strong></div>
              <div className="receipt-print-row"><span>Jenis pembayaran</span><strong>{printingPemasukan.jenisPembayaran}</strong></div>
              <div className="receipt-print-row"><span>Periode</span><strong>{printingPemasukan.periode}</strong></div>
              <div className="receipt-print-row"><span>Metode pembayaran</span><strong>{printingPemasukan.metodePembayaran}</strong></div>
              <div className="receipt-print-total"><span>Jumlah pembayaran</span><strong>{rp(printingPemasukan.nominal)}</strong></div>
              {printingPemasukan.catatan && <div className="receipt-print-row"><span>Catatan</span><strong>{printingPemasukan.catatan}</strong></div>}
            </div>
            <div className="receipt-print-footer"><p>{printInstitution.kabupaten}, {formatTanggal(printingPemasukan.tanggal)}</p><p>Dicatat oleh,</p><div className="receipt-print-signature">{printingPemasukan.createdBy}</div><p className="receipt-print-note">Kwitansi ini merupakan bukti pembayaran yang sah.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
