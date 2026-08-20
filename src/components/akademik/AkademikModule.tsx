import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, Save, CheckCircle2, Settings2, AlertCircle, PlayCircle, ShieldCheck } from 'lucide-react';

export const AkademikModule: React.FC = () => {
  const { santriList, presensiList, savePresensiBatch, unitSekolahList, kelasMadinList, jurusanList, kelasSekolahList } = useApp();

  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<'KBM_Madin' | 'KBM_Sekolah'>('KBM_Madin');

  // unitFilter ditentukan otomatis dari kategori
  const unitFilter: 'Formal' | 'Non Formal' = kategori === 'KBM_Sekolah' ? 'Formal' : 'Non Formal';
  const [kelasNonFormal, setKelasNonFormal] = useState('Semua');
  const [unitFormal, setUnitFormal] = useState('Semua');

  // New States for Formal Schools
  const [kelasFormal, setKelasFormal] = useState('Semua');
  const [kodeKelas, setKodeKelas] = useState('Semua');
  const [jurusanFormal, setJurusanFormal] = useState('Semua');

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  let filteredSantri = activeSantri;

  if (unitFilter === 'Formal' && unitFormal !== 'Semua') {
    const selectedUnit = unitSekolahList.find(u => u.kodeSekolah.toLowerCase() === unitFormal.toLowerCase() || u.namaSekolah.toLowerCase().includes(unitFormal.toLowerCase()));
    if (selectedUnit) {
      filteredSantri = filteredSantri.filter(s => s.unitSekolahId === selectedUnit.id);

      if ((unitFormal === 'MA' || unitFormal === 'SMK') && jurusanFormal !== 'Semua') {
        const matchingJurusan = jurusanList.find(j => j.kodeJurusan.toLowerCase() === jurusanFormal.toLowerCase() || j.namaJurusan.toLowerCase().includes(jurusanFormal.toLowerCase()));
        if (matchingJurusan) {
          filteredSantri = filteredSantri.filter(s => s.jurusanId === matchingJurusan.id);
        } else {
          filteredSantri = [];
        }
      }

      if (kelasFormal !== 'Semua') {
        const romanClass = kelasFormal === '7' ? 'VII' : kelasFormal === '8' ? 'VIII' : kelasFormal === '9' ? 'IX' : kelasFormal === '10' ? 'X' : kelasFormal === '11' ? 'XI' : 'XII';
        const matchingKelasIds = kelasSekolahList
          .filter(k => {
            const matchGrade = k.kodeKelas.includes(romanClass) || k.namaKelas.includes(romanClass);
            if (kodeKelas !== 'Semua') {
              // Cocokkan juga kode rombel (A, B, C...) — kodeKelas biasanya di akhir, e.g. "VII-A"
              const matchRombel = k.kodeKelas.toUpperCase().endsWith(kodeKelas.toUpperCase()) ||
                k.namaKelas.toUpperCase().endsWith(kodeKelas.toUpperCase()) ||
                k.kodeKelas.toUpperCase().includes(`-${kodeKelas.toUpperCase()}`) ||
                k.namaKelas.toUpperCase().includes(`-${kodeKelas.toUpperCase()}`);
              return matchGrade && matchRombel;
            }
            return matchGrade;
          })
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
      .filter(k => {
        const matchGrade = k.namaKelas.toLowerCase().includes(kelasNonFormal.toLowerCase()) ||
          k.namaKelas.toLowerCase().replace('i', '1').replace('ii', '2').replace('iii', '3').includes(kelasNonFormal.toLowerCase().replace('i', '1').replace('ii', '2').replace('iii', '3'));
        if (kodeKelas !== 'Semua') {
          const matchRombel = k.namaKelas.toUpperCase().endsWith(kodeKelas.toUpperCase()) ||
            (k as any).kodeKelas?.toUpperCase().endsWith(kodeKelas.toUpperCase()) ||
            k.namaKelas.toUpperCase().includes(`-${kodeKelas.toUpperCase()}`) ||
            k.namaKelas.toUpperCase().includes(` ${kodeKelas.toUpperCase()}`);
          return matchGrade && matchRombel;
        }
        return matchGrade;
      })
      .map(k => k.id);
    if (matchingKelasIds.length > 0) {
      filteredSantri = filteredSantri.filter(s => matchingKelasIds.includes(s.kelasMadinId));
    } else {
      filteredSantri = [];
    }
  }

  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'>>(() => {
    const initialMap: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'> = {};
    activeSantri.forEach(s => { initialMap[s.id] = 'Hadir'; });
    return initialMap;
  });

  useEffect(() => {
    setAttendanceMap(prev => {
      const newMap = { ...prev };
      filteredSantri.forEach(s => { if (!newMap[s.id]) newMap[s.id] = 'Hadir'; });
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

  const isSLTA = unitFormal === 'MA' || unitFormal === 'SMK';
  const isSLTP = unitFormal === 'MTs' || unitFormal === 'SMP';

  const isFilterValid =
    (unitFilter === 'Non Formal' && kelasNonFormal !== 'Semua' && kodeKelas !== 'Semua') ||
    (unitFilter === 'Formal' && unitFormal !== 'Semua' && (
      (isSLTP && kelasFormal !== 'Semua' && kodeKelas !== 'Semua') ||
      (isSLTA && jurusanFormal !== 'Semua' && kelasFormal !== 'Semua' && kodeKelas !== 'Semua')
    ));

  // Kode konfirmasi sesi yang harus diketik guru
  const confirmCode = unitFilter === 'Non Formal'
    ? `Madin ${kelasNonFormal} ${kodeKelas}`
    : isSLTA
      ? `${unitFormal} ${jurusanFormal} ${kelasFormal}${kodeKelas}`
      : `${unitFormal} ${kelasFormal}${kodeKelas}`;

  const handleMulaiClick = () => {
    setConfirmInput('');
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (confirmInput.trim() === confirmCode) {
      setHasActiveSession(true);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="flex gap-6 animate-in fade-in duration-200 items-start">

      {/* ===== MODAL KONFIRMASI SESI ===== */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-[#1A5276] text-white">
              <h3 className="font-extrabold text-lg flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#1ABC9C]" />
                Konfirmasi Sesi Absensi
              </h3>
              <p className="text-sky-200 text-xs mt-1">Pastikan Anda memilih kelas yang benar sebelum memulai.</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Ringkasan sesi */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#1A5276] uppercase tracking-wide mb-2">Ringkasan Sesi</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-bold text-gray-800">{tanggal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kategori</span>
                  <span className="font-bold text-gray-800">{kategori.replace('_', ' ')}</span>
                </div>
                {unitFilter === 'Non Formal' ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kelas Madin</span>
                    <span className="font-bold text-[#1ABC9C]">Kelas {kelasNonFormal} (Kode {kodeKelas})</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Unit Sekolah</span>
                      <span className="font-bold text-gray-800">{unitFormal}</span>
                    </div>
                    {isSLTA && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jurusan</span>
                        <span className="font-bold text-gray-800">{jurusanFormal}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Kelas</span>
                      <span className="font-bold text-[#1ABC9C]">Kelas {kelasFormal}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Input konfirmasi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Ketik kode sesi untuk mengkonfirmasi:
                </label>
                <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-center">
                  <span className="font-extrabold text-amber-700 text-lg tracking-widest">{confirmCode}</span>
                </div>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={e => setConfirmInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                  placeholder={`Ketik: ${confirmCode}`}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm font-bold outline-none transition-all focus:ring-2 ${confirmInput.trim() === confirmCode
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-300'
                    : 'border-gray-300 bg-gray-50 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]'
                    }`}
                />
                {confirmInput.length > 0 && confirmInput.trim() !== confirmCode && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Kode tidak cocok. Periksa kembali.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmInput.trim() !== confirmCode}
                className="flex-1 py-2.5 bg-[#1ABC9C] hover:bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Konfirmasi & Mulai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PANEL FILTER KIRI ===== */}
      <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
        <div className="p-5 bg-[#1A5276] text-white">
          <h3 className="font-extrabold text-base flex items-center gap-2.5">
            <Settings2 className="w-5 h-5 text-[#1ABC9C]" />
            Pengaturan Sesi
          </h3>
          <p className="text-sky-200 text-xs mt-1">Atur tanggal, unit, dan kelas.</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Tanggal Presensi</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Kategori</label>
            <select
              value={kategori}
              onChange={e => {
                setKategori(e.target.value as any);
                setKelasNonFormal('Semua');
                setUnitFormal('Semua');
                setKelasFormal('Semua');
                setKodeKelas('Semua');
                setJurusanFormal('Semua');
                setHasActiveSession(false);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
            >
              <option value="KBM_Madin">KBM Madrasah Diniyah</option>
              <option value="KBM_Sekolah">KBM Sekolah Formal</option>
            </select>
          </div>

          {unitFilter === 'Non Formal' && (
            <div className="animate-in slide-in-from-top-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Tingkat Kelas Madin</label>
                <select
                  value={kelasNonFormal}
                  onChange={e => { setKelasNonFormal(e.target.value); setKodeKelas('Semua'); setHasActiveSession(false); }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                >
                  <option value="Semua" disabled>-- Pilih Tingkat --</option>
                  <optgroup label="Marhalah Ula">
                    <option value="Ula I">Kelas Ula I</option>
                    <option value="Ula II">Kelas Ula II</option>
                    <option value="Ula III">Kelas Ula III</option>
                  </optgroup>
                  <optgroup label="Marhalah Wustho">
                    <option value="Wustho I">Kelas Wustho I</option>
                    <option value="Wustho II">Kelas Wustho II</option>
                  </optgroup>
                  <optgroup label="Marhalah Ulya">
                    <option value="Ulya I">Kelas Ulya I</option>
                  </optgroup>
                </select>
              </div>

              {kelasNonFormal !== 'Semua' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Kode Kelas</label>
                  <select
                    value={kodeKelas}
                    onChange={e => { setKodeKelas(e.target.value); setHasActiveSession(false); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                  >
                    <option value="Semua" disabled>-- Pilih Kode --</option>
                    <option value="A">Kode A</option>
                    <option value="B">Kode B</option>
                    <option value="C">Kode C</option>
                    <option value="D">Kode D</option>
                    <option value="E">Kode E</option>
                    <option value="F">Kode F</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {unitFilter === 'Formal' && (
            <div className="animate-in slide-in-from-top-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Unit Sekolah</label>
                <select
                  value={unitFormal}
                  onChange={e => {
                    setUnitFormal(e.target.value);
                    setKelasFormal('Semua');
                    setJurusanFormal('Semua');
                    setHasActiveSession(false);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                >
                  <option value="Semua" disabled>-- Pilih Sekolah --</option>
                  <option value="MTs">MTs</option>
                  <option value="SMP">SMP</option>
                  <option value="SMK">SMK</option>
                  <option value="MA">MA</option>
                </select>
              </div>

              {(unitFormal === 'MA' || unitFormal === 'SMK') && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Jurusan</label>
                  <select
                    value={jurusanFormal}
                    onChange={e => { setJurusanFormal(e.target.value); setHasActiveSession(false); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                  >
                    <option value="Semua" disabled>-- Pilih Jurusan --</option>
                    <optgroup label="Umum (MA)">
                      <option value="MIPA">MIPA</option>
                      <option value="Agama">Agama</option>
                    </optgroup>
                    <optgroup label="Vokasi (SMK)">
                      <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                      <option value="PBS">Perbankan Syariah (PBS)</option>
                      <option value="TBSM">Teknik dan Bisnis Sepeda Motor (TBSM)</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {unitFormal !== 'Semua' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Tingkat Kelas</label>
                  <select
                    value={kelasFormal}
                    onChange={e => { setKelasFormal(e.target.value); setKodeKelas('Semua'); setHasActiveSession(false); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                  >
                    <option value="Semua" disabled>-- Pilih Tingkat --</option>
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

              {unitFormal !== 'Semua' && kelasFormal !== 'Semua' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-[#1A5276] mb-1.5 uppercase tracking-wide">Kode Kelas</label>
                  <select
                    value={kodeKelas}
                    onChange={e => { setKodeKelas(e.target.value); setHasActiveSession(false); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] outline-none transition-all"
                  >
                    <option value="Semua" disabled>-- Pilih Kode --</option>
                    <option value="A">Kode A</option>
                    <option value="B">Kode B</option>
                    <option value="C">Kode C</option>
                    <option value="D">Kode D</option>
                    <option value="E">Kode E</option>
                    <option value="F">Kode F</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {!isFilterValid && (
            <div className="flex items-start gap-2 text-rose-500 text-xs font-bold p-3 bg-rose-50 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Lengkapi semua pilihan untuk memulai absensi.</span>
            </div>
          )}

          <button
            onClick={handleMulaiClick}
            disabled={!isFilterValid}
            className="w-full py-2.5 bg-[#1ABC9C] hover:bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <PlayCircle className="w-4 h-4" />
            Mulai Absensi
          </button>
        </div>

        {hasActiveSession && (
          <div className="mx-5 mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Sesi aktif: {tanggal}</span>
          </div>
        )}
      </div>

      {/* ===== KONTEN UTAMA KANAN ===== */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
              <CalendarCheck className="w-7 h-7 text-[#1ABC9C]" />
              Entry Kehadiran Santri
            </h2>
            <p className="text-sm text-[#566573] mt-1.5">
              {hasActiveSession
                ? <span className="font-bold text-[#1ABC9C]">{tanggal} &bull; {kategori.replace('_', ' ')} &bull; {unitFilter === 'Formal' ? `${unitFormal} ${isSLTA ? jurusanFormal + ' ' : ''}Kls ${kelasFormal}${kodeKelas}` : `Madin ${kelasNonFormal} Kode ${kodeKelas}`}</span>
                : 'Atur sesi di panel kiri lalu tekan Mulai Absensi.'}
            </p>
          </div>

          <button
            onClick={handleSaveBatch}
            disabled={!hasActiveSession || filteredSantri.length === 0}
            className="shrink-0 px-5 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg shadow flex items-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5 text-[#1ABC9C]" />
            Simpan Presensi
          </button>
        </div>

        {isSavedAlert && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Presensi batch berhasil disimpan!</span>
          </div>
        )}

        {hasActiveSession ? (
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
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-4">
              <CalendarCheck className="w-8 h-8 text-[#1ABC9C]" />
            </div>
            <p className="font-extrabold text-gray-700 text-lg">Sesi Belum Dimulai</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">Lengkapi pengaturan di panel kiri, kemudian tekan <strong>Mulai Absensi</strong> untuk menampilkan daftar santri.</p>
          </div>
        )}
      </div>
    </div>
  );
};
