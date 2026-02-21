import { Request, Response } from "express";
import { WorkspaceSettingsService } from "../services/workspace-settings-service";
import { AppError } from "@/utils/error";
import { DataResponse } from "@/utils/dto";

export class WorkspaceSettingsController {
  private workspaceSettingsService: WorkspaceSettingsService;

  constructor() {
    this.workspaceSettingsService = new WorkspaceSettingsService();
  }

  getGeneral = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!slug) throw new AppError(400, "Workspace slug is required");
    const settings = await this.workspaceSettingsService.findGeneral(slug);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          settings,
          "Workspace general settings fetched successfully",
        ),
      );
  };

  updateGeneral = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!slug) throw new AppError(400, "Workspace slug is required");
    const data = req.body;
    await this.workspaceSettingsService.updateGeneral(data, slug);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          "Workspace general settings updated successfully",
        ),
      );
  };

  updatePreferences = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const data = req.body;
    await this.workspaceSettingsService.updatePreferences(data, workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(200, "Workspace preferences updated successfully"),
      );
  };
}
