import { db } from "@/lib/config/db-config";
import { shapesTable } from "@/_lab/models/shape-table";
import { ShapeDTO } from "@/_lab/dto";
import { sql } from "drizzle-orm";

export class ShapeRepository {
  public shapeDefaults = shapeDefaults;

  //* --- Save a single shape ---
  async save(data: ShapeDTO, labId: string) {
    await db.insert(shapesTable).values({
      ...this.shapeDefaults,
      ...data,
      labId,
    });
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

  //* --- Upsert multiple shapes (only updates fields provided in DTO) ---
  // --- Batch upsert/update shapes ---
  async batchUpdate(shapes: ShapeDTO[], labId: string) {
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

  //* --- Find all shapes by labId ---
  async findAll(labId: string) {
    return await db.query.shapesTable.findMany({
      where: (shapes, { eq }) => eq(shapes.labId, labId),
      columns: {
        createdAt: false,
        updatedAt: false,
        version: false,
        crdtData: false,
        labId: false,
      },
    });
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

  //* --- Flags ---
  isLocked: false,
  isHidden: false,
};
