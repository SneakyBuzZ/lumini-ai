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
    uniqueIndex("lab_creator_idx").on(labsTable.creatorId),
    uniqueIndex("lab_workspace_idx").on(labsTable.workspaceId),
    index("lab_githubUrl_idx").on(labsTable.githubUrl),
    index("lab_createdAt_idx").on(labsTable.createdAt),
    index("lab_updatedAt_idx").on(labsTable.updatedAt),
  ]
);

export const VectorDBEnum = pgEnum("vector_db", [
  "postgresql",
  "pinecone",
  "chroma",
  "mongodb",
]);

export const EmbeddingModel = pgEnum("embedding_model", [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "text-embedding-3-small",
  "text-embedding-3-large",
]);

export const visibility = pgEnum("visibility", ["public", "private"]);

export const labSettingsTable = pgTable(
  "lab_settings",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => cuid())
      .primaryKey(),

    labId: varchar("lab_id", { length: 36 })
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull(),

    visibility: visibility("visibility").default("public"),
    vectorDb: VectorDBEnum("vector_db").default("postgresql"),
    embeddingModel: varchar("embedding_model", { length: 255 }).default(
      "gemini-1.5-flash"
    ),
    apiKey: varchar("api_key", { length: 255 }).unique(),
    maxLabUsers: integer("max_lab_users").notNull(),
    temperature: varchar("temperature", { length: 255 }).default("0.5"),
    allowPublicSharing: boolean("allow_public_sharing").default(true),
  },
  (labSettingsTable) => [
    uniqueIndex("lab_api_key_idx").on(labSettingsTable.apiKey),
    index("lab_labId_idx").on(labSettingsTable.labId),
    index("lab_visibility_idx").on(labSettingsTable.visibility),
    index("lab_public_sharing_idx").on(labSettingsTable.allowPublicSharing),
  ]
);

export const labRelations = relations(labsTable, ({ one }) => ({
  creator: one(usersTable, {
    fields: [labsTable.creatorId],
    references: [usersTable.id],
  }),
  settings: one(labSettingsTable, {
    fields: [labsTable.id],
    references: [labSettingsTable.labId],
  }),
}));

// export const labInviteRoleEnum = pgEnum("lab_invite_role", [
//   "Viewer",
//   "Contributor",
//   "Admin",
// ]);

// export const labInviteStatusEnum = pgEnum("lab_invite_status", [
//   "Pending",
//   "Accepted",
//   "Declined",
// ]);

// export const labInvitesTable = pgTable("lab_invites", {
//   id: uuid().defaultRandom().primaryKey(),

//   labId: uuid()
//     .references(() => labsTable.id, { onDelete: "cascade" })
//     .notNull(),

//   invitedById: uuid().references(() => usersTable.id, { onDelete: "set null" }),

//   email: varchar({ length: 255 }).notNull(),

//   role: labInviteRoleEnum("role").notNull().default("Viewer"),
//   status: labInviteStatusEnum("status").notNull().default("Pending"),

//   createdAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp().notNull().defaultNow(),
// });

// export const labMembersTable = pgTable("lab_members", {
//   id: uuid().defaultRandom().primaryKey(),

//   memberId: uuid()
//     .references(() => usersTable.id, { onDelete: "cascade" })
//     .notNull(),

//   labId: uuid()
//     .references(() => labsTable.id, { onDelete: "cascade" })
//     .notNull(),

//   role: labInviteRoleEnum().notNull().default("Viewer"),

//   joinedAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp().notNull().defaultNow(),
// });

// export const labFilesTable = pgTable("lab_files", {
//   id: uuid().defaultRandom().primaryKey(),

//   labId: uuid()
//     .references(() => labsTable.id, { onDelete: "cascade" })
//     .notNull(),

//   name: varchar({ length: 255 }).notNull(),
//   content: text().notNull(),
//   summary: text().notNull(),

//   createdAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp().notNull().defaultNow(),
// });
