import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
  out: "./database",
  schema: [
    "./src/tables/lab.table.ts",
    "./src/tables/user.table.ts",
    "./src/tables/account.table.ts",
    "./src/tables/workspace.table.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
});
