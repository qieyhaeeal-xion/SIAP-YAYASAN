import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireRole, UserRole } from '../middleware/rbac';
import { apiLimiter } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/asyncHandler';
import { pick, requireFields, HttpError } from '../middleware/validate';

const router = Router();
const prisma = new PrismaClient();
router.use(apiLimiter);
router.use(verifyToken);

const USER_SELECT = {
  id: true,
  username: true,
  nama: true,
  email: true,
  role: true,
  noHp: true,
  avatar: true,
  santriIdAssociated: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
};

const USER_WRITABLE = [
  'username', 'nama', 'email', 'role', 'noHp', 'avatar',
  'santriIdAssociated', 'isActive'
];

const VALID_ROLES: UserRole[] = [
  'admin_sistem', 'admin_pesantren', 'admin_madin', 'admin_sekolah',
  'admin_kepengasuhan', 'bendahara', 'pimpinan', 'guru', 'wali_santri'
];

// GET /api/users - Daftar user (filter role & search)
router.get('/', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const where: Record<string, unknown> = {};
  const { role, search, isActive } = req.query;
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { nama: { contains: search as string, mode: 'insensitive' } },
      { username: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  const data = await prisma.user.findMany({ where, select: USER_SELECT, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
}));

// GET /api/users/:id
router.get('/:id', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: USER_SELECT });
  if (!user) throw new HttpError(404, 'User tidak ditemukan');
  res.json({ success: true, data: user });
}));

// POST /api/users - Tambah user baru
router.post('/', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['username', 'nama', 'password', 'role']);
  const { password, ...rest } = req.body;

  if (!VALID_ROLES.includes(rest.role as UserRole)) {
    throw new HttpError(400, `Role tidak valid. Pilihan: ${VALID_ROLES.join(', ')}`);
  }
  if (String(password).length < 8) {
    throw new HttpError(400, 'Password minimal 8 karakter');
  }
  if (rest.role === 'wali_santri' && !rest.santriIdAssociated) {
    throw new HttpError(400, 'User wali_santri wajib terhubung ke data santri (santriIdAssociated)');
  }

  const data = pick<Record<string, unknown>>(req.body, USER_WRITABLE);
  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = await prisma.user.create({
    data: { ...data, passwordHash } as never,
    select: USER_SELECT
  });
  res.status(201).json({ success: true, message: 'User berhasil dibuat', data: user });
}));

// PUT /api/users/:id - Update user (password opsional)
router.put('/:id', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  requireFields(req.body, ['nama']);
  const { password, ...rest } = req.body;

  if (rest.role !== undefined && !VALID_ROLES.includes(rest.role as UserRole)) {
    throw new HttpError(400, `Role tidak valid. Pilihan: ${VALID_ROLES.join(', ')}`);
  }
  if (rest.role === 'wali_santri' && rest.santriIdAssociated === null) {
    throw new HttpError(400, 'User wali_santri wajib terhubung ke data santri');
  }

  const data = pick<Record<string, unknown>>(req.body, USER_WRITABLE);
  if (password !== undefined && password !== '') {
    if (String(password).length < 8) throw new HttpError(400, 'Password minimal 8 karakter');
    data.passwordHash = await bcrypt.hash(String(password), 10);
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: data as never,
    select: USER_SELECT
  });
  res.json({ success: true, message: 'Data user berhasil diperbarui', data: user });
}));

// PATCH /api/users/:id/status - Aktifkan/nonaktifkan user
router.patch('/:id/status', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (typeof req.body.isActive !== 'boolean') {
    throw new HttpError(400, 'Field isActive harus boolean (true/false)');
  }
  if (req.body.isActive === false && req.user?.id === req.params.id) {
    throw new HttpError(400, 'Tidak dapat menonaktifkan akun yang sedang login');
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: req.body.isActive },
    select: USER_SELECT
  });
  res.json({ success: true, message: `User berhasil ${req.body.isActive ? 'diaktifkan' : 'dinonaktifkan'}`, data: user });
}));

// DELETE /api/users/:id
router.delete('/:id', requireRole('admin_sistem'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.id === req.params.id) {
    throw new HttpError(400, 'Tidak dapat menghapus akun yang sedang login');
  }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'User berhasil dihapus' });
}));

export { router as usersRouter };
