import { usersTable } from "@/_user/models/user-model";
import { db } from "@/lib/config/db-config";
import { eq } from "drizzle-orm";
import { RegisterUserDTOType } from "../dto";

export class UserRepository {
  async save(data: RegisterUserDTOType) {
    await db.insert(usersTable).values(data).returning();
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  }

  async findById(id: string) {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }
}
