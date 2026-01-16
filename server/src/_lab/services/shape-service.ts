import { ShapeRepository } from "@/_lab/repositories/shape-repository";
import { ShapeDTO, UpdateShapeDTO } from "@/_lab/dto";
import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { LabRepository } from "../repositories/lab-repository";
import { AppError } from "@/utils/error";
import { db } from "@/lib/config/db-config";

export class ShapeService {
  private shapeRepository: ShapeRepository;
  private workspaceRepository: WorkspaceRepository;
  private labRepository: LabRepository;

  constructor() {
    this.shapeRepository = new ShapeRepository();
    this.workspaceRepository = new WorkspaceRepository();
    this.labRepository = new LabRepository();
  }

  async create(data: ShapeDTO, labId: string, userId: string) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isValid = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId
    );
    if (!isValid)
      throw new AppError(403, "You are not a member of this workspace");

    return await db.transaction(async (tx) => {
      const shape = await this.shapeRepository.save(data, labId, tx);
      await this.shapeRepository.saveToSnapshot(shape, labId, tx);
      return shape;
    });
  }

  async update(
    shapeId: string,
    labId: string,
    data: UpdateShapeDTO,
    userId: string
  ) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isValid = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId
    );
    if (!isValid)
      throw new AppError(403, "You are not a member of this workspace");

    return await db.transaction(async (tx) => {
      const shape = await this.shapeRepository.findById(shapeId, labId, tx);

      if (!shape || shape.isDeleted) throw new AppError(404, "Shape not found");
      if (shape.isLocked)
        throw new AppError(403, "Shape is locked and cannot be edited");

      const updatedShape = await this.shapeRepository.update(
        shapeId,
        labId,
        data,
        tx
      );

      await this.shapeRepository.saveToSnapshot(updatedShape, labId, tx);
      return updatedShape;
    });
  }

  async findAll(labId: string) {
    return await this.shapeRepository.findAll(labId);
  }
}
