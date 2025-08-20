import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
  out: "./database",
  schema: [
    "./src/_user/models/account-model.ts",
    "./src/_user/models/user-model.ts",
    "./src/_workspace/models/workspace-model.ts",
    "./src/_lab/models/lab-table.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
