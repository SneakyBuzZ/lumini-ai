import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/_user/models/user-model";
import cuid from "cuid";
import { relations } from "drizzle-orm";
import { visibilityEnum } from "@/_lab/models/lab-table";

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
  ],
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
      workspaceSettingsTable.workspaceId,
    ),
    index("workspace_visibility_idx").on(workspaceSettingsTable.visibility),
  ],
);

export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "administrator",
  "developer",
]);

export const workspaceMembersTable = pgTable("workspace_members", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => cuid()),

  workspaceId: varchar("workspace_id", { length: 36 })
    .references(() => workspacesTable.id, { onDelete: "cascade" })
    .notNull(),

  memberId: varchar("member_id", { length: 36 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  role: memberRoleEnum("role").notNull().default("developer"),

  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workspaceInviteStatusEnum = pgEnum("workspace_invite_status", [
  "pending",
  "accepted",
  "declined",
]);

export const workspaceInvitesTable = pgTable(
  "workspace_invites",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),

    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    invitedById: varchar("invited_by_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "set null" })
      .notNull(),

    email: varchar("email", { length: 255 }).notNull(),

    role: memberRoleEnum("role").notNull().default("developer"),
    status: workspaceInviteStatusEnum("status").notNull().default("pending"),

    token: varchar("token", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),

    acceptedAt: timestamp("accepted_at"),
    declinedAt: timestamp("declined_at"),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (workspaceInvitesTable) => ({
    uniqueInvite: uniqueIndex("unique_workspace_invite").on(
      workspaceInvitesTable.workspaceId,
      workspaceInvitesTable.email,
    ),
  }),
);

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
  visibility: visibilityEnum("visibility").default("public"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workspaceApisRelations = relations(
  workspaceApisTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceApisTable.workspaceId],
      references: [workspacesTable.id],
    }),
  }),
);

// ========== RELATIONS ==========

export const workspaceRelations = relations(
  workspacesTable,
  ({ one, many }) => ({
    settings: one(workspaceSettingsTable, {
      fields: [workspacesTable.id],
      references: [workspaceSettingsTable.workspaceId],
    }),
    members: many(workspaceMembersTable),
    apis: many(workspaceApisTable),
    invites: many(workspaceInvitesTable),
  }),
);

export const workspaceMembersRelations = relations(
  workspaceMembersTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceMembersTable.workspaceId],
      references: [workspacesTable.id],
    }),
    member: one(usersTable, {
      fields: [workspaceMembersTable.memberId],
      references: [usersTable.id],
    }),
  }),
);

export const workspaceInvitesRelations = relations(
  workspaceInvitesTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceInvitesTable.workspaceId],
      references: [workspacesTable.id],
    }),
    invitedUser: one(usersTable, {
      fields: [workspaceInvitesTable.email],
      references: [usersTable.email],
    }),
  }),
);
