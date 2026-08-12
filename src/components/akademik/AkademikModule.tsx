import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, Save, CheckCircle2 } from 'lucide-react';

export const AkademikModule: React.FC = () => {
  const { santriList, presensiList, savePresensiBatch } = useApp();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<'KBM_Madin' | 'KBM_Sekolah' | 'Sholat_Jamaah'>('Sholat_Jamaah');

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  // State Batch Attendance Input Map: santriId -> 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'>>(() => {
    const initialMap: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'> = {};
    activeSantri.forEach(s => {
      initialMap[s.id] = 'Hadir';
    });
    return initialMap;
  });

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleStatusChange = (santriId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    setAttendanceMap(prev => ({ ...prev, [santriId]: status }));
  };

  const handleSaveBatch = () => {
    const records = activeSantri.map(s => ({
      santriId: s.id,
      tanggal,
      kategori,
      status: attendanceMap[s.id] || 'Hadir'
    }));

    savePresensiBatch(records);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#1ABC9C]" />
            Modul Akademik & Input Presensi Batch Santri
          </h2>
          <p className="text-xs text-[#566573]">Entry kehadiran kolektif Sholat Jamaah, KBM Diniyah, dan KBM Formal</p>
        </div>

        <button
          onClick={handleSaveBatch}
          className="px-4 py-2 bg-[#1A5276] hover:bg-[#2E86C1] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 shrink-0"
        >
          <Save className="w-4 h-4 text-[#1ABC9C]" />
          <span>Simpan Presensi Batch</span>
        </button>
      </div>

      {isSavedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Presensi batch berhasil disimpan secara kolektif ke database!</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="text-[#1A5276]">TANGGAL PRESENSI:</span>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#1A5276]">KATEGORI PRESENSI:</span>
          <select
            value={kategori}
            onChange={e => setKategori(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
          >
            <option value="Sholat_Jamaah">Sholat Berjamaah 5 Waktu</option>
            <option value="KBM_Madin">KBM Madrasah Diniyah</option>
            <option value="KBM_Sekolah">KBM Sekolah Formal</option>
          </select>
        </div>
      </div>

      {/* Table Presensi Batch */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3">NIS</th>
                <th className="p-3">Nama Santri</th>
                <th className="p-3 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeSantri.map(s => {
                const currentStatus = attendanceMap[s.id] || 'Hadir';
                return (
                  <tr key={s.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1A5276]">{s.nis}</td>
                    <td className="p-3 font-extrabold text-gray-800">{s.namaLengkap}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-3 py-1 rounded text-[10px] font-extrabold transition-all ${
                              currentStatus === st
                                ? st === 'Hadir' ? 'bg-emerald-600 text-white shadow' :
                                  st === 'Izin' ? 'bg-amber-500 text-white shadow' :
                                  st === 'Sakit' ? 'bg-blue-600 text-white shadow' : 'bg-rose-600 text-white shadow'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
