import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    nama: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'siap-pesantren-super-secret-key-2026';

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token autentikasi diperlukan' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token telah kedaluwarsa', code: 'TOKEN_EXPIRED' });
    } else {
      res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
  }
}

export function generateTokens(payload: { id: string; username: string; role: string; nama: string }) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: payload.id }, JWT_SECRET + '_refresh', { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET + '_refresh') as { id: string };
  } catch {
    return null;
  }
}
