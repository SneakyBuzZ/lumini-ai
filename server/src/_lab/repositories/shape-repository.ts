import { db, DbExecutor } from "@/lib/config/db-config";
import { shapesTable, snapshotsTable } from "@/_lab/models/shape-table";
import { ShapeDTO, ShapeType, UpdateShapeDTO } from "@/_lab/dto";
import { and, eq, sql } from "drizzle-orm";

export class ShapeRepository {
  public shapeDefaults = shapeDefaults;

  //! --- SHAPE METHODS ---

  //* --- Save a single shape ---
  async save(data: ShapeDTO, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [shape] = await queryBuilder
      .insert(shapesTable)
      .values({
        ...this.shapeDefaults,
        ...data,
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
    tx?: DbExecutor
  ) {
    const queryBuilder = tx || db;
    const [updated] = await queryBuilder
      .update(shapesTable)
      .set({
        ...patch,
        version: sql`${shapesTable.version} + 1`,
        updatedAt: new Date(),
      })
      .where(and(eq(shapesTable.id, shapeId), eq(shapesTable.labId, labId)))
      .returning();
    return updated;
  }

  //* --- Upsert multiple shapes (only updates fields provided in DTO) ---
  // --- Batch upsert/update shapes ---
  async batchUpdate(shapes: UpdateShapeDTO[], labId: string) {
    const values = shapes.map((s) => ({
      ...this.shapeDefaults,
      ...s,
      labId,
    }));

    await db
      .insert(shapesTable)
      .values(values)
      .onConflictDoUpdate({
        target: shapesTable.id,
        set: {
          type: sql`EXCLUDED.type`,
          x: sql`EXCLUDED.x`,
          y: sql`EXCLUDED.y`,
          width: sql`EXCLUDED.width`,
          height: sql`EXCLUDED.height`,
          strokeWidth: sql`EXCLUDED.strokeWidth`,
          strokeType: sql`EXCLUDED.strokeType`,
          strokeColor: sql`EXCLUDED.strokeColor`,
          fillColor: sql`EXCLUDED.fillColor`,
          opacity: sql`EXCLUDED.opacity`,
          rotation: sql`EXCLUDED.rotation`,
          isLocked: sql`EXCLUDED.isLocked`,
          isHidden: sql`EXCLUDED.isHidden`,
          text: sql`EXCLUDED.text`,
          updatedAt: new Date(),
        },
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

  //! --- SNAPSHOT METHODS ---

  async saveToSnapshot(shape: ShapeType, labId: string, tx?: DbExecutor) {
    const queryBuilder = tx || db;
    const [snapshot] = await queryBuilder
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.labId, labId))
      .limit(1);

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
