import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user-model";
import cuid from "cuid";

export const sessionsTable = pgTable("sessions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  userId: varchar("user_id", { length: 36 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
