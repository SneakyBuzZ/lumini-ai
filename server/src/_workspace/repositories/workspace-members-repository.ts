import { usersTable } from "@/_user/models/user-model";
import { db, DbExecutor } from "@/lib/config/db-config";
import { workspaceMembersTable } from "../models/workspace-members-model";
import { and, eq } from "drizzle-orm";

type InsertWorkspaceMemberData = typeof workspaceMembersTable.$inferInsert;

export class WorkspaceMembersRepository {
  async insert(data: InsertWorkspaceMemberData, tx: DbExecutor) {
    tx = tx || db;
    await tx.insert(workspaceMembersTable).values({
      ...data,
      joinedAt: new Date(),
    });
  }

  async findIsMember(workspaceId: string, memberId: string) {
    const [member] = await db
      .select()
      .from(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.memberId, memberId),
        ),
      )
      .limit(1);
    return member ?? null;
  }

  async findAll(workspaceId: string) {
    const members = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
        role: workspaceMembersTable.role,
        joinedAt: workspaceMembersTable.joinedAt,
      })
      .from(workspaceMembersTable)
      .innerJoin(usersTable, eq(workspaceMembersTable.memberId, usersTable.id))
      .where(eq(workspaceMembersTable.workspaceId, workspaceId))
      .orderBy(workspaceMembersTable.joinedAt);

    const normalizedMembers = members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      image: member.image,
      role: member.role,
      joinedAt: member.joinedAt,
      status: "active" as const,
    }));

    return normalizedMembers;
  }

  async findRoleById(memberId: string, workspaceId: string) {
    const [member] = await db
      .select({ role: workspaceMembersTable.role })
      .from(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.memberId, memberId),
        ),
      )
      .limit(1);
    return member?.role;
  }

  async findRoleByEmail(memberEmail: string) {
    const [member] = await db
      .select({ role: workspaceMembersTable.role })
      .from(workspaceMembersTable)
      .innerJoin(usersTable, eq(workspaceMembersTable.memberId, usersTable.id))
      .where(eq(usersTable.email, memberEmail))
      .limit(1);
    return member?.role;
  }

  async findIfMember(workspaceId: string, memberId: string, tx?: DbExecutor) {
    const queryBuilder = tx ? tx : db;
    const [member] = await queryBuilder
      .select()
      .from(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.memberId, memberId),
        ),
      )
      .limit(1);
    return !!member;
  }
}
