import { db } from "@/lib/config/db-config";
import { accountsTable } from "../models/account-model";
import { and, eq } from "drizzle-orm";

export class AccountRepository {
  async saveAccount(email: string, id: string) {
    await db.insert(accountsTable).values({
      userId: id,
      provider: "email",
      providerAccountId: email,
      refreshToken: "",
      refreshTokenExpires: null,
    });
  }

  async updateAccount(id: string, hashedRefresh: string) {
    await db
      .update(accountsTable)
      .set({
        refreshToken: hashedRefresh,
        refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(
        and(eq(accountsTable.userId, id), eq(accountsTable.provider, "email"))
      );
  }
}
