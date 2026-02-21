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

export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "admin",
  "member",
]);

export const workspaceMembersTable = pgTable(
  "workspace_members",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),

    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspacesTable.id, { onDelete: "cascade" })
      .notNull(),

    memberId: varchar("member_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),

    role: memberRoleEnum("role").notNull(),

    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (workspaceMembersTable) => [
    uniqueIndex("workspace_member_unique").on(
      workspaceMembersTable.workspaceId,
      workspaceMembersTable.memberId,
    ),
    index("workspace_member_workspace_idx").on(
      workspaceMembersTable.workspaceId,
    ),
    index("workspace_member_member_idx").on(workspaceMembersTable.memberId),
  ],
);
