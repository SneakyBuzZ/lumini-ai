import { WorkspaceService } from "@/_workspace/services/workspace-service";
import { DataResponse } from "@/utils/dto";
import { AppError } from "@/utils/error";
import { Request, Response } from "express";

export class WorkspaceController {
  private workspaceService: WorkspaceService;
  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  create = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");
    await this.workspaceService.create(req.body, userId);
    res
      .status(201)
      .json(new DataResponse(201, "Workspace created successfully"));
  };

  getBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const workspace = await this.workspaceService.findBySlug(slug);
    res
      .status(200)
      .json(
        new DataResponse(200, workspace, "Workspace retrieved successfully"),
      );
  };

  findUserWorkspaces = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");
    const workspaces = await this.workspaceService.findUserWorkspaces(userId);
    res
      .status(200)
      .json(
        new DataResponse(200, workspaces, "Workspaces retrieved successfully"),
      );
  };
}
