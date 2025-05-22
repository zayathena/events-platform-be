import { Pool } from 'pg';

const ENV = process.env.NODE_ENV || 'development';

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL must be set');
}

const config: any = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);

export default pool;