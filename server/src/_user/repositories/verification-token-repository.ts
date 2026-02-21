import { db, DbExecutor } from "@/lib/config/db-config";
import { verificationTokensTable } from "../models/auth-models";
import { and, eq } from "drizzle-orm";

type InsertVerificationTokenData = Partial<
  typeof verificationTokensTable.$inferInsert
>;

export class VerificationTokenRepository {
  async save(data: InsertVerificationTokenData, tx?: DbExecutor) {
    tx = tx || db;
    await tx.insert(verificationTokensTable).values({
      userId: data.userId!,
      tokenHash: data.tokenHash!,
      type: data.type!,
      lookupKey: data.lookupKey,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });
  }

  async findByLookupKeyAndType(
    lookupKey: string,
    type: "email_verification" | "password_reset",
  ) {
    const [row] = await db
      .select()
      .from(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.lookupKey, lookupKey),
          eq(verificationTokensTable.type, type),
        ),
      )
      .limit(1);
    return row;
  }

  async delete(id: string) {
    await db
      .delete(verificationTokensTable)
      .where(eq(verificationTokensTable.id, id));
  }

  async deleteByUserAndType(
    userId: string,
    type: "email_verification" | "password_reset",
  ) {
    await db
      .delete(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.userId, userId),
          eq(verificationTokensTable.type, type),
        ),
      );
  }
}
