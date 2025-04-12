import * as z from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  oauthId: z.string(),
  provider: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
});
