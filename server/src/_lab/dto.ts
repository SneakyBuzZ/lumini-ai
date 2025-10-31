import z from "zod";

export const createLabDTO = z.object({
  workspaceId: z.string().cuid(),
  plan: z.enum(["free", "pro", "enterprise"]),
  name: z.string().min(2).max(100),
  githubUrl: z.string().url(),
});

export const shapeDTO = z.object({
  type: z.string().min(2).max(32),
  x: z.number().min(0),
  y: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  strokeWidth: z.number().min(0).default(0.5),
  strokeType: z.string().min(2).max(16).default("solid"),
  strokeColor: z.string().min(2).max(32).default("#d6d6d6"),
  fillColor: z.string().min(2).max(32).default("#transparent"),
  opacity: z.number().min(0).max(1).default(1),
  rotation: z.number().default(0),
  isLocked: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  isHovered: z.boolean().default(false),
  text: z.string().min(2).max(256).optional(),
});

export type CreateLabDTO = z.infer<typeof createLabDTO>;
export type ShapeDTO = z.infer<typeof shapeDTO>;
