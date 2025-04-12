import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.table";

export const accountsTable = pgTable(
  "accounts",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    provider: varchar({ enum: ["google", "github", "email"] }).notNull(),
    providerAccountId: varchar({ length: 255 }).notNull(),
    refreshToken: varchar({ length: 255 }),
    refreshTokenExpires: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (account) => [
    uniqueIndex("account_provider_providerAccountId_idx").on(
      account.provider,
      account.providerAccountId
    ),
  ]
);
