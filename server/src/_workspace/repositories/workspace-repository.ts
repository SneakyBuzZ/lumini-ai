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
import { db } from "@/lib/config/db-config";
import { getSlug } from "@/utils/slug";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
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

  async findAllAndUser(userId: string) {
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
    return members;
  }

  async findMemberRoleById(memberId: string) {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: (workspace, { eq }) => eq(workspace.memberId, memberId),
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
    workspaceId: string
  ) {
    await db
      .update(workspacesTable)
      .set(data)
      .where(eq(workspacesTable.id, workspaceId));
  }

  async updateVisibility(
    data: UpdateWorkspaceVisibilityDTOType,
    workspaceId: string
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async updateLanguage(
    data: UpdateWorkspaceLanguageDTOType,
    workspaceId: string
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async updateNotificationsEnabled(
    data: UpdateWorkspaceNotificationsDTOType,
    workspaceId: string
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }

  async createInvite(
    data: UpdateWorkspaceInviteDTOType,
    workspaceId: string,
    inviterId: string
  ) {
    const { email, role } = data;
    const now = new Date();

    const activeInvite = await db.query.workspaceInvitesTable.findFirst({
      where: and(
        eq(workspaceInvitesTable.workspaceId, workspaceId),
        eq(workspaceInvitesTable.email, email),
        isNull(workspaceInvitesTable.acceptedAt),
        gt(workspaceInvitesTable.expiresAt, now)
      ),
    });
    if (activeInvite) throw new Error("An active invite already exists");

    const expiredInvite = await db.query.workspaceInvitesTable.findFirst({
      where: and(
        eq(workspaceInvitesTable.workspaceId, workspaceId),
        eq(workspaceInvitesTable.email, email),
        isNull(workspaceInvitesTable.acceptedAt),
        lt(workspaceInvitesTable.expiresAt, now)
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
