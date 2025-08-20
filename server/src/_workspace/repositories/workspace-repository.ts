import { SaveWorkspaceDTOType } from "@/_workspace/dto";
import {
  workspaceMembersTable,
  workspaceSettingsTable,
  workspacesTable,
} from "@/_workspace/models/workspace-model";
import { db } from "@/lib/config/db-config";
import { getSlug } from "@/utils/slug";
import { eq } from "drizzle-orm";

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

  async findSettingsById(workspaceId: string) {
    const [settings] = await db
      .select({
        labsLimit: workspaceSettingsTable.labsLimit,
        membersLimit: workspaceSettingsTable.membersLimit,
        allowWorkspaceInvites: workspaceSettingsTable.allowWorkspaceInvites,
        visibility: workspaceSettingsTable.visibility,
        defaultLanguage: workspaceSettingsTable.defaultLanguage,
        notificationsEnabled: workspaceSettingsTable.notificationsEnabled,
      })
      .from(workspaceSettingsTable)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));

    return settings;
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
    return member;
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
