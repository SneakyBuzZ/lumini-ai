import {
  pgTable,
  varchar,
  timestamp,
  uniqueIndex,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import cuid from "cuid";
import { workspacesTable } from "./workspace-model";

export const workspaceVisibilityEnum = pgEnum("workspace_visibility", [
  "public",
  "private",
]);

export const workspaceSettingsTable = pgTable(
  "workspace_settings",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    visibility: workspaceVisibilityEnum("visibility").default("public"),
    defaultLanguage: varchar("default_language", { length: 10 }).default("en"),

    notificationsEnabled: boolean("notifications_enabled")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (workspaceSettingsTable) => [
    uniqueIndex("workspace_settings_workspace_unique").on(
      workspaceSettingsTable.workspaceId,
    ),
    index("workspace_visibility_idx").on(workspaceSettingsTable.visibility),
  ],
);
