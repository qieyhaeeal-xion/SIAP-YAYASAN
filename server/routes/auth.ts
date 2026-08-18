import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokens, verifyToken, verifyRefreshToken, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
      return;
    }

    const payload = { id: user.id, username: user.username, role: user.role, nama: user.nama };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Simpan refresh token ke DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: { id: user.id, username: user.username, nama: user.nama, role: user.role, email: user.email, avatar: user.avatar, santriIdAssociated: user.santriIdAssociated },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token diperlukan' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ success: false, message: 'Refresh token tidak valid atau kedaluwarsa' });
      return;
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.status(401).json({ success: false, message: 'Refresh token tidak valid' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User tidak ditemukan atau tidak aktif' });
      return;
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const payload = { id: user.id, username: user.username, role: user.role, nama: user.nama };
    const tokens = generateTokens(payload);

    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({ success: true, data: tokens });
  } catch (error) {
    console.error('[Auth Refresh Error]', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// POST /api/auth/logout
router.post('/logout', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ success: true, message: 'Logout berhasil' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, nama: true, role: true, email: true, avatar: true, noHp: true, santriIdAssociated: true, isActive: true }
    });
    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export { router as authRouter };
