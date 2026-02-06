import {
  SaveWorkspaceDTOType,
  UpdateWorkspaceDetailsDTOType,
  UpdateWorkspaceInviteDTOType,
  UpdateWorkspaceLanguageDTOType,
  UpdateWorkspaceNotificationsDTOType,
  UpdateWorkspaceVisibilityDTOType,
} from "@/_workspace/dto";
import {
  workspaceInvitesTable,
  workspaceMembersTable,
  workspaceSettingsTable,
  workspacesTable,
} from "@/_workspace/models/workspace-model";
import { db, DbExecutor } from "@/lib/config/db-config";
import { getSlug } from "@/utils/slug";
import { and, eq, gt, isNotNull, isNull, lt } from "drizzle-orm";
import crypto from "crypto";

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export class WorkspaceRepository {
  public workspaceConfig = config;

  async save(data: SaveWorkspaceDTOType, ownerId: string) {
    const [workspace] = await db
      .insert(workspacesTable)
      .values({
        ...data,
        ownerId,
        slug: getSlug(),
      })
      .returning({ id: workspacesTable.id });

    await db.insert(workspaceSettingsTable).values({
      workspaceId: workspace.id,
      ...this.workspaceConfig[data.plan],
    });

    await db.insert(workspaceMembersTable).values({
      workspaceId: workspace.id,
      memberId: ownerId,
      role: "owner",
    });
  }

  async findById(workspaceId: string) {
    return await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.id, workspaceId),
    });
  }

  async findBySlug(slug: string) {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, slug))
      .limit(1);
    return workspace;
  }

  async findGeneralSettings(workspaceId: string) {
    const generalSettings = await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.id, workspaceId),
      columns: {
        name: true,
        description: true,
        logoUrl: true,
        slug: true,
      },
      with: {
        settings: {
          columns: {
            visibility: true,
            defaultLanguage: true,
            notificationsEnabled: true,
          },
        },
      },
    });

    return generalSettings;
  }

  async findAll(userId: string) {
    const workspaces = await db
      .select({
        id: workspacesTable.id,
        name: workspacesTable.name,
        plan: workspacesTable.plan,
        slug: workspacesTable.slug,
        createdAt: workspacesTable.createdAt,
      })
      .from(workspacesTable)
      .where(eq(workspacesTable.ownerId, userId));
    return workspaces;
  }

  async findAllWithInvited(userId: string) {
    const memberWorkspaces = await db
      .select({
        id: workspacesTable.id,
        name: workspacesTable.name,
        plan: workspacesTable.plan,
        slug: workspacesTable.slug,
        createdAt: workspacesTable.createdAt,
      })
      .from(workspacesTable)
      .innerJoin(
        workspaceMembersTable,
        eq(workspaceMembersTable.workspaceId, workspacesTable.id),
      )
      .where(
        and(
          eq(workspaceMembersTable.memberId, userId),
          isNotNull(workspaceMembersTable.memberId),
        ),
      );
    return memberWorkspaces;
  }

  async findAllMembers(workspaceId: string) {
    const members = await db.query.workspaceMembersTable.findMany({
      where: (workspace, { eq }) => eq(workspace.workspaceId, workspaceId),
      columns: {
        role: true,
        joinedAt: true,
      },
      with: {
        member: {
          columns: {
            id: true,
            image: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const normalizedMembers = members.map((m) => ({
      id: m.member.id,
      name: m.member.name,
      email: m.member.email,
      image: m.member.image,
      role: m.role,
      status: "active" as const,
      joinedAt: m.joinedAt,
    }));

    return normalizedMembers;
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

  async findIsWorkspaceMember(workspaceId: string, memberId: string) {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.memberId, memberId),
      ),
    });
    return !!member;
  }

  async findMemberRoleById(memberId: string, workspaceId: string) {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: (workspace, { eq }) =>
        and(
          eq(workspace.memberId, memberId),
          eq(workspace.workspaceId, workspaceId),
        ),
      columns: {
        role: true,
      },
    });
    return member?.role;
  }

  async findMemberRoleByEmail(memberEmail: string) {
    const member = await db
      .select({ role: workspaceMembersTable.role })
      .from(workspaceMembersTable)
      .where(and(eq(workspaceMembersTable.memberId, memberEmail)));
    return member.length > 0 ? member[0].role : null;
  }

  async updateDetails(
    data: UpdateWorkspaceDetailsDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspacesTable)
      .set(data)
      .where(eq(workspacesTable.id, workspaceId));
  }

  async updateVisibility(
    data: UpdateWorkspaceVisibilityDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async updateLanguage(
    data: UpdateWorkspaceLanguageDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async updateNotificationsEnabled(
    data: UpdateWorkspaceNotificationsDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async findInvite(token: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [invite] = await queryBuilder
      .select()
      .from(workspaceInvitesTable)
      .where(and(eq(workspaceInvitesTable.token, token)))
      .limit(1);
    return invite;
  }

  async createInvite(
    data: UpdateWorkspaceInviteDTOType,
    workspaceId: string,
    inviterId: string,
  ) {
    const { email, role } = data;
    const now = new Date();

    const activeInvite = await db.query.workspaceInvitesTable.findFirst({
      where: and(
        eq(workspaceInvitesTable.workspaceId, workspaceId),
        eq(workspaceInvitesTable.email, email),
        isNull(workspaceInvitesTable.acceptedAt),
        gt(workspaceInvitesTable.expiresAt, now),
      ),
    });
    if (activeInvite) throw new Error("An active invite already exists");

    const expiredInvite = await db.query.workspaceInvitesTable.findFirst({
      where: and(
        eq(workspaceInvitesTable.workspaceId, workspaceId),
        eq(workspaceInvitesTable.email, email),
        isNull(workspaceInvitesTable.acceptedAt),
        lt(workspaceInvitesTable.expiresAt, now),
      ),
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

    if (expiredInvite) {
      await db
        .update(workspaceInvitesTable)
        .set({
          token,
          role,
          expiresAt,
          status: "pending",
          updatedAt: now,
          invitedById: inviterId,
        })
        .where(eq(workspaceInvitesTable.id, expiredInvite.id));

      return {
        reused: true,
        token,
        email,
      };
    }

    await db.insert(workspaceInvitesTable).values({
      workspaceId,
      invitedById: inviterId,
      email,
      role,
      token,
      expiresAt,
    });

    return {
      reused: false,
      token,
      email,
    };
  }

  async acceptInvite(
    memberId: string,
    workspaceId: string,
    recipientRole: "owner" | "administrator" | "developer",
    tx?: DbExecutor,
  ) {
    const queryBuilder = tx || db;
    await queryBuilder.insert(workspaceMembersTable).values({
      workspaceId,
      memberId,
      role: recipientRole,
    });
    await queryBuilder
      .update(workspaceInvitesTable)
      .set({
        acceptedAt: new Date(),
        status: "accepted",
        updatedAt: new Date(),
        token: "accepted-" + crypto.randomBytes(8).toString("hex"),
      })
      .where(
        and(
          eq(workspaceInvitesTable.workspaceId, workspaceId),
          eq(workspaceInvitesTable.email, memberId),
          isNull(workspaceInvitesTable.acceptedAt),
        ),
      );
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

  canAssignRole(inviterRole: string, targetRole: string) {
    if (inviterRole === "owner") return true;
    if (inviterRole === "administrator") {
      return targetRole === "developer";
    }
    return false;
  }
}

const config = {
  free: {
    labsLimit: 3,
    membersLimit: 0,
    allowWorkspaceInvites: false,
    visibility: "public",
    defaultLanguage: "en",
    notificationsEnabled: false,
  },
  pro: {
    labsLimit: 10,
    membersLimit: 5,
    allowWorkspaceInvites: true,
    visibility: "public",
    defaultLanguage: "en",
    notificationsEnabled: true,
  },
  enterprise: {
    labsLimit: 30,
    membersLimit: 50,
    allowWorkspaceInvites: true,
    visibility: "public",
    defaultLanguage: "en",
    notificationsEnabled: true,
  },
};
