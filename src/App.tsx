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

const MainApp: React.FC = () => {
  const { isLandingPage, setIsLandingPage } = useApp();
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F7] flex flex-col justify-between">
          <div className="max-w-7xl mx-auto space-y-6 w-full flex-1">
            
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
