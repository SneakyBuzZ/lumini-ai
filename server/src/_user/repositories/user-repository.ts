import { CreateUserDTOType } from "@/_user/dto";
import { usersTable } from "@/_user/models/user-model";
import { db } from "@/lib/config/db-config";
import { eq } from "drizzle-orm";

export class UserRepository {
  async saveUser(
    data: CreateUserDTOType
  ): Promise<{ email: string; id: string }> {
    const [user] = await db.insert(usersTable).values(data).returning();
    const response = { email: user.email, id: user.id };
    return response;
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  }
}
