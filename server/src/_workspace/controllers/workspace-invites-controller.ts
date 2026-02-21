import { Request, Response } from "express";
import { WorkspaceInvitesService } from "../services/workspace-invites-service";
import { AppError } from "@/utils/error";
import { WorkspaceService } from "../services/workspace-service";
import { DataResponse } from "@/utils/dto";

export class WorkspaceInvitesController {
  private workspaceInvitesService: WorkspaceInvitesService;
  private workspaceRepository: WorkspaceService;

  constructor() {
    this.workspaceInvitesService = new WorkspaceInvitesService();
    this.workspaceRepository = new WorkspaceService();
  }

  invite = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!slug)
      throw new AppError(
        400,
        "Workspace slug is required in the URL parameters",
      );
    const inviterId = req?.user?.id;
    if (!inviterId) throw new AppError(401, "Unauthorized");

    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");

    await this.workspaceInvitesService.invite(
      req.body,
      workspace.id,
      inviterId,
    );
    res.status(200).json(new DataResponse(200, "Invitation sent successfully"));
  };

  accept = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userId = req?.user?.id;
    if (!userId) throw new AppError(401, "Unauthorized");

    const workspaceId = await this.workspaceInvitesService.accept(
      token,
      userId,
    );
    res
      .status(200)
      .json(
        new DataResponse(200, { workspaceId }, "Workspace joined successfully"),
      );
  };
}
