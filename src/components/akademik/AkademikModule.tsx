import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, Save, CheckCircle2, Settings2, AlertCircle } from 'lucide-react';

export const AkademikModule: React.FC = () => {
  const { santriList, presensiList, savePresensiBatch, unitSekolahList, kelasMadinList, jurusanList, kelasSekolahList } = useApp();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(true);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<'KBM_Madin' | 'KBM_Sekolah'>('KBM_Madin');

  // unitFilter ditentukan otomatis dari kategori
  const unitFilter: 'Formal' | 'Non Formal' = kategori === 'KBM_Sekolah' ? 'Formal' : 'Non Formal';
  const [kelasNonFormal, setKelasNonFormal] = useState('Semua');
  const [unitFormal, setUnitFormal] = useState('Semua');

  // New States for Formal Schools
  const [kelasFormal, setKelasFormal] = useState('Semua');
  const [jurusanFormal, setJurusanFormal] = useState('Semua');

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  let filteredSantri = activeSantri;

  if (unitFilter === 'Formal' && unitFormal !== 'Semua') {
    const selectedUnit = unitSekolahList.find(u => u.kodeSekolah.toLowerCase() === unitFormal.toLowerCase() || u.namaSekolah.toLowerCase().includes(unitFormal.toLowerCase()));
    if (selectedUnit) {
      filteredSantri = filteredSantri.filter(s => s.unitSekolahId === selectedUnit.id);

      // Filter by Jurusan for SLTA
      if ((unitFormal === 'MA' || unitFormal === 'SMK') && jurusanFormal !== 'Semua') {
        const matchingJurusan = jurusanList.find(j => j.kodeJurusan.toLowerCase() === jurusanFormal.toLowerCase() || j.namaJurusan.toLowerCase().includes(jurusanFormal.toLowerCase()));
        if (matchingJurusan) {
          filteredSantri = filteredSantri.filter(s => s.jurusanId === matchingJurusan.id);
        } else {
          filteredSantri = [];
        }
      }

      // Filter by Kelas Formal
      if (kelasFormal !== 'Semua') {
        const romanClass = kelasFormal === '7' ? 'VII' : kelasFormal === '8' ? 'VIII' : kelasFormal === '9' ? 'IX' : kelasFormal === '10' ? 'X' : kelasFormal === '11' ? 'XI' : 'XII';
        const matchingKelasIds = kelasSekolahList
          .filter(k => k.kodeKelas.includes(romanClass) || k.namaKelas.includes(romanClass))
          .map(k => k.id);

        if (matchingKelasIds.length > 0) {
          filteredSantri = filteredSantri.filter(s => matchingKelasIds.includes(s.kelasSekolahId));
        } else {
          filteredSantri = [];
        }
      }

    } else {
      filteredSantri = [];
    }
  } else if (unitFilter === 'Non Formal' && kelasNonFormal !== 'Semua') {
    const matchingKelasIds = kelasMadinList
      .filter(k => k.namaKelas.toLowerCase().includes(kelasNonFormal.toLowerCase()))
      .map(k => k.id);

    if (matchingKelasIds.length > 0) {
      filteredSantri = filteredSantri.filter(s => matchingKelasIds.includes(s.kelasMadinId));
    } else {
      filteredSantri = [];
    }
  }

  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'>>(() => {
    const initialMap: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'> = {};
    activeSantri.forEach(s => {
      initialMap[s.id] = 'Hadir';
    });
    return initialMap;
  });

  useEffect(() => {
    setAttendanceMap(prev => {
      const newMap = { ...prev };
      filteredSantri.forEach(s => {
        if (!newMap[s.id]) newMap[s.id] = 'Hadir';
      });
      return newMap;
    });
  }, [filteredSantri]);

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleStatusChange = (santriId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    setAttendanceMap(prev => ({ ...prev, [santriId]: status }));
  };

  const handleSaveBatch = () => {
    const records = filteredSantri.map(s => ({
      santriId: s.id,
      tanggal,
      kategori,
      status: attendanceMap[s.id] || 'Hadir'
    }));

    savePresensiBatch(records);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  // Validation Logic
  const isSLTA = unitFormal === 'MA' || unitFormal === 'SMK';
  const isSLTP = unitFormal === 'MTs' || unitFormal === 'SMP';

  const isFilterValid =
    (unitFilter === 'Non Formal' && kelasNonFormal !== 'Semua') ||
    (unitFilter === 'Formal' && unitFormal !== 'Semua' && (
      (isSLTP && kelasFormal !== 'Semua') ||
      (isSLTA && jurusanFormal !== 'Semua' && kelasFormal !== 'Semua')
    ));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* MODAL PENGATURAN PRESENSI */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#1A5276] text-white">
              <h3 className="font-extrabold text-xl flex items-center gap-3">
                <Settings2 className="w-7 h-7 text-[#1ABC9C]" />
                Pengaturan Sesi Presensi
              </h3>
              <p className="text-sky-100 text-sm mt-1.5">Tentukan tanggal, unit, dan kelas sebelum memulai absensi.</p>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-[#1A5276] mb-2">Tanggal Presensi</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A5276] mb-2">Kategori Presensi</label>
                <select
                  value={kategori}
                  onChange={e => {
                    setKategori(e.target.value as any);
                    setKelasNonFormal('Semua');
                    setUnitFormal('Semua');
                    setKelasFormal('Semua');
                    setJurusanFormal('Semua');
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                >
                  <option value="KBM_Madin">KBM Madrasah Diniyah (Non Formal)</option>
                  <option value="KBM_Sekolah">KBM Sekolah Formal</option>
                </select>
              </div>

              {unitFilter === 'Non Formal' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-[#1A5276] mb-2">Pilih Kelas Madin</label>
                  <select
                    value={kelasNonFormal}
                    onChange={e => setKelasNonFormal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                  >
                    <option value="Semua" disabled>-- Pilih Kelas --</option>
                    <optgroup label="Marhalah Ula">
                      <option value="1 Ula">1 Ula</option>
                      <option value="2 Ula">2 Ula</option>
                      <option value="3 Ula">3 Ula</option>
                    </optgroup>
                    <optgroup label="Marhalah Wustho">
                      <option value="1 Wustho">1 Wustho</option>
                      <option value="2 Wustho">2 Wustho</option>
                    </optgroup>
                    <optgroup label="Marhalah Ulya">
                      <option value="1 Ulya">1 Ulya</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {unitFilter === 'Formal' && (
                <div className="animate-in slide-in-from-top-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#1A5276] mb-2">Pilih Sekolah Formal</label>
                    <select
                      value={unitFormal}
                      onChange={e => {
                        setUnitFormal(e.target.value);
                        setKelasFormal('Semua');
                        setJurusanFormal('Semua');
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                    >
                      <option value="Semua" disabled>-- Pilih Sekolah --</option>
                      <option value="MTs">MTs (SLTP)</option>
                      <option value="SMP">SMP (SLTP)</option>
                      <option value="SMK">SMK (SLTA)</option>
                      <option value="MA">MA (SLTA)</option>
                    </select>
                  </div>

                  {(unitFormal === 'MA' || unitFormal === 'SMK') && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-sm font-bold text-[#1A5276] mb-2">Pilih Jurusan</label>
                      <select
                        value={jurusanFormal}
                        onChange={e => setJurusanFormal(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                      >
                        <option value="Semua" disabled>-- Pilih Jurusan --</option>
                        <optgroup label="Umum (MA)">
                          <option value="MIPA">MIPA</option>
                          <option value="Agama">Agama</option>
                        </optgroup>
                        <optgroup label="Vokasi (SMK)">
                          <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                          <option value="PBS">Perbankan Syari'ah (PBS)</option>
                          <option value="TBSM">Teknik dan Bisnis Sepeda Motor (TBSM)</option>
                        </optgroup>
                      </select>
                    </div>
                  )}

                  {unitFormal !== 'Semua' && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-sm font-bold text-[#1A5276] mb-2">Pilih Kelas</label>
                      <select
                        value={kelasFormal}
                        onChange={e => setKelasFormal(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                      >
                        <option value="Semua" disabled>-- Pilih Kelas --</option>
                        {(unitFormal === 'MTs' || unitFormal === 'SMP') ? (
                          <>
                            <option value="7">Kelas 7 (VII)</option>
                            <option value="8">Kelas 8 (VIII)</option>
                            <option value="9">Kelas 9 (IX)</option>
                          </>
                        ) : (
                          <>
                            <option value="10">Kelas 10 (X)</option>
                            <option value="11">Kelas 11 (XI)</option>
                            <option value="12">Kelas 12 (XII)</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {!isFilterValid && (
                <div className="flex items-center gap-2.5 text-rose-500 text-sm font-bold p-3 bg-rose-50 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  Harap lengkapi semua pilihan unit, jurusan, dan kelas!
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              {hasActiveSession && (
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all shadow-sm text-base"
                >
                  Batal
                </button>
              )}
              <button
                onClick={() => {
                  setHasActiveSession(true);
                  setIsFilterModalOpen(false);
                }}
                disabled={!isFilterValid}
                className="flex-1 py-3.5 bg-[#1ABC9C] hover:bg-emerald-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2.5 text-base"
              >
                Mulai Absensi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <CalendarCheck className="w-7 h-7 text-[#1ABC9C]" />
            Entry Kehadiran Santri
          </h2>
          <p className="text-sm text-[#566573] mt-1.5">
            {hasActiveSession
              ? <span className="font-bold text-[#1ABC9C]">{tanggal} &bull; {kategori.replace('_', ' ')} &bull; {unitFilter === 'Formal' ? `${unitFormal} Kls ${kelasFormal}` : kelasNonFormal}</span>
              : 'Sesi belum diatur'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-[#1A5276] border border-sky-200 font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Settings2 className="w-5 h-5" />
            <span>Pengaturan Sesi</span>
          </button>

          <button
            onClick={handleSaveBatch}
            disabled={filteredSantri.length === 0}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] disabled:bg-gray-400 text-white font-bold text-sm rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5 text-[#1ABC9C]" />
            <span>Simpan Presensi</span>
          </button>
        </div>
      </div>

      {isSavedAlert && (
        <div className="p-4.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Presensi batch berhasil disimpan secara kolektif ke database!</span>
        </div>
      )}



      {/* Table Presensi Batch */}
      {!isFilterModalOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-sm">
                  <th className="p-4">NIS</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4 text-center">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSantri.length > 0 ? (
                  filteredSantri.map(s => {
                    const currentStatus = attendanceMap[s.id] || 'Hadir';
                    return (
                      <tr key={s.id} className="hover:bg-sky-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#1A5276] text-base w-32">{s.nis}</td>
                        <td className="p-4 font-extrabold text-gray-800 text-base">{s.namaLengkap}</td>
                        <td className="p-4 text-center w-80">
                          <div className="inline-flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg w-full justify-center">
                            {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(s.id, st)}
                                className={`flex-1 px-3 py-2 rounded text-xs font-extrabold transition-all ${currentStatus === st
                                  ? st === 'Hadir' ? 'bg-emerald-600 text-white shadow' :
                                    st === 'Izin' ? 'bg-amber-500 text-white shadow' :
                                      st === 'Sakit' ? 'bg-blue-600 text-white shadow' : 'bg-rose-600 text-white shadow'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                  }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <AlertCircle className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="font-bold text-base">Tidak ada data santri</p>
                        <p className="text-sm mt-1.5">Belum ada santri yang terdaftar di kelas/unit ini.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

