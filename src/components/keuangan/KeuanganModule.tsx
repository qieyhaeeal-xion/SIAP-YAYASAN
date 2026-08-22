import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { PemasukanDistribusi } from './PemasukanDistribusi';
import { RingkasanKeuangan } from './RingkasanKeuangan';
import { JenisPembayaran } from './JenisPembayaran';
import { type KeuanganSubTab } from './shared';

export type { KeuanganSubTab };

interface KeuanganModuleProps {
  defaultSubTab?: KeuanganSubTab;
  showSubTabs?: boolean;
  onNavigateTab?: (tab: KeuanganSubTab) => void;
}

export const KeuanganModule: React.FC<KeuanganModuleProps> = ({ defaultSubTab = 'ringkasan', showSubTabs = false, onNavigateTab }) => {
  const [activeTabSub, setActiveTabSub] = useState<KeuanganSubTab>(defaultSubTab);
  const navigateSubTab = (tab: KeuanganSubTab) => {
    if (onNavigateTab) onNavigateTab(tab);
    else setActiveTabSub(tab);
  };

  const pageTitle: Record<KeuanganSubTab, string> = {
    ringkasan: 'Ringkasan Keuangan',
    jenis: 'Jenis Pembayaran',
    pemasukan: 'Pemasukan & Distribusi'
  };

  const pageDescription: Record<KeuanganSubTab, string> = {
    ringkasan: 'Pantau ringkasan pemasukan dan distribusi pos keuangan pesantren.',
    jenis: 'Kelola jenis, kategori, frekuensi, dan nominal pembayaran.',
    pemasukan: 'Kelola pencatatan pemasukan dan distribusi ke pos keuangan.'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A5276] flex items-center gap-3">
            <Wallet className="w-7 h-7 text-[#1ABC9C]" />
             {showSubTabs ? 'Modul Keuangan & Syahriyah Pesantren' : pageTitle[activeTabSub]}
          </h2>
           <p className="text-sm text-[#566573] mt-1">{showSubTabs ? 'Pengelolaan jenis pembayaran, distribusi pemasukan, dan monitoring pos keuangan.' : pageDescription[activeTabSub]}</p>
         </div>
         {showSubTabs && <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 p-1.5">
           <button type="button" onClick={() => navigateSubTab('ringkasan')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'ringkasan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Ringkasan
           </button>
           <button type="button" onClick={() => navigateSubTab('jenis')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'jenis' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Jenis Pembayaran
           </button>
           <button type="button" onClick={() => navigateSubTab('pemasukan')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTabSub === 'pemasukan' ? 'bg-[#1A5276] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
             Pemasukan & Distribusi
           </button>
         </div>}
       </div>

      {activeTabSub === 'ringkasan' && <RingkasanKeuangan onNavigate={setActiveTabSub} />}
      {activeTabSub === 'jenis' && <JenisPembayaran />}
      {activeTabSub === 'pemasukan' && <PemasukanDistribusi />}
    </div>
  );
};
