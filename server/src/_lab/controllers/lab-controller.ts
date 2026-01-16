import { LabService } from "@/_lab/services/lab-service";
import { DataResponse } from "@/utils/dto";
import { AppError } from "@/utils/error";
import { Request, Response } from "express";
import { ShapeService } from "../services/shape-service";

export class LabController {
  private labService: LabService;
  private shapeService: ShapeService;

  constructor() {
    this.labService = new LabService();
    this.shapeService = new ShapeService();
  }

  create = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");
    const labId = await this.labService.create(req.body, userId);
    res
      .status(201)
      .json(new DataResponse(201, { labId }, "Lab created successfully."));
  };

  getAll = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    const labs = await this.labService.findAll(workspaceId);
    res
      .status(200)
      .json(new DataResponse(200, labs, "Labs retrieved successfully."));
  };

  createShape = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");
    await this.shapeService.create(req.body, labId);
    res.status(201).json(new DataResponse(201, "Shape created successfully."));
  };

  getAllShapes = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");
    const shapes = await this.shapeService.findAll(labId);
    res
      .status(200)
      .json(new DataResponse(200, shapes, "Shapes retrieved successfully."));
  };
}
