import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma ORM 7: koneksi URL dipindah dari schema.prisma ke config ini.
// Isi DATABASE_URL pada file .env (Postgres/Supabase) sebelum menjalankan migrasi.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL
  }
});