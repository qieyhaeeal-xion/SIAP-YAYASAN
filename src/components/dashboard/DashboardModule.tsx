import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminYayasanDashboard } from './roles/AdminYayasanDashboard';
import { PengurusDashboard } from './roles/PengurusDashboard';
import { GuruDashboard } from './roles/GuruDashboard';
import { WaliSantriDashboard } from './roles/WaliSantriDashboard';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  const { currentUser } = useApp();

  // Render role-tailored dashboard component
  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'admin_yayasan':
      case 'admin_sistem':
        return <AdminYayasanDashboard onNavigateTab={onNavigateTab} />;
      case 'pengurus':
        return <PengurusDashboard onNavigateTab={onNavigateTab} />;
      case 'guru':
        return <GuruDashboard onNavigateTab={onNavigateTab} />;
      case 'wali_santri':
        return <WaliSantriDashboard onNavigateTab={onNavigateTab} />;
      default:
        return <AdminYayasanDashboard onNavigateTab={onNavigateTab} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Role Dedicated Dashboard Content */}
      {renderDashboardByRole()}
    </div>
  );
};