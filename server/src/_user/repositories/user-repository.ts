import { usersTable } from "@/_user/models/user-model";
import { db, DbExecutor } from "@/lib/config/db-config";
import { eq, inArray } from "drizzle-orm";
import { RegisterUserDTOType } from "../dto";

type InsertUserData = typeof usersTable.$inferInsert;
type UpdateUserData = Partial<typeof usersTable.$inferInsert>;

export class UserRepository {
  async save(data: InsertUserData, tx?: DbExecutor) {
    tx = tx || db;
    const [user] = await tx.insert(usersTable).values(data).returning();
    return user.id;
  }

  async findByEmail(email: string, tx?: DbExecutor) {
    tx = tx || db;
    const [user] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  }

  async findById(id: string, tx?: DbExecutor) {
    const queryBuilder = tx ? tx : db;
    const [user] = await queryBuilder
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
        createdAt: usersTable.createdAt,
        isVerified: usersTable.emailVerified,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }

  async findByIds(ids: string[], tx?: DbExecutor) {
    if (!ids.length) return [];
    const qb = tx ?? db;
    return qb
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(inArray(usersTable.id, ids));
  }

  async update(id: string, data: UpdateUserData) {
    await db.update(usersTable).set(data).where(eq(usersTable.id, id));
  }
}
