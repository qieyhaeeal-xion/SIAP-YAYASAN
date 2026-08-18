import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export type UserRole =
  | 'admin_sistem'
  | 'admin_pesantren'
  | 'admin_madin'
  | 'admin_sekolah'
  | 'admin_kepengasuhan'
  | 'bendahara'
  | 'pimpinan'
  | 'guru'
  | 'wali_santri';

// Role hierarchy — higher index = more access
const ROLE_HIERARCHY: UserRole[] = [
  'wali_santri',
  'guru',
  'pimpinan',
  'bendahara',
  'admin_kepengasuhan',
  'admin_sekolah',
  'admin_madin',
  'admin_pesantren',
  'admin_sistem'
];

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
      return;
    }
    const userRole = req.user.role as UserRole;
    if (!roles.includes(userRole) && userRole !== 'admin_sistem') {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Role yang diizinkan: ${roles.join(', ')}`
      });
      return;
    }
    next();
  };
}

export function requireMinRole(minRole: UserRole) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
      return;
    }
    const userRoleIndex = ROLE_HIERARCHY.indexOf(req.user.role as UserRole);
    const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole);
    if (userRoleIndex < minRoleIndex) {
      res.status(403).json({ success: false, message: 'Akses ditolak. Hak akses tidak mencukupi.' });
      return;
    }
    next();
  };
}

// Admin check shorthand
export const requireAdmin = requireRole('admin_sistem', 'admin_pesantren');
export const requireKeuangan = requireRole('admin_sistem', 'bendahara');
export const requireKepengasuhan = requireRole('admin_sistem', 'admin_kepengasuhan');
export const requireAkademik = requireRole('admin_sistem', 'admin_madin', 'admin_sekolah', 'guru');
