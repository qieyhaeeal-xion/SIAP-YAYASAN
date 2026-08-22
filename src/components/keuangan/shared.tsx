import React from 'react';
import { BiayaKategori, KonteksKeuangan } from '../../types/sisantri';

export type KeuanganSubTab = 'ringkasan' | 'jenis' | 'pemasukan';

export const PAYMENT_FREQUENCIES = ['Bulanan', 'Tahunan', 'Sekali Bayar', 'Periodik'];
export const COST_CATEGORIES: BiayaKategori[] = ['YAYASAN', 'SEKOLAH', 'PESANTREN', 'MAKAN', 'MADIN'];

export const KONTEKS_LABEL: Record<KonteksKeuangan, string> = {
  YAYASAN: 'Yayasan', MADIN: 'Madin', SEKOLAH: 'Sekolah', PESANTREN: 'Pesantren', MAKAN: 'Makan'
};

export const KONTEKS_STYLE: Record<KonteksKeuangan, { badge: string; bar: string; text: string }> = {
  YAYASAN: { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  MADIN: { badge: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500', text: 'text-violet-700' },
  SEKOLAH: { badge: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', text: 'text-sky-700' },
  PESANTREN: { badge: 'bg-teal-100 text-teal-800', bar: 'bg-[#1ABC9C]', text: 'text-teal-700' },
  MAKAN: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', text: 'text-amber-700' }
};

export const formatRp = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

export const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: 'sky' | 'violet' | 'emerald' | 'rose' }> = ({ icon, label, value, color }) => {
  const c = { sky: 'bg-sky-50 text-sky-600 border-sky-200', violet: 'bg-violet-50 text-violet-600 border-violet-200', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200', rose: 'bg-rose-50 text-rose-600 border-rose-200' };
  return (
    <div className={`rounded-2xl border p-5 ${c[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-xl font-black text-gray-900">{value}</p>
    </div>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-xs font-bold text-gray-600">{label}<span className="block mt-1">{children}</span></label>
);
