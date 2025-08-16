import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user-model";
import cuid from "cuid";

export const accountsTable = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    userId: varchar("user_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    provider: varchar("provider", {
      enum: ["google", "github", "email"],
    }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    refreshTokenExpires: timestamp("refresh_token_expires"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (account) => [
    uniqueIndex("account_provider_providerAccountId_idx").on(
      account.provider,
      account.providerAccountId
    ),
  ]
);
