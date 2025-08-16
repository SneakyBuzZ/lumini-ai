import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    image: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (user) => [uniqueIndex("user_email_idx").on(user.email)]
);
