import { DATABASE_URL } from "@/utils/constants";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

import * as authModels from "@/_user/models/auth-models";
import * as userModels from "@/_user/models/user-model";
import * as workspaceModel from "@/_workspace/models/workspace-model";
import * as workspaceSettingsModel from "@/_workspace/models/workspace-settings-model";
import * as workspaceMembersModel from "@/_workspace/models/workspace-members-model";
import * as workspaceInvitesModel from "@/_workspace/models/workspace-invites-model";
// import * as labModels from "@/_lab/models/lab-table";
// import * as shapeModels from "@/_lab/models/shape-table";
import { PgTransaction } from "drizzle-orm/pg-core";

const schema = {
  ...authModels,
  ...userModels,
  ...workspaceModel,
  ...workspaceSettingsModel,
  ...workspaceMembersModel,
  ...workspaceInvitesModel,
  // ...labModels,
  // ...shapeModels,
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
export type DbExecutor =
  | NodePgDatabase<typeof schema>
  | PgTransaction<any, typeof schema>;
