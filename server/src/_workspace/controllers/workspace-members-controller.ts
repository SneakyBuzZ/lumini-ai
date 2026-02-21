import { Request, Response } from "express";
import { WorkspaceMembersService } from "../services/workspace-members-service";
import { DataResponse } from "@/utils/dto";

export class WorkspaceMembersController {
  private workspaceMembersService: WorkspaceMembersService;

  constructor() {
    this.workspaceMembersService = new WorkspaceMembersService();
  }

  findAll = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const members = await this.workspaceMembersService.findAll(slug);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          members,
          "Workspace members fetched successfully",
        ),
      );
  };
}
