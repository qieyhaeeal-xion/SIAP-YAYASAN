import { UserRole } from '../types/sisantri';

export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'approve';

export interface ModulePermission {
  id: string;
  label: string;
  category: 'Kesantrian' | 'Kepengasuhan' | 'Kepegawaian' | 'Akademik' | 'Keuangan' | 'PPDB' | 'Portal' | 'Sistem';
  allowedRoles: UserRole[];
  writableRoles: UserRole[];
  deletableRoles: UserRole[];
  approverRoles?: UserRole[];
}

const ADMIN_ROLE: UserRole = 'admin_yayasan';

export const MODULE_PERMISSIONS: ModulePermission[] = [
  ['dashboard', 'Dashboard SIM', 'Sistem'],
  ['sub-pesantren', 'Sub Pesantren & Asrama', 'Kesantrian'],
  ['sub-madin', 'Sub Madin & Kitab', 'Kesantrian'],
  ['sub-sekolah', 'Sub Sekolah Formal', 'Kesantrian'],
  ['data-santri', 'Data Santri (8 Form)', 'Kesantrian'],
  ['tahfidz', 'Sub Tahfidz Quran', 'Kesantrian'],
  ['nadhoman', 'Sub Setoran Nadhoman', 'Kesantrian'],
  ['alumni', 'Sub Data Alumni', 'Kesantrian'],
  ['kepengasuhan', 'Kepengasuhan', 'Kepengasuhan'],
  ['kesehatan', 'Kesehatan (UKS)', 'Kepengasuhan'],
  ['perizinan', 'Perizinan Santri', 'Kepengasuhan'],
  ['konseling', 'Konseling', 'Kepengasuhan'],
  ['kunjungan', 'Kunjungan Santri', 'Kepengasuhan'],
  ['kepegawaian', 'Modul Kepegawaian', 'Kepegawaian'],
  ['akademik', 'Modul Akademik / Presensi', 'Akademik'],
  ['keuangan', 'Modul Keuangan & Syahriyah', 'Keuangan'],
  ['ppdb', 'Modul PPDB (Mutasi NIS)', 'PPDB'],
  ['pengaturan', 'Pengaturan & RBAC', 'Sistem']
].map(([id, label, category]) => ({
  id,
  label,
  category: category as ModulePermission['category'],
  allowedRoles: [ADMIN_ROLE],
  writableRoles: [ADMIN_ROLE],
  deletableRoles: [ADMIN_ROLE],
  approverRoles: [ADMIN_ROLE]
}));

export const ROLE_DETAILS: Record<UserRole, { title: string; description: string; color: string }> = {
  admin_yayasan: {
    title: 'Admin Yayasan (Super Admin)',
    description: 'Akses penuh untuk mengelola seluruh sistem, data santri, keuangan, kepegawaian, dan konfigurasi sistem.',
    color: 'bg-[#1A5276] text-white'
  }
};

export function hasPermission(role: UserRole, moduleId: string, action: ActionType = 'view'): boolean {
  if (role !== ADMIN_ROLE) return false;
  return MODULE_PERMISSIONS.some(module => module.id === moduleId) || moduleId === 'dashboard';
}

export function getFirstAllowedTab(_role: UserRole): string {
  return 'dashboard';
}
