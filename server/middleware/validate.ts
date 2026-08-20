// ─────────────────────────────────────────────────────────────
// Lightweight request validation tanpa dependency eksternal.
// Menutup celah mass-assignment: hanya field terdaftar yang
// diteruskan ke Prisma.
// ─────────────────────────────────────────────────────────────

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Body = Record<string, unknown>;

// Ambil hanya field yang di-whitelist dari req.body.
export function pick<T extends object>(body: Body, allowed: string[]): Partial<T> {
  const result: Body = {};
  for (const key of allowed) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result as Partial<T>;
}

// Pastikan field wajib terisi (bukan undefined/null/string kosong).
export function requireFields(body: Body, required: string[]): void {
  const missing = required.filter((key) => {
    const v = body[key];
    return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
  });
  if (missing.length > 0) {
    throw new HttpError(400, `Field wajib belum lengkap: ${missing.join(', ')}`);
  }
}

// Validasi angka positif.
export function assertPositiveInt(value: unknown, fieldName: string): void {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, `${fieldName} harus berupa angka bulat positif`);
  }
}

// Validasi rentang angka.
export function assertIntRange(value: unknown, min: number, max: number, fieldName: string): void {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) {
    throw new HttpError(400, `${fieldName} harus angka bulat antara ${min} dan ${max}`);
  }
}

// Normalisasi error Prisma known-request ke HttpError agar
// global error handler mengembalikan status HTTP yang tepat.
export function prismaKnownErrorMessage(code: string, metaTarget?: unknown): HttpError | null {
  switch (code) {
    case 'P2002':
      return new HttpError(409, `Data duplikat: ${String(metaTarget ?? 'field unik')} sudah digunakan`);
    case 'P2025':
      return new HttpError(404, 'Data tidak ditemukan');
    case 'P2003':
      return new HttpError(400, 'Relasi data tidak valid (foreign key tidak cocok)');
    default:
      return null;
  }
}
