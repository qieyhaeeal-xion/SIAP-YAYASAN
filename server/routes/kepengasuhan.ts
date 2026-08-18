import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireKepengasuhan } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();
router.use(verifyToken);

// ─── KESEHATAN UKS ────────────────────────────────────
router.get('/kesehatan', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.status) where.status = req.query.status;
  const data = await prisma.kesehatanUks.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});
router.post('/kesehatan', requireKepengasuhan, async (req, res: Response) => {
  const data = await prisma.kesehatanUks.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.patch('/kesehatan/:id/status', requireKepengasuhan, async (req, res: Response) => {
  const data = await prisma.kesehatanUks.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ success: true, data });
});

// ─── PERIZINAN ────────────────────────────────────────
router.get('/perizinan', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  if (req.query.statusApproval) where.statusApproval = req.query.statusApproval;
  const data = await prisma.perizinan.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});
router.post('/perizinan', async (req, res: Response) => {
  const data = await prisma.perizinan.create({ data: req.body });
  res.status(201).json({ success: true, data });
});
router.patch('/perizinan/:id/status', requireKepengasuhan, async (req: AuthRequest, res: Response) => {
  const { status, approver } = req.body;
  const data = await prisma.perizinan.update({
    where: { id: req.params.id },
    data: { statusApproval: status, disetujuiOleh: approver || req.user?.nama }
  });
  res.json({ success: true, data });
});

// ─── LOG KONSELING ────────────────────────────────────
router.get('/konseling', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  const data = await prisma.logKonseling.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});
router.post('/konseling', requireKepengasuhan, async (req, res: Response) => {
  const data = await prisma.logKonseling.create({ data: req.body });
  res.status(201).json({ success: true, data });
});

// ─── KUNJUNGAN SANTRI ─────────────────────────────────
router.get('/kunjungan', async (req, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.santriId) where.santriId = req.query.santriId;
  const data = await prisma.kunjunganSantri.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});
router.post('/kunjungan', requireKepengasuhan, async (req, res: Response) => {
  const data = await prisma.kunjunganSantri.create({ data: req.body });
  res.status(201).json({ success: true, data });
});

export { router as kepengasuhanRouter };
