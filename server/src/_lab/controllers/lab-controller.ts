import { LabService } from "@/_lab/services/lab-service";
import { DataResponse } from "@/utils/dto";
import { AppError } from "@/utils/error";
import { Request, Response } from "express";
import { ShapeService } from "../services/shape-service";
import { SnapshotRepository } from "../repositories/shape-repository";

export class LabController {
  private labService: LabService;
  private shapeService: ShapeService;
  private snapshotRepository: SnapshotRepository;

  constructor() {
    this.labService = new LabService();
    this.shapeService = new ShapeService();
    this.snapshotRepository = new SnapshotRepository();
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

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    await this.shapeService.create(req.body, labId, userId);
    res.status(201).json(new DataResponse(201, "Shape created successfully."));
  };

  updateShape = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");

    const shapeId = req.params.shapeId;
    if (!shapeId) throw new AppError(400, "Shape ID is required");

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    const data = req.body;
    const shape = await this.shapeService.update(shapeId, labId, data, userId);
    res
      .status(200)
      .json(new DataResponse(200, { shape }, "Shape updated successfully."));
  };

  batchUpdateShapes = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");

    const data = req.body;
    if (data.labId !== labId)
      throw new AppError(400, "Lab ID in body does not match URL parameter");

    const result = await this.shapeService.batchUpdate(data);

    res
      .status(200)
      .json(new DataResponse(200, result, "Batch update completed."));
  };

  deleteShape = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");

    const shapeId = req.params.shapeId;
    if (!shapeId) throw new AppError(400, "Shape ID is required");

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    const shape = await this.shapeService.delete(shapeId, labId, userId);
    res
      .status(200)
      .json(new DataResponse(200, { shape }, "Shape deleted successfully."));
  };

  getAllShapes = async (req: Request, res: Response) => {
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");

    const lab = await this.labService.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    let snapshot = await this.snapshotRepository.findByLabId(labId);

    if (!snapshot)
      snapshot = await this.snapshotRepository.rebuildFromShapes(labId);
    res
      .status(200)
      .json(new DataResponse(200, snapshot, "Shapes retrieved successfully."));
  };
}
