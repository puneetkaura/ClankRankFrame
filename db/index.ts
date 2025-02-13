import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from "./schema";

const password = encodeURIComponent("vx7j=1tf'?1r}+'_");

const config = {
  connectionString: `postgresql://postgres:${password}@34.131.165.84/pk_testing`,
};

export const pool = new Pool(config);

// Initialize drizzle with pool
export const db = drizzle(pool, { schema });

// console.log("Database connection initialized");


pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));
// export const db = drizzle({ client: pool, schema });