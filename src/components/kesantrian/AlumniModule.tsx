import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Search, GraduationCap } from 'lucide-react';

export const AlumniModule: React.FC = () => {
  const { santriList } = useApp();
  const alumniList = santriList.filter(s => s.status === 'Alumni');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1A5276] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1ABC9C]" />
            Sub Data Alumni Pesantren
          </h2>
          <p className="text-xs text-[#566573]">Database riwayat santri kelulusan Pondok Pesantren Mukhtar Syafaat</p>
        </div>
        <span className="text-xs font-bold bg-[#1A5276] text-white px-3 py-1 rounded-full">
          Total Alumni: {alumniList.length}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider">
                <th className="p-3">NIS</th>
                <th className="p-3">Nama Alumni</th>
                <th className="p-3">Tempat / Tgl Lahir</th>
                <th className="p-3">No HP / Kontak</th>
                <th className="p-3">Alamat Domisili</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alumniList.map(a => (
                <tr key={a.id} className="hover:bg-sky-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1A5276]">{a.nis}</td>
                  <td className="p-3 font-extrabold text-gray-800">{a.namaLengkap}</td>
                  <td className="p-3 text-gray-600">{a.tempatLahir}, {a.tanggalLahir}</td>
                  <td className="p-3 text-gray-700">{a.noHp}</td>
                  <td className="p-3 text-gray-600 max-w-xs truncate">{a.alamatLengkap}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Alumni Terdata
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
