import React, { useEffect, useMemo, useState } from 'react';
import { BadgeDollarSign, CalendarDays, CheckCircle2, Eye, Plus, Save, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  BiayaMaster,
  BiayaKategori,
  BULAN_KE_LABEL,
  POS_NON_SYAHRIAH,
  SYAHRIAH_ELEMEN,
  TagihanGenerationPreview,
  TarifPembayaran,
  totalElemenSyahriyah
} from '../../types/sisantri';
import { PAYMENT_FREQUENCIES, formatRp, Field } from './shared';

const SYAHRIAH_ID = 'by-yayasan';
const NON_SYAHRIAH_FREQUENCIES = PAYMENT_FREQUENCIES.filter(item => item !== 'Bulanan');
const ELEMENT_LABEL: Record<BiayaKategori, string> = {
  YAYASAN: 'Yayasan',
  SEKOLAH: 'Sekolah',
  PESANTREN: 'Pesantren',
  MAKAN: 'Makan',
  MADIN: 'Madin'
};

type PaymentMode = 'syahriyah' | 'non-syahriyah';
type ElemenValues = Record<BiayaKategori, number>;

interface DesilProfile {
  key: string;
  label: string;
  targetKategoriUtama: 'Santri' | 'Desa';
  targetTipeAsuh?: 'Asuh' | 'Bukan Asuh';
  targetGolonganAsuh?: 'A1' | 'A2' | 'A3';
  targetProgram?: 'Pengabdian' | 'Lulus' | 'Pelajar';
}

const DESIL_PROFILES: DesilProfile[] = [
  { key: 'desa', label: 'Desa', targetKategoriUtama: 'Desa' },
  { key: 'bukan-asuh-pelajar', label: 'Santri > Bukan Asuh > Pelajar', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pelajar' },
  { key: 'bukan-asuh-pengabdian', label: 'Santri > Bukan Asuh > Pengabdian', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Pengabdian' },
  { key: 'bukan-asuh-lulus', label: 'Santri > Bukan Asuh > Lulus', targetKategoriUtama: 'Santri', targetTipeAsuh: 'Bukan Asuh', targetProgram: 'Lulus' },
  ...(['A1', 'A2', 'A3'] as const).flatMap(golongan => (['Pelajar', 'Pengabdian', 'Lulus'] as const).map(program => ({
    key: `${golongan.toLowerCase()}-${program.toLowerCase()}`,
    label: `Santri > Asuh > ${golongan} > ${program}`,
    targetKategoriUtama: 'Santri' as const,
    targetTipeAsuh: 'Asuh' as const,
    targetGolonganAsuh: golongan,
    targetProgram: program
  })))
];

const emptyElements = (): ElemenValues => ({ YAYASAN: 0, SEKOLAH: 0, PESANTREN: 0, MAKAN: 0, MADIN: 0 });
const tarifIdFor = (profile: DesilProfile) => `tarif-syahriyah-${profile.key}`;

const matchesProfile = (tarif: TarifPembayaran, profile: DesilProfile) =>
  tarif.biayaMasterId === SYAHRIAH_ID &&
  tarif.targetKategoriUtama === profile.targetKategoriUtama &&
  tarif.targetTipeAsuh === profile.targetTipeAsuh &&
  tarif.targetGolonganAsuh === profile.targetGolonganAsuh &&
  tarif.targetProgram === profile.targetProgram;

const buildMatrix = (tarifList: TarifPembayaran[]): Record<string, ElemenValues> =>
  Object.fromEntries(DESIL_PROFILES.map(profile => {
    const tarif = tarifList.find(item => item.id === tarifIdFor(profile)) || tarifList.find(item => matchesProfile(item, profile));
    return [profile.key, { ...emptyElements(), ...(tarif?.elemen || {}) }];
  }));

export const JenisPembayaran: React.FC = () => {
  const {
    biayaMasterList,
    addBiayaMaster,
    updateBiayaMaster,
    deleteBiayaMaster,
    tarifPembayaranList,
    addTarifPembayaran,
    updateTarifPembayaran,
    deleteTarifPembayaran,
    unitsPesantren,
    unitSekolahList,
    getTahunAjaranAktif,
    previewGenerateTagihan,
    generateTagihanMassal
  } = useApp();

  const [mode, setMode] = useState<PaymentMode>('syahriyah');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Sekali Bayar');
  const [nominal, setNominal] = useState(0);
  const [kategoriUtama, setKategoriUtama] = useState<'Santri' | 'Desa' | ''>('');
  const [tipeAsuh, setTipeAsuh] = useState<'Asuh' | 'Bukan Asuh' | ''>('');
  const [golonganAsuh, setGolonganAsuh] = useState<'A1' | 'A2' | 'A3' | ''>('');
  const [program, setProgram] = useState<'Pengabdian' | 'Lulus' | 'Pelajar' | ''>('');
  const [unitPesantrenTargetId, setUnitPesantrenTargetId] = useState('');
  const [unitSekolahTargetId, setUnitSekolahTargetId] = useState('');
  const [required, setRequired] = useState(true);
  const [description, setDescription] = useState('');
  const [matrix, setMatrix] = useState<Record<string, ElemenValues>>(() => buildMatrix(tarifPembayaranList));
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [generationPaymentId, setGenerationPaymentId] = useState('');
  const [generationStart, setGenerationStart] = useState(1);
  const [generationEnd, setGenerationEnd] = useState(12);
  const [generationPreview, setGenerationPreview] = useState<TagihanGenerationPreview | null>(null);
  const [generationFeedback, setGenerationFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const activeTahunAjaran = getTahunAjaranAktif();
  const selectedGenerationPayment = biayaMasterList.find(item => item.id === generationPaymentId);
  useEffect(() => setMatrix(buildMatrix(tarifPembayaranList)), [tarifPembayaranList]);

  const resetNonForm = () => {
    setEditingId(null);
    setName('');
    setFrequency('Sekali Bayar');
    setNominal(0);
    setKategoriUtama('');
    setTipeAsuh('');
    setGolonganAsuh('');
    setProgram('');
    setUnitPesantrenTargetId('');
    setUnitSekolahTargetId('');
    setRequired(true);
    setDescription('');
  };

  const editNonSyahriyah = (payment: BiayaMaster) => {
    setMode('non-syahriyah');
    setEditingId(payment.id);
    setName(payment.namaBiaya);
    setFrequency(payment.tipeFrekuensi || 'Sekali Bayar');
    setNominal(payment.nominal || 0);
    setKategoriUtama(payment.targetKategoriUtama || '');
    setTipeAsuh(payment.targetTipeAsuh || '');
    setGolonganAsuh(payment.targetGolonganAsuh || '');
    setProgram(payment.targetProgram || '');
    setUnitPesantrenTargetId(payment.targetUnitPesantrenId || '');
    setUnitSekolahTargetId(payment.targetUnitSekolahId || '');
    setRequired(payment.wajib !== false);
    setDescription(payment.keterangan || '');
    setFeedback(null);
  };

  const changeElement = (profileKey: string, element: BiayaKategori, value: number) => {
    setMatrix(previous => ({
      ...previous,
      [profileKey]: { ...previous[profileKey], [element]: Math.max(0, value || 0) }
    }));
  };

  const saveSyahriyah = () => {
    const totalAll = DESIL_PROFILES.reduce((sum, profile) => sum + totalElemenSyahriyah(matrix[profile.key]), 0);
    if (totalAll <= 0) {
      setFeedback({ ok: false, message: 'Isi minimal satu nominal elemen Syahriyah.' });
      return;
    }

    const savedIds = new Set(DESIL_PROFILES.map(tarifIdFor));
    tarifPembayaranList
      .filter(item => item.biayaMasterId === SYAHRIAH_ID && !savedIds.has(item.id))
      .forEach(item => deleteTarifPembayaran(item.id));

    DESIL_PROFILES.forEach(profile => {
      const elemen = matrix[profile.key] || emptyElements();
      const total = totalElemenSyahriyah(elemen);
      const payload: Omit<TarifPembayaran, 'id'> = {
        biayaMasterId: SYAHRIAH_ID,
        targetScope: 'Kategori Utama',
        targetValue: profile.targetKategoriUtama,
        targetKategoriUtama: profile.targetKategoriUtama,
        targetTipeAsuh: profile.targetTipeAsuh,
        targetGolonganAsuh: profile.targetGolonganAsuh,
        targetProgram: profile.targetProgram,
        elemen,
        nominal: total,
        wajib: total > 0,
        aktif: true,
        effectiveFrom: '2026-07-01'
      };
      const existing = tarifPembayaranList.find(item => item.id === tarifIdFor(profile));
      if (existing) updateTarifPembayaran(existing.id, payload);
      else addTarifPembayaran(payload);
    });

    updateBiayaMaster(SYAHRIAH_ID, {
      namaBiaya: 'Syahriyah',
      jenis: 'Syahriyah',
      tipeFrekuensi: 'Bulanan',
      kategori: 'YAYASAN',
      nominal: Math.max(...DESIL_PROFILES.map(profile => totalElemenSyahriyah(matrix[profile.key]))),
      nominalStandard: totalAll,
      aktif: true,
      wajib: true
    });
    setFeedback({ ok: true, message: 'Tarif Syahriyah per desil berhasil disimpan.' });
  };

  const saveNonSyahriyah = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || nominal <= 0) {
      setFeedback({ ok: false, message: 'Nama dan nominal pembayaran wajib diisi.' });
      return;
    }
    const payload = {
      namaBiaya: name.trim(),
      jenis: frequency === 'Tahunan' ? 'Tahunan' as const : 'Non-Syahriyah' as const,
      tipeFrekuensi: frequency,
      nominal,
      nominalStandard: nominal,
      kategori: POS_NON_SYAHRIAH,
      targetKategoriUtama: kategoriUtama || undefined,
      targetTipeAsuh: tipeAsuh || undefined,
      targetGolonganAsuh: golonganAsuh || undefined,
      targetProgram: program || undefined,
      targetUnitPesantrenId: unitPesantrenTargetId || undefined,
      targetUnitSekolahId: unitSekolahTargetId || undefined,
      wajib: required,
      aktif: true,
      keterangan: description.trim() || undefined
    };
    if (editingId) updateBiayaMaster(editingId, payload);
    else addBiayaMaster(payload);
    setFeedback({ ok: true, message: editingId ? 'Pembayaran diperbarui.' : 'Pembayaran non-syahriyah ditambahkan.' });
    resetNonForm();
  };

  const handlePreviewGeneration = () => {
    if (!generationPaymentId) {
      setGenerationFeedback({ ok: false, message: 'Pilih jenis pembayaran terlebih dahulu.' });
      return;
    }
    if (!activeTahunAjaran) {
      setGenerationFeedback({ ok: false, message: 'Belum ada tahun ajaran aktif.' });
      return;
    }
    if (generationStart > generationEnd) {
      setGenerationFeedback({ ok: false, message: 'Periode mulai tidak boleh melewati periode akhir.' });
      return;
    }
    const preview = previewGenerateTagihan({ biayaMasterId: generationPaymentId, tahunAjaranId: activeTahunAjaran.id, bulanMulai: generationStart, bulanSelesai: generationEnd });
    setGenerationPreview(preview);
    setGenerationFeedback(preview ? null : { ok: false, message: 'Preview tagihan tidak dapat dibuat.' });
  };

  const handleGenerate = () => {
    if (!generationPreview || !selectedGenerationPayment || !activeTahunAjaran) return;
    if (!window.confirm(`Buat ${generationPreview.calonTagihanCount} tanggungan ${selectedGenerationPayment.namaBiaya} untuk ${generationPreview.eligibleSantriCount} santri pada ${generationPreview.periodeCount} periode?`)) return;
    const result = generateTagihanMassal({ biayaMasterId: generationPaymentId, tahunAjaranId: activeTahunAjaran.id, bulanMulai: generationStart, bulanSelesai: generationEnd });
    if (!result) {
      setGenerationFeedback({ ok: false, message: 'Tagihan gagal dibuat.' });
      return;
    }
    setGenerationFeedback({ ok: true, message: `${result.createdCount} tanggungan dibuat, ${result.skippedCount} dilewati karena sudah ada.` });
    setGenerationPreview(null);
  };

  const getStatusSummary = () => {
    if (!kategoriUtama) return 'Semua Status';
    if (kategoriUtama === 'Desa') return 'Desa';
    if (tipeAsuh === 'Bukan Asuh') return `Santri > Bukan Asuh > ${program || '...'}`;
    if (tipeAsuh === 'Asuh') return `Santri > Asuh > ${golonganAsuh || '...'} > ${program || '...'}`;
    return 'Santri';
  };

  const paymentList = useMemo(() => biayaMasterList.filter(item => item.aktif !== false), [biayaMasterList]);

  return (
    <div className="space-y-5">
      {feedback && <div className={`p-3 rounded-xl text-sm font-bold border ${feedback.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{feedback.message}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2"><BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" /> Jenis Pembayaran</h3>
          <p className="text-xs text-gray-500 mt-1">Syahriyah adalah satu paket lima elemen per desil. Pembayaran lain memakai nominal tunggal.</p>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          <button type="button" onClick={() => { setMode('syahriyah'); setFeedback(null); }} className={`px-3 py-2 rounded-md text-xs font-bold ${mode === 'syahriyah' ? 'bg-[#1A5276] text-white' : 'text-gray-600'}`}>Syahriyah</button>
          <button type="button" onClick={() => { setMode('non-syahriyah'); resetNonForm(); setFeedback(null); }} className={`px-3 py-2 rounded-md text-xs font-bold ${mode === 'non-syahriyah' ? 'bg-[#1A5276] text-white' : 'text-gray-600'}`}>Non-Syahriyah</button>
        </div>
      </div>

      {mode === 'syahriyah' ? (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div><h4 className="font-extrabold text-[#1A5276]">Tarif Syahriyah per Desil</h4><p className="text-xs text-gray-500 mt-1">Isi elemen yang berlaku. Total per desil dihitung otomatis dan menjadi satu tagihan bulanan.</p></div>
            <button type="button" onClick={saveSyahriyah} className="button-primary inline-flex items-center gap-2"><Save className="w-4 h-4" /> Simpan Tarif Syahriyah</button>
          </div>
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full min-w-[900px] text-xs">
              <thead className="bg-[#1A5276] text-white"><tr><th className="p-3 text-left min-w-[260px]">Desil</th>{SYAHRIAH_ELEMEN.map(element => <th key={element} className="p-3 text-right">{ELEMENT_LABEL[element]}</th>)}<th className="p-3 text-right">Total</th></tr></thead>
              <tbody>
                {DESIL_PROFILES.map(profile => {
                  const values = matrix[profile.key] || emptyElements();
                  const total = totalElemenSyahriyah(values);
                  return <tr key={profile.key} className="border-b border-gray-100 last:border-0"><td className="p-3 font-bold text-gray-700">{profile.label}</td>{SYAHRIAH_ELEMEN.map(element => <td key={element} className="p-2"><input type="number" min={0} step={5000} value={values[element] || ''} onChange={event => changeElement(profile.key, element, Number(event.target.value))} className="w-full min-w-[105px] rounded-lg border border-gray-200 px-2 py-2 text-right font-bold text-[#1A5276]" placeholder="0" /></td>)}<td className="p-3 text-right font-black text-emerald-700">{formatRp(total)}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-gray-500">Contoh demo sudah tersedia. Elemen bernilai 0 tidak masuk tagihan, tetapi rincian tersimpan untuk distribusi berikutnya.</p>
        </section>
      ) : (
        <form onSubmit={saveNonSyahriyah} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div><h4 className="font-extrabold text-[#1A5276]">Tambah Non-Syahriyah</h4><p className="text-xs text-gray-500 mt-1">Contoh: seragam, daftar ulang, kitab, atau pembayaran insidental lainnya.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Nama Pembayaran *"><input required value={name} onChange={event => setName(event.target.value)} className="input" placeholder="Contoh: Daftar Ulang" /></Field>
            <Field label="Frekuensi"><select value={frequency} onChange={event => setFrequency(event.target.value)} className="input">{NON_SYAHRIAH_FREQUENCIES.map(item => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Nominal (Rp) *"><input required min={1} type="number" value={nominal || ''} onChange={event => setNominal(Number(event.target.value))} className="input" /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Field label="Pos Keuangan"><div className="input bg-gray-50 text-gray-600">Lain-lain</div></Field>
            <Field label="Keterangan"><input value={description} onChange={event => setDescription(event.target.value)} className="input" placeholder="Keterangan" /></Field>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pt-5"><input type="checkbox" checked={required} onChange={event => setRequired(event.target.checked)} /> Wajib ditagihkan</label>
          </div>
          <div className="space-y-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <label className="block text-xs font-bold text-gray-700">Sasaran desil (opsional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <select value={kategoriUtama} onChange={event => { setKategoriUtama(event.target.value as 'Santri' | 'Desa' | ''); setTipeAsuh(''); setGolonganAsuh(''); setProgram(''); }} className="input text-xs"><option value="">Semua Kategori</option><option value="Santri">Santri</option><option value="Desa">Desa</option></select>
              {kategoriUtama === 'Santri' && <select value={tipeAsuh} onChange={event => { setTipeAsuh(event.target.value as 'Asuh' | 'Bukan Asuh' | ''); setGolonganAsuh(''); setProgram(''); }} className="input text-xs"><option value="">Semua Tipe Asuh</option><option value="Asuh">Asuh</option><option value="Bukan Asuh">Bukan Asuh</option></select>}
              {kategoriUtama === 'Santri' && tipeAsuh === 'Asuh' && <select value={golonganAsuh} onChange={event => { setGolonganAsuh(event.target.value as 'A1' | 'A2' | 'A3' | ''); setProgram(''); }} className="input text-xs"><option value="">Semua Golongan</option><option value="A1">A1</option><option value="A2">A2</option><option value="A3">A3</option></select>}
              {kategoriUtama === 'Santri' && (tipeAsuh === 'Bukan Asuh' || (tipeAsuh === 'Asuh' && golonganAsuh)) && <select value={program} onChange={event => setProgram(event.target.value as 'Pengabdian' | 'Lulus' | 'Pelajar' | '')} className="input text-xs"><option value="">Semua Program</option><option value="Pengabdian">Pengabdian</option><option value="Lulus">Lulus</option><option value="Pelajar">Pelajar</option></select>}
            </div>
            <span className="text-[11px] text-emerald-800 font-bold">Sasaran: {getStatusSummary()}</span>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={resetNonForm} className="button-secondary">Batal</button><button type="submit" className="button-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Tambah Pembayaran'}</button></div>
        </form>
      )}

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
          <div className="flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 font-extrabold text-[#1A5276]"><CalendarDays className="h-5 w-5 text-[#1ABC9C]" /> Terapkan Tanggungan Santri</h3><p className="mt-1 text-xs text-slate-600">Buat tagihan untuk santri aktif sesuai desil dan jenis pembayaran.</p></div><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-sky-700">{activeTahunAjaran?.kodeTahunAjaran || 'Tanpa tahun aktif'}</span></div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Jenis Pembayaran"><select value={generationPaymentId} onChange={event => { setGenerationPaymentId(event.target.value); setGenerationPreview(null); setGenerationFeedback(null); }} className="input"><option value="">Pilih jenis pembayaran</option>{paymentList.map(item => <option key={item.id} value={item.id}>{item.namaBiaya} {item.jenis === 'Syahriyah' ? '(sesuai desil)' : `- ${formatRp(item.nominal || 0)}`}</option>)}</select></Field>
            <Field label="Periode Mulai"><select value={generationStart} onChange={event => { setGenerationStart(Number(event.target.value)); setGenerationPreview(null); }} className="input">{BULAN_KE_LABEL.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></Field>
            <Field label="Periode Selesai"><select value={generationEnd} onChange={event => { setGenerationEnd(Number(event.target.value)); setGenerationPreview(null); }} className="input">{BULAN_KE_LABEL.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></Field>
          </div>
          {selectedGenerationPayment && selectedGenerationPayment.jenis !== 'Syahriyah' && <p className="mt-3 text-xs font-semibold text-amber-700">Jenis ini tidak berulang bulanan. Sistem membuat satu tanggungan pada periode mulai.</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={handlePreviewGeneration} className="button-secondary inline-flex items-center gap-2"><Eye className="h-4 w-4" /> Lihat Preview</button>{generationPreview && <button type="button" onClick={handleGenerate} className="button-primary inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Konfirmasi & Buat Tanggungan</button>}</div>
          {generationFeedback && <div className={`mt-3 rounded-xl border p-3 text-sm font-bold ${generationFeedback.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{generationFeedback.message}</div>}
          {generationPreview && <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-5"><div className="rounded-xl bg-white p-3"><span className="text-gray-500">Santri sesuai</span><strong className="mt-1 block text-lg text-[#1A5276]">{generationPreview.eligibleSantriCount}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-gray-500">Periode</span><strong className="mt-1 block text-lg text-[#1A5276]">{generationPreview.periodeCount}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-gray-500">Akan dibuat</span><strong className="mt-1 block text-lg text-emerald-700">{generationPreview.calonTagihanCount}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-gray-500">Sudah ada</span><strong className="mt-1 block text-lg text-amber-700">{generationPreview.existingTagihanCount}</strong></div><div className="col-span-2 rounded-xl bg-[#1A5276] p-3 text-white md:col-span-1"><span className="text-sky-100">Total nominal baru</span><strong className="mt-1 block text-sm">{formatRp(generationPreview.totalNominal)}</strong></div></div>}
        </div>

        <div className="flex items-center justify-between mb-5"><div><h3 className="font-extrabold text-lg text-[#1A5276]">Daftar Jenis Pembayaran</h3><p className="text-xs text-gray-500 mt-1">Syahriyah tetap satu wadah; jenis non-syahriyah dapat ditambah.</p></div><BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" /></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#1A5276] text-white text-xs uppercase"><th className="p-3">Pembayaran</th><th className="p-3">Tipe</th><th className="p-3">Frekuensi</th><th className="p-3 text-right">Nominal</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{paymentList.map(payment => <tr key={payment.id} className="hover:bg-sky-50"><td className="p-3 font-extrabold text-[#1A5276]">{payment.namaBiaya}</td><td className="p-3">{payment.jenis === 'Syahriyah' ? 'Syahriyah (5 elemen)' : 'Non-Syahriyah'}</td><td className="p-3 text-gray-600">{payment.tipeFrekuensi || '-'}</td><td className="p-3 text-right font-black">{payment.jenis === 'Syahriyah' ? 'Sesuai desil' : formatRp(payment.nominal || 0)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${payment.aktif === false ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-800'}`}>{payment.aktif === false ? 'Nonaktif' : 'Aktif'}</span></td><td className="p-3 text-center"><div className="flex justify-center gap-1">{payment.id === SYAHRIAH_ID ? <button type="button" onClick={() => setMode('syahriyah')} className="icon-button text-sky-600">Atur Tarif</button> : <><button type="button" onClick={() => editNonSyahriyah(payment)} className="icon-button text-sky-600">Edit</button><button type="button" onClick={() => deleteBiayaMaster(payment.id)} className="icon-button text-rose-600" title="Hapus"><Trash2 className="w-4 h-4" /></button></>}</div></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
};
