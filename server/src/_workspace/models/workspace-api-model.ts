import cuid from "cuid";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspacesTable } from "./workspace-model";
import { workspaceVisibilityEnum } from "./workspace-settings-model";

export const workspaceApisTable = pgTable("workspace_apis", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => cuid()),

  workspaceId: varchar("workspace_id", { length: 36 })
    .references(() => workspacesTable.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  embeddingModel: varchar("embedding_model", { length: 255 }),
  apiKey: varchar("api_key", { length: 255 }).unique(),
  visibility: workspaceVisibilityEnum("visibility").default("public"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
