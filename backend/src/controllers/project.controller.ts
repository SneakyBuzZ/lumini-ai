import { Request, Response } from "express";
import {
  getAllSchema,
  getAnswerToQuestionSchema,
  getByIdSchema,
} from "../lib/schemas/project.schema.js";
import { ApiError, ApiResponse } from "../lib/class.js";
import { db } from "../config/db.config.js";
import { loadGitHubRepo } from "../lib/langchain/repo-loader.js";
import { generateFilesSummary } from "../lib/gemini/actions.gemini.js";
import {
  askGeminiWithContext,
  storeEmbeddings,
} from "../lib/chroma/actions.chroma.js";

export const create = async (req: Request, res: Response) => {
  // const { success, data } = createSchema.safeParse(req.body);

  // if (!success) {
  //   return res
  //     .status(400)
  //     .json(new ApiError(400, "Bad Request", "Invalid request body"));
  // }

  // console.log("URL: ", data.url);

  // const { name, url } = data;

  // const project = await db.project.create({
  //   data: {
  //     name,
  //     url,
  //     ownerId: req.userId,
  //   },
  // });

  const { name, url, userId } = req.body;

  console.log("RECEIVED: ", { name, url, userId });

  try {
    const project = await db.project.create({
      data: {
        name,
        url,
        ownerId: userId,
      },
    });

    console.log("PROJECT: ", project);

    const repoFiles = await loadGitHubRepo(url);
    const summarizeRepoFiles = await generateFilesSummary(repoFiles);

    console.log("SUMMARIZED REPO FILES: ", {
      one: summarizeRepoFiles[0].summary,
      two: summarizeRepoFiles[1].summary,
      three: summarizeRepoFiles[2].summary,
    });

    await db.projectFiles.createMany({
      data: summarizeRepoFiles.map((file) => ({
        projectId: project.id,
        summary: file.summary,
        content: file.content,
        name: file.file,
      })),
      skipDuplicates: true,
    });

    await storeEmbeddings(summarizeRepoFiles, project.id);

    console.log("STORED EMBEDDINGS");

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Project created successfully"));
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const getAll = async (req: Request, res: Response) => {
  const { success, data } = getAllSchema.safeParse(req.query);

  if (!success) {
    return res
      .status(400)
      .json(new ApiError(400, "Bad Request", "Invalid request query"));
  }

  const { pageNo, skip } = data;

  const projects = await db.project.findMany({
    where: {
      ownerId: req.userId,
    },
    skip: skip ? Number(skip) : undefined,
    take: pageNo ? Number(pageNo) : undefined,
  });

  return res.status(200).json(new ApiResponse(200, projects));
};

export const getById = async (req: Request, res: Response) => {
  const { success, data } = getByIdSchema.safeParse(req.params);

  if (!success) {
    return res
      .status(400)
      .json(new ApiError(400, "Bad Request", "Invalid request params"));
  }

  const { id } = data;

  const project = await db.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    return res
      .status(404)
      .json(new ApiError(404, "Not Found", "Project not found"));
  }

  return res.status(200).json(new ApiResponse(200, project));
};

export const getAnswerToQuestion = async (req: Request, res: Response) => {
  const { success, data } = getAnswerToQuestionSchema.safeParse(req.body);

  console.log("YES IT HIT ME");

  if (!success) {
    return res
      .status(400)
      .json(new ApiError(400, "Bad Request", "Invalid request body"));
  }

  const { projectId, question } = data;

  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res
        .status(404)
        .json(new ApiError(404, "Not Found", "Project not found"));
    }

    const { answer, relatedFiles } = await askGeminiWithContext(
      question,
      projectId
    );

    return res.status(200).json(new ApiResponse(200, { answer, relatedFiles }));
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
