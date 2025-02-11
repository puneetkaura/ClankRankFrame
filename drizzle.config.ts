import { defineConfig, Config } from "drizzle-kit";


export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-quiet-cherry-321060-pooler.ap-southeast-1.aws.neon.tech",
    user: "puneet.kaura",
    password: "lu06FQXfyWda",
    database: "neondb",
    ssl: true,
  },
} satisfies Config;


