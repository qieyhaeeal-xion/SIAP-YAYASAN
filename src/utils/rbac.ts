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

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    id: 'dashboard',
    label: 'Dashboard SIM',
    category: 'Sistem',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru', 'wali_santri'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru', 'wali_santri'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'sub-pesantren',
    label: 'Sub Pesantren & Asrama',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'sub-madin',
    label: 'Sub Madin & Kitab',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'sub-sekolah',
    label: 'Sub Sekolah Formal',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'data-santri',
    label: 'Data Santri (8 Form)',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'tahfidz',
    label: 'Sub Tahfidz Quran',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'nadhoman',
    label: 'Sub Setoran Nadhoman',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'alumni',
    label: 'Sub Data Alumni',
    category: 'Kesantrian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'kesehatan',
    label: 'Kesehatan (UKS)',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'perizinan',
    label: 'Perizinan Santri',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    deletableRoles: ['admin_yayasan', 'admin_sistem'],
    approverRoles: ['admin_yayasan', 'admin_sistem', 'pengurus']
  },
  {
    id: 'konseling',
    label: 'Konseling & Kunjungan',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'kepegawaian',
    label: 'Modul Kepegawaian',
    category: 'Kepegawaian',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    writableRoles: ['admin_yayasan', 'admin_sistem'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'akademik',
    label: 'Modul Akademik / Presensi',
    category: 'Akademik',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus', 'guru'],
    deletableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus']
  },
  {
    id: 'keuangan',
    label: 'Modul Keuangan & Syahriyah',
    category: 'Keuangan',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'ppdb',
    label: 'Modul PPDB (Mutasi NIS)',
    category: 'PPDB',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'pengurus'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'portal-wali',
    label: 'Portal Wali Santri',
    category: 'Portal',
    allowedRoles: ['admin_yayasan', 'admin_sistem', 'wali_santri'],
    writableRoles: ['admin_yayasan', 'admin_sistem', 'wali_santri'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan & RBAC',
    category: 'Sistem',
    allowedRoles: ['admin_yayasan', 'admin_sistem'],
    writableRoles: ['admin_yayasan', 'admin_sistem'],
    deletableRoles: ['admin_yayasan', 'admin_sistem']
  }
];

export const ROLE_DETAILS: Record<UserRole, { title: string; description: string; color: string }> = {
  admin_yayasan: {
    title: 'Admin Yayasan (Utama)',
    description: 'Akses penuh tanpa batas untuk mengelola seluruh sistem, data santri, keuangan syahriyah, kepegawaian, hingga konfigurasi RBAC.',
    color: 'bg-[#1A5276] text-white'
  },
  admin_sistem: {
    title: 'Admin Yayasan (Utama)',
    description: 'Akses penuh tanpa batas untuk mengelola seluruh sistem, data santri, keuangan syahriyah, kepegawaian, hingga konfigurasi RBAC.',
    color: 'bg-[#1A5276] text-white'
  },
  pengurus: {
    title: 'Pengurus Pesantren (Operasional)',
    description: 'Mengelola operasional harian: Kesantrian, Asrama/Kamar, Madrasah Diniyah, Sekolah Formal, Izin Santri, UKS, dan PPDB.',
    color: 'bg-[#2E86C1] text-white'
  },
  guru: {
    title: 'Guru / Ustadz Pengampu',
    description: 'Menginput setoran hafalan Tahfidz Quran, setoran Nadhoman kitab, presensi santri KBM, serta catatan pembinaan/konseling.',
    color: 'bg-[#1ABC9C] text-white'
  },
  wali_santri: {
    title: 'Wali Santri',
    description: 'Akses khusus untuk orang tua/wali santri memantau perkembangan hafalan, riwayat kesehatan UKS, perizinan, dan status Syahriyah.',
    color: 'bg-emerald-600 text-white'
  }
};

/**
 * Check if a given role has permission for a specific module and action
 */
export function hasPermission(role: UserRole, moduleId: string, action: ActionType = 'view'): boolean {
  if (role === 'admin_yayasan' || role === 'admin_sistem') return true;

  const mod = MODULE_PERMISSIONS.find(m => m.id === moduleId);
  if (!mod) return true;

  switch (action) {
    case 'view':
      return mod.allowedRoles.includes(role);
    case 'create':
    case 'edit':
      return mod.writableRoles.includes(role);
    case 'delete':
      return mod.deletableRoles.includes(role);
    case 'approve':
      return mod.approverRoles ? mod.approverRoles.includes(role) : mod.writableRoles.includes(role);
    default:
      return false;
  }
}

/**
 * Get first allowed tab for a given role (useful for redirection when accessing unauthorized tab)
 */
export function getFirstAllowedTab(role: UserRole): string {
  if (role === 'wali_santri') return 'portal-wali';
  const allowed = MODULE_PERMISSIONS.filter(m => m.allowedRoles.includes(role));
  return allowed.length > 0 ? allowed[0].id : 'dashboard';
}
