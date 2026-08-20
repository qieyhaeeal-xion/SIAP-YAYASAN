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
    statusBerkasIjazah: true
  });

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

    // Filter Madin / Kelas
    if (filterMarhalah !== 'ALL' && s.marhalahMadinId !== filterMarhalah) return false;
    if (filterKelasMadin !== 'ALL' && s.kelasMadinId !== filterKelasMadin) return false;

    // Filter Sekolah Formal
    if (filterSekolah !== 'ALL' && s.unitSekolahId !== filterSekolah) return false;
    if (filterKelasSekolah !== 'ALL' && s.kelasSekolahId !== filterKelasSekolah) return false;

    return true;
  });

  const handleOpenAdd = () => {
    setEditSantriId(null);
    setFormTab(1);
    // Reset wilayah dropdowns
    setSelectedProvinsiId('');
    setSelectedKabupatenId('');
    setSelectedKecamatanId('');
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
      statusBerkasIjazah: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditSantriId(s.id);
    setFormTab(1);
    setFormData({ ...s });
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
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <Users className="w-7 h-7 text-[#1ABC9C]" />
            Data Induk Santri (8 Sub-Form Integrasi)
          </h2>
          <p className="text-sm text-[#566573] mt-1">
            Sistem Satu Atap Data Santri, Wali, Sekolah, Madin, Asrama, Hafalan, Kesehatan & Berkas Digital
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-sm rounded-lg shadow flex items-center gap-2.5 transition-all shrink-0 animate-pulse hover:animate-none"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Santri Baru</span>
        </button>
      </div>

      {/* FILTER BERTINGKAT SECTION */}
      <div className="bg-sky-50 border border-sky-200 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-extrabold text-[#1A5276]">
            <Filter className="w-5 h-5 text-[#1ABC9C]" />
            <span>FILTER BERTINGKAT SIAP (ASRAMA, MADIN, SEKOLAH)</span>
          </div>
          <span className="text-xs font-bold text-[#1A5276] bg-white px-3 py-1 rounded border border-sky-200">
            Ditemukan: {filteredSantri.length} Santri
          </span>
        </div>

        {/* 3 Step Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 1: Filter Pesantren & Asrama */}
          <div className="bg-white p-4 rounded-lg border border-sky-200 space-y-2.5">
            <span className="text-xs font-extrabold text-[#1A5276] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1ABC9C]" />
              1. Asrama & Kamar
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={filterUnitPesantren}
                onChange={e => {
                  setFilterUnitPesantren(e.target.value);
                  setFilterAsrama('ALL');
                  setFilterKamar('ALL');
                }}
                className="col-span-1 px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Unit</option>
                {unitsPesantren.map(u => (<option key={u.id} value={u.id}>{u.namaUnit}</option>))}
              </select>

              <select
                value={filterAsrama}
                onChange={e => {
                  setFilterAsrama(e.target.value);
                  setFilterKamar('ALL');
                }}
                className="col-span-1 px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Asrama</option>
                {availableAsramaFilter.map(a => (<option key={a.id} value={a.id}>{a.namaAsrama}</option>))}
              </select>

              <select
                value={filterKamar}
                onChange={e => setFilterKamar(e.target.value)}
                className="col-span-1 px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Kamar</option>
                {availableKamarFilter.map(k => (<option key={k.id} value={k.id}>{k.namaKamar}</option>))}
              </select>
            </div>
          </div>

          {/* Step 2: Filter Madin */}
          <div className="bg-white p-4 rounded-lg border border-sky-200 space-y-2.5">
            <span className="text-xs font-extrabold text-[#1A5276] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#1ABC9C]" />
              2. Marhalah & Kelas Madin
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={filterMarhalah}
                onChange={e => {
                  setFilterMarhalah(e.target.value);
                  setFilterKelasMadin('ALL');
                }}
                className="px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Marhalah</option>
                {marhalahList.map(m => (<option key={m.id} value={m.id}>{m.namaMarhalah}</option>))}
              </select>

              <select
                value={filterKelasMadin}
                onChange={e => setFilterKelasMadin(e.target.value)}
                className="px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Kelas</option>
                {availableKelasMadinFilter.map(km => (<option key={km.id} value={km.id}>{km.namaKelas}</option>))}
              </select>
            </div>
          </div>

          {/* Step 3: Filter Sekolah Formal */}
          <div className="bg-white p-4 rounded-lg border border-sky-200 space-y-2.5">
            <span className="text-xs font-extrabold text-[#1A5276] uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-4 h-4 text-[#1ABC9C]" />
              3. Unit Formal & Kelas Formal
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={filterSekolah}
                onChange={e => {
                  setFilterSekolah(e.target.value);
                  setFilterKelasSekolah('ALL');
                }}
                className="px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Sekolah</option>
                {unitSekolahList.map(s => (<option key={s.id} value={s.id}>{s.namaSekolah}</option>))}
              </select>

              <select
                value={filterKelasSekolah}
                onChange={e => setFilterKelasSekolah(e.target.value)}
                className="px-2 py-1.5 text-xs bg-sky-50/50 border border-gray-300 rounded font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Kelas</option>
                {availableKelasSekolahFilter.map(ks => (<option key={ks.id} value={ks.id}>{ks.namaKelas}</option>))}
              </select>
            </div>
          </div>

        </div>

        {/* Quick Search Input */}
        <div className="relative pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ketik Nama Santri, NIS, NIK, atau Alamat..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ABC9C]"
          />
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* SANTRI DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                <th className="p-4">NIS / Santri</th>
                <th className="p-4">Asrama & Kamar</th>
                <th className="p-4">Madin</th>
                <th className="p-4">Sekolah Formal</th>
                <th className="p-4">Capaian Hafalan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi (8 Form)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSantri.map(s => {
                const asrama = asramaList.find(a => a.id === s.asramaId);
                const kamar = kamarList.find(k => k.id === s.kamarId);
                const marhalah = marhalahList.find(m => m.id === s.marhalahMadinId);
                const kelasMadin = kelasMadinList.find(km => km.id === s.kelasMadinId);
                const sekolah = unitSekolahList.find(us => us.id === s.unitSekolahId);
                const kelasSekolah = kelasSekolahList.find(ks => ks.id === s.kelasSekolahId);

                return (
                  <tr key={s.id} className="hover:bg-sky-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={s.namaLengkap}
                          className="w-10 h-10 rounded-full object-cover border border-sky-300"
                        />
                        <div>
                          <p className="font-extrabold text-[#1A5276] text-base">{s.namaLengkap}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">NIS: {s.nis} • NIK: {s.nik}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-base">{asrama?.namaAsrama || '-'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kamar?.namaKamar || '-'}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-[#1A5276] text-base">{marhalah?.namaMarhalah || '-'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kelasMadin?.namaKelas || '-'}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-base">{sekolah?.namaSekolah || '-'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kelasSekolah?.namaKelas || '-'}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-amber-700 text-base">{s.capaianJuz} / {s.targetJuz} Juz</p>
                      <p className="text-xs text-cyan-800 mt-0.5 font-semibold">{s.capaianNadhoman || 'Setoran Nadhoman'}</p>
                    </td>

                    <td className="p-4">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="px-3.5 py-1.5 bg-[#1A5276] text-white hover:bg-[#2E86C1] rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
                          title="Buka 8 Sub-Form Edit Detail"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Detail Form</span>
                        </button>
                        <button
                          onClick={() => { if (confirm(`Hapus santri ${s.namaLengkap}?`)) deleteSantri(s.id); }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded"
                          title="Hapus Santri"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 8-SUB-FORM EDIT / TAMBAH SANTRI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-5 space-y-4 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="font-extrabold text-sm text-[#1A5276] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1ABC9C]" />
                  {editSantriId ? `Edit Santri: ${formData.namaLengkap}` : 'Tambah Santri Baru (8 Form Integrasi)'}
                </h3>
                <p className="text-[11px] text-gray-500">Kelola seluruh aspek data santri secara terpadu</p>
              </div>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            {/* 8 Form Tab Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto text-[11px] font-bold">
              <button
                onClick={() => setFormTab(1)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 1 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                1. Data Pribadi
              </button>
              <button
                onClick={() => setFormTab(2)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 2 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                2. Orang Tua/Wali
              </button>
              <button
                onClick={() => setFormTab(3)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 3 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                3. Sekolah Formal
              </button>
              <button
                onClick={() => setFormTab(4)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 4 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                4. Madin
              </button>
              <button
                onClick={() => setFormTab(5)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 5 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                5. Asrama
              </button>
              <button
                onClick={() => setFormTab(6)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 6 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                6. Hafalan
              </button>
              <button
                onClick={() => setFormTab(7)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 7 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                7. UKS/Kesehatan
              </button>
              <button
                onClick={() => setFormTab(8)}
                className={`px-2.5 py-1.5 rounded transition-all shrink-0 ${formTab === 8 ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                8. Berkas Digital
              </button>
            </div>

            {/* Form Content Area */}
            <form onSubmit={handleSaveSantri} className="space-y-4 pt-2">
              
              {/* TAB 1: DATA PRIBADI */}
              {formTab === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">NIK (KTP/KK) *</label>
                    <input type="text" required value={formData.nik || ''} onChange={e => setFormData({ ...formData, nik: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Lengkap Santri *</label>
                    <input type="text" required value={formData.namaLengkap || ''} onChange={e => setFormData({ ...formData, namaLengkap: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tempat Lahir *</label>
                    <input type="text" required value={formData.tempatLahir || ''} onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tanggal Lahir *</label>
                    <input type="date" required value={formData.tanggalLahir || ''} onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jenis Kelamin *</label>
                    <select value={formData.jenisKelamin || 'L'} onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      <option value="L">Laki-laki (Putra)</option>
                      <option value="P">Perempuan (Putri)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">No HP / WhatsApp Santri *</label>
                    <input type="text" value={formData.noHp || ''} onChange={e => setFormData({ ...formData, noHp: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  {/* DROPDOWN BERTINGKAT WILAYAH */}
                  <div className="sm:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2.5">
                      <p className="text-[10px] font-extrabold text-[#1A5276] uppercase tracking-wider flex items-center gap-1">
                        <span>📍</span> Alamat Tempat Tinggal
                      </p>

                      {/* Row 1: Provinsi, Kabupaten, Kecamatan */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Provinsi */}
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Provinsi *</label>
                          <select
                            required
                            value={selectedProvinsiId}
                            onChange={e => {
                              const newProvinsiId = e.target.value;
                              const namaProvinsi = dataWilayahIndonesia.find(p => p.id === newProvinsiId)?.nama || '';
                              setSelectedProvinsiId(newProvinsiId);
                              setSelectedKabupatenId('');
                              setSelectedKecamatanId('');
                              setFormData({ ...formData, provinsi: namaProvinsi, kabupaten: '', kecamatan: '' });
                            }}
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg bg-white text-[11px] font-semibold text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                          >
                            <option value="">-- Pilih Provinsi --</option>
                            {dataWilayahIndonesia.map(p => (
                              <option key={p.id} value={p.id}>{p.nama}</option>
                            ))}
                          </select>
                        </div>

                        {/* Kabupaten / Kota */}
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Kabupaten / Kota *</label>
                          <select
                            required
                            value={selectedKabupatenId}
                            disabled={!selectedProvinsiId}
                            onChange={e => {
                              const newKabId = e.target.value;
                              const kab = availableKabupaten.find(k => k.id === newKabId);
                              const namaKab = kab ? `${kab.tipe} ${kab.nama}` : '';
                              setSelectedKabupatenId(newKabId);
                              setSelectedKecamatanId('');
                              setFormData({ ...formData, kabupaten: namaKab, kecamatan: '' });
                            }}
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg bg-white text-[11px] font-semibold text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <option value="">-- Pilih Kab/Kota --</option>
                            {availableKabupaten.map(k => (
                              <option key={k.id} value={k.id}>{k.tipe} {k.nama}</option>
                            ))}
                          </select>
                        </div>

                        {/* Kecamatan */}
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Kecamatan *</label>
                          <select
                            required
                            value={selectedKecamatanId}
                            disabled={!selectedKabupatenId}
                            onChange={e => {
                              const newKecId = e.target.value;
                              const namaKec = availableKecamatan.find(kc => kc.id === newKecId)?.nama || '';
                              setSelectedKecamatanId(newKecId);
                              setFormData({ ...formData, kecamatan: namaKec });
                            }}
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg bg-white text-[11px] font-semibold text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <option value="">-- Pilih Kecamatan --</option>
                            {availableKecamatan.map(kc => (
                              <option key={kc.id} value={kc.id}>{kc.nama}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Desa, Dusun, Kode Pos */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Desa / Kelurahan</label>
                          <input
                            type="text"
                            value={formData.desa || ''}
                            onChange={e => setFormData({ ...formData, desa: e.target.value })}
                            placeholder="Nama Desa/Kel."
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Dusun</label>
                          <input
                            type="text"
                            value={formData.dusun || ''}
                            onChange={e => setFormData({ ...formData, dusun: e.target.value })}
                            placeholder="Nama Dusun"
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Kode Pos</label>
                          <input
                            type="text"
                            value={formData.kodePos || ''}
                            onChange={e => setFormData({ ...formData, kodePos: e.target.value })}
                            placeholder="68464"
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* Row 3: Jalan, RT, RW */}
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        <div className="sm:col-span-3">
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">Jalan / Alamat Detail</label>
                          <input
                            type="text"
                            value={formData.alamat || ''}
                            onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                            placeholder="Jl. Raya Pesantren No. 1"
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">RT</label>
                          <input
                            type="text"
                            value={formData.rt || ''}
                            onChange={e => setFormData({ ...formData, rt: e.target.value })}
                            placeholder="001"
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1 text-[11px]">RW</label>
                          <input
                            type="text"
                            value={formData.rw || ''}
                            onChange={e => setFormData({ ...formData, rw: e.target.value })}
                            placeholder="001"
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* Preview Alamat Lengkap */}
                      {(formData.provinsi || formData.kabupaten || formData.kecamatan) && (
                        <div className="bg-white border border-blue-200 rounded-lg px-3 py-2">
                          <p className="text-[10px] font-bold text-blue-600 mb-0.5">📋 Preview Alamat:</p>
                          <p className="text-[11px] text-gray-700">
                            {[formData.alamat, formData.dusun && `Dusun ${formData.dusun}`, formData.rt && `RT ${formData.rt}`, formData.rw && `RW ${formData.rw}`, formData.desa, formData.kecamatan && `Kec. ${formData.kecamatan}`, formData.kabupaten, formData.provinsi, formData.kodePos].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORANG TUA / WALI */}
              {formTab === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Ayah Kandung *</label>
                    <input type="text" required value={formData.namaAyah || ''} onChange={e => setFormData({ ...formData, namaAyah: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pekerjaan Ayah</label>
                    <input type="text" value={formData.pekerjaanAyah || ''} onChange={e => setFormData({ ...formData, pekerjaanAyah: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Ibu Kandung *</label>
                    <input type="text" required value={formData.namaIbu || ''} onChange={e => setFormData({ ...formData, namaIbu: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pekerjaan Ibu</label>
                    <input type="text" value={formData.pekerjaanIbu || ''} onChange={e => setFormData({ ...formData, pekerjaanIbu: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">No HP WhatsApp Wali Santri *</label>
                    <input type="text" required value={formData.noHpOrtu || ''} onChange={e => setFormData({ ...formData, noHpOrtu: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              )}

              {/* TAB 3: SEKOLAH FORMAL */}
              {formTab === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Unit Sekolah Formal *</label>
                    <select value={formData.unitSekolahId || ''} onChange={e => setFormData({ ...formData, unitSekolahId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {unitSekolahList.map(s => (<option key={s.id} value={s.id}>{s.namaSekolah}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kelas Formal *</label>
                    <select value={formData.kelasSekolahId || ''} onChange={e => setFormData({ ...formData, kelasSekolahId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {kelasSekolahList.map(ks => (<option key={ks.id} value={ks.id}>{ks.namaKelas}</option>))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 4: MADRASAH DINIYAH */}
              {formTab === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Marhalah Madin *</label>
                    <select value={formData.marhalahMadinId || ''} onChange={e => setFormData({ ...formData, marhalahMadinId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {marhalahList.map(m => (<option key={m.id} value={m.id}>{m.namaMarhalah}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kelas Diniyah *</label>
                    <select value={formData.kelasMadinId || ''} onChange={e => setFormData({ ...formData, kelasMadinId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {kelasMadinList.map(km => (<option key={km.id} value={km.id}>{km.namaKelas}</option>))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 5: ASRAMA & KAMAR */}
              {formTab === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Unit Pesantren *</label>
                    <select value={formData.unitPesantrenId || ''} onChange={e => setFormData({ ...formData, unitPesantrenId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {unitsPesantren.map(u => (<option key={u.id} value={u.id}>{u.namaUnit}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Asrama *</label>
                    <select value={formData.asramaId || ''} onChange={e => setFormData({ ...formData, asramaId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {asramaList.map(a => (<option key={a.id} value={a.id}>{a.namaAsrama}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kamar *</label>
                    <select value={formData.kamarId || ''} onChange={e => setFormData({ ...formData, kamarId: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg">
                      {kamarList.map(k => (<option key={k.id} value={k.id}>{k.namaKamar}</option>))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 6: HAFALAN TAHFIDZ & NADHOMAN */}
              {formTab === 6 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Target Hafalan Quran (Juz)</label>
                    <input type="number" value={formData.targetJuz || 30} onChange={e => setFormData({ ...formData, targetJuz: Number(e.target.value) })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Capaian Saat Ini (Juz)</label>
                    <input type="number" value={formData.capaianJuz || 0} onChange={e => setFormData({ ...formData, capaianJuz: Number(e.target.value) })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Capaian Setoran Nadhoman Kitab</label>
                    <input type="text" value={formData.capaianNadhoman || ''} onChange={e => setFormData({ ...formData, capaianNadhoman: e.target.value })} placeholder="e.g. Imriti Bait ke-250 / Alfiyah Selesai" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              )}

              {/* TAB 7: UKS / KESEHATAN */}
              {formTab === 7 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Golongan Darah</label>
                    <input type="text" value={formData.golonganDarah || 'O'} onChange={e => setFormData({ ...formData, golonganDarah: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Riwayat Penyakit Khusus</label>
                    <input type="text" value={formData.riwayatPenyakit || ''} onChange={e => setFormData({ ...formData, riwayatPenyakit: e.target.value })} placeholder="e.g. Asma / Tipes / Alergi" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              )}

              {/* TAB 8: BERKAS DIGITAL */}
              {formTab === 8 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">URL Foto Profil Santri</label>
                    <input type="text" value={formData.fotoUrl || ''} onChange={e => setFormData({ ...formData, fotoUrl: e.target.value })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg" />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <p className="font-bold text-gray-800">Status Verifikasi Berkas Fisik / Digital:</p>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <input type="checkbox" checked={Boolean(formData.statusBerkasKK)} onChange={e => setFormData({ ...formData, statusBerkasKK: e.target.checked })} />
                        <span>Fotokopi KK</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <input type="checkbox" checked={Boolean(formData.statusBerkasAkta)} onChange={e => setFormData({ ...formData, statusBerkasAkta: e.target.checked })} />
                        <span>Akta Kelahiran</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <input type="checkbox" checked={Boolean(formData.statusBerkasIjazah)} onChange={e => setFormData({ ...formData, statusBerkasIjazah: e.target.checked })} />
                        <span>Ijazah Terakhir</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  {formTab > 1 && (
                    <button type="button" onClick={() => setFormTab(formTab - 1)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-lg">
                      &laquo; Sebeleumnya
                    </button>
                  )}
                  {formTab < 8 && (
                    <button type="button" onClick={() => setFormTab(formTab + 1)} className="px-3 py-1.5 bg-[#2E86C1] text-white text-xs font-bold rounded-lg">
                      Berikutnya &raquo;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg">
                    BATAL
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-xs font-bold rounded-lg shadow">
                    SIMPAN SEMUA FORM
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
