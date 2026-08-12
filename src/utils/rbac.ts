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
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'admin_sekolah', 'admin_kepengasuhan', 'bendahara', 'pimpinan', 'guru', 'wali_santri'],
    writableRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'admin_sekolah', 'admin_kepengasuhan', 'bendahara', 'pimpinan', 'guru', 'wali_santri'],
    deletableRoles: ['admin_sistem']
  },
  {
    id: 'sub-pesantren',
    label: 'Sub Pesantren & Asrama',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'pimpinan', 'admin_kepengasuhan'],
    writableRoles: ['admin_sistem', 'admin_pesantren'],
    deletableRoles: ['admin_sistem', 'admin_pesantren']
  },
  {
    id: 'sub-madin',
    label: 'Sub Madin & Kitab',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_madin', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_madin'],
    deletableRoles: ['admin_sistem', 'admin_madin']
  },
  {
    id: 'sub-sekolah',
    label: 'Sub Sekolah Formal',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_sekolah', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_sekolah'],
    deletableRoles: ['admin_sistem', 'admin_sekolah']
  },
  {
    id: 'data-santri',
    label: 'Data Santri (8 Form)',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'admin_sekolah', 'admin_kepengasuhan', 'bendahara', 'pimpinan', 'guru'],
    writableRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'admin_sekolah'],
    deletableRoles: ['admin_sistem', 'admin_pesantren']
  },
  {
    id: 'tahfidz',
    label: 'Sub Tahfidz Quran',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'guru'],
    deletableRoles: ['admin_sistem', 'admin_madin']
  },
  {
    id: 'nadhoman',
    label: 'Sub Setoran Nadhoman',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'admin_madin', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_madin', 'guru'],
    deletableRoles: ['admin_sistem', 'admin_madin']
  },
  {
    id: 'alumni',
    label: 'Sub Data Alumni',
    category: 'Kesantrian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_pesantren'],
    deletableRoles: ['admin_sistem']
  },
  {
    id: 'kesehatan',
    label: 'Kesehatan (UKS)',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_sistem', 'admin_kepengasuhan', 'admin_pesantren', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_kepengasuhan'],
    deletableRoles: ['admin_sistem', 'admin_kepengasuhan']
  },
  {
    id: 'perizinan',
    label: 'Perizinan Santri',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_sistem', 'admin_kepengasuhan', 'admin_pesantren', 'pimpinan', 'guru'],
    writableRoles: ['admin_sistem', 'admin_kepengasuhan', 'admin_pesantren', 'guru'],
    deletableRoles: ['admin_sistem', 'admin_kepengasuhan'],
    approverRoles: ['admin_sistem', 'admin_kepengasuhan', 'admin_pesantren', 'pimpinan']
  },
  {
    id: 'konseling',
    label: 'Konseling & Kunjungan',
    category: 'Kepengasuhan',
    allowedRoles: ['admin_sistem', 'admin_kepengasuhan', 'admin_pesantren', 'pimpinan', 'guru'],
    writableRoles: ['admin_sistem', 'admin_kepengasuhan', 'guru'],
    deletableRoles: ['admin_sistem', 'admin_kepengasuhan']
  },
  {
    id: 'kepegawaian',
    label: 'Modul Kepegawaian',
    category: 'Kepegawaian',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'pimpinan'],
    writableRoles: ['admin_sistem'],
    deletableRoles: ['admin_sistem']
  },
  {
    id: 'akademik',
    label: 'Modul Akademik / Presensi',
    category: 'Akademik',
    allowedRoles: ['admin_sistem', 'admin_sekolah', 'admin_madin', 'guru', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_sekolah', 'admin_madin', 'guru'],
    deletableRoles: ['admin_sistem', 'admin_sekolah', 'admin_madin']
  },
  {
    id: 'keuangan',
    label: 'Modul Keuangan & Syahriyah',
    category: 'Keuangan',
    allowedRoles: ['admin_sistem', 'bendahara', 'pimpinan'],
    writableRoles: ['admin_sistem', 'bendahara'],
    deletableRoles: ['admin_sistem', 'bendahara']
  },
  {
    id: 'ppdb',
    label: 'Modul PPDB (Mutasi NIS)',
    category: 'PPDB',
    allowedRoles: ['admin_sistem', 'admin_pesantren', 'admin_sekolah', 'admin_madin', 'bendahara', 'pimpinan'],
    writableRoles: ['admin_sistem', 'admin_pesantren', 'admin_sekolah', 'admin_madin'],
    deletableRoles: ['admin_sistem']
  },
  {
    id: 'portal-wali',
    label: 'Portal Wali Santri',
    category: 'Portal',
    allowedRoles: ['admin_sistem', 'wali_santri', 'pimpinan'],
    writableRoles: ['admin_sistem', 'wali_santri'],
    deletableRoles: ['admin_sistem']
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan & RBAC',
    category: 'Sistem',
    allowedRoles: ['admin_sistem', 'pimpinan'],
    writableRoles: ['admin_sistem'],
    deletableRoles: ['admin_sistem']
  }
];

export const ROLE_DETAILS: Record<UserRole, { title: string; description: string; color: string }> = {
  admin_sistem: {
    title: 'Admin Sistem (Super Admin)',
    description: 'Akses penuh tanpa batas untuk mengelola seluruh modul, data santri, keuangan, serta pengaturan hak akses RBAC.',
    color: 'bg-purple-600 text-white'
  },
  admin_pesantren: {
    title: 'Admin Pesantren',
    description: 'Mengelola master data pesantren, unit, asrama, kamar, data santri, mutasi alumni, serta koordinasi kepengasuhan.',
    color: 'bg-[#1A5276] text-white'
  },
  admin_madin: {
    title: 'Admin Madrasah Diniyah',
    description: 'Mengelola kurikulum Madin, marhalah, kelas Madin, kitab hafalan, setoran nadhoman, dan presensi santri madin.',
    color: 'bg-emerald-700 text-white'
  },
  admin_sekolah: {
    title: 'Admin Sekolah Formal',
    description: 'Mengelola data unit sekolah (MTs/MA/SMK), jurusan, kelas formal, dan presensi harian sekolah.',
    color: 'bg-blue-700 text-white'
  },
  admin_kepengasuhan: {
    title: 'Admin Kepengasuhan & UKS',
    description: 'Mengelola catatan kesehatan santri (UKS), persetujuan (approval) perizinan pulang/keluar, log konseling, dan tamu.',
    color: 'bg-amber-700 text-white'
  },
  bendahara: {
    title: 'Bendahara Keuangan & Syahriyah',
    description: 'Mengelola master tarif biaya, pembuatan tagihan syahriyah bulanan, penerimaan pembayaran, dan cetak kuitansi.',
    color: 'bg-teal-700 text-white'
  },
  pimpinan: {
    title: 'Pengasuh Utama / Pimpinan',
    description: 'Akses peninjauan (Executive View Only) seluruh statistik pesantren, laporan keuangan, presensi, serta approval perizinan.',
    color: 'bg-indigo-800 text-white'
  },
  guru: {
    title: 'Guru / Ustadz Pengampu',
    description: 'Menginput setoran hafalan Tahfidz Quran, setoran Nadhoman kitab, presensi santri, serta catatan konseling.',
    color: 'bg-cyan-700 text-white'
  },
  wali_santri: {
    title: 'Portal Wali Santri',
    description: 'Akses khusus untuk orang tua santri melihat perkembangan hafalan, riwayat kesehatan, tagihan syahriyah, dan perizinan.',
    color: 'bg-emerald-600 text-white'
  }
};

/**
 * Check if a given role has permission for a specific module and action
 */
export function hasPermission(role: UserRole, moduleId: string, action: ActionType = 'view'): boolean {
  if (role === 'admin_sistem') return true;

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
