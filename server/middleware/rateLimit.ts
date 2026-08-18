import rateLimit from 'express-rate-limit';

// Strict limiter untuk endpoint auth (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false
});

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 200,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi sebentar.' },
  standardHeaders: true,
  legacyHeaders: false
});
