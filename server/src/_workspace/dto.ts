import z from "zod";

export const SaveWorkspaceDTO = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
  ownerId: z.string().min(2).max(255),
});

export type SaveWorkspaceDTOType = z.infer<typeof SaveWorkspaceDTO>;
