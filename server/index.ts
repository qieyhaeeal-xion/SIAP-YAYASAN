import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { santriRouter } from './routes/santri';
import { kesantrianRouter } from './routes/kesantrian';
import { tahfidzRouter } from './routes/tahfidz';
import { kepengasuhanRouter } from './routes/kepengasuhan';
import { keuanganRouter } from './routes/keuangan';
import { ppdbRouter } from './routes/ppdb';
import { usersRouter } from './routes/users';
import { akademikRouter } from './routes/akademik';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ───────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parsing ─────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'SIAP Backend API v1.0' });
});

// ─── Routes ───────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/santri', santriRouter);
app.use('/api/kesantrian', kesantrianRouter);
app.use('/api/tahfidz', tahfidzRouter);
app.use('/api/kepengasuhan', kepengasuhanRouter);
app.use('/api/keuangan', keuanganRouter);
app.use('/api/ppdb', ppdbRouter);
app.use('/api/users', usersRouter);
app.use('/api/akademik', akademikRouter);

// ─── Global Error Handler ─────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SIAP API Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// ─── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m[SIAP Backend]\x1b[0m Server berjalan di http://localhost:${PORT}`);
  console.log(`\x1b[36m[SIAP Backend]\x1b[0m Health check: http://localhost:${PORT}/api/health`);
});

export default app;
