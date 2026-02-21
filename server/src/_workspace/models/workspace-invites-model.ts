import cuid from "cuid";
import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { workspacesTable } from "./workspace-model";
import { usersTable } from "@/_user/models/user-model";
import { memberRoleEnum } from "./workspace-members-model";

export const workspaceInviteStatusEnum = pgEnum("workspace_invite_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
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

    invitedById: varchar("invited_by_id", { length: 36 }).references(
      () => usersTable.id,
      { onDelete: "set null" },
    ),

    email: varchar("email", { length: 255 }).notNull(),

    role: memberRoleEnum("role").notNull(),
    status: workspaceInviteStatusEnum("status").notNull().default("pending"),

    token: varchar("token", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),

    acceptedAt: timestamp("accepted_at"),
    declinedAt: timestamp("declined_at"),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (workspaceInvitesTable) => [
    index("workspace_invite_idx").on(
      workspaceInvitesTable.workspaceId,
      workspaceInvitesTable.email,
    ),
    index("workspace_invite_email_idx").on(workspaceInvitesTable.email),
  ],
);
