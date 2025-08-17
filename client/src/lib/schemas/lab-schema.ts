import { z } from "zod";

export const labSchema = z.object({
  name: z.string().min(2).max(100, {
    message: "Name must be between 2 and 100 characters",
  }),
  githubUrl: z.string().url({
    message: "Invalid GitHub URL",
  }),
  workspaceId: z.string().uuid({
    message: "Invalid workspace ID",
  }),
});
