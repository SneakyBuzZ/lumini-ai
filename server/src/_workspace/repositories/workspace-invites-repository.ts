import { db, DbExecutor } from "@/lib/config/db-config";
import { workspaceInvitesTable } from "../models/workspace-invites-model";
import { and, eq, gt, isNull } from "drizzle-orm";
import crypto from "crypto";
import { workspaceMembersTable } from "../models/workspace-members-model";
import { usersTable } from "@/_user/models/user-model";

type InsertInviteValues = typeof workspaceInvitesTable.$inferInsert;

export class WorkspaceInvitesRepository {
  async findAll(workspaceId: string) {
    const invites = await db
      .select({
        email: workspaceInvitesTable.email,
        role: workspaceInvitesTable.role,
      })
      .from(workspaceInvitesTable)
      .where(
        and(
          eq(workspaceInvitesTable.workspaceId, workspaceId),
          isNull(workspaceInvitesTable.acceptedAt),
          isNull(workspaceInvitesTable.declinedAt),
          eq(workspaceInvitesTable.status, "pending"),
          gt(workspaceInvitesTable.expiresAt, new Date()),
        ),
      );

    const normalizedInvites = invites.map((invite) => ({
      id: null,
      name: null,
      email: invite.email,
      image: null,
      role: invite.role,
      joinedAt: null,
      status: "pending" as const,
    }));
    return normalizedInvites;
  }

  async insert(values: InsertInviteValues, tx?: DbExecutor) {
    tx = tx || db;
    await tx.insert(workspaceInvitesTable).values(values);
  }

  async markAccepted(inviteId: string, tx?: DbExecutor) {
    tx = tx || db;
    await tx
      .update(workspaceInvitesTable)
      .set({
        status: "accepted",
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(workspaceInvitesTable.id, inviteId));
  }

  async markExpired(inviteId: string, tx?: DbExecutor) {
    tx = tx || db;
    await tx
      .update(workspaceInvitesTable)
      .set({
        status: "expired",
        updatedAt: new Date(),
      })
      .where(eq(workspaceInvitesTable.id, inviteId));
  }

  async findByToken(token: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [invite] = await queryBuilder
      .select()
      .from(workspaceInvitesTable)
      .where(and(eq(workspaceInvitesTable.token, token)))
      .limit(1);
    return invite ?? null;
  }

  async findAllInvitedMembers(workspaceId: string) {
    const invitedMembers = await db
      .select({
        role: workspaceInvitesTable.role,
        status: workspaceInvitesTable.status,
        invitedUserEmail: workspaceInvitesTable.email,
      })
      .from(workspaceInvitesTable)
      .where(
        and(
          eq(workspaceInvitesTable.workspaceId, workspaceId),
          isNull(workspaceInvitesTable.acceptedAt),
          isNull(workspaceInvitesTable.declinedAt),
          eq(workspaceInvitesTable.status, "pending"),
        ),
      );

    const normalizedInvitedMembers = invitedMembers.map((im) => ({
      id: null,
      email: im.invitedUserEmail,
      image: null,
      role: im.role,
      status: im.status,
    }));

    return normalizedInvitedMembers;
  }
}
