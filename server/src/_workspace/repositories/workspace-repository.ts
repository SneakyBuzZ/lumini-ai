import { SaveWorkspaceDTOType } from "@/_workspace/dto";
import { workspacesTable } from "@/_workspace/models/workspace-model";
import { db } from "@/lib/config/db-config";
import { getSlug } from "@/utils/slug";
import { and, eq, isNotNull } from "drizzle-orm";
import { workspaceSettingsTable } from "../models/workspace-settings-model";
import { workspaceMembersTable } from "../models/workspace-members-model";

export class WorkspaceRepository {
  public workspaceConfig = config;

  async save(data: SaveWorkspaceDTOType, ownerId: string) {
    return await db.transaction(async (tx) => {
      const [workspace] = await tx
        .insert(workspacesTable)
        .values({
          ...data,
          ownerId,
          slug: getSlug(),
        })
        .returning({ id: workspacesTable.id });

      await tx.insert(workspaceSettingsTable).values({
        workspaceId: workspace.id,
        visibility: config[data.plan].visibility as "public" | "private",
        defaultLanguage: config[data.plan].defaultLanguage,
        notificationsEnabled: config[data.plan].notificationsEnabled,
      });

      await tx.insert(workspaceMembersTable).values({
        workspaceId: workspace.id,
        memberId: ownerId,
        role: "owner",
      });

      return workspace.id;
    });
  }

  async findById(workspaceId: string) {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .limit(1);
    return workspace;
  }

  async findBySlug(slug: string) {
    const [workspace] = await db
      .select({
        id: workspacesTable.id,
      })
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, slug))
      .limit(1);
    return workspace;
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
}

const config = {
  free: {
    labsLimit: 3,
    membersLimit: 1,
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
