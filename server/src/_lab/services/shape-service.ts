import {
  ShapeRepository,
  SnapshotRepository,
  ViewRepository,
} from "@/_lab/repositories/shape-repository";
import { ShapeDTO, UpdateBatchType, UpdateShapeDTO, ViewDTO } from "@/_lab/dto";
import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { LabRepository } from "../repositories/lab-repository";
import { AppError } from "@/utils/error";
import { db } from "@/lib/config/db-config";

export class ShapeService {
  private shapeRepository: ShapeRepository;
  private workspaceRepository: WorkspaceRepository;
  private labRepository: LabRepository;
  private snapshotRepository: SnapshotRepository;
  private viewRepository: ViewRepository;

  constructor() {
    this.shapeRepository = new ShapeRepository();
    this.workspaceRepository = new WorkspaceRepository();
    this.labRepository = new LabRepository();
    this.snapshotRepository = new SnapshotRepository();
    this.viewRepository = new ViewRepository();
  }

  //! --- SHAPE METHODS ---

  async create(data: ShapeDTO, labId: string, userId: string) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isValid = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId,
    );
    if (!isValid)
      throw new AppError(403, "You are not a member of this workspace");

    return await db.transaction(async (tx) => {
      const shape = await this.shapeRepository.save(data, labId, tx);
      await this.snapshotRepository.saveToSnapshot(shape, labId, tx);
      return shape;
    });
  }

  async update(
    shapeId: string,
    labId: string,
    data: UpdateShapeDTO,
    userId: string,
  ) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isValid = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId,
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
        tx,
      );

      await this.snapshotRepository.saveToSnapshot(updatedShape, labId, tx);
      return updatedShape;
    });
  }

  async delete(shapeId: string, labId: string, userId: string) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isMember = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId,
    );
    if (!isMember)
      throw new AppError(403, "You are not a member of this workspace");

    return await this.shapeRepository.delete(shapeId, labId);
  }

  async findAll(labId: string) {
    return await this.shapeRepository.findAll(labId);
  }

  async batchUpdate(data: UpdateBatchType) {
    return await this.shapeRepository.batchUpdate(data);
  }

  //! --- SNAPSHOT METHODS ---

  async findSnapshot(labId: string, userId: string) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const isMember = await this.workspaceRepository.findIsWorkspaceMember(
      lab.workspaceId,
      userId,
    );
    if (!isMember)
      throw new AppError(403, "You are not a member of this workspace");

    let snapshot = await this.snapshotRepository.findByLabId(labId);

    if (!snapshot) {
      snapshot = await this.snapshotRepository.rebuildFromShapes(labId);
    }

    return {
      labId,
      snapshot: snapshot.data,
      version: snapshot.version,
    };
  }

  //! --- VIEW METHODS ---

  async upsertView(data: ViewDTO, userId: string, labId: string) {
    return await this.viewRepository.upsert({ ...data, userId, labId });
  }

  async findView(labId: string, userId: string) {
    return await this.viewRepository.find(labId, userId);
  }
}
