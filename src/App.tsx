import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';

import { DashboardModule } from './components/dashboard/DashboardModule';
import { SubPesantren } from './components/kesantrian/SubPesantren';
import { SubMadin } from './components/kesantrian/SubMadin';
import { SubSekolah } from './components/kesantrian/SubSekolah';
import { DataSantriModule } from './components/kesantrian/DataSantriModule';
import { TahfidzModule } from './components/kesantrian/TahfidzModule';
import { NadhomanModule } from './components/kesantrian/NadhomanModule';
import { AlumniModule } from './components/kesantrian/AlumniModule';

import { KepengasuhanModule, type KepengasuhanSubTab } from './components/kepengasuhan/KepengasuhanModule';
import { KepegawaianModule } from './components/kepegawaian/KepegawaianModule';
import { AkademikModule } from './components/akademik/AkademikModule';
import { KeuanganModule, type KeuanganSubTab } from './components/keuangan/KeuanganModule';
import { PPDBModule } from './components/ppdb/PPDBModule';
import { PortalWaliModule } from './components/wali/PortalWaliModule';
import { SettingsModule } from './components/settings/SettingsModule';

import { ShieldAlert, Lock, ArrowLeft, UserCheck } from 'lucide-react';
import { hasPermission, getFirstAllowedTab, ROLE_DETAILS } from './utils/rbac';

const FINANCE_ROUTE_BY_SUBTAB: Record<KeuanganSubTab, string> = {
  ringkasan: 'keuangan-ringkasan',
  jenis: 'keuangan-jenis',
  pemasukan: 'keuangan-pemasukan'
};

const FINANCE_ROUTES = Object.values(FINANCE_ROUTE_BY_SUBTAB);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <LoginModal
      isOpen
      onClose={() => navigate('/')}
      onSuccessLogin={() => navigate('/app')}
    />
  );
};

const AppLayout: React.FC<{ initialTab?: string }> = ({ initialTab = 'dashboard' }) => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || initialTab;
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  const handleNavigate = (t: string) => navigate(
    t === 'payment-management' || t === 'keuangan'
      ? '/app/keuangan-ringkasan'
      : '/app/' + t
  );
  const permissionTab = activeTab === 'payment-management' || activeTab.startsWith('keuangan-') ? 'keuangan' : activeTab;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 font-sans text-gray-900">

      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenLoginModal={() => navigate('/login')}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* Collapsible Left Sidebar — drawer di mobile, statis di desktop */}
          <Sidebar
           activeTab={activeTab}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col justify-between overflow-y-auto overscroll-contain bg-[#F4F6F7] p-4 sm:p-6 lg:p-6">
          <div className="max-w-screen-xl mx-auto space-y-6 w-full flex-1">

            {/* RBAC Permission Check Guard */}
             {!hasPermission(currentUser.role, permissionTab) ? (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center max-w-xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-200 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-gray-900">Akses Ditolak (Unauthorized)</h3>
                     <p className="text-xs text-gray-600">
                     Role akun Anda <span className="font-extrabold text-[#1A5276] uppercase">[{currentUser.role.replace('_', ' ')}]</span> tidak memiliki wewenang untuk mengakses modul <span className="font-bold text-[#1ABC9C]">"{activeTab}"</span>.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Informasi Level Akses:
                  </p>
                  <p className="text-[11px]">
                    {ROLE_DETAILS[currentUser.role]?.description || 'Akses dibatasi sesuai kebijakan keamanan sistem.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleNavigate(getFirstAllowedTab(currentUser.role))}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Modul Diizinkan
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-[#1ABC9C]" />
                    Ganti Role Akses (Demo)
                  </button>
                </div>
              </div>
            ) : (
              <>
                 {activeTab === 'dashboard' && <DashboardModule onNavigateTab={handleNavigate} />}

                {/* Kesantrian Sub-modules */}
                 {activeTab === 'sub-pesantren' && <SubPesantren />}
                 {activeTab === 'sub-madin' && <SubMadin />}
                 {activeTab === 'sub-sekolah' && <SubSekolah />}
                 {activeTab === 'data-santri' && <DataSantriModule />}
                 {activeTab === 'tahfidz' && <TahfidzModule />}
                 {activeTab === 'nadhoman' && <NadhomanModule />}
                 {activeTab === 'alumni' && <AlumniModule />}
                  {FINANCE_ROUTES.includes(activeTab) && (
                    <KeuanganModule
                      key={activeTab}
                      defaultSubTab={Object.entries(FINANCE_ROUTE_BY_SUBTAB).find(([, route]) => route === activeTab)?.[0] as KeuanganSubTab}
                      onNavigateTab={subTab => handleNavigate(FINANCE_ROUTE_BY_SUBTAB[subTab])}
                    />
                  )}

                 {/* Keamanan, kesehatan, kepengasuhan, and kunjungan */}
                  {activeTab === 'kepengasuhan' && <KepengasuhanModule showSubTabs />}
                  {(['perizinan', 'kesehatan', 'konseling', 'kunjungan'] as string[]).includes(activeTab) && (
                    <KepengasuhanModule
                      key={activeTab}
                      defaultSubTab={activeTab as KepengasuhanSubTab}
                    />
                  )}

                {/* Kepegawaian */}
                 {activeTab === 'kepegawaian' && <KepegawaianModule />}

                {/* Akademik & Presensi */}
                 {activeTab === 'akademik' && <AkademikModule />}

                 {/* PPDB */}
                 {activeTab === 'ppdb' && <PPDBModule />}

                {/* Portal Wali Santri */}
                 {activeTab === 'portal-wali' && <PortalWaliModule />}

                {/* Pengaturan & RBAC */}
                 {activeTab === 'pengaturan' && <SettingsModule />}
              </>
            )}

          </div>

          <Footer />
        </main>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="/app/:tab" element={<AppLayout />} />
          <Route path="/app/keuangan" element={<Navigate to="/app/keuangan-ringkasan" replace />} />
          <Route path="/app/payment-management" element={<Navigate to="/app/keuangan-ringkasan" replace />} />
          <Route path="/manage/payment" element={<Navigate to="/app/keuangan-ringkasan" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
