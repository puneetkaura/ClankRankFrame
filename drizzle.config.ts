import { defineConfig, Config } from "drizzle-kit";


export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "34.131.165.84",
    user: "postgres",
    password: "vx7j=1tf'?1r}+'_",
    database: "pk_testing",
    ssl: false,
  },
} satisfies Config;


