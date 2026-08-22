import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Santri } from '../../types/sisantri';
import {
  dataWilayahIndonesia,
  getKabupatenByProvinsi,
  getKecamatanByKabupaten,
} from '../../data/wilayahIndonesia';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  X,
  Building2,
  GraduationCap,
  School,
  BookOpenCheck,
  HeartPulse,
  FileCheck2,
  UserCheck,
  BookMarked
} from 'lucide-react';

export const DataSantriModule: React.FC = () => {
  const {
    santriList,
    addSantri,
    updateSantri,
    deleteSantri,
    unitsPesantren,
    asramaList,
    kamarList,
    marhalahList,
    kelasMadinList,
    unitSekolahList,
    jurusanList,
    kelasSekolahList,
    getSantriNameById
  } = useApp();

  // Search and Dependent Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnitPesantren, setFilterUnitPesantren] = useState<string>('ALL');
  const [filterAsrama, setFilterAsrama] = useState<string>('ALL');
  const [filterKamar, setFilterKamar] = useState<string>('ALL');

  const [filterMarhalah, setFilterMarhalah] = useState<string>('ALL');
  const [filterKelasMadin, setFilterKelasMadin] = useState<string>('ALL');

  const [filterSekolah, setFilterSekolah] = useState<string>('ALL');
  const [filterKelasSekolah, setFilterKelasSekolah] = useState<string>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSantriId, setEditSantriId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<number>(1); // 1-8 form

  // State untuk dropdown wilayah bertingkat
  const [selectedProvinsiId, setSelectedProvinsiId] = useState<string>('');
  const [selectedKabupatenId, setSelectedKabupatenId] = useState<string>('');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<string>('');

  // Computed list berdasarkan pilihan
  const availableKabupaten = useMemo(() => getKabupatenByProvinsi(selectedProvinsiId), [selectedProvinsiId]);
  const availableKecamatan = useMemo(() => getKecamatanByKabupaten(selectedProvinsiId, selectedKabupatenId), [selectedProvinsiId, selectedKabupatenId]);

  // Form State for 8 Sub-Forms
  const [formData, setFormData] = useState<Partial<Santri>>({
    nik: '',
    namaLengkap: '',
    tempatLahir: 'Banyuwangi',
    tanggalLahir: '2008-05-12',
    jenisKelamin: 'L',
    status: 'Aktif',
    noHp: '08123456789',
    alamatLengkap: 'Jl. Raya Pesantren Mukhtar Syafaat, Blokagung',
    
    // Form 2: Orang Tua
    nikAyah: '',
    namaAyah: '',
    pekerjaanAyah: 'Wiraswasta',
    nikIbu: '',
    namaIbu: '',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '08198765432',

    // Form 3: Sekolah Formal
    unitSekolahId: unitSekolahList[0]?.id || '',
    jurusanId: '',
    kelasSekolahId: kelasSekolahList[0]?.id || '',

    // Form 4: Madin
    marhalahMadinId: marhalahList[0]?.id || '',
    kelasMadinId: kelasMadinList[0]?.id || '',

    // Form 5: Asrama
    unitPesantrenId: unitsPesantren[0]?.id || '',
    asramaId: asramaList[0]?.id || '',
    kamarId: kamarList[0]?.id || '',

    // Form 6: Hafalan
    targetJuz: 30,
    capaianJuz: 5,
    capaianNadhoman: 'Imriti 250 Bait',

    // Form 7: UKS
    riwayatPenyakit: 'Tipes (2025)',
    golonganDarah: 'O',

    // Form 8: Berkas
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    statusBerkasKK: true,
    statusBerkasAkta: true,
    statusBerkasIjazah: true,

    // Status Santri (HIRARKI 4-LEVEL)
    kategoriUtama: 'Santri',
    tipeAsuh: 'Bukan Asuh',
    golonganAsuh: null,
    program: 'Pelajar'
  });

  // Fungsi derive level dari data tersimpan
  function deriveLevel1(kategori: string | undefined): 'Santri' | 'Desa' | '' {
    if (!kategori) return '';
    return kategori === 'Desa' ? 'Desa' : 'Santri';
  }
  function deriveLevel2(kategori: string | undefined, tipe: string | null | undefined): 'Asuh' | 'Bukan Asuh' | '' {
    if (!kategori || kategori === 'Desa') return '';
    return tipe === 'Asuh' ? 'Asuh' : 'Bukan Asuh';
  }

  // State untuk dropdown bertingkat status santri (4-level hirarki)
  const [statusLevel1, setStatusLevel1] = useState<'Santri' | 'Desa' | ''>(deriveLevel1(formData.kategoriUtama));
  const [statusLevel2, setStatusLevel2] = useState<'Asuh' | 'Bukan Asuh' | ''>(deriveLevel2(formData.kategoriUtama, formData.tipeAsuh));
  const [statusLevel3, setStatusLevel3] = useState<'A1' | 'A2' | 'A3' | ''>(formData.golonganAsuh || '');
  const [statusLevel4, setStatusLevel4] = useState<'Pengabdian' | 'Lulus' | 'Pelajar' | ''>(formData.program || '');

  // Dependent Filter Option Calculations
  const availableAsramaFilter = filterUnitPesantren === 'ALL'
    ? asramaList
    : asramaList.filter(a => a.unitPesantrenId === filterUnitPesantren);

  const availableKamarFilter = filterAsrama === 'ALL'
    ? kamarList
    : kamarList.filter(k => k.asramaId === filterAsrama);

  const availableKelasMadinFilter = filterMarhalah === 'ALL'
    ? kelasMadinList
    : kelasMadinList.filter(km => km.marhalahId === filterMarhalah);

  const availableKelasSekolahFilter = filterSekolah === 'ALL'
    ? kelasSekolahList
    : kelasSekolahList.filter(ks => ks.sekolahId === filterSekolah);

  // Filtered Santri List
  const filteredSantri = santriList.filter(s => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.namaLengkap.toLowerCase().includes(q);
      const matchNIS = s.nis.toLowerCase().includes(q);
      if (!matchName && !matchNIS) return false;
    }

    // Filter Pesantren / Asrama / Kamar
    if (filterUnitPesantren !== 'ALL' && s.unitPesantrenId !== filterUnitPesantren) return false;
    if (filterAsrama !== 'ALL' && s.asramaId !== filterAsrama) return false;
    if (filterKamar !== 'ALL' && s.kamarId !== filterKamar) return false;

    // Filter Madin
    if (filterMarhalah !== 'ALL' && s.marhalahMadinId !== filterMarhalah) return false;
    if (filterKelasMadin !== 'ALL' && s.kelasMadinId !== filterKelasMadin) return false;

    // Filter Sekolah
    if (filterSekolah !== 'ALL' && s.unitSekolahId !== filterSekolah) return false;
    if (filterKelasSekolah !== 'ALL' && s.kelasSekolahId !== filterKelasSekolah) return false;

    return true;
  });

  const handleOpenTambah = () => {
    setEditSantriId(null);
    setFormTab(1);
    setFormData({
      nik: '35100' + Math.floor(100000 + Math.random() * 900000),
      namaLengkap: '',
      tempatLahir: 'Banyuwangi',
      tanggalLahir: '2008-05-12',
      jenisKelamin: 'L',
      status: 'Aktif',
      noHp: '08123456789',
      alamat: 'Jl. Raya Pesantren Mukhtar Syafaat',
      dusun: 'Blokagung',
      rt: '001',
      rw: '001',
      desa: 'Karangdoro',
      kecamatan: '',
      kabupaten: '',
      provinsi: '',
      kodePos: '',
      nikAyah: '35100' + Math.floor(100000 + Math.random() * 900000),
      namaAyah: '',
      pekerjaanAyah: 'Wiraswasta',
      nikIbu: '35100' + Math.floor(100000 + Math.random() * 900000),
      namaIbu: '',
      pekerjaanIbu: 'Ibu Rumah Tangga',
      noHpOrtu: '08198765432',
      unitSekolahId: unitSekolahList[0]?.id || '',
      jurusanId: '',
      kelasSekolahId: kelasSekolahList[0]?.id || '',
      marhalahMadinId: marhalahList[0]?.id || '',
      kelasMadinId: kelasMadinList[0]?.id || '',
      unitPesantrenId: unitsPesantren[0]?.id || '',
      asramaId: asramaList[0]?.id || '',
      kamarId: kamarList[0]?.id || '',
      targetJuz: 30,
      capaianJuz: 1,
      capaianNadhoman: 'Aqidatul Awam Selesai',
      riwayatPenyakit: 'Tidak ada',
      golonganDarah: 'O',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      statusBerkasKK: true,
      statusBerkasAkta: true,
      statusBerkasIjazah: true,
      kategoriUtama: 'Santri',
      tipeAsuh: 'Bukan Asuh',
      program: 'Pelajar'
    });
    setStatusLevel1('Santri');
    setStatusLevel2('Bukan Asuh');
    setStatusLevel3('');
    setStatusLevel4('Pelajar');
    setShowModal(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditSantriId(s.id);
    setFormTab(1);
    setFormData({ ...s });
    setStatusLevel1(deriveLevel1(s.kategoriUtama));
    setStatusLevel2(deriveLevel2(s.kategoriUtama, s.tipeAsuh));
    setStatusLevel3(s.golonganAsuh || '');
    setStatusLevel4(s.program || '');
    // Cari provinsi & kabupaten yang sesuai untuk dropdown
    const matchedProvinsi = dataWilayahIndonesia.find(p => p.nama === s.provinsi);
    const matchedKab = matchedProvinsi?.kabupatenKota.find(k => k.nama === s.kabupaten || `${k.tipe} ${k.nama}` === s.kabupaten);
    const matchedKec = matchedKab?.kecamatan.find(kc => kc.nama === s.kecamatan);
    setSelectedProvinsiId(matchedProvinsi?.id || '');
    setSelectedKabupatenId(matchedKab?.id || '');
    setSelectedKecamatanId(matchedKec?.id || '');
    setShowModal(true);
  };

  const handleSaveSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSantriId) {
      updateSantri(editSantriId, formData);
    } else {
      addSantri(formData as Omit<Santri, 'id' | 'nis'>);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Stats */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-extrabold text-[#1ABC9C] uppercase tracking-widest">/data/santri</p>
          <h2 className="mt-1 text-2xl font-black text-[#1A5276] flex items-center gap-3">
            <Users className="w-8 h-8 text-[#1ABC9C]" />
            Database Kesantrian
          </h2>
          <p className="text-sm text-gray-500 mt-1">Sistem informasi data santri Mukhtar Syafaat terpadu & real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-black text-sm">{santriList.length}</div>
            <p className="text-[10px] font-bold text-sky-800 uppercase leading-tight">Total<br/>Santri</p>
          </div>
          <button
            onClick={handleOpenTambah}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-900/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Santri
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1ABC9C] transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama / NIS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#1ABC9C] focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                />
              </div>

              <select value={filterUnitPesantren} onChange={e => { setFilterUnitPesantren(e.target.value); setFilterAsrama('ALL'); setFilterKamar('ALL'); }} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#1ABC9C] transition-all">
                <option value="ALL">Semua Unit Pesantren</option>
                {unitsPesantren.map(u => <option key={u.id} value={u.id}>{u.namaUnit}</option>)}
              </select>

              <select value={filterMarhalah} onChange={e => { setFilterMarhalah(e.target.value); setFilterKelasMadin('ALL'); }} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#1ABC9C] transition-all">
                <option value="ALL">Semua Marhalah</option>
                {marhalahList.map(m => <option key={m.id} value={m.id}>{m.namaMarhalah}</option>)}
              </select>

              <select value={filterSekolah} onChange={e => { setFilterSekolah(e.target.value); setFilterKelasSekolah('ALL'); }} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#1ABC9C] transition-all">
                <option value="ALL">Semua Sekolah</option>
                {unitSekolahList.map(u => <option key={u.id} value={u.id}>{u.namaSekolah}</option>)}
              </select>
           </div>
        </div>

        <div className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/20">
          <div>
            <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">Santri Aktif</p>
            <p className="text-2xl font-black">{santriList.filter(s => s.status === 'Aktif').length}</p>
          </div>
          <UserCheck className="w-8 h-8 opacity-40" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A5276] text-white uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-4 text-center w-16">Foto</th>
                <th className="px-4 py-4">Nama Lengkap & NIS</th>
                <th className="px-4 py-4">Unit & Kelas</th>
                <th className="px-4 py-4">Alamat & Wali</th>
                <th className="px-4 py-4">Status & Hirarki</th>
                <th className="px-4 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSantri.map((s, idx) => (
                <tr key={s.id} className="hover:bg-sky-50/50 transition-colors group">
                   <td className="px-4 py-3">
                     <div className="w-12 h-14 mx-auto rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                        {s.fotoUrl ? (
                          <img src={s.fotoUrl} alt={s.namaLengkap} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                             <Users className="w-6 h-6" />
                          </div>
                        )}
                     </div>
                   </td>
                   <td className="px-4 py-3">
                     <p className="font-extrabold text-[#1A5276] text-sm group-hover:text-[#2E86C1] transition-colors">{s.namaLengkap}</p>
                     <p className="font-mono text-[10px] text-gray-500 mt-0.5">{s.nis} · {s.jenisKelamin === 'L' ? 'Putra' : 'Putri'}</p>
                   </td>
                   <td className="px-4 py-3">
                     <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700">
                       <School className="w-3.5 h-3.5 text-[#1ABC9C]" />
                       {unitSekolahList.find(u => u.id === s.unitSekolahId)?.namaSekolah || '-'}
                     </div>
                     <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                       <Building2 className="w-3.5 h-3.5" />
                       {unitsPesantren.find(u => u.id === s.unitPesantrenId)?.namaUnit || '-'}
                     </div>
                   </td>
                   <td className="px-4 py-3">
                     <p className="text-[11px] font-bold text-gray-600 line-clamp-1">{s.desa || '-'}, {s.kabupaten || '-'}</p>
                     <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                       <Users className="w-3 h-3" /> {s.namaAyah || '-'}
                     </p>
                   </td>
                   <td className="px-4 py-3">
                     <div className="flex flex-col gap-1.5">
                        <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {s.status}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[9px] font-bold">{s.kategoriUtama}</span>
                          {s.golonganAsuh && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-bold">{s.golonganAsuh}</span>}
                          {s.program && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[9px] font-bold">{s.program}</span>}
                        </div>
                     </div>
                   </td>
                   <td className="px-4 py-3">
                     <div className="flex items-center justify-center gap-1">
                       <button onClick={() => handleOpenEdit(s)} className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-all">
                         <Edit2 className="w-3.5 h-3.5" />
                       </button>
                       <button onClick={() => { if(confirm(`Hapus data ${s.namaLengkap}?`)) deleteSantri(s.id); }} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all">
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSantri.length === 0 && (
          <div className="p-10 text-center">
             <Filter className="w-10 h-10 text-gray-200 mx-auto mb-3" />
             <p className="text-gray-400 font-bold">Tidak ada data santri yang cocok.</p>
          </div>
        )}
      </div>

      {/* Modal CRUD Integrasi 8 Form */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#1A5276] p-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1ABC9C]" />
                  {editSantriId ? `Edit Santri: ${formData.namaLengkap}` : 'Tambah Santri Baru (8 Form Integrasi)'}
                </h3>
                <p className="text-[11px] opacity-70">Kelola seluruh aspek data santri secara terpadu</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* 8 Form Tab Buttons */}
            <div className="flex items-center gap-1 bg-gray-50 p-1.5 border-b border-gray-100 overflow-x-auto text-[11px] font-bold">
              {[
                'Data Pribadi', 'Orang Tua/Wali', 'Sekolah Formal', 'Madin',
                'Asrama', 'Hafalan', 'UKS/Kesehatan', 'Berkas Digital'
              ].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setFormTab(i + 1)}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${formTab === i + 1 ? 'bg-[#1ABC9C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  {i + 1}. {label}
                </button>
              ))}
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSaveSantri} className="space-y-6">
                
                {/* TAB 1: DATA PRIBADI */}
                {formTab === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">NIK (KTP/KK) *</label>
                      <input type="text" required value={formData.nik || ''} onChange={e => setFormData({ ...formData, nik: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Nama Lengkap Santri *</label>
                      <input type="text" required value={formData.namaLengkap || ''} onChange={e => setFormData({ ...formData, namaLengkap: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tempat Lahir *</label>
                      <input type="text" required value={formData.tempatLahir || ''} onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tanggal Lahir *</label>
                      <input type="date" required value={formData.tanggalLahir || ''} onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Jenis Kelamin *</label>
                      <select value={formData.jenisKelamin || 'L'} onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none">
                        <option value="L">Laki-laki (Putra)</option>
                        <option value="P">Perempuan (Putri)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">No HP / WhatsApp Santri *</label>
                      <input type="text" value={formData.noHp || ''} onChange={e => setFormData({ ...formData, noHp: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>

                    {/* DROPDOWN BERTINGKAT WILAYAH */}
                    <div className="sm:col-span-2">
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="p-1 rounded bg-blue-500 text-white text-[8px]">📍</span> Alamat Tempat Tinggal
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-gray-600 mb-1">Provinsi</label>
                            <select
                              value={selectedProvinsiId}
                              onChange={e => {
                                const pId = e.target.value;
                                const namaProvinsi = dataWilayahIndonesia.find(p => p.id === pId)?.nama || '';
                                setSelectedProvinsiId(pId);
                                setSelectedKabupatenId('');
                                setSelectedKecamatanId('');
                                setFormData({ ...formData, provinsi: namaProvinsi, kabupaten: '', kecamatan: '' });
                              }}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                            >
                              <option value="">Pilih Provinsi</option>
                              {dataWilayahIndonesia.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-1">Kabupaten/Kota</label>
                            <select
                              value={selectedKabupatenId}
                              disabled={!selectedProvinsiId}
                              onChange={e => {
                                const kId = e.target.value;
                                const namaKab = availableKabupaten.find(k => k.id === kId)?.nama || '';
                                setSelectedKabupatenId(kId);
                                setSelectedKecamatanId('');
                                setFormData({ ...formData, kabupaten: namaKab, kecamatan: '' });
                              }}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50"
                            >
                              <option value="">Pilih Kabupaten</option>
                              {availableKabupaten.map(k => <option key={k.id} value={k.id}>{k.tipe} {k.nama}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-1">Kecamatan</label>
                            <select
                              value={selectedKecamatanId}
                              disabled={!selectedKabupatenId}
                              onChange={e => {
                                const kcId = e.target.value;
                                const namaKec = availableKecamatan.find(kc => kc.id === kcId)?.nama || '';
                                setSelectedKecamatanId(kcId);
                                setFormData({ ...formData, kecamatan: namaKec });
                              }}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50"
                            >
                              <option value="">Pilih Kecamatan</option>
                              {availableKecamatan.map(kc => <option key={kc.id} value={kc.id}>{kc.nama}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <div>
                             <label className="block font-bold text-gray-600 mb-1">Desa/Kelurahan</label>
                             <input
                               type="text"
                               value={formData.desa || ''}
                               onChange={e => setFormData({ ...formData, desa: e.target.value })}
                               placeholder="Nama Desa"
                               className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                             />
                           </div>
                           <div>
                             <label className="block font-bold text-gray-600 mb-1">Dusun/Lingkungan</label>
                             <input
                               type="text"
                               value={formData.dusun || ''}
                               onChange={e => setFormData({ ...formData, dusun: e.target.value })}
                               placeholder="Nama Dusun"
                               className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                             />
                           </div>
                           <div>
                             <label className="block font-bold text-gray-600 mb-1">Kode Pos</label>
                             <input
                               type="text"
                               value={formData.kodePos || ''}
                               onChange={e => setFormData({ ...formData, kodePos: e.target.value })}
                               placeholder="68xxx"
                               className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                             />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <div className="sm:col-span-2">
                             <label className="block font-bold text-gray-600 mb-1">Jalan / No. Rumah</label>
                             <input
                               type="text"
                               value={formData.alamat || ''}
                               onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                               placeholder="Jl. Raya No. XX"
                               className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                             />
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block font-bold text-gray-600 mb-1">RT</label>
                                <input
                                  type="text"
                                  value={formData.rt || ''}
                                  onChange={e => setFormData({ ...formData, rt: e.target.value })}
                                  placeholder="001"
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-gray-600 mb-1">RW</label>
                                <input
                                  type="text"
                                  value={formData.rw || ''}
                                  onChange={e => setFormData({ ...formData, rw: e.target.value })}
                                  placeholder="002"
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                                />
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* STATUS SANTRI BERTINGKAT 4-LEVEL */}
                    <div className="sm:col-span-2">
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="p-1 rounded bg-[#1ABC9C] text-white text-[8px]">🎓</span> Status Santri / Anak Didik
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">1. Kategori *</label>
                            <select
                              value={statusLevel1}
                              onChange={e => {
                                const val = e.target.value as 'Santri' | 'Desa' | '';
                                setStatusLevel1(val);
                                setStatusLevel2(''); setStatusLevel3(''); setStatusLevel4('');
                                if (val === 'Desa') {
                                  setFormData({ ...formData, kategoriUtama: 'Desa', tipeAsuh: null, golonganAsuh: null, program: null });
                                } else {
                                  setFormData({ ...formData, kategoriUtama: 'Santri' });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] outline-none"
                            >
                              <option value="">Pilih Kategori</option>
                              <option value="Santri">Santri (Pondok)</option>
                              <option value="Desa">Desa (Sekolah saja)</option>
                            </select>
                          </div>

                          {statusLevel1 === 'Santri' && (
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">2. Tipe Asuh *</label>
                              <select
                                value={statusLevel2}
                                onChange={e => {
                                  const val = e.target.value as 'Asuh' | 'Bukan Asuh' | '';
                                  setStatusLevel2(val);
                                  setStatusLevel3(''); setStatusLevel4('');
                                  setFormData({ ...formData, tipeAsuh: val || null, golonganAsuh: null, program: null });
                                }}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] outline-none"
                              >
                                <option value="">Pilih Tipe</option>
                                <option value="Bukan Asuh">Bukan Asuh</option>
                                <option value="Asuh">Asuh</option>
                              </select>
                            </div>
                          )}

                          {statusLevel1 === 'Santri' && statusLevel2 === 'Asuh' && (
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">3. Golongan *</label>
                              <select
                                value={statusLevel3}
                                onChange={e => {
                                  const val = e.target.value as 'A1' | 'A2' | 'A3' | '';
                                  setStatusLevel3(val);
                                  setStatusLevel4('');
                                  setFormData({ ...formData, golonganAsuh: val || null, program: null });
                                }}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] outline-none"
                              >
                                <option value="">Pilih Golongan</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="A3">A3</option>
                              </select>
                            </div>
                          )}

                          {statusLevel1 === 'Santri' && (statusLevel2 === 'Bukan Asuh' || (statusLevel2 === 'Asuh' && statusLevel3)) && (
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">4. Program *</label>
                              <select
                                value={statusLevel4}
                                onChange={e => {
                                  const val = e.target.value as 'Pengabdian' | 'Lulus' | 'Pelajar' | '';
                                  setStatusLevel4(val);
                                  setFormData({ ...formData, program: val || null });
                                }}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] outline-none"
                              >
                                <option value="">Pilih Program</option>
                                <option value="Pengabdian">Pengabdian</option>
                                <option value="Lulus">Lulus</option>
                                <option value="Pelajar">Pelajar</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* INFO UNIT JIKA PELAJAR */}
                        {statusLevel4 === 'Pelajar' && (
                           <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                              <div className="p-2 bg-amber-500 text-white rounded-lg"><School className="w-4 h-4" /></div>
                              <p className="text-[11px] text-amber-800 leading-snug">
                                <strong>PENTING:</strong> Karena memilih <strong>Pelajar</strong>, pastikan Anda mengisi data <strong>Unit Sekolah</strong> (Tab 3) dan <strong>Unit Pesantren</strong> (Tab 5) dengan benar.
                              </p>
                           </div>
                        )}
                        
                        {(formData.kategoriUtama || formData.program) && (
                          <div className="flex items-center gap-2">
                             <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${formData.kategoriUtama === 'Santri' ? 'bg-[#1A5276] text-white' : 'bg-emerald-500 text-white'}`}>
                                {formData.kategoriUtama}
                             </div>
                             {formData.tipeAsuh && <span className="text-gray-400 text-[10px]">/</span>}
                             {formData.tipeAsuh && <span className="text-[10px] font-bold text-gray-600">{formData.tipeAsuh}</span>}
                             {formData.golonganAsuh && <span className="text-gray-400 text-[10px]">/</span>}
                             {formData.golonganAsuh && <span className="text-[10px] font-bold text-[#1ABC9C]">{formData.golonganAsuh}</span>}
                             {formData.program && <span className="text-gray-400 text-[10px]">/</span>}
                             {formData.program && <span className="text-[10px] font-black text-purple-600 underline uppercase">{formData.program}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ORANG TUA / WALI */}
                {formTab === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Data Ayah Kandung</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Nama Ayah *</label>
                          <input type="text" required value={formData.namaAyah || ''} onChange={e => setFormData({ ...formData, namaAyah: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">NIK Ayah</label>
                          <input type="text" inputMode="numeric" value={formData.nikAyah || ''} onChange={e => setFormData({ ...formData, nikAyah: e.target.value })} placeholder="3510xxxxxxxxxxxx" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Pekerjaan Ayah</label>
                          <input type="text" value={formData.pekerjaanAyah || ''} onChange={e => setFormData({ ...formData, pekerjaanAyah: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Penghasilan Ayah</label>
                          <select value={formData.penghasilanAyah || ''} onChange={e => setFormData({ ...formData, penghasilanAyah: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none">
                            <option value="">Pilih Penghasilan</option>
                            <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                            <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                            <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                            <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Data Ibu Kandung</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Nama Ibu *</label>
                          <input type="text" required value={formData.namaIbu || ''} onChange={e => setFormData({ ...formData, namaIbu: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">NIK Ibu</label>
                          <input type="text" inputMode="numeric" value={formData.nikIbu || ''} onChange={e => setFormData({ ...formData, nikIbu: e.target.value })} placeholder="3510xxxxxxxxxxxx" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-[#1ABC9C] outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">No HP Orang Tua (WhatsApp) *</label>
                      <input type="text" required value={formData.noHpOrtu || ''} onChange={e => setFormData({ ...formData, noHpOrtu: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1ABC9C] outline-none" />
                    </div>
                  </div>
                )}

                {/* TAB 3: SEKOLAH FORMAL */}
                {formTab === 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Unit Sekolah *</label>
                      <select value={formData.unitSekolahId || ''} onChange={e => setFormData({ ...formData, unitSekolahId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none">
                        <option value="">Pilih Unit Sekolah</option>
                        {unitSekolahList.map(u => <option key={u.id} value={u.id}>{u.namaSekolah}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Kelas Sekolah *</label>
                      <select value={formData.kelasSekolahId || ''} onChange={e => setFormData({ ...formData, kelasSekolahId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none">
                        <option value="">Pilih Kelas</option>
                        {kelasSekolahList.filter(k => k.sekolahId === formData.unitSekolahId).map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2 p-4 bg-sky-50 rounded-2xl border border-sky-100">
                       <div className="flex items-center gap-2 mb-3">
                          <BookOpenCheck className="w-4 h-4 text-sky-600" />
                          <p className="font-black text-sky-800 uppercase tracking-widest text-[10px]">Riwayat Pendidikan Sebelumnya</p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                             <label className="block font-bold text-gray-600 mb-1 text-[10px]">Sekolah Asal</label>
                             <input type="text" value={formData.sekolahAsal || ''} onChange={e => setFormData({ ...formData, sekolahAsal: e.target.value })} className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl outline-none" />
                          </div>
                          <div>
                             <label className="block font-bold text-gray-600 mb-1 text-[10px]">Tahun Lulus</label>
                             <input type="text" value={formData.tahunLulusSekolahAsal || ''} onChange={e => setFormData({ ...formData, tahunLulusSekolahAsal: e.target.value })} className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl outline-none" />
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MADIN */}
                {formTab === 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Marhalah Madin *</label>
                      <select value={formData.marhalahMadinId || ''} onChange={e => setFormData({ ...formData, marhalahMadinId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="">Pilih Marhalah</option>
                        {marhalahList.map(m => <option key={m.id} value={m.id}>{m.namaMarhalah}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Kelas Madin *</label>
                      <select value={formData.kelasMadinId || ''} onChange={e => setFormData({ ...formData, kelasMadinId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="">Pilih Kelas</option>
                        {kelasMadinList.filter(k => k.marhalahId === formData.marhalahMadinId).map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* TAB 5: ASRAMA */}
                {formTab === 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Unit Pesantren *</label>
                      <select value={formData.unitPesantrenId || ''} onChange={e => setFormData({ ...formData, unitPesantrenId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="">Pilih Unit</option>
                        {unitsPesantren.map(u => <option key={u.id} value={u.id}>{u.namaUnit}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Asrama *</label>
                      <select value={formData.asramaId || ''} onChange={e => setFormData({ ...formData, asramaId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="">Pilih Asrama</option>
                        {asramaList.filter(a => a.unitPesantrenId === formData.unitPesantrenId).map(a => <option key={a.id} value={a.id}>{a.namaAsrama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Kamar *</label>
                      <select value={formData.kamarId || ''} onChange={e => setFormData({ ...formData, kamarId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="">Pilih Kamar</option>
                        {kamarList.filter(k => k.asramaId === formData.asramaId).map(k => <option key={k.id} value={k.id}>{k.namaKamar}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* TAB 6: HAFALAN */}
                {formTab === 6 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 sm:col-span-2">
                       <div className="flex items-center gap-2 mb-4">
                          <BookMarked className="w-4 h-4 text-emerald-600" />
                          <p className="font-black text-emerald-800 uppercase tracking-widest text-[10px]">Target & Capaian Quran</p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-gray-600 mb-1">Target Hafalan (Juz)</label>
                            <input type="number" value={formData.targetJuz || 30} onChange={e => setFormData({ ...formData, targetJuz: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl outline-none" />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-1">Capaian Saat Ini (Juz)</label>
                            <input type="number" value={formData.capaianJuz || 0} onChange={e => setFormData({ ...formData, capaianJuz: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl outline-none" />
                          </div>
                       </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Capaian Setoran Nadhoman</label>
                      <input type="text" value={formData.capaianNadhoman || ''} onChange={e => setFormData({ ...formData, capaianNadhoman: e.target.value })} placeholder="cth: Aqidatul Awam Selesai, Imriti Bait 200" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                    </div>
                  </div>
                )}

                {/* TAB 7: UKS / KESEHATAN */}
                {formTab === 7 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Golongan Darah</label>
                      <select value={formData.golonganDarah || 'O'} onChange={e => setFormData({ ...formData, golonganDarah: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Kondisi Saat Ini *</label>
                      <select value={formData.kondisiSaatIni || 'Sehat'} onChange={e => setFormData({ ...formData, kondisiSaatIni: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="Sehat">Sehat Wal Afiat</option>
                        <option value="Dalam Perawatan">Dalam Perawatan UKS</option>
                        <option value="Pemulihan">Masa Pemulihan</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1 text-[10px] flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Riwayat Penyakit & Alergi</label>
                      <textarea value={formData.riwayatPenyakit || ''} onChange={e => setFormData({ ...formData, riwayatPenyakit: e.target.value })} rows={3} placeholder="Sebutkan penyakit kronis, alergi obat/makanan jika ada..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                    </div>
                  </div>
                )}

                {/* TAB 8: BERKAS DIGITAL */}
                {formTab === 8 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                       <div className="w-24 h-32 rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                          {formData.fotoUrl ? <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-200" />}
                       </div>
                       <div className="flex-1 space-y-2">
                          <label className="block font-bold text-gray-700">URL Foto Profil Santri</label>
                          <input type="text" value={formData.fotoUrl || ''} onChange={e => setFormData({ ...formData, fotoUrl: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none" />
                          <p className="text-[10px] text-gray-400 italic">Gunakan link gambar publik (Unsplash/Cloudinary) untuk demonstrasi.</p>
                       </div>
                    </div>

                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
                      <p className="font-black text-blue-800 uppercase tracking-widest text-[10px]">Verifikasi Berkas Fisik</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'statusBerkasKK', label: 'Fotokopi KK' },
                          { id: 'statusBerkasAkta', label: 'Akta Kelahiran' },
                          { id: 'statusBerkasIjazah', label: 'Ijazah Terakhir' }
                        ].map(item => (
                          <label key={item.id} className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                            <input
                              type="checkbox"
                              checked={Boolean((formData as any)[item.id])}
                              onChange={e => setFormData({ ...formData, [item.id]: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-bold text-gray-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer Navigation */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                 {formTab > 1 && (
                   <button onClick={() => setFormTab(formTab - 1)} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all">
                     Kembali
                   </button>
                 )}
              </div>
              <div className="flex gap-2">
                {formTab < 8 ? (
                  <button onClick={() => setFormTab(formTab + 1)} className="px-5 py-2 bg-[#2E86C1] hover:bg-[#1A5276] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                    Lanjut Form {formTab + 1}
                  </button>
                ) : (
                  <button onClick={handleSaveSantri} className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                    Simpan Data Lengkap
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
