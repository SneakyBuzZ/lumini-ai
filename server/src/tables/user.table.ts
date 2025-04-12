import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod";

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

export const emailAuthSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(4).max(255),
});
