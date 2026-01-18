import z from "zod";

export const createLabDTO = z.object({
  workspaceId: z.string().cuid(),
  plan: z.enum(["free", "pro", "enterprise"]),
  name: z.string().min(2).max(100),
  githubUrl: z.string().url(),
});

export const shapeDTO = z.object({
  // -- Geometry --
  type: z.string().min(2).max(32),
  x: z.number(),
  y: z.number(),
  width: z.number().min(0),
  height: z.number().min(0),
  rotation: z.number().default(0),

  // -- Style --
  strokeType: z.string().min(2).max(16).default("solid"),
  strokeColor: z.string().min(2).max(32).default("#d6d6d6"),
  fillColor: z.string().min(2).max(32).default("#ffffff00"),
  strokeWidth: z.number().min(0).default(0.5),
  opacity: z.number().min(0).max(1).default(1),

  // -- Text --
  text: z.string().min(0).max(256).optional(),
  textColor: z.string().min(2).max(32).default("#ebebeb"),
  fontSize: z.number().min(1).max(256).default(16),
  fontFamily: z.string().min(2).max(64).default("sans-serif"),
  fontWeight: z.string().min(2).max(32).default("normal"),
  textAlign: z.string().min(2).max(16).default("center"),

  // -- Layering --
  zIndex: z.number().default(0),

  // -- Flags --
  isLocked: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  isDeleted: z.boolean().default(false),

  // -- Sync Metadata --
  version: z.number().default(1),
});

export const shapeType = shapeDTO.extend({
  id: z.string().cuid(),
});

export const snapshotDTO = z.object({
  labId: z.string().cuid(),
  data: z.object({
    shapes: z.record(shapeType),
  }),
  version: z.number().default(1),
});

const shapeOperationDTO = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("create"),
    shapeId: z.string(),
    commitVersion: z.number().int().min(1),
    payload: shapeDTO,
  }),
  z.object({
    op: z.literal("update"),
    shapeId: z.string(),
    commitVersion: z.number().int().min(1),
    payload: shapeDTO,
  }),
  z.object({
    op: z.literal("delete"),
    shapeId: z.string(),
    commitVersion: z.number().int().min(1),
    payload: z.null(),
  }),
]);

export const updateBatchDTo = z.object({
  labId: z.string().cuid(),
  operations: z.array(shapeOperationDTO).min(1),
});

export type CreateLabDTO = z.infer<typeof createLabDTO>;
export type ShapeDTO = z.infer<typeof shapeDTO>;
export type ShapeType = z.infer<typeof shapeType>;
export type UpdateShapeDTO = Partial<ShapeDTO>;
export type SnapshotDTO = z.infer<typeof snapshotDTO>;
export type UpdateBatchDTO = z.infer<typeof updateBatchDTo>;
