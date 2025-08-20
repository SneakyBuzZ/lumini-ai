import z from "zod";

export const createLabDTO = z.object({
  workspaceId: z.string().cuid(),
  plan: z.enum(["free", "pro", "enterprise"]),
  name: z.string().min(2).max(100),
  githubUrl: z.string().url(),
});

export type CreateLabDTO = z.infer<typeof createLabDTO>;
