import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/_user/models/user-model";
import cuid from "cuid";
import { relations } from "drizzle-orm";

export const workspacesTable = pgTable(
  "workspaces",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    ownerId: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    plan: varchar("plan", { enum: ["free", "pro", "enterprise"] }).notNull(),
    description: varchar("description", { length: 500 }),
    logoUrl: varchar("logo_url", { length: 512 }),
    slug: varchar("slug", { length: 100 }).unique(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (workspacesTable) => [
    uniqueIndex("workspace_slug_idx").on(workspacesTable.slug),
    index("workspace_owner_idx").on(workspacesTable.ownerId),
    index("workspace_plan_idx").on(workspacesTable.plan),
    index("workspace_created_idx").on(workspacesTable.createdAt),
  ]
);

export const workspaceSettingsTable = pgTable(
  "workspace_settings",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    labsLimit: integer("labs_limit").notNull().default(3),
    membersLimit: integer("members_limit").notNull().default(5),

    allowWorkspaceInvites: boolean("allow_workspace_invites")
      .notNull()
      .default(false),

    visibility: varchar("visibility", { length: 20 }).default("public"),
    defaultLanguage: varchar("default_language", { length: 10 }).default("en"),

    notificationsEnabled: boolean("notifications_enabled")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (workspaceSettingsTable) => [
    index("workspace_settings_workspace_id_idx").on(
      workspaceSettingsTable.workspaceId
    ),
    index("workspace_visibility_idx").on(workspaceSettingsTable.visibility),
  ]
);

export const workspaceRelations = relations(workspacesTable, ({ one }) => ({
  settings: one(workspaceSettingsTable, {
    fields: [workspacesTable.id],
    references: [workspaceSettingsTable.workspaceId],
  }),
}));

// const workspaceRoleEnum = pgEnum("workspace_role", [
//   "Owner",
//   "Admin",
//   "Member",
// ]);

// const workspaceInviteStatusEnum = pgEnum("workspace_invite_status", [
//   "Pending",
//   "Accepted",
//   "Declined",
// ]);

// const workspaceInvitesTable = pgTable("workspace_invites", {
//   id: uuid().defaultRandom().primaryKey(),

//   workspaceId: uuid()
//     .references(() => workspacesTable.id, { onDelete: "cascade" })
//     .notNull(),

//   invitedById: uuid().references(() => usersTable.id, { onDelete: "set null" }),

//   email: varchar({ length: 255 }).notNull(),

//   role: workspaceRoleEnum("role").notNull().default("Member"),
//   status: workspaceInviteStatusEnum("status").notNull().default("Pending"),

//   createdAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp().notNull().defaultNow(),
// });

// const workspaceMembersTable = pgTable("workspace_members", {
//   id: uuid().defaultRandom().primaryKey(),

//   workspaceId: uuid()
//     .references(() => workspacesTable.id, { onDelete: "cascade" })
//     .notNull(),

//   memberId: uuid()
//     .references(() => usersTable.id, { onDelete: "cascade" })
//     .notNull(),

//   role: workspaceRoleEnum("role").notNull().default("Member"),

//   joinedAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp().notNull().defaultNow(),
// });
