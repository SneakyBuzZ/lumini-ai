import z from "zod";

export const SaveWorkspaceDTO = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
});

export type SaveWorkspaceDTOType = z.infer<typeof SaveWorkspaceDTO>;
