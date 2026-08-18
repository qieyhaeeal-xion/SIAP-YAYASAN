import React, { useState } from 'react';
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

import { KepengasuhanModule } from './components/kepengasuhan/KepengasuhanModule';
import { KepegawaianModule } from './components/kepegawaian/KepegawaianModule';
import { AkademikModule } from './components/akademik/AkademikModule';
import { KeuanganModule } from './components/keuangan/KeuanganModule';
import { PPDBModule } from './components/ppdb/PPDBModule';
import { PortalWaliModule } from './components/wali/PortalWaliModule';
import { SettingsModule } from './components/settings/SettingsModule';

import { ShieldAlert, Lock, ArrowLeft, UserCheck } from 'lucide-react';
import { hasPermission, getFirstAllowedTab, ROLE_DETAILS } from './utils/rbac';

const MainApp: React.FC = () => {
  const { isLandingPage, setIsLandingPage, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsLandingPage(false);
  };

  if (isLandingPage) {
    return (
      <LandingPage
        onOpenDashboard={() => setIsLandingPage(false)}
        onOpenLogin={() => setShowLoginModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* Top Header */}
      <Header
        onToggleSidebar={toggleSidebar}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 bg-[#F4F6F7] flex flex-col justify-between">
          <div className="max-w-[1920px] mx-auto space-y-6 w-full flex-1">
            
            {/* RBAC Permission Check Guard */}
            {!hasPermission(currentUser.role, activeTab) ? (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center max-w-xl mx-auto my-12 animate-in fade-in zoom-in-95 duration-200 space-y-4">
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
                    onClick={() => setActiveTab(getFirstAllowedTab(currentUser.role))}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#1A5276] hover:bg-[#2E86C1] text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Modul Diizinkan
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
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

                {/* Kepengasuhan Sub-modules */}
                {activeTab === 'kesehatan' && <KepengasuhanModule defaultSubTab="kesehatan" />}
                {activeTab === 'perizinan' && <KepengasuhanModule defaultSubTab="perizinan" />}
                {activeTab === 'konseling' && <KepengasuhanModule defaultSubTab="konseling" />}

                {/* Kepegawaian */}
                {activeTab === 'kepegawaian' && <KepegawaianModule />}

                {/* Akademik & Presensi */}
                {activeTab === 'akademik' && <AkademikModule />}

                {/* Keuangan & Syahriyah */}
                {activeTab === 'keuangan' && <KeuanganModule />}

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

      {/* Login / Switch Role Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccessLogin={() => {
            setShowLoginModal(false);
            setIsLandingPage(false);
          }}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
