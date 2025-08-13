import { z } from "zod";

export const labSchema = z.object({
  name: z.string().min(2).max(100),
  githubUrl: z.string().url(),
  workspaceId: z.string().uuid(),
});
