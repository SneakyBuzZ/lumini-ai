import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
  out: "./database",
  schema: [
    "./src/_lab/lab-table.ts",
    "./src/_workspace/workspace-schema.ts",
    "./src/_user/account.table.ts",
    "./src/_user/user-table.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
});
