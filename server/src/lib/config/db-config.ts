import { DATABASE_URL } from "@/utils/constants";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

import * as accountModels from "@/_user/models/account-model";
import * as userModels from "@/_user/models/user-model";
import * as workspaceModels from "@/_workspace/models/workspace-model";
import * as labModels from "@/_lab/models/lab-table";
import * as shapeModels from "@/_lab/models/shape-table";

const schema = {
  ...accountModels,
  ...userModels,
  ...workspaceModels,
  ...labModels,
  ...shapeModels,
};

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 5,
  statement_timeout: 10_000,
  idleTimeoutMillis: 30_000,
  allowExitOnIdle: true,
});

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to the PostgreSQL database successfully.");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error("Message:", (error as Error).message);
    process.exit(1);
  }
})();

export const db = drizzle(pool, { schema });
