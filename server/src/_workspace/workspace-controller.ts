import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { DataResponse } from "@/lib/dto/data.response";
import { db } from "@/lib/config/db-config";
import {
  workspaceMembersTable,
  workspaceSettingsTable,
  workspacesTable,
} from "@/_workspace/workspace-table";
import { ErrorResponse } from "@/lib/responses/error.response";
import { usersTable } from "@/_user/user-table";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, plan } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(403).json(new ErrorResponse(403, "Unauthorized"));
      return;
    }

    const userWorkspaces = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.ownerId, userId));

    if (plan === "free") {
      const hasFree = userWorkspaces.some((w) => w.plan === "free");
      if (hasFree) {
        res
          .status(204)
          .json(new ErrorResponse(204, "Free plan workspace limit reached."));

        return;
      }
    } else if (plan === "pro") {
      const proCount = userWorkspaces.filter((w) => w.plan === "pro").length;
      if (proCount >= 1) {
        res
          .status(204)
          .json(new ErrorResponse(204, "Pro plan workspace limit reached."));

        return;
      }
    }

    const workspacePlanConfig = {
      free: {
        labsLimit: 3,
        membersLimit: 0,
        maxWorkspaceUsers: 0,
        allowWorkspaceInvites: false,
        allowGithubSync: false,
      },
      pro: {
        labsLimit: 10,
        membersLimit: 5,
        maxWorkspaceUsers: 5,
        allowWorkspaceInvites: true,
        allowGithubSync: true,
      },
      enterprise: {
        labsLimit: 20,
        membersLimit: 15,
        maxWorkspaceUsers: 15,
        allowWorkspaceInvites: true,
        allowGithubSync: true,
      },
    }[plan as "free" | "pro" | "enterprise"];

    const [newWorkspace] = await db
      .insert(workspacesTable)
      .values({
        name,
        plan,
        ownerId: userId,
        labsLimit: workspacePlanConfig.labsLimit,
        membersLimit: workspacePlanConfig.membersLimit,
      })
      .returning();

    await db.insert(workspaceSettingsTable).values({
      workspaceId: newWorkspace.id,
      maxLabs: workspacePlanConfig.labsLimit,
      allowWorkspaceInvites: workspacePlanConfig.allowWorkspaceInvites,
      maxWorkspaceUsers: workspacePlanConfig.maxWorkspaceUsers,
      visibility: "public",
      allowGithubSync: workspacePlanConfig.allowGithubSync,
    });

    await db.insert(workspaceMembersTable).values({
      memberId: userId,
      workspaceId: newWorkspace.id,
      role: "Owner",
    });

    res.status(201).json(new DataResponse(201, "Workspace is create"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ErrorResponse(500, "Internal Server Error"));
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json(new ErrorResponse(401, "Unauthorized"));
      return;
    }

    type WorkspaceWithMembers = {
      id: string;
      name: string;
      plan: string;
      createdAt: string;
      owner: { name: string; image: string | null };
      members: { name: string; image: string | null }[];
    };

    const { rows: workspaces } = await db.execute<WorkspaceWithMembers>(sql`
      SELECT 
        w.id, 
        w.name, 
        w.plan, 
        w."createdAt",
        json_build_object('name', u.name, 'image', u.image) AS owner,
        COALESCE(
          json_agg(
            json_build_object('name', mu.name, 'image', mu.image)
          ) FILTER (WHERE mu.id IS NOT NULL),
          '[]'
        ) AS members
      FROM workspaces w
      JOIN users u ON u.id = w."ownerId"
      LEFT JOIN workspace_members wm ON wm."workspaceId" = w.id
      LEFT JOIN users mu ON mu.id = wm."memberId"
      WHERE w."ownerId" = ${userId}
      GROUP BY w.id, u.name, u.image
    `);

    res.status(200).json(new DataResponse(200, workspaces, "Labs fetched"));
  } catch (error) {
    console.error("Lab Fetching Error:", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
  }
};

export const getSettings = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId;
  const userId = req.user?.id;

  if (!userId) {
    res.status(403).json(new ErrorResponse(403, "Forbidden"));
    return;
  }

  if (!workspaceId) {
    res.status(400).json(new ErrorResponse(400, "Workspace ID is required"));
    return;
  }

  const workspaces = await db
    .select({
      info: {
        name: workspacesTable.name,
        plan: workspacesTable.plan,
        ownerName: usersTable.name,
        ownerImage: usersTable.image,
        ownerEmail: usersTable.email,
        ownerCreatedAt: usersTable.createdAt,
        createdAt: workspacesTable.createdAt,
      },
      settings: {
        maxLabs: workspaceSettingsTable.maxLabs,
        maxWorkspaceUsers: workspaceSettingsTable.maxWorkspaceUsers,
        allowWorkspaceInvites: workspaceSettingsTable.allowWorkspaceInvites,
        visibility: workspaceSettingsTable.visibility,
        allowGithubSync: workspaceSettingsTable.allowGithubSync,
      },
    })
    .from(workspacesTable)
    .where(eq(workspacesTable.id, workspaceId))
    .leftJoin(usersTable, eq(workspacesTable.ownerId, usersTable.id))
    .leftJoin(
      workspaceSettingsTable,
      eq(workspacesTable.id, workspaceSettingsTable.workspaceId)
    )
    .leftJoin(
      workspaceMembersTable,
      eq(workspacesTable.id, workspaceMembersTable.workspaceId)
    )
    .execute();

  const members = await db
    .select({
      id: workspaceMembersTable.memberId,
      name: usersTable.name,
      image: usersTable.image,
      email: usersTable.email,
      joinedAt: workspaceMembersTable.joinedAt,
      role: workspaceMembersTable.role,
    })
    .from(workspaceMembersTable)
    .leftJoin(usersTable, eq(workspaceMembersTable.memberId, usersTable.id))
    .where(eq(workspaceMembersTable.workspaceId, workspaceId))
    .execute();

  const payload = {
    ...workspaces[0],
    members,
  };

  res
    .status(200)
    .json(new DataResponse(200, payload, "Workspace settings fetched"));

  if (!workspaces.length) {
    res.status(404).json(new ErrorResponse(404, "Workspace not found"));
    return;
  }
};

export default { create, getAll, getSettings };
