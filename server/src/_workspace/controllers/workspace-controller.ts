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

  findGeneralSettings = async (req: Request, res: Response) => {
    const settings = await this.workspaceService.findGeneralSettings(req);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          { ...settings },
          "Workspace general settings retrieved successfully"
        )
      );
  };

  findUserWorkspaces = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");
    const workspaces = await this.workspaceService.findUserWorkspaces(userId);
    res
      .status(200)
      .json(
        new DataResponse(200, workspaces, "Workspaces retrieved successfully")
      );
  };

  findAllMembers = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    const members = await this.workspaceService.findAllMembers(workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          members,
          "Workspace members retrieved successfully"
        )
      );
  };

  updateDetails = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    await this.workspaceService.updateDetails(req.body, workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(200, {}, "Workspace details updated successfully")
      );
  };

  updateVisibility = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    await this.workspaceService.updateVisibility(req.body, workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(200, {}, "Workspace visibility updated successfully")
      );
  };

  updateLanguage = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    await this.workspaceService.updateLanguage(req.body, workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(200, {}, "Workspace language updated successfully")
      );
  };

  updateNotifications = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    await this.workspaceService.updateNotifications(req.body, workspaceId);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          {},
          "Workspace notifications settings updated successfully"
        )
      );
  };

  inviteMember = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const inviterId = req.user?.id;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    if (!inviterId) throw new AppError(403, "Unauthorized");
    await this.workspaceService.inviteMember(req.body, workspaceId, inviterId!);
    res
      .status(200)
      .json(new DataResponse(200, {}, "Workspace member invited successfully"));
  };

  acceptMember = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");
    const workspaceId = await this.workspaceService.acceptInvite(token, userId);
    res
      .status(200)
      .json(
        new DataResponse(200, { workspaceId }, "Invite accepted successfully")
      );
  };
}
