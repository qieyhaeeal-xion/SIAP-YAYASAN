import React from 'react';
import { AdminYayasanDashboard } from './roles/AdminYayasanDashboard';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-4">
      <AdminYayasanDashboard onNavigateTab={onNavigateTab} />
    </div>
  );
};
