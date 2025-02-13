// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import { Pool } from 'pg';
import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
// import ws from "ws";
import * as schema from "./schema";

// neonConfig.webSocketConstructor = ws;

console.log("Initializing database connection...");
// const config = {
//   connectionString: "postgresql://puneet.kaura:lu06FQXfyWda@ep-quiet-cherry-321060-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
//   ssl: {
//     require: true,
//     rejectUnauthorized: false
//   }
// };
const password = encodeURIComponent("vx7j=1tf'?1r}+'_");

const config = {
  connectionString: `postgresql://postgres:${password}@34.131.165.84/pk_testing`,
  // ssl: {
  //   // require: true,
  //   rejectUnauthorized: false
  // }
};

export const pool = new Pool(config);

// Initialize drizzle with pool
export const db = drizzle(pool, { schema });

console.log("Database connection initialized");


pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));
// export const db = drizzle({ client: pool, schema });