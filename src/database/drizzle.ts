import { config as dotenvConfig } from "dotenv";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Load environment variables
dotenvConfig({ path: ".env.local" });

const isProd = process.env.NODE_ENV === "production";

neonConfig.pipelineConnect = false;

const databaseURL = process.env.DATABASE_URL;
if (!databaseURL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sql = neon(databaseURL, {
  fullResults: true,
  arrayMode: false,
  fetchOptions: isProd ? undefined : { cache: "no-store" },
});

const db = drizzle({ client: sql });

export default db;
