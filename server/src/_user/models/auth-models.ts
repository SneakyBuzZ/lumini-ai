import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (account) => [
    uniqueIndex("account_provider_providerAccountId_idx").on(
      account.provider,
      account.providerAccountId,
    ),
    uniqueIndex("account_user_provider_idx").on(
      account.userId,
      account.provider,
    ),
  ],
);

export const sessionsTable = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    userId: varchar("user_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    refreshTokenHash: varchar("refresh_token_hash", { length: 255 })
      .notNull()
      .unique(),
    lookupKey: varchar("lookup_key", { length: 64 }),
    userAgent: varchar("user_agent", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 255 }),
    revokedAt: timestamp("revoked_at"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (session) => [uniqueIndex("session_lookup_key_idx").on(session.lookupKey)],
);

export const verificationTokensTable = pgTable(
  "verification_tokens",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => cuid()),

    userId: varchar("user_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),

    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    lookupKey: varchar("lookup_key", { length: 64 }),

    type: varchar("type", {
      enum: ["email_verification", "password_reset"],
    }).notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (verificationToken) => [
    uniqueIndex("verification_token_lookup_key_idx").on(
      verificationToken.lookupKey,
    ),
  ],
);
