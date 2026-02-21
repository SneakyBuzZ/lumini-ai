import { db, DbExecutor } from "@/lib/config/db-config";
import { sessionsTable } from "../models/auth-models";
import { eq } from "drizzle-orm";

type InsertSessionData = Partial<typeof sessionsTable.$inferInsert>;

export class SessionRepository {
  async save(data: InsertSessionData, tx?: DbExecutor) {
    tx = tx || db;
    await tx.insert(sessionsTable).values({
      refreshTokenHash: data.refreshTokenHash!,
      userId: data.userId!,
      ipAddress: data.ipAddress || "",
      userAgent: data.userAgent || "",
      lookupKey: data.lookupKey!,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  }

  async findByLookupKey(lookupKey: string) {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.lookupKey, lookupKey))
      .limit(1);
    return session;
  }

  async delete(id: string) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, id));
  }

  async revokeByLookupKey(lookupKey: string) {
    await db
      .update(sessionsTable)
      .set({ revokedAt: new Date() })
      .where(eq(sessionsTable.lookupKey, lookupKey));
  }
}
