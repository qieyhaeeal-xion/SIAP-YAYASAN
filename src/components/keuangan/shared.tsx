import React from 'react';

export type KeuanganSubTab = 'jenis' | 'rekap' | 'pemasukan';

export const PAYMENT_FREQUENCIES = ['Bulanan', 'Tahunan', 'Sekali Bayar', 'Periodik'];

export const formatRp = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-xs font-bold text-gray-600">{label}<span className="block mt-1">{children}</span></label>
);
