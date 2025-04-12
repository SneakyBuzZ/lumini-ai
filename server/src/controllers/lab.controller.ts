import { db } from "@/config/db.config";
import {
  askGeminiWithContext,
  storeEmbeddings,
} from "@/lib/chroma/actions.chroma";
import { generateFilesSummary } from "@/lib/gemini/actions.gemini";
import { loadGitHubRepo } from "@/lib/langchain/repo-loader";
import { DataResponse } from "@/lib/responses/data.response";
import { ErrorResponse } from "@/lib/responses/error.response";
import { labFilesTable, labsTable } from "@/tables/lab.table";
import {
  workspaceMembersTable,
  workspacesTable,
} from "@/tables/workspace.table";
import { and, count, eq, or } from "drizzle-orm";
import { Request, Response } from "express";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, githubUrl, userId, workspaceId } = req.body;

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

    if (labCountResult.count >= maxLabs) {
      res
        .status(403)
        .json(
          new ErrorResponse(
            403,
            `Workspace has reached its lab limit (${maxLabs}).`
          )
        );
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

    const labs = await db
      .select()
      .from(labsTable)
      .where(eq(labsTable.creatorId, userId));

    res.status(200).json(new DataResponse(200, labs, "Labs fetched"));
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

export const getAnswerToQuery = async (req: Request, res: Response) => {
  const { labId, query } = req.body;

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
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
  }
};

export default { create };
