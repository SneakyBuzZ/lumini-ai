import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
  integer,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/tables/user.table";
import { workspacesTable } from "@/tables/workspace.table";

export const labsTable = pgTable(
  "labs",
  {
    id: uuid().defaultRandom().primaryKey(),

    name: varchar({ length: 255 }).notNull().unique(),
    githubUrl: varchar({ length: 255 }).notNull().unique(),

    creatorId: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),

    workspaceId: uuid()
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    isPublic: boolean().default(true),
    isArchived: boolean().default(false),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (labsTable) => [
    uniqueIndex("lab_name_idx").on(labsTable.name),
    uniqueIndex("lab_githubUrl_idx").on(labsTable.githubUrl),
    uniqueIndex("lab_creatorId_idx").on(labsTable.creatorId),
    uniqueIndex("lab_workspaceId_idx").on(labsTable.workspaceId),
    uniqueIndex("lab_isPublic_idx").on(labsTable.isPublic),
    uniqueIndex("lab_isArchived_idx").on(labsTable.isArchived),
    uniqueIndex("lab_createdAt_idx").on(labsTable.createdAt),
    uniqueIndex("lab_updatedAt_idx").on(labsTable.updatedAt),
  ]
);

export const labSettingsTable = pgTable("lab_settings", {
  id: uuid().defaultRandom().primaryKey(),

  labId: uuid()
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull(),

  vectorDb: varchar({ length: 255 }).default("pinecone"),
  maxLabUsers: integer().notNull().default(1),
  embeddingProvider: varchar({ length: 255 }).default("gemini"),
  temperature: varchar({ length: 255 }).default("0.5"),

  allowPublicSharing: boolean().default(false),
  enableVersioning: boolean().default(true),
  enableRealtime: boolean().default(false),
});

export const labInviteRoleEnum = pgEnum("lab_invite_role", [
  "Viewer",
  "Contributor",
  "Admin",
]);

export const labInviteStatusEnum = pgEnum("lab_invite_status", [
  "Pending",
  "Accepted",
  "Declined",
]);

export const labInvitesTable = pgTable("lab_invites", {
  id: uuid().defaultRandom().primaryKey(),

  labId: uuid()
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull(),

  invitedById: uuid().references(() => usersTable.id, { onDelete: "set null" }),

  email: varchar({ length: 255 }).notNull(),

  role: labInviteRoleEnum("role").notNull().default("Viewer"),
  status: labInviteStatusEnum("status").notNull().default("Pending"),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const labMembersTable = pgTable("lab_members", {
  id: uuid().defaultRandom().primaryKey(),

  memberId: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  labId: uuid()
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull(),

  role: labInviteRoleEnum().notNull().default("Viewer"),

  joinedAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const labFilesTable = pgTable(
  "lab_files",
  {
    id: uuid().defaultRandom().primaryKey(),

    labId: uuid()
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    summary: text().notNull(),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (labTable) => [uniqueIndex("lab_file_name_idx").on(labTable.name)]
);
