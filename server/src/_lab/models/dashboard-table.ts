import {
  pgTable,
  varchar,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import cuid from "cuid";
import { labsTable } from "@/_lab/models/lab-table";

export const overviewTable = pgTable(
  "overviews",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => cuid())
      .primaryKey(),

    labId: varchar("lab_id", { length: 36 })
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull()
      .unique(),

    //---------- Basic Info ----------
    fullname: varchar("fullname", { length: 300 }).notNull(),
    summary: varchar("summary", { length: 5000 }),
    branch: varchar("branch", { length: 200 }),
    visibility: varchar("visibility", { length: 50 }),

    techstack: jsonb("techstack").notNull(),

    files: integer("files"),

    sizeKb: integer("size_kb"),

    lastActivityAt: timestamp("last_activity_at"),

    scope: varchar("scope", { length: 100 }),

    languages: jsonb("languages").notNull(),

    totalBytes: integer("total_bytes"),

    architecture: jsonb("file_architecture").notNull(),

    repoCreatedAt: timestamp("repo_created_at"),

    refreshedAt: timestamp("refreshed_at").notNull().defaultNow(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("repo_overview_lab_idx").on(table.labId),
    index("repo_overview_refreshed_idx").on(table.refreshedAt),
  ],
);
