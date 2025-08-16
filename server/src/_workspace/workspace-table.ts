import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/_user/user-table";

export const workspacesTable = pgTable(
  "workspaces",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    ownerId: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    plan: varchar({ enum: ["free", "pro", "enterprise"] }).notNull(),
    labsLimit: integer().notNull(),
    membersLimit: integer().notNull(),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (workspacesTable) => [
    uniqueIndex("workspace_name_idx").on(workspacesTable.name),
    uniqueIndex("workspace_createdAt_idx").on(workspacesTable.createdAt),
  ]
);

export const workspaceSettingsTable = pgTable("workspace_settings", {
  id: uuid().defaultRandom().primaryKey(),
  workspaceId: uuid()
    .references(() => workspacesTable.id, { onDelete: "cascade" })
    .notNull(),

  maxLabs: integer().notNull().default(3),
  allowWorkspaceInvites: boolean().notNull().default(false),
  maxWorkspaceUsers: integer().default(0),

  visibility: varchar({ length: 20 }).default("public"),
  allowGithubSync: boolean().notNull().default(false),
});

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "Owner",
  "Admin",
  "Member",
]);
export const workspaceInviteStatusEnum = pgEnum("workspace_invite_status", [
  "Pending",
  "Accepted",
  "Declined",
]);

export const workspaceInvitesTable = pgTable("workspace_invites", {
  id: uuid().defaultRandom().primaryKey(),

  workspaceId: uuid()
    .references(() => workspacesTable.id, { onDelete: "cascade" })
    .notNull(),

  invitedById: uuid().references(() => usersTable.id, { onDelete: "set null" }),

  email: varchar({ length: 255 }).notNull(),

  role: workspaceRoleEnum("role").notNull().default("Member"),
  status: workspaceInviteStatusEnum("status").notNull().default("Pending"),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const workspaceMembersTable = pgTable("workspace_members", {
  id: uuid().defaultRandom().primaryKey(),

  workspaceId: uuid()
    .references(() => workspacesTable.id, { onDelete: "cascade" })
    .notNull(),

  memberId: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  role: workspaceRoleEnum("role").notNull().default("Member"),

  joinedAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
