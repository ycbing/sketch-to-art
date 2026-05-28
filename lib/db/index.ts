import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const requiredEnvVars = ["DATABASE_URL", "GLM_API_KEY"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. Please set them in your .env file.`
  );
}

const recommendedEnvVars = ["NEXTAUTH_SECRET", "COS_SECRET_ID", "COS_SECRET_KEY", "COS_BUCKET", "COS_REGION"];
const recommended = recommendedEnvVars.filter((key) => !process.env[key]);
if (recommended.length > 0) {
  console.warn(
    `[env] Missing recommended environment variables: ${recommended.join(", ")}. Some features may not work correctly.`
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });
