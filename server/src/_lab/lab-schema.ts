import { z } from "zod";

export const createLabSchema = z.object({
  name: z.string().min(1).max(255),
  githubUrl: z.string().url(),
  workspaceId: z.string().uuid(),
});
