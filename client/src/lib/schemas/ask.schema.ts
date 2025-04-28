import { z } from "zod";

export const askSchema = z.object({
  question: z.string().min(2),
});
