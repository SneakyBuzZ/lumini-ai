import {
  pgTable,
  varchar,
  timestamp,
  uniqueIndex,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/_user/models/user-model";
import cuid from "cuid";

export const workspacePlanEnum = pgEnum("workspace_plan", [
  "free",
  "pro",
  "enterprise",
]);

export const workspaceTypeEnum = pgEnum("workspace_type", ["personal", "team"]);

export const workspacesTable = pgTable(
  "workspaces",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    name: varchar("name", { length: 255 }).notNull(),
    ownerId: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    plan: workspacePlanEnum("plan").notNull().default("free"),
    type: workspaceTypeEnum("type").notNull().default("personal"),
    slug: varchar("slug", { length: 100 }).unique().notNull(),

    billingCustomerId: varchar("billing_customer_id", { length: 255 }),
    currentPeriodEndsAt: timestamp("current_period_ends_at"),
    isActive: boolean("is_active").notNull().default(true),

    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (workspacesTable) => [
    uniqueIndex("workspace_slug_idx").on(workspacesTable.slug),
    index("workspace_owner_idx").on(workspacesTable.ownerId),
    index("workspace_plan_idx").on(workspacesTable.plan),
    index("workspace_created_idx").on(workspacesTable.createdAt),
  ],
);

// export const workspaceApisTable = pgTable("workspace_apis", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => cuid()),

//   workspaceId: varchar("workspace_id", { length: 36 })
//     .references(() => workspacesTable.id, { onDelete: "cascade" })
//     .notNull(),

//   name: varchar("name", { length: 255 }).notNull(),
//   embeddingModel: varchar("embedding_model", { length: 255 }),
//   apiKey: varchar("api_key", { length: 255 }).unique(),
//   visibility: visibilityEnum("visibility").default("public"),

//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });
