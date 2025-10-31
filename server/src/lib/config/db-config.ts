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
});

(async () => {
  try {
    await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Connected to the PostgreSQL database successfully.");
  } catch (error) {
    console.error(
      "❌ Error connecting to the PostgreSQL database:",
      (error as Error).message
    );
  }
})();

export const db = drizzle(pool, { schema });
