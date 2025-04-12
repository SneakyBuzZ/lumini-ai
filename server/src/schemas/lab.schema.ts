import { z } from "zod";

export const createLabSchema = z.object({
  name: z.string().min(1).max(255),
  githubUrl: z.string().url(),
  userId: z.string().uuid(),
  workspaceId: z.string().uuid(),
});
