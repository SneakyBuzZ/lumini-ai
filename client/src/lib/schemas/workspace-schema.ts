import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
});
