import { db, DbExecutor } from "@/lib/config/db-config";
import { and, eq } from "drizzle-orm";
import { accountsTable } from "../models/auth-models";

type InsertAccountData = Partial<typeof accountsTable.$inferInsert>;

export class AccountRepository {
  async save(
    userId: string,
    provider: "email" | "google" | "github",
    providerAccountId: string,
    tx?: DbExecutor,
  ) {
    tx = tx || db;
    await tx.insert(accountsTable).values({
      userId: userId,
      provider: provider,
      providerAccountId: providerAccountId,
    });
  }

  async findByUserId(id: string) {
    const [account] = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, id));
    return account;
  }

  async resetToken(id: string) {
    await db
      .update(accountsTable)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(accountsTable.userId, id));
  }

  async update(userId: string, data: InsertAccountData) {
    await db
      .update(accountsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(accountsTable.userId, userId));
  }
}
