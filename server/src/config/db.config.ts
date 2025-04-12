import { DATABASE_URL } from "@/utils/constants";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

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

export const db = drizzle({ client: pool });
