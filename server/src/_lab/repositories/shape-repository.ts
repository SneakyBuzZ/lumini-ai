import { db, DbExecutor } from "@/lib/config/db-config";
import { shapesTable, snapshotsTable } from "@/_lab/models/shape-table";
import {
  ShapeDTO,
  ShapeType,
  UpdateBatchDTO,
  UpdateShapeDTO,
} from "@/_lab/dto";
import { and, eq, sql } from "drizzle-orm";
import { AppError } from "@/utils/error";

export class ShapeRepository {
  public shapeDefaults = shapeDefaults;
  private snapshotRepository: SnapshotRepository;

  constructor() {
    this.snapshotRepository = new SnapshotRepository();
  }

  //* --- Save a single shape ---
  async save(data: ShapeDTO, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [shape] = await queryBuilder
      .insert(shapesTable)
      .values({
        ...this.shapeDefaults,
        ...data,
        version: data.version,
        labId,
      })
      .returning();
    return shape;
  }

  //* --- Save multiple shapes ---
  async saveAll(data: ShapeDTO[], labId: string) {
    const values = data.map((d) => ({
      ...this.shapeDefaults,
      ...d,
      labId,
    }));
    await db.insert(shapesTable).values(values);
  }

  //* --- Update a single shape ---
  async update(
    shapeId: string,
    labId: string,
    patch: UpdateShapeDTO,
    tx?: DbExecutor,
  ) {
    const queryBuilder = tx || db;
    const [updated] = await queryBuilder
      .update(shapesTable)
      .set({
        ...patch,
        version: patch.version,
      })
      .where(and(eq(shapesTable.id, shapeId), eq(shapesTable.labId, labId)))
      .returning();
    return updated;
  }

  //* --- Upsert multiple shapes (only updates fields provided in DTO) ---
  // --- Batch upsert/update shapes ---
  async batchUpdate(data: UpdateBatchDTO) {
    const { labId, operations } = data;

    const applied: { shapeId: string; commitVersion: number }[] = [];
    const rejected: { shapeId: string; reason: string }[] = [];

    return await db.transaction(async (tx) => {
      for (const op of operations) {
        const existingShape = await this.findById(op.shapeId, labId, tx);
        if (existingShape && existingShape.version >= op.commitVersion) {
          rejected.push({
            shapeId: op.shapeId,
            reason: "stale_commit",
          });
          continue;
        }

        if (op.op === "create") {
          const created = await this.save(
            { ...op.payload, version: op.commitVersion },
            labId,
            tx,
          );
          await this.snapshotRepository.saveToSnapshot(created, labId, tx);
        }

        if (op.op === "update") {
          const updated = await this.update(op.shapeId, labId, op.payload, tx);
          if (!updated) {
            rejected.push({
              shapeId: op.shapeId,
              reason: "not_found",
            });
            continue;
          }
          if (updated.isDeleted) continue;
          await this.snapshotRepository.saveToSnapshot(updated, labId, tx);
        }

        if (op.op === "delete") {
          await this.softDelete(op.shapeId, labId, op.commitVersion, tx);
          await this.snapshotRepository.removeFromSnapshot(
            op.shapeId,
            labId,
            tx,
          );
        }

        applied.push({
          shapeId: op.shapeId,
          commitVersion: op.commitVersion,
        });
      }

      return { applied, rejected };
    });
  }

  //* --- Find shape by id ---
  async findById(shapeId: string, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [shape] = await queryBuilder
      .select()
      .from(shapesTable)
      .where(and(eq(shapesTable.id, shapeId), eq(shapesTable.labId, labId)))
      .limit(1);
    return shape;
  }

  //* --- Find all shapes by labId ---
  async findAll(labId: string) {
    return await db.query.shapesTable.findMany({
      where: (shapes, { eq }) => eq(shapes.labId, labId),
      columns: {
        createdAt: false,
        updatedAt: false,
        version: false,
        labId: false,
      },
    });
  }

  //* --- Soft delete a shape ---
  async softDelete(
    shapeId: string,
    labId: string,
    version: number,
    tx?: DbExecutor,
  ) {
    const queryBuilder = tx || db;
    const [deleted] = await queryBuilder
      .update(shapesTable)
      .set({
        isDeleted: true,
        version: version,
      })
      .where(and(eq(shapesTable.id, shapeId), eq(shapesTable.labId, labId)))
      .returning();

    return deleted;
  }

  //* --- Delete a shape ---

  async delete(shapeId: string, labId: string) {
    return await db.transaction(async (tx) => {
      const shape = await this.findById(shapeId, labId, tx);
      if (!shape || shape.isDeleted) throw new AppError(404, "Shape not found");

      if (shape.isLocked)
        throw new AppError(403, "Shape is locked and cannot be deleted");

      const deletedShape = await this.softDelete(
        shapeId,
        labId,
        shape.version,
        tx,
      );
      await this.snapshotRepository.removeFromSnapshot(shapeId, labId, tx);

      return deletedShape;
    });
  }
}

export class SnapshotRepository {
  //* --- Save or update a shape in snapshot ---
  async saveToSnapshot(shape: ShapeType, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const snapshot = await this.findByLabId(labId, queryBuilder);

    if (!snapshot) {
      await queryBuilder.insert(snapshotsTable).values({
        labId,
        data: {
          shapes: {
            [shape.id]: shape,
          },
        },
      });
      return;
    }

    const existing = snapshot.data.shapes?.[shape.id];
    if (existing && existing.version > shape.version) return;

    await queryBuilder
      .update(snapshotsTable)
      .set({
        data: {
          ...snapshot.data,
          shapes: {
            ...snapshot.data.shapes,
            [shape.id]: shape,
          },
        },
        updatedAt: new Date(),
      })
      .where(eq(snapshotsTable.labId, labId));
  }

  //* --- Remove a shape from snapshot ---
  async removeFromSnapshot(shapeId: string, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [snapshot] = await queryBuilder
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.labId, labId))
      .limit(1);

    if (!snapshot) return;

    const { [shapeId]: _, ...remainingShapes } = snapshot.data.shapes ?? {};

    await queryBuilder
      .update(snapshotsTable)
      .set({
        data: {
          ...snapshot.data,
          shapes: remainingShapes,
        },
        updatedAt: new Date(),
      })
      .where(eq(snapshotsTable.labId, labId));
  }

  //* --- Find snapshot by labId ---
  async findByLabId(labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [snapshot] = await queryBuilder
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.labId, labId))
      .limit(1);
    return snapshot;
  }

  //* --- Rebuild snapshot from existing shapes ---
  async rebuildFromShapes(labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const shapes = await queryBuilder
      .select()
      .from(shapesTable)
      .where(
        and(eq(shapesTable.labId, labId), eq(shapesTable.isDeleted, false)),
      );

    const snapShotData = {
      shapes: Object.fromEntries(shapes.map((shape) => [shape.id, shape])),
    };

    const [snapshot] = await queryBuilder
      .insert(snapshotsTable)
      .values({
        labId,
        data: snapShotData,
        version: 1,
      })
      .returning();

    return snapshot;
  }
}

const shapeDefaults = {
  //* --- Base Geometry ---
  type: "rectangle", // must have default!
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,

  //* --- Style ---
  strokeType: "solid",
  strokeColor: "#d6d6d6",
  fillColor: "#ffffff00",
  strokeWidth: 0.5,
  opacity: 1,

  //* --- Text Specific ---
  text: "",
  textColor: "#ebebeb",
  fontSize: 16,
  fontFamily: "sans-serif",
  fontWeight: "normal",
  textAlign: "center",

  //* --- Layering ---
  zIndex: 0,

  //* --- Flags ---
  isLocked: false,
  isHidden: false,
  isDeleted: false,

  //* --- Sync Metadata ---
  version: 1,
};
