import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/_user/models/user-model";
import { workspacesTable } from "@/_workspace/models/workspace-model";
import cuid from "cuid";
import { relations } from "drizzle-orm";

export const labsTable = pgTable(
  "labs",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => cuid())
      .primaryKey(),

    name: varchar("name", { length: 255 }).notNull().unique(),
    githubUrl: varchar("github_url", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    creatorId: varchar("creator_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),

    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (labsTable) => [
    uniqueIndex("lab_name_idx").on(labsTable.name),
    index("lab_workspace_idx").on(labsTable.workspaceId),
    index("lab_githubUrl_idx").on(labsTable.githubUrl),
    index("lab_createdAt_idx").on(labsTable.createdAt),
    index("lab_updatedAt_idx").on(labsTable.updatedAt),
  ],
);

export const vectorDBEnum = pgEnum("vector_db", ["postgresql", "qdrant"]);

export const apiServiceEnum = pgEnum("api_service", [
  "openai",
  "gemini",
  "anthropic",
]);

export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

export const labSettingsTable = pgTable(
  "lab_settings",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => cuid())
      .primaryKey(),

    labId: varchar("lab_id", { length: 36 })
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull(),

    /* Visibility & access */
    visibility: varchar("visibility", { length: 20 }).default("public"),

    allowPublicSharing: boolean("allow_public_sharing").default(true).notNull(),

    maxLabUsers: integer("max_lab_users").notNull(),

    /* Vector DB config */
    vectorDbService: vectorDBEnum("vector_db_service").default("postgresql"),
    vectorDbConnectionString: varchar("vector_db_connection_string", {
      length: 1000,
    }),

    /* LLM / API config */
    apiService: apiServiceEnum("api_service").default("gemini"),

    apiBaseUrl: varchar("api_base_url", { length: 1000 }),

    modelName: varchar("model_name", { length: 255 }),

    apiKey: varchar("api_key", { length: 255 }),

    /* Generation controls */
    temperature: varchar("temperature", { length: 10 })
      .default("0.5")
      .notNull(),
  },
  (table) => [
    index("lab_settings_lab_id_idx").on(table.labId),
    index("lab_settings_visibility_idx").on(table.visibility),
    index("lab_settings_public_idx").on(table.allowPublicSharing),
    index("lab_settings_api_service_idx").on(table.apiService),
  ],
);

export const labFilesTable = pgTable("lab_files", {
  id: varchar("id", { length: 36 })
    .$defaultFn(() => cuid())
    .primaryKey(),

  labId: varchar("lab_id", { length: 36 })
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 36 })
    .references(() => usersTable.id, { onDelete: "set null" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  path: varchar("path", { length: 1000 }).notNull(),
  content: varchar("content").notNull(),
  summary: varchar("summary", { length: 3000 }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const labRelations = relations(labsTable, ({ one }) => ({
  creator: one(usersTable, {
    fields: [labsTable.creatorId],
    references: [usersTable.id],
  }),
  settings: one(labSettingsTable, {
    fields: [labsTable.id],
    references: [labSettingsTable.labId],
  }),
  files: one(labFilesTable, {
    fields: [labsTable.id],
    references: [labFilesTable.labId],
  }),
}));

export const labChatSessionsTable = pgTable(
  "lab_chat_sessions",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => cuid())
      .primaryKey(),
    labId: varchar("lab_id", { length: 36 })
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (labChatSessionsTable) => [
    index("lab_chat_sessions_labId_idx").on(labChatSessionsTable.labId),
  ],
);

export const role = pgEnum("role", ["user", "assistant", "system"]);

export const labChatMessagesTable = pgTable("lab_chat_messages", {
  id: varchar("id", { length: 36 })
    .$defaultFn(() => cuid())
    .primaryKey(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => labChatSessionsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => usersTable.id, {
    onDelete: "set null",
  }),
  role: role("role").notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
