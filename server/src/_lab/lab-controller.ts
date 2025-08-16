import { db } from "@/lib/config/db-config";
import {
  askGeminiWithContext,
  storeEmbeddings,
} from "@/lib/genai/chroma/actions.chroma";
import { generateFilesSummary } from "@/lib/genai/gemini/actions.gemini";
import { loadGitHubRepo } from "@/lib/genai/langchain/repo-loader";
import { DataResponse } from "@/utils/dto";
import { ErrorResponse } from "@/utils/dto";
import { labFilesTable, labsTable } from "@/_lab/lab-table";
import { usersTable } from "@/_user/models/user-model";
import {
  workspaceMembersTable,
  workspacesTable,
} from "@/_workspace/workspace-table";
import { and, count, eq, or, sql } from "drizzle-orm";
import { Request, Response } from "express";

export const create = async (req: Request, res: Response) => {
  console.log("LAB CREATION REQUEST RECEIVED");
  try {
    const { name, githubUrl, workspaceId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      console.error("Unauthorized access attempt");
      res.status(401).json(new ErrorResponse(401, "Unauthorized"));
      return;
    }

    console.log("LAB CREATION REQUEST", req.body);

    // 1. Check if user is Owner or Admin in the workspace
    const [membership] = await db
      .select()
      .from(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.memberId, userId),
          eq(workspaceMembersTable.workspaceId, workspaceId),
          or(
            eq(workspaceMembersTable.role, "Owner"),
            eq(workspaceMembersTable.role, "Admin")
          )
        )
      );

    if (!membership) {
      res
        .status(403)
        .json(new ErrorResponse(403, "You are not allowed to create labs."));
      return;
    }

    // 2. Get workspace plan and lab limits
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId));

    if (!workspace) {
      res.status(404).json(new ErrorResponse(404, "Workspace not found."));
      return;
    }

    const maxLabs = workspace.labsLimit;

    // 3. Count existing labs in the workspace
    const [labCountResult] = await db
      .select({ count: count() })
      .from(labsTable)
      .where(eq(labsTable.workspaceId, workspaceId));

    console.log("LAB COUNT", labCountResult.count);

    if (labCountResult.count >= maxLabs) {
      res
        .status(403)
        .json(new ErrorResponse(204, `Workspace has reached its lab limit.`));
      return;
    }

    // 4. Create the lab
    const [newLab] = await db
      .insert(labsTable)
      .values({
        name,
        githubUrl,
        creatorId: userId,
        workspaceId,
      })
      .returning();

    console.log("NEW LAB", newLab);

    const repoFiles = await loadGitHubRepo(githubUrl);
    const summarizeRepoFiles = await generateFilesSummary(repoFiles);

    console.log("FILES SUMMARIZED");

    await db.insert(labFilesTable).values(
      summarizeRepoFiles.map((file) => ({
        name: file.file,
        content: file.content,
        summary: file.summary,
        labId: newLab.id,
      }))
    );

    await storeEmbeddings(summarizeRepoFiles, newLab.id);

    console.log("FILES EMBEDDED");

    res.status(201).json(new DataResponse(201, "Lab created successfully."));
    return;
  } catch (error) {
    console.error("Lab Creation Error:", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
    return;
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json(new ErrorResponse(401, "Unauthorized"));
      return;
    }

    const labs = await db.execute(sql`
      SELECT 
        l.id,
        l.name,
        l."githubUrl",
        l."createdAt",
        json_build_object(
          'name', u.name,
          'image', u.image
        ) AS creator,
        json_build_object(
          'id', w.id,
          'name', w.name
        ) AS workspace
      FROM labs l
      JOIN users u ON l."creatorId" = u.id
      JOIN workspaces w ON l."workspaceId" = w.id
      WHERE l."creatorId" = ${userId}
    `);

    res.status(200).json(new DataResponse(200, labs.rows, "Labs fetched"));
  } catch (error) {
    console.error("Lab Fetching Error:", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const labId = req.params.labId;

    if (!userId) {
      res.status(401).json(new ErrorResponse(401, "Unauthorized"));
      return;
    }

    const lab = await db
      .select()
      .from(labsTable)
      .where(and(eq(labsTable.id, labId), eq(labsTable.creatorId, userId)));

    if (!lab) {
      res.status(404).json(new ErrorResponse(404, "Lab not found"));
      return;
    }

    res.status(200).json(new DataResponse(200, lab[0], "Lab fetched"));
  } catch (error) {
    console.error("Lab Fetching Error:", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
  }
};

export const getLabsByWorkspaceId = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  console.log("Fetching labs for workspace ID:", workspaceId);

  try {
    const labs = await db
      .select({
        id: labsTable.id,
        name: labsTable.name,
        githubUrl: labsTable.githubUrl,
        createdAt: labsTable.createdAt,
        creatorName: usersTable.name,
        creatorImage: usersTable.image,
        workspaceId: workspacesTable.id,
        workspaceName: workspacesTable.name,
      })
      .from(labsTable)
      .where(eq(labsTable.workspaceId, workspaceId))
      .leftJoin(usersTable, eq(labsTable.creatorId, usersTable.id))
      .leftJoin(workspacesTable, eq(labsTable.workspaceId, workspacesTable.id));

    if (!labs || labs.length === 0) {
      res
        .status(404)
        .json(new ErrorResponse(404, "No labs found for this workspace"));

      return;
    }

    // Map to desired shape
    const result = labs.map((lab) => ({
      id: lab.id,
      name: lab.name,
      githubUrl: lab.githubUrl,
      createdAt: lab.createdAt,
      creator: {
        name: lab.creatorName,
        image: lab.creatorImage,
      },
      workspace: {
        id: lab.workspaceId,
        name: lab.workspaceName,
      },
    }));

    res
      .status(200)
      .json(new DataResponse(200, result, "Labs fetched successfully"));
  } catch (error) {
    console.error("Error fetching labs by workspace ID:", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
  }
};

export const getAnswerToQuery = async (req: Request, res: Response) => {
  const { query } = req.body;
  const { labId } = req.params;

  try {
    const lab = await db
      .select()
      .from(labsTable)
      .where(eq(labsTable.id, labId));

    if (!lab) {
      res.status(404).json(new ErrorResponse(404, "Lab not found"));
      return;
    }

    const { answer, relatedFiles } = await askGeminiWithContext(query, labId);

    res.status(200).json(new DataResponse(200, { answer, relatedFiles }));
  } catch (error) {
    console.error("Error fetching answer:", error);
    res.status(200).json(new ErrorResponse(200, "Something went wrong"));
  }
};

export default {
  create,
  getAll,
  getById,
  getAnswerToQuery,
  getLabsByWorkspaceId,
};
