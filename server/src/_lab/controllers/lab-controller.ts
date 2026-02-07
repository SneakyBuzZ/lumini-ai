import { LabService } from "@/_lab/services/lab-service";
import { DataResponse } from "@/utils/dto";
import { AppError } from "@/utils/error";
import { Request, Response } from "express";
import { ShapeService } from "../services/shape-service";
import { SnapshotRepository } from "../repositories/shape-repository";
import { broadcastToLab } from "@/lib/ws/ws-room";
import { UpdateBatchType } from "../dto";

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
    const slug = req.params.slug;
    if (!slug) throw new AppError(400, "Workspace Slug is required");
    const labs = await this.labService.findAll(slug);
    res
      .status(200)
      .json(new DataResponse(200, labs, "Labs retrieved successfully."));
  };

  getBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    if (!slug) throw new AppError(400, "Lab slug is required");
    const lab = await this.labService.findBySlug(slug);
    if (!lab) throw new AppError(404, "Lab not found");
    res
      .status(200)
      .json(new DataResponse(200, lab, "Lab retrieved successfully."));
  };

  getWorkspaceId = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const workspaceId = await this.labService.findWorkspaceId(slug);
    res
      .status(200)
      .json(
        new DataResponse(
          200,
          { workspaceId },
          "Workspace ID retrieved successfully.",
        ),
      );
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
    const slug = req.params.slug;
    if (!slug) throw new AppError(400, "Lab slug is required");

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    const data = req.body;
    if (data.labSlug !== slug)
      throw new AppError(400, "Lab slug in body does not match URL parameter");

    const lab = await this.labService.findBySlug(slug);
    if (!lab) throw new AppError(404, "Lab not found");

    const batchData: UpdateBatchType = {
      labId: lab.id,
      operations: data.operations,
    };
    const result = await this.shapeService.batchUpdate(batchData);

    const appliedSet = new Set(
      result.applied.map((a) => `${a.shapeId}:${a.commitVersion}`),
    );

    const commits = data.operations
      .filter((op: { shapeId: any; commitVersion: any }) =>
        appliedSet.has(`${op.shapeId}:${op.commitVersion}`),
      )
      .map(
        (op: {
          shapeId: any;
          op: string;
          commitVersion: any;
          payload: any;
        }) => ({
          shapeId: op.shapeId,
          commitType:
            op.op === "create"
              ? "new"
              : op.op === "update"
                ? "updated"
                : "deleted",
          commitVersion: op.commitVersion,
          shape: op.payload,
        }),
      );

    if (commits.length > 0) {
      broadcastToLab(lab.id, {
        type: "shape:commit",
        labId: lab.id,
        authorId: userId,
        commits,
      });
    }

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
    const slug = req.params.slug;
    if (!slug) throw new AppError(400, "Lab slug is required");

    const lab = await this.labService.findBySlug(slug);
    if (!lab) throw new AppError(404, "Lab not found");

    let snapshot = await this.snapshotRepository.findByLabId(lab.id);

    if (!snapshot)
      snapshot = await this.snapshotRepository.rebuildFromShapes(lab.id);
    res
      .status(200)
      .json(new DataResponse(200, snapshot, "Shapes retrieved successfully."));
  };

  upsertView = async (req: Request, res: Response) => {
    const labSlug = req.params.slug;
    if (!labSlug) throw new AppError(400, "Lab slug is required");

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    const lab = await this.labService.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");

    const data = req.body;
    await this.shapeService.upsertView(data, userId, lab.id);
    res
      .status(200)
      .json(new DataResponse(200, "View state saved successfully."));
  };

  getView = async (req: Request, res: Response) => {
    const labSlug = req.params.slug;
    if (!labSlug) throw new AppError(400, "Lab slug is required");

    const userId = req.user?.id;
    if (!userId) throw new AppError(403, "Unauthorized");

    const lab = await this.labService.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");

    const view = await this.shapeService.findView(lab.id, userId);

    res
      .status(200)
      .json(new DataResponse(200, view, "View state retrieved successfully."));
  };
}
