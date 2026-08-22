import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeDollarSign, Plus, Trash2 } from 'lucide-react';
import { BiayaMaster, BiayaKategori } from '../../types/sisantri';
import { PAYMENT_FREQUENCIES, COST_CATEGORIES, formatRp, Field } from './shared';

export const JenisPembayaran: React.FC = () => {
  const { biayaMasterList, addBiayaMaster, updateBiayaMaster, deleteBiayaMaster, unitsPesantren, unitSekolahList } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Bulanan');
  const [nominal, setNominal] = useState(0);
  const [costCategory, setCostCategory] = useState<BiayaKategori>('PESANTREN');

  // Hirarki Status Santri 4-level untuk Pembayaran
  const [kategoriUtama, setKategoriUtama] = useState<'Santri' | 'Desa' | ''>('');
  const [tipeAsuh, setTipeAsuh] = useState<'Asuh' | 'Bukan Asuh' | ''>('');
  const [golonganAsuh, setGolonganAsuh] = useState<'A1' | 'A2' | 'A3' | ''>('');
  const [program, setProgram] = useState<'Pengabdian' | 'Lulus' | 'Pelajar' | ''>('');
  const [unitPesantrenTargetId, setUnitPesantrenTargetId] = useState('');
  const [unitSekolahTargetId, setUnitSekolahTargetId] = useState('');

  const [required, setRequired] = useState(true);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const reset = () => {
    setEditingId(null);
    setName(''); setFrequency('Bulanan');
    setNominal(0); setCostCategory('PESANTREN');
    setKategoriUtama(''); setTipeAsuh(''); setGolonganAsuh(''); setProgram('');
    setUnitPesantrenTargetId(''); setUnitSekolahTargetId('');
    setRequired(true); setDescription('');
  };

  const edit = (p: BiayaMaster) => {
    setEditingId(p.id);
    setName(p.namaBiaya);
    setFrequency(p.tipeFrekuensi || 'Bulanan');
    setNominal(p.nominal || 0); setCostCategory(p.kategori || 'PESANTREN');
    setKategoriUtama((p.targetKategoriUtama as 'Santri' | 'Desa' | '') || '');
    setTipeAsuh((p.targetTipeAsuh as 'Asuh' | 'Bukan Asuh' | '') || '');
    setGolonganAsuh((p.targetGolonganAsuh as 'A1' | 'A2' | 'A3' | '') || '');
    setProgram((p.targetProgram as 'Pengabdian' | 'Lulus' | 'Pelajar' | '') || '');
    setUnitPesantrenTargetId(p.targetUnitPesantrenId || '');
    setUnitSekolahTargetId(p.targetUnitSekolahId || '');
    setRequired(p.wajib !== false); setDescription(p.keterangan || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || nominal <= 0) {
      setFeedback({ ok: false, message: 'Nama dan nominal pembayaran wajib diisi.' });
      return;
    }
    const payload = {
      namaBiaya: name.trim(),
      jenis: frequency === 'Bulanan' ? 'Syahriyah' as const : frequency === 'Tahunan' ? 'Tahunan' as const : 'Non-Syahriyah' as const,
      tipeFrekuensi: frequency,
      nominal,
      nominalStandard: nominal,
      kategori: costCategory,
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
    setFeedback({ ok: true, message: editingId ? 'Jenis pembayaran diperbarui.' : 'Jenis pembayaran ditambahkan.' });
    reset();
  };

  const getStatusSummary = () => {
    if (!kategoriUtama) return 'Semua Status';
    if (kategoriUtama === 'Desa') return 'Desa';
    if (tipeAsuh === 'Bukan Asuh') {
      return `Santri > Bukan Asuh > ${program || '...'}`;
    }
    if (tipeAsuh === 'Asuh') {
      return `Santri > Asuh > ${golonganAsuh || '...'} > ${program || '...'}`;
    }
    return 'Santri';
  };

  return (
    <div className="space-y-5">
      {feedback && (
        <div className={`p-3 rounded-xl text-sm font-bold border ${feedback.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-[#1A5276]">{editingId ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}</h3>
              <p className="text-xs text-gray-500 mt-1">Atur pembayaran rutin, insidental, atau donasi.</p>
            </div>
            <BadgeDollarSign className="w-6 h-6 text-[#1ABC9C]" />
          </div>

          <Field label="Nama Pembayaran *">
            <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="cth. Syahriyah, Seragam, Ujian" />
          </Field>

          {/* STATUS SANTRI BERTINGKAT 4-LEVEL */}
          <div className="space-y-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <label className="block text-xs font-bold text-gray-700">Status Santri / Sasaran</label>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Level 1: Kategori Utama */}
              <div>
                <span className="text-[10px] text-gray-500 font-bold block mb-1">1. Kategori</span>
                <select
                  value={kategoriUtama}
                  onChange={e => {
                    const val = e.target.value as 'Santri' | 'Desa' | '';
                    setKategoriUtama(val);
                    setTipeAsuh(''); setGolonganAsuh(''); setProgram('');
                    setUnitPesantrenTargetId(''); setUnitSekolahTargetId('');
                  }}
                  className="input text-xs"
                >
                  <option value="">Semua (Global)</option>
                  <option value="Santri">Santri</option>
                  <option value="Desa">Desa</option>
                </select>
              </div>

              {/* Level 2: Tipe Asuh (jika Santri) */}
              {kategoriUtama === 'Santri' && (
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">2. Tipe Asuh</span>
                  <select
                    value={tipeAsuh}
                    onChange={e => {
                      const val = e.target.value as 'Asuh' | 'Bukan Asuh' | '';
                      setTipeAsuh(val);
                      setGolonganAsuh(''); setProgram('');
                      setUnitPesantrenTargetId(''); setUnitSekolahTargetId('');
                    }}
                    className="input text-xs"
                  >
                    <option value="">Pilih Tipe</option>
                    <option value="Bukan Asuh">Bukan Asuh</option>
                    <option value="Asuh">Asuh</option>
                  </select>
                </div>
              )}
            </div>

            {/* Level 3: Golongan Asuh (jika Asuh) */}
            {kategoriUtama === 'Santri' && tipeAsuh === 'Asuh' && (
              <div>
                <span className="text-[10px] text-gray-500 font-bold block mb-1">3. Golongan Asuh</span>
                <select
                  value={golonganAsuh}
                  onChange={e => {
                    setGolonganAsuh(e.target.value as 'A1' | 'A2' | 'A3' | '');
                    setProgram(''); setUnitPesantrenTargetId(''); setUnitSekolahTargetId('');
                  }}
                  className="input text-xs"
                >
                  <option value="">Pilih Golongan</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="A3">A3</option>
                </select>
              </div>
            )}

            {/* Level 4: Program (jika Desa tidak, jika Bukan Asuh atau Asuh+Golongan) */}
            {kategoriUtama === 'Santri' && (tipeAsuh === 'Bukan Asuh' || (tipeAsuh === 'Asuh' && golonganAsuh)) && (
              <div>
                <span className="text-[10px] text-gray-500 font-bold block mb-1">4. Program</span>
                <select
                  value={program}
                  onChange={e => {
                    const val = e.target.value as 'Pengabdian' | 'Lulus' | 'Pelajar' | '';
                    setProgram(val);
                    if (val !== 'Pelajar') { setUnitPesantrenTargetId(''); setUnitSekolahTargetId(''); }
                  }}
                  className="input text-xs"
                >
                  <option value="">Pilih Program</option>
                  <option value="Pengabdian">Pengabdian</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Pelajar">Pelajar</option>
                </select>
              </div>
            )}

            {/* Level 5: Unit (jika Pelajar) */}
            {program === 'Pelajar' && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Unit Pesantren</span>
                  <select
                    value={unitPesantrenTargetId}
                    onChange={e => setUnitPesantrenTargetId(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="">Semua Unit Pesantren</option>
                    {unitsPesantren.map(u => <option key={u.id} value={u.id}>{u.namaUnit}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Unit Sekolah</span>
                  <select
                    value={unitSekolahTargetId}
                    onChange={e => setUnitSekolahTargetId(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="">Semua Unit Sekolah</option>
                    {unitSekolahList.map(s => <option key={s.id} value={s.id}>{s.namaSekolah}</option>)}
                  </select>
                </div>
              </div>
            )}

            <p className="text-[11px] text-emerald-800 font-bold pt-1">
              Sasaran: <span className="underline font-mono">{getStatusSummary()}</span>
            </p>
          </div>

          <Field label="Frekuensi"><select value={frequency} onChange={e => setFrequency(e.target.value)} className="input">{PAYMENT_FREQUENCIES.map(f => <option key={f}>{f}</option>)}</select></Field>
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
                  <th className="p-3">Status Santri Sasaran</th>
                  <th className="p-3">Frekuensi</th>
                  <th className="p-3 text-right">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {biayaMasterList.map(p => (
                  <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-extrabold text-[#1A5276]">{p.namaBiaya}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                        {p.targetKategoriUtama ? `${p.targetKategoriUtama}${p.targetTipeAsuh ? ` > ${p.targetTipeAsuh}` : ''}${p.targetGolonganAsuh ? ` > ${p.targetGolonganAsuh}` : ''}${p.targetProgram ? ` > ${p.targetProgram}` : ''}` : 'Semua'}
                      </span>
                    </td>
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
